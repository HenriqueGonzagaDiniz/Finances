import { useEffect, type ReactNode } from 'react';

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function SideMenu({ open, onClose, children }: SideMenuProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 transition-opacity"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed top-0 left-0 h-full w-[300px] max-w-[80vw] bg-surface z-50 shadow-2xl transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-container-margin h-16 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              savings
            </span>
            <span className="font-headline-md text-headline-md font-bold text-primary">Finances</span>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100%-64px)] p-4">
          {children}
        </div>
      </div>
    </>
  );
}
