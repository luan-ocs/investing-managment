import React, { PropsWithChildren } from 'react';
import { Dialog } from '@headlessui/react';
// import { Container } from './styles';

interface StyledDialog extends PropsWithChildren {
  open: boolean;
  onClose: () => void;
}

const StyledDialog: React.FC<StyledDialog> = ({ children, open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true">
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-12 md:w-1/2 md:max-w-xl">
            {children}
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default StyledDialog;
