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
import { CalendarIcon, Send, X, Download, Mail, Eye, FileText, ChevronUp, ChevronDown, Clock, AlertCircle, Truck } from "lucide-react";

// ==================== TYPE DEFINITIONS ====================
interface LHCPendingPayment {
  id: number;
  sNo: number;
  lhcNo: string;
  lhcDate: string;
  vehicleNo: string;
  vehicleType: string;
  vendorName: string;
  vendorCode: string;
  fromLocation: string;
  toLocation: string;
  billAmount: number;
  paidAmount: number;
  pendingAmount: number;
  paymentDueDate: string;
  daysOverdue: number;
  status: string;
  remarks: string;
  createdOn: string;
}

// ==================== MOCK DATA ====================
const mockLHCPendingData: LHCPendingPayment[] = [
  { id: 1, sNo: 1, lhcNo: "LHC/2026-27/001", lhcDate: "01-05-2026", vehicleNo: "HR-55-AB-1234", vehicleType: "Container Truck", vendorName: "Sharma Transport", vendorCode: "VEN001", fromLocation: "Delhi", toLocation: "Mumbai", billAmount: 45000, paidAmount: 20000, pendingAmount: 25000, paymentDueDate: "15-05-2026", daysOverdue: 3, status: "Overdue", remarks: "Partial payment made", createdOn: "01-05-2026" },
  { id: 2, sNo: 2, lhcNo: "LHC/2026-27/002", lhcDate: "05-05-2026", vehicleNo: "DL-1G-3456", vehicleType: "Pickup Truck", vendorName: "Goyal Logistics", vendorCode: "VEN002", fromLocation: "Noida", toLocation: "Jaipur", billAmount: 28000, paidAmount: 0, pendingAmount: 28000, paymentDueDate: "20-05-2026", daysOverdue: -2, status: "Upcoming", remarks: "Payment pending", createdOn: "05-05-2026" },
  { id: 3, sNo: 3, lhcNo: "LHC/2026-27/003", lhcDate: "10-04-2026", vehicleNo: "MH-12-AB-7890", vehicleType: "Trailer", vendorName: "Patel Carriers", vendorCode: "VEN003", fromLocation: "Mumbai", toLocation: "Bangalore", billAmount: 62000, paidAmount: 62000, pendingAmount: 0, paymentDueDate: "25-04-2026", daysOverdue: 23, status: "Settled", remarks: "Full payment done", createdOn: "10-04-2026" },
  { id: 4, sNo: 4, lhcNo: "LHC/2026-27/004", lhcDate: "15-04-2026", vehicleNo: "UP-16-AB-4321", vehicleType: "Container Truck", vendorName: "Singh Transport", vendorCode: "VEN004", fromLocation: "Lucknow", toLocation: "Delhi", billAmount: 35000, paidAmount: 15000, pendingAmount: 20000, paymentDueDate: "30-04-2026", daysOverdue: 18, status: "Overdue", remarks: "Cheque issued pending clearance", createdOn: "15-04-2026" },
  { id: 5, sNo: 5, lhcNo: "LHC/2026-27/005", lhcDate: "18-05-2026", vehicleNo: "HR-26-AB-5678", vehicleType: "Pickup Truck", vendorName: "Verma Logistics", vendorCode: "VEN005", fromLocation: "Gurgaon", toLocation: "Chandigarh", billAmount: 18000, paidAmount: 0, pendingAmount: 18000, paymentDueDate: "02-06-2026", daysOverdue: -15, status: "Pending", remarks: "Awaiting approval", createdOn: "18-05-2026" },
  { id: 6, sNo: 6, lhcNo: "LHC/2026-27/006", lhcDate: "08-05-2026", vehicleNo: "PB-10-AB-9012", vehicleType: "Trailer", vendorName: "Malhotra & Sons", vendorCode: "VEN006", fromLocation: "Amritsar", toLocation: "Delhi", billAmount: 55000, paidAmount: 25000, pendingAmount: 30000, paymentDueDate: "23-05-2026", daysOverdue: -5, status: "Due Soon", remarks: "Partial payment", createdOn: "08-05-2026" },
  { id: 7, sNo: 7, lhcNo: "LHC/2026-27/007", lhcDate: "20-04-2026", vehicleNo: "RJ-14-AB-3456", vehicleType: "Container Truck", vendorName: "Kumar Transport", vendorCode: "VEN007", fromLocation: "Jaipur", toLocation: "Ahmedabad", billAmount: 48000, paidAmount: 0, pendingAmount: 48000, paymentDueDate: "05-05-2026", daysOverdue: 13, status: "Critical", remarks: "Multiple reminders sent", createdOn: "20-04-2026" },
  { id: 8, sNo: 8, lhcNo: "LHC/2026-27/008", lhcDate: "12-05-2026", vehicleNo: "DL-1G-7890", vehicleType: "Pickup Truck", vendorName: "Gupta Agencies", vendorCode: "VEN008", fromLocation: "Delhi", toLocation: "Dehradun", billAmount: 22000, paidAmount: 22000, pendingAmount: 0, paymentDueDate: "27-05-2026", daysOverdue: -9, status: "Settled", remarks: "Paid via NEFT", createdOn: "12-05-2026" },
  { id: 9, sNo: 9, lhcNo: "LHC/2026-27/009", lhcDate: "25-04-2026", vehicleNo: "HR-55-AB-1111", vehicleType: "Container Truck", vendorName: "Sharma Transport", vendorCode: "VEN001", fromLocation: "Delhi", toLocation: "Chennai", billAmount: 75000, paidAmount: 40000, pendingAmount: 35000, paymentDueDate: "10-05-2026", daysOverdue: 8, status: "Overdue", remarks: "Balance pending", createdOn: "25-04-2026" },
  { id: 10, sNo: 10, lhcNo: "LHC/2026-27/010", lhcDate: "16-05-2026", vehicleNo: "MH-12-AB-2222", vehicleType: "Trailer", vendorName: "Patel Carriers", vendorCode: "VEN003", fromLocation: "Pune", toLocation: "Hyderabad", billAmount: 52000, paidAmount: 0, pendingAmount: 52000, paymentDueDate: "31-05-2026", daysOverdue: -13, status: "Pending", remarks: "Invoice raised", createdOn: "16-05-2026" },
];

