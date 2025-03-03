import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import LeadCard from '../components/LeadCard';

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLeads() {
      // Fetch all leads from Supabase
      const { data, error } = await supabase
        .from('leads')
        .select('*');
      if (error) {
        setError(error.message);
      } else {
        setLeads(data);
      }
      setLoading(false);
    }
    fetchLeads();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Lead Management</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {loading ? (
        <p>Loading leads...</p>
      ) : (
        leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))
      )}
    </div>
  );
}
