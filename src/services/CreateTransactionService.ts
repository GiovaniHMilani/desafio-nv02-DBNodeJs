import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Categories from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
  imp?: boolean;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    imp = false,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Categories);
    let newCategory;
    const categoryInstance = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!categoryInstance) {
      newCategory = categoryRepository.create({ title: category });
      await categoryRepository.save(newCategory);
    }
    if (!imp) {
      const balance = await transactionRepository.getBalance();

      if (type === 'outcome' && balance.total < value) {
        throw new AppError('Valor em caixa insuficiente');
      }
    }

    const transaction = transactionRepository.create({
      title,
      type,
      value,
      category_id: categoryInstance?.id ? categoryInstance.id : newCategory?.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
