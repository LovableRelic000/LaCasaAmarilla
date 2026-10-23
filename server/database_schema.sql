-- =========================================================================
-- ESQUEMA COMPLETO DE BASE DE DATOS - LA CASA AMARILLA
-- Base de datos: lacasaamarilla
-- =========================================================================

CREATE DATABASE IF NOT EXISTS `lacasaamarilla` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `lacasaamarilla`;

-- -------------------------------------------------------------------------
-- 1. TABLA: usuarios (Administradores del panel)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------
-- 2. TABLA: productos (Catálogo oficial de panes y repostería)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `productos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `description` TEXT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `image` VARCHAR(255) NOT NULL DEFAULT '/img/products/default.jpg',
  `category` VARCHAR(50) NOT NULL,
  `subcategory` VARCHAR(50) DEFAULT NULL,
  `type` VARCHAR(50) DEFAULT NULL,
  `status` ENUM('active', 'discontinued') NOT NULL DEFAULT 'active',
  `attributes` JSON DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_category` (`category`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------
-- 3. TABLA: pedidos (Solicitudes de órdenes generadas por los clientes)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `pedidos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `items` JSON NOT NULL,
  `total` DECIMAL(10,2) NOT NULL,
  `status` ENUM('pendiente', 'confirmado', 'no_llego') NOT NULL DEFAULT 'pendiente',
  `notas` TEXT DEFAULT NULL,
  `archived` BOOLEAN NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_status` (`status`),
  INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------
-- 4. TABLA: hero_slides (Banners del carrusel principal en HomePage)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hero_slides` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `image` VARCHAR(255) NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `subtitle` VARCHAR(255) DEFAULT '',
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------
-- 5. TABLA: categorias (Categorías dinámicas configurables)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `categorias` (
  `id` VARCHAR(50) PRIMARY KEY,
  `label` VARCHAR(100) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `icon` VARCHAR(50) DEFAULT 'cookie',
  `is_seasonal` BOOLEAN NOT NULL DEFAULT 0,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- DATOS INICIALES (SEMILLA) PARA PRODUCCIÓN / VPS
-- =========================================================================

-- Categorías oficiales
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
ON DUPLICATE KEY UPDATE `label`=VALUES(`label`);

-- Banner inicial de bienvenida
INSERT INTO `hero_slides` (`image`, `title`, `subtitle`, `sort_order`) VALUES
('/img/hero/banner-principal.jpg', 'Tradición, Mantequilla y Pasión en Cada Horneado', 'Descubre nuestras conchas artesanales, panqués caseros y pan rústico.', 1)
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);
