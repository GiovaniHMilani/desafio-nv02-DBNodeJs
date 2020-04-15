import path from 'path';
import csv from 'csvtojson';
import fs from 'fs';

import CreateTransactionService from './CreateTransactionService';

import Transaction from '../models/Transaction';
import uploadConfig from '../config/upload';

interface Request {
  csvFilename: string;
}

interface CSV {
  title: string;
  type: 'income' | 'outcome';
  value: string;
  category: string;
}

class ImportTransactionsService {
  async execute({ csvFilename }: Request): Promise<Transaction[]> {
    const createTransactionService = new CreateTransactionService();
    const csvPath = path.join(uploadConfig.directory, csvFilename);

    const valor = await csv().fromFile(csvPath);

    const resolve = async () => {
      return Promise.all(
        valor.map(async (item: CSV) =>
          createTransactionService.execute({
            title: item.title,
            category: item.category,
            value: parseInt(item.value, 0),
            type: item.type,
            imp: true,
          }),
        ),
      );
    };

    const allTransiction = await Promise.resolve(resolve());

    if (allTransiction) {
      await fs.promises.unlink(csvPath);
    }

    return allTransiction;
  }
}

export default ImportTransactionsService;
