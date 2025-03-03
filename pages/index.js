import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [testData, setTestData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTestData() {
      const { data, error } = await supabase
        .from('test')
        .select('*')
        .limit(1);
      if (error) {
        setError(error.message);
      } else {
        setTestData(data);
      }
    }
    fetchTestData();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to OptiCRM</h1>
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
      
      <h2>Supabase Connection Test</h2>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {testData ? (
        <pre>{JSON.stringify(testData, null, 2)}</pre>
      ) : (
        <p>Loading test data...</p>
      )}
    </div>
  );
}
