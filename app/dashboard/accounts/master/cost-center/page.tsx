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
  TableFooter,
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
  PlusCircle,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Types
interface CostCenter {
  id: number;
  code: string;
  createYear: string;
  name: string;
  aliasName: string;
  group: string;
  underLedger: string;
  underGroup: string;
  corporateOffice: string;
  active: boolean;
  listType: string;
  costCentreGroup: string;
}

interface OpeningBalance {
  id: number;
  branch: string;
  openingBalance: number;
  drCr: string;
}

// Options
const createYearOptions = ["2024-2025", "2025-2026", "2026-2027", "2027-2028"];
const groupOptions = ["Administration", "Sales", "Marketing", "Operations", "Finance", "HR", "IT", "Logistics"];
const underLedgerOptions = ["Sundry Debtors", "Sundry Creditors", "Bank Account", "Cash Account", "Loans & Advances"];
const underGroupOptions = ["Current Assets", "Fixed Assets", "Current Liabilities", "Capital Account", "Provisions"];
const corporateOfficeOptions = ["CORPORATE OFFICE", "DELHI", "MUMBAI", "BANGALORE", "CHENNAI", "KOLKATA", "AHMEDABAD", "PUNE", "HYDERABAD"];
const listTypeOptions = ["Cost Center", "Cost Centre Group"];
const costCentreGroupOptions = ["Group A", "Group B", "Group C", "Group D", "Group E"];
const branchOptions = ["CORPORATE OFFICE", "DELHI", "MUMBAI", "BANGALORE", "CHENNAI", "KOLKATA", "AHMEDABAD", "PUNE", "HYDERABAD", "JAIPUR", "LUCKNOW"];

