import { Test, TestingModule } from '@nestjs/testing';
import { HealthProfileService } from './health-profile.service';

describe('HealthProfileService', () => {
  let service: HealthProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthProfileService],
    }).compile();

    service = module.get<HealthProfileService>(HealthProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
