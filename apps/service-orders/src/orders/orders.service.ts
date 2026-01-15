import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto, OrderDto, OrderStatus } from '@oppn/shared';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    // eslint-disable-next-line prettier/prettier
  ) { }

  // Recibir el cuerpo de la orden
  async create(createOrderDto: CreateOrderDto): Promise<OrderDto> {
    const order = this.orderRepository.create({
      userId: createOrderDto.userId,
      status: OrderStatus.PENDING,
      total: createOrderDto.total,
    });

    return await this.orderRepository.save(order);
  }

  async updateStatus(orderId: string, status: OrderStatus): Promise<OrderDto> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.status = status;
    const updatedOrder = await this.orderRepository.save(order);

    return updatedOrder;
  }

  async findById(orderId: string): Promise<OrderDto | null> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    return order ? order : null;
  }
}
