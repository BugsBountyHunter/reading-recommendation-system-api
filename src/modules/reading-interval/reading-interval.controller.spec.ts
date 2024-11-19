import { Test, TestingModule } from '@nestjs/testing';
import { ReadingIntervalController } from '@app/modules/reading-interval/reading-interval.controller';

describe('ReadingIntervalController', () => {
  let controller: ReadingIntervalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReadingIntervalController],
    }).compile();

    controller = module.get<ReadingIntervalController>(
      ReadingIntervalController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
