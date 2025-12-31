# Paystack Escrow Payment System

Complete escrow payment system for AgriConnect marketplace using Paystack.

## How It Works

```
1. Buyer places order
   ↓
2. Paystack authorizes payment (HOLDS funds)
   ↓
3. Money in escrow (Vendor's Pending Balance)
   ↓
4. Vendor fulfills order
   ↓
5. System captures payment (RELEASES to vendor)
   ↓
6. Paystack transfers to vendor's subaccount (minus 5% marketplace fee)
   ↓
7. Vendor receives money in bank account
```

---

## Features

✅ **Escrow System**
- Hold funds on order placement
- Release funds on order fulfillment
- Refund on cancellation

✅ **Vendor Subaccounts**
- Automatic vendor bank account setup
- 5% marketplace commission (configurable)
- Auto-settlement to vendor accounts

✅ **Payment Workflows**
- Authorize payment (hold)
- Capture payment (release)
- Refund payment

✅ **Vendor Dashboard**
- Total earnings tracking
- Pending balance (in escrow)
- Available balance (released)

---

## Quick Start

### 1. Configure Paystack

Add to your `.env` file:

```bash
PAYSTACK_SECRET_KEY=sk_test_d2f83b6ff122cf84c3368f1800413cf39b7c0869
PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here
```

### 2. Enable Paystack Provider

Your `medusa-config.ts` already includes:

```typescript
{
  resolve: "./src/modules/paystack-payment",
  options: {
    secret_key: process.env.PAYSTACK_SECRET_KEY,
    public_key: process.env.PAYSTACK_PUBLIC_KEY,
  },
}
```

### 3. Install Dependencies

```bash
cd apps/backend
pnpm install
```

### 4. Restart Backend

```bash
pnpm dev
```

---

## Vendor Setup

### 1. Vendor Adds Bank Account

Vendors must configure their bank account through the API:

```http
POST /store/vendors/me/bank-account
Content-Type: application/json
Authorization: Bearer <vendor-token>

{
  "bank_name": "GTBank",
  "bank_code": "058",
  "account_number": "0123456789",
  "account_name": "Vendor Business Name"
}
```

This creates a Paystack subaccount for the vendor.

### 2. Common Nigerian Bank Codes

| Bank | Code |
|------|------|
| Access Bank | 044 |
| GTBank | 058 |
| Zenith Bank | 057 |
| First Bank | 011 |
| UBA | 033 |
| Stanbic IBTC | 221 |
| Wema Bank | 035 |
| Sterling Bank | 232 |
| Fidelity Bank | 070 |
| Union Bank | 032 |

Full list: https://paystack.com/docs/payments/bank-list/

---

## Payment Flow

### Order Creation with Payment

When a buyer places an order:

1. **Initialize Payment Session**
   ```typescript
   // Medusa handles this during checkout
   // Creates Paystack transaction
   ```

2. **Buyer Completes Payment**
   ```typescript
   // Buyer redirected to Paystack payment page
   // Pays with card/bank transfer/USSD
   ```

3. **Payment Authorized (Held)**
   ```typescript
   // Funds held by Paystack
   // Order created with status: "pending"
   // Vendor's pending_balance increased
   ```

### Order Fulfillment with Payment Release

When a vendor fulfills an order:

```http
POST /store/vendors/me/orders/:id/fulfill
Authorization: Bearer <vendor-token>
```

This triggers:
1. Order marked as fulfilled
2. Payment captured (released from escrow)
3. Paystack transfers to vendor's subaccount
4. 5% marketplace fee deducted automatically
5. Vendor's available_balance increased

### Order Cancellation with Refund

If order is cancelled:

```typescript
// Refund workflow triggered
// Funds returned to buyer
// Vendor's pending_balance decreased
```

---

## API Endpoints

### Configure Vendor Bank Account
```http
POST /store/vendors/me/bank-account
{
  "bank_name": "GTBank",
  "bank_code": "058",
  "account_number": "0123456789",
  "account_name": "Business Name"
}
```

### Fulfill Order (Capture Payment)
```http
POST /store/vendors/me/orders/:id/fulfill
```

### Get Vendor Balance
```http
GET /store/vendors/me
```

Response includes:
```json
{
  "vendor": {
    "total_earnings": 150000,
    "pending_balance": 50000,
    "available_balance": 100000,
    "paystack_subaccount_code": "ACCT_xxxxx"
  }
}
```

---

## Marketplace Commission

Default: **5% commission** on each transaction.

### Change Commission Rate

Edit `src/workflows/vendor/create-paystack-subaccount.ts`:

```typescript
const { result } = await createPaystackSubaccountWorkflow(req.scope).run({
  input: {
    percentage_charge: 10, // Change to 10% commission
  },
})
```

Or per vendor:
```typescript
// In vendor model
settlement_percentage: 90, // Vendor gets 90%, marketplace gets 10%
```

---

## Settlement Configuration

### Auto Settlement (Recommended)

Paystack automatically transfers funds to vendor accounts:
- **T+1 settlement**: Next business day
- **No manual intervention needed**

### Manual Settlement

