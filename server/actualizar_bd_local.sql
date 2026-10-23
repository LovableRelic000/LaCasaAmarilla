-- =========================================================================
-- SCRIPT DE ACTUALIZACIÓN SQL - LA CASA AMARILLA
-- Base de datos: lacasaamarilla (phpMyAdmin / MySQL)
-- =========================================================================

USE `lacasaamarilla`;

-- 1. AGREGAR COLUMNA 'attributes' A LA TABLA 'productos'
-- (Guarda opciones como sabores, tamaños, unidad mínima, peso, etc.)
-- Si usas MySQL 8.0+ o MariaDB 10.2+:
SET @dbname = DATABASE();
SET @tablename = "productos";
SET @columnname = "attributes";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname)
  ) > 0,
  "SELECT 1",
  "ALTER TABLE `productos` ADD COLUMN `attributes` JSON NULL AFTER `status`;"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- 2. CREAR TABLA PARA CATEGORÍAS DINÁMICAS
CREATE TABLE IF NOT EXISTS `categorias` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `label` VARCHAR(100) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `icon` VARCHAR(50) DEFAULT 'cookie',
  `is_seasonal` TINYINT(1) NOT NULL DEFAULT 0,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. INSERTAR / ACTUALIZAR CATEGORÍAS OFICIALES
INSERT INTO `categorias` (`id`, `label`, `description`, `icon`, `is_seasonal`, `sort_order`) VALUES
('conchas', 'Conchas Tradicionales', 'Nuestras emblemáticas conchas artesanales. Venta por media docena y docena con selector mixto.', 'cookie', 0, 1),
('panques', 'Panqués', 'Esponjosos y aromáticos panqués artesanales horneados diariamente.', 'cake', 0, 2),
('roscas', 'Roscas', 'Roscas y postres horneados tradicionales con recetas de la casa.', 'circle-dot', 0, 3),
('conchas-especialidad', 'Conchas de Especialidad', 'Conchas rellenas y cubiertas gourmet con ingredientes premium. Venta individual.', 'sparkles', 0, 4),
('pan-barra', 'Pan de Barra', 'Panes de molde rústicos, masa madre y harinas integrales de fermentación lenta.', 'bread', 0, 5),
('pan-hamburguesa', 'Pan de Hamburguesa', 'Brioche suave y resistente para hamburguesas gourmet. Venta por docena.', 'sandwich', 0, 6),
('pan-banquetes', 'Pan de Banquetes', 'Panecillos miniatura para eventos, reuniones y banquetes. Venta por docena.', 'utensils', 0, 7),
('pan-danes', 'Pan Danés', 'Hojaldres finos laminados con mantequilla pura y rellenos exquisitos.', 'croissant', 0, 8),
('temporada', 'Menú de Temporada', 'Ediciones limitadas y recetas festivas según la época del año.', 'calendar', 1, 9)
ON DUPLICATE KEY UPDATE 
  `label`=VALUES(`label`),
  `description`=VALUES(`description`),
  `icon`=VALUES(`icon`),
  `is_seasonal`=VALUES(`is_seasonal`),
  `sort_order`=VALUES(`sort_order`);

-- 4. INSERTAR CATÁLOGO OFICIAL DE PRODUCTOS
-- (Incluye todas las variedades reales y opciones con toggles)

-- Limpiamos productos anteriores de prueba si deseas empezar desde cero (opcional):
-- DELETE FROM `productos`;

INSERT INTO `productos` (`id`, `name`, `description`, `price`, `image`, `category`, `subcategory`, `type`, `status`, `attributes`) VALUES

-- PANQUÉS
(101, 'Panqué Artesanal', 'Panqué esponjoso horneado con mantequilla de primera. Selecciona tu sabor preferido.', 95.00, '/img/products/panque-artesanal.jpg', 'panques', NULL, NULL, 'active', 
 JSON_OBJECT(
   'hasFlavors', true,
   'flavors', JSON_ARRAY('Nuez', 'Pasas', 'Plátano', 'Marmoleado', 'Limón'),
   'defaultFlavor', 'Nuez',
   'hasWeight', true,
   'weight', '450g aprox.',
   'hasAllergens', true,
   'allergens', JSON_ARRAY('Gluten', 'Lácteos', 'Huevo')
 )),

