export const RABBITMQ = {
  url: 'amqp://guest:guest@localhost:5672',
  servicesNames: {
    orderService: 'order_serviceMQ',
    paymentService: 'payment_serviceMQ',
    notificationService: 'notification_serviceMQ',
  },
  routingKeys: {
    orderCreated: 'orders.created',
    updateOrderStatus: 'orders.update-status',
    processOrderPayment: 'orders.process_payment',
    checkSession: 'checkSession',
    processPayment: 'process_payment',
    paymentSucceeded: 'payments.succeeded',
    paymentFailed: 'payments.failed',
    notify: 'notifications.send',
  },
  queues: {
    ordersQueue: 'orders_queue',
    paymentsQueue: 'payments_queue',
    notificationsQueue: 'notifications_queue'
  }
} as const;