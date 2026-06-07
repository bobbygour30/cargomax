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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Save, RefreshCw, Search, Pencil, Trash2, Plus, Eye, Check, X, MoreVertical, DollarSign, Filter, ChevronLeft, ChevronRight, Car } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface VehicleType {
  id: number;
  vehicleType: string;
  typeCode: string;
  name: string;
  category: string;
  fuelType: string;
  perDayRunningKM: number;
  vehicleCategory: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface SalaryDetail {
  id: number;
  fromDate: Date;
  toDate: Date;
  designation: string;
}

const vehicleTypeOptions = ["PULLER", "TRAILLER", "TRUCK", "CANTER", "OPEN BODY TRUCK", "TEMPO", "CONTAINER"];
const categoryOptions = ["SINGLE AXLE", "DOUBLE AXLE", "MULTI AXLE", "TRIPPLE AXLE"];
const fuelTypeOptions = ["PETROL", "DIESEL", "CNG", "LPG", "DUO"];
const vehicleCategoryOptions = ["BOTH", "MARKET", "OWN"];

export default function VehicleTypeMaster() {
  // Sheet state
  const [isEntrySheetOpen, setIsEntrySheetOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<number | null>(null);

  // Form state
  const [vehicleType, setVehicleType] = useState<string>("");
  const [typeCode, setTypeCode] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [fuelType, setFuelType] = useState<string>("");
  const [perDayRunningKM, setPerDayRunningKM] = useState<number>(0);
  const [vehicleCategory, setVehicleCategory] = useState<string>("");
  const [active, setActive] = useState<boolean>(true);

  // Search state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Salary Details Modal state
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType | null>(null);
  const [salaryDetails, setSalaryDetails] = useState<SalaryDetail[]>([]);
  const [salaryFromDate, setSalaryFromDate] = useState<Date>(new Date());
  const [salaryToDate, setSalaryToDate] = useState<Date>(new Date());
  const [salaryDesignation, setSalaryDesignation] = useState("");
  const [editSalaryId, setEditSalaryId] = useState<number | null>(null);
  const [salaryActiveTab, setSalaryActiveTab] = useState<"entry" | "search">("entry");

  // Sample saved data
  const [savedRecords, setSavedRecords] = useState<VehicleType[]>([
    { id: 1, vehicleType: "TRUCK", typeCode: "A0002", name: "TRUCK", category: "SINGLE AXLE", fuelType: "DIESEL", perDayRunningKM: 300, vehicleCategory: "BOTH", active: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 2, vehicleType: "CANTER", typeCode: "A0004", name: "CANTER", category: "DOUBLE AXLE", fuelType: "PETROL", perDayRunningKM: 250, vehicleCategory: "MARKET", active: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 3, vehicleType: "OPEN BODY TRUCK", typeCode: "A0006", name: "OPEN BODY TRUCK", category: "DOUBLE AXLE", fuelType: "DIESEL", perDayRunningKM: 280, vehicleCategory: "OWN", active: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 4, vehicleType: "TEMPO", typeCode: "A0008", name: "TEMPO", category: "SINGLE AXLE", fuelType: "DIESEL", perDayRunningKM: 150, vehicleCategory: "BOTH", active: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 5, vehicleType: "CONTAINER", typeCode: "A0010", name: "CONTAINER", category: "TRIPPLE AXLE", fuelType: "DIESEL", perDayRunningKM: 400, vehicleCategory: "MARKET", active: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 6, vehicleType: "TRAILER", typeCode: "A0012", name: "TRAILER", category: "TRIPPLE AXLE", fuelType: "DIESEL", perDayRunningKM: 350, vehicleCategory: "OWN", active: true, createdAt: new Date(), updatedAt: new Date() },
  ]);

  const [searchResults, setSearchResults] = useState<VehicleType[]>(savedRecords);

  // Sample salary details data
  const [savedSalaryDetails, setSavedSalaryDetails] = useState<Record<number, SalaryDetail[]>>({});

  // Load search results on mount
  useEffect(() => {
    setSearchResults(savedRecords);
  }, []);

  // Generate type code
  const generateTypeCode = (): string => {
    const maxId = savedRecords.length > 0 ? Math.max(...savedRecords.map(r => r.id)) : 0;
    const count = maxId + 1;
    return `A${String(count).padStart(4, '0')}`;
  };

  // Reset form
  const resetForm = (): void => {
    setVehicleType("");
    setTypeCode(generateTypeCode());
    setName("");
    setCategory("");
    setFuelType("");
    setPerDayRunningKM(0);
    setVehicleCategory("");
    setActive(true);
    setEditMode(false);
    setCurrentEditId(null);
  };

  const handleSave = (): void => {
    if (!name.trim()) {
      alert("Please enter Name");
      return;
    }
    if (!category) {
      alert("Please select Category");
      return;
    }
    if (!fuelType) {
      alert("Please select Fuel Type");
      return;
    }

    if (editMode && currentEditId) {
      const updatedRecords = savedRecords.map(record =>
        record.id === currentEditId
          ? { ...record, vehicleType, name, category, fuelType, perDayRunningKM, vehicleCategory, active, updatedAt: new Date() }
          : record
      );
      setSavedRecords(updatedRecords);
      setSearchResults(updatedRecords);
      alert("Record updated successfully!");
    } else {
      const newRecord: VehicleType = {
        id: Date.now(),
        vehicleType,
        typeCode,
        name,
        category,
        fuelType,
        perDayRunningKM,
        vehicleCategory,
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

  const handleDelete = (id: number): void => {
    if (confirm("Are you sure you want to delete this record?")) {
      const updatedRecords = savedRecords.filter(record => record.id !== id);
      setSavedRecords(updatedRecords);
      setSearchResults(updatedRecords);
      alert("Record deleted successfully!");
    }
  };

  const handleEdit = (record: VehicleType): void => {
    setEditMode(true);
    setCurrentEditId(record.id);
    setVehicleType(record.vehicleType);
    setTypeCode(record.typeCode);
    setName(record.name);
    setCategory(record.category);
    setFuelType(record.fuelType);
    setPerDayRunningKM(record.perDayRunningKM);
    setVehicleCategory(record.vehicleCategory);
    setActive(record.active);
    setIsEntrySheetOpen(true);
  };

  const handleSearch = (): void => {
    let results = [...savedRecords];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      results = results.filter(r =>
        r.name.toLowerCase().includes(term) ||
        r.vehicleType.toLowerCase().includes(term) ||
        r.typeCode.toLowerCase().includes(term)
      );
    }
    setSearchResults(results);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchResults(savedRecords);
    setCurrentPage(1);
  };

  const openAddSheet = (): void => {
    resetForm();
    setEditMode(false);
    setCurrentEditId(null);
    setTypeCode(generateTypeCode());
    setIsEntrySheetOpen(true);
  };

  // Salary Details Functions
  const handleSalaryDetails = (record: VehicleType) => {
    setSelectedVehicleType(record);
    setSalaryDetails(savedSalaryDetails[record.id] || []);
    setSalaryActiveTab("entry");
    resetSalaryForm();
    setIsSalaryModalOpen(true);
  };

  const resetSalaryForm = () => {
    setSalaryFromDate(new Date());
    setSalaryToDate(new Date());
    setSalaryDesignation("");
    setEditSalaryId(null);
  };

  const addSalaryDetail = () => {
    if (!salaryDesignation) {
      alert("Please enter Designation");
      return;
    }
    const newSalary: SalaryDetail = {
      id: editSalaryId || Date.now(),
      fromDate: salaryFromDate,
      toDate: salaryToDate,
      designation: salaryDesignation,
    };
    let updatedDetails: SalaryDetail[];
    if (editSalaryId) {
      updatedDetails = salaryDetails.map(s => s.id === editSalaryId ? newSalary : s);
      setEditSalaryId(null);
    } else {
      updatedDetails = [...salaryDetails, newSalary];
    }
    setSalaryDetails(updatedDetails);
    if (selectedVehicleType) {
      setSavedSalaryDetails({
        ...savedSalaryDetails,
        [selectedVehicleType.id]: updatedDetails
      });
    }
    resetSalaryForm();
    alert("Salary detail saved successfully!");
  };

  const editSalaryDetail = (salary: SalaryDetail) => {
    setEditSalaryId(salary.id);
    setSalaryFromDate(salary.fromDate);
    setSalaryToDate(salary.toDate);
    setSalaryDesignation(salary.designation);
    setSalaryActiveTab("entry");
  };

  const deleteSalaryDetail = (id: number) => {
    if (confirm("Are you sure you want to delete this salary detail?")) {
      const updatedDetails = salaryDetails.filter(s => s.id !== id);
      setSalaryDetails(updatedDetails);
      if (selectedVehicleType) {
        setSavedSalaryDetails({
          ...savedSalaryDetails,
          [selectedVehicleType.id]: updatedDetails
        });
      }
      alert("Salary detail deleted successfully!");
    }
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
              <Car className="h-5 w-5 text-blue-600" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">VEHICLE TYPE MASTER</h1>
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
            Add Vehicle Type
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Total Types</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Car className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Active Types</p>
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
                <p className="text-sm opacity-90">Inactive Types</p>
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
            Search Vehicle Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input
                placeholder="Search by Type, Code or Name..."
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
                Vehicle Types List
              </h3>
            </div>
            <div className="text-[10px] text-gray-500">
              Total: {searchResults.length} records
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[800px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-[11px] font-semibold py-2 px-2 w-12 text-center">#</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Vehicle Type</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 w-24 text-center">Type Code</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[120px]">Type Name</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Category</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">Fuel Type</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 w-20 text-center">Status</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 w-32 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedResults.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        <Car className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        No records found. Click "Add New Vehicle Type" to create one.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedResults.map((record, index) => (
                      <TableRow key={record.id} className="hover:bg-gray-50">
                        <TableCell className="py-2 px-2 text-center text-xs">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </TableCell>
                        <TableCell className="py-2 px-2 text-xs">
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 text-[11px]">
                            {record.vehicleType}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2 px-2 text-center font-mono font-semibold text-xs">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 text-[11px]">
                            {record.typeCode}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2 px-2 font-medium text-xs">{record.name}</TableCell>
                        <TableCell className="py-2 px-2 text-xs">{record.category}</TableCell>
                        <TableCell className="py-2 px-2 text-xs">{record.fuelType}</TableCell>
                        <TableCell className="py-2 px-2 text-center">{getStatusBadge(record.active)}</TableCell>
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
                              onClick={() => handleSalaryDetails(record)}
                              className="h-7 w-7 p-0 text-green-500 hover:text-green-700 hover:bg-green-50"
                              title="Salary Details"
                            >
                              <DollarSign className="h-3.5 w-3.5" />
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
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle className="flex items-center gap-2 text-base">
              {editMode ? (
                <>
                  <Pencil className="h-4 w-4 text-blue-600" />
                  Edit Vehicle Type
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 text-blue-600" />
                  Add New Vehicle Type
                </>
              )}
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Vehicle Type</Label>
                <Select value={vehicleType} onValueChange={setVehicleType}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="SELECT" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypeOptions.map(opt => (
                      <SelectItem key={opt} value={opt} className="text-sm">{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Type Code</Label>
                <Input value={typeCode} readOnly className="h-9 bg-gray-50 text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} className="h-9 text-sm" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="SELECT" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map(opt => (
                      <SelectItem key={opt} value={opt} className="text-sm">{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Fuel Type <span className="text-red-500">*</span>
                </Label>
                <Select value={fuelType} onValueChange={setFuelType}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="SELECT" />
                  </SelectTrigger>
                  <SelectContent>
                    {fuelTypeOptions.map(opt => (
                      <SelectItem key={opt} value={opt} className="text-sm">{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Per Day Running KM</Label>
                <Input type="number" value={perDayRunningKM} onChange={(e) => setPerDayRunningKM(Number(e.target.value))} className="h-9 text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Vehicle Category</Label>
                <Select value={vehicleCategory} onValueChange={setVehicleCategory}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="SELECT" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleCategoryOptions.map(opt => (
                      <SelectItem key={opt} value={opt} className="text-sm">{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-4 w-4 rounded border-gray-300" id="active" />
                  <Label htmlFor="active" className="text-sm font-medium cursor-pointer">Active</Label>
                </div>
              </div>
            </div>

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

      {/* Salary Details Modal */}
      <Dialog open={isSalaryModalOpen} onOpenChange={setIsSalaryModalOpen}>
        <DialogContent className="max-w-[95vw] md:max-w-4xl max-h-[85vh] flex flex-col p-0">
          <DialogHeader className="px-4 pt-4 pb-2 border-b">
            <DialogTitle className="text-base md:text-lg">Salary Details - {selectedVehicleType?.name}</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-auto px-4 py-3">
            {/* Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 p-3 bg-gray-50 rounded-md">
              <div><Label className="text-[10px] text-gray-500">Type Code :</Label><p className="text-sm font-medium">{selectedVehicleType?.typeCode}</p></div>
              <div><Label className="text-[10px] text-gray-500">Vehicle Type :</Label><p className="text-sm font-medium">{selectedVehicleType?.name}</p></div>
              <div><Label className="text-[10px] text-gray-500">Category :</Label><p className="text-sm font-medium">{selectedVehicleType?.category}</p></div>
              <div><Label className="text-[10px] text-gray-500">Fuel Type :</Label><p className="text-sm font-medium">{selectedVehicleType?.fuelType}</p></div>
            </div>

            {/* Tabs inside modal */}
            <div className="flex border-b mb-3">
              <button
                onClick={() => setSalaryActiveTab("entry")}
                className={cn("px-3 py-1.5 text-xs font-medium transition-all", salaryActiveTab === "entry" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700")}
              >
                Entry
              </button>
              <button
                onClick={() => setSalaryActiveTab("search")}
                className={cn("px-3 py-1.5 text-xs font-medium transition-all", salaryActiveTab === "search" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700")}
              >
                Search
              </button>
            </div>

            {salaryActiveTab === "entry" && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                <div className="space-y-1">
                  <Label className="text-xs">From Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-8 w-full text-xs">
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {format(salaryFromDate, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={salaryFromDate} onSelect={(date) => date && setSalaryFromDate(date)} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">To Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-8 w-full text-xs">
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {format(salaryToDate, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={salaryToDate} onSelect={(date) => date && setSalaryToDate(date)} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Designation</Label>
                  <Input value={salaryDesignation} onChange={(e) => setSalaryDesignation(e.target.value)} className="h-8 text-xs" />
                </div>
                <div className="flex items-end">
                  <Button onClick={addSalaryDetail} size="sm" className="h-8 text-xs bg-green-600 hover:bg-green-700">
                    <Plus className="mr-1 h-3 w-3" /> ADD
                  </Button>
                </div>
              </div>
            )}

            {salaryActiveTab === "search" && (
              <div className="rounded-md border overflow-x-auto">
                <Table className="text-xs">
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-[11px] w-12">#</TableHead>
                      <TableHead className="text-[11px]">From Date</TableHead>
                      <TableHead className="text-[11px]">To Date</TableHead>
                      <TableHead className="text-[11px]">Designation</TableHead>
                      <TableHead className="text-[11px] w-20 text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salaryDetails.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          No salary details found
                        </TableCell>
                      </TableRow>
                    ) : (
                      salaryDetails.map((salary, idx) => (
                        <TableRow key={salary.id}>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>{format(salary.fromDate, "dd-MM-yyyy")}</TableCell>
                          <TableCell>{format(salary.toDate, "dd-MM-yyyy")}</TableCell>
                          <TableCell>{salary.designation}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => editSalaryDetail(salary)}
                                className="h-6 w-6 p-0 text-blue-500"
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteSalaryDetail(salary.id)}
                                className="h-6 w-6 p-0 text-red-500"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          <DialogFooter className="px-4 py-3 border-t">
            <Button variant="outline" size="sm" onClick={() => setIsSalaryModalOpen(false)}>CLOSE</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}