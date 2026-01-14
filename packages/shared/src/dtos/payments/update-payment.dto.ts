import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentSessionResponseDto } from './create-payment-session-response.dto';

export class UpdatePaymentDto extends PartialType(CreatePaymentSessionResponseDto) { }
