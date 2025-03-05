import React, { useState, useEffect } from "react";
import { FiSearch, FiHome, FiUsers, FiSettings, FiMoon, FiSun } from "react-icons/fi";
import { motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import "tailwindcss/tailwind.css";

const supabase = createClient("https://your-supabase-url", "your-anon-key");

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleSearch = async (query) => {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .ilike("content", `%${query}%`);

    if (error) console.error("Error fetching notes:", error);
    else setSearchResults(data);
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} flex`}> 
      {/* Sidebar */}
      <motion.div 
        animate={{ width: isOpen ? 250 : 70 }}
        className="h-screen p-5 border-r flex flex-col justify-between"
      >
        <div>
          <button onClick={toggleSidebar} className="mb-6 focus:outline-none">
            {isOpen ? "Collapse" : "Expand"}
          </button>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <FiSearch />
              {isOpen && <input 
                type="text" 
                placeholder="Search..." 
                className="p-2 w-full rounded" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
              />}
            </div>
            <NavItem icon={<FiHome />} text="Dashboard" isOpen={isOpen} />
            <NavItem icon={<FiUsers />} text="Users" isOpen={isOpen} />
            <NavItem icon={<FiSettings />} text="Settings" isOpen={isOpen} />
          </div>
        </div>
        <button onClick={toggleDarkMode} className="mt-auto flex items-center space-x-2">
          {darkMode ? <FiSun /> : <FiMoon />}
          {isOpen && <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>}
        </button>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <p>Recent activity, notes, and important updates will appear here.</p>
        
        {searchQuery && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold">Search Results:</h2>
            {searchResults.length > 0 ? (
              <ul>
                {searchResults.map((result) => (
                  <li key={result.id} className="p-2 border-b">{result.content}</li>
                ))}
              </ul>
            ) : (
              <p>No results found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const NavItem = ({ icon, text, isOpen }) => (
  <div className="flex items-center space-x-4 p-2 rounded hover:bg-gray-200 cursor-pointer">
    {icon}
    {isOpen && <span>{text}</span>}
  </div>
);

export default Sidebar;
