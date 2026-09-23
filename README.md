# Arnab Crafts

Fresh standalone Next.js storefront project for **Arnab Crafts**. It does not import catalog or customer data from another repository.

## Included
- Homepage with attractive fonts and realistic frame/decor images
- Products from ₹149, A4 to large sizes
- Filters for price, size, and color
- Customer registration/login UI
- Cart and WhatsApp order flow
- Seller-only dashboard UI for adding products
- Contact and WhatsApp: +91 91013 87479
- PostgreSQL Prisma schema and secure-session utilities ready for production
- Payment options planned: UPI, cards, net banking, wallets, Razorpay, and COD
- Domain target: arnabcrafts.com

## Run locally
```bash
npm install
npm run dev
```
Visit `http://localhost:3000`.

## Production security
The storefront UI is ready, but before accepting real payments or customer data, deploy the API routes with a real PostgreSQL `DATABASE_URL`, long random `AUTH_SECRET`, and private `ADMIN_SETUP_TOKEN`. Never commit secrets. Configure Razorpay keys only in the hosting provider's encrypted environment settings. The domain must be purchased and connected through an account you own.

The GitHub repository alone does not register `arnabcrafts.com`, create a database, or activate live payments.
