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
import { 
  Plus, Trash2, Save, RefreshCw, X, Eye, Search, Settings, 
  Upload, FileSpreadsheet, Package, FileText, Printer 
} from "lucide-react";

// ==================== Types ====================
interface VendorBillReceipt {
  id: string;
  receiptId: string;
  date: string;
  poNo: string;
  referenceNo: string;
  invoiceNo: string;
  invoiceCategory: string;
  branch: string;
  divisionName: string;
  vendor: string;
  vendorDepartment: string;
  subTotal: number;
  gstAmount: number;
  billAmount: number;
  tdsAmount: number;
  advanceAdjusted: number;
  netPayable: number;
  billStatus: string;
  voucherNo: string;
  balancePayable: number;
  paymentTerms: string;
}

interface PendingPO {
  id: string;
  branchName: string;
  vendorName: string;
  poId: string;
  poNo: string;
  poDate: string;
  noOfItems: number;
  deliveryDate: string;
  purchaseValue: number;
  itemsList: string;
}

interface BillRow {
  id: string;
  particulars: string;
  sign: "+" | "-";
  percent: number;
  applicable: string;
  amount: number;
  roundOff: number;
  remarks: string;
}

// Column Settings Types
interface SearchColumnSettings {
  receiptId: boolean;
  date: boolean;
  poNo: boolean;
  referenceNo: boolean;
  invoiceNo: boolean;
  invoiceCategory: boolean;
  branch: boolean;
  divisionName: boolean;
  vendor: boolean;
  vendorDepartment: boolean;
  subTotal: boolean;
  gstAmount: boolean;
  billAmount: boolean;
  tdsAmount: boolean;
  advanceAdjusted: boolean;
  netPayable: boolean;
  billStatus: boolean;
  voucherNo: boolean;
  balancePayable: boolean;
  paymentTerms: boolean;
}

interface SearchColumnOption {
  key: keyof SearchColumnSettings;
  label: string;
}

// Helper
const generateId = (): string => Math.random().toString(36).substr(2, 9);

// Mock Data
const mockVendorBillReceipts: VendorBillReceipt[] = [
  {
    id: "1",
    receiptId: "REC-001",
    date: "2026-05-14",
    poNo: "PO-001",
    referenceNo: "REF-001",
    invoiceNo: "INV-001",
    invoiceCategory: "Purchase",
    branch: "Mumbai HO",
    divisionName: "Logistics",
    vendor: "ABC Transport",
    vendorDepartment: "Supply Chain",
    subTotal: 50000,
    gstAmount: 4500,
    billAmount: 54500,
    tdsAmount: 2500,
    advanceAdjusted: 0,
    netPayable: 52000,
    billStatus: "Pending",
    voucherNo: "VCH-001",
    balancePayable: 52000,
    paymentTerms: "Net 30",
  },
  {
    id: "2",
    receiptId: "REC-002",
    date: "2026-05-13",
    poNo: "PO-002",
    referenceNo: "REF-002",
    invoiceNo: "INV-002",
    invoiceCategory: "Service",
    branch: "Delhi Branch",
    divisionName: "Operations",
    vendor: "XYZ Logistics",
    vendorDepartment: "Transport",
    subTotal: 35000,
    gstAmount: 3150,
    billAmount: 38150,
    tdsAmount: 1750,
    advanceAdjusted: 5000,
    netPayable: 31400,
    billStatus: "Approved",
    voucherNo: "VCH-002",
    balancePayable: 26400,
    paymentTerms: "Net 15",
  },
];

const mockPendingPOs: PendingPO[] = [
  {
    id: "1",
    branchName: "Mumbai HO",
    vendorName: "ABC Transport",
    poId: "POID-001",
    poNo: "PO-001",
    poDate: "2026-05-01",
    noOfItems: 5,
    deliveryDate: "2026-05-15",
    purchaseValue: 50000,
    itemsList: "Item1, Item2, Item3",
  },
  {
    id: "2",
    branchName: "Delhi Branch",
    vendorName: "XYZ Logistics",
    poId: "POID-002",
    poNo: "PO-002",
    poDate: "2026-05-02",
    noOfItems: 3,
    deliveryDate: "2026-05-16",
    purchaseValue: 35000,
    itemsList: "ItemA, ItemB",
  },
];

