"use client";

import React, { useState, useMemo } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as CalendarIcon, Search, Upload, FileText, Eye, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// ==================== Types ====================
interface Transaction {
  id: string;
  sNo: number;
  branchName: string;
  date: string;
  bankDate: string;
  voucherNo: string;
  vType: string;
  chequeNo: string;
  chequeDate: string;
  refNo: string;
  particulars: string;
  debit: number;
  credit: number;
  balance: number;
  remarks: string;
  bankRemarks: string;
  reconciled: boolean;
}

// ==================== Mock Data ====================
const generateMockData = (): Transaction[] => {
  const branches = ["Head Office", "North Branch", "South Branch", "East Branch"];
  const vTypes = ["Payment", "Receipt", "Contra", "Journal"];
  const transactions: Transaction[] = [];

  for (let i = 1; i <= 25; i++) {
    const reconciled = i % 3 === 0 ? true : i % 5 === 0 ? false : true; // some reconciled, some not
    transactions.push({
      id: i.toString(),
      sNo: i,
      branchName: branches[i % branches.length],
      date: `2026-05-${10 + (i % 20)}`,
      bankDate: `2026-05-${12 + (i % 18)}`,
      voucherNo: `V-${1000 + i}`,
      vType: vTypes[i % vTypes.length],
      chequeNo: i % 2 === 0 ? `CHK${1000 + i}` : "",
      chequeDate: i % 2 === 0 ? `2026-05-${5 + (i % 15)}` : "",
      refNo: `REF${i}`,
      particulars: `Transaction ${i} description`,
      debit: i % 2 === 0 ? 5000 + i * 100 : 0,
      credit: i % 2 === 1 ? 5000 + i * 100 : 0,
      balance: 100000 + i * 500,
      remarks: i % 4 === 0 ? "Cleared" : "Pending",
      bankRemarks: i % 3 === 0 ? "Matched" : "Unmatched",
      reconciled: reconciled,
    });
  }
  return transactions;
};