-- ROSCAS
(201, 'Volteado de Piña', 'Receta casera clásica caramelizada con rebanadas de piña miel y cerezas marrasquino.', 180.00, '/img/products/volteado-pina.jpg', 'roscas', NULL, NULL, 'active', 
 JSON_OBJECT(
   'hasSizes', true,
   'sizes', JSON_ARRAY(
     JSON_OBJECT('label', 'Chica (4-6 porciones)', 'priceAdjustment', 0),
     JSON_OBJECT('label', 'Grande (10-12 porciones)', 'priceAdjustment', 120)
   ),
   'hasWeight', true,
   'weight', '800g aprox.',
   'hasAllergens', true,
   'allergens', JSON_ARRAY('Gluten', 'Lácteos', 'Huevo')
 )),

(202, 'Rosca Judía', 'Tradicional rosca suave y aromática con toque de canela, pasas y nuez seleccionada.', 210.00, '/img/products/rosca-judia.jpg', 'roscas', NULL, NULL, 'active', 
 JSON_OBJECT(
   'hasWeight', true,
   'weight', '900g aprox.',
   'hasAllergens', true,
   'allergens', JSON_ARRAY('Gluten', 'Lácteos', 'Huevo', 'Nuez')
 )),

(203, 'Chocoflán', 'La combinación perfecta: flán napolitano suave sobre un bizcocho húmedo de chocolate oscuro.', 220.00, '/img/products/chocoflan.jpg', 'roscas', NULL, NULL, 'active', 
 JSON_OBJECT(
   'hasWeight', true,
   'weight', '1.1 kg aprox.',
   'hasAllergens', true,
   'allergens', JSON_ARRAY('Gluten', 'Lácteos', 'Huevo')
 )),

-- CONCHAS TRADICIONALES (CAJA CON SELECTOR VISUAL)
(301, 'Caja de Conchas Tradicionales', 'Nuestras conchas más queridas. Arma tu caja personalizada de media docena o docena eligiendo cuántas deseas de cada sabor.', 110.00, '/img/products/caja-conchas.jpg', 'conchas', NULL, NULL, 'active', 
 JSON_OBJECT(
   'isConchaBox', true,
   'boxSizes', JSON_ARRAY(
     JSON_OBJECT('size', 6, 'label', 'Media Docena (6 conchas)', 'price', 110),
     JSON_OBJECT('size', 12, 'label', 'Docena Completa (12 conchas)', 'price', 210)
   ),
   'hasAllergens', true,
   'allergens', JSON_ARRAY('Gluten', 'Lácteos', 'Huevo')
 )),

-- CONCHAS DE ESPECIALIDAD (VENTA INDIVIDUAL)
(401, 'Concha Gourmet Nutella', 'Concha esponjosa rellena de generosa crema de Nutella y cubierta crocante de cacao.', 42.00, '/img/products/concha-nutella.jpg', 'conchas-especialidad', NULL, NULL, 'active', 
 JSON_OBJECT('hasAllergens', true, 'allergens', JSON_ARRAY('Gluten', 'Lácteos', 'Avellana'))),

(402, 'Concha Gourmet Lotus Biscoff', 'Concha rellena de auténtica crema de galleta Lotus Biscoff con topping de galleta crujiente.', 45.00, '/img/products/concha-lotus.jpg', 'conchas-especialidad', NULL, NULL, 'active', 
 JSON_OBJECT('hasAllergens', true, 'allergens', JSON_ARRAY('Gluten', 'Lácteos', 'Soya'))),

(403, 'Concha Gourmet Almendra & Crema', 'Concha de especialidad rellena de crema pastelera artesanal y almendras fileteadas tostadas.', 45.00, '/img/products/concha-almendra.jpg', 'conchas-especialidad', NULL, NULL, 'active', 
 JSON_OBJECT('hasAllergens', true, 'allergens', JSON_ARRAY('Gluten', 'Lácteos', 'Almendras'))),

