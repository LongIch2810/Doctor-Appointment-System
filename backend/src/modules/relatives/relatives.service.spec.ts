import { Test, TestingModule } from '@nestjs/testing';
import { RelativesService } from './relatives.service';

describe('RelativesService', () => {
  let service: RelativesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RelativesService],
    }).compile();

    service = module.get<RelativesService>(RelativesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
