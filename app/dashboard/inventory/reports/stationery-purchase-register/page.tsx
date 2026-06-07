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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Send, X, Download, Mail, Eye, FileText, Printer, Filter, ChevronUp, ChevronDown, Package,RefreshCw } from "lucide-react";

// ==================== TYPE DEFINITIONS ====================

interface StationeryPurchase {
  id: number;
  sNo: number;
  purchaseDate: string;
  invoiceNo: string;
  vendorName: string;
  vendorCode: string;
  itemName: string;
  itemCode: string;
  unitType: string;
  quantity: number;
  rate: number;
  amount: number;
  gstPercent: number;
  gstAmount: number;
  totalAmount: number;
  branch: string;
  division: string;
  status: string;
  paymentTerms: string;
}

// ==================== MOCK DATA ====================

const mockPurchaseData: StationeryPurchase[] = [
  { id: 1, sNo: 1, purchaseDate: "18-05-2026", invoiceNo: "INV-101", vendorName: "Sharma Suppliers", vendorCode: "VEN001", itemName: "A4 Printer Paper", itemCode: "A0001", unitType: "REAM", quantity: 50, rate: 350, amount: 17500, gstPercent: 12, gstAmount: 2100, totalAmount: 19600, branch: "HEAD OFFICE", division: "Admin", status: "Paid", paymentTerms: "Net 30" },
  { id: 2, sNo: 2, purchaseDate: "18-05-2026", invoiceNo: "INV-102", vendorName: "Sharma Suppliers", vendorCode: "VEN001", itemName: "Ballpoint Pen (Blue)", itemCode: "A0002", unitType: "BOX", quantity: 20, rate: 250, amount: 5000, gstPercent: 12, gstAmount: 600, totalAmount: 5600, branch: "HEAD OFFICE", division: "Admin", status: "Paid", paymentTerms: "Net 30" },
  { id: 3, sNo: 3, purchaseDate: "17-05-2026", invoiceNo: "INV-103", vendorName: "Patel Agencies", vendorCode: "VEN005", itemName: "Stapler", itemCode: "A0003", unitType: "PCS", quantity: 10, rate: 150, amount: 1500, gstPercent: 18, gstAmount: 270, totalAmount: 1770, branch: "MUMBAI BRANCH", division: "Operations", status: "Pending", paymentTerms: "Net 45" },
  { id: 4, sNo: 4, purchaseDate: "16-05-2026", invoiceNo: "INV-104", vendorName: "Singh Enterprises", vendorCode: "VEN004", itemName: "Notebook (200 Pages)", itemCode: "A0004", unitType: "PCS", quantity: 100, rate: 45, amount: 4500, gstPercent: 5, gstAmount: 225, totalAmount: 4725, branch: "DELHI BRANCH", division: "Training", status: "Paid", paymentTerms: "Net 15" },
  { id: 5, sNo: 5, purchaseDate: "15-05-2026", invoiceNo: "INV-105", vendorName: "Goyal Transport", vendorCode: "VEN003", itemName: "File Folders", itemCode: "A0005", unitType: "PCS", quantity: 30, rate: 80, amount: 2400, gstPercent: 12, gstAmount: 288, totalAmount: 2688, branch: "BANGALORE BRANCH", division: "Admin", status: "Paid", paymentTerms: "Net 30" },
  { id: 6, sNo: 6, purchaseDate: "14-05-2026", invoiceNo: "INV-106", vendorName: "Sharma Suppliers", vendorCode: "VEN001", itemName: "Paper Clips", itemCode: "A0006", unitType: "BOX", quantity: 15, rate: 60, amount: 900, gstPercent: 12, gstAmount: 108, totalAmount: 1008, branch: "HEAD OFFICE", division: "Admin", status: "Pending", paymentTerms: "Net 30" },
  { id: 7, sNo: 7, purchaseDate: "13-05-2026", invoiceNo: "INV-107", vendorName: "Tech Solutions", vendorCode: "VEN002", itemName: "Whiteboard Marker", itemCode: "A0007", unitType: "PCS", quantity: 25, rate: 120, amount: 3000, gstPercent: 18, gstAmount: 540, totalAmount: 3540, branch: "CHENNAI BRANCH", division: "IT", status: "Paid", paymentTerms: "Net 30" },
  { id: 8, sNo: 8, purchaseDate: "12-05-2026", invoiceNo: "INV-108", vendorName: "Patel Agencies", vendorCode: "VEN005", itemName: "Correction Pen", itemCode: "A0008", unitType: "PCS", quantity: 20, rate: 25, amount: 500, gstPercent: 5, gstAmount: 25, totalAmount: 525, branch: "KOLKATA BRANCH", division: "Admin", status: "Paid", paymentTerms: "Net 15" },
  { id: 9, sNo: 9, purchaseDate: "18-05-2026", invoiceNo: "INV-109", vendorName: "Sharma Suppliers", vendorCode: "VEN001", itemName: "Envelope (A4 Size)", itemCode: "A0009", unitType: "PACK", quantity: 40, rate: 200, amount: 8000, gstPercent: 12, gstAmount: 960, totalAmount: 8960, branch: "HEAD OFFICE", division: "Courier", status: "Pending", paymentTerms: "Net 30" },
  { id: 10, sNo: 10, purchaseDate: "11-05-2026", invoiceNo: "INV-110", vendorName: "Singh Enterprises", vendorCode: "VEN004", itemName: "Binding Covers", itemCode: "A0010", unitType: "PCS", quantity: 50, rate: 30, amount: 1500, gstPercent: 5, gstAmount: 75, totalAmount: 1575, branch: "DELHI BRANCH", division: "Documentation", status: "Paid", paymentTerms: "Net 15" },
];

