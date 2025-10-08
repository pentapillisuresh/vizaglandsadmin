import { useState } from 'react';
import { useData } from '../context/DataContext';
import PaymentForm from '../components/PaymentForm';
import PlanForm from '../components/PlanForm';
import './Payments.css';

export default function Payments() {
  const { payments, plans, agents, updatePayment, updatePlan, deletePlan } = useData();
  const [activeTab, setActiveTab] = useState('payments');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [editingPlan, setEditingPlan] = useState(null);
  const [filter, setFilter] = useState('all');

  const filteredPayments = payments.filter(payment => filter === 'all' || payment.status === filter);

  const getAgentName = (userId) => {
    const agent = agents.find(a => a.id === userId);
    return agent ? agent.fullName : 'Unknown';
  };

  const getPlanName = (planId) => {
    const plan = plans.find(p => p.id === planId);
    return plan ? plan.name : 'Unknown Plan';
  };

  const handleApprovePayment = (id) => {
    updatePayment(id, { status: 'completed' });
  };

  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setShowPlanForm(true);
  };

  const handleDeletePlan = (id) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      deletePlan(id);
    }
  };

  const totalRevenue = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="payments-page">
      <div className="payments-header">
        <div>
          <h1 className="page-title">Payments & Plans</h1>
          <p className="page-subtitle">Manage subscriptions and payment transactions</p>
        </div>
        <button className="btn-primary" onClick={() => activeTab === 'payments' ? setShowPaymentForm(true) : setShowPlanForm(true)}>
          + Add {activeTab === 'payments' ? 'Payment' : 'Plan'}
        </button>
      </div>

      <div className="revenue-cards">
        <div className="revenue-card">
          <div className="revenue-icon">💰</div>
          <div>
            <div className="revenue-label">Total Revenue</div>
            <div className="revenue-value">₹{totalRevenue.toLocaleString('en-IN')}</div>
          </div>
        </div>
        <div className="revenue-card">
          <div className="revenue-icon">⏳</div>
          <div>
            <div className="revenue-label">Pending Amount</div>
            <div className="revenue-value">₹{pendingAmount.toLocaleString('en-IN')}</div>
          </div>
        </div>
        <div className="revenue-card">
          <div className="revenue-icon">📊</div>
          <div>
            <div className="revenue-label">Total Transactions</div>
            <div className="revenue-value">{payments.length}</div>
          </div>
        </div>
      </div>

      <div className="payments-controls">
        <div className="tab-buttons">
          <button className={activeTab === 'payments' ? 'tab-btn active' : 'tab-btn'} onClick={() => setActiveTab('payments')}>
            Payments ({payments.length})
          </button>
          <button className={activeTab === 'plans' ? 'tab-btn active' : 'tab-btn'} onClick={() => setActiveTab('plans')}>
            Subscription Plans ({plans.length})
          </button>
        </div>
        {activeTab === 'payments' && (
          <div className="filter-tabs">
            <button className={filter === 'all' ? 'filter-tab active' : 'filter-tab'} onClick={() => setFilter('all')}>All</button>
            <button className={filter === 'completed' ? 'filter-tab active' : 'filter-tab'} onClick={() => setFilter('completed')}>Completed</button>
            <button className={filter === 'pending' ? 'filter-tab active' : 'filter-tab'} onClick={() => setFilter('pending')}>Pending</button>
            <button className={filter === 'failed' ? 'filter-tab active' : 'filter-tab'} onClick={() => setFilter('failed')}>Failed</button>
          </div>
        )}
      </div>

      {activeTab === 'payments' ? (
        <div className="payments-table-container">
          <table className="payments-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Agent</th>
                <th>Plan</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map(payment => (
                <tr key={payment.id}>
                  <td className="transaction-id">{payment.transactionId}</td>
                  <td>{getAgentName(payment.userId)}</td>
                  <td>{getPlanName(payment.planId)}</td>
                  <td className="payment-amount">₹{payment.amount.toLocaleString('en-IN')}</td>
                  <td>{payment.paymentMethod}</td>
                  <td>
                    <span className={`badge badge-${payment.status}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                  <td className="table-actions">
                    {payment.status === 'pending' && (
                      <button className="btn-icon btn-success" onClick={() => handleApprovePayment(payment.id)} title="Approve">
                        ✓
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPayments.length === 0 && (
            <div className="empty-state">No payments found</div>
          )}
        </div>
      ) : (
        <div className="plans-grid">
          {plans.map(plan => (
            <div key={plan.id} className="plan-card">
              <div className="plan-header">
                <h3 className="plan-name">{plan.name}</h3>
                <div className="plan-price">₹{plan.price.toLocaleString('en-IN')}<span className="plan-duration">/{plan.durationDays} days</span></div>
              </div>
              <p className="plan-description">{plan.description}</p>
              <div className="plan-features">
                {plan.features.map((feature, index) => (
                  <div key={index} className="plan-feature">
                    <span className="feature-icon">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <div className="plan-status">
                <span className={`badge ${plan.isActive ? 'badge-success' : 'badge-danger'}`}>
                  {plan.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="plan-actions">
                <button className="btn-icon" onClick={() => handleEditPlan(plan)} title="Edit">
                  ✏️
                </button>
                <button className="btn-icon" onClick={() => updatePlan(plan.id, { isActive: !plan.isActive })} title="Toggle Status">
                  {plan.isActive ? '🔓' : '🔒'}
                </button>
                <button className="btn-icon btn-danger" onClick={() => handleDeletePlan(plan.id)} title="Delete">
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showPaymentForm && (
        <PaymentForm
          payment={editingPayment}
          onClose={() => { setShowPaymentForm(false); setEditingPayment(null); }}
        />
      )}

      {showPlanForm && (
        <PlanForm
          plan={editingPlan}
          onClose={() => { setShowPlanForm(false); setEditingPlan(null); }}
        />
      )}
    </div>
  );
}
