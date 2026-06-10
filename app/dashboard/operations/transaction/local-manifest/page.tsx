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
  CheckCircle,
  FileSpreadsheet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import toast from "react-hot-toast";

// Import API services
import {
  getLocalManifests,
  createLocalManifest,
  updateLocalManifest,
  updateLocalManifestDestination,
  updateLocalManifestDispatch,
  getLocalManifestStockItems,
  cancelLocalManifest,
  restoreLocalManifest,
  deleteLocalManifest,
  getLocalManifestStats,
  getDrivers,
  getVendors,
  getLoadingPersons,
  getBranches,
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
  assignedGRs?: AssignedGR[];
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
  bookingType: "computerized" | "manual";
  bookingId: string;
}

interface StockItemResponse {
  id?: string | number;
  _id?: string;
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
  bookingType?: "computerized" | "manual";
  bookingId?: string;
}

interface Branch {
  value: string;
  text: string;
}

// Destination options
const destinationOptions = [
  { value: "U P BORDER A JH UP", label: "U P BORDER A JH UP" },
  { value: "U P BORDER B BR", label: "U P BORDER B BR" },
  { value: "U P BORDER C ASM WB", label: "U P BORDER C ASM WB" },
  { value: "U P BORDER D BR GP", label: "U P BORDER D BR GP" },
];

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentManifest, setCurrentManifest] = useState<ManifestRecord | null>(null);

  // Current user data
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedBranchText, setSelectedBranchText] = useState<string>("");

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
  const [assignedGRs, setAssignedGRs] = useState<AssignedGR[]>([]);

  // Static data from API
  const [driverOptions, setDriverOptions] = useState<string[]>([]);
  const [vendorOptions, setVendorOptions] = useState<string[]>([]);
  const [loadingPersonOptions, setLoadingPersonOptions] = useState<string[]>([]);
  const [branchOptions, setBranchOptions] = useState<Branch[]>([]);
  const [staticDataLoaded, setStaticDataLoaded] = useState(false);

  // Search state
  const [searchBranch, setSearchBranch] = useState<string>("");
  const [searchManifestNo, setSearchManifestNo] = useState<string>("");
  const [searchModeName, setSearchModeName] = useState<string>("");
  const [searchDriverName, setSearchDriverName] = useState<string>("");
  const [searchVehicleVendor, setSearchVehicleVendor] = useState<string>("");
  const [searchVendorCDNo, setSearchVendorCDNo] = useState<string>("");
  const [searchRemarks, setSearchRemarks] = useState<string>("");

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

  // Helper function to get branch display text
  const getBranchDisplayText = (branchValue: string) => {
    const found = branchOptions.find(b => b.value === branchValue);
    return found ? found.text : branchValue;
  };

  // Load current user first
  useEffect(() => {
    loadCurrentUser();
  }, []);

  // Load static data
  useEffect(() => {
    loadStaticData();
  }, []);

  // Load manifests after static data is loaded
  useEffect(() => {
    if (staticDataLoaded) {
      loadManifests();
      loadStats();
    }
  }, [staticDataLoaded]);

  // Branch auto-selection with value and text matching
  useEffect(() => {
    if (selectedBranch && branchOptions.length > 0) {
      let matchedBranch = branchOptions.find((b) => b.value === selectedBranch);
      
      if (!matchedBranch) {
        matchedBranch = branchOptions.find(
          (b) =>
            b.text?.toLowerCase().trim() ===
            selectedBranch?.toLowerCase().trim()
        );
      }
      
      if (matchedBranch) {
        setBranch(matchedBranch.value);
        setSelectedBranchText(matchedBranch.text);
        console.log("Branch auto-selected:", matchedBranch.value, matchedBranch.text);
      } else {
        if (branchOptions.length > 0) {
          setBranch(branchOptions[0].value);
          console.log("Fallback to first branch:", branchOptions[0].value);
        }
      }
    }
  }, [selectedBranch, branchOptions]);

  const loadCurrentUser = () => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      const selectedBranchStr = localStorage.getItem('selectedBranch');
      const branchCode = localStorage.getItem('branchCode');
      
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setCurrentUser(user);
        } catch (e) {
          console.error('Error parsing user:', e);
        }
      }
      
      if (selectedBranchStr) {
        setSelectedBranch(selectedBranchStr);
        setSelectedBranchText(selectedBranchStr);
      } else if (branchCode) {
        setSelectedBranch(branchCode);
        setSelectedBranchText(branchCode);
      }
    }
  };

  const loadStaticData = async () => {
    try {
      console.log("Loading static data...");
      const [driversRes, vendorsRes, personsRes, branchesRes] = await Promise.all([
        getDrivers(),
        getVendors(),
        getLoadingPersons(),
        getBranches(),
      ]);
      setDriverOptions(driversRes.data || []);
      setVendorOptions(vendorsRes.data || []);
      setLoadingPersonOptions(personsRes.data || []);
      setBranchOptions(branchesRes.data || []);
      console.log("Branch options loaded:", branchesRes.data);
      setStaticDataLoaded(true);
    } catch (error) {
      console.error("Error loading static data:", error);
      toast.error("Failed to load static data");
      setStaticDataLoaded(true);
    }
  };

  const loadManifests = async () => {
    setLoading(true);
    try {
      const response = await getLocalManifests({ status: "active", limit: 100 });
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
      const response = await getLocalManifests({ status: "cancelled", limit: 100 });
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
      const response = await getLocalManifestStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const loadStockItems = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (stockBranch && !selectAllBranch && stockBranch !== 'ALL') filters.branch = stockBranch;
      if (destination && !selectAllDestination && destination !== 'ALL') filters.destination = destination;
      if (asOnDate) filters.asOnDate = asOnDate.toISOString();

      console.log("Loading stock items with filters:", filters);
      const response = await getLocalManifestStockItems(filters);
      console.log("Stock items response:", response);
      
      const items: StockItem[] = response.data.map((item: StockItemResponse, index: number): StockItem => {
        const bookingIdValue = String(item.bookingId || item.id || item._id || index);
        
        return {
          id: index + 1,
          grNo: item.grNo,
          grDate: item.grDate,
          origin: item.origin,
          destination: item.destination,
          consignor: item.consignor,
          consignee: item.consignee,
          toPay: item.toPay,
          paid: item.paid,
          tbb: item.tbb,
          stockPckgs: item.stockPckgs,
          selected: false,
          bookingType: item.bookingType || "computerized",
          bookingId: bookingIdValue,
        };
      });
      
      console.log("Mapped stock items with bookingId:", items.map(i => ({ grNo: i.grNo, bookingId: i.bookingId })));
      
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
      toast.error("Please select Branch");
      return;
    }
    if (!toStation) {
      toast.error("Please select To Station");
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
      vehicleNo: modeName,
      autoManifest,
    };

    if (!autoManifest && manifestNo) {
      manifestData.manifestNo = manifestNo;
    }

    try {
      let response;
      if (editMode && currentEditId) {
        response = await updateLocalManifest(currentEditId, manifestData);
        toast.success("Manifest updated successfully!");
      } else {
        response = await createLocalManifest(manifestData);
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
      if (searchBranch && searchBranch !== "all") filters.branch = searchBranch;
      if (searchManifestNo) filters.manifestNo = searchManifestNo;
      if (searchModeName) filters.modeName = searchModeName;
      if (searchDriverName) filters.driverName = searchDriverName;
      if (searchVehicleVendor) filters.vehicleVendor = searchVehicleVendor;
      if (searchVendorCDNo) filters.vendorCDNo = searchVendorCDNo;
      if (searchRemarks) filters.remarks = searchRemarks;

      const response = await getLocalManifests(filters);
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
      if (searchBranch && searchBranch !== "all") filters.branch = searchBranch;

      const response = await getLocalManifests(filters);
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
    setSearchManifestNo("");
    setSearchModeName("");
    setSearchDriverName("");
    setSearchVehicleVendor("");
    setSearchVendorCDNo("");
    setSearchRemarks("");
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

  const handleEdit = async (record: ManifestRecord) => {
    setCurrentManifest(record);
    setCurrentEditId(record._id!);
    setAssignedGRs(record.assignedGRs || []);
    setIsEditModalOpen(true);
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
            <p><strong>Branch:</strong> ${getBranchDisplayText(record.branch)}</p>
            <p><strong>To Station:</strong> ${record.toStation}</p>
            <p><strong>Driver:</strong> ${record.driverName}</p>
            <p><strong>Vehicle:</strong> ${record.vehicleNo || "N/A"}</p>
            <p><strong>Total Packages:</strong> ${record.noOfPckgs}</p>
            <p><strong>Gross Weight:</strong> ${record.grossWeight} kg</p>
            <hr />
            <h3>Assigned GRs</h3>
            <table border="1" cellpadding="5" cellspacing="0" style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr>
                  <th>GR #</th>
                  <th>Date</th>
                  <th>Consignor</th>
                  <th>Consignee</th>
                  <th>Destination</th>
                  <th>Packages</th>
                  <th>Weight</th>
                </tr>
              </thead>
              <tbody>
                ${(record.assignedGRs || []).map(gr => `
                  <tr>
                    <td>${gr.grNo}</td>
                    <td>${format(new Date(gr.grDate), "dd-MM-yyyy")}</td>
                    <td>${gr.consignor}</td>
                    <td>${gr.consignee}</td>
                    <td>${gr.destination}</td>
                    <td>${gr.dispatchedPckgs}</td>
                    <td>${gr.weight}</td>
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

  const handleExportToExcel = () => {
    toast.success("Export to Excel feature coming soon");
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
        await updateLocalManifestDestination(selectedManifest._id!, {
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
        await cancelLocalManifest(cancellingManifest._id!, cancelledReason);
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
        await restoreLocalManifest(record._id!);
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
        await deleteLocalManifest(id);
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

  const handleAssignGRs = async () => {
    const selectedItems = stockItems.filter(item => item.selected);
    if (selectedItems.length === 0) {
      toast.error("Please select at least one GR to assign");
      return;
    }

    console.log("Selected items:", selectedItems.map(i => ({ grNo: i.grNo, bookingId: i.bookingId })));

    setLoading(true);
    try {
      const totalPckgs = selectedItems.reduce((sum, item) => sum + item.stockPckgs, 0);
      const totalWeight = selectedItems.reduce((sum, item) => sum + (item.stockPckgs * 100), 0);

      const newAssignedGRs: AssignedGR[] = selectedItems.map(item => {
        const bookingIdValue = String(item.bookingId || item.id);
        console.log(`Creating assigned GR for ${item.grNo} with bookingId: ${bookingIdValue}`);
        
        return {
          id: bookingIdValue,
          grNo: item.grNo,
          grDate: item.grDate,
          consignor: item.consignor,
          consignee: item.consignee,
          destination: item.destination,
          toPay: parseFloat(item.toPay) || 0,
          paid: parseFloat(item.paid) || 0,
          tbb: parseFloat(item.tbb) || 0,
          bookedPckgs: item.stockPckgs,
          stockPckgs: item.stockPckgs,
          dispatchedPckgs: item.stockPckgs,
          weight: item.stockPckgs * 100,
          bookingId: bookingIdValue,
          bookingType: item.bookingType
        };
      });

      console.log("New assigned GRs being sent:", JSON.stringify(newAssignedGRs, null, 2));

      const updatedAssignedGRs = [...assignedGRs, ...newAssignedGRs];
      setAssignedGRs(updatedAssignedGRs);

      await updateLocalManifestDispatch(currentEditId!, totalPckgs, totalWeight, updatedAssignedGRs);

      toast.success(`${selectedItems.length} GR(s) assigned successfully!`);
      
      const remainingItems = stockItems.filter(item => !item.selected);
      setStockItems(remainingItems);
      setStockStats({
        total: remainingItems.length,
        selected: 0,
        totalPckgs: remainingItems.reduce((sum, i) => sum + i.stockPckgs, 0),
      });
      setSelectAll(false);
    } catch (error: any) {
      console.error("Assign GRs error:", error);
      console.error("Error response:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to assign GRs");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAssignedGR = (index: number) => {
    const updated = [...assignedGRs];
    updated.splice(index, 1);
    setAssignedGRs(updated);
    toast.success("GR removed from manifest");
  };

  const handleSaveManifestWithGRs = async () => {
    setLoading(true);
    try {
      const totalPckgs = assignedGRs.reduce((sum, gr) => sum + gr.dispatchedPckgs, 0);
      const totalWeight = assignedGRs.reduce((sum, gr) => sum + gr.weight, 0);

      await updateLocalManifestDispatch(currentEditId!, totalPckgs, totalWeight, assignedGRs);
      
      toast.success("Manifest updated successfully!");
      setIsEditModalOpen(false);
      await loadManifests();
      await loadCancelledManifests();
      await loadStats();
    } catch (error: any) {
      console.error("Save manifest error:", error);
      toast.error(error.response?.data?.message || "Failed to save manifest");
    } finally {
      setLoading(false);
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
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                LOCAL MANIFEST
              </h1>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Company: GOLDEN ROADWAYS & LOGISTICS PVT LTD
            </div>
            <div className="text-xs text-gray-500">
              Login Branch: {getBranchDisplayText(selectedBranch) || "Not selected"}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
                  <Select value={searchBranch} onValueChange={setSearchBranch}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="All Branches" />
                    </SelectTrigger>
                    <SelectContent className="z-[99999]">
                      <SelectItem value="all">All Branches</SelectItem>
                      {branchOptions.map((branch) => (
                        <SelectItem key={branch.value} value={branch.value}>
                          {branch.text}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Manifest #</Label>
                  <Input
                    value={searchManifestNo}
                    onChange={(e) => setSearchManifestNo(e.target.value)}
                    placeholder="Enter Manifest #"
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Mode Name</Label>
                  <Input
                    value={searchModeName}
                    onChange={(e) => setSearchModeName(e.target.value)}
                    placeholder="Enter Mode Name"
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Driver Name</Label>
                  <Input
                    value={searchDriverName}
                    onChange={(e) => setSearchDriverName(e.target.value)}
                    placeholder="Enter Driver Name"
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Vehicle Vendor</Label>
                  <Input
                    value={searchVehicleVendor}
                    onChange={(e) => setSearchVehicleVendor(e.target.value)}
                    placeholder="Enter Vehicle Vendor"
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Vendor CD #</Label>
                  <Input
                    value={searchVendorCDNo}
                    onChange={(e) => setSearchVendorCDNo(e.target.value)}
                    placeholder="Enter Vendor CD #"
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Remarks</Label>
                  <Input
                    value={searchRemarks}
                    onChange={(e) => setSearchRemarks(e.target.value)}
                    placeholder="Enter Remarks"
                    className="h-9 text-sm"
                  />
                </div>
                <div className="flex items-end gap-2 col-span-full">
                  <Button onClick={handleSearch} className="h-9 text-sm bg-blue-600" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Search className="h-4 w-4 mr-1" />}
                    Search
                  </Button>
                  <Button onClick={handleClearSearch} variant="outline" className="h-9 text-sm">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button onClick={handleExportToExcel} variant="outline" className="h-9 text-sm ml-auto">
                    <FileSpreadsheet className="h-4 w-4 mr-1" />
                    Export to Excel
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
                <div className="min-w-[1200px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="text-xs py-3 px-2 w-12 text-center">S#</TableHead>
                        <TableHead className="text-xs py-3 px-2 min-w-[100px]">Manifest #</TableHead>
                        <TableHead className="text-xs py-3 px-2 min-w-[80px]">Date</TableHead>
                        <TableHead className="text-xs py-3 px-2 min-w-[80px]">LHC#</TableHead>
                        <TableHead className="text-xs py-3 px-2 min-w-[100px]">Branch</TableHead>
                        <TableHead className="text-xs py-3 px-2 min-w-[120px]">To Station</TableHead>
                        <TableHead className="text-xs py-3 px-2 min-w-[100px]">Mode</TableHead>
                        <TableHead className="text-xs py-3 px-2 min-w-[80px]">Mode Category</TableHead>
                        <TableHead className="text-xs py-3 px-2 w-[80px] text-center">No. Of Pickups</TableHead>
                        <TableHead className="text-xs py-3 px-2 w-[80px] text-right">Gross Wt.</TableHead>
                        <TableHead className="text-xs py-3 px-2 w-32 text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={11} className="text-center py-12">
                            <Loader2 className="h-8 w-8 mx-auto animate-spin text-blue-500" />
                            <p className="text-gray-500 mt-2">Loading manifests...</p>
                          </TableCell>
                        </TableRow>
                      ) : paginatedResults.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={11} className="text-center py-12 text-gray-500">
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
                            <TableCell className="py-3 px-2 text-sm">{record.lhcNo || "-"}</TableCell>
                            {/* FIX: Display branch name instead of code */}
                            <TableCell className="py-3 px-2 text-sm">
                              {getBranchDisplayText(record.branch)}
                            </TableCell>
                            <TableCell className="py-3 px-2 text-sm">{record.toStation}</TableCell>
                            <TableCell className="py-3 px-2 text-sm">{record.modeName}</TableCell>
                            <TableCell className="py-3 px-2 text-sm">{record.modeCategory}</TableCell>
                            <TableCell className="py-3 px-2 text-center text-sm">{record.noOfPckgs}</TableCell>
                            <TableCell className="py-3 px-2 text-right text-sm">{record.grossWeight.toFixed(3)}</TableCell>
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
                                  onClick={() => handleExportToExcel()}
                                  className="h-8 w-8 p-0 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50"
                                  title="Export to Excel"
                                >
                                  <FileSpreadsheet className="h-4 w-4" />
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

      {/* Cancelled Manifests Tab - Same fix for branch name */}
      {mainTab === "cancelled" && (
        <>
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
                  <Select value={searchBranch} onValueChange={setSearchBranch}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="All Branches" />
                    </SelectTrigger>
                    <SelectContent className="z-[99999]">
                      <SelectItem value="all">All Branches</SelectItem>
                      {branchOptions.map((branch) => (
                        <SelectItem key={branch.value} value={branch.value}>
                          {branch.text}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                            {/* FIX: Display branch name instead of code */}
                            <TableCell className="py-3 px-2 text-sm">
                              {getBranchDisplayText(record.branch)}
                            </TableCell>
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

      {/* Rest of the modals remain the same... */}
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
                <SelectContent className="z-[99999]">
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

      {/* Edit Manifest Modal - FIXED POSITIONING */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="w-[95vw] max-w-7xl max-h-[90vh] flex flex-col p-0 z-[9999]">
          <DialogHeader className="sticky top-0 bg-white z-10 px-6 pt-6 pb-3 border-b shrink-0">
            <DialogTitle className="text-xl flex items-center gap-2">
              <Edit className="h-5 w-5 text-blue-600" />
              Edit Manifest - {currentManifest?.manifestNo}
            </DialogTitle>
            <DialogDescription>Manage GRs for this manifest. Select GRs from stock and assign them.</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {/* Manifest Info Summary */}
            <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-xs text-gray-500">Manifest No</Label>
                <p className="font-semibold">{currentManifest?.manifestNo}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Branch</Label>
                <p className="font-semibold">{currentManifest?.branch}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">To Station</Label>
                <p className="font-semibold">{currentManifest?.toStation}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Mode Name</Label>
                <p className="font-semibold">{currentManifest?.modeName}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Driver</Label>
                <p className="font-semibold">{currentManifest?.driverName}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Loading Person</Label>
                <p className="font-semibold">{currentManifest?.loadingPerson}</p>
              </div>
            </div>

            {/* Stock of Despatch Section */}
            <div className="border rounded-lg">
              <div className="bg-green-50 px-4 py-3 border-b flex justify-between items-center">
                <h3 className="text-base font-semibold flex items-center gap-2 text-green-700">
                  <Package className="h-5 w-5" />
                  STOCK OF DESPATCH
                </h3>
                <div className="flex gap-2">
                  <Button onClick={handleStockSearch} size="sm" className="h-8 text-sm bg-green-600">
                    <Search className="h-4 w-4 mr-1" /> SHOW STOCK
                  </Button>
                  <Button onClick={handleClearStockSearch} variant="outline" size="sm" className="h-8 text-sm">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4">
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
                    <Select value={stockBranch} onValueChange={setStockBranch} disabled={selectAllBranch}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Select Branch" />
                      </SelectTrigger>
                      <SelectContent className="z-[99999]">
                        {branchOptions.map((branch) => (
                          <SelectItem key={branch.value} value={branch.value}>
                            {branch.text}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                </div>

                {/* Stock Table */}
                <div className="rounded-md border overflow-x-auto">
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
                        <TableHead className="text-xs py-3 px-2 w-12 text-center">S#</TableHead>
                        <TableHead className="text-xs py-3 px-2 min-w-[80px]">GR #</TableHead>
                        <TableHead className="text-xs py-3 px-2 min-w-[80px]">GR Date</TableHead>
                        <TableHead className="text-xs py-3 px-2 min-w-[100px]">Origin</TableHead>
                        <TableHead className="text-xs py-3 px-2 min-w-[120px]">Destination</TableHead>
                        <TableHead className="text-xs py-3 px-2 min-w-[120px]">Consignor</TableHead>
                        <TableHead className="text-xs py-3 px-2 min-w-[120px]">Consignee</TableHead>
                        <TableHead className="text-xs py-3 px-2 w-[60px] text-center">ToPay</TableHead>
                        <TableHead className="text-xs py-3 px-2 w-[60px] text-center">Paid</TableHead>
                        <TableHead className="text-xs py-3 px-2 w-[60px] text-center">TBB</TableHead>
                        <TableHead className="text-xs py-3 px-2 w-[80px] text-center">Booked Pckgs</TableHead>
                        <TableHead className="text-xs py-3 px-2 w-[80px] text-center">Stock Pckgs</TableHead>
                        <TableHead className="text-xs py-3 px-2 w-[80px] text-right">Weight</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={14} className="text-center py-12">
                            <Loader2 className="h-8 w-8 mx-auto animate-spin text-green-500" />
                            <p className="text-gray-500 mt-2">Loading stock items...</p>
                          </TableCell>
                        </TableRow>
                      ) : paginatedStockItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={14} className="text-center py-12 text-gray-500">
                            <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            No stock records found. Click "SHOW STOCK" to search.
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
                            <TableCell className="py-3 px-2 font-mono text-sm font-semibold">{item.grNo}</TableCell>
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
                            <TableCell className="py-3 px-2 text-center text-sm">{item.toPay}</TableCell>
                            <TableCell className="py-3 px-2 text-center text-sm">{item.paid}</TableCell>
                            <TableCell className="py-3 px-2 text-center text-sm">{item.tbb}</TableCell>
                            <TableCell className="py-3 px-2 text-center text-sm">{item.stockPckgs}</TableCell>
                            <TableCell className="py-3 px-2 text-center text-sm">{item.stockPckgs}</TableCell>
                            <TableCell className="py-3 px-2 text-right text-sm">{item.stockPckgs * 100}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

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

                <div className="flex justify-end gap-3 mt-4">
                  <Button
                    onClick={handleAssignGRs}
                    className="h-9 text-sm bg-blue-600 hover:bg-blue-700"
                    disabled={stockStats.selected === 0 || loading}
                  >
                    {loading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Plus className="h-4 w-4 mr-1" />}
                    ADD TO MANIFEST ({stockStats.selected})
                  </Button>
                </div>
              </div>
            </div>

            {/* Assigned GRs Section */}
            <div className="border rounded-lg">
              <div className="bg-blue-50 px-4 py-3 border-b flex justify-between items-center">
                <h3 className="text-base font-semibold flex items-center gap-2 text-blue-700">
                  <CheckCircle className="h-5 w-5" />
                  ASSIGNED GRs TO THIS MANIFEST
                </h3>
                <div className="text-sm font-medium">
                  Total: {assignedGRs.length} GRs | Packages: {assignedGRs.reduce((sum, gr) => sum + gr.dispatchedPckgs, 0)} | Weight: {assignedGRs.reduce((sum, gr) => sum + gr.weight, 0)} kg
                </div>
              </div>
              <div className="p-4">
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="text-xs py-3 px-2 w-12 text-center">S#</TableHead>
                        <TableHead className="text-xs py-3 px-2 min-w-[80px]">GR #</TableHead>
                        <TableHead className="text-xs py-3 px-2 min-w-[80px]">GR Date</TableHead>
                        <TableHead className="text-xs py-3 px-2 min-w-[120px]">Consignor</TableHead>
                        <TableHead className="text-xs py-3 px-2 min-w-[120px]">Consignee</TableHead>
                        <TableHead className="text-xs py-3 px-2 min-w-[120px]">Destination</TableHead>
                        <TableHead className="text-xs py-3 px-2 w-[80px] text-center">ToPay</TableHead>
                        <TableHead className="text-xs py-3 px-2 w-[80px] text-center">Paid</TableHead>
                        <TableHead className="text-xs py-3 px-2 w-[80px] text-center">TBB</TableHead>
                        <TableHead className="text-xs py-3 px-2 w-[80px] text-center">Booked Pckgs</TableHead>
                        <TableHead className="text-xs py-3 px-2 w-[80px] text-center">Stock Pckgs</TableHead>
                        <TableHead className="text-xs py-3 px-2 w-[80px] text-center">Despatch Pckgs</TableHead>
                        <TableHead className="text-xs py-3 px-2 w-[80px] text-right">Weight</TableHead>
                        <TableHead className="text-xs py-3 px-2 w-16 text-center">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assignedGRs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={14} className="text-center py-12 text-gray-500">
                            <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            No GRs assigned to this manifest yet. Select GRs from Stock of Despatch and click "ADD TO MANIFEST".
                          </TableCell>
                        </TableRow>
                      ) : (
                        assignedGRs.map((gr, idx) => (
                          <TableRow key={idx} className="hover:bg-gray-50">
                            <TableCell className="py-3 px-2 text-center text-sm">{idx + 1}</TableCell>
                            <TableCell className="py-3 px-2 font-mono text-sm font-semibold">{gr.grNo}</TableCell>
                            <TableCell className="py-3 px-2 text-sm">
                              {format(new Date(gr.grDate), "dd-MM-yyyy")}
                            </TableCell>
                            <TableCell className="py-3 px-2 text-sm truncate max-w-[150px]">{gr.consignor}</TableCell>
                            <TableCell className="py-3 px-2 text-sm truncate max-w-[150px]">{gr.consignee}</TableCell>
                            <TableCell className="py-3 px-2 text-sm">{gr.destination}</TableCell>
                            <TableCell className="py-3 px-2 text-center text-sm">₹{gr.toPay.toFixed(2)}</TableCell>
                            <TableCell className="py-3 px-2 text-center text-sm">₹{gr.paid.toFixed(2)}</TableCell>
                            <TableCell className="py-3 px-2 text-center text-sm">₹{gr.tbb.toFixed(2)}</TableCell>
                            <TableCell className="py-3 px-2 text-center text-sm">{gr.bookedPckgs}</TableCell>
                            <TableCell className="py-3 px-2 text-center text-sm">{gr.stockPckgs}</TableCell>
                            <TableCell className="py-3 px-2 text-center text-sm">{gr.dispatchedPckgs}</TableCell>
                            <TableCell className="py-3 px-2 text-right text-sm">{gr.weight}</TableCell>
                            <TableCell className="py-3 px-2 text-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveAssignedGR(idx)}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                title="Remove from manifest"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            {/* Footer Buttons - Fixed positioning */}
            <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="h-9">
                <X className="mr-1 h-4 w-4" /> Cancel
              </Button>
              <Button onClick={handleSaveManifestWithGRs} disabled={loading} className="h-9 bg-blue-600 hover:bg-blue-700">
                {loading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Save className="mr-1 h-4 w-4" />}
                UPDATE MANIFEST
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create New Manifest Modal */}
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
                <Select value={branch} onValueChange={setBranch}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Select Branch" />
                  </SelectTrigger>
                  <SelectContent className="z-[99999]">
                    {branchOptions.length === 0 ? (
                      <SelectItem value="" disabled>Loading branches...</SelectItem>
                    ) : (
                      branchOptions.map((branch) => (
                        <SelectItem key={branch.value} value={branch.value}>
                          {branch.text}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-sm">
                  To Station <span className="text-red-500">*</span>
                </Label>
                <Select value={toStation} onValueChange={setToStation}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Select To Station" />
                  </SelectTrigger>
                  <SelectContent className="z-[99999]">
                    {destinationOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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