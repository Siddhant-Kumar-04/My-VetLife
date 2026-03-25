# Razorpay Payment Integration Guide

This guide explains how to set up and use the Razorpay payment integration in the VetLife application.

## Overview

The Razorpay integration allows users to:

1. Book appointments and make secure payments via Razorpay
2. Automatically confirm appointments after successful payment
3. Request refunds for paid appointments (which triggers automatic refund processing)
4. Track payment status through the dashboard

## Backend Setup

### 1. Environment Variables

Add these variables to your `.env` file in the `backend/` directory:

```bash
# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret_here
```

**Where to get these?**

- Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
- Navigate to Settings → API Keys
- Copy your **Key ID** and **Key Secret**
- For webhook secret, create a webhook at Settings → Webhooks

### 2. Dependencies

The backend already has `razorpay` package installed. If not, run:

```bash
cd backend
npm install razorpay
```

### 3. API Endpoints

The following payment endpoints are now available:

#### Create Payment Order

**POST** `/api/payments/create-order`

- **Auth**: Required (logged-in user)
- **Body**:
  ```json
  {
    "appointmentId": "appointment_id_here"
  }
  ```
- **Response**: Order details including `orderId`, amount, and currency

#### Verify Payment

**POST** `/api/payments/verify`

- **Auth**: Required
- **Body**:
  ```json
  {
    "appointmentId": "appointment_id_here",
    "razorpay_order_id": "order_id_from_razorpay",
    "razorpay_payment_id": "payment_id_from_razorpay",
    "razorpay_signature": "signature_from_razorpay"
  }
  ```
- **Response**: Updated appointment with payment status "paid"

#### Process Refund

**POST** `/api/payments/refund`

- **Auth**: Required
- **Body**:
  ```json
  {
    "appointmentId": "appointment_id_here",
    "reason": "User requested cancellation"
  }
  ```
- **Response**: Refund details and updated appointment

#### Webhook Handler

**POST** `/api/payments/webhook`

- **Purpose**: Handles Razorpay payment events
- **Events**: `payment.authorized`, `payment.failed`
- **Note**: Signature is verified using `RAZORPAY_WEBHOOK_SECRET`

### 4. Database Schema

The `Appointment` model now includes Razorpay payment fields:

```javascript
payment: {
  amount: Number,
  status: String, // "pending", "paid", "refunded"
  method: String,
  transactionId: String,
  paidAt: Date,
  razorpay: {
    orderId: String,
    paymentId: String,
    signature: String,
    refundId: String,
  }
}
```

## Frontend Setup

### 1. Environment Variables

Add this to your `.env.local` file in the root directory:

```bash
# Razorpay Public Key
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_public_key_here
```

### 2. Dependencies

The frontend already has `razorpay-checkout` installed.

### 3. Components

#### RazorpayPaymentModal Component

Used to display the payment modal and handle the checkout process.

**Location**: `components/RazorpayPaymentModal.jsx`

**Usage**:

```jsx
import RazorpayPaymentModal from "@/components/RazorpayPaymentModal";

<RazorpayPaymentModal
  isOpen={showPaymentModal}
  onClose={() => setShowPaymentModal(false)}
  appointmentId={appointmentId}
  appointmentData={{
    doctorName: "Dr. John",
    petName: "Buddy",
    appointmentDate: "2024-03-25",
    appointmentTime: "10:00 AM",
    amount: 500,
    ownerName: "John Doe",
    ownerEmail: "john@example.com",
    ownerPhone: "9876543210",
  }}
  onPaymentSuccess={(appointment) => {
    // Handle successful payment
    console.log("Payment successful", appointment);
  }}
/>;
```

**Props**:

- `isOpen` (boolean): Whether modal is open
- `onClose` (function): Called when modal closes
- `appointmentId` (string): ID of the appointment
- `appointmentData` (object): Appointment details for display
- `onPaymentSuccess` (function): Callback after successful payment

#### RefundDialog Component

Used to handle appointment cancellations and refunds.

**Location**: `components/RefundDialog.jsx`

**Usage**:

```jsx
import RefundDialog from "@/components/RefundDialog";

<RefundDialog
  isOpen={showRefundDialog}
  onClose={() => setShowRefundDialog(false)}
  appointmentId={appointmentId}
  appointmentData={{
    doctorName: "Dr. John",
    appointmentDate: "2024-03-25",
    appointmentTime: "10:00 AM",
    amount: 500,
  }}
  onRefundSuccess={(response) => {
    // Handle successful refund
    console.log("Refund processed", response);
  }}
/>;
```

## Integration in Doctor Profile Page

