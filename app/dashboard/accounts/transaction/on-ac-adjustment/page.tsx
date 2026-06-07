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
import { Plus, Trash2, Save, RefreshCw, X, Eye, Search, Settings } from "lucide-react";

// ==================== Types ====================
interface OnAcReceipt {
  id: string;
  mrNo: string;
  mrDate: string;
  customer: string;
  consignor: string;
  consignee: string;
  mrAmount: number;
  onAcAmount: number;
  voucherNo: string;
}

interface AdjustmentBill {
  id: string;
  documentType: string;
  documentNo: string;
  documentMRDate: string;
  documentAmount: number;
  balance: number;
  receivedAmount: number;
  tds: number;
  claim: number;
  excess: number;
  pending: number;
  remarks: string;
}

interface Adjustment {
  id: string;
  adjustmentNo: string;
  adjustmentDate: string;
  customer: string;
  mrNo: string;
  referenceNo: string;
  referenceVoucherNo: string;
  amount: number;
  voucherNo: string;
  remarks: string;
  branch: string;
  consignor: string;
  consignee: string;
  grossAmount: number;
  onAcAmount: number;
  bills: AdjustmentBill[];
}

// Column Settings Types
interface ReceiptColumnSettings {
  mrNo: boolean;
  mrDate: boolean;
  customer: boolean;
  consignor: boolean;
  consignee: boolean;
  mrAmount: boolean;
  onAcAmount: boolean;
  voucherNo: boolean;
}

interface SearchColumnSettings {
  adjustmentNo: boolean;
  adjustmentDate: boolean;
  customer: boolean;
  mrNo: boolean;
  referenceNo: boolean;
  referenceVoucherNo: boolean;
  amount: boolean;
  voucherNo: boolean;
  remarks: boolean;
}

interface ColumnOption {
  key: keyof ReceiptColumnSettings;
  label: string;
}

interface SearchColumnOption {
  key: keyof SearchColumnSettings;
  label: string;
}

// Helper
const generateId = (): string => Math.random().toString(36).substr(2, 9);

// Mock On A/c Receipt Data
const mockOnAcReceipts: OnAcReceipt[] = [
  {
    id: "1",
    mrNo: "MR-001",
    mrDate: "2026-05-10",
    customer: "ABC Transport",
    consignor: "ABC Corp",
    consignee: "XYZ Ltd",
    mrAmount: 50000,
    onAcAmount: 10000,
    voucherNo: "VCH-001",
  },
  {
    id: "2",
    mrNo: "MR-002",
    mrDate: "2026-05-11",
    customer: "XYZ Logistics",
    consignor: "LMN Enterprises",
    consignee: "PQR Industries",
    mrAmount: 35000,
    onAcAmount: 5000,
    voucherNo: "VCH-002",
  },
  {
    id: "3",
    mrNo: "MR-003",
    mrDate: "2026-05-12",
    customer: "PQR Carriers",
    consignor: "RST Group",
    consignee: "UVW Limited",
    mrAmount: 25000,
    onAcAmount: 3000,
    voucherNo: "VCH-003",
  },
];

// Mock Adjustments for Search Tab
const mockAdjustments: Adjustment[] = [
  {
    id: "adj1",
    adjustmentNo: "ADJ-001",
    adjustmentDate: "2026-05-13",
    customer: "ABC Transport",
    mrNo: "MR-001",
    referenceNo: "REF-001",
    referenceVoucherNo: "VCH-101",
    amount: 10000,
    voucherNo: "VCH-201",
    remarks: "On account adjustment",
    branch: "Mumbai HO",
    consignor: "ABC Corp",
    consignee: "XYZ Ltd",
    grossAmount: 50000,
    onAcAmount: 10000,
    bills: [],
  },
  {
    id: "adj2",
    adjustmentNo: "ADJ-002",
    adjustmentDate: "2026-05-13",
    customer: "XYZ Logistics",
    mrNo: "MR-002",
    referenceNo: "REF-002",
    referenceVoucherNo: "VCH-102",
    amount: 5000,
    voucherNo: "VCH-202",
    remarks: "Partial adjustment",
    branch: "Delhi Branch",
    consignor: "LMN Enterprises",
    consignee: "PQR Industries",
    grossAmount: 35000,
    onAcAmount: 5000,
    bills: [],
  },
];

