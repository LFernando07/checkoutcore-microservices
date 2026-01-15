import { Test, TestingModule } from '@nestjs/testing';
import { MailNotificationsService } from './mail-notifications.service';

describe('MailNotificationsService', () => {
  let service: MailNotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailNotificationsService],
    }).compile();

    service = module.get<MailNotificationsService>(MailNotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