-- PAN DE BARRA
(501, 'Pan de Barra Blanco Artesanal', 'Pan de molde clásico con miga suave y elástica, corteza tierna y sin conservadores artificiales.', 75.00, '/img/products/pan-barra-blanco.jpg', 'pan-barra', NULL, NULL, 'active', 
 JSON_OBJECT('hasWeight', true, 'weight', '600g aprox.', 'hasAllergens', true, 'allergens', JSON_ARRAY('Gluten'))),

(502, 'Pan de Masa Madre (Sourdough)', 'Elaborado con fermentación lenta natural de 24 horas. Corteza crujiente y miga aireada con sutil acidez.', 95.00, '/img/products/pan-masa-madre.jpg', 'pan-barra', NULL, NULL, 'active', 
 JSON_OBJECT('hasWeight', true, 'weight', '750g aprox.', 'hasAllergens', true, 'allergens', JSON_ARRAY('Gluten'), 'requiresAdvanceNotice', true, 'advanceNoticeHours', 24)),

(503, 'Pan de Barra Integral & Semillas', 'Elaborado con harina 100% integral, semillas de girasol, linaza y chía tostadas.', 85.00, '/img/products/pan-barra-integral.jpg', 'pan-barra', NULL, NULL, 'active', 
 JSON_OBJECT('hasWeight', true, 'weight', '650g aprox.', 'hasAllergens', true, 'allergens', JSON_ARRAY('Gluten', 'Semillas'))),

-- PAN DE HAMBURGUESA (INCREMENTOS DE DOCENA)
(601, 'Bollos Brioche para Hamburguesa (Docena)', 'Bollos dorados tipo brioche con ajonjolí tostado. Tienen la esponjosidad y resistencia ideal para carnes jugosas.', 150.00, '/img/products/pan-hamburguesa.jpg', 'pan-hamburguesa', NULL, NULL, 'active', 
 JSON_OBJECT('hasMinOrder', true, 'minOrder', 12, 'orderStep', 12, 'saleUnitLabel', 'docenas (12 pzas)', 'hasWeight', true, 'weight', '90g por bollo', 'hasAllergens', true, 'allergens', JSON_ARRAY('Gluten', 'Lácteos', 'Huevo', 'Ajonjolí'))),

-- PAN DE BANQUETES (INCREMENTOS DE DOCENA)
(701, 'Panecillos Gourmet para Banquetes (Docena)', 'Panecillos surtidos miniatura (cuernitos, medianoches y panecillos brioche) perfectos para tablas de quesos, eventos y cócteles.', 130.00, '/img/products/pan-banquetes.jpg', 'pan-banquetes', NULL, NULL, 'active', 
 JSON_OBJECT('hasMinOrder', true, 'minOrder', 12, 'orderStep', 12, 'saleUnitLabel', 'docenas (12 pzas)', 'hasAllergens', true, 'allergens', JSON_ARRAY('Gluten', 'Lácteos', 'Huevo'), 'requiresAdvanceNotice', true, 'advanceNoticeHours', 24)),

-- PAN DANÉS
(801, 'Croissant Tradicional de Mantequilla', 'Hojaldre francés clásico con capas doradas y crocantes y miga alveolar aromatizada con mantequilla de vaca.', 36.00, '/img/products/croissant.jpg', 'pan-danes', NULL, NULL, 'active', 
 JSON_OBJECT('hasAllergens', true, 'allergens', JSON_ARRAY('Gluten', 'Lácteos'))),

(802, 'Chocolatín (Pain au Chocolat)', 'Masa danesa laminada rellena con dos barras de chocolate belga semiamargo.', 40.00, '/img/products/chocolatin.jpg', 'pan-danes', NULL, NULL, 'active', 
 JSON_OBJECT('hasAllergens', true, 'allergens', JSON_ARRAY('Gluten', 'Lácteos', 'Soya'))),

(803, 'Trenza de Nuez y Miel de Maple', 'Hojaldre danés trenzado a mano con nuez pecana caramelizada y glaseado ligero de maple.', 42.00, '/img/products/trenza-nuez.jpg', 'pan-danes', NULL, NULL, 'active', 
 JSON_OBJECT('hasAllergens', true, 'allergens', JSON_ARRAY('Gluten', 'Lácteos', 'Nuez'))),

