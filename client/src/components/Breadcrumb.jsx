// src/components/Breadcrumb.jsx
import { Link, useLocation, matchPath } from 'react-router-dom';
import { CATEGORIES } from '../data/store';

const CATEGORY_PATTERNS = [
  '/categoria/:category/:subcategory/:type',
  '/categoria/:category/:subcategory',
  '/categoria/:category',
];

export default function Breadcrumb() {
  const location = useLocation();

  let params = null;
  for (const pattern of CATEGORY_PATTERNS) {
    const match = matchPath(pattern, location.pathname);
    if (match) { params = match.params; break; }
  }
  if (!params) return null;

  const { category, subcategory, type } = params;
  const cat = CATEGORIES[category];
  if (!cat) return null;

  const crumbs = [{ label: 'Inicio', to: '/' }];
  crumbs.push({ label: cat.label, to: `/categoria/${category}` });

  if (subcategory && cat.subcategories?.[subcategory]) {
    crumbs.push({ label: cat.subcategories[subcategory].label, to: `/categoria/${category}/${subcategory}` });
  }

  if (type) {
    const typesSource = subcategory ? cat.subcategories?.[subcategory]?.types : cat.types;
    const typeLabel = typesSource?.[type]?.label;
    if (typeLabel) {
      crumbs.push({ label: typeLabel, to: `/categoria/${category}/${subcategory}/${type}` });
    }
  }

  return (
    <nav aria-label="Breadcrumb" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <ol className="flex items-center flex-wrap gap-1 text-sm text-amber-800">
        {crumbs.map((crumb, idx) => (
          <li key={idx} className="flex items-center gap-1">
            {idx > 0 && <span className="text-amber-400">/</span>}
            {idx === crumbs.length - 1 ? (
              <span className="font-semibold text-amber-900">{crumb.label}</span>
            ) : (
              <Link to={crumb.to} className="hover:text-amber-600 hover:underline transition-colors">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}