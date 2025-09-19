import { beforeEach, describe, expect, test } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';

describe('TransactionsService', () => {
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionsService],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });
});
