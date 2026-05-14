"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
interface PaymentRecord {
  id: string;
  paymentId: string;
  referenceNo: string;
  paymentDate: string;
  branch: string;
  vendor: string;
  voucherNo: string;
  paidAmount: number;
}

interface OutstandingBill {
  id: string;
  vendor: string;
  vendorDepartment: string;
  invoiceNo: string;
  invoiceDate: string;
  receivedDate: string;
  billAmount: number;
  tds: number;
  paid: number;
  balance: number;
  osDays: number;
}

interface VendorWisePayment {
  id: string;
  vendor: string;
  billNo: string;
  billDate: string;
  receivedOn: string;
  billAmount: number;
  tds: number;
  balance: number;
  paid: number;
}

interface BankTransaction {
  id: string;
  transactionId: string;
  bankName: string;
  amount: number;
}

interface RejectedPayment {
  id: string;
  paymentId: string;
  paymentDate: string;
  branch: string;
  vendor: string;
  voucherNo: string;
  paidAmount: number;
}

// Column Settings Types
interface SearchColumnSettings {
  paymentId: boolean;
  referenceNo: boolean;
  paymentDate: boolean;
  branch: boolean;
  vendor: boolean;
  voucherNo: boolean;
  paidAmount: boolean;
}

interface RejectColumnSettings {
  paymentId: boolean;
  paymentDate: boolean;
  branch: boolean;
  vendor: boolean;
  voucherNo: boolean;
  paidAmount: boolean;
}

interface SearchColumnOption {
  key: keyof SearchColumnSettings;
  label: string;
}

// Helper
const generateId = (): string => Math.random().toString(36).substr(2, 9);

// Mock Data
const mockPayments: PaymentRecord[] = [
  {
    id: "1",
    paymentId: "PAY-001",
    referenceNo: "REF-001",
    paymentDate: "2026-05-14",
    branch: "Mumbai HO",
    vendor: "ABC Transport",
    voucherNo: "VCH-001",
    paidAmount: 50000,
  },
  {
    id: "2",
    paymentId: "PAY-002",
    referenceNo: "REF-002",
    paymentDate: "2026-05-13",
    branch: "Delhi Branch",
    vendor: "XYZ Logistics",
    voucherNo: "VCH-002",
    paidAmount: 35000,
  },
];

const mockOutstandingBills: OutstandingBill[] = [
  {
    id: "1",
    vendor: "ABC Transport",
    vendorDepartment: "Logistics",
    invoiceNo: "INV-001",
    invoiceDate: "2026-05-01",
    receivedDate: "2026-05-05",
    billAmount: 50000,
    tds: 2500,
    paid: 10000,
    balance: 37500,
    osDays: 45,
  },
  {
    id: "2",
    vendor: "XYZ Logistics",
    vendorDepartment: "Supply Chain",
    invoiceNo: "INV-002",
    invoiceDate: "2026-05-02",
    receivedDate: "2026-05-06",
    billAmount: 35000,
    tds: 1750,
    paid: 5000,
    balance: 28250,
    osDays: 30,
  },
];

const mockBankTransactions: BankTransaction[] = [
  { id: "1", transactionId: "TXN-001", bankName: "SBI", amount: 50000 },
  { id: "2", transactionId: "TXN-002", bankName: "HDFC", amount: 35000 },
  { id: "3", transactionId: "TXN-003", bankName: "ICICI", amount: 25000 },
];

const mockRejectedPayments: RejectedPayment[] = [
  {
    id: "1",
    paymentId: "PAY-003",
    paymentDate: "2026-05-12",
    branch: "Chennai Branch",
    vendor: "PQR Carriers",
    voucherNo: "VCH-003",
    paidAmount: 25000,
  },
];

// Mock Data for Dropdowns
const branches: string[] = ["Select Branch", "Mumbai HO", "Delhi Branch", "Chennai Branch", "Kolkata Branch", "Bangalore Branch"];
const vendors: string[] = ["ALL", "ABC Transport", "XYZ Logistics", "PQR Carriers", "LMN Freight"];
const invoiceCategories: string[] = ["Select", "Purchase", "Service", "Expense", "Freight"];
const tdsSections: string[] = ["Select", "194C", "194H", "194J", "194I"];
const modeOfPayments: string[] = ["CASH", "CHEQUE", "BANK TRANSFER", "NEFT", "RTGS"];
const instrumentTypes: string[] = ["Select", "Cheque", "DD", "PO", "NEFT", "RTGS"];
const paymentByOptions: string[] = ["Self", "Authorized Person", "Accountant", "Manager"];