// Mock Data for Dropdowns
const branches: string[] = ["Select Branch", "Mumbai HO", "Delhi Branch", "Chennai Branch", "Kolkata Branch", "Bangalore Branch"];
const vendors: string[] = ["ALL", "ABC Transport", "XYZ Logistics", "PQR Carriers", "LMN Freight"];
const invoiceCategories: string[] = ["Select", "Purchase", "Service", "Expense", "Freight", "Asset"];
const filterOptions: string[] = ["ALL", "Pending", "Approved", "Rejected"];
const applicableOptions: string[] = ["Full", "Partial", "Percentage", "Fixed"];
const storeNames: string[] = ["Select Store", "Main Store", "North Store", "South Store", "East Store", "West Store"];

// Column settings options
const searchColumnOptions: SearchColumnOption[] = [
  { key: "receiptId", label: "Receipt ID" },
  { key: "date", label: "Date" },
  { key: "poNo", label: "PO #" },
  { key: "referenceNo", label: "Reference #" },
  { key: "invoiceNo", label: "Invoice #" },
  { key: "invoiceCategory", label: "Invoice Category" },
  { key: "branch", label: "Branch" },
  { key: "divisionName", label: "Division Name" },
  { key: "vendor", label: "Vendor" },
  { key: "vendorDepartment", label: "Vendor Department" },
  { key: "subTotal", label: "Sub Total" },
  { key: "gstAmount", label: "GST Amount" },
  { key: "billAmount", label: "Bill Amount" },
  { key: "tdsAmount", label: "TDS Amount" },
  { key: "advanceAdjusted", label: "Advance Adjusted" },
  { key: "netPayable", label: "Net Payable" },
  { key: "billStatus", label: "Bill Status" },
  { key: "voucherNo", label: "Voucher #" },
  { key: "balancePayable", label: "Balance Payable" },
  { key: "paymentTerms", label: "Payment Terms" },
];

