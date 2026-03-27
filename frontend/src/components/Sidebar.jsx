// src/components/Sidebar.jsx
import { FaDatabase, FaYoutube, FaLock, FaEnvelope } from "react-icons/fa";

const iconMap = {
  "Data Collection": <FaDatabase className="w-5 h-5" />,
  "YouTube API": <FaYoutube className="w-5 h-5" />,
  "Encryption": <FaLock className="w-5 h-5" />,
  "User Rights": <FaEnvelope className="w-5 h-5" />,
  "Deletion & Contact": <FaEnvelope className="w-5 h-5" />,
};

export default function Sidebar({ items }) {
  const getSectionId = (item) => {
    return item.toLowerCase().replace(/\s+/g, '-');
  };

  return (
    <aside className="block w-64 flex-shrink-0">
      <div className="sticky top-24 flex flex-col items-start">
        <h4 className="text-xs font-semibold text-red-600 mb-6 uppercase tracking-wider">
          ON THIS PAGE
        </h4>
        <nav className="space-y-2">
          {items.map((item) => {
            const sectionId = getSectionId(item);
            return (
              <a
                key={item}
                href={`#${sectionId}`}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(sectionId);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="flex items-center gap-3 text-sm px-4 py-3 rounded-xl hover:bg-red-50 hover:text-red-700 text-gray-600 transition-colors group"
              >
                <span className="text-red-500 group-hover:text-red-700">
                  {iconMap[item]}
                </span>
                <span className="font-medium">{item}</span>
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}