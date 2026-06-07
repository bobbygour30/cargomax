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
  Package,
  Weight,
  FileSpreadsheet,
  Filter,
  ChevronLeft,
  ChevronRight,
  Plus,
  History,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import toast from "react-hot-toast";

// Import API services
import {
  getLongRouteManifests,
  createLongRouteManifest,
  updateLongRouteManifest,
  cancelLongRouteManifest,
  restoreLongRouteManifest,
  deleteLongRouteManifest,
  getLongRouteManifestStats,
  getStockItems,
} from "@/services/api";

// Types
interface LongRouteManifest {
  _id?: string;
  manifestNo: string;
  manifestDateTime: Date;
  manifestTime: string;
  branch: string;
  toStation: string;
  deliveryLocation: string;
  vehicleType: string;
  vendor: string;
  vehicleNo: string;
  capacity: string;
  driver: string;
  mobileNo: string;
  consolidatedEwaybillNo: string;
  ewaybillDate: Date;
  loadedBy: string;
  estimateArrivalAtDestination: string;
  remarks: string;
  type: string;
  fromStation: string;
  arrivalAt: string;
  category: string;
  dispatchedPckgs: number;
  dispatchedWt: number;
  lhcNo: string;
  cancelledReason?: string;
  status: "active" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

interface StockItem {
  id: number;
  grNo: string;
  grDate: Date;
  origin: string;
  destination: string;
  consignor: string;
  consignee: string;
  toPay: string;
  paid: string;
  tbb: string;
  stockPckgs: number;
  selected: boolean;
}

const cancelledReasonOptions = [
  "Customer Request",
  "Vehicle Issue",
  "Weather Condition",
  "Route Issue",
  "Other",
];

export default function LongRouteManifestGRL() {
  const [mainTab, setMainTab] = useState<"active" | "stock" | "cancelled">("active");
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Cancel Dialog state
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancellingManifest, setCancellingManifest] = useState<LongRouteManifest | null>(null);
  const [cancelledReason, setCancelledReason] = useState<string>("");

  // Form state
  const [autoManifest, setAutoManifest] = useState<boolean>(true);
  const [manifestNo, setManifestNo] = useState<string>("");
  const [manifestDateTime, setManifestDateTime] = useState<Date>(new Date());
  const [manifestTime, setManifestTime] = useState<string>("14:34");
  const [branch, setBranch] = useState<string>("");
  const [toStation, setToStation] = useState<string>("");
  const [deliveryLocation, setDeliveryLocation] = useState<string>("");
  const [vehicleType, setVehicleType] = useState<string>("");
  const [vendor, setVendor] = useState<string>("");
  const [vehicleNo, setVehicleNo] = useState<string>("");
  const [capacity, setCapacity] = useState<string>("");
  const [driver, setDriver] = useState<string>("");
  const [mobileNo, setMobileNo] = useState<string>("");
  const [consolidatedEwaybillNo, setConsolidatedEwaybillNo] = useState<string>("");
  const [ewaybillDate, setEwaybillDate] = useState<Date>(new Date());
  const [loadedBy, setLoadedBy] = useState<string>("");
  const [estimateArrivalAtDestination, setEstimateArrivalAtDestination] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");

  // Stock of Despatch State
  const [stockBranch, setStockBranch] = useState<string>("");
  const [asOnDate, setAsOnDate] = useState<Date>(new Date());
  const [destination, setDestination] = useState<string>("");
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [selectAllBranch, setSelectAllBranch] = useState<boolean>(false);
  const [selectAllDestination, setSelectAllDestination] = useState<boolean>(false);
  const [stockCurrentPage, setStockCurrentPage] = useState<number>(1);
  const [stockStats, setStockStats] = useState({ total: 0, selected: 0, totalPckgs: 0 });
  const stockItemsPerPage: number = 10;

