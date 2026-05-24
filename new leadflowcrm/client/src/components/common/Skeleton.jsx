export const SkeletonCard = () => (
  <div className="card p-5 animate-pulse">
    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-3"></div>
    <div className="h-7 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-2"></div>
    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
  </div>
);

export const SkeletonRow = () => (
  <tr className="animate-pulse">
    {[...Array(6)].map((_, i) => (
      <td key={i} className="px-4 py-3">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
      </td>
    ))}
  </tr>
);
