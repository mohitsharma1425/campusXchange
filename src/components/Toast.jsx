import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const icons = {
  success: <CheckCircle size={16}/>,
  error:   <AlertCircle size={16}/>,
  info:    <Info size={16}/>,
};

export default function ToastContainer() {
  const { toasts } = useApp();
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type||'info'}`}>
          {icons[t.type||'info']}
          <span style={{flex:1}}>{t.text}</span>
        </div>
      ))}
    </div>
  );
}
