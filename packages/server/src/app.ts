import express from 'express';
import cors from 'cors';
import { authenticate } from './passport';
import { getUser, save } from './api/user';
import {
  addFixedGain,
  getGains,
  deleteFixedGain,
  getGainById,
  addVariableGain,
  deleteVariableGain,
} from './api/gain';
import {
  addFixedexpenses,
  addVariableexpenses,
  deleteFixedexpenses,
  deleteVariableexpenses,
  getExpenses,
  getexpensesById,
} from './api/expenses';
import { login, register } from './api/auth';

const app = express();

app.use(express.json());
app.use(cors());

app.route('/signIn').post(login);
app.route('/signUp').post(register);

app.route('/users').all(authenticate()).post(save).get(getUser);
app.route('users/:id').all(authenticate()).put(save);

app.route('/gain/fixed').all(authenticate()).post(addFixedGain);
app
  .route('/gain/fixed/:id')
  .all(authenticate())
  .put(addFixedGain)
  .delete(deleteFixedGain);
app.route('/gain/variable').all(authenticate()).post(addVariableGain);

app
  .route('/gain/variable/:id')
  .all(authenticate())
  .put(addVariableGain)
  .delete(deleteVariableGain);

app.route('/gain/:id').all(authenticate()).get(getGainById);
app.route('/gain/:id/:month/:year').all(authenticate()).get(getGains);

app.route('/expense/fixed').all(authenticate()).post(addFixedexpenses);
app
  .route('/expense/fixed/:id')
  .all(authenticate())
  .put(addFixedexpenses)
  .delete(deleteFixedexpenses);
app.route('/expense/variable').all(authenticate()).post(addVariableexpenses);
app
  .route('/expense/variable/:id')
  .all(authenticate())
  .put(addVariableexpenses)
  .delete(deleteVariableexpenses);
app.route('/expense/:id').all(authenticate()).get(getexpensesById);
app.route('/expense/:id/:month/:year').all(authenticate()).get(getExpenses);

export { app };