Set in vendor model:
```typescript
settlement_schedule: "manual"
```

Trigger manually via admin dashboard or API.

---

## Webhooks

Paystack sends webhooks for payment events.

### Setup Webhook Endpoint

**File**: `src/api/webhooks/paystack/route.ts`

```typescript
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const signature = req.headers["x-paystack-signature"]
  const rawBody = JSON.stringify(req.body)
  
  // Validate signature
  const paystackService = req.scope.resolve("paystackPaymentProviderService")
  const isValid = await paystackService.validateWebhookSignature(
    rawBody,
    signature
  )
  
  if (!isValid) {
    return res.status(400).json({ message: "Invalid signature" })
  }
  
  const event = req.body
  
  // Handle different events
  switch (event.event) {
    case "charge.success":
      // Payment authorized
      break
    case "transfer.success":
      // Payout completed
      break
    case "transfer.failed":
      // Payout failed
      break
  }
  
  res.json({ received: true })
}
```

### Configure Webhook URL in Paystack Dashboard

1. Go to Paystack Dashboard → Settings → Webhooks
2. Add webhook URL: `https://your-domain.com/webhooks/paystack`
3. Save

---

## Testing

### Test Cards (Paystack Test Mode)

**Success:**
- Card: `4084084084084081`
- CVV: `408`
- Expiry: Any future date
- PIN: `0000`
- OTP: `123456`

**Decline:**
- Card: `5060666666666666666`

Full test cards: https://paystack.com/docs/payments/test-cards/

### Test Bank Accounts

Use test bank codes and account numbers from Paystack docs.

### Test Workflow

1. Create vendor with bank account
2. Create product as vendor
3. Place order as buyer
4. Pay with test card
5. Verify payment authorized (pending balance increased)
6. Fulfill order as vendor
7. Verify payment captured (available balance increased)
8. Check Paystack dashboard for transfer

---

## Troubleshooting

### Payment Authorization Fails

**Check:**
1. Paystack API keys are correct
2. Payment provider is enabled in region
3. Test card is valid
4. Backend logs for errors

### Subaccount Creation Fails

**Common Issues:**
1. Invalid bank code
2. Invalid account number
3. Bank verification failed

**Solution:**
```bash
# Verify account number with Paystack
curl https://api.paystack.co/bank/resolve \
  -H "Authorization: Bearer YOUR_SECRET_KEY" \
  -d "account_number=0123456789" \
  -d "bank_code=058"
```

### Payment Not Captured

**Check:**
1. Order is marked as fulfilled
2. Payment was authorized (not already captured)
3. Vendor has subaccount configured
4. Backend logs for workflow errors

### Webhook Not Working

**Check:**
1. Webhook URL is correct
2. HTTPS is enabled (required by Paystack)
3. Signature validation passes
4. Check Paystack dashboard → Webhooks → Logs

---

## Production Checklist

Before going live:

- [ ] Replace test keys with live Paystack keys
- [ ] Test with real bank account
- [ ] Configure webhook URL (HTTPS required)
- [ ] Set up proper error monitoring
- [ ] Test full payment flow
- [ ] Verify commission rates
- [ ] Check settlement timing
- [ ] Document vendor onboarding process
- [ ] Set up customer support for payment issues

---

## Security

### API Key Protection

Never expose secret keys:
- Store in `.env` file (never commit)
- Use environment variables in production
- Rotate keys if compromised

### Webhook Signature Validation

Always validate webhook signatures:
```typescript
const isValid = await paystackService.validateWebhookSignature(
  rawBody,
  signature
)
```

### PCI Compliance

You are PCI compliant because:
- Paystack handles all card data
- No card information stored in your database
- Payment form is Paystack-hosted or Paystack.js

---

## Files Structure

```
apps/backend/
├── src/
│   ├── modules/
│   │   └── paystack-payment/
│   │       ├── service.ts           # Paystack provider
│   │       └── index.ts             # Module definition
│   ├── workflows/
│   │   ├── vendor/
│   │   │   └── create-paystack-subaccount.ts
│   │   └── escrow/
│   │       └── complete-order-with-payment-capture.ts
│   └── api/
│       ├── store/
│       │   └── vendors/
│       │       └── me/
│       │           ├── bank-account/
│       │           │   └── route.ts
│       │           └── orders/
│       │               └── [id]/
│       │                   └── fulfill/
│       │                       └── route.ts
│       └── webhooks/
│           └── paystack/
│               └── route.ts
└── README-PAYSTACK-ESCROW.md
```

---

## Support

### Paystack Support
- Email: support@paystack.com
- Docs: https://paystack.com/docs
- API Reference: https://paystack.com/docs/api/

### AgriConnect Support
- Check backend logs for errors
- Review Paystack dashboard for transaction details
- Use MedusaExec scripts to debug data issues

---

## Next Steps

1. ✅ Configure Paystack API keys
2. ✅ Test payment flow with test cards
3. ✅ Set up vendor bank accounts
4. ✅ Test order fulfillment and payment capture
5. ✅ Configure webhooks
6. ✅ Test refund flow
7. ✅ Switch to live keys for production
8. ✅ Launch! 🚀
