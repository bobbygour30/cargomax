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

interface VendorBill {
  id: string;
  receiptId: string;
  vendor: string;
  vendorDepartment: string;
  referenceNo: string;
  j5DocumentNo: string;
  invoiceCategory: string;
  billNo: string;
  billDate: string;
  receivedOn: string;
  subTotal: number;
  gstAmount: number;
  billAmount: number;
  tdsAmount: number;
  advanceAdjusted: number;
  netPayable: number;
  voucherNo: string;
  tdsVoucherNo: string;
  billStatus: string;
}

// Column Settings Types
interface SearchColumnSettings {
  receiptId: boolean;
  vendor: boolean;
  vendorDepartment: boolean;
  referenceNo: boolean;
  j5DocumentNo: boolean;
  invoiceCategory: boolean;
  billNo: boolean;
  billDate: boolean;
  receivedOn: boolean;
  subTotal: boolean;
  gstAmount: boolean;
  billAmount: boolean;
  tdsAmount: boolean;
  advanceAdjusted: boolean;
  netPayable: boolean;
  voucherNo: boolean;
  tdsVoucherNo: boolean;
  billStatus: boolean;
}

interface SearchColumnOption {
  key: keyof SearchColumnSettings;
  label: string;
}

// Helper
const generateId = (): string => Math.random().toString(36).substr(2, 9);

// Mock Data for Dropdowns
const vendors: string[] = ["ALL", "ABC Transport", "XYZ Logistics", "PQR Carriers", "LMN Freight", "RST Movers"];
const invoiceCategories: string[] = ["--Select--", "Purchase", "Service", "Expense", "Asset", "Freight"];
const branches: string[] = ["Select Branch", "Mumbai HO", "Delhi Branch", "Chennai Branch", "Kolkata Branch", "Bangalore Branch"];
const storeNames: string[] = ["Select Store", "Main Store", "North Store", "South Store", "East Store", "West Store"];
const applicableOptions: string[] = ["Full", "Partial", "Percentage", "Fixed"];

// Mock Search Data
const mockVendorBills: VendorBill[] = [
  {
    id: "1",
    receiptId: "REC-001",
    vendor: "ABC Transport",
    vendorDepartment: "Logistics",
    referenceNo: "REF-001",
    j5DocumentNo: "J5-001",
    invoiceCategory: "Freight",
    billNo: "BILL-001",
    billDate: "2026-05-10",
    receivedOn: "2026-05-12",
    subTotal: 50000,
    gstAmount: 4500,
    billAmount: 54500,
    tdsAmount: 2500,
    advanceAdjusted: 0,
    netPayable: 52000,
    voucherNo: "VCH-001",
    tdsVoucherNo: "TDS-001",
    billStatus: "Pending",
  },
  {
    id: "2",
    receiptId: "REC-002",
    vendor: "XYZ Logistics",
    vendorDepartment: "Supply Chain",
    referenceNo: "REF-002",
    j5DocumentNo: "J5-002",
    invoiceCategory: "Purchase",
    billNo: "BILL-002",
    billDate: "2026-05-11",
    receivedOn: "2026-05-13",
    subTotal: 35000,
    gstAmount: 3150,
    billAmount: 38150,
    tdsAmount: 1750,
    advanceAdjusted: 5000,
    netPayable: 31400,
    voucherNo: "VCH-002",
    tdsVoucherNo: "TDS-002",
    billStatus: "Pending",
  },
  {
    id: "3",
    receiptId: "REC-003",
    vendor: "PQR Carriers",
    vendorDepartment: "Transport",
    referenceNo: "REF-003",
    j5DocumentNo: "J5-003",
    invoiceCategory: "Service",
    billNo: "BILL-003",
    billDate: "2026-05-12",
    receivedOn: "2026-05-14",
    subTotal: 25000,
    gstAmount: 2250,
    billAmount: 27250,
    tdsAmount: 1250,
    advanceAdjusted: 0,
    netPayable: 26000,
    voucherNo: "VCH-003",
    tdsVoucherNo: "TDS-003",
    billStatus: "Approved",
  },
];

