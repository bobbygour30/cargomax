// app/operations/transaction/market-vehicle-placement/page.tsx
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
  Package,
  Weight,
  FileSpreadsheet,
  Calculator,
  AlertCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
  Plus,
  History,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Fuel,
  Receipt,
  Users,
  Wrench,
  CreditCard,
  PieChart,
  Navigation,
  Flag,
  Circle,
  Map,
  Route,
  ArrowLeftRight,
  Layers,
  GitMerge,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Types
interface Vehicle {
  id: number;
  vehicleNo: string;
  vehicleType: string;
  capacity: number;
  manufacturer: string;
  model: string;
  year: number;
  ownerName: string;
  ownerContact: string;
  driverName: string;
  driverContact: string;
  status: "available" | "placed" | "on_trip" | "maintenance";
  currentLocation: string;
  lastTripDate: Date;
  totalTrips: number;
  documents: {
    insurance: boolean;
    permit: boolean;
    fitness: boolean;
    pollution: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface PlacementRequest {
  id: number;
  requestId: string;
  origin: string;
  destination: string;
  requiredVehicleType: string;
  requiredCapacity: number;
  requiredDate: Date;
  materialType: string;
  weight: number;
  clientName: string;
  clientContact: string;
  budget: number;
  status: "pending" | "assigned" | "completed" | "cancelled";
  assignedVehicleId?: number;
  assignedVehicleNo?: string;
  assignedDriver?: string;
  assignedDate?: Date;
  completedDate?: Date;
  remarks: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PlacementHistory {
  id: number;
  placementId: string;
  vehicleId: number;
  vehicleNo: string;
  requestId: string;
  origin: string;
  destination: string;
  assignedDate: Date;
  completedDate: Date;
  status: string;
  revenue: number;
  expenses: number;
  profit: number;
  remarks: string;
}

// Options
const vehicleTypeOptions = [
  "Truck", "Container", "Trailer", "Tanker", "Pickup", "Van", "Lorry"
];

const manufacturerOptions = [
  "TATA Motors", "Ashok Leyland", "Mahindra", "Eicher", "Bharat Benz", "Force Motors", "Volvo", "Scania"
];

const statusOptions = [
  { value: "available", label: "Available", color: "bg-green-500" },
  { value: "placed", label: "Placed", color: "bg-blue-500" },
  { value: "on_trip", label: "On Trip", color: "bg-yellow-500" },
  { value: "maintenance", label: "Maintenance", color: "bg-red-500" }
];

const materialTypeOptions = [
  "General Cargo", "Electronics", "Pharmaceuticals", "Food Items", 
  "Chemicals", "Construction Material", "Automobile Parts", "Furniture"
];

// Sample Data
const sampleVehicles: Vehicle[] = [
  { id: 1, vehicleNo: "UP14AB1234", vehicleType: "Truck", capacity: 15000, manufacturer: "TATA Motors", model: "TATA 407", year: 2022, ownerName: "Rajesh Kumar", ownerContact: "9876543210", driverName: "Suresh Singh", driverContact: "9876543211", status: "available", currentLocation: "DELHI", lastTripDate: new Date("2026-05-28"), totalTrips: 45, documents: { insurance: true, permit: true, fitness: true, pollution: true }, createdAt: new Date(), updatedAt: new Date() },
  { id: 2, vehicleNo: "UP15CD5678", vehicleType: "Container", capacity: 20000, manufacturer: "Ashok Leyland", model: "AL Container", year: 2023, ownerName: "Suresh Singh", ownerContact: "9876543220", driverName: "Mahesh Sharma", driverContact: "9876543221", status: "available", currentLocation: "MUMBAI", lastTripDate: new Date("2026-05-29"), totalTrips: 32, documents: { insurance: true, permit: true, fitness: true, pollution: true }, createdAt: new Date(), updatedAt: new Date() },
  { id: 3, vehicleNo: "UP16EF9012", vehicleType: "Trailer", capacity: 25000, manufacturer: "Mahindra", model: "Mahindra Trailer", year: 2021, ownerName: "Mahesh Sharma", ownerContact: "9876543230", driverName: "Ramesh Gupta", driverContact: "9876543231", status: "on_trip", currentLocation: "BANGALORE", lastTripDate: new Date("2026-05-30"), totalTrips: 28, documents: { insurance: true, permit: true, fitness: false, pollution: true }, createdAt: new Date(), updatedAt: new Date() },
  { id: 4, vehicleNo: "UP17GH3456", vehicleType: "Tanker", capacity: 12000, manufacturer: "Eicher", model: "Eicher Tanker", year: 2022, ownerName: "Ramesh Gupta", ownerContact: "9876543240", driverName: "Satish Verma", driverContact: "9876543241", status: "maintenance", currentLocation: "CHENNAI", lastTripDate: new Date("2026-05-25"), totalTrips: 18, documents: { insurance: true, permit: false, fitness: false, pollution: true }, createdAt: new Date(), updatedAt: new Date() },
];

const sampleRequests: PlacementRequest[] = [
  { id: 1, requestId: "REQ001", origin: "DELHI", destination: "MUMBAI", requiredVehicleType: "Truck", requiredCapacity: 15000, requiredDate: new Date("2026-06-05"), materialType: "Electronics", weight: 12000, clientName: "ABC Electronics", clientContact: "9876543210", budget: 35000, status: "pending", remarks: "Need on urgent basis", createdAt: new Date(), updatedAt: new Date() },
  { id: 2, requestId: "REQ002", origin: "MUMBAI", destination: "BANGALORE", requiredVehicleType: "Container", requiredCapacity: 20000, requiredDate: new Date("2026-06-06"), materialType: "Pharmaceuticals", weight: 18000, clientName: "XYZ Pharma", clientContact: "9876543220", budget: 45000, status: "pending", remarks: "Temperature controlled required", createdAt: new Date(), updatedAt: new Date() },
  { id: 3, requestId: "REQ003", origin: "BANGALORE", destination: "CHENNAI", requiredVehicleType: "Trailer", requiredCapacity: 25000, requiredDate: new Date("2026-06-07"), materialType: "Construction Material", weight: 22000, clientName: "PQR Constructions", clientContact: "9876543230", budget: 55000, status: "assigned", assignedVehicleId: 3, assignedVehicleNo: "UP16EF9012", assignedDriver: "Ramesh Gupta", assignedDate: new Date("2026-06-01"), remarks: "Heavy material", createdAt: new Date(), updatedAt: new Date() },
];

const sampleHistory: PlacementHistory[] = [
  { id: 1, placementId: "PL001", vehicleId: 1, vehicleNo: "UP14AB1234", requestId: "REQ001", origin: "DELHI", destination: "MUMBAI", assignedDate: new Date("2026-05-20"), completedDate: new Date("2026-05-25"), status: "completed", revenue: 35000, expenses: 25000, profit: 10000, remarks: "Delivered on time" },
  { id: 2, placementId: "PL002", vehicleId: 2, vehicleNo: "UP15CD5678", requestId: "REQ002", origin: "MUMBAI", destination: "BANGALORE", assignedDate: new Date("2026-05-22"), completedDate: new Date("2026-05-28"), status: "completed", revenue: 45000, expenses: 32000, profit: 13000, remarks: "Satisfied customer" },
];

export default function MarketVehiclePlacementPortal() {
  // Main Tab state
  const [mainTab, setMainTab] = useState<"vehicles" | "requests" | "placement" | "history">("vehicles");
  
  // Sheet state
  const [isVehicleSheetOpen, setIsVehicleSheetOpen] = useState(false);
  const [isRequestSheetOpen, setIsRequestSheetOpen] = useState(false);
  const [isPlacementSheetOpen, setIsPlacementSheetOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<number | null>(null);
  
  // Vehicle form state
  const [vehicleNo, setVehicleNo] = useState<string>("");
  const [vehicleType, setVehicleType] = useState<string>("");
  const [capacity, setCapacity] = useState<number>(0);
  const [manufacturer, setManufacturer] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [ownerName, setOwnerName] = useState<string>("");
  const [ownerContact, setOwnerContact] = useState<string>("");
  const [driverName, setDriverName] = useState<string>("");
  const [driverContact, setDriverContact] = useState<string>("");
  const [status, setStatus] = useState<string>("available");
  const [currentLocation, setCurrentLocation] = useState<string>("");
  
  // Request form state
  const [requestOrigin, setRequestOrigin] = useState<string>("");
  const [requestDestination, setRequestDestination] = useState<string>("");
  const [requiredVehicleType, setRequiredVehicleType] = useState<string>("");
  const [requiredCapacity, setRequiredCapacity] = useState<number>(0);
  const [requiredDate, setRequiredDate] = useState<Date>(new Date());
  const [materialType, setMaterialType] = useState<string>("");
  const [weight, setWeight] = useState<number>(0);
  const [clientName, setClientName] = useState<string>("");
  const [clientContact, setClientContact] = useState<string>("");
  const [budget, setBudget] = useState<number>(0);
  const [requestRemarks, setRequestRemarks] = useState<string>("");
  
  // Placement state
  const [selectedRequest, setSelectedRequest] = useState<PlacementRequest | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [placementRevenue, setPlacementRevenue] = useState<number>(0);
  const [placementExpenses, setPlacementExpenses] = useState<number>(0);
  const [placementRemarks, setPlacementRemarks] = useState<string>("");
  
  // Search state
  const [searchVehicles, setSearchVehicles] = useState<Vehicle[]>([]);
  const [searchRequests, setSearchRequests] = useState<PlacementRequest[]>([]);
  const [searchHistory, setSearchHistory] = useState<PlacementHistory[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchStatus, setSearchStatus] = useState<string>("all");
  const [searchType, setSearchType] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [historyCurrentPage, setHistoryCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;
  
  const [vehicles, setVehicles] = useState<Vehicle[]>(sampleVehicles);
  const [requests, setRequests] = useState<PlacementRequest[]>(sampleRequests);
  const [placementHistory, setPlacementHistory] = useState<PlacementHistory[]>(sampleHistory);
  const [loading, setLoading] = useState(false);

  // Load data on mount
  useEffect(() => {
    setSearchVehicles(vehicles);
    setSearchRequests(requests);
    setSearchHistory(placementHistory);
  }, []);

  // Vehicle CRUD
  const handleAddVehicle = () => {
    if (!vehicleNo || !vehicleType) {
      alert("Please fill required fields");
      return;
    }
    
    const newVehicle: Vehicle = {
      id: currentEditId || Date.now(),
      vehicleNo,
      vehicleType,
      capacity,
      manufacturer,
      model,
      year,
      ownerName,
      ownerContact,
      driverName,
      driverContact,
      status: status as any,
      currentLocation,
      lastTripDate: new Date(),
      totalTrips: editMode ? (vehicles.find(v => v.id === currentEditId)?.totalTrips || 0) : 0,
      documents: { insurance: true, permit: true, fitness: true, pollution: true },
      createdAt: editMode ? (vehicles.find(v => v.id === currentEditId)?.createdAt || new Date()) : new Date(),
      updatedAt: new Date(),
    };
    
    if (editMode && currentEditId) {
      setVehicles(vehicles.map(v => v.id === currentEditId ? newVehicle : v));
      alert("Vehicle updated successfully!");
    } else {
      setVehicles([...vehicles, newVehicle]);
      alert("Vehicle added successfully!");
    }
    
    resetVehicleForm();
    setIsVehicleSheetOpen(false);
    setSearchVehicles(vehicles);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditMode(true);
    setCurrentEditId(vehicle.id);
    setVehicleNo(vehicle.vehicleNo);
    setVehicleType(vehicle.vehicleType);
    setCapacity(vehicle.capacity);
    setManufacturer(vehicle.manufacturer);
    setModel(vehicle.model);
    setYear(vehicle.year);
    setOwnerName(vehicle.ownerName);
    setOwnerContact(vehicle.ownerContact);
    setDriverName(vehicle.driverName);
    setDriverContact(vehicle.driverContact);
    setStatus(vehicle.status);
    setCurrentLocation(vehicle.currentLocation);
    setIsVehicleSheetOpen(true);
  };

  const handleDeleteVehicle = (id: number) => {
    if (confirm("Are you sure you want to delete this vehicle?")) {
      setVehicles(vehicles.filter(v => v.id !== id));
      setSearchVehicles(vehicles.filter(v => v.id !== id));
      alert("Vehicle deleted successfully!");
    }
  };

  // Request CRUD
  const handleAddRequest = () => {
    if (!requestOrigin || !requestDestination || !clientName) {
      alert("Please fill required fields");
      return;
    }
    
    const newRequest: PlacementRequest = {
      id: currentEditId || Date.now(),
      requestId: `REQ${String(requests.length + 1).padStart(3, "0")}`,
      origin: requestOrigin,
      destination: requestDestination,
      requiredVehicleType,
      requiredCapacity,
      requiredDate,
      materialType,
      weight,
      clientName,
      clientContact,
      budget,
      status: "pending",
      remarks: requestRemarks,
      createdAt: editMode ? (requests.find(r => r.id === currentEditId)?.createdAt || new Date()) : new Date(),
      updatedAt: new Date(),
    };
    
    if (editMode && currentEditId) {
      setRequests(requests.map(r => r.id === currentEditId ? newRequest : r));
      alert("Request updated successfully!");
    } else {
      setRequests([...requests, newRequest]);
      alert("Request added successfully!");
    }
    
    resetRequestForm();
    setIsRequestSheetOpen(false);
    setSearchRequests(requests);
  };

  const handleEditRequest = (request: PlacementRequest) => {
    setEditMode(true);
    setCurrentEditId(request.id);
    setRequestOrigin(request.origin);
    setRequestDestination(request.destination);
    setRequiredVehicleType(request.requiredVehicleType);
    setRequiredCapacity(request.requiredCapacity);
    setRequiredDate(request.requiredDate);
    setMaterialType(request.materialType);
    setWeight(request.weight);
    setClientName(request.clientName);
    setClientContact(request.clientContact);
    setBudget(request.budget);
    setRequestRemarks(request.remarks);
    setIsRequestSheetOpen(true);
  };

  const handleDeleteRequest = (id: number) => {
    if (confirm("Are you sure you want to delete this request?")) {
      setRequests(requests.filter(r => r.id !== id));
      setSearchRequests(requests.filter(r => r.id !== id));
      alert("Request deleted successfully!");
    }
  };

  // Placement functions
  const handleAssignVehicle = (request: PlacementRequest) => {
    setSelectedRequest(request);
    setPlacementRevenue(request.budget);
    setPlacementExpenses(0);
    setPlacementRemarks("");
    setIsPlacementSheetOpen(true);
  };

  const handleConfirmPlacement = () => {
    if (!selectedVehicle) {
      alert("Please select a vehicle");
      return;
    }
    if (!selectedRequest) {
      alert("No request selected");
      return;
    }
    
    // Update request status
    const updatedRequests = requests.map(r => 
      r.id === selectedRequest.id 
        ? { 
            ...r, 
            status: "assigned" as const, 
            assignedVehicleId: selectedVehicle.id,
            assignedVehicleNo: selectedVehicle.vehicleNo,
            assignedDriver: selectedVehicle.driverName,
            assignedDate: new Date(),
            updatedAt: new Date()
          }
        : r
    );
    setRequests(updatedRequests);
    
    // Update vehicle status
    const updatedVehicles = vehicles.map(v => 
      v.id === selectedVehicle.id 
        ? { ...v, status: "placed" as const, updatedAt: new Date() }
        : v
    );
    setVehicles(updatedVehicles);
    
    // Add to history
    const newHistory: PlacementHistory = {
      id: placementHistory.length + 1,
      placementId: `PL${String(placementHistory.length + 1).padStart(3, "0")}`,
      vehicleId: selectedVehicle.id,
      vehicleNo: selectedVehicle.vehicleNo,
      requestId: selectedRequest.requestId,
      origin: selectedRequest.origin,
      destination: selectedRequest.destination,
      assignedDate: new Date(),
      completedDate: new Date(),
      status: "completed",
      revenue: placementRevenue,
      expenses: placementExpenses,
      profit: placementRevenue - placementExpenses,
      remarks: placementRemarks,
    };
    setPlacementHistory([newHistory, ...placementHistory]);
    
    alert(`Vehicle ${selectedVehicle.vehicleNo} assigned to request ${selectedRequest.requestId} successfully!`);
    
    setIsPlacementSheetOpen(false);
    setSelectedRequest(null);
    setSelectedVehicle(null);
    setSearchVehicles(updatedVehicles);
    setSearchRequests(updatedRequests);
    setSearchHistory(placementHistory);
  };

  const handleCompletePlacement = (history: PlacementHistory) => {
    if (confirm(`Mark placement ${history.placementId} as completed?`)) {
      alert(`Placement ${history.placementId} completed!`);
    }
  };

  // Search functions
  const handleVehicleSearch = () => {
    let results = vehicles;
    if (searchTerm) {
      results = results.filter(v => 
        v.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.vehicleType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (searchStatus !== "all") {
      results = results.filter(v => v.status === searchStatus);
    }
    if (searchType !== "all") {
      results = results.filter(v => v.vehicleType === searchType);
    }
    setSearchVehicles(results);
    setCurrentPage(1);
  };

  const handleRequestSearch = () => {
    let results = requests;
    if (searchTerm) {
      results = results.filter(r => 
        r.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.origin.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (searchStatus !== "all") {
      results = results.filter(r => r.status === searchStatus);
    }
    setSearchRequests(results);
    setCurrentPage(1);
  };

  const handleHistorySearch = () => {
    let results = placementHistory;
    if (searchTerm) {
      results = results.filter(h => 
        h.placementId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setSearchHistory(results);
    setHistoryCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchStatus("all");
    setSearchType("all");
    setSearchVehicles(vehicles);
    setSearchRequests(requests);
    setSearchHistory(placementHistory);
    setCurrentPage(1);
    setHistoryCurrentPage(1);
  };

  const resetVehicleForm = () => {
    setVehicleNo("");
    setVehicleType("");
    setCapacity(0);
    setManufacturer("");
    setModel("");
    setYear(new Date().getFullYear());
    setOwnerName("");
    setOwnerContact("");
    setDriverName("");
    setDriverContact("");
    setStatus("available");
    setCurrentLocation("");
    setEditMode(false);
    setCurrentEditId(null);
  };

  const resetRequestForm = () => {
    setRequestOrigin("");
    setRequestDestination("");
    setRequiredVehicleType("");
    setRequiredCapacity(0);
    setRequiredDate(new Date());
    setMaterialType("");
    setWeight(0);
    setClientName("");
    setClientContact("");
    setBudget(0);
    setRequestRemarks("");
    setEditMode(false);
    setCurrentEditId(null);
  };

  // Stats
  const stats = {
    totalVehicles: vehicles.length,
    availableVehicles: vehicles.filter(v => v.status === "available").length,
    onTripVehicles: vehicles.filter(v => v.status === "on_trip").length,
    pendingRequests: requests.filter(r => r.status === "pending").length,
    totalRevenue: placementHistory.reduce((sum, h) => sum + h.revenue, 0),
    totalProfit: placementHistory.reduce((sum, h) => sum + h.profit, 0),
  };

  // Pagination
  const totalPages = Math.ceil(searchVehicles.length / itemsPerPage);
  const paginatedVehicles = searchVehicles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  const requestTotalPages = Math.ceil(searchRequests.length / itemsPerPage);
  const paginatedRequests = searchRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const historyTotalPages = Math.ceil(searchHistory.length / itemsPerPage);
  const paginatedHistory = searchHistory.slice((historyCurrentPage - 1) * itemsPerPage, historyCurrentPage * itemsPerPage);
  const goToHistoryPage = (page: number) => setHistoryCurrentPage(Math.max(1, Math.min(page, historyTotalPages)));

  // Get available vehicles for placement
  const availableVehicles = vehicles.filter(v => v.status === "available");

  return (
    <div className="space-y-4 p-3 md:p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-600" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">MARKET VEHICLE PLACEMENT PORTAL</h1>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
              <span>🏢 Company: GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
              <span>👤 Login: MAYANK.GRLOGISTICS@GMAIL.COM</span>
              <span>📍 Branch: CORPORATE OFFICE</span>
              <span>📅 Financial Year: 2026-2027</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-3">
            <p className="text-[10px] opacity-90">Total Vehicles</p>
            <p className="text-xl font-bold">{stats.totalVehicles}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-3">
            <p className="text-[10px] opacity-90">Available</p>
            <p className="text-xl font-bold">{stats.availableVehicles}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-3">
            <p className="text-[10px] opacity-90">On Trip</p>
            <p className="text-xl font-bold">{stats.onTripVehicles}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-3">
            <p className="text-[10px] opacity-90">Pending Requests</p>
            <p className="text-xl font-bold">{stats.pendingRequests}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-3">
            <p className="text-[10px] opacity-90">Total Revenue</p>
            <p className="text-xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-3">
            <p className="text-[10px] opacity-90">Total Profit</p>
            <p className="text-xl font-bold">₹{stats.totalProfit.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b bg-white rounded-t-lg flex-wrap">
        <button
          onClick={() => setMainTab("vehicles")}
          className={cn(
            "px-4 py-2.5 text-sm font-medium transition-all rounded-t-lg flex items-center gap-2",
            mainTab === "vehicles"
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          )}
        >
          <Truck className="h-4 w-4" />
          Vehicles
        </button>
        <button
          onClick={() => setMainTab("requests")}
          className={cn(
            "px-4 py-2.5 text-sm font-medium transition-all rounded-t-lg flex items-center gap-2",
            mainTab === "requests"
              ? "bg-green-600 text-white shadow-md"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          )}
        >
          <FileText className="h-4 w-4" />
          Placement Requests
        </button>
        <button
          onClick={() => setMainTab("placement")}
          className={cn(
            "px-4 py-2.5 text-sm font-medium transition-all rounded-t-lg flex items-center gap-2",
            mainTab === "placement"
              ? "bg-purple-600 text-white shadow-md"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          )}
        >
          <GitMerge className="h-4 w-4" />
          Assign Vehicle
        </button>
        <button
          onClick={() => setMainTab("history")}
          className={cn(
            "px-4 py-2.5 text-sm font-medium transition-all rounded-t-lg flex items-center gap-2",
            mainTab === "history"
              ? "bg-orange-600 text-white shadow-md"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          )}
        >
          <History className="h-4 w-4" />
          Placement History
        </button>
      </div>

      {/* Vehicles Tab */}
      {mainTab === "vehicles" && (
        <>
          <div className="flex justify-end">
            <Button onClick={() => { resetVehicleForm(); setIsVehicleSheetOpen(true); }} size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-1 h-3.5 w-3.5" /> Add Vehicle
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-[11px] font-semibold flex items-center gap-2 text-gray-700">
                <Search className="h-3.5 w-3.5" />
                Search Vehicles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Input placeholder="Search by Vehicle # or Type" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="h-8 text-xs" />
                <Select value={searchStatus} onValueChange={setSearchStatus}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>{statusOptions.map(opt => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent>
                </Select>
                <Select value={searchType} onValueChange={setSearchType}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Vehicle Type" /></SelectTrigger>
                  <SelectContent><SelectItem value="all">All Types</SelectItem>{vehicleTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button onClick={handleVehicleSearch} size="sm" className="h-8 text-xs bg-blue-600"><Search className="h-3 w-3 mr-1" />Search</Button>
                  <Button onClick={handleClearSearch} variant="outline" size="sm" className="h-8 text-xs"><RefreshCw className="h-3 w-3" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="gap-2 w-full">
                              <Table className="text-gray-500" />
                              <h3 className="text-[15px] font-semibold text-gray-800">Vehicles List</h3></div>
                <div className="text-[10px] text-gray-500">Total: {searchVehicles.length} records</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <div className="min-w-[900px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="text-[11px] w-12 text-center">#</TableHead>
                        <TableHead className="text-[11px] min-w-[100px]">Vehicle #</TableHead>
                        <TableHead className="text-[11px] min-w-[100px]">Type</TableHead>
                        <TableHead className="text-[11px]">Capacity</TableHead>
                        <TableHead className="text-[11px]">Driver</TableHead>
                        <TableHead className="text-[11px]">Status</TableHead>
                        <TableHead className="text-[11px]">Location</TableHead>
                        <TableHead className="text-[11px] w-20 text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedVehicles.map((v, idx) => (
                        <TableRow key={v.id}>
                          <TableCell className="text-center text-xs">{(currentPage-1)*itemsPerPage+idx+1}</TableCell>
                          <TableCell className="font-mono text-xs">{v.vehicleNo}</TableCell>
                          <TableCell className="text-xs">{v.vehicleType}</TableCell>
                          <TableCell className="text-xs">{v.capacity} kg</TableCell>
                          <TableCell className="text-xs">{v.driverName}</TableCell>
                          <TableCell><Badge className={cn("text-[10px]", statusOptions.find(s => s.value === v.status)?.color)}>{statusOptions.find(s => s.value === v.status)?.label}</Badge></TableCell>
                          <TableCell className="text-xs">{v.currentLocation}</TableCell>
                          <TableCell className="text-center"><div className="flex gap-1"><Button variant="ghost" size="sm" onClick={() => handleEditVehicle(v)} className="h-7 w-7 p-0 text-blue-500"><Edit className="h-3.5 w-3.5" /></Button><Button variant="ghost" size="sm" onClick={() => handleDeleteVehicle(v.id)} className="h-7 w-7 p-0 text-red-500"><Trash2 className="h-3.5 w-3.5" /></Button></div></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              {totalPages > 1 && (<div className="flex justify-center gap-1 mt-4"><Button variant="outline" size="sm" onClick={() => goToPage(currentPage-1)} disabled={currentPage===1} className="h-7 text-[10px]">Previous</Button><span className="px-3 py-1 text-[10px]">Page {currentPage} of {totalPages}</span><Button variant="outline" size="sm" onClick={() => goToPage(currentPage+1)} disabled={currentPage===totalPages} className="h-7 text-[10px]">Next</Button></div>)}
            </CardContent>
          </Card>
        </>
      )}

      {/* Placement Requests Tab */}
      {mainTab === "requests" && (
        <>
          <div className="flex justify-end">
            <Button onClick={() => { resetRequestForm(); setIsRequestSheetOpen(true); }} size="sm" className="h-8 text-xs bg-green-600 hover:bg-green-700">
              <Plus className="mr-1 h-3.5 w-3.5" /> Add Request
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-[11px] font-semibold flex items-center gap-2 text-gray-700"><Search className="h-3.5 w-3.5" />Search Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input placeholder="Search by Request ID, Client, Origin" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="h-8 text-xs" />
                <Select value={searchStatus} onValueChange={setSearchStatus}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="assigned">Assigned</SelectItem><SelectItem value="completed">Completed</SelectItem></SelectContent></Select>
                <div className="flex gap-2"><Button onClick={handleRequestSearch} size="sm" className="h-8 text-xs bg-green-600"><Search className="h-3 w-3 mr-1" />Search</Button><Button onClick={handleClearSearch} variant="outline" size="sm" className="h-8 text-xs"><RefreshCw className="h-3 w-3" /></Button></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center"><div className="gap-2 w-full">
                            <Table className="text-gray-500" />
                            <h3 className="text-[15px] font-semibold text-gray-800">Requests List</h3></div><div className="text-[10px] text-gray-500">Total: {searchRequests.length} records</div></div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <div className="min-w-[900px]"><Table><TableHeader><TableRow className="bg-gray-50"><TableHead className="text-[11px] w-12">#</TableHead><TableHead className="text-[11px]">Request ID</TableHead><TableHead className="text-[11px]">Client</TableHead><TableHead className="text-[11px]">Route</TableHead><TableHead className="text-[11px]">Vehicle Type</TableHead><TableHead className="text-[11px]">Budget</TableHead><TableHead className="text-[11px]">Status</TableHead><TableHead className="text-[11px] w-24">Actions</TableHead></TableRow></TableHeader>
                <TableBody>{paginatedRequests.map((r, idx) => (<TableRow key={r.id}><TableCell className="text-center text-xs">{(currentPage-1)*itemsPerPage+idx+1}</TableCell><TableCell className="font-mono text-xs">{r.requestId}</TableCell><TableCell className="text-xs">{r.clientName}</TableCell><TableCell className="text-xs">{r.origin}→{r.destination}</TableCell><TableCell className="text-xs">{r.requiredVehicleType}</TableCell><TableCell className="text-xs">₹{r.budget.toLocaleString()}</TableCell><TableCell>{r.status === "pending" ? <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge> : r.status === "assigned" ? <Badge className="bg-blue-100 text-blue-700">Assigned</Badge> : <Badge className="bg-green-100 text-green-700">Completed</Badge>}</TableCell>
                <TableCell className="text-center"><div className="flex gap-1"><Button variant="ghost" size="sm" onClick={() => handleEditRequest(r)} className="h-7 w-7 p-0 text-blue-500"><Edit className="h-3.5 w-3.5" /></Button><Button variant="ghost" size="sm" onClick={() => handleDeleteRequest(r.id)} className="h-7 w-7 p-0 text-red-500"><Trash2 className="h-3.5 w-3.5" /></Button></div></TableCell></TableRow>))}</TableBody></Table></div>
              </div>
              {requestTotalPages > 1 && (<div className="flex justify-center gap-1 mt-4"><Button variant="outline" size="sm" onClick={() => goToPage(currentPage-1)} disabled={currentPage===1} className="h-7 text-[10px]">Previous</Button><span className="px-3 py-1 text-[10px]">Page {currentPage} of {requestTotalPages}</span><Button variant="outline" size="sm" onClick={() => goToPage(currentPage+1)} disabled={currentPage===requestTotalPages} className="h-7 text-[10px]">Next</Button></div>)}
            </CardContent>
          </Card>
        </>
      )}

      {/* Assign Vehicle Tab */}
      {mainTab === "placement" && (
        <>
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold flex items-center gap-2"><GitMerge className="h-4 w-4" />Assign Vehicle to Request</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="border rounded-md p-3">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><FileText className="h-4 w-4 text-green-600" />Pending Requests</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {requests.filter(r => r.status === "pending").length === 0 ? (<p className="text-xs text-gray-400 text-center py-4">No pending requests</p>) : (
                      requests.filter(r => r.status === "pending").map(req => (
                        <div key={req.id} className={`p-3 border rounded-md cursor-pointer transition ${selectedRequest?.id === req.id ? "border-green-500 bg-green-50" : "hover:border-gray-300"}`} onClick={() => setSelectedRequest(req)}>
                          <div className="flex justify-between items-start"><div><p className="font-semibold text-sm">{req.requestId}</p><p className="text-xs text-gray-500">{req.clientName}</p></div><Badge className="bg-yellow-100 text-yellow-700 text-[10px]">Pending</Badge></div>
                          <p className="text-xs mt-1">{req.origin} → {req.destination}</p>
                          <p className="text-xs text-gray-500">Vehicle: {req.requiredVehicleType} | Capacity: {req.requiredCapacity} kg | Budget: ₹{req.budget.toLocaleString()}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="border rounded-md p-3">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Truck className="h-4 w-4 text-blue-600" />Available Vehicles</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {availableVehicles.length === 0 ? (<p className="text-xs text-gray-400 text-center py-4">No vehicles available</p>) : (
                      availableVehicles.map(vehicle => (
                        <div key={vehicle.id} className={`p-3 border rounded-md cursor-pointer transition ${selectedVehicle?.id === vehicle.id ? "border-blue-500 bg-blue-50" : "hover:border-gray-300"}`} onClick={() => setSelectedVehicle(vehicle)}>
                          <div className="flex justify-between items-start"><div><p className="font-semibold text-sm">{vehicle.vehicleNo}</p><p className="text-xs text-gray-500">{vehicle.vehicleType}</p></div><Badge className="bg-green-100 text-green-700 text-[10px]">Available</Badge></div>
                          <p className="text-xs mt-1">Driver: {vehicle.driverName} | Location: {vehicle.currentLocation}</p>
                          <p className="text-xs text-gray-500">Capacity: {vehicle.capacity} kg | Status: {vehicle.status}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {selectedRequest && selectedVehicle && (
                <div className="mt-4 p-4 border rounded-md bg-gray-50">
                  <h3 className="text-sm font-semibold mb-3">Assignment Summary</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="font-medium">Request:</span> {selectedRequest.requestId} - {selectedRequest.clientName}</div>
                    <div><span className="font-medium">Route:</span> {selectedRequest.origin} → {selectedRequest.destination}</div>
                    <div><span className="font-medium">Vehicle:</span> {selectedVehicle.vehicleNo} ({selectedVehicle.vehicleType})</div>
                    <div><span className="font-medium">Driver:</span> {selectedVehicle.driverName} ({selectedVehicle.driverContact})</div>
                    <div><span className="font-medium">Budget:</span> ₹{selectedRequest.budget.toLocaleString()}</div>
                    <div><span className="font-medium">Required Date:</span> {format(selectedRequest.requiredDate, "dd-MM-yyyy")}</div>
                  </div>
                  <div className="mt-3"><Label className="text-xs">Placement Remarks</Label><Textarea value={placementRemarks} onChange={(e) => setPlacementRemarks(e.target.value)} rows={2} className="text-xs mt-1" placeholder="Enter placement remarks..." /></div>
                  <div className="mt-4 flex justify-end"><Button onClick={handleConfirmPlacement} className="bg-green-600 hover:bg-green-700"><Check className="mr-2 h-4 w-4" />Confirm Assignment</Button></div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Placement History Tab */}
      {mainTab === "history" && (
        <>
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-[11px] font-semibold flex items-center gap-2"><Search className="h-3.5 w-3.5" />Search History</CardTitle></CardHeader>
            <CardContent><div className="flex gap-2"><Input placeholder="Search by Placement ID or Vehicle #" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="h-8 text-xs flex-1" /><Button onClick={handleHistorySearch} size="sm" className="h-8 text-xs bg-orange-600"><Search className="h-3 w-3 mr-1" />Search</Button><Button onClick={handleClearSearch} variant="outline" size="sm" className="h-8 text-xs"><RefreshCw className="h-3 w-3" /></Button></div></CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><div className="flex justify-between items-center"><div className="flex items-center gap-2"><History className="h-3.5 w-3.5 text-gray-500" /><h3 className="text-[11px] font-semibold">Placement History</h3></div><div className="text-[10px] text-gray-500">Total: {searchHistory.length} records</div></div></CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto"><div className="min-w-[900px]"><Table><TableHeader><TableRow className="bg-gray-50"><TableHead className="text-[11px] w-12">#</TableHead><TableHead className="text-[11px]">Placement ID</TableHead><TableHead className="text-[11px]">Vehicle #</TableHead><TableHead className="text-[11px]">Request ID</TableHead><TableHead className="text-[11px]">Route</TableHead><TableHead className="text-[11px] text-right">Revenue</TableHead><TableHead className="text-[11px] text-right">Profit</TableHead><TableHead className="text-[11px]">Status</TableHead><TableHead className="text-[11px] w-20">Action</TableHead></TableRow></TableHeader>
              <TableBody>{paginatedHistory.map((h, idx) => (<TableRow key={h.id}><TableCell className="text-center text-xs">{(historyCurrentPage-1)*itemsPerPage+idx+1}</TableCell><TableCell className="font-mono text-xs">{h.placementId}</TableCell><TableCell className="text-xs">{h.vehicleNo}</TableCell><TableCell className="text-xs">{h.requestId}</TableCell><TableCell className="text-xs">{h.origin}→{h.destination}</TableCell><TableCell className="text-right text-xs">₹{h.revenue.toLocaleString()}</TableCell><TableCell className={cn("text-right text-xs", h.profit >=0 ? "text-green-600" : "text-red-600")}>₹{h.profit.toLocaleString()}</TableCell><TableCell><Badge className="bg-green-100 text-green-700">Completed</Badge></TableCell><TableCell><Button variant="ghost" size="sm" onClick={() => handleCompletePlacement(h)} className="h-7 w-7 p-0 text-blue-500"><Eye className="h-3.5 w-3.5" /></Button></TableCell></TableRow>))}</TableBody></Table></div></div>
              {historyTotalPages > 1 && (<div className="flex justify-center gap-1 mt-4"><Button variant="outline" size="sm" onClick={() => goToHistoryPage(historyCurrentPage-1)} disabled={historyCurrentPage===1} className="h-7 text-[10px]">Previous</Button><span className="px-3 py-1 text-[10px]">Page {historyCurrentPage} of {historyTotalPages}</span><Button variant="outline" size="sm" onClick={() => goToHistoryPage(historyCurrentPage+1)} disabled={historyCurrentPage===historyTotalPages} className="h-7 text-[10px]">Next</Button></div>)}
            </CardContent>
          </Card>
        </>
      )}

      {/* Add/Edit Vehicle Sheet */}
      <Sheet open={isVehicleSheetOpen} onOpenChange={setIsVehicleSheetOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto"><SheetHeader className="mb-4"><SheetTitle>{editMode ? "Edit Vehicle" : "Add Vehicle"}</SheetTitle></SheetHeader>
        <div className="space-y-4"><div className="grid grid-cols-2 gap-3"><div className="space-y-1"><Label className="text-xs">Vehicle # *</Label><Input value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value)} className="h-8 text-xs" /></div><div className="space-y-1"><Label className="text-xs">Vehicle Type *</Label><Select value={vehicleType} onValueChange={setVehicleType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{vehicleTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div></div>
        <div className="grid grid-cols-2 gap-3"><div className="space-y-1"><Label className="text-xs">Capacity (kg)</Label><Input type="number" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} className="h-8 text-xs" /></div><div className="space-y-1"><Label className="text-xs">Manufacturer</Label><Select value={manufacturer} onValueChange={setManufacturer}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{manufacturerOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div></div>
        <div className="grid grid-cols-2 gap-3"><div className="space-y-1"><Label className="text-xs">Model</Label><Input value={model} onChange={(e) => setModel(e.target.value)} className="h-8 text-xs" /></div><div className="space-y-1"><Label className="text-xs">Year</Label><Input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} className="h-8 text-xs" /></div></div>
        <div className="grid grid-cols-2 gap-3"><div className="space-y-1"><Label className="text-xs">Owner Name</Label><Input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} className="h-8 text-xs" /></div><div className="space-y-1"><Label className="text-xs">Owner Contact</Label><Input value={ownerContact} onChange={(e) => setOwnerContact(e.target.value)} className="h-8 text-xs" /></div></div>
        <div className="grid grid-cols-2 gap-3"><div className="space-y-1"><Label className="text-xs">Driver Name</Label><Input value={driverName} onChange={(e) => setDriverName(e.target.value)} className="h-8 text-xs" /></div><div className="space-y-1"><Label className="text-xs">Driver Contact</Label><Input value={driverContact} onChange={(e) => setDriverContact(e.target.value)} className="h-8 text-xs" /></div></div>
        <div className="grid grid-cols-2 gap-3"><div className="space-y-1"><Label className="text-xs">Status</Label><Select value={status} onValueChange={setStatus}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent>{statusOptions.map(opt => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent></Select></div><div className="space-y-1"><Label className="text-xs">Current Location</Label><Input value={currentLocation} onChange={(e) => setCurrentLocation(e.target.value)} className="h-8 text-xs" /></div></div>
        <div className="flex justify-end gap-3 pt-4"><Button variant="outline" onClick={() => setIsVehicleSheetOpen(false)} className="h-8 text-xs">Cancel</Button><Button onClick={handleAddVehicle} className="h-8 text-xs bg-blue-600">{editMode ? "Update" : "Save"}</Button></div></div></SheetContent>
      </Sheet>

      {/* Add/Edit Request Sheet */}
      <Sheet open={isRequestSheetOpen} onOpenChange={setIsRequestSheetOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto"><SheetHeader className="mb-4"><SheetTitle>{editMode ? "Edit Request" : "Add Request"}</SheetTitle></SheetHeader>
        <div className="space-y-4"><div className="grid grid-cols-2 gap-3"><div className="space-y-1"><Label className="text-xs">Origin *</Label><Input value={requestOrigin} onChange={(e) => setRequestOrigin(e.target.value)} className="h-8 text-xs" /></div><div className="space-y-1"><Label className="text-xs">Destination *</Label><Input value={requestDestination} onChange={(e) => setRequestDestination(e.target.value)} className="h-8 text-xs" /></div></div>
        <div className="grid grid-cols-2 gap-3"><div className="space-y-1"><Label className="text-xs">Vehicle Type</Label><Select value={requiredVehicleType} onValueChange={setRequiredVehicleType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{vehicleTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div><div className="space-y-1"><Label className="text-xs">Capacity (kg)</Label><Input type="number" value={requiredCapacity} onChange={(e) => setRequiredCapacity(Number(e.target.value))} className="h-8 text-xs" /></div></div>
        <div className="grid grid-cols-2 gap-3"><div className="space-y-1"><Label className="text-xs">Required Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-2 h-3 w-3" />{format(requiredDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={requiredDate} onSelect={(d) => d && setRequiredDate(d)} /></PopoverContent></Popover></div><div className="space-y-1"><Label className="text-xs">Material Type</Label><Select value={materialType} onValueChange={setMaterialType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{materialTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div></div>
        <div className="grid grid-cols-2 gap-3"><div className="space-y-1"><Label className="text-xs">Weight (kg)</Label><Input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="h-8 text-xs" /></div><div className="space-y-1"><Label className="text-xs">Budget (₹)</Label><Input type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="h-8 text-xs" /></div></div>
        <div className="grid grid-cols-2 gap-3"><div className="space-y-1"><Label className="text-xs">Client Name *</Label><Input value={clientName} onChange={(e) => setClientName(e.target.value)} className="h-8 text-xs" /></div><div className="space-y-1"><Label className="text-xs">Client Contact</Label><Input value={clientContact} onChange={(e) => setClientContact(e.target.value)} className="h-8 text-xs" /></div></div>
        <div className="space-y-1"><Label className="text-xs">Remarks</Label><Textarea value={requestRemarks} onChange={(e) => setRequestRemarks(e.target.value)} rows={2} className="text-xs" /></div>
        <div className="flex justify-end gap-3 pt-4"><Button variant="outline" onClick={() => setIsRequestSheetOpen(false)} className="h-8 text-xs">Cancel</Button><Button onClick={handleAddRequest} className="h-8 text-xs bg-green-600">{editMode ? "Update" : "Save"}</Button></div></div></SheetContent>
      </Sheet>
    </div>
  );
}