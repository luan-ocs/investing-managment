import { createContext, useEffect, useState } from 'react';

export const userContext = createContext<UserContext>({
  setUser: () => null,
});

type User = {
  name?: string;
  email?: string;
  password?: string;
};

type UserContext = {
  user?: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState({});

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
    <userContext.Provider value={{ user, setUser }}>
      {children}
    </userContext.Provider>
  );
};
