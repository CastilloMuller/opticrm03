import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";
import Sidebar from "../components/Sidebar"; // ✅ Import Sidebar

export default function Home() {
  const [testData, setTestData] = useState(null);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    async function fetchTestData() {
      const { data, error } = await supabase
        .from("test")
        .select("*")
        .limit(1);
      if (error) {
        setError(error.message);
      } else {
        setTestData(data);
      }
    }
    fetchTestData();
  }, []);

  // ✅ Fetch search results from Supabase
  useEffect(() => {
    async function searchNotes() {
      if (searchQuery.trim() === "") {
        setSearchResults([]);
        return;
      }
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .ilike("content", `%${searchQuery}%`);

      if (error) console.error("Search Error:", error);
      else setSearchResults(data);
    }
    searchNotes();
  }, [searchQuery]);

  // ✅ Dark Mode Toggle
  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} flex`}>
      <Sidebar /> {/* ✅ Sidebar added here */}

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        <h1>Welcome to OptiCRM</h1>

        {/* ✅ Dark Mode Toggle Button */}
        <button onClick={toggleDarkMode} className="mb-4 p-2 border rounded">
          {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>

        {/* ✅ Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search Notes..."
            className="p-2 border rounded w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* ✅ Search Results */}
        {searchQuery && (
          <div>
            <h2>Search Results:</h2>
            {searchResults.length > 0 ? (
              <ul>
                {searchResults.map((note) => (
                  <li key={note.id} className="p-2 border-b">
                    {note.content}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No matching notes found.</p>
            )}
          </div>
        )}

        {/* ✅ Navigation Menu */}
        <nav>
          <ul>
            <li><Link href="/leads">Lead Management</Link></li>
            <li><Link href="/tasks">Task Management</Link></li>
            <li><Link href="/calendar">Calendar Integration</Link></li>
            <li><Link href="/communication-history">Communication History</Link></li>
            <li><Link href="/analytics">Analytics</Link></li>
            <li><Link href="/data-management">Data Management</Link></li>
          </ul>
        </nav>
        
        <p>This is the initial scaffold of your personal CRM system.</p>

        <hr />

        {/* ✅ Supabase Connection Test */}
        <h2>Supabase Connection Test</h2>
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        {testData ? <pre>{JSON.stringify(testData, null, 2)}</pre> : <p>Loading test data...</p>}
      </div>
    </div>
  );
}
