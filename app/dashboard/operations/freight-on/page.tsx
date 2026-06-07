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
import { Save, RefreshCw, Search, Pencil, Trash2, Plus, X, Filter, ChevronLeft, ChevronRight, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

interface FreightOnRecord {
  id: number;
  code: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function FreightOnMaster() {
  // Sheet state
  const [isEntrySheetOpen, setIsEntrySheetOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<number | null>(null);
  
  // Form state
  const [freightOnCode, setFreightOnCode] = useState<string>("");
  const [freightOnName, setFreightOnName] = useState<string>("");

  // Search state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Sample saved data
  const [savedRecords, setSavedRecords] = useState<FreightOnRecord[]>([
    { id: 1, code: "W", name: "CHARGE WEIGHT", createdAt: new Date(), updatedAt: new Date() },
    { id: 2, code: "P", name: "PCKGS", createdAt: new Date(), updatedAt: new Date() },
    { id: 3, code: "F", name: "FIXED/FTL", createdAt: new Date(), updatedAt: new Date() },
    { id: 4, code: "K", name: "PER KM", createdAt: new Date(), updatedAt: new Date() },
    { id: 5, code: "V", name: "PERCENTAGE", createdAt: new Date(), updatedAt: new Date() },
    { id: 6, code: "S", name: "SLAB WISE", createdAt: new Date(), updatedAt: new Date() },
  ]);

  const [searchResults, setSearchResults] = useState<FreightOnRecord[]>(savedRecords);

  // Load search results on mount
  useEffect(() => {
    setSearchResults(savedRecords);
  }, []);

  // Get next ID
  const getNextId = (): number => {
    const maxId = savedRecords.length > 0 ? Math.max(...savedRecords.map(r => r.id)) : 0;
    return maxId + 1;
  };

  // Reset form
  const resetForm = (): void => {
    setFreightOnCode("");
    setFreightOnName("");
    setEditMode(false);
    setCurrentEditId(null);
  };

  const handleSave = (): void => {
    if (!freightOnCode.trim()) {
      alert("Please enter Freight On Code");
      return;
    }
    if (!freightOnName.trim()) {
      alert("Please enter Freight On Name");
      return;
    }

    if (editMode && currentEditId) {
      // Update existing record
      const updatedRecords = savedRecords.map(record => 
        record.id === currentEditId 
          ? { ...record, code: freightOnCode.toUpperCase(), name: freightOnName, updatedAt: new Date() }
          : record
      );
      setSavedRecords(updatedRecords);
      setSearchResults(updatedRecords);
      alert("Record updated successfully!");
    } else {
      // Add new record
      const newRecord: FreightOnRecord = {
        id: getNextId(),
        code: freightOnCode.toUpperCase(),
        name: freightOnName,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const updatedRecords = [...savedRecords, newRecord];
      setSavedRecords(updatedRecords);
      setSearchResults(updatedRecords);
      alert("Record saved successfully!");
    }
    
    resetForm();
    setIsEntrySheetOpen(false);
  };

  const handleEdit = (record: FreightOnRecord): void => {
    setEditMode(true);
    setCurrentEditId(record.id);
    setFreightOnCode(record.code);
    setFreightOnName(record.name);
    setIsEntrySheetOpen(true);
  };

  const handleDelete = (id: number): void => {
    if (confirm("Are you sure you want to delete this record?")) {
      const updatedRecords = savedRecords.filter(record => record.id !== id);
      setSavedRecords(updatedRecords);
      setSearchResults(updatedRecords);
      alert("Record deleted successfully!");
    }
  };

  const handleSearch = (): void => {
    let results = [...savedRecords];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      results = results.filter(r => 
        r.code.toLowerCase().includes(term) ||
        r.name.toLowerCase().includes(term)
      );
    }
    setSearchResults(results);
    setCurrentPage(1);
  };

  const handleClearSearch = (): void => {
    setSearchTerm("");
    setSearchResults(savedRecords);
    setCurrentPage(1);
  };

  const openAddSheet = (): void => {
    resetForm();
    setEditMode(false);
    setCurrentEditId(null);
    setIsEntrySheetOpen(true);
  };

  // Stats
  const stats = {
    total: searchResults.length,
  };

  // Pagination
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const paginatedResults = searchResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4 p-3 md:p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-wrap justify-between items-start gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-600" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">FREIGHT ON MASTER</h1>
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
            Add New Freight On
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Total Records</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Truck className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Active Records</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Badge className="bg-white/20 text-white">Active</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Freight Types</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Filter className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-[11px] font-semibold flex items-center gap-2 text-gray-700">
            <Search className="h-3.5 w-3.5" />
            Search Freight On
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input
                placeholder="Search by Code or Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-9 text-sm"
              />
            </div>
            <Button onClick={handleSearch} className="h-9 bg-blue-600 hover:bg-blue-700 text-xs">
              <Search className="mr-1 h-3.5 w-3.5" />
              Search
            </Button>
            <Button onClick={handleClearSearch} variant="outline" className="h-9 text-xs">
              <RefreshCw className="mr-1 h-3.5 w-3.5" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div className="gap-2 w-full">
              <Table className="text-gray-500" />
              <h3 className="text-[15px] font-semibold text-gray-800">
                Freight On List
              </h3>
            </div>
            <div className="text-[10px] text-gray-500">
              Total: {searchResults.length} records
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[400px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-[11px] font-semibold py-2 px-2 w-12 text-center">#</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 w-20 text-center">Code</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2">Name</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 w-24 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedResults.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                        <Truck className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        No records found. Click "Add New Freight On" to create one.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedResults.map((record, index) => (
                      <TableRow key={record.id} className="hover:bg-gray-50">
                        <TableCell className="py-2 px-2 text-center text-xs">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </TableCell>
                        <TableCell className="py-2 px-2 text-center font-mono font-bold text-xs">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 font-mono text-[11px]">
                            {record.code}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2 px-2 text-xs">
                          {record.name}
                        </TableCell>
                        <TableCell className="py-2 px-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(record)}
                              className="h-7 w-7 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                              title="Edit"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(record.id)}
                              className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
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
              <div className="text-[10px] text-gray-500">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, searchResults.length)} of {searchResults.length} entries
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-7 text-[10px]"
                >
                  <ChevronLeft className="h-3 w-3 mr-1" />
                  Previous
                </Button>
                <span className="px-3 py-1 text-[10px]">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="h-7 text-[10px]"
                >
                  Next
                  <ChevronRight className="h-3 w-3 ml-1" />
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
            <SheetTitle className="flex items-center gap-2 text-base">
              {editMode ? (
                <>
                  <Pencil className="h-4 w-4 text-blue-600" />
                  Edit Freight On
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 text-blue-600" />
                  Add New Freight On
                </>
              )}
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-4">
            {/* Freight On Code */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Freight On Code <span className="text-red-500">*</span>
              </Label>
              <Input
                value={freightOnCode}
                onChange={(e) => setFreightOnCode(e.target.value)}
                placeholder="Enter code (e.g., W, P, F, K)"
                className="h-9 uppercase"
                maxLength={5}
              />
              <p className="text-[10px] text-gray-400">Single character code (e.g., W, P, F, K)</p>
            </div>

            {/* Freight On Name */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Freight On Name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={freightOnName}
                onChange={(e) => setFreightOnName(e.target.value)}
                placeholder="Enter name (e.g., CHARGE WEIGHT, PCKGS)"
                className="h-9"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t mt-4">
              <Button variant="outline" onClick={() => setIsEntrySheetOpen(false)} className="h-8 text-xs">
                <X className="mr-1 h-3 w-3" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 h-8 text-xs">
                <Save className="mr-1 h-3 w-3" />
                {editMode ? "Update" : "Save"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}