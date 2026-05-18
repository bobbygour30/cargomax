"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Search, X, RefreshCw, Filter, ChevronUp, ChevronDown } from "lucide-react";

// ==================== TYPE DEFINITIONS ====================
interface FundsTransferRecord {
  id: number;
  sNo: number;
  vDate: string;
  voucherNo: string;
  debitNoteNo: string;
  raisedBy: string;
  type: string;
  creditLedger: string;
  amount: number;
  raisedRemarks: string;
  createdBy: string;
  createdOn: string;
  raisedStatus: string;
}

// ==================== MOCK DATA ====================
const mockFundsTransferData: FundsTransferRecord[] = [
  { id: 1, sNo: 1, vDate: "18-05-2026", voucherNo: "FT/2026-27/001", debitNoteNo: "DN/2026-27/101", raisedBy: "Admin User", type: "Internal Transfer", creditLedger: "Bank of India - Current A/c", amount: 50000, raisedRemarks: "Monthly fund transfer to operations", createdBy: "Finance Team", createdOn: "18-05-2026 10:30 AM", raisedStatus: "Approved" },
  { id: 2, sNo: 2, vDate: "18-05-2026", voucherNo: "FT/2026-27/002", debitNoteNo: "DN/2026-27/102", raisedBy: "Accountant", type: "Vendor Payment", creditLedger: "Vendor - Sharma Suppliers", amount: 25000, raisedRemarks: "Payment for office supplies", createdBy: "Accounts Dept", createdOn: "18-05-2026 11:15 AM", raisedStatus: "Pending" },
  { id: 3, sNo: 3, vDate: "17-05-2026", voucherNo: "FT/2026-27/003", debitNoteNo: "DN/2026-27/103", raisedBy: "Treasury", type: "Inter-Branch", creditLedger: "Mumbai Branch Account", amount: 100000, raisedRemarks: "Branch fund allocation", createdBy: "Treasury Team", createdOn: "17-05-2026 09:45 AM", raisedStatus: "Approved" },
  { id: 4, sNo: 4, vDate: "17-05-2026", voucherNo: "FT/2026-27/004", debitNoteNo: "DN/2026-27/104", raisedBy: "Admin User", type: "Salary Transfer", creditLedger: "Salary Payable Account", amount: 350000, raisedRemarks: "Monthly salary disbursement", createdBy: "HR Team", createdOn: "17-05-2026 02:00 PM", raisedStatus: "Approved" },
  { id: 5, sNo: 5, vDate: "16-05-2026", voucherNo: "FT/2026-27/005", debitNoteNo: "DN/2026-27/105", raisedBy: "Accountant", type: "Tax Payment", creditLedger: "GST Payable Account", amount: 45000, raisedRemarks: "GST monthly payment", createdBy: "Tax Dept", createdOn: "16-05-2026 12:20 PM", raisedStatus: "Pending" },
  { id: 6, sNo: 6, vDate: "16-05-2026", voucherNo: "FT/2026-27/006", debitNoteNo: "DN/2026-27/106", raisedBy: "Treasury", type: "Investment", creditLedger: "Fixed Deposit Account", amount: 200000, raisedRemarks: "Short term investment", createdBy: "Investment Team", createdOn: "16-05-2026 03:45 PM", raisedStatus: "Approved" },
  { id: 7, sNo: 7, vDate: "18-05-2026", voucherNo: "FT/2026-27/007", debitNoteNo: "DN/2026-27/107", raisedBy: "Admin User", type: "Internal Transfer", creditLedger: "Petty Cash Account", amount: 10000, raisedRemarks: "Petty cash replenishment", createdBy: "Cashier", createdOn: "18-05-2026 09:00 AM", raisedStatus: "Draft" },
  { id: 8, sNo: 8, vDate: "15-05-2026", voucherNo: "FT/2026-27/008", debitNoteNo: "DN/2026-27/108", raisedBy: "Accountant", type: "Vendor Payment", creditLedger: "Vendor - Tech Solutions", amount: 75000, raisedRemarks: "Software license renewal", createdBy: "IT Dept", createdOn: "15-05-2026 01:30 PM", raisedStatus: "Approved" },
  { id: 9, sNo: 9, vDate: "18-05-2026", voucherNo: "FT/2026-27/009", debitNoteNo: "DN/2026-27/109", raisedBy: "Treasury", type: "Inter-Branch", creditLedger: "Delhi Branch Account", amount: 150000, raisedRemarks: "Regional office funding", createdBy: "Treasury Team", createdOn: "18-05-2026 08:30 AM", raisedStatus: "Pending" },
  { id: 10, sNo: 10, vDate: "14-05-2026", voucherNo: "FT/2026-27/010", debitNoteNo: "DN/2026-27/110", raisedBy: "Admin User", type: "Miscellaneous", creditLedger: "Donation Account", amount: 25000, raisedRemarks: "CSR activity", createdBy: "CSR Team", createdOn: "14-05-2026 11:00 AM", raisedStatus: "Approved" },
];

