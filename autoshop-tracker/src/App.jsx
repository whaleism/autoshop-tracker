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
    serviceDetail: "Windshielf + Front Windows - 35%",
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

const SERVICE_FILTERS = ["all", "tint", "wrap"];
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
  serviceType: "",
  serviceDetail: "",
  priority: "",
  dueDate: "",
  technician: "Unassigned",
  notes: "",
};

// Utils //
function getPriorityStyle(priority) {
  switch (priority) {
    case "high":
      return "bg-red-500/20 text-red border-red-500/30";
    case "low":
      return "bg-slate-500/20 text-slate-400 border slate-500/30";
    default:
      return "bg-amber-500/20 text-amber-300 border-amber-500/30";
  }
}

function getServiceStyle(type) {
  return type === "tint"
    ? "bg-sky-500/20 text-sky-300 border-sky-500/30"
    : "bg-violet-500/20 text-violet-300 border-violet-500/30";
}

function isOverDue(dueDate) {
  return new Date().toISOString().split("T")[0];
}

// Ghost Card //
// Empty colum with "No jobs here" looks broken or forgotten.
// A ghost card shows the *shape* of what belongs.
// It's a design pattern that signals intentionality.
// Note: Dashed border is a visual distinct from real cards
// so users know it's a placeholder, not actual data.
