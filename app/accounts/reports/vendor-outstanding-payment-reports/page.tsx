"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Send, X, Download, Mail, Eye, FileText, ChevronUp, ChevronDown, DollarSign, AlertCircle } from "lucide-react";

// ==================== TYPE DEFINITIONS ====================
interface VendorOutstandingPayment {
  id: number;
  sNo: number;
  vendorName: string;
  vendorCode: string;
  invoiceNo: string;
  invoiceDate: string;
  dueDate: string;
  billAmount: number;
  paidAmount: number;
  pendingAmount: number;
  paymentTerms: string;
  lastPaymentDate: string;
  lastPaymentAmount: number;
  daysOverdue: number;
  status: string;
  priority: string;
  contactPerson: string;
  phoneNo: string;
  email: string;
  remarks: string;
}

// ==================== MOCK DATA ====================
const mockVendorOutstandingPaymentData: VendorOutstandingPayment[] = [
  { id: 1, sNo: 1, vendorName: "Sharma Suppliers", vendorCode: "VEN001", invoiceNo: "INV-101", invoiceDate: "15-03-2026", dueDate: "15-04-2026", billAmount: 50000, paidAmount: 25000, pendingAmount: 25000, paymentTerms: "Net 30", lastPaymentDate: "10-04-2026", lastPaymentAmount: 25000, daysOverdue: 33, status: "Overdue", priority: "High", contactPerson: "Rajesh Sharma", phoneNo: "9876543210", email: "sharma@suppliers.com", remarks: "Partial payment received" },
  { id: 2, sNo: 2, vendorName: "Tech Solutions Pvt Ltd", vendorCode: "VEN002", invoiceNo: "INV-102", invoiceDate: "10-04-2026", dueDate: "10-05-2026", billAmount: 75000, paidAmount: 75000, pendingAmount: 0, paymentTerms: "Net 30", lastPaymentDate: "08-05-2026", lastPaymentAmount: 75000, daysOverdue: 0, status: "Settled", priority: "Low", contactPerson: "Amit Kumar", phoneNo: "9876543211", email: "amit@techsol.com", remarks: "Full payment cleared" },
  { id: 3, sNo: 3, vendorName: "Goyal Transport Co", vendorCode: "VEN003", invoiceNo: "INV-103", invoiceDate: "01-01-2026", dueDate: "01-02-2026", billAmount: 35000, paidAmount: 0, pendingAmount: 35000, paymentTerms: "Net 30", lastPaymentDate: "-", lastPaymentAmount: 0, daysOverdue: 106, status: "Critical", priority: "Urgent", contactPerson: "Suresh Goyal", phoneNo: "9876543212", email: "suresh@goyal.com", remarks: "Multiple reminders sent" },
  { id: 4, sNo: 4, vendorName: "Singh Enterprises", vendorCode: "VEN004", invoiceNo: "INV-104", invoiceDate: "20-02-2026", dueDate: "20-03-2026", billAmount: 25000, paidAmount: 25000, pendingAmount: 0, paymentTerms: "Net 30", lastPaymentDate: "18-03-2026", lastPaymentAmount: 25000, daysOverdue: 0, status: "Settled", priority: "Low", contactPerson: "Harpreet Singh", phoneNo: "9876543213", email: "harpreet@singh.com", remarks: "Paid on time" },
  { id: 5, sNo: 5, vendorName: "Patel Agencies", vendorCode: "VEN005", invoiceNo: "INV-105", invoiceDate: "05-05-2026", dueDate: "05-06-2026", billAmount: 60000, paidAmount: 20000, pendingAmount: 40000, paymentTerms: "Net 30", lastPaymentDate: "20-05-2026", lastPaymentAmount: 20000, daysOverdue: -18, status: "Upcoming", priority: "Medium", contactPerson: "Kiran Patel", phoneNo: "9876543214", email: "kiran@patel.com", remarks: "Advance payment made" },
  { id: 6, sNo: 6, vendorName: "Verma Logistics", vendorCode: "VEN006", invoiceNo: "INV-106", invoiceDate: "15-12-2025", dueDate: "15-01-2026", billAmount: 45000, paidAmount: 45000, pendingAmount: 0, paymentTerms: "Net 30", lastPaymentDate: "10-01-2026", lastPaymentAmount: 45000, daysOverdue: 0, status: "Settled", priority: "Low", contactPerson: "Rakesh Verma", phoneNo: "9876543215", email: "rakesh@verma.com", remarks: "Settled" },
  { id: 7, sNo: 7, vendorName: "Malhotra & Sons", vendorCode: "VEN007", invoiceNo: "INV-107", invoiceDate: "10-03-2026", dueDate: "10-04-2026", billAmount: 85000, paidAmount: 0, pendingAmount: 85000, paymentTerms: "Net 30", lastPaymentDate: "-", lastPaymentAmount: 0, daysOverdue: 38, status: "Overdue", priority: "High", contactPerson: "Vikram Malhotra", phoneNo: "9876543216", email: "vikram@malhotra.com", remarks: "Pending approval" },
  { id: 8, sNo: 8, vendorName: "Gupta Traders", vendorCode: "VEN008", invoiceNo: "INV-108", invoiceDate: "25-04-2026", dueDate: "25-05-2026", billAmount: 22000, paidAmount: 22000, pendingAmount: 0, paymentTerms: "Net 30", lastPaymentDate: "22-05-2026", lastPaymentAmount: 22000, daysOverdue: -7, status: "Settled", priority: "Low", contactPerson: "Neha Gupta", phoneNo: "9876543217", email: "neha@gupta.com", remarks: "Early payment" },
  { id: 9, sNo: 9, vendorName: "Kumar Electricals", vendorCode: "VEN009", invoiceNo: "INV-109", invoiceDate: "01-03-2026", dueDate: "31-03-2026", billAmount: 18000, paidAmount: 5000, pendingAmount: 13000, paymentTerms: "Net 30", lastPaymentDate: "15-03-2026", lastPaymentAmount: 5000, daysOverdue: 48, status: "Overdue", priority: "Medium", contactPerson: "Sunil Kumar", phoneNo: "9876543218", email: "sunil@kumar.com", remarks: "Follow up required" },
  { id: 10, sNo: 10, vendorName: "Sharma Suppliers", vendorCode: "VEN001", invoiceNo: "INV-110", invoiceDate: "18-05-2026", dueDate: "18-06-2026", billAmount: 32000, paidAmount: 0, pendingAmount: 32000, paymentTerms: "Net 30", lastPaymentDate: "-", lastPaymentAmount: 0, daysOverdue: -31, status: "Current", priority: "Low", contactPerson: "Rajesh Sharma", phoneNo: "9876543210", email: "sharma@suppliers.com", remarks: "New invoice" },
  { id: 11, sNo: 11, vendorName: "Goyal Transport Co", vendorCode: "VEN003", invoiceNo: "INV-111", invoiceDate: "15-08-2025", dueDate: "15-09-2025", billAmount: 28000, paidAmount: 0, pendingAmount: 28000, paymentTerms: "Net 30", lastPaymentDate: "-", lastPaymentAmount: 0, daysOverdue: 245, status: "Critical", priority: "Urgent", contactPerson: "Suresh Goyal", phoneNo: "9876543212", email: "suresh@goyal.com", remarks: "Escalate to management" },
  { id: 12, sNo: 12, vendorName: "Patel Agencies", vendorCode: "VEN005", invoiceNo: "INV-112", invoiceDate: "10-02-2026", dueDate: "10-03-2026", billAmount: 55000, paidAmount: 30000, pendingAmount: 25000, paymentTerms: "Net 30", lastPaymentDate: "05-03-2026", lastPaymentAmount: 30000, daysOverdue: 69, status: "Overdue", priority: "High", contactPerson: "Kiran Patel", phoneNo: "9876543214", email: "kiran@patel.com", remarks: "Payment commitment given" },
];

