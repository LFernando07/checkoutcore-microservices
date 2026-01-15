import { Test, TestingModule } from '@nestjs/testing';
import { MailNotificationsController } from './mail-notifications.controller';
import { MailNotificationsService } from './mail-notifications.service';

describe('MailNotificationsController', () => {
  let controller: MailNotificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailNotificationsController],
      providers: [MailNotificationsService],
    }).compile();

    controller = module.get<MailNotificationsController>(MailNotificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
