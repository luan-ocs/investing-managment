import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/Header';

const Main: React.FC = () => {
  return (
    <div>
      <Header navigationOptions={['Dashboard', 'Ganhos', 'Gastos', 'Perfil']} />
      <Outlet />
    </div>
  );
};

export default Main;
