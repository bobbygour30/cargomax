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
  Search,
  Printer,
  FileText,
  Eye,
  X,
  Check,
  Truck,
  Package,
  Clock,
  PlusCircle,
  Trash2,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Plus,
  Loader2,
  FileCheck,
  RefreshCw,
  Building,
  Navigation,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import toast from "react-hot-toast";

// Import API services
import {
  getPendingManifests,  // FIX: Use getPendingManifests instead of getLocalManifests
  createGoodsArrival,
  getGoodsArrivals,
  printGoodsArrival,
  exportGoodsArrivals,
  getBranches,
} from "@/services/api";

// ============================================
// TYPES
// ============================================
interface ArrivedRecord {
  _id: string;
  manifestNo: string;
  serArrivalNo: string;
  receiveDate: Date;
  fromStation: string;
  vehicleNo?: string;
  driverName?: string;
  arrivalTotals: {
    totalPckgs: number;
    totalWeight: number;
  };
  arrivalStatus: string;
}

interface PendingManifest {
  _id: string;
  manifestNo: string;
  manifestDate: Date;
  lhcNo?: string;
  branch: string;
  toStation: string;
  modeName: string;
  modeCategory: string;
  noOfPickups: number;
  grossWeight: number;
  vehicleNo?: string;
  driverName?: string;
  driverMobile?: string;
  loadingPerson?: string;
  status?: string;
  assignedGRs?: AssignedGR[];  // FIX: Include assigned GRs
}

interface AssignedGR {
  id: string;
  grNo: string;
  grDate: Date;
  consignor: string;
  consignee: string;
  destination: string;
  toPay: number;
  paid: number;
  tbb: number;
  bookedPckgs: number;
  stockPckgs: number;
  dispatchedPckgs: number;
  weight: number;
  bookingId: string;
  bookingType: string;
}

interface GRItem {
  grNo: string;
  grDate: Date;
  origin: string;
  destination: string;
  consignor: string;
  consignee: string;
  despPckgs: number;
  despWt: number;
  receivePckgs: number;
  receiveWt: number;
  damagePcs: number;
  short: number;
  excess: number;
  godown: string;
  remarks: string;
}

// ============================================
// OPTIONS
// ============================================
const godownOptions = [
  { value: "U P BORDER A JH UP", label: "U P BORDER A JH UP" },
  { value: "U P BORDER B BR", label: "U P BORDER B BR" },
  { value: "U P BORDER C ASM WB", label: "U P BORDER C ASM WB" },
  { value: "U P BORDER D BR GP", label: "U P BORDER D BR GP" },
];

