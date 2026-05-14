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
import { RefreshCw, X, Eye, Search, Settings, Undo2 } from "lucide-react";

// ==================== Types ====================
interface MoneyReceipt {
  id: string;
  customer: string;
  mrNo: string;
  mrDate: string;
  chequeNo: string;
  chequeDate: string;
  drawnOn: string;
  mrAmount: number;
  branch: string;
  mrAgainst: string;
  depositedIn: string;
  mrVoucherNo: string;
  documentType: string;
  documentNo: string;
  documentAmount: number;
  receivedAmount: number;
}

interface ReverseMRRecord {
  id: string;
  reverseId: string;
  date: string;
  branch: string;
  chequeNo: string;
  chequeDate: string;
  drawnOn: string;
  chequeAmount: number;
  mrNo: string;
  mrDate: string;
  mrAgainst: string;
  customer: string;
  depositedIn: string;
  mrVoucherNo: string;
  reason: string;
  remarks: string;
  documentType: string;
  documentNo: string;
  documentAmount: number;
  receivedAmount: number;
}

// Column Settings Types
interface SelectMoneyReceiptColumnSettings {
  customer: boolean;
  mrNo: boolean;
  mrDate: boolean;
  chequeNo: boolean;
  chequeDate: boolean;
  drawnOn: boolean;
  mrAmount: boolean;
}

interface SearchColumnSettings {
  reverseId: boolean;
  branch: boolean;
  date: boolean;
  mrNo: boolean;
  mrDate: boolean;
  chequeNo: boolean;
  drawnOn: boolean;
  customer: boolean;
  amount: boolean;
}

interface SelectColumnOption {
  key: keyof SelectMoneyReceiptColumnSettings;
  label: string;
}

interface SearchColumnOption {
  key: keyof SearchColumnSettings;
  label: string;
}

// Helper
const generateId = (): string => Math.random().toString(36).substr(2, 9);

// Mock Money Receipt Data
const mockMoneyReceipts: MoneyReceipt[] = [
  {
    id: "1",
    customer: "ABC Transport",
    mrNo: "MR-001",
    mrDate: "2026-05-14",
    chequeNo: "CHK-123456",
    chequeDate: "2026-05-14",
    drawnOn: "SBI Bank",
    mrAmount: 50000,
    branch: "Mumbai HO",
    mrAgainst: "Customer",
    depositedIn: "SBI Current Account",
    mrVoucherNo: "VCH-001",
    documentType: "Invoice",
    documentNo: "INV-001",
    documentAmount: 50000,
    receivedAmount: 50000,
  },
  {
    id: "2",
    customer: "XYZ Logistics",
    mrNo: "MR-002",
    mrDate: "2026-05-14",
    chequeNo: "CHK-789012",
    chequeDate: "2026-05-14",
    drawnOn: "HDFC Bank",
    mrAmount: 35000,
    branch: "Delhi Branch",
    mrAgainst: "Customer",
    depositedIn: "HDFC Current Account",
    mrVoucherNo: "VCH-002",
    documentType: "Bill",
    documentNo: "BIL-002",
    documentAmount: 35000,
    receivedAmount: 35000,
  },
  {
    id: "3",
    customer: "PQR Carriers",
    mrNo: "MR-003",
    mrDate: "2026-05-13",
    chequeNo: "CHK-345678",
    chequeDate: "2026-05-13",
    drawnOn: "ICICI Bank",
    mrAmount: 25000,
    branch: "Chennai Branch",
    mrAgainst: "Customer",
    depositedIn: "ICICI Current Account",
    mrVoucherNo: "VCH-003",
    documentType: "Invoice",
    documentNo: "INV-003",
    documentAmount: 25000,
    receivedAmount: 25000,
  },
];

