import { Pencil, Trash2, Calendar, ArrowRight, ChevronsLeft, CheckCircle2 } from 'lucide-react';

function isOverdue(d) { return d && new Date(d) < new Date(new Date().toDateString()); }
function fmtDate(d) {
  if (!d) return null;
  return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

const PRIORITY_DOT = {
  High:   <span style={{width:7,height:7,borderRadius:'50%',background:'var(--rose)',   display:'inline-block',flexShrink:0}} />,
  Medium: <span style={{width:7,height:7,borderRadius:'50%',background:'var(--amber)',  display:'inline-block',flexShrink:0}} />,
  Low:    <span style={{width:7,height:7,borderRadius:'50%',background:'var(--emerald)',display:'inline-block',flexShrink:0}} />,
};

export default function TaskCard({ task, onDelete, onEdit, onMove }) {
  const overdue = isOverdue(task.dueDate);

  const moves = [
    task.status !== 'Todo'        && { key:'Todo',        label:'To Do',    cls:'to-todo',     Icon: ChevronsLeft  },
    task.status !== 'In Progress' && { key:'In Progress', label:'Progress', cls:'to-progress', Icon: ArrowRight    },
    task.status !== 'Completed'   && { key:'Completed',   label:'Done',     cls:'to-done',     Icon: CheckCircle2  },
  ].filter(Boolean);

  return (
    <div className="task-card">
      <div className="card-top">
        <span className="card-title">{task.title}</span>
        <div className="card-actions">
          <button className="icon-btn edit"   onClick={() => onEdit(task)}    title="Edit"><Pencil size={13} /></button>
          <button className="icon-btn delete" onClick={() => onDelete(task.id)} title="Delete"><Trash2 size={13} /></button>
        </div>
      </div>

      {task.description && <p className="card-desc">{task.description}</p>}

      <div className="card-meta">
        <span className={`priority-badge ${task.priority}`}
          style={{display:'flex',alignItems:'center',gap:5}}>
          {PRIORITY_DOT[task.priority]} {task.priority}
        </span>
        {task.dueDate && (
          <span className={`due-badge${overdue ? ' overdue' : ''}`}>
            <Calendar size={10} /> {fmtDate(task.dueDate)}
          </span>
        )}
      </div>

      {moves.length > 0 && (
        <div className="card-move">
          {moves.map(({ key, label, cls, Icon }) => (
            <button key={key} className={`move-btn ${cls}`} onClick={() => onMove(task.id, key)}>
              <Icon size={11} />
              <span className="move-label">{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
