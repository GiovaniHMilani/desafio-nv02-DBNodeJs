import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const allTransactions = await this.find();
    let income = 0;
    let outcome = 0;

    const calculate = (type: 'income' | 'outcome', value: number): void => {
      if (type === 'income') {
        income += value;
      } else {
        outcome += value;
      }
    };

    allTransactions.forEach(transaction =>
      calculate(transaction.type, transaction.value),
    );

    return {
      income,
      outcome,
      total: income - outcome,
    };
  }
}

export default TransactionsRepository;
