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
import { Save, RefreshCw, Search, Pencil, Trash2, Plus, Check, X, Filter, ChevronLeft, ChevronRight, GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";

interface VehicleSubGroup {
  id: number;
  vehicleSubGroupCode: string;
  vehicleSubGroupName: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function VehicleSubGroupMaster() {
  // Sheet state
  const [isEntrySheetOpen, setIsEntrySheetOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<number | null>(null);

  // Form state
  const [vehicleSubGroupCode, setVehicleSubGroupCode] = useState<string>("");
  const [vehicleSubGroupName, setVehicleSubGroupName] = useState<string>("");
  const [active, setActive] = useState<boolean>(true);

  // Search state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Sample saved data
  const [savedRecords, setSavedRecords] = useState<VehicleSubGroup[]>([
    { id: 1, vehicleSubGroupCode: "VSG001", vehicleSubGroupName: "TESTING", active: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 2, vehicleSubGroupCode: "VSG002", vehicleSubGroupName: "HEAVY DUTY", active: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 3, vehicleSubGroupCode: "VSG003", vehicleSubGroupName: "LIGHT DUTY", active: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 4, vehicleSubGroupCode: "VSG004", vehicleSubGroupName: "CONTAINER", active: false, createdAt: new Date(), updatedAt: new Date() },
    { id: 5, vehicleSubGroupCode: "VSG005", vehicleSubGroupName: "TRAILER", active: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 6, vehicleSubGroupCode: "VSG006", vehicleSubGroupName: "TANKER", active: true, createdAt: new Date(), updatedAt: new Date() },
  ]);

  const [searchResults, setSearchResults] = useState<VehicleSubGroup[]>(savedRecords);

  // Load search results on mount
  useEffect(() => {
    setSearchResults(savedRecords);
  }, []);

  // Generate vehicle sub group code
  const generateVehicleSubGroupCode = (): string => {
    const maxId = savedRecords.length > 0 ? Math.max(...savedRecords.map(r => r.id)) : 0;
    const count = maxId + 1;
    return `VSG${String(count).padStart(3, '0')}`;
  };

  // Reset form
  const resetForm = (): void => {
    setVehicleSubGroupCode(generateVehicleSubGroupCode());
    setVehicleSubGroupName("");
    setActive(true);
    setEditMode(false);
    setCurrentEditId(null);
  };

  const handleSave = (): void => {
    if (!vehicleSubGroupName.trim()) {
      alert("Please enter Vehicle Sub Group Name");
      return;
    }

    if (editMode && currentEditId) {
      // Update existing record
      const updatedRecords = savedRecords.map(record =>
        record.id === currentEditId
          ? {
            ...record,
            vehicleSubGroupName: vehicleSubGroupName.trim(),
            active,
            updatedAt: new Date()
          }
          : record
      );
      setSavedRecords(updatedRecords);
      setSearchResults(updatedRecords);
      alert("Record updated successfully!");
    } else {
      // Add new record
      const newRecord: VehicleSubGroup = {
        id: Date.now(),
        vehicleSubGroupCode: vehicleSubGroupCode,
        vehicleSubGroupName: vehicleSubGroupName.trim(),
        active,
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

  const handleEdit = (record: VehicleSubGroup): void => {
    setEditMode(true);
    setCurrentEditId(record.id);
    setVehicleSubGroupCode(record.vehicleSubGroupCode);
    setVehicleSubGroupName(record.vehicleSubGroupName);
    setActive(record.active);
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
        r.vehicleSubGroupName.toLowerCase().includes(term) ||
        r.vehicleSubGroupCode.toLowerCase().includes(term)
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
    setVehicleSubGroupCode(generateVehicleSubGroupCode());
    setIsEntrySheetOpen(true);
  };

  // Stats
  const stats = {
    total: searchResults.length,
    active: searchResults.filter(r => r.active).length,
    inactive: searchResults.filter(r => !r.active).length,
  };

  // Get status badge
  const getStatusBadge = (active: boolean) => {
    return active ? (
      <Badge className="bg-green-500 hover:bg-green-600 text-[10px]">Active</Badge>
    ) : (
      <Badge variant="secondary" className="bg-gray-500 text-[10px]">Inactive</Badge>
    );
  };

  // Pagination
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const paginatedResults = searchResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="space-y-4 p-3 md:p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-wrap justify-between items-start gap-3">
          <div>
            <div className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-blue-600" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">VEHICLE SUBGROUP MASTER</h1>
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
            Add New Subgroup
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Total Subgroups</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <GitBranch className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Active Subgroups</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
              <Check className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-gray-500 to-gray-600 text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Inactive Subgroups</p>
                <p className="text-2xl font-bold">{stats.inactive}</p>
              </div>
              <X className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-[11px] font-semibold flex items-center gap-2 text-gray-700">
            <Search className="h-3.5 w-3.5" />
            Search Subgroups
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input
                placeholder="Search by Subgroup Name or Code..."
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
                Vehicle Subgroups List
              </h3>
            </div>
            <div className="text-[10px] text-gray-500">
              Total: {searchResults.length} records
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[500px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-[11px] font-semibold py-2 px-2 w-12 text-center">#</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 w-24 text-center">Code</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[200px]">Subgroup Name</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 w-20 text-center">Status</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 w-20 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedResults.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        <GitBranch className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        No records found. Click "Add New Subgroup" to create one.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedResults.map((record, index) => (
                      <TableRow key={record.id} className="hover:bg-gray-50">
                        <TableCell className="py-2 px-2 text-center text-xs">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </TableCell>
                        <TableCell className="py-2 px-2 text-center font-mono font-semibold text-xs">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 text-[11px]">
                            {record.vehicleSubGroupCode}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2 px-2 font-medium text-xs">
                          {record.vehicleSubGroupName}
                        </TableCell>
                        <TableCell className="py-2 px-2 text-center">
                          {getStatusBadge(record.active)}
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
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, searchResults.length)} of {searchResults.length} entries
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
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
                  onClick={() => goToPage(currentPage + 1)}
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
                  Edit Subgroup
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 text-blue-600" />
                  Add New Subgroup
                </>
              )}
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-4">
            {/* Vehicle Sub Group Code */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Subgroup Code</Label>
              <Input value={vehicleSubGroupCode} readOnly className="h-9 bg-gray-50 text-sm" />
            </div>

            {/* Vehicle Sub Group Name */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Subgroup Name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={vehicleSubGroupName}
                onChange={(e) => setVehicleSubGroupName(e.target.value)}
                placeholder="Enter Subgroup Name"
                className="h-9 text-sm"
              />
            </div>

            {/* Active Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
                id="active"
              />
              <Label htmlFor="active" className="text-sm font-medium cursor-pointer">
                Active
              </Label>
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