// Column settings options
const searchColumnOptions: SearchColumnOption[] = [
  { key: "receiptId", label: "Receipt ID" },
  { key: "vendor", label: "Vendor" },
  { key: "vendorDepartment", label: "Vendor Department" },
  { key: "referenceNo", label: "Reference #" },
  { key: "j5DocumentNo", label: "J5 Document No" },
  { key: "invoiceCategory", label: "Invoice Category" },
  { key: "billNo", label: "Bill #" },
  { key: "billDate", label: "Bill Date" },
  { key: "receivedOn", label: "Received On" },
  { key: "subTotal", label: "Sub Total" },
  { key: "gstAmount", label: "GST Amount" },
  { key: "billAmount", label: "Bill Amount" },
  { key: "tdsAmount", label: "TDS Amount" },
  { key: "advanceAdjusted", label: "Advance Adjusted" },
  { key: "netPayable", label: "Net Payable" },
  { key: "voucherNo", label: "Voucher #" },
  { key: "tdsVoucherNo", label: "TDS Voucher #" },
  { key: "billStatus", label: "Bill Status" },
];

export default function VendorBillPassing() {
  // ========== Search Tab State ==========
  const [searchVendor, setSearchVendor] = useState<string>("ALL");
  const [pendingCheckbox, setPendingCheckbox] = useState<boolean>(false);
  const [invoiceCategory, setInvoiceCategory] = useState<string>("--Select--");
  const [fromPeriod, setFromPeriod] = useState<string>(new Date().toISOString().split("T")[0]);
  const [toPeriod, setToPeriod] = useState<string>(new Date().toISOString().split("T")[0]);
  const [vendorBills] = useState<VendorBill[]>(mockVendorBills);
  const [searchColumnSettings, setSearchColumnSettings] = useState<SearchColumnSettings>({
    receiptId: true,
    vendor: true,
    vendorDepartment: true,
    referenceNo: true,
    j5DocumentNo: true,
    invoiceCategory: true,
    billNo: true,
    billDate: true,
    receivedOn: true,
    subTotal: true,
    gstAmount: true,
    billAmount: true,
    tdsAmount: true,
    advanceAdjusted: true,
    netPayable: true,
    voucherNo: true,
    tdsVoucherNo: true,
    billStatus: true,
  });
  const [selectedBill, setSelectedBill] = useState<VendorBill | null>(null);

  // ========== Entry Tab State ==========
  const [receiptDate, setReceiptDate] = useState<string>("");
  const [branch, setBranch] = useState<string>("");
  const [branchGstNo, setBranchGstNo] = useState<string>("");
  const [receiptId, setReceiptId] = useState<string>("0");
  const [passingDate, setPassingDate] = useState<string>("");
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

  // ========== Filtered Bills for Search Tab ==========
  const filteredBills = useMemo((): VendorBill[] => {
    let filtered = vendorBills;

    if (searchVendor && searchVendor !== "ALL") {
      filtered = filtered.filter(b => b.vendor === searchVendor);
    }
    if (pendingCheckbox) {
      filtered = filtered.filter(b => b.billStatus === "Pending");
    }
    if (invoiceCategory && invoiceCategory !== "--Select--") {
      filtered = filtered.filter(b => b.invoiceCategory === invoiceCategory);
    }
    if (fromPeriod) {
      filtered = filtered.filter(b => b.billDate >= fromPeriod);
    }
    if (toPeriod) {
      filtered = filtered.filter(b => b.billDate <= toPeriod);
    }

    return filtered;
  }, [vendorBills, searchVendor, pendingCheckbox, invoiceCategory, fromPeriod, toPeriod]);

  // ========== Search Tab Handlers ==========
  const handleShowVendorBillPassing = (): void => {
    alert(`Found ${filteredBills.length} vendor bills`);
  };

  const handleClearSearch = (): void => {
    setSearchVendor("ALL");
    setPendingCheckbox(false);
    setInvoiceCategory("--Select--");
    setFromPeriod(new Date().toISOString().split("T")[0]);
    setToPeriod(new Date().toISOString().split("T")[0]);
  };

  const toggleSearchColumn = (key: keyof SearchColumnSettings): void => {
    setSearchColumnSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectBill = (bill: VendorBill): void => {
    setSelectedBill(bill);
    // Populate entry tab with selected bill data
    setReceiptId(bill.receiptId);
    setVendor(bill.vendor);
    setVendorDepartment(bill.vendorDepartment);
    setEntryInvoiceCategory(bill.invoiceCategory);
    alert(`Selected Bill: ${bill.billNo} for passing`);
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
    if (!entryInvoiceCategory || entryInvoiceCategory === "--Select--") {
      alert("Invoice Category is required");
      return;
    }
    if (!invoiceNo) {
      alert("Invoice No. & Date is required");
      return;
    }

    alert(`Vendor Bill passed successfully!\nReceipt ID: ${receiptId}\nTotal Amount: ₹${totalAmount.toLocaleString()}`);
    handleClearEntry();
  };

  const handleClearEntry = (): void => {
    setReceiptDate("");
    setBranch("");
    setBranchGstNo("");
    setReceiptId("0");
    setPassingDate("");
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
    setSelectedBill(null);
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
      <h1 className="text-xl sm:text-2xl font-bold text-primary">Vendor Bill Passing</h1>

      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="entry">Entry</TabsTrigger>
        </TabsList>

        {/* ==================== SEARCH TAB ==================== */}
        <TabsContent value="search" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Search Vendor Bills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label>Vendor</Label>
                  <Select value={searchVendor} onValueChange={setSearchVendor}>
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
                  <Checkbox checked={pendingCheckbox} onCheckedChange={(c) => setPendingCheckbox(!!c)} />
                  <Label>Pending</Label>
                </div>
                <div>
                  <Label>Invoice Category</Label>
                  <Select value={invoiceCategory} onValueChange={setInvoiceCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="--Select--" />
                    </SelectTrigger>
                    <SelectContent>
                      {invoiceCategories.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Period</Label>
                  <div className="flex gap-2">
                    <Input type="date" value={fromPeriod} onChange={(e) => setFromPeriod(e.target.value)} className="w-1/2" />
                    <Input type="date" value={toPeriod} onChange={(e) => setToPeriod(e.target.value)} className="w-1/2" />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                <Button onClick={handleShowVendorBillPassing} className="bg-blue-600 hover:bg-blue-700">
                  <Search className="mr-2 h-4 w-4" /> Show Vendor Bill Passing
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
              <CardTitle>Vendor Bill List</CardTitle>
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
                      <TableHead>Options</TableHead>
                      {searchColumnSettings.receiptId && <TableHead>Receipt ID</TableHead>}
                      {searchColumnSettings.vendor && <TableHead>Vendor</TableHead>}
                      {searchColumnSettings.vendorDepartment && <TableHead>Vendor Department</TableHead>}
                      {searchColumnSettings.referenceNo && <TableHead>Reference #</TableHead>}
                      {searchColumnSettings.j5DocumentNo && <TableHead>J5 Document No</TableHead>}
                      {searchColumnSettings.invoiceCategory && <TableHead>Invoice Category</TableHead>}
                      {searchColumnSettings.billNo && <TableHead>Bill #</TableHead>}
                      {searchColumnSettings.billDate && <TableHead>Bill Date</TableHead>}
                      {searchColumnSettings.receivedOn && <TableHead>Received On</TableHead>}
                      {searchColumnSettings.subTotal && <TableHead className="text-right">Sub Total</TableHead>}
                      {searchColumnSettings.gstAmount && <TableHead className="text-right">GST Amount</TableHead>}
                      {searchColumnSettings.billAmount && <TableHead className="text-right">Bill Amount</TableHead>}
                      {searchColumnSettings.tdsAmount && <TableHead className="text-right">TDS Amount</TableHead>}
                      {searchColumnSettings.advanceAdjusted && <TableHead className="text-right">Advance Adjusted</TableHead>}
                      {searchColumnSettings.netPayable && <TableHead className="text-right">Net Payable</TableHead>}
                      {searchColumnSettings.voucherNo && <TableHead>Voucher #</TableHead>}
                      {searchColumnSettings.tdsVoucherNo && <TableHead>TDS Voucher #</TableHead>}
                      {searchColumnSettings.billStatus && <TableHead>Bill Status</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBills.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={20} className="text-center py-8 text-muted-foreground">
                          No vendor bills found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBills.map((bill, idx) => (
                        <TableRow key={bill.id}>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleSelectBill(bill)}
                              className="bg-green-50 hover:bg-green-100"
                            >
                              Select
                            </Button>
                          </TableCell>
                          {searchColumnSettings.receiptId && <TableCell>{bill.receiptId}</TableCell>}
                          {searchColumnSettings.vendor && <TableCell>{bill.vendor}</TableCell>}
                          {searchColumnSettings.vendorDepartment && <TableCell>{bill.vendorDepartment}</TableCell>}
                          {searchColumnSettings.referenceNo && <TableCell>{bill.referenceNo}</TableCell>}
                          {searchColumnSettings.j5DocumentNo && <TableCell>{bill.j5DocumentNo}</TableCell>}
                          {searchColumnSettings.invoiceCategory && <TableCell>{bill.invoiceCategory}</TableCell>}
                          {searchColumnSettings.billNo && <TableCell>{bill.billNo}</TableCell>}
                          {searchColumnSettings.billDate && <TableCell>{bill.billDate}</TableCell>}
                          {searchColumnSettings.receivedOn && <TableCell>{bill.receivedOn}</TableCell>}
                          {searchColumnSettings.subTotal && <TableCell className="text-right">₹ {bill.subTotal.toLocaleString()}</TableCell>}
                          {searchColumnSettings.gstAmount && <TableCell className="text-right">₹ {bill.gstAmount.toLocaleString()}</TableCell>}
                          {searchColumnSettings.billAmount && <TableCell className="text-right">₹ {bill.billAmount.toLocaleString()}</TableCell>}
                          {searchColumnSettings.tdsAmount && <TableCell className="text-right">₹ {bill.tdsAmount.toLocaleString()}</TableCell>}
                          {searchColumnSettings.advanceAdjusted && <TableCell className="text-right">₹ {bill.advanceAdjusted.toLocaleString()}</TableCell>}
                          {searchColumnSettings.netPayable && <TableCell className="text-right">₹ {bill.netPayable.toLocaleString()}</TableCell>}
                          {searchColumnSettings.voucherNo && <TableCell>{bill.voucherNo}</TableCell>}
                          {searchColumnSettings.tdsVoucherNo && <TableCell>{bill.tdsVoucherNo}</TableCell>}
                          {searchColumnSettings.billStatus && <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              bill.billStatus === "Pending" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                            }`}>
                              {bill.billStatus}
                            </span>
                          </TableCell>}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Summary Footer */}
          {filteredBills.length > 0 && (
            <div className="text-sm text-muted-foreground border-t pt-3 flex justify-between">
              <span>Total Records: {filteredBills.length}</span>
              <span>
                Total Net Payable: ₹ {filteredBills.reduce((sum, b) => sum + b.netPayable, 0).toLocaleString()}
              </span>
            </div>
          )}
        </TabsContent>

        {/* ==================== ENTRY TAB ==================== */}
        <TabsContent value="entry" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Bill Entry</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label>Receipt Date</Label>
                  <Input type="date" value={receiptDate} onChange={(e) => setReceiptDate(e.target.value)} />
                </div>
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
                  <Label>Passing Date</Label>
                  <Input type="date" value={passingDate} onChange={(e) => setPassingDate(e.target.value)} />
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
                <Button variant="outline" onClick={() => handleExportToExcel("Branch Detail")}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" /> Branch Detail Export to Excel
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
                    <Plus className="mr-2 h-4 w-4" /> Add Row
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
                    <Label>Please enter remarks here</Label>
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