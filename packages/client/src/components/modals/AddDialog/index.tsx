import { Dialog } from '@headlessui/react';

import React, { useState } from 'react';
import StyledDialog from '../StyledDialog';

import Input from '../../Input';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// import { Container } from './styles';

type AddDialogProps = {
  setOpen: (value: boolean) => void;
  open: boolean;
  addFunction: (data: FormData) => Promise<void>;
  type: string;
};

export type FormData = {
  name: string;
  description: string;
  value: number;
  data: Date;
  received?: boolean;
  type?: 'fixed' | 'variable';
  id?: string;
  since?: Date;
  at?: Date;
  payed?: boolean;
  userId?: string;
};

const AddDialog = ({ setOpen, open, addFunction, type }: AddDialogProps) => {
  const schema = yup.object({
    name: yup.string().required('O Nome é necessario'),
    description: yup.string(),
    value: yup
      .number()
      .required('o Valor é necessário')
      .positive('O valor precisa ser positivo')
      .typeError('O valor precisa ser um numero válido'),
    data: yup
      .date()
      .required('A data é necessário')
      .typeError('a data precisa ser uma data válida'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const [enabled, setEnabled] = useState(false);
  const [received, setReceived] = useState(false);

  const onSubmit = (data: FormData) => {
    if (enabled) {
      data.type = 'fixed';
    } else {
      data.type = 'variable';
      data.received = received;
    }

    addFunction(data as FormData);
    reset({});
    setEnabled(false);
    setReceived(false);
    setOpen(false);
  };

  return (
    <StyledDialog
      open={open}
      onClose={() => {
        reset();
        setOpen(false);
      }}
    >
      <Dialog.Title
        className={`text-${type == 'gain' ? 'green' : 'red'}-600 text-xl mb-4`}
      >
        {type == 'gain' ? 'Nova Receita' : 'Novo Gasto'}
      </Dialog.Title>
      <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto">
        <Input
          placeholder="Nome"
          registerObject={register('name')}
          error={errors.name?.message?.toString()}
        />
        <Input
          placeholder="Descrição"
          registerObject={register('description')}
          error={errors.description?.message?.toString()}
        />
        <Input
          placeholder="Valor"
          registerObject={register('value')}
          type="number"
          error={errors.value?.message?.toString()}
        />
        <Input
          placeholder="Data"
          registerObject={register('data')}
          type="date"
          error={errors.data?.message?.toString()}
        />

        <div className="flex justify-between pb-2">
          <div className="text-lg flex pb-4">
            <label className="mr-2" htmlFor="toggle">
              Fixo
            </label>
            <Toggle enabled={enabled} setEnabled={setEnabled} />
          </div>

          {enabled ? (
            ''
          ) : (
            <div className="text-lg flex pb-4">
              <label className="mr-2" htmlFor="toggle">
                {type == 'gain' ? 'Recebido' : 'Pago'}
              </label>
              <Toggle enabled={received} setEnabled={setReceived} />
            </div>
          )}
        </div>

        <div className="w-full">
          <button
            className={`p-2 ${
              type == 'gain' ? 'bg-green-600' : 'bg-red-600'
            } rounded text-white`}
          >
            Adicionar
          </button>
        </div>
      </form>
    </StyledDialog>
  );
};

import { Switch } from '@headlessui/react';

const Toggle = ({
  enabled,
  setEnabled,
}: {
  enabled: boolean;
  setEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="">
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={`${enabled ? 'bg-teal-900' : 'bg-teal-700'}
          relative inline-flex h-[30px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={`${enabled ? 'translate-x-9' : 'translate-x-0'}
            pointer-events-none inline-block h-[28px] w-[28px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
        />
      </Switch>
    </div>
  );
};

export default AddDialog;
