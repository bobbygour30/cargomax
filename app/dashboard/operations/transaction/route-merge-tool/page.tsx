// app/operations/transaction/route-merge-tool/page.tsx
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
  GitMerge,
  Route,
  Navigation,
  Layers,
  ArrowLeftRight,
  Map,
  Flag,
  Circle,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Types
interface RouteDetail {
  id: number;
  sequence: number;
  fromLocation: string;
  toLocation: string;
  distance: number;
  duration: number;
  viaPoints: string[];
  tollPlazas: string[];
  fuelStations: string[];
  restStops: string[];
}

interface RouteRecord {
  id: number;
  routeCode: string;
  routeName: string;
  routeType: "primary" | "secondary" | "alternate";
  origin: string;
  destination: string;
  totalDistance: number;
  totalDuration: number;
  viaCities: string[];
  routeDetails: RouteDetail[];
  mergedFrom: number[]; // IDs of routes merged
  mergeDate: Date;
  status: "active" | "inactive" | "merged";
  createdAt: Date;
  updatedAt: Date;
}

interface MergeHistory {
  id: number;
  mergeId: string;
  mergeDate: Date;
  primaryRouteId: number;
  primaryRouteName: string;
  secondaryRouteIds: number[];
  secondaryRouteNames: string[];
  newRouteId: number;
  newRouteName: string;
  mergedBy: string;
  reason: string;
  status: "success" | "pending" | "failed";
}

// Options
const routeTypeOptions = [
  { value: "primary", label: "Primary Route" },
  { value: "secondary", label: "Secondary Route" },
  { value: "alternate", label: "Alternate Route" },
];

const locationOptions = [
  "DELHI", "MUMBAI", "BANGALORE", "CHENNAI", "KOLKATA",
  "AHMEDABAD", "PUNE", "HYDERABAD", "JAIPUR", "LUCKNOW",
  "KANPUR", "NAGPUR", "INDORE", "PATNA", "BHOPAL",
  "LUDHIANA", "AGRA", "VARANASI", "SRINAGAR", "GUWAHATI"
];

const viaOptions = [
  "GURUGRAM", "NOIDA", "GHAZIABAD", "FARIDABAD", "MANESAR",
  "THANE", "NAVI MUMBAI", "PIMPRI", "CHINCHWAD", "WHITEFIELD",
  "ELECTRONIC CITY", "HOWRAH", "SALT LAKE", "RAJARHAT"
];

// Sample Data
const sampleRoutes: RouteRecord[] = [
  { id: 1, routeCode: "RT001", routeName: "DELHI-MUMBAI EXPRESS", routeType: "primary", origin: "DELHI", destination: "MUMBAI", totalDistance: 1420, totalDuration: 24, viaCities: ["JAIPUR", "UDAIPUR", "VADODARA", "SURAT"], routeDetails: [], mergedFrom: [], mergeDate: new Date(), status: "active", createdAt: new Date(), updatedAt: new Date() },
  { id: 2, routeCode: "RT002", routeName: "DELHI-MUMBAI SCENIC", routeType: "secondary", origin: "DELHI", destination: "MUMBAI", totalDistance: 1580, totalDuration: 28, viaCities: ["AGRA", "GWALIOR", "INDORE", "NASHIK"], routeDetails: [], mergedFrom: [], mergeDate: new Date(), status: "active", createdAt: new Date(), updatedAt: new Date() },
  { id: 3, routeCode: "RT003", routeName: "DELHI-MUMBAI COASTAL", routeType: "alternate", origin: "DELHI", destination: "MUMBAI", totalDistance: 1650, totalDuration: 30, viaCities: ["CHANDIGARH", "AHMEDABAD", "VADODARA", "SURAT"], routeDetails: [], mergedFrom: [], mergeDate: new Date(), status: "active", createdAt: new Date(), updatedAt: new Date() },
  { id: 4, routeCode: "RT004", routeName: "MUMBAI-BANGALORE EXPRESS", routeType: "primary", origin: "MUMBAI", destination: "BANGALORE", totalDistance: 980, totalDuration: 18, viaCities: ["PUNE", "KOLHAPUR", "HUBLI"], routeDetails: [], mergedFrom: [], mergeDate: new Date(), status: "active", createdAt: new Date(), updatedAt: new Date() },
];