  // Search State
  const [searchBranch, setSearchBranch] = useState<string>("");
  const [searchFromDate, setSearchFromDate] = useState<Date>(new Date());
  const [searchToDate, setSearchToDate] = useState<Date>(new Date());
  const [searchResults, setSearchResults] = useState<LongRouteManifest[]>([]);
  const [cancelledResults, setCancelledResults] = useState<LongRouteManifest[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [cancelledPage, setCancelledPage] = useState<number>(1);
  const [stats, setStats] = useState({ 
    active: { count: 0, totalPckgs: 0, totalWeight: 0 }, 
    cancelled: { count: 0 } 
  });
  const itemsPerPage: number = 10;

  // Load data on mount
  useEffect(() => {
    loadManifests();
    loadStats();
  }, []);

  const loadManifests = async () => {
    setLoading(true);
    try {
      const response = await getLongRouteManifests({ status: "active", limit: 100 });
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
      const response = await getLongRouteManifests({ status: "cancelled", limit: 100 });
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
      const response = await getLongRouteManifestStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const loadStockItems = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (stockBranch && !selectAllBranch) filters.branch = stockBranch;
      if (destination && !selectAllDestination) filters.destination = destination;
      if (asOnDate) filters.asOnDate = asOnDate.toISOString();

      const response = await getStockItems(filters);
      const items = response.data.map((item: any, index: number) => ({
        ...item,
        id: index + 1,
        selected: false,
      }));
      setStockItems(items);
      setStockStats({
        total: items.length,
        selected: 0,
        totalPckgs: items.reduce((sum: number, i: StockItem) => sum + i.stockPckgs, 0),
      });
      setSelectAll(false);
      toast.success(`Found ${items.length} stock items`);
    } catch (error) {
      console.error("Error loading stock items:", error);
      toast.error("Failed to load stock items");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setManifestNo("");
    setManifestDateTime(new Date());
    setManifestTime("14:34");
    setBranch("");
    setToStation("");
    setDeliveryLocation("");
    setVehicleType("");
    setVendor("");
    setVehicleNo("");
    setCapacity("");
    setDriver("");
    setMobileNo("");
    setConsolidatedEwaybillNo("");
    setEwaybillDate(new Date());
    setLoadedBy("");
    setEstimateArrivalAtDestination("");
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
    if (!vehicleNo) {
      toast.error("Please enter Vehicle #");
      return;
    }
    if (!driver) {
      toast.error("Please enter Driver");
      return;
    }
    if (!loadedBy) {
      toast.error("Please enter Loaded By");
      return;
    }

    setLoading(true);

    const manifestData: any = {
      manifestDateTime,
      manifestTime,
      branch,
      toStation,
      deliveryLocation: deliveryLocation || "",
      vehicleType: vehicleType || "",
      vendor: vendor || "",
      vehicleNo,
      capacity: capacity || "",
      driver,
      mobileNo: mobileNo || "",
      consolidatedEwaybillNo: consolidatedEwaybillNo || "",
      ewaybillDate,
      loadedBy,
      estimateArrivalAtDestination: estimateArrivalAtDestination || "",
      remarks: remarks || "",
      autoManifest,
    };

    if (!autoManifest && manifestNo) {
      manifestData.manifestNo = manifestNo;
    }

    try {
      let response;
      if (editMode && currentEditId) {
        response = await updateLongRouteManifest(currentEditId, manifestData);
        toast.success("Manifest updated successfully!");
      } else {
        response = await createLongRouteManifest(manifestData);
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
      if (searchBranch) filters.branch = searchBranch;
      if (searchFromDate) filters.fromDate = searchFromDate.toISOString();
      if (searchToDate) filters.toDate = searchToDate.toISOString();

      const response = await getLongRouteManifests(filters);
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

  const handleCancelSearch = async () => {
    setLoading(true);
    try {
      const filters: any = { status: "cancelled", limit: 100 };
      if (searchBranch) filters.branch = searchBranch;
      if (searchFromDate) filters.fromDate = searchFromDate.toISOString();
      if (searchToDate) filters.toDate = searchToDate.toISOString();

      const response = await getLongRouteManifests(filters);
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
    setSearchBranch("");
    setSearchFromDate(new Date());
    setSearchToDate(new Date());
    loadManifests();
    loadCancelledManifests();
    toast.success("Search filters cleared");
  };

  const handleStockSearch = async () => {
    await loadStockItems();
    setStockCurrentPage(1);
  };

  const handleClearStockSearch = () => {
    setStockBranch("");
    setDestination("");
    setSelectAllBranch(false);
    setSelectAllDestination(false);
    setAsOnDate(new Date());
    setStockItems([]);
    setStockStats({ total: 0, selected: 0, totalPckgs: 0 });
    setSelectAll(false);
    setStockCurrentPage(1);
  };

  const handleEdit = (record: LongRouteManifest) => {
    setEditMode(true);
    setCurrentEditId(record._id!);
    setManifestNo(record.manifestNo);
    setManifestDateTime(new Date(record.manifestDateTime));
    setManifestTime(record.manifestTime);
    setBranch(record.branch);
    setToStation(record.toStation);
    setDeliveryLocation(record.deliveryLocation);
    setVehicleType(record.vehicleType);
    setVendor(record.vendor);
    setVehicleNo(record.vehicleNo);
    setCapacity(record.capacity);
    setDriver(record.driver);
    setMobileNo(record.mobileNo);
    setConsolidatedEwaybillNo(record.consolidatedEwaybillNo);
    setEwaybillDate(new Date(record.ewaybillDate));
    setLoadedBy(record.loadedBy);
    setEstimateArrivalAtDestination(record.estimateArrivalAtDestination);
    setRemarks(record.remarks);
    setAutoManifest(false);
    setIsEntryModalOpen(true);
  };

  const handleCancelManifest = async () => {
    if (!cancelledReason) {
      toast.error("Please select cancellation reason");
      return;
    }
    if (cancellingManifest) {
      setLoading(true);
      try {
        await cancelLongRouteManifest(cancellingManifest._id!, cancelledReason);
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

  const handleRestoreManifest = async (record: LongRouteManifest) => {
    if (confirm(`Restore manifest ${record.manifestNo}?`)) {
      setLoading(true);
      try {
        await restoreLongRouteManifest(record._id!);
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
        await deleteLongRouteManifest(id);
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

  const openCancelDialog = (record: LongRouteManifest) => {
    setCancellingManifest(record);
    setCancelledReason("");
    setIsCancelDialogOpen(true);
  };

  const handlePrintLoadingTally = () => {
    const selectedItems = stockItems.filter(i => i.selected);
    if (selectedItems.length === 0) {
      toast.error("Please select at least one item to print");
      return;
    }
    
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Loading Tally</title></head>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h1>Loading Tally Report</h1>
            <p><strong>Date:</strong> ${format(new Date(), "dd-MM-yyyy HH:mm")}</p>
            <p><strong>Total Selected Items:</strong> ${selectedItems.length}</p>
            <p><strong>Total Packages:</strong> ${selectedItems.reduce((sum, i) => sum + i.stockPckgs, 0)}</p>
            <hr />
            <table border="1" cellpadding="5" cellspacing="0" style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr>
                  <th>GR #</th>
                  <th>Origin</th>
                  <th>Destination</th>
                  <th>Consignor</th>
                  <th>Consignee</th>
                  <th>Packages</th>
                </tr>
              </thead>
              <tbody>
                ${selectedItems.map(item => `
                  <tr>
                    <td>${item.grNo}</td>
                    <td>${item.origin}</td>
                    <td>${item.destination}</td>
                    <td>${item.consignor}</td>
                    <td>${item.consignee}</td>
                    <td>${item.stockPckgs}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
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

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    const updatedItems = stockItems.map(item => ({ ...item, selected: newSelectAll }));
    setStockItems(updatedItems);
    setStockStats({
      ...stockStats,
      selected: newSelectAll ? stockItems.length : 0,
    });
  };

  const handleSelectItem = (id: number) => {
    const updatedItems = stockItems.map(item =>
      item.id === id ? { ...item, selected: !item.selected } : item
    );
    setStockItems(updatedItems);
    setStockStats({
      ...stockStats,
      selected: updatedItems.filter(i => i.selected).length,
    });
    setSelectAll(updatedItems.every(i => i.selected));
  };

  const handleSelectAllBranch = () => {
    setSelectAllBranch(!selectAllBranch);
    if (!selectAllBranch) {
      setStockBranch("ALL");
    } else {
      setStockBranch("");
    }
  };

  const handleSelectAllDestination = () => {
    setSelectAllDestination(!selectAllDestination);
    if (!selectAllDestination) {
      setDestination("ALL");
    } else {
      setDestination("");
    }
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
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  const totalCancelledPages = Math.ceil(cancelledResults.length / itemsPerPage);
  const paginatedCancelledResults = cancelledResults.slice(
    (cancelledPage - 1) * itemsPerPage,
    cancelledPage * itemsPerPage
  );
  const goToCancelledPage = (page: number) => setCancelledPage(Math.max(1, Math.min(page, totalCancelledPages)));

  const totalStockPages = Math.ceil(stockItems.length / stockItemsPerPage);
  const paginatedStockItems = stockItems.slice(
    (stockCurrentPage - 1) * stockItemsPerPage,
    stockCurrentPage * stockItemsPerPage
  );
  const goToStockPage = (page: number) => setStockCurrentPage(Math.max(1, Math.min(page, totalStockPages)));

  return (
    <div className="space-y-4 p-4 md:p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-wrap justify-between items-start gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-600" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">LONG ROUTE MANIFEST GRL</h1>
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
            setMainTab("stock");
            handleStockSearch();
          }}
          className={cn(
            "px-6 py-2.5 text-sm font-medium transition-all rounded-t-lg",
            mainTab === "stock"
              ? "bg-green-600 text-white shadow-md"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          )}
        >
          Stock of Despatch
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
                  <Weight className="h-8 w-8 opacity-80" />
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
                  <Label className="text-xs">Branch</Label>
                  <Input
                    value={searchBranch}
                    onChange={(e) => setSearchBranch(e.target.value)}
                    placeholder="Enter Branch"
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">From Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-9 w-full text-sm justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(searchFromDate, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-[10000]">
                      <Calendar mode="single" selected={searchFromDate} onSelect={(d) => d && setSearchFromDate(d)} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">To Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-9 w-full text-sm justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(searchToDate, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-[10000]">
                      <Calendar mode="single" selected={searchToDate} onSelect={(d) => d && setSearchToDate(d)} />
                    </PopoverContent>
                  </Popover>
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
                <div className="text-sm text-gray-500">Total: {searchResults.length} records</div>
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
                        <TableHead className="text-xs py-3 px-2 min-w-[100px]">To Station</TableHead>
                        <TableHead className="text-xs py-3 px-2 min-w-[100px]">Vehicle #</TableHead>
                        <TableHead className="text-xs py-3 px-2 min-w-[100px]">Driver</TableHead>
                        <TableHead className="text-xs py-3 px-2 w-[60px] text-center">Pckgs</TableHead>
                        <TableHead className="text-xs py-3 px-2 w-[80px] text-right">Weight</TableHead>
                        <TableHead className="text-xs py-3 px-2 w-32 text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={10} className="text-center py-12">
                            <Loader2 className="h-8 w-8 mx-auto animate-spin text-blue-500" />
                            <p className="text-gray-500 mt-2">Loading manifests...</p>
                          </TableCell>
                        </TableRow>
                      ) : paginatedResults.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={10} className="text-center py-12 text-gray-500">
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
                              {format(new Date(record.manifestDateTime), "dd-MM-yyyy")}
                            </TableCell>
                            <TableCell className="py-3 px-2 text-sm">{record.branch}</TableCell>
                            <TableCell className="py-3 px-2 text-sm">{record.toStation}</TableCell>
                            <TableCell className="py-3 px-2 text-sm">{record.vehicleNo}</TableCell>
                            <TableCell className="py-3 px-2 text-sm">{record.driver}</TableCell>
                            <TableCell className="py-3 px-2 text-center text-sm">{record.dispatchedPckgs}</TableCell>
                            <TableCell className="py-3 px-2 text-right text-sm">{record.dispatchedWt}</TableCell>
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

      {/* Stock of Despatch Tab */}
      {mainTab === "stock" && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Total GRs</p>
                    <p className="text-2xl font-bold">{stockStats.total}</p>
                  </div>
                  <FileText className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Selected Items</p>
                    <p className="text-2xl font-bold">{stockStats.selected}</p>
                  </div>
                  <Check className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Total Packages</p>
                    <p className="text-2xl font-bold">{stockStats.totalPckgs}</p>
                  </div>
                  <Package className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search Filters */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-gray-700">
                <Search className="h-4 w-4" />
                Search Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectAllBranch}
                      onChange={handleSelectAllBranch}
                      className="h-4 w-4 rounded"
                      id="allBranch"
                    />
                    <Label htmlFor="allBranch" className="text-sm cursor-pointer">ALL</Label>
                  </div>
                  <Label className="text-xs">Branch</Label>
                  <Input
                    value={stockBranch}
                    onChange={(e) => setStockBranch(e.target.value)}
                    placeholder="Enter Branch"
                    className="h-9 text-sm"
                    disabled={selectAllBranch}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">As On Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-9 w-full text-sm justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(asOnDate, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-[10000]">
                      <Calendar mode="single" selected={asOnDate} onSelect={(d) => d && setAsOnDate(d)} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectAllDestination}
                      onChange={handleSelectAllDestination}
                      className="h-4 w-4 rounded"
                      id="allDestination"
                    />
                    <Label htmlFor="allDestination" className="text-sm cursor-pointer">ALL</Label>
                  </div>
                  <Label className="text-xs">Destination</Label>
                  <Input
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Enter Destination"
                    className="h-9 text-sm"
                    disabled={selectAllDestination}
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button onClick={handleStockSearch} className="h-9 text-sm bg-blue-600" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Search className="h-4 w-4 mr-1" />}
                    Show Stock
                  </Button>
                  <Button onClick={handleClearStockSearch} variant="outline" className="h-9 text-sm">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stock Table */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-semibold text-gray-800">Stock Items List</h3>
                <div className="text-sm text-gray-500">Total: {stockItems.length} records</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <div className="min-w-[1000px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="w-8 text-center">
                          <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAll}
                            className="h-4 w-4 rounded"
                          />
                        </TableHead>
                        <TableHead className="text-xs py-3 px-2 w-12 text-center">#</TableHead>
                        <TableHead className="text-xs py-3 px-2 min-w-[80px]">GR #</TableHead>
                        <TableHead className="text-xs py-3 px-2 min-w-[80px]">GR Date</TableHead>
                        <TableHead className="text-xs py-3 px-2 min-w-[80px]">Origin</TableHead>
                        <TableHead className="text-xs py-3 px-2 min-w-[100px]">Destination</TableHead>
                        <TableHead className="text-xs py-3 px-2 min-w-[120px]">Consignor</TableHead>
                        <TableHead className="text-xs py-3 px-2 min-w-[120px]">Consignee</TableHead>
                        <TableHead className="text-xs py-3 px-2 w-[60px] text-center">Pckgs</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-12">
                            <Loader2 className="h-8 w-8 mx-auto animate-spin text-blue-500" />
                            <p className="text-gray-500 mt-2">Loading stock items...</p>
                          </TableCell>
                        </TableRow>
                      ) : paginatedStockItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-12 text-gray-500">
                            <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            No stock records found. Click "Show Stock" to search.
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedStockItems.map((item, idx) => (
                          <TableRow key={item.id} className="hover:bg-gray-50">
                            <TableCell className="text-center">
                              <input
                                type="checkbox"
                                checked={item.selected}
                                onChange={() => handleSelectItem(item.id)}
                                className="h-4 w-4 rounded"
                              />
                            </TableCell>
                            <TableCell className="py-3 px-2 text-center text-sm">
                              {(stockCurrentPage - 1) * stockItemsPerPage + idx + 1}
                            </TableCell>
                            <TableCell className="py-3 px-2 font-mono text-sm">{item.grNo}</TableCell>
                            <TableCell className="py-3 px-2 text-sm">
                              {format(new Date(item.grDate), "dd-MM-yyyy")}
                            </TableCell>
                            <TableCell className="py-3 px-2 text-sm">{item.origin}</TableCell>
                            <TableCell className="py-3 px-2 text-sm">{item.destination}</TableCell>
                            <TableCell className="py-3 px-2 text-sm truncate max-w-[150px]">
                              {item.consignor}
                            </TableCell>
                            <TableCell className="py-3 px-2 text-sm truncate max-w-[150px]">
                              {item.consignee}
                            </TableCell>
                            <TableCell className="py-3 px-2 text-center text-sm">{item.stockPckgs}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Pagination for Stock */}
              {totalStockPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">
                    Showing {((stockCurrentPage - 1) * stockItemsPerPage) + 1} to{" "}
                    {Math.min(stockCurrentPage * stockItemsPerPage, stockItems.length)} of {stockItems.length}{" "}
                    entries
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToStockPage(stockCurrentPage - 1)}
                      disabled={stockCurrentPage === 1}
                      className="h-8 text-sm"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                    </Button>
                    <span className="px-3 py-1 text-sm">
                      Page {stockCurrentPage} of {totalStockPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToStockPage(stockCurrentPage + 1)}
                      disabled={stockCurrentPage === totalStockPages}
                      className="h-8 text-sm"
                    >
                      Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Print Button */}
              <div className="flex justify-end mt-4">
                <Button
                  onClick={handlePrintLoadingTally}
                  className="h-9 text-sm bg-green-600 hover:bg-green-700"
                  disabled={stockStats.selected === 0}
                >
                  <Printer className="mr-2 h-4 w-4" />
                  PRINT LOADING TALLY
                </Button>
              </div>
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
                    <p className="text-sm opacity-90">Total Cancelled</p>
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
                  <Label className="text-xs">Branch</Label>
                  <Input
                    value={searchBranch}
                    onChange={(e) => setSearchBranch(e.target.value)}
                    placeholder="Enter Branch"
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">From Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-9 w-full text-sm justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(searchFromDate, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-[10000]">
                      <Calendar mode="single" selected={searchFromDate} onSelect={(d) => d && setSearchFromDate(d)} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">To Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-9 w-full text-sm justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(searchToDate, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-[10000]">
                      <Calendar mode="single" selected={searchToDate} onSelect={(d) => d && setSearchToDate(d)} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex items-end gap-2">
                  <Button onClick={handleCancelSearch} className="h-9 text-sm bg-red-600" disabled={loading}>
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
                <div className="text-sm text-gray-500">Total: {cancelledResults.length} records</div>
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
                        <TableHead className="text-xs py-3 px-2 min-w-[100px]">To Station</TableHead>
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
                              {format(new Date(record.manifestDateTime), "dd-MM-yyyy")}
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
                  Create New Long Route Manifest
                </>
              )}
            </DialogTitle>
            <DialogDescription>Fill in all manifest details below.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
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
                <Label className="text-sm">
                  Manifest Date & Time <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-9 flex-1 text-sm justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(manifestDateTime, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-[10000]">
                      <Calendar
                        mode="single"
                        selected={manifestDateTime}
                        onSelect={(d) => d && setManifestDateTime(d)}
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    type="time"
                    value={manifestTime}
                    onChange={(e) => setManifestTime(e.target.value)}
                    className="h-9 w-28 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-sm">
                  Branch <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="Enter Branch"
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
                  placeholder="Enter To Station"
                  className="h-9 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-sm">
                  Vehicle # <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={vehicleNo}
                  onChange={(e) => setVehicleNo(e.target.value)}
                  placeholder="Enter Vehicle Number"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm">
                  Driver <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={driver}
                  onChange={(e) => setDriver(e.target.value)}
                  placeholder="Enter Driver Name"
                  className="h-9 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-sm">Vehicle Type</Label>
                <Input
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  placeholder="Enter Vehicle Type"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm">Vendor</Label>
                <Input
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  placeholder="Enter Vendor"
                  className="h-9 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-sm">Capacity</Label>
                <Input
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="Enter Capacity"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm">Mobile #</Label>
                <Input
                  value={mobileNo}
                  onChange={(e) => setMobileNo(e.target.value)}
                  placeholder="Enter Mobile Number"
                  className="h-9 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-sm">
                  Loaded By <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={loadedBy}
                  onChange={(e) => setLoadedBy(e.target.value)}
                  placeholder="Enter Loaded By"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm">Delivery Location</Label>
                <Input
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  placeholder="Enter Delivery Location"
                  className="h-9 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-sm">Estimate Arrival</Label>
                <Input
                  value={estimateArrivalAtDestination}
                  onChange={(e) => setEstimateArrivalAtDestination(e.target.value)}
                  placeholder="Enter Estimate Arrival"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm">Consolidated Ewaybill #</Label>
                <Input
                  value={consolidatedEwaybillNo}
                  onChange={(e) => setConsolidatedEwaybillNo(e.target.value)}
                  placeholder="Enter Ewaybill Number"
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