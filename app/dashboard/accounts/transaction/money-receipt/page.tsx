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
import { Plus, Trash2, Save, RefreshCw, X, Eye, Search, Upload, FileText } from "lucide-react";

// ==================== Types ====================
interface OutstandingBill {
  id: string;
  customer: string;
  branch: string;
  documentType: string;
  documentNo: string;
  documentDate: string;
  amount: number;
  receivedAmount: number;
  balance: number;
  voucherNo: string;
  consignor: string;
  consignee: string;
}

interface MoneyReceipt {
  id: string;
  mrNo: string;
  mrDate: string;
  branch: string;
  branchMRNo: string;
  mode: string;
  voucherNo: string;
  amount: number;
  debitLedger: string;
  creditLedger: string;
  customer: string;
  onAccountAmount: number;
  instrumentNo: string;
  instrumentDate: string;
  chequeDepositAmount: number;
  counterCollection: string;
  drawnOn: string;
  tdsDeductionPercent: number;
  totalReceivable: number;
  bills: ReceiptBill[];
}

interface ReceiptBill {
  id: string;
  documentType: string;
  documentNo: string;
  documentDate: string;
  documentAmount: number;
  consignor: string;
  consignee: string;
  balance: number;
  receivedAmount: number;
  tds: number;
  deduction: number;
  deductionLedger: string;
  claim: string;
  serviceTax: number;
  bankCharges: number;
  excess: number;
  pending: number;
  remarks: string;
}

// Helper
const generateId = () => Math.random().toString(36).substr(2, 9);

// Mock Outstanding Data
const mockOutstandingBills: OutstandingBill[] = [
  {
    id: "1",
    customer: "ABC Transport",
    branch: "Mumbai HO",
    documentType: "INVOICE",
    documentNo: "INV-001",
    documentDate: "2026-05-01",
    amount: 50000,
    receivedAmount: 10000,
    balance: 40000,
    voucherNo: "VCH-001",
    consignor: "ABC Corp",
    consignee: "XYZ Ltd",
  },
  {
    id: "2",
    customer: "XYZ Logistics",
    branch: "Delhi Branch",
    documentType: "BILL",
    documentNo: "BIL-002",
    documentDate: "2026-05-05",
    amount: 35000,
    receivedAmount: 5000,
    balance: 30000,
    voucherNo: "VCH-002",
    consignor: "LMN Enterprises",
    consignee: "PQR Industries",
  },
  {
    id: "3",
    customer: "PQR Carriers",
    branch: "Chennai Branch",
    documentType: "INVOICE",
    documentNo: "INV-003",
    documentDate: "2026-05-10",
    amount: 25000,
    receivedAmount: 3000,
    balance: 22000,
    voucherNo: "VCH-003",
    consignor: "RST Group",
    consignee: "UVW Limited",
  },
];

// Mock Money Receipts for Search Tab
const mockMoneyReceipts: MoneyReceipt[] = [
  {
    id: "mr1",
    mrNo: "MR-001",
    mrDate: "2026-05-13",
    branch: "Mumbai HO",
    branchMRNo: "BR-MR-001",
    mode: "BANK",
    voucherNo: "VCH-101",
    amount: 40000,
    debitLedger: "SBI Current Account",
    creditLedger: "ABC Transport Ledger",
    customer: "ABC Transport",
    onAccountAmount: 40000,
    instrumentNo: "CHK-123456",
    instrumentDate: "2026-05-13",
    chequeDepositAmount: 40000,
    counterCollection: "",
    drawnOn: "SBI Bank",
    tdsDeductionPercent: 0,
    totalReceivable: 40000,
    bills: [],
  },
  {
    id: "mr2",
    mrNo: "MR-002",
    mrDate: "2026-05-13",
    branch: "Delhi Branch",
    branchMRNo: "BR-MR-002",
    mode: "CASH",
    voucherNo: "VCH-102",
    amount: 30000,
    debitLedger: "Cash Ledger",
    creditLedger: "XYZ Logistics Ledger",
    customer: "XYZ Logistics",
    onAccountAmount: 30000,
    instrumentNo: "",
    instrumentDate: "",
    chequeDepositAmount: 30000,
    counterCollection: "COUNTER-001",
    drawnOn: "",
    tdsDeductionPercent: 0,
    totalReceivable: 30000,
    bills: [],
  },
];