// Mock Data for Dropdowns
const branches: string[] = ["ALL", "Mumbai HO", "Delhi Branch", "Chennai Branch", "Kolkata Branch", "Bangalore Branch"];
const customers: string[] = ["ALL", "ABC Transport", "XYZ Logistics", "PQR Carriers", "LMN Freight"];
const consignors: string[] = ["ALL", "ABC Corp", "LMN Enterprises", "RST Group", "XYZ Corp"];
const consignees: string[] = ["ALL", "XYZ Ltd", "PQR Industries", "UVW Limited", "DEF Corp"];
const documentTypes: string[] = ["INVOICE", "BILL", "CREDIT NOTE", "DEBIT NOTE"];

// Column settings options with proper typing
const columnOptions: ColumnOption[] = [
  { key: "mrNo", label: "MR#" },
  { key: "mrDate", label: "MR Date" },
  { key: "customer", label: "Customer" },
  { key: "consignor", label: "Consignor" },
  { key: "consignee", label: "Consignee" },
  { key: "mrAmount", label: "MR Amount" },
  { key: "onAcAmount", label: "On A/c Amount" },
  { key: "voucherNo", label: "Voucher #" },
];

const searchColumnOptions: SearchColumnOption[] = [
  { key: "adjustmentNo", label: "Adjustment#" },
  { key: "adjustmentDate", label: "Adjustment Date" },
  { key: "customer", label: "Customer" },
  { key: "mrNo", label: "MR #" },
  { key: "referenceNo", label: "Reference#" },
  { key: "referenceVoucherNo", label: "Reference Voucher #" },
  { key: "amount", label: "Amount" },
  { key: "voucherNo", label: "Voucher #" },
  { key: "remarks", label: "Remarks" },
];

