"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { CalendarIcon, Search, RefreshCw, FileText, Download, Printer } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface BilledUnbilledCounter {
  id: number;
  branchName: string;
  billedCount: number;
  unbilledCount: number;
  totalCount: number;
  billedAmount: number;
  unbilledAmount: number;
  totalAmount: number;
  percentage: number;
}

interface DetailedRecord {
  id: number;
  grNo: string;
  grDate: string;
  customerName: string;
  consignorName: string;
  consigneeName: string;
  freightAmount: number;
  otherCharges: number;
  totalAmount: number;
  status: "Billed" | "Unbilled";
  billNo: string;
  billDate: string;
}

const branchOptions = [
  "CORPORATE OFFICE",
  "DELHI BRANCH",
  "MUMBAI BRANCH",
  "BANGALORE BRANCH",
  "CHENNAI BRANCH",
  "KOLKATA BRANCH",
  "AHMEDABAD BRANCH",
  "PUNE BRANCH",
];

// Sample Summary Data
const sampleSummaryData: BilledUnbilledCounter[] = [
  { id: 1, branchName: "CORPORATE OFFICE", billedCount: 145, unbilledCount: 23, totalCount: 168, billedAmount: 1250000, unbilledAmount: 185000, totalAmount: 1435000, percentage: 86.3 },
  { id: 2, branchName: "DELHI BRANCH", billedCount: 98, unbilledCount: 15, totalCount: 113, billedAmount: 875000, unbilledAmount: 125000, totalAmount: 1000000, percentage: 87.5 },
  { id: 3, branchName: "MUMBAI BRANCH", billedCount: 156, unbilledCount: 42, totalCount: 198, billedAmount: 2100000, unbilledAmount: 580000, totalAmount: 2680000, percentage: 78.4 },
  { id: 4, branchName: "BANGALORE BRANCH", billedCount: 67, unbilledCount: 8, totalCount: 75, billedAmount: 560000, unbilledAmount: 65000, totalAmount: 625000, percentage: 89.6 },
  { id: 5, branchName: "CHENNAI BRANCH", billedCount: 89, unbilledCount: 31, totalCount: 120, billedAmount: 720000, unbilledAmount: 245000, totalAmount: 965000, percentage: 74.6 },
  { id: 6, branchName: "KOLKATA BRANCH", billedCount: 112, unbilledCount: 18, totalCount: 130, billedAmount: 980000, unbilledAmount: 150000, totalAmount: 1130000, percentage: 86.7 },
];

// Sample Detailed Data
const sampleDetailedData: Record<string, DetailedRecord[]> = {
  "CORPORATE OFFICE": [
    { id: 1, grNo: "GR-2026-001", grDate: "01-05-2026", customerName: "ABC Traders", consignorName: "ABC Traders", consigneeName: "XYZ Enterprises", freightAmount: 15000, otherCharges: 2000, totalAmount: 17000, status: "Billed", billNo: "INV-001", billDate: "05-05-2026" },
    { id: 2, grNo: "GR-2026-002", grDate: "02-05-2026", customerName: "PQR Ltd", consignorName: "PQR Ltd", consigneeName: "LMN Corp", freightAmount: 25000, otherCharges: 3000, totalAmount: 28000, status: "Unbilled", billNo: "-", billDate: "-" },
  ],
  "DELHI BRANCH": [
    { id: 3, grNo: "GR-2026-003", grDate: "03-05-2026", customerName: "DEF Industries", consignorName: "DEF Industries", consigneeName: "GHI Group", freightAmount: 18000, otherCharges: 1500, totalAmount: 19500, status: "Billed", billNo: "INV-002", billDate: "07-05-2026" },
  ],
};

