import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/Header';

const Main: React.FC = () => {
  return (
    <div>
      <Header
        navigationOptions={[
          {
            path: '',
            name: 'Dashboard',
          },
          {
            path: 'ganhos',
            name: 'Ganhos',
          },
          {
            path: 'gastos',
            name: 'Gastos',
          },
          {
            path: 'perfil',
            name: 'Perfil',
          },
        ]}
      />
      <Outlet />
    </div>
  );
};

export default Main;
