import { useState, useEffect, useMemo } from 'react';
import {
  Layers, Search, SlidersHorizontal,
  Plus, Circle, Target, CheckCheck,
  ClipboardList, Zap
} from 'lucide-react';
import './App.css';
import TaskForm, { getRandomQuote } from './components/TaskForm';
import TaskCard                     from './components/TaskCard';
import ConfirmDelete                from './components/ConfirmDelete';
import ToastContainer, { showToast } from './components/Toast';

const STORAGE_KEY = 'kanflow-asignment-final';

const COLUMNS = [
  {
    id: 'Todo',
    label: 'To Do',
    cls: 'col-todo',
    Icon: ClipboardList,
    empty: { Icon: Target, title: 'No tasks yet', sub: 'Hit "New task" to add one.' },
  },
  {
    id: 'In Progress',
    label: 'In Progress',
    cls: 'col-progress',
    Icon: Zap,
    empty: { Icon: Zap, title: 'Nothing in progress', sub: 'Move a task here to start.' },
  },
  {
    id: 'Completed',
    label: 'Completed',
    cls: 'col-done',
    Icon: CheckCheck,
    empty: { Icon: CheckCheck, title: 'No wins yet', sub: 'Complete a task to see it here.' },
  },
];

const load  = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; } };
const save  = t  => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(t)); } catch {} };

export default function App() {
  const [tasks,          setTasks]  = useState(load);
  const [showForm,       setForm]   = useState(false);
  const [editTask,       setEdit]   = useState(null);
  const [deleteId,       setDel]    = useState(null);
  const [search,         setSearch] = useState('');
  const [filterPriority, setFP]     = useState('All');
  const [filterStatus,   setFS]     = useState('All');

  useEffect(() => save(tasks), [tasks]);

  function addTask(data) {
    setTasks(p => [{ ...data, id: crypto.randomUUID(), createdAt: Date.now() }, ...p]);
    showToast(getRandomQuote());
  }

  function updateTask(data) {
    setTasks(p => p.map(t => t.id === editTask.id ? { ...t, ...data } : t));
    setEdit(null);
    showToast({ quote: 'Task updated.', sub: 'Changes saved.' });
  }

  function deleteTask() {
    setTasks(p => p.filter(t => t.id !== deleteId));
    setDel(null);
  }

  function moveTask(id, status) {
    setTasks(p => p.map(t => t.id === id ? { ...t, status } : t));
    const msgs = {
      'In Progress': { quote: 'Task is now in progress.', sub: 'Keep the momentum.' },
      'Completed':   { quote: 'Task completed!',          sub: 'One more win on the board.' },
      'Todo':        { quote: 'Task moved back to queue.', sub: 'Ready when you are.' },
    };
    showToast(msgs[status]);
  }

  const delInfo = useMemo(() => deleteId ? tasks.find(t => t.id === deleteId) : null, [deleteId, tasks]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return tasks.filter(t => {
      if (q && !t.title.toLowerCase().includes(q) && !t.description?.toLowerCase().includes(q)) return false;
      if (filterPriority !== 'All' && t.priority !== filterPriority) return false;
      if (filterStatus   !== 'All' && t.status   !== filterStatus)   return false;
      return true;
    });
  }, [tasks, search, filterPriority, filterStatus]);

  const hasFilter   = search || filterPriority !== 'All' || filterStatus !== 'All';
  const hasNoResult = hasFilter && filtered.length === 0;

  return (
    <div className="app">
      {}
      <header className="header">
        <div className="header-brand">
          <div className="brand-icon"><Layers size={16} /></div>
          <span className="brand-name">Kan<b>Flow</b></span>
        </div>

        <div className="header-sep" />

        <div className="search-wrap">
          <span className="search-icon"><Search size={13} /></span>
          <input className="search-input" placeholder="Search tasks…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <select className="filter-select" value={filterPriority} onChange={e => setFP(e.target.value)}>
          <option value="All">All priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select className="filter-select" value={filterStatus} onChange={e => setFS(e.target.value)}>
          <option value="All">All statuses</option>
          <option value="Todo">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <div className="header-right">
          <button className="add-btn" onClick={() => setForm(true)}>
            <Plus size={14} /> New task
          </button>
        </div>
      </header>

      {}
      <main className="board">
        {hasNoResult ? (
          <div className="no-results-wrap" style={{gridColumn:'1/-1'}}>
            <Search size={28} style={{opacity:.25,marginBottom:8}} />
            <h3>No tasks match your filters</h3>
            <p>Try a different search term or clear the filters.</p>
          </div>
        ) : (
          COLUMNS.map(col => {
            const colTasks = filtered.filter(t => t.status === col.id);
            const EIcon = col.empty.Icon;
            return (
              <div key={col.id} className={`column ${col.cls}`}>
                <div className="col-header">
                  <div className="col-title-wrap">
                    <div className="col-stripe" />
                    <span className="col-name">{col.label}</span>
                  </div>
                  <span className="col-count">{colTasks.length}</span>
                </div>
                <div className="col-body">
                  {colTasks.length === 0 ? (
                    <div className="empty-state">
                      <EIcon size={22} className="empty-icon" />
                      <div className="empty-title">{col.empty.title}</div>
                      <div className="empty-sub">{col.empty.sub}</div>
                    </div>
                  ) : (
                    colTasks.map(task => (
                      <TaskCard key={task.id} task={task}
                        onDelete={id => setDel(id)}
                        onEdit={t  => setEdit(t)}
                        onMove={moveTask} />
                    ))
                  )}
                </div>
              </div>
            );
          })
        )}
      </main>

      {}
      {showForm  && <TaskForm onSubmit={addTask}    onClose={() => setForm(false)} />}
      {editTask  && <TaskForm onSubmit={updateTask} onClose={() => setEdit(null)} editTask={editTask} />}
      {deleteId && delInfo && (
        <ConfirmDelete taskTitle={delInfo.title} onConfirm={deleteTask} onClose={() => setDel(null)} />
      )}

      <ToastContainer />
    </div>
  );
}