export default function BilledUnbilledCounters() {
  const [branchName, setBranchName] = useState<string>("");
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [summaryData, setSummaryData] = useState<BilledUnbilledCounter[]>([]);
  const [showReport, setShowReport] = useState<boolean>(false);
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [detailedData, setDetailedData] = useState<DetailedRecord[]>([]);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  const handleShow = () => {
    if (!branchName) {
      alert("Please select Branch Name");
      return;
    }
    if (!fromDate || !toDate) {
      alert("Please select From Date and To Date");
      return;
    }
    setSummaryData(sampleSummaryData);
    setShowReport(true);
    setShowDetails(false);
  };

  const handleReset = () => {
    setBranchName("");
    setFromDate(new Date());
    setToDate(new Date());
    setSummaryData([]);
    setShowReport(false);
    setShowDetails(false);
    setSelectedBranch("");
    setDetailedData([]);
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleViewDetails = (branch: string) => {
    setSelectedBranch(branch);
    const data = sampleDetailedData[branch] || [];
    setDetailedData(data);
    setShowDetails(true);
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleBackToSummary = () => {
    setShowDetails(false);
    setSelectedBranch("");
    setDetailedData([]);
  };

  const filteredDetails = detailedData.filter(item =>
    item.grNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.consignorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.consigneeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedDetails = filteredDetails.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredDetails.length / itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  const totalBilledCount = summaryData.reduce((sum, item) => sum + item.billedCount, 0);
  const totalUnbilledCount = summaryData.reduce((sum, item) => sum + item.unbilledCount, 0);
  const totalBilledAmount = summaryData.reduce((sum, item) => sum + item.billedAmount, 0);
  const totalUnbilledAmount = summaryData.reduce((sum, item) => sum + item.unbilledAmount, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    alert("Export functionality will be implemented here");
  };

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">BILLED / UNBILLED COUNTERS</h1>
        <div className="mt-1 text-[10px] md:text-xs text-muted-foreground">
          Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD | Login By : MAYANK.GRLOGISTICS@GMAIL.COM
          <br />
          Login Branch : CORPORATE OFFICE | Financial Year : 2026-2027
        </div>
      </div>

      {/* Filter Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filter Criteria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Branch Name <span className="text-red-500">*</span></Label>
              <Select value={branchName} onValueChange={setBranchName}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  {branchOptions.map((branch) => (
                    <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">From Date <span className="text-red-500">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-8 w-full justify-start text-left text-xs">
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {format(fromDate, "dd-MM-yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={fromDate} onSelect={(d) => d && setFromDate(d)} />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">To Date <span className="text-red-500">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-8 w-full justify-start text-left text-xs">
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {format(toDate, "dd-MM-yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={toDate} onSelect={(d) => d && setToDate(d)} />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex gap-2 items-end">
              <Button onClick={handleShow} className="h-8 text-xs flex-1">SHOW</Button>
              <Button onClick={handleReset} variant="outline" className="h-8 text-xs flex-1">RESET</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Report */}
      {showReport && !showDetails && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row justify-between gap-3">
              <CardTitle className="text-base">Billed / Unbilled Summary - {branchName}</CardTitle>
              <div className="flex gap-2">
                <Button onClick={handlePrint} variant="outline" size="sm" className="h-8 text-xs">
                  <Printer className="mr-1 h-3.5 w-3.5" /> Print
                </Button>
                <Button onClick={handleExport} variant="outline" size="sm" className="h-8 text-xs">
                  <Download className="mr-1 h-3.5 w-3.5" /> Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md text-center">
                <p className="text-[10px] text-muted-foreground">Total GRs</p>
                <p className="text-xl font-bold text-blue-600">{totalBilledCount + totalUnbilledCount}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-md text-center">
                <p className="text-[10px] text-muted-foreground">Billed Count</p>
                <p className="text-xl font-bold text-green-600">{totalBilledCount}</p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-950/20 p-3 rounded-md text-center">
                <p className="text-[10px] text-muted-foreground">Unbilled Count</p>
                <p className="text-xl font-bold text-orange-600">{totalUnbilledCount}</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-950/20 p-3 rounded-md text-center">
                <p className="text-[10px] text-muted-foreground">Billing %</p>
                <p className="text-xl font-bold text-purple-600">
                  {((totalBilledCount / (totalBilledCount + totalUnbilledCount)) * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Summary Table */}
            <div className="rounded-md border overflow-x-auto">
              <div className="min-w-[800px]">
                <Table className="text-xs">
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-12 text-center">S#</TableHead>
                      <TableHead>Branch Name</TableHead>
                      <TableHead className="text-center">Billed Count</TableHead>
                      <TableHead className="text-center">Unbilled Count</TableHead>
                      <TableHead className="text-center">Total Count</TableHead>
                      <TableHead className="text-right">Billed Amount (₹)</TableHead>
                      <TableHead className="text-right">Unbilled Amount (₹)</TableHead>
                      <TableHead className="text-right">Total Amount (₹)</TableHead>
                      <TableHead className="text-center">Billing %</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {summaryData.map((item, idx) => (
                      <TableRow key={item.id} className="hover:bg-muted/30">
                        <TableCell className="text-center">{idx + 1}</TableCell>
                        <TableCell className="font-medium">{item.branchName}</TableCell>
                        <TableCell className="text-center text-green-600 font-semibold">{item.billedCount}</TableCell>
                        <TableCell className="text-center text-orange-600 font-semibold">{item.unbilledCount}</TableCell>
                        <TableCell className="text-center">{item.totalCount}</TableCell>
                        <TableCell className="text-right">₹ {item.billedAmount.toLocaleString()}</TableCell>
                        <TableCell className="text-right">₹ {item.unbilledAmount.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-semibold">₹ {item.totalAmount.toLocaleString()}</TableCell>
                        <TableCell className="text-center">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px]",
                            item.percentage >= 80 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                          )}>
                            {item.percentage}%
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleViewDetails(item.branchName)}
                            className="h-7 px-2 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200"
                          >
                            <FileText className="mr-1 h-3 w-3" />
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Totals Row */}
            <div className="bg-muted/30 p-3 rounded-md">
              <div className="flex flex-wrap justify-between gap-3 text-sm font-semibold">
                <span>Total Billed Amount: <span className="text-green-600">₹ {totalBilledAmount.toLocaleString()}</span></span>
                <span>Total Unbilled Amount: <span className="text-orange-600">₹ {totalUnbilledAmount.toLocaleString()}</span></span>
                <span>Grand Total: <span className="text-blue-600">₹ {(totalBilledAmount + totalUnbilledAmount).toLocaleString()}</span></span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Report */}
      {showDetails && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row justify-between gap-3">
              <div>
                <CardTitle className="text-base">Detailed Report - {selectedBranch}</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleBackToSummary}
                  className="mt-1 h-7 text-xs"
                >
                  ← Back to Summary
                </Button>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search by GR No, Customer, Consignor, Consignee..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 h-8 text-xs"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border overflow-x-auto">
              <div className="min-w-[1000px]">
                <Table className="text-xs">
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-12 text-center">S#</TableHead>
                      <TableHead>GR No</TableHead>
                      <TableHead>GR Date</TableHead>
                      <TableHead>Customer Name</TableHead>
                      <TableHead>Consignor Name</TableHead>
                      <TableHead>Consignee Name</TableHead>
                      <TableHead className="text-right">Freight (₹)</TableHead>
                      <TableHead className="text-right">Other Charges (₹)</TableHead>
                      <TableHead className="text-right">Total (₹)</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead>Bill No</TableHead>
                      <TableHead>Bill Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedDetails.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                          No records found for {selectedBranch}
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedDetails.map((item, idx) => (
                        <TableRow key={item.id} className="hover:bg-muted/30">
                          <TableCell className="text-center">{(currentPage - 1) * itemsPerPage + idx + 1}</TableCell>
                          <TableCell className="font-mono">{item.grNo}</TableCell>
                          <TableCell>{item.grDate}</TableCell>
                          <TableCell>{item.customerName}</TableCell>
                          <TableCell>{item.consignorName}</TableCell>
                          <TableCell>{item.consigneeName}</TableCell>
                          <TableCell className="text-right">₹ {item.freightAmount.toLocaleString()}</TableCell>
                          <TableCell className="text-right">₹ {item.otherCharges.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-semibold">₹ {item.totalAmount.toLocaleString()}</TableCell>
                          <TableCell className="text-center">
                            <span className={cn(
                              "px-2 py-0.5 rounded-full text-[10px]",
                              item.status === "Billed" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            )}>
                              {item.status}
                            </span>
                          </TableCell>
                          <TableCell>{item.billNo}</TableCell>
                          <TableCell>{item.billDate}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-1">
                <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="h-7 text-xs">Previous</Button>
                <span className="px-3 py-1 text-xs bg-muted rounded-md">Page {currentPage} of {totalPages}</span>
                <Button variant="outline" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="h-7 text-xs">Next</Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}