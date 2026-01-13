export interface ApiResponseOptions {
    description: string;
    statusCode: number;
}
export declare function ApiResponse(options: ApiResponseOptions): <TFunction extends Function, Y>(target: TFunction | object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
