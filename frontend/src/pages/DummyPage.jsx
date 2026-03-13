export default function DummyPage({ title }) {
  return (
    <div className="p-8 flex items-center justify-center h-full">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">{title}</h2>
        <p className="text-slate-500">This module is under development.</p>
      </div>
    </div>
  );
}
