"use client";

import React, { useState, useEffect } from "react";
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, X, Save, RefreshCw, Search, Edit, Pencil, Check, Filter, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreditNoteReason {
  id: number;
  name: string;
  aliasName: string;
  ledger: string;
  reInvoice: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Sample ledger options
const ledgerOptions = [
  "Sales Ledger",
  "Purchase Ledger",
  "Expense Ledger",
  "Income Ledger",
  "Freight Ledger",
  "Other Income Ledger",
  "Discount Ledger"
];

export default function CreditNoteReasonMaster() {
  // Sheet state
  const [isEntrySheetOpen, setIsEntrySheetOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<number | null>(null);

  // Form state
  const [id, setId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [aliasName, setAliasName] = useState<string>("");
  const [ledger, setLedger] = useState<string>("");
  const [reInvoice, setReInvoice] = useState<boolean>(false);

  // Search state
  const [searchResults, setSearchResults] = useState<CreditNoteReason[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sample saved data
  const [savedRecords, setSavedRecords] = useState<CreditNoteReason[]>([
    { id: 1, name: "RATE DIFFERENCE", aliasName: "RATE DIFF", ledger: "Sales Ledger", reInvoice: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 2, name: "DAMAGE GOODS", aliasName: "DAMAGE", ledger: "Expense Ledger", reInvoice: false, createdAt: new Date(), updatedAt: new Date() },
    { id: 3, name: "SHORTAGE", aliasName: "SHORT", ledger: "Purchase Ledger", reInvoice: false, createdAt: new Date(), updatedAt: new Date() },
    { id: 4, name: "DELAY IN DELIVERY", aliasName: "DELAY", ledger: "Expense Ledger", reInvoice: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 5, name: "CUSTOMER CANCELLATION", aliasName: "CANCEL", ledger: "Sales Ledger", reInvoice: false, createdAt: new Date(), updatedAt: new Date() },
    { id: 6, name: "WRONG BILLING", aliasName: "WRONG BILL", ledger: "Sales Ledger", reInvoice: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 7, name: "EXCESS CHARGES", aliasName: "EXCESS", ledger: "Sales Ledger", reInvoice: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 8, name: "QUALITY ISSUE", aliasName: "QUALITY", ledger: "Expense Ledger", reInvoice: false, createdAt: new Date(), updatedAt: new Date() },
  ]);

  // Load search results on mount
  useEffect(() => {
    setSearchResults(savedRecords);
  }, []);

  // Generate new ID
  const generateId = () => {
    const maxId = savedRecords.length > 0 ? Math.max(...savedRecords.map(r => r.id)) : 0;
    return (maxId + 1).toString();
  };

  // Reset form
  const resetForm = () => {
    setId(generateId());
    setName("");
    setAliasName("");
    setLedger("");
    setReInvoice(false);
    setEditMode(false);
    setCurrentEditId(null);
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert("Please enter Credit Note Reason Name");
      return;
    }
    if (!ledger) {
      alert("Please select Ledger");
      return;
    }

    const newRecord: CreditNoteReason = {
      id: currentEditId || parseInt(id) || Date.now(),
      name: name.trim(),
      aliasName: aliasName.trim(),
      ledger: ledger,
      reInvoice: reInvoice,
      createdAt: editMode && currentEditId ?
        savedRecords.find(r => r.id === currentEditId)?.createdAt || new Date() :
        new Date(),
      updatedAt: new Date()
    };

    if (editMode && currentEditId) {
      setSavedRecords(savedRecords.map(record => record.id === currentEditId ? newRecord : record));
      alert("Record updated successfully!");
    } else {
      setSavedRecords([...savedRecords, newRecord]);
      alert("Record saved successfully!");
    }

    resetForm();
    setIsEntrySheetOpen(false);
    handleSearch();
  };

  const handleDelete = () => {
    if (currentEditId && confirm("Are you sure you want to delete this record?")) {
      setSavedRecords(savedRecords.filter(record => record.id !== currentEditId));
      setSearchResults(searchResults.filter(record => record.id !== currentEditId));
      resetForm();
      setIsEntrySheetOpen(false);
      alert("Record deleted successfully!");
    }
  };

  const handleSearch = () => {
    let results = [...savedRecords];
    if (searchTerm) {
      results = results.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.aliasName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.id.toString().includes(searchTerm)
      );
    }
    setSearchResults(results);
    setCurrentPage(1);
  };

  const handleEdit = (record: CreditNoteReason) => {
    setEditMode(true);
    setCurrentEditId(record.id);
    setId(record.id.toString());
    setName(record.name);
    setAliasName(record.aliasName);
    setLedger(record.ledger);
    setReInvoice(record.reInvoice);
    setIsEntrySheetOpen(true);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults(savedRecords);
  };

  const openAddSheet = () => {
    resetForm();
    setEditMode(false);
    setCurrentEditId(null);
    setId(generateId());
    setIsEntrySheetOpen(true);
  };

  // Stats
  const stats = {
    total: searchResults.length,
    reInvoice: searchResults.filter(r => r.reInvoice).length,
    noReInvoice: searchResults.filter(r => !r.reInvoice).length,
  };

  // Pagination
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const paginatedResults = searchResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get ReInvoice badge
  const getReInvoiceBadge = (value: boolean) => {
    return value ? (
      <Badge className="bg-green-500 hover:bg-green-600">Yes</Badge>
    ) : (
      <Badge variant="secondary" className="bg-gray-500">No</Badge>
    );
  };

  return (
    <div className="space-y-4 p-3 md:p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-wrap justify-between items-start gap-3">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">CREDIT NOTE REASON MASTER</h1>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
              <span>🏢 Company: GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
              <span>👤 Login: MAYANK.GRLOGISTICS@GMAIL.COM</span>
              <span>📍 Branch: CORPORATE OFFICE</span>
              <span>📅 Financial Year: 2026-2027</span>
            </div>
          </div>
          <Button onClick={openAddSheet} size="default" className="bg-blue-600 hover:bg-blue-700 shadow-md">
            <Plus className="mr-2 h-4 w-4" />
            Add Credit Note Reason
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Total Reasons</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Re-Invoice Enabled</p>
                <p className="text-2xl font-bold">{stats.reInvoice}</p>
              </div>
              <Check className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-gray-500 to-gray-600 text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Re-Invoice Disabled</p>
                <p className="text-2xl font-bold">{stats.noReInvoice}</p>
              </div>
              <X className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search Reasons
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by ID, Name or Alias Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <Button onClick={handleSearch} className="h-9 bg-blue-600 hover:bg-blue-700">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
            <Button onClick={clearSearch} variant="outline" className="h-9">
              <RefreshCw className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div className="gap-2 w-full">
              <Table className="text-gray-500" />
              <h3 className="text-[15px] font-semibold text-gray-800">
                Credit Note Reasons List
              </h3>
            </div>
            <div className="text-[10px] text-gray-500">
              Total: {searchResults.length} records
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[600px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold py-3 w-12 text-center">#</TableHead>
                    <TableHead className="font-semibold py-3 w-16 text-center">ID</TableHead>
                    <TableHead className="font-semibold py-3 min-w-[200px]">Reason Name</TableHead>
                    <TableHead className="font-semibold py-3 min-w-[150px]">Alias Name</TableHead>
                    <TableHead className="font-semibold py-3 min-w-[150px]">Ledger</TableHead>
                    <TableHead className="font-semibold py-3 w-24 text-center">Re-Invoice</TableHead>
                    <TableHead className="font-semibold py-3 w-20 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedResults.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        No records found. Click "Add New Reason" to create one.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedResults.map((record, index) => (
                      <TableRow key={record.id} className="hover:bg-gray-50">
                        <TableCell className="py-3 text-center">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </TableCell>
                        <TableCell className="py-3 text-center font-mono font-semibold">
                          {record.id}
                        </TableCell>
                        <TableCell className="py-3 font-medium">{record.name}</TableCell>
                        <TableCell className="py-3">{record.aliasName || "-"}</TableCell>
                        <TableCell className="py-3">
                          <Badge variant="outline" className="bg-blue-50">
                            {record.ledger}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3 text-center">{getReInvoiceBadge(record.reInvoice)}</TableCell>
                        <TableCell className="py-3 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(record)}
                            className="h-8 w-8 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                            title="Edit Reason"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, searchResults.length)} of {searchResults.length} entries
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="px-3 py-1 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="h-8"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Entry Sheet */}
      <Sheet open={isEntrySheetOpen} onOpenChange={setIsEntrySheetOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle className="flex items-center gap-2">
              {editMode ? (
                <>
                  <Edit className="h-5 w-5 text-blue-600" />
                  Edit Credit Note Reason
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 text-sm text-blue-600" />
                  Credit Note Reason
                </>
              )}
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-4">
            {/* ID */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">ID</Label>
              <Input value={id} readOnly className="h-10 bg-gray-50" />
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Reason Name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Credit Note Reason Name"
                className="h-10"
              />
            </div>

            {/* Alias Name */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Alias Name</Label>
              <Input
                value={aliasName}
                onChange={(e) => setAliasName(e.target.value)}
                placeholder="Enter Alias Name"
                className="h-10"
              />
            </div>

            {/* Ledger */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Ledger <span className="text-red-500">*</span>
              </Label>
              <Select value={ledger} onValueChange={setLedger}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="SELECT LEDGER" />
                </SelectTrigger>
                <SelectContent>
                  {ledgerOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Re-Invoice Checkbox */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                checked={reInvoice}
                onChange={(e) => setReInvoice(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
                id="reInvoice"
              />
              <Label htmlFor="reInvoice" className="text-sm font-medium cursor-pointer">
                Re-Invoice
              </Label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t mt-4">
              <Button variant="outline" onClick={() => setIsEntrySheetOpen(false)}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              {editMode && (
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              )}
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                <Save className="mr-2 h-4 w-4" />
                {editMode ? "Update Reason" : "Save Reason"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}