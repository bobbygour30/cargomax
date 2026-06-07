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
import { Plus, Trash2, Save, RefreshCw, X, Eye, Search } from "lucide-react";

// ==================== Types ====================
interface LHC {
  id: string;
  lhcNo: string;
  lhcDate: string;
  despatchFrom: string;
  despatchTo: string;
  modeName: string;
  vendor: string;
  paymentVendor: string;
  lhcAmount: number;
  regNo: string;
  broker: string;
  pan: string;
  branch: string;
  tds: number;
  advance: number;
  cashAdvance: number;
  bankAdvance: number;
  petroCardAdvance: number;
  advancePaid: number;
  pendingAdvance: number;
  paidAmount: number;
  detention: number;
  detentionNotRecoverable: number;
}

interface PaymentAdvice {
  id: string;
  adviceNo: string;
  adviceDate: string;
  branch: string;
  vehicleNo: string;
  vendor: string;
  debitLedger: string;
  paymentMode: string;
  amount: number;
  detention: number;
  customer: string;
  vehicleType: string;
  capacity: string;
  gcDate: string;
  voucherNo: string;
  lhcIds: string[];
}

interface AddLessDetail {
  id: string;
  particulars: string;
  addLess: "+" | "-";
  tds: boolean;
  tdsPercent: number;
  grossAmount: number;
  tdsAmount: number;
  amount: number;
  remarks: string;
}

// Helper
const generateId = () => Math.random().toString(36).substr(2, 9);

// Mock LHC Data
const mockLHCs: LHC[] = [
  {
    id: "1",
    lhcNo: "LHC-001",
    lhcDate: "2026-05-10",
    despatchFrom: "Mumbai",
    despatchTo: "Delhi",
    modeName: "SURFACE",
    vendor: "ABC Transport",
    paymentVendor: "ABC Transport",
    lhcAmount: 50000,
    regNo: "MH-01-AB-1234",
    broker: "Ramesh Broker",
    pan: "AAAPL1234C",
    branch: "Mumbai HO",
    tds: 2500,
    advance: 10000,
    cashAdvance: 5000,
    bankAdvance: 5000,
    petroCardAdvance: 0,
    advancePaid: 10000,
    pendingAdvance: 40000,
    paidAmount: 10000,
    detention: 0,
    detentionNotRecoverable: 0,
  },
  {
    id: "2",
    lhcNo: "LHC-002",
    lhcDate: "2026-05-11",
    despatchFrom: "Delhi",
    despatchTo: "Chennai",
    modeName: "SURFACE",
    vendor: "XYZ Logistics",
    paymentVendor: "XYZ Logistics",
    lhcAmount: 35000,
    regNo: "DL-02-CD-5678",
    broker: "Suresh Broker",
    pan: "BBBPL5678D",
    branch: "Delhi Branch",
    tds: 1750,
    advance: 5000,
    cashAdvance: 3000,
    bankAdvance: 2000,
    petroCardAdvance: 0,
    advancePaid: 5000,
    pendingAdvance: 30000,
    paidAmount: 5000,
    detention: 0,
    detentionNotRecoverable: 0,
  },
  {
    id: "3",
    lhcNo: "LHC-003",
    lhcDate: "2026-05-12",
    despatchFrom: "Chennai",
    despatchTo: "Bangalore",
    modeName: "SURFACE",
    vendor: "PQR Carriers",
    paymentVendor: "PQR Carriers",
    lhcAmount: 25000,
    regNo: "TN-03-EF-9012",
    broker: "Mahesh Broker",
    pan: "CCCPL9012E",
    branch: "Chennai Branch",
    tds: 1250,
    advance: 3000,
    cashAdvance: 2000,
    bankAdvance: 1000,
    petroCardAdvance: 0,
    advancePaid: 3000,
    pendingAdvance: 22000,
    paidAmount: 3000,
    detention: 0,
    detentionNotRecoverable: 0,
  },
];

