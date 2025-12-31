# AgriConnect Setup Guide

Complete setup guide for your Nigerian agricultural marketplace.

---

## What You Have Now

✅ **Vendor System**
- Vendor registration and authentication
- Vendor approval workflow
- Product listing management
- Order management for vendors

✅ **Admin Dashboard**
- Vendor management with approval system
- Admin user management with roles
- Super admin, admin, and moderator roles
- Password reset and user controls

✅ **Paystack Escrow Payment**
- Hold funds on order placement
- Release to vendors on fulfillment
- 5% marketplace commission
- Automatic vendor payouts

✅ **Storefront**
- Product browsing and search
- Shopping cart
- Checkout flow
- Customer authentication

---

## Step-by-Step Setup

### 1. Create Your Super Admin Account

**Run this command:**
```bash
cd apps/backend
npx medusa exec ./src/scripts/create-super-admin.ts
```

**Default credentials:**
- Email: `kehindeadebayotola@gmail.com`
- Password: `AgriConnect2024!`

**Login at:**
- http://localhost:9000/app (local)
- https://your-domain.com/app (production)

### 2. Change Your Password

After first login:
1. Navigate to **Users** → Your profile
2. Click **Reset Password**
3. Enter strong password
4. Save

### 3. Configure Paystack

**Add to `.env`:**
```bash
PAYSTACK_SECRET_KEY=sk_test_d2f83b6ff122cf84c3368f1800413cf39b7c0869
PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here
```

**Restart backend:**
```bash
cd apps/backend
pnpm dev
```

### 4. Test the System

#### As Admin:
1. Login to admin dashboard
2. Check **Vendor Management** widget
3. Review pending vendors
4. Approve/reject test vendors

#### As Vendor:
1. Register at storefront vendor portal
2. Wait for admin approval
3. Login after approval
4. Add bank account details
5. Create product listings

#### As Customer:
1. Browse products
2. Add to cart
3. Checkout with Paystack test card
4. Complete payment

---

## Key Files Reference

### Admin User Management
- **Scripts**: `apps/backend/src/scripts/`
  - `create-super-admin.ts` - Bootstrap super admin
  - `reset-admin-password.ts` - Reset passwords
  - `list-admin-users.ts` - List all users

- **API**: `apps/backend/src/api/admin/users/`
- **UI**: `apps/backend/src/admin/routes/users/`
- **Workflows**: `apps/backend/src/workflows/admin-user/`

### Vendor Management
- **API**: `apps/backend/src/api/admin/vendors/`
- **UI**: `apps/backend/src/admin/routes/vendors/`
  - `apps/backend/src/admin/widgets/pending-vendors-widget.tsx`
- **Workflows**: `apps/backend/src/workflows/vendor/`

### Paystack Escrow
- **Provider**: `apps/backend/src/modules/paystack-payment/`
- **Workflows**: `apps/backend/src/workflows/escrow/`
- **API**: `apps/backend/src/api/store/vendors/me/`

---

## Common Tasks

### Create New Admin User

**Via Admin Dashboard:**
1. Login as super admin
2. Go to **Users**
3. Click **Create User**
4. Fill in details
5. Select role (Admin/Super Admin/Moderator)
6. Click **Create**

**Via CLI:**
```bash
npx medusa exec ./src/scripts/create-super-admin.ts
# Edit script to change email/password first
```

### Approve a Vendor

**Via Admin Dashboard:**
1. Login to admin
2. Check **Vendor Management** widget
3. Click **Manage All**
4. Find pending vendor
5. Click **Approve** or **Reject**

**Via API:**
```http
POST /admin/vendors/:id/verify
{
  "status": "verified"
}
```

### Configure Vendor Bank Account

**Vendor must call:**
```http
POST /store/vendors/me/bank-account
{
  "bank_name": "GTBank",
  "bank_code": "058",
  "account_number": "0123456789",
  "account_name": "Business Name"
}
```

See bank codes: [README-PAYSTACK-ESCROW.md](apps/backend/README-PAYSTACK-ESCROW.md)

### Fulfill Order and Release Payment

**Vendor calls:**
```http
POST /store/vendors/me/orders/:id/fulfill
```

This:
1. Marks order as fulfilled
2. Captures payment from escrow
3. Transfers to vendor account (minus 5% fee)
4. Updates vendor balance

---

## Testing

### Test Payment Flow

1. **Create test vendor:**
   - Register vendor account
   - Admin approves vendor
   - Vendor adds bank account (use test bank details)

2. **Create test product:**
   - Vendor creates product listing
   - Set price (e.g., ₦5,000)

3. **Place order as customer:**
   - Browse products
   - Add to cart
   - Checkout

4. **Pay with test card:**
   - Card: `4084084084084081`
   - CVV: `408`
   - Expiry: Any future date
   - PIN: `0000`
   - OTP: `123456`

5. **Verify escrow:**
   - Check vendor's pending balance increased
   - Order status is "pending"

6. **Fulfill order:**
   - Vendor marks order as fulfilled
   - API: `POST /store/vendors/me/orders/:id/fulfill`