const sampleMergeHistory: MergeHistory[] = [
  { id: 1, mergeId: "MRG001", mergeDate: new Date("2026-05-28"), primaryRouteId: 1, primaryRouteName: "DELHI-MUMBAI EXPRESS", secondaryRouteIds: [2], secondaryRouteNames: ["DELHI-MUMBAI SCENIC"], newRouteId: 5, newRouteName: "DELHI-MUMBAI OPTIMIZED", mergedBy: "admin@cargomax.com", reason: "Time optimization", status: "success" },
  { id: 2, mergeId: "MRG002", mergeDate: new Date("2026-05-29"), primaryRouteId: 4, primaryRouteName: "MUMBAI-BANGALORE EXPRESS", secondaryRouteIds: [], secondaryRouteNames: [], newRouteId: 6, newRouteName: "MUMBAI-BANGALORE VIA PUNE", mergedBy: "admin@cargomax.com", reason: "Adding pit stop", status: "pending" },
];

export default function RouteMergeTool() {
  // Main Tab state
  const [mainTab, setMainTab] = useState<"merge" | "history">("merge");
  
  // Sheet state for route selection
  const [isMergeSheetOpen, setIsMergeSheetOpen] = useState(false);
  const [isResultSheetOpen, setIsResultSheetOpen] = useState(false);
  
  // Route selection state
  const [selectedPrimaryRoute, setSelectedPrimaryRoute] = useState<RouteRecord | null>(null);
  const [selectedSecondaryRoutes, setSelectedSecondaryRoutes] = useState<RouteRecord[]>([]);
  
  // Merge result state
  const [mergedRoute, setMergedRoute] = useState<RouteRecord | null>(null);
  const [mergeReason, setMergeReason] = useState<string>("");
  
  // Search state
  const [searchOrigin, setSearchOrigin] = useState<string>("all");
  const [searchDestination, setSearchDestination] = useState<string>("all");
  const [searchStatus, setSearchStatus] = useState<string>("all");
  const [searchResults, setSearchResults] = useState<RouteRecord[]>([]);
  const [mergeHistory, setMergeHistory] = useState<MergeHistory[]>(sampleMergeHistory);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [historyCurrentPage, setHistoryCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  const [routes, setRoutes] = useState<RouteRecord[]>(sampleRoutes);
  const [loading, setLoading] = useState(false);
  const [mergeResult, setMergeResult] = useState<RouteRecord | null>(null);
  const [selectedRouteIds, setSelectedRouteIds] = useState<number[]>([]);

  // Load routes on mount
  useEffect(() => {
    setSearchResults(routes.filter(r => r.status === "active"));
  }, []);

  const handleSearch = () => {
    let results = routes.filter(r => r.status === "active");
    if (searchOrigin !== "all") {
      results = results.filter(r => r.origin === searchOrigin);
    }
    if (searchDestination !== "all") {
      results = results.filter(r => r.destination === searchDestination);
    }
    if (searchStatus !== "all") {
      results = results.filter(r => r.status === searchStatus);
    }
    setSearchResults(results);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchOrigin("all");
    setSearchDestination("all");
    setSearchStatus("all");
    setSearchResults(routes.filter(r => r.status === "active"));
    setCurrentPage(1);
  };

  const handleSelectPrimaryRoute = (route: RouteRecord) => {
    setSelectedPrimaryRoute(route);
    setSelectedSecondaryRoutes([]);
    setSelectedRouteIds([route.id]);
    setIsMergeSheetOpen(true);
  };

  const handleToggleSecondaryRoute = (route: RouteRecord) => {
    if (selectedSecondaryRoutes.find(r => r.id === route.id)) {
      setSelectedSecondaryRoutes(selectedSecondaryRoutes.filter(r => r.id !== route.id));
      setSelectedRouteIds(selectedRouteIds.filter(id => id !== route.id));
    } else {
      setSelectedSecondaryRoutes([...selectedSecondaryRoutes, route]);
      setSelectedRouteIds([...selectedRouteIds, route.id]);
    }
  };

  const handleMergeRoutes = () => {
    if (!selectedPrimaryRoute) {
      alert("Please select a primary route");
      return;
    }
    if (!mergeReason) {
      alert("Please enter merge reason");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // Calculate merged route details
      const totalDistance = selectedPrimaryRoute.totalDistance + 
        selectedSecondaryRoutes.reduce((sum, r) => sum + r.totalDistance, 0);
      const totalDuration = selectedPrimaryRoute.totalDuration + 
        selectedSecondaryRoutes.reduce((sum, r) => sum + r.totalDuration, 0);
      
      const allViaCities = [
        ...selectedPrimaryRoute.viaCities,
        ...selectedSecondaryRoutes.flatMap(r => r.viaCities)
      ];
      
      const uniqueViaCities = [...new Set(allViaCities)];
      
      const newRoute: RouteRecord = {
        id: Date.now(),
        routeCode: `MRG${String(routes.length + 1).padStart(3, "0")}`,
        routeName: `${selectedPrimaryRoute.origin}-${selectedPrimaryRoute.destination} MERGED`,
        routeType: "primary",
        origin: selectedPrimaryRoute.origin,
        destination: selectedPrimaryRoute.destination,
        totalDistance: Math.round(totalDistance / (selectedSecondaryRoutes.length + 1)),
        totalDuration: Math.round(totalDuration / (selectedSecondaryRoutes.length + 1)),
        viaCities: uniqueViaCities.slice(0, 8),
        routeDetails: [],
        mergedFrom: [selectedPrimaryRoute.id, ...selectedSecondaryRoutes.map(r => r.id)],
        mergeDate: new Date(),
        status: "merged",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setMergedRoute(newRoute);
      setMergeResult(newRoute);
      
      // Add to merge history
      const newHistory: MergeHistory = {
        id: mergeHistory.length + 1,
        mergeId: `MRG${String(mergeHistory.length + 1).padStart(3, "0")}`,
        mergeDate: new Date(),
        primaryRouteId: selectedPrimaryRoute.id,
        primaryRouteName: selectedPrimaryRoute.routeName,
        secondaryRouteIds: selectedSecondaryRoutes.map(r => r.id),
        secondaryRouteNames: selectedSecondaryRoutes.map(r => r.routeName),
        newRouteId: newRoute.id,
        newRouteName: newRoute.routeName,
        mergedBy: "MAYANK.GRLOGISTICS@GMAIL.COM",
        reason: mergeReason,
        status: "success",
      };
      
      setMergeHistory([newHistory, ...mergeHistory]);
      
      // Update routes status
      const updatedRoutes = routes.map(r => {
        if (r.id === selectedPrimaryRoute.id || selectedSecondaryRoutes.some(sr => sr.id === r.id)) {
          return { ...r, status: "merged" as const };
        }
        return r;
      });
      setRoutes([...updatedRoutes, newRoute]);
      setSearchResults([...updatedRoutes, newRoute].filter(r => r.status === "active"));
      
      setLoading(false);
      setIsMergeSheetOpen(false);
      setIsResultSheetOpen(true);
      alert("Routes merged successfully!");
    }, 1500);
  };

  const handleSaveMergedRoute = () => {
    if (mergeResult) {
      setIsResultSheetOpen(false);
      setMergeResult(null);
      setSelectedPrimaryRoute(null);
      setSelectedSecondaryRoutes([]);
      setMergeReason("");
      alert(`Merged route ${mergeResult.routeCode} saved successfully!`);
    }
  };

  const handleCancelMerge = () => {
    setIsMergeSheetOpen(false);
    setSelectedPrimaryRoute(null);
    setSelectedSecondaryRoutes([]);
    setMergeReason("");
    setSelectedRouteIds([]);
  };

  // Get available secondary routes (excluding primary)
  const getAvailableSecondaryRoutes = () => {
    return routes.filter(r => 
      r.status === "active" && 
      r.id !== selectedPrimaryRoute?.id &&
      r.origin === selectedPrimaryRoute?.origin &&
      r.destination === selectedPrimaryRoute?.destination
    );
  };

  // Stats
  const stats = {
    totalRoutes: routes.length,
    activeRoutes: routes.filter(r => r.status === "active").length,
    mergedRoutes: routes.filter(r => r.status === "merged").length,
    totalMerges: mergeHistory.length,
  };

  // Pagination
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const paginatedResults = searchResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  const historyTotalPages = Math.ceil(mergeHistory.length / itemsPerPage);
  const paginatedHistory = mergeHistory.slice((historyCurrentPage - 1) * itemsPerPage, historyCurrentPage * itemsPerPage);
  const goToHistoryPage = (page: number) => setHistoryCurrentPage(Math.max(1, Math.min(page, historyTotalPages)));

  return (
    <div className="space-y-4 p-3 md:p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <GitMerge className="h-5 w-5 text-blue-600" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">ROUTE MERGE TOOL</h1>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Total Routes</p>
                <p className="text-2xl font-bold">{stats.totalRoutes}</p>
              </div>
              <Route className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Active Routes</p>
                <p className="text-2xl font-bold">{stats.activeRoutes}</p>
              </div>
              <Navigation className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Merged Routes</p>
                <p className="text-2xl font-bold">{stats.mergedRoutes}</p>
              </div>
              <GitMerge className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Total Merges</p>
                <p className="text-2xl font-bold">{stats.totalMerges}</p>
              </div>
              <History className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b bg-white rounded-t-lg">
        <button
          onClick={() => setMainTab("merge")}
          className={cn(
            "px-6 py-2.5 text-sm font-medium transition-all rounded-t-lg flex items-center gap-2",
            mainTab === "merge"
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          )}
        >
          <GitMerge className="h-4 w-4" />
          Merge Routes
        </button>
        <button
          onClick={() => setMainTab("history")}
          className={cn(
            "px-6 py-2.5 text-sm font-medium transition-all rounded-t-lg flex items-center gap-2",
            mainTab === "history"
              ? "bg-green-600 text-white shadow-md"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          )}
        >
          <History className="h-4 w-4" />
          Merge History
        </button>
      </div>

      {/* Merge Routes Tab */}
      {mainTab === "merge" && (
        <>
          {/* Search Filters */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Search className="h-4 w-4" />
                Search Routes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">Origin</Label>
                  <Select value={searchOrigin} onValueChange={setSearchOrigin}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="All Origins" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Origins</SelectItem>
                      {locationOptions.map(opt => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">Destination</Label>
                  <Select value={searchDestination} onValueChange={setSearchDestination}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="All Destinations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Destinations</SelectItem>
                      {locationOptions.map(opt => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">Status</Label>
                  <Select value={searchStatus} onValueChange={setSearchStatus}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="merged">Merged</SelectItem>
                    </SelectContent>
                  </Select>
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

          {/* Routes Table */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Route className="h-3.5 w-3.5 text-gray-500" />
                  <h3 className="text-[11px] font-semibold text-gray-800">Available Routes</h3>
                </div>
                <div className="text-[10px] text-gray-500">Total: {searchResults.length} records</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <div className="min-w-[800px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="text-[11px] font-semibold py-2 px-2 w-12 text-center">#</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Route Code</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[180px]">Route Name</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">Origin</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">Destination</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 w-[60px] text-center">Distance</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 w-[60px] text-center">Duration</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 w-20 text-center">Status</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 w-24 text-center">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedResults.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                            <Route className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            No routes found
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
                                {record.routeCode}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-2 px-2 text-xs font-medium">{record.routeName}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{record.origin}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{record.destination}</TableCell>
                            <TableCell className="py-2 px-2 text-center text-xs">{record.totalDistance} km</TableCell>
                            <TableCell className="py-2 px-2 text-center text-xs">{record.totalDuration} hrs</TableCell>
                            <TableCell className="py-2 px-2 text-center">
                              {record.status === "active" ? (
                                <Badge className="bg-green-100 text-green-700 text-[10px]">Active</Badge>
                              ) : record.status === "merged" ? (
                                <Badge className="bg-purple-100 text-purple-700 text-[10px]">Merged</Badge>
                              ) : (
                                <Badge className="bg-gray-100 text-gray-700 text-[10px]">Inactive</Badge>
                              )}
                            </TableCell>
                            <TableCell className="py-2 px-2 text-center">
                              {record.status === "active" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleSelectPrimaryRoute(record)}
                                  className="h-7 w-7 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                  title="Merge Route"
                                >
                                  <GitMerge className="h-3.5 w-3.5" />
                                </Button>
                              )}
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

      {/* Merge History Tab */}
      {mainTab === "history" && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <History className="h-3.5 w-3.5 text-gray-500" />
                <h3 className="text-[11px] font-semibold text-gray-800">Merge History</h3>
              </div>
              <div className="text-[10px] text-gray-500">Total: {mergeHistory.length} records</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <div className="min-w-[1000px]">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-[11px] font-semibold py-2 px-2 w-12 text-center">#</TableHead>
                      <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Merge ID</TableHead>
                      <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">Merge Date</TableHead>
                      <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[180px]">Primary Route</TableHead>
                      <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[180px]">Secondary Routes</TableHead>
                      <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[150px]">New Route</TableHead>
                      <TableHead className="text-[11px] font-semibold py-2 px-2 w-20 text-center">Status</TableHead>
                      <TableHead className="text-[11px] font-semibold py-2 px-2 w-24 text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedHistory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                          <History className="h-12 w-12 mx-auto mb-3 opacity-30" />
                          No merge history found
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedHistory.map((record, idx) => (
                        <TableRow key={record.id} className="hover:bg-gray-50">
                          <TableCell className="py-2 px-2 text-center text-xs">
                            {(historyCurrentPage - 1) * itemsPerPage + idx + 1}
                          </TableCell>
                          <TableCell className="py-2 px-2 font-mono font-semibold text-xs">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 text-[11px]">
                              {record.mergeId}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-2 px-2 text-xs">{format(record.mergeDate, "dd-MM-yyyy")}</TableCell>
                          <TableCell className="py-2 px-2 text-xs">{record.primaryRouteName}</TableCell>
                          <TableCell className="py-2 px-2 text-xs">
                            {record.secondaryRouteNames.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {record.secondaryRouteNames.slice(0, 2).map(name => (
                                  <Badge key={name} variant="outline" className="text-[10px]">{name}</Badge>
                                ))}
                                {record.secondaryRouteNames.length > 2 && (
                                  <span className="text-[10px] text-gray-500">+{record.secondaryRouteNames.length - 2}</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell className="py-2 px-2 text-xs font-medium text-green-600">
                            {record.newRouteName}
                          </TableCell>
                          <TableCell className="py-2 px-2 text-center">
                            {record.status === "success" ? (
                              <Badge className="bg-green-100 text-green-700 text-[10px]">Success</Badge>
                            ) : record.status === "pending" ? (
                              <Badge className="bg-yellow-100 text-yellow-700 text-[10px]">Pending</Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-700 text-[10px]">Failed</Badge>
                            )}
                          </TableCell>
                          <TableCell className="py-2 px-2 text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => alert(`Viewing merge details for ${record.mergeId}`)}
                              className="h-7 w-7 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                              title="View Details"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Pagination for History */}
            {historyTotalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-[10px] text-gray-500">
                  Showing {((historyCurrentPage - 1) * itemsPerPage) + 1} to {Math.min(historyCurrentPage * itemsPerPage, mergeHistory.length)} of {mergeHistory.length} entries
                </div>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" onClick={() => goToHistoryPage(historyCurrentPage - 1)} disabled={historyCurrentPage === 1} className="h-7 text-[10px]">
                    <ChevronLeft className="h-3 w-3 mr-1" /> Previous
                  </Button>
                  <span className="px-3 py-1 text-[10px]">Page {historyCurrentPage} of {historyTotalPages}</span>
                  <Button variant="outline" size="sm" onClick={() => goToHistoryPage(historyCurrentPage + 1)} disabled={historyCurrentPage === historyTotalPages} className="h-7 text-[10px]">
                    Next <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Merge Routes Sheet */}
      <Sheet open={isMergeSheetOpen} onOpenChange={setIsMergeSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle className="flex items-center gap-2 text-base">
              <GitMerge className="h-4 w-4 text-blue-600" />
              Merge Routes
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-4">
            {/* Primary Route Info */}
            <div className="border rounded-md p-3 bg-blue-50">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Flag className="h-4 w-4 text-blue-600" />
                Primary Route
              </h3>
              {selectedPrimaryRoute && (
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Code:</span> {selectedPrimaryRoute.routeCode}</p>
                  <p><span className="font-medium">Name:</span> {selectedPrimaryRoute.routeName}</p>
                  <p><span className="font-medium">Path:</span> {selectedPrimaryRoute.origin} → {selectedPrimaryRoute.destination}</p>
                  <p><span className="font-medium">Distance:</span> {selectedPrimaryRoute.totalDistance} km | <span className="font-medium">Duration:</span> {selectedPrimaryRoute.totalDuration} hrs</p>
                  <p><span className="font-medium">Via:</span> {selectedPrimaryRoute.viaCities.join(" → ")}</p>
                </div>
              )}
            </div>

            {/* Secondary Routes Selection */}
            <div className="border rounded-md p-3">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Layers className="h-4 w-4 text-purple-600" />
                Secondary Routes to Merge
              </h3>
              <p className="text-xs text-gray-500 mb-3">Select routes to merge with primary route (same origin-destination)</p>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {getAvailableSecondaryRoutes().length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-4">No secondary routes available for this route</p>
                ) : (
                  getAvailableSecondaryRoutes().map(route => (
                    <label key={route.id} className="flex items-start gap-3 p-2 border rounded-md hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedSecondaryRoutes.some(r => r.id === route.id)}
                        onChange={() => handleToggleSecondaryRoute(route)}
                        className="mt-0.5 h-4 w-4 rounded border-gray-300"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{route.routeName}</p>
                        <p className="text-xs text-gray-500">{route.origin} → {route.destination} | {route.totalDistance} km | {route.totalDuration} hrs</p>
                        <p className="text-xs text-gray-400">Via: {route.viaCities.slice(0, 3).join(" → ")}</p>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Merge Reason */}
            <div className="space-y-1">
              <Label className="text-sm font-medium">
                Merge Reason <span className="text-red-500">*</span>
              </Label>
              <Textarea
                value={mergeReason}
                onChange={(e) => setMergeReason(e.target.value)}
                placeholder="Enter reason for merging these routes..."
                rows={3}
                className="text-sm resize-none"
              />
            </div>

            {/* Merge Preview */}
            {selectedSecondaryRoutes.length > 0 && (
              <div className="border rounded-md p-3 bg-gray-50">
                <h3 className="text-sm font-semibold mb-2">Merge Preview</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Routes to merge:</span> {1 + selectedSecondaryRoutes.length}</p>
                  <p>
  <span className="font-medium">Total distance:</span>{" "}
  {(selectedPrimaryRoute?.totalDistance || 0) +
    (selectedSecondaryRoutes?.reduce(
      (sum, r) => sum + (r.totalDistance || 0),
      0
    ) || 0)} km
</p>
                  <p><span className="font-medium">Combined via points:</span> {
                    [...(selectedPrimaryRoute?.viaCities || []), ...selectedSecondaryRoutes.flatMap(r => r.viaCities)]
                      .filter((v, i, a) => a.indexOf(v) === i).length
                  } unique locations</p>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={handleCancelMerge} className="h-8 text-xs">
                <X className="mr-1 h-3 w-3" /> Cancel
              </Button>
              <Button 
                onClick={handleMergeRoutes} 
                size="sm" 
                className="h-8 text-xs bg-blue-600 hover:bg-blue-700"
                disabled={loading || selectedSecondaryRoutes.length === 0 || !mergeReason}
              >
                {loading ? (
                  <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                ) : (
                  <GitMerge className="mr-1 h-3 w-3" />
                )}
                Merge Routes
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Merge Result Sheet */}
      <Sheet open={isResultSheetOpen} onOpenChange={setIsResultSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle className="flex items-center gap-2 text-base">
              <Check className="h-4 w-4 text-green-600" />
              Merge Result
            </SheetTitle>
          </SheetHeader>

          {mergeResult && (
            <div className="space-y-4">
              <div className="border rounded-md p-3 bg-green-50">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="text-sm font-semibold text-green-700">Merge Successful!</h3>
                </div>
                <p className="text-xs text-green-600">New route created successfully</p>
              </div>

              <div className="border rounded-md p-3">
                <h3 className="text-sm font-semibold mb-2">New Route Details</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Route Code:</span> {mergeResult.routeCode}</p>
                  <p><span className="font-medium">Route Name:</span> {mergeResult.routeName}</p>
                  <p><span className="font-medium">Path:</span> {mergeResult.origin} → {mergeResult.destination}</p>
                  <p><span className="font-medium">Total Distance:</span> {mergeResult.totalDistance} km</p>
                  <p><span className="font-medium">Estimated Duration:</span> {mergeResult.totalDuration} hours</p>
                  <p><span className="font-medium">Via Cities:</span> {mergeResult.viaCities.join(" → ")}</p>
                </div>
              </div>

              <div className="border rounded-md p-3">
                <h3 className="text-sm font-semibold mb-2">Merge Summary</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Primary Route:</span> {selectedPrimaryRoute?.routeName}</p>
                  <p><span className="font-medium">Secondary Routes:</span> {selectedSecondaryRoutes.map(r => r.routeName).join(", ")}</p>
                  <p><span className="font-medium">Merged By:</span> MAYANK.GRLOGISTICS@GMAIL.COM</p>
                  <p><span className="font-medium">Merge Date:</span> {format(new Date(), "dd-MM-yyyy HH:mm:ss")}</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsResultSheetOpen(false)} className="h-8 text-xs">
                  Close
                </Button>
                <Button onClick={handleSaveMergedRoute} size="sm" className="h-8 text-xs bg-green-600 hover:bg-green-700">
                  <Save className="mr-1 h-3 w-3" />
                  Save Route
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}