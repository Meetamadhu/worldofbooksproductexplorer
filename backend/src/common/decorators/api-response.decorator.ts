import { applyDecorators } from '@nestjs/common';

export interface ApiResponseOptions {
  description: string;
  statusCode: number;
}

export function ApiResponse(options: ApiResponseOptions) {
  return applyDecorators();
}