// Filter options
const zones = ["NORTH ZONE", "SOUTH ZONE", "EAST ZONE", "WEST ZONE"];
const states = ["DELHI", "UTTAR PRADESH", "MAHARASHTRA", "GUJARAT", "RAJASTHAN", "PUNJAB", "HARYANA"];
const regions = ["NORTH", "SOUTH", "EAST", "WEST", "CENTRAL"];
const hubs = ["DELHI HUB", "MUMBAI HUB", "BANGALORE HUB", "KOLKATA HUB", "CHENNAI HUB"];
const branches = ["DELHI", "MUMBAI", "BANGALORE", "CHENNAI", "KOLKATA", "PUNE", "JAIPUR"];
const agencies = ["AGENCY A", "AGENCY B", "AGENCY C", "AGENCY D"];
const branchTypes = ["Retail", "Corporate", "Wholesale", "Distribution"];
const vendors = ["Sharma Transport", "Goyal Logistics", "Patel Carriers", "Singh Transport", "Verma Logistics", "Malhotra & Sons", "Kumar Transport", "Gupta Agencies"];
const vehicles = ["HR-55-AB-1234", "DL-1G-3456", "MH-12-AB-7890", "UP-16-AB-4321", "HR-26-AB-5678", "PB-10-AB-9012", "RJ-14-AB-3456", "DL-1G-7890", "HR-55-AB-1111", "MH-12-AB-2222"];

