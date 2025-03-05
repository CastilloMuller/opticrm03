export default function TaskCard({ task }) {
  return (
    <div style={{
      border: '1px solid #ccc',
      padding: '10px',
      marginBottom: '10px'
    }}>
      <h3>{task.title}</h3>
      <p>Description: {task.description || 'N/A'}</p>
      <p>Scheduled Date: {task.scheduled_date || 'N/A'}</p>
      <p>Task Type: {task.task_type}</p>
      <p>Completed: {task.completed ? 'Yes' : 'No'}</p>
    </div>
  );
}
