import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

// import { Container } from './styles';

type HeaderProps = {
  navigationOptions: string[];
};
const Header: React.FC<HeaderProps> = ({ navigationOptions }) => {
  const location = useLocation();

  const currentLocation = location.pathname.split('/')[1];

  return (
    <nav className="flex bg-green-600 text-white px-4 lg:px-6 py-2 justify-between bg-fixed">
      <div className="flex flex-wrap justify-between items-center flex-shink-0">
        <span className="text-xl font-semibold whitespace-nowrap">
          Investing Managment
        </span>
      </div>

      <div className="flex items-center bg-green-800 p-2 shadow-inner rounded-lg">
        {navigationOptions.map((element) => (
          <MenuItem key={element} active={currentLocation === element}>
            {element}
          </MenuItem>
        ))}
      </div>
    </nav>
  );
};

const MenuItem = ({
  children,
  active,
}: {
  children: string;
  active: boolean;
}) => {
  return (
    <Link
      to={children}
      className={`p-2 text-lg md:text-md rounded-lg ${
        active && 'bg-green-400'
      }`}
    >
      {children}
    </Link>
  );
};

export default Header;
