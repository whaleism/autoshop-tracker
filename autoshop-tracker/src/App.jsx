import { useState, useMemo, useEffect, useCallBack } from "react";

// Mock Data //
const MOCK_JOBS = [
  {
    id: "job-1",
    customerName: "Marcus Webb",
    phone: "312-555-0182",
    plateNumber: "KXT-482",
    year: 2021,
    make: "Acura",
    model: "NSX Type-S",
    color: "Gotham Gray Matte Metallic",
    serviceType: "tint",
    serviceDetail: "Full Cermaic Tint - 20%",
    status: "intake",
    priority: "normal",
    createdAt: "2026-05-10",
    dueDate: "2026-05-14",
    technician: "Xaiver H.",
    notes: "Customer wants darkest legal tint. Check local ordinance first.",
  },
  {
    id: "job-2",
    customerName: "Sofia Reyes",
    phone: "773-555-0294",
    plateNumber: "MPR-719",
    year: 2023,
    make: "Ferrai",
    model: "296 GTB",
    color: "Rosso Corsa",
    serviceType: "wrap",
    serviceDetail: "Full Body Wrap - Matte Olive",
    status: "in-progress",
    priority: "high",
    createdAt: "2026-05-09",
    dueDate: "2026-05-13",
    technician: "Julian B.",
    notes: "Partial panels already done. Finishing hood and roof today.",
  },
  {
    id: "job-3",
    customerName: "James Okafor",
    phone: "847-555-0371",
    plateNumber: "WLB-356",
    year: 2020,
    make: "Porsche",
    model: "911 GT3 RS",
    color: "Python Green",
    serviceType: "tint",
    serviceDetail: "Windshield + Front Windows - 35%",
    status: "in-progress",
    priority: "normal",
    createdAt: "2026-05-11",
    dueDate: "2026-05-15",
    technician: "Xaiver H.",
    notes: "",
  },
  {
    id: "job-4",
    customerName: "Priya Nair",
    phone: "630-555-0445",
    plateNumber: "JVF-804",
    year: 2020,
    make: "Chevrolet",
    model: "Corvette Z06",
    color: "Amplify Orange Tintcoat",
    serviceType: "wrap",
    serviceDetail: "Roof Wrap - Gloss Carbon Fiber",
    status: "quality-check",
    priority: "normal",
    createdAt: "2026-05-08",
    dueDate: "2026-05-13",
    technician: "Julian B.",
    notes: "Inspect edges on A-pillar. Customer is very detail-oriented.",
  },
  {
    id: "job-5",
    customerName: "Terrence Hall",
    phone: "321-550-0519",
    plateNumber: "DZN-261",
    year: 2019,
    make: "Lamborghini",
    model: "Revuelto",
    color: "Viola Pasifae",
    serviceType: "tint",
    serviceDetail: "Full Vehicle Tint - 5% Limo",
    status: "complete",
    priority: "low",
    createdAt: "2026-05-07",
    dueDate: "2026-05-12",
    technician: "Xaiver H.",
    notes: "Picked up. Customer left 5-star review.",
  },
  {
    id: "job-6",
    customerName: "Aaliyah Brooks",
    phone: "773-555-0623",
    plateNumber: "RSH-537",
    year: 2024,
    make: "Aston Martin",
    model: "Vantage",
    color: "Podium Green",
    serviceType: "wrap",
    serviceDetail: "Full Body Wrap - Satin Black",
    status: "intake",
    priority: "high",
    createdAt: "2026-05-12",
    dueDate: "2026-05-17",
    technician: "Unassigned",
    notes: "High-value vehicle. Assign senior tech.",
  },
  {
    id: "job-7",
    customerName: "Nadia Petrov",
    phone: "312-555-0834",
    plateNumber: "THZ-641",
    year: 2023,
    make: "Audi",
    model: "R8 V10 Performance",
    color: "Nardo Gray",
    serviceType: "ppf",
    serviceDetail: "Full Front PPF - Self-healing Matte",
    status: "quality-check",
    priority: "high",
    createAt: "2026-05-13",
    dueDate: "2026-05-16",
    technician: "Say P.",
    notes:
      "High-gloss paint underneath. Handle with extra care during install.",
  },
  {
    id: "job-8",
    customerName: "Derek Lim",
    phone: "847-555-0701",
    plateNumber: "GBC-948",
    year: 2021,
    make: "Nissan",
    model: "GTR",
    color: "Bayside Blue",
    serviceType: "tint",
    serviceDetail: "Rear Windows Only - 20%",
    status: "complete",
    priority: "low",
    createdAt: "2026-05-06",
    dueDate: "2026-05-10",
    technician: "Julian B.",
    notes: "",
  },
];

