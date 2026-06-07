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
import { Save, RefreshCw, Search, Pencil, Trash2, Plus, Check, X, Filter, ChevronLeft, ChevronRight, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

interface VehicleGroup {
  id: number;
  vehicleGroupCode: string;
  modeType: string;
  vehicleGroupName: string;
  autoSerial: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const modeTypeOptions = [
  "Road",
  "Rail",
  "Air",
  "Sea",
  "Multi-Modal"
];

export default function VehicleGroupMaster() {
  // Sheet state
  const [isEntrySheetOpen, setIsEntrySheetOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<number | null>(null);
  
  // Form state
  const [vehicleGroupCode, setVehicleGroupCode] = useState<string>("");
  const [modeType, setModeType] = useState<string>("");
  const [vehicleGroupName, setVehicleGroupName] = useState<string>("");
  const [autoSerial, setAutoSerial] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(true);

  // Search state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Sample saved data
  const [savedRecords, setSavedRecords] = useState<VehicleGroup[]>([
    { id: 1, vehicleGroupCode: "VG001", modeType: "Road", vehicleGroupName: "LOCAL VEHICLE", autoSerial: false, active: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 2, vehicleGroupCode: "VG002", modeType: "Road", vehicleGroupName: "LONG ROUTE VEHICLE", autoSerial: false, active: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 3, vehicleGroupCode: "VG003", modeType: "Road", vehicleGroupName: "CONTAINER", autoSerial: false, active: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 4, vehicleGroupCode: "VG004", modeType: "Multi-Modal", vehicleGroupName: "GENERAL", autoSerial: false, active: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 5, vehicleGroupCode: "VG005", modeType: "Rail", vehicleGroupName: "INDIAN RAILWAYS", autoSerial: false, active: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 6, vehicleGroupCode: "VG006", modeType: "Road", vehicleGroupName: "TESTING GROUP", autoSerial: false, active: true, createdAt: new Date(), updatedAt: new Date() },
  ]);

  const [searchResults, setSearchResults] = useState<VehicleGroup[]>(savedRecords);

  // Load search results on mount
  useEffect(() => {
    setSearchResults(savedRecords);
  }, []);

  // Generate vehicle group code
  const generateVehicleGroupCode = (): string => {
    const maxId = savedRecords.length > 0 ? Math.max(...savedRecords.map(r => r.id)) : 0;
    const count = maxId + 1;
    return `VG${String(count).padStart(3, '0')}`;
  };

  // Reset form
  const resetForm = (): void => {
    setVehicleGroupCode(generateVehicleGroupCode());
    setModeType("");
    setVehicleGroupName("");
    setAutoSerial(false);
    setActive(true);
    setEditMode(false);
    setCurrentEditId(null);
  };

  const handleSave = (): void => {
    if (!modeType) {
      alert("Please select Mode Type");
      return;
    }
    if (!vehicleGroupName.trim()) {
      alert("Please enter Vehicle Group Name");
      return;
    }

    if (editMode && currentEditId) {
      // Update existing record
      const updatedRecords = savedRecords.map(record => 
        record.id === currentEditId 
          ? { 
              ...record, 
              modeType, 
              vehicleGroupName, 
              autoSerial, 
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
      const newRecord: VehicleGroup = {
        id: Date.now(),
        vehicleGroupCode: vehicleGroupCode,
        modeType,
        vehicleGroupName,
        autoSerial,
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

  const handleEdit = (record: VehicleGroup): void => {
    setEditMode(true);
    setCurrentEditId(record.id);
    setVehicleGroupCode(record.vehicleGroupCode);
    setModeType(record.modeType);
    setVehicleGroupName(record.vehicleGroupName);
    setAutoSerial(record.autoSerial);
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
        r.vehicleGroupName.toLowerCase().includes(term) ||
        r.vehicleGroupCode.toLowerCase().includes(term) ||
        r.modeType.toLowerCase().includes(term)
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
    setVehicleGroupCode(generateVehicleGroupCode());
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
              <Truck className="h-5 w-5 text-blue-600" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">VEHICLE GROUP MASTER</h1>
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
            Add Vehicle Group
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Total Groups</p>
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
                <p className="text-sm opacity-90">Active Groups</p>
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
                <p className="text-sm opacity-90">Inactive Groups</p>
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
            Search Vehicle Groups
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input
                placeholder="Search by Group Name, Code or Mode Type..."
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
                Vehicle Groups List
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
                    <TableHead className="text-[11px] font-semibold py-2 px-2 w-12 text-center">#</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px] text-center">Code</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[150px]">Group Name</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Mode Type</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 w-20 text-center">Auto Serial</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 w-20 text-center">Status</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 w-20 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedResults.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        <Truck className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        No records found. Click "Add Vehicle Group" to create one.
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
                            {record.vehicleGroupCode}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2 px-2 font-medium text-xs">
                          {record.vehicleGroupName}
                        </TableCell>
                        <TableCell className="py-2 px-2 text-xs">
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 text-[11px]">
                            {record.modeType}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2 px-2 text-center">
                          {record.autoSerial ? (
                            <Check className="h-4 w-4 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-4 w-4 text-gray-400 mx-auto" />
                          )}
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
                  Edit Vehicle Group
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 text-blue-600" />
                  Add New Vehicle Group
                </>
              )}
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-4">
            {/* Vehicle Group Code */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Vehicle Group Code</Label>
              <Input value={vehicleGroupCode} readOnly className="h-9 bg-gray-50 text-sm" />
            </div>

            {/* Mode Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Mode Type <span className="text-red-500">*</span>
              </Label>
              <Select value={modeType} onValueChange={setModeType}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select Mode Type" />
                </SelectTrigger>
                <SelectContent>
                  {modeTypeOptions.map((opt) => (
                    <SelectItem key={opt} value={opt} className="text-sm">
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Vehicle Group Name */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Vehicle Group Name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={vehicleGroupName}
                onChange={(e) => setVehicleGroupName(e.target.value)}
                placeholder="Enter Vehicle Group Name"
                className="h-9 text-sm"
              />
            </div>

            {/* Auto Serial Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={autoSerial}
                onChange={(e) => setAutoSerial(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
                id="autoSerial"
              />
              <Label htmlFor="autoSerial" className="text-sm font-medium cursor-pointer">
                Auto Serial
              </Label>
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