"use client";

import React, { useState, useMemo } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Trash2, Save, RefreshCw, X, Eye, Search, Settings, Printer } from "lucide-react";

// ==================== Types ====================
interface VoucherRow {
  id: string;
  drCr: "Dr" | "Cr";
  aCHead: string;
  debit: number;
  credit: number;
  chequeNeftRtgs: string;
  chequeNeftDate: string;
  remarks: string;
}

interface VoucherEntry {
  id: string;
  voucherNo: string;
  branch: string;
  voucherDate: string;
  voucherType: string;
  refNo: string;
  fromDate: string;
  toDate: string;
  rows: VoucherRow[];
  totalDebit: number;
  totalCredit: number;
}

// Column Settings Types
interface SearchColumnSettings {
  branch: boolean;
  voucherNo: boolean;
  vDate: boolean;
  vType: boolean;
  refNo: boolean;
  ledgerName: boolean;
  amount: boolean;
  vSource: boolean;
  remarks: boolean;
}

interface SearchColumnOption {
  key: keyof SearchColumnSettings;
  label: string;
}

// Helper
const generateId = (): string => Math.random().toString(36).substr(2, 9);

// Mock Data for Dropdowns
const branches: string[] = ["Select Branch", "Mumbai HO", "Delhi Branch", "Chennai Branch", "Kolkata Branch", "Bangalore Branch"];
const voucherTypes: string[] = ["Payment", "Receipt", "Contra", "Journal", "Credit Note", "Debit Note"];
const aCHeads: string[] = [
  "Select A/C Head",
  "Cash Account",
  "Bank Account - SBI",
  "Bank Account - HDFC",
  "Bank Account - ICICI",
  "Sundry Debtors",
  "Sundry Creditors",
  "Sales Account",
  "Purchase Account",
  "Salary Account",
  "Rent Account",
  "TDS Payable",
  "GST Payable",
  "Freight Expense",
  "Loading Expense"
];

// Mock Search Data
const mockVouchers: VoucherEntry[] = [
  {
    id: "1",
    voucherNo: "VCH-001",
    branch: "Mumbai HO",
    voucherDate: "2026-05-14",
    voucherType: "Payment",
    refNo: "REF-001",
    fromDate: "2026-05-01",
    toDate: "2026-05-14",
    rows: [],
    totalDebit: 50000,
    totalCredit: 50000,
  },
  {
    id: "2",
    voucherNo: "VCH-002",
    branch: "Delhi Branch",
    voucherDate: "2026-05-13",
    voucherType: "Receipt",
    refNo: "REF-002",
    fromDate: "2026-05-01",
    toDate: "2026-05-13",
    rows: [],
    totalDebit: 35000,
    totalCredit: 35000,
  },
  {
    id: "3",
    voucherNo: "VCH-003",
    branch: "Chennai Branch",
    voucherDate: "2026-05-12",
    voucherType: "Journal",
    refNo: "REF-003",
    fromDate: "2026-05-01",
    toDate: "2026-05-12",
    rows: [],
    totalDebit: 25000,
    totalCredit: 25000,
  },
];

// Column settings options
const searchColumnOptions: SearchColumnOption[] = [
  { key: "branch", label: "Branch" },
  { key: "voucherNo", label: "Voucher #" },
  { key: "vDate", label: "V.Date" },
  { key: "vType", label: "V.Type" },
  { key: "refNo", label: "Ref #" },
  { key: "ledgerName", label: "Ledger Name" },
  { key: "amount", label: "Amount" },
  { key: "vSource", label: "V.Source" },
  { key: "remarks", label: "Remarks" },
];

