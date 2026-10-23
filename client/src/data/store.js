// client/src/data/store.js
// Estructura oficial de categorías y catálogo para La Casa Amarilla

export const DEFAULT_CATEGORIES = {
  panques: {
    id: 'panques',
    label: 'Panqués',
    description: 'Esponjosos y aromáticos panqués artesanales horneados diariamente.',
    icon: 'cake',
    subcategories: null,
  },
  roscas: {
    id: 'roscas',
    label: 'Roscas',
    description: 'Roscas y postres horneados tradicionales con recetas de la casa.',
    icon: 'circle-dot',
    subcategories: null,
  },
  conchas: {
    id: 'conchas',
    label: 'Conchas Tradicionales',
    description: 'Nuestras emblemáticas conchas artesanales. Venta por media docena y docena con selector mixto.',
    icon: 'cookie',
    subcategories: null,
    isBoxProduct: true,
  },
  'conchas-especialidad': {
    id: 'conchas-especialidad',
    label: 'Conchas de Especialidad',
    description: 'Conchas rellenas y cubiertas gourmet con ingredientes premium. Venta individual.',
    icon: 'sparkles',
    subcategories: null,
  },
  'pan-barra': {
    id: 'pan-barra',
    label: 'Pan de Barra',
    description: 'Panes de molde rústicos, masa madre y harinas integrales de fermentación lenta.',
    icon: 'bread',
    subcategories: null,
  },
  'pan-hamburguesa': {
    id: 'pan-hamburguesa',
    label: 'Pan de Hamburguesa',
    description: 'Brioche suave y resistente para hamburguesas gourmet. Venta por docena.',
    icon: 'sandwich',
    subcategories: null,
  },
  'pan-banquetes': {
    id: 'pan-banquetes',
    label: 'Pan de Banquetes',
    description: 'Panecillos miniatura para eventos, reuniones y banquetes. Venta por docena.',
    icon: 'utensils',
    subcategories: null,
  },
  'pan-danes': {
    id: 'pan-danes',
    label: 'Pan Danés',
    description: 'Hojaldres finos laminados con mantequilla pura y rellenos exquisitos.',
    icon: 'croissant',
    subcategories: null,
  },
  temporada: {
    id: 'temporada',
    label: 'Menú de Temporada',
    description: 'Ediciones limitadas y recetas festivas según la época del año.',
    icon: 'calendar',
    subcategories: null,
    isSeasonal: true,
  },
};

// Obtenemos categorías activas (permite añadir o editar desde el panel o almacenamiento)
const CATEGORIES_STORAGE_KEY = 'casaAmarillaCategories';

export function getStoredCategories() {
  try {
    const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Object.keys(parsed).length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error leyendo categorías de localStorage:', e);
  }
  return DEFAULT_CATEGORIES;
}

export function saveStoredCategories(categories) {
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  } catch (e) {
    console.error('Error guardando categorías en localStorage:', e);
  }
}

export let CATEGORIES = getStoredCategories();