// Filter options
const zones = ["NORTH ZONE", "SOUTH ZONE", "EAST ZONE", "WEST ZONE", "CENTRAL ZONE"];
const states = ["DELHI", "UTTAR PRADESH", "MAHARASHTRA", "GUJARAT", "RAJASTHAN", "PUNJAB", "HARYANA", "KARNATAKA"];
const regions = ["NORTH", "SOUTH", "EAST", "WEST", "CENTRAL"];
const hubs = ["DELHI HUB", "MUMBAI HUB", "BANGALORE HUB", "KOLKATA HUB", "CHENNAI HUB", "AHMEDABAD HUB"];
const branches = ["DELHI", "MUMBAI", "BANGALORE", "CHENNAI", "KOLKATA", "PUNE", "JAIPUR", "LUCKNOW"];
const agencies = ["AGENCY A", "AGENCY B", "AGENCY C", "AGENCY D", "AGENCY E"];
const branchTypes = ["Retail", "Corporate", "Wholesale", "Distribution", "E-Commerce"];
const vendors = ["Sharma Suppliers", "Tech Solutions Pvt Ltd", "Goyal Transport Co", "Singh Enterprises", "Patel Agencies", "Verma Logistics", "Malhotra & Sons", "Gupta Traders", "Kumar Electricals"];

