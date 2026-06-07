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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, Lock, Unlock, Printer, Eye, Coins } from "lucide-react";
import { cn } from "@/lib/utils";

interface CashReportRow {
  id: number;
  date: string;
  creditLedger: string;
  creditAmount: number;
  debitLedger: string;
  debitAmount: number;
  balance: number;
  narration: string;
  voucherNo: string;
}

export default function CashReport() {
  const [branchName, setBranchName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [reportData, setReportData] = useState<CashReportRow[]>([]);
  const [showReport, setShowReport] = useState(false);

  // Sample Data
  const sampleData: CashReportRow[] = [
    { id: 1, date: "01-05-2026", creditLedger: "CASH IN HAND", creditAmount: 45000, debitLedger: "BANK - SBI", debitAmount: 25000, balance: 20000, narration: "Cash Deposit", voucherNo: "VCH-001" },
    { id: 2, date: "02-05-2026", creditLedger: "BANK - HDFC", creditAmount: 125000, debitLedger: "CASH IN HAND", debitAmount: 80000, balance: 65000, narration: "Cash Withdrawal", voucherNo: "VCH-002" },
    { id: 3, date: "03-05-2026", creditLedger: "CASH IN HAND", creditAmount: 35000, debitLedger: "PETTY CASH", debitAmount: 15000, balance: 50000, narration: "Petty Cash Transfer", voucherNo: "VCH-003" },
    { id: 4, date: "04-05-2026", creditLedger: "BANK - ICICI", creditAmount: 75000, debitLedger: "CASH IN HAND", debitAmount: 30000, balance: 95000, narration: "Bank Deposit", voucherNo: "VCH-004" },
    { id: 5, date: "05-05-2026", creditLedger: "CASH IN HAND", creditAmount: 25000, debitLedger: "SALARY PAYABLE", debitAmount: 25000, balance: 95000, narration: "Salary Payment", voucherNo: "VCH-005" },
    { id: 6, date: "06-05-2026", creditLedger: "RECEIVABLE A/C", creditAmount: 50000, debitLedger: "CASH IN HAND", debitAmount: 50000, balance: 95000, narration: "Receipt Collection", voucherNo: "VCH-006" },
  ];

  const handleProceed = () => {
    if (!branchName) {
      alert("Please select Branch Name");
      return;
    }
    if (!fromDate) {
      alert("Please select From Date");
      return;
    }
    if (!toDate) {
      alert("Please select To Date");
      return;
    }
    
    // Filter sample data based on date range
    let filtered = [...sampleData];
    if (fromDate && toDate) {
      // Simple string comparison for demo
      filtered = sampleData;
    }
    setReportData(filtered);
    setShowReport(true);
  };

  const filteredData = reportData.filter(row =>
    row.creditLedger.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.debitLedger.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.narration.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.voucherNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCredit = filteredData.reduce((sum, row) => sum + row.creditAmount, 0);
  const totalDebit = filteredData.reduce((sum, row) => sum + row.debitAmount, 0);
  const closingBalance = filteredData.length > 0 ? filteredData[filteredData.length - 1]?.balance : 0;
  
  const openingBalance = filteredData.length > 0 
    ? filteredData[0].balance - filteredData[0].creditAmount + filteredData[0].debitAmount 
    : 0;

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold text-primary">CASH REPORT</h1>
        <div className="text-[10px] md:text-xs text-muted-foreground mt-1">
          Company : GOLDEN ROADWAYS &amp; LOGISTICS PVT LTD | Login By : MAYANK.GRLOGISTICS@GMAIL.COM
          <br />
          Login Branch : CORPORATE OFFICE | Financial Year : 2026-2027
        </div>
      </div>

      {/* Filter Card */}
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
                  <SelectItem value="CORPORATE OFFICE">CORPORATE OFFICE</SelectItem>
                  <SelectItem value="DELHI BRANCH">DELHI BRANCH</SelectItem>
                  <SelectItem value="MUMBAI BRANCH">MUMBAI BRANCH</SelectItem>
                  <SelectItem value="BANGALORE BRANCH">BANGALORE BRANCH</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">From Date <span className="text-red-500">*</span></Label>
              <Input 
                type="date" 
                value={fromDate} 
                onChange={(e) => setFromDate(e.target.value)} 
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">To Date <span className="text-red-500">*</span></Label>
              <Input 
                type="date" 
                value={toDate} 
                onChange={(e) => setToDate(e.target.value)} 
                className="h-8 text-xs"
              />
            </div>

            <div className="flex items-end">
              <Button onClick={handleProceed} className="w-full h-8 text-xs">PROCEED</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Section - Always visible after Proceed */}
      {showReport && (
        <>
          {/* Opening Balance Card */}
          <Card>
            <CardContent className="pt-4">
              <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md">
                <div className="flex flex-wrap justify-between items-center">
                  <span className="text-sm font-semibold">Opening Balance:</span>
                  <span className="text-lg font-bold text-blue-600">₹ {openingBalance.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Report Table Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row justify-between gap-3">
                <CardTitle className="text-base">Cash Report - {branchName}</CardTitle>
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search Ledger, Narration or Voucher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 h-8 text-xs"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Table */}
              <div className="rounded-md border overflow-x-auto">
                <div className="min-w-[900px]">
                  <Table className="text-xs">
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-12 text-center">S#</TableHead>
                        <TableHead className="min-w-[90px]">Date</TableHead>
                        <TableHead className="min-w-[150px]">Credit Ledger</TableHead>
                        <TableHead className="text-right min-w-[100px]">Credit Amount</TableHead>
                        <TableHead className="min-w-[150px]">Debit Ledger</TableHead>
                        <TableHead className="text-right min-w-[100px]">Debit Amount</TableHead>
                        <TableHead className="text-right min-w-[100px]">Balance</TableHead>
                        <TableHead className="min-w-[120px]">Narration</TableHead>
                        <TableHead className="min-w-[100px]">Voucher No</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                            No records found for the selected criteria.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredData.map((row, idx) => (
                          <TableRow key={row.id} className="hover:bg-muted/30">
                            <TableCell className="text-center">{idx + 1}</TableCell>
                            <TableCell>{row.date}</TableCell>
                            <TableCell className="font-medium">{row.creditLedger}</TableCell>
                            <TableCell className="text-right text-green-600 font-medium">
                              ₹ {row.creditAmount.toLocaleString()}
                            </TableCell>
                            <TableCell className="font-medium">{row.debitLedger}</TableCell>
                            <TableCell className="text-right text-red-600 font-medium">
                              ₹ {row.debitAmount.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              ₹ {row.balance.toLocaleString()}
                            </TableCell>
                            <TableCell>{row.narration}</TableCell>
                            <TableCell className="font-mono">{row.voucherNo}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Totals Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-md text-center">
                  <p className="text-[10px] text-muted-foreground">Total Credit</p>
                  <p className="text-lg font-bold text-green-600">₹ {totalCredit.toLocaleString()}</p>
                </div>
                <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded-md text-center">
                  <p className="text-[10px] text-muted-foreground">Total Debit</p>
                  <p className="text-lg font-bold text-red-600">₹ {totalDebit.toLocaleString()}</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md text-center">
                  <p className="text-[10px] text-muted-foreground">Closing Balance</p>
                  <p className={cn("text-lg font-bold", closingBalance >= 0 ? "text-blue-600" : "text-red-600")}>
                    ₹ {closingBalance.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-end pt-4 border-t">
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  <Lock className="mr-1 h-3.5 w-3.5" /> Lock
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  <Unlock className="mr-1 h-3.5 w-3.5" /> Unlock
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  <Printer className="mr-1 h-3.5 w-3.5" /> Print
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  <Eye className="mr-1 h-3.5 w-3.5" /> Show Details
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  <Coins className="mr-1 h-3.5 w-3.5" /> Denomination Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}