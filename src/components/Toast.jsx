import { useState, useEffect, useCallback } from 'react';
import { Zap } from 'lucide-react';

let _id = 0;
let _add = null;

export function showToast(data) { if (_add) _add({ ...data, id: ++_id }); }

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const add = useCallback(t => {
    setToasts(p => [...p, t]);
    setTimeout(() => {
      setToasts(p => p.map(x => x.id === t.id ? { ...x, removing: true } : x));
      setTimeout(() => setToasts(p => p.filter(x => x.id !== t.id)), 260);
    }, 3500);
  }, []);

  useEffect(() => { _add = add; return () => { _add = null; }; }, [add]);

  if (!toasts.length) return null;

  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className={`toast${t.removing ? ' removing' : ''}`}>
          <div className="toast-inner">
            <div className="toast-icon-wrap"><Zap size={15} /></div>
            <div>
              <div className="toast-quote">{t.quote}</div>
              <div className="toast-sub">{t.sub}</div>
            </div>
          </div>
          <div className="toast-progress" />
        </div>
      ))}
    </div>
  );
}
