import Link from 'next/link';

export default function Home() {
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
    </div>
  );
}