// Branch options
const branchOptions = [
  "All Branches",
  "Corporate Office",
  "Delhi Branch",
  "Mumbai Branch",
  "Bangalore Branch",
  "Chennai Branch",
  "Kolkata Branch",
  "Pune Branch",
];

export default function FundsTransferReport() {
  // Date state
  const [fromDate, setFromDate] = useState<Date>(new Date(2026, 4, 18));
  const [toDate, setToDate] = useState<Date>(new Date(2026, 4, 18));

  // Branch selection
  const [selectedBranch, setSelectedBranch] = useState<string>("");

  // Search state
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Sort state
  const [sortColumn, setSortColumn] = useState<keyof FundsTransferRecord>("sNo");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Filtered data
  const [filteredData, setFilteredData] = useState<FundsTransferRecord[]>(mockFundsTransferData);

  // Show report flag
  const [showReport, setShowReport] = useState<boolean>(true);

  // Handle Show Report
  const handleShowReport = () => {
    let filtered = [...mockFundsTransferData];

    // Filter by date range
    filtered = filtered.filter((record) => {
      const recordDate = new Date(record.vDate.split("-").reverse().join("-"));
      return recordDate >= fromDate && recordDate <= toDate;
    });

    // Filter by branch (simulate - in real scenario, branch would be in data)
    if (selectedBranch && selectedBranch !== "All Branches") {
      filtered = filtered.filter((record) => record.raisedBy.includes(selectedBranch.split(" ")[0]) || record.createdBy.includes(selectedBranch.split(" ")[0]));
    }

    setFilteredData(filtered);
    setShowReport(true);
  };

  // Handle Clear
  const handleClear = () => {
    setFromDate(new Date(2026, 4, 18));
    setToDate(new Date(2026, 4, 18));
    setSelectedBranch("");
    setSearchTerm("");
    setFilteredData(mockFundsTransferData);
    setSortColumn("sNo");
    setSortDirection("asc");
    setShowReport(true);
  };

  // Handle Search
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      handleShowReport();
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = filteredData.filter((record) => {
      return (
        record.voucherNo.toLowerCase().includes(searchLower) ||
        record.debitNoteNo.toLowerCase().includes(searchLower) ||
        record.raisedBy.toLowerCase().includes(searchLower) ||
        record.type.toLowerCase().includes(searchLower) ||
        record.creditLedger.toLowerCase().includes(searchLower) ||
        record.raisedRemarks.toLowerCase().includes(searchLower) ||
        record.createdBy.toLowerCase().includes(searchLower) ||
        record.raisedStatus.toLowerCase().includes(searchLower)
      );
    });
    setFilteredData(filtered);
  };

  // Handle Sort
  const handleSort = (column: keyof FundsTransferRecord) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }

    const sorted = [...filteredData].sort((a, b) => {
      let aVal = a[column];
      let bVal = b[column];

      if (column === "amount") {
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
  const getSortIcon = (column: keyof FundsTransferRecord) => {
    if (sortColumn !== column) return null;
    return sortDirection === "asc" ? <ChevronUp className="h-3 w-3 inline ml-1" /> : <ChevronDown className="h-3 w-3 inline ml-1" />;
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium";
      case "pending":
        return "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium";
      case "draft":
        return "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium";
      default:
        return "bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium";
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-primary">FUNDS TRANSFER REPORT</h1>
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
          {/* Select Branch */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Select Branch</Label>
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger>
                  <SelectValue placeholder="Select For Branch" />
                </SelectTrigger>
                <SelectContent>
                  {branchOptions.map((branch) => (
                    <SelectItem key={branch} value={branch}>
                      {branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>{/* Empty for alignment */}</div>
          </div>

          {/* From Date & To Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(fromDate, "dd-MM-yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={fromDate} onSelect={(d) => d && setFromDate(d)} />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>To Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(toDate, "dd-MM-yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={toDate} onSelect={(d) => d && setToDate(d)} />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            <Button onClick={handleShowReport} className="bg-blue-600 hover:bg-blue-700">
              <Search className="mr-2 h-4 w-4" /> Show Report
            </Button>
            <Button variant="outline" onClick={handleClear}>
              <RefreshCw className="mr-2 h-4 w-4" /> Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Bar */}
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <Label>Search...</Label>
          <Input
            placeholder="Search by Voucher #, Debit Note, Raised By, Type, Ledger, Remarks, Status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="w-full"
          />
        </div>
        <Button onClick={handleSearch} className="bg-green-600 hover:bg-green-700 mb-0">
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </div>

      {/* Report Table */}
      {showReport && (
        <Card>
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Funds Transfer Report
              <span className="text-sm font-normal text-gray-500 ml-4">
                Total Records: {filteredData.length} | Period: {format(fromDate, "dd-MM-yyyy")} to {format(toDate, "dd-MM-yyyy")}
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
                  <th className="p-3 text-left font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("vDate")}>
                    V.Date {getSortIcon("vDate")}
                  </th>
                  <th className="p-3 text-left font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("voucherNo")}>
                    Voucher # {getSortIcon("voucherNo")}
                  </th>
                  <th className="p-3 text-left font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("debitNoteNo")}>
                    Debit Note# {getSortIcon("debitNoteNo")}
                  </th>
                  <th className="p-3 text-left font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("raisedBy")}>
                    Raised By {getSortIcon("raisedBy")}
                  </th>
                  <th className="p-3 text-left font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("type")}>
                    Type {getSortIcon("type")}
                  </th>
                  <th className="p-3 text-left font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("creditLedger")}>
                    Credit Ledger {getSortIcon("creditLedger")}
                  </th>
                  <th className="p-3 text-right font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("amount")}>
                    Amount (₹) {getSortIcon("amount")}
                  </th>
                  <th className="p-3 text-left font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("raisedRemarks")}>
                    Raised Remarks {getSortIcon("raisedRemarks")}
                  </th>
                  <th className="p-3 text-left font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("createdBy")}>
                    Created By {getSortIcon("createdBy")}
                  </th>
                  <th className="p-3 text-left font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("createdOn")}>
                    Created On {getSortIcon("createdOn")}
                  </th>
                  <th className="p-3 text-left font-semibold border-b cursor-pointer hover:bg-gray-200" onClick={() => handleSort("raisedStatus")}>
                    Raised Sta {getSortIcon("raisedStatus")}
                  </th>
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
                      <td className="p-3">{record.vDate}</td>
                      <td className="p-3 font-medium text-blue-600">{record.voucherNo}</td>
                      <td className="p-3">{record.debitNoteNo}</td>
                      <td className="p-3">{record.raisedBy}</td>
                      <td className="p-3">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">{record.type}</span>
                      </td>
                      <td className="p-3">{record.creditLedger}</td>
                      <td className="p-3 text-right font-medium">₹{record.amount.toLocaleString("en-IN")}</td>
                      <td className="p-3 max-w-xs truncate" title={record.raisedRemarks}>
                        {record.raisedRemarks}
                      </td>
                      <td className="p-3">{record.createdBy}</td>
                      <td className="p-3 text-xs">{record.createdOn}</td>
                      <td className="p-3">
                        <span className={getStatusBadge(record.raisedStatus)}>{record.raisedStatus}</span>
                      </td>
                    </tr>
                  ))
                )}
                {/* Totals Row */}
                {filteredData.length > 0 && (
                  <tr className="bg-gray-100 font-semibold">
                    <td colSpan={7} className="p-3 text-right">
                      Total Amount:
                    </td>
                    <td className="p-3 text-right text-blue-600">
                      ₹{filteredData.reduce((sum, record) => sum + record.amount, 0).toLocaleString("en-IN")}
                    </td>
                    <td colSpan={4}></td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}