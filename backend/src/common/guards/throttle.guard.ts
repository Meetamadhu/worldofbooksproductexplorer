import { UseGuards, applyDecorators } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

export function Throttled() {
  return applyDecorators(UseGuards(ThrottlerGuard));
}
