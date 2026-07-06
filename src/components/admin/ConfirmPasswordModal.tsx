import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export function ConfirmPasswordModal({ isOpen, onClose, onConfirm, title = 'Xác nhận xóa tất cả', description = 'Hành động này không thể hoàn tác. Vui lòng nhập mật khẩu để tiếp tục.' }: Props) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin' || password === '123456') {
      onConfirm();
      setPassword('');
      setError('');
      onClose();
    } else {
      setError('Mật khẩu không chính xác');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 relative">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif italic">{title}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center bg-black/5 hover:bg-black/10 transition-colors">
            <X className="w-4 h-4 text-black" />
          </button>
        </div>
        
        <p className="text-sm text-black/60 mb-6">{description}</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">
              Mật khẩu xác nhận
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              placeholder="Nhập 'admin' để xác nhận"
              className="w-full px-4 py-3 bg-[#F3F2F0] border-none rounded-xl focus:ring-1 focus:ring-black outline-none transition-shadow"
              autoFocus
            />
            {error && <p className="text-red-600 text-xs mt-2 font-medium">{error}</p>}
          </div>
          
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-black/10 font-bold uppercase tracking-widest text-xs hover:bg-black/5 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold uppercase tracking-widest text-xs hover:bg-red-700 transition-colors"
            >
              Xóa tất cả
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
