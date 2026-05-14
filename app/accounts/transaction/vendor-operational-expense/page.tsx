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
interface OperationalExpenseItem {
  id: string;
  itemName: string;
  aCHead: string;
  modeName: string;
  manifestNo: string;
  manifestDate: string;
  manifestType: string;
  origin: string;
  destination: string;
  noOfGR: number;
  totalPckgs: number;
  actualWeight: number;
  chargeableWeight: number;
  amount: number;
  additionalAmount: number;
  deduction: number;
  totalAmount: number;
  remarks: string;
}

interface VendorOperationalExpense {
  id: string;
  expenseId: string;
  branchName: string;
  date: string;
  vendorName: string;
  vendorDepartment: string;
  vehicleNo: string;
  periodFrom: string;
  periodTo: string;
  invoiceNo: string;
  invoiceDate: string;
  modeType: string;
  documentType: string;
  applicableOn: string;
  rate: number;
  fixedAmount: number;
  billStatus: string;
  voucherNo: string;
  paymentMode: string;
  items: OperationalExpenseItem[];
}

// Column Settings Types
interface SearchColumnSettings {
  id: boolean;
  expenseDate: boolean;
  branchName: boolean;
  vendorName: boolean;
  invoiceNo: boolean;
  invoiceDate: boolean;
  period: boolean;
  paymentMode: boolean;
  billStatus: boolean;
  voucherNo: boolean;
}

interface SearchColumnOption {
  key: keyof SearchColumnSettings;
  label: string;
}

// Helper
const generateId = (): string => Math.random().toString(36).substr(2, 9);

// Mock Data
const mockExpenses: VendorOperationalExpense[] = [
  {
    id: "1",
    expenseId: "EXP-001",
    branchName: "Mumbai HO",
    date: "2026-05-14",
    vendorName: "ABC Transport",
    vendorDepartment: "Logistics",
    vehicleNo: "MH-01-AB-1234",
    periodFrom: "2026-05-01",
    periodTo: "2026-05-14",
    invoiceNo: "INV-001",
    invoiceDate: "2026-05-14",
    modeType: "Surface",
    documentType: "Outstation Challan",
    applicableOn: "Weight",
    rate: 50,
    fixedAmount: 0,
    billStatus: "Pending",
    voucherNo: "VCH-001",
    paymentMode: "Bank Transfer",
    items: [],
  },
  {
    id: "2",
    expenseId: "EXP-002",
    branchName: "Delhi Branch",
    date: "2026-05-13",
    vendorName: "XYZ Logistics",
    vendorDepartment: "Supply Chain",
    vehicleNo: "DL-02-CD-5678",
    periodFrom: "2026-05-01",
    periodTo: "2026-05-13",
    invoiceNo: "INV-002",
    invoiceDate: "2026-05-13",
    modeType: "Surface",
    documentType: "Local Challan",
    applicableOn: "Fixed",
    rate: 0,
    fixedAmount: 5000,
    billStatus: "Approved",
    voucherNo: "VCH-002",
    paymentMode: "Cheque",
    items: [],
  },
];

// Mock Data for Dropdowns
const branches: string[] = ["Select Branch", "Mumbai HO", "Delhi Branch", "Chennai Branch", "Kolkata Branch", "Bangalore Branch"];
const vendors: string[] = ["Select Vendor", "ABC Transport", "XYZ Logistics", "PQR Carriers", "LMN Freight"];
const modeTypes: string[] = ["Surface", "Air", "Rail", "Sea"];
const applicableOnOptions: string[] = ["Select", "Weight", "Distance", "Fixed", "Percentage", "Package"];
const aCHeadOptions: string[] = ["Select Head", "Freight Expense", "Loading Expense", "Fuel Expense", "Repair Expense", "Insurance Expense"];
const modeNames: string[] = ["Select Mode", "Road", "Rail", "Air", "Sea"];
const manifestTypes: string[] = ["Select Type", "LR", "GR", "BL", "AWB"];
const documentTypes: string[] = [
  "Outstation Challan",
  "Local Challan",
  "Pickup Run Sheet",
  "Crossing Challan",
  "Delivery Run Sheet"
];

