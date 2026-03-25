'use client';

import { useState } from 'react';
import RefundDialog from '@/components/RefundDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

/**
 * Example: How to integrate Refund functionality in Appointments Dashboard
 * 
 * This example shows how to add a refund button and handle cancellations
 * for paid appointments in your appointments list.
 */

export function AppointmentCard({ appointment, onAppointmentUpdated }) {
  const [showRefundDialog, setShowRefundDialog] = useState(false);

  const handleRefundSuccess = () => {
    // Refresh the appointments list or update the appointment
    if (onAppointmentUpdated) {
      onAppointmentUpdated();
    }
  };

  const getPaymentStatusBadge = () => {
    switch (appointment.payment.status) {
      case 'paid':
        return <Badge className="bg-green-600">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-600">Payment Pending</Badge>;
      case 'refunded':
        return <Badge className="bg-blue-600">Refunded</Badge>;
      default:
        return <Badge>{appointment.payment.status}</Badge>;
    }
  };

  const canRequestRefund = 
    appointment.payment.status === 'paid' && 
    appointment.status !== 'completed' &&
    appointment.status !== 'cancelled';

  return (
    <div className="border rounded-lg p-4">
      {/* Appointment Details */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg">{appointment.doctor.user.name}</h3>
          <p className="text-sm text-gray-600">{appointment.appointmentDate} at {appointment.appointmentTime}</p>
        </div>
        {getPaymentStatusBadge()}
      </div>

      {/* Amount */}
      <div className="mb-4 p-3 bg-gray-50 rounded">
        <p className="text-sm text-gray-600">Amount</p>
        <p className="text-xl font-bold">₹{appointment.payment.amount}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {canRequestRefund && (
          <Button
            variant="destructive"
            onClick={() => setShowRefundDialog(true)}
            className="flex-1"
          >
            Cancel & Get Refund
          </Button>
        )}
        
        {appointment.payment.status === 'pending' && (
          <Button
            variant="default"
            onClick={() => {
              // Open payment modal for pending appointments
              // You can trigger the payment modal here
            }}
            className="flex-1"
          >
            Complete Payment
          </Button>
        )}
      </div>

      {/* Refund Dialog */}
      <RefundDialog
        isOpen={showRefundDialog}
        onClose={() => setShowRefundDialog(false)}
        appointmentId={appointment._id}
        appointmentData={{
          doctorName: appointment.doctor.user.name,
          appointmentDate: appointment.appointmentDate,
          appointmentTime: appointment.appointmentTime,
          amount: appointment.payment.amount,
        }}
        onRefundSuccess={handleRefundSuccess}
      />
    </div>
  );
}

/**
 * Example usage in your appointments page:
 * 
 * export default function AppointmentsPage() {
 *   const [appointments, setAppointments] = useState([]);
 * 
 *   const handleAppointmentUpdated = async () => {
 *     // Refresh the appointments list
 *     const response = await api.getAppointments();
 *     setAppointments(response.data);
 *   };
 * 
 *   return (
 *     <div className="space-y-4">
 *       {appointments.map((apt) => (
 *         <AppointmentCard
 *           key={apt._id}
 *           appointment={apt}
 *           onAppointmentUpdated={handleAppointmentUpdated}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 */
