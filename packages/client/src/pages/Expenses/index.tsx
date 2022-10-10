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

const monthContext = createContext<MonthProvider>({
  actualDate: new Date(),
  setDate: () => null,
});

type MonthProvider = {
  actualDate: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
};

const Expenses: React.FC = () => {
  const [month, setMonth] = useState(new Date());
  const { user, axiosConfig } = useContext(userContext);
  const [expenses, setIncomes] = useState([] as FormData[]);
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
      `http://${import.meta.env.VITE_SERVER_URL}/expense/${user?.id}/${
        month.getMonth() + 1
      }/${month.getFullYear()}`,
      axiosConfig,
    );

    setIncomes(
      response.data.map((expense) => {
        if (expense.payed === undefined) {
          expense.payed = isAfter(new Date(), month);
        }
        return expense;
      }),
    );
  };

  const handleDelete = (data: FormData | null) => {
    if (data?.since) {
      axios.delete(
        `http://${import.meta.env.VITE_SERVER_URL}/expense/fixed/${data.id}`,
        axiosConfig,
      );
    } else {
      axios.delete(
        `http://${import.meta.env.VITE_SERVER_URL}/expense/variable/${
          data?.id
        }`,
        axiosConfig,
      );
    }

    handleGetData();
  };

  const handleAddGain = async (data: FormData, edit = false) => {
    const expense = {
      name: data.name,
      description: data.description,
      value: data.value,
    } as FormData;
    if (data.type == 'fixed') {
      expense.since = data.data;
    } else {
      expense.at = data.data;
      expense.received = data.received;
    }

    expense.userId = user?.id;

    if (!edit) {
      await axios.post(
        `http://${import.meta.env.VITE_SERVER_URL}/expense/${data.type}`,
        expense,
        axiosConfig,
      );
    } else {
      expense.id = data.id;
      await axios.put(
        `http://${import.meta.env.VITE_SERVER_URL}/expense/${data.type}/${
          data.id
        }`,
        expense,
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
            className="py-2 ml-2 px-2 bg-red-800 my-2 rounded text-white"
            onClick={() => setAddDialog(true)}
          >
            Adicionar Gasto
          </button>
        </div>
        <ExpensesResume
          total={expenses.reduce((prev, current) => prev + current.value, 0)}
          pending={expenses.reduce((prev, current) => {
            if (!current.payed) {
              return prev + current.value;
            }
            return prev;
          }, 0)}
          received={expenses.reduce((prev, current) => {
            if (current.payed) {
              return prev + current.value;
            }

            return prev;
          }, 0)}
        />
        <MonthSelect />
        <TableMonth
          type="expense"
          data={expenses}
          setEditOpen={setEditOpen}
          setEditable={setEditable}
          setDeleteOpen={setDeleteOpen}
          setDelete={setDeleteGain}
        />
        <AddDialog
          open={addDialog}
          setOpen={setAddDialog}
          addFunction={(data) => handleAddGain(data)}
          type="expense"
        />
        <EditDialog
          type="expense"
          open={editOpen}
          setOpen={setEditOpen}
          data={editable}
          addFunction={(data) => handleAddGain(data, true)}
        />
        <DeleteDialog
          type="Gasto"
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
        <FiArrowLeft className="text-red-800" />
      </button>
      <div className="p-2 rounded border-2 border-red-800 text-red-800">
        {toMonthName()}
      </div>
      <button className="m-2 p-2" onClick={() => handleClick()}>
        <FiArrowRight className="text-red-800" />
      </button>
    </div>
  );
};

const ExpensesResume = ({
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
        <span className="text-sm text-gray-500">Seus Gastos pendentes</span>
        <p className={`text-red-800`}>R${pending.toFixed(2)}</p>
      </DashboardComponent>
      <DashboardComponent>
        <span className="text-sm text-gray-500">Suas Gastos pagos</span>
        <p className={`text-red-800`}>R${received.toFixed(2)}</p>
      </DashboardComponent>
      <DashboardComponent>
        <span className="text-sm text-gray-500">Total</span>
        <p className={`text-red-800`}>R${total.toFixed(2)}</p>
      </DashboardComponent>
    </div>
  );
};
export default Expenses;
