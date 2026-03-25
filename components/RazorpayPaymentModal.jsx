'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { toast } from 'sonner';

export default function RazorpayPaymentModal({
  isOpen,
  onClose,
  appointmentId,
  appointmentData,
  onPaymentSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || null;
    }
    return null;
  };

  const handleCancelPayment = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
      const token = getAuthToken();

      // Delete the pending payment appointment
      const response = await fetch(`${apiUrl}/appointments/${appointmentId}/cancel-payment`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to cancel appointment');
      }

      toast.success('Appointment booking cancelled. Your appointment was not created.');
      setLoading(false);
      onClose();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error(error.message || 'Failed to cancel appointment');
      setLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Step 1: Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway. Please try again.');
        setLoading(false);
        return;
      }

      // Step 2: Create order on backend
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
      const token = getAuthToken();
      
      const orderResponse = await fetch(`${apiUrl}/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          appointmentId: appointmentId,
        }),
        credentials: 'include',
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.message || 'Failed to create payment order');
      }

      const orderData = await orderResponse.json();

      // Step 3: Initialize Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        order_id: orderData.orderId,
        amount: orderData.amount * 100, // Razorpay expects amount in paise
        currency: orderData.currency,
        name: 'VetLife',
        description: `Appointment Payment for ${appointmentData?.doctorName || 'Veterinary Consultation'}`,
        image: '/logo.png', // Add your logo here
        prefill: {
          name: appointmentData?.ownerName || '',
          email: appointmentData?.ownerEmail || '',
          contact: appointmentData?.ownerPhone || '',
        },
        notes: {
          appointmentId: appointmentId,
          doctorName: appointmentData?.doctorName,
          petName: appointmentData?.petName,
          appointmentDate: appointmentData?.appointmentDate,
          appointmentTime: appointmentData?.appointmentTime,
        },
        handler: async (response) => {
          try {
            // Step 4: Verify payment on backend
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
            const token = getAuthToken();
            
            const verifyResponse = await fetch(`${apiUrl}/payments/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
              },
              body: JSON.stringify({
                appointmentId: appointmentId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
              credentials: 'include',
            });

            if (!verifyResponse.ok) {
              const errorData = await verifyResponse.json();
              throw new Error(errorData.message || 'Payment verification failed');
            }

            const verifyData = await verifyResponse.json();

            toast.success('Payment successful! Your appointment is confirmed.');

            // Call the success callback
            if (onPaymentSuccess) {
              onPaymentSuccess(verifyData.appointment);
            }

            // Close modal and redirect
            onClose();
            setTimeout(() => {
              router.push(`/dashboard/appointments`);
            }, 1500);
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verified but failed to confirm appointment. Please contact support.');
            onClose();
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.info('Payment cancelled. Your appointment booking was not completed.');
          },
        },
        theme: {
          color: '#1e40af', // VetLife brand color
        },
      };

      // Open Razorpay checkout
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment initialization error:', error);
      toast.error(error.message || 'Failed to initialize payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Payment</DialogTitle>
          <DialogDescription>
            Complete your appointment booking with a secure payment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Payment Summary */}
          <div className="border rounded-lg p-4 bg-slate-50">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Appointment Date:</span>
                <span className="font-semibold">{appointmentData?.appointmentDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Appointment Time:</span>
                <span className="font-semibold">{appointmentData?.appointmentTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Doctor:</span>
                <span className="font-semibold">{appointmentData?.doctorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pet:</span>
                <span className="font-semibold">{appointmentData?.petName}</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between">
                <span className="text-gray-700 font-medium">Amount to Pay:</span>
                <span className="text-lg font-bold text-blue-600">
                  ₹{appointmentData?.amount?.toFixed(2) || '0.00'}
                </span>
              </div>
            </div>
          </div>

          {/* Information */}
          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
            <p className="font-semibold text-blue-900 mb-1">Secure Payment</p>
            <p>
              Your payment will be processed securely through Razorpay. If payment fails or you cancel, your booking will not be completed and you can try again.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleCancelPayment}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <LoadingSpinner className="mr-2 h-4 w-4" /> Processing...
                </>
              ) : (
                'Pay Now'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
