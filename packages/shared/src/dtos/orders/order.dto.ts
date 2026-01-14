import { OrderStatus } from "./order-status.enum";

export class OrderDto {
  id: string;
  userId: string;
  status: OrderStatus;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}