export default function CostCenterMaster() {
  const [activeTab, setActiveTab] = useState<"entry" | "search" | "opening">("entry");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Entry Form State
  const [code, setCode] = useState<string>("");
  const [createYear, setCreateYear] = useState<string>("2026-2027");
  const [name, setName] = useState<string>("");
  const [aliasName, setAliasName] = useState<string>("");
  const [group, setGroup] = useState<string>("");
  const [underLedger, setUnderLedger] = useState<string>("");
  const [underGroup, setUnderGroup] = useState<string>("");
  const [corporateOffice, setCorporateOffice] = useState<string>("CORPORATE OFFICE");
  const [active, setActive] = useState<boolean>(true);
  const [listType, setListType] = useState<string>("Cost Center");
  const [costCentreGroup, setCostCentreGroup] = useState<string>("");

  // Search State
  const [searchSubLedgerName, setSearchSubLedgerName] = useState<string>("");
  const [searchResults, setSearchResults] = useState<CostCenter[]>([]);
  const [searchCurrentPage, setSearchCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Opening Balance State
  const [openingBalanceName, setOpeningBalanceName] = useState<string>("");
  const [openingBalanceCreateYear, setOpeningBalanceCreateYear] = useState<string>("");
  const [openingBalanceGroup, setOpeningBalanceGroup] = useState<string>("");
  const [openingBalanceCurrentYear, setOpeningBalanceCurrentYear] = useState<string>("");
  const [openingBalanceUnderGroup, setOpeningBalanceUnderGroup] = useState<string>("");
  const [openingBalanceResults, setOpeningBalanceResults] = useState<OpeningBalance[]>([]);
  const [openingBalanceSearchTerm, setOpeningBalanceSearchTerm] = useState<string>("");
  const [openingBalanceCurrentPage, setOpeningBalanceCurrentPage] = useState<number>(1);
  const openingBalanceItemsPerPage: number = 10;

  // Sample Data
  const [savedRecords, setSavedRecords] = useState<CostCenter[]>([
    { id: 1, code: "CC001", createYear: "2026-2027", name: "Administration Cost", aliasName: "Admin Cost", group: "Administration", underLedger: "Sundry Debtors", underGroup: "Current Assets", corporateOffice: "CORPORATE OFFICE", active: true, listType: "Cost Center", costCentreGroup: "" },
    { id: 2, code: "CC002", createYear: "2026-2027", name: "Sales Commission", aliasName: "Sales Comm", group: "Sales", underLedger: "Sundry Debtors", underGroup: "Current Assets", corporateOffice: "DELHI", active: true, listType: "Cost Center", costCentreGroup: "" },
    { id: 3, code: "CC003", createYear: "2025-2026", name: "Marketing Expenses", aliasName: "Mktg Exp", group: "Marketing", underLedger: "Sundry Creditors", underGroup: "Current Liabilities", corporateOffice: "MUMBAI", active: false, listType: "Cost Centre Group", costCentreGroup: "Group A" },
    { id: 4, code: "CC004", createYear: "2026-2027", name: "Transport Cost", aliasName: "Trans Cost", group: "Logistics", underLedger: "Sundry Creditors", underGroup: "Current Liabilities", corporateOffice: "BANGALORE", active: true, listType: "Cost Center", costCentreGroup: "" },
    { id: 5, code: "CC005", createYear: "2025-2026", name: "Warehouse Expenses", aliasName: "WH Exp", group: "Operations", underLedger: "Sundry Debtors", underGroup: "Current Assets", corporateOffice: "CHENNAI", active: true, listType: "Cost Center", costCentreGroup: "" },
  ]);

  const [sampleOpeningBalance, setSampleOpeningBalance] = useState<OpeningBalance[]>([
    { id: 1, branch: "CORPORATE OFFICE", openingBalance: 500000, drCr: "DR" },
    { id: 2, branch: "DELHI", openingBalance: 250000, drCr: "CR" },
    { id: 3, branch: "MUMBAI", openingBalance: 300000, drCr: "DR" },
    { id: 4, branch: "BANGALORE", openingBalance: 150000, drCr: "CR" },
    { id: 5, branch: "CHENNAI", openingBalance: 200000, drCr: "DR" },
    { id: 6, branch: "KOLKATA", openingBalance: 180000, drCr: "CR" },
    { id: 7, branch: "AHMEDABAD", openingBalance: 120000, drCr: "DR" },
    { id: 8, branch: "PUNE", openingBalance: 90000, drCr: "CR" },
    { id: 9, branch: "HYDERABAD", openingBalance: 175000, drCr: "DR" },
    { id: 10, branch: "JAIPUR", openingBalance: 110000, drCr: "CR" },
  ]);

  const generateCode = (): string => {
    const count = savedRecords.length + 1;
    return `CC${String(count).padStart(3, "0")}`;
  };

  const resetForm = () => {
    setCode(generateCode());
    setCreateYear("2026-2027");
    setName("");
    setAliasName("");
    setGroup("");
    setUnderLedger("");
    setUnderGroup("");
    setCorporateOffice("CORPORATE OFFICE");
    setActive(true);
    setListType("Cost Center");
    setCostCentreGroup("");
    setEditId(null);
  };

  const handleSave = () => {
    if (!name) { alert("Please enter Name"); return; }
    if (!group) { alert("Please select Group"); return; }

    setLoading(true);
    setTimeout(() => {
      const newRecord: CostCenter = {
        id: editId || Date.now(),
        code,
        createYear,
        name,
        aliasName,
        group,
        underLedger,
        underGroup,
        corporateOffice,
        active,
        listType,
        costCentreGroup,
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

  const handleEdit = (record: CostCenter) => {
    setEditId(record.id);
    setCode(record.code);
    setCreateYear(record.createYear);
    setName(record.name);
    setAliasName(record.aliasName);
    setGroup(record.group);
    setUnderLedger(record.underLedger);
    setUnderGroup(record.underGroup);
    setCorporateOffice(record.corporateOffice);
    setActive(record.active);
    setListType(record.listType);
    setCostCentreGroup(record.costCentreGroup || "");
    setActiveTab("entry");
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this record?")) {
      setSavedRecords(savedRecords.filter(record => record.id !== id));
      setSearchResults(searchResults.filter(record => record.id !== id));
      alert("Record deleted successfully!");
    }
  };

  const handleSearch = () => {
    let results = [...savedRecords];
    if (searchSubLedgerName) {
      results = results.filter(r => 
        r.name.toLowerCase().includes(searchSubLedgerName.toLowerCase()) ||
        r.aliasName.toLowerCase().includes(searchSubLedgerName.toLowerCase()) ||
        r.code.toLowerCase().includes(searchSubLedgerName.toLowerCase())
      );
    }
    setSearchResults(results);
    setSearchCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchSubLedgerName("");
    setSearchResults([]);
    setSearchCurrentPage(1);
  };

  const handleOpeningBalanceSearch = () => {
    let results = [...sampleOpeningBalance];
    if (openingBalanceSearchTerm) {
      results = results.filter(r => 
        r.branch.toLowerCase().includes(openingBalanceSearchTerm.toLowerCase())
      );
    }
    if (openingBalanceName) {
      results = results.filter(r => 
        r.branch.toLowerCase().includes(openingBalanceName.toLowerCase())
      );
    }
    setOpeningBalanceResults(results);
    setOpeningBalanceCurrentPage(1);
  };

  const handleOpeningBalanceClear = () => {
    setOpeningBalanceName("");
    setOpeningBalanceCreateYear("");
    setOpeningBalanceGroup("");
    setOpeningBalanceCurrentYear("");
    setOpeningBalanceUnderGroup("");
    setOpeningBalanceSearchTerm("");
    setOpeningBalanceResults([]);
    setOpeningBalanceCurrentPage(1);
  };

  const handleSearchAll = () => {
    setOpeningBalanceResults([...sampleOpeningBalance]);
    setOpeningBalanceCurrentPage(1);
  };

  const getTotalOpeningBalance = () => {
    return openingBalanceResults.reduce((sum, item) => sum + item.openingBalance, 0);
  };

  const totalOpeningBalance = getTotalOpeningBalance();

  const paginatedResults = searchResults.slice((searchCurrentPage - 1) * itemsPerPage, searchCurrentPage * itemsPerPage);
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const goToPage = (page: number) => setSearchCurrentPage(Math.max(1, Math.min(page, totalPages)));

  const paginatedOpeningBalance = openingBalanceResults.slice((openingBalanceCurrentPage - 1) * openingBalanceItemsPerPage, openingBalanceCurrentPage * openingBalanceItemsPerPage);
  const totalOpeningBalancePages = Math.ceil(openingBalanceResults.length / openingBalanceItemsPerPage);
  const goToOpeningBalancePage = (page: number) => setOpeningBalanceCurrentPage(Math.max(1, Math.min(page, totalOpeningBalancePages)));

  const handleAddOpeningBalance = () => {
    const newBalance: OpeningBalance = {
      id: Date.now(),
      branch: "",
      openingBalance: 0,
      drCr: "DR",
    };
    setSampleOpeningBalance([...sampleOpeningBalance, newBalance]);
    handleOpeningBalanceSearch();
  };

  const handleUpdateOpeningBalance = (id: number, field: keyof OpeningBalance, value: any) => {
    setSampleOpeningBalance(sampleOpeningBalance.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
    setOpeningBalanceResults(openingBalanceResults.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleDeleteOpeningBalance = (id: number) => {
    if (confirm("Are you sure you want to delete this opening balance?")) {
      setSampleOpeningBalance(sampleOpeningBalance.filter(item => item.id !== id));
      setOpeningBalanceResults(openingBalanceResults.filter(item => item.id !== id));
      alert("Opening balance deleted successfully!");
    }
  };

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">COST CENTER MASTER</h1>
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
        <button onClick={() => { setActiveTab("search"); handleSearch(); }} className={cn("px-4 py-2 text-sm font-medium transition-all", activeTab === "search" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground")}>Search</button>
        <button onClick={() => { setActiveTab("opening"); handleOpeningBalanceSearch(); }} className={cn("px-4 py-2 text-sm font-medium transition-all", activeTab === "opening" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground")}>Opening Balance</button>
      </div>

      {/* Entry Tab */}
      {activeTab === "entry" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1"><Label className="text-xs">Code</Label><Input value={code} readOnly className="h-8 text-xs bg-muted" /></div>
            <div className="space-y-1"><Label className="text-xs">Create Year</Label><Select value={createYear} onValueChange={setCreateYear}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{createYearOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">Name <span className="text-red-500">*</span></Label><Input value={name} onChange={(e) => setName(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Alias Name</Label><Input value={aliasName} onChange={(e) => setAliasName(e.target.value)} className="h-8 text-xs" /></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1"><Label className="text-xs">Group <span className="text-red-500">*</span></Label><Select value={group} onValueChange={setGroup}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{groupOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">Under Ledger</Label><Select value={underLedger} onValueChange={setUnderLedger}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{underLedgerOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">Under Group</Label><Select value={underGroup} onValueChange={setUnderGroup}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{underGroupOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">Corporate Office <span className="text-red-500">*</span></Label><Select value={corporateOffice} onValueChange={setCorporateOffice}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{corporateOfficeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="flex items-center gap-2"><input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-3.5 w-3.5" id="active" /><Label htmlFor="active" className="text-xs cursor-pointer">Active</Label></div>
            <div className="space-y-1"><Label className="text-xs">List Type</Label><Select value={listType} onValueChange={setListType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{listTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">Cost Centre Group</Label><Select value={costCentreGroup} onValueChange={setCostCentreGroup}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{costCentreGroupOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button onClick={handleSave} size="sm" className="h-8 text-xs bg-green-600"><Save className="mr-1 h-3 w-3" />SAVE</Button>
            <Button onClick={resetForm} variant="outline" size="sm" className="h-8 text-xs"><RefreshCw className="mr-1 h-3 w-3" />CLEAR</Button>
          </div>
        </div>
      )}

      {/* Search Tab */}
      {activeTab === "search" && (
        <div className="border rounded-md p-4">
          <h3 className="text-sm font-semibold mb-3">Sub Ledger Search</h3>
          <div className="flex flex-wrap gap-2 items-end">
            <div className="flex-1 min-w-[200px]">
              <Label className="text-xs">Sub Ledger Name</Label>
              <Input value={searchSubLedgerName} onChange={(e) => setSearchSubLedgerName(e.target.value)} placeholder="Enter Sub Ledger Name" className="h-8 text-xs" />
            </div>
            <Button onClick={handleSearch} size="sm" className="h-8 text-xs"><Search className="mr-1 h-3.5 w-3.5" />SEARCH</Button>
            <Button onClick={handleClearSearch} variant="outline" size="sm" className="h-8 text-xs"><RefreshCw className="mr-1 h-3.5 w-3.5" />CLEAR</Button>
          </div>

          <div className="rounded-md border overflow-x-auto mt-4">
            <Table className="text-xs">
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>S. No.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Alias Name</TableHead>
                  <TableHead>Group Name</TableHead>
                  <TableHead>Under Group</TableHead>
                  <TableHead className="w-24 text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedResults.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8">No records found</TableCell></TableRow>
                ) : (
                  paginatedResults.map((record, idx) => (
                    <TableRow key={record.id} className="hover:bg-muted/30">
                      <TableCell>{(searchCurrentPage - 1) * itemsPerPage + idx + 1}</TableCell>
                      <TableCell className="font-medium">{record.name}</TableCell>
                      <TableCell>{record.aliasName || "-"}</TableCell>
                      <TableCell>{record.group}</TableCell>
                      <TableCell>{record.underGroup || "-"}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(record)} className="h-6 w-6 p-0 text-blue-500"><Pencil className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(record.id)} className="h-6 w-6 p-0 text-red-500"><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {totalPages > 1 && (<div className="flex justify-center gap-1 mt-3"><Button variant="outline" size="sm" onClick={() => goToPage(searchCurrentPage - 1)} disabled={searchCurrentPage === 1} className="h-7 text-xs">Previous</Button><span className="px-3 py-1 text-xs">Page {searchCurrentPage} of {totalPages}</span><Button variant="outline" size="sm" onClick={() => goToPage(searchCurrentPage + 1)} disabled={searchCurrentPage === totalPages} className="h-7 text-xs">Next</Button></div>)}
        </div>
      )}

      {/* Opening Balance Tab */}
      {activeTab === "opening" && (
        <div className="border rounded-md p-4">
          <h3 className="text-sm font-semibold mb-3">Opening Balance</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
            <div><Label className="text-xs">Name</Label><Input value={openingBalanceName} onChange={(e) => setOpeningBalanceName(e.target.value)} placeholder="Enter Name" className="h-8 text-xs" /></div>
            <div><Label className="text-xs">Create Year</Label><Select value={openingBalanceCreateYear} onValueChange={setOpeningBalanceCreateYear}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{createYearOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            <div><Label className="text-xs">Group</Label><Select value={openingBalanceGroup} onValueChange={setOpeningBalanceGroup}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{groupOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            <div><Label className="text-xs">Current Year</Label><Select value={openingBalanceCurrentYear} onValueChange={setOpeningBalanceCurrentYear}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{createYearOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            <div><Label className="text-xs">Under Group</Label><Select value={openingBalanceUnderGroup} onValueChange={setOpeningBalanceUnderGroup}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{underGroupOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
          </div>

          <div className="flex flex-wrap gap-2 items-center mb-4">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search by Branch..." value={openingBalanceSearchTerm} onChange={(e) => setOpeningBalanceSearchTerm(e.target.value)} className="pl-8 h-8 text-xs" />
            </div>
            <Button onClick={handleOpeningBalanceSearch} size="sm" className="h-8 text-xs bg-blue-600"><Search className="mr-1 h-3.5 w-3.5" />SEARCH</Button>
            <Button onClick={handleOpeningBalanceClear} variant="outline" size="sm" className="h-8 text-xs"><RefreshCw className="mr-1 h-3.5 w-3.5" />CLEAR</Button>
            <Button onClick={handleSearchAll} variant="outline" size="sm" className="h-8 text-xs">Search All</Button>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table className="text-xs">
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>S#</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead className="text-right">Opening Balance</TableHead>
                  <TableHead className="text-center">Dr/Cr</TableHead>
                  <TableHead className="w-24 text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOpeningBalance.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8">No records found</TableCell></TableRow>
                ) : (
                  paginatedOpeningBalance.map((item, idx) => (
                    <TableRow key={item.id} className="hover:bg-muted/30">
                      <TableCell>{(openingBalanceCurrentPage - 1) * openingBalanceItemsPerPage + idx + 1}</TableCell>
                      <TableCell>
                        <Select value={item.branch} onValueChange={(val) => handleUpdateOpeningBalance(item.id, "branch", val)}>
                          <SelectTrigger className="h-7 w-40 text-xs"><SelectValue placeholder="Select Branch" /></SelectTrigger>
                          <SelectContent>{branchOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right"><Input type="number" value={item.openingBalance} onChange={(e) => handleUpdateOpeningBalance(item.id, "openingBalance", Number(e.target.value))} className="h-7 w-32 text-xs text-right" /></TableCell>
                      <TableCell className="text-center">
                        <Select value={item.drCr} onValueChange={(val) => handleUpdateOpeningBalance(item.id, "drCr", val)}>
                          <SelectTrigger className="h-7 w-20 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent><SelectItem value="DR">DR</SelectItem><SelectItem value="CR">CR</SelectItem></SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteOpeningBalance(item.id)} className="h-6 w-6 p-0 text-red-500"><Trash2 className="h-3.5 w-3.5" /></Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              <TableFooter>
                <TableRow className="bg-muted/30">
                  <TableCell colSpan={2} className="font-semibold">Total :</TableCell>
                  <TableCell className="text-right font-semibold">₹{totalOpeningBalance.toLocaleString()}</TableCell>
                  <TableCell colSpan={2}></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <Button onClick={handleAddOpeningBalance} variant="outline" size="sm" className="h-8 text-xs"><PlusCircle className="mr-1 h-3.5 w-3.5" />ADD NEW ROW</Button>
            {totalOpeningBalancePages > 1 && (<div className="flex gap-1"><Button variant="outline" size="sm" onClick={() => goToOpeningBalancePage(openingBalanceCurrentPage - 1)} disabled={openingBalanceCurrentPage === 1} className="h-7 text-xs">Previous</Button><span className="px-3 py-1 text-xs">Page {openingBalanceCurrentPage} of {totalOpeningBalancePages}</span><Button variant="outline" size="sm" onClick={() => goToOpeningBalancePage(openingBalanceCurrentPage + 1)} disabled={openingBalanceCurrentPage === totalOpeningBalancePages} className="h-7 text-xs">Next</Button></div>)}
          </div>
        </div>
      )}
    </div>
  );
}