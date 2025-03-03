export default function LeadCard({ lead }) {
  return (
    <div style={{
      border: '1px solid #ccc',
      padding: '10px',
      marginBottom: '10px'
    }}>
      <h3>{lead.name}</h3>
      <p>Email: {lead.email || 'N/A'}</p>
      <p>Phone: {lead.phone || 'N/A'}</p>
      <p>Status: {lead.status}</p>
      <p>Decision Date: {lead.decision_date || 'N/A'}</p>
      <p>Quotation Value: {lead.quotation_value || 'N/A'}</p>
      <p>Outstanding Tasks: {lead.task_count || 0}</p>
      <p>Latest Note: {lead.latest_note ? lead.latest_note.substring(0, 100) : 'N/A'}</p>
    </div>
  );
}
