// src/data/store.js
// Estructura de datos mock que replica el futuro esquema de MySQL
// Cada producto tiene: id, name, description, price, image, category, subcategory, type, status

// -------------------------------------------------------------------------
// JERARQUÍA DE CATEGORÍAS (para navegación y breadcrumbs)
// -------------------------------------------------------------------------
// category   -> nivel 1 (conchas-gourmet, roles-canela, pasteles)
// subcategory -> nivel 2 (tradicionales, especialidad) - NO aplica a pasteles
// type        -> nivel 3 (lotus, nutella, etc.) - solo dentro de "especialidad"
//
// Para "pasteles", no hay subcategoría intermedia; los "type" cuelgan
// directamente de la categoría.

export const CATEGORIES = {
  'conchas-gourmet': {
    label: 'Conchas Gourmet',
    subcategories: {
      tradicionales: {
        label: 'Tradicionales',
        types: null, // sin subniveles, productos directos
      },
      especialidad: {
        label: 'De Especialidad',
        types: {
          lotus: { label: 'Lotus' },
          nutella: { label: 'Nutella' },
          almendra: { label: 'Almendra' },
          oreo: { label: 'Oreo' },
        },
      },
    },
  },
  'roles-canela': {
    label: 'Roles de Canela',
    subcategories: {
      tradicionales: {
        label: 'Tradicionales',
        types: null,
      },
      especialidad: {
        label: 'De Especialidad',
        types: {
          lotus: { label: 'Lotus' },
          nutella: { label: 'Nutella' },
          oreo: { label: 'Oreo' },
          pistache: { label: 'Pistache' },
          coco: { label: 'Coco' },
          'fresas-crema': { label: 'Fresas con Crema' },
        },
      },
    },
  },
  pasteles: {
    label: 'Pasteles',
    subcategories: null, // los "types" cuelgan directo de la categoría
    types: {
      fresa: { label: 'Fresa' },
      vainilla: { label: 'Vainilla' },
      chocolate: { label: 'Chocolate' },
      marmoleados: { label: 'Marmoleados' },
      'red-velvet': { label: 'Red Velvet' },
      'tres-leches': { label: 'Tres Leches' },
      chocoflan: { label: 'Chocoflán' },
      'rosca-judia': { label: 'Rosca Judía' },
    },
  },
};

