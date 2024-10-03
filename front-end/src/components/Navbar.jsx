import { useState, useEffect } from "react";

const Navbar = () => {
  // Check localStorage for a saved theme preference
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <nav className="bg-gray-200 dark:bg-gray-800 p-4 flex justify-between items-center">
      <div className="text-xl font-bold text-gray-800 dark:text-white">
        Where is Waldo
      </div>
      <button
        onClick={toggleDarkMode}
        className="bg-blue-500 dark:bg-blue-700 text-white px-4 py-2 rounded-md"
      >
        {darkMode ? "Dark Mode" : "Light Mode"}
      </button>
    </nav>
  );
};

export default Navbar;