// ============================================
// MAIN COMPONENT
// ============================================
export default function GoodsArrival() {
  // View State
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [activeTab, setActiveTab] = useState<"pending" | "arrived">("pending");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Data State
  const [arrivedResults, setArrivedResults] = useState<ArrivedRecord[]>([]);
  const [pendingResults, setPendingResults] = useState<PendingManifest[]>([]);
  const [selectedManifest, setSelectedManifest] = useState<PendingManifest | null>(null);
  const [branchOptions, setBranchOptions] = useState<{ value: string; text: string }[]>([]);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const itemsPerPage = 10;
  
  // Filters
  const [filters, setFilters] = useState({
    branch: "ALL",
    fromDate: new Date(),
    toDate: new Date(),
    manifestNo: "",
  });
  
  // Form State
  const [formData, setFormData] = useState({
    branch: "",
    selectGodown: "",
    manifestNo: "",
    despatchOn: new Date(),  // FIX: Add despatchOn field
    despatchTime: "",
    fromStation: "",
    modeType: "",
    modeName: "",
    driver: "",
    mobile: "",
    unloadingPerson: "",
    serArrivalNo: "",
    autoArrival: true,
    receiveDate: new Date(),
    receiveTime: "",
    unloadingHours: 0,
    unloadingMinutes: 0,
    route: "",
    tat: 0,
    scheduleArrivalDateTime: new Date(),
    vehicleArrivalDateTime: new Date(),
    unloadingDateTime: new Date(),
    sealNo: "",
    sealOk: true,
    dharamKantaWeight: 0,
    remarks: "",
    linkedManifestId: ""
  });
  
  // GR Items - Will be populated from assignedGRs
  const [grItems, setGrItems] = useState<GRItem[]>([]);
  
  // Totals
  const [manifestTotals, setManifestTotals] = useState({
    noOfGR: 0,
    totalPckgs: 0,
    totalWeight: 0
  });
  
  const [arrivalTotals, setArrivalTotals] = useState({
    noOfGR: 0,
    totalPckgs: 0,
    totalWeight: 0,
    damagePckgs: 0,
    totalShort: 0,
    totalExcess: 0
  });
  
  // ============================================
  // API CALLS
  // ============================================
  
  const loadBranches = async () => {
    try {
      const response = await getBranches();
      if (response.success && response.data) {
        setBranchOptions(response.data);
      }
    } catch (error) {
      console.error("Error loading branches:", error);
    }
  };
  
  // FIX: Use getPendingManifests instead of getLocalManifests
  const fetchPendingManifests = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        limit: itemsPerPage
      };
      if (filters.branch && filters.branch !== "ALL") params.branch = filters.branch;
      if (filters.manifestNo) params.manifestNo = filters.manifestNo;
      if (filters.fromDate) params.fromDate = format(filters.fromDate, "yyyy-MM-dd");
      if (filters.toDate) params.toDate = format(filters.toDate, "yyyy-MM-dd");
      
      const response = await getPendingManifests(params);
      
      if (response.success) {
        setPendingResults(response.data || []);
        setTotalRecords(response.pagination?.total || 0);
        setTotalPages(response.pagination?.pages || 1);
      }
    } catch (error) {
      console.error("Error fetching pending manifests:", error);
      toast.error("Failed to fetch pending manifests");
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch arrived goods
  const fetchArrivedGoods = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        limit: itemsPerPage
      };
      if (filters.branch && filters.branch !== "ALL") params.branch = filters.branch;
      if (filters.manifestNo) params.manifestNo = filters.manifestNo;
      if (filters.fromDate) params.fromDate = format(filters.fromDate, "yyyy-MM-dd");
      if (filters.toDate) params.toDate = format(filters.toDate, "yyyy-MM-dd");
      
      const response = await getGoodsArrivals(params);
      
      if (response.success) {
        setArrivedResults(response.data || []);
        setTotalRecords(response.pagination?.total || 0);
        setTotalPages(response.pagination?.pages || 1);
      }
    } catch (error) {
      console.error("Error fetching arrived goods:", error);
      toast.error("Failed to fetch arrived goods");
    } finally {
      setLoading(false);
    }
  };
  
  // FIX: Select manifest and open form with proper GR items from assignedGRs
  const handleSelectManifest = (manifest: PendingManifest) => {
    setSelectedManifest(manifest);
    
    // Map assigned GRs to GR items for arrival
    const mappedGRItems: GRItem[] = (manifest.assignedGRs || []).map((gr, idx) => ({
      grNo: gr.grNo,
      grDate: gr.grDate,
      origin: manifest.branch,
      destination: manifest.toStation,
      consignor: gr.consignor,
      consignee: gr.consignee,
      despPckgs: gr.dispatchedPckgs || gr.bookedPckgs || 0,
      despWt: gr.weight || 0,
      receivePckgs: 0,  // To be filled by user
      receiveWt: 0,     // To be filled by user
      damagePcs: 0,
      short: 0,
      excess: 0,
      godown: "",
      remarks: ""
    }));
    
    // If no assigned GRs, create one default row
    if (mappedGRItems.length === 0) {
      mappedGRItems.push({
        grNo: manifest.manifestNo,
        grDate: manifest.manifestDate,
        origin: manifest.branch,
        destination: manifest.toStation,
        consignor: "",
        consignee: "",
        despPckgs: manifest.noOfPickups || 0,
        despWt: manifest.grossWeight || 0,
        receivePckgs: 0,
        receiveWt: 0,
        damagePcs: 0,
        short: 0,
        excess: 0,
        godown: "",
        remarks: ""
      });
    }
    
    setGrItems(mappedGRItems);
    
    setFormData({
      ...formData,
      branch: manifest.branch,
      manifestNo: manifest.manifestNo,
      despatchOn: manifest.manifestDate,  // FIX: Set despatchOn from manifest date
      despatchTime: "",
      fromStation: manifest.toStation,
      modeType: manifest.modeCategory || "SURFACE",
      modeName: manifest.modeName,
      driver: manifest.driverName || "",
      mobile: manifest.driverMobile || "",
      unloadingPerson: "",
      receiveDate: new Date(),
      receiveTime: "",
      linkedManifestId: manifest._id
    });
    
    setViewMode("form");
  };
  
  // Submit goods arrival
  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.branch) {
      toast.error("Please select branch");
      return;
    }
    if (!formData.selectGodown) {
      toast.error("Please select godown");
      return;
    }
    if (!formData.manifestNo) {
      toast.error("Manifest number is required");
      return;
    }
    if (!formData.unloadingPerson) {
      toast.error("Unloading person is required");
      return;
    }
    
    setSubmitting(true);
    try {
      calculateTotals();
      
      const payload = {
        ...formData,
        grItems: grItems.filter(item => item.grNo),
        receiveDate: formData.receiveDate,
        receiveTime: formData.receiveTime,
        despatchOn: formData.despatchOn,  // FIX: Include despatchOn in payload
        scheduleArrivalDateTime: formData.scheduleArrivalDateTime,
        vehicleArrivalDateTime: formData.vehicleArrivalDateTime,
        unloadingDateTime: formData.unloadingDateTime,
        serArrivalNo: formData.autoArrival ? undefined : formData.serArrivalNo,
        arrivalTotals,
        manifestTotals
      };
      
      const response = await createGoodsArrival(payload);
      
      if (response.success) {
        toast.success("Goods arrival recorded successfully!");
        resetForm();
        setViewMode("list");
        fetchPendingManifests();
        fetchArrivedGoods();
      }
    } catch (error: any) {
      console.error("Error saving goods arrival:", error);
      toast.error(error.response?.data?.message || "Failed to save goods arrival");
    } finally {
      setSubmitting(false);
    }
  };
  
  // Print arrival report
  const handlePrintArrival = async (id: string) => {
    try {
      const response = await printGoodsArrival(id);
      if (response.success) {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head><title>Goods Arrival Report</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .header { text-align: center; margin-bottom: 20px; }
                .company { font-size: 18px; font-weight: bold; }
              </style>
              </head>
              <body>
                <div class="header">
                  <div class="company">GOLDEN ROADWAYS & LOGISTICS PVT LTD</div>
                  <div>Goods Arrival Report</div>
                  <div>Date: ${new Date().toLocaleDateString()}</div>
                </div>
                <pre>${JSON.stringify(response.data, null, 2)}</pre>
                <script>window.print();</script>
              </body>
            </html>
          `);
          printWindow.document.close();
        }
      }
    } catch (error) {
      toast.error("Failed to generate print report");
    }
  };
  
  // Export to Excel
  const handleExportToExcel = async () => {
    try {
      const params: any = {};
      if (filters.branch && filters.branch !== "ALL") params.branch = filters.branch;
      if (filters.fromDate) params.fromDate = format(filters.fromDate, "yyyy-MM-dd");
      if (filters.toDate) params.toDate = format(filters.toDate, "yyyy-MM-dd");
      
      const response = await exportGoodsArrivals(params);
      
      if (response.success && response.data) {
        const csvRows = [];
        const headers = Object.keys(response.data[0] || {});
        csvRows.push(headers.join(','));
        for (const row of response.data) {
          const values = headers.map(header => {
            const value = row[header];
            if (typeof value === 'string' && value.includes(',')) return `"${value}"`;
            return value || '';
          });
          csvRows.push(values.join(','));
        }
        
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `goods-arrival-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        toast.success("Export completed successfully");
      }
    } catch (error) {
      toast.error("Failed to export data");
    }
  };
  
  // ============================================
  // HANDLERS
  // ============================================
  const calculateTotals = () => {
    const manifestTotal = {
      noOfGR: grItems.length,
      totalPckgs: grItems.reduce((sum, item) => sum + (item.despPckgs || 0), 0),
      totalWeight: grItems.reduce((sum, item) => sum + (item.despWt || 0), 0)
    };
    setManifestTotals(manifestTotal);
    
    const arrivalTotal = {
      noOfGR: grItems.length,
      totalPckgs: grItems.reduce((sum, item) => sum + (item.receivePckgs || 0), 0),
      totalWeight: grItems.reduce((sum, item) => sum + (item.receiveWt || 0), 0),
      damagePckgs: grItems.reduce((sum, item) => sum + (item.damagePcs || 0), 0),
      totalShort: grItems.reduce((sum, item) => sum + (item.short || 0), 0),
      totalExcess: grItems.reduce((sum, item) => sum + (item.excess || 0), 0)
    };
    setArrivalTotals(arrivalTotal);
  };
  
  const addGRItem = () => {
    setGrItems([...grItems, {
      grNo: "", grDate: new Date(), origin: "", destination: "", consignor: "", consignee: "",
      despPckgs: 0, despWt: 0, receivePckgs: 0, receiveWt: 0, damagePcs: 0,
      short: 0, excess: 0, godown: "", remarks: ""
    }]);
  };
  
  const updateGRItem = (index: number, field: keyof GRItem, value: any) => {
    const updated = [...grItems];
    updated[index] = { ...updated[index], [field]: value };
    setGrItems(updated);
    calculateTotals();
  };
  
  const removeGRItem = (index: number) => {
    if (grItems.length > 1) {
      setGrItems(grItems.filter((_, i) => i !== index));
      calculateTotals();
    }
  };
  
  const resetForm = () => {
    setFormData({
      branch: "", selectGodown: "", manifestNo: "", despatchOn: new Date(), despatchTime: "",
      fromStation: "", modeType: "", modeName: "", driver: "", mobile: "", unloadingPerson: "",
      serArrivalNo: "", autoArrival: true, receiveDate: new Date(), receiveTime: "",
      unloadingHours: 0, unloadingMinutes: 0, route: "", tat: 0, scheduleArrivalDateTime: new Date(),
      vehicleArrivalDateTime: new Date(), unloadingDateTime: new Date(), sealNo: "", sealOk: true,
      dharamKantaWeight: 0, remarks: "", linkedManifestId: ""
    });
    setGrItems([]);
    setSelectedManifest(null);
  };
  
  const handleSearch = () => {
    setCurrentPage(1);
    if (activeTab === "pending") fetchPendingManifests();
    else fetchArrivedGoods();
  };
  
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };
  
  // Helper to render godown options
  const renderGodownOptions = () => {
    return godownOptions.map((opt) => (
      <SelectItem key={opt.value} value={opt.value}>
        {opt.label}
      </SelectItem>
    ));
  };
  
  // ============================================
  // EFFECTS
  // ============================================
  useEffect(() => {
    loadBranches();
  }, []);
  
  useEffect(() => {
    if (activeTab === "pending") fetchPendingManifests();
    else fetchArrivedGoods();
  }, [activeTab, currentPage]);
  
  // ============================================
  // RENDER FUNCTIONS
  // ============================================
  
  // RENDER - PENDING MANIFESTS TABLE
  const renderPendingManifests = () => (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Clock className="h-4 w-4 text-yellow-600" />
            Pending Arrivals - Dispatched Manifests
          </CardTitle>
          <Button onClick={handleExportToExcel} variant="outline" size="sm" className="h-8 text-xs">
            <FileSpreadsheet className="mr-1 h-3 w-3" /> Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="space-y-1">
            <Label className="text-[10px] font-medium">Branch</Label>
            <Select value={filters.branch} onValueChange={(v) => setFilters({...filters, branch: v})}>
              <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="ALL" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">ALL</SelectItem>
                {branchOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.text}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] font-medium">Manifest #</Label>
            <Input value={filters.manifestNo} onChange={(e) => setFilters({...filters, manifestNo: e.target.value})} placeholder="Enter Manifest #" className="h-8 text-xs" />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] font-medium">From Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(filters.fromDate, "dd-MM-yyyy")}</Button>
              </PopoverTrigger>
              <PopoverContent><Calendar mode="single" selected={filters.fromDate} onSelect={(d) => d && setFilters({...filters, fromDate: d})} /></PopoverContent>
            </Popover>
          </div>
          <div className="flex items-end gap-2">
            <Button onClick={handleSearch} size="sm" className="h-8 text-xs bg-yellow-600 hover:bg-yellow-700">
              <Search className="mr-1 h-3 w-3" /> Search
            </Button>
            <Button onClick={() => { setFilters({branch: "ALL", fromDate: new Date(), toDate: new Date(), manifestNo: ""}); fetchPendingManifests(); }} variant="outline" size="sm" className="h-8 text-xs">
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {/* Table */}
        <div className="rounded-md border overflow-x-auto">
          <div className="min-w-[1000px]">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-xs font-semibold text-center w-12">S#</TableHead>
                  <TableHead className="text-xs font-semibold">Manifest #</TableHead>
                  <TableHead className="text-xs font-semibold">Date</TableHead>
                  <TableHead className="text-xs font-semibold">LHC#</TableHead>
                  <TableHead className="text-xs font-semibold">Branch</TableHead>
                  <TableHead className="text-xs font-semibold">To Station</TableHead>
                  <TableHead className="text-xs font-semibold">Mode</TableHead>
                  <TableHead className="text-xs font-semibold text-center">Pickups</TableHead>
                  <TableHead className="text-xs font-semibold text-center">Gross Wt.</TableHead>
                  <TableHead className="text-xs font-semibold text-center w-24">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={10} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
                ) : pendingResults.length === 0 ? (
                  <TableRow><TableCell colSpan={10} className="text-center py-8 text-gray-500">No pending manifests found</TableCell></TableRow>
                ) : (
                  pendingResults.map((record, idx) => (
                    <TableRow key={record._id} className="hover:bg-gray-50">
                      <TableCell className="text-center text-xs">{((currentPage - 1) * itemsPerPage) + idx + 1}</TableCell>
                      <TableCell className="font-mono text-xs font-medium">{record.manifestNo}</TableCell>
                      <TableCell className="text-xs">{format(new Date(record.manifestDate), "dd-MM-yyyy")}</TableCell>
                      <TableCell className="text-xs">{record.lhcNo || "-"}</TableCell>
                      <TableCell className="text-xs">{record.branch}</TableCell>
                      <TableCell className="text-xs">{record.toStation}</TableCell>
                      <TableCell className="text-xs">{record.modeName}</TableCell>
                      <TableCell className="text-center text-xs">{record.noOfPickups}</TableCell>
                      <TableCell className="text-center text-xs">{record.grossWeight?.toFixed(3)}</TableCell>
                      <TableCell className="text-center">
                        <Button onClick={() => handleSelectManifest(record)} size="sm" className="h-7 text-xs bg-green-600 hover:bg-green-700">
                          Select
                        </Button>
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
            <div className="text-xs text-gray-500">Total {totalRecords} records</div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="h-7 text-xs">
                <ChevronLeft className="h-3 w-3 mr-1" /> Previous
              </Button>
              <span className="px-3 py-1 text-xs">Page {currentPage} of {totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="h-7 text-xs">
                Next <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
  
  // RENDER - ARRIVED GOODS TABLE
  const renderArrivedGoods = () => (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-green-600" />
            Arrived Goods List
          </CardTitle>
          <Button onClick={handleExportToExcel} variant="outline" size="sm" className="h-8 text-xs">
            <FileSpreadsheet className="mr-1 h-3 w-3" /> Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="space-y-1">
            <Label className="text-[10px] font-medium">Branch</Label>
            <Select value={filters.branch} onValueChange={(v) => setFilters({...filters, branch: v})}>
              <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="ALL" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">ALL</SelectItem>
                {branchOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.text}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] font-medium">Manifest #</Label>
            <Input value={filters.manifestNo} onChange={(e) => setFilters({...filters, manifestNo: e.target.value})} placeholder="Enter Manifest #" className="h-8 text-xs" />
          </div>
          <div className="flex items-end gap-2">
            <Button onClick={handleSearch} size="sm" className="h-8 text-xs bg-green-600 hover:bg-green-700">
              <Search className="mr-1 h-3 w-3" /> Search
            </Button>
          </div>
        </div>
        
        {/* Table */}
        <div className="rounded-md border overflow-x-auto">
          <div className="min-w-[1000px]">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-xs font-semibold text-center w-12">#</TableHead>
                  <TableHead className="text-xs font-semibold">Manifest #</TableHead>
                  <TableHead className="text-xs font-semibold">Arrival #</TableHead>
                  <TableHead className="text-xs font-semibold">Arrival Date</TableHead>
                  <TableHead className="text-xs font-semibold">From Station</TableHead>
                  <TableHead className="text-xs font-semibold text-center">Packages</TableHead>
                  <TableHead className="text-xs font-semibold text-center">Weight</TableHead>
                  <TableHead className="text-xs font-semibold text-center">Status</TableHead>
                  <TableHead className="text-xs font-semibold text-center w-24">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={9} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
                ) : arrivedResults.length === 0 ? (
                  <TableRow><TableCell colSpan={9} className="text-center py-8 text-gray-500">No arrived records found</TableCell></TableRow>
                ) : (
                  arrivedResults.map((record, idx) => (
                    <TableRow key={record._id} className="hover:bg-gray-50">
                      <TableCell className="text-center text-xs">{((currentPage - 1) * itemsPerPage) + idx + 1}</TableCell>
                      <TableCell className="font-mono text-xs font-medium">{record.manifestNo}</TableCell>
                      <TableCell className="text-xs">{record.serArrivalNo}</TableCell>
                      <TableCell className="text-xs">{format(new Date(record.receiveDate), "dd-MM-yyyy")}</TableCell>
                      <TableCell className="text-xs">{record.fromStation}</TableCell>
                      <TableCell className="text-center text-xs">{record.arrivalTotals?.totalPckgs || 0}</TableCell>
                      <TableCell className="text-center text-xs">{record.arrivalTotals?.totalWeight?.toFixed(2) || "0.00"}</TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-green-100 text-green-700 text-[10px]">{record.arrivalStatus}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button onClick={() => handlePrintArrival(record._id)} variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <Printer className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-xs text-gray-500">Total {totalRecords} records</div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="h-7 text-xs">
                <ChevronLeft className="h-3 w-3 mr-1" /> Previous
              </Button>
              <span className="px-3 py-1 text-xs">Page {currentPage} of {totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="h-7 text-xs">
                Next <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
  
  // RENDER - FORM VIEW
  const renderFormView = () => (
    <div className="max-w-5xl mx-auto">
      <Card>
        <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-600" />
              Goods Arrival - {selectedManifest?.manifestNo || "New Entry"}
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => { setViewMode("list"); resetForm(); }} className="h-8">
              <X className="mr-1 h-3 w-3" /> Cancel
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-5">
            {/* Basic Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Building className="h-4 w-4" /> Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Branch *</Label>
                  <Select value={formData.branch} onValueChange={(v) => setFormData({...formData, branch: v})}>
                    <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select Branch" /></SelectTrigger>
                    <SelectContent>
                      {branchOptions.map(opt => (<SelectItem key={opt.value} value={opt.value}>{opt.text}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Select Godown *</Label>
                  <Select value={formData.selectGodown} onValueChange={(v) => setFormData({...formData, selectGodown: v})}>
                    <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select Godown" /></SelectTrigger>
                    <SelectContent>{renderGodownOptions()}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Manifest # *</Label>
                  <Input value={formData.manifestNo} readOnly className="h-8 text-sm bg-gray-100" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Receive Date *</Label>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="h-8 flex-1 text-sm">
                          <CalendarIcon className="mr-1 h-3 w-3" />
                          {format(formData.receiveDate, "dd-MM-yyyy")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Calendar mode="single" selected={formData.receiveDate} onSelect={(d) => d && setFormData({...formData, receiveDate: d})} />
                      </PopoverContent>
                    </Popover>
                    <Input type="time" value={formData.receiveTime} onChange={(e) => setFormData({...formData, receiveTime: e.target.value})} className="h-8 w-28 text-sm" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Transport Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Navigation className="h-4 w-4" /> Transport Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1"><Label className="text-xs font-medium">From Station</Label><Input value={formData.fromStation} readOnly className="h-8 text-sm bg-gray-100" /></div>
                <div className="space-y-1"><Label className="text-xs font-medium">Mode Name</Label><Input value={formData.modeName} readOnly className="h-8 text-sm bg-gray-100" /></div>
                <div className="space-y-1"><Label className="text-xs font-medium">Driver</Label><Input value={formData.driver} readOnly className="h-8 text-sm bg-gray-100" /></div>
                <div className="space-y-1"><Label className="text-xs font-medium">Unloading Person *</Label><Input value={formData.unloadingPerson} onChange={(e) => setFormData({...formData, unloadingPerson: e.target.value})} className="h-8 text-sm" /></div>
              </div>
            </div>
            
            {/* GR Items Table */}
            <div className="rounded-md border">
              <div className="bg-gray-50 px-3 py-2 border-b flex justify-between items-center">
                <h3 className="text-sm font-semibold flex items-center gap-2"><Package className="h-4 w-4" /> GR Details</h3>
                <Button onClick={addGRItem} variant="ghost" size="sm" className="h-7 text-xs text-blue-600">
                  <PlusCircle className="mr-1 h-3 w-3" /> Add GR
                </Button>
              </div>
              <div className="overflow-x-auto p-3">
                <div className="min-w-[1000px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="text-xs">GR #</TableHead>
                        <TableHead className="text-xs">Origin</TableHead>
                        <TableHead className="text-xs">Destination</TableHead>
                        <TableHead className="text-xs text-center">Desp Pckgs</TableHead>
                        <TableHead className="text-xs text-center">Desp Wt</TableHead>
                        <TableHead className="text-xs text-center">Rec Pckgs</TableHead>
                        <TableHead className="text-xs text-center">Rec Wt</TableHead>
                        <TableHead className="text-xs text-center">Damage</TableHead>
                        <TableHead className="text-xs text-center">Short</TableHead>
                        <TableHead className="text-xs text-center">Excess</TableHead>
                        <TableHead className="text-xs">Godown</TableHead>
                        <TableHead className="w-8"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {grItems.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell><Input value={item.grNo} onChange={(e) => updateGRItem(idx, "grNo", e.target.value)} className="h-7 w-28 text-xs" /></TableCell>
                          <TableCell><Input value={item.origin} onChange={(e) => updateGRItem(idx, "origin", e.target.value)} className="h-7 w-28 text-xs" /></TableCell>
                          <TableCell><Input value={item.destination} onChange={(e) => updateGRItem(idx, "destination", e.target.value)} className="h-7 w-28 text-xs" /></TableCell>
                          <TableCell><Input type="number" value={item.despPckgs} onChange={(e) => updateGRItem(idx, "despPckgs", Number(e.target.value))} className="h-7 w-20 text-xs text-right" /></TableCell>
                          <TableCell><Input type="number" value={item.despWt} onChange={(e) => updateGRItem(idx, "despWt", Number(e.target.value))} className="h-7 w-20 text-xs text-right" /></TableCell>
                          <TableCell><Input type="number" value={item.receivePckgs} onChange={(e) => updateGRItem(idx, "receivePckgs", Number(e.target.value))} className="h-7 w-20 text-xs text-right" /></TableCell>
                          <TableCell><Input type="number" value={item.receiveWt} onChange={(e) => updateGRItem(idx, "receiveWt", Number(e.target.value))} className="h-7 w-20 text-xs text-right" /></TableCell>
                          <TableCell><Input type="number" value={item.damagePcs} onChange={(e) => updateGRItem(idx, "damagePcs", Number(e.target.value))} className="h-7 w-20 text-xs text-right" /></TableCell>
                          <TableCell><Input type="number" value={item.short} onChange={(e) => updateGRItem(idx, "short", Number(e.target.value))} className="h-7 w-20 text-xs text-right" /></TableCell>
                          <TableCell><Input type="number" value={item.excess} onChange={(e) => updateGRItem(idx, "excess", Number(e.target.value))} className="h-7 w-20 text-xs text-right" /></TableCell>
                          <TableCell>
                            <Select value={item.godown} onValueChange={(v) => updateGRItem(idx, "godown", v)}>
                              <SelectTrigger className="h-7 w-28 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                              <SelectContent>{renderGodownOptions()}</SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => removeGRItem(idx)} className="h-6 w-6 p-0 text-red-500">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
            
            {/* Totals Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="border rounded-lg p-3 bg-blue-50">
                <h4 className="text-sm font-semibold mb-2">As Per Manifest</h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <span>GR: {manifestTotals.noOfGR}</span>
                  <span>Pckgs: {manifestTotals.totalPckgs}</span>
                  <span>Wt: {manifestTotals.totalWeight.toFixed(2)} kg</span>
                </div>
              </div>
              <div className="border rounded-lg p-3 bg-green-50">
                <h4 className="text-sm font-semibold mb-2">As Per Arrival</h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <span>GR: {arrivalTotals.noOfGR}</span>
                  <span>Pckgs: {arrivalTotals.totalPckgs}</span>
                  <span>Wt: {arrivalTotals.totalWeight.toFixed(2)} kg</span>
                  {arrivalTotals.damagePckgs > 0 && <span className="text-red-600">Damage: {arrivalTotals.damagePckgs}</span>}
                </div>
              </div>
            </div>
            
            {/* Remarks */}
            <div className="space-y-1">
              <Label className="text-sm font-medium">Remarks</Label>
              <Textarea value={formData.remarks} onChange={(e) => setFormData({...formData, remarks: e.target.value})} rows={2} className="text-sm" placeholder="Additional remarks..." />
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-3 border-t">
              <Button variant="outline" onClick={() => { setViewMode("list"); resetForm(); }} className="h-8">
                <X className="mr-1 h-3 w-3" /> Cancel
              </Button>
              <Button variant="outline" onClick={resetForm} className="h-8">
                <RefreshCw className="mr-1 h-3 w-3" /> Clear
              </Button>
              <Button onClick={handleSubmit} disabled={submitting} className="h-8 bg-green-600 hover:bg-green-700">
                {submitting ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Save className="mr-1 h-3 w-3" />}
                {submitting ? "Saving..." : "Save Arrival"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <div className="space-y-4 p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-wrap justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <Truck className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-800">GOODS ARRIVAL</h1>
            </div>
            <div className="mt-1 flex flex-wrap gap-4 text-xs text-gray-500">
              <span>Company: GOLDEN ROADWAYS &amp; LOGISTICS PVT LTD</span>
              <span>Branch: CORPORATE OFFICE</span>
              <span>Financial Year: 2026-2027</span>
            </div>
          </div>
          {viewMode === "list" && (
            <Button onClick={() => setViewMode("form")} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> New Goods Arrival
            </Button>
          )}
        </div>
      </div>
      
      {/* View Toggle */}
      {viewMode === "list" && (
        <div className="flex border-b bg-white rounded-t-lg">
          <button 
            onClick={() => { setActiveTab("pending"); setCurrentPage(1); }} 
            className={cn("px-6 py-2.5 text-sm font-medium rounded-t-lg", 
              activeTab === "pending" ? "bg-yellow-600 text-white" : "text-gray-600 hover:bg-gray-100"
            )}
          >
            Pending Arrival
          </button>
          <button 
            onClick={() => { setActiveTab("arrived"); setCurrentPage(1); }} 
            className={cn("px-6 py-2.5 text-sm font-medium rounded-t-lg", 
              activeTab === "arrived" ? "bg-green-600 text-white" : "text-gray-600 hover:bg-gray-100"
            )}
          >
            Arrived
          </button>
        </div>
      )}
      
      {/* Content */}
      {viewMode === "list" 
        ? (activeTab === "pending" ? renderPendingManifests() : renderArrivedGoods()) 
        : renderFormView()
      }
    </div>
  );
}