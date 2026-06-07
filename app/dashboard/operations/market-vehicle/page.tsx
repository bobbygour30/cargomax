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
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { CalendarIcon, Save, RefreshCw, Search, Pencil, Trash2, Upload, Download, Eye, X, Plus, FileText, Image as ImageIcon, AlertCircle, Truck, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface MarketVehicle {
  id: number;
  vehicleRegNo: string;
  regDate: Date;
  vehicleType: string;
  capacity: number;
  ownerName: string;
  ownerBankName: string;
  ownerAccountNo: string;
  ownerIfscCode: string;
  vehicleVendor: string;
  pan: string;
  registeredAt: string;
  rcBookNo: string;
  engineNo: string;
  chasisNo: string;
  registrationValidUpto: Date;
  noOfTyres: number;
  imei: string;
  gpsVendor: string;
  trackingLink: string;
  chequeImage: string;
  lhcNotForPayment: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface DocumentAttachment {
  id: number;
  caption: string;
  description: string;
  fileName: string;
  fileSize: number;
  fileData: string;
}

const vehicleTypeOptions = [
  "OPEN BODY TRUCK",
  "CONTAINER",
  "TRUCK",
  "TRAILER",
  "TANKER",
  "PICKUP",
  "VAN"
];

export default function MarketVehicleMaster() {
  // Sheet state
  const [isEntrySheetOpen, setIsEntrySheetOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<number | null>(null);

  // Form state
  const [vehicleRegNo, setVehicleRegNo] = useState<string>("");
  const [regDate, setRegDate] = useState<Date>(new Date());
  const [vehicleType, setVehicleType] = useState<string>("");
  const [capacity, setCapacity] = useState<number>(0);
  const [ownerName, setOwnerName] = useState<string>("");
  const [ownerBankName, setOwnerBankName] = useState<string>("");
  const [ownerAccountNo, setOwnerAccountNo] = useState<string>("");
  const [ownerIfscCode, setOwnerIfscCode] = useState<string>("");
  const [vehicleVendor, setVehicleVendor] = useState<string>("");
  const [pan, setPan] = useState<string>("");
  const [registeredAt, setRegisteredAt] = useState<string>("");
  const [rcBookNo, setRcBookNo] = useState<string>("");
  const [engineNo, setEngineNo] = useState<string>("");
  const [chasisNo, setChasisNo] = useState<string>("");
  const [registrationValidUpto, setRegistrationValidUpto] = useState<Date>(new Date());
  const [noOfTyres, setNoOfTyres] = useState<number>(0);
  const [imei, setImei] = useState<string>("");
  const [gpsVendor, setGpsVendor] = useState<string>("");
  const [trackingLink, setTrackingLink] = useState<string>("");
  const [chequeImage, setChequeImage] = useState<string>("");
  const [lhcNotForPayment, setLhcNotForPayment] = useState<boolean>(false);

  // Search state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Document attachment modal state
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [selectedVehicleForDoc, setSelectedVehicleForDoc] = useState<MarketVehicle | null>(null);
  const [documents, setDocuments] = useState<DocumentAttachment[]>([]);
  const [caption, setCaption] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Sample saved data
  const [savedRecords, setSavedRecords] = useState<MarketVehicle[]>([
    { id: 1, vehicleRegNo: "09102018", regDate: new Date("2018-10-09"), vehicleType: "OPEN BODY TRUCK", capacity: 15000, ownerName: "SURAT SINGH VERMA", ownerBankName: "SBI", ownerAccountNo: "1234567890", ownerIfscCode: "SBIN0012345", vehicleVendor: "TATA MOTORS", pan: "ABFPV3079A", registeredAt: "DELHI RTO", rcBookNo: "RC123456", engineNo: "ENG123456", chasisNo: "CHS123456", registrationValidUpto: new Date("2028-12-31"), noOfTyres: 6, imei: "123456789012345", gpsVendor: "MapMyIndia", trackingLink: "https://track.example.com/1", chequeImage: "", lhcNotForPayment: false, createdAt: new Date(), updatedAt: new Date() },
    { id: 2, vehicleRegNo: "1111111", regDate: new Date("2020-01-01"), vehicleType: "CONTAINER", capacity: 20000, ownerName: "", ownerBankName: "", ownerAccountNo: "", ownerIfscCode: "", vehicleVendor: "", pan: "", registeredAt: "", rcBookNo: "", engineNo: "", chasisNo: "", registrationValidUpto: new Date("2025-12-31"), noOfTyres: 8, imei: "", gpsVendor: "", trackingLink: "", chequeImage: "", lhcNotForPayment: false, createdAt: new Date(), updatedAt: new Date() },
    { id: 3, vehicleRegNo: "12102025", regDate: new Date("2025-10-12"), vehicleType: "CONTAINER", capacity: 18000, ownerName: "MOHD RAFEEQ", ownerBankName: "HDFC", ownerAccountNo: "9876543210", ownerIfscCode: "HDFC0012345", vehicleVendor: "ASHOK LEYLAND", pan: "DMCPR6782P", registeredAt: "MUMBAI RTO", rcBookNo: "RC789012", engineNo: "ENG789012", chasisNo: "CHS789012", registrationValidUpto: new Date("2030-12-31"), noOfTyres: 6, imei: "987654321098765", gpsVendor: "GPS Unlimited", trackingLink: "https://track.example.com/3", chequeImage: "", lhcNotForPayment: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 4, vehicleRegNo: "12338", regDate: new Date("2019-03-15"), vehicleType: "CONTAINER", capacity: 12000, ownerName: "", ownerBankName: "", ownerAccountNo: "", ownerIfscCode: "", vehicleVendor: "", pan: "", registeredAt: "", rcBookNo: "", engineNo: "", chasisNo: "", registrationValidUpto: new Date("2024-12-31"), noOfTyres: 6, imei: "", gpsVendor: "", trackingLink: "", chequeImage: "", lhcNotForPayment: false, createdAt: new Date(), updatedAt: new Date() },
    { id: 5, vehicleRegNo: "60186", regDate: new Date("2020-06-18"), vehicleType: "CONTAINER", capacity: 14000, ownerName: "", ownerBankName: "", ownerAccountNo: "", ownerIfscCode: "", vehicleVendor: "", pan: "", registeredAt: "", rcBookNo: "", engineNo: "", chasisNo: "", registrationValidUpto: new Date("2025-06-17"), noOfTyres: 6, imei: "", gpsVendor: "", trackingLink: "", chequeImage: "", lhcNotForPayment: false, createdAt: new Date(), updatedAt: new Date() },
  ]);

  const [searchResults, setSearchResults] = useState<MarketVehicle[]>(savedRecords);

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
    setVehicleRegNo("");
    setRegDate(new Date());
    setVehicleType("");
    setCapacity(0);
    setOwnerName("");
    setOwnerBankName("");
    setOwnerAccountNo("");
    setOwnerIfscCode("");
    setVehicleVendor("");
    setPan("");
    setRegisteredAt("");
    setRcBookNo("");
    setEngineNo("");
    setChasisNo("");
    setRegistrationValidUpto(new Date());
    setNoOfTyres(0);
    setImei("");
    setGpsVendor("");
    setTrackingLink("");
    setChequeImage("");
    setLhcNotForPayment(false);
    setEditMode(false);
    setCurrentEditId(null);
  };

  const handleSave = (): void => {
    if (!vehicleRegNo.trim()) {
      alert("Please enter Vehicle Registration Number");
      return;
    }
    if (!vehicleType) {
      alert("Please select Vehicle Type");
      return;
    }
    if (!ownerName.trim()) {
      alert("Please enter Owner Name");
      return;
    }

    if (editMode && currentEditId) {
      const updatedRecords = savedRecords.map(record =>
        record.id === currentEditId
          ? {
            ...record,
            vehicleRegNo, regDate, vehicleType, capacity, ownerName, ownerBankName,
            ownerAccountNo, ownerIfscCode, vehicleVendor, pan, registeredAt, rcBookNo,
            engineNo, chasisNo, registrationValidUpto, noOfTyres, imei, gpsVendor,
            trackingLink, chequeImage, lhcNotForPayment,
            updatedAt: new Date()
          }
          : record
      );
      setSavedRecords(updatedRecords);
      setSearchResults(updatedRecords);
      alert("Record updated successfully!");
    } else {
      const newRecord: MarketVehicle = {
        id: getNextId(),
        vehicleRegNo, regDate, vehicleType, capacity, ownerName, ownerBankName,
        ownerAccountNo, ownerIfscCode, vehicleVendor, pan, registeredAt, rcBookNo,
        engineNo, chasisNo, registrationValidUpto, noOfTyres, imei, gpsVendor,
        trackingLink, chequeImage, lhcNotForPayment,
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

  const handleEdit = (record: MarketVehicle): void => {
    setEditMode(true);
    setCurrentEditId(record.id);
    setVehicleRegNo(record.vehicleRegNo);
    setRegDate(record.regDate);
    setVehicleType(record.vehicleType);
    setCapacity(record.capacity);
    setOwnerName(record.ownerName);
    setOwnerBankName(record.ownerBankName);
    setOwnerAccountNo(record.ownerAccountNo);
    setOwnerIfscCode(record.ownerIfscCode);
    setVehicleVendor(record.vehicleVendor);
    setPan(record.pan);
    setRegisteredAt(record.registeredAt);
    setRcBookNo(record.rcBookNo);
    setEngineNo(record.engineNo);
    setChasisNo(record.chasisNo);
    setRegistrationValidUpto(record.registrationValidUpto);
    setNoOfTyres(record.noOfTyres);
    setImei(record.imei);
    setGpsVendor(record.gpsVendor);
    setTrackingLink(record.trackingLink);
    setChequeImage(record.chequeImage);
    setLhcNotForPayment(record.lhcNotForPayment);
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
        r.vehicleRegNo.toLowerCase().includes(term) ||
        r.vehicleType.toLowerCase().includes(term) ||
        r.ownerName.toLowerCase().includes(term) ||
        r.pan.toLowerCase().includes(term)
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

  // Document attachment functions
  const handleAttachDocument = (record: MarketVehicle) => {
    setSelectedVehicleForDoc(record);
    setDocuments([]);
    setIsDocModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should not be greater than 5 MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleAddDocument = () => {
    if (!caption.trim()) {
      alert("Please enter Caption");
      return;
    }
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    const newDoc: DocumentAttachment = {
      id: documents.length + 1,
      caption: caption,
      description: description,
      fileName: selectedFile.name,
      fileSize: selectedFile.size,
      fileData: URL.createObjectURL(selectedFile)
    };
    setDocuments([...documents, newDoc]);
    setCaption("");
    setDescription("");
    setSelectedFile(null);
  };

  const handleDeleteDocument = (id: number) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const handleDownloadDocument = (doc: DocumentAttachment) => {
    const link = document.createElement('a');
    link.href = doc.fileData;
    link.download = doc.fileName;
    link.click();
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
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">MARKET VEHICLE MASTER</h1>
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
                <p className="text-sm opacity-90">Vehicle Types</p>
                <p className="text-2xl font-bold">{vehicleTypeOptions.length}</p>
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
            Search Vehicles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input
                placeholder="Search by Reg No, Type, Owner or PAN..."
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
            <div className="min-w-[800px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-[11px] font-semibold py-2 px-2 w-12 text-center">#</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[120px]">Reg No</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[130px]">Vehicle Type</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[120px]">Owner Name</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">PAN</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Vendor</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 w-24 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedResults.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
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
                        <TableCell className="py-2 px-2 font-mono font-medium text-xs">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 font-mono text-[11px]">
                            {record.vehicleRegNo}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2 px-2 text-xs">{record.vehicleType}</TableCell>
                        <TableCell className="py-2 px-2 text-xs font-medium">{record.ownerName || "-"}</TableCell>
                        <TableCell className="py-2 px-2 text-xs">{record.pan || "-"}</TableCell>
                        <TableCell className="py-2 px-2 text-xs">{record.vehicleVendor || "-"}</TableCell>
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
                              onClick={() => handleAttachDocument(record)}
                              className="h-7 w-7 p-0 text-green-500 hover:text-green-700 hover:bg-green-50"
                              title="Attach Document"
                            >
                              <Upload className="h-3.5 w-3.5" />
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
        <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
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

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Vehicle Reg # <span className="text-red-500">*</span></Label>
                <Input value={vehicleRegNo} onChange={(e) => setVehicleRegNo(e.target.value)} className="h-8 text-xs uppercase" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Reg Date <span className="text-red-500">*</span></Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-8 w-full justify-start text-left text-xs">
                      <CalendarIcon className="mr-2 h-3 w-3" />
                      {regDate ? format(regDate, "dd-MM-yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent mode="single" selected={regDate} onSelect={(d) => d && setRegDate(d)} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Vehicle Type <span className="text-red-500">*</span></Label>
                <Select value={vehicleType} onValueChange={setVehicleType}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                  <SelectContent>{vehicleTypeOptions.map(opt => (<SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Capacity <span className="text-red-500">*</span></Label>
                <Input type="number" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} className="h-8 text-xs" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1"><Label className="text-xs">Owner Name <span className="text-red-500">*</span></Label><Input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Owner Bank Name</Label><Input value={ownerBankName} onChange={(e) => setOwnerBankName(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Owner Account #</Label><Input value={ownerAccountNo} onChange={(e) => setOwnerAccountNo(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Owner IFSC Code</Label><Input value={ownerIfscCode} onChange={(e) => setOwnerIfscCode(e.target.value)} className="h-8 text-xs uppercase" /></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1"><Label className="text-xs">Vehicle Vendor</Label><Input value={vehicleVendor} onChange={(e) => setVehicleVendor(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">PAN</Label><Input value={pan} onChange={(e) => setPan(e.target.value)} className="h-8 text-xs uppercase" /></div>
              <div className="space-y-1"><Label className="text-xs">Registered At</Label><Input value={registeredAt} onChange={(e) => setRegisteredAt(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">RC Book #</Label><Input value={rcBookNo} onChange={(e) => setRcBookNo(e.target.value)} className="h-8 text-xs" /></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1"><Label className="text-xs">Engine No.</Label><Input value={engineNo} onChange={(e) => setEngineNo(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Chasis No.</Label><Input value={chasisNo} onChange={(e) => setChasisNo(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Registration Valid Upto</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-8 w-full justify-start text-left text-xs">
                      <CalendarIcon className="mr-2 h-3 w-3" />
                      {registrationValidUpto ? format(registrationValidUpto, "dd-MM-yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent mode="single" selected={registrationValidUpto} onSelect={(d) => d && setRegistrationValidUpto(d)} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-1"><Label className="text-xs">No. Of Tyres</Label><Input type="number" value={noOfTyres} onChange={(e) => setNoOfTyres(Number(e.target.value))} className="h-8 text-xs" /></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="space-y-1"><Label className="text-xs">IMEI</Label><Input value={imei} onChange={(e) => setImei(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">GPS Vendor</Label><Input value={gpsVendor} onChange={(e) => setGpsVendor(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Tracking Link</Label><Input value={trackingLink} onChange={(e) => setTrackingLink(e.target.value)} className="h-8 text-xs" /></div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Select Cheque Image</Label>
              <Input type="file" accept="image/*" onChange={(e) => { if (e.target.files?.[0]) setChequeImage(e.target.files[0].name); }} className="h-8 text-xs file:h-7 file:text-xs" />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" checked={lhcNotForPayment} onChange={(e) => setLhcNotForPayment(e.target.checked)} className="h-3.5 w-3.5" />
              <Label className="text-xs cursor-pointer">LHC Not For Payment</Label>
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

      {/* Attach Document Modal */}
      <Dialog open={isDocModalOpen} onOpenChange={setIsDocModalOpen}>
        <DialogContent className="max-w-[95vw] md:max-w-4xl max-h-[85vh] flex flex-col p-0">
          <DialogHeader className="px-4 pt-4 pb-2 border-b">
            <DialogTitle className="text-base md:text-lg">Attach Document - Vehicle Reg #: {selectedVehicleForDoc?.vehicleRegNo}</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex flex-col px-4">
            <div className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded-md mb-3">
              <AlertCircle className="h-3 w-3 inline mr-1" /> File size should not be greater than 5 mb.
            </div>

            {/* Add Document Form */}
            <div className="border rounded-md p-3 mb-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1"><Label className="text-xs">Caption</Label><Input value={caption} onChange={(e) => setCaption(e.target.value)} className="h-8 text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Description</Label><Input value={description} onChange={(e) => setDescription(e.target.value)} className="h-8 text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Select File</Label><Input type="file" onChange={handleFileChange} className="h-8 text-xs file:h-7 file:text-xs" /></div>
                <div className="flex items-end"><Button onClick={handleAddDocument} size="sm" className="h-8 text-xs"><Plus className="mr-1 h-3 w-3" />ADD</Button></div>
              </div>
            </div>

            {/* Documents Table */}
            <div className="rounded-md border overflow-x-auto flex-1">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-[11px] w-12">#</TableHead>
                    <TableHead className="text-[11px]">Caption</TableHead>
                    <TableHead className="text-[11px]">Description</TableHead>
                    <TableHead className="text-[11px]">File Name</TableHead>
                    <TableHead className="text-[11px] w-20 text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.length === 0 ? (<TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">No documents attached</TableCell></TableRow>) : (
                    documents.map((doc, idx) => (
                      <TableRow key={doc.id}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{doc.caption}</TableCell>
                        <TableCell>{doc.description || "-"}</TableCell>
                        <TableCell>{doc.fileName}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleDownloadDocument(doc)} className="h-7 w-7 p-0 text-blue-500" title="Download"><Download className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteDocument(doc.id)} className="h-7 w-7 p-0 text-red-500" title="Delete"><Trash2 className="h-3.5 w-3.5" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <DialogFooter className="px-4 py-3 border-t gap-2 mt-2">
            <Button variant="outline" size="sm" onClick={() => setIsDocModalOpen(false)}>CLOSE</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}