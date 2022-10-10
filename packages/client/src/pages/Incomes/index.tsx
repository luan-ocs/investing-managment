import axios from 'axios';
import { addMonths, format, isAfter, subMonths } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import TableMonth from '../../components/TableMonth';
import { userContext } from '../../services/userProvider';
import AddDialog, { FormData } from '../../components/modals/AddDialog';
import { DashboardComponent } from '../Dashboard';
import EditDialog from '../../components/modals/edit';
import { DeleteDialog } from '../../components/modals/delete';

export type Gain = {
  id?: string;
  name: string;
  description?: string;
  value: number;
  since?: Date;
  at?: Date;
  received?: boolean;
  userId?: string;
};

const monthContext = createContext<MonthProvider>({
  actualDate: new Date(),
  setDate: () => null,
});

type MonthProvider = {
  actualDate: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
};

const Incomes: React.FC = () => {
  const [month, setMonth] = useState(new Date());
  const { user, axiosConfig } = useContext(userContext);
  const [incomes, setIncomes] = useState([] as FormData[]);
  const [addDialog, setAddDialog] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteGain, setDeleteGain] = useState<FormData | null>(null);
  const [editable, setEditable] = useState<FormData | null>(null);

  useEffect(() => {
    if (user?.id) {
      handleGetData();
    }
  }, [month]);

  const handleGetData = async () => {
    const response = await axios.get<FormData[]>(
      `http://${import.meta.env.VITE_SERVER_URL}/gain/${user?.id}/${
        month.getMonth() + 1
      }/${month.getFullYear()}`,
      axiosConfig,
    );

    setIncomes(
      response.data.map((gain) => {
        if (gain.received === undefined) {
          gain.received = isAfter(new Date(), month);
        }
        return gain;
      }),
    );
  };

  const handleDelete = (data: FormData | null) => {
    if (data?.since) {
      axios.delete(
        `http://${import.meta.env.VITE_SERVER_URL}/gain/fixed/${data.id}`,
        axiosConfig,
      );
    } else {
      axios.delete(
        `http://${import.meta.env.VITE_SERVER_URL}/gain/variable/${data?.id}`,
        axiosConfig,
      );
    }

    handleGetData();
  };

  const handleAddGain = async (data: FormData, edit = false) => {
    const gain = {
      name: data.name,
      description: data.description,
      value: data.value,
    } as Gain;
    if (data.type == 'fixed') {
      gain.since = data.data;
    } else {
      gain.at = data.data;
      gain.received = data.received;
    }

    gain.userId = user?.id;

    if (!edit) {
      await axios.post(
        `http://${import.meta.env.VITE_SERVER_URL}/gain/${data.type}`,
        gain,
        axiosConfig,
      );
    } else {
      gain.id = data.id;
      await axios.put(
        `http://${import.meta.env.VITE_SERVER_URL}/gain/${data.type}/${
          data.id
        }`,
        gain,
        axiosConfig,
      );
    }

    handleGetData();
  };

  return (
    <monthContext.Provider value={{ actualDate: month, setDate: setMonth }}>
      <div>
        <div className="flex">
          <button
            className="py-2 ml-2 px-2 bg-green-800 my-2 rounded text-white"
            onClick={() => setAddDialog(true)}
          >
            Adicionar Receita
          </button>
        </div>
        <IncomesResume
          total={incomes.reduce((prev, current) => prev + current.value, 0)}
          pending={incomes.reduce((prev, current) => {
            if (!current.received) {
              return prev + current.value;
            }
            return prev;
          }, 0)}
          received={incomes.reduce((prev, current) => {
            if (current.received) {
              return prev + current.value;
            }

            return prev;
          }, 0)}
        />
        <MonthSelect />
        <TableMonth
          type="gain"
          data={incomes}
          setEditOpen={setEditOpen}
          setEditable={setEditable}
          setDeleteOpen={setDeleteOpen}
          setDelete={setDeleteGain}
        />
        <AddDialog
          open={addDialog}
          setOpen={setAddDialog}
          addFunction={(data) => handleAddGain(data)}
          type="gain"
        />
        <EditDialog
          type="gain"
          open={editOpen}
          setOpen={setEditOpen}
          data={editable}
          addFunction={(data) => handleAddGain(data, true)}
        />
        <DeleteDialog
          type="Ganho"
          open={deleteOpen}
          setOpen={setDeleteOpen}
          data={deleteGain}
          deleteFunction={(data) => handleDelete(data)}
        />
      </div>
    </monthContext.Provider>
  );
};

const MonthSelect = () => {
  const { actualDate, setDate } = useContext(monthContext);

  const handleClick = () => {
    setDate((prev) => addMonths(prev, 1));
  };

  const handleClickReduceMonth = () => {
    setDate((prev) => subMonths(prev, 1));
    console.log(actualDate);
  };

  const toMonthName = () => {
    return format(actualDate, 'LLLL yyyy', { locale: ptBR });
  };

  return (
    <div className="flex justify-center mt-2 items-center">
      <button className="m-2 p-2" onClick={() => handleClickReduceMonth()}>
        <FiArrowLeft className="text-green-800" />
      </button>
      <div className="p-2 rounded border-2 border-green-800 text-green-800">
        {toMonthName()}
      </div>
      <button className="m-2 p-2" onClick={() => handleClick()}>
        <FiArrowRight className="text-green-800" />
      </button>
    </div>
  );
};

const IncomesResume = ({
  pending = 0,
  received = 0,
  total = 0,
}: {
  pending?: number;
  received?: number;
  total?: number;
}) => {
  return (
    <div className="grid grid-cols-3 grid-rows-auto ">
      <DashboardComponent>
        <span className="text-sm text-gray-500">Suas receitas pendentes</span>
        <p className={`text-green-800`}>R${pending.toFixed(2)}</p>
      </DashboardComponent>
      <DashboardComponent>
        <span className="text-sm text-gray-500">Suas receitas recebidas</span>
        <p className={`text-green-800`}>R${received.toFixed(2)}</p>
      </DashboardComponent>
      <DashboardComponent>
        <span className="text-sm text-gray-500">Total</span>
        <p className={`text-green-800`}>R${total.toFixed(2)}</p>
      </DashboardComponent>
    </div>
  );
};
export default Incomes;