// Mock Reverse MR Data for Search Tab
const mockReverseMRs: ReverseMRRecord[] = [
  {
    id: "rev1",
    reverseId: "REV-001",
    date: "2026-05-14",
    branch: "Mumbai HO",
    chequeNo: "CHK-123456",
    chequeDate: "2026-05-14",
    drawnOn: "SBI Bank",
    chequeAmount: 50000,
    mrNo: "MR-001",
    mrDate: "2026-05-14",
    mrAgainst: "Customer",
    customer: "ABC Transport",
    depositedIn: "SBI Current Account",
    mrVoucherNo: "VCH-001",
    reason: "Cheque bounce",
    remarks: "Customer requested reversal",
    documentType: "Invoice",
    documentNo: "INV-001",
    documentAmount: 50000,
    receivedAmount: 50000,
  },
  {
    id: "rev2",
    reverseId: "REV-002",
    date: "2026-05-14",
    branch: "Delhi Branch",
    chequeNo: "CHK-789012",
    chequeDate: "2026-05-14",
    drawnOn: "HDFC Bank",
    chequeAmount: 35000,
    mrNo: "MR-002",
    mrDate: "2026-05-14",
    mrAgainst: "Customer",
    customer: "XYZ Logistics",
    depositedIn: "HDFC Current Account",
    mrVoucherNo: "VCH-002",
    reason: "Wrong entry",
    remarks: "Amount entered incorrectly",
    documentType: "Bill",
    documentNo: "BIL-002",
    documentAmount: 35000,
    receivedAmount: 35000,
  },
];

// Mock Data for Dropdowns
const branches: string[] = ["Select Branch", "Mumbai HO", "Delhi Branch", "Chennai Branch", "Kolkata Branch", "Bangalore Branch"];
const customers: string[] = ["Select Customer", "ABC Transport", "XYZ Logistics", "PQR Carriers", "LMN Freight"];
const reasons: string[] = ["Select Reason", "Cheque Bounce", "Wrong Entry", "Customer Request", "Duplicate Entry", "Amount Mismatch"];

// Column settings options
const selectColumnOptions: SelectColumnOption[] = [
  { key: "customer", label: "Customer" },
  { key: "mrNo", label: "MR #" },
  { key: "mrDate", label: "MR Date" },
  { key: "chequeNo", label: "Cheque #" },
  { key: "chequeDate", label: "Cheque Date" },
  { key: "drawnOn", label: "Drawn ON" },
  { key: "mrAmount", label: "MR Amount" },
];

const searchColumnOptions: SearchColumnOption[] = [
  { key: "reverseId", label: "Reverse Id" },
  { key: "branch", label: "Branch" },
  { key: "date", label: "Date" },
  { key: "mrNo", label: "MR#" },
  { key: "mrDate", label: "MR Date" },
  { key: "chequeNo", label: "Cheque #" },
  { key: "drawnOn", label: "Drawn On" },
  { key: "customer", label: "Customer" },
  { key: "amount", label: "Amount" },
];