export default function VendorOutstandingPaymentReport() {
  // Date state
  const [periodFrom, setPeriodFrom] = useState<Date>(new Date(2026, 4, 18));
  const [periodTo, setPeriodTo] = useState<Date>(new Date(2026, 4, 18));
  const [asOnDate, setAsOnDate] = useState<Date>(new Date(2026, 4, 18));

  // Checkbox states
  const [branchTypeAll, setBranchTypeAll] = useState(true);
  const [vendorAll, setVendorAll] = useState(true);

  // Filter states
  const [selectedBranchType, setSelectedBranchType] = useState<string>("");
  const [zone, setZone] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [hub, setHub] = useState<string>("");
  const [branch, setBranch] = useState<string>("");
  const [agency, setAgency] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedVendor, setSelectedVendor] = useState<string>("");

  // Sort state
  const [sortColumn, setSortColumn] = useState<keyof VendorOutstandingPayment>("sNo");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Filtered data
  const [filteredData, setFilteredData] = useState<VendorOutstandingPayment[]>(mockVendorOutstandingPaymentData);

  // Report view state
  const [showReport, setShowReport] = useState<boolean>(true);

  // Email modal state
  const [mailModalOpen, setMailModalOpen] = useState(false);
  const [mailTo, setMailTo] = useState("");
  const [mailSubject, setMailSubject] = useState("Vendor Outstanding Payment Report");
  const [mailBody, setMailBody] = useState(
    "Dear Sir/Madam,\n\nPlease find attached the Vendor Outstanding Payment Report.\n\nRegards,\nFinance Team"
  );

  // Handle Show Report / Grid View
  const handleGridView = () => {
    let filtered = [...mockVendorOutstandingPaymentData];

    // Filter by period (Invoice Date range)
    filtered = filtered.filter((record) => {
      const recordDate = new Date(record.invoiceDate.split("-").reverse().join("-"));
      return recordDate >= periodFrom && recordDate <= periodTo;
    });

    // Filter by vendor
    if (!vendorAll && selectedVendor) {
      filtered = filtered.filter((record) => record.vendorName === selectedVendor);
    }

    setFilteredData(filtered);
    setShowReport(true);
  };

  // Handle Clear
  const handleClear = () => {
    setPeriodFrom(new Date(2026, 4, 18));
    setPeriodTo(new Date(2026, 4, 18));
    setAsOnDate(new Date(2026, 4, 18));
    setBranchTypeAll(true);
    setVendorAll(true);
    setSelectedBranchType("");
    setZone("");
    setState("");
    setRegion("");
    setHub("");
    setBranch("");
    setAgency("");
    setSelectedBranch("");
    setSelectedVendor("");
    setFilteredData(mockVendorOutstandingPaymentData);
    setSortColumn("sNo");
    setSortDirection("asc");
    setShowReport(true);
  };

  // Handle Close
  const handleClose = () => {
    handleClear();
  };

  // Handle Sort
  const handleSort = (column: keyof VendorOutstandingPayment) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }

    const sorted = [...filteredData].sort((a, b) => {
      let aVal = a[column];
      let bVal = b[column];

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }

      aVal = String(aVal).toLowerCase();
      bVal = String(bVal).toLowerCase();

      if (sortDirection === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredData(sorted);
  };

  // Get sort icon
  const getSortIcon = (column: keyof VendorOutstandingPayment) => {
    if (sortColumn !== column) return null;
    return sortDirection === "asc" ? <ChevronUp className="h-3 w-3 inline ml-1" /> : <ChevronDown className="h-3 w-3 inline ml-1" />;
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "settled":
        return "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium";
      case "overdue":
        return "bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium";
      case "critical":
        return "bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium";
      case "current":
        return "bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium";
      case "upcoming":
        return "bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium";
      default:
        return "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium";
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "urgent":
        return "bg-red-200 text-red-900 px-2 py-1 rounded-full text-xs font-medium";
      case "high":
        return "bg-orange-200 text-orange-900 px-2 py-1 rounded-full text-xs font-medium";
      case "medium":
        return "bg-yellow-200 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium";
      case "low":
        return "bg-green-200 text-green-900 px-2 py-1 rounded-full text-xs font-medium";
      default:
        return "bg-gray-200 text-gray-900 px-2 py-1 rounded-full text-xs font-medium";
    }
  };

  // Calculate totals
  const totalBillAmount = filteredData.reduce((sum, r) => sum + r.billAmount, 0);
  const totalPaidAmount = filteredData.reduce((sum, r) => sum + r.paidAmount, 0);
  const totalPendingAmount = filteredData.reduce((sum, r) => sum + r.pendingAmount, 0);

  // Generate report HTML for email attachment
  const generateReportHTML = (): string => {
    let rowsHtml = "";
    filteredData.forEach((record) => {
      rowsHtml += `
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 8px;">${record.sNo}</td>
          <td style="padding: 8px;">${record.vendorName}</td><td style="padding: 8px;">${record.vendorCode}</td>
          <td style="padding: 8px;">${record.invoiceNo}</td><td style="padding: 8px;">${record.invoiceDate}</td>
          <td style="padding: 8px;">${record.dueDate}</td>
          <td style="padding: 8px; text-align: right;">${record.billAmount.toLocaleString("en-IN")}</td>
          <td style="padding: 8px; text-align: right;">${record.paidAmount.toLocaleString("en-IN")}</td>
          <td style="padding: 8px; text-align: right;">${record.pendingAmount.toLocaleString("en-IN")}</td>
          <td style="padding: 8px;">${record.paymentTerms}</td>
          <td style="padding: 8px;">${record.lastPaymentDate}</td>
          <td style="padding: 8px;">${record.daysOverdue}</td>
          <td style="padding: 8px;">${record.status}</td>
          <td style="padding: 8px;">${record.priority}</td>
        </tr>
      `;
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Vendor Outstanding Payment Report</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; margin: 30px; }
          .header { background: #1e3a8a; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .filters { background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
          th { background: #2563eb; color: white; padding: 10px; text-align: left; }
          td { padding: 8px; border-bottom: 1px solid #ddd; }
          .totals { margin-top: 20px; padding: 15px; background: #f9fafb; border-radius: 8px; font-weight: bold; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #6b7280; }
          .text-right { text-align: right; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>💰 VENDOR OUTSTANDING PAYMENT REPORT</h2>
          <p>Generated on: ${new Date().toLocaleString()}</p>
        </div>
        <div class="filters">
          <strong>Report Parameters:</strong><br/>
          Period: ${format(periodFrom, "dd-MM-yyyy")} to ${format(periodTo, "dd-MM-yyyy")}<br/>
          As On Date: ${format(asOnDate, "dd-MM-yyyy")}<br/>
          Vendor: ${vendorAll ? "ALL" : selectedVendor || "Not Selected"}<br/>
          Branch Type: ${branchTypeAll ? "ALL" : selectedBranchType || "Not Selected"}
        </div>
        <table>
          <thead>
            <tr><th>SNo</th><th>Vendor Name</th><th>Code</th><th>Invoice No</th><th>Inv Date</th>
            <th>Due Date</th><th>Bill Amt</th><th>Paid Amt</th><th>Pending</th><th>Terms</th>
            <th>Last Payment</th><th>Days Overdue</th><th>Status</th><th>Priority</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
          <tfoot>
            <tr style="background: #eef2ff; font-weight: bold;">
              <td colspan="6">TOTAL</td>
              <td class="text-right">${totalBillAmount.toLocaleString("en-IN")}</td>
              <td class="text-right">${totalPaidAmount.toLocaleString("en-IN")}</td>
              <td class="text-right">${totalPendingAmount.toLocaleString("en-IN")}</td>
              <td colspan="5"></td>
            </tr>
          </tfoot>
        </table>
        <div class="totals">
          <div>💰 Total Bill Amount: ₹${totalBillAmount.toLocaleString("en-IN")}</div>
          <div>💸 Total Paid Amount: ₹${totalPaidAmount.toLocaleString("en-IN")}</div>
          <div>⚠️ Total Outstanding Payment: ₹${totalPendingAmount.toLocaleString("en-IN")}</div>
        </div>
        <div class="footer">
          This is a system-generated vendor outstanding payment report. For any discrepancies, contact finance department.
        </div>
      </body>
      </html>
    `;
  };

  const handleSendReportClick = () => {
    if (filteredData.length === 0) {
      alert("No data to send. Please generate the report first.");
      return;
    }
    setMailModalOpen(true);
  };

  const handleSendEmail = () => {
    if (!mailTo.trim()) {
      alert("Please enter a valid email address");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mailTo)) {
      alert("Invalid email format");
      return;
    }

    const reportHtml = generateReportHTML();
    const blob = new Blob([reportHtml], { type: "text/html" });
    const file = new File([blob], `Vendor_Outstanding_Payment_${format(new Date(), "yyyyMMdd_HHmmss")}.html`, { type: "text/html" });

    console.log("Sending email:", { to: mailTo, subject: mailSubject, body: mailBody, attachment: file });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);

    alert(`Report sent successfully to: ${mailTo}\n(Attachment downloaded for demo)`);
    setMailModalOpen(false);
    setMailTo("");
  };

  const handleDiscardEmail = () => {
    setMailModalOpen(false);
    setMailTo("");
    setMailSubject("Vendor Outstanding Payment Report");
    setMailBody("Dear Sir/Madam,\n\nPlease find attached the Vendor Outstanding Payment Report.\n\nRegards,\nFinance Team");
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-primary">VENDOR OUTSTANDING PAYMENT REPORT</h1>
        <div className="text-xs text-muted-foreground mt-1">
          Company : GOLDEN ROADWAYS &amp; LOGISTICS PVT LTD | Login By : ADMIN@GMAIL.COM
          <br />
          Login Branch : CORPORATE OFFICE | Financial Year : 2026-2027
        </div>
      </div>

      {/* Filter Card */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Criteria</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Period and As On Date */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Period From</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(periodFrom, "dd-MM-yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={periodFrom} onSelect={(d) => d && setPeriodFrom(d)} />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Period To</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(periodTo, "dd-MM-yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={periodTo} onSelect={(d) => d && setPeriodTo(d)} />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>As On Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(asOnDate, "dd-MM-yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={asOnDate} onSelect={(d) => d && setAsOnDate(d)} />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Select Branch Type with ALL checkbox */}
          <div>
            <Label className="text-base font-medium">Select Branch Type</Label>
            <div className="flex items-center gap-3 mt-2">
              <Checkbox
                checked={branchTypeAll}
                onCheckedChange={(checked) => setBranchTypeAll(!!checked)}
              />
              <Label>ALL</Label>
            </div>
            {!branchTypeAll && (
              <div className="mt-3">
                <Select value={selectedBranchType} onValueChange={setSelectedBranchType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Branch Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {branchTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Zone, State, Region, Hub, Branch, Agency */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label>Zone</Label>
              <Select value={zone} onValueChange={setZone}>
                <SelectTrigger><SelectValue placeholder="Select Zone" /></SelectTrigger>
                <SelectContent>
                  {zones.map((z) => <SelectItem key={z} value={z}>{z}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>State</Label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                <SelectContent>
                  {states.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Region</Label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger><SelectValue placeholder="Select Region" /></SelectTrigger>
                <SelectContent>
                  {regions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Hub</Label>
              <Select value={hub} onValueChange={setHub}>
                <SelectTrigger><SelectValue placeholder="Select Hub" /></SelectTrigger>
                <SelectContent>
                  {hubs.map((h) => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Branch</Label>
              <Select value={branch} onValueChange={setBranch}>
                <SelectTrigger><SelectValue placeholder="Select Branch" /></SelectTrigger>
                <SelectContent>
                  {branches.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Agency</Label>
              <Select value={agency} onValueChange={setAgency}>
                <SelectTrigger><SelectValue placeholder="Select Agency" /></SelectTrigger>
                <SelectContent>
                  {agencies.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Select Branch */}
          <div>
            <Label>Select Branch</Label>
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger>
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Select Vendor with ALL checkbox */}
          <div>
            <Label className="text-base font-medium">Select Vendor</Label>
            <div className="flex items-center gap-3 mt-2">
              <Checkbox
                checked={vendorAll}
                onCheckedChange={(checked) => setVendorAll(!!checked)}
              />
              <Label>ALL</Label>
            </div>
            {!vendorAll && (
              <div className="mt-3">
                <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-6 border-t">
            <Button variant="outline" onClick={handleClose}>
              <X className="mr-2 h-4 w-4" /> Close
            </Button>
            <Button onClick={handleGridView} className="bg-blue-600 hover:bg-blue-700">
              <Eye className="mr-2 h-4 w-4" /> Show Report
            </Button>
            <Button variant="outline" onClick={handleClear}>
              <Download className="mr-2 h-4 w-4" /> Clear
            </Button>
            <Button onClick={handleSendReportClick} className="bg-green-600 hover:bg-green-700">
              <Mail className="mr-2 h-4 w-4" /> Send Report as Attachment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Table - Outstanding Payment Grid View */}
      {showReport && (
        <Card>
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Vendor Outstanding Payment Report
              <span className="text-sm font-normal text-gray-500 ml-4">
                Period: {format(periodFrom, "dd-MM-yyyy")} to {format(periodTo, "dd-MM-yyyy")} | As On: {format(asOnDate, "dd-MM-yyyy")} | Total Records: {filteredData.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <div className="bg-gray-100 text-gray-500 text-xs p-2 border-b italic">
              Outstanding payments as on {format(asOnDate, "dd-MM-yyyy")} | Total Outstanding: ₹{totalPendingAmount.toLocaleString("en-IN")}
            </div>

            <table className="w-full text-sm">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="p-2 text-left font-semibold border-b cursor-pointer hover:bg-gray-200 w-12" onClick={() => handleSort("sNo")}>
                    SNo {getSortIcon("sNo")}
                  </th>
                  <th className="p-2 text-left font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("vendorName")}>
                    Vendor Name {getSortIcon("vendorName")}
                  </th>
                  <th className="p-2 text-left font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("vendorCode")}>
                    Code {getSortIcon("vendorCode")}
                  </th>
                  <th className="p-2 text-left font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("invoiceNo")}>
                    Invoice No {getSortIcon("invoiceNo")}
                  </th>
                  <th className="p-2 text-left font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("invoiceDate")}>
                    Inv Date {getSortIcon("invoiceDate")}
                  </th>
                  <th className="p-2 text-left font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("dueDate")}>
                    Due Date {getSortIcon("dueDate")}
                  </th>
                  <th className="p-2 text-right font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("billAmount")}>
                    Bill Amt (₹) {getSortIcon("billAmount")}
                  </th>
                  <th className="p-2 text-right font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("paidAmount")}>
                    Paid Amt (₹) {getSortIcon("paidAmount")}
                  </th>
                  <th className="p-2 text-right font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("pendingAmount")}>
                    Pending (₹) {getSortIcon("pendingAmount")}
                  </th>
                  <th className="p-2 text-left font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("paymentTerms")}>
                    Payment Terms {getSortIcon("paymentTerms")}
                  </th>
                  <th className="p-2 text-left font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("lastPaymentDate")}>
                    Last Payment {getSortIcon("lastPaymentDate")}
                  </th>
                  <th className="p-2 text-right font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("daysOverdue")}>
                    Days Overdue {getSortIcon("daysOverdue")}
                  </th>
                  <th className="p-2 text-left font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("status")}>
                    Status {getSortIcon("status")}
                  </th>
                  <th className="p-2 text-left font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("priority")}>
                    Priority {getSortIcon("priority")}
                  </th>
                  <th className="p-2 text-left font-semibold border-b">Contact</th>
                  <th className="p-2 text-left font-semibold border-b">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={16} className="p-8 text-center text-gray-500">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      No outstanding payment records found for the selected criteria.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((record) => (
                    <tr key={record.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{record.sNo}</td>
                      <td className="p-2 font-medium">{record.vendorName}</td>
                      <td className="p-2 text-xs text-gray-500">{record.vendorCode}</td>
                      <td className="p-2 text-blue-600">{record.invoiceNo}</td>
                      <td className="p-2">{record.invoiceDate}</td>
                      <td className="p-2">{record.dueDate}</td>
                      <td className="p-2 text-right">₹{record.billAmount.toLocaleString("en-IN")}</td>
                      <td className="p-2 text-right">₹{record.paidAmount.toLocaleString("en-IN")}</td>
                      <td className="p-2 text-right font-bold text-red-600">₹{record.pendingAmount.toLocaleString("en-IN")}</td>
                      <td className="p-2">{record.paymentTerms}</td>
                      <td className="p-2">{record.lastPaymentDate !== "-" ? record.lastPaymentDate : "-"}</td>
                      <td className="p-2 text-right">
                        <span className={record.daysOverdue > 0 ? "text-red-600 font-semibold" : record.daysOverdue < 0 ? "text-green-600" : "text-gray-600"}>
                          {record.daysOverdue > 0 ? `+${record.daysOverdue}` : record.daysOverdue}
                        </span>
                      </td>
                      <td className="p-2"><span className={getStatusBadge(record.status)}>{record.status}</span></td>
                      <td className="p-2"><span className={getPriorityBadge(record.priority)}>{record.priority}</span></td>
                      <td className="p-2 text-xs">
                        {record.contactPerson}<br/>
                        {record.phoneNo}
                      </td>
                      <td className="p-2 text-xs max-w-xs truncate" title={record.remarks}>
                        {record.remarks}
                      </td>
                    </tr>
                  ))
                )}
                {/* Totals Row */}
                {filteredData.length > 0 && (
                  <tr className="bg-gray-100 font-semibold border-t-2 border-gray-300">
                    <td colSpan={6} className="p-2 text-right">GRAND TOTAL:</td>
                    <td className="p-2 text-right">₹{totalBillAmount.toLocaleString("en-IN")}</td>
                    <td className="p-2 text-right">₹{totalPaidAmount.toLocaleString("en-IN")}</td>
                    <td className="p-2 text-right text-red-600">₹{totalPendingAmount.toLocaleString("en-IN")}</td>
                    <td colSpan={7}></td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 border-t">
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="text-xs text-gray-500">Total Bill Amount</div>
                <div className="text-xl font-bold text-blue-600">₹{totalBillAmount.toLocaleString("en-IN")}</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="text-xs text-gray-500">Total Paid Amount</div>
                <div className="text-xl font-bold text-green-600">₹{totalPaidAmount.toLocaleString("en-IN")}</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="text-xs text-gray-500">Total Outstanding</div>
                <div className="text-xl font-bold text-red-600">₹{totalPendingAmount.toLocaleString("en-IN")}</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="text-xs text-gray-500">Overdue / Critical</div>
                <div className="text-xl font-bold text-orange-600">
                  {filteredData.filter(r => r.status === "Overdue" || r.status === "Critical").length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Email Modal */}
      <Dialog open={mailModalOpen} onOpenChange={setMailModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Report as Attachment</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Email To <span className="text-red-500">*</span></Label>
              <Input
                type="email"
                placeholder="vendor@company.com, accounts@example.com"
                value={mailTo}
                onChange={(e) => setMailTo(e.target.value)}
              />
            </div>

            <div>
              <Label>Subject</Label>
              <Input value={mailSubject} onChange={(e) => setMailSubject(e.target.value)} />
            </div>

            <div>
              <Label>Body</Label>
              <textarea
                className="w-full min-h-[100px] p-3 border rounded-md resize-none"
                value={mailBody}
                onChange={(e) => setMailBody(e.target.value)}
              />
            </div>

            <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-600">
              <strong>Attachment:</strong> Vendor_Outstanding_Payment_{format(new Date(), "yyyyMMdd")}.html
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleDiscardEmail}>
              <X className="mr-2 h-4 w-4" /> Discard
            </Button>
            <Button onClick={handleSendEmail} className="bg-green-600 hover:bg-green-700">
              <Send className="mr-2 h-4 w-4" /> Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}