// Config //
const COLUMNS = [
  { id: "intake", label: "Intake", color: "#60a5fa" },
  { id: "in-progess", label: "In Progress", color: "#fb923c" },
  { id: "quality-check", label: "Quality Check", color: "#a78bfa" },
  { id: "complete", label: "Complete", color: "#34d399" },
];

const SERVICE_FILTERS = ["all", "tint", "wrap", "ppf"];
const TECHNICIANS = ["Unassigned", "Xavier H.", "Julian B.", "Say P."];

// Blank Form - defined once so we can reset cleanly //
const EMPTY_FORM = {
  customerName: "",
  phone: "",
  plateNumber: "",
  year: "",
  make: "",
  model: "",
  color: "",
  serviceType: "tint",
  serviceDetail: "",
  priority: "normal",
  dueDate: "",
  technician: "Unassigned",
  notes: "",
};

// Utils //
function getPriorityStyle(priority) {
  if (priority === "high") return "bg-red-500/20 text-red border-red-500/30";
  if (priority === "low")
    return "bg-slate-500/20 text-slate-400 border slate-500/30";
  return "bg-amber-500/20 text-amber-300 border-amber-500/30";
}

function getServiceStyle(type) {
  if (type === "tint") return "bg-sky-500/20 text-sky-300 border-sky-500/30";
  if (type === "wrap")
    return "bg-violet-500/20 text-violet-300 border-violet-500/30";
  if (type === "ppf")
    return "bg-amber-500/20 text-amber-300 border-amber-500/30";
  return "bg-slate-500/20 text-slate-400 border-slate-500/30";
}

function isOverDue(dueDate) {
  return new Date(dueDate) < new Date(new Date().toDateString());
}

function todayISO() {
  return new Date().toISOString().split("T")[0];
}
// Ghost Card
// Shown when a column has zero jobs. Shows the *shape* of what belongs there
// This is much better than "No jobs here" because it can confuse a user and look like a bug

function GhostCard() {
  return (
    <div
      aria-hidden="true"
      className="border-2 border-dashed border-slate-700/50 rounded-xl p-4 opacity-40 pointer-events-none select-none"
    >
      <div className="flex justify-between mb-3">
        <div className="h-4 w-12 bg-slate-700 rounded-full" />
        <div className="h-4 w-10 bg-slate-700 rounded-full" />
      </div>
      <div className="h-4 w-28 bg-slate-700 rounded mb-2" />
      <div className="h-3 w-20 bg-slate-700/70 rounded mb-1" />
      <div className="h-3 w-14 bg-slate-700/50 rounded mb-4" />
      <div className="h-3 w-full bg-slate-700/40 rounded mb-1" />
      <div className="h-3 w-2/3 bg-slate-700/40 rounded mb-4" />
      <div className="flex justify-between pt-3 border-t border-slate-700/40">
        <div className="h-3 w-16 bg-slate-700/50 rounded" />
        <div className="h-3 w-12 bg-slate-700/50 rounded" />
      </div>
    </div>
  );
}

// Skelton Card
// Shown WHILE data is loading from the API
// Animate-pulse signals: "something's coming"
// Distinction from GhostCard:
//  GhostCard = column has no data (permanent for now)
//  SkeletonCard = data is on its way (temporary loading state)

function SkeletonCard() {
  return (
    <div className="bg-slate-800 border border-slate-700/60 rounded-xl p-4 animate-pulse">
      <div className="flex justify-between mb-3">
        <div className="h-4 w-12 bg-slate-700 rounded-full" />
        <div className="h-4 w-10 bg-slate-700 rounded-full" />
      </div>
      <div className="h-4 w-32 bg-slate-700 rounded mb-2" />
      <div className="h-3 w-24 bg-slate-700/70 rounded mb-1" />
      <div className="h-3 w-16 bg-slate-700/50 rounded mb-4" />
      <div className="h-3 w-full bg-slate-700/40 rounded mb-1" />
      <div className="h-3 w-3/4 bg-slate-700/40 rounded mb-4" />
      <div className="flex justify-between pt-3 border-t border-slate-700/50">
        <div className="h-3 w-16 bg-slate-700/50 rounded" />
        <div className="h-3 w-14 bg-slate-700/50 rounded" />
      </div>
    </div>
  );
}

