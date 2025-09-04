import { Test, TestingModule } from '@nestjs/testing';
import { HealthProfileController } from './health-profile.controller';

describe('HealthProfileController', () => {
  let controller: HealthProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthProfileController],
    }).compile();

    controller = module.get<HealthProfileController>(HealthProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
