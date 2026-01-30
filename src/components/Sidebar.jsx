import { FaDatabase, FaInstagram, FaLock, FaUser } from "react-icons/fa";

const iconMap = {
  "Data Collection": <FaDatabase className="text-green-600 w-4 h-4" />,
  "Instagram API": <FaInstagram className="text-green-600 w-4 h-4" />,
  Encryption: <FaLock className="text-green-600 w-4 h-4" />,
  "User Rights": <FaUser className="text-green-600 w-4 h-4" />,
};

export default function Sidebar({ items }) {
  return (
    <aside className="hidden lg:block w-64 bg-white rounded-xl p-4 border">
      <h4 className="text-xs text-gray-500 mb-4">ON THIS PAGE</h4>
      <ul className="space-y-2">
        {items.map((i) => (
          <li
            key={i}
            className="flex items-center gap-2 text-sm px-3 py-2 rounded bg-green-50 text-green-700 font-medium"
          >
            {iconMap[i]}
            {i}
          </li>
        ))}
      </ul>
    </aside>
  );
}
