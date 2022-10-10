import { AxiosRequestConfig } from 'axios';
import { createContext, useEffect, useState } from 'react';

export const userContext = createContext<UserContext>({
  setUser: () => null,
  axiosConfig: {},
});

type User = {
  name?: string;
  email?: string;
  password?: string;
  id?: string;
  token?: string;
};

type UserContext = {
  user?: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  axiosConfig: AxiosRequestConfig;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>({});

  const axiosConfig: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  useEffect(() => {
    const storagedUser = localStorage.getItem('user');
    if (storagedUser && storagedUser) {
      const parsedUser = JSON.parse(storagedUser);
      const now = Date.now() / 1000;
      const extraTime = parsedUser.exp - now;

      if (extraTime > 0) {
        setUser(parsedUser);
      } else {
        localStorage.removeItem('user');
      }
    }
  }, []);

  return (
    <userContext.Provider value={{ user, setUser, axiosConfig }}>
      {children}
    </userContext.Provider>
  );
};
