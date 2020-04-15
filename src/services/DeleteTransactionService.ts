import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionsRepository);

    const transaction = await transactionRepository.findOne(id);

    console.log(id);

    if (!transaction) {
      throw new AppError('Transaction not exists');
    }

    await transactionRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
