import { useState, useEffect } from 'react';
import { Trash2, X } from 'lucide-react';

export default function ConfirmDelete({ taskTitle, onConfirm, onClose }) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const h = e => {
      if (e.key === 'Escape') close();
      if (e.key === 'Enter')  confirm();
    };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, []);

  function close()   { setClosing(true); setTimeout(onClose,   180); }
  function confirm() { setClosing(true); setTimeout(onConfirm, 180); }

  return (
    <div className={`modal-backdrop${closing ? ' closing' : ''}`}
         onClick={e => e.target === e.currentTarget && close()}>
      <div className={`confirm-modal${closing ? ' closing' : ''}`} role="dialog" aria-modal="true">
        <div className="confirm-body">
          <div className="confirm-icon-wrap"><Trash2 size={20} /></div>
          <h2 className="confirm-title">Delete task?</h2>
          <p className="confirm-sub">
            "<strong>{taskTitle}</strong>" will be removed permanently.
          </p>
        </div>
        <div className="confirm-footer">
          <button className="btn-cancel" onClick={close}>Keep it</button>
          <button className="btn-danger" onClick={confirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}
