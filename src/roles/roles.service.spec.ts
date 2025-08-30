import { beforeEach, describe, expect, test } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';

describe('RolesService', () => {
  let service: RolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesService],
    }).compile();

    service = module.get<RolesService>(RolesService);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });
});
