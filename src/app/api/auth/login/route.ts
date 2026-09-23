import { NextResponse } from 'next/server';

const defaultProducts = [
  {
    id: 'walnut-classic',
    name: 'Classic Walnut Frame',
    price: 149,
    size: 'A4',
    color: 'Walnut',
    imageUrl: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80',
    description: 'Warm walnut finish for homes, gifting, and memorable family photos.'
  },
  {
    id: 'black-minimal',
    name: 'Black Minimal Frame',
    price: 299,
    size: 'A3',
    color: 'Black',
    imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',
    description: 'A sleek black frame designed for clean, premium wall displays.'
  },
  {
    id: 'gold-royal',
    name: 'Royal Gold Frame',
    price: 499,
    size: 'Large',
    color: 'Golden',
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    description: 'Statement gold finish ideal for anniversaries, weddings, and gifts.'
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const maxPrice = Number(searchParams.get('maxPrice') || 5000);
  const size = searchParams.get('size') || 'all';
  const color = searchParams.get('color') || 'all';

  const filtered = defaultProducts.filter((product) => {
    const matchesPrice = product.price <= maxPrice;
    const matchesSize = size === 'all' || product.size === size;
    const matchesColor = color === 'all' || product.color === color;
    return matchesPrice && matchesSize && matchesColor;
  });

  return NextResponse.json(filtered);
}
