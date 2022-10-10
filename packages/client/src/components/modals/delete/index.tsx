import { Dialog } from '@headlessui/react';
import StyledDialog from '../StyledDialog';
import { FormData } from '../AddDialog';

type EditDialogProps = {
  setOpen: (value: boolean) => void;
  open: boolean;
  deleteFunction: (data: FormData | null) => void;
  type: 'Ganho' | 'Gasto';
  data: FormData | null;
};

export const DeleteDialog = ({
  data,
  setOpen,
  open,
  deleteFunction,
  type,
}: EditDialogProps) => {
  return (
    <StyledDialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <Dialog.Title className={`text-red-600 text-xl mb-4 text-center`}>
        Deletar {type}
      </Dialog.Title>
      <div className="w-full text-center">
        <p className="text-red-600">
          Tem certeza que deseja deletar este {type}?
        </p>
        <div className="flex justify-center">
          <button
            className={`p-2 bg-red-600 rounded text-white mt-8`}
            onClick={() => {
              deleteFunction(data);
              setOpen(false);
            }}
          >
            Deletar
          </button>
        </div>
      </div>
    </StyledDialog>
  );
};
