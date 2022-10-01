import { AppRoutes } from './services/routes';
import { UserProvider } from './services/userProvider';

function App() {
  return (
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  );
}

export default App;
