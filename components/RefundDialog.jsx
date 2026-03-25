'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

export default function RefundDialog({
  isOpen,
  onClose,
  appointmentId,
  appointmentData,
  onRefundSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('');

  const handleRefund = async () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    try {
      setLoading(true);
      const response = await api.processRefund(appointmentId, reason.trim());
      
      toast.success('Refund processed successfully. Amount will be credited within 3-5 business days.');
      
      if (onRefundSuccess) {
        onRefundSuccess(response);
      }
      
      setReason('');
      onClose();
    } catch (error) {
      console.error('Refund error:', error);
      toast.error(error.message || 'Failed to process refund');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cancel Appointment & Request Refund</DialogTitle>
          <DialogDescription>
            Please provide a reason for cancellation. The refund will be processed to your original payment method within 3-5 business days.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Appointment Details */}
          <div className="border rounded-lg p-3 bg-slate-50 text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Doctor:</span>
              <span className="font-semibold">{appointmentData?.doctorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date & Time:</span>
              <span className="font-semibold">
                {appointmentData?.appointmentDate} {appointmentData?.appointmentTime}
              </span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between">
              <span className="text-gray-700 font-medium">Refund Amount:</span>
              <span className="text-green-600 font-bold">
                ₹{appointmentData?.amount?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>

          {/* Warning */}
          <div className="flex gap-2 bg-amber-50 p-3 rounded text-sm text-amber-800">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Important</p>
              <p>Cancellations made within 24 hours of the appointment may incur a cancellation fee. The doctor will be notified of your cancellation.</p>
            </div>
          </div>

          {/* Reason Input */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Cancellation *</Label>
            <Textarea
              id="reason"
              placeholder="Please tell us why you're cancelling this appointment..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={loading}
              rows={4}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Keep Appointment
            </Button>
            <Button
              variant="destructive"
              onClick={handleRefund}
              disabled={loading || !reason.trim()}
              className="flex-1"
            >
              {loading ? 'Processing...' : 'Cancel & Refund'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
