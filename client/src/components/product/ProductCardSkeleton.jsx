// src/components/product/ProductCardSkeleton.jsx
export default function ProductCardSkeleton() {
  return (
    <div className="bg-surface rounded-2xl border border-border overflow-hidden animate-pulse">
      <div className="aspect-square bg-surface-2" />
      <div className="p-4 flex flex-col gap-2">
        <div className="h-4 bg-surface-2 rounded w-3/4" />
        <div className="h-3 bg-surface-2 rounded w-full" />
        <div className="h-3 bg-surface-2 rounded w-2/3" />
        <div className="h-5 bg-surface-2 rounded w-1/3 mt-1" />
      </div>
    </div>
  );
}