// ==================== Main Component ====================
export default function BankReconciliation() {
  // State
  const [startDate, setStartDate] = useState<string>("2026-05-13");
  const [endDate, setEndDate] = useState<string>("2026-05-13");
  const [selectedLedger, setSelectedLedger] = useState<string>("SBI Current Account");
  const [transactions, setTransactions] = useState<Transaction[]>(generateMockData());
  const [filterType, setFilterType] = useState<"all" | "reconciled" | "unreconciled">("all");
  const [globalSearch, setGlobalSearch] = useState<string>("");
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({
    branchName: "",
    date: "",
    bankDate: "",
    voucherNo: "",
    vType: "",
    chequeNo: "",
    chequeDate: "",
    refNo: "",
    particulars: "",
    remarks: "",
    bankRemarks: "",
  });

  // File upload state
  const [fileName, setFileName] = useState<string>("");

  // Helper: Update reconciliation status for a row
  const toggleReconciliation = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, reconciled: !t.reconciled } : t))
    );
  };

  // Bulk update for reconciliation button (view update reconciliation - could show summary)
  const handleUpdateReconciliation = () => {
    const reconciledCount = transactions.filter(t => t.reconciled).length;
    alert(`Update reconciliation summary: ${reconciledCount} reconciled, ${transactions.length - reconciledCount} unreconciled.`);
  };

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      alert(`File "${file.name}" selected. Import logic would happen here.`);
    } else {
      setFileName("");
    }
  };

  // Filtered transactions based on filterType, globalSearch, and column filters
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Reconciliation type filter
    if (filterType === "reconciled") {
      filtered = filtered.filter(t => t.reconciled === true);
    } else if (filterType === "unreconciled") {
      filtered = filtered.filter(t => t.reconciled === false);
    }

    // Global search (across multiple fields)
    if (globalSearch.trim() !== "") {
      const searchLower = globalSearch.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.branchName.toLowerCase().includes(searchLower) ||
          t.voucherNo.toLowerCase().includes(searchLower) ||
          t.particulars.toLowerCase().includes(searchLower) ||
          t.chequeNo.toLowerCase().includes(searchLower) ||
          t.refNo.toLowerCase().includes(searchLower)
      );
    }

    // Column-specific filters
    for (const [column, value] of Object.entries(columnFilters)) {
      if (value.trim() !== "") {
        const searchVal = value.toLowerCase();
        filtered = filtered.filter((t) => {
          const fieldValue = t[column as keyof Transaction];
          if (fieldValue === undefined || fieldValue === null) return false;
          return fieldValue.toString().toLowerCase().includes(searchVal);
        });
      }
    }

    // Recalculate S# after filtering
    return filtered.map((item, idx) => ({ ...item, sNo: idx + 1 }));
  }, [transactions, filterType, globalSearch, columnFilters]);

  // Update column filter
  const updateColumnFilter = (column: string, value: string) => {
    setColumnFilters((prev) => ({ ...prev, [column]: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setGlobalSearch("");
    setColumnFilters({
      branchName: "",
      date: "",
      bankDate: "",
      voucherNo: "",
      vType: "",
      chequeNo: "",
      chequeDate: "",
      refNo: "",
      particulars: "",
      remarks: "",
      bankRemarks: "",
    });
    setFilterType("all");
  };

  return (
    <div className="space-y-4 p-3 sm:p-4 md:p-6 max-w-full overflow-x-hidden">
      <h1 className="text-xl sm:text-2xl font-bold text-primary">Bank Reconciliation</h1>

      {/* Period & Ledger Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div>
          <Label>Period Start <span className="text-red-500">*</span></Label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <Label>Period End <span className="text-red-500">*</span></Label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div>
          <Label>Ledger <span className="text-red-500">*</span></Label>
          <Select value={selectedLedger} onValueChange={setSelectedLedger}>
            <SelectTrigger>
              <SelectValue placeholder="Select Ledger" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SBI Current Account">SBI Current Account</SelectItem>
              <SelectItem value="HDFC Bank">HDFC Bank</SelectItem>
              <SelectItem value="ICICI Bank">ICICI Bank</SelectItem>
              <SelectItem value="Axis Bank">Axis Bank</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Button onClick={handleUpdateReconciliation} className="w-full sm:w-auto">
            <RefreshCw className="mr-2 h-4 w-4" /> View / Update Reconciliation
          </Button>
        </div>
      </div>

      {/* Import File Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1">
          <Label>Import File</Label>
          <div className="flex items-center gap-2 mt-1">
            <Input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              id="fileUpload"
            />
            <Button variant="outline" onClick={() => document.getElementById("fileUpload")?.click()}>
              <Upload className="mr-2 h-4 w-4" /> Choose File
            </Button>
            <span className="text-sm text-muted-foreground">
              {fileName ? fileName : "No file chosen"}
            </span>
          </div>
        </div>
        <Button variant="default" onClick={() => alert("Upload logic would execute here")}>
          Upload
        </Button>
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filterType === "all" ? "default" : "outline"}
            onClick={() => setFilterType("all")}
          >
            Show All
          </Button>
          <Button
            variant={filterType === "reconciled" ? "default" : "outline"}
            onClick={() => setFilterType("reconciled")}
          >
            Reconciliation
          </Button>
          <Button
            variant={filterType === "unreconciled" ? "default" : "outline"}
            onClick={() => setFilterType("unreconciled")}
          >
            Un‑Reconciliation
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => alert("Report Summary")}>
            <FileText className="mr-2 h-4 w-4" /> Summary
          </Button>
          <Button variant="outline" size="sm" onClick={() => alert("Details not in ledger")}>
            Details not in ledger
          </Button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Branch, Voucher, Particulars, Cheque, Ref..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={() => {}} variant="secondary">
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
        <Button onClick={clearFilters} variant="ghost">
          Clear Filters
        </Button>
      </div>

      {/* Data Table - Responsive with horizontal scroll */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Reconciliation Entries</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="min-w-[1200px] lg:min-w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">S#</TableHead>
                  <TableHead>
                    Branch Name
                    <Input
                      placeholder="Filter..."
                      value={columnFilters.branchName}
                      onChange={(e) => updateColumnFilter("branchName", e.target.value)}
                      className="mt-1 h-7 text-xs"
                    />
                  </TableHead>
                  <TableHead>
                    Date
                    <Input
                      placeholder="YYYY-MM-DD"
                      value={columnFilters.date}
                      onChange={(e) => updateColumnFilter("date", e.target.value)}
                      className="mt-1 h-7 text-xs"
                    />
                  </TableHead>
                  <TableHead>
                    Bank Date
                    <Input
                      placeholder="YYYY-MM-DD"
                      value={columnFilters.bankDate}
                      onChange={(e) => updateColumnFilter("bankDate", e.target.value)}
                      className="mt-1 h-7 text-xs"
                    />
                  </TableHead>
                  <TableHead>
                    Voucher#
                    <Input
                      placeholder="Filter..."
                      value={columnFilters.voucherNo}
                      onChange={(e) => updateColumnFilter("voucherNo", e.target.value)}
                      className="mt-1 h-7 text-xs"
                    />
                  </TableHead>
                  <TableHead>
                    V Type
                    <Input
                      placeholder="Filter..."
                      value={columnFilters.vType}
                      onChange={(e) => updateColumnFilter("vType", e.target.value)}
                      className="mt-1 h-7 text-xs"
                    />
                  </TableHead>
                  <TableHead>
                    Cheque #
                    <Input
                      placeholder="Filter..."
                      value={columnFilters.chequeNo}
                      onChange={(e) => updateColumnFilter("chequeNo", e.target.value)}
                      className="mt-1 h-7 text-xs"
                    />
                  </TableHead>
                  <TableHead>
                    Cheque Date
                    <Input
                      placeholder="YYYY-MM-DD"
                      value={columnFilters.chequeDate}
                      onChange={(e) => updateColumnFilter("chequeDate", e.target.value)}
                      className="mt-1 h-7 text-xs"
                    />
                  </TableHead>
                  <TableHead>
                    Ref #
                    <Input
                      placeholder="Filter..."
                      value={columnFilters.refNo}
                      onChange={(e) => updateColumnFilter("refNo", e.target.value)}
                      className="mt-1 h-7 text-xs"
                    />
                  </TableHead>
                  <TableHead>
                    Particulars
                    <Input
                      placeholder="Filter..."
                      value={columnFilters.particulars}
                      onChange={(e) => updateColumnFilter("particulars", e.target.value)}
                      className="mt-1 h-7 text-xs"
                    />
                  </TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead>
                    Remarks
                    <Input
                      placeholder="Filter..."
                      value={columnFilters.remarks}
                      onChange={(e) => updateColumnFilter("remarks", e.target.value)}
                      className="mt-1 h-7 text-xs"
                    />
                  </TableHead>
                  <TableHead>
                    Bank Remarks
                    <Input
                      placeholder="Filter..."
                      value={columnFilters.bankRemarks}
                      onChange={(e) => updateColumnFilter("bankRemarks", e.target.value)}
                      className="mt-1 h-7 text-xs"
                    />
                  </TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={16} className="text-center py-8 text-muted-foreground">
                      No transactions match the current filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id} className={transaction.reconciled ? "bg-green-50 dark:bg-green-950/20" : ""}>
                      <TableCell>{transaction.sNo}</TableCell>
                      <TableCell>{transaction.branchName}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.bankDate}</TableCell>
                      <TableCell>{transaction.voucherNo}</TableCell>
                      <TableCell>{transaction.vType}</TableCell>
                      <TableCell>{transaction.chequeNo}</TableCell>
                      <TableCell>{transaction.chequeDate}</TableCell>
                      <TableCell>{transaction.refNo}</TableCell>
                      <TableCell>{transaction.particulars}</TableCell>
                      <TableCell className="text-right">{transaction.debit.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{transaction.credit.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{transaction.balance.toLocaleString()}</TableCell>
                      <TableCell>{transaction.remarks}</TableCell>
                      <TableCell>{transaction.bankRemarks}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant={transaction.reconciled ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleReconciliation(transaction.id)}
                          className={transaction.reconciled ? "bg-green-600 hover:bg-green-700" : ""}
                        >
                          {transaction.reconciled ? "Reconciled" : "Mark Reconciled"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Optional: Footer with reconciliation summary */}
      <div className="text-xs text-muted-foreground border-t pt-3 flex justify-between">
        <span>Total transactions: {filteredTransactions.length}</span>
        <span>
          Reconciled: {filteredTransactions.filter(t => t.reconciled).length} |
          Unreconciled: {filteredTransactions.filter(t => !t.reconciled).length}
        </span>
      </div>
    </div>
  );
}