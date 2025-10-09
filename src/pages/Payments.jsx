import { useState } from "react";
import { useData } from "../context/DataContext";
import PaymentForm from "../components/PaymentForm";
import PlanForm from "../components/PlanForm";
import {
  Wallet2,
  Clock,
  BarChart3,
  CheckCircle2,
  Lock,
  Unlock,
  Trash2,
  Edit,
  Check,
} from "lucide-react";

export default function Payments() {
  const {
    payments = [],
    plans = [],
    agents = [],
    updatePayment = () => {},
    updatePlan = () => {},
    deletePlan = () => {},
  } = useData();

  const [activeTab, setActiveTab] = useState("payments");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [editingPlan, setEditingPlan] = useState(null);
  const [filter, setFilter] = useState("all");

  const filteredPayments = payments.filter(
    (p) => filter === "all" || p.status === filter
  );

  const getAgentName = (userId) =>
    agents.find((a) => a.id === userId)?.fullName || "Unknown";

  const getPlanName = (planId) =>
    plans.find((p) => p.id === planId)?.name || "Unknown Plan";

  const handleApprovePayment = (id) => updatePayment(id, { status: "completed" });

  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setShowPlanForm(true);
  };

  const handleDeletePlan = (id) => {
    if (window.confirm("Are you sure you want to delete this plan?")) deletePlan(id);
  };

  const totalRevenue = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const pendingAmount = payments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payments & Plans</h1>
            <p className="text-sm text-gray-500">
              Manage subscriptions and payment transactions
            </p>
          </div>
          <button
            onClick={() =>
              activeTab === "payments"
                ? setShowPaymentForm(true)
                : setShowPlanForm(true)
            }
            className="px-5 py-2.5 bg-gradient-to-r from-blue-800 to-blue-500 text-white rounded-lg shadow hover:shadow-md transition-all font-medium text-sm"
          >
            + Add {activeTab === "payments" ? "Payment" : "Plan"}
          </button>
        </div>

        {/* Revenue Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <RevenueCard
            icon={<Wallet2 className="w-6 h-6 text-blue-600" />}
            label="Total Revenue"
            value={`₹${totalRevenue.toLocaleString("en-IN")}`}
          />
          <RevenueCard
            icon={<Clock className="w-6 h-6 text-amber-600" />}
            label="Pending Amount"
            value={`₹${pendingAmount.toLocaleString("en-IN")}`}
          />
          <RevenueCard
            icon={<BarChart3 className="w-6 h-6 text-green-600" />}
            label="Total Transactions"
            value={payments.length}
          />
        </div>

        {/* Tabs & Filters */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-8 flex flex-col sm:flex-row justify-between gap-4 items-center">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab("payments")}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                activeTab === "payments"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              Payments ({payments.length})
            </button>
            <button
              onClick={() => setActiveTab("plans")}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                activeTab === "plans"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              Subscription Plans ({plans.length})
            </button>
          </div>

          {activeTab === "payments" && (
            <div className="flex gap-2 flex-wrap justify-end">
              {["all", "completed", "pending", "failed"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition ${
                    filter === status
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Payments Table */}
        {activeTab === "payments" ? (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-x-auto">
            {filteredPayments.length > 0 ? (
              <table className="min-w-full text-sm text-left border-collapse">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold border-b">
                  <tr>
                    <th className="px-5 py-3">Transaction ID</th>
                    <th className="px-5 py-3">Agent</th>
                    <th className="px-5 py-3">Plan</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Method</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="hover:bg-blue-50 transition-colors border-b"
                    >
                      <td className="px-5 py-3 font-mono text-gray-600">
                        {payment.transactionId || "—"}
                      </td>
                      <td className="px-5 py-3">{getAgentName(payment.userId)}</td>
                      <td className="px-5 py-3">{getPlanName(payment.planId)}</td>
                      <td className="px-5 py-3 font-semibold text-blue-800">
                        ₹{(payment.amount || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="px-5 py-3">
                        {payment.paymentMethod || "N/A"}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${
                            payment.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : payment.status === "pending"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {payment.status || "pending"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-500">
                        {payment.createdAt
                          ? new Date(payment.createdAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-5 py-3">
                        {payment.status === "pending" && (
                          <button
                            onClick={() => handleApprovePayment(payment.id)}
                            title="Approve"
                            className="p-2 rounded-md border border-green-200 hover:bg-green-50 transition"
                          >
                            <Check className="w-4 h-4 text-green-600" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-10 text-gray-400 text-sm">
                No payments found
              </div>
            )}
          </div>
        ) : (
          /* Plans Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.length > 0 ? (
              plans.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition"
                >
                  <div className="border-b border-gray-200 pb-3 mb-3">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {plan.name}
                    </h3>
                    <div className="text-xl font-semibold text-blue-800">
                      ₹{plan.price?.toLocaleString("en-IN")}{" "}
                      <span className="text-sm text-gray-500 font-normal">
                        / {plan.durationDays} days
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">
                    {plan.description || "No description available."}
                  </p>

                  <ul className="space-y-2 mb-4">
                    {plan.features?.map((f, i) => (
                      <li
                        key={i}
                        className="flex items-center text-sm text-gray-700"
                      >
                        <CheckCircle2 className="w-4 h-4 text-green-600 mr-2" />{" "}
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between mt-auto">
                    <span
                      className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        plan.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {plan.isActive ? "Active" : "Inactive"}
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditPlan(plan)}
                        title="Edit"
                        className="p-2 rounded-md border border-gray-200 hover:bg-gray-100 transition"
                      >
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() =>
                          updatePlan(plan.id, { isActive: !plan.isActive })
                        }
                        title="Toggle Status"
                        className="p-2 rounded-md border border-gray-200 hover:bg-gray-100 transition"
                      >
                        {plan.isActive ? (
                          <Unlock className="w-4 h-4 text-green-600" />
                        ) : (
                          <Lock className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeletePlan(plan.id)}
                        title="Delete"
                        className="p-2 rounded-md border border-red-200 hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-400 text-sm bg-white border border-gray-200 rounded-xl shadow-sm">
                No plans available
              </div>
            )}
          </div>
        )}
      </div>

      {/* ✅ MODALS OUTSIDE main container (fixes overlay issue) */}
      {showPaymentForm && (
        <PaymentForm
          payment={editingPayment}
          onClose={() => {
            setShowPaymentForm(false);
            setEditingPayment(null);
          }}
        />
      )}
      {showPlanForm && (
        <PlanForm
          plan={editingPlan}
          onClose={() => {
            setShowPlanForm(false);
            setEditingPlan(null);
          }}
        />
      )}
    </>
  );
}

/* ---------- Subcomponent ---------- */
function RevenueCard({ icon, label, value }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50">
        {icon}
      </div>
      <div>
        <div className="text-sm text-gray-500">{label}</div>
        <div className="text-xl font-semibold text-gray-900">{value}</div>
      </div>
    </div>
  );
}