// -------------------------------------------------------------------------
// PRODUCTOS (mock)
// status: 'active' | 'discontinued'  (descontinuado / fuera de temporada)
// -------------------------------------------------------------------------
export const PRODUCTS = [
  // ----------------- CONCHAS GOURMET - TRADICIONALES -----------------
  {
    id: 1001,
    name: 'Concha de Vainilla',
    description: 'Pan dulce clásico cubierto con pasta de azúcar sabor vainilla.',
    price: 18,
    image: '/img/products/concha-vainilla.jpg',
    category: 'conchas-gourmet',
    subcategory: 'tradicionales',
    type: null,
    status: 'active',
  },
  {
    id: 1002,
    name: 'Concha de Chocolate',
    description: 'Suave pan de concha con cubierta de pasta de chocolate.',
    price: 18,
    image: '/img/products/concha-chocolate.jpg',
    category: 'conchas-gourmet',
    subcategory: 'tradicionales',
    type: null,
    status: 'active',
  },
  {
    id: 1003,
    name: 'Concha de Fresa',
    description: 'Pan de concha tradicional con cubierta rosa sabor fresa.',
    price: 18,
    image: '/img/products/concha-fresa.jpg',
    category: 'conchas-gourmet',
    subcategory: 'tradicionales',
    type: null,
    status: 'active',
  },

  // ----------------- CONCHAS GOURMET - ESPECIALIDAD -----------------
  {
    id: 1101,
    name: 'Concha Gourmet Lotus',
    description: 'Concha artesanal rellena y bañada con crema de galleta Lotus.',
    price: 38,
    image: '/img/products/concha-lotus.jpg',
    category: 'conchas-gourmet',
    subcategory: 'especialidad',
    type: 'lotus',
    status: 'active',
  },
  {
    id: 1102,
    name: 'Concha Gourmet Nutella',
    description: 'Concha rellena de Nutella con cubierta crujiente de cacao.',
    price: 38,
    image: '/img/products/concha-nutella.jpg',
    category: 'conchas-gourmet',
    subcategory: 'especialidad',
    type: 'nutella',
    status: 'active',
  },
  {
    id: 1103,
    name: 'Concha Gourmet Almendra',
    description: 'Concha de especialidad con crema de almendra y almendras laminadas.',
    price: 40,
    image: '/img/products/concha-almendra.jpg',
    category: 'conchas-gourmet',
    subcategory: 'especialidad',
    type: 'almendra',
    status: 'active',
  },
  {
    id: 1104,
    name: 'Concha Gourmet Oreo',
    description: 'Concha rellena de crema y trozos de galleta Oreo.',
    price: 38,
    image: '/img/products/concha-oreo.jpg',
    category: 'conchas-gourmet',
    subcategory: 'especialidad',
    type: 'oreo',
    status: 'active',
  },

  // ----------------- ROLES DE CANELA - TRADICIONALES -----------------
  {
    id: 2001,
    name: 'Rol de Canela Clásico',
    description: 'Suave rol de canela horneado con glaseado tradicional.',
    price: 35,
    image: '/img/products/rol-clasico.jpg',
    category: 'roles-canela',
    subcategory: 'tradicionales',
    type: null,
    status: 'active',
  },
  {
    id: 2002,
    name: 'Rol de Canela Mini',
    description: 'Versión individual del rol de canela tradicional, perfecto para compartir.',
    price: 20,
    image: '/img/products/rol-mini.jpg',
    category: 'roles-canela',
    subcategory: 'tradicionales',
    type: null,
    status: 'active',
  },

  // ----------------- ROLES DE CANELA - ESPECIALIDAD -----------------
  {
    id: 2101,
    name: 'Rol de Canela Lotus',
    description: 'Rol de canela bañado en crema y galleta Lotus caramelizada.',
    price: 45,
    image: '/img/products/rol-lotus.jpg',
    category: 'roles-canela',
    subcategory: 'especialidad',
    type: 'lotus',
    status: 'active',
  },
  {
    id: 2102,
    name: 'Rol de Canela Nutella',
    description: 'Rol relleno y bañado con Nutella, espolvoreado con cacao.',
    price: 45,
    image: '/img/products/rol-nutella.jpg',
    category: 'roles-canela',
    subcategory: 'especialidad',
    type: 'nutella',
    status: 'active',
  },
  {
    id: 2103,
    name: 'Rol de Canela Oreo',
    description: 'Rol de canela con crema y trozos de galleta Oreo encima.',
    price: 45,
    image: '/img/products/rol-oreo.jpg',
    category: 'roles-canela',
    subcategory: 'especialidad',
    type: 'oreo',
    status: 'active',
  },
  {
    id: 2104,
    name: 'Rol de Canela Pistache',
    description: 'Rol bañado en crema de pistache con pistaches picados.',
    price: 48,
    image: '/img/products/rol-pistache.jpg',
    category: 'roles-canela',
    subcategory: 'especialidad',
    type: 'pistache',
    status: 'active',
  },
  {
    id: 2105,
    name: 'Rol de Canela Coco',
    description: 'Rol de canela cubierto con crema y coco rallado tostado.',
    price: 42,
    image: '/img/products/rol-coco.jpg',
    category: 'roles-canela',
    subcategory: 'especialidad',
    type: 'coco',
    status: 'active',
  },
  {
    id: 2106,
    name: 'Rol de Canela Fresas con Crema',
    description: 'Rol relleno de crema y trozos de fresa fresca, decorado con fresas.',
    price: 48,
    image: '/img/products/rol-fresas.jpg',
    category: 'roles-canela',
    subcategory: 'especialidad',
    type: 'fresas-crema',
    status: 'active',
  },

  // ----------------- PASTELES -----------------
  {
    id: 3001,
    name: 'Pastel de Fresa',
    description: 'Pan esponjoso relleno de crema y fresas naturales.',
    price: 280,
    image: '/img/products/pastel-fresa.jpg',
    category: 'pasteles',
    subcategory: null,
    type: 'fresa',
    status: 'active',
  },
  {
    id: 3002,
    name: 'Pastel de Vainilla',
    description: 'Clásico pastel de vainilla con betún suave y decoración elegante.',
    price: 260,
    image: '/img/products/pastel-vainilla.jpg',
    category: 'pasteles',
    subcategory: null,
    type: 'vainilla',
    status: 'active',
  },
  {
    id: 3003,
    name: 'Pastel de Chocolate',
    description: 'Pastel húmedo de chocolate con cobertura de ganache.',
    price: 280,
    image: '/img/products/pastel-chocolate.jpg',
    category: 'pasteles',
    subcategory: null,
    type: 'chocolate',
    status: 'active',
  },
  {
    id: 3004,
    name: 'Pastel Marmoleado',
    description: 'Combinación de pan de vainilla y chocolate con relleno cremoso.',
    price: 270,
    image: '/img/products/pastel-marmoleado.jpg',
    category: 'pasteles',
    subcategory: null,
    type: 'marmoleados',
    status: 'active',
  },
  {
    id: 3005,
    name: 'Pastel Red Velvet',
    description: 'Pan rojo aterciopelado con relleno de queso crema.',
    price: 320,
    image: '/img/products/pastel-redvelvet.jpg',
    category: 'pasteles',
    subcategory: null,
    type: 'red-velvet',
    status: 'active',
  },
  {
    id: 3006,
    name: 'Pastel Tres Leches',
    description: 'Esponjoso pan bañado en tres tipos de leche, decorado con canela.',
    price: 290,
    image: '/img/products/pastel-tresleches.jpg',
    category: 'pasteles',
    subcategory: null,
    type: 'tres-leches',
    status: 'active',
  },
  {
    id: 3007,
    name: 'Chocoflán',
    description: 'Combinación de pastel de chocolate y flan napolitano en una sola pieza.',
    price: 310,
    image: '/img/products/chocoflan.jpg',
    category: 'pasteles',
    subcategory: null,
    type: 'chocoflan',
    status: 'active',
  },
  {
    id: 3008,
    name: 'Rosca Judía',
    description: 'Pan trenzado tradicional, suave y ligeramente dulce.',
    price: 180,
    image: '/img/products/rosca-judia.jpg',
    category: 'pasteles',
    subcategory: null,
    type: 'rosca-judia',
    status: 'active',
  },

  // ----------------- PRODUCTOS DESCONTINUADOS / FUERA DE TEMPORADA -----------------
  {
    id: 9001,
    name: 'Concha de Calabaza (Edición Otoño)',
    description: 'Concha de temporada con relleno de calabaza especiada.',
    price: 42,
    image: '/img/products/concha-calabaza.jpg',
    category: null,
    subcategory: null,
    type: null,
    status: 'discontinued',
  },
  {
    id: 9002,
    name: 'Rol de Canela Navideño',
    description: 'Rol de canela con glaseado de menta, edición especial de diciembre.',
    price: 50,
    image: '/img/products/rol-navideno.jpg',
    category: null,
    subcategory: null,
    type: null,
    status: 'discontinued',
  },
];

// -------------------------------------------------------------------------
// IMÁGENES DEL HERO BANNER
// -------------------------------------------------------------------------
export const HERO_IMAGES = [
  {
    image: '/img/hero/hero-1.jpg',
    title: 'Bienvenido a La Casa Amarilla',
    subtitle: 'Repostería y pastelería artesanal hecha con amor',
  },
  {
    image: '/img/hero/hero-2.jpg',
    title: 'Conchas Gourmet',
    subtitle: 'Sabores únicos: Lotus, Nutella, Oreo y más',
  },
  {
    image: '/img/hero/hero-3.jpg',
    title: 'Pasteles para toda ocasión',
    subtitle: 'Hechos frescos cada día con ingredientes de calidad',
  },
];