export default function ReverseMR() {
  // ========== Select Money Receipt Tab State ==========
  const [selectBranch, setSelectBranch] = useState<string>("");
  const [fromPeriod, setFromPeriod] = useState<string>(new Date().toISOString().split("T")[0]);
  const [toPeriod, setToPeriod] = useState<string>(new Date().toISOString().split("T")[0]);
  const [selectCustomer, setSelectCustomer] = useState<string>("");
  const [moneyReceipts] = useState<MoneyReceipt[]>(mockMoneyReceipts);
  const [selectedReceipt, setSelectedReceipt] = useState<MoneyReceipt | null>(null);
  const [selectColumnSettings, setSelectColumnSettings] = useState<SelectMoneyReceiptColumnSettings>({
    customer: true,
    mrNo: true,
    mrDate: true,
    chequeNo: true,
    chequeDate: true,
    drawnOn: true,
    mrAmount: true,
  });

  // ========== Entry Tab State ==========
  const [reverseId, setReverseId] = useState<string>("");
  const [reverseDate, setReverseDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [reverseBranch, setReverseBranch] = useState<string>("");
  const [chequeNo, setChequeNo] = useState<string>("");
  const [chequeDate, setChequeDate] = useState<string>("");
  const [drawnOn, setDrawnOn] = useState<string>("");
  const [chequeAmount, setChequeAmount] = useState<number>(0);
  const [mrNo, setMrNo] = useState<string>("");
  const [mrDate, setMrDate] = useState<string>("");
  const [mrAgainst, setMrAgainst] = useState<string>("");
  const [customer, setCustomer] = useState<string>("");
  const [depositedIn, setDepositedIn] = useState<string>("");
  const [mrVoucherNo, setMrVoucherNo] = useState<string>("");
  const [documentType, setDocumentType] = useState<string>("");
  const [documentNo, setDocumentNo] = useState<string>("");
  const [documentAmount, setDocumentAmount] = useState<number>(0);
  const [receivedAmount, setReceivedAmount] = useState<number>(0);
  const [reason, setReason] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  const [savedReverseMRs, setSavedReverseMRs] = useState<ReverseMRRecord[]>(mockReverseMRs);

  // ========== Search Tab State ==========
  const [searchFromDate, setSearchFromDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [searchToDate, setSearchToDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [searchColumnSettings, setSearchColumnSettings] = useState<SearchColumnSettings>({
    reverseId: true,
    branch: true,
    date: true,
    mrNo: true,
    mrDate: true,
    chequeNo: true,
    drawnOn: true,
    customer: true,
    amount: true,
  });
  const [viewDialogOpen, setViewDialogOpen] = useState<boolean>(false);
  const [selectedReverseMR, setSelectedReverseMR] = useState<ReverseMRRecord | null>(null);

  // ========== Filtered Money Receipts ==========
  const filteredMoneyReceipts = useMemo((): MoneyReceipt[] => {
    let filtered = moneyReceipts;

    if (selectBranch) {
      filtered = filtered.filter(m => m.branch === selectBranch);
    }
    if (fromPeriod) {
      filtered = filtered.filter(m => m.mrDate >= fromPeriod);
    }
    if (toPeriod) {
      filtered = filtered.filter(m => m.mrDate <= toPeriod);
    }
    if (selectCustomer) {
      filtered = filtered.filter(m => m.customer === selectCustomer);
    }

    return filtered;
  }, [moneyReceipts, selectBranch, fromPeriod, toPeriod, selectCustomer]);

  // ========== Filtered Reverse MRs for Search Tab ==========
  const filteredReverseMRs = useMemo((): ReverseMRRecord[] => {
    let filtered = savedReverseMRs;

    if (searchFromDate) {
      filtered = filtered.filter(r => r.date >= searchFromDate);
    }
    if (searchToDate) {
      filtered = filtered.filter(r => r.date <= searchToDate);
    }

    return filtered;
  }, [savedReverseMRs, searchFromDate, searchToDate]);

  // ========== Select Money Receipt Tab Handlers ==========
  const handleShowMoneyReceipt = (): void => {
    alert(`Found ${filteredMoneyReceipts.length} money receipts`);
  };

  const handleClearSelect = (): void => {
    setSelectBranch("");
    setFromPeriod(new Date().toISOString().split("T")[0]);
    setToPeriod(new Date().toISOString().split("T")[0]);
    setSelectCustomer("");
    setSelectedReceipt(null);
  };

  const toggleSelectColumn = (key: keyof SelectMoneyReceiptColumnSettings): void => {
    setSelectColumnSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectReceipt = (receipt: MoneyReceipt): void => {
    setSelectedReceipt(receipt);
    // Populate Entry tab fields
    setReverseId(`REV-${String(savedReverseMRs.length + 1).padStart(3, "0")}`);
    setReverseDate(new Date().toISOString().split("T")[0]);
    setReverseBranch(receipt.branch);
    setChequeNo(receipt.chequeNo);
    setChequeDate(receipt.chequeDate);
    setDrawnOn(receipt.drawnOn);
    setChequeAmount(receipt.mrAmount);
    setMrNo(receipt.mrNo);
    setMrDate(receipt.mrDate);
    setMrAgainst(receipt.mrAgainst);
    setCustomer(receipt.customer);
    setDepositedIn(receipt.depositedIn);
    setMrVoucherNo(receipt.mrVoucherNo);
    setDocumentType(receipt.documentType);
    setDocumentNo(receipt.documentNo);
    setDocumentAmount(receipt.documentAmount);
    setReceivedAmount(receipt.receivedAmount);
    
    alert(`Selected MR: ${receipt.mrNo} for reversal`);
  };

  // ========== Entry Tab Handlers ==========
  const handleReverseMR = (): void => {
    if (!reverseBranch) {
      alert("Branch is required");
      return;
    }
    if (!chequeNo) {
      alert("Cheque # is required");
      return;
    }
    if (!reason) {
      alert("Reason is required");
      return;
    }
    if (!selectedReceipt) {
      alert("Please select a Money Receipt first");
      return;
    }

    const newReverseMR: ReverseMRRecord = {
      id: generateId(),
      reverseId: reverseId || `REV-${String(savedReverseMRs.length + 1).padStart(3, "0")}`,
      date: reverseDate,
      branch: reverseBranch,
      chequeNo: chequeNo,
      chequeDate: chequeDate,
      drawnOn: drawnOn,
      chequeAmount: chequeAmount,
      mrNo: mrNo,
      mrDate: mrDate,
      mrAgainst: mrAgainst,
      customer: customer,
      depositedIn: depositedIn,
      mrVoucherNo: mrVoucherNo,
      reason: reason,
      remarks: remarks,
      documentType: documentType,
      documentNo: documentNo,
      documentAmount: documentAmount,
      receivedAmount: receivedAmount,
    };

    setSavedReverseMRs([...savedReverseMRs, newReverseMR]);
    alert(`MR Reversed successfully!\nReverse ID: ${newReverseMR.reverseId}\nAmount: ₹${chequeAmount.toLocaleString()}`);
    handleClearEntry();
  };

  const handleClearEntry = (): void => {
    setReverseId("");
    setReverseDate(new Date().toISOString().split("T")[0]);
    setReverseBranch("");
    setChequeNo("");
    setChequeDate("");
    setDrawnOn("");
    setChequeAmount(0);
    setMrNo("");
    setMrDate("");
    setMrAgainst("");
    setCustomer("");
    setDepositedIn("");
    setMrVoucherNo("");
    setDocumentType("");
    setDocumentNo("");
    setDocumentAmount(0);
    setReceivedAmount(0);
    setReason("");
    setRemarks("");
    setSelectedReceipt(null);
  };

  const handleCancelReverse = (): void => {
    if (confirm("Cancel reverse operation? All data will be lost.")) {
      handleClearEntry();
    }
  };

  // ========== Search Tab Handlers ==========
  const handleShowReverse = (): void => {
    alert(`Found ${filteredReverseMRs.length} reversed MRs`);
  };

  const handleClearSearch = (): void => {
    setSearchFromDate(new Date().toISOString().split("T")[0]);
    setSearchToDate(new Date().toISOString().split("T")[0]);
  };

  const toggleSearchColumn = (key: keyof SearchColumnSettings): void => {
    setSearchColumnSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleViewDetails = (reverse: ReverseMRRecord): void => {
    setSelectedReverseMR(reverse);
    setViewDialogOpen(true);
  };

  return (
    <div className="space-y-6 p-3 sm:p-4 md:p-6 max-w-full overflow-x-hidden">
      <h1 className="text-xl sm:text-2xl font-bold text-primary">Reverse MR</h1>

      <Tabs defaultValue="select" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="select">Select Money Receipt</TabsTrigger>
          <TabsTrigger value="entry">Entry</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
        </TabsList>

        {/* ==================== SELECT MONEY RECEIPT TAB ==================== */}
        <TabsContent value="select" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Money Receipt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label>Branch <span className="text-red-500">*</span></Label>
                  <Select value={selectBranch} onValueChange={setSelectBranch}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Branch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Select Branch">Select Branch</SelectItem>
                      {branches.filter(b => b !== "Select Branch").map(b => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Period From <span className="text-red-500">*</span></Label>
                  <Input type="date" value={fromPeriod} onChange={(e) => setFromPeriod(e.target.value)} />
                </div>
                <div>
                  <Label>Period To <span className="text-red-500">*</span></Label>
                  <Input type="date" value={toPeriod} onChange={(e) => setToPeriod(e.target.value)} />
                </div>
                <div>
                  <Label>Customer</Label>
                  <Select value={selectCustomer} onValueChange={setSelectCustomer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Customer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Customers">All Customers</SelectItem>
                      {customers.filter(c => c !== "Select Customer").map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                <Button onClick={handleShowMoneyReceipt} className="bg-blue-600 hover:bg-blue-700">
                  <Search className="mr-2 h-4 w-4" /> Show Money Receipt
                </Button>
                <Button onClick={handleClearSelect} variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" /> Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Money Receipt Table with Column Settings */}
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Money Receipt List</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" /> Column Settings
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {selectColumnOptions.map((opt) => (
                    <DropdownMenuItem key={opt.key} onSelect={(e) => e.preventDefault()}>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={selectColumnSettings[opt.key]}
                          onCheckedChange={() => toggleSelectColumn(opt.key)}
                        />
                        <span>{opt.label}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <div className="min-w-[800px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>S#</TableHead>
                      {selectColumnSettings.customer && <TableHead>Customer</TableHead>}
                      {selectColumnSettings.mrNo && <TableHead>MR #</TableHead>}
                      {selectColumnSettings.mrDate && <TableHead>MR Date</TableHead>}
                      {selectColumnSettings.chequeNo && <TableHead>Cheque #</TableHead>}
                      {selectColumnSettings.chequeDate && <TableHead>Cheque Date</TableHead>}
                      {selectColumnSettings.drawnOn && <TableHead>Drawn ON</TableHead>}
                      {selectColumnSettings.mrAmount && <TableHead className="text-right">MR Amount</TableHead>}
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMoneyReceipts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                          No money receipts found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMoneyReceipts.map((receipt, idx) => (
                        <TableRow key={receipt.id}>
                          <TableCell>{idx + 1}</TableCell>
                          {selectColumnSettings.customer && <TableCell>{receipt.customer}</TableCell>}
                          {selectColumnSettings.mrNo && <TableCell className="font-medium">{receipt.mrNo}</TableCell>}
                          {selectColumnSettings.mrDate && <TableCell>{receipt.mrDate}</TableCell>}
                          {selectColumnSettings.chequeNo && <TableCell>{receipt.chequeNo}</TableCell>}
                          {selectColumnSettings.chequeDate && <TableCell>{receipt.chequeDate}</TableCell>}
                          {selectColumnSettings.drawnOn && <TableCell>{receipt.drawnOn}</TableCell>}
                          {selectColumnSettings.mrAmount && <TableCell className="text-right">₹ {receipt.mrAmount.toLocaleString()}</TableCell>}
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleSelectReceipt(receipt)}
                              className="bg-green-50 hover:bg-green-100"
                            >
                              Select
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
        </TabsContent>

        {/* ==================== ENTRY TAB ==================== */}
        <TabsContent value="entry" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reverse MR Entry</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label>Reverse ID</Label>
                  <Input value={reverseId} readOnly placeholder="Auto-generated" className="bg-muted" />
                </div>
                <div>
                  <Label>Date <span className="text-red-500">*</span></Label>
                  <Input type="date" value={reverseDate} onChange={(e) => setReverseDate(e.target.value)} />
                </div>
                <div>
                  <Label>Branch <span className="text-red-500">*</span></Label>
                  <Select value={reverseBranch} onValueChange={setReverseBranch}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.filter(b => b !== "Select Branch").map(b => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Cheque # <span className="text-red-500">*</span></Label>
                  <Input value={chequeNo} onChange={(e) => setChequeNo(e.target.value)} />
                </div>
                <div>
                  <Label>Cheque Date</Label>
                  <Input type="date" value={chequeDate} onChange={(e) => setChequeDate(e.target.value)} />
                </div>
                <div>
                  <Label>Drawn On</Label>
                  <Input value={drawnOn} onChange={(e) => setDrawnOn(e.target.value)} />
                </div>
                <div>
                  <Label>Cheque Amount</Label>
                  <Input type="number" value={chequeAmount} readOnly className="bg-muted" />
                </div>
                <div>
                  <Label>MR #</Label>
                  <Input value={mrNo} readOnly className="bg-muted" />
                </div>
                <div>
                  <Label>MR Date</Label>
                  <Input value={mrDate} readOnly className="bg-muted" />
                </div>
                <div>
                  <Label>MR Against</Label>
                  <Input value={mrAgainst} readOnly className="bg-muted" />
                </div>
                <div>
                  <Label>Customer</Label>
                  <Input value={customer} readOnly className="bg-muted" />
                </div>
                <div>
                  <Label>Deposited In</Label>
                  <Input value={depositedIn} readOnly className="bg-muted" />
                </div>
                <div>
                  <Label>MR Voucher #</Label>
                  <Input value={mrVoucherNo} readOnly className="bg-muted" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Table */}
          <Card>
            <CardHeader>
              <CardTitle>Document Details</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <div className="min-w-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>S#</TableHead>
                      <TableHead>Document Type</TableHead>
                      <TableHead>Document #</TableHead>
                      <TableHead className="text-right">Document Amount</TableHead>
                      <TableHead className="text-right">Received Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>1</TableCell>
                      <TableCell>
                        <Input value={documentType} onChange={(e) => setDocumentType(e.target.value)} placeholder="Document Type" />
                      </TableCell>
                      <TableCell>
                        <Input value={documentNo} onChange={(e) => setDocumentNo(e.target.value)} placeholder="Document #" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Input type="number" value={documentAmount} onChange={(e) => setDocumentAmount(Number(e.target.value))} className="w-32 text-right" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Input type="number" value={receivedAmount} onChange={(e) => setReceivedAmount(Number(e.target.value))} className="w-32 text-right" />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Reason and Remarks */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label>Reason <span className="text-red-500">*</span></Label>
                  <Select value={reason} onValueChange={setReason}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Reason" />
                    </SelectTrigger>
                    <SelectContent>
                      {reasons.map(r => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Remarks</Label>
                  <Input value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Enter remarks" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4 border-t">
            <Button onClick={handleReverseMR} className="bg-red-600 hover:bg-red-700">
              <Undo2 className="mr-2 h-4 w-4" /> REVERSE MR
            </Button>
            <Button onClick={handleClearEntry} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" /> Clear Screen
            </Button>
            <Button onClick={handleCancelReverse} variant="destructive">
              <X className="mr-2 h-4 w-4" /> Cancel Reverse
            </Button>
          </div>
        </TabsContent>

        {/* ==================== SEARCH TAB ==================== */}
        <TabsContent value="search" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Search Reversed MRs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <Button onClick={handleShowReverse} className="bg-blue-600 hover:bg-blue-700">
                  <Search className="mr-2 h-4 w-4" /> Show Reverse
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
              <CardTitle>Reversed MR List</CardTitle>
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
                      {searchColumnSettings.reverseId && <TableHead>Reverse Id</TableHead>}
                      {searchColumnSettings.branch && <TableHead>Branch</TableHead>}
                      {searchColumnSettings.date && <TableHead>Date</TableHead>}
                      {searchColumnSettings.mrNo && <TableHead>MR#</TableHead>}
                      {searchColumnSettings.mrDate && <TableHead>MR Date</TableHead>}
                      {searchColumnSettings.chequeNo && <TableHead>Cheque #</TableHead>}
                      {searchColumnSettings.drawnOn && <TableHead>Drawn On</TableHead>}
                      {searchColumnSettings.customer && <TableHead>Customer</TableHead>}
                      {searchColumnSettings.amount && <TableHead className="text-right">Amount</TableHead>}
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReverseMRs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                          No reversed MRs found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredReverseMRs.map((reverse, idx) => (
                        <TableRow key={reverse.id}>
                          <TableCell>{idx + 1}</TableCell>
                          {searchColumnSettings.reverseId && <TableCell className="font-medium">{reverse.reverseId}</TableCell>}
                          {searchColumnSettings.branch && <TableCell>{reverse.branch}</TableCell>}
                          {searchColumnSettings.date && <TableCell>{reverse.date}</TableCell>}
                          {searchColumnSettings.mrNo && <TableCell>{reverse.mrNo}</TableCell>}
                          {searchColumnSettings.mrDate && <TableCell>{reverse.mrDate}</TableCell>}
                          {searchColumnSettings.chequeNo && <TableCell>{reverse.chequeNo}</TableCell>}
                          {searchColumnSettings.drawnOn && <TableCell>{reverse.drawnOn}</TableCell>}
                          {searchColumnSettings.customer && <TableCell>{reverse.customer}</TableCell>}
                          {searchColumnSettings.amount && <TableCell className="text-right">₹ {reverse.chequeAmount.toLocaleString()}</TableCell>}
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => handleViewDetails(reverse)}>
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
          {filteredReverseMRs.length > 0 && (
            <div className="text-sm text-muted-foreground border-t pt-3 flex justify-between">
              <span>Total Records: {filteredReverseMRs.length}</span>
              <span>
                Total Amount: ₹ {filteredReverseMRs.reduce((sum, r) => sum + r.chequeAmount, 0).toLocaleString()}
              </span>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Reverse MR Details</DialogTitle>
          </DialogHeader>
          {selectedReverseMR && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Reverse ID</Label><p className="font-medium">{selectedReverseMR.reverseId}</p></div>
                <div><Label>Date</Label><p className="font-medium">{selectedReverseMR.date}</p></div>
                <div><Label>Branch</Label><p className="font-medium">{selectedReverseMR.branch}</p></div>
                <div><Label>MR #</Label><p className="font-medium">{selectedReverseMR.mrNo}</p></div>
                <div><Label>MR Date</Label><p className="font-medium">{selectedReverseMR.mrDate}</p></div>
                <div><Label>Cheque #</Label><p className="font-medium">{selectedReverseMR.chequeNo}</p></div>
                <div><Label>Cheque Date</Label><p className="font-medium">{selectedReverseMR.chequeDate}</p></div>
                <div><Label>Drawn On</Label><p className="font-medium">{selectedReverseMR.drawnOn}</p></div>
                <div><Label>Cheque Amount</Label><p className="font-medium text-blue-600">₹ {selectedReverseMR.chequeAmount.toLocaleString()}</p></div>
                <div><Label>Customer</Label><p className="font-medium">{selectedReverseMR.customer}</p></div>
                <div><Label>MR Against</Label><p className="font-medium">{selectedReverseMR.mrAgainst}</p></div>
                <div><Label>Deposited In</Label><p className="font-medium">{selectedReverseMR.depositedIn}</p></div>
                <div><Label>MR Voucher #</Label><p className="font-medium">{selectedReverseMR.mrVoucherNo}</p></div>
                <div><Label>Document Type</Label><p className="font-medium">{selectedReverseMR.documentType}</p></div>
                <div><Label>Document #</Label><p className="font-medium">{selectedReverseMR.documentNo}</p></div>
                <div><Label>Document Amount</Label><p className="font-medium">₹ {selectedReverseMR.documentAmount.toLocaleString()}</p></div>
                <div><Label>Received Amount</Label><p className="font-medium">₹ {selectedReverseMR.receivedAmount.toLocaleString()}</p></div>
                <div><Label>Reason</Label><p className="font-medium">{selectedReverseMR.reason}</p></div>
                <div className="col-span-2"><Label>Remarks</Label><p className="font-medium">{selectedReverseMR.remarks || "-"}</p></div>
              </div>
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