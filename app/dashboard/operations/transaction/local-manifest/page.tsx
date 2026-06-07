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
  X,
  Truck,
  Package,
  Clock,
  Edit,
  Plus,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import toast from "react-hot-toast";

// Import API services
import {
  getManifests,
  createManifest,
  updateManifest,
  updateDestination,
  cancelManifest,
  restoreManifest,
  deleteManifest,
  getManifestStats,
  getDrivers,
  getVendors,
  getLoadingPersons,
} from "@/services/api";

// Types
interface ManifestRecord {
  _id?: string;
  manifestNo: string;
  date: Date;
  time: string;
  branch: string;
  toStation: string;
  modeName: string;
  driverName: string;
  driverMobile: string;
  vehicleVendor: string;
  loadingPerson: string;
  vendorCDNo: string;
  vendorCDDate: Date;
  remarks: string;
  lhcNo: string;
  modeCategory: string;
  noOfPckgs: number;
  grossWeight: number;
  vehicleNo: string;
  cancelledReason?: string;
  status: "active" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const cancelledReasonOptions = [
  "Customer Request",
  "Vehicle Issue",
  "Weather Condition",
  "Route Issue",
  "Other",
];

export default function LocalManifest() {
  const [mainTab, setMainTab] = useState<"active" | "cancelled">("active");
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Update Destination Modal state
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedManifest, setSelectedManifest] = useState<ManifestRecord | null>(null);
  const [newDestination, setNewDestination] = useState<string>("");
  const [newVehicleNo, setNewVehicleNo] = useState<string>("");
  const [newDriver, setNewDriver] = useState<string>("");
  const [newVendor, setNewVendor] = useState<string>("");