// Stat Card //
function StatCard({ label, value, accent }) {
  return (
    <div className="flex flex-col gap-1 bg-slate-800/60 border border-slate-700/50 rounded-xl px-5 py-4 min-w-[110px]">
      <span className="text-2xl font-bold" style={{ color: accent }}>
        {value}
      </span>
      <span className="text-xs text-slate-400 uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

// Job Card //
function JobCard({ job, onClick }) {
  const overdue = job.status !== "complete" && isOverDue(job.dueDate);

  return (
    <div
      onClick={() => onClick(job)}
      className="group bg-slate-800 border border-slate-700/60 rounded-xl p-4
                cursor-pointer hover:border-slate-500 hover:-translate-y-0.5
                transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-black/30"
    >
      <div className="flex items-center justify-between-mb-3">
        <span
          className={`text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full border ${getPriorityStyle(job.priority)}`}
        >
          {job.priority}
        </span>
        <span
          className={`text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full border ${getServiceStyle(job.serviceType)}`}
        >
          {job.serviceType}
        </span>
      </div>

      <p className="text-sm font-semibold text-slate-100 leading-tight">
        {job.customerName}
      </p>
      <p className="text-xs text-slate-400 mt-0.5">
        {job.year} {job.make} {job.model}
      </p>
      <p className="text-xs text-slate-500 font-mono mt-1">{job.plateNumber}</p>
      <p className="text-xs text-slate-300 mt-3 leading-snug border-1-2 border-slate-600 pl-2">
        {job.serviceDetail}
      </p>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-700/50">
        <span
          className={`text-[11px] font-medium ${overdue ? "text-red-400" : "text-slate-400"}`}
        >
          {overdue ? "⚠ " : ""}Due {job.dueDate}
        </span>
        <span className="text-[11px] text-slate-500">{job.technician}</span>
      </div>
    </div>
  );
}

// Kanban Column //
function KanbanColumn({ column, jobs, onCardClick, isLoading = false }) {
  return (
    <div className="flex flex-col min-w-[280px] w-full md:w-72 lg:flex-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: column.color }}
          />
          <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
            {column.label}
          </h2>
        </div>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: column.color + "25", color: column.color }}
        >
          {isLoading ? "-" : jobs.length}
        </span>
      </div>

      {/* Cards Area */}
      <div className="flex flex-col gap-3 flex-1 bg-slate-900/40 border border-slate-700/30 rounded-xl p-3 min-h-[200px]">
        {isLoading ? (
          [1, 2].map((n) => <SkeletonCard key={n} />)
        ) : jobs.length === 0 ? (
          <GhostCard />
        ) : (
          jobs.map((job) => (
            <JobCard key={job.id} job={job} onClick={onCardClick} />
          ))
        )}
      </div>
    </div>
  );
}