// Column settings options
const searchColumnOptions: SearchColumnOption[] = [
  { key: "id", label: "ID" },
  { key: "expenseDate", label: "Expense Date" },
  { key: "branchName", label: "Branch Name" },
  { key: "vendorName", label: "Vendor Name" },
  { key: "invoiceNo", label: "Invoice #" },
  { key: "invoiceDate", label: "Invoice Date" },
  { key: "period", label: "Period" },
  { key: "paymentMode", label: "Payment Mode" },
  { key: "billStatus", label: "Bill Status" },
  { key: "voucherNo", label: "Voucher #" },
];

export default function VendorOperationalExpense() {
  // ========== Entry Tab State ==========
  const [branchName, setBranchName] = useState<string>("");
  const [expenseId, setExpenseId] = useState<string>("0");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [vendorName, setVendorName] = useState<string>("");
  const [vendorDepartment, setVendorDepartment] = useState<string>("");
  const [vehicleNo, setVehicleNo] = useState<string>("");
  const [periodFrom, setPeriodFrom] = useState<string>("");
  const [periodTo, setPeriodTo] = useState<string>("");
  const [invoiceNo, setInvoiceNo] = useState<string>("");
  const [invoiceDate, setInvoiceDate] = useState<string>("");
  const [modeType, setModeType] = useState<string>("Surface");
  const [documentType, setDocumentType] = useState<string>("");
  const [applicableOn, setApplicableOn] = useState<string>("");
  const [rate, setRate] = useState<number>(0);
  const [fixedAmount, setFixedAmount] = useState<number>(0);
  const [expenseItems, setExpenseItems] = useState<OperationalExpenseItem[]>([]);
  const [savedExpenses] = useState<VendorOperationalExpense[]>(mockExpenses);

  // ========== Search Tab State ==========
  const [searchBranch, setSearchBranch] = useState<string>("");
  const [searchVendor, setSearchVendor] = useState<string>("");
  const [searchFromDate, setSearchFromDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [searchToDate, setSearchToDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [searchColumnSettings, setSearchColumnSettings] = useState<SearchColumnSettings>({
    id: true,
    expenseDate: true,
    branchName: true,
    vendorName: true,
    invoiceNo: true,
    invoiceDate: true,
    period: true,
    paymentMode: true,
    billStatus: true,
    voucherNo: true,
  });
  const [viewDialogOpen, setViewDialogOpen] = useState<boolean>(false);
  const [selectedExpense, setSelectedExpense] = useState<VendorOperationalExpense | null>(null);
  const [selectedAll, setSelectedAll] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // ========== Filtered Expenses for Search Tab ==========
  const filteredExpenses = useMemo((): VendorOperationalExpense[] => {
    let filtered = savedExpenses;

    if (searchBranch) {
      filtered = filtered.filter(e => e.branchName === searchBranch);
    }
    if (searchVendor) {
      filtered = filtered.filter(e => e.vendorName === searchVendor);
    }
    if (searchFromDate) {
      filtered = filtered.filter(e => e.date >= searchFromDate);
    }
    if (searchToDate) {
      filtered = filtered.filter(e => e.date <= searchToDate);
    }

    return filtered;
  }, [savedExpenses, searchBranch, searchVendor, searchFromDate, searchToDate]);

  // ========== Entry Tab Handlers ==========
  const addExpenseItem = (): void => {
    const newItem: OperationalExpenseItem = {
      id: generateId(),
      itemName: "",
      aCHead: "",
      modeName: "",
      manifestNo: "",
      manifestDate: "",
      manifestType: "",
      origin: "",
      destination: "",
      noOfGR: 0,
      totalPckgs: 0,
      actualWeight: 0,
      chargeableWeight: 0,
      amount: 0,
      additionalAmount: 0,
      deduction: 0,
      totalAmount: 0,
      remarks: "",
    };
    setExpenseItems([...expenseItems, newItem]);
  };

  const updateExpenseItem = (id: string, field: keyof OperationalExpenseItem, value: string | number): void => {
    setExpenseItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          // Auto-calculate total amount
          if (field === "amount" || field === "additionalAmount" || field === "deduction") {
            updated.totalAmount = (updated.amount || 0) + (updated.additionalAmount || 0) - (updated.deduction || 0);
          }
          return updated;
        }
        return item;
      })
    );
  };

  const deleteExpenseItem = (id: string): void => {
    setExpenseItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSelectAll = (checked: boolean): void => {
    setSelectedAll(checked);
    if (checked) {
      setSelectedItems(expenseItems.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean): void => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter(i => i !== id));
      setSelectedAll(false);
    }
  };

  const handleSave = (): void => {
    if (!branchName) {
      alert("Branch Name is required");
      return;
    }
    if (!vendorName) {
      alert("Vendor Name is required");
      return;
    }
    if (!invoiceNo) {
      alert("Invoice # is required");
      return;
    }
    if (expenseItems.length === 0) {
      alert("Please add at least one expense item");
      return;
    }

    alert(`Vendor Operational Expense saved successfully!\nExpense ID: ${expenseId}\nTotal Items: ${expenseItems.length}`);
    handleClearEntry();
  };

  const handleClearEntry = (): void => {
    setBranchName("");
    setExpenseId("0");
    setDate(new Date().toISOString().split("T")[0]);
    setVendorName("");
    setVendorDepartment("");
    setVehicleNo("");
    setPeriodFrom("");
    setPeriodTo("");
    setInvoiceNo("");
    setInvoiceDate("");
    setModeType("Surface");
    setDocumentType("");
    setApplicableOn("");
    setRate(0);
    setFixedAmount(0);
    setExpenseItems([]);
    setSelectedItems([]);
    setSelectedAll(false);
  };

  const handleCancel = (): void => {
    if (confirm("Cancel all changes? Data will be lost.")) {
      handleClearEntry();
    }
  };

  // Calculate totals
  const totals = expenseItems.reduce(
    (acc, item) => ({
      noOfGR: acc.noOfGR + (item.noOfGR || 0),
      totalPckgs: acc.totalPckgs + (item.totalPckgs || 0),
      actualWeight: acc.actualWeight + (item.actualWeight || 0),
      chargeableWeight: acc.chargeableWeight + (item.chargeableWeight || 0),
      amount: acc.amount + (item.amount || 0),
      additionalAmount: acc.additionalAmount + (item.additionalAmount || 0),
      deduction: acc.deduction + (item.deduction || 0),
      totalAmount: acc.totalAmount + (item.totalAmount || 0),
    }),
    { noOfGR: 0, totalPckgs: 0, actualWeight: 0, chargeableWeight: 0, amount: 0, additionalAmount: 0, deduction: 0, totalAmount: 0 }
  );

  // ========== Search Tab Handlers ==========
  const handleSearch = (): void => {
    alert(`Found ${filteredExpenses.length} operational expenses`);
  };

  const handleClearSearch = (): void => {
    setSearchBranch("");
    setSearchVendor("");
    setSearchFromDate(new Date().toISOString().split("T")[0]);
    setSearchToDate(new Date().toISOString().split("T")[0]);
  };

  const toggleSearchColumn = (key: keyof SearchColumnSettings): void => {
    setSearchColumnSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleViewDetails = (expense: VendorOperationalExpense): void => {
    setSelectedExpense(expense);
    setViewDialogOpen(true);
  };

  return (
    <div className="space-y-6 p-3 sm:p-4 md:p-6 max-w-full overflow-x-hidden">
      <h1 className="text-xl sm:text-2xl font-bold text-primary">Vendor Operational Expense</h1>

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
                  <Label>Branch Name <span className="text-red-500">*</span></Label>
                  <Select value={branchName} onValueChange={setBranchName}>
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
                  <Label>ID</Label>
                  <Input value={expenseId} readOnly className="bg-muted" />
                </div>
                <div>
                  <Label>Date</Label>
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div>
                  <Label>Vendor Name <span className="text-red-500">*</span></Label>
                  <Select value={vendorName} onValueChange={setVendorName}>
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
                <div>
                  <Label>Vendor Department</Label>
                  <Input value={vendorDepartment} onChange={(e) => setVendorDepartment(e.target.value)} />
                </div>
                <div>
                  <Label>Vehicle #</Label>
                  <Input value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value)} />
                </div>
                <div>
                  <Label>Period <span className="text-red-500">*</span></Label>
                  <div className="flex gap-2">
                    <Input type="date" value={periodFrom} onChange={(e) => setPeriodFrom(e.target.value)} className="w-1/2" />
                    <Input type="date" value={periodTo} onChange={(e) => setPeriodTo(e.target.value)} className="w-1/2" />
                  </div>
                </div>
                <div>
                  <Label>Invoice # <span className="text-red-500">*</span></Label>
                  <Input value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} />
                </div>
                <div>
                  <Label>Invoice Date</Label>
                  <Input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
                </div>
                <div>
                  <Label>Mode Type</Label>
                  <Select value={modeType} onValueChange={setModeType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Surface" />
                    </SelectTrigger>
                    <SelectContent>
                      {modeTypes.map(m => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Document Type</Label>
                  <RadioGroup value={documentType} onValueChange={setDocumentType} className="flex flex-wrap gap-3">
                    {documentTypes.map(doc => (
                      <div key={doc} className="flex items-center space-x-2">
                        <RadioGroupItem value={doc} id={doc} />
                        <Label htmlFor={doc} className="text-xs">{doc}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div>
                  <Label>Applicable On</Label>
                  <Select value={applicableOn} onValueChange={setApplicableOn}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {applicableOnOptions.map(a => (
                        <SelectItem key={a} value={a}>{a}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Rate</Label>
                  <Input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
                </div>
                <div>
                  <Label>Fixed Amount</Label>
                  <Input type="number" value={fixedAmount} onChange={(e) => setFixedAmount(Number(e.target.value))} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expense Items Table */}
          <Card>
            <CardHeader>
              <CardTitle>Expense Items</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <div className="min-w-[1400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox checked={selectedAll} onCheckedChange={handleSelectAll} />
                      </TableHead>
                      <TableHead>S#</TableHead>
                      <TableHead>Item Name</TableHead>
                      <TableHead>A/C Head</TableHead>
                      <TableHead>Mode Name</TableHead>
                      <TableHead>Manifest #</TableHead>
                      <TableHead>Manifest Date</TableHead>
                      <TableHead>Manifest Type</TableHead>
                      <TableHead>Origin</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>No Of GR</TableHead>
                      <TableHead>Total Pckgs</TableHead>
                      <TableHead>Actual Weight</TableHead>
                      <TableHead>Chargeable Weight</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Additional Amount</TableHead>
                      <TableHead className="text-right">Deduction</TableHead>
                      <TableHead className="text-right">Total Amount</TableHead>
                      <TableHead>Remarks</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenseItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={20} className="text-center py-8 text-muted-foreground">
                          No expense items added. Click "Add Item" to add.
                        </TableCell>
                      </TableRow>
                    ) : (
                      expenseItems.map((item, idx) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedItems.includes(item.id)}
                              onCheckedChange={(c) => handleSelectItem(item.id, !!c)}
                            />
                          </TableCell>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>
                            <Input 
                              value={item.itemName} 
                              onChange={(e) => updateExpenseItem(item.id, "itemName", e.target.value)} 
                              className="w-32"
                            />
                          </TableCell>
                          <TableCell>
                            <Select value={item.aCHead} onValueChange={(v) => updateExpenseItem(item.id, "aCHead", v)}>
                              <SelectTrigger className="w-36">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                {aCHeadOptions.map(h => (
                                  <SelectItem key={h} value={h}>{h}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select value={item.modeName} onValueChange={(v) => updateExpenseItem(item.id, "modeName", v)}>
                              <SelectTrigger className="w-28">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                {modeNames.map(m => (
                                  <SelectItem key={m} value={m}>{m}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input 
                              value={item.manifestNo} 
                              onChange={(e) => updateExpenseItem(item.id, "manifestNo", e.target.value)} 
                              className="w-28"
                            />
                          </TableCell>
                          <TableCell>
                            <Input 
                              type="date" 
                              value={item.manifestDate} 
                              onChange={(e) => updateExpenseItem(item.id, "manifestDate", e.target.value)} 
                              className="w-32"
                            />
                          </TableCell>
                          <TableCell>
                            <Select value={item.manifestType} onValueChange={(v) => updateExpenseItem(item.id, "manifestType", v)}>
                              <SelectTrigger className="w-28">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                {manifestTypes.map(m => (
                                  <SelectItem key={m} value={m}>{m}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input 
                              value={item.origin} 
                              onChange={(e) => updateExpenseItem(item.id, "origin", e.target.value)} 
                              className="w-28"
                            />
                          </TableCell>
                          <TableCell>
                            <Input 
                              value={item.destination} 
                              onChange={(e) => updateExpenseItem(item.id, "destination", e.target.value)} 
                              className="w-28"
                            />
                          </TableCell>
                          <TableCell>
                            <Input 
                              type="number" 
                              value={item.noOfGR} 
                              onChange={(e) => updateExpenseItem(item.id, "noOfGR", Number(e.target.value))} 
                              className="w-20 text-right"
                            />
                          </TableCell>
                          <TableCell>
                            <Input 
                              type="number" 
                              value={item.totalPckgs} 
                              onChange={(e) => updateExpenseItem(item.id, "totalPckgs", Number(e.target.value))} 
                              className="w-20 text-right"
                            />
                          </TableCell>
                          <TableCell>
                            <Input 
                              type="number" 
                              value={item.actualWeight} 
                              onChange={(e) => updateExpenseItem(item.id, "actualWeight", Number(e.target.value))} 
                              className="w-24 text-right"
                            />
                          </TableCell>
                          <TableCell>
                            <Input 
                              type="number" 
                              value={item.chargeableWeight} 
                              onChange={(e) => updateExpenseItem(item.id, "chargeableWeight", Number(e.target.value))} 
                              className="w-24 text-right"
                            />
                          </TableCell>
                          <TableCell>
                            <Input 
                              type="number" 
                              value={item.amount} 
                              onChange={(e) => updateExpenseItem(item.id, "amount", Number(e.target.value))} 
                              className="w-28 text-right"
                            />
                          </TableCell>
                          <TableCell>
                            <Input 
                              type="number" 
                              value={item.additionalAmount} 
                              onChange={(e) => updateExpenseItem(item.id, "additionalAmount", Number(e.target.value))} 
                              className="w-28 text-right"
                            />
                          </TableCell>
                          <TableCell>
                            <Input 
                              type="number" 
                              value={item.deduction} 
                              onChange={(e) => updateExpenseItem(item.id, "deduction", Number(e.target.value))} 
                              className="w-24 text-right"
                            />
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            ₹ {item.totalAmount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Input 
                              value={item.remarks} 
                              onChange={(e) => updateExpenseItem(item.id, "remarks", e.target.value)} 
                              className="w-32"
                            />
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => deleteExpenseItem(item.id)}>
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

          {/* Add Item Button and Totals */}
          <div className="flex justify-between items-center">
            <Button onClick={addExpenseItem} variant="outline">
              <Plus className="mr-2 h-4 w-4" /> Add Item
            </Button>
            <div className="text-sm font-semibold space-x-4">
              <span>Total GR: {totals.noOfGR}</span>
              <span>Total Pckgs: {totals.totalPckgs}</span>
              <span>Total Weight: {totals.actualWeight}</span>
              <span>Total Amount: <span className="text-blue-600">₹ {totals.totalAmount.toLocaleString()}</span></span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t mt-6">
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
                      <SelectItem value="all branches">All Branches</SelectItem>
                      {branches.filter(b => b !== "Select Branch").map(b => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Vendor</Label>
                  <Select value={searchVendor} onValueChange={setSearchVendor}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Vendors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all vendors">All Vendors</SelectItem>
                      {vendors.filter(v => v !== "Select Vendor").map(v => (
                        <SelectItem key={v} value={v}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Period From</Label>
                  <Input type="date" value={searchFromDate} onChange={(e) => setSearchFromDate(e.target.value)} />
                </div>
                <div>
                  <Label>Period To</Label>
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
                      {searchColumnSettings.id && <TableHead>ID</TableHead>}
                      {searchColumnSettings.expenseDate && <TableHead>Expense Date</TableHead>}
                      {searchColumnSettings.branchName && <TableHead>Branch Name</TableHead>}
                      {searchColumnSettings.vendorName && <TableHead>Vendor Name</TableHead>}
                      {searchColumnSettings.invoiceNo && <TableHead>Invoice #</TableHead>}
                      {searchColumnSettings.invoiceDate && <TableHead>Invoice Date</TableHead>}
                      {searchColumnSettings.period && <TableHead>Period</TableHead>}
                      {searchColumnSettings.paymentMode && <TableHead>Payment Mode</TableHead>}
                      {searchColumnSettings.billStatus && <TableHead>Bill Status</TableHead>}
                      {searchColumnSettings.voucherNo && <TableHead>Voucher #</TableHead>}
                      <TableHead>Options</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExpenses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                          No operational expenses found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredExpenses.map((exp, idx) => (
                        <TableRow key={exp.id}>
                          <TableCell>{idx + 1}</TableCell>
                          {searchColumnSettings.id && <TableCell className="font-medium">{exp.expenseId}</TableCell>}
                          {searchColumnSettings.expenseDate && <TableCell>{exp.date}</TableCell>}
                          {searchColumnSettings.branchName && <TableCell>{exp.branchName}</TableCell>}
                          {searchColumnSettings.vendorName && <TableCell>{exp.vendorName}</TableCell>}
                          {searchColumnSettings.invoiceNo && <TableCell>{exp.invoiceNo}</TableCell>}
                          {searchColumnSettings.invoiceDate && <TableCell>{exp.invoiceDate}</TableCell>}
                          {searchColumnSettings.period && <TableCell>{exp.periodFrom} to {exp.periodTo}</TableCell>}
                          {searchColumnSettings.paymentMode && <TableCell>{exp.paymentMode}</TableCell>}
                          {searchColumnSettings.billStatus && <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              exp.billStatus === "Pending" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                            }`}>
                              {exp.billStatus}
                            </span>
                          </TableCell>}
                          {searchColumnSettings.voucherNo && <TableCell>{exp.voucherNo}</TableCell>}
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleViewDetails(exp)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Printer className="h-4 w-4" />
                              </Button>
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

          {/* Summary Footer */}
          {filteredExpenses.length > 0 && (
            <div className="text-sm text-muted-foreground border-t pt-3 flex justify-between">
              <span>Total Records: {filteredExpenses.length}</span>
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
                <div><Label>Date</Label><p className="font-medium">{selectedExpense.date}</p></div>
                <div><Label>Branch Name</Label><p className="font-medium">{selectedExpense.branchName}</p></div>
                <div><Label>Vendor Name</Label><p className="font-medium">{selectedExpense.vendorName}</p></div>
                <div><Label>Invoice #</Label><p className="font-medium">{selectedExpense.invoiceNo}</p></div>
                <div><Label>Invoice Date</Label><p className="font-medium">{selectedExpense.invoiceDate}</p></div>
                <div><Label>Period</Label><p className="font-medium">{selectedExpense.periodFrom} to {selectedExpense.periodTo}</p></div>
                <div><Label>Mode Type</Label><p className="font-medium">{selectedExpense.modeType}</p></div>
                <div><Label>Document Type</Label><p className="font-medium">{selectedExpense.documentType}</p></div>
                <div><Label>Bill Status</Label><p className="font-medium">{selectedExpense.billStatus}</p></div>
                <div><Label>Voucher #</Label><p className="font-medium">{selectedExpense.voucherNo}</p></div>
                <div><Label>Payment Mode</Label><p className="font-medium">{selectedExpense.paymentMode}</p></div>
              </div>
              {selectedExpense.items.length > 0 && (
                <>
                  <div className="font-semibold mt-4">Expense Items:</div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item Name</TableHead>
                        <TableHead>A/C Head</TableHead>
                        <TableHead>Origin</TableHead>
                        <TableHead>Destination</TableHead>
                        <TableHead>No Of GR</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedExpense.items.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{item.itemName}</TableCell>
                          <TableCell>{item.aCHead}</TableCell>
                          <TableCell>{item.origin}</TableCell>
                          <TableCell>{item.destination}</TableCell>
                          <TableCell>{item.noOfGR}</TableCell>
                          <TableCell className="text-right">₹ {item.amount.toLocaleString()}</TableCell>
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