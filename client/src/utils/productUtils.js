// client/src/utils/productUtils.js
import { CATEGORIES } from '../data/store'; // Ya no importamos PRODUCTS estático

// Devuelve productos activos que coinciden con category/subcategory de una lista dinámica
export function getProductsByPage(productsList, { category, subcategory }) {
  return productsList.filter((p) => {
    if (p.status !== 'active') return false;
    if (p.category !== category) return false;
    if (subcategory !== undefined && p.subcategory !== subcategory) return false;
    return true;
  });
}

// Devuelve productos descontinuados / fuera de temporada de una lista dinámica (para admin)
export function getDiscontinuedProducts(productsList) {
  return productsList.filter((p) => p.status === 'discontinued');
}

// Construye la lista de "secciones" a mostrar basándose en la lista dinámica traída de MySQL
export function getSectionsForPage(productsList, { category, subcategory }) {
  const cat = CATEGORIES[category];
  if (!cat) return [];

  // 1. Si hay una subcategoría seleccionada activa (ej. "De Especialidad")
  if (subcategory) {
    const subcat = cat.subcategories?.[subcategory];
    if (!subcat) return [];

    const products = getProductsByPage(productsList, { category, subcategory });
    return [{ title: null, products }];
  }

  // 2. Si no hay subcategoría activa pero la categoría tiene subcategorías (ej. Roles de Canela)
  if (cat.subcategories) {
    return Object.entries(cat.subcategories).map(([subKey, subData]) => {
      const products = getProductsByPage(productsList, { category, subcategory: subKey });
      return { title: subData.label, products };
    });
  }

  // 3. Categorías directas sin subcategorías (ej. Pasteles)
  return [{ title: null, products: getProductsByPage(productsList, { category }) }];
}