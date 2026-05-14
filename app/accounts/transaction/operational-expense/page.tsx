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
import { Plus, Trash2, Save, RefreshCw, X, Eye, Search, Settings, Upload, Calculator } from "lucide-react";

// ==================== Types ====================
interface ExpenseRow {
  id: string;
  expense: string;
  grNo: string;
  grDate: string;
  origin: string;
  destination: string;
  customer: string;
  consignor: string;
  consignee: string;
  pckgs: number;
  aWeight: number;
  amount: number;
  remarks: string;
}

interface OperationalExpense {
  id: string;
  expenseId: string;
  branch: string;
  gstNo: string;
  date: string;
  fromDate: string;
  toDate: string;
  gstType: string;
  gstInputType: string;
  creditTo: string;
  paymentMode: string;
  instrumentType: string;
  instrumentNo: string;
  instrumentDate: string;
  bank: string;
  invoiceNo: string;
  invoiceDate: string;
  referenceNo: string;
  expense: string;
  applicableOn: string;
  amount: number;
  grNo: string;
  voucherNo: string;
  purchaseValue: number;
  manifestType: string;
  manifestNo: string;
  loadingType: string;
  vendorName: string;
  rows: ExpenseRow[];
}

// Column Settings Types
interface SearchColumnSettings {
  expenseId: boolean;
  branch: boolean;
  expenseDate: boolean;
  fromDate: boolean;
  toDate: boolean;
  voucherNo: boolean;
  purchaseValue: boolean;
  instrumentType: boolean;
  manifestType: boolean;
  manifestNo: boolean;
  loadingType: boolean;
  vendorName: boolean;
  invoiceNo: boolean;
}

interface SearchColumnOption {
  key: keyof SearchColumnSettings;
  label: string;
}

// Helper
const generateId = (): string => Math.random().toString(36).substr(2, 9);

// Mock Data for Dropdowns - All have valid non-empty values
const branches: string[] = ["Mumbai HO", "Delhi Branch", "Chennai Branch", "Kolkata Branch", "Bangalore Branch"];
const gstTypes: string[] = ["CGST+SGST", "IGST", "UTGST"];
const gstInputTypes: string[] = ["ITC Available", "ITC Not Available", "Provisional"];
const creditToOptions: string[] = ["Bank Payment", "Cash", "Credit", "Party Account"];
const instrumentTypes: string[] = ["Cheque", "DD", "PO", "NEFT", "RTGS", "Bank Transfer"];
const banks: string[] = ["SBI", "HDFC", "ICICI", "Axis", "Yes Bank", "PNB"];
const expenses: string[] = ["Freight", "Loading", "Unloading", "Toll", "Fuel", "Driver Salary", "Repair", "Insurance", "Stationery"];
const applicableOnOptions: string[] = ["Weight", "Package", "Distance", "Fixed", "Percentage"];

// Mock Search Data
const mockExpenses: OperationalExpense[] = [
  {
    id: "1",
    expenseId: "EXP-001",
    branch: "Mumbai HO",
    gstNo: "27AAABC1234D1Z",
    date: "2026-05-14",
    fromDate: "2026-05-14",
    toDate: "2026-05-14",
    gstType: "CGST+SGST",
    gstInputType: "ITC Available",
    creditTo: "Bank Payment",
    paymentMode: "Bank",
    instrumentType: "Cheque",
    instrumentNo: "CHK-123456",
    instrumentDate: "2026-05-14",
    bank: "SBI",
    invoiceNo: "INV-001",
    invoiceDate: "2026-05-14",
    referenceNo: "REF-001",
    expense: "Freight",
    applicableOn: "Weight",
    amount: 5000,
    grNo: "GR-001",
    voucherNo: "VCH-001",
    purchaseValue: 5000,
    manifestType: "LR",
    manifestNo: "LR-001",
    loadingType: "Full",
    vendorName: "ABC Transport",
    rows: [],
  },
  {
    id: "2",
    expenseId: "EXP-002",
    branch: "Delhi Branch",
    gstNo: "27AAABC1234D1Z",
    date: "2026-05-14",
    fromDate: "2026-05-14",
    toDate: "2026-05-14",
    gstType: "IGST",
    gstInputType: "ITC Available",
    creditTo: "Bank Payment",
    paymentMode: "Bank",
    instrumentType: "NEFT",
    instrumentNo: "NEFT-789012",
    instrumentDate: "2026-05-14",
    bank: "HDFC",
    invoiceNo: "INV-002",
    invoiceDate: "2026-05-14",
    referenceNo: "REF-002",
    expense: "Loading",
    applicableOn: "Package",
    amount: 2500,
    grNo: "GR-002",
    voucherNo: "VCH-002",
    purchaseValue: 2500,
    manifestType: "GP",
    manifestNo: "GP-002",
    loadingType: "Partial",
    vendorName: "XYZ Logistics",
    rows: [],
  },
];

