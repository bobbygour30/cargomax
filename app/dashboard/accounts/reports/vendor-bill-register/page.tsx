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
import { CalendarIcon, Send, X, Download, Mail, Eye, FileText, Printer, Filter, ChevronUp, ChevronDown } from "lucide-react";

// ==================== TYPE DEFINITIONS ====================
interface VendorBillRecord {
  id: number;
  sNo: number;
  billDate: string;
  billNo: string;
  vendorName: string;
  vendorCode: string;
  invoiceNo: string;
  invoiceDate: string;
  billAmount: number;
  paidAmount: number;
  balanceAmount: number;
  dueDate: string;
  status: string;
  createdBy: string;
  createdOn: string;
  remarks: string;
}

// ==================== MOCK DATA ====================
const mockVendorBillData: VendorBillRecord[] = [
  { id: 1, sNo: 1, billDate: "18-05-2026", billNo: "VB/2026-27/001", vendorName: "Sharma Suppliers", vendorCode: "VEN001", invoiceNo: "INV-101", invoiceDate: "15-05-2026", billAmount: 50000, paidAmount: 25000, balanceAmount: 25000, dueDate: "15-06-2026", status: "Partially Paid", createdBy: "Accounts Dept", createdOn: "18-05-2026 10:30 AM", remarks: "Office supplies purchase" },
  { id: 2, sNo: 2, billDate: "18-05-2026", billNo: "VB/2026-27/002", vendorName: "Tech Solutions Pvt Ltd", vendorCode: "VEN002", invoiceNo: "INV-102", invoiceDate: "16-05-2026", billAmount: 75000, paidAmount: 75000, balanceAmount: 0, dueDate: "16-06-2026", status: "Paid", createdBy: "IT Dept", createdOn: "18-05-2026 11:15 AM", remarks: "Software license renewal" },
  { id: 3, sNo: 3, billDate: "17-05-2026", billNo: "VB/2026-27/003", vendorName: "Goyal Transport Co", vendorCode: "VEN003", invoiceNo: "INV-103", invoiceDate: "14-05-2026", billAmount: 35000, paidAmount: 0, balanceAmount: 35000, dueDate: "14-06-2026", status: "Unpaid", createdBy: "Logistics Team", createdOn: "17-05-2026 09:45 AM", remarks: "Freight charges" },
  { id: 4, sNo: 4, billDate: "17-05-2026", billNo: "VB/2026-27/004", vendorName: "Singh Enterprises", vendorCode: "VEN004", invoiceNo: "INV-104", invoiceDate: "12-05-2026", billAmount: 25000, paidAmount: 25000, balanceAmount: 0, dueDate: "12-06-2026", status: "Paid", createdBy: "Purchase Dept", createdOn: "17-05-2026 02:00 PM", remarks: "Stationery items" },
  { id: 5, sNo: 5, billDate: "16-05-2026", billNo: "VB/2026-27/005", vendorName: "Patel Agencies", vendorCode: "VEN005", invoiceNo: "INV-105", invoiceDate: "10-05-2026", billAmount: 60000, paidAmount: 30000, balanceAmount: 30000, dueDate: "10-06-2026", status: "Partially Paid", createdBy: "Finance Team", createdOn: "16-05-2026 12:20 PM", remarks: "Marketing materials" },
  { id: 6, sNo: 6, billDate: "16-05-2026", billNo: "VB/2026-27/006", vendorName: "Verma Logistics", vendorCode: "VEN006", invoiceNo: "INV-106", invoiceDate: "09-05-2026", billAmount: 45000, paidAmount: 45000, balanceAmount: 0, dueDate: "09-06-2026", status: "Paid", createdBy: "Operations", createdOn: "16-05-2026 03:45 PM", remarks: "Courier services" },
  { id: 7, sNo: 7, billDate: "18-05-2026", billNo: "VB/2026-27/007", vendorName: "Malhotra & Sons", vendorCode: "VEN007", invoiceNo: "INV-107", invoiceDate: "17-05-2026", billAmount: 85000, paidAmount: 0, balanceAmount: 85000, dueDate: "17-06-2026", status: "Unpaid", createdBy: "Procurement", createdOn: "18-05-2026 09:00 AM", remarks: "Equipment purchase" },
  { id: 8, sNo: 8, billDate: "15-05-2026", billNo: "VB/2026-27/008", vendorName: "Gupta Traders", vendorCode: "VEN008", invoiceNo: "INV-108", invoiceDate: "08-05-2026", billAmount: 22000, paidAmount: 22000, balanceAmount: 0, dueDate: "08-06-2026", status: "Paid", createdBy: "Store Dept", createdOn: "15-05-2026 01:30 PM", remarks: "Packaging materials" },
  { id: 9, sNo: 9, billDate: "18-05-2026", billNo: "VB/2026-27/009", vendorName: "Sharma Suppliers", vendorCode: "VEN001", invoiceNo: "INV-109", invoiceDate: "18-05-2026", billAmount: 32000, paidAmount: 0, balanceAmount: 32000, dueDate: "18-06-2026", status: "Unpaid", createdBy: "Accounts Dept", createdOn: "18-05-2026 08:30 AM", remarks: "Additional supplies" },
  { id: 10, sNo: 10, billDate: "14-05-2026", billNo: "VB/2026-27/010", vendorName: "Kumar Electricals", vendorCode: "VEN009", invoiceNo: "INV-110", invoiceDate: "05-05-2026", billAmount: 18000, paidAmount: 18000, balanceAmount: 0, dueDate: "05-06-2026", status: "Paid", createdBy: "Maintenance", createdOn: "14-05-2026 11:00 AM", remarks: "Electrical repair work" },
];

