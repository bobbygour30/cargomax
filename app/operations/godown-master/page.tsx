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
import { Save, RefreshCw, Search, Pencil, Trash2, Plus, X, Filter, ChevronLeft, ChevronRight, Warehouse } from "lucide-react";
import { cn } from "@/lib/utils";

interface GodownRecord {
  id: number;
  godownId: string;
  cGodownId: string;
  branch: string;
  godownName: string;
  address1: string;
  address2: string;
  city: string;
  zipCode: string;
  state: string;
  stateCode: string;
  country: string;
  inchargeName: string;
  createdAt: Date;
  updatedAt: Date;
}

// Sample branch options
const branchOptions = [
  "U P BORDER A JH UP",
  "U P BORDER C ASM WB",
  "U P BORDER B BR",
  "BIJNOR",
  "NETHAUR",
  "NOORPUR",
  "NOJIBABAD",
  "SEOHARA",
  "CORPORATE OFFICE",
  "MEERUT",
  "DELHI",
  "MUMBAI"
];

const stateOptions = [
  "Uttar Pradesh",
  "Delhi",
  "Maharashtra",
  "West Bengal",
  "Bihar",
  "Karnataka",
  "Tamil Nadu",
  "Gujarat",
  "Rajasthan",
  "Madhya Pradesh"
];

const countryOptions = [
  "India",
  "USA",
  "UK",
  "Canada",
  "Australia",
  "Singapore",
  "UAE"
];

