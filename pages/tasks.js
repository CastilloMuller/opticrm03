import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import TaskCard from '../components/TaskCard';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTasks() {
      const { data, error } = await supabase
        .from('tasks')
        .select('*');
      if (error) {
        setError(error.message);
      } else {
        setTasks(data);
      }
      setLoading(false);
    }
    fetchTasks();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Task Management</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))
      )}
    </div>
  );
}
