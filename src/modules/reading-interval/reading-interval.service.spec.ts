import { Test, TestingModule } from '@nestjs/testing';
import { ReadingIntervalService } from '@app/modules/reading-interval/reading-interval.service';

describe('ReadingIntervalService', () => {
  let service: ReadingIntervalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReadingIntervalService],
    }).compile();

    service = module.get<ReadingIntervalService>(ReadingIntervalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