// Filter options
const zones = ["NORTH ZONE", "SOUTH ZONE", "EAST ZONE", "WEST ZONE"];
const states = ["DELHI", "UTTAR PRADESH", "MAHARASHTRA", "GUJARAT", "RAJASTHAN", "PUNJAB"];
const regions = ["NORTH", "SOUTH", "EAST", "WEST", "CENTRAL"];
const hubs = ["DELHI HUB", "MUMBAI HUB", "BANGALORE HUB", "KOLKATA HUB", "CHENNAI HUB"];
const branches = ["DELHI", "MUMBAI", "BANGALORE", "CHENNAI", "KOLKATA", "PUNE"];
const agencies = ["AGENCY A", "AGENCY B", "AGENCY C", "AGENCY D"];
const branchTypes = ["Retail", "Corporate", "Wholesale", "Distribution"];
const vendors = ["Sharma Suppliers", "Tech Solutions Pvt Ltd", "Goyal Transport Co", "Singh Enterprises", "Patel Agencies", "Verma Logistics", "Malhotra & Sons", "Gupta Traders", "Kumar Electricals"];

export default function VendorBillRegister() {
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
  const [sortColumn, setSortColumn] = useState<keyof VendorBillRecord>("sNo");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Filtered data
  const [filteredData, setFilteredData] = useState<VendorBillRecord[]>(mockVendorBillData);

  // Report view state
  const [showReport, setShowReport] = useState<boolean>(true);

  // Email modal state
  const [mailModalOpen, setMailModalOpen] = useState(false);
  const [mailTo, setMailTo] = useState("");
  const [mailSubject, setMailSubject] = useState("Vendor Bill Register Report");
  const [mailBody, setMailBody] = useState(
    "Dear Sir/Madam,\n\nPlease find attached the Vendor Bill Register Report.\n\nRegards,\nFinance Team"
  );

  // Handle Show Report / Grid View
  const handleGridView = () => {
    let filtered = [...mockVendorBillData];

    // Filter by period
    filtered = filtered.filter((record) => {
      const recordDate = new Date(record.billDate.split("-").reverse().join("-"));
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
    setFilteredData(mockVendorBillData);
    setSortColumn("sNo");
    setSortDirection("asc");
    setShowReport(true);
  };

  // Handle Close
  const handleClose = () => {
    // Reset to initial state or just clear - as per requirement
    handleClear();
  };

  // Handle Sort
  const handleSort = (column: keyof VendorBillRecord) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }

    const sorted = [...filteredData].sort((a, b) => {
      let aVal = a[column];
      let bVal = b[column];

      if (column === "billAmount" || column === "paidAmount" || column === "balanceAmount") {
        return sortDirection === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
      }

      if (column === "sNo") {
        return sortDirection === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
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
  const getSortIcon = (column: keyof VendorBillRecord) => {
    if (sortColumn !== column) return null;
    return sortDirection === "asc" ? <ChevronUp className="h-3 w-3 inline ml-1" /> : <ChevronDown className="h-3 w-3 inline ml-1" />;
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium";
      case "unpaid":
        return "bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium";
      case "partially paid":
        return "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium";
      default:
        return "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium";
    }
  };

  // Generate report HTML for email attachment
  const generateReportHTML = (): string => {
    const totalBillAmount = filteredData.reduce((sum, r) => sum + r.billAmount, 0);
    const totalPaidAmount = filteredData.reduce((sum, r) => sum + r.paidAmount, 0);
    const totalBalanceAmount = filteredData.reduce((sum, r) => sum + r.balanceAmount, 0);

    let rowsHtml = "";
    filteredData.forEach((record) => {
      rowsHtml += `
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 10px;">${record.sNo}</td>
          <td style="padding: 10px;">${record.billDate}</td>
          <td style="padding: 10px;">${record.billNo}</td>
          <td style="padding: 10px;">${record.vendorName}</td>
          <td style="padding: 10px;">${record.invoiceNo}</td>
          <td style="padding: 10px; text-align: right;">${record.billAmount.toLocaleString("en-IN")}</td>
          <td style="padding: 10px; text-align: right;">${record.paidAmount.toLocaleString("en-IN")}</td>
          <td style="padding: 10px; text-align: right;">${record.balanceAmount.toLocaleString("en-IN")}</td>
          <td style="padding: 10px;">${record.dueDate}</td>
          <td style="padding: 10px;">${record.status}</td>
        </tr>
      `;
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Vendor Bill Register Report</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; margin: 30px; }
          .header { background: #1e3a8a; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .filters { background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th { background: #2563eb; color: white; padding: 12px; text-align: left; }
          td { padding: 10px; border-bottom: 1px solid #ddd; }
          .totals { margin-top: 20px; padding: 15px; background: #f9fafb; border-radius: 8px; font-weight: bold; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #6b7280; }
          .text-right { text-align: right; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>📋 VENDOR BILL REGISTER REPORT</h2>
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
            <tr>
              <th>SNo</th><th>Bill Date</th><th>Bill No</th><th>Vendor Name</th><th>Invoice No</th>
              <th>Bill Amount (₹)</th><th>Paid Amount (₹)</th><th>Balance (₹)</th><th>Due Date</th><th>Status</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
        <div class="totals">
          <div>💰 Total Bill Amount: ₹${totalBillAmount.toLocaleString("en-IN")}</div>
          <div>💸 Total Paid Amount: ₹${totalPaidAmount.toLocaleString("en-IN")}</div>
          <div>📌 Total Outstanding: ₹${totalBalanceAmount.toLocaleString("en-IN")}</div>
        </div>
        <div class="footer">
          This is a system-generated report. For any discrepancies, contact finance department.
        </div>
      </body>
      </html>
    `;
  };

  // Handle Send Report (opens modal)
  const handleSendReportClick = () => {
    setMailModalOpen(true);
  };

  // Handle Send Email with attachment
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
    const file = new File([blob], `Vendor_Bill_Register_${format(new Date(), "yyyyMMdd_HHmmss")}.html`, { type: "text/html" });

    // Simulate email sending - in real app, this would be an API call
    console.log("Sending email with attachment:", { to: mailTo, subject: mailSubject, body: mailBody, attachment: file });

    // For demo: download the attachment
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
    setMailSubject("Vendor Bill Register Report");
    setMailBody("Dear Sir/Madam,\n\nPlease find attached the Vendor Bill Register Report.\n\nRegards,\nFinance Team");
  };

  // Calculate totals
  const totalBillAmount = filteredData.reduce((sum, r) => sum + r.billAmount, 0);
  const totalPaidAmount = filteredData.reduce((sum, r) => sum + r.paidAmount, 0);
  const totalBalanceAmount = filteredData.reduce((sum, r) => sum + r.balanceAmount, 0);

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-primary">VENDOR BILL REGISTER</h1>
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
              <Eye className="mr-2 h-4 w-4" /> Reports / Grid View
            </Button>
            <Button onClick={handleSendReportClick} className="bg-green-600 hover:bg-green-700">
              <Mail className="mr-2 h-4 w-4" /> Send Report as Attachment
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Table - Grid View */}
      {showReport && (
        <Card>
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Vendor Bill Register - Grid View
              <span className="text-sm font-normal text-gray-500 ml-4">
                Total Records: {filteredData.length} | Period: {format(periodFrom, "dd-MM-yyyy")} to {format(periodTo, "dd-MM-yyyy")}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            {/* Drag column header hint */}
            <div className="bg-gray-100 text-gray-500 text-xs p-2 border-b italic">
              Drag a column header and drop it here to group by that column
            </div>

            <table className="w-full text-sm">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="p-3 text-left font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("sNo")}>
                    SNo {getSortIcon("sNo")}
                  </th>
                  <th className="p-3 text-left font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("billDate")}>
                    Bill Date {getSortIcon("billDate")}
                  </th>
                  <th className="p-3 text-left font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("billNo")}>
                    Bill No. {getSortIcon("billNo")}
                  </th>
                  <th className="p-3 text-left font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("vendorName")}>
                    Vendor Name {getSortIcon("vendorName")}
                  </th>
                  <th className="p-3 text-left font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("invoiceNo")}>
                    Invoice No. {getSortIcon("invoiceNo")}
                  </th>
                  <th className="p-3 text-left font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("invoiceDate")}>
                    Invoice Date {getSortIcon("invoiceDate")}
                  </th>
                  <th className="p-3 text-right font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("billAmount")}>
                    Bill Amount (₹) {getSortIcon("billAmount")}
                  </th>
                  <th className="p-3 text-right font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("paidAmount")}>
                    Paid Amount (₹) {getSortIcon("paidAmount")}
                  </th>
                  <th className="p-3 text-right font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("balanceAmount")}>
                    Balance (₹) {getSortIcon("balanceAmount")}
                  </th>
                  <th className="p-3 text-left font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("dueDate")}>
                    Due Date {getSortIcon("dueDate")}
                  </th>
                  <th className="p-3 text-left font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("status")}>
                    Status {getSortIcon("status")}
                  </th>
                  <th className="p-3 text-left font-semibold border-b">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="p-8 text-center text-gray-500">
                      No records found for the selected criteria.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((record) => (
                    <tr key={record.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{record.sNo}</td>
                      <td className="p-3">{record.billDate}</td>
                      <td className="p-3 font-medium text-blue-600">{record.billNo}</td>
                      <td className="p-3">{record.vendorName}</td>
                      <td className="p-3">{record.invoiceNo}</td>
                      <td className="p-3">{record.invoiceDate}</td>
                      <td className="p-3 text-right">₹{record.billAmount.toLocaleString("en-IN")}</td>
                      <td className="p-3 text-right">₹{record.paidAmount.toLocaleString("en-IN")}</td>
                      <td className="p-3 text-right font-medium">₹{record.balanceAmount.toLocaleString("en-IN")}</td>
                      <td className="p-3">{record.dueDate}</td>
                      <td className="p-3">
                        <span className={getStatusBadge(record.status)}>{record.status}</span>
                      </td>
                      <td className="p-3 max-w-xs truncate" title={record.remarks}>
                        {record.remarks}
                      </td>
                    </tr>
                  ))
                )}
                {/* Totals Row */}
                {filteredData.length > 0 && (
                  <tr className="bg-gray-100 font-semibold">
                    <td colSpan={6} className="p-3 text-right">
                      TOTAL:
                    </td>
                    <td className="p-3 text-right">₹{totalBillAmount.toLocaleString("en-IN")}</td>
                    <td className="p-3 text-right">₹{totalPaidAmount.toLocaleString("en-IN")}</td>
                    <td className="p-3 text-right text-blue-600">₹{totalBalanceAmount.toLocaleString("en-IN")}</td>
                    <td colSpan={3}></td>
                  </tr>
                )}
              </tbody>
            </table>
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
              <strong>Attachment:</strong> Vendor_Bill_Register_{format(new Date(), "yyyyMMdd")}.html
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