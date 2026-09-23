import { PrismaClient, FrameColor, FrameSize } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  {
    id: 'frame-walnut-classic',
    name: 'Classic Walnut Frame',
    description: 'Warm walnut finish for homes and gifting.',
    imageUrl: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80',
    price: 149,
    size: FrameSize.A4,
    color: FrameColor.WALNUT
  },
  {
    id: 'frame-black-minimal',
    name: 'Black Minimal Frame',
    description: 'A refined black frame with modern appeal.',
    imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',
    price: 299,
    size: FrameSize.A3,
    color: FrameColor.BLACK
  },
  {
    id: 'frame-gold-wedding',
    name: 'Royal Gold Frame',
    description: 'Elegant gold styling for wedding and milestone memories.',
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    price: 499,
    size: FrameSize.LARGE,
    color: FrameColor.GOLDEN
  },
  {
    id: 'frame-oak-family',
    name: 'Natural Oak Family Frame',
    description: 'Rustic oak texture for family portraits and walls.',
    imageUrl: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
    price: 699,
    size: FrameSize.LARGE,
    color: FrameColor.NATURAL_OAK
  }
];

async function main() {
  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {},
      create: product
    });
  }
}

main()
  .then(() => {
    console.log('Seed complete');
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
