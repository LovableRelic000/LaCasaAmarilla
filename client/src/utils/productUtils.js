// client/src/utils/productUtils.js
import { getStoredCategories } from '../data/store';

function parseAttrs(product) {
  if (!product.attributes) return {};
  if (typeof product.attributes === 'string') {
    try {
      return JSON.parse(product.attributes);
    } catch {
      return {};
    }
  }
  return product.attributes;
}

// Devuelve productos activos que coinciden con category/subcategory de una lista dinámica
export function getProductsByPage(productsList, { category, subcategory }) {
  return productsList.filter((p) => {
    if (p.status !== 'active') return false;

    // Si estamos en la página de temporada, incluimos tanto los de categoría 'temporada' como los que tienen isSeasonal = true
    if (category === 'temporada') {
      const attrs = parseAttrs(p);
      return p.category === 'temporada' || Boolean(attrs.isSeasonal);
    }

    if (p.category !== category) return false;
    if (subcategory !== undefined && p.subcategory !== subcategory) return false;
    return true;
  });
}

// Devuelve productos descontinuados / fuera de temporada de una lista dinámica (para admin)
export function getDiscontinuedProducts(productsList) {
  return productsList.filter((p) => p.status === 'discontinued');
}

// Construye la lista de secciones a mostrar basándose en las categorías almacenadas
export function getSectionsForPage(productsList, { category, subcategory }) {
  const categories = getStoredCategories();
  const cat = categories[category];
  if (!cat) return [];

  // 1. Si hay una subcategoría seleccionada activa
  if (subcategory) {
    const subcat = cat.subcategories?.[subcategory];
    if (!subcat) return [];

    const products = getProductsByPage(productsList, { category, subcategory });
    return [{ title: null, products }];
  }

  // 2. Si no hay subcategoría activa pero la categoría tiene subcategorías
  if (cat.subcategories) {
    return Object.entries(cat.subcategories).map(([subKey, subData]) => {
      const products = getProductsByPage(productsList, { category, subcategory: subKey });
      return { title: subData.label, products };
    });
  }

  // 3. Categorías directas sin subcategorías
  return [{ title: null, products: getProductsByPage(productsList, { category }) }];
}