// Mock Payment Advices for Search Tab
const mockPaymentAdvices: PaymentAdvice[] = [
  {
    id: "pa1",
    adviceNo: "ADV-001",
    adviceDate: "2026-05-13",
    branch: "Mumbai HO",
    vehicleNo: "MH-01-AB-1234",
    vendor: "ABC Transport",
    debitLedger: "SBI Current Account",
    paymentMode: "BANK TRANSFER",
    amount: 40000,
    detention: 0,
    customer: "ABC Corp",
    vehicleType: "Container",
    capacity: "20 Ton",
    gcDate: "2026-05-10",
    voucherNo: "VCH-001",
    lhcIds: ["1"],
  },
  {
    id: "pa2",
    adviceNo: "ADV-002",
    adviceDate: "2026-05-13",
    branch: "Delhi Branch",
    vehicleNo: "DL-02-CD-5678",
    vendor: "XYZ Logistics",
    debitLedger: "HDFC Bank",
    paymentMode: "CHEQUE",
    amount: 30000,
    detention: 500,
    customer: "XYZ Ltd",
    vehicleType: "Open Body",
    capacity: "15 Ton",
    gcDate: "2026-05-11",
    voucherNo: "VCH-002",
    lhcIds: ["2"],
  },
  {
    id: "pa3",
    adviceNo: "ADV-003",
    adviceDate: "2026-05-12",
    branch: "Chennai Branch",
    vehicleNo: "TN-03-EF-9012",
    vendor: "PQR Carriers",
    debitLedger: "ICICI Bank",
    paymentMode: "CASH",
    amount: 22000,
    detention: 0,
    customer: "PQR Industries",
    vehicleType: "Closed Body",
    capacity: "10 Ton",
    gcDate: "2026-05-12",
    voucherNo: "VCH-003",
    lhcIds: ["3"],
  },
];

// Mock Vehicles
const vehicles = ["ALL", "MH-01-AB-1234", "DL-02-CD-5678", "TN-03-EF-9012", "KA-04-GH-3456"];

// Mock Vendors
const vendors = ["ALL", "ABC Transport", "XYZ Logistics", "PQR Carriers", "LMN Freight", "RST Movers"];

// Mock Branches
const branches = ["ALL", "Mumbai HO", "Delhi Branch", "Chennai Branch", "Kolkata Branch", "Bangalore Branch"];

