"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  CalendarIcon,
  Save,
  RefreshCw,
  Search,
  Pencil,
  Trash2,
  Check,
  X,
  Lock,
  Eye,
  EyeOff,
  FileText,
  CreditCard,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Types
interface FinancialYear {
  id: number;
  fromDate: Date;
  toDate: Date;
  financialYear: string;
  invoiceStartNo: number;
  tdsRecoverableLedger: string;
  freightInvoiceStartNo: number;
  lockEditing: boolean;
  hideFinancialYear: boolean;
  eInvoiceImplement: boolean;
  branchWiseCreditNoteSeries: boolean;
  invoiceSeriesOnCategory: boolean;
  mercantileAccounting: boolean;
}

// Options
const tdsRecoverableLedgerOptions = [
  "TDS Recoverable - Central",
  "TDS Recoverable - State",
  "TDS Recoverable - Others",
];

export default function FinancialYearMaster() {
  const [activeTab, setActiveTab] = useState<"entry" | "search">("entry");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Form State
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [financialYear, setFinancialYear] = useState<string>("");
  const [invoiceStartNo, setInvoiceStartNo] = useState<number>(1);
  const [tdsRecoverableLedger, setTdsRecoverableLedger] = useState<string>("");
  const [freightInvoiceStartNo, setFreightInvoiceStartNo] = useState<number>(0);
  const [lockEditing, setLockEditing] = useState<boolean>(false);
  const [hideFinancialYear, setHideFinancialYear] = useState<boolean>(false);
  const [eInvoiceImplement, setEInvoiceImplement] = useState<boolean>(false);
  const [branchWiseCreditNoteSeries, setBranchWiseCreditNoteSeries] = useState<boolean>(false);
  const [invoiceSeriesOnCategory, setInvoiceSeriesOnCategory] = useState<boolean>(false);
  const [mercantileAccounting, setMercantileAccounting] = useState<boolean>(false);

  // Sample Data
  const [savedRecords, setSavedRecords] = useState<FinancialYear[]>([
    { id: 1, fromDate: new Date("2024-04-01"), toDate: new Date("2025-03-31"), financialYear: "2024-2025", invoiceStartNo: 1, tdsRecoverableLedger: "TDS Recoverable - Central", freightInvoiceStartNo: 1, lockEditing: false, hideFinancialYear: false, eInvoiceImplement: false, branchWiseCreditNoteSeries: false, invoiceSeriesOnCategory: false, mercantileAccounting: false },
    { id: 2, fromDate: new Date("2025-04-01"), toDate: new Date("2026-03-31"), financialYear: "2025-2026", invoiceStartNo: 1, tdsRecoverableLedger: "TDS Recoverable - Central", freightInvoiceStartNo: 1, lockEditing: false, hideFinancialYear: false, eInvoiceImplement: false, branchWiseCreditNoteSeries: false, invoiceSeriesOnCategory: false, mercantileAccounting: false },
    { id: 3, fromDate: new Date("2026-04-01"), toDate: new Date("2027-03-31"), financialYear: "2026-2027", invoiceStartNo: 1, tdsRecoverableLedger: "TDS Recoverable - Central", freightInvoiceStartNo: 1, lockEditing: false, hideFinancialYear: false, eInvoiceImplement: false, branchWiseCreditNoteSeries: false, invoiceSeriesOnCategory: false, mercantileAccounting: false },
  ]);

  // Auto-generate Financial Year based on From Date and To Date
  const generateFinancialYear = (from: Date, to: Date) => {
    const fromYear = from.getFullYear();
    const toYear = to.getFullYear();
    return `${fromYear}-${toYear}`;
  };

  const handleFromDateChange = (date: Date | undefined) => {
    if (date) {
      setFromDate(date);
      if (toDate) {
        setFinancialYear(generateFinancialYear(date, toDate));
      }
    }
  };

  const handleToDateChange = (date: Date | undefined) => {
    if (date) {
      setToDate(date);
      if (fromDate) {
        setFinancialYear(generateFinancialYear(fromDate, date));
      }
    }
  };

  const resetForm = () => {
    setFromDate(new Date());
    setToDate(new Date());
    setFinancialYear("");
    setInvoiceStartNo(1);
    setTdsRecoverableLedger("");
    setFreightInvoiceStartNo(0);
    setLockEditing(false);
    setHideFinancialYear(false);
    setEInvoiceImplement(false);
    setBranchWiseCreditNoteSeries(false);
    setInvoiceSeriesOnCategory(false);
    setMercantileAccounting(false);
    setEditId(null);
  };

  const handleSave = () => {
    if (!fromDate) { alert("Please select From Date"); return; }
    if (!toDate) { alert("Please select To Date"); return; }
    if (!financialYear) { alert("Please enter Financial Year"); return; }

    setLoading(true);
    setTimeout(() => {
      const newRecord: FinancialYear = {
        id: editId || Date.now(),
        fromDate,
        toDate,
        financialYear,
        invoiceStartNo,
        tdsRecoverableLedger,
        freightInvoiceStartNo,
        lockEditing,
        hideFinancialYear,
        eInvoiceImplement,
        branchWiseCreditNoteSeries,
        invoiceSeriesOnCategory,
        mercantileAccounting,
      };

      if (editId) {
        setSavedRecords(savedRecords.map(record => record.id === editId ? newRecord : record));
        alert("Record updated successfully!");
      } else {
        setSavedRecords([...savedRecords, newRecord]);
        alert("Record saved successfully!");
      }
      resetForm();
      setActiveTab("search");
      setLoading(false);
    }, 500);
  };

  const handleEdit = (record: FinancialYear) => {
    setEditId(record.id);
    setFromDate(record.fromDate);
    setToDate(record.toDate);
    setFinancialYear(record.financialYear);
    setInvoiceStartNo(record.invoiceStartNo);
    setTdsRecoverableLedger(record.tdsRecoverableLedger);
    setFreightInvoiceStartNo(record.freightInvoiceStartNo);
    setLockEditing(record.lockEditing);
    setHideFinancialYear(record.hideFinancialYear);
    setEInvoiceImplement(record.eInvoiceImplement);
    setBranchWiseCreditNoteSeries(record.branchWiseCreditNoteSeries);
    setInvoiceSeriesOnCategory(record.invoiceSeriesOnCategory);
    setMercantileAccounting(record.mercantileAccounting);
    setActiveTab("entry");
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this record?")) {
      setSavedRecords(savedRecords.filter(record => record.id !== id));
      alert("Record deleted successfully!");
    }
  };

  const filteredRecords = savedRecords.filter(record =>
    record.financialYear.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedResults = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">FINANCIAL YEAR MASTER</h1>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[10px] md:text-xs text-muted-foreground">
          <span>Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
          <span>Login By : MAYANK.GRLOGISTICS@GMAIL.COM</span>
          <span>Login Branch : CORPORATE OFFICE</span>
          <span>Financial Year : 2026-2027</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button onClick={() => { setActiveTab("entry"); resetForm(); }} className={cn("px-4 py-2 text-sm font-medium transition-all", activeTab === "entry" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground")}>Entry</button>
        <button onClick={() => { setActiveTab("search"); setCurrentPage(1); }} className={cn("px-4 py-2 text-sm font-medium transition-all", activeTab === "search" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground")}>Search</button>
      </div>

      {/* Entry Tab */}
      {activeTab === "entry" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">From Date <span className="text-red-500">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-8 w-full text-xs">
                    <CalendarIcon className="mr-1 h-3 w-3" />
                    {format(fromDate, "dd-MM-yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={fromDate} onSelect={handleFromDateChange} />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">To Date <span className="text-red-500">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-8 w-full text-xs">
                    <CalendarIcon className="mr-1 h-3 w-3" />
                    {format(toDate, "dd-MM-yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={toDate} onSelect={handleToDateChange} />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Financial Year <span className="text-red-500">*</span></Label>
              <Input value={financialYear} onChange={(e) => setFinancialYear(e.target.value)} placeholder="YYYY-YYYY" className="h-8 text-xs" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Invoice Start No</Label>
              <Input type="number" value={invoiceStartNo} onChange={(e) => setInvoiceStartNo(Number(e.target.value))} className="h-8 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">TDS Recoverable Ledger</Label>
              <Select value={tdsRecoverableLedger} onValueChange={setTdsRecoverableLedger}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                <SelectContent>{tdsRecoverableLedgerOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Freight Invoice Start No</Label>
              <Input type="number" value={freightInvoiceStartNo} onChange={(e) => setFreightInvoiceStartNo(Number(e.target.value))} className="h-8 text-xs" />
            </div>
          </div>

          {/* Checkboxes Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 p-3 border rounded-md bg-muted/20">
            <div className="flex items-center gap-2"><input type="checkbox" checked={lockEditing} onChange={(e) => setLockEditing(e.target.checked)} className="h-3.5 w-3.5" id="lockEditing" /><Label htmlFor="lockEditing" className="text-xs cursor-pointer">Lock Editing</Label></div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={hideFinancialYear} onChange={(e) => setHideFinancialYear(e.target.checked)} className="h-3.5 w-3.5" id="hideFinancialYear" /><Label htmlFor="hideFinancialYear" className="text-xs cursor-pointer">Hide Financial Year</Label></div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={eInvoiceImplement} onChange={(e) => setEInvoiceImplement(e.target.checked)} className="h-3.5 w-3.5" id="eInvoiceImplement" /><Label htmlFor="eInvoiceImplement" className="text-xs cursor-pointer">E-Invoice Implement</Label></div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={branchWiseCreditNoteSeries} onChange={(e) => setBranchWiseCreditNoteSeries(e.target.checked)} className="h-3.5 w-3.5" id="branchWiseCreditNoteSeries" /><Label htmlFor="branchWiseCreditNoteSeries" className="text-xs cursor-pointer">Branch Wise Credit Note Series</Label></div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={invoiceSeriesOnCategory} onChange={(e) => setInvoiceSeriesOnCategory(e.target.checked)} className="h-3.5 w-3.5" id="invoiceSeriesOnCategory" /><Label htmlFor="invoiceSeriesOnCategory" className="text-xs cursor-pointer">Invoice Series On Category</Label></div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={mercantileAccounting} onChange={(e) => setMercantileAccounting(e.target.checked)} className="h-3.5 w-3.5" id="mercantileAccounting" /><Label htmlFor="mercantileAccounting" className="text-xs cursor-pointer">Mercantile Accounting</Label></div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button onClick={handleSave} size="sm" className="h-8 text-xs bg-green-600" disabled={loading}><Save className="mr-1 h-3 w-3" />{editId ? "UPDATE" : "SAVE"}</Button>
            <Button onClick={resetForm} variant="outline" size="sm" className="h-8 text-xs"><RefreshCw className="mr-1 h-3 w-3" />CLEAR</Button>
          </div>
        </div>
      )}

      {/* Search Tab */}
      {activeTab === "search" && (
        <div className="space-y-4">
          <div className="flex gap-2"><div className="relative flex-1 max-w-md"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" /><Input placeholder="Search by Financial Year..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 h-8 text-xs" /></div></div>
          <div className="rounded-md border overflow-x-auto"><div className="min-w-[600px]"><Table className="text-xs"><TableHeader><TableRow className="bg-muted/50"><TableHead>S#</TableHead><TableHead>Financial Year</TableHead><TableHead>From Date</TableHead><TableHead>To Date</TableHead><TableHead>Invoice Start No</TableHead><TableHead className="w-20 text-center">Action</TableHead></TableRow></TableHeader><TableBody>{paginatedResults.length === 0 ? (<TableRow><TableCell colSpan={6} className="text-center py-8">No records found</TableCell></TableRow>) : (paginatedResults.map((record, idx) => (<TableRow key={record.id} className="hover:bg-muted/30"><TableCell>{(currentPage-1)*itemsPerPage+idx+1}</TableCell><TableCell className="font-medium">{record.financialYear}</TableCell><TableCell>{format(record.fromDate, "dd-MM-yyyy")}</TableCell><TableCell>{format(record.toDate, "dd-MM-yyyy")}</TableCell><TableCell>{record.invoiceStartNo}</TableCell><TableCell className="text-center"><Button variant="ghost" size="sm" onClick={() => handleEdit(record)} className="h-6 w-6 p-0 text-blue-500"><Pencil className="h-3.5 w-3.5" /></Button></TableCell></TableRow>)))}</TableBody></Table></div></div>
          {totalPages > 1 && (<div className="flex justify-center gap-1"><Button variant="outline" size="sm" onClick={() => goToPage(currentPage-1)} disabled={currentPage===1} className="h-7 text-xs">Previous</Button><span className="px-3 py-1 text-xs">Page {currentPage} of {totalPages}</span><Button variant="outline" size="sm" onClick={() => goToPage(currentPage+1)} disabled={currentPage===totalPages} className="h-7 text-xs">Next</Button></div>)}
        </div>
      )}
    </div>
  );
}