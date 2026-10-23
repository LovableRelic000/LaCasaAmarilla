// server/index.js
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Demasiados intentos fallidos. Intenta de nuevo en unos minutos.' },
});

app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // sin esto, Helmet puede bloquear que se carguen tus imágenes subidas
}));
const allowedOrigins = [
    'https://lacasaamarilla.lat',
    'https://www.lacasaamarilla.lat',
    'http://localhost:5173',
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
}));
app.use(express.json({ limit: '100kb' }));
app.use('/api/auth/login', loginLimiter); // Aplica el límite de inicio de sesión

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Auto-verificación de esquema para soportar atributos adicionales y categorías dinámicas
(async () => {
    try {
        await db.query('ALTER TABLE productos ADD COLUMN attributes JSON NULL');
    } catch {}
    try {
        await db.query(`CREATE TABLE IF NOT EXISTS categorias (
            id VARCHAR(50) PRIMARY KEY,
            label VARCHAR(100) NOT NULL,
            description TEXT DEFAULT NULL,
            icon VARCHAR(50) DEFAULT 'cookie',
            is_seasonal BOOLEAN NOT NULL DEFAULT 0,
            sort_order INT NOT NULL DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
    } catch {}
})();

const verificarToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ error: 'Acceso denegado. Token no proporcionado.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Token inválido o expirado.' });
        req.userId = decoded.id;
        next();
    });
};

// ==================== SUBIDA DE IMÁGENES ====================
const UPLOADS_DIR = path.join(__dirname, 'uploads', 'products');
fs.mkdirSync(UPLOADS_DIR, { recursive: true }); // se autocrea si no existe (útil en un deploy nuevo)

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${crypto.randomUUID()}${ext}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(ext) || !file.mimetype.startsWith('image/')) {
            return cb(new Error('Solo se permiten imágenes (jpg, png, webp).'));
        }
        cb(null, true);
    },
});

// Sirve los archivos subidos como archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/api/upload', verificarToken, (req, res) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message || 'Error al subir la imagen.' });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'No se recibió ningún archivo.' });
        }
        res.json({ path: `/uploads/products/${req.file.filename}` });
    });
});

// ==================== RUTA DE LOGIN (ADMINISTRADOR) ====================
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE username = ?', [username]);
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
        }

        const usuario = rows[0];
        const passwordCorrecta = await bcrypt.compare(password, usuario.password);
        if (!passwordCorrecta) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
        }

        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// ==================== RUTAS PÚBLICAS (PRODUCTOS) ====================
app.get('/api/products', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM productos ORDER BY id DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los productos.' });
    }
});

// ==================== RUTAS PROTEGIDAS (PANEL ADMIN) ====================
app.post('/api/products', verificarToken, async (req, res) => {
    const { name, description, price, image, category, subcategory, type, attributes } = req.body;

    if (Number(price) < 0) {
        return res.status(400).json({ error: 'El precio del producto no puede ser negativo.' });
    }

    try {
        const attributesJson = attributes ? JSON.stringify(attributes) : null;
        let result;
        try {
            [result] = await db.query(
                'INSERT INTO productos (name, description, price, image, category, subcategory, type, status, attributes) VALUES (?, ?, ?, ?, ?, ?, ?, "active", ?)',
                [name, description, price, image || '/img/products/default.jpg', category, subcategory || null, type || null, attributesJson]
            );
        } catch {
            // Fallback si la columna attributes aún no existe en una base de datos antigua
            [result] = await db.query(
                'INSERT INTO productos (name, description, price, image, category, subcategory, type, status) VALUES (?, ?, ?, ?, ?, ?, ?, "active")',
                [name, description, price, image || '/img/products/default.jpg', category, subcategory || null, type || null]
            );
        }
        res.status(201).json({ id: result.insertId, message: 'Producto creado exitosamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al guardar el producto.' });
    }
});

app.put('/api/products/:id', verificarToken, async (req, res) => {
    const { id } = req.params;
    const { name, description, price, image, category, subcategory, type, status, attributes } = req.body;

    if (Number(price) < 0) {
        return res.status(400).json({ error: 'El precio del producto no puede ser negativo.' });
    }

    try {
        const attributesJson = attributes ? JSON.stringify(attributes) : null;
        try {
            await db.query(
                'UPDATE productos SET name=?, description=?, price=?, image=?, category=?, subcategory=?, type=?, status=?, attributes=? WHERE id=?',
                [name, description, price, image, category, subcategory || null, type || null, status, attributesJson, id]
            );
        } catch {
            await db.query(
                'UPDATE productos SET name=?, description=?, price=?, image=?, category=?, subcategory=?, type=?, status=? WHERE id=?',
                [name, description, price, image, category, subcategory || null, type || null, status, id]
            );
        }
        res.json({ message: 'Producto actualizado exitosamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el producto.' });
    }
});

// ==================== CATEGORÍAS (DINÁMICAS) ====================
app.get('/api/categories', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM categorias ORDER BY sort_order ASC, label ASC');
        res.json(rows);
    } catch {
        res.json([]);
    }
});

app.post('/api/categories', verificarToken, async (req, res) => {
    const { id, label, description, icon, is_seasonal, sort_order } = req.body;
    if (!id || !label) {
        return res.status(400).json({ error: 'ID y nombre son obligatorios.' });
    }
    try {
        await db.query(
            'INSERT INTO categorias (id, label, description, icon, is_seasonal, sort_order) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE label=VALUES(label), description=VALUES(description), icon=VALUES(icon), is_seasonal=VALUES(is_seasonal), sort_order=VALUES(sort_order)',
            [id, label, description || '', icon || 'cookie', is_seasonal ? 1 : 0, Number(sort_order) || 0]
        );
        res.json({ message: 'Categoría guardada exitosamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al guardar la categoría.' });
    }
});

app.delete('/api/categories/:id', verificarToken, async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM categorias WHERE id = ?', [id]);
        res.json({ message: 'Categoría eliminada exitosamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la categoría.' });
    }
});

app.put('/api/pedidos/:id', verificarToken, async (req, res) => {
    const { id } = req.params;
    const { status, notas, archived } = req.body;

    const estadosValidos = ['pendiente', 'confirmado', 'no_llego'];
    if (status && !estadosValidos.includes(status)) {
        return res.status(400).json({ error: 'Estado inválido.' });
    }

    try {
        await db.query(
            'UPDATE pedidos SET status = COALESCE(?, status), notas = COALESCE(?, notas), archived = COALESCE(?, archived) WHERE id = ?',
            [status || null, notas ?? null, typeof archived === 'boolean' ? archived : null, id]
        );
        res.json({ message: 'Pedido actualizado.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el pedido.' });
    }
});

// ==================== PEDIDOS (SOLICITUDES DE ORDEN) ====================
// Público: cualquier visitante puede registrar una solicitud de pedido al enviar su carrito
app.post('/api/pedidos', async (req, res) => {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'El pedido debe incluir al menos un producto.' });
    }

    const ids = items.map((i) => Number(i.id)).filter((id) => Number.isInteger(id));
    if (ids.length !== items.length) {
        return res.status(400).json({ error: 'Pedido inválido.' });
    }

    try {
        const [rows] = await db.query(
            `SELECT id, name, price FROM productos WHERE id IN (${ids.map(() => '?').join(',')})`,
            ids
        );
        const priceMap = new Map(rows.map((r) => [r.id, r]));

        let total = 0;
        const itemsFinal = items.map((item) => {
            const producto = priceMap.get(Number(item.id));
            if (!producto) throw new Error('Uno de los productos ya no está disponible.');
            const quantity = Math.max(1, Math.min(500, parseInt(item.quantity) || 1));
            const unitPrice = typeof item.price === 'number' && item.price >= 0 ? Number(item.price) : Number(producto.price);
            total += unitPrice * quantity;
            return {
                id: producto.id,
                name: producto.name,
                price: unitPrice,
                quantity,
                options: item.options || null,
            };
        });

        const [result] = await db.query(
            'INSERT INTO pedidos (items, total, status) VALUES (?, ?, "pendiente")',
            [JSON.stringify(itemsFinal), total]
        );
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: 'No se pudo registrar el pedido. Verifica los productos e inténtalo de nuevo.' });
    }
});

// Protegido: solo el panel de administrador puede ver y gestionar los pedidos
app.get('/api/pedidos', verificarToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM pedidos ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los pedidos.' });
    }
});

// ==================== BANNER PRINCIPAL (HERO) ====================
const MAX_HERO_SLIDES = 5;
const MIN_HERO_SLIDES = 1;

app.get('/api/hero', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM hero_slides ORDER BY sort_order ASC, id ASC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los banners.' });
    }
});

app.post('/api/hero', verificarToken, async (req, res) => {
    const { image, title, subtitle, sort_order } = req.body;

    if (!image || !title) {
        return res.status(400).json({ error: 'La imagen y el título son obligatorios.' });
    }

    try {
        const [[{ count }]] = await db.query('SELECT COUNT(*) as count FROM hero_slides');
        if (count >= MAX_HERO_SLIDES) {
            return res.status(400).json({ error: `Solo se permiten hasta ${MAX_HERO_SLIDES} banners en el carrusel principal.` });
        }
        const [result] = await db.query(
            'INSERT INTO hero_slides (image, title, subtitle, sort_order) VALUES (?, ?, ?, ?)',
            [image, title, subtitle || '', Number(sort_order) || 0]
        );
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al guardar el banner.' });
    }
});

app.put('/api/hero/:id', verificarToken, async (req, res) => {
    const { id } = req.params;
    const { image, title, subtitle, sort_order } = req.body;

    if (!image || !title) {
        return res.status(400).json({ error: 'La imagen y el título son obligatorios.' });
    }

    try {
        await db.query(
            'UPDATE hero_slides SET image=?, title=?, subtitle=?, sort_order=? WHERE id=?',
            [image, title, subtitle || '', Number(sort_order) || 0, id]
        );
        res.json({ message: 'Banner actualizado.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el banner.' });
    }
});

app.delete('/api/hero/:id', verificarToken, async (req, res) => {
    const { id } = req.params;
    try {
        const [[{ count }]] = await db.query('SELECT COUNT(*) as count FROM hero_slides');
        if (count <= MIN_HERO_SLIDES) {
            return res.status(400).json({ error: `Debe quedar al menos ${MIN_HERO_SLIDES} banner en el carrusel.` });
        }
        await db.query('DELETE FROM hero_slides WHERE id = ?', [id]);
        res.json({ message: 'Banner eliminado.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el banner.' });
    }
});

const PORT = process.env.PORT || 5000;
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor.' });
});
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));