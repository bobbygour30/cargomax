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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Save, RefreshCw, Search, Pencil, Trash2, Plus, ChevronRight, ChevronLeft, Eye, Check, X, MoreVertical, Filter, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Vehicle {
  id: number;
  vehicleCategory: string;
  groupName: string;
  model: string;
  engineNo: string;
  chasisNo: string;
  category: string;
  regNo: string;
  aliasName: string;
  vehicleType: string;
  regDate: Date;
  vendorName: string;
  active: boolean;
  approved: boolean;
  divisionId: string;
  vehicle: string;
  controlledBy: string;
  broker: string;
  ownerName: string;
  permanentAddress: string;
  temporaryAddress: string;
  pan: string;
  mobileNo: string;
  createdAt: Date;
  updatedAt: Date;
}

const vehicleOptions = ["Attached Vehicle", "Market Vehicle", "Own Vehicle"];
const vehicleCategoryOptions = ["ALL", "Heavy", "Medium", "Light", "Two Wheeler", "Three Wheeler"];
const vehicleTypeOptions = ["Truck", "Container", "Trailer", "Tanker", "Pickup", "Van", "Bus", "Car"];
const divisionOptions = ["North", "South", "East", "West", "Central"];

export default function VehicleMasterNew() {
  // Sheet state
  const [isEntrySheetOpen, setIsEntrySheetOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form state
  const [vehicle, setVehicle] = useState<string>("");
  const [controlledBy, setControlledBy] = useState<string>("");
  const [broker, setBroker] = useState<string>("");
  const [ownerName, setOwnerName] = useState<string>("");
  const [permanentAddress, setPermanentAddress] = useState<string>("");
  const [temporaryAddress, setTemporaryAddress] = useState<string>("");
  const [pan, setPan] = useState<string>("");
  const [mobileNo, setMobileNo] = useState<string>("");

  // Vehicle Details
  const [vehicleCategory, setVehicleCategory] = useState<string>("");
  const [groupName, setGroupName] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [engineNo, setEngineNo] = useState<string>("");
  const [chasisNo, setChasisNo] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [regNo, setRegNo] = useState<string>("");
  const [aliasName, setAliasName] = useState<string>("");
  const [vehicleType, setVehicleType] = useState<string>("");
  const [regDate, setRegDate] = useState<Date>(new Date());
  const [vendorName, setVendorName] = useState<string>("");
  const [active, setActive] = useState<boolean>(true);
  const [approved, setApproved] = useState<boolean>(false);
  const [divisionId, setDivisionId] = useState<string>("");

  // Search state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchVehicleCategory, setSearchVehicleCategory] = useState<string>("ALL");
  const [searchVehicleNo, setSearchVehicleNo] = useState<string>("");
  const [searchPanNo, setSearchPanNo] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Sample saved data
  const [savedRecords, setSavedRecords] = useState<Vehicle[]>([
    { id: 1, vehicleCategory: "Heavy", groupName: "Truck Group", model: "TATA 407", engineNo: "ENG001", chasisNo: "CHS001", category: "Commercial", regNo: "UP14AB1234", aliasName: "Truck1", vehicleType: "Truck", regDate: new Date("2023-01-15"), vendorName: "TATA Motors", active: true, approved: true, divisionId: "North", vehicle: "Own Vehicle", controlledBy: "Self", broker: "", ownerName: "Rajesh Kumar", permanentAddress: "Delhi", temporaryAddress: "", pan: "ABCDE1234F", mobileNo: "9876543210", createdAt: new Date(), updatedAt: new Date() },
    { id: 2, vehicleCategory: "Medium", groupName: "Container Group", model: "ASHOK LEYLAND", engineNo: "ENG002", chasisNo: "CHS002", category: "Commercial", regNo: "UP15CD5678", aliasName: "Container1", vehicleType: "Container", regDate: new Date("2023-02-20"), vendorName: "Ashok Leyland", active: true, approved: true, divisionId: "South", vehicle: "Market Vehicle", controlledBy: "Broker", broker: "Suresh Transport", ownerName: "Suresh Singh", permanentAddress: "Mumbai", temporaryAddress: "", pan: "FGHIJ5678K", mobileNo: "9876543211", createdAt: new Date(), updatedAt: new Date() },
    { id: 3, vehicleCategory: "Light", groupName: "Pickup Group", model: "MAHINDRA", engineNo: "ENG003", chasisNo: "CHS003", category: "Commercial", regNo: "UP16EF9012", aliasName: "Pickup1", vehicleType: "Pickup", regDate: new Date("2023-03-10"), vendorName: "Mahindra", active: true, approved: false, divisionId: "East", vehicle: "Attached Vehicle", controlledBy: "Company", broker: "", ownerName: "Company Owned", permanentAddress: "Kolkata", temporaryAddress: "", pan: "KLMNO9012P", mobileNo: "9876543212", createdAt: new Date(), updatedAt: new Date() },
  ]);

  const [searchResults, setSearchResults] = useState<Vehicle[]>(savedRecords);

  // Load search results on mount
  useEffect(() => {
    setSearchResults(savedRecords);
  }, []);

  // Generate ID
  const getNextId = (): number => {
    const maxId = savedRecords.length > 0 ? Math.max(...savedRecords.map(r => r.id)) : 0;
    return maxId + 1;
  };

  // Reset form
  const resetForm = (): void => {
    setVehicle("");
    setControlledBy("");
    setBroker("");
    setOwnerName("");
    setPermanentAddress("");
    setTemporaryAddress("");
    setPan("");
    setMobileNo("");
    setVehicleCategory("");
    setGroupName("");
    setModel("");
    setEngineNo("");
    setChasisNo("");
    setCategory("");
    setRegNo("");
    setAliasName("");
    setVehicleType("");
    setRegDate(new Date());
    setVendorName("");
    setActive(true);
    setApproved(false);
    setDivisionId("");
    setEditMode(false);
    setCurrentEditId(null);
    setCurrentStep(1);
  };

  const handleContinue = () => {
    if (!vehicle) {
      alert("Please select Vehicle type");
      return;
    }
    if (!ownerName) {
      alert("Please enter Owner Name");
      return;
    }
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSave = (): void => {
    if (!vehicle) {
      alert("Please select Vehicle type");
      return;
    }
    if (!ownerName) {
      alert("Please enter Owner Name");
      return;
    }
    if (!regNo) {
      alert("Please enter Registration Number");
      return;
    }

    const newRecord: Vehicle = {
      id: currentEditId || getNextId(),
      vehicleCategory,
      groupName,
      model,
      engineNo,
      chasisNo,
      category,
      regNo,
      aliasName,
      vehicleType,
      regDate,
      vendorName,
      active,
      approved,
      divisionId,
      vehicle,
      controlledBy,
      broker,
      ownerName,
      permanentAddress,
      temporaryAddress,
      pan,
      mobileNo,
      createdAt: editMode && currentEditId ?
        savedRecords.find(r => r.id === currentEditId)?.createdAt || new Date() :
        new Date(),
      updatedAt: new Date(),
    };

    if (editMode && currentEditId) {
      const updatedRecords = savedRecords.map(record => record.id === currentEditId ? newRecord : record);
      setSavedRecords(updatedRecords);
      setSearchResults(updatedRecords);
      alert("Record updated successfully!");
    } else {
      const updatedRecords = [...savedRecords, newRecord];
      setSavedRecords(updatedRecords);
      setSearchResults(updatedRecords);
      alert("Record saved successfully!");
    }

    resetForm();
    setIsEntrySheetOpen(false);
  };

  const handleEdit = (record: Vehicle): void => {
    setEditMode(true);
    setCurrentEditId(record.id);
    setVehicle(record.vehicle);
    setControlledBy(record.controlledBy);
    setBroker(record.broker);
    setOwnerName(record.ownerName);
    setPermanentAddress(record.permanentAddress);
    setTemporaryAddress(record.temporaryAddress);
    setPan(record.pan);
    setMobileNo(record.mobileNo);
    setVehicleCategory(record.vehicleCategory);
    setGroupName(record.groupName);
    setModel(record.model);
    setEngineNo(record.engineNo);
    setChasisNo(record.chasisNo);
    setCategory(record.category);
    setRegNo(record.regNo);
    setAliasName(record.aliasName);
    setVehicleType(record.vehicleType);
    setRegDate(record.regDate);
    setVendorName(record.vendorName);
    setActive(record.active);
    setApproved(record.approved);
    setDivisionId(record.divisionId);
    setCurrentStep(2);
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
    if (searchVehicleCategory !== "ALL") {
      results = results.filter(r => r.vehicleCategory === searchVehicleCategory);
    }
    if (searchVehicleNo) {
      results = results.filter(r => r.regNo.toLowerCase().includes(searchVehicleNo.toLowerCase()));
    }
    if (searchPanNo) {
      results = results.filter(r => r.pan.toLowerCase().includes(searchPanNo.toLowerCase()));
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(r =>
        r.regNo.toLowerCase().includes(term) ||
        r.ownerName.toLowerCase().includes(term) ||
        r.model.toLowerCase().includes(term)
      );
    }
    setSearchResults(results);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchVehicleCategory("ALL");
    setSearchVehicleNo("");
    setSearchPanNo("");
    setSearchTerm("");
    setSearchResults(savedRecords);
    setCurrentPage(1);
  };

  const openAddSheet = (): void => {
    resetForm();
    setEditMode(false);
    setCurrentEditId(null);
    setCurrentStep(1);
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
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">VEHICLE MASTER (NEW)</h1>
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
            Add New Vehicle
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Total Vehicles</p>
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
                <p className="text-sm opacity-90">Active Vehicles</p>
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
                <p className="text-sm opacity-90">Inactive Vehicles</p>
                <p className="text-2xl font-bold">{stats.inactive}</p>
              </div>
              <X className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-[11px] font-semibold flex items-center gap-2 text-gray-700">
            <Search className="h-3.5 w-3.5" />
            Search Vehicles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1">
              <Label className="text-[10px] font-medium">Vehicle Category</Label>
              <Select value={searchVehicleCategory} onValueChange={setSearchVehicleCategory}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="SELECT" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleCategoryOptions.map(opt => (
                    <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-medium">Vehicle No</Label>
              <Input value={searchVehicleNo} onChange={(e) => setSearchVehicleNo(e.target.value)} placeholder="Enter Vehicle Number" className="h-8 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-medium">PAN No</Label>
              <Input value={searchPanNo} onChange={(e) => setSearchPanNo(e.target.value)} placeholder="Enter PAN Number" className="h-8 text-xs" />
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={handleSearch} size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700">
                <Search className="mr-1 h-3 w-3" />
                Search
              </Button>
              <Button onClick={handleClearSearch} variant="outline" size="sm" className="h-8 text-xs">
                <RefreshCw className="mr-1 h-3 w-3" />
                Clear
              </Button>
            </div>
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
                Vehicles List
              </h3>
            </div>
            <div className="text-[10px] text-gray-500">
              Total: {searchResults.length} records
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[1200px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-[11px] font-semibold py-2 px-2 w-12 text-center">#</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Reg No</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[120px]">Owner Name</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Model</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Vehicle Type</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Category</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 w-20 text-center">Active</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 w-24 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedResults.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        <Truck className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        No records found. Click "Add New Vehicle" to create one.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedResults.map((record, index) => (
                      <TableRow key={record.id} className="hover:bg-gray-50">
                        <TableCell className="py-2 px-2 text-center text-xs">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </TableCell>
                        <TableCell className="py-2 px-2 font-mono font-semibold text-xs">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 text-[11px]">
                            {record.regNo}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2 px-2 font-medium text-xs">{record.ownerName}</TableCell>
                        <TableCell className="py-2 px-2 text-xs">{record.model || "-"}</TableCell>
                        <TableCell className="py-2 px-2 text-xs">{record.vehicleType || "-"}</TableCell>
                        <TableCell className="py-2 px-2 text-xs">{record.vehicleCategory || "-"}</TableCell>
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
                  <ChevronLeftIcon className="h-3 w-3 mr-1" />
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
                  <ChevronRightIcon className="h-3 w-3 ml-1" />
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
                  Edit Vehicle
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 text-blue-600" />
                  Add New Vehicle
                </>
              )}
            </SheetTitle>
          </SheetHeader>

          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="border-b pb-2 mb-2">
                <h3 className="text-sm font-semibold text-gray-800">Basic Information</h3>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Vehicle <span className="text-red-500">*</span></Label>
                  <Select value={vehicle} onValueChange={setVehicle}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="SELECT VEHICLE" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleOptions.map(opt => (
                        <SelectItem key={opt} value={opt} className="text-sm">{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Controlled By</Label>
                  <Input value={controlledBy} onChange={(e) => setControlledBy(e.target.value)} placeholder="Enter Controlled By" className="h-9 text-sm" />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Broker</Label>
                  <Input value={broker} onChange={(e) => setBroker(e.target.value)} placeholder="Enter Broker Name" className="h-9 text-sm" />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Owner Name <span className="text-red-500">*</span></Label>
                  <Input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="Enter Owner Name" className="h-9 text-sm" />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Permanent Address</Label>
                  <Input value={permanentAddress} onChange={(e) => setPermanentAddress(e.target.value)} placeholder="Enter Permanent Address" className="h-9 text-sm" />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Temporary Address</Label>
                  <Input value={temporaryAddress} onChange={(e) => setTemporaryAddress(e.target.value)} placeholder="Enter Temporary Address" className="h-9 text-sm" />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">PAN</Label>
                  <Input value={pan} onChange={(e) => setPan(e.target.value)} placeholder="Enter PAN Number" className="h-9 text-sm uppercase" />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Mobile No.</Label>
                  <Input value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} placeholder="Enter Mobile Number" className="h-9 text-sm" />
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleContinue} size="sm" className="h-8 text-sm">
                    CONTINUE <ChevronRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2 mb-2">
                <h3 className="text-sm font-semibold text-gray-800">Vehicle Details</h3>
                <Button onClick={handleBack} variant="ghost" size="sm" className="h-7 text-xs">
                  <ChevronLeft className="mr-1 h-3 w-3" /> BACK
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Vehicle Category</Label>
                  <Select value={vehicleCategory} onValueChange={setVehicleCategory}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="SELECT" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleCategoryOptions.filter(opt => opt !== "ALL").map(opt => (
                        <SelectItem key={opt} value={opt} className="text-sm">{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Group Name</Label>
                  <Input value={groupName} onChange={(e) => setGroupName(e.target.value)} className="h-9 text-sm" />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Model</Label>
                  <Input value={model} onChange={(e) => setModel(e.target.value)} className="h-9 text-sm" />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Engine No</Label>
                  <Input value={engineNo} onChange={(e) => setEngineNo(e.target.value)} className="h-9 text-sm" />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Chasis No</Label>
                  <Input value={chasisNo} onChange={(e) => setChasisNo(e.target.value)} className="h-9 text-sm" />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Category</Label>
                  <Input value={category} onChange={(e) => setCategory(e.target.value)} className="h-9 text-sm" />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Registration No <span className="text-red-500">*</span></Label>
                  <Input value={regNo} onChange={(e) => setRegNo(e.target.value)} className="h-9 text-sm uppercase" />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Alias Name</Label>
                  <Input value={aliasName} onChange={(e) => setAliasName(e.target.value)} className="h-9 text-sm" />
                </div>

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
                  <Label className="text-sm font-medium">Registration Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-9 w-full justify-start text-left text-sm">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(regDate, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={regDate} onSelect={(date) => date && setRegDate(date)} />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Vendor Name</Label>
                  <Input value={vendorName} onChange={(e) => setVendorName(e.target.value)} className="h-9 text-sm" />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Division</Label>
                  <Select value={divisionId} onValueChange={setDivisionId}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="SELECT" />
                    </SelectTrigger>
                    <SelectContent>
                      {divisionOptions.map(opt => (
                        <SelectItem key={opt} value={opt} className="text-sm">{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-4 w-4 rounded border-gray-300" id="active" />
                  <Label htmlFor="active" className="text-sm font-medium cursor-pointer">Active</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={approved} onChange={(e) => setApproved(e.target.checked)} className="h-4 w-4 rounded border-gray-300" id="approved" />
                  <Label htmlFor="approved" className="text-sm font-medium cursor-pointer">Approved</Label>
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
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}