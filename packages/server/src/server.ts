import { app } from './app';
import dotenv from 'dotenv';

dotenv.config();

const port = 3001;

app.listen(port, () => {
  console.log(`[Running Log] Sucessfull build project`);
  console.log(`[Running Log] Running on port ${port}`);
});
