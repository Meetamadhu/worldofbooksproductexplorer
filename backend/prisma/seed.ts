import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.review.deleteMany();
  await prisma.productDetail.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.navigation.deleteMany();

  // Create Navigation
  const navigation = await prisma.navigation.create({
    data: {
      title: 'Fiction Books',
      slug: 'fiction-books',
    },
  });

  // Create Categories
  const categories = [
    { title: 'Crime & Mystery', slug: 'crime-and-mystery', description: 'Thrilling crime and mystery novels' },
    { title: 'Fantasy', slug: 'fantasy', description: 'Fantasy fiction books' },
    { title: 'Science Fiction', slug: 'science-fiction', description: 'Sci-fi adventures' },
    { title: 'Romance', slug: 'romance', description: 'Romantic novels' },
    { title: 'Horror', slug: 'horror', description: 'Horror and ghost stories' },
    { title: 'Historical Fiction', slug: 'historical-fiction', description: 'Historical novels' },
  ];

  const createdCategories = [];
  for (const cat of categories) {
    const category = await prisma.category.create({
      data: {
        navigationId: navigation.id,
        ...cat,
      },
    });
    createdCategories.push(category);
    console.log(`Created category: ${cat.title}`);
  }

  // Sample Products
  const products = [
    {
      title: 'The Silent Patient',
      author: 'Alex Michaelides',
      price: 8.99,
      categoryIndex: 0,
      description: 'A gripping psychological thriller about a woman who shoots her husband and then never speaks again.',
      publisher: 'Orion Publishing',
      isbn: '978-1409181637',
      pages: 336,
      rating: 4.5,
      reviews: 2450,
    },
    {
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      price: 7.99,
      categoryIndex: 1,
      description: 'A timeless classic about Bilbo Baggins and his unexpected journey.',
      publisher: 'HarperCollins',
      isbn: '978-0007458424',
      pages: 384,
      rating: 4.8,
      reviews: 15420,
    },
    {
      title: 'Dune',
      author: 'Frank Herbert',
      price: 9.99,
      categoryIndex: 2,
      description: 'Set on the desert planet Arrakis, this epic tale of politics, religion, and ecology.',
      publisher: 'Hodder & Stoughton',
      isbn: '978-0340960196',
      pages: 608,
      rating: 4.7,
      reviews: 8920,
    },
    {
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      price: 5.99,
      categoryIndex: 3,
      description: 'The romantic clash between Elizabeth Bennet and Mr. Darcy.',
      publisher: 'Penguin Classics',
      isbn: '978-0141439518',
      pages: 480,
      rating: 4.6,
      reviews: 12340,
    },
    {
      title: 'The Shining',
      author: 'Stephen King',
      price: 8.49,
      categoryIndex: 4,
      description: 'A family heads to an isolated hotel for the winter where a sinister presence lurks.',
      publisher: 'Hodder & Stoughton',
      isbn: '978-1444720723',
      pages: 464,
      rating: 4.4,
      reviews: 6780,
    },
    {
      title: 'All the Light We Cannot See',
      author: 'Anthony Doerr',
      price: 7.49,
      categoryIndex: 5,
      description: 'A blind French girl and a German boy whose paths collide in occupied France.',
      publisher: 'Fourth Estate',
      isbn: '978-0008138301',
      pages: 544,
      rating: 4.6,
      reviews: 9120,
    },
    {
      title: 'Gone Girl',
      author: 'Gillian Flynn',
      price: 8.99,
      categoryIndex: 0,
      description: 'A psychological thriller about a marriage gone terribly wrong.',
      publisher: 'Weidenfeld & Nicolson',
      isbn: '978-1780228228',
      pages: 464,
      rating: 4.3,
      reviews: 8540,
    },
    {
      title: 'The Name of the Wind',
      author: 'Patrick Rothfuss',
      price: 9.49,
      categoryIndex: 1,
      description: 'The riveting first-person narrative of a young man who grows to be the most notorious magician.',
      publisher: 'Gollancz',
      isbn: '978-0575081406',
      pages: 672,
      rating: 4.7,
      reviews: 5230,
    },
    {
      title: 'The Martian',
      author: 'Andy Weir',
      price: 7.99,
      categoryIndex: 2,
      description: 'An astronaut becomes one of the first people to walk on Mars, and one of the first to nearly die there.',
      publisher: 'Del Rey',
      isbn: '978-0091956141',
      pages: 384,
      rating: 4.7,
      reviews: 11250,
    },
    {
      title: 'Me Before You',
      author: 'Jojo Moyes',
      price: 6.99,
      categoryIndex: 3,
      description: 'A heartbreaking romance about Lou and Will, whose lives collide in an unexpected way.',
      publisher: 'Penguin',
      isbn: '978-0718157838',
      pages: 512,
      rating: 4.5,
      reviews: 7890,
    },
  ];

  for (const prod of products) {
    const category = createdCategories[prod.categoryIndex];
    const product = await prisma.product.create({
      data: {
        sourceId: `seed-${prod.isbn}`,
        sourceUrl: `https://worldofbooks.com/product/${prod.isbn}`,
        categoryId: category.id,
        title: prod.title,
        author: prod.author,
        price: prod.price,
        currency: 'GBP',
        imageUrl: `https://picsum.photos/seed/${prod.isbn}/300/450`,
        description: prod.description,
      },
    });

    await prisma.productDetail.create({
      data: {
        productId: product.id,
        description: prod.description,
        publisher: prod.publisher,
        isbn: prod.isbn,
        pages: prod.pages,
        language: 'English',
        ratingsAvg: prod.rating,
        reviewsCount: prod.reviews,
      },
    });

    // Create sample reviews
    const reviewTexts = [
      { author: 'BookLover123', rating: 5, text: 'Absolutely brilliant! Could not put it down.' },
      { author: 'ReadItAll', rating: 4, text: 'Great read, highly recommend.' },
      { author: 'CriticalReader', rating: 4, text: 'Well-written and engaging story.' },
    ];

    for (const rev of reviewTexts.slice(0, Math.floor(Math.random() * 2) + 1)) {
      await prisma.review.create({
        data: {
          productId: product.id,
          author: rev.author,
          rating: rev.rating,
          text: rev.text,
        },
      });
    }

    console.log(`Created product: ${prod.title}`);
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