export default function VoucherEntry() {
  // ========== Entry Tab State ==========
  const [branch, setBranch] = useState<string>("");
  const [voucherDate, setVoucherDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [voucherType, setVoucherType] = useState<string>("Payment");
  const [voucherNo, setVoucherNo] = useState<string>("");
  const [refNo, setRefNo] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [toDate, setToDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [voucherRows, setVoucherRows] = useState<VoucherRow[]>([
    {
      id: generateId(),
      drCr: "Dr",
      aCHead: "",
      debit: 0,
      credit: 0,
      chequeNeftRtgs: "",
      chequeNeftDate: "",
      remarks: "",
    },
    {
      id: generateId(),
      drCr: "Cr",
      aCHead: "",
      debit: 0,
      credit: 0,
      chequeNeftRtgs: "",
      chequeNeftDate: "",
      remarks: "",
    },
  ]);
  const [savedVouchers, setSavedVouchers] = useState<VoucherEntry[]>(mockVouchers);

  // ========== Search Tab State ==========
  const [searchBranch, setSearchBranch] = useState<string>("");
  const [searchVoucherNo, setSearchVoucherNo] = useState<string>("");
  const [searchFromDate, setSearchFromDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [searchToDate, setSearchToDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [searchColumnSettings, setSearchColumnSettings] = useState<SearchColumnSettings>({
    branch: true,
    voucherNo: true,
    vDate: true,
    vType: true,
    refNo: true,
    ledgerName: true,
    amount: true,
    vSource: true,
    remarks: true,
  });
  const [viewDialogOpen, setViewDialogOpen] = useState<boolean>(false);
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherEntry | null>(null);

  // ========== Calculate Totals ==========
  const totals = voucherRows.reduce(
    (acc, row) => ({
      debit: acc.debit + (row.debit || 0),
      credit: acc.credit + (row.credit || 0),
    }),
    { debit: 0, credit: 0 }
  );

  // ========== Entry Tab Handlers ==========
  const addRow = (): void => {
    const newRow: VoucherRow = {
      id: generateId(),
      drCr: "Dr",
      aCHead: "",
      debit: 0,
      credit: 0,
      chequeNeftRtgs: "",
      chequeNeftDate: "",
      remarks: "",
    };
    setVoucherRows([...voucherRows, newRow]);
  };

  const updateRow = (id: string, field: keyof VoucherRow, value: string | number): void => {
    setVoucherRows(prev =>
      prev.map(row => {
        if (row.id === id) {
          const updated = { ...row, [field]: value };
          // If updating drCr, ensure debit/credit are set appropriately
          if (field === "drCr") {
            if (value === "Dr") {
              updated.credit = 0;
            } else {
              updated.debit = 0;
            }
          }
          return updated;
        }
        return row;
      })
    );
  };

  const deleteRow = (id: string): void => {
    if (voucherRows.length <= 2) {
      alert("Minimum 2 rows (one Dr and one Cr) are required");
      return;
    }
    setVoucherRows(prev => prev.filter(row => row.id !== id));
  };

  const handleSave = (): void => {
    if (!branch) {
      alert("Branch is required");
      return;
    }
    if (!voucherNo) {
      alert("Voucher # is required");
      return;
    }
    if (totals.debit !== totals.credit) {
      alert(`Total Debit (${totals.debit}) and Total Credit (${totals.credit}) must be equal`);
      return;
    }
    if (totals.debit === 0) {
      alert("Please add at least one entry with amount");
      return;
    }

    // Validate all rows have A/C Head selected
    for (const row of voucherRows) {
      if (!row.aCHead || row.aCHead === "Select A/C Head") {
        alert("Please select A/C Head for all rows");
        return;
      }
    }

    const newVoucher: VoucherEntry = {
      id: generateId(),
      voucherNo: voucherNo,
      branch: branch,
      voucherDate: voucherDate,
      voucherType: voucherType,
      refNo: refNo,
      fromDate: fromDate,
      toDate: toDate,
      rows: voucherRows,
      totalDebit: totals.debit,
      totalCredit: totals.credit,
    };

    setSavedVouchers([newVoucher, ...savedVouchers]);
    alert(`Voucher saved successfully!\nVoucher No: ${voucherNo}\nAmount: ₹${totals.debit.toLocaleString()}`);
    handleClearEntry();
  };

  const handleClearEntry = (): void => {
    setBranch("");
    setVoucherDate(new Date().toISOString().split("T")[0]);
    setVoucherType("Payment");
    setVoucherNo("");
    setRefNo("");
    setFromDate(new Date().toISOString().split("T")[0]);
    setToDate(new Date().toISOString().split("T")[0]);
    setVoucherRows([
      {
        id: generateId(),
        drCr: "Dr",
        aCHead: "",
        debit: 0,
        credit: 0,
        chequeNeftRtgs: "",
        chequeNeftDate: "",
        remarks: "",
      },
      {
        id: generateId(),
        drCr: "Cr",
        aCHead: "",
        debit: 0,
        credit: 0,
        chequeNeftRtgs: "",
        chequeNeftDate: "",
        remarks: "",
      },
    ]);
  };

  const handleCancel = (): void => {
    if (confirm("Cancel all changes? Data will be lost.")) {
      handleClearEntry();
    }
  };

  const handlePrint = (): void => {
    alert("Print voucher functionality would open here");
  };

  // ========== Search Tab Handlers ==========
  const filteredVouchers = useMemo((): VoucherEntry[] => {
    let filtered = savedVouchers;

    if (searchBranch) {
      filtered = filtered.filter(v => v.branch === searchBranch);
    }
    if (searchVoucherNo) {
      filtered = filtered.filter(v => v.voucherNo.toLowerCase().includes(searchVoucherNo.toLowerCase()));
    }
    if (searchFromDate) {
      filtered = filtered.filter(v => v.voucherDate >= searchFromDate);
    }
    if (searchToDate) {
      filtered = filtered.filter(v => v.voucherDate <= searchToDate);
    }

    return filtered;
  }, [savedVouchers, searchBranch, searchVoucherNo, searchFromDate, searchToDate]);

  const handleSearch = (): void => {
    alert(`Found ${filteredVouchers.length} vouchers`);
  };

  const handleClearSearch = (): void => {
    setSearchBranch("");
    setSearchVoucherNo("");
    setSearchFromDate(new Date().toISOString().split("T")[0]);
    setSearchToDate(new Date().toISOString().split("T")[0]);
  };

  const toggleSearchColumn = (key: keyof SearchColumnSettings): void => {
    setSearchColumnSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleViewDetails = (voucher: VoucherEntry): void => {
    setSelectedVoucher(voucher);
    setViewDialogOpen(true);
  };

  return (
    <div className="space-y-6 p-3 sm:p-4 md:p-6 max-w-full overflow-x-hidden">
      <h1 className="text-xl sm:text-2xl font-bold text-primary">Voucher Entry</h1>

      <Tabs defaultValue="entry" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="entry">Entry</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
        </TabsList>

        {/* ==================== ENTRY TAB ==================== */}
        <TabsContent value="entry" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Voucher Entry</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label>Branch <span className="text-red-500">*</span></Label>
                  <Select value={branch} onValueChange={setBranch}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map(b => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Voucher Date <span className="text-red-500">*</span></Label>
                  <Input type="date" value={voucherDate} onChange={(e) => setVoucherDate(e.target.value)} />
                </div>
                <div>
                  <Label>Voucher Type</Label>
                  <Select value={voucherType} onValueChange={setVoucherType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Payment" />
                    </SelectTrigger>
                    <SelectContent>
                      {voucherTypes.map(v => (
                        <SelectItem key={v} value={v}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Voucher # <span className="text-red-500">*</span></Label>
                  <Input value={voucherNo} onChange={(e) => setVoucherNo(e.target.value)} placeholder="Auto" />
                </div>
                <div>
                  <Label>Ref #</Label>
                  <Input value={refNo} onChange={(e) => setRefNo(e.target.value)} />
                </div>
                <div>
                  <Label>From Date</Label>
                  <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                </div>
                <div>
                  <Label>To Date</Label>
                  <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Voucher Entries Table */}
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Voucher Entries</CardTitle>
              <Button onClick={addRow} variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" /> Add More
              </Button>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <div className="min-w-[1000px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>S#</TableHead>
                      <TableHead>Dr/Cr</TableHead>
                      <TableHead>A/C Head</TableHead>
                      <TableHead className="text-right">Debit</TableHead>
                      <TableHead className="text-right">Credit</TableHead>
                      <TableHead>Cheque/Neft/Rtgs</TableHead>
                      <TableHead>Cheque/Neft/Date</TableHead>
                      <TableHead>Remarks</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {voucherRows.map((row, idx) => (
                      <TableRow key={row.id}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>
                          <Select value={row.drCr} onValueChange={(v: "Dr" | "Cr") => updateRow(row.id, "drCr", v)}>
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Dr">Dr</SelectItem>
                              <SelectItem value="Cr">Cr</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select value={row.aCHead} onValueChange={(v) => updateRow(row.id, "aCHead", v)}>
                            <SelectTrigger className="w-48">
                              <SelectValue placeholder="Select A/C Head" />
                            </SelectTrigger>
                            <SelectContent>
                              {aCHeads.map(h => (
                                <SelectItem key={h} value={h}>{h}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={row.debit}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              updateRow(row.id, "debit", val);
                              if (row.drCr === "Dr") {
                                updateRow(row.id, "credit", 0);
                              }
                            }}
                            className="w-28 text-right"
                            disabled={row.drCr === "Cr"}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={row.credit}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              updateRow(row.id, "credit", val);
                              if (row.drCr === "Cr") {
                                updateRow(row.id, "debit", 0);
                              }
                            }}
                            className="w-28 text-right"
                            disabled={row.drCr === "Dr"}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={row.chequeNeftRtgs}
                            onChange={(e) => updateRow(row.id, "chequeNeftRtgs", e.target.value)}
                            className="w-32"
                            placeholder="CHK/NEFT/RTGS"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="date"
                            value={row.chequeNeftDate}
                            onChange={(e) => updateRow(row.id, "chequeNeftDate", e.target.value)}
                            className="w-32"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={row.remarks}
                            onChange={(e) => updateRow(row.id, "remarks", e.target.value)}
                            className="w-40"
                          />
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => deleteRow(row.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Totals Row */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-end gap-8 text-lg font-semibold">
                <div>
                  Total Debit: <span className="text-blue-600">₹ {totals.debit.toLocaleString()}</span>
                </div>
                <div>
                  Total Credit: <span className="text-green-600">₹ {totals.credit.toLocaleString()}</span>
                </div>
                <div>
                  Difference: <span className={totals.debit !== totals.credit ? "text-red-600" : "text-green-600"}>
                    ₹ {Math.abs(totals.debit - totals.credit).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4 border-t">
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              <Save className="mr-2 h-4 w-4" /> Save
            </Button>
            <Button onClick={handleClearEntry} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" /> Clear
            </Button>
            <Button onClick={handleCancel} variant="destructive">
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button onClick={handlePrint} variant="outline">
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
          </div>
        </TabsContent>

        {/* ==================== SEARCH TAB ==================== */}
        <TabsContent value="search" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Search Vouchers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label>Branch</Label>
                  <Select value={searchBranch} onValueChange={setSearchBranch}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Branches" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all branches">All Branches</SelectItem>
                      {branches.filter(b => b !== "Select Branch").map(b => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Voucher No</Label>
                  <Input value={searchVoucherNo} onChange={(e) => setSearchVoucherNo(e.target.value)} placeholder="Enter Voucher #" />
                </div>
                <div>
                  <Label>From Date</Label>
                  <Input type="date" value={searchFromDate} onChange={(e) => setSearchFromDate(e.target.value)} />
                </div>
                <div>
                  <Label>To Date</Label>
                  <Input type="date" value={searchToDate} onChange={(e) => setSearchToDate(e.target.value)} />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
                  <Search className="mr-2 h-4 w-4" /> Search...
                </Button>
                <Button onClick={handleClearSearch} variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" /> Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Search Results Table with Column Settings */}
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Voucher List</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" /> Column Settings
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {searchColumnOptions.map((opt) => (
                    <DropdownMenuItem key={opt.key} onSelect={(e) => e.preventDefault()}>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={searchColumnSettings[opt.key]}
                          onCheckedChange={() => toggleSearchColumn(opt.key)}
                        />
                        <span>{opt.label}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <div className="min-w-[900px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>S#</TableHead>
                      {searchColumnSettings.branch && <TableHead>Branch</TableHead>}
                      {searchColumnSettings.voucherNo && <TableHead>Voucher #</TableHead>}
                      {searchColumnSettings.vDate && <TableHead>V.Date</TableHead>}
                      {searchColumnSettings.vType && <TableHead>V.Type</TableHead>}
                      {searchColumnSettings.refNo && <TableHead>Ref #</TableHead>}
                      {searchColumnSettings.ledgerName && <TableHead>Ledger Name</TableHead>}
                      {searchColumnSettings.amount && <TableHead className="text-right">Amount</TableHead>}
                      {searchColumnSettings.vSource && <TableHead>V.Source</TableHead>}
                      {searchColumnSettings.remarks && <TableHead>Remarks</TableHead>}
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVouchers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                          No vouchers found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredVouchers.map((voucher, idx) => (
                        <TableRow key={voucher.id}>
                          <TableCell>{idx + 1}</TableCell>
                          {searchColumnSettings.branch && <TableCell>{voucher.branch}</TableCell>}
                          {searchColumnSettings.voucherNo && <TableCell className="font-medium">{voucher.voucherNo}</TableCell>}
                          {searchColumnSettings.vDate && <TableCell>{voucher.voucherDate}</TableCell>}
                          {searchColumnSettings.vType && <TableCell>{voucher.voucherType}</TableCell>}
                          {searchColumnSettings.refNo && <TableCell>{voucher.refNo || "-"}</TableCell>}
                          {searchColumnSettings.ledgerName && <TableCell>
                            {voucher.rows.length > 0 ? voucher.rows[0].aCHead : "-"}
                          </TableCell>}
                          {searchColumnSettings.amount && <TableCell className="text-right">
                            ₹ {voucher.totalDebit.toLocaleString()}
                          </TableCell>}
                          {searchColumnSettings.vSource && <TableCell>Manual</TableCell>}
                          {searchColumnSettings.remarks && <TableCell>
                            {voucher.rows.length > 0 ? voucher.rows[0].remarks : "-"}
                          </TableCell>}
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => handleViewDetails(voucher)}>
                              <Eye className="h-4 w-4" />
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

          {/* Summary Footer */}
          {filteredVouchers.length > 0 && (
            <div className="text-sm text-muted-foreground border-t pt-3 flex justify-between">
              <span>Total Records: {filteredVouchers.length}</span>
              <span>
                Total Amount: ₹ {filteredVouchers.reduce((sum, v) => sum + v.totalDebit, 0).toLocaleString()}
              </span>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Voucher Details</DialogTitle>
          </DialogHeader>
          {selectedVoucher && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Voucher No</Label><p className="font-medium">{selectedVoucher.voucherNo}</p></div>
                <div><Label>Branch</Label><p className="font-medium">{selectedVoucher.branch}</p></div>
                <div><Label>Voucher Date</Label><p className="font-medium">{selectedVoucher.voucherDate}</p></div>
                <div><Label>Voucher Type</Label><p className="font-medium">{selectedVoucher.voucherType}</p></div>
                <div><Label>Ref #</Label><p className="font-medium">{selectedVoucher.refNo || "-"}</p></div>
                <div><Label>Period</Label><p className="font-medium">{selectedVoucher.fromDate} to {selectedVoucher.toDate}</p></div>
              </div>
              <div className="font-semibold mt-4">Entries:</div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dr/Cr</TableHead>
                    <TableHead>A/C Head</TableHead>
                    <TableHead className="text-right">Debit</TableHead>
                    <TableHead className="text-right">Credit</TableHead>
                    <TableHead>Cheque/Neft/Rtgs</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedVoucher.rows.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{row.drCr}</TableCell>
                      <TableCell>{row.aCHead}</TableCell>
                      <TableCell className="text-right">₹ {row.debit.toLocaleString()}</TableCell>
                      <TableCell className="text-right">₹ {row.credit.toLocaleString()}</TableCell>
                      <TableCell>{row.chequeNeftRtgs || "-"}</TableCell>
                      <TableCell>{row.chequeNeftDate || "-"}</TableCell>
                      <TableCell>{row.remarks || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-end gap-4 font-semibold">
                <div>Total Debit: ₹ {selectedVoucher.totalDebit.toLocaleString()}</div>
                <div>Total Credit: ₹ {selectedVoucher.totalCredit.toLocaleString()}</div>
              </div>
            </div>
          )}
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>Close</Button>
            <Button onClick={handlePrint} className="ml-2"><Printer className="mr-2 h-4 w-4" /> Print</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}