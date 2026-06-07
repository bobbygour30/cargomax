"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  CalendarIcon,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Lock,
  Unlock,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Printer,
  Download,
  Eye,
  Shield,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Types
interface FinancialYearData {
  id: number;
  financialYear: string;
  fromDate: Date;
  toDate: Date;
  status: "open" | "closed" | "pending";
  closingDate?: Date;
  closedBy?: string;
  totalAssets?: number;
  totalLiabilities?: number;
  netProfit?: number;
}

// Options
const financialYearOptions = [
  { value: "2023-2024", label: "2023-2024 (01-04-2023 to 31-03-2024)" },
  { value: "2024-2025", label: "2024-2025 (01-04-2024 to 31-03-2025)" },
  { value: "2025-2026", label: "2025-2026 (01-04-2025 to 31-03-2026)" },
  { value: "2026-2027", label: "2026-2027 (01-04-2026 to 31-03-2027)" },
];

export default function FinancialYearClosing() {
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [closingDate, setClosingDate] = useState<Date>(new Date());
  const [remarks, setRemarks] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false);
  const [closingStatus, setClosingStatus] = useState<"success" | "error" | null>(null);
  const [closingSummary, setClosingSummary] = useState<any>(null);

  // Sample Financial Year Data
  const [financialYears, setFinancialYears] = useState<FinancialYearData[]>([
    { id: 1, financialYear: "2023-2024", fromDate: new Date("2023-04-01"), toDate: new Date("2024-03-31"), status: "closed", closingDate: new Date("2024-04-15"), closedBy: "Admin User", totalAssets: 15000000, totalLiabilities: 8500000, netProfit: 6500000 },
    { id: 2, financialYear: "2024-2025", fromDate: new Date("2024-04-01"), toDate: new Date("2025-03-31"), status: "closed", closingDate: new Date("2025-04-20"), closedBy: "Admin User", totalAssets: 18500000, totalLiabilities: 9200000, netProfit: 9300000 },
    { id: 3, financialYear: "2025-2026", fromDate: new Date("2025-04-01"), toDate: new Date("2026-03-31"), status: "pending", closingDate: undefined, closedBy: undefined, totalAssets: undefined, totalLiabilities: undefined, netProfit: undefined },
    { id: 4, financialYear: "2026-2027", fromDate: new Date("2026-04-01"), toDate: new Date("2027-03-31"), status: "open", closingDate: undefined, closedBy: undefined, totalAssets: undefined, totalLiabilities: undefined, netProfit: undefined },
  ]);

  const handleGetClosingSummary = () => {
    if (!selectedYear) {
      alert("Please select Financial Year");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const yearData = financialYears.find(y => y.financialYear === selectedYear);
      if (yearData && yearData.status === "open") {
        // Simulate fetching closing summary
        setClosingSummary({
          totalDebit: 12500000,
          totalCredit: 12500000,
          totalAssets: 18500000,
          totalLiabilities: 9200000,
          netProfit: 9300000,
          pendingInvoices: 45,
          pendingPayments: 23,
          outstandingAmount: 3500000,
        });
      } else if (yearData && yearData.status === "closed") {
        alert("This financial year is already closed!");
        setClosingSummary(null);
      } else {
        setClosingSummary({
          totalDebit: 12500000,
          totalCredit: 12500000,
          totalAssets: 18500000,
          totalLiabilities: 9200000,
          netProfit: 9300000,
          pendingInvoices: 45,
          pendingPayments: 23,
          outstandingAmount: 3500000,
        });
      }
      setLoading(false);
    }, 800);
  };

  const handleCloseYear = () => {
    if (!selectedYear) {
      alert("Please select Financial Year");
      return;
    }

    const yearData = financialYears.find(y => y.financialYear === selectedYear);
    if (yearData && yearData.status === "closed") {
      alert("This financial year is already closed!");
      return;
    }

    setIsConfirmDialogOpen(true);
  };

  const confirmClosing = () => {
    setLoading(true);
    setTimeout(() => {
      const updatedYears = financialYears.map(year =>
        year.financialYear === selectedYear
          ? {
              ...year,
              status: "closed" as const,
              closingDate: closingDate,
              closedBy: "Admin User",
              totalAssets: closingSummary?.totalAssets || 18500000,
              totalLiabilities: closingSummary?.totalLiabilities || 9200000,
              netProfit: closingSummary?.netProfit || 9300000,
            }
          : year
      );
      setFinancialYears(updatedYears);
      setClosingStatus("success");
      setIsConfirmDialogOpen(false);
      setTimeout(() => setClosingStatus(null), 3000);
      alert(`Financial Year ${selectedYear} closed successfully!`);
      setLoading(false);
    }, 1500);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleDownloadReport = () => {
    alert("Report downloaded successfully!");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs"><Unlock className="h-3 w-3" /> OPEN</span>;
      case "closed":
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs"><Lock className="h-3 w-3" /> CLOSED</span>;
      case "pending":
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs"><Clock className="h-3 w-3" /> PENDING</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">FINANCIAL YEAR CLOSING</h1>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[10px] md:text-xs text-muted-foreground">
          <span>Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
          <span>Login By : MAYANK.GRLOGISTICS@GMAIL.COM</span>
          <span>Login Branch : CORPORATE OFFICE</span>
          <span>Financial Year : 2026-2027</span>
        </div>
      </div>

      {/* Success/Error Message */}
      {closingStatus === "success" && (
        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 rounded-md p-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <p className="text-sm text-green-700 dark:text-green-400">Financial Year closed successfully!</p>
          </div>
        </div>
      )}

      {/* Main Form Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Financial Year Closing
          </CardTitle>
          <CardDescription className="text-xs">
            Select financial year to view closing summary and perform year-end closing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Financial Year Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs font-medium">
                Select Financial Year <span className="text-red-500">*</span>
              </Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select Financial Year" />
                </SelectTrigger>
                <SelectContent>
                  {financialYearOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium">Closing Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-9 w-full text-xs">
                    <CalendarIcon className="mr-1 h-3 w-3" />
                    {format(closingDate, "dd-MM-yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={closingDate} onSelect={(d) => d && setClosingDate(d)} />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={handleGetClosingSummary} size="sm" className="h-9 text-xs" disabled={loading}>
              {loading ? <RefreshCw className="mr-1 h-3.5 w-3.5 animate-spin" /> : <Eye className="mr-1 h-3.5 w-3.5" />}
              GET CLOSING SUMMARY
            </Button>
            <Button onClick={handleCloseYear} size="sm" className="h-9 text-xs bg-red-600 hover:bg-red-700" disabled={loading || !selectedYear}>
              <Lock className="mr-1 h-3.5 w-3.5" />
              CLOSE YEAR
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Closing Summary Section */}
      {closingSummary && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Closing Summary - {selectedYear}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Total Debit</p>
                <p className="text-xl font-bold text-blue-600">₹{closingSummary.totalDebit?.toLocaleString()}</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Total Credit</p>
                <p className="text-xl font-bold text-purple-600">₹{closingSummary.totalCredit?.toLocaleString()}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Total Assets</p>
                <p className="text-xl font-bold text-green-600">₹{closingSummary.totalAssets?.toLocaleString()}</p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Total Liabilities</p>
                <p className="text-xl font-bold text-orange-600">₹{closingSummary.totalLiabilities?.toLocaleString()}</p>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Net Profit</p>
                <p className="text-xl font-bold text-emerald-600">₹{closingSummary.netProfit?.toLocaleString()}</p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-950/20 rounded-lg p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Pending Invoices</p>
                <p className="text-xl font-bold text-yellow-600">{closingSummary.pendingInvoices}</p>
              </div>
              <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Pending Payments</p>
                <p className="text-xl font-bold text-red-600">{closingSummary.pendingPayments}</p>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-950/20 rounded-lg p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Outstanding Amount</p>
                <p className="text-xl font-bold text-indigo-600">₹{closingSummary.outstandingAmount?.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button onClick={handlePrintReport} variant="outline" size="sm" className="h-8 text-xs">
                <Printer className="mr-1 h-3.5 w-3.5" /> PRINT
              </Button>
              <Button onClick={handleDownloadReport} variant="outline" size="sm" className="h-8 text-xs">
                <Download className="mr-1 h-3.5 w-3.5" /> DOWNLOAD
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Financial Years List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Financial Years Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {financialYears.map((year) => (
              <div key={year.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/30">
                <div>
                  <p className="text-sm font-medium">{year.financialYear}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(year.fromDate, "dd-MM-yyyy")} to {format(year.toDate, "dd-MM-yyyy")}
                  </p>
                  {year.closingDate && (
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Closed on: {format(year.closingDate, "dd-MM-yyyy")} by {year.closedBy}
                    </p>
                  )}
                </div>
                <div>{getStatusBadge(year.status)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Confirm Financial Year Closing
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to close the financial year <strong>{selectedYear}</strong>?
              <br /><br />
              <strong>This action cannot be undone!</strong>
              <br /><br />
              Once closed:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>No further transactions can be posted</li>
                <li>All accounts will be locked for editing</li>
                <li>Opening balances for next year will be set</li>
                <li>Year-end reports will be generated</li>
              </ul>
              {remarks && (
                <div className="mt-3 p-2 bg-muted rounded text-xs">
                  <strong>Remarks:</strong> {remarks}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-8 text-xs">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClosing} className="h-8 text-xs bg-red-600 hover:bg-red-700">
              Yes, Close Financial Year
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Info Note */}
      <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 rounded-md p-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
          <div className="text-xs text-yellow-700 dark:text-yellow-400">
            <p className="font-medium">Important Notes:</p>
            <ul className="list-disc list-inside mt-1 space-y-0.5">
              <li>Ensure all transactions are posted before closing the financial year</li>
              <li>Pending invoices and payments will be carried forward to next year</li>
              <li>Closed years cannot be reopened without administrator access</li>
              <li>Please take backup before performing year-end closing</li>
              <li>Closing summary will show the financial position before closing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}