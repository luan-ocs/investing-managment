import React, { useContext, useEffect, useState } from 'react';
import { userContext } from '../../services/userProvider';
import DoughnutChart from '../../components/Doughnut';
import { FormData } from '../../components/modals/AddDialog';
import axios from 'axios';
// import { Container } from './styles';

const Dashboard: React.FC = () => {
  const { user, axiosConfig } = useContext(userContext);

  const [gains, setGains] = useState<FormData[]>([]);
  const [expenses, setExpenses] = useState<FormData[]>([]);

  useEffect(() => {
    handleGetData();
  }, []);

  const totalGains = gains.reduce((prev, current) => prev + current.value, 0);
  const totalExpenses = expenses.reduce(
    (prev, current) => prev + current.value,
    0,
  );

  const handleGetData = async () => {
    const responseGains = await axios.get<FormData[]>(
      `http://${import.meta.env.VITE_SERVER_URL}/gain/${user?.id}/${
        new Date().getMonth() + 1
      }/${new Date().getFullYear()}`,
      axiosConfig,
    );

    const responseExpense = await axios.get<FormData[]>(
      `http://${import.meta.env.VITE_SERVER_URL}/expense/${user?.id}/${
        new Date().getMonth() + 1
      }/${new Date().getFullYear()}`,
      axiosConfig,
    );

    setGains(responseGains.data);
    setExpenses(responseExpense.data);
  };

  return (
    <div className="px-4 py-2">
      <HelloComponent name={user?.name} />
      <BalanceComponent
        totalGains={totalGains}
        totalExpenses={totalExpenses}
        balance={totalGains - totalExpenses}
      />
      <ChartsComponent gain={gains} expense={expenses} />
    </div>
  );
};

const ChartsComponent = ({
  gain,
  expense,
}: {
  gain: FormData[];
  expense: FormData[];
}) => {
  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  return (
    <div className="grid md:grid-cols-2 grid-cols-1 grid-rows-auto mt-2">
      <div className="rounded bg-slate-200 w-full row-auto col-auto flex justify-center md:mr-2 py-2">
        <DoughnutChart
          ChartTitle="Despesas do mês"
          link={{
            path: '/gastos',
            label: 'VER MAIS',
          }}
          dataElements={expense.map((exp) => {
            return {
              name: exp.name,
              value: exp.value,
              color: getRandomColor(),
            };
          })}
        />
      </div>
      <div className="rounded bg-slate-200 w-full md:ml-2 row-auto col-auto">
        <div className="rounded bg-slate-200 w-full row-auto col-auto flex justify-center md:mr-2 py-2">
          <DoughnutChart
            ChartTitle="Receitas do mês"
            link={{
              path: '/ganhos',
              label: 'VER MAIS',
            }}
            dataElements={gain.map((gain) => {
              return {
                name: gain.name,
                value: gain.value,
                color: getRandomColor(),
              };
            })}
          />
        </div>
      </div>
    </div>
  );
};

const HelloComponent = ({ name }: { name?: string }) => {
  return (
    <div className="mt-2 ml-2 text-lg">
      <span>Olá, {name}</span>
    </div>
  );
};

export const DashboardComponent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div
      className={`rounded bg-slate-200 mt-2 py-2 ml-2 px-2 md:col-auto col-2 row-auto`}
    >
      {children}
    </div>
  );
};

const BalanceComponent = ({
  balance = 0,
  totalGains = 0,
  totalExpenses = 0,
}: {
  balance?: number;
  totalGains?: number;
  totalExpenses?: number;
}) => {
  return (
    <div className="grid md:grid-cols-4  grid-cols-2 grid-rows-1">
      <DashboardComponent>
        <div>
          <p>Sua Carteira</p>
          <span className="text-sm text-gray-500">Seu Balanço</span>
          <p className={`${balance >= 0 ? 'text-green-800' : 'text-red-800'}`}>
            R${balance.toFixed(2)}
          </p>
        </div>
      </DashboardComponent>
      <DashboardComponent>
        <div>
          <p className="text-green-800">Ganhos</p>
          <span className="text-sm text-gray-500">
            Seus ganhos totais este mês
          </span>
          <p className="text-green-800">R${totalGains.toFixed(2)}</p>
        </div>
      </DashboardComponent>
      <DashboardComponent>
        <div>
          <p className="text-red-800">Despesas</p>
          <span className="text-sm text-gray-500">
            Suas despesas totais este mês
          </span>
          <p className="text-red-800">R${totalExpenses.toFixed(2)}</p>
          <span className="text-xs text-gray-500">
            {((totalExpenses / totalGains) * 100).toFixed(2)}% dos seus ganhos.
          </span>
        </div>
      </DashboardComponent>
      <DashboardComponent>
        <div>
          <p className="text-cyan-800">Cartão de credito</p>
          <span className="text-sm text-gray-500">
            Suas despesas no cartão de credito
          </span>
          <p className="text-cyan-800">EM BREVE</p>
        </div>
      </DashboardComponent>
    </div>
  );
};

export default Dashboard;
