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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Save,
  RefreshCw,
  Search,
  Pencil,
  Trash2,
  Check,
  X,
  Plus,
  Minus,
  DollarSign,
  Percent,
  FileText,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface InvoiceSetup {
  id: number;
  invoiceCode: string;
  active: boolean;
  invoiceName: string;
  variableName: string;
  aCHead: string;
  addLess: string;
  percentage: number;
  amount: number;
  roundOff: boolean;
  isTax: boolean;
  isTDS: boolean;
}

// Options
const addLessOptions = [
  { value: "+", label: "+ (Add)", icon: Plus },
  { value: "-", label: "- (Less)", icon: Minus },
];

const aCHeadOptions = [
  "GST - CENTRAL GOODS AND SERVICE TAX - (CGST)",
  "GST - INTEGRATED GOODS AND SERVICE TAX - (IGST)",
  "GST - STATE GOODS AND SERVICE TAX - (SGST)",
  "ROUND OFF",
  "TDS ON AGENCY COMMISSION",
  "TDS ON CONTRACTOR A/C",
  "FREIGHT CHARGES",
  "LOADING CHARGES",
  "UNLOADING CHARGES",
  "HAMALI CHARGES",
  "STORAGE CHARGES",
];

export default function InvoiceSetup() {
  const [activeTab, setActiveTab] = useState<"entry" | "search">("entry");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Form State
  const [invoiceCode, setInvoiceCode] = useState<string>("");
  const [active, setActive] = useState<boolean>(true);
  const [invoiceName, setInvoiceName] = useState<string>("");
  const [variableName, setVariableName] = useState<string>("");
  const [aCHead, setACHead] = useState<string>("");
  const [addLess, setAddLess] = useState<string>("+");
  const [percentage, setPercentage] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const [roundOff, setRoundOff] = useState<boolean>(false);
  const [isTax, setIsTax] = useState<boolean>(false);
  const [isTDS, setIsTDS] = useState<boolean>(false);

  // Sample Data
  const [savedRecords, setSavedRecords] = useState<InvoiceSetup[]>([
    { id: 1, invoiceCode: "14", active: true, invoiceName: "CGST", variableName: "", aCHead: "GST - CENTRAL GOODS AND SERVICE TAX - (CGST)", addLess: "+", percentage: 0, amount: 0, roundOff: false, isTax: true, isTDS: false },
    { id: 2, invoiceCode: "13", active: true, invoiceName: "IGST", variableName: "", aCHead: "GST - INTEGRATED GOODS AND SERVICE TAX - (IGST)", addLess: "+", percentage: 0, amount: 0, roundOff: false, isTax: true, isTDS: false },
    { id: 3, invoiceCode: "12", active: true, invoiceName: "ROUND OFF", variableName: "", aCHead: "ROUND OFF", addLess: "+", percentage: 0, amount: 0, roundOff: true, isTax: false, isTDS: false },
    { id: 4, invoiceCode: "15", active: true, invoiceName: "SGST", variableName: "", aCHead: "GST - STATE GOODS AND SERVICE TAX - (SGST)", addLess: "+", percentage: 0, amount: 0, roundOff: false, isTax: true, isTDS: false },
    { id: 5, invoiceCode: "19", active: true, invoiceName: "TDS ON AGENCY COMMISSION", variableName: "", aCHead: "TDS ON AGENCY COMMISSION", addLess: "-", percentage: 0, amount: 0, roundOff: false, isTax: false, isTDS: true },
    { id: 6, invoiceCode: "16", active: true, invoiceName: "TDS ON CONTRACTOR A/C", variableName: "", aCHead: "TDS ON CONTRACTOR A/C", addLess: "-", percentage: 2, amount: 0, roundOff: false, isTax: false, isTDS: true },
  ]);

  const generateInvoiceCode = (): string => {
    const existingCodes = savedRecords.map(r => parseInt(r.invoiceCode)).filter(c => !isNaN(c));
    const maxCode = existingCodes.length > 0 ? Math.max(...existingCodes) : 0;
    return String(maxCode + 1);
  };

  const resetForm = () => {
    setInvoiceCode(generateInvoiceCode());
    setActive(true);
    setInvoiceName("");
    setVariableName("");
    setACHead("");
    setAddLess("+");
    setPercentage(0);
    setAmount(0);
    setRoundOff(false);
    setIsTax(false);
    setIsTDS(false);
    setEditId(null);
  };

  const handleSave = () => {
    if (!invoiceName) { alert("Please enter Invoice Name"); return; }
    if (!aCHead) { alert("Please select A/C Head"); return; }

    setLoading(true);
    setTimeout(() => {
      const newRecord: InvoiceSetup = {
        id: editId || Date.now(),
        invoiceCode: invoiceCode,
        active,
        invoiceName,
        variableName,
        aCHead,
        addLess,
        percentage,
        amount,
        roundOff,
        isTax,
        isTDS,
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

  const handleEdit = (record: InvoiceSetup) => {
    setEditId(record.id);
    setInvoiceCode(record.invoiceCode);
    setActive(record.active);
    setInvoiceName(record.invoiceName);
    setVariableName(record.variableName);
    setACHead(record.aCHead);
    setAddLess(record.addLess);
    setPercentage(record.percentage);
    setAmount(record.amount);
    setRoundOff(record.roundOff);
    setIsTax(record.isTax);
    setIsTDS(record.isTDS);
    setActiveTab("entry");
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this record?")) {
      setSavedRecords(savedRecords.filter(record => record.id !== id));
      alert("Record deleted successfully!");
    }
  };

  const filteredRecords = savedRecords.filter(record =>
    record.invoiceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.invoiceCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.aCHead.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedResults = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  const AddLessIcon = ({ value }: { value: string }) => {
    if (value === "+") return <Plus className="h-3.5 w-3.5 text-green-600" />;
    return <Minus className="h-3.5 w-3.5 text-red-600" />;
  };

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">INVOICE SETUP</h1>
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
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Invoice Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Invoice Code</Label>
                <Input value={invoiceCode} readOnly className="h-8 text-xs bg-muted" />
              </div>
              <div className="flex items-center gap-2 mt-6">
                <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-3.5 w-3.5" id="active" />
                <Label htmlFor="active" className="text-xs cursor-pointer">Active</Label>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Invoice Name <span className="text-red-500">*</span></Label>
                <Input value={invoiceName} onChange={(e) => setInvoiceName(e.target.value)} placeholder="Enter Invoice Name" className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Variable Name</Label>
                <Input value={variableName} onChange={(e) => setVariableName(e.target.value)} placeholder="Enter Variable Name" className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">A/C Head <span className="text-red-500">*</span></Label>
                <Select value={aCHead} onValueChange={setACHead}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                  <SelectContent>{aCHeadOptions.map(opt => (<SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Add Less</Label>
                <Select value={addLess} onValueChange={setAddLess}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                  <SelectContent>
                    {addLessOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs">
                        <div className="flex items-center gap-2">
                          <opt.icon className="h-3.5 w-3.5" />
                          {opt.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Percentage (%)</Label>
                <Input type="number" value={percentage} onChange={(e) => setPercentage(Number(e.target.value))} className="h-8 text-xs" step="0.01" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Amount (₹)</Label>
                <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="h-8 text-xs" step="0.01" />
              </div>
            </div>

            {/* Checkboxes Row */}
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2"><input type="checkbox" checked={roundOff} onChange={(e) => setRoundOff(e.target.checked)} className="h-3.5 w-3.5" id="roundOff" /><Label htmlFor="roundOff" className="text-xs cursor-pointer">Round Off</Label></div>
              <div className="flex items-center gap-2"><input type="checkbox" checked={isTax} onChange={(e) => setIsTax(e.target.checked)} className="h-3.5 w-3.5" id="isTax" /><Label htmlFor="isTax" className="text-xs cursor-pointer">Is Tax</Label></div>
              <div className="flex items-center gap-2"><input type="checkbox" checked={isTDS} onChange={(e) => setIsTDS(e.target.checked)} className="h-3.5 w-3.5" id="isTDS" /><Label htmlFor="isTDS" className="text-xs cursor-pointer">Is TDS</Label></div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button onClick={handleSave} size="sm" className="h-8 text-xs bg-green-600" disabled={loading}><Save className="mr-1 h-3 w-3" />{editId ? "UPDATE" : "SAVE"}</Button>
              <Button onClick={resetForm} variant="outline" size="sm" className="h-8 text-xs"><RefreshCw className="mr-1 h-3 w-3" />CLEAR</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Tab */}
      {activeTab === "search" && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" />
              <Input placeholder="Search by Invoice Code, Name or A/C Head..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 h-8 text-xs" />
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[700px]">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12 text-center">S#</TableHead>
                    <TableHead>Invoice Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>A/C Head</TableHead>
                    <TableHead className="text-center">%</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="w-24 text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedResults.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center py-8">No records found</TableCell></TableRow>
                  ) : (
                    paginatedResults.map((record, idx) => (
                      <TableRow key={record.id} className="hover:bg-muted/30">
                        <TableCell className="text-center">{(currentPage - 1) * itemsPerPage + idx + 1}</TableCell>
                        <TableCell className="font-mono">{record.invoiceCode}</TableCell>
                        <TableCell className="font-medium">{record.invoiceName}</TableCell>
                        <TableCell className="max-w-[250px] truncate">{record.aCHead}</TableCell>
                        <TableCell className="text-center">{record.percentage}%</TableCell>
                        <TableCell className="text-right">₹{record.amount.toLocaleString()}</TableCell>
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
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-1">
              <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="h-7 text-xs">Previous</Button>
              <span className="px-3 py-1 text-xs bg-muted rounded-md">Page {currentPage} of {totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="h-7 text-xs">Next</Button>
            </div>
          )}
        </div>
      )}

      {/* Info Note */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 rounded-md p-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
          <div className="text-xs text-blue-700 dark:text-blue-400">
            <p className="font-medium">Note:</p>
            <ul className="list-disc list-inside mt-1 space-y-0.5">
              <li>Invoice Code is auto-generated and cannot be edited</li>
              <li>Add Less: "+" means addition to invoice, "-" means deduction</li>
              <li>Percentage and Amount can be set based on calculation type</li>
              <li>Round Off - Rounds the invoice total to nearest integer</li>
              <li>Is Tax - Marks this as tax component (affects GST calculation)</li>
              <li>Is TDS - Marks this as TDS component (affects TDS calculation)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}