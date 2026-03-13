import Badge from './Badge';

export default function AlertCard({ title, type, desc }) {
  const getBadgeVariant = (type) => {
    switch(type) {
      case 'CRITICAL': return 'danger';
      case 'WARNING': return 'warning';
      case 'STABLE': return 'success';
      default: return 'primary';
    }
  };

  return (
    <div className="p-4 rounded-lg bg-background-dark/30 border border-primary/5">
      <div className="flex justify-between mb-1">
        <span className="text-xs font-bold text-primary">{title}</span>
        <Badge variant={getBadgeVariant(type)}>{type}</Badge>
      </div>
      <p className="text-sm text-slate-400">{desc}</p>
    </div>
  );
}
