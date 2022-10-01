import { Expense } from '../../entities/Expense';

export interface IExpenseRepository {
  addExpense(expense: Expense): Promise<boolean>;
  removeExpense(expense: Expense): Promise<boolean>;
  updateExpense(expense: Expense): Promise<boolean>;
  findExpenseById(id: string): Promise<Expense>;
}