export default function OnAcAdjustment() {
  // ========== On A/c Receipt Tab State ==========
  const [receiptBranch, setReceiptBranch] = useState<string>("");
  const [asOnDate, setAsOnDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [receiptCustomer, setReceiptCustomer] = useState<string>("ALL");
  const [checkboxFilter, setCheckboxFilter] = useState<boolean>(false);
  const [receiptData] = useState<OnAcReceipt[]>(mockOnAcReceipts);
  const [receiptColumnSettings, setReceiptColumnSettings] = useState<ReceiptColumnSettings>({
    mrNo: true,
    mrDate: true,
    customer: true,
    consignor: true,
    consignee: true,
    mrAmount: true,
    onAcAmount: true,
    voucherNo: true,
  });

  // ========== Entry Tab State ==========
  const [entryBranch, setEntryBranch] = useState<string>("");
  const [entryCustomer, setEntryCustomer] = useState<string>("");
  const [consignor, setConsignor] = useState<string>("");
  const [consignee, setConsignee] = useState<string>("");
  const [mrNo, setMrNo] = useState<string>("");
  const [mrDate, setMrDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [grossAmount, setGrossAmount] = useState<number>(0);
  const [onAcAmount, setOnAcAmount] = useState<number>(0);
  const [adjustmentBills, setAdjustmentBills] = useState<AdjustmentBill[]>([]);
  const [voucherNo, setVoucherNo] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  const [savedAdjustments, setSavedAdjustments] = useState<Adjustment[]>(mockAdjustments);
  const [, setSelectedMrData] = useState<OnAcReceipt | null>(null);

  // ========== Search Tab State ==========
  const [startPeriod, setStartPeriod] = useState<string>(new Date().toISOString().split("T")[0]);
  const [endPeriod, setEndPeriod] = useState<string>(new Date().toISOString().split("T")[0]);
  const [searchColumnSettings, setSearchColumnSettings] = useState<SearchColumnSettings>({
    adjustmentNo: true,
    adjustmentDate: true,
    customer: true,
    mrNo: true,
    referenceNo: true,
    referenceVoucherNo: true,
    amount: true,
    voucherNo: true,
    remarks: true,
  });
  const [viewDialogOpen, setViewDialogOpen] = useState<boolean>(false);
  const [selectedAdjustment, setSelectedAdjustment] = useState<Adjustment | null>(null);

  // ========== Filtered Receipt Data ==========
  const filteredReceipts = useMemo((): OnAcReceipt[] => {
    let filtered = receiptData;

    if (receiptBranch && receiptBranch !== "ALL") {
      // In real app, filter by branch - currently mock data doesn't have branch field
    }
    if (receiptCustomer && receiptCustomer !== "ALL") {
      filtered = filtered.filter(r => r.customer === receiptCustomer);
    }
    if (checkboxFilter) {
      filtered = filtered.filter(r => r.onAcAmount > 5000);
    }

    return filtered;
  }, [receiptData, receiptBranch, receiptCustomer, checkboxFilter]);

  // ========== Filtered Adjustments for Search Tab ==========
  const filteredAdjustments = useMemo((): Adjustment[] => {
    let filtered = savedAdjustments;

    if (startPeriod) {
      filtered = filtered.filter(a => a.adjustmentDate >= startPeriod);
    }
    if (endPeriod) {
      filtered = filtered.filter(a => a.adjustmentDate <= endPeriod);
    }

    return filtered;
  }, [savedAdjustments, startPeriod, endPeriod]);

  // ========== Handlers - On A/c Receipt Tab ==========
  const handleShowDetails = (): void => {
    alert(`Found ${filteredReceipts.length} on account receipts`);
  };

  const handleClearReceipt = (): void => {
    setReceiptBranch("");
    setAsOnDate(new Date().toISOString().split("T")[0]);
    setReceiptCustomer("ALL");
    setCheckboxFilter(false);
  };

  const toggleReceiptColumn = (key: keyof ReceiptColumnSettings): void => {
    setReceiptColumnSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // ========== Entry Tab Handlers ==========
  const handleSelectBillAdjustedDetail = (): void => {
    if (!mrNo) {
      alert("Please enter MR # first");
      return;
    }
    
    const foundMr = receiptData.find(r => r.mrNo === mrNo);
    if (foundMr) {
      setSelectedMrData(foundMr);
      setGrossAmount(foundMr.mrAmount);
      setOnAcAmount(foundMr.onAcAmount);
      setEntryCustomer(foundMr.customer);
      setConsignor(foundMr.consignor);
      setConsignee(foundMr.consignee);
      
      const newBill: AdjustmentBill = {
        id: generateId(),
        documentType: "MR",
        documentNo: foundMr.mrNo,
        documentMRDate: foundMr.mrDate,
        documentAmount: foundMr.mrAmount,
        balance: foundMr.mrAmount - foundMr.onAcAmount,
        receivedAmount: foundMr.onAcAmount,
        tds: 0,
        claim: 0,
        excess: 0,
        pending: foundMr.mrAmount - foundMr.onAcAmount,
        remarks: "",
      };
      setAdjustmentBills([newBill]);
      alert(`MR ${mrNo} loaded successfully`);
    } else {
      alert("MR not found. Please enter a valid MR #");
    }
  };

  const updateAdjustmentBill = (id: string, field: keyof AdjustmentBill, value: string | number): void => {
    setAdjustmentBills(prev =>
      prev.map(bill => {
        if (bill.id === id) {
          const updated = { ...bill, [field]: value };
          if (field === "receivedAmount" || field === "tds" || field === "claim") {
            const totalDeductions = (Number(updated.tds) || 0) + (Number(updated.claim) || 0);
            const netReceived = (Number(updated.receivedAmount) || 0) - totalDeductions;
            updated.pending = Math.max(0, updated.balance - netReceived);
            updated.excess = netReceived > updated.balance ? netReceived - updated.balance : 0;
          }
          return updated;
        }
        return bill;
      })
    );
  };

  const deleteAdjustmentBill = (id: string): void => {
    setAdjustmentBills(prev => prev.filter(b => b.id !== id));
  };

  const addNewBill = (): void => {
    const newBill: AdjustmentBill = {
      id: generateId(),
      documentType: "",
      documentNo: "",
      documentMRDate: "",
      documentAmount: 0,
      balance: 0,
      receivedAmount: 0,
      tds: 0,
      claim: 0,
      excess: 0,
      pending: 0,
      remarks: "",
    };
    setAdjustmentBills([...adjustmentBills, newBill]);
  };

  const entryTotals = adjustmentBills.reduce(
    (acc, bill) => ({
      documentAmount: acc.documentAmount + (bill.documentAmount || 0),
      balance: acc.balance + (bill.balance || 0),
      receivedAmount: acc.receivedAmount + (bill.receivedAmount || 0),
      tds: acc.tds + (bill.tds || 0),
      claim: acc.claim + (bill.claim || 0),
      excess: acc.excess + (bill.excess || 0),
      pending: acc.pending + (bill.pending || 0),
    }),
    { documentAmount: 0, balance: 0, receivedAmount: 0, tds: 0, claim: 0, excess: 0, pending: 0 }
  );

  const handleSave = (): void => {
    if (!entryBranch) {
      alert("Branch is required");
      return;
    }
    if (!entryCustomer) {
      alert("Customer is required");
      return;
    }
    if (!consignor) {
      alert("Consignor is required");
      return;
    }
    if (!consignee) {
      alert("Consignee is required");
      return;
    }
    if (!mrNo) {
      alert("MR # is required");
      return;
    }
    if (adjustmentBills.length === 0) {
      alert("Please add at least one bill to adjust");
      return;
    }

    const newAdjustment: Adjustment = {
      id: generateId(),
      adjustmentNo: `ADJ-${String(savedAdjustments.length + 1).padStart(3, "0")}`,
      adjustmentDate: new Date().toISOString().split("T")[0],
      customer: entryCustomer,
      mrNo: mrNo,
      referenceNo: `REF-${mrNo}`,
      referenceVoucherNo: voucherNo || `VCH-${Date.now()}`,
      amount: onAcAmount,
      voucherNo: voucherNo || `VCH-${Date.now()}`,
      remarks: remarks,
      branch: entryBranch,
      consignor: consignor,
      consignee: consignee,
      grossAmount: grossAmount,
      onAcAmount: onAcAmount,
      bills: adjustmentBills,
    };

    setSavedAdjustments([...savedAdjustments, newAdjustment]);
    alert(`Adjustment saved successfully!\nAdjustment No: ${newAdjustment.adjustmentNo}\nAmount: ₹${onAcAmount.toLocaleString()}`);
    handleClearEntry();
  };

  const handleClearEntry = (): void => {
    setEntryBranch("");
    setEntryCustomer("");
    setConsignor("");
    setConsignee("");
    setMrNo("");
    setMrDate(new Date().toISOString().split("T")[0]);
    setGrossAmount(0);
    setOnAcAmount(0);
    setAdjustmentBills([]);
    setVoucherNo("");
    setRemarks("");
    setSelectedMrData(null);
  };

  const handleCancel = (): void => {
    if (confirm("Cancel all changes? Data will be lost.")) {
      handleClearEntry();
    }
  };

  // ========== Search Tab Handlers ==========
  const handleShowAdjustments = (): void => {
    alert(`Found ${filteredAdjustments.length} adjustments`);
  };

  const handleClearSearch = (): void => {
    setStartPeriod(new Date().toISOString().split("T")[0]);
    setEndPeriod(new Date().toISOString().split("T")[0]);
  };

  const toggleSearchColumn = (key: keyof SearchColumnSettings): void => {
    setSearchColumnSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleViewDetails = (adjustment: Adjustment): void => {
    setSelectedAdjustment(adjustment);
    setViewDialogOpen(true);
  };

  return (
    <div className="space-y-6 p-3 sm:p-4 md:p-6 max-w-full overflow-x-hidden">
      <h1 className="text-xl sm:text-2xl font-bold text-primary">On A/c Adjustment</h1>

      <Tabs defaultValue="receipt" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="receipt">On A/c Receipt</TabsTrigger>
          <TabsTrigger value="entry">Entry</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
        </TabsList>

        {/* ==================== ON A/C RECEIPT TAB ==================== */}
        <TabsContent value="receipt" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>On A/c Receipt Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label>Branch</Label>
                  <Select value={receiptBranch} onValueChange={setReceiptBranch}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Branch" />
                    </SelectTrigger>
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
                  <Label>Customer <span className="text-red-500">*</span></Label>
                  <Select value={receiptCustomer} onValueChange={setReceiptCustomer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Checkbox checked={checkboxFilter} onCheckedChange={(c) => setCheckboxFilter(!!c)} />
                  <Label>On A/c Amount &gt; 5000</Label>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                <Button onClick={handleShowDetails} className="bg-blue-600 hover:bg-blue-700">
                  <Search className="mr-2 h-4 w-4" /> Show Details
                </Button>
                <Button onClick={handleClearReceipt} variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" /> Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Receipt Table with Column Settings */}
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>On A/c Receipt List</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" /> Column Settings
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {columnOptions.map((opt) => (
                    <DropdownMenuItem key={opt.key} onSelect={(e) => e.preventDefault()}>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={receiptColumnSettings[opt.key]}
                          onCheckedChange={() => toggleReceiptColumn(opt.key)}
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
                      {receiptColumnSettings.mrNo && <TableHead>MR#</TableHead>}
                      {receiptColumnSettings.mrDate && <TableHead>MR Date</TableHead>}
                      {receiptColumnSettings.customer && <TableHead>Customer</TableHead>}
                      {receiptColumnSettings.consignor && <TableHead>Consignor</TableHead>}
                      {receiptColumnSettings.consignee && <TableHead>Consignee</TableHead>}
                      {receiptColumnSettings.mrAmount && <TableHead className="text-right">MR Amount</TableHead>}
                      {receiptColumnSettings.onAcAmount && <TableHead className="text-right">On A/c Amount</TableHead>}
                      {receiptColumnSettings.voucherNo && <TableHead>Voucher #</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReceipts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                          No on account receipts found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredReceipts.map((receipt, idx) => (
                        <TableRow key={receipt.id}>
                          <TableCell>{idx + 1}</TableCell>
                          {receiptColumnSettings.mrNo && <TableCell className="font-medium">{receipt.mrNo}</TableCell>}
                          {receiptColumnSettings.mrDate && <TableCell>{receipt.mrDate}</TableCell>}
                          {receiptColumnSettings.customer && <TableCell>{receipt.customer}</TableCell>}
                          {receiptColumnSettings.consignor && <TableCell>{receipt.consignor}</TableCell>}
                          {receiptColumnSettings.consignee && <TableCell>{receipt.consignee}</TableCell>}
                          {receiptColumnSettings.mrAmount && <TableCell className="text-right">₹ {receipt.mrAmount.toLocaleString()}</TableCell>}
                          {receiptColumnSettings.onAcAmount && <TableCell className="text-right">₹ {receipt.onAcAmount.toLocaleString()}</TableCell>}
                          {receiptColumnSettings.voucherNo && <TableCell>{receipt.voucherNo}</TableCell>}
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
              <CardTitle>On A/c Adjustment Entry</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label>Branch <span className="text-red-500">*</span></Label>
                  <Select value={entryBranch} onValueChange={setEntryBranch}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.filter(b => b !== "ALL").map(b => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Customer <span className="text-red-500">*</span></Label>
                  <Select value={entryCustomer} onValueChange={setEntryCustomer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.filter(c => c !== "ALL").map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Consignor <span className="text-red-500">*</span></Label>
                  <Select value={consignor} onValueChange={setConsignor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Consignor" />
                    </SelectTrigger>
                    <SelectContent>
                      {consignors.filter(c => c !== "ALL").map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Consignee <span className="text-red-500">*</span></Label>
                  <Select value={consignee} onValueChange={setConsignee}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Consignee" />
                    </SelectTrigger>
                    <SelectContent>
                      {consignees.filter(c => c !== "ALL").map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>MR # <span className="text-red-500">*</span></Label>
                  <div className="flex gap-2">
                    <Input value={mrNo} onChange={(e) => setMrNo(e.target.value)} placeholder="Enter MR #" />
                    <Button onClick={handleSelectBillAdjustedDetail} variant="outline">
                      Select Bill Adjusted Detail
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>MR Date <span className="text-red-500">*</span></Label>
                  <Input type="date" value={mrDate} onChange={(e) => setMrDate(e.target.value)} />
                </div>
                <div>
                  <Label>Gross Amount <span className="text-red-500">*</span></Label>
                  <Input type="number" value={grossAmount} onChange={(e) => setGrossAmount(Number(e.target.value))} />
                </div>
                <div>
                  <Label>On A/c Amount</Label>
                  <Input type="number" value={onAcAmount} onChange={(e) => setOnAcAmount(Number(e.target.value))} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bills Table */}
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Bill Adjustment Details</CardTitle>
              <Button onClick={addNewBill} variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" /> Add Bill
              </Button>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <div className="min-w-[1200px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>S#</TableHead>
                      <TableHead>Document Type</TableHead>
                      <TableHead>Document#</TableHead>
                      <TableHead>Document MRDate</TableHead>
                      <TableHead className="text-right">Document Amount</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead className="text-right">Received Amount</TableHead>
                      <TableHead className="text-right">TDS</TableHead>
                      <TableHead className="text-right">Claim</TableHead>
                      <TableHead className="text-right">Excess</TableHead>
                      <TableHead className="text-right">Pending</TableHead>
                      <TableHead>Remarks</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adjustmentBills.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={13} className="text-center py-8 text-muted-foreground">
                          No bills added. Click "Select Bill Adjusted Detail" or "Add Bill" to add.
                        </TableCell>
                      </TableRow>
                    ) : (
                      adjustmentBills.map((bill, idx) => (
                        <TableRow key={bill.id}>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>
                            <Select value={bill.documentType} onValueChange={(v) => updateAdjustmentBill(bill.id, "documentType", v)}>
                              <SelectTrigger className="w-28">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                {documentTypes.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input 
                              value={bill.documentNo} 
                              onChange={(e) => updateAdjustmentBill(bill.id, "documentNo", e.target.value)} 
                              className="w-28" 
                            />
                          </TableCell>
                          <TableCell>
                            <Input 
                              type="date" 
                              value={bill.documentMRDate} 
                              onChange={(e) => updateAdjustmentBill(bill.id, "documentMRDate", e.target.value)} 
                              className="w-32" 
                            />
                          </TableCell>
                          <TableCell className="text-right">₹ {bill.documentAmount.toLocaleString()}</TableCell>
                          <TableCell className="text-right">₹ {bill.balance.toLocaleString()}</TableCell>
                          <TableCell>
                            <Input 
                              type="number" 
                              value={bill.receivedAmount} 
                              onChange={(e) => updateAdjustmentBill(bill.id, "receivedAmount", Number(e.target.value))} 
                              className="w-28 text-right" 
                            />
                          </TableCell>
                          <TableCell>
                            <Input 
                              type="number" 
                              value={bill.tds} 
                              onChange={(e) => updateAdjustmentBill(bill.id, "tds", Number(e.target.value))} 
                              className="w-24 text-right" 
                            />
                          </TableCell>
                          <TableCell>
                            <Input 
                              type="number" 
                              value={bill.claim} 
                              onChange={(e) => updateAdjustmentBill(bill.id, "claim", Number(e.target.value))} 
                              className="w-24 text-right" 
                            />
                          </TableCell>
                          <TableCell className="text-right">₹ {bill.excess.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-semibold">₹ {bill.pending.toLocaleString()}</TableCell>
                          <TableCell>
                            <Input 
                              value={bill.remarks} 
                              onChange={(e) => updateAdjustmentBill(bill.id, "remarks", e.target.value)} 
                              className="w-32" 
                            />
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => deleteAdjustmentBill(bill.id)}>
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

          {/* Totals Row */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-9 gap-3 text-sm font-semibold">
                <div>Document Amt: <span className="text-blue-600">₹ {entryTotals.documentAmount.toLocaleString()}</span></div>
                <div>Balance: <span className="text-orange-600">₹ {entryTotals.balance.toLocaleString()}</span></div>
                <div>Received Amt: <span className="text-green-600">₹ {entryTotals.receivedAmount.toLocaleString()}</span></div>
                <div>TDS: <span className="text-red-600">₹ {entryTotals.tds.toLocaleString()}</span></div>
                <div>Deduction: <span className="text-purple-600">₹ {entryTotals.claim.toLocaleString()}</span></div>
                <div>GST: <span className="text-pink-600">₹ 0</span></div>
                <div>Claim: <span className="text-yellow-600">₹ {entryTotals.claim.toLocaleString()}</span></div>
                <div>Excess: <span className="text-indigo-600">₹ {entryTotals.excess.toLocaleString()}</span></div>
                <div>Pending: <span className="text-red-500">₹ {entryTotals.pending.toLocaleString()}</span></div>
              </div>
            </CardContent>
          </Card>

          {/* Voucher and Remarks */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Voucher#</Label>
                  <Input value={voucherNo} onChange={(e) => setVoucherNo(e.target.value)} placeholder="Auto-generated" />
                </div>
                <div>
                  <Label>Remarks</Label>
                  <Input value={remarks} onChange={(e) => setRemarks(e.target.value)} />
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
          </div>
        </TabsContent>

        {/* ==================== SEARCH TAB ==================== */}
        <TabsContent value="search" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Search Adjustments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label>Period From <span className="text-red-500">*</span></Label>
                  <Input type="date" value={startPeriod} onChange={(e) => setStartPeriod(e.target.value)} />
                </div>
                <div>
                  <Label>Period To <span className="text-red-500">*</span></Label>
                  <Input type="date" value={endPeriod} onChange={(e) => setEndPeriod(e.target.value)} />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                <Button onClick={handleShowAdjustments} className="bg-blue-600 hover:bg-blue-700">
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
              <CardTitle>Adjustment List</CardTitle>
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
              <div className="min-w-[800px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>S#</TableHead>
                      {searchColumnSettings.adjustmentNo && <TableHead>Adjustment#</TableHead>}
                      {searchColumnSettings.adjustmentDate && <TableHead>Adjustment Date</TableHead>}
                      {searchColumnSettings.customer && <TableHead>Customer</TableHead>}
                      {searchColumnSettings.mrNo && <TableHead>MR #</TableHead>}
                      {searchColumnSettings.referenceNo && <TableHead>Reference#</TableHead>}
                      {searchColumnSettings.referenceVoucherNo && <TableHead>Reference Voucher #</TableHead>}
                      {searchColumnSettings.amount && <TableHead className="text-right">Amount</TableHead>}
                      {searchColumnSettings.voucherNo && <TableHead>Voucher #</TableHead>}
                      {searchColumnSettings.remarks && <TableHead>Remarks</TableHead>}
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAdjustments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                          No adjustments found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAdjustments.map((adj, idx) => (
                        <TableRow key={adj.id}>
                          <TableCell>{idx + 1}</TableCell>
                          {searchColumnSettings.adjustmentNo && <TableCell className="font-medium">{adj.adjustmentNo}</TableCell>}
                          {searchColumnSettings.adjustmentDate && <TableCell>{adj.adjustmentDate}</TableCell>}
                          {searchColumnSettings.customer && <TableCell>{adj.customer}</TableCell>}
                          {searchColumnSettings.mrNo && <TableCell>{adj.mrNo}</TableCell>}
                          {searchColumnSettings.referenceNo && <TableCell>{adj.referenceNo}</TableCell>}
                          {searchColumnSettings.referenceVoucherNo && <TableCell>{adj.referenceVoucherNo}</TableCell>}
                          {searchColumnSettings.amount && <TableCell className="text-right">₹ {adj.amount.toLocaleString()}</TableCell>}
                          {searchColumnSettings.voucherNo && <TableCell>{adj.voucherNo}</TableCell>}
                          {searchColumnSettings.remarks && <TableCell className="max-w-[200px] truncate">{adj.remarks}</TableCell>}
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => handleViewDetails(adj)}>
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
          {filteredAdjustments.length > 0 && (
            <div className="text-sm text-muted-foreground border-t pt-3 flex justify-between">
              <span>Total Records: {filteredAdjustments.length}</span>
              <span>
                Total Amount: ₹ {filteredAdjustments.reduce((sum, a) => sum + a.amount, 0).toLocaleString()}
              </span>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adjustment Details</DialogTitle>
          </DialogHeader>
          {selectedAdjustment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Adjustment No.</Label><p className="font-medium">{selectedAdjustment.adjustmentNo}</p></div>
                <div><Label>Adjustment Date</Label><p className="font-medium">{selectedAdjustment.adjustmentDate}</p></div>
                <div><Label>Branch</Label><p className="font-medium">{selectedAdjustment.branch}</p></div>
                <div><Label>Customer</Label><p className="font-medium">{selectedAdjustment.customer}</p></div>
                <div><Label>Consignor</Label><p className="font-medium">{selectedAdjustment.consignor}</p></div>
                <div><Label>Consignee</Label><p className="font-medium">{selectedAdjustment.consignee}</p></div>
                <div><Label>MR #</Label><p className="font-medium">{selectedAdjustment.mrNo}</p></div>
                <div><Label>Gross Amount</Label><p className="font-medium">₹ {selectedAdjustment.grossAmount.toLocaleString()}</p></div>
                <div><Label>On A/c Amount</Label><p className="font-medium">₹ {selectedAdjustment.onAcAmount.toLocaleString()}</p></div>
                <div><Label>Reference #</Label><p className="font-medium">{selectedAdjustment.referenceNo}</p></div>
                <div><Label>Reference Voucher #</Label><p className="font-medium">{selectedAdjustment.referenceVoucherNo}</p></div>
                <div><Label>Amount</Label><p className="font-medium text-blue-600">₹ {selectedAdjustment.amount.toLocaleString()}</p></div>
                <div><Label>Voucher #</Label><p className="font-medium">{selectedAdjustment.voucherNo}</p></div>
                <div className="col-span-2"><Label>Remarks</Label><p className="font-medium">{selectedAdjustment.remarks || "-"}</p></div>
              </div>
              {selectedAdjustment.bills.length > 0 && (
                <>
                  <div className="font-semibold mt-4">Adjusted Bills:</div>
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
                      {selectedAdjustment.bills.map((bill, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{bill.documentNo}</TableCell>
                          <TableCell>{bill.documentType}</TableCell>
                          <TableCell>{bill.documentMRDate}</TableCell>
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