export default function LHCAdvancePayment() {
  // ========== Pending Tab State ==========
  const [pendingBranch, setPendingBranch] = useState("");
  const [pendingVendor, setPendingVendor] = useState("ALL");
  const [asOnDate, setAsOnDate] = useState(new Date().toISOString().split("T")[0]);
  const [pendingRegNo, setPendingRegNo] = useState("ALL");
  const [driver, setDriver] = useState("");
  const [selectedLHCs, setSelectedLHCs] = useState<string[]>([]);
  const [lhcData] = useState<LHC[]>(mockLHCs);

  // ========== Entry Tab State ==========
  const [adviceNo, setAdviceNo] = useState("");
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split("T")[0]);
  const [entryBranch, setEntryBranch] = useState("");
  const [selectedLHCEntries, setSelectedLHCEntries] = useState<LHC[]>([]);
  const [savedAdvices, setSavedAdvices] = useState<PaymentAdvice[]>(mockPaymentAdvices);

  // Add/Less Details
  const [addLessDetails, setAddLessDetails] = useState<AddLessDetail[]>([
    {
      id: generateId(),
      particulars: "",
      addLess: "+",
      tds: false,
      tdsPercent: 0,
      grossAmount: 0,
      tdsAmount: 0,
      amount: 0,
      remarks: "",
    },
  ]);

  // Payment Details
  const [paymentMode, setPaymentMode] = useState("CASH");
  const [payableAmount, setPayableAmount] = useState(0);
  const [instrumentType, setInstrumentType] = useState("");
  const [instrumentNo, setInstrumentNo] = useState("");
  const [instrumentDate, setInstrumentDate] = useState(new Date().toISOString().split("T")[0]);
  const [creditLedger, setCreditLedger] = useState("");
  const [paymentRemarks, setPaymentRemarks] = useState("");

  // ========== Search Tab State ==========
  const [searchBranch, setSearchBranch] = useState("");
  const [startPeriod, setStartPeriod] = useState(new Date().toISOString().split("T")[0]);
  const [endPeriod, setEndPeriod] = useState(new Date().toISOString().split("T")[0]);
  const [searchVehicle, setSearchVehicle] = useState("ALL");
  const [searchVendor, setSearchVendor] = useState("ALL");
  const [checkboxFilter, setCheckboxFilter] = useState(false);
  const [selectedAdvice, setSelectedAdvice] = useState<PaymentAdvice | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // ========== Dialog State ==========
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentAdvice | null>(null);

  // ========== Filtered LHC for Pending Tab ==========
  const filteredLHCs = useMemo(() => {
    let filtered = lhcData;

    if (pendingBranch && pendingBranch !== "ALL") {
      filtered = filtered.filter(l => l.branch === pendingBranch);
    }
    if (pendingVendor && pendingVendor !== "ALL") {
      filtered = filtered.filter(l => l.vendor === pendingVendor);
    }
    if (pendingRegNo && pendingRegNo !== "ALL") {
      filtered = filtered.filter(l => l.regNo === pendingRegNo);
    }
    if (driver) {
      filtered = filtered.filter(l => l.broker?.toLowerCase().includes(driver.toLowerCase()));
    }

    return filtered;
  }, [lhcData, pendingBranch, pendingVendor, pendingRegNo, driver]);

  // ========== Filtered Payment Advices for Search Tab ==========
  const filteredAdvices = useMemo(() => {
    let filtered = savedAdvices;

    if (searchBranch && searchBranch !== "ALL") {
      filtered = filtered.filter(a => a.branch === searchBranch);
    }
    if (startPeriod) {
      filtered = filtered.filter(a => a.adviceDate >= startPeriod);
    }
    if (endPeriod) {
      filtered = filtered.filter(a => a.adviceDate <= endPeriod);
    }
    if (searchVehicle && searchVehicle !== "ALL") {
      filtered = filtered.filter(a => a.vehicleNo === searchVehicle);
    }
    if (searchVendor && searchVendor !== "ALL") {
      filtered = filtered.filter(a => a.vendor === searchVendor);
    }
    if (checkboxFilter) {
      // Example: Show only amounts > 25000
      filtered = filtered.filter(a => a.amount > 25000);
    }

    return filtered;
  }, [savedAdvices, searchBranch, startPeriod, endPeriod, searchVehicle, searchVendor, checkboxFilter]);

  // ========== Handlers - Pending Tab ==========
  const handleShowPendingLHC = () => {
    alert(`Found ${filteredLHCs.length} pending LHC(s)`);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLHCs(filteredLHCs.map(l => l.id));
    } else {
      setSelectedLHCs([]);
    }
  };

  const handleSelectLHC = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedLHCs([...selectedLHCs, id]);
    } else {
      setSelectedLHCs(selectedLHCs.filter(l => l !== id));
    }
  };

  const handleProceed = () => {
    if (selectedLHCs.length === 0) {
      alert("Please select at least one LHC to proceed");
      return;
    }
    const selected = lhcData.filter(l => selectedLHCs.includes(l.id));
    setSelectedLHCEntries(selected);
    const total = selected.reduce((sum, l) => sum + l.pendingAdvance, 0);
    setPayableAmount(total);
    alert(`Proceeding with ${selected.length} LHC(s). Total pending advance: ₹${total.toLocaleString()}`);
  };

  const handleClearPending = () => {
    setPendingBranch("");
    setPendingVendor("ALL");
    setAsOnDate(new Date().toISOString().split("T")[0]);
    setPendingRegNo("ALL");
    setDriver("");
    setSelectedLHCs([]);
  };

  // ========== Add/Less Details Handlers ==========
  const addAddLessRow = () => {
    setAddLessDetails([
      ...addLessDetails,
      {
        id: generateId(),
        particulars: "",
        addLess: "+",
        tds: false,
        tdsPercent: 0,
        grossAmount: 0,
        tdsAmount: 0,
        amount: 0,
        remarks: "",
      },
    ]);
  };

  const updateAddLessRow = (id: string, field: keyof AddLessDetail, value: any) => {
    setAddLessDetails(prev =>
      prev.map(row => {
        if (row.id === id) {
          const updated = { ...row, [field]: value };
          if (field === "grossAmount" || field === "tdsPercent" || field === "tds") {
            const tdsAmount = updated.tds ? (updated.grossAmount * (updated.tdsPercent / 100)) : 0;
            updated.tdsAmount = tdsAmount;
            updated.amount = updated.addLess === "+" 
              ? updated.grossAmount - tdsAmount 
              : -(updated.grossAmount - tdsAmount);
          }
          return updated;
        }
        return row;
      })
    );
  };

  const deleteAddLessRow = (id: string) => {
    setAddLessDetails(prev => prev.filter(row => row.id !== id));
  };

  const subtotal = addLessDetails.reduce((sum, row) => sum + (row.amount || 0), 0);

  // ========== Entry Tab Handlers ==========
  const handleSave = () => {
    if (!entryBranch) {
      alert("Branch is required");
      return;
    }
    if (!creditLedger) {
      alert("Credit Ledger is required");
      return;
    }
    if (selectedLHCEntries.length === 0) {
      alert("Please select LHCs from Pending tab first");
      return;
    }

    const newAdvice: PaymentAdvice = {
      id: generateId(),
      adviceNo: adviceNo || `ADV-${String(savedAdvices.length + 1).padStart(3, '0')}`,
      adviceDate: entryDate,
      branch: entryBranch,
      vehicleNo: selectedLHCEntries[0]?.regNo || "",
      vendor: selectedLHCEntries[0]?.vendor || "",
      debitLedger: creditLedger,
      paymentMode: paymentMode,
      amount: payableAmount + subtotal,
      detention: selectedLHCEntries.reduce((sum, l) => sum + l.detention, 0),
      customer: selectedLHCEntries[0]?.vendor || "",
      vehicleType: "Standard",
      capacity: "20 Ton",
      gcDate: entryDate,
      voucherNo: `VCH-${Date.now()}`,
      lhcIds: selectedLHCEntries.map(l => l.id),
    };

    setSavedAdvices([...savedAdvices, newAdvice]);
    alert(`Payment saved successfully!\nAdvice No: ${newAdvice.adviceNo}\nTotal Amount: ₹${(payableAmount + subtotal).toLocaleString()}`);
    handleClearEntry();
  };

  const handleClearEntry = () => {
    setAdviceNo("");
    setEntryDate(new Date().toISOString().split("T")[0]);
    setEntryBranch("");
    setSelectedLHCEntries([]);
    setAddLessDetails([
      {
        id: generateId(),
        particulars: "",
        addLess: "+",
        tds: false,
        tdsPercent: 0,
        grossAmount: 0,
        tdsAmount: 0,
        amount: 0,
        remarks: "",
      },
    ]);
    setPaymentMode("CASH");
    setPayableAmount(0);
    setInstrumentType("");
    setInstrumentNo("");
    setInstrumentDate(new Date().toISOString().split("T")[0]);
    setCreditLedger("");
    setPaymentRemarks("");
  };

  const handleCancel = () => {
    if (confirm("Cancel all changes? Data will be lost.")) {
      handleClearEntry();
    }
  };

  // ========== Search Tab Handlers ==========
  const handleShowDetails = () => {
    alert(`Found ${filteredAdvices.length} payment advices`);
  };

  const handleClearSearch = () => {
    setSearchBranch("");
    setStartPeriod(new Date().toISOString().split("T")[0]);
    setEndPeriod(new Date().toISOString().split("T")[0]);
    setSearchVehicle("ALL");
    setSearchVendor("ALL");
    setCheckboxFilter(false);
  };

  const handleViewDetails = (advice: PaymentAdvice) => {
    setSelectedPayment(advice);
    setViewDialogOpen(true);
  };

  return (
    <div className="space-y-6 p-3 sm:p-4 md:p-6 max-w-full overflow-x-hidden">
      <h1 className="text-xl sm:text-2xl font-bold text-primary">LHC Advance Payment</h1>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending LHC</TabsTrigger>
          <TabsTrigger value="entry">Entry</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
        </TabsList>

        {/* ==================== PENDING TAB ==================== */}
        <TabsContent value="pending" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filter Pending LHC</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label>Branch <span className="text-red-500">*</span></Label>
                  <Select value={pendingBranch} onValueChange={setPendingBranch}>
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
                  <Label>Vendor <span className="text-red-500">*</span></Label>
                  <Select value={pendingVendor} onValueChange={setPendingVendor}>
                    <SelectTrigger><SelectValue placeholder="Select Vendor" /></SelectTrigger>
                    <SelectContent>
                      {vendors.map(v => (
                        <SelectItem key={v} value={v}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>As On Date <span className="text-red-500">*</span></Label>
                  <Input type="date" value={asOnDate} onChange={(e) => setAsOnDate(e.target.value)} />
                </div>
                <div>
                  <Label>Reg # <span className="text-red-500">*</span></Label>
                  <Select value={pendingRegNo} onValueChange={setPendingRegNo}>
                    <SelectTrigger><SelectValue placeholder="Select Reg #" /></SelectTrigger>
                    <SelectContent>
                      {vehicles.map(v => (
                        <SelectItem key={v} value={v}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-2">
                  <Label>Driver</Label>
                  <Input value={driver} onChange={(e) => setDriver(e.target.value)} placeholder="Enter driver name" />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                <Button onClick={handleShowPendingLHC} className="bg-blue-600 hover:bg-blue-700">
                  <Eye className="mr-2 h-4 w-4" /> Show Pending LHC
                </Button>
                <Button onClick={handleClearPending} variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" /> Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pending LHC Table */}
          <Card>
            <CardContent className="overflow-x-auto p-0 sm:p-4">
              <div className="min-w-[800px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedLHCs.length === filteredLHCs.length && filteredLHCs.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>S #</TableHead>
                      <TableHead>LHC #</TableHead>
                      <TableHead>LHC Date</TableHead>
                      <TableHead>Despatch From</TableHead>
                      <TableHead>Despatch To</TableHead>
                      <TableHead>Mode Name</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Payment Vendor</TableHead>
                      <TableHead>LHC Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLHCs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                          No pending LHC found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLHCs.map((lhc, idx) => (
                        <TableRow key={lhc.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedLHCs.includes(lhc.id)}
                              onCheckedChange={(checked) => handleSelectLHC(lhc.id, !!checked)}
                            />
                          </TableCell>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell className="font-medium">{lhc.lhcNo}</TableCell>
                          <TableCell>{lhc.lhcDate}</TableCell>
                          <TableCell>{lhc.despatchFrom}</TableCell>
                          <TableCell>{lhc.despatchTo}</TableCell>
                          <TableCell>{lhc.modeName}</TableCell>
                          <TableCell>{lhc.vendor}</TableCell>
                          <TableCell>{lhc.paymentVendor}</TableCell>
                          <TableCell className="text-right">₹ {lhc.lhcAmount.toLocaleString()}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-end">
            <Button onClick={handleProceed} className="bg-green-600 hover:bg-green-700">
              Proceed
            </Button>
            <Button onClick={handleClearPending} variant="outline">
              Clear
            </Button>
          </div>
        </TabsContent>

        {/* ==================== ENTRY TAB ==================== */}
        <TabsContent value="entry" className="mt-6 space-y-6">
          {/* Advice Header */}
          <Card>
            <CardHeader>
              <CardTitle>Advice Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label>Advice No.</Label>
                  <Input value={adviceNo} onChange={(e) => setAdviceNo(e.target.value)} placeholder="Auto-generated" />
                </div>
                <div>
                  <Label>Date <span className="text-red-500">*</span></Label>
                  <Input type="date" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} />
                </div>
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
              </div>
            </CardContent>
          </Card>

          {/* Selected LHC Table */}
          <Card>
            <CardHeader>
              <CardTitle>Selected LHC for Payment</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <div className="min-w-[1200px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>S#</TableHead>
                      <TableHead>LHC #</TableHead>
                      <TableHead>LHC Date</TableHead>
                      <TableHead>Reg #</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Broker</TableHead>
                      <TableHead>PAN</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Despatch To</TableHead>
                      <TableHead>Debit Ledger</TableHead>
                      <TableHead>LHC Amount</TableHead>
                      <TableHead>TDS</TableHead>
                      <TableHead>Advance</TableHead>
                      <TableHead>Cash Advance</TableHead>
                      <TableHead>Bank Advance</TableHead>
                      <TableHead>Petro Card Advance</TableHead>
                      <TableHead>Advance Paid</TableHead>
                      <TableHead>Pending Advance</TableHead>
                      <TableHead>Paid Amount</TableHead>
                      <TableHead>Detention</TableHead>
                      <TableHead>Detention Not Recoverable</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedLHCEntries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={22} className="text-center py-8 text-muted-foreground">
                          No LHC selected. Please go to Pending tab and select LHCs.
                        </TableCell>
                      </TableRow>
                    ) : (
                      selectedLHCEntries.map((lhc, idx) => (
                        <TableRow key={lhc.id}>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>{lhc.lhcNo}</TableCell>
                          <TableCell>{lhc.lhcDate}</TableCell>
                          <TableCell>{lhc.regNo}</TableCell>
                          <TableCell>{lhc.vendor}</TableCell>
                          <TableCell>{lhc.broker}</TableCell>
                          <TableCell>{lhc.pan}</TableCell>
                          <TableCell>{lhc.branch}</TableCell>
                          <TableCell>{lhc.despatchTo}</TableCell>
                          <TableCell>-</TableCell>
                          <TableCell className="text-right">₹ {lhc.lhcAmount.toLocaleString()}</TableCell>
                          <TableCell className="text-right">₹ {lhc.tds.toLocaleString()}</TableCell>
                          <TableCell className="text-right">₹ {lhc.advance.toLocaleString()}</TableCell>
                          <TableCell className="text-right">₹ {lhc.cashAdvance.toLocaleString()}</TableCell>
                          <TableCell className="text-right">₹ {lhc.bankAdvance.toLocaleString()}</TableCell>
                          <TableCell className="text-right">₹ {lhc.petroCardAdvance.toLocaleString()}</TableCell>
                          <TableCell className="text-right">₹ {lhc.advancePaid.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-semibold text-blue-600">₹ {lhc.pendingAdvance.toLocaleString()}</TableCell>
                          <TableCell className="text-right">₹ {lhc.paidAmount.toLocaleString()}</TableCell>
                          <TableCell className="text-right">₹ {lhc.detention.toLocaleString()}</TableCell>
                          <TableCell className="text-right">₹ {lhc.detentionNotRecoverable.toLocaleString()}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => alert(`Edit ${lhc.lhcNo}`)}>
                              Edit
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

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT: Add/Less Details */}
            <Card>
              <CardHeader className="pb-2 flex flex-row justify-between items-center">
                <CardTitle>Add/Less Details</CardTitle>
                <Button variant="outline" size="sm" onClick={addAddLessRow}>
                  <Plus className="h-4 w-4 mr-1" /> Add More
                </Button>
              </CardHeader>
              <CardContent className="overflow-x-auto p-0 sm:p-2">
                <div className="min-w-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>S#</TableHead>
                        <TableHead>Particulars</TableHead>
                        <TableHead>Add/Less</TableHead>
                        <TableHead>TDS</TableHead>
                        <TableHead>TDS %</TableHead>
                        <TableHead>Gross Amount</TableHead>
                        <TableHead>TDS Amount</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Remarks</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {addLessDetails.map((row, idx) => (
                        <TableRow key={row.id}>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>
                            <Input value={row.particulars} onChange={(e) => updateAddLessRow(row.id, "particulars", e.target.value)} />
                          </TableCell>
                          <TableCell>
                            <Select value={row.addLess} onValueChange={(v: "+" | "-") => updateAddLessRow(row.id, "addLess", v)}>
                              <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                              <SelectContent><SelectItem value="+">+</SelectItem><SelectItem value="-">-</SelectItem></SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Checkbox checked={row.tds} onCheckedChange={(c) => updateAddLessRow(row.id, "tds", !!c)} />
                          </TableCell>
                          <TableCell>
                            <Input type="number" value={row.tdsPercent} onChange={(e) => updateAddLessRow(row.id, "tdsPercent", Number(e.target.value))} className="w-20" disabled={!row.tds} />
                          </TableCell>
                          <TableCell>
                            <Input type="number" value={row.grossAmount} onChange={(e) => updateAddLessRow(row.id, "grossAmount", Number(e.target.value))} className="w-28" />
                          </TableCell>
                          <TableCell className="text-right">{row.tdsAmount.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-semibold">{row.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <Input value={row.remarks} onChange={(e) => updateAddLessRow(row.id, "remarks", e.target.value)} />
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => deleteAddLessRow(row.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-end p-4 font-bold text-lg">
                  SUBTOTAL: <span className="ml-2 text-blue-600">₹ {subtotal.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* RIGHT: Payment Details */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Payment Mode <span className="text-red-500">*</span></Label>
                    <Select value={paymentMode} onValueChange={setPaymentMode}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CASH">CASH</SelectItem>
                        <SelectItem value="CHEQUE">CHEQUE</SelectItem>
                        <SelectItem value="BANK TRANSFER">BANK TRANSFER</SelectItem>
                        <SelectItem value="NEFT">NEFT</SelectItem>
                        <SelectItem value="RTGS">RTGS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Payable Amount</Label>
                    <Input type="number" value={payableAmount + subtotal} readOnly className="bg-muted font-semibold" />
                  </div>
                  <div>
                    <Label>Instrument Type</Label>
                    <Select value={instrumentType} onValueChange={setInstrumentType}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cheque">Cheque</SelectItem>
                        <SelectItem value="DD">DD</SelectItem>
                        <SelectItem value="PO">PO</SelectItem>
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
                    <Label>Credit Ledger <span className="text-red-500">*</span></Label>
                    <Input value={creditLedger} onChange={(e) => setCreditLedger(e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Remarks</Label>
                    <Input value={paymentRemarks} onChange={(e) => setPaymentRemarks(e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

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
              <CardTitle>Search Payment Advices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label>Branch</Label>
                  <Select value={searchBranch} onValueChange={setSearchBranch}>
                    <SelectTrigger><SelectValue placeholder="All Branches" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">ALL</SelectItem>
                      {branches.filter(b => b !== "ALL").map(b => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Period From <span className="text-red-500">*</span></Label>
                  <Input type="date" value={startPeriod} onChange={(e) => setStartPeriod(e.target.value)} />
                </div>
                <div>
                  <Label>Period To <span className="text-red-500">*</span></Label>
                  <Input type="date" value={endPeriod} onChange={(e) => setEndPeriod(e.target.value)} />
                </div>
                <div>
                  <Label>Vehicle #</Label>
                  <Select value={searchVehicle} onValueChange={setSearchVehicle}>
                    <SelectTrigger><SelectValue placeholder="ALL" /></SelectTrigger>
                    <SelectContent>
                      {vehicles.map(v => (
                        <SelectItem key={v} value={v}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Vendor</Label>
                  <Select value={searchVendor} onValueChange={setSearchVendor}>
                    <SelectTrigger><SelectValue placeholder="ALL" /></SelectTrigger>
                    <SelectContent>
                      {vendors.map(v => (
                        <SelectItem key={v} value={v}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Checkbox checked={checkboxFilter} onCheckedChange={(c) => setCheckboxFilter(!!c)} />
                  <Label>Amount &gt; 25,000</Label>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                <Button onClick={handleShowDetails} className="bg-blue-600 hover:bg-blue-700">
                  <Search className="mr-2 h-4 w-4" /> Show Details
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
              <CardTitle>Payment Advice List</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <div className="min-w-[1000px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>S #</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Advice No.</TableHead>
                      <TableHead>Advice Date</TableHead>
                      <TableHead>Vehicle #</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Debit Ledger</TableHead>
                      <TableHead>Payment Mode</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Detention</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Vehicle Type</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>GC Date</TableHead>
                      <TableHead>Voucher #</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAdvices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={16} className="text-center py-8 text-muted-foreground">
                          No payment advices found matching the criteria.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAdvices.map((advice, idx) => (
                        <TableRow key={advice.id}>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>{advice.branch}</TableCell>
                          <TableCell className="font-medium">{advice.adviceNo}</TableCell>
                          <TableCell>{advice.adviceDate}</TableCell>
                          <TableCell>{advice.vehicleNo}</TableCell>
                          <TableCell>{advice.vendor}</TableCell>
                          <TableCell>{advice.debitLedger}</TableCell>
                          <TableCell>{advice.paymentMode}</TableCell>
                          <TableCell className="text-right">₹ {advice.amount.toLocaleString()}</TableCell>
                          <TableCell className="text-right">₹ {advice.detention.toLocaleString()}</TableCell>
                          <TableCell>{advice.customer}</TableCell>
                          <TableCell>{advice.vehicleType}</TableCell>
                          <TableCell>{advice.capacity}</TableCell>
                          <TableCell>{advice.gcDate}</TableCell>
                          <TableCell>{advice.voucherNo}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => handleViewDetails(advice)}>
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
          {filteredAdvices.length > 0 && (
            <div className="text-sm text-muted-foreground border-t pt-3 flex justify-between">
              <span>Total Records: {filteredAdvices.length}</span>
              <span>
                Total Amount: ₹ {filteredAdvices.reduce((sum, a) => sum + a.amount, 0).toLocaleString()}
              </span>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment Advice Details</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div><Label>Advice No.</Label><p className="font-medium">{selectedPayment.adviceNo}</p></div>
              <div><Label>Advice Date</Label><p className="font-medium">{selectedPayment.adviceDate}</p></div>
              <div><Label>Branch</Label><p className="font-medium">{selectedPayment.branch}</p></div>
              <div><Label>Vehicle #</Label><p className="font-medium">{selectedPayment.vehicleNo}</p></div>
              <div><Label>Vendor</Label><p className="font-medium">{selectedPayment.vendor}</p></div>
              <div><Label>Debit Ledger</Label><p className="font-medium">{selectedPayment.debitLedger}</p></div>
              <div><Label>Payment Mode</Label><p className="font-medium">{selectedPayment.paymentMode}</p></div>
              <div><Label>Amount</Label><p className="font-medium text-blue-600">₹ {selectedPayment.amount.toLocaleString()}</p></div>
              <div><Label>Detention</Label><p className="font-medium">₹ {selectedPayment.detention.toLocaleString()}</p></div>
              <div><Label>Customer</Label><p className="font-medium">{selectedPayment.customer}</p></div>
              <div><Label>Vehicle Type</Label><p className="font-medium">{selectedPayment.vehicleType}</p></div>
              <div><Label>Capacity</Label><p className="font-medium">{selectedPayment.capacity}</p></div>
              <div><Label>GC Date</Label><p className="font-medium">{selectedPayment.gcDate}</p></div>
              <div><Label>Voucher #</Label><p className="font-medium">{selectedPayment.voucherNo}</p></div>
            </div>
          )}
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}