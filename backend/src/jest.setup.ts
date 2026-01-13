// Mock Prisma Client globally
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn(() => ({
      $connect: jest.fn(),
      $disconnect: jest.fn(),
    })),
  };
});