export default function LHCPendingPaymentsReport() {
  // Date state
  const [periodFrom, setPeriodFrom] = useState<Date>(new Date(2026, 4, 18));
  const [periodTo, setPeriodTo] = useState<Date>(new Date(2026, 4, 18));
  const [asOnDate, setAsOnDate] = useState<Date>(new Date(2026, 4, 18));

  // Checkbox states
  const [branchTypeAll, setBranchTypeAll] = useState(true);
  const [vendorAll, setVendorAll] = useState(true);
  const [vehicleAll, setVehicleAll] = useState(true);

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
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");

  // Sort state
  const [sortColumn, setSortColumn] = useState<keyof LHCPendingPayment>("sNo");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Filtered data
  const [filteredData, setFilteredData] = useState<LHCPendingPayment[]>(mockLHCPendingData);

  // Report view state
  const [showReport, setShowReport] = useState<boolean>(true);

  // Email modal state
  const [mailModalOpen, setMailModalOpen] = useState(false);
  const [mailTo, setMailTo] = useState("");
  const [mailSubject, setMailSubject] = useState("LHC Pending Payments Report");
  const [mailBody, setMailBody] = useState(
    "Dear Sir/Madam,\n\nPlease find attached the LHC Pending Payments Report.\n\nRegards,\nFinance Team"
  );

  // Handle Show Report / Grid View
  const handleGridView = () => {
    let filtered = [...mockLHCPendingData];

    // Filter by period (LHC Date range)
    filtered = filtered.filter((record) => {
      const recordDate = new Date(record.lhcDate.split("-").reverse().join("-"));
      return recordDate >= periodFrom && recordDate <= periodTo;
    });

    // Filter by vendor
    if (!vendorAll && selectedVendor) {
      filtered = filtered.filter((record) => record.vendorName === selectedVendor);
    }

    // Filter by vehicle
    if (!vehicleAll && selectedVehicle) {
      filtered = filtered.filter((record) => record.vehicleNo === selectedVehicle);
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
    setVehicleAll(true);
    setSelectedBranchType("");
    setZone("");
    setState("");
    setRegion("");
    setHub("");
    setBranch("");
    setAgency("");
    setSelectedBranch("");
    setSelectedVendor("");
    setSelectedVehicle("");
    setFilteredData(mockLHCPendingData);
    setSortColumn("sNo");
    setSortDirection("asc");
    setShowReport(true);
  };

  // Handle Close
  const handleClose = () => {
    handleClear();
  };

  // Handle Sort
  const handleSort = (column: keyof LHCPendingPayment) => {
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
  const getSortIcon = (column: keyof LHCPendingPayment) => {
    if (sortColumn !== column) return null;
    return sortDirection === "asc" ? <ChevronUp className="h-3 w-3 inline ml-1" /> : <ChevronDown className="h-3 w-3 inline ml-1" />;
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "settled":
        return "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium";
      case "overdue":
        return "bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium";
      case "critical":
        return "bg-red-200 text-red-900 px-2 py-1 rounded-full text-xs font-medium";
      case "due soon":
        return "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium";
      case "upcoming":
        return "bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium";
      case "pending":
        return "bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium";
      default:
        return "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium";
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
          <td style="padding: 8px;">${record.lhcNo}</td>
          <td style="padding: 8px;">${record.lhcDate}</td>
          <td style="padding: 8px;">${record.vehicleNo}</td>
          <td style="padding: 8px;">${record.vendorName}</td>
          <td style="padding: 8px;">${record.fromLocation}</td><td style="padding: 8px;">${record.toLocation}</td>
          <td style="padding: 8px; text-align: right;">${record.billAmount.toLocaleString("en-IN")}</td>
          <td style="padding: 8px; text-align: right;">${record.paidAmount.toLocaleString("en-IN")}</td>
          <td style="padding: 8px; text-align: right;">${record.pendingAmount.toLocaleString("en-IN")}</td>
          <td style="padding: 8px;">${record.paymentDueDate}</td>
          <td style="padding: 8px;">${record.daysOverdue}</td>
          <td style="padding: 8px;">${record.status}</td>
        </tr>
      `;
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>LHC Pending Payments Report</title>
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
          <h2>🚚 LHC PENDING PAYMENTS REPORT</h2>
          <p>Generated on: ${new Date().toLocaleString()}</p>
        </div>
        <div class="filters">
          <strong>Report Parameters:</strong><br/>
          Period: ${format(periodFrom, "dd-MM-yyyy")} to ${format(periodTo, "dd-MM-yyyy")}<br/>
          As On Date: ${format(asOnDate, "dd-MM-yyyy")}<br/>
          Vendor: ${vendorAll ? "ALL" : selectedVendor || "Not Selected"}<br/>
          Vehicle: ${vehicleAll ? "ALL" : selectedVehicle || "Not Selected"}<br/>
          Branch Type: ${branchTypeAll ? "ALL" : selectedBranchType || "Not Selected"}
        </div>
        <table>
          <thead>
            <tr><th>SNo</th><th>LHC No</th><th>LHC Date</th><th>Vehicle No</th><th>Vendor Name</th>
            <th>From</th><th>To</th><th>Bill Amt</th><th>Paid Amt</th><th>Pending</th><th>Due Date</th><th>Days Overdue</th><th>Status</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
          <tfoot>
            <tr style="background: #eef2ff; font-weight: bold;">
              <td colspan="7">TOTAL</td>
              <td class="text-right">${totalBillAmount.toLocaleString("en-IN")}</td>
              <td class="text-right">${totalPaidAmount.toLocaleString("en-IN")}</td>
              <td class="text-right">${totalPendingAmount.toLocaleString("en-IN")}</td>
              <td colspan="3"></td>
            </tr>
          </tfoot>
        </table>
        <div class="totals">
          <div>💰 Total Bill Amount: ₹${totalBillAmount.toLocaleString("en-IN")}</div>
          <div>💸 Total Paid Amount: ₹${totalPaidAmount.toLocaleString("en-IN")}</div>
          <div>⚠️ Total Pending Amount: ₹${totalPendingAmount.toLocaleString("en-IN")}</div>
        </div>
        <div class="footer">
          This is a system-generated LHC pending payments report. For any discrepancies, contact finance department.
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
    const file = new File([blob], `LHC_Pending_Payments_${format(new Date(), "yyyyMMdd_HHmmss")}.html`, { type: "text/html" });

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
    setMailSubject("LHC Pending Payments Report");
    setMailBody("Dear Sir/Madam,\n\nPlease find attached the LHC Pending Payments Report.\n\nRegards,\nFinance Team");
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-primary">LHC PENDING PAYMENTS REPORT</h1>
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

          {/* Select Vehicle with ALL checkbox */}
          <div>
            <Label className="text-base font-medium">Select Vehicle</Label>
            <div className="flex items-center gap-3 mt-2">
              <Checkbox
                checked={vehicleAll}
                onCheckedChange={(checked) => setVehicleAll(!!checked)}
              />
              <Label>ALL</Label>
            </div>
            {!vehicleAll && (
              <div className="mt-3">
                <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
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

      {/* Report Table - LHC Pending Payments Grid View */}
      {showReport && (
        <Card>
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              LHC Pending Payments Report
              <span className="text-sm font-normal text-gray-500 ml-4">
                Period: {format(periodFrom, "dd-MM-yyyy")} to {format(periodTo, "dd-MM-yyyy")} | As On: {format(asOnDate, "dd-MM-yyyy")} | Total Records: {filteredData.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <div className="bg-gray-100 text-gray-500 text-xs p-2 border-b italic">
              LHC - Local Hiring Charges | Pending payments as on {format(asOnDate, "dd-MM-yyyy")}
            </div>

            <table className="w-full text-sm">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="p-2 text-left font-semibold border-b cursor-pointer hover:bg-gray-200 w-12" onClick={() => handleSort("sNo")}>
                    SNo {getSortIcon("sNo")}
                  </th>
                  <th className="p-2 text-left font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("lhcNo")}>
                    LHC No {getSortIcon("lhcNo")}
                  </th>
                  <th className="p-2 text-left font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("lhcDate")}>
                    LHC Date {getSortIcon("lhcDate")}
                  </th>
                  <th className="p-2 text-left font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("vehicleNo")}>
                    Vehicle No {getSortIcon("vehicleNo")}
                  </th>
                  <th className="p-2 text-left font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("vehicleType")}>
                    Vehicle Type {getSortIcon("vehicleType")}
                  </th>
                  <th className="p-2 text-left font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("vendorName")}>
                    Vendor Name {getSortIcon("vendorName")}
                  </th>
                  <th className="p-2 text-left font-semibold border-b">From → To</th>
                  <th className="p-2 text-right font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("billAmount")}>
                    Bill Amt (₹) {getSortIcon("billAmount")}
                  </th>
                  <th className="p-2 text-right font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("paidAmount")}>
                    Paid Amt (₹) {getSortIcon("paidAmount")}
                  </th>
                  <th className="p-2 text-right font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("pendingAmount")}>
                    Pending (₹) {getSortIcon("pendingAmount")}
                  </th>
                  <th className="p-2 text-left font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("paymentDueDate")}>
                    Due Date {getSortIcon("paymentDueDate")}
                  </th>
                  <th className="p-2 text-right font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("daysOverdue")}>
                    Days Overdue {getSortIcon("daysOverdue")}
                  </th>
                  <th className="p-2 text-left font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("status")}>
                    Status {getSortIcon("status")}
                  </th>
                  <th className="p-2 text-left font-semibold border-b">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={14} className="p-8 text-center text-gray-500">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      No pending payment records found for the selected criteria.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((record) => (
                    <tr key={record.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{record.sNo}</td>
                      <td className="p-2 font-medium text-blue-600">{record.lhcNo}</td>
                      <td className="p-2">{record.lhcDate}</td>
                      <td className="p-2 font-mono text-sm">{record.vehicleNo}</td>
                      <td className="p-2">
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{record.vehicleType}</span>
                      </td>
                      <td className="p-2">{record.vendorName}<br/><span className="text-xs text-gray-500">{record.vendorCode}</span></td>
                      <td className="p-2 text-xs">
                        {record.fromLocation} <span className="text-gray-400">→</span> {record.toLocation}
                      </td>
                      <td className="p-2 text-right">₹{record.billAmount.toLocaleString("en-IN")}</td>
                      <td className="p-2 text-right">₹{record.paidAmount.toLocaleString("en-IN")}</td>
                      <td className="p-2 text-right font-bold text-red-600">₹{record.pendingAmount.toLocaleString("en-IN")}</td>
                      <td className="p-2">{record.paymentDueDate}</td>
                      <td className="p-2 text-right">
                        <span className={record.daysOverdue > 0 ? "text-red-600 font-semibold" : record.daysOverdue < 0 ? "text-green-600" : "text-gray-600"}>
                          {record.daysOverdue > 0 ? `+${record.daysOverdue}` : record.daysOverdue}
                        </span>
                      </td>
                      <td className="p-2">
                        <span className={getStatusBadge(record.status)}>{record.status}</span>
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
                    <td colSpan={7} className="p-2 text-right">GRAND TOTAL:</td>
                    <td className="p-2 text-right">₹{totalBillAmount.toLocaleString("en-IN")}</td>
                    <td className="p-2 text-right">₹{totalPaidAmount.toLocaleString("en-IN")}</td>
                    <td className="p-2 text-right text-red-600">₹{totalPendingAmount.toLocaleString("en-IN")}</td>
                    <td colSpan={4}></td>
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
                <div className="text-xs text-gray-500">Total Pending Amount</div>
                <div className="text-xl font-bold text-red-600">₹{totalPendingAmount.toLocaleString("en-IN")}</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="text-xs text-gray-500">Pending Records</div>
                <div className="text-xl font-bold text-orange-600">{filteredData.filter(r => r.pendingAmount > 0).length}</div>
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
              <strong>Attachment:</strong> LHC_Pending_Payments_{format(new Date(), "yyyyMMdd")}.html
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