// Column settings options
const searchColumnOptions: SearchColumnOption[] = [
  { key: "expenseId", label: "Expense Id" },
  { key: "branch", label: "Branch" },
  { key: "expenseDate", label: "Expense Date" },
  { key: "fromDate", label: "From Date" },
  { key: "toDate", label: "To Date" },
  { key: "voucherNo", label: "Voucher #" },
  { key: "purchaseValue", label: "Purchase Value" },
  { key: "instrumentType", label: "Instrument Type" },
  { key: "manifestType", label: "Manifest Type" },
  { key: "manifestNo", label: "Manifest No" },
  { key: "loadingType", label: "Loading Type" },
  { key: "vendorName", label: "Vendor Name" },
  { key: "invoiceNo", label: "Invoice No" },
];

export default function OperationalExpenseNew() {
  // ========== Entry Tab State ==========
  const [branch, setBranch] = useState<string>("");
  const [gstNo, setGstNo] = useState<string>("");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [fromDate, setFromDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [toDate, setToDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [gstType, setGstType] = useState<string>("");
  const [gstInputType, setGstInputType] = useState<string>("");
  const [creditTo, setCreditTo] = useState<string>("");
  const [paymentMode] = useState<string>("Bank");
  const [instrumentType, setInstrumentType] = useState<string>("");
  const [instrumentNo, setInstrumentNo] = useState<string>("");
  const [instrumentDate, setInstrumentDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [bank, setBank] = useState<string>("");
  const [invoiceNo, setInvoiceNo] = useState<string>("");
  const [invoiceDate, setInvoiceDate] = useState<string>("");
  const [referenceNo, setReferenceNo] = useState<string>("");
  const [expense, setExpense] = useState<string>("");
  const [applicableOn, setApplicableOn] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [grNo, setGrNo] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [expenseRows, setExpenseRows] = useState<ExpenseRow[]>([]);
  const [savedExpenses, setSavedExpenses] = useState<OperationalExpense[]>(mockExpenses);

  // ========== Search Tab State ==========
  const [searchBranch, setSearchBranch] = useState<string>("");
  const [searchFromDate, setSearchFromDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [searchToDate, setSearchToDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [searchColumnSettings, setSearchColumnSettings] = useState<SearchColumnSettings>({
    expenseId: true,
    branch: true,
    expenseDate: true,
    fromDate: true,
    toDate: true,
    voucherNo: true,
    purchaseValue: true,
    instrumentType: true,
    manifestType: true,
    manifestNo: true,
    loadingType: true,
    vendorName: true,
    invoiceNo: true,
  });
  const [viewDialogOpen, setViewDialogOpen] = useState<boolean>(false);
  const [selectedExpense, setSelectedExpense] = useState<OperationalExpense | null>(null);

  // ========== Filtered Expenses for Search Tab ==========
  const filteredExpenses = useMemo((): OperationalExpense[] => {
    let filtered = savedExpenses;

    if (searchBranch) {
      filtered = filtered.filter(e => e.branch === searchBranch);
    }
    if (searchFromDate) {
      filtered = filtered.filter(e => e.date >= searchFromDate);
    }
    if (searchToDate) {
      filtered = filtered.filter(e => e.date <= searchToDate);
    }

    return filtered;
  }, [savedExpenses, searchBranch, searchFromDate, searchToDate]);

  // ========== Entry Tab Handlers ==========
  const addExpenseRow = (): void => {
    const newRow: ExpenseRow = {
      id: generateId(),
      expense: "",
      grNo: "",
      grDate: "",
      origin: "",
      destination: "",
      customer: "",
      consignor: "",
      consignee: "",
      pckgs: 0,
      aWeight: 0,
      amount: 0,
      remarks: "",
    };
    setExpenseRows([...expenseRows, newRow]);
  };

  const updateExpenseRow = (id: string, field: keyof ExpenseRow, value: string | number): void => {
    setExpenseRows(prev =>
      prev.map(row =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const deleteExpenseRow = (id: string): void => {
    setExpenseRows(prev => prev.filter(row => row.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      alert(`File "${file.name}" selected. Import would happen here.`);
    }
  };

  const handleCalculator = (): void => {
    alert("Calculator would open here for GR No calculation");
  };

  const handleSave = (): void => {
    if (!branch) {
      alert("Branch is required");
      return;
    }
    if (!date) {
      alert("Date is required");
      return;
    }
    if (!creditTo) {
      alert("Credit To is required");
      return;
    }
    if (!instrumentType) {
      alert("Instrument Type is required");
      return;
    }
    if (!instrumentNo) {
      alert("Instrument # is required");
      return;
    }
    if (!bank) {
      alert("Bank is required");
      return;
    }

    const newExpense: OperationalExpense = {
      id: generateId(),
      expenseId: `EXP-${String(savedExpenses.length + 1).padStart(3, "0")}`,
      branch: branch,
      gstNo: gstNo,
      date: date,
      fromDate: fromDate,
      toDate: toDate,
      gstType: gstType,
      gstInputType: gstInputType,
      creditTo: creditTo,
      paymentMode: paymentMode,
      instrumentType: instrumentType,
      instrumentNo: instrumentNo,
      instrumentDate: instrumentDate,
      bank: bank,
      invoiceNo: invoiceNo,
      invoiceDate: invoiceDate,
      referenceNo: referenceNo,
      expense: expense,
      applicableOn: applicableOn,
      amount: amount,
      grNo: grNo,
      voucherNo: `VCH-${Date.now()}`,
      purchaseValue: amount,
      manifestType: "LR",
      manifestNo: `LR-${Date.now()}`,
      loadingType: "Full",
      vendorName: expenseRows[0]?.customer || "",
      rows: expenseRows,
    };

    setSavedExpenses([...savedExpenses, newExpense]);
    alert(`Operational Expense saved successfully!\nExpense ID: ${newExpense.expenseId}\nAmount: ₹${amount.toLocaleString()}`);
    handleClearEntry();
  };

  const handleClearEntry = (): void => {
    setBranch("");
    setGstNo("");
    setDate(new Date().toISOString().split("T")[0]);
    setFromDate(new Date().toISOString().split("T")[0]);
    setToDate(new Date().toISOString().split("T")[0]);
    setGstType("");
    setGstInputType("");
    setCreditTo("");
    setInstrumentType("");
    setInstrumentNo("");
    setInstrumentDate(new Date().toISOString().split("T")[0]);
    setBank("");
    setInvoiceNo("");
    setInvoiceDate("");
    setReferenceNo("");
    setExpense("");
    setApplicableOn("");
    setAmount(0);
    setGrNo("");
    setFileName("");
    setExpenseRows([]);
  };

  const handleCancel = (): void => {
    if (confirm("Cancel all changes? Data will be lost.")) {
      handleClearEntry();
    }
  };

  // ========== Search Tab Handlers ==========
  const handleShowExpenses = (): void => {
    alert(`Found ${filteredExpenses.length} operational expenses`);
  };

  const handleClearSearch = (): void => {
    setSearchBranch("");
    setSearchFromDate(new Date().toISOString().split("T")[0]);
    setSearchToDate(new Date().toISOString().split("T")[0]);
  };

  const toggleSearchColumn = (key: keyof SearchColumnSettings): void => {
    setSearchColumnSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleViewDetails = (expense: OperationalExpense): void => {
    setSelectedExpense(expense);
    setViewDialogOpen(true);
  };

  // Calculate row total
  const rowsTotal = expenseRows.reduce((sum, row) => sum + (row.amount || 0), 0);

  return (
    <div className="space-y-6 p-3 sm:p-4 md:p-6 max-w-full overflow-x-hidden">
      <h1 className="text-xl sm:text-2xl font-bold text-primary">Operational Expense New</h1>

      <Tabs defaultValue="entry" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="entry">Entry</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
        </TabsList>

        {/* ==================== ENTRY TAB ==================== */}
        <TabsContent value="entry" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Operational Expense Entry</CardTitle>
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
                  <Label>GST #</Label>
                  <Input value={gstNo} onChange={(e) => setGstNo(e.target.value)} placeholder="Enter GST Number" />
                </div>
                <div>
                  <Label>Date <span className="text-red-500">*</span></Label>
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div>
                  <Label>Period <span className="text-red-500">*</span></Label>
                  <div className="flex gap-2">
                    <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-1/2" />
                    <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-1/2" />
                  </div>
                </div>
                <div>
                  <Label>GST Type</Label>
                  <Select value={gstType} onValueChange={setGstType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select GST Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {gstTypes.map(g => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>GST Input Type</Label>
                  <Select value={gstInputType} onValueChange={setGstInputType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select GST Input Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {gstInputTypes.map(g => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Credit To</Label>
                  <Select value={creditTo} onValueChange={setCreditTo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Credit To" />
                    </SelectTrigger>
                    <SelectContent>
                      {creditToOptions.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Payment Mode</Label>
                  <Input value="Bank" disabled className="bg-muted" />
                </div>
                <div>
                  <Label>Instrument Type <span className="text-red-500">*</span></Label>
                  <Select value={instrumentType} onValueChange={setInstrumentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Instrument Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {instrumentTypes.map(i => (
                        <SelectItem key={i} value={i}>{i}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Instrument # <span className="text-red-500">*</span></Label>
                  <Input value={instrumentNo} onChange={(e) => setInstrumentNo(e.target.value)} />
                </div>
                <div>
                  <Label>Date <span className="text-red-500">*</span></Label>
                  <Input type="date" value={instrumentDate} onChange={(e) => setInstrumentDate(e.target.value)} />
                </div>
                <div>
                  <Label>Bank <span className="text-red-500">*</span></Label>
                  <Select value={bank} onValueChange={setBank}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {banks.map(b => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Invoice #</Label>
                  <Input value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} />
                </div>
                <div>
                  <Label>Invoice Date</Label>
                  <Input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
                </div>
                <div>
                  <Label>Reference #</Label>
                  <Input value={referenceNo} onChange={(e) => setReferenceNo(e.target.value)} />
                </div>
                <div>
                  <Label>Expense</Label>
                  <Select value={expense} onValueChange={setExpense}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Expense" />
                    </SelectTrigger>
                    <SelectContent>
                      {expenses.map(e => (
                        <SelectItem key={e} value={e}>{e}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Import From Xls</Label>
                  <div className="flex gap-2 mt-1">
                    <Button variant="outline" onClick={() => document.getElementById("excelUpload")?.click()}>
                      <Upload className="mr-2 h-4 w-4" /> Choose File
                    </Button>
                    <input id="excelUpload" type="file" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} className="hidden" />
                    <span className="text-sm text-muted-foreground">{fileName || "No file chosen"}</span>
                  </div>
                </div>
                <div>
                  <Label>Applicable On</Label>
                  <Select value={applicableOn} onValueChange={setApplicableOn}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Applicable On" />
                    </SelectTrigger>
                    <SelectContent>
                      {applicableOnOptions.map(a => (
                        <SelectItem key={a} value={a}>{a}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Amount</Label>
                  <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
                </div>
                <div>
                  <Label>GR No</Label>
                  <div className="flex gap-2">
                    <Input value={grNo} onChange={(e) => setGrNo(e.target.value)} />
                    <Button variant="outline" onClick={handleCalculator}>
                      <Calculator className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expense Rows Table */}
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Expense Details</CardTitle>
              <Button onClick={addExpenseRow} variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" /> Add More
              </Button>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <div className="min-w-[1200px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>S#</TableHead>
                      <TableHead>Expense</TableHead>
                      <TableHead>GR #</TableHead>
                      <TableHead>GR Date</TableHead>
                      <TableHead>Origin</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Consignor</TableHead>
                      <TableHead>Consignee</TableHead>
                      <TableHead>Pckgs</TableHead>
                      <TableHead>A Weight</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Remarks</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenseRows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={14} className="text-center py-8 text-muted-foreground">
                          No expense rows added. Click "Add More" to add.
                        </TableCell>
                      </TableRow>
                    ) : (
                      expenseRows.map((row, idx) => (
                        <TableRow key={row.id}>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>
                            <Select value={row.expense} onValueChange={(v) => updateExpenseRow(row.id, "expense", v)}>
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Select Expense" />
                              </SelectTrigger>
                              <SelectContent>
                                {expenses.map(e => (
                                  <SelectItem key={e} value={e}>{e}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input value={row.grNo} onChange={(e) => updateExpenseRow(row.id, "grNo", e.target.value)} className="w-24" />
                          </TableCell>
                          <TableCell>
                            <Input type="date" value={row.grDate} onChange={(e) => updateExpenseRow(row.id, "grDate", e.target.value)} className="w-32" />
                          </TableCell>
                          <TableCell>
                            <Input value={row.origin} onChange={(e) => updateExpenseRow(row.id, "origin", e.target.value)} className="w-28" />
                          </TableCell>
                          <TableCell>
                            <Input value={row.destination} onChange={(e) => updateExpenseRow(row.id, "destination", e.target.value)} className="w-28" />
                          </TableCell>
                          <TableCell>
                            <Input value={row.customer} onChange={(e) => updateExpenseRow(row.id, "customer", e.target.value)} className="w-28" />
                          </TableCell>
                          <TableCell>
                            <Input value={row.consignor} onChange={(e) => updateExpenseRow(row.id, "consignor", e.target.value)} className="w-28" />
                          </TableCell>
                          <TableCell>
                            <Input value={row.consignee} onChange={(e) => updateExpenseRow(row.id, "consignee", e.target.value)} className="w-28" />
                          </TableCell>
                          <TableCell>
                            <Input type="number" value={row.pckgs} onChange={(e) => updateExpenseRow(row.id, "pckgs", Number(e.target.value))} className="w-20" />
                          </TableCell>
                          <TableCell>
                            <Input type="number" value={row.aWeight} onChange={(e) => updateExpenseRow(row.id, "aWeight", Number(e.target.value))} className="w-20" />
                          </TableCell>
                          <TableCell>
                            <Input type="number" value={row.amount} onChange={(e) => updateExpenseRow(row.id, "amount", Number(e.target.value))} className="w-28 text-right" />
                          </TableCell>
                          <TableCell>
                            <Input value={row.remarks} onChange={(e) => updateExpenseRow(row.id, "remarks", e.target.value)} className="w-32" />
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => deleteExpenseRow(row.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
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

          {/* Total Row */}
          {expenseRows.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-end text-lg font-semibold">
                  Total Amount: <span className="text-blue-600 ml-2">₹ {rowsTotal.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          )}

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
          </div>
        </TabsContent>

        {/* ==================== SEARCH TAB ==================== */}
        <TabsContent value="search" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Search Operational Expenses</CardTitle>
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
                      <SelectItem value="all">All Branches</SelectItem>
                      {branches.map(b => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Period From <span className="text-red-500">*</span></Label>
                  <Input type="date" value={searchFromDate} onChange={(e) => setSearchFromDate(e.target.value)} />
                </div>
                <div>
                  <Label>Period To <span className="text-red-500">*</span></Label>
                  <Input type="date" value={searchToDate} onChange={(e) => setSearchToDate(e.target.value)} />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                <Button onClick={handleShowExpenses} className="bg-blue-600 hover:bg-blue-700">
                  <Search className="mr-2 h-4 w-4" /> Show
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
              <CardTitle>Operational Expense List</CardTitle>
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
              <div className="min-w-[1000px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>S#</TableHead>
                      {searchColumnSettings.expenseId && <TableHead>Expense Id</TableHead>}
                      {searchColumnSettings.branch && <TableHead>Branch</TableHead>}
                      {searchColumnSettings.expenseDate && <TableHead>Expense Date</TableHead>}
                      {searchColumnSettings.fromDate && <TableHead>From Date</TableHead>}
                      {searchColumnSettings.toDate && <TableHead>To Date</TableHead>}
                      {searchColumnSettings.voucherNo && <TableHead>Voucher #</TableHead>}
                      {searchColumnSettings.purchaseValue && <TableHead className="text-right">Purchase Value</TableHead>}
                      {searchColumnSettings.instrumentType && <TableHead>Instrument Type</TableHead>}
                      {searchColumnSettings.manifestType && <TableHead>Manifest Type</TableHead>}
                      {searchColumnSettings.manifestNo && <TableHead>Manifest No</TableHead>}
                      {searchColumnSettings.loadingType && <TableHead>Loading Type</TableHead>}
                      {searchColumnSettings.vendorName && <TableHead>Vendor Name</TableHead>}
                      {searchColumnSettings.invoiceNo && <TableHead>Invoice No</TableHead>}
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExpenses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={15} className="text-center py-8 text-muted-foreground">
                          No operational expenses found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredExpenses.map((exp, idx) => (
                        <TableRow key={exp.id}>
                          <TableCell>{idx + 1}</TableCell>
                          {searchColumnSettings.expenseId && <TableCell className="font-medium">{exp.expenseId}</TableCell>}
                          {searchColumnSettings.branch && <TableCell>{exp.branch}</TableCell>}
                          {searchColumnSettings.expenseDate && <TableCell>{exp.date}</TableCell>}
                          {searchColumnSettings.fromDate && <TableCell>{exp.fromDate}</TableCell>}
                          {searchColumnSettings.toDate && <TableCell>{exp.toDate}</TableCell>}
                          {searchColumnSettings.voucherNo && <TableCell>{exp.voucherNo}</TableCell>}
                          {searchColumnSettings.purchaseValue && <TableCell className="text-right">₹ {exp.purchaseValue.toLocaleString()}</TableCell>}
                          {searchColumnSettings.instrumentType && <TableCell>{exp.instrumentType}</TableCell>}
                          {searchColumnSettings.manifestType && <TableCell>{exp.manifestType}</TableCell>}
                          {searchColumnSettings.manifestNo && <TableCell>{exp.manifestNo}</TableCell>}
                          {searchColumnSettings.loadingType && <TableCell>{exp.loadingType}</TableCell>}
                          {searchColumnSettings.vendorName && <TableCell>{exp.vendorName}</TableCell>}
                          {searchColumnSettings.invoiceNo && <TableCell>{exp.invoiceNo}</TableCell>}
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => handleViewDetails(exp)}>
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
          {filteredExpenses.length > 0 && (
            <div className="text-sm text-muted-foreground border-t pt-3 flex justify-between">
              <span>Total Records: {filteredExpenses.length}</span>
              <span>
                Total Purchase Value: ₹ {filteredExpenses.reduce((sum, e) => sum + e.purchaseValue, 0).toLocaleString()}
              </span>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Operational Expense Details</DialogTitle>
          </DialogHeader>
          {selectedExpense && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Expense ID</Label><p className="font-medium">{selectedExpense.expenseId}</p></div>
                <div><Label>Branch</Label><p className="font-medium">{selectedExpense.branch}</p></div>
                <div><Label>Date</Label><p className="font-medium">{selectedExpense.date}</p></div>
                <div><Label>Period</Label><p className="font-medium">{selectedExpense.fromDate} to {selectedExpense.toDate}</p></div>
                <div><Label>GST #</Label><p className="font-medium">{selectedExpense.gstNo || "-"}</p></div>
                <div><Label>GST Type</Label><p className="font-medium">{selectedExpense.gstType}</p></div>
                <div><Label>Credit To</Label><p className="font-medium">{selectedExpense.creditTo}</p></div>
                <div><Label>Instrument Type</Label><p className="font-medium">{selectedExpense.instrumentType}</p></div>
                <div><Label>Instrument #</Label><p className="font-medium">{selectedExpense.instrumentNo}</p></div>
                <div><Label>Bank</Label><p className="font-medium">{selectedExpense.bank}</p></div>
                <div><Label>Invoice #</Label><p className="font-medium">{selectedExpense.invoiceNo || "-"}</p></div>
                <div><Label>Expense</Label><p className="font-medium">{selectedExpense.expense}</p></div>
                <div><Label>Amount</Label><p className="font-medium text-blue-600">₹ {selectedExpense.amount.toLocaleString()}</p></div>
                <div><Label>Voucher #</Label><p className="font-medium">{selectedExpense.voucherNo}</p></div>
                <div><Label>Vendor Name</Label><p className="font-medium">{selectedExpense.vendorName}</p></div>
              </div>
              {selectedExpense.rows.length > 0 && (
                <>
                  <div className="font-semibold mt-4">Expense Rows:</div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Expense</TableHead>
                        <TableHead>GR #</TableHead>
                        <TableHead>Origin</TableHead>
                        <TableHead>Destination</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Pckgs</TableHead>
                        <TableHead>Weight</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedExpense.rows.map((row, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{row.expense}</TableCell>
                          <TableCell>{row.grNo}</TableCell>
                          <TableCell>{row.origin}</TableCell>
                          <TableCell>{row.destination}</TableCell>
                          <TableCell>{row.customer}</TableCell>
                          <TableCell>{row.pckgs}</TableCell>
                          <TableCell>{row.aWeight}</TableCell>
                          <TableCell className="text-right">₹ {row.amount.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              )}
            </div>
          )}
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}