// Success Toast
// Auto dismisses after 4 seconds via useEffect + setTimeout
// Clean up function (return () => clearTimeout) runs if the component
// disconnects before the timer completes
function SuccessToast({ message, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <>
      <style>{`
      @keyframes slideUp {
        from { opacity: 0; transform: translate(-50%, 16px); }
        to { opacity: 1; transform: translate(-50%, 0); }
      }
    `}</style>
      <div
        role="status"
        aria-live="polite"
        style={{ animation: "slideUp 0.3s ease-out" }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50
                 flex items-center gap-3 px-5 py-3.5 rounded-2xl
                 bg-emerald-900/90 border border-emerald-500/40
                 shadow-xl shadow-black/40 backdrop-blur-sm"
      >
        <span className="text-emerald-400 text-lg">✓</span>
        <p className="text-sm font-medium text-emerald-100">{message}</p>
        <button
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="text-emerald-400/60 hover:text-emerald-200 ml-1 transition-colors text-xl leading-none"
        >
          x
        </button>
      </div>
    </>
  );
}

// Intake Form Modal
// Controlled form
// Every input's value comes from formData state and every key updates that state via handleChange

function IntakeFormModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  }

  function validate() {
    const required = [
      "customerName",
      "phone",
      "plateNumber",
      "year",
      "make",
      "model",
      "serviceDetail",
      "dueDate",
    ];

    const next = {};
    required.forEach((field) => {
      if (!formData[field].toString().trim()) next[field] = "Required";
    });
    return next;
  }

  function handleSubmit() {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newJob = {
      ...formData,
      id: `job-${Date.now()}`, // local temd ID
      status: "intake", // all new jobs start here
      createdAt: todayISO(),
      year: parseInt(formData.year, 10),
    };

    onsubmit(newJob);
    setFormData(EMPTY_FORM);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 border border-slate-600/50 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-700">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">
              New Job
            </p>
            <h2 className="text-xl font-bold text-slate-100">Intake Order</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-slate-500 hover:text-slate-200 text-xl leading-none mt-1 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <FormSection label="Customer Info">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Customer Name *" error={errors.customerName}>
                <input
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="Marcus Webb"
                  className={inputCls(errors.customerName)}
                />
              </Field>
            </div>
          </FormSection>

          <FormSection label="Vehicle Info">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Field label="Year *" error={errors.year}>
                <input
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="2022"
                  maxLength={4}
                  className={inputCls(errors.year)}
                />
              </Field>
              <Field label="Make *" error={errors.make}>
                <input
                  name="make"
                  value={formData.make}
                  onChange={handleChange}
                  placeholder="Toyota"
                  className={inputCls(errors.make)}
                />
              </Field>
              <Field label="Model *" errors={errors.model}>
                <input
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="Camry"
                  className={inputCls(errors.model)}
                />
              </Field>
              <Field label="Color">
                <input
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="Pearl White"
                  className={inputCls()}
                />
              </Field>
            </div>
            <Field label="Plate Number *" error={errors.plateNumber}>
              <input
                name="plateNumber"
                value={formData.plateNumber}
                onChange={handleChange}
                placeholder="KXT-482"
                className={`${inputCls(errors.plateNumber)} font-mono uppercase`}
              />
            </Field>
          </FormSection>

          <FormSection label="Service Info">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Service Type">
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className={inputCls()}
                >
                  <option value="tint">Tint</option>
                  <option value="wrap">Wrap</option>
                  <option value="ppf">PPF (Paint Protection Film)</option>
                </select>
              </Field>
              <Field label="Priority">
                <select
                  name="priority"
                  value={formData.priority}
                  onClick={handleChange}
                  className={inputCls()}
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                </select>
              </Field>
            </div>
            <Field label="Service Detail *" error={errors.serviceDetail}>
              <input
                name="serviceDetail"
                value={formData.serviceDetail}
                onChange={handleChange}
                placeholder="e.g Full Ceramic Tint - 20% or Full Body Wrap - Matte Olive"
                className={inputCls(errors.serviceDetail)}
              />
            </Field>
          </FormSection>

          <FormSection label="Scheduling">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Due Date *" errors={errors.dueDate}>
                <input
                  type="data"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  min={todayISO()}
                  className={inputCls(errors.dueDate)}
                />
              </Field>
              <Field label="Assign Technician">
                <select
                  name="technician"
                  value={formData.technician}
                  onChange={handleChange}
                  className={inputCls()}
                >
                  {TECHNICIANS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </FormSection>

          <FormSection label="Notes (optional)">
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Special instructions or concerns..."
              className={`${inputCls()} resize-none`}
            />
          </FormSection>
        </div>

        {/* Footer */}
        <div className="flex items-justify justify-between gap-3 px-6 py-4 border-t border-slate-700">
          <p className="text-xs text-slate-500">* Required fields</p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400
            border border-slate-700 hover:border-slate-500 hover:text-slate-200
            transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white
            bg-blue-600 hover:bg-blue-500 border border-blue-500
            shadow-lg shadow-blue-900/20 transition-all"
            >
              Submit Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Form helper - extracted so JSX above stays readable //
function inputCls(hasError) {
  return `w-full bg-slate-900/60 border rounded-lg px-3 py-2.5 text-sm text-slate-200
  placeholder-slate-600 focus:outline-none focus:ring-1 transition-colors
  ${
    hasError
      ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/30"
      : "border-slate-600 focus:border-slate-400 focus:ring-slate-400/20"
  }`;
}

function FormSection({ label, children }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-3">
        {label}
      </p>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children, error }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-slate-300">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

// Detail Modal //
function DetailModal({ job, onClose }) {
  if (!job) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 border border-slate-600/50 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-6 border-b border-slate-700">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">
              Job Details
            </p>
            <h2 className="text-xl font-bold text-slate-100">
              {job.customerName}
            </h2>
            <p className="text-sm text-slate-400 mt-1 font-mono">
              {job.plateNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-slate-500 hover:text-slate-200 text-xl leading-none mt-1 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex gap-2 flex-wrap">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full border ${getServiceStyle(job.serviceType)}`}
            >
              {job.serviceType.toUpperCase()}
            </span>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full border ${getPriorityStyle(job.priority)}`}
            >
              {job.priority.toUpperCase()} PRIORITY
            </span>
            {isOverDue(job.dueDate) && job.status !== "complete" && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full border bg-red-500/20 text-red-300 border-red-500/30">
                OVERDUE
              </span>
            )}
          </div>
          <DetailSection label="Vehicle">
            <DetailRow
              label="Year / Make / Model"
              value={`${job.year} ${job.make} ${job.model}`}
            />
            <DetailRow label="Color" value={job.color} />
            <DetailRow label="Plate" value={job.plateNumber} mono />
          </DetailSection>
          /
        </div>
      </div>
    </div>
  );
}