// Column settings options
const searchColumnOptions: SearchColumnOption[] = [
  { key: "paymentId", label: "Payment ID" },
  { key: "referenceNo", label: "Reference #" },
  { key: "paymentDate", label: "Payment Date" },
  { key: "branch", label: "Branch" },
  { key: "vendor", label: "Vendor" },
  { key: "voucherNo", label: "Voucher No." },
  { key: "paidAmount", label: "Paid Amount" },
];

const rejectColumnOptions = [
  { key: "paymentId", label: "Payment ID" },
  { key: "paymentDate", label: "Payment Date" },
  { key: "branch", label: "Branch" },
  { key: "vendor", label: "Vendor" },
  { key: "voucherNo", label: "Voucher No." },
  { key: "paidAmount", label: "Paid Amount" },
];

export default function VendorBillPayment() {
  // ========== Search Tab State ==========
  const [searchFromDate, setSearchFromDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [searchToDate, setSearchToDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [payments] = useState<PaymentRecord[]>(mockPayments);
  const [searchColumnSettings, setSearchColumnSettings] = useState<SearchColumnSettings>({
    paymentId: true,
    referenceNo: true,
    paymentDate: true,
    branch: true,
    vendor: true,
    voucherNo: true,
    paidAmount: true,
  });

  // ========== Outstanding Payment Tab State ==========
  const [osBranch, setOsBranch] = useState<string>("");
  const [asOnDate, setAsOnDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [invoiceCategory, setInvoiceCategory] = useState<string>("");
  const [osVendor, setOsVendor] = useState<string>("ALL");
  const [outstandingBills] = useState<OutstandingBill[]>(mockOutstandingBills);
  const [selectedOutstanding, setSelectedOutstanding] = useState<string[]>([]);

  // ========== Vendor Wise Payment Tab State ==========
  const [paymentType, setPaymentType] = useState<string>("Payment Against Invoice");
  const [paymentId, setPaymentId] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [vwBranch, setVwBranch] = useState<string>("");
  const [vwVendor, setVwVendor] = useState<string>("");
  const [tdsStatus, setTdsStatus] = useState<string>("");
  const [panNo, setPanNo] = useState<string>("");
  const [modeOfPayment, setModeOfPayment] = useState<string>("CASH");
  const [instrumentType, setInstrumentType] = useState<string>("");
  const [paymentBy, setPaymentBy] = useState<string>("");
  const [instrumentNo, setInstrumentNo] = useState<string>("");
  const [instrumentDate, setInstrumentDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [grossAmount, setGrossAmount] = useState<number>(0);
  const [tdsSection, setTdsSection] = useState<string>("");
  const [lessTdsPercent, setLessTdsPercent] = useState<number>(0);
  const [lessTdsAmount, setLessTdsAmount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [bankCharges, setBankCharges] = useState<number>(0);
  const [totalPaidAmount, setTotalPaidAmount] = useState<number>(0);
  const [billExpectedDate, setBillExpectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [advanceInstructedBy, setAdvanceInstructedBy] = useState<string>("");
  const [vwRemarks, setVwRemarks] = useState<string>("");
  const [vwVoucherNo, setVwVoucherNo] = useState<string>("");

  // ========== Multiple Vendor Payment Tab State ==========
  const [mvBranch, setMvBranch] = useState<string>("");
  const [mvPaymentDate, setMvPaymentDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [mvModeOfPayment, setMvModeOfPayment] = useState<string>("CASH");
  const [mvInstrumentType, setMvInstrumentType] = useState<string>("");
  const [mvPaymentBy, setMvPaymentBy] = useState<string>("");
  const [mvInstrumentNo, setMvInstrumentNo] = useState<string>("");
  const [mvInstrumentDate, setMvInstrumentDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [mvVendors, setMvVendors] = useState<VendorWisePayment[]>([]);
  const [mvRemarks, setMvRemarks] = useState<string>("");

  // ========== Generate Bank Advise Tab State ==========
  const [bankName, setBankName] = useState<string>("");
  const [adviseDate, setAdviseDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [bankSearch, setBankSearch] = useState<string>("");
  const [bankTransactions] = useState<BankTransaction[]>(mockBankTransactions);
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);

  // ========== Reject Payment Tab State ==========
  const [rejectFromDate, setRejectFromDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [rejectToDate, setRejectToDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [rejectedPayments] = useState<RejectedPayment[]>(mockRejectedPayments);
  const [rejectColumnSettings, setRejectColumnSettings] = useState<RejectColumnSettings>({
    paymentId: true,
    paymentDate: true,
    branch: true,
    vendor: true,
    voucherNo: true,
    paidAmount: true,
  });

  // ========== Filtered Data ==========
  const filteredPayments = useMemo(() => {
    let filtered = payments;
    if (searchFromDate) {
      filtered = filtered.filter(p => p.paymentDate >= searchFromDate);
    }
    if (searchToDate) {
      filtered = filtered.filter(p => p.paymentDate <= searchToDate);
    }
    return filtered;
  }, [payments, searchFromDate, searchToDate]);

  const filteredOutstanding = useMemo(() => {
    let filtered = outstandingBills;
    if (osBranch) {
      // In real app, filter by branch
    }
    if (osVendor && osVendor !== "ALL") {
      filtered = filtered.filter(b => b.vendor === osVendor);
    }
    return filtered;
  }, [outstandingBills, osBranch, osVendor]);

  const filteredBankTransactions = useMemo(() => {
    let filtered = bankTransactions;
    if (bankSearch) {
      filtered = filtered.filter(t => 
        t.transactionId.toLowerCase().includes(bankSearch.toLowerCase()) ||
        t.bankName.toLowerCase().includes(bankSearch.toLowerCase())
      );
    }
    return filtered;
  }, [bankTransactions, bankSearch]);

  const filteredRejectedPayments = useMemo(() => {
    let filtered = rejectedPayments;
    if (rejectFromDate) {
      filtered = filtered.filter(p => p.paymentDate >= rejectFromDate);
    }
    if (rejectToDate) {
      filtered = filtered.filter(p => p.paymentDate <= rejectToDate);
    }
    return filtered;
  }, [rejectedPayments, rejectFromDate, rejectToDate]);

  // Calculate TDS Amount
  const calculateTdsAmount = () => {
    const tds = (grossAmount * lessTdsPercent) / 100;
    setLessTdsAmount(tds);
    const paid = grossAmount - tds;
    setPaidAmount(paid);
    setTotalPaidAmount(paid - bankCharges);
  };

  // Calculate totals for multiple vendor payment
  const mvTotals = mvVendors.reduce(
    (acc, v) => ({
      billAmount: acc.billAmount + v.billAmount,
      tds: acc.tds + v.tds,
      balance: acc.balance + v.balance,
      paid: acc.paid + v.paid,
    }),
    { billAmount: 0, tds: 0, balance: 0, paid: 0 }
  );

  // ========== Handlers ==========
  const handleShowVendorPayment = () => {
    alert(`Found ${filteredPayments.length} vendor payments`);
  };

  const toggleSearchColumn = (key: keyof SearchColumnSettings) => {
    setSearchColumnSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleRejectColumn = (key: keyof RejectColumnSettings) => {
    setRejectColumnSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleShowOutstanding = () => {
    alert(`Found ${filteredOutstanding.length} outstanding bills`);
  };

  const handleSelectAllOutstanding = (checked: boolean) => {
    if (checked) {
      setSelectedOutstanding(filteredOutstanding.map(b => b.id));
    } else {
      setSelectedOutstanding([]);
    }
  };

  const handleSelectOutstanding = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedOutstanding([...selectedOutstanding, id]);
    } else {
      setSelectedOutstanding(selectedOutstanding.filter(s => s !== id));
    }
  };

  const handleVendorWisePayment = () => {
    alert("Vendor wise payment processed");
  };

  const handleMultipleVendorPayment = () => {
    alert("Multiple vendor payment processed");
  };

  const handleGenerateBankAdvise = () => {
    alert(`Bank advise generated for ${selectedTransactions.length} transactions`);
  };

  const handleRejectPayment = (paymentId: string) => {
    if (confirm(`Reject payment ${paymentId}?`)) {
      alert(`Payment ${paymentId} rejected`);
    }
  };

  const handleSaveVendorWise = () => {
    if (!vwBranch) alert("Branch is required");
    else if (!vwVendor) alert("Vendor is required");
    else if (!grossAmount) alert("Gross Amount is required");
    else {
      alert(`Vendor payment saved successfully!\nPayment ID: ${paymentId || "PAY-001"}\nAmount: ₹${totalPaidAmount.toLocaleString()}`);
      handleClearVendorWise();
    }
  };

  const handleClearVendorWise = () => {
    setPaymentId("");
    setPaymentDate(new Date().toISOString().split("T")[0]);
    setVwBranch("");
    setVwVendor("");
    setTdsStatus("");
    setPanNo("");
    setModeOfPayment("CASH");
    setInstrumentType("");
    setPaymentBy("");
    setInstrumentNo("");
    setInstrumentDate(new Date().toISOString().split("T")[0]);
    setGrossAmount(0);
    setTdsSection("");
    setLessTdsPercent(0);
    setLessTdsAmount(0);
    setPaidAmount(0);
    setBankCharges(0);
    setTotalPaidAmount(0);
    setBillExpectedDate(new Date().toISOString().split("T")[0]);
    setAdvanceInstructedBy("");
    setVwRemarks("");
    setVwVoucherNo("");
  };

  const handleClearMultipleVendor = () => {
    setMvBranch("");
    setMvPaymentDate(new Date().toISOString().split("T")[0]);
    setMvModeOfPayment("CASH");
    setMvInstrumentType("");
    setMvPaymentBy("");
    setMvInstrumentNo("");
    setMvInstrumentDate(new Date().toISOString().split("T")[0]);
    setMvVendors([]);
    setMvRemarks("");
  };

  return (
    <div className="space-y-6 p-3 sm:p-4 md:p-6 max-w-full overflow-x-hidden">
      <h1 className="text-xl sm:text-2xl font-bold text-primary">Vendor Bill Payment</h1>

      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="outstanding">Outstanding</TabsTrigger>
          <TabsTrigger value="vendorwise">Vendor Wise</TabsTrigger>
          <TabsTrigger value="multiple">Multiple Vendor</TabsTrigger>
          <TabsTrigger value="bankadvise">Bank Advise</TabsTrigger>
          <TabsTrigger value="reject">Reject Payment</TabsTrigger>
        </TabsList>

        {/* ==================== SEARCH TAB ==================== */}
        <TabsContent value="search" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Search Vendor Payments</CardTitle>
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
                <Button onClick={handleShowVendorPayment} className="bg-blue-600 hover:bg-blue-700">
                  <Search className="mr-2 h-4 w-4" /> Show Vendor Payment
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Payment List</CardTitle>
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
                      {searchColumnSettings.paymentId && <TableHead>Payment ID</TableHead>}
                      {searchColumnSettings.referenceNo && <TableHead>Reference #</TableHead>}
                      {searchColumnSettings.paymentDate && <TableHead>Payment Date</TableHead>}
                      {searchColumnSettings.branch && <TableHead>Branch</TableHead>}
                      {searchColumnSettings.vendor && <TableHead>Vendor</TableHead>}
                      {searchColumnSettings.voucherNo && <TableHead>Voucher No.</TableHead>}
                      {searchColumnSettings.paidAmount && <TableHead className="text-right">Paid Amount</TableHead>}
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">No payments found</TableCell>
                      </TableRow>
                    ) : (
                      filteredPayments.map((payment, idx) => (
                        <TableRow key={payment.id}>
                          <TableCell>{idx + 1}</TableCell>
                          {searchColumnSettings.paymentId && <TableCell>{payment.paymentId}</TableCell>}
                          {searchColumnSettings.referenceNo && <TableCell>{payment.referenceNo}</TableCell>}
                          {searchColumnSettings.paymentDate && <TableCell>{payment.paymentDate}</TableCell>}
                          {searchColumnSettings.branch && <TableCell>{payment.branch}</TableCell>}
                          {searchColumnSettings.vendor && <TableCell>{payment.vendor}</TableCell>}
                          {searchColumnSettings.voucherNo && <TableCell>{payment.voucherNo}</TableCell>}
                          {searchColumnSettings.paidAmount && <TableCell className="text-right">₹ {payment.paidAmount.toLocaleString()}</TableCell>}
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="sm"><Printer className="h-4 w-4" /></Button>
                            </div>
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

        {/* ==================== OUTSTANDING PAYMENT TAB ==================== */}
        <TabsContent value="outstanding" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Outstanding Bills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label>Branch <span className="text-red-500">*</span></Label>
                  <Select value={osBranch} onValueChange={setOsBranch}>
                    <SelectTrigger><SelectValue placeholder="Select Branch" /></SelectTrigger>
                    <SelectContent>
                      {branches.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>As On Date <span className="text-red-500">*</span></Label>
                  <Input type="date" value={asOnDate} onChange={(e) => setAsOnDate(e.target.value)} />
                </div>
                <div>
                  <Label>Invoice Category</Label>
                  <Select value={invoiceCategory} onValueChange={setInvoiceCategory}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {invoiceCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Vendor <span className="text-red-500">*</span></Label>
                  <Select value={osVendor} onValueChange={setOsVendor}>
                    <SelectTrigger><SelectValue placeholder="Select Vendor" /></SelectTrigger>
                    <SelectContent>
                      {vendors.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 mt-6">
                <Button onClick={handleShowOutstanding} className="bg-blue-600 hover:bg-blue-700">
                  <Search className="mr-2 h-4 w-4" /> Show O/S Payment
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="overflow-x-auto">
              <div className="min-w-[1000px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead><Checkbox checked={selectedOutstanding.length === filteredOutstanding.length && filteredOutstanding.length > 0} onCheckedChange={handleSelectAllOutstanding} /></TableHead>
                      <TableHead>S#</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Vendor Department</TableHead>
                      <TableHead>Invoice#</TableHead>
                      <TableHead>Invoice Date</TableHead>
                      <TableHead>Received Date</TableHead>
                      <TableHead className="text-right">Bill Amount</TableHead>
                      <TableHead className="text-right">TDS</TableHead>
                      <TableHead className="text-right">Paid</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead>O/S Day's</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOutstanding.map((bill, idx) => (
                      <TableRow key={bill.id}>
                        <TableCell><Checkbox checked={selectedOutstanding.includes(bill.id)} onCheckedChange={(c) => handleSelectOutstanding(bill.id, !!c)} /></TableCell>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{bill.vendor}</TableCell>
                        <TableCell>{bill.vendorDepartment}</TableCell>
                        <TableCell>{bill.invoiceNo}</TableCell>
                        <TableCell>{bill.invoiceDate}</TableCell>
                        <TableCell>{bill.receivedDate}</TableCell>
                        <TableCell className="text-right">₹ {bill.billAmount.toLocaleString()}</TableCell>
                        <TableCell className="text-right">₹ {bill.tds.toLocaleString()}</TableCell>
                        <TableCell className="text-right">₹ {bill.paid.toLocaleString()}</TableCell>
                        <TableCell className="text-right">₹ {bill.balance.toLocaleString()}</TableCell>
                        <TableCell>{bill.osDays}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button className="bg-green-600 hover:bg-green-700">Multiple Vendor Payment / Vendor Wise Payment Button</Button>
          </div>
        </TabsContent>

        {/* ==================== VENDOR WISE PAYMENT TAB ==================== */}
        <TabsContent value="vendorwise" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Wise Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentType} onValueChange={setPaymentType} className="flex gap-6 mb-6">
                <div className="flex items-center space-x-2"><RadioGroupItem value="Payment Against Invoice" id="invoice" /><Label htmlFor="invoice">Payment Against Invoice</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="Advance Payment" id="advance" /><Label htmlFor="advance">Advance Payment</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="Advance Against LHC" id="lhc" /><Label htmlFor="lhc">Advance Against LHC</Label></div>
              </RadioGroup>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div><Label>Payment ID</Label><Input value={paymentId} onChange={(e) => setPaymentId(e.target.value)} placeholder="Auto" /></div>
                <div><Label>Payment Date</Label><Input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} /></div>
                <div><Label>Branch <span className="text-red-500">*</span></Label><Select value={vwBranch} onValueChange={setVwBranch}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{branches.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent></Select></div>
                <div><Label>Vendor <span className="text-red-500">*</span></Label><Select value={vwVendor} onValueChange={setVwVendor}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{vendors.filter(v => v !== "ALL").map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select></div>
                <div><Label>TDS Status</Label><Input value={tdsStatus} onChange={(e) => setTdsStatus(e.target.value)} /></div>
                <div><Label>PAN #</Label><Input value={panNo} onChange={(e) => setPanNo(e.target.value)} /></div>
                <div><Label>Mode Of Payment</Label><Select value={modeOfPayment} onValueChange={setModeOfPayment}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{modeOfPayments.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent></Select></div>
                <div><Label>Instrument Type</Label><Select value={instrumentType} onValueChange={setInstrumentType}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{instrumentTypes.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent></Select></div>
                <div><Label>Payment By</Label><Select value={paymentBy} onValueChange={setPaymentBy}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{paymentByOptions.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div>
                <div><Label>Instrument# / Date</Label><div className="flex gap-2"><Input value={instrumentNo} onChange={(e) => setInstrumentNo(e.target.value)} placeholder="#" className="w-1/2" /><Input type="date" value={instrumentDate} onChange={(e) => setInstrumentDate(e.target.value)} className="w-1/2" /></div></div>
                <div><Label>Gross Amount <span className="text-red-500">*</span></Label><Input type="number" value={grossAmount} onChange={(e) => { setGrossAmount(Number(e.target.value)); calculateTdsAmount(); }} /></div>
                <div><Label>Select TDS Section</Label><Select value={tdsSection} onValueChange={setTdsSection}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{tdsSections.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
                <div><Label>Less TDS @</Label><div className="flex gap-2"><Input type="number" value={lessTdsPercent} onChange={(e) => { setLessTdsPercent(Number(e.target.value)); calculateTdsAmount(); }} className="w-1/2" /><span>%</span><Input type="number" value={lessTdsAmount} readOnly className="w-1/2 bg-muted" /></div></div>
                <div><Label>Paid Amount</Label><Input type="number" value={paidAmount} readOnly className="bg-muted" /></div>
                <div><Label>Bank Charges</Label><Input type="number" value={bankCharges} onChange={(e) => { setBankCharges(Number(e.target.value)); setTotalPaidAmount(paidAmount - Number(e.target.value)); }} /></div>
                <div><Label>Total Paid Amount</Label><Input type="number" value={totalPaidAmount} readOnly className="bg-muted font-semibold" /></div>
                <div><Label>Bill Expected Date</Label><Input type="date" value={billExpectedDate} onChange={(e) => setBillExpectedDate(e.target.value)} /></div>
                <div><Label>Advance Instructed By</Label><Input value={advanceInstructedBy} onChange={(e) => setAdvanceInstructedBy(e.target.value)} /></div>
                <div className="col-span-2"><Label>Remarks</Label><Input value={vwRemarks} onChange={(e) => setVwRemarks(e.target.value)} /></div>
                <div><Label>Voucher#</Label><Input value={vwVoucherNo} onChange={(e) => setVwVoucherNo(e.target.value)} placeholder="Auto" /></div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t mt-6">
                <Button onClick={handleSaveVendorWise} className="bg-green-600 hover:bg-green-700"><Save className="mr-2 h-4 w-4" /> Save</Button>
                <Button onClick={handleClearVendorWise} variant="outline"><RefreshCw className="mr-2 h-4 w-4" /> Clear</Button>
                <Button onClick={handleClearVendorWise} variant="destructive"><X className="mr-2 h-4 w-4" /> Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== MULTIPLE VENDOR PAYMENT TAB ==================== */}
        <TabsContent value="multiple" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Multiple Vendor Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div><Label>Branch <span className="text-red-500">*</span></Label><Select value={mvBranch} onValueChange={setMvBranch}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{branches.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent></Select></div>
                <div><Label>Payment Date <span className="text-red-500">*</span></Label><Input type="date" value={mvPaymentDate} onChange={(e) => setMvPaymentDate(e.target.value)} /></div>
                <div><Label>Mode Of Payment</Label><Select value={mvModeOfPayment} onValueChange={setMvModeOfPayment}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{modeOfPayments.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent></Select></div>
                <div><Label>Instrument Type</Label><Select value={mvInstrumentType} onValueChange={setMvInstrumentType}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{instrumentTypes.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent></Select></div>
                <div><Label>Payment By</Label><Select value={mvPaymentBy} onValueChange={setMvPaymentBy}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{paymentByOptions.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div>
                <div><Label>Instrument# / Date</Label><div className="flex gap-2"><Input value={mvInstrumentNo} onChange={(e) => setMvInstrumentNo(e.target.value)} placeholder="#" className="w-1/2" /><Input type="date" value={mvInstrumentDate} onChange={(e) => setMvInstrumentDate(e.target.value)} className="w-1/2" /></div></div>
              </div>

              <div className="overflow-x-auto mt-6">
                <div className="min-w-[800px]">
                  <Table>
                    <TableHeader>
                      <TableRow><TableHead>S#</TableHead><TableHead>Vendor</TableHead><TableHead>Bill #</TableHead><TableHead>Bill Date</TableHead><TableHead>Received On</TableHead><TableHead className="text-right">Bill Amount</TableHead><TableHead className="text-right">TDS</TableHead><TableHead className="text-right">Balance</TableHead><TableHead className="text-right">Paid</TableHead><TableHead>Action</TableHead></TableRow>
                    </TableHeader>
                    <TableBody>
                      {mvVendors.map((v, idx) => (
                        <TableRow key={v.id}>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell><Input value={v.vendor} onChange={(e) => { const updated = [...mvVendors]; updated[idx].vendor = e.target.value; setMvVendors(updated); }} /></TableCell>
                          <TableCell><Input value={v.billNo} onChange={(e) => { const updated = [...mvVendors]; updated[idx].billNo = e.target.value; setMvVendors(updated); }} /></TableCell>
                          <TableCell><Input type="date" value={v.billDate} onChange={(e) => { const updated = [...mvVendors]; updated[idx].billDate = e.target.value; setMvVendors(updated); }} /></TableCell>
                          <TableCell><Input type="date" value={v.receivedOn} onChange={(e) => { const updated = [...mvVendors]; updated[idx].receivedOn = e.target.value; setMvVendors(updated); }} /></TableCell>
                          <TableCell><Input type="number" value={v.billAmount} className="text-right" onChange={(e) => { const updated = [...mvVendors]; updated[idx].billAmount = Number(e.target.value); setMvVendors(updated); }} /></TableCell>
                          <TableCell><Input type="number" value={v.tds} className="text-right" onChange={(e) => { const updated = [...mvVendors]; updated[idx].tds = Number(e.target.value); setMvVendors(updated); }} /></TableCell>
                          <TableCell className="text-right">₹ {v.balance.toLocaleString()}</TableCell>
                          <TableCell><Input type="number" value={v.paid} className="text-right" onChange={(e) => { const updated = [...mvVendors]; updated[idx].paid = Number(e.target.value); setMvVendors(updated); }} /></TableCell>
                          <TableCell><Button variant="ghost" size="sm" onClick={() => setMvVendors(mvVendors.filter((_, i) => i !== idx))}><Trash2 className="h-4 w-4 text-red-500" /></Button></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <Button variant="outline" onClick={() => setMvVendors([...mvVendors, { id: generateId(), vendor: "", billNo: "", billDate: "", receivedOn: "", billAmount: 0, tds: 0, balance: 0, paid: 0 }])}><Plus className="mr-2 h-4 w-4" /> Add Row</Button>
                <div className="text-sm font-semibold">Total: Bill Amt.: ₹ {mvTotals.billAmount.toLocaleString()} | TDS: ₹ {mvTotals.tds.toLocaleString()} | Balance: ₹ {mvTotals.balance.toLocaleString()} | Paid: ₹ {mvTotals.paid.toLocaleString()}</div>
              </div>

              <div className="mt-6"><Label>Remarks</Label><Input value={mvRemarks} onChange={(e) => setMvRemarks(e.target.value)} /></div>

              <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t mt-6">
                <Button onClick={handleMultipleVendorPayment} className="bg-green-600 hover:bg-green-700"><Save className="mr-2 h-4 w-4" /> Save</Button>
                <Button onClick={handleClearMultipleVendor} variant="outline"><RefreshCw className="mr-2 h-4 w-4" /> Clear</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== GENERATE BANK ADVISE TAB ==================== */}
        <TabsContent value="bankadvise" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Bank Advise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div><Label>Bank</Label><Input value={bankName} onChange={(e) => setBankName(e.target.value)} /></div>
                <div><Label>Date</Label><Input type="date" value={adviseDate} onChange={(e) => setAdviseDate(e.target.value)} /></div>
                <div className="col-span-2"><Label>Search...</Label><Input value={bankSearch} onChange={(e) => setBankSearch(e.target.value)} placeholder="Search by Transaction ID or Bank Name" /></div>
              </div>

              <div className="overflow-x-auto mt-6">
                <Table>
                  <TableHeader>
                    <TableRow><TableHead><Checkbox checked={selectedTransactions.length === filteredBankTransactions.length && filteredBankTransactions.length > 0} onCheckedChange={(c) => { if (c) setSelectedTransactions(filteredBankTransactions.map(t => t.id)); else setSelectedTransactions([]); }} /></TableHead><TableHead>All</TableHead><TableHead>Transaction ID</TableHead><TableHead>Bank Name</TableHead><TableHead className="text-right">Amount</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBankTransactions.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell><Checkbox checked={selectedTransactions.includes(t.id)} onCheckedChange={(c) => { if (c) setSelectedTransactions([...selectedTransactions, t.id]); else setSelectedTransactions(selectedTransactions.filter(s => s !== t.id)); }} /></TableCell>
                        <TableCell>{t.transactionId}</TableCell>
                        <TableCell>{t.transactionId}</TableCell>
                        <TableCell>{t.bankName}</TableCell>
                        <TableCell className="text-right">₹ {t.amount.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end mt-6">
                <Button onClick={handleGenerateBankAdvise} className="bg-blue-600 hover:bg-blue-700">Generate Bank Advise</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== REJECT PAYMENT TAB ==================== */}
        <TabsContent value="reject" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reject Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label>From Date</Label><Input type="date" value={rejectFromDate} onChange={(e) => setRejectFromDate(e.target.value)} /></div>
                <div><Label>To Date</Label><Input type="date" value={rejectToDate} onChange={(e) => setRejectToDate(e.target.value)} /></div>
              </div>
              <div className="flex flex-wrap gap-3 mt-6"><Button onClick={() => alert(`Found ${filteredRejectedPayments.length} payments`)} className="bg-blue-600"><Search className="mr-2 h-4 w-4" /> Search...</Button></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Rejected Payment List</CardTitle>
              <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" size="sm"><Settings className="mr-2 h-4 w-4" /> Column Settings</Button></DropdownMenuTrigger><DropdownMenuContent>{rejectColumnOptions.map((opt) => (<DropdownMenuItem key={opt.key} onSelect={(e) => e.preventDefault()}><div className="flex items-center gap-2"><Checkbox checked={rejectColumnSettings[opt.key as keyof RejectColumnSettings]} onCheckedChange={() => toggleRejectColumn(opt.key as keyof RejectColumnSettings)} /><span>{opt.label}</span></div></DropdownMenuItem>))}</DropdownMenuContent></DropdownMenu>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <div className="min-w-[800px]"><Table><TableHeader><TableRow><TableHead>S#</TableHead>{rejectColumnSettings.paymentId && <TableHead>Payment ID</TableHead>}{rejectColumnSettings.paymentDate && <TableHead>Payment Date</TableHead>}{rejectColumnSettings.branch && <TableHead>Branch</TableHead>}{rejectColumnSettings.vendor && <TableHead>Vendor</TableHead>}{rejectColumnSettings.voucherNo && <TableHead>Voucher No.</TableHead>}{rejectColumnSettings.paidAmount && <TableHead className="text-right">Paid Amount</TableHead>}<TableHead>Action</TableHead></TableRow></TableHeader>
              <TableBody>{filteredRejectedPayments.map((p, idx) => (<TableRow key={p.id}><TableCell>{idx + 1}</TableCell>{rejectColumnSettings.paymentId && <TableCell>{p.paymentId}</TableCell>}{rejectColumnSettings.paymentDate && <TableCell>{p.paymentDate}</TableCell>}{rejectColumnSettings.branch && <TableCell>{p.branch}</TableCell>}{rejectColumnSettings.vendor && <TableCell>{p.vendor}</TableCell>}{rejectColumnSettings.voucherNo && <TableCell>{p.voucherNo}</TableCell>}{rejectColumnSettings.paidAmount && <TableCell className="text-right">₹ {p.paidAmount.toLocaleString()}</TableCell>}<TableCell><Button variant="destructive" size="sm" onClick={() => handleRejectPayment(p.paymentId)}>Reject</Button></TableCell></TableRow>))}</TableBody></Table></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}