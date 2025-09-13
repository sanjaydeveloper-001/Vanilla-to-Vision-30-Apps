import { Link, useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();

  const tabs = ["Home", "Generate", "Gallery"];

  return (
    <div className="sm:w-[86%] mx-2  sm:mx-auto mt-4 h-auto bg-transparent border border-gray-300 rounded-2xl shadow-md shadow-gray-400/50 flex flex-col sm:flex-row sm:justify-between sm:items-center sm:px-4 py-5 gap-3 sm:gap-0">
      {/* Logo */}
      <h1 className="text-2xl font-extrabold text-gray-900 text-center sm:text-left">
        AI <span className="text-gray-500">Tattoo Studio</span>
      </h1>

      {/* Navigation */}
      <nav className="flex justify-center sm:justify-end items-center gap-4 sm:gap-6 flex-wrap">
        {tabs.map((tab) => {
          const path = tab === "Home" ? "/" : `/${tab.toLowerCase()}`;
          const isActive = location.pathname === path;

          return (
            <Link
              key={tab}
              to={path}
              className={`relative text-sm sm:text-lg font-medium transition-all duration-300 ${
                isActive
                  ? "text-black after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:bg-gray-700"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default Header;