// -------------------------------------------------------------------------
// CATÁLOGO BASE DE PRODUCTOS OFICIALES DE LA CASA AMARILLA
// -------------------------------------------------------------------------
export const PRODUCTS = [
  // ==================== PANQUÉS ====================
  {
    id: 101,
    name: 'Panqué Artesanal',
    description: 'Panqué esponjoso horneado con mantequilla de primera. Selecciona tu sabor preferido.',
    price: 95,
    image: '/img/products/panque-artesanal.jpg',
    category: 'panques',
    subcategory: null,
    status: 'active',
    attributes: {
      hasFlavors: true,
      flavors: ['Nuez', 'Pasas', 'Plátano', 'Marmoleado', 'Limón'],
      defaultFlavor: 'Nuez',
      hasWeight: true,
      weight: '450g aprox.',
      hasAllergens: true,
      allergens: ['Gluten', 'Lácteos', 'Huevo'],
      requiresAdvanceNotice: false,
    },
  },

  // ==================== ROSCAS ====================
  {
    id: 201,
    name: 'Volteado de Piña',
    description: 'Receta casera clásica caramelizada con rebanadas de piña miel y cerezas marrasquino.',
    price: 180,
    image: '/img/products/volteado-pina.jpg',
    category: 'roscas',
    subcategory: null,
    status: 'active',
    attributes: {
      hasSizes: true,
      sizes: [
        { label: 'Chica (4-6 porciones)', priceAdjustment: 0 },
        { label: 'Grande (10-12 porciones)', priceAdjustment: 120 },
      ],
      hasWeight: true,
      weight: '800g aprox.',
      hasAllergens: true,
      allergens: ['Gluten', 'Lácteos', 'Huevo'],
    },
  },
  {
    id: 202,
    name: 'Rosca Judía',
    description: 'Tradicional rosca suave y aromática con toque de canela, pasas y nuez seleccionada.',
    price: 210,
    image: '/img/products/rosca-judia.jpg',
    category: 'roscas',
    subcategory: null,
    status: 'active',
    attributes: {
      hasWeight: true,
      weight: '900g aprox.',
      hasAllergens: true,
      allergens: ['Gluten', 'Lácteos', 'Huevo', 'Nuez'],
    },
  },
  {
    id: 203,
    name: 'Chocoflán',
    description: 'La combinación perfecta: flán napolitano suave sobre un bizcocho húmedo de chocolate oscuro.',
    price: 220,
    image: '/img/products/chocoflan.jpg',
    category: 'roscas',
    subcategory: null,
    status: 'active',
    attributes: {
      hasWeight: true,
      weight: '1.1 kg aprox.',
      hasAllergens: true,
      allergens: ['Gluten', 'Lácteos', 'Huevo'],
    },
  },

  // ==================== CONCHAS TRADICIONALES (SELECTOR DE CAJA) ====================
  {
    id: 301,
    name: 'Caja de Conchas Tradicionales',
    description: 'Nuestras conchas más queridas. Arma tu caja personalizada de media docena o docena eligiendo cuántas deseas de cada sabor.',
    price: 110, // Precio base media docena
    image: '/img/products/caja-conchas.jpg',
    category: 'conchas',
    subcategory: null,
    status: 'active',
    attributes: {
      isConchaBox: true,
      boxSizes: [
        { size: 6, label: 'Media Docena (6 conchas)', price: 110 },
        { size: 12, label: 'Docena Completa (12 conchas)', price: 210 },
      ],
      availableFlavors: [
        { id: 'fresa', name: 'Fresa', color: '#F472B6', crustColor: '#FB7185' },
        { id: 'chocolate', name: 'Chocolate', color: '#78350F', crustColor: '#451A03' },
        { id: 'vainilla', name: 'Vainilla', color: '#FDE047', crustColor: '#D97706' },
      ],
      hasAllergens: true,
      allergens: ['Gluten', 'Lácteos', 'Huevo'],
    },
  },

  // ==================== CONCHAS DE ESPECIALIDAD ====================
  {
    id: 401,
    name: 'Concha Gourmet Nutella',
    description: 'Concha esponjosa rellena de generosa crema de Nutella y cubierta crocante de cacao.',
    price: 42,
    image: '/img/products/concha-nutella.jpg',
    category: 'conchas-especialidad',
    subcategory: null,
    status: 'active',
    attributes: {
      hasAllergens: true,
      allergens: ['Gluten', 'Lácteos', 'Avellana'],
      saleUnit: 'Pieza individual',
    },
  },
  {
    id: 402,
    name: 'Concha Gourmet Lotus Biscoff',
    description: 'Concha rellena de auténtica crema de galleta Lotus Biscoff con topping de galleta crujiente.',
    price: 45,
    image: '/img/products/concha-lotus.jpg',
    category: 'conchas-especialidad',
    subcategory: null,
    status: 'active',
    attributes: {
      hasAllergens: true,
      allergens: ['Gluten', 'Lácteos', 'Soya'],
      saleUnit: 'Pieza individual',
    },
  },
  {
    id: 403,
    name: 'Concha Gourmet Almendra & Crema',
    description: 'Concha de especialidad rellena de crema pastelera artesanal y almendras fileteadas tostadas.',
    price: 45,
    image: '/img/products/concha-almendra.jpg',
    category: 'conchas-especialidad',
    subcategory: null,
    status: 'active',
    attributes: {
      hasAllergens: true,
      allergens: ['Gluten', 'Lácteos', 'Almendras'],
      saleUnit: 'Pieza individual',
    },
  },

  // ==================== PAN DE BARRA ====================
  {
    id: 501,
    name: 'Pan de Barra Blanco Artesanal',
    description: 'Pan de molde clásico con miga suave y elástica, corteza tierna y sin conservadores artificiales.',
    price: 75,
    image: '/img/products/pan-barra-blanco.jpg',
    category: 'pan-barra',
    subcategory: null,
    status: 'active',
    attributes: {
      hasWeight: true,
      weight: '600g aprox.',
      hasAllergens: true,
      allergens: ['Gluten'],
    },
  },
  {
    id: 502,
    name: 'Pan de Masa Madre (Sourdough)',
    description: 'Elaborado con fermentación lenta natural de 24 horas. Corteza crujiente y miga aireada con sutil acidez.',
    price: 95,
    image: '/img/products/pan-masa-madre.jpg',
    category: 'pan-barra',
    subcategory: null,
    status: 'active',
    attributes: {
      hasWeight: true,
      weight: '750g aprox.',
      hasAllergens: true,
      allergens: ['Gluten'],
      requiresAdvanceNotice: true,
      advanceNoticeHours: 24,
    },
  },
  {
    id: 503,
    name: 'Pan de Barra Integral & Semillas',
    description: 'Elaborado con harina 100% integral, semillas de girasol, linaza y chía tostadas.',
    price: 85,
    image: '/img/products/pan-barra-integral.jpg',
    category: 'pan-barra',
    subcategory: null,
    status: 'active',
    attributes: {
      hasWeight: true,
      weight: '650g aprox.',
      hasAllergens: true,
      allergens: ['Gluten', 'Semillas'],
    },
  },

  // ==================== PAN DE HAMBURGUESA (DOCENAS) ====================
  {
    id: 601,
    name: 'Bollos Brioche para Hamburguesa (Docena)',
    description: 'Bollos dorados tipo brioche con ajonjolí tostado. Tienen la esponjosidad y resistencia ideal para carnes jugosas.',
    price: 150, // Precio por docena
    image: '/img/products/pan-hamburguesa.jpg',
    category: 'pan-hamburguesa',
    subcategory: null,
    status: 'active',
    attributes: {
      hasMinOrder: true,
      minOrder: 12,
      orderStep: 12,
      saleUnitLabel: 'docenas (12 pzas)',
      hasWeight: true,
      weight: '90g por bollo',
      hasAllergens: true,
      allergens: ['Gluten', 'Lácteos', 'Huevo', 'Ajonjolí'],
    },
  },

  // ==================== PAN DE BANQUETES (DOCENAS) ====================
  {
    id: 701,
    name: 'Panecillos Gourmet para Banquetes (Docena)',
    description: 'Panecillos surtidos miniatura (cuernitos, medianoches y panecillos brioche) perfectos para tablas de quesos, eventos y cócteles.',
    price: 130, // Precio por docena
    image: '/img/products/pan-banquetes.jpg',
    category: 'pan-banquetes',
    subcategory: null,
    status: 'active',
    attributes: {
      hasMinOrder: true,
      minOrder: 12,
      orderStep: 12,
      saleUnitLabel: 'docenas (12 pzas)',
      hasAllergens: true,
      allergens: ['Gluten', 'Lácteos', 'Huevo'],
      requiresAdvanceNotice: true,
      advanceNoticeHours: 24,
    },
  },

  // ==================== PAN DANÉS ====================
  {
    id: 801,
    name: 'Croissant Tradicional de Mantequilla',
    description: 'Hojaldre francés clásico con capas doradas y crocantes y miga alveolar aromatizada con mantequilla de vaca.',
    price: 36,
    image: '/img/products/croissant.jpg',
    category: 'pan-danes',
    subcategory: null,
    status: 'active',
    attributes: {
      hasAllergens: true,
      allergens: ['Gluten', 'Lácteos'],
    },
  },
  {
    id: 802,
    name: 'Chocolatín (Pain au Chocolat)',
    description: 'Masa danesa laminada rellena con dos barras de chocolate belga semiamargo.',
    price: 40,
    image: '/img/products/chocolatin.jpg',
    category: 'pan-danes',
    subcategory: null,
    status: 'active',
    attributes: {
      hasAllergens: true,
      allergens: ['Gluten', 'Lácteos', 'Soya'],
    },
  },
  {
    id: 803,
    name: 'Trenza de Nuez y Miel de Maple',
    description: 'Hojaldre danés trenzado a mano con nuez pecana caramelizada y glaseado ligero de maple.',
    price: 42,
    image: '/img/products/trenza-nuez.jpg',
    category: 'pan-danes',
    subcategory: null,
    status: 'active',
    attributes: {
      hasAllergens: true,
      allergens: ['Gluten', 'Lácteos', 'Nuez'],
    },
  },
  {
    id: 804,
    name: 'Molinete de Frutos Rojos',
    description: 'Hojaldre danés en forma de molinete con corazón de queso crema y compota artesanal de frutos del bosque.',
    price: 38,
    image: '/img/products/molinete-frutos.jpg',
    category: 'pan-danes',
    subcategory: null,
    status: 'active',
    attributes: {
      hasAllergens: true,
      allergens: ['Gluten', 'Lácteos'],
    },
  },

  // ==================== MENÚ DE TEMPORADA ====================
  {
    id: 901,
    name: 'Pan de Muerto Tradicional de Azúcar',
    description: 'Aromatizado con azahar natural, ralladura de naranja y mantequilla pura. Espolvoreado con azúcar fina.',
    price: 35,
    image: '/img/products/pan-muerto-tradicional.jpg',
    category: 'temporada',
    subcategory: null,
    status: 'active',
    attributes: {
      isSeasonal: true,
      seasonalSeason: 'Otoño / Día de Muertos',
      hasAllergens: true,
      allergens: ['Gluten', 'Lácteos', 'Huevo'],
    },
  },
  {
    id: 902,
    name: 'Pan de Muerto Relleno de Nata',
    description: 'Nuestra receta clásica de pan de muerto abierta y rellena de abundante nata fresca montada.',
    price: 55,
    image: '/img/products/pan-muerto-relleno.jpg',
    category: 'temporada',
    subcategory: null,
    status: 'active',
    attributes: {
      isSeasonal: true,
      seasonalSeason: 'Otoño / Día de Muertos',
      hasAllergens: true,
      allergens: ['Gluten', 'Lácteos', 'Huevo'],
      requiresAdvanceNotice: true,
      advanceNoticeHours: 12,
    },
  },
  {
    id: 903,
    name: 'Rosca de Reyes Artesanal',
    description: 'Masa brioche perfumada con azahar, decorada con costra azucarada de concha, higos y ate de guayaba.',
    price: 280,
    image: '/img/products/rosca-reyes.jpg',
    category: 'temporada',
    subcategory: null,
    status: 'active',
    attributes: {
      isSeasonal: true,
      seasonalSeason: 'Enero / Reyes Magos',
      hasSizes: true,
      sizes: [
        { label: 'Mediana (6-8 personas)', priceAdjustment: 0 },
        { label: 'Grande (12-16 personas)', priceAdjustment: 160 },
      ],
      hasAllergens: true,
      allergens: ['Gluten', 'Lácteos', 'Huevo'],
      requiresAdvanceNotice: true,
      advanceNoticeHours: 24,
    },
  },
];
