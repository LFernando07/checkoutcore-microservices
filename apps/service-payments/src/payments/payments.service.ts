import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import {
  OrderDto,
  PaymentStatus,
  PaymentDto,
  CreatePaymentSessionResponseDto,
} from '@oppn/shared';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentsService {
  public stripe: Stripe;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY no definida en .env');
    }

    this.stripe = new Stripe(key, {
      apiVersion: '2025-12-15.clover',
    });
  }

  /**
   * ✅ Crea una sesión de pago en Stripe y guarda el registro en BD
   */
  async createPaymentSession(
    order: OrderDto,
  ): Promise<CreatePaymentSessionResponseDto> {
    try {
      // 1. Crear registro de pago en BD
      const payment = this.paymentRepository.create({
        orderId: order.id,
        userId: order.userId,
        amount: order.total,
        currency: 'mxn',
        status: PaymentStatus.PENDING,
      });

      const savedPayment = await this.paymentRepository.save(payment);

      // 2. Crear sesión en Stripe
      const session = await this.stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'mxn',
              product_data: {
                name: `Order #${order.id}`,
                description: `Payment for order ${order.id}`,
              },
              unit_amount: Math.round(order.total * 100), // ✅ Centavos
            },
            quantity: 1,
          },
        ],
        success_url: process.env.STRIPE_SUCCESS_URL,
        cancel_url: process.env.STRIPE_CANCEL_URL,
        metadata: {
          paymentId: savedPayment.id,
          orderId: order.id,
          userId: order.userId,
        },
      });

      // 3. Actualizar payment con info de Stripe
      savedPayment.stripeSessionId = session.id;
      savedPayment.stripePaymentIntentId = session.payment_intent as string;
      savedPayment.status = PaymentStatus.PROCESSING;

      await this.paymentRepository.save(savedPayment);

      // 4. Retornar URL de checkout
      return {
        paymentId: savedPayment.id,
        checkoutUrl: session.url!,
        expiresAt: session.expires_at,
      };
    } catch (error) {
      console.error('[Payments Service] Error creating session:', error);
      throw new InternalServerErrorException('Error creating payment session');
    }
  }

  /**
   * ✅ Actualiza el estado del pago
   */
  async updatePaymentStatus(
    paymentId: string,
    status: PaymentStatus,
  ): Promise<PaymentDto> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    payment.status = status;
    const updated = await this.paymentRepository.save(payment);

    return updated;
  }

  /**
   * ✅ Busca pago por Stripe Session ID
   */
  async findByStripeSessionId(sessionId: string): Promise<Payment | null> {
    return this.paymentRepository.findOne({
      where: { stripeSessionId: sessionId },
    });
  }

  // ✅ Busca pago por Stripe Payment Intent ID
  async findByStripePaymentIntentId(
    paymentIntentId: string,
  ): Promise<Payment | null> {
    return this.paymentRepository.findOne({
      where: { stripePaymentIntentId: paymentIntentId },
    });
  }

  /**
   * ✅ Busca pago por Order ID
   */
  async findByOrderId(orderId: string): Promise<PaymentDto | null> {
    const payment = await this.paymentRepository.findOne({
      where: { orderId },
    });

    return payment ? payment : null;
  }

  async retrieveSession(sessionId: string) {
    return await this.stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent'],
    });
  }
}
