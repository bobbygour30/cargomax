"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import {
  CalendarIcon,
  Save,
  RefreshCw,
  Search,
  Printer,
  FileText,
  Eye,
  X,
  Check,
  Truck,
  MapPin,
  User,
  Phone,
  Building,
  Clock,
  Edit,
  PlusCircle,
  Trash2,
  Upload,
  Image,
  FileImage,
  Signature,
  Stamp,
  FileCheck,
  Filter,
  ChevronLeft,
  ChevronRight,
  Plus,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Types
interface PODRecord {
  id: number;
  branch: string;
  grNo: string;
  grType: string;
  customer: string;
  bookingDate: Date;
  origin: string;
  destination: string;
  consignor: string;
  consignee: string;
  pckgs: number;
  weight: number;
  arrivalDate: Date;
  deliveryDate: Date;
  podReceivedType: string;
  drsNo: string;
  deliveryBoyName: string;
  receivedBy: string;
  designationRelation: string;
  mobile: string;
  grnNumber: string;
  consigneeEmail: string;
  idProof: boolean;
  withSign: boolean;
  withStamp: boolean;
  directDelivery: boolean;
  proofImage: string;
  additionalDocuments: string[];
  remarks: string;
  status: "active" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

// Options
const branchOptions = [
  "CORPORATE OFFICE",
  "DELHI",
  "MUMBAI",
  "BANGALORE",
  "CHENNAI",
  "KOLKATA",
  "AHMEDABAD",
  "PUNE",
  "HYDERABAD",
];

const grTypeOptions = ["FTL", "LTL", "Container", "Express", "Surface"];
const customerOptions = ["ABC Traders", "XYZ Enterprises", "PQR Ltd", "LMN Corp", "DEF Industries"];
const podReceivedTypeOptions = ["Original", "Copy", "Electronic", "Scan Copy"];
const deliveryBoyOptions = ["Rahul Sharma", "Amit Kumar", "Vikash Singh", "Rajesh Verma", "Sunil Gupta"];
const cancelledReasonOptions = [
  "Wrong Entry",
  "Customer Request",
  "Duplicate Entry",
  "Payment Issue",
  "Other",
];

export default function PODEntry() {
  // Main Tab state
  const [mainTab, setMainTab] = useState<"active" | "cancelled">("active");
  
  // Sheet state
  const [isEntrySheetOpen, setIsEntrySheetOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<number | null>(null);
  
  // Cancel Dialog state
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancellingPOD, setCancellingPOD] = useState<PODRecord | null>(null);
  const [cancelledReason, setCancelledReason] = useState<string>("");

  // Form state
  const [branch, setBranch] = useState<string>("");
  const [grNo, setGrNo] = useState<string>("");
  const [grType, setGrType] = useState<string>("");
  const [customer, setCustomer] = useState<string>("");
  const [bookingDate, setBookingDate] = useState<Date>(new Date());
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [consignor, setConsignor] = useState<string>("");
  const [consignee, setConsignee] = useState<string>("");
  const [pckgs, setPckgs] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [arrivalDate, setArrivalDate] = useState<Date>(new Date());
  const [deliveryDate, setDeliveryDate] = useState<Date>(new Date());
  const [podReceivedType, setPodReceivedType] = useState<string>("");
  const [drsNo, setDrsNo] = useState<string>("");
  const [deliveryBoyName, setDeliveryBoyName] = useState<string>("");
  const [receivedBy, setReceivedBy] = useState<string>("");
  const [designationRelation, setDesignationRelation] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [grnNumber, setGrnNumber] = useState<string>("");
  const [consigneeEmail, setConsigneeEmail] = useState<string>("");
  const [idProof, setIdProof] = useState<boolean>(false);
  const [withSign, setWithSign] = useState<boolean>(false);
  const [withStamp, setWithStamp] = useState<boolean>(false);
  const [directDelivery, setDirectDelivery] = useState<boolean>(false);
  const [proofImage, setProofImage] = useState<string>("");
  const [additionalDocs, setAdditionalDocs] = useState<string[]>([]);
  const [remarks, setRemarks] = useState<string>("");

  // Search State
  const [searchFromDate, setSearchFromDate] = useState<Date>(new Date());
  const [searchToDate, setSearchToDate] = useState<Date>(new Date());
  const [searchBranch, setSearchBranch] = useState<string>("all");
  const [searchResults, setSearchResults] = useState<PODRecord[]>([]);
  const [cancelledResults, setCancelledResults] = useState<PODRecord[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [cancelledPage, setCancelledPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Sample Data
  const sampleData: PODRecord[] = [
    { id: 1, branch: "DELHI", grNo: "GR001", grType: "FTL", customer: "ABC Traders", bookingDate: new Date("2026-05-28"), origin: "DELHI", destination: "MUMBAI", consignor: "M/s ABC Traders", consignee: "M/s XYZ Enterprises", pckgs: 50, weight: 2500, arrivalDate: new Date("2026-05-30"), deliveryDate: new Date("2026-06-01"), podReceivedType: "Original", drsNo: "DRS001", deliveryBoyName: "Rahul Sharma", receivedBy: "Rajesh Kumar", designationRelation: "Manager", mobile: "9876543210", grnNumber: "GRN001", consigneeEmail: "consignee@example.com", idProof: true, withSign: true, withStamp: false, directDelivery: false, proofImage: "", additionalDocuments: [], remarks: "Delivered on time", status: "active", createdAt: new Date(), updatedAt: new Date() },
    { id: 2, branch: "MUMBAI", grNo: "GR002", grType: "LTL", customer: "XYZ Enterprises", bookingDate: new Date("2026-05-29"), origin: "MUMBAI", destination: "BANGALORE", consignor: "M/s PQR Ltd", consignee: "M/s LMN Corp", pckgs: 30, weight: 1800, arrivalDate: new Date("2026-05-31"), deliveryDate: new Date("2026-06-02"), podReceivedType: "Copy", drsNo: "DRS002", deliveryBoyName: "Amit Kumar", receivedBy: "Suresh Singh", designationRelation: "Owner", mobile: "9876543211", grnNumber: "GRN002", consigneeEmail: "consignee2@example.com", idProof: false, withSign: false, withStamp: true, directDelivery: true, proofImage: "", additionalDocuments: [], remarks: "Delivered", status: "active", createdAt: new Date(), updatedAt: new Date() },
    { id: 3, branch: "BANGALORE", grNo: "GR003", grType: "Container", customer: "PQR Ltd", bookingDate: new Date("2026-05-27"), origin: "BANGALORE", destination: "CHENNAI", consignor: "M/s DEF Industries", consignee: "M/s GHI Group", pckgs: 40, weight: 2000, arrivalDate: new Date("2026-05-29"), deliveryDate: new Date("2026-05-31"), podReceivedType: "Electronic", drsNo: "DRS003", deliveryBoyName: "Vikash Singh", receivedBy: "Mahesh Sharma", designationRelation: "Supervisor", mobile: "9876543212", grnNumber: "GRN003", consigneeEmail: "consignee3@example.com", idProof: false, withSign: true, withStamp: false, directDelivery: false, proofImage: "", additionalDocuments: [], remarks: "Delivered with sign", status: "cancelled", createdAt: new Date(), updatedAt: new Date() },
  ];

  const [savedRecords, setSavedRecords] = useState<PODRecord[]>(sampleData);

  // Load search results on mount
  useEffect(() => {
    filterActiveRecords();
    filterCancelledRecords();
  }, []);

  const filterActiveRecords = () => {
    const activeRecords = savedRecords.filter(r => r.status === "active");
    setSearchResults(activeRecords);
  };

  const filterCancelledRecords = () => {
    const cancelledRecords = savedRecords.filter(r => r.status === "cancelled");
    setCancelledResults(cancelledRecords);
  };

  const resetForm = () => {
    setBranch("");
    setGrNo("");
    setGrType("");
    setCustomer("");
    setBookingDate(new Date());
    setOrigin("");
    setDestination("");
    setConsignor("");
    setConsignee("");
    setPckgs(0);
    setWeight(0);
    setArrivalDate(new Date());
    setDeliveryDate(new Date());
    setPodReceivedType("");
    setDrsNo("");
    setDeliveryBoyName("");
    setReceivedBy("");
    setDesignationRelation("");
    setMobile("");
    setGrnNumber("");
    setConsigneeEmail("");
    setIdProof(false);
    setWithSign(false);
    setWithStamp(false);
    setDirectDelivery(false);
    setProofImage("");
    setAdditionalDocs([]);
    setRemarks("");
    setEditMode(false);
    setCurrentEditId(null);
  };

  const handleSave = () => {
    if (!branch) { alert("Please select Branch"); return; }
    if (!grNo) { alert("Please enter GR #"); return; }
    if (!grType) { alert("Please select GR Type"); return; }
    if (!customer) { alert("Please select Customer"); return; }
    if (!receivedBy) { alert("Please enter Received By"); return; }

    setLoading(true);
    setTimeout(() => {
      const newRecord: PODRecord = {
        id: currentEditId || Date.now(),
        branch,
        grNo,
        grType,
        customer,
        bookingDate,
        origin,
        destination,
        consignor,
        consignee,
        pckgs,
        weight,
        arrivalDate,
        deliveryDate,
        podReceivedType,
        drsNo,
        deliveryBoyName,
        receivedBy,
        designationRelation,
        mobile,
        grnNumber,
        consigneeEmail,
        idProof,
        withSign,
        withStamp,
        directDelivery,
        proofImage,
        additionalDocuments: additionalDocs,
        remarks,
        status: "active",
        createdAt: editMode && currentEditId ? 
          savedRecords.find(r => r.id === currentEditId)?.createdAt || new Date() : 
          new Date(),
        updatedAt: new Date(),
      };

      let updatedRecords;
      if (editMode && currentEditId) {
        updatedRecords = savedRecords.map(record => record.id === currentEditId ? newRecord : record);
      } else {
        updatedRecords = [...savedRecords, newRecord];
      }
      setSavedRecords(updatedRecords);
      filterActiveRecords();
      filterCancelledRecords();
      alert(editMode ? "Record updated successfully!" : "Record saved successfully!");
      resetForm();
      setIsEntrySheetOpen(false);
      setLoading(false);
    }, 500);
  };

  const handleSearch = () => {
    let results = savedRecords.filter(r => r.status === "active");
    if (searchBranch !== "all") results = results.filter(r => r.branch === searchBranch);
    if (searchFromDate) results = results.filter(r => r.deliveryDate >= searchFromDate);
    if (searchToDate) results = results.filter(r => r.deliveryDate <= searchToDate);
    setSearchResults(results);
    setCurrentPage(1);
  };

  const handleCancelSearch = () => {
    let results = savedRecords.filter(r => r.status === "cancelled");
    if (searchBranch !== "all") results = results.filter(r => r.branch === searchBranch);
    if (searchFromDate) results = results.filter(r => r.deliveryDate >= searchFromDate);
    if (searchToDate) results = results.filter(r => r.deliveryDate <= searchToDate);
    setCancelledResults(results);
    setCancelledPage(1);
  };

  const handleClearSearch = () => {
    setSearchBranch("all");
    setSearchFromDate(new Date());
    setSearchToDate(new Date());
    filterActiveRecords();
    filterCancelledRecords();
    setCurrentPage(1);
    setCancelledPage(1);
  };

  const handleEdit = (record: PODRecord) => {
    setEditMode(true);
    setCurrentEditId(record.id);
    setBranch(record.branch);
    setGrNo(record.grNo);
    setGrType(record.grType);
    setCustomer(record.customer);
    setBookingDate(record.bookingDate);
    setOrigin(record.origin);
    setDestination(record.destination);
    setConsignor(record.consignor);
    setConsignee(record.consignee);
    setPckgs(record.pckgs);
    setWeight(record.weight);
    setArrivalDate(record.arrivalDate);
    setDeliveryDate(record.deliveryDate);
    setPodReceivedType(record.podReceivedType);
    setDrsNo(record.drsNo);
    setDeliveryBoyName(record.deliveryBoyName);
    setReceivedBy(record.receivedBy);
    setDesignationRelation(record.designationRelation);
    setMobile(record.mobile);
    setGrnNumber(record.grnNumber);
    setConsigneeEmail(record.consigneeEmail);
    setIdProof(record.idProof);
    setWithSign(record.withSign);
    setWithStamp(record.withStamp);
    setDirectDelivery(record.directDelivery);
    setProofImage(record.proofImage);
    setAdditionalDocs(record.additionalDocuments);
    setRemarks(record.remarks);
    setIsEntrySheetOpen(true);
  };

  const handleCancelPOD = () => {
    if (!cancelledReason) { alert("Please select cancellation reason"); return; }
    if (cancellingPOD) {
      const updatedRecords = savedRecords.map(r => 
        r.id === cancellingPOD.id ? { ...r, status: "cancelled" as const, updatedAt: new Date() } : r
      );
      setSavedRecords(updatedRecords);
      filterActiveRecords();
      filterCancelledRecords();
      alert(`POD for GR ${cancellingPOD.grNo} cancelled successfully!`);
    }
    setIsCancelDialogOpen(false);
    setCancellingPOD(null);
    setCancelledReason("");
  };

  const openCancelDialog = (record: PODRecord) => {
    setCancellingPOD(record);
    setCancelledReason("");
    setIsCancelDialogOpen(true);
  };

  const handleAddDocument = () => {
    setAdditionalDocs([...additionalDocs, `Document ${additionalDocs.length + 1}`]);
  };

  const handleRemoveDocument = (index: number) => {
    setAdditionalDocs(additionalDocs.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProofImage(file.name);
    }
  };

  const handleViewPODImage = () => {
    if (proofImage) {
      alert(`Viewing POD Image: ${proofImage}`);
    } else {
      alert("No POD image uploaded");
    }
  };

  const openAddSheet = () => {
    resetForm();
    setEditMode(false);
    setCurrentEditId(null);
    setIsEntrySheetOpen(true);
  };

  // Stats
  const activeStats = {
    total: searchResults.length,
    totalPckgs: searchResults.reduce((sum, r) => sum + r.pckgs, 0),
    totalWeight: searchResults.reduce((sum, r) => sum + r.weight, 0),
  };

  const cancelledStats = {
    total: cancelledResults.length,
  };

  // Pagination
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const paginatedResults = searchResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  const totalCancelledPages = Math.ceil(cancelledResults.length / itemsPerPage);
  const paginatedCancelledResults = cancelledResults.slice((cancelledPage - 1) * itemsPerPage, cancelledPage * itemsPerPage);
  const goToCancelledPage = (page: number) => setCancelledPage(Math.max(1, Math.min(page, totalCancelledPages)));

  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-4 p-3 md:p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-wrap justify-between items-start gap-3">
          <div>
            <div className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-blue-600" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">POD ENTRY</h1>
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
            New POD Entry
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b bg-white rounded-t-lg">
        <button
          onClick={() => {
            setMainTab("active");
            filterActiveRecords();
          }}
          className={cn(
            "px-6 py-2.5 text-sm font-medium transition-all rounded-t-lg",
            mainTab === "active"
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          )}
        >
          Active PODs
        </button>
        <button
          onClick={() => {
            setMainTab("cancelled");
            filterCancelledRecords();
          }}
          className={cn(
            "px-6 py-2.5 text-sm font-medium transition-all rounded-t-lg",
            mainTab === "cancelled"
              ? "bg-red-600 text-white shadow-md"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          )}
        >
          Cancelled PODs
        </button>
      </div>

      {/* Active PODs Tab */}
      {mainTab === "active" && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Total PODs</p>
                    <p className="text-2xl font-bold">{activeStats.total}</p>
                  </div>
                  <FileCheck className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Total Packages</p>
                    <p className="text-2xl font-bold">{activeStats.totalPckgs}</p>
                  </div>
                  <Package className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Total Weight (kg)</p>
                    <p className="text-2xl font-bold">{activeStats.totalWeight.toLocaleString()}</p>
                  </div>
                  <Weight className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search Filters */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-[11px] font-semibold flex items-center gap-2 text-gray-700">
                <Search className="h-3.5 w-3.5" />
                Search PODs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">Branch</Label>
                  <Select value={searchBranch} onValueChange={setSearchBranch}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="All Branches" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Branches</SelectItem>
                      {branchOptions.map(opt => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">From Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-8 w-full text-xs">
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {format(searchFromDate, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={searchFromDate} onSelect={(d) => d && setSearchFromDate(d)} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">To Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-8 w-full text-xs">
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {format(searchToDate, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={searchToDate} onSelect={(d) => d && setSearchToDate(d)} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex items-end gap-2">
                  <Button onClick={handleSearch} size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700">
                    <Search className="mr-1 h-3 w-3" /> Search
                  </Button>
                  <Button onClick={handleClearSearch} variant="outline" size="sm" className="h-8 text-xs">
                    <RefreshCw className="mr-1 h-3 w-3" /> Clear
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
                              <h3 className="text-[15px] font-semibold text-gray-800">POD Records List</h3>
                </div>
                <div className="text-[10px] text-gray-500">Total: {searchResults.length} records</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <div className="min-w-[1000px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="text-[11px] font-semibold py-2 px-2 w-12 text-center">#</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">GR #</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">Delivery Date</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Branch</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[120px]">Consignee</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 w-[60px] text-center">Pckgs</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 w-[80px] text-right">Weight</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[120px]">Received By</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 w-32 text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedResults.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                            <FileCheck className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            No POD records found. Click "New POD Entry" to create one.
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedResults.map((record, idx) => (
                          <TableRow key={record.id} className="hover:bg-gray-50">
                            <TableCell className="py-2 px-2 text-center text-xs">
                              {(currentPage - 1) * itemsPerPage + idx + 1}
                            </TableCell>
                            <TableCell className="py-2 px-2 font-mono font-semibold text-xs">
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 text-[11px]">
                                {record.grNo}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-2 px-2 text-xs">{format(record.deliveryDate, "dd-MM-yyyy")}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{record.branch}</TableCell>
                            <TableCell className="py-2 px-2 text-xs truncate max-w-[150px]">{record.consignee}</TableCell>
                            <TableCell className="py-2 px-2 text-center text-xs">{record.pckgs}</TableCell>
                            <TableCell className="py-2 px-2 text-right text-xs">{record.weight}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{record.receivedBy}</TableCell>
                            <TableCell className="py-2 px-2 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(record)}
                                  className="h-7 w-7 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                  title="Edit"
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openCancelDialog(record)}
                                  className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  title="Cancel"
                                >
                                  <X className="h-3.5 w-3.5" />
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
                    <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="h-7 text-[10px]">
                      <ChevronLeft className="h-3 w-3 mr-1" /> Previous
                    </Button>
                    <span className="px-3 py-1 text-[10px]">Page {currentPage} of {totalPages}</span>
                    <Button variant="outline" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="h-7 text-[10px]">
                      Next <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Cancelled PODs Tab */}
      {mainTab === "cancelled" && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Total Cancelled PODs</p>
                    <p className="text-2xl font-bold">{cancelledStats.total}</p>
                  </div>
                  <X className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search Filters for Cancelled */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-[11px] font-semibold flex items-center gap-2 text-gray-700">
                <Search className="h-3.5 w-3.5" />
                Search Cancelled PODs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">Branch</Label>
                  <Select value={searchBranch} onValueChange={setSearchBranch}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="All Branches" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Branches</SelectItem>
                      {branchOptions.map(opt => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">From Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-8 w-full text-xs">
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {format(searchFromDate, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={searchFromDate} onSelect={(d) => d && setSearchFromDate(d)} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">To Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-8 w-full text-xs">
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {format(searchToDate, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={searchToDate} onSelect={(d) => d && setSearchToDate(d)} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex items-end gap-2">
                  <Button onClick={handleCancelSearch} size="sm" className="h-8 text-xs bg-red-600 hover:bg-red-700">
                    <Search className="mr-1 h-3 w-3" /> Search
                  </Button>
                  <Button onClick={handleClearSearch} variant="outline" size="sm" className="h-8 text-xs">
                    <RefreshCw className="mr-1 h-3 w-3" /> Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cancelled Results Table */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="gap-2 w-full">
                              <Table className="text-gray-500" />
                              <h3 className="text-[15px] font-semibold text-gray-800">Cancelled PODs List</h3>
                </div>
                <div className="text-[10px] text-gray-500">Total: {cancelledResults.length} records</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <div className="min-w-[800px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="text-[11px] font-semibold py-2 px-2 w-12 text-center">#</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">GR #</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">Delivery Date</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Branch</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[120px]">Consignee</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 w-24 text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedCancelledResults.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            <X className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            No cancelled POD records found
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedCancelledResults.map((record, idx) => (
                          <TableRow key={record.id} className="hover:bg-gray-50 bg-red-50/30">
                            <TableCell className="py-2 px-2 text-center text-xs">
                              {(cancelledPage - 1) * itemsPerPage + idx + 1}
                            </TableCell>
                            <TableCell className="py-2 px-2 font-mono font-semibold text-xs">
                              <Badge variant="outline" className="bg-red-50 text-red-700 text-[11px]">
                                {record.grNo}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-2 px-2 text-xs">{format(record.deliveryDate, "dd-MM-yyyy")}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{record.branch}</TableCell>
                            <TableCell className="py-2 px-2 text-xs truncate max-w-[150px]">{record.consignee}</TableCell>
                            <TableCell className="py-2 px-2 text-center">
                              <Badge className="bg-red-100 text-red-700 text-[10px]">Cancelled</Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Pagination for Cancelled */}
              {totalCancelledPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-[10px] text-gray-500">
                    Showing {((cancelledPage - 1) * itemsPerPage) + 1} to {Math.min(cancelledPage * itemsPerPage, cancelledResults.length)} of {cancelledResults.length} entries
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" onClick={() => goToCancelledPage(cancelledPage - 1)} disabled={cancelledPage === 1} className="h-7 text-[10px]">
                      <ChevronLeft className="h-3 w-3 mr-1" /> Previous
                    </Button>
                    <span className="px-3 py-1 text-[10px]">Page {cancelledPage} of {totalCancelledPages}</span>
                    <Button variant="outline" size="sm" onClick={() => goToCancelledPage(cancelledPage + 1)} disabled={cancelledPage === totalCancelledPages} className="h-7 text-[10px]">
                      Next <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Cancel POD Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <X className="h-5 w-5" />
              Cancel POD
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel POD for GR <strong>{cancellingPOD?.grNo}</strong>?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Cancellation Reason <span className="text-red-500">*</span>
              </Label>
              <Select value={cancelledReason} onValueChange={setCancelledReason}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select cancellation reason" />
                </SelectTrigger>
                <SelectContent>
                  {cancelledReasonOptions.map(opt => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
              No, Keep POD
            </Button>
            <Button variant="destructive" onClick={handleCancelPOD}>
              Yes, Cancel POD
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Entry Sheet */}
      <Sheet open={isEntrySheetOpen} onOpenChange={setIsEntrySheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle className="flex items-center gap-2 text-base">
              {editMode ? (
                <>
                  <Edit className="h-4 w-4 text-blue-600" />
                  Edit POD Entry
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 text-blue-600" />
                  New POD Entry
                </>
              )}
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Branch <span className="text-red-500">*</span></Label>
                <Select value={branch} onValueChange={setBranch}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                  <SelectContent>{branchOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">GR # <span className="text-red-500">*</span></Label>
                <Input value={grNo} onChange={(e) => setGrNo(e.target.value)} placeholder="Enter GR Number" className="h-8 text-xs" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">GR Type <span className="text-red-500">*</span></Label>
                <Select value={grType} onValueChange={setGrType}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                  <SelectContent>{grTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Customer <span className="text-red-500">*</span></Label>
                <Select value={customer} onValueChange={setCustomer}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                  <SelectContent>{customerOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Delivery Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-8 w-full text-xs">
                      <CalendarIcon className="mr-1 h-3 w-3" />
                      {format(deliveryDate, "dd-MM-yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent><Calendar mode="single" selected={deliveryDate} onSelect={(d) => d && setDeliveryDate(d)} /></PopoverContent>
                </Popover>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">POD Received Type</Label>
                <Select value={podReceivedType} onValueChange={setPodReceivedType}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="--Select--" /></SelectTrigger>
                  <SelectContent>{podReceivedTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Received By <span className="text-red-500">*</span></Label>
                <Input value={receivedBy} onChange={(e) => setReceivedBy(e.target.value)} className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Mobile</Label>
                <Input value={mobile} onChange={(e) => setMobile(e.target.value)} className="h-8 text-xs" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Consignee</Label>
                <Input value={consignee} onChange={(e) => setConsignee(e.target.value)} className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Pckgs</Label>
                <Input type="number" value={pckgs} onChange={(e) => setPckgs(Number(e.target.value))} className="h-8 text-xs" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Weight</Label>
                <Input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Origin</Label>
                <Input value={origin} onChange={(e) => setOrigin(e.target.value)} className="h-8 text-xs" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Destination</Label>
                <Input value={destination} onChange={(e) => setDestination(e.target.value)} className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Consignee Email</Label>
                <Input value={consigneeEmail} onChange={(e) => setConsigneeEmail(e.target.value)} className="h-8 text-xs" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Delivery Boy Name</Label>
                <Select value={deliveryBoyName} onValueChange={setDeliveryBoyName}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                  <SelectContent>{deliveryBoyOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">DRS #</Label>
                <Input value={drsNo} onChange={(e) => setDrsNo(e.target.value)} className="h-8 text-xs" />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2"><input type="checkbox" checked={idProof} onChange={(e) => setIdProof(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-xs cursor-pointer">ID Proof</Label></div>
              <div className="flex items-center gap-2"><input type="checkbox" checked={withSign} onChange={(e) => setWithSign(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-xs cursor-pointer">With Sign</Label></div>
              <div className="flex items-center gap-2"><input type="checkbox" checked={withStamp} onChange={(e) => setWithStamp(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-xs cursor-pointer">With Stamp</Label></div>
              <div className="flex items-center gap-2"><input type="checkbox" checked={directDelivery} onChange={(e) => setDirectDelivery(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-xs cursor-pointer">Direct Delivery</Label></div>
            </div>

            {/* Image Upload */}
            <div className="border rounded-md p-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">POD Image</Label>
                  <div className="flex gap-2">
                    <Input type="file" accept="image/*" onChange={handleImageUpload} className="h-8 text-xs flex-1 file:h-7 file:text-xs" />
                    <Button onClick={handleViewPODImage} variant="outline" size="sm" className="h-8 text-xs"><Eye className="mr-1 h-3 w-3" />View</Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Select Proof Image</Label>
                  <Select value={proofImage} onValueChange={setProofImage}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select Proof Image" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Aadhar Card">Aadhar Card</SelectItem>
                      <SelectItem value="PAN Card">PAN Card</SelectItem>
                      <SelectItem value="Driving License">Driving License</SelectItem>
                      <SelectItem value="Voter ID">Voter ID</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Additional Documents */}
            <div className="border rounded-md p-3">
              <div className="flex justify-between items-center mb-2">
                <Label className="text-xs font-medium">Additional Documents</Label>
                <Button onClick={handleAddDocument} variant="ghost" size="sm" className="h-7 text-xs"><PlusCircle className="mr-1 h-3 w-3" />Add Document</Button>
              </div>
              {additionalDocs.length > 0 && (
                <div className="space-y-2">
                  {additionalDocs.map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Input value={doc} readOnly className="h-8 text-xs flex-1 bg-gray-50" />
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveDocument(idx)} className="h-7 w-7 p-0 text-red-500"><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Remarks */}
            <div className="space-y-1">
              <Label className="text-xs">Remarks</Label>
              <Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={2} className="text-xs" placeholder="Enter remarks..." />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsEntrySheetOpen(false)} className="h-8 text-xs">
                <X className="mr-1 h-3 w-3" /> Cancel
              </Button>
              <Button onClick={handleSave} size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700">
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

// Missing imports
import { Package, Weight } from "lucide-react";