// Mock Data for Dropdowns
const branches = ["ALL", "Mumbai HO", "Delhi Branch", "Chennai Branch", "Kolkata Branch", "Bangalore Branch"];
const customers = ["ALL", "ABC Transport", "XYZ Logistics", "PQR Carriers", "LMN Freight"];
const documentTypes = ["BILL", "INVOICE", "CREDIT NOTE", "DEBIT NOTE"];
const paymentModes = ["CASH", "CHEQUE", "BANK TRANSFER", "NEFT", "RTGS", "BANK"];
const instrumentTypes = ["Cheque", "DD", "PO", "NEFT", "RTGS"];
const counterCollections = ["COUNTER-001", "COUNTER-002", "COUNTER-003", "Select"];

export default function MoneyReceipt() {
  // ========== Outstanding Tab State ==========
  const [outstandingBranch, setOutstandingBranch] = useState("");
  const [asOnDate, setAsOnDate] = useState(new Date().toISOString().split("T")[0]);
  const [osAgainst, setOsAgainst] = useState("BILL");
  const [customer, setCustomer] = useState("");
  const [fileName, setFileName] = useState("");
  const [commaSeparatedBills, setCommaSeparatedBills] = useState("");
  const [selectedBills, setSelectedBills] = useState<string[]>([]);
  const [outstandingData] = useState<OutstandingBill[]>(mockOutstandingBills);
  const [tdsDeductionPercent, setTdsDeductionPercent] = useState(0);

  // ========== Entry Tab State ==========
  const [entryBranch, setEntryBranch] = useState("");
  const [onAccountMR, setOnAccountMR] = useState("");
  const [mrDate, setMrDate] = useState(new Date().toISOString().split("T")[0]);
  const [mrNo, setMrNo] = useState("");
  const [mrAgainst, setMrAgainst] = useState("");
  const [entryCustomer, setEntryCustomer] = useState("");
  const [department, setDepartment] = useState("");
  const [consignor, setConsignor] = useState("");
  const [consignee, setConsignee] = useState("");
  const [paymentMode, setPaymentMode] = useState("BANK");
  const [instrumentType, setInstrumentType] = useState("");
  const [instrumentNo, setInstrumentNo] = useState("");
  const [instrumentDate, setInstrumentDate] = useState(new Date().toISOString().split("T")[0]);
  const [chequeDepositAmount, setChequeDepositAmount] = useState(0);
  const [counterCollection, setCounterCollection] = useState("");
  const [drawnOn, setDrawnOn] = useState("");
  const [debitLedger, setDebitLedger] = useState("");
  const [grossAmount, setGrossAmount] = useState(0);
  const [selectedOutstandingBills, setSelectedOutstandingBills] = useState<OutstandingBill[]>([]);
  const [receiptBills, setReceiptBills] = useState<ReceiptBill[]>([]);
  const [savedMoneyReceipts, setSavedMoneyReceipts] = useState<MoneyReceipt[]>(mockMoneyReceipts);

  // ========== Search Tab State ==========
  const [searchBranch, setSearchBranch] = useState("ALL");
  const [fromDate, setFromDate] = useState(new Date().toISOString().split("T")[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
  const [searchMrNo, setSearchMrNo] = useState("");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<MoneyReceipt | null>(null);

  // ========== Filtered Outstanding Data ==========
  const filteredOutstanding = useMemo(() => {
    let filtered = outstandingData;

    if (outstandingBranch && outstandingBranch !== "ALL") {
      filtered = filtered.filter(b => b.branch === outstandingBranch);
    }
    if (customer && customer !== "ALL") {
      filtered = filtered.filter(c => c.customer === customer);
    }
    if (commaSeparatedBills) {
      const billNos = commaSeparatedBills.split(",").map(s => s.trim());
      filtered = filtered.filter(b => billNos.includes(b.documentNo));
    }

    return filtered;
  }, [outstandingData, outstandingBranch, customer, commaSeparatedBills]);

  // Totals for Outstanding Tab
  const outstandingTotals = filteredOutstanding.reduce(
    (acc, bill) => ({
      amount: acc.amount + bill.amount,
      receivedAmt: acc.receivedAmt + bill.receivedAmount,
      balanceAmt: acc.balanceAmt + bill.balance,
    }),
    { amount: 0, receivedAmt: 0, balanceAmt: 0 }
  );

  const totalReceivable = outstandingTotals.balanceAmt * (1 - tdsDeductionPercent / 100);

  // ========== Handlers - Outstanding Tab ==========
  const handleShowOutstanding = () => {
    alert(`Found ${filteredOutstanding.length} outstanding bills`);
  };

  const handleClearOutstanding = () => {
    setOutstandingBranch("");
    setAsOnDate(new Date().toISOString().split("T")[0]);
    setOsAgainst("BILL");
    setCustomer("");
    setFileName("");
    setCommaSeparatedBills("");
    setSelectedBills([]);
    setTdsDeductionPercent(0);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBills(filteredOutstanding.map(b => b.id));
    } else {
      setSelectedBills([]);
    }
  };

  const handleSelectBill = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedBills([...selectedBills, id]);
    } else {
      setSelectedBills(selectedBills.filter(b => b !== id));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      alert(`File "${file.name}" selected. Excel import would happen here.`);
    }
  };

  const handleProceed = () => {
    if (selectedBills.length === 0) {
      alert("Please select at least one bill to proceed");
      return;
    }
    const selected = outstandingData.filter(b => selectedBills.includes(b.id));
    setSelectedOutstandingBills(selected);
    
    // Create receipt bills from selected outstanding
    const newReceiptBills: ReceiptBill[] = selected.map(bill => ({
      id: generateId(),
      documentType: bill.documentType,
      documentNo: bill.documentNo,
      documentDate: bill.documentDate,
      documentAmount: bill.amount,
      consignor: bill.consignor,
      consignee: bill.consignee,
      balance: bill.balance,
      receivedAmount: 0,
      tds: 0,
      deduction: 0,
      deductionLedger: "",
      claim: "",
      serviceTax: 0,
      bankCharges: 0,
      excess: 0,
      pending: bill.balance,
      remarks: "",
    }));
    setReceiptBills(newReceiptBills);
    
    const total = selected.reduce((sum, b) => sum + b.balance, 0);
    setGrossAmount(total);
    alert(`Proceeding with ${selected.length} bill(s). Total balance: ₹${total.toLocaleString()}`);
  };

  // ========== Entry Tab Handlers ==========
  const updateReceiptBill = (id: string, field: keyof ReceiptBill, value: any) => {
    setReceiptBills(prev =>
      prev.map(bill => {
        if (bill.id === id) {
          const updated = { ...bill, [field]: value };
          if (field === "receivedAmount" || field === "tds" || field === "deduction" || field === "serviceTax" || field === "bankCharges") {
            const receivedAmount = updated.receivedAmount || 0;
            const tdsAmt = updated.tds || 0;
            const deductionAmt = updated.deduction || 0;
            const serviceTaxAmt = updated.serviceTax || 0;
            const bankChargesAmt = updated.bankCharges || 0;
            const totalDeductions = tdsAmt + deductionAmt + serviceTaxAmt + bankChargesAmt;
            const netReceived = receivedAmount - totalDeductions;
            updated.pending = updated.balance - netReceived;
            updated.excess = netReceived > updated.balance ? netReceived - updated.balance : 0;
          }
          return updated;
        }
        return bill;
      })
    );
  };

  const addMoreBill = () => {
    const newBill: ReceiptBill = {
      id: generateId(),
      documentType: "",
      documentNo: "",
      documentDate: "",
      documentAmount: 0,
      consignor: "",
      consignee: "",
      balance: 0,
      receivedAmount: 0,
      tds: 0,
      deduction: 0,
      deductionLedger: "",
      claim: "",
      serviceTax: 0,
      bankCharges: 0,
      excess: 0,
      pending: 0,
      remarks: "",
    };
    setReceiptBills([...receiptBills, newBill]);
  };

  const deleteReceiptBill = (id: string) => {
    setReceiptBills(prev => prev.filter(b => b.id !== id));
  };

  // Calculate totals for entry tab
  const entryTotals = receiptBills.reduce(
    (acc, bill) => ({
      documentAmount: acc.documentAmount + (bill.documentAmount || 0),
      receivedAmount: acc.receivedAmount + (bill.receivedAmount || 0),
      tds: acc.tds + (bill.tds || 0),
      deduction: acc.deduction + (bill.deduction || 0),
      serviceTax: acc.serviceTax + (bill.serviceTax || 0),
      bankCharges: acc.bankCharges + (bill.bankCharges || 0),
      pending: acc.pending + (bill.pending || 0),
    }),
    { documentAmount: 0, receivedAmount: 0, tds: 0, deduction: 0, serviceTax: 0, bankCharges: 0, pending: 0 }
  );

  const handleSave = () => {
    if (!entryBranch) {
      alert("Branch is required");
      return;
    }
    if (!mrAgainst) {
      alert("MR Against is required");
      return;
    }
    if (!paymentMode) {
      alert("Payment Mode is required");
      return;
    }
    if (!debitLedger) {
      alert("Debit Ledger is required");
      return;
    }

    const newMoneyReceipt: MoneyReceipt = {
      id: generateId(),
      mrNo: mrNo || `MR-${String(savedMoneyReceipts.length + 1).padStart(3, '0')}`,
      mrDate: mrDate,
      branch: entryBranch,
      branchMRNo: `${entryBranch}-${mrNo || "NEW"}`,
      mode: paymentMode,
      voucherNo: `VCH-${Date.now()}`,
      amount: chequeDepositAmount,
      debitLedger: debitLedger,
      creditLedger: entryCustomer,
      customer: entryCustomer,
      onAccountAmount: chequeDepositAmount,
      instrumentNo: instrumentNo,
      instrumentDate: instrumentDate,
      chequeDepositAmount: chequeDepositAmount,
      counterCollection: counterCollection,
      drawnOn: drawnOn,
      tdsDeductionPercent: tdsDeductionPercent,
      totalReceivable: totalReceivable,
      bills: receiptBills,
    };

    setSavedMoneyReceipts([...savedMoneyReceipts, newMoneyReceipt]);
    alert(`Money Receipt saved successfully!\nMR No: ${newMoneyReceipt.mrNo}\nAmount: ₹${chequeDepositAmount.toLocaleString()}`);
    handleClearEntry();
  };

  const handleClearEntry = () => {
    setEntryBranch("");
    setOnAccountMR("");
    setMrDate(new Date().toISOString().split("T")[0]);
    setMrNo("");
    setMrAgainst("");
    setEntryCustomer("");
    setDepartment("");
    setConsignor("");
    setConsignee("");
    setPaymentMode("BANK");
    setInstrumentType("");
    setInstrumentNo("");
    setInstrumentDate(new Date().toISOString().split("T")[0]);
    setChequeDepositAmount(0);
    setCounterCollection("");
    setDrawnOn("");
    setDebitLedger("");
    setSelectedOutstandingBills([]);
    setReceiptBills([]);
  };

  const handleCancel = () => {
    if (confirm("Cancel all changes? Data will be lost.")) {
      handleClearEntry();
    }
  };

  // ========== Search Tab Handlers ==========
  const handleShowMoneyReceipt = () => {
    alert(`Found ${filteredMoneyReceipts.length} money receipts`);
  };

  const handleClearSearch = () => {
    setSearchBranch("ALL");
    setFromDate(new Date().toISOString().split("T")[0]);
    setToDate(new Date().toISOString().split("T")[0]);
    setSearchMrNo("");
  };

  const filteredMoneyReceipts = useMemo(() => {
    let filtered = savedMoneyReceipts;

    if (searchBranch && searchBranch !== "ALL") {
      filtered = filtered.filter(r => r.branch === searchBranch);
    }
    if (fromDate) {
      filtered = filtered.filter(r => r.mrDate >= fromDate);
    }
    if (toDate) {
      filtered = filtered.filter(r => r.mrDate <= toDate);
    }
    if (searchMrNo) {
      filtered = filtered.filter(r => r.mrNo.toLowerCase().includes(searchMrNo.toLowerCase()));
    }

    return filtered;
  }, [savedMoneyReceipts, searchBranch, fromDate, toDate, searchMrNo]);

  const handleViewDetails = (receipt: MoneyReceipt) => {
    setSelectedReceipt(receipt);
    setViewDialogOpen(true);
  };

  return (
    <div className="space-y-6 p-3 sm:p-4 md:p-6 max-w-full overflow-x-hidden">
      <h1 className="text-xl sm:text-2xl font-bold text-primary">Money Receipt</h1>

      <Tabs defaultValue="outstanding" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="outstanding">Outstanding</TabsTrigger>
          <TabsTrigger value="entry">Entry</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
        </TabsList>

        {/* ==================== OUTSTANDING TAB ==================== */}
        <TabsContent value="outstanding" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Outstanding Bills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label>Branch <span className="text-red-500">*</span></Label>
                  <Select value={outstandingBranch} onValueChange={setOutstandingBranch}>
                    <SelectTrigger><SelectValue placeholder="Select Branch" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">ALL</SelectItem>
                      {branches.filter(b => b !== "ALL").map(b => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>As On Date <span className="text-red-500">*</span></Label>
                  <Input type="date" value={asOnDate} onChange={(e) => setAsOnDate(e.target.value)} />
                </div>
                <div>
                  <Label>O/S Against <span className="text-red-500">*</span></Label>
                  <Select value={osAgainst} onValueChange={setOsAgainst}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BILL">BILL</SelectItem>
                      <SelectItem value="INVOICE">INVOICE</SelectItem>
                      <SelectItem value="ALL">ALL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Customer</Label>
                  <Select value={customer} onValueChange={setCustomer}>
                    <SelectTrigger><SelectValue placeholder="Select Customer" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">ALL</SelectItem>
                      {customers.filter(c => c !== "ALL").map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-2">
                  <Label>Select Bill From Excel</Label>
                  <div className="flex gap-2 mt-1">
                    <Button variant="outline" onClick={() => document.getElementById("excelUpload")?.click()}>
                      <Upload className="mr-2 h-4 w-4" /> Choose File
                    </Button>
                    <input id="excelUpload" type="file" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} className="hidden" />
                    <span className="text-sm text-muted-foreground">{fileName || "No file chosen"}</span>
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4 mr-1" /> View Excel Format
                    </Button>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <Label>Please enter comma separated bill</Label>
                  <Input 
                    value={commaSeparatedBills} 
                    onChange={(e) => setCommaSeparatedBills(e.target.value)} 
                    placeholder="e.g., INV-001, INV-002, BIL-003"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                <Button onClick={handleShowOutstanding} className="bg-blue-600 hover:bg-blue-700">
                  <Search className="mr-2 h-4 w-4" /> Show Outstanding
                </Button>
                <Button onClick={handleClearOutstanding} variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" /> Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Outstanding Table */}
          <Card>
            <CardContent className="overflow-x-auto p-0 sm:p-4">
              <div className="min-w-[1000px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedBills.length === filteredOutstanding.length && filteredOutstanding.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>S#</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Document Type</TableHead>
                      <TableHead>Document #</TableHead>
                      <TableHead>Document Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Received Amount</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead>Voucher#</TableHead>
                      <TableHead>Consignor</TableHead>
                      <TableHead>Consignee</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOutstanding.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={13} className="text-center py-8 text-muted-foreground">
                          No outstanding bills found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOutstanding.map((bill, idx) => (
                        <TableRow key={bill.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedBills.includes(bill.id)}
                              onCheckedChange={(checked) => handleSelectBill(bill.id, !!checked)}
                            />
                          </TableCell>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>{bill.customer}</TableCell>
                          <TableCell>{bill.branch}</TableCell>
                          <TableCell>{bill.documentType}</TableCell>
                          <TableCell>{bill.documentNo}</TableCell>
                          <TableCell>{bill.documentDate}</TableCell>
                          <TableCell className="text-right">₹ {bill.amount.toLocaleString()}</TableCell>
                          <TableCell className="text-right">₹ {bill.receivedAmount.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-semibold">₹ {bill.balance.toLocaleString()}</TableCell>
                          <TableCell>{bill.voucherNo}</TableCell>
                          <TableCell>{bill.consignor}</TableCell>
                          <TableCell>{bill.consignee}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Totals Row */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm font-semibold">
                <div>Total Amount: <span className="text-blue-600">₹ {outstandingTotals.amount.toLocaleString()}</span></div>
                <div>Received Amt: <span className="text-green-600">₹ {outstandingTotals.receivedAmt.toLocaleString()}</span></div>
                <div>Balance Amt: <span className="text-orange-600">₹ {outstandingTotals.balanceAmt.toLocaleString()}</span></div>
                <div className="flex gap-2 items-center">
                  TDS Deduction %: 
                  <Input type="number" value={tdsDeductionPercent} onChange={(e) => setTdsDeductionPercent(Number(e.target.value))} className="w-20" />
                </div>
              </div>
              <div className="mt-3 text-lg font-bold">
                Total Receivable: <span className="text-purple-600">₹ {totalReceivable.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-end">
            <Button onClick={handleProceed} className="bg-green-600 hover:bg-green-700">
              Proceed
            </Button>
            <Button onClick={handleClearOutstanding} variant="outline">
              Clear
            </Button>
          </div>
        </TabsContent>

        {/* ==================== ENTRY TAB ==================== */}
        <TabsContent value="entry" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Money Receipt Entry</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label>Branch <span className="text-red-500">*</span></Label>
                  <Select value={entryBranch} onValueChange={setEntryBranch}>
                    <SelectTrigger><SelectValue placeholder="Select Branch" /></SelectTrigger>
                    <SelectContent>
                      {branches.filter(b => b !== "ALL").map(b => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>On A/c MR Against</Label>
                  <Select value={onAccountMR} onValueChange={setOnAccountMR}>
                    <SelectTrigger><SelectValue placeholder="--select--" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BILL">BILL</SelectItem>
                      <SelectItem value="INVOICE">INVOICE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date <span className="text-red-500">*</span></Label>
                  <Input type="date" value={mrDate} onChange={(e) => setMrDate(e.target.value)} />
                </div>
                <div>
                  <Label>MR #</Label>
                  <Input value={mrNo} onChange={(e) => setMrNo(e.target.value)} placeholder="Auto" />
                </div>
                <div>
                  <Label>MR Against <span className="text-red-500">*</span></Label>
                  <Select value={mrAgainst} onValueChange={setMrAgainst}>
                    <SelectTrigger><SelectValue placeholder="SELECT" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CUSTOMER">CUSTOMER</SelectItem>
                      <SelectItem value="CONSIGNOR">CONSIGNOR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Customer</Label>
                  <Select value={entryCustomer} onValueChange={setEntryCustomer}>
                    <SelectTrigger><SelectValue placeholder="Select Customer" /></SelectTrigger>
                    <SelectContent>
                      {customers.filter(c => c !== "ALL").map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Department</Label>
                  <Input value={department} onChange={(e) => setDepartment(e.target.value)} />
                </div>
                <div>
                  <Label>Consignor</Label>
                  <Input value={consignor} onChange={(e) => setConsignor(e.target.value)} />
                </div>
                <div>
                  <Label>Consignee</Label>
                  <Input value={consignee} onChange={(e) => setConsignee(e.target.value)} />
                </div>
                <div>
                  <Label>Payment Mode <span className="text-red-500">*</span></Label>
                  <Select value={paymentMode} onValueChange={setPaymentMode}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {paymentModes.map(m => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Instrument Type</Label>
                  <Select value={instrumentType} onValueChange={setInstrumentType}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {instrumentTypes.map(i => (
                        <SelectItem key={i} value={i}>{i}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Instrument #</Label>
                  <Input value={instrumentNo} onChange={(e) => setInstrumentNo(e.target.value)} />
                </div>
                <div>
                  <Label>Instrument Date</Label>
                  <Input type="date" value={instrumentDate} onChange={(e) => setInstrumentDate(e.target.value)} />
                </div>
                <div>
                  <Label>Cheque/Deposite Amount <span className="text-red-500">*</span></Label>
                  <Input type="number" value={chequeDepositAmount} onChange={(e) => setChequeDepositAmount(Number(e.target.value))} />
                </div>
                <div>
                  <Label>Counter Collection <span className="text-red-500">*</span></Label>
                  <Select value={counterCollection} onValueChange={setCounterCollection}>
                    <SelectTrigger><SelectValue placeholder="select" /></SelectTrigger>
                    <SelectContent>
                      {counterCollections.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Drawn On</Label>
                  <Input value={drawnOn} onChange={(e) => setDrawnOn(e.target.value)} />
                </div>
                <div>
                  <Label>Debit Ledger <span className="text-red-500">*</span></Label>
                  <Input value={debitLedger} onChange={(e) => setDebitLedger(e.target.value)} />
                </div>
                <div>
                  <Label>Gross Amount</Label>
                  <Input type="number" value={grossAmount} readOnly className="bg-muted font-semibold" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add More Bill Button */}
          <div className="flex justify-end">
            <Button onClick={addMoreBill} variant="outline">
              <Plus className="mr-2 h-4 w-4" /> Add More Bill
            </Button>
          </div>

          {/* Receipt Bills Table */}
          <Card>
            <CardHeader>
              <CardTitle>Bill Details</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <div className="min-w-[1400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>S#</TableHead>
                      <TableHead>Document Type</TableHead>
                      <TableHead>Document#</TableHead>
                      <TableHead>Document Date</TableHead>
                      <TableHead>Document Amount</TableHead>
                      <TableHead>Consignor</TableHead>
                      <TableHead>Consignee</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Received Amount</TableHead>
                      <TableHead>TDS</TableHead>
                      <TableHead>Deduction</TableHead>
                      <TableHead>Deduction Ledger</TableHead>
                      <TableHead>Claim</TableHead>
                      <TableHead>Service Tax</TableHead>
                      <TableHead>Bank Charges</TableHead>
                      <TableHead>Excess</TableHead>
                      <TableHead>Pending</TableHead>
                      <TableHead>Remarks</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {receiptBills.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={19} className="text-center py-8 text-muted-foreground">
                          No bills added. Please proceed from Outstanding tab or click Add More Bill.
                        </TableCell>
                      </TableRow>
                    ) : (
                      receiptBills.map((bill, idx) => (
                        <TableRow key={bill.id}>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>
                            <Select value={bill.documentType} onValueChange={(v) => updateReceiptBill(bill.id, "documentType", v)}>
                              <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {documentTypes.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell><Input value={bill.documentNo} onChange={(e) => updateReceiptBill(bill.id, "documentNo", e.target.value)} className="w-28" /></TableCell>
                          <TableCell><Input type="date" value={bill.documentDate} onChange={(e) => updateReceiptBill(bill.id, "documentDate", e.target.value)} className="w-32" /></TableCell>
                          <TableCell className="text-right">₹ {bill.documentAmount.toLocaleString()}</TableCell>
                          <TableCell><Input value={bill.consignor} onChange={(e) => updateReceiptBill(bill.id, "consignor", e.target.value)} className="w-28" /></TableCell>
                          <TableCell><Input value={bill.consignee} onChange={(e) => updateReceiptBill(bill.id, "consignee", e.target.value)} className="w-28" /></TableCell>
                          <TableCell className="text-right">₹ {bill.balance.toLocaleString()}</TableCell>
                          <TableCell><Input type="number" value={bill.receivedAmount} onChange={(e) => updateReceiptBill(bill.id, "receivedAmount", Number(e.target.value))} className="w-28 text-right" /></TableCell>
                          <TableCell><Input type="number" value={bill.tds} onChange={(e) => updateReceiptBill(bill.id, "tds", Number(e.target.value))} className="w-24 text-right" /></TableCell>
                          <TableCell><Input type="number" value={bill.deduction} onChange={(e) => updateReceiptBill(bill.id, "deduction", Number(e.target.value))} className="w-24 text-right" /></TableCell>
                          <TableCell><Input value={bill.deductionLedger} onChange={(e) => updateReceiptBill(bill.id, "deductionLedger", e.target.value)} className="w-28" /></TableCell>
                          <TableCell><Input value={bill.claim} onChange={(e) => updateReceiptBill(bill.id, "claim", e.target.value)} className="w-24" /></TableCell>
                          <TableCell><Input type="number" value={bill.serviceTax} onChange={(e) => updateReceiptBill(bill.id, "serviceTax", Number(e.target.value))} className="w-24 text-right" /></TableCell>
                          <TableCell><Input type="number" value={bill.bankCharges} onChange={(e) => updateReceiptBill(bill.id, "bankCharges", Number(e.target.value))} className="w-24 text-right" /></TableCell>
                          <TableCell className="text-right">₹ {bill.excess.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-semibold">₹ {bill.pending.toLocaleString()}</TableCell>
                          <TableCell><Input value={bill.remarks} onChange={(e) => updateReceiptBill(bill.id, "remarks", e.target.value)} className="w-32" /></TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => deleteReceiptBill(bill.id)}>
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

          {/* Entry Totals */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 text-sm font-semibold">
                <div>Doc Amount: <span className="text-blue-600">₹ {entryTotals.documentAmount.toLocaleString()}</span></div>
                <div>Received: <span className="text-green-600">₹ {entryTotals.receivedAmount.toLocaleString()}</span></div>
                <div>TDS: <span className="text-red-600">₹ {entryTotals.tds.toLocaleString()}</span></div>
                <div>Deduction: <span className="text-orange-600">₹ {entryTotals.deduction.toLocaleString()}</span></div>
                <div>Service Tax: <span className="text-purple-600">₹ {entryTotals.serviceTax.toLocaleString()}</span></div>
                <div>Bank Charges: <span className="text-pink-600">₹ {entryTotals.bankCharges.toLocaleString()}</span></div>
                <div>Pending: <span className="text-red-500">₹ {entryTotals.pending.toLocaleString()}</span></div>
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
          </div>
        </TabsContent>

        {/* ==================== SEARCH TAB ==================== */}
        <TabsContent value="search" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Search Money Receipts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label>Branch Name</Label>
                  <Select value={searchBranch} onValueChange={setSearchBranch}>
                    <SelectTrigger><SelectValue placeholder="ALL" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">ALL</SelectItem>
                      {branches.filter(b => b !== "ALL").map(b => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>From Date</Label>
                  <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                </div>
                <div>
                  <Label>To Date</Label>
                  <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                </div>
                <div>
                  <Label>MR No.</Label>
                  <Input value={searchMrNo} onChange={(e) => setSearchMrNo(e.target.value)} placeholder="Search MR #" />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                <Button onClick={handleShowMoneyReceipt} className="bg-blue-600 hover:bg-blue-700">
                  <Search className="mr-2 h-4 w-4" /> Show Money Receipt
                </Button>
                <Button onClick={handleClearSearch} variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" /> Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Search Results Table */}
          <Card>
            <CardHeader>
              <CardTitle>Money Receipt List</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <div className="min-w-[1000px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>S#</TableHead>
                      <TableHead>MR#</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Branch MR#</TableHead>
                      <TableHead>Mode</TableHead>
                      <TableHead>Voucher #</TableHead>
                      <TableHead>Filter</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Debit Ledger</TableHead>
                      <TableHead>Credit Ledger</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Filter</TableHead>
                      <TableHead className="text-right">On A/c Amount</TableHead>
                      <TableHead>Instrument #</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMoneyReceipts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={16} className="text-center py-8 text-muted-foreground">
                          No money receipts found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMoneyReceipts.map((receipt, idx) => (
                        <TableRow key={receipt.id}>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell className="font-medium">{receipt.mrNo}</TableCell>
                          <TableCell>{receipt.mrDate}</TableCell>
                          <TableCell>{receipt.branch}</TableCell>
                          <TableCell>{receipt.branchMRNo}</TableCell>
                          <TableCell>{receipt.mode}</TableCell>
                          <TableCell>{receipt.voucherNo}</TableCell>
                          <TableCell>-</TableCell>
                          <TableCell className="text-right">₹ {receipt.amount.toLocaleString()}</TableCell>
                          <TableCell>{receipt.debitLedger}</TableCell>
                          <TableCell>{receipt.creditLedger}</TableCell>
                          <TableCell>{receipt.customer}</TableCell>
                          <TableCell>-</TableCell>
                          <TableCell className="text-right">₹ {receipt.onAccountAmount.toLocaleString()}</TableCell>
                          <TableCell>{receipt.instrumentNo || "-"}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => handleViewDetails(receipt)}>
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
          {filteredMoneyReceipts.length > 0 && (
            <div className="text-sm text-muted-foreground border-t pt-3 flex justify-between">
              <span>Total Records: {filteredMoneyReceipts.length}</span>
              <span>
                Total Amount: ₹ {filteredMoneyReceipts.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
              </span>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Money Receipt Details</DialogTitle>
          </DialogHeader>
          {selectedReceipt && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>MR No.</Label><p className="font-medium">{selectedReceipt.mrNo}</p></div>
                <div><Label>MR Date</Label><p className="font-medium">{selectedReceipt.mrDate}</p></div>
                <div><Label>Branch</Label><p className="font-medium">{selectedReceipt.branch}</p></div>
                <div><Label>Branch MR#</Label><p className="font-medium">{selectedReceipt.branchMRNo}</p></div>
                <div><Label>Mode</Label><p className="font-medium">{selectedReceipt.mode}</p></div>
                <div><Label>Voucher #</Label><p className="font-medium">{selectedReceipt.voucherNo}</p></div>
                <div><Label>Amount</Label><p className="font-medium text-blue-600">₹ {selectedReceipt.amount.toLocaleString()}</p></div>
                <div><Label>Debit Ledger</Label><p className="font-medium">{selectedReceipt.debitLedger}</p></div>
                <div><Label>Credit Ledger</Label><p className="font-medium">{selectedReceipt.creditLedger}</p></div>
                <div><Label>Customer</Label><p className="font-medium">{selectedReceipt.customer}</p></div>
                <div><Label>On A/c Amount</Label><p className="font-medium">₹ {selectedReceipt.onAccountAmount.toLocaleString()}</p></div>
                <div><Label>Instrument #</Label><p className="font-medium">{selectedReceipt.instrumentNo || "-"}</p></div>
                <div><Label>Instrument Date</Label><p className="font-medium">{selectedReceipt.instrumentDate || "-"}</p></div>
                <div><Label>Cheque/Deposit Amount</Label><p className="font-medium">₹ {selectedReceipt.chequeDepositAmount.toLocaleString()}</p></div>
                <div><Label>Counter Collection</Label><p className="font-medium">{selectedReceipt.counterCollection || "-"}</p></div>
                <div><Label>Drawn On</Label><p className="font-medium">{selectedReceipt.drawnOn || "-"}</p></div>
              </div>
              {selectedReceipt.bills.length > 0 && (
                <>
                  <div className="font-semibold mt-4">Associated Bills:</div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Doc #</TableHead>
                        <TableHead>Doc Type</TableHead>
                        <TableHead>Doc Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Received</TableHead>
                        <TableHead className="text-right">Pending</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedReceipt.bills.map((bill, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{bill.documentNo}</TableCell>
                          <TableCell>{bill.documentType}</TableCell>
                          <TableCell>{bill.documentDate}</TableCell>
                          <TableCell className="text-right">₹ {bill.documentAmount.toLocaleString()}</TableCell>
                          <TableCell className="text-right">₹ {bill.receivedAmount.toLocaleString()}</TableCell>
                          <TableCell className="text-right">₹ {bill.pending.toLocaleString()}</TableCell>
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