(804, 'Molinete de Frutos Rojos', 'Hojaldre danés en forma de molinete con corazón de queso crema y compota artesanal de frutos del bosque.', 38.00, '/img/products/molinete-frutos.jpg', 'pan-danes', NULL, NULL, 'active', 
 JSON_OBJECT('hasAllergens', true, 'allergens', JSON_ARRAY('Gluten', 'Lácteos'))),

-- MENÚ DE TEMPORADA: PAN DE MUERTO Y ROSCA DE REYES
(901, 'Pan de Muerto Tradicional', 'Elaborado con masa brioche perfumada con agua de azahar, ralladura de naranja fresca y mantequilla pura. Elige tu cubierta clásica.', 35.00, '/img/products/pan-muerto-tradicional.jpg', 'temporada', NULL, NULL, 'active', 
 JSON_OBJECT(
   'isSeasonal', true,
   'seasonalSeason', 'Otoño / Día de Muertos',
   'hasFlavors', true,
   'flavors', JSON_ARRAY('Azúcar Tradicional', 'Ajonjolí Tostado'),
   'defaultFlavor', 'Azúcar Tradicional',
   'hasAllergens', true,
   'allergens', JSON_ARRAY('Gluten', 'Lácteos', 'Huevo')
 )),

(902, 'Pan de Muerto Relleno Gourmet', 'Nuestra suave receta artesanal abierta y rellena generosamente con ingredientes y cremas premium. Selecciona tu relleno favorito.', 58.00, '/img/products/pan-muerto-relleno.jpg', 'temporada', NULL, NULL, 'active', 
 JSON_OBJECT(
   'isSeasonal', true,
   'seasonalSeason', 'Otoño / Día de Muertos',
   'hasFlavors', true,
   'flavors', JSON_ARRAY('Fresas con Crema', 'Blueberry con Crema', 'Lotus Biscoff', 'Nutella', 'Café de Olla'),
   'defaultFlavor', 'Fresas con Crema',
   'hasAllergens', true,
   'allergens', JSON_ARRAY('Gluten', 'Lácteos', 'Huevo'),
   'requiresAdvanceNotice', true,
   'advanceNoticeHours', 12
 )),

(903, 'Pan de Muerto de Café de Olla', 'Edición especial aromatizada con canela, piloncillo y reducción de café de olla artesanal.', 58.00, '/img/products/pan-muerto-cafe.jpg', 'temporada', NULL, NULL, 'active', 
 JSON_OBJECT(
   'isSeasonal', true,
   'seasonalSeason', 'Otoño / Día de Muertos',
   'hasAllergens', true,
   'allergens', JSON_ARRAY('Gluten', 'Lácteos', 'Huevo')
 )),

(904, 'Rosca de Reyes Artesanal', 'Masa brioche perfumada con azahar, decorada con costra azucarada de concha, higos y ate de guayaba.', 280.00, '/img/products/rosca-reyes.jpg', 'temporada', NULL, NULL, 'active', 
 JSON_OBJECT(
   'isSeasonal', true,
   'seasonalSeason', 'Enero / Reyes Magos',
   'hasSizes', true,
   'sizes', JSON_ARRAY(
     JSON_OBJECT('label', 'Mediana (6-8 personas)', 'priceAdjustment', 0),
     JSON_OBJECT('label', 'Grande (12-16 personas)', 'priceAdjustment', 160)
   ),
   'hasAllergens', true,
   'allergens', JSON_ARRAY('Gluten', 'Lácteos', 'Huevo'),
   'requiresAdvanceNotice', true,
   'advanceNoticeHours', 24
 ))

ON DUPLICATE KEY UPDATE 
  `name`=VALUES(`name`),
  `description`=VALUES(`description`),
  `price`=VALUES(`price`),
  `category`=VALUES(`category`),
  `status`=VALUES(`status`),
  `attributes`=VALUES(`attributes`);