  // Cancel Dialog state
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancellingManifest, setCancellingManifest] = useState<ManifestRecord | null>(null);
  const [cancelledReason, setCancelledReason] = useState<string>("");

  // Static data from API
  const [driverOptions, setDriverOptions] = useState<string[]>([]);
  const [vendorOptions, setVendorOptions] = useState<string[]>([]);
  const [loadingPersonOptions, setLoadingPersonOptions] = useState<string[]>([]);

  // Search state
  const [searchBranch, setSearchBranch] = useState<string>("");

  // Entry Form State
  const [branch, setBranch] = useState<string>("");
  const [toStation, setToStation] = useState<string>("");
  const [manifestNo, setManifestNo] = useState<string>("");
  const [autoManifest, setAutoManifest] = useState<boolean>(true);
  const [despatchDate, setDespatchDate] = useState<Date>(new Date());
  const [despatchTime, setDespatchTime] = useState<string>("13:22");
  const [modeName, setModeName] = useState<string>("");
  const [driverName, setDriverName] = useState<string>("");
  const [driverMobile, setDriverMobile] = useState<string>("");
  const [vehicleVendor, setVehicleVendor] = useState<string>("");
  const [loadingPerson, setLoadingPerson] = useState<string>("");
  const [vendorCDNo, setVendorCDNo] = useState<string>("");
  const [vendorCDDate, setVendorCDDate] = useState<Date>(new Date());
  const [remarks, setRemarks] = useState<string>("");

  // Search State
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [searchResults, setSearchResults] = useState<ManifestRecord[]>([]);
  const [cancelledResults, setCancelledResults] = useState<ManifestRecord[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [cancelledPage, setCancelledPage] = useState<number>(1);
  const [stats, setStats] = useState({ 
    active: { count: 0, totalPckgs: 0, totalWeight: 0 }, 
    cancelled: { count: 0 } 
  });
  const itemsPerPage: number = 10;

  // Load static data on mount
  useEffect(() => {
    loadStaticData();
    loadManifests();
    loadStats();
  }, []);

  const loadStaticData = async () => {
    try {
      const [driversRes, vendorsRes, personsRes] = await Promise.all([
        getDrivers(),
        getVendors(),
        getLoadingPersons(),
      ]);
      setDriverOptions(driversRes.data || []);
      setVendorOptions(vendorsRes.data || []);
      setLoadingPersonOptions(personsRes.data || []);
    } catch (error) {
      console.error("Error loading static data:", error);
      toast.error("Failed to load static data");
    }
  };

  const loadManifests = async () => {
    setLoading(true);
    try {
      const response = await getManifests({ status: "active", limit: 100 });
      setSearchResults(response.data || []);
    } catch (error) {
      console.error("Error loading manifests:", error);
      toast.error("Failed to load manifests");
    } finally {
      setLoading(false);
    }
  };

  const loadCancelledManifests = async () => {
    setLoading(true);
    try {
      const response = await getManifests({ status: "cancelled", limit: 100 });
      setCancelledResults(response.data || []);
    } catch (error) {
      console.error("Error loading cancelled manifests:", error);
      toast.error("Failed to load cancelled manifests");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await getManifestStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const resetForm = () => {
    setBranch("");
    setToStation("");
    setManifestNo("");
    setDespatchDate(new Date());
    setDespatchTime("13:22");
    setModeName("");
    setDriverName("");
    setDriverMobile("");
    setVehicleVendor("");
    setLoadingPerson("");
    setVendorCDNo("");
    setVendorCDDate(new Date());
    setRemarks("");
    setEditMode(false);
    setCurrentEditId(null);
    setAutoManifest(true);
  };

  const handleSave = async () => {
    if (!branch) {
      toast.error("Please enter Branch");
      return;
    }
    if (!toStation) {
      toast.error("Please enter To Station");
      return;
    }
    if (!modeName) {
      toast.error("Please enter Mode Name");
      return;
    }
    if (!driverName) {
      toast.error("Please enter Driver Name");
      return;
    }
    if (!loadingPerson) {
      toast.error("Please enter Loading Person");
      return;
    }

    setLoading(true);

    const manifestData: any = {
      branch,
      toStation,
      date: despatchDate,
      time: despatchTime,
      modeName,
      driverName,
      driverMobile: driverMobile || "",
      vehicleVendor: vehicleVendor || "",
      loadingPerson,
      vendorCDNo: vendorCDNo || "",
      vendorCDDate,
      remarks: remarks || "",
      lhcNo: "",
      modeCategory: "SURFACE",
      noOfPckgs: 0,
      grossWeight: 0,
      vehicleNo: "",
      autoManifest,
    };

    if (!autoManifest && manifestNo) {
      manifestData.manifestNo = manifestNo;
    }

    try {
      let response;
      if (editMode && currentEditId) {
        response = await updateManifest(currentEditId, manifestData);
        toast.success("Manifest updated successfully!");
      } else {
        response = await createManifest(manifestData);
        toast.success(`Manifest created successfully! No: ${response.data.manifestNo}`);
      }

      await loadManifests();
      await loadCancelledManifests();
      await loadStats();
      resetForm();
      setIsEntryModalOpen(false);
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error.response?.data?.message || "Failed to save manifest");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const filters: any = { status: "active", limit: 100 };
      if (fromDate) filters.fromDate = fromDate.toISOString();
      if (toDate) filters.toDate = toDate.toISOString();
      if (searchBranch) filters.branch = searchBranch;

      const response = await getManifests(filters);
      setSearchResults(response.data || []);
      setCurrentPage(1);
      toast.success(`Found ${response.data?.length || 0} manifests`);
    } catch (error: any) {
      console.error("Search error:", error);
      toast.error(error.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelledSearch = async () => {
    setLoading(true);
    try {
      const filters: any = { status: "cancelled", limit: 100 };
      if (fromDate) filters.fromDate = fromDate.toISOString();
      if (toDate) filters.toDate = toDate.toISOString();
      if (searchBranch) filters.branch = searchBranch;

      const response = await getManifests(filters);
      setCancelledResults(response.data || []);
      setCancelledPage(1);
      toast.success(`Found ${response.data?.length || 0} cancelled manifests`);
    } catch (error: any) {
      console.error("Search error:", error);
      toast.error(error.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setFromDate(new Date());
    setToDate(new Date());
    setSearchBranch("");
    loadManifests();
    loadCancelledManifests();
    toast.success("Search filters cleared");
  };

  const handleEdit = (record: ManifestRecord) => {
    setEditMode(true);
    setCurrentEditId(record._id!);
    setBranch(record.branch);
    setToStation(record.toStation);
    setManifestNo(record.manifestNo);
    setDespatchDate(new Date(record.date));
    setDespatchTime(record.time);
    setModeName(record.modeName);
    setDriverName(record.driverName);
    setDriverMobile(record.driverMobile);
    setVehicleVendor(record.vehicleVendor);
    setLoadingPerson(record.loadingPerson);
    setVendorCDNo(record.vendorCDNo);
    setVendorCDDate(new Date(record.vendorCDDate));
    setRemarks(record.remarks);
    setAutoManifest(false);
    setIsEntryModalOpen(true);
  };

  const handlePrint = (record: ManifestRecord) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Manifest ${record.manifestNo}</title></head>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h1>Manifest Details</h1>
            <p><strong>Manifest No:</strong> ${record.manifestNo}</p>
            <p><strong>Date:</strong> ${format(new Date(record.date), "dd-MM-yyyy")}</p>
            <p><strong>Branch:</strong> ${record.branch}</p>
            <p><strong>To Station:</strong> ${record.toStation}</p>
            <p><strong>Driver:</strong> ${record.driverName}</p>
            <p><strong>Vehicle:</strong> ${record.vehicleNo || "N/A"}</p>
            <hr />
            <p>Generated by CargoMax System</p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
    toast.success("Print dialog opened");
  };

  const handleUpdateDestination = (record: ManifestRecord) => {
    setSelectedManifest(record);
    setNewDestination(record.toStation);
    setNewVehicleNo(record.vehicleNo || "");
    setNewDriver(record.driverName);
    setNewVendor(record.vehicleVendor);
    setIsUpdateModalOpen(true);
  };

  const handleSaveUpdateDestination = async () => {
    if (!newDestination) {
      toast.error("Please enter New Destination");
      return;
    }
    if (selectedManifest) {
      setLoading(true);
      try {
        await updateDestination(selectedManifest._id!, {
          newDestination,
          newVehicleNo,
          newDriver,
          newVendor,
        });
        toast.success(`Manifest ${selectedManifest.manifestNo} updated successfully!`);
        await loadManifests();
        await loadCancelledManifests();
        setIsUpdateModalOpen(false);
      } catch (error: any) {
        console.error("Update destination error:", error);
        toast.error(error.response?.data?.message || "Failed to update destination");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancelManifest = async () => {
    if (!cancelledReason) {
      toast.error("Please select cancellation reason");
      return;
    }
    if (cancellingManifest) {
      setLoading(true);
      try {
        await cancelManifest(cancellingManifest._id!, cancelledReason);
        toast.success(`Manifest ${cancellingManifest.manifestNo} cancelled successfully!`);
        await loadManifests();
        await loadCancelledManifests();
        await loadStats();
        setIsCancelDialogOpen(false);
        setCancellingManifest(null);
        setCancelledReason("");
      } catch (error: any) {
        console.error("Cancel error:", error);
        toast.error(error.response?.data?.message || "Failed to cancel manifest");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRestoreManifest = async (record: ManifestRecord) => {
    if (confirm(`Restore manifest ${record.manifestNo}?`)) {
      setLoading(true);
      try {
        await restoreManifest(record._id!);
        toast.success(`Manifest ${record.manifestNo} restored!`);
        await loadManifests();
        await loadCancelledManifests();
        await loadStats();
      } catch (error: any) {
        console.error("Restore error:", error);
        toast.error(error.response?.data?.message || "Failed to restore manifest");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async (id: string, manifestNo: string) => {
    if (confirm(`Permanently delete manifest ${manifestNo}? This action cannot be undone.`)) {
      setLoading(true);
      try {
        await deleteManifest(id);
        toast.success("Manifest deleted permanently!");
        await loadManifests();
        await loadCancelledManifests();
        await loadStats();
      } catch (error: any) {
        console.error("Delete error:", error);
        toast.error(error.response?.data?.message || "Failed to delete manifest");
      } finally {
        setLoading(false);
      }
    }
  };

  const openAddModal = () => {
    resetForm();
    setEditMode(false);
    setCurrentEditId(null);
    setManifestNo("");
    setAutoManifest(true);
    setIsEntryModalOpen(true);
  };

  const openCancelDialog = (record: ManifestRecord) => {
    setCancellingManifest(record);
    setCancelledReason("");
    setIsCancelDialogOpen(true);
  };

  const activeStats = {
    total: stats.active.count,
    totalPckgs: stats.active.totalPckgs,
    totalWeight: stats.active.totalWeight,
  };

  const cancelledStats = {
    total: stats.cancelled.count,
  };

  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const paginatedResults = searchResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const goToPage = (page: number) =>
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  const totalCancelledPages = Math.ceil(cancelledResults.length / itemsPerPage);
  const paginatedCancelledResults = cancelledResults.slice(
    (cancelledPage - 1) * itemsPerPage,
    cancelledPage * itemsPerPage
  );
  const goToCancelledPage = (page: number) =>
    setCancelledPage(Math.max(1, Math.min(page, totalCancelledPages)));

  return (
    <div className="space-y-4 p-4 md:p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-wrap justify-between items-start gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-600" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                LOCAL MANIFEST
              </h1>
            </div>
          </div>
          <Button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            New Manifest
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b bg-white rounded-t-lg">
        <button
          onClick={() => {
            setMainTab("active");
            loadManifests();
          }}
          className={cn(
            "px-6 py-2.5 text-sm font-medium transition-all rounded-t-lg",
            mainTab === "active"
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          )}
        >
          Active Manifests
        </button>
        <button
          onClick={() => {
            setMainTab("cancelled");
            loadCancelledManifests();
          }}
          className={cn(
            "px-6 py-2.5 text-sm font-medium transition-all rounded-t-lg",
            mainTab === "cancelled"
              ? "bg-red-600 text-white shadow-md"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          )}
        >
          Cancelled Manifests
        </button>
      </div>

      {/* Active Manifests Tab */}
      {mainTab === "active" && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Total Manifests</p>
                    <p className="text-2xl font-bold">{activeStats.total}</p>
                  </div>
                  <Truck className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Total Packages</p>
                    <p className="text-2xl font-bold">{activeStats.totalPckgs.toLocaleString()}</p>
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
                  <Clock className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search Filters */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-gray-700">
                <Search className="h-4 w-4" />
                Search Manifests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">From Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-9 w-full text-sm justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(fromDate, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-[10000]">
                      <Calendar mode="single" selected={fromDate} onSelect={(d) => d && setFromDate(d)} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">To Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-9 w-full text-sm justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(toDate, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-[10000]">
                      <Calendar mode="single" selected={toDate} onSelect={(d) => d && setToDate(d)} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Branch</Label>
                  <Input
                    value={searchBranch}
                    onChange={(e) => setSearchBranch(e.target.value)}
                    placeholder="Enter branch name"
                    className="h-9 text-sm"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button onClick={handleSearch} className="h-9 text-sm bg-blue-600" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Search className="h-4 w-4 mr-1" />}
                    Search
                  </Button>
                  <Button onClick={handleClearSearch} variant="outline" className="h-9 text-sm">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Table */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-semibold text-gray-800">Manifests List</h3>
                <div className="text-xs text-gray-500">Total: {searchResults.length} records</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <div className="min-w-[1000px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="text-xs py-3 px-2 w-12 text-center">#</TableHead>
                        <TableHead className="text-xs py-3 px-2 min-w-[100px]">Manifest #</TableHead>
                        <TableHead className="text-xs py-3 px-2 min-w-[80px]">Date</TableHead>
                        <TableHead className="text-xs py-3 px-2 min-w-[100px]">Branch</TableHead>
                        <TableHead className="text-xs py-3 px-2 min-w-[120px]">To Station</TableHead>
                        <TableHead className="text-xs py-3 px-2 min-w-[100px]">Driver</TableHead>
                        <TableHead className="text-xs py-3 px-2 w-[60px] text-center">Pckgs</TableHead>
                        <TableHead className="text-xs py-3 px-2 w-[80px] text-right">Weight</TableHead>
                        <TableHead className="text-xs py-3 px-2 w-32 text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-12">
                            <Loader2 className="h-8 w-8 mx-auto animate-spin text-blue-500" />
                            <p className="text-gray-500 mt-2">Loading manifests...</p>
                          </TableCell>
                        </TableRow>
                      ) : paginatedResults.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-12 text-gray-500">
                            <Truck className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            No manifests found. Click "New Manifest" to create one.
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedResults.map((record, idx) => (
                          <TableRow key={record._id} className="hover:bg-gray-50">
                            <TableCell className="py-3 px-2 text-center text-sm">
                              {(currentPage - 1) * itemsPerPage + idx + 1}
                            </TableCell>
                            <TableCell className="py-3 px-2 font-mono font-semibold text-sm">
                              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                {record.manifestNo}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-3 px-2 text-sm">
                              {format(new Date(record.date), "dd-MM-yyyy")}
                            </TableCell>
                            <TableCell className="py-3 px-2 text-sm">{record.branch}</TableCell>
                            <TableCell className="py-3 px-2 text-sm">{record.toStation}</TableCell>
                            <TableCell className="py-3 px-2 text-sm">{record.driverName}</TableCell>
                            <TableCell className="py-3 px-2 text-center text-sm">{record.noOfPckgs}</TableCell>
                            <TableCell className="py-3 px-2 text-right text-sm">{record.grossWeight}</TableCell>
                            <TableCell className="py-3 px-2 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(record)}
                                  className="h-8 w-8 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                  title="Edit"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handlePrint(record)}
                                  className="h-8 w-8 p-0 text-green-500 hover:text-green-700 hover:bg-green-50"
                                  title="Print"
                                >
                                  <Printer className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUpdateDestination(record)}
                                  className="h-8 w-8 p-0 text-purple-500 hover:text-purple-700 hover:bg-purple-50"
                                  title="Update Destination"
                                >
                                  <MapPin className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openCancelDialog(record)}
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  title="Cancel"
                                >
                                  <X className="h-4 w-4" />
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
                  <div className="text-sm text-gray-500">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, searchResults.length)} of {searchResults.length}{" "}
                    entries
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="h-8 text-sm"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                    </Button>
                    <span className="px-3 py-1 text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="h-8 text-sm"
                    >
                      Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Cancelled Manifests Tab */}
      {mainTab === "cancelled" && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Total Cancelled Manifests</p>
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
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-gray-700">
                <Search className="h-4 w-4" />
                Search Cancelled Manifests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">From Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-9 w-full text-sm justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(fromDate, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-[10000]">
                      <Calendar mode="single" selected={fromDate} onSelect={(d) => d && setFromDate(d)} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">To Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-9 w-full text-sm justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(toDate, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-[10000]">
                      <Calendar mode="single" selected={toDate} onSelect={(d) => d && setToDate(d)} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Branch</Label>
                  <Input
                    value={searchBranch}
                    onChange={(e) => setSearchBranch(e.target.value)}
                    placeholder="Enter branch name"
                    className="h-9 text-sm"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button onClick={handleCancelledSearch} className="h-9 text-sm bg-red-600" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Search className="h-4 w-4 mr-1" />}
                    Search
                  </Button>
                  <Button onClick={handleClearSearch} variant="outline" className="h-9 text-sm">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cancelled Results Table */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-semibold text-gray-800">Cancelled Manifests List</h3>
                <div className="text-xs text-gray-500">Total: {cancelledResults.length} records</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <div className="min-w-[800px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="text-xs py-3 px-2 w-12 text-center">#</TableHead>
                        <TableHead className="text-xs py-3 px-2 min-w-[100px]">Manifest #</TableHead>
                        <TableHead className="text-xs py-3 px-2 min-w-[80px]">Date</TableHead>
                        <TableHead className="text-xs py-3 px-2 min-w-[100px]">Branch</TableHead>
                        <TableHead className="text-xs py-3 px-2 min-w-[120px]">To Station</TableHead>
                        <TableHead className="text-xs py-3 px-2 w-24 text-center">Status</TableHead>
                        <TableHead className="text-xs py-3 px-2 w-24 text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-12">
                            <Loader2 className="h-8 w-8 mx-auto animate-spin text-red-500" />
                            <p className="text-gray-500 mt-2">Loading cancelled manifests...</p>
                          </TableCell>
                        </TableRow>
                      ) : paginatedCancelledResults.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                            <X className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            No cancelled manifests found
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedCancelledResults.map((record, idx) => (
                          <TableRow key={record._id} className="hover:bg-gray-50 bg-red-50/30">
                            <TableCell className="py-3 px-2 text-center text-sm">
                              {(cancelledPage - 1) * itemsPerPage + idx + 1}
                            </TableCell>
                            <TableCell className="py-3 px-2 font-mono font-semibold text-sm">
                              <Badge variant="outline" className="bg-red-50 text-red-700">
                                {record.manifestNo}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-3 px-2 text-sm">
                              {format(new Date(record.date), "dd-MM-yyyy")}
                            </TableCell>
                            <TableCell className="py-3 px-2 text-sm">{record.branch}</TableCell>
                            <TableCell className="py-3 px-2 text-sm">{record.toStation}</TableCell>
                            <TableCell className="py-3 px-2 text-center">
                              <Badge className="bg-red-100 text-red-700">Cancelled</Badge>
                            </TableCell>
                            <TableCell className="py-3 px-2 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRestoreManifest(record)}
                                  className="h-8 w-8 p-0 text-green-500 hover:text-green-700 hover:bg-green-50"
                                  title="Restore"
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(record._id!, record.manifestNo)}
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  title="Delete Permanently"
                                >
                                  <Trash2 className="h-4 w-4" />
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

              {/* Pagination for Cancelled */}
              {totalCancelledPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">
                    Showing {((cancelledPage - 1) * itemsPerPage) + 1} to{" "}
                    {Math.min(cancelledPage * itemsPerPage, cancelledResults.length)} of {cancelledResults.length}{" "}
                    entries
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToCancelledPage(cancelledPage - 1)}
                      disabled={cancelledPage === 1}
                      className="h-8 text-sm"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                    </Button>
                    <span className="px-3 py-1 text-sm">
                      Page {cancelledPage} of {totalCancelledPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToCancelledPage(cancelledPage + 1)}
                      disabled={cancelledPage === totalCancelledPages}
                      className="h-8 text-sm"
                    >
                      Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Cancel Manifest Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="sm:max-w-md z-[9999]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <X className="h-5 w-5" />
              Cancel Manifest
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel manifest{" "}
              <strong>{cancellingManifest?.manifestNo}</strong>?
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
                  {cancelledReasonOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
              No, Keep Manifest
            </Button>
            <Button variant="destructive" onClick={handleCancelManifest} disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Yes, Cancel Manifest
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Destination Modal */}
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="max-w-2xl z-[9999]">
          <DialogHeader>
            <DialogTitle>
              Update Destination - Manifest #: {selectedManifest?.manifestNo}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-1">
              <Label className="text-sm">Current Destination</Label>
              <Input
                value={selectedManifest?.toStation || ""}
                readOnly
                className="h-9 text-sm bg-gray-50"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm">
                New Destination <span className="text-red-500">*</span>
              </Label>
              <Input
                value={newDestination}
                onChange={(e) => setNewDestination(e.target.value)}
                placeholder="Enter New Destination"
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Current Vehicle #</Label>
              <Input
                value={selectedManifest?.vehicleNo || "-"}
                readOnly
                className="h-9 text-sm bg-gray-50"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm">New Vehicle #</Label>
              <Input
                value={newVehicleNo}
                onChange={(e) => setNewVehicleNo(e.target.value)}
                placeholder="Enter New Vehicle #"
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Current Driver</Label>
              <Input
                value={selectedManifest?.driverName || ""}
                readOnly
                className="h-9 text-sm bg-gray-50"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm">New Driver</Label>
              <Input
                value={newDriver}
                onChange={(e) => setNewDriver(e.target.value)}
                placeholder="Enter New Driver"
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Current Vendor</Label>
              <Input
                value={selectedManifest?.vehicleVendor || ""}
                readOnly
                className="h-9 text-sm bg-gray-50"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm">New Vendor</Label>
              <Input
                value={newVendor}
                onChange={(e) => setNewVendor(e.target.value)}
                placeholder="Enter New Vendor"
                className="h-9 text-sm"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsUpdateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUpdateDestination} className="bg-green-600 hover:bg-green-700" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Entry Modal - Centered Dialog */}
      <Dialog open={isEntryModalOpen} onOpenChange={setIsEntryModalOpen}>
        <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto z-[9999]">
          <DialogHeader className="sticky top-0 bg-white z-10 pb-3 border-b">
            <DialogTitle className="text-xl flex items-center gap-2">
              {editMode ? (
                <>
                  <Edit className="h-5 w-5 text-blue-600" />
                  Edit Manifest
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 text-blue-600" />
                  Create New Manifest
                </>
              )}
            </DialogTitle>
            <DialogDescription>Fill in all manifest details below.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-sm">
                  Branch <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="Enter branch name"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm">
                  To Station <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={toStation}
                  onChange={(e) => setToStation(e.target.value)}
                  placeholder="Enter destination station"
                  className="h-9 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-sm">Manifest #</Label>
                <div className="flex gap-2">
                  <Input
                    value={manifestNo}
                    onChange={(e) => setManifestNo(e.target.value)}
                    readOnly={autoManifest}
                    className={cn("h-9 text-sm flex-1", autoManifest && "bg-gray-50")}
                    placeholder={autoManifest ? "Auto-generated" : "Enter Manifest No"}
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={autoManifest}
                      onChange={(e) => setAutoManifest(e.target.checked)}
                      className="h-4 w-4 rounded"
                      id="auto"
                    />
                    <Label htmlFor="auto" className="text-sm cursor-pointer">
                      Auto
                    </Label>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-sm">Despatch Date/Time</Label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-9 flex-1 text-sm justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(despatchDate, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-[10000]">
                      <Calendar
                        mode="single"
                        selected={despatchDate}
                        onSelect={(d) => d && setDespatchDate(d)}
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    type="time"
                    value={despatchTime}
                    onChange={(e) => setDespatchTime(e.target.value)}
                    className="h-9 w-28 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-sm">
                  Mode Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={modeName}
                  onChange={(e) => setModeName(e.target.value)}
                  placeholder="Enter Mode Name (e.g., Vehicle No)"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm">
                  Driver Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="Enter Driver Name"
                  className="h-9 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-sm">Driver Mobile</Label>
                <Input
                  value={driverMobile}
                  onChange={(e) => setDriverMobile(e.target.value)}
                  placeholder="Enter Mobile Number"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm">Vehicle Vendor</Label>
                <Input
                  value={vehicleVendor}
                  onChange={(e) => setVehicleVendor(e.target.value)}
                  placeholder="Enter Vehicle Vendor"
                  className="h-9 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-sm">
                  Loading Person <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={loadingPerson}
                  onChange={(e) => setLoadingPerson(e.target.value)}
                  placeholder="Enter Loading Person"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm">Vendor CD #</Label>
                <Input
                  value={vendorCDNo}
                  onChange={(e) => setVendorCDNo(e.target.value)}
                  placeholder="Enter Vendor CD #"
                  className="h-9 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-sm">Remarks</Label>
              <Textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={2}
                className="text-sm"
                placeholder="Enter remarks..."
              />
            </div>
          </div>

          <DialogFooter className="sticky bottom-0 bg-white pt-3 border-t gap-2">
            <Button variant="outline" onClick={() => setIsEntryModalOpen(false)} className="h-9">
              <X className="mr-1 h-4 w-4" /> Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading} className="h-9 bg-blue-600 hover:bg-blue-700">
              {loading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Save className="mr-1 h-4 w-4" />}
              {editMode ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}