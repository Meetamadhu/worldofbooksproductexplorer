"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Throttled = Throttled;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
function Throttled() {
    return (0, common_1.applyDecorators)((0, common_1.UseGuards)(throttler_1.ThrottlerGuard));
}
