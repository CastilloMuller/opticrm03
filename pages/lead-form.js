import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function LeadForm() {
  const router = useRouter();
  const { id } = router.query; // if editing an existing lead, id will be in the query string

  // State for lead details
  const [lead, setLead] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'Standaard',
    decision_date: '',
    quotation_value: ''
  });

  // State for tasks related to the lead
  const [tasks, setTasks] = useState([]);

  // State for the new task form
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    scheduled_date: '',
    task_type: 'Bellen',
    completed: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch lead and tasks if editing an existing lead
  useEffect(() => {
    if (id) {
      async function fetchLeadData() {
        const { data: leadData, error: leadError } = await supabase
          .from('leads')
          .select('*')
          .eq('id', id)
          .single();
        if (leadError) {
          setError(leadError.message);
          return;
        }
        setLead(leadData);

        const { data: taskData, error: taskError } = await supabase
          .from('tasks')
          .select('*')
          .eq('lead_id', id);
        if (taskError) {
          setError(taskError.message);
          return;
        }
        setTasks(taskData);
      }
      fetchLeadData();
    }
  }, [id]);

  // Handler for lead form submission
  async function handleLeadSubmit(e) {
    e.preventDefault();
    setLoading(true);
    if (id) {
      // Update existing lead
      const { error } = await supabase
        .from('leads')
        .update(lead)
        .eq('id', id);
      if (error) setError(error.message);
    } else {
      // Create new lead
      const { data, error } = await supabase
        .from('leads')
        .insert(lead)
        .select()
        .single();
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      // After creating a new lead, update the URL with the new lead's id
      router.push(`/lead-form?id=${data.id}`);
      return;
    }
    setLoading(false);
  }

  // Handler for new task form submission
  async function handleTaskSubmit(e) {
    e.preventDefault();
    if (!id) {
      setError("Save the lead first before adding tasks.");
      return;
    }
    const taskData = { ...newTask, lead_id: id };
    const { data, error } = await supabase
      .from('tasks')
      .insert(taskData)
      .select()
      .single();
    if (error) {
      setError(error.message);
    } else {
      setTasks([...tasks, data]);
      // Clear the new task form
      setNewTask({
        title: '',
        description: '',
        scheduled_date: '',
        task_type: 'Bellen',
        completed: false,
      });
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>{id ? 'Edit Lead' : 'Create New Lead'}</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <form onSubmit={handleLeadSubmit}>
        <div>
          <label>Name: </label>
          <input
            type="text"
            value={lead.name}
            onChange={(e) => setLead({ ...lead, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Email: </label>
          <input
            type="email"
            value={lead.email}
            onChange={(e) => setLead({ ...lead, email: e.target.value })}
          />
        </div>
        <div>
          <label>Phone: </label>
          <input
            type="text"
            value={lead.phone}
            onChange={(e) => setLead({ ...lead, phone: e.target.value })}
          />
        </div>
        <div>
          <label>Status: </label>
          <select
            value={lead.status}
            onChange={(e) => setLead({ ...lead, status: e.target.value })}
            required
          >
            <option value="Probeer af te ronden">Probeer af te ronden</option>
            <option value="Goede kans, warm houden">Goede kans, warm houden</option>
            <option value="Standaard">Standaard</option>
            <option value="Bellen als niets gehoord">Bellen als niets gehoord</option>
            <option value="Goede kans">Goede kans</option>
            <option value="Hot">Hot</option>
            <option value="Snel beslissen">Snel beslissen</option>
            <option value="Hot en snel beslissen">Hot en snel beslissen</option>
            <option value="Niets mee doen">Niets mee doen</option>
            <option value="Wacht op gemeente">Wacht op gemeente</option>
          </select>
        </div>
        <div>
          <label>Decision Date: </label>
          <input
            type="date"
            value={lead.decision_date || ''}
            onChange={(e) => setLead({ ...lead, decision_date: e.target.value })}
          />
        </div>
        <div>
          <label>Quotation Value: </label>
          <input
            type="number"
            value={lead.quotation_value || ''}
            onChange={(e) => setLead({ ...lead, quotation_value: e.target.value })}
          />
        </div>
        <button type="submit" disabled={loading}>
          {id ? 'Update Lead' : 'Create Lead'}
        </button>
      </form>

      {/* Nested Task Management Section */}
      {id && (
        <div style={{ marginTop: '40px' }}>
          <h2>Tasks for {lead.name}</h2>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div
                key={task.id}
                style={{
                  border: '1px solid #ccc',
                  padding: '10px',
                  marginBottom: '10px',
                }}
              >
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p>Type: {task.task_type}</p>
                <p>Scheduled: {task.scheduled_date}</p>
                <p>Completed: {task.completed ? 'Yes' : 'No'}</p>
              </div>
            ))
          ) : (
            <p>No tasks yet.</p>
          )}

          <h3>Add New Task</h3>
          <form onSubmit={handleTaskSubmit}>
            <div>
              <label>Title: </label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label>Description: </label>
              <input
                type="text"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
              />
            </div>
            <div>
              <label>Scheduled Date: </label>
              <input
                type="datetime-local"
                value={newTask.scheduled_date}
                onChange={(e) =>
                  setNewTask({ ...newTask, scheduled_date: e.target.value })
                }
              />
            </div>
            <div>
              <label>Task Type: </label>
              <select
                value={newTask.task_type}
                onChange={(e) =>
                  setNewTask({ ...newTask, task_type: e.target.value })
                }
              >
                <option value="Bellen">Bellen</option>
                <option value="Afspraak">Afspraak</option>
                <option value="Mailen">Mailen</option>
                <option value="Uitzoeken">Uitzoeken</option>
              </select>
            </div>
            <div>
              <label>Completed: </label>
              <input
                type="checkbox"
                checked={newTask.completed}
                onChange={(e) =>
                  setNewTask({ ...newTask, completed: e.target.checked })
                }
              />
            </div>
            <button type="submit">Add Task</button>
          </form>
        </div>
      )}
    </div>
  );
}