export default function VendorBillReceipt() {
  // ========== Search Tab State ==========
  const [fromPeriod, setFromPeriod] = useState<string>(new Date().toISOString().split("T")[0]);
  const [toPeriod, setToPeriod] = useState<string>(new Date().toISOString().split("T")[0]);
  const [filterOn, setFilterOn] = useState<string>("ALL");
  const [invoiceCategory, setInvoiceCategory] = useState<string>("");
  const [vendorBillReceipts] = useState<VendorBillReceipt[]>(mockVendorBillReceipts);
  const [searchColumnSettings, setSearchColumnSettings] = useState<SearchColumnSettings>({
    receiptId: true,
    date: true,
    poNo: true,
    referenceNo: true,
    invoiceNo: true,
    invoiceCategory: true,
    branch: true,
    divisionName: true,
    vendor: true,
    vendorDepartment: true,
    subTotal: true,
    gstAmount: true,
    billAmount: true,
    tdsAmount: true,
    advanceAdjusted: true,
    netPayable: true,
    billStatus: true,
    voucherNo: true,
    balancePayable: true,
    paymentTerms: true,
  });

  // ========== Pending PO Tab State ==========
  const [poBranch, setPoBranch] = useState<string>("");
  const [poVendor, setPoVendor] = useState<string>("ALL");
  const [poCheckbox, setPoCheckbox] = useState<boolean>(false);
  const [asOnDate, setAsOnDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [pendingPOs] = useState<PendingPO[]>(mockPendingPOs);
  const [selectedPOs, setSelectedPOs] = useState<string[]>([]);

  // ========== Entry Tab State ==========
  const [branch, setBranch] = useState<string>("");
  const [branchGstNo, setBranchGstNo] = useState<string>("");
  const [receiptId, setReceiptId] = useState<string>("0");
  const [receiptDate, setReceiptDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [storeName, setStoreName] = useState<string>("");
  const [vendor, setVendor] = useState<string>("");
  const [vendorDepartmentGstNo, setVendorDepartmentGstNo] = useState<string>("");
  const [vendorDepartment, setVendorDepartment] = useState<string>("");
  const [subLedger, setSubLedger] = useState<string>("");
  const [entryInvoiceCategory, setEntryInvoiceCategory] = useState<string>("");
  const [invoiceNo, setInvoiceNo] = useState<string>("");
  const [invoiceDate, setInvoiceDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [periodFrom, setPeriodFrom] = useState<string>("2026-04-01");
  const [periodTo, setPeriodTo] = useState<string>(new Date().toISOString().split("T")[0]);
  const [fileName, setFileName] = useState<string>("");
  const [billRows, setBillRows] = useState<BillRow[]>([
    {
      id: generateId(),
      particulars: "",
      sign: "+",
      percent: 0,
      applicable: "",
      amount: 0,
      roundOff: 0,
      remarks: "",
    },
  ]);
  const [remarks, setRemarks] = useState<string>("");

  // ========== Filtered Data ==========
  const filteredReceipts = useMemo(() => {
    let filtered = vendorBillReceipts;
    if (fromPeriod) {
      filtered = filtered.filter(r => r.date >= fromPeriod);
    }
    if (toPeriod) {
      filtered = filtered.filter(r => r.date <= toPeriod);
    }
    if (filterOn && filterOn !== "ALL") {
      filtered = filtered.filter(r => r.billStatus === filterOn);
    }
    if (invoiceCategory) {
      filtered = filtered.filter(r => r.invoiceCategory === invoiceCategory);
    }
    return filtered;
  }, [vendorBillReceipts, fromPeriod, toPeriod, filterOn, invoiceCategory]);

  const filteredPendingPOs = useMemo(() => {
    let filtered = pendingPOs;
    if (poBranch) {
      filtered = filtered.filter(p => p.branchName === poBranch);
    }
    if (poVendor && poVendor !== "ALL") {
      filtered = filtered.filter(p => p.vendorName === poVendor);
    }
    if (poCheckbox) {
      // Filter logic for checkbox - example: show only urgent POs
      filtered = filtered.filter(p => p.deliveryDate >= asOnDate);
    }
    return filtered;
  }, [pendingPOs, poBranch, poVendor, poCheckbox, asOnDate]);

  // ========== Search Tab Handlers ==========
  const handleShowVendorBillReceipt = () => {
    alert(`Found ${filteredReceipts.length} vendor bill receipts`);
  };

  const toggleSearchColumn = (key: keyof SearchColumnSettings) => {
    setSearchColumnSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // ========== Pending PO Tab Handlers ==========
  const handleShowPending = () => {
    alert(`Found ${filteredPendingPOs.length} pending POs`);
  };

  const handleSelectAllPO = (checked: boolean) => {
    if (checked) {
      setSelectedPOs(filteredPendingPOs.map(p => p.id));
    } else {
      setSelectedPOs([]);
    }
  };

  const handleSelectPO = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedPOs([...selectedPOs, id]);
    } else {
      setSelectedPOs(selectedPOs.filter(s => s !== id));
    }
  };

  // ========== Entry Tab Handlers ==========
  const addRow = (): void => {
    const newRow: BillRow = {
      id: generateId(),
      particulars: "",
      sign: "+",
      percent: 0,
      applicable: "",
      amount: 0,
      roundOff: 0,
      remarks: "",
    };
    setBillRows([...billRows, newRow]);
  };

  const updateRow = (id: string, field: keyof BillRow, value: string | number): void => {
    setBillRows(prev =>
      prev.map(row =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const deleteRow = (id: string): void => {
    if (billRows.length === 1) {
      alert("At least one row is required");
      return;
    }
    setBillRows(prev => prev.filter(row => row.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      alert(`File "${file.name}" selected. Upload would happen here.`);
    }
  };

  // Calculate subtotal
  const subtotal = billRows.reduce((sum, row) => {
    const amount = row.sign === "+" ? row.amount : -row.amount;
    return sum + amount;
  }, 0);

  const totalAmount = subtotal;

  const handleSave = (): void => {
    if (!branch) {
      alert("Branch is required");
      return;
    }
    if (!vendor) {
      alert("Vendor is required");
      return;
    }
    if (!entryInvoiceCategory || entryInvoiceCategory === "Select") {
      alert("Invoice Category is required");
      return;
    }
    if (!invoiceNo) {
      alert("Invoice No. & Date is required");
      return;
    }

    alert(`Vendor Bill Receipt saved successfully!\nReceipt ID: ${receiptId}\nTotal Amount: ₹${totalAmount.toLocaleString()}`);
    handleClearEntry();
  };

  const handleClearEntry = (): void => {
    setBranch("");
    setBranchGstNo("");
    setReceiptId("0");
    setReceiptDate(new Date().toISOString().split("T")[0]);
    setStoreName("");
    setVendor("");
    setVendorDepartmentGstNo("");
    setVendorDepartment("");
    setSubLedger("");
    setEntryInvoiceCategory("");
    setInvoiceNo("");
    setInvoiceDate(new Date().toISOString().split("T")[0]);
    setPeriodFrom("2026-04-01");
    setPeriodTo(new Date().toISOString().split("T")[0]);
    setFileName("");
    setBillRows([
      {
        id: generateId(),
        particulars: "",
        sign: "+",
        percent: 0,
        applicable: "",
        amount: 0,
        roundOff: 0,
        remarks: "",
      },
    ]);
    setRemarks("");
  };

  const handleCancel = (): void => {
    if (confirm("Cancel all changes? Data will be lost.")) {
      handleClearEntry();
    }
  };

  const handleExportToExcel = (type: string): void => {
    alert(`Export ${type} to Excel functionality would trigger here`);
  };

  const handleSelectPurchaseOrder = (): void => {
    alert("Select Purchase Order dialog would open here");
  };

  const handleSaveAttachment = (): void => {
    alert("Save Attachment functionality would trigger here");
  };

  const handleDocument = (): void => {
    alert("Document functionality would trigger here");
  };

  return (
    <div className="space-y-6 p-3 sm:p-4 md:p-6 max-w-full overflow-x-hidden">
      <h1 className="text-xl sm:text-2xl font-bold text-primary">Vendor Bill Receipt</h1>

      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="pending">Pending PO</TabsTrigger>
          <TabsTrigger value="entry">Entry</TabsTrigger>
        </TabsList>

        {/* ==================== SEARCH TAB ==================== */}
        <TabsContent value="search" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Search Vendor Bill Receipts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label>Period</Label>
                  <div className="flex gap-2">
                    <Input type="date" value={fromPeriod} onChange={(e) => setFromPeriod(e.target.value)} className="w-1/2" />
                    <Input type="date" value={toPeriod} onChange={(e) => setToPeriod(e.target.value)} className="w-1/2" />
                  </div>
                </div>
                <div>
                  <Label>Filter On</Label>
                  <Select value={filterOn} onValueChange={setFilterOn}>
                    <SelectTrigger>
                      <SelectValue placeholder="ALL" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.map(f => (
                        <SelectItem key={f} value={f}>{f}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Invoice Category</Label>
                  <Select value={invoiceCategory} onValueChange={setInvoiceCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {invoiceCategories.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                <Button onClick={handleShowVendorBillReceipt} className="bg-blue-600 hover:bg-blue-700">
                  <Search className="mr-2 h-4 w-4" /> Show Vendor Bill Receipt
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Search Results Table with Column Settings */}
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Vendor Bill Receipt List</CardTitle>
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
              <div className="min-w-[1400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>S#</TableHead>
                      {searchColumnSettings.receiptId && <TableHead>Receipt ID</TableHead>}
                      {searchColumnSettings.date && <TableHead>Date</TableHead>}
                      {searchColumnSettings.poNo && <TableHead>PO #</TableHead>}
                      {searchColumnSettings.referenceNo && <TableHead>Reference #</TableHead>}
                      {searchColumnSettings.invoiceNo && <TableHead>Invoice #</TableHead>}
                      {searchColumnSettings.invoiceCategory && <TableHead>Invoice Category</TableHead>}
                      {searchColumnSettings.branch && <TableHead>Branch</TableHead>}
                      {searchColumnSettings.divisionName && <TableHead>Division Name</TableHead>}
                      {searchColumnSettings.vendor && <TableHead>Vendor</TableHead>}
                      {searchColumnSettings.vendorDepartment && <TableHead>Vendor Department</TableHead>}
                      {searchColumnSettings.subTotal && <TableHead className="text-right">Sub Total</TableHead>}
                      {searchColumnSettings.gstAmount && <TableHead className="text-right">GST Amount</TableHead>}
                      {searchColumnSettings.billAmount && <TableHead className="text-right">Bill Amount</TableHead>}
                      {searchColumnSettings.tdsAmount && <TableHead className="text-right">TDS Amount</TableHead>}
                      {searchColumnSettings.advanceAdjusted && <TableHead className="text-right">Advance Adjusted</TableHead>}
                      {searchColumnSettings.netPayable && <TableHead className="text-right">Net Payable</TableHead>}
                      {searchColumnSettings.billStatus && <TableHead>Bill Status</TableHead>}
                      {searchColumnSettings.voucherNo && <TableHead>Voucher #</TableHead>}
                      {searchColumnSettings.balancePayable && <TableHead className="text-right">Balance Payable</TableHead>}
                      {searchColumnSettings.paymentTerms && <TableHead>Payment Terms</TableHead>}
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReceipts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={22} className="text-center py-8 text-muted-foreground">
                          No vendor bill receipts found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredReceipts.map((receipt, idx) => (
                        <TableRow key={receipt.id}>
                          <TableCell>{idx + 1}</TableCell>
                          {searchColumnSettings.receiptId && <TableCell>{receipt.receiptId}</TableCell>}
                          {searchColumnSettings.date && <TableCell>{receipt.date}</TableCell>}
                          {searchColumnSettings.poNo && <TableCell>{receipt.poNo}</TableCell>}
                          {searchColumnSettings.referenceNo && <TableCell>{receipt.referenceNo}</TableCell>}
                          {searchColumnSettings.invoiceNo && <TableCell>{receipt.invoiceNo}</TableCell>}
                          {searchColumnSettings.invoiceCategory && <TableCell>{receipt.invoiceCategory}</TableCell>}
                          {searchColumnSettings.branch && <TableCell>{receipt.branch}</TableCell>}
                          {searchColumnSettings.divisionName && <TableCell>{receipt.divisionName}</TableCell>}
                          {searchColumnSettings.vendor && <TableCell>{receipt.vendor}</TableCell>}
                          {searchColumnSettings.vendorDepartment && <TableCell>{receipt.vendorDepartment}</TableCell>}
                          {searchColumnSettings.subTotal && <TableCell className="text-right">₹ {receipt.subTotal.toLocaleString()}</TableCell>}
                          {searchColumnSettings.gstAmount && <TableCell className="text-right">₹ {receipt.gstAmount.toLocaleString()}</TableCell>}
                          {searchColumnSettings.billAmount && <TableCell className="text-right">₹ {receipt.billAmount.toLocaleString()}</TableCell>}
                          {searchColumnSettings.tdsAmount && <TableCell className="text-right">₹ {receipt.tdsAmount.toLocaleString()}</TableCell>}
                          {searchColumnSettings.advanceAdjusted && <TableCell className="text-right">₹ {receipt.advanceAdjusted.toLocaleString()}</TableCell>}
                          {searchColumnSettings.netPayable && <TableCell className="text-right">₹ {receipt.netPayable.toLocaleString()}</TableCell>}
                          {searchColumnSettings.billStatus && <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              receipt.billStatus === "Pending" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                            }`}>
                              {receipt.billStatus}
                            </span>
                          </TableCell>}
                          {searchColumnSettings.voucherNo && <TableCell>{receipt.voucherNo}</TableCell>}
                          {searchColumnSettings.balancePayable && <TableCell className="text-right">₹ {receipt.balancePayable.toLocaleString()}</TableCell>}
                          {searchColumnSettings.paymentTerms && <TableCell>{receipt.paymentTerms}</TableCell>}
                          <TableCell>
                            <Button variant="ghost" size="sm">
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
          {filteredReceipts.length > 0 && (
            <div className="text-sm text-muted-foreground border-t pt-3 flex justify-between">
              <span>Total Records: {filteredReceipts.length}</span>
              <span>
                Total Net Payable: ₹ {filteredReceipts.reduce((sum, r) => sum + r.netPayable, 0).toLocaleString()}
              </span>
            </div>
          )}
        </TabsContent>

        {/* ==================== PENDING PO TAB ==================== */}
        <TabsContent value="pending" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Purchase Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label>Branch <span className="text-red-500">*</span></Label>
                  <Select value={poBranch} onValueChange={setPoBranch}>
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
                  <Label>Vendor <span className="text-red-500">*</span></Label>
                  <Select value={poVendor} onValueChange={setPoVendor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendors.map(v => (
                        <SelectItem key={v} value={v}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Checkbox checked={poCheckbox} onCheckedChange={(c) => setPoCheckbox(!!c)} />
                  <Label>ALL check box</Label>
                </div>
                <div>
                  <Label>As On Date</Label>
                  <Input type="date" value={asOnDate} onChange={(e) => setAsOnDate(e.target.value)} />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                <Button onClick={handleShowPending} className="bg-blue-600 hover:bg-blue-700">
                  <Search className="mr-2 h-4 w-4" /> Show Pending
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
                      <TableHead>
                        <Checkbox 
                          checked={selectedPOs.length === filteredPendingPOs.length && filteredPendingPOs.length > 0} 
                          onCheckedChange={handleSelectAllPO} 
                        />
                      </TableHead>
                      <TableHead>S#</TableHead>
                      <TableHead>Branch Name</TableHead>
                      <TableHead>Vendor Name</TableHead>
                      <TableHead>PO Id</TableHead>
                      <TableHead>PO #</TableHead>
                      <TableHead>PO Date</TableHead>
                      <TableHead>No Of Items</TableHead>
                      <TableHead>Delivery Date</TableHead>
                      <TableHead className="text-right">Purchase Value</TableHead>
                      <TableHead>Items List</TableHead>
                      <TableHead>Select</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPendingPOs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                          No pending POs found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPendingPOs.map((po, idx) => (
                        <TableRow key={po.id}>
                          <TableCell>
                            <Checkbox 
                              checked={selectedPOs.includes(po.id)} 
                              onCheckedChange={(c) => handleSelectPO(po.id, !!c)} 
                            />
                          </TableCell>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>{po.branchName}</TableCell>
                          <TableCell>{po.vendorName}</TableCell>
                          <TableCell>{po.poId}</TableCell>
                          <TableCell>{po.poNo}</TableCell>
                          <TableCell>{po.poDate}</TableCell>
                          <TableCell>{po.noOfItems}</TableCell>
                          <TableCell>{po.deliveryDate}</TableCell>
                          <TableCell className="text-right">₹ {po.purchaseValue.toLocaleString()}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{po.itemsList}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">Select</Button>
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
              <CardTitle>Vendor Bill Receipt Entry</CardTitle>
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
                  <Label>Branch GST#</Label>
                  <Input value={branchGstNo} onChange={(e) => setBranchGstNo(e.target.value)} />
                </div>
                <div>
                  <Label>Receipt ID</Label>
                  <Input value={receiptId} readOnly className="bg-muted" />
                </div>
                <div>
                  <Label>Receipt Date</Label>
                  <Input type="date" value={receiptDate} onChange={(e) => setReceiptDate(e.target.value)} />
                </div>
                <div>
                  <Label>Store Name</Label>
                  <Select value={storeName} onValueChange={setStoreName}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Store" />
                    </SelectTrigger>
                    <SelectContent>
                      {storeNames.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Vendor <span className="text-red-500">*</span></Label>
                  <Select value={vendor} onValueChange={setVendor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendors.filter(v => v !== "ALL").map(v => (
                        <SelectItem key={v} value={v}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Vendor/Department GST #</Label>
                  <Input value={vendorDepartmentGstNo} onChange={(e) => setVendorDepartmentGstNo(e.target.value)} />
                </div>
                <div>
                  <Label>Vendor Department</Label>
                  <Input value={vendorDepartment} onChange={(e) => setVendorDepartment(e.target.value)} />
                </div>
                <div>
                  <Label>Sub Ledger</Label>
                  <Input value={subLedger} onChange={(e) => setSubLedger(e.target.value)} />
                </div>
                <div>
                  <Label>Invoice Category <span className="text-red-500">*</span></Label>
                  <Select value={entryInvoiceCategory} onValueChange={setEntryInvoiceCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {invoiceCategories.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Invoice No. & Date <span className="text-red-500">*</span></Label>
                  <div className="flex gap-2">
                    <Input value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} placeholder="Invoice #" className="w-1/2" />
                    <Input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} className="w-1/2" />
                  </div>
                </div>
                <div>
                  <Label>Period <span className="text-red-500">*</span></Label>
                  <div className="flex gap-2">
                    <Input type="date" value={periodFrom} onChange={(e) => setPeriodFrom(e.target.value)} className="w-1/2" />
                    <Input type="date" value={periodTo} onChange={(e) => setPeriodTo(e.target.value)} className="w-1/2" />
                  </div>
                </div>
                <div>
                  <Label>Choose File</Label>
                  <div className="flex gap-2 mt-1">
                    <Button variant="outline" onClick={() => document.getElementById("fileUpload")?.click()}>
                      <Upload className="mr-2 h-4 w-4" /> Choose File
                    </Button>
                    <input id="fileUpload" type="file" onChange={handleFileUpload} className="hidden" />
                    <span className="text-sm text-muted-foreground">{fileName || "No file chosen"}</span>
                  </div>
                </div>
              </div>

              {/* Export and Select Buttons */}
              <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t">
                <Button variant="outline" onClick={() => handleExportToExcel("Bill Details")}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" /> Bill Details Export to Excel
                </Button>
                <Button variant="outline" onClick={() => handleExportToExcel("Batch Details")}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" /> Batch Details Export to Excel
                </Button>
                <Button variant="outline" onClick={handleSelectPurchaseOrder}>
                  <Package className="mr-2 h-4 w-4" /> Select Purchase Order
                </Button>
              </div>

              {/* Bill Details Table */}
              <div className="mt-6">
                <div className="overflow-x-auto">
                  <div className="min-w-[800px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>S#</TableHead>
                          <TableHead>Particulars</TableHead>
                          <TableHead>+/-</TableHead>
                          <TableHead>%</TableHead>
                          <TableHead>Applicable</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="text-right">RoundOff</TableHead>
                          <TableHead>Remarks</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {billRows.map((row, idx) => (
                          <TableRow key={row.id}>
                            <TableCell>{idx + 1}</TableCell>
                            <TableCell>
                              <Input 
                                value={row.particulars} 
                                onChange={(e) => updateRow(row.id, "particulars", e.target.value)} 
                                className="w-40"
                              />
                            </TableCell>
                            <TableCell>
                              <Select value={row.sign} onValueChange={(v: "+" | "-") => updateRow(row.id, "sign", v)}>
                                <SelectTrigger className="w-16">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="+">+</SelectItem>
                                  <SelectItem value="-">-</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Input 
                                type="number" 
                                value={row.percent} 
                                onChange={(e) => updateRow(row.id, "percent", Number(e.target.value))} 
                                className="w-20"
                              />
                            </TableCell>
                            <TableCell>
                              <Select value={row.applicable} onValueChange={(v) => updateRow(row.id, "applicable", v)}>
                                <SelectTrigger className="w-28">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  {applicableOptions.map(a => (
                                    <SelectItem key={a} value={a}>{a}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Input 
                                type="number" 
                                value={row.amount} 
                                onChange={(e) => updateRow(row.id, "amount", Number(e.target.value))} 
                                className="w-28 text-right"
                              />
                            </TableCell>
                            <TableCell>
                              <Input 
                                type="number" 
                                value={row.roundOff} 
                                onChange={(e) => updateRow(row.id, "roundOff", Number(e.target.value))} 
                                className="w-24 text-right"
                              />
                            </TableCell>
                            <TableCell>
                              <Input 
                                value={row.remarks} 
                                onChange={(e) => updateRow(row.id, "remarks", e.target.value)} 
                                className="w-32"
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
                </div>

                {/* Add Row Button and Subtotal */}
                <div className="flex justify-between items-center mt-4">
                  <Button onClick={addRow} variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Add More
                  </Button>
                  <div className="text-lg font-semibold">
                    SUBTOTAL: <span className="text-blue-600">₹ {subtotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Total Amount and Remarks */}
              <div className="mt-6 pt-4 border-t">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-lg font-bold">Total Amount</Label>
                    <Input 
                      type="number" 
                      value={totalAmount} 
                      readOnly 
                      className="bg-muted font-semibold text-lg text-blue-600"
                    />
                  </div>
                  <div>
                    <Label>Remarks</Label>
                    <Input 
                      value={remarks} 
                      onChange={(e) => setRemarks(e.target.value)} 
                      placeholder="Enter remarks..."
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t mt-6">
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  <Save className="mr-2 h-4 w-4" /> Save
                </Button>
                <Button onClick={handleSaveAttachment} variant="outline">
                  <Upload className="mr-2 h-4 w-4" /> Save Attachment
                </Button>
                <Button onClick={handleDocument} variant="outline">
                  <FileText className="mr-2 h-4 w-4" /> Document
                </Button>
                <Button onClick={handleClearEntry} variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" /> Clear
                </Button>
                <Button onClick={handleCancel} variant="destructive">
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}