7. **Verify payout:**
   - Vendor's available balance increased
   - Payment captured in Paystack dashboard
   - Transfer scheduled to vendor's bank

### Test Admin Features

1. **User Management:**
   - Create admin user
   - Edit user details
   - Reset password
   - Delete user (not yourself!)

2. **Vendor Management:**
   - View all vendors
   - Filter by status (Pending/Verified/Rejected)
   - Approve vendors
   - Reject vendors
   - View vendor statistics

---

## Environment Variables

### Required Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/medusa

# JWT
JWT_SECRET=your-secret-key

# Admin & Store CORS
ADMIN_CORS=http://localhost:9000,http://localhost:7001
STORE_CORS=http://localhost:8000

# Paystack
PAYSTACK_SECRET_KEY=sk_test_d2f83b6ff122cf84c3368f1800413cf39b7c0869
PAYSTACK_PUBLIC_KEY=pk_test_your_public_key
```

### Optional Variables

```bash
# Redis (for caching)
REDIS_URL=redis://localhost:6379

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password
```

---

## Production Deployment

### Pre-deployment Checklist

- [ ] Change default admin password
- [ ] Replace Paystack test keys with live keys
- [ ] Configure production DATABASE_URL
- [ ] Set strong JWT_SECRET
- [ ] Configure CORS for production domains
- [ ] Set up SSL/HTTPS
- [ ] Configure webhook URL in Paystack dashboard
- [ ] Test full payment flow
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Set up logging
- [ ] Configure backups

### Deployment Steps

1. **Deploy Backend:**
   ```bash
   cd apps/backend
   npx medusa db:migrate
   pnpm build
   pnpm start
   ```

2. **Deploy Storefront:**
   ```bash
   cd apps/storefront
   pnpm build
   pnpm start
   ```

3. **Create Super Admin:**
   ```bash
   npx medusa exec ./src/scripts/create-super-admin.ts
   ```

4. **Configure Paystack Webhooks:**
   - URL: `https://your-domain.com/webhooks/paystack`
   - Events: All

5. **Test:**
   - Admin login
   - Vendor registration
   - Payment flow
   - Order fulfillment

---

## Troubleshooting

### Can't Login to Admin

**Solution:**
```bash
# List all users
npx medusa exec ./src/scripts/list-admin-users.ts

# Reset password
npx medusa exec ./src/scripts/reset-admin-password.ts
```

### Payment Fails

**Check:**
1. Paystack keys are correct in `.env`
2. Test card details are correct
3. Backend logs for errors
4. Paystack dashboard for transaction status

### Vendor Can't Create Subaccount

**Check:**
1. Bank code is valid (see README-PAYSTACK-ESCROW.md)
2. Account number is correct
3. Bank verification passed
4. Backend logs for Paystack errors

### Order Fulfillment Doesn't Release Payment

**Check:**
1. Order has authorized payment
2. Payment not already captured
3. Vendor has subaccount configured
4. Backend logs for workflow errors

---

## Documentation

Detailed documentation for each system:

- **[README-ADMIN-USERS.md](apps/backend/README-ADMIN-USERS.md)** - Admin user management
- **[README-PAYSTACK-ESCROW.md](apps/backend/README-PAYSTACK-ESCROW.md)** - Payment escrow system

---

## Support & Resources

### Medusa Resources
- Docs: https://docs.medusajs.com
- Discord: https://discord.gg/medusajs
- GitHub: https://github.com/medusajs/medusa

### Paystack Resources
- Docs: https://paystack.com/docs
- Support: support@paystack.com
- Dashboard: https://dashboard.paystack.com

---

## Next Steps

Now that everything is set up:

1. **Customize Your Storefront**
   - Add your branding
   - Customize product pages
   - Add categories and collections

2. **Configure Shipping**
   - Add shipping options
   - Configure rates
   - Set delivery zones

3. **Add More Features**
   - Email notifications
   - SMS notifications
   - Advanced search
   - Product reviews
   - Wishlist

4. **Marketing**
   - SEO optimization
   - Social media integration
   - Analytics tracking
   - Newsletter system

5. **Launch! 🚀**
   - Test everything thoroughly
   - Switch to production mode
   - Start onboarding vendors
   - Acquire customers

---

## Quick Reference

### CLI Commands

```bash
# Admin Users
npx medusa exec ./src/scripts/create-super-admin.ts
npx medusa exec ./src/scripts/list-admin-users.ts
npx medusa exec ./src/scripts/reset-admin-password.ts

# Database
npx medusa db:migrate
npx medusa db:reset  # WARNING: Deletes all data

# Development
pnpm dev             # Start backend
pnpm build          # Build for production
pnpm start          # Start production server
```

### Admin URLs

- **Local**: http://localhost:9000/app
- **Production**: https://your-domain.com/app

### Default Credentials

- **Email**: kehindeadebayotola@gmail.com
- **Password**: AgriConnect2024!

⚠️ **Change after first login!**

---

**Built with ❤️ for Nigerian Agriculture**

Good luck with AgriConnect! 🌾🚀