// Filter options
const zones = ["NORTH ZONE", "SOUTH ZONE", "EAST ZONE", "WEST ZONE", "CENTRAL ZONE"];
const states = ["DELHI", "UTTAR PRADESH", "MAHARASHTRA", "GUJARAT", "RAJASTHAN", "PUNJAB", "HARYANA"];
const regions = ["NORTH", "SOUTH", "EAST", "WEST", "CENTRAL"];
const hubs = ["DELHI HUB", "MUMBAI HUB", "BANGALORE HUB", "KOLKATA HUB", "CHENNAI HUB"];
const branches = ["HEAD OFFICE", "DELHI BRANCH", "MUMBAI BRANCH", "BANGALORE BRANCH", "CHENNAI BRANCH", "KOLKATA BRANCH"];
const agencies = ["AGENCY A", "AGENCY B", "AGENCY C", "AGENCY D"];
const branchTypes = ["Retail", "Corporate", "Wholesale", "Distribution"];
const vendors = ["Sharma Suppliers", "Tech Solutions", "Goyal Transport", "Patel Agencies", "Singh Enterprises"];

export default function StationeryPurchaseRegisterReport() {
  // ==================== DATE STATE ====================
  const [periodFrom, setPeriodFrom] = useState<Date>(new Date(2026, 4, 18));
  const [periodTo, setPeriodTo] = useState<Date>(new Date(2026, 4, 18));

  // ==================== CHECKBOX STATES ====================
  const [branchTypeAll, setBranchTypeAll] = useState(true);
  const [vendorAll, setVendorAll] = useState(true);

  // ==================== FILTER STATES ====================
  const [selectedBranchType, setSelectedBranchType] = useState<string>("");
  const [zone, setZone] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [hub, setHub] = useState<string>("");
  const [branch, setBranch] = useState<string>("");
  const [agency, setAgency] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedVendor, setSelectedVendor] = useState<string>("");

  // ==================== SORT STATE ====================
  const [sortColumn, setSortColumn] = useState<keyof StationeryPurchase>("sNo");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // ==================== FILTERED DATA ====================
  const [filteredData, setFilteredData] = useState<StationeryPurchase[]>(mockPurchaseData);

  // ==================== REPORT VIEW STATE ====================
  const [showReport, setShowReport] = useState<boolean>(true);

  // ==================== EMAIL MODAL STATE ====================
  const [mailModalOpen, setMailModalOpen] = useState(false);
  const [mailTo, setMailTo] = useState("");
  const [mailSubject, setMailSubject] = useState("Stationery Purchase Register Report");
  const [mailBody, setMailBody] = useState(
    "Dear Sir/Madam,\n\nPlease find attached the Stationery Purchase Register Report.\n\nRegards,\nFinance Team"
  );

  // ==================== HANDLE GRID VIEW / REPORT ====================
  const handleGridView = () => {
    let filtered = [...mockPurchaseData];

    // Filter by period (Purchase Date range)
    filtered = filtered.filter((record) => {
      const recordDate = new Date(record.purchaseDate.split("-").reverse().join("-"));
      return recordDate >= periodFrom && recordDate <= periodTo;
    });

    // Filter by vendor
    if (!vendorAll && selectedVendor) {
      filtered = filtered.filter((record) => record.vendorName === selectedVendor);
    }

    // Filter by branch
    if (selectedBranch) {
      filtered = filtered.filter((record) => record.branch === selectedBranch);
    }

    setFilteredData(filtered);
    setShowReport(true);
  };

  // ==================== HANDLE CLEAR ====================
  const handleClear = () => {
    setPeriodFrom(new Date(2026, 4, 18));
    setPeriodTo(new Date(2026, 4, 18));
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
    setFilteredData(mockPurchaseData);
    setSortColumn("sNo");
    setSortDirection("asc");
    setShowReport(true);
  };

  // ==================== HANDLE SORT ====================
  const handleSort = (column: keyof StationeryPurchase) => {
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

  // ==================== GET SORT ICON ====================
  const getSortIcon = (column: keyof StationeryPurchase) => {
    if (sortColumn !== column) return null;
    return sortDirection === "asc" ? <ChevronUp className="h-3 w-3 inline ml-1" /> : <ChevronDown className="h-3 w-3 inline ml-1" />;
  };

  // ==================== GET STATUS BADGE ====================
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium";
      case "pending":
        return "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium";
      default:
        return "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium";
    }
  };

  // ==================== CALCULATE TOTALS ====================
  const totalQuantity = filteredData.reduce((sum, r) => sum + r.quantity, 0);
  const totalAmount = filteredData.reduce((sum, r) => sum + r.amount, 0);
  const totalGstAmount = filteredData.reduce((sum, r) => sum + r.gstAmount, 0);
  const totalGrandAmount = filteredData.reduce((sum, r) => sum + r.totalAmount, 0);

  // ==================== GENERATE REPORT HTML FOR EMAIL ====================
  const generateReportHTML = (): string => {
    let rowsHtml = "";
    filteredData.forEach((record) => {
      rowsHtml += `
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 8px;">${record.sNo}</td>
          <td style="padding: 8px;">${record.purchaseDate}</td>
          <td style="padding: 8px;">${record.invoiceNo}</td>
          <td style="padding: 8px;">${record.vendorName}</td>
          <td style="padding: 8px;">${record.itemName}</td>
          <td style="padding: 8px;">${record.unitType}</td>
          <td style="padding: 8px; text-align: right;">${record.quantity}</td>
          <td style="padding: 8px; text-align: right;">₹${record.rate.toLocaleString("en-IN")}</td>
          <td style="padding: 8px; text-align: right;">₹${record.amount.toLocaleString("en-IN")}</td>
          <td style="padding: 8px; text-align: right;">${record.gstPercent}%</td>
          <td style="padding: 8px; text-align: right;">₹${record.gstAmount.toLocaleString("en-IN")}</td>
          <td style="padding: 8px; text-align: right;">₹${record.totalAmount.toLocaleString("en-IN")}</td>
          <td style="padding: 8px;">${record.branch}</td>
          <td style="padding: 8px;">${record.status}</td>
        </tr>
      `;
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Stationery Purchase Register Report</title>
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
          <h2>📋 STATIONERY PURCHASE REGISTER REPORT</h2>
          <p>Generated on: ${new Date().toLocaleString()}</p>
        </div>
        <div class="filters">
          <strong>Report Parameters:</strong><br/>
          Period: ${format(periodFrom, "dd-MM-yyyy")} to ${format(periodTo, "dd-MM-yyyy")}<br/>
          Vendor: ${vendorAll ? "ALL" : selectedVendor || "Not Selected"}<br/>
          Branch: ${selectedBranch || "ALL"}
        </div>
        <table>
          <thead>
            <tr>
              <th>SNo</th><th>Date</th><th>Invoice No</th><th>Vendor</th><th>Item Name</th>
              <th>Unit</th><th>Qty</th><th>Rate</th><th>Amount</th><th>GST%</th>
              <th>GST Amt</th><th>Total</th><th>Branch</th><th>Status</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
          <tfoot>
            <tr style="background: #eef2ff; font-weight: bold;">
              <td colspan="6">TOTAL</td>
              <td class="text-right">${totalQuantity}</td>
              <td></td>
              <td class="text-right">₹${totalAmount.toLocaleString("en-IN")}</td>
              <td></td>
              <td class="text-right">₹${totalGstAmount.toLocaleString("en-IN")}</td>
              <td class="text-right">₹${totalGrandAmount.toLocaleString("en-IN")}</td>
              <td colspan="2"></td>
            </tr>
          </tfoot>
        </table>
        <div class="totals">
          <div>📦 Total Quantity: ${totalQuantity}</div>
          <div>💰 Total Amount: ₹${totalAmount.toLocaleString("en-IN")}</div>
          <div>💸 Total GST Amount: ₹${totalGstAmount.toLocaleString("en-IN")}</div>
          <div>🏆 Grand Total: ₹${totalGrandAmount.toLocaleString("en-IN")}</div>
        </div>
        <div class="footer">
          This is a system-generated stationery purchase register report.
        </div>
      </body>
      </html>
    `;
  };

  // ==================== HANDLE SEND REPORT (OPENS MODAL) ====================
  const handleSendReportClick = () => {
    if (filteredData.length === 0) {
      alert("No data to send. Please generate the report first.");
      return;
    }
    setMailModalOpen(true);
  };

  // ==================== HANDLE SEND EMAIL WITH ATTACHMENT ====================
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
    const file = new File([blob], `Stationery_Purchase_Register_${format(new Date(), "yyyyMMdd_HHmmss")}.html`, { type: "text/html" });

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

  // ==================== HANDLE DISCARD EMAIL ====================
  const handleDiscardEmail = () => {
    setMailModalOpen(false);
    setMailTo("");
    setMailSubject("Stationery Purchase Register Report");
    setMailBody("Dear Sir/Madam,\n\nPlease find attached the Stationery Purchase Register Report.\n\nRegards,\nFinance Team");
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-primary">STATIONERY PURCHASE REGISTER REPORT</h1>
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
          {/* Period */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <SelectItem value="ALL">ALL</SelectItem>
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
            <Button onClick={handleGridView} className="bg-blue-600 hover:bg-blue-700">
              <Eye className="mr-2 h-4 w-4" /> Grid View / Report
            </Button>
            <Button onClick={handleSendReportClick} className="bg-green-600 hover:bg-green-700">
              <Mail className="mr-2 h-4 w-4" /> Send Report as Attachment
            </Button>
            <Button variant="outline" onClick={handleClear}>
              <RefreshCw className="mr-2 h-4 w-4" /> Clear
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
              Stationery Purchase Register - Grid View
              <span className="text-sm font-normal text-gray-500 ml-4">
                Period: {format(periodFrom, "dd-MM-yyyy")} to {format(periodTo, "dd-MM-yyyy")} | Total Records: {filteredData.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <div className="bg-gray-100 text-gray-500 text-xs p-2 border-b italic">
              Stationery Purchase Register | Vendor: {vendorAll ? "ALL" : selectedVendor} | Branch: {selectedBranch || "ALL"}
            </div>

            <Table>
              <TableHeader className="bg-gray-100 sticky top-0">
                <TableRow>
                  <TableHead className="cursor-pointer hover:bg-gray-200 w-12" onClick={() => handleSort("sNo")}>
                    S# {getSortIcon("sNo")}
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-gray-200" onClick={() => handleSort("purchaseDate")}>
                    Date {getSortIcon("purchaseDate")}
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-gray-200" onClick={() => handleSort("invoiceNo")}>
                    Invoice No {getSortIcon("invoiceNo")}
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-gray-200" onClick={() => handleSort("vendorName")}>
                    Vendor Name {getSortIcon("vendorName")}
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-gray-200" onClick={() => handleSort("itemName")}>
                    Item Name {getSortIcon("itemName")}
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-gray-200" onClick={() => handleSort("unitType")}>
                    Unit Type {getSortIcon("unitType")}
                  </TableHead>
                  <TableHead className="text-right cursor-pointer hover:bg-gray-200" onClick={() => handleSort("quantity")}>
                    Qty {getSortIcon("quantity")}
                  </TableHead>
                  <TableHead className="text-right cursor-pointer hover:bg-gray-200" onClick={() => handleSort("rate")}>
                    Rate (₹) {getSortIcon("rate")}
                  </TableHead>
                  <TableHead className="text-right cursor-pointer hover:bg-gray-200" onClick={() => handleSort("amount")}>
                    Amount (₹) {getSortIcon("amount")}
                  </TableHead>
                  <TableHead className="text-right cursor-pointer hover:bg-gray-200" onClick={() => handleSort("gstPercent")}>
                    GST% {getSortIcon("gstPercent")}
                  </TableHead>
                  <TableHead className="text-right cursor-pointer hover:bg-gray-200" onClick={() => handleSort("gstAmount")}>
                    GST Amt (₹) {getSortIcon("gstAmount")}
                  </TableHead>
                  <TableHead className="text-right cursor-pointer hover:bg-gray-200" onClick={() => handleSort("totalAmount")}>
                    Total (₹) {getSortIcon("totalAmount")}
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-gray-200" onClick={() => handleSort("branch")}>
                    Branch {getSortIcon("branch")}
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-gray-200" onClick={() => handleSort("status")}>
                    Status {getSortIcon("status")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={14} className="text-center py-8 text-gray-500">
                      <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      No purchase records found for the selected criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((record) => (
                    <TableRow key={record.id} className="border-b hover:bg-gray-50">
                      <TableCell>{record.sNo}</TableCell>
                      <TableCell>{record.purchaseDate}</TableCell>
                      <TableCell className="font-medium text-blue-600">{record.invoiceNo}</TableCell>
                      <TableCell>{record.vendorName}</TableCell>
                      <TableCell>{record.itemName}</TableCell>
                      <TableCell>{record.unitType}</TableCell>
                      <TableCell className="text-right">{record.quantity}</TableCell>
                      <TableCell className="text-right">₹{record.rate.toLocaleString("en-IN")}</TableCell>
                      <TableCell className="text-right">₹{record.amount.toLocaleString("en-IN")}</TableCell>
                      <TableCell className="text-right">{record.gstPercent}%</TableCell>
                      <TableCell className="text-right">₹{record.gstAmount.toLocaleString("en-IN")}</TableCell>
                      <TableCell className="text-right font-medium">₹{record.totalAmount.toLocaleString("en-IN")}</TableCell>
                      <TableCell>{record.branch}</TableCell>
                      <TableCell><span className={getStatusBadge(record.status)}>{record.status}</span></TableCell>
                    </TableRow>
                  ))
                )}
                {/* Totals Row */}
                {filteredData.length > 0 && (
                  <TableRow className="bg-gray-100 font-semibold">
                    <TableCell colSpan={6} className="text-right">TOTAL:</TableCell>
                    <TableCell className="text-right">{totalQuantity}</TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right">₹{totalAmount.toLocaleString("en-IN")}</TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right">₹{totalGstAmount.toLocaleString("en-IN")}</TableCell>
                    <TableCell className="text-right text-blue-600">₹{totalGrandAmount.toLocaleString("en-IN")}</TableCell>
                    <TableCell colSpan={2}></TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Summary Cards */}
            {filteredData.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 border-t">
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-xs text-gray-500">Total Quantity</div>
                  <div className="text-xl font-bold text-blue-600">{totalQuantity}</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-xs text-gray-500">Total Amount</div>
                  <div className="text-xl font-bold text-green-600">₹{totalAmount.toLocaleString("en-IN")}</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-xs text-gray-500">Total GST</div>
                  <div className="text-xl font-bold text-purple-600">₹{totalGstAmount.toLocaleString("en-IN")}</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-xs text-gray-500">Grand Total</div>
                  <div className="text-xl font-bold text-orange-600">₹{totalGrandAmount.toLocaleString("en-IN")}</div>
                </div>
              </div>
            )}
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
              <strong>Attachment:</strong> Stationery_Purchase_Register_{format(new Date(), "yyyyMMdd")}.html
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