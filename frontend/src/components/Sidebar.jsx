export default function Sidebar({ items }) {
  return (
    <aside className="hidden lg:block w-64 bg-white rounded-xl p-4 border">
      <h4 className="text-xs text-gray-500 mb-4">ON THIS PAGE</h4>
      <ul className="space-y-2">
        {items.map((i) => (
          <li key={i} className="text-sm px-3 py-2 rounded bg-green-50 text-green-700">
            {i}
          </li>
        ))}
      </ul>
    </aside>
  );
}
