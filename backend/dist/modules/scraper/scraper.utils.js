"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFresh = isFresh;
function isFresh(lastScrapedAt, ttlMinutes = 1440) {
    if (!lastScrapedAt)
        return false;
    const diff = Date.now() - new Date(lastScrapedAt).getTime();
    return diff < ttlMinutes * 60 * 1000;
}
