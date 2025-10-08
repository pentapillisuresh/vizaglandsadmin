import { useState } from 'react';
import { useData } from '../context/DataContext';
import './PropertyForm.css';

export default function PaymentForm({ payment, onClose }) {
  const { addPayment, updatePayment, agents, plans } = useData();

  const [formData, setFormData] = useState({
    userId: payment?.userId || agents[0]?.id || '',
    planId: payment?.planId || plans[0]?.id || '',
    amount: payment?.amount || plans[0]?.price || '',
    status: payment?.status || 'pending',
    paymentMethod: payment?.paymentMethod || 'Credit Card',
    transactionId: payment?.transactionId || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'planId') {
      const selectedPlan = plans.find(p => p.id === value);
      setFormData(prev => ({ ...prev, [name]: value, amount: selectedPlan?.price || prev.amount }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const paymentData = { ...formData, amount: Number(formData.amount) };
    if (payment) {
      updatePayment(payment.id, paymentData);
    } else {
      addPayment(paymentData);
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{payment ? 'Edit Payment' : 'Add New Payment'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="property-form">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Agent *</label>
              <select name="userId" value={formData.userId} onChange={handleChange} className="form-select" required>
                {agents.map(agent => (
                  <option key={agent.id} value={agent.id}>{agent.fullName}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Plan *</label>
              <select name="planId" value={formData.planId} onChange={handleChange} className="form-select" required>
                {plans.map(plan => (
                  <option key={plan.id} value={plan.id}>{plan.name} - ₹{plan.price}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Amount (₹) *</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Payment Method *</label>
              <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="form-select" required>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status *</label>
              <select name="status" value={formData.status} onChange={handleChange} className="form-select" required>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Transaction ID</label>
              <input
                type="text"
                name="transactionId"
                value={formData.transactionId}
                onChange={handleChange}
                className="form-input"
                placeholder="TXN123456"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {payment ? 'Update Payment' : 'Add Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
