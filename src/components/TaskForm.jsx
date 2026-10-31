import { useState, useEffect, useRef } from 'react';
import { X, Plus, Pencil, LayoutList } from 'lucide-react';

const QUOTES = [
  { quote: "You didn't wait. You executed.", sub: "That's what separates builders from dreamers." },
  { quote: "Task locked in. Now go make it happen.", sub: "Momentum starts with a single step." },
  { quote: "Every task you log is a promise to yourself.", sub: "Keep it. Finish it." },
  { quote: "Clarity is the first form of progress.", sub: "You just got clearer." },
  { quote: "Small commitments build massive results.", sub: "This one counts." },
  { quote: "You planned it. Now own it.", sub: "Execution is everything." },
  { quote: "Ideas become real when you write them down.", sub: "Good start. Now finish." },
  { quote: "The disciplined mind always wins.", sub: "Keep adding. Keep shipping." },
  { quote: "One more task, one step closer.", sub: "Compound it daily." },
  { quote: "Done starts with added.", sub: "You're already ahead of who you were." },
  { quote: "No waiting. No excuses. Just work.", sub: "Task added. Ball's in your court." },
  { quote: "Structure beats motivation every time.", sub: "Your board is getting stronger." },
];

export function getRandomQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

const PRIORITIES = ['Low', 'Medium', 'High'];
const STATUSES   = ['Todo', 'In Progress', 'Completed'];

function validate(data) {
  const e = {};
  if (!data.title.trim()) e.title = 'Title is required.';
  else if (data.title.trim().length < 3) e.title = 'At least 3 characters.';
  return e;
}

export default function TaskForm({ onSubmit, onClose, editTask }) {
  const isEdit = !!editTask;
  const [form, setForm] = useState({
    title:       editTask?.title       || '',
    description: editTask?.description || '',
    priority:    editTask?.priority    || 'Medium',
    status:      editTask?.status      || 'Todo',
    dueDate:     editTask?.dueDate     || '',
  });
  const [errors,  setErrors]  = useState({});
  const [closing, setClosing] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => { setTimeout(() => titleRef.current?.focus(), 80); }, []);
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') triggerClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, []);

  function triggerClose() { setClosing(true); setTimeout(onClose, 180); }

  function set(field) {
    return e => {
      setForm(f => ({ ...f, [field]: e.target.value }));
      if (errors[field]) setErrors(er => ({ ...er, [field]: undefined }));
    };
  }

  function handleSubmit() {
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); titleRef.current?.focus(); return; }
    onSubmit({ ...form, title: form.title.trim(), description: form.description.trim() });
    triggerClose();
  }

  return (
    <div className={`modal-backdrop${closing ? ' closing' : ''}`}
         onClick={e => e.target === e.currentTarget && triggerClose()}>
      <div className={`task-modal${closing ? ' closing' : ''}`} role="dialog" aria-modal="true">

        <div className="modal-header">
          <div className="modal-title">
            <div className="modal-title-icon">
              {isEdit ? <Pencil size={14} /> : <Plus size={14} />}
            </div>
            {isEdit ? 'Edit task' : 'New task'}
          </div>
          <button className="close-btn" onClick={triggerClose} aria-label="Close">
            <X size={15} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input ref={titleRef}
              className={`form-input${errors.title ? ' error' : ''}`}
              placeholder="What needs to get done?"
              value={form.title} onChange={set('title')}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              maxLength={100} />
            {errors.title && <span className="error-msg"><X size={11} /> {errors.title}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Description <span style={{opacity:.5,fontWeight:400}}>(optional)</span></label>
            <textarea className="form-textarea"
              placeholder="Steps, context, or notes..."
              value={form.description} onChange={set('description')} maxLength={500} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-select" value={form.priority} onChange={set('priority')}>
                {PRIORITIES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={form.status} onChange={set('status')}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Due date <span style={{opacity:.5,fontWeight:400}}>(optional)</span></label>
            <input type="date" className="form-input"
              value={form.dueDate} onChange={set('dueDate')}
              style={{ colorScheme: 'dark' }} />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={triggerClose}>Cancel</button>
          <button className="btn-submit" onClick={handleSubmit}>
            {isEdit ? 'Save changes' : 'Add task'}
          </button>
        </div>
      </div>
    </div>
  );
}
