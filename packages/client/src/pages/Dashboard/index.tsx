import React, { Children, useContext } from 'react';
import { userContext } from '../../services/userProvider';

// import { Container } from './styles';

const Dashboard: React.FC = () => {
  const { user } = useContext(userContext);

  return (
    <div className="px-4">
      <HelloComponent name={user?.name} />
      <BalanceComponent
        balance={500000}
        savings={13580}
        totalGains={5000}
        totalExpenses={8000}
      />
    </div>
  );
};

const HelloComponent = ({ name }: { name?: string }) => {
  return (
    <div className="mt-2 text-lg">
      <span>Olá, {name}</span>
    </div>
  );
};

const DashboardComponent = ({
  children,
  width,
  mobileWidth,
}: {
  children: React.ReactNode;
  width: string;
  mobileWidth: string;
}) => {
  return (
    <div
      className={`rounded bg-slate-200 mt-2 py-2 mr-2 md:col-auto col-2 row-auto`}
    >
      {children}
    </div>
  );
};

const BalanceComponent = ({
  balance,
  savings,
  totalGains,
  totalExpenses,
}: {
  balance: number;
  savings: number;
  totalGains: number;
  totalExpenses: number;
}) => {
  return (
    <div className="grid md:grid-cols-4  grid-cols-2 grid-rows-2">
      <DashboardComponent width="1/5" mobileWidth="1/3">
        <div>
          <p>Sua Carteira</p>
          <span className="text-sm text-gray-500">Seu Balanço</span>
          <p className={`${balance >= 0 ? 'text-green-800' : 'text-red-800'}`}>
            R${balance.toFixed(2)}
          </p>
          <span className="text-xs text-gray-500">
            Seu patrimonio total: R${savings.toFixed(2)}
          </span>
        </div>
      </DashboardComponent>
      <DashboardComponent width="1/5" mobileWidth="1/3">
        <div>
          <p className="text-green-800">Ganhos</p>
          <span className="text-sm text-gray-500">
            Seus ganhos totais este mês
          </span>
          <p className="text-green-800">R${totalGains.toFixed(2)}</p>
        </div>
      </DashboardComponent>
      <DashboardComponent width="1/5" mobileWidth="1/3">
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
      <DashboardComponent width="1/5" mobileWidth="1/3">
        <div>
          <p className="text-cyan-800">Cartão de credito</p>
          <span className="text-sm text-gray-500">
            Suas despesas no cartão de credito
          </span>
          <p className="text-cyan-800">R${totalGains.toFixed(2)}</p>
        </div>
      </DashboardComponent>
    </div>
  );
};

export default Dashboard;
