import { Test, TestingModule } from '@nestjs/testing';
import { RelativesController } from './relatives.controller';

describe('RelativesController', () => {
  let controller: RelativesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RelativesController],
    }).compile();

    controller = module.get<RelativesController>(RelativesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
