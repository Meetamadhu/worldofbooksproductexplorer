import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateProductCounts() {
  console.log('Updating product counts for all categories...');

  const categories = await prisma.category.findMany();

  for (const category of categories) {
    const productCount = await prisma.product.count({
      where: { categoryId: category.id },
    });

    await prisma.category.update({
      where: { id: category.id },
      data: { productCount },
    });

    console.log(`✓ ${category.title}: ${productCount} products`);
  }

  console.log('\n✅ All product counts updated successfully!');
  await prisma.$disconnect();
}

updateProductCounts().catch((error) => {
  console.error('Error updating product counts:', error);
  process.exit(1);
});