export default function GodownMaster() {
  // Sheet state
  const [isEntrySheetOpen, setIsEntrySheetOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<number | null>(null);

  // Form state
  const [godownId, setGodownId] = useState<string>("");
  const [cGodownId, setCGodownId] = useState<string>("");
  const [branch, setBranch] = useState<string>("");
  const [godownName, setGodownName] = useState<string>("");
  const [address1, setAddress1] = useState<string>("");
  const [address2, setAddress2] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [stateCode, setStateCode] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [inchargeName, setInchargeName] = useState<string>("");

  // Search state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Sample saved data
  const [savedRecords, setSavedRecords] = useState<GodownRecord[]>([
    { id: 1, godownId: "G001", cGodownId: "CG001", branch: "U P BORDER A JH UP", godownName: "U P BORDER A JH UP", address1: "", address2: "", city: "", zipCode: "", state: "", stateCode: "", country: "", inchargeName: "AJAY TIWARI", createdAt: new Date(), updatedAt: new Date() },
    { id: 2, godownId: "G002", cGodownId: "CG002", branch: "U P BORDER C ASM WB", godownName: "U P BORDER C ASM WB", address1: "", address2: "", city: "", zipCode: "", state: "", stateCode: "", country: "", inchargeName: "VIKASH TIWARI", createdAt: new Date(), updatedAt: new Date() },
    { id: 3, godownId: "G003", cGodownId: "CG003", branch: "U P BORDER B BR", godownName: "U P BORDER B BR", address1: "", address2: "", city: "", zipCode: "", state: "", stateCode: "", country: "", inchargeName: "VIKASH TIWARI", createdAt: new Date(), updatedAt: new Date() },
    { id: 4, godownId: "G004", cGodownId: "CG004", branch: "BIJNOR", godownName: "BIJNOR", address1: "", address2: "", city: "", zipCode: "", state: "", stateCode: "", country: "", inchargeName: "PARMOD", createdAt: new Date(), updatedAt: new Date() },
    { id: 5, godownId: "G005", cGodownId: "CG005", branch: "NETHAUR", godownName: "NETHAUR", address1: "", address2: "", city: "", zipCode: "", state: "", stateCode: "", country: "", inchargeName: "NAIM", createdAt: new Date(), updatedAt: new Date() },
    { id: 6, godownId: "G006", cGodownId: "CG006", branch: "NOORPUR", godownName: "NOORPUR", address1: "", address2: "", city: "", zipCode: "", state: "", stateCode: "", country: "", inchargeName: "ARPIT", createdAt: new Date(), updatedAt: new Date() },
    { id: 7, godownId: "G007", cGodownId: "CG007", branch: "NOJIBABAD", godownName: "NOJIBABAD", address1: "", address2: "", city: "", zipCode: "", state: "", stateCode: "", country: "", inchargeName: "RITU BUSHAN AGARWAL", createdAt: new Date(), updatedAt: new Date() },
    { id: 8, godownId: "G008", cGodownId: "CG008", branch: "SEOHARA", godownName: "SEOHARA", address1: "", address2: "", city: "", zipCode: "", state: "", stateCode: "", country: "", inchargeName: "SAHIL", createdAt: new Date(), updatedAt: new Date() },
  ]);

  const [searchResults, setSearchResults] = useState<GodownRecord[]>(savedRecords);

  // Load search results on mount
  useEffect(() => {
    setSearchResults(savedRecords);
  }, []);

  // Generate new ID
  const getNextId = (): number => {
    const maxId = savedRecords.length > 0 ? Math.max(...savedRecords.map(r => r.id)) : 0;
    return maxId + 1;
  };

  // Generate Godown ID
  const generateGodownId = (): string => {
    const count = savedRecords.length + 1;
    return `G${String(count).padStart(3, '0')}`;
  };

  // Generate C Godown ID
  const generateCGodownId = (): string => {
    const count = savedRecords.length + 1;
    return `CG${String(count).padStart(3, '0')}`;
  };

  // Reset form
  const resetForm = (): void => {
    setGodownId(generateGodownId());
    setCGodownId(generateCGodownId());
    setBranch("");
    setGodownName("");
    setAddress1("");
    setAddress2("");
    setCity("");
    setZipCode("");
    setState("");
    setStateCode("");
    setCountry("");
    setInchargeName("");
    setEditMode(false);
    setCurrentEditId(null);
  };

  const handleSave = (): void => {
    if (!branch.trim()) {
      alert("Please select Branch");
      return;
    }
    if (!godownName.trim()) {
      alert("Please enter Godown Name");
      return;
    }
    if (!inchargeName.trim()) {
      alert("Please enter Incharge Name");
      return;
    }

    if (editMode && currentEditId) {
      // Update existing record
      const updatedRecords = savedRecords.map(record =>
        record.id === currentEditId
          ? {
            ...record,
            branch,
            godownName,
            address1,
            address2,
            city,
            zipCode,
            state,
            stateCode,
            country,
            inchargeName,
            updatedAt: new Date()
          }
          : record
      );
      setSavedRecords(updatedRecords);
      setSearchResults(updatedRecords);
      alert("Record updated successfully!");
    } else {
      // Add new record
      const newRecord: GodownRecord = {
        id: getNextId(),
        godownId: godownId,
        cGodownId: cGodownId,
        branch,
        godownName,
        address1,
        address2,
        city,
        zipCode,
        state,
        stateCode,
        country,
        inchargeName,
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

  const handleEdit = (record: GodownRecord): void => {
    setEditMode(true);
    setCurrentEditId(record.id);
    setGodownId(record.godownId);
    setCGodownId(record.cGodownId);
    setBranch(record.branch);
    setGodownName(record.godownName);
    setAddress1(record.address1);
    setAddress2(record.address2);
    setCity(record.city);
    setZipCode(record.zipCode);
    setState(record.state);
    setStateCode(record.stateCode);
    setCountry(record.country);
    setInchargeName(record.inchargeName);
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
        r.branch.toLowerCase().includes(term) ||
        r.godownName.toLowerCase().includes(term) ||
        r.inchargeName.toLowerCase().includes(term) ||
        r.godownId.toLowerCase().includes(term)
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
              <Warehouse className="h-5 w-5 text-blue-600" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">GODOWN MASTER</h1>
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
            Add New Godown
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Total Godowns</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Warehouse className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Active Godowns</p>
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
                <p className="text-sm opacity-90">Branches</p>
                <p className="text-2xl font-bold">{branchOptions.length}</p>
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
            Search Godown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input
                placeholder="Search by Branch, Godown Name, Incharge Name or ID..."
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
              <h3 className="text-[11px] font-semibold text-gray-800">
                Godown List
              </h3>
            </div>
            <div className="text-[10px] text-gray-500">
              Total: {searchResults.length} records
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[1000px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-[11px] font-semibold py-2 px-2 w-12 text-center">#</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">Godown ID</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[140px]">Branch</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[130px]">Godown Name</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[120px]">Incharge</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[120px]">City</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">State</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 w-20 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedResults.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        <Warehouse className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        No records found. Click "Add New Godown" to create one.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedResults.map((record, index) => (
                      <TableRow key={record.id} className="hover:bg-gray-50">
                        <TableCell className="py-2 px-2 text-center text-xs">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </TableCell>
                        <TableCell className="py-2 px-2 font-mono font-medium text-xs">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 font-mono text-[11px]">
                            {record.godownId}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2 px-2 text-xs font-medium">
                          {record.branch}
                        </TableCell>
                        <TableCell className="py-2 px-2 text-xs">
                          {record.godownName}
                        </TableCell>
                        <TableCell className="py-2 px-2 text-xs">
                          {record.inchargeName}
                        </TableCell>
                        <TableCell className="py-2 px-2 text-xs">
                          {record.city || "-"}
                        </TableCell>
                        <TableCell className="py-2 px-2 text-xs">
                          {record.state || "-"}
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
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle className="flex items-center gap-2 text-base">
              {editMode ? (
                <>
                  <Pencil className="h-4 w-4 text-blue-600" />
                  Edit Godown
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 text-blue-600" />
                  Add New Godown
                </>
              )}
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-4">
            {/* Godown ID and C Godown ID */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Godown ID</Label>
                <Input value={godownId} readOnly className="h-9 bg-gray-50 text-sm" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">C Godown ID</Label>
                <Input value={cGodownId} readOnly className="h-9 bg-gray-50 text-sm" />
              </div>
            </div>

            {/* Branch */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Branch <span className="text-red-500">*</span>
              </Label>
              <Select value={branch} onValueChange={setBranch}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="SELECT BRANCH" />
                </SelectTrigger>
                <SelectContent>
                  {branchOptions.map((opt) => (
                    <SelectItem key={opt} value={opt} className="text-sm">
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Godown Name */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Godown Name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={godownName}
                onChange={(e) => setGodownName(e.target.value)}
                placeholder="Enter Godown Name"
                className="h-9"
              />
            </div>

            {/* Address Line 1 & 2 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Address Line 1</Label>
                <Input
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                  placeholder="Enter Address"
                  className="h-9"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Address Line 2</Label>
                <Input
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                  placeholder="Enter Address"
                  className="h-9"
                />
              </div>
            </div>

            {/* City & Zip Code */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium">City</Label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter City"
                  className="h-9"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Zip Code</Label>
                <Input
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="Enter Zip Code"
                  className="h-9"
                />
              </div>
            </div>

            {/* State & State Code */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium">State</Label>
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="SELECT STATE" />
                  </SelectTrigger>
                  <SelectContent>
                    {stateOptions.map((opt) => (
                      <SelectItem key={opt} value={opt} className="text-sm">
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">State Code</Label>
                <Input
                  value={stateCode}
                  onChange={(e) => setStateCode(e.target.value)}
                  placeholder="Enter State Code"
                  className="h-9"
                />
              </div>
            </div>

            {/* Country & Incharge Name */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Country</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="SELECT COUNTRY" />
                  </SelectTrigger>
                  <SelectContent>
                    {countryOptions.map((opt) => (
                      <SelectItem key={opt} value={opt} className="text-sm">
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Incharge Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={inchargeName}
                  onChange={(e) => setInchargeName(e.target.value)}
                  placeholder="Enter Incharge Name"
                  className="h-9"
                />
              </div>
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