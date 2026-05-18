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
import { CalendarIcon, Send, X, Download, Mail, Eye, FileText, ChevronUp, ChevronDown, TrendingUp, AlertCircle } from "lucide-react";

// ==================== TYPE DEFINITIONS ====================
interface VendorOutstanding {
  id: number;
  sNo: number;
  vendorName: string;
  vendorCode: string;
  invoiceNo: string;
  invoiceDate: string;
  dueDate: string;
  billAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  age0to30: number;
  age31to60: number;
  age61to90: number;
  age91to180: number;
  age181to365: number;
  age365Plus: number;
  status: string;
  contactPerson: string;
  phoneNo: string;
  email: string;
}

// ==================== MOCK DATA ====================
const mockVendorOutstandingData: VendorOutstanding[] = [
  { id: 1, sNo: 1, vendorName: "Sharma Suppliers", vendorCode: "VEN001", invoiceNo: "INV-101", invoiceDate: "15-03-2026", dueDate: "15-04-2026", billAmount: 50000, paidAmount: 25000, outstandingAmount: 25000, age0to30: 0, age31to60: 25000, age61to90: 0, age91to180: 0, age181to365: 0, age365Plus: 0, status: "Overdue", contactPerson: "Rajesh Sharma", phoneNo: "9876543210", email: "sharma@suppliers.com" },
  { id: 2, sNo: 2, vendorName: "Tech Solutions Pvt Ltd", vendorCode: "VEN002", invoiceNo: "INV-102", invoiceDate: "10-04-2026", dueDate: "10-05-2026", billAmount: 75000, paidAmount: 75000, outstandingAmount: 0, age0to30: 0, age31to60: 0, age61to90: 0, age91to180: 0, age181to365: 0, age365Plus: 0, status: "Settled", contactPerson: "Amit Kumar", phoneNo: "9876543211", email: "amit@techsol.com" },
  { id: 3, sNo: 3, vendorName: "Goyal Transport Co", vendorCode: "VEN003", invoiceNo: "INV-103", invoiceDate: "01-01-2026", dueDate: "01-02-2026", billAmount: 35000, paidAmount: 0, outstandingAmount: 35000, age0to30: 0, age31to60: 0, age61to90: 0, age91to180: 0, age181to365: 35000, age365Plus: 0, status: "Critical", contactPerson: "Suresh Goyal", phoneNo: "9876543212", email: "suresh@goyal.com" },
  { id: 4, sNo: 4, vendorName: "Singh Enterprises", vendorCode: "VEN004", invoiceNo: "INV-104", invoiceDate: "20-02-2026", dueDate: "20-03-2026", billAmount: 25000, paidAmount: 25000, outstandingAmount: 0, age0to30: 0, age31to60: 0, age61to90: 0, age91to180: 0, age181to365: 0, age365Plus: 0, status: "Settled", contactPerson: "Harpreet Singh", phoneNo: "9876543213", email: "harpreet@singh.com" },
  { id: 5, sNo: 5, vendorName: "Patel Agencies", vendorCode: "VEN005", invoiceNo: "INV-105", invoiceDate: "05-05-2026", dueDate: "05-06-2026", billAmount: 60000, paidAmount: 20000, outstandingAmount: 40000, age0to30: 40000, age31to60: 0, age61to90: 0, age91to180: 0, age181to365: 0, age365Plus: 0, status: "Current", contactPerson: "Kiran Patel", phoneNo: "9876543214", email: "kiran@patel.com" },
  { id: 6, sNo: 6, vendorName: "Verma Logistics", vendorCode: "VEN006", invoiceNo: "INV-106", invoiceDate: "15-12-2025", dueDate: "15-01-2026", billAmount: 45000, paidAmount: 45000, outstandingAmount: 0, age0to30: 0, age31to60: 0, age61to90: 0, age91to180: 0, age181to365: 0, age365Plus: 0, status: "Settled", contactPerson: "Rakesh Verma", phoneNo: "9876543215", email: "rakesh@verma.com" },
  { id: 7, sNo: 7, vendorName: "Malhotra & Sons", vendorCode: "VEN007", invoiceNo: "INV-107", invoiceDate: "10-03-2026", dueDate: "10-04-2026", billAmount: 85000, paidAmount: 0, outstandingAmount: 85000, age0to30: 0, age31to60: 85000, age61to90: 0, age91to180: 0, age181to365: 0, age365Plus: 0, status: "Overdue", contactPerson: "Vikram Malhotra", phoneNo: "9876543216", email: "vikram@malhotra.com" },
  { id: 8, sNo: 8, vendorName: "Gupta Traders", vendorCode: "VEN008", invoiceNo: "INV-108", invoiceDate: "25-04-2026", dueDate: "25-05-2026", billAmount: 22000, paidAmount: 22000, outstandingAmount: 0, age0to30: 0, age31to60: 0, age61to90: 0, age91to180: 0, age181to365: 0, age365Plus: 0, status: "Settled", contactPerson: "Neha Gupta", phoneNo: "9876543217", email: "neha@gupta.com" },
  { id: 9, sNo: 9, vendorName: "Kumar Electricals", vendorCode: "VEN009", invoiceNo: "INV-109", invoiceDate: "01-03-2026", dueDate: "31-03-2026", billAmount: 18000, paidAmount: 5000, outstandingAmount: 13000, age0to30: 0, age31to60: 13000, age61to90: 0, age91to180: 0, age181to365: 0, age365Plus: 0, status: "Overdue", contactPerson: "Sunil Kumar", phoneNo: "9876543218", email: "sunil@kumar.com" },
  { id: 10, sNo: 10, vendorName: "Sharma Suppliers", vendorCode: "VEN001", invoiceNo: "INV-110", invoiceDate: "18-05-2026", dueDate: "18-06-2026", billAmount: 32000, paidAmount: 0, outstandingAmount: 32000, age0to30: 32000, age31to60: 0, age61to90: 0, age91to180: 0, age181to365: 0, age365Plus: 0, status: "Current", contactPerson: "Rajesh Sharma", phoneNo: "9876543210", email: "sharma@suppliers.com" },
  { id: 11, sNo: 11, vendorName: "Goyal Transport Co", vendorCode: "VEN003", invoiceNo: "INV-111", invoiceDate: "15-08-2025", dueDate: "15-09-2025", billAmount: 28000, paidAmount: 0, outstandingAmount: 28000, age0to30: 0, age31to60: 0, age61to90: 0, age91to180: 0, age181to365: 0, age365Plus: 28000, status: "Critical", contactPerson: "Suresh Goyal", phoneNo: "9876543212", email: "suresh@goyal.com" },
  { id: 12, sNo: 12, vendorName: "Patel Agencies", vendorCode: "VEN005", invoiceNo: "INV-112", invoiceDate: "10-02-2026", dueDate: "10-03-2026", billAmount: 55000, paidAmount: 30000, outstandingAmount: 25000, age0to30: 0, age31to60: 25000, age61to90: 0, age91to180: 0, age181to365: 0, age365Plus: 0, status: "Overdue", contactPerson: "Kiran Patel", phoneNo: "9876543214", email: "kiran@patel.com" },
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

export default function VendorOutstandingAgeingReport() {
  // Date state
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
  const [sortColumn, setSortColumn] = useState<keyof VendorOutstanding>("sNo");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Filtered data
  const [filteredData, setFilteredData] = useState<VendorOutstanding[]>(mockVendorOutstandingData);

  // Report view state
  const [showReport, setShowReport] = useState<boolean>(true);

  // Email modal state
  const [mailModalOpen, setMailModalOpen] = useState(false);
  const [mailTo, setMailTo] = useState("");
  const [mailSubject, setMailSubject] = useState("Vendor Outstanding Ageing Report");
  const [mailBody, setMailBody] = useState(
    "Dear Sir/Madam,\n\nPlease find attached the Vendor Outstanding Ageing Report.\n\nRegards,\nFinance Team"
  );

  // Handle Show Report / Grid View
  const handleGridView = () => {
    let filtered = [...mockVendorOutstandingData];

    // Filter by vendor
    if (!vendorAll && selectedVendor) {
      filtered = filtered.filter((record) => record.vendorName === selectedVendor);
    }

    setFilteredData(filtered);
    setShowReport(true);
  };

  // Handle Clear
  const handleClear = () => {
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
    setFilteredData(mockVendorOutstandingData);
    setSortColumn("sNo");
    setSortDirection("asc");
    setShowReport(true);
  };

  // Handle Close
  const handleClose = () => {
    handleClear();
  };

  // Handle Sort
  const handleSort = (column: keyof VendorOutstanding) => {
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
  const getSortIcon = (column: keyof VendorOutstanding) => {
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
      default:
        return "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium";
    }
  };

  // Calculate totals
  const totalBillAmount = filteredData.reduce((sum, r) => sum + r.billAmount, 0);
  const totalPaidAmount = filteredData.reduce((sum, r) => sum + r.paidAmount, 0);
  const totalOutstanding = filteredData.reduce((sum, r) => sum + r.outstandingAmount, 0);
  const total0to30 = filteredData.reduce((sum, r) => sum + r.age0to30, 0);
  const total31to60 = filteredData.reduce((sum, r) => sum + r.age31to60, 0);
  const total61to90 = filteredData.reduce((sum, r) => sum + r.age61to90, 0);
  const total91to180 = filteredData.reduce((sum, r) => sum + r.age91to180, 0);
  const total181to365 = filteredData.reduce((sum, r) => sum + r.age181to365, 0);
  const total365Plus = filteredData.reduce((sum, r) => sum + r.age365Plus, 0);

  // Generate report HTML for email attachment
  const generateReportHTML = (): string => {
    let rowsHtml = "";
    filteredData.forEach((record) => {
      rowsHtml += `
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 8px;">${record.sNo}</td>
          <td style="padding: 8px;">${record.vendorName}</td>
          <td style="padding: 8px;">${record.invoiceNo}</td>
          <td style="padding: 8px;">${record.invoiceDate}</td>
          <td style="padding: 8px;">${record.dueDate}</td>
          <td style="padding: 8px; text-align: right;">${record.billAmount.toLocaleString("en-IN")}</td>
          <td style="padding: 8px; text-align: right;">${record.paidAmount.toLocaleString("en-IN")}</td>
          <td style="padding: 8px; text-align: right;">${record.outstandingAmount.toLocaleString("en-IN")}</td>
          <td style="padding: 8px; text-align: right;">${record.age0to30.toLocaleString("en-IN")}</td>
          <td style="padding: 8px; text-align: right;">${record.age31to60.toLocaleString("en-IN")}</td>
          <td style="padding: 8px; text-align: right;">${record.age61to90.toLocaleString("en-IN")}</td>
          <td style="padding: 8px; text-align: right;">${record.age91to180.toLocaleString("en-IN")}</td>
          <td style="padding: 8px; text-align: right;">${record.age181to365.toLocaleString("en-IN")}</td>
          <td style="padding: 8px; text-align: right;">${record.age365Plus.toLocaleString("en-IN")}</td>
          <td style="padding: 8px;">${record.status}</td>
        </tr>
      `;
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Vendor Outstanding Ageing Report</title>
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
          .ageing-header { background: #475569; color: white; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>📊 VENDOR OUTSTANDING AGEING REPORT</h2>
          <p>Generated on: ${new Date().toLocaleString()}</p>
        </div>
        <div class="filters">
          <strong>Report Parameters:</strong><br/>
          As On Date: ${format(asOnDate, "dd-MM-yyyy")}<br/>
          Vendor: ${vendorAll ? "ALL" : selectedVendor || "Not Selected"}<br/>
          Branch Type: ${branchTypeAll ? "ALL" : selectedBranchType || "Not Selected"}
        </div>
        <table>
          <thead>
            <tr>
              <th>SNo</th><th>Vendor Name</th><th>Invoice No</th><th>Inv Date</th><th>Due Date</th>
              <th>Bill Amt</th><th>Paid Amt</th><th>Outstanding</th>
              <th>0-30 Days</th><th>31-60 Days</th><th>61-90 Days</th><th>91-180 Days</th><th>181-365 Days</th><th>365+ Days</th><th>Status</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
          <tfoot>
            <tr style="background: #eef2ff; font-weight: bold;">
              <td colspan="5">TOTAL</td>
              <td class="text-right">${totalBillAmount.toLocaleString("en-IN")}</td>
              <td class="text-right">${totalPaidAmount.toLocaleString("en-IN")}</td>
              <td class="text-right">${totalOutstanding.toLocaleString("en-IN")}</td>
              <td class="text-right">${total0to30.toLocaleString("en-IN")}</td>
              <td class="text-right">${total31to60.toLocaleString("en-IN")}</td>
              <td class="text-right">${total61to90.toLocaleString("en-IN")}</td>
              <td class="text-right">${total91to180.toLocaleString("en-IN")}</td>
              <td class="text-right">${total181to365.toLocaleString("en-IN")}</td>
              <td class="text-right">${total365Plus.toLocaleString("en-IN")}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
        <div class="totals">
          <div>💰 Total Bill Amount: ₹${totalBillAmount.toLocaleString("en-IN")}</div>
          <div>💸 Total Paid Amount: ₹${totalPaidAmount.toLocaleString("en-IN")}</div>
          <div>⚠️ Total Outstanding: ₹${totalOutstanding.toLocaleString("en-IN")}</div>
        </div>
        <div class="footer">
          This is a system-generated ageing report. For any discrepancies, contact finance department.
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
    const file = new File([blob], `Vendor_Ageing_Report_${format(new Date(), "yyyyMMdd_HHmmss")}.html`, { type: "text/html" });

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
    setMailSubject("Vendor Outstanding Ageing Report");
    setMailBody("Dear Sir/Madam,\n\nPlease find attached the Vendor Outstanding Ageing Report.\n\nRegards,\nFinance Team");
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-primary">VENDOR OUTSTANDING AGEING REPORT</h1>
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
          {/* As On Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>{/* Empty for alignment */}</div>
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

      {/* Report Table - Ageing Grid View */}
      {showReport && (
        <Card>
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Vendor Outstanding Ageing Report
              <span className="text-sm font-normal text-gray-500 ml-4">
                As On: {format(asOnDate, "dd-MM-yyyy")} | Total Vendors: {filteredData.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <div className="bg-gray-100 text-gray-500 text-xs p-2 border-b italic">
              Ageing buckets based on due date from As On Date: {format(asOnDate, "dd-MM-yyyy")}
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
                  <th className="p-2 text-left font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("invoiceNo")}>
                    Invoice No {getSortIcon("invoiceNo")}
                  </th>
                  <th className="p-2 text-left font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("invoiceDate")}>
                    Invoice Date {getSortIcon("invoiceDate")}
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
                  <th className="p-2 text-right font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("outstandingAmount")}>
                    Outstanding (₹) {getSortIcon("outstandingAmount")}
                  </th>
                  <th className="p-2 text-right font-semibold border-b bg-orange-50">0-30 Days</th>
                  <th className="p-2 text-right font-semibold border-b bg-yellow-50">31-60 Days</th>
                  <th className="p-2 text-right font-semibold border-b bg-amber-50">61-90 Days</th>
                  <th className="p-2 text-right font-semibold border-b bg-orange-100">91-180 Days</th>
                  <th className="p-2 text-right font-semibold border-b bg-red-100">181-365 Days</th>
                  <th className="p-2 text-right font-semibold border-b bg-red-200">365+ Days</th>
                  <th className="p-2 text-left font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("status")}>
                    Status {getSortIcon("status")}
                  </th>
                  <th className="p-2 text-left font-semibold border-b">Contact</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={16} className="p-8 text-center text-gray-500">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      No records found for the selected criteria.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((record) => (
                    <tr key={record.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{record.sNo}</td>
                      <td className="p-2 font-medium">{record.vendorName}<br/><span className="text-xs text-gray-500">{record.vendorCode}</span></td>
                      <td className="p-2 text-blue-600">{record.invoiceNo}</td>
                      <td className="p-2">{record.invoiceDate}</td>
                      <td className="p-2">{record.dueDate}</td>
                      <td className="p-2 text-right">₹{record.billAmount.toLocaleString("en-IN")}</td>
                      <td className="p-2 text-right">₹{record.paidAmount.toLocaleString("en-IN")}</td>
                      <td className="p-2 text-right font-bold">₹{record.outstandingAmount.toLocaleString("en-IN")}</td>
                      <td className="p-2 text-right">{record.age0to30 > 0 ? `₹${record.age0to30.toLocaleString("en-IN")}` : "-"}</td>
                      <td className="p-2 text-right">{record.age31to60 > 0 ? `₹${record.age31to60.toLocaleString("en-IN")}` : "-"}</td>
                      <td className="p-2 text-right">{record.age61to90 > 0 ? `₹${record.age61to90.toLocaleString("en-IN")}` : "-"}</td>
                      <td className="p-2 text-right">{record.age91to180 > 0 ? `₹${record.age91to180.toLocaleString("en-IN")}` : "-"}</td>
                      <td className="p-2 text-right">{record.age181to365 > 0 ? `₹${record.age181to365.toLocaleString("en-IN")}` : "-"}</td>
                      <td className="p-2 text-right">{record.age365Plus > 0 ? `₹${record.age365Plus.toLocaleString("en-IN")}` : "-"}</td>
                      <td className="p-2"><span className={getStatusBadge(record.status)}>{record.status}</span></td>
                      <td className="p-2 text-xs">
                        {record.contactPerson}<br/>
                        {record.phoneNo}
                      </td>
                    </tr>
                  ))
                )}
                {/* Totals Row */}
                {filteredData.length > 0 && (
                  <tr className="bg-gray-100 font-semibold border-t-2 border-gray-300">
                    <td colSpan={5} className="p-2 text-right">GRAND TOTAL:</td>
                    <td className="p-2 text-right">₹{totalBillAmount.toLocaleString("en-IN")}</td>
                    <td className="p-2 text-right">₹{totalPaidAmount.toLocaleString("en-IN")}</td>
                    <td className="p-2 text-right text-red-600">₹{totalOutstanding.toLocaleString("en-IN")}</td>
                    <td className="p-2 text-right">₹{total0to30.toLocaleString("en-IN")}</td>
                    <td className="p-2 text-right">₹{total31to60.toLocaleString("en-IN")}</td>
                    <td className="p-2 text-right">₹{total61to90.toLocaleString("en-IN")}</td>
                    <td className="p-2 text-right">₹{total91to180.toLocaleString("en-IN")}</td>
                    <td className="p-2 text-right">₹{total181to365.toLocaleString("en-IN")}</td>
                    <td className="p-2 text-right">₹{total365Plus.toLocaleString("en-IN")}</td>
                    <td colSpan={2}></td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Ageing Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 p-4 bg-gray-50 border-t">
              <div className="text-center p-2 bg-white rounded shadow-sm">
                <div className="text-xs text-gray-500">0-30 Days</div>
                <div className="text-lg font-bold text-green-600">₹{total0to30.toLocaleString("en-IN")}</div>
              </div>
              <div className="text-center p-2 bg-white rounded shadow-sm">
                <div className="text-xs text-gray-500">31-60 Days</div>
                <div className="text-lg font-bold text-yellow-600">₹{total31to60.toLocaleString("en-IN")}</div>
              </div>
              <div className="text-center p-2 bg-white rounded shadow-sm">
                <div className="text-xs text-gray-500">61-90 Days</div>
                <div className="text-lg font-bold text-orange-600">₹{total61to90.toLocaleString("en-IN")}</div>
              </div>
              <div className="text-center p-2 bg-white rounded shadow-sm">
                <div className="text-xs text-gray-500">91-180 Days</div>
                <div className="text-lg font-bold text-orange-700">₹{total91to180.toLocaleString("en-IN")}</div>
              </div>
              <div className="text-center p-2 bg-white rounded shadow-sm">
                <div className="text-xs text-gray-500">181-365 Days</div>
                <div className="text-lg font-bold text-red-600">₹{total181to365.toLocaleString("en-IN")}</div>
              </div>
              <div className="text-center p-2 bg-white rounded shadow-sm">
                <div className="text-xs text-gray-500">365+ Days</div>
                <div className="text-lg font-bold text-red-800">₹{total365Plus.toLocaleString("en-IN")}</div>
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
              <strong>Attachment:</strong> Vendor_Ageing_Report_{format(new Date(), "yyyyMMdd")}.html
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