The doctor profile page (`app/doctors/[id]/page.jsx`) has been updated to include payment integration:

1. When a user clicks "Confirm Booking", the appointment is created first
2. The payment modal is automatically shown
3. After successful payment, the appointment is confirmed
4. If payment fails or is cancelled, the appointment remains but payment is pending

## Integration in Appointments Dashboard

Update your appointments dashboard to show:

1. Payment status badge
2. Refund button for paid appointments
3. Payment history

**Example**:

```jsx
import RefundDialog from "@/components/RefundDialog";

export default function AppointmentsPage() {
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const handleRefund = (appointment) => {
    setSelectedAppointment(appointment);
    setShowRefundDialog(true);
  };

  return (
    <>
      {appointment.payment.status === "paid" && (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleRefund(appointment)}
        >
          Cancel & Get Refund
        </Button>
      )}

      <RefundDialog
        isOpen={showRefundDialog}
        onClose={() => setShowRefundDialog(false)}
        appointmentId={selectedAppointment?._id}
        appointmentData={{
          doctorName: selectedAppointment?.doctor?.user?.name,
          appointmentDate: selectedAppointment?.appointmentDate,
          appointmentTime: selectedAppointment?.appointmentTime,
          amount: selectedAppointment?.payment?.amount,
        }}
        onRefundSuccess={() => {
          setShowRefundDialog(false);
          // Refresh appointments list
        }}
      />
    </>
  );
}
```

## API Methods

The `lib/api.js` file now includes payment methods:

```javascript
// Create a payment order
api.createPaymentOrder(appointmentId);

// Verify payment signature
api.verifyPayment(
  appointmentId,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
);

// Process refund
api.processRefund(appointmentId, reason);
```

## Webhook Configuration

To set up webhooks in Razorpay:

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to Settings → Webhooks
3. Click "+ Create new webhook"
4. Enter your webhook URL:
   ```
   https://your-domain.com/api/payments/webhook
   ```
5. Select these events:
   - `payment.authorized`
   - `payment.failed`
6. Copy the **Webhook Secret** and add it to your `.env` as `RAZORPAY_WEBHOOK_SECRET`

## Payment Flow

### Successful Payment Flow:

1. User selects appointment details and clicks "Confirm Booking"
2. Appointment is created with `payment.status = "pending"`
3. Razorpay Payment Modal opens
4. User enters payment details and completes payment
5. Razorpay returns payment confirmation
6. Frontend verifies payment signature with backend
7. Backend updates appointment: `payment.status = "paid"`
8. User is redirected to appointments dashboard

### Cancellation & Refund Flow:

1. User clicks "Cancel & Get Refund" on paid appointment
2. RefundDialog opens asking for cancellation reason
3. User submits reason
4. Backend processes refund through Razorpay API
5. `payment.status` changes to "refunded"
6. `status` changes to "cancelled"
7. Money is credited back to user's account within 3-5 business days

## Testing

### Test Cards (Razorpay Test Mode):

```
Visa:
Card: 4111 1111 1111 1111
Expiry: 12/25 (any future date)
CVV: 123

Mastercard:
Card: 5555 5555 5555 4444
Expiry: 12/25
CVV: 123
```

### Test Cases:

1. ✅ Create appointment
2. ✅ Verify payment with correct signature
3. ✅ Reject payment with wrong signature
4. ✅ Process refund for paid appointment
5. ✅ Verify webhook events are received

## Error Handling

The implementation includes comprehensive error handling for:

- Network failures
- Invalid signatures
- Already paid appointments
- Refund failures
- Webhook signature mismatches

## Troubleshooting

### "Payment failed" error:

- Check if Razorpay keys are correct
- Verify `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
- Ensure frontend has `NEXT_PUBLIC_RAZORPAY_KEY_ID`

### "Refund not processed":

- Make sure appointment has `payment.status = "paid"`
- Verify webhook is configured (optional but recommended)
- Check Razorpay dashboard for refund status

### "Signature verification failed":

- Ensure `RAZORPAY_KEY_SECRET` is correct
- Check if order details match exactly

## Security Notes

1. **Never expose secret keys** in frontend code
2. **Always verify signatures** server-side before processing
3. **Use HTTPS** in production
4. **Validate all payment data** before updating database
5. **Log all payment transactions** for auditing

## Next Steps

1. Set up Razorpay account and get API keys
2. Add keys to `.env` files (backend and frontend)
3. Configure webhook in Razorpay dashboard
4. Test payment flow with test cards
5. Deploy to production with live keys

## Support

For Razorpay support: https://razorpay.com/support/
For VetLife support: Contact your development team
