import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RABBITMQ, sendAndHandle } from '@oppn/shared';
import { AuthGuard } from '../common/guards/auth/auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(
    @Inject(RABBITMQ.servicesNames.paymentService)
    private readonly clientPayment: ClientProxy,
    // eslint-disable-next-line prettier/prettier
  ) { }

  @Get('success')
  paymentSuccess(@Query('session_id') sessionId: string) {
    // console.log('[Gateway Payments] Payment success for session:', sessionId);

    return {
      success: true,
      message: 'Payment completed successfully! 🎉',
      sessionId,
      nextSteps: [
        'Your order is being processed',
        'You will receive a confirmation email shortly',
        'Track your order in the orders section',
      ],
    };
  }

  @Get('cancel')
  paymentCancel() {
    // console.log('[Gateway Payments] Payment cancelled by user');

    return {
      success: false,
      message: 'Payment was cancelled',
      nextSteps: [
        'Your order is still pending',
        'You can complete the payment later',
        'Check your orders to resume payment',
      ],
    };
  }

  @UseGuards(AuthGuard)
  @Get('status')
  async paymentStatus(@Query('session_id') sessionId: string) {
    // console.log('[Gateway Payments] Checking status for session:', sessionId);
    return await sendAndHandle(
      this.clientPayment,
      RABBITMQ.routingKeys.checkSession,
      sessionId,
    );
  }
}
