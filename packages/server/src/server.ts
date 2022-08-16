import { app } from './app';
import { authRouter } from './routes/authRoutes';
import { userRoutes } from './routes/userRoutes';

const port = 3001;

app.use(authRouter);
app.use(userRoutes);

app.listen(port, () => {
  console.log(`[Running Log] Sucessfull build project`);
  console.log(`[Running Log] Running on port ${port}`);
});
