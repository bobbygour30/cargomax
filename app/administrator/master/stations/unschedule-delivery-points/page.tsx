"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Save,
  RefreshCw,
  Search,
  Pencil,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ------------------------------
//  Types
// ------------------------------
interface UnschedulePoint {
  id: number;
  stationCode: string;
  active: boolean;
  city: string;
  pinCode: string;
  state: string;
  country: string;
  latitude: string;
  longitude: string;
  zone: string;
  stationName: string;
  shortCode: string;
  controlledBy: string;
  hubName: string;
  mergeStation: string;
  mobileNo: string;
  invoiceCode: string;
  allowBooking: boolean;
  allowDelivery: boolean;
  allowBidding: boolean;
}

// Options
const zones = ["north zone", "south zone", "east zone", "western zone", "central zone"];

// Mock data
const mockPoints: UnschedulePoint[] = [
  {
    id: 1,
    stationCode: "US001",
    active: true,
    city: "Ahmedabad",
    pinCode: "382427",
    state: "Gujarat",
    country: "India",
    latitude: "23.0225",
    longitude: "72.5714",
    zone: "west zone",
    stationName: "Ahmedabad Unschedule Point",
    shortCode: "AMD",
    controlledBy: "GHAZIABAD R.O",
    hubName: "AHMEDABAD-ASALAI (HUB)",
    mergeStation: "",
    mobileNo: "9876543210",
    invoiceCode: "INV001",
    allowBooking: true,
    allowDelivery: true,
    allowBidding: false,
  },
  {
    id: 2,
    stationCode: "US002",
    active: true,
    city: "Delhi",
    pinCode: "110082",
    state: "Delhi",
    country: "India",
    latitude: "28.7041",
    longitude: "77.1025",
    zone: "north zone",
    stationName: "Delhi Unschedule Point",
    shortCode: "DEL",
    controlledBy: "GHAZIABAD R.O",
    hubName: "KHERA KALAN (HUB)",
    mergeStation: "",
    mobileNo: "9876543211",
    invoiceCode: "",
    allowBooking: true,
    allowDelivery: false,
    allowBidding: false,
  },
];

export default function UnscheduleDeliveryPoints() {
  const [activeTab, setActiveTab] = useState<"entry" | "search">("entry");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchStationName, setSearchStationName] = useState("");
  const [searchZoneName, setSearchZoneName] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [points, setPoints] = useState<UnschedulePoint[]>(mockPoints);
  const [filteredPoints, setFilteredPoints] = useState<UnschedulePoint[]>([]);

  // Form state
  const [formData, setFormData] = useState<UnschedulePoint>({
    id: 0,
    stationCode: "",
    active: true,
    city: "",
    pinCode: "",
    state: "",
    country: "India",
    latitude: "",
    longitude: "",
    zone: "",
    stationName: "",
    shortCode: "",
    controlledBy: "",
    hubName: "",
    mergeStation: "",
    mobileNo: "",
    invoiceCode: "",
    allowBooking: false,
    allowDelivery: false,
    allowBidding: false,
  });

  // Helper functions
  const generateStationCode = () => {
    const maxCode = points.reduce((max, p) => {
      const num = parseInt(p.stationCode.substring(2)) || 0;
      return Math.max(max, num);
    }, 0);
    return `US${String(maxCode + 1).padStart(3, "0")}`;
  };

  const resetForm = () => {
    setFormData({
      id: 0,
      stationCode: generateStationCode(),
      active: true,
      city: "",
      pinCode: "",
      state: "",
      country: "India",
      latitude: "",
      longitude: "",
      zone: "",
      stationName: "",
      shortCode: "",
      controlledBy: "",
      hubName: "",
      mergeStation: "",
      mobileNo: "",
      invoiceCode: "",
      allowBooking: false,
      allowDelivery: false,
      allowBidding: false,
    });
    setEditId(null);
  };

  const handleSave = () => {
    if (!formData.city) { alert("City is required"); return; }
    if (!formData.zone) { alert("Zone is required"); return; }
    if (!formData.stationName) { alert("Station Name is required"); return; }
    if (!formData.controlledBy) { alert("Controlled By is required"); return; }

    setLoading(true);
    setTimeout(() => {
      if (editId) {
        setPoints(points.map(p => p.id === editId ? { ...formData, id: editId } : p));
        alert("Record updated");
      } else {
        const newPoint = { ...formData, id: Date.now(), stationCode: generateStationCode() };
        setPoints([...points, newPoint]);
        alert("Record saved");
      }
      resetForm();
      setActiveTab("search");
      setLoading(false);
    }, 500);
  };

  const handleEdit = (point: UnschedulePoint) => {
    setFormData({ ...point });
    setEditId(point.id);
    setActiveTab("entry");
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this unschedule delivery point?")) {
      setPoints(points.filter(p => p.id !== id));
      alert("Deleted");
    }
  };

  const handleSearch = () => {
    let results = [...points];
    if (searchStationName) {
      results = results.filter(p => p.stationName.toLowerCase().includes(searchStationName.toLowerCase()));
    }
    if (searchZoneName !== "ALL") {
      results = results.filter(p => p.zone === searchZoneName);
    }
    if (searchTerm) {
      results = results.filter(p =>
        p.stationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.stationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredPoints(results);
    setCurrentPage(1);
  };

  const paginated = (filteredPoints.length ? filteredPoints : points).slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil((filteredPoints.length ? filteredPoints.length : points.length) / itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">UNSCHEDULE DELIVERY POINTS</h1>
        <div className="mt-1 text-[10px] md:text-xs text-muted-foreground break-words">
          Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD | Login By : MAYANK.GRLOGISTICS@GMAIL.COM | Login Branch : CORPORATE OFFICE | FY : 2026-2027
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button onClick={() => { setActiveTab("entry"); resetForm(); }} className={cn("px-4 py-2 text-sm font-medium", activeTab === "entry" ? "border-b-2 border-primary text-primary" : "text-muted-foreground")}>Entry</button>
        <button onClick={() => { setActiveTab("search"); setFilteredPoints([]); setSearchStationName(""); setSearchZoneName("ALL"); setSearchTerm(""); setCurrentPage(1); }} className={cn("px-4 py-2 text-sm font-medium", activeTab === "search" ? "border-b-2 border-primary text-primary" : "text-muted-foreground")}>Search</button>
      </div>

      {/* Entry Tab */}
      {activeTab === "entry" && (
        <Card>
          <CardHeader><CardTitle className="text-base">Unschedule Delivery Point Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div><Label className="text-xs">Station Code</Label><Input value={formData.stationCode} readOnly className="h-8 text-xs bg-muted" /></div>
              <div className="flex items-center gap-2 mt-6"><Checkbox checked={formData.active} onCheckedChange={(c) => setFormData({ ...formData, active: !!c })} id="active" /><Label htmlFor="active" className="text-xs">Active</Label></div>
              <div><Label className="text-xs">City <span className="text-red-500">*</span></Label><Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Pin Code</Label><Input value={formData.pinCode} onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">State</Label><Input value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Country</Label><Input value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Latitude</Label><Input value={formData.latitude} onChange={(e) => setFormData({ ...formData, latitude: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Longitude</Label><Input value={formData.longitude} onChange={(e) => setFormData({ ...formData, longitude: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Zone <span className="text-red-500">*</span></Label>
                <Select value={formData.zone} onValueChange={(v) => setFormData({ ...formData, zone: v })}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                  <SelectContent>{zones.map(z => (<SelectItem key={z} value={z}>{z.toUpperCase()}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs">Station Name <span className="text-red-500">*</span></Label><Input value={formData.stationName} onChange={(e) => setFormData({ ...formData, stationName: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Short Code</Label><Input value={formData.shortCode} onChange={(e) => setFormData({ ...formData, shortCode: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Controlled By <span className="text-red-500">*</span></Label><Input value={formData.controlledBy} onChange={(e) => setFormData({ ...formData, controlledBy: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Hub Name</Label><Input value={formData.hubName} onChange={(e) => setFormData({ ...formData, hubName: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Merge Station</Label><Input value={formData.mergeStation} onChange={(e) => setFormData({ ...formData, mergeStation: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Mobile #</Label><Input value={formData.mobileNo} onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Invoice Code</Label><Input value={formData.invoiceCode} onChange={(e) => setFormData({ ...formData, invoiceCode: e.target.value })} className="h-8 text-xs" /></div>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2"><Checkbox checked={formData.allowBooking} onCheckedChange={(c) => setFormData({ ...formData, allowBooking: !!c })} id="allowBooking" /><Label className="text-xs">Booking</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.allowDelivery} onCheckedChange={(c) => setFormData({ ...formData, allowDelivery: !!c })} id="allowDelivery" /><Label className="text-xs">Delivery</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.allowBidding} onCheckedChange={(c) => setFormData({ ...formData, allowBidding: !!c })} id="allowBidding" /><Label className="text-xs">Allow Bidding</Label></div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button onClick={handleSave} size="sm" className="bg-green-600" disabled={loading}><Save className="mr-1 h-3 w-3" />{editId ? "UPDATE" : "SAVE"}</Button>
              <Button onClick={resetForm} variant="outline" size="sm"><RefreshCw className="mr-1 h-3 w-3" />CLEAR</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Tab */}
      {activeTab === "search" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 border rounded-md bg-muted/20">
            <div><Label className="text-xs">Station Name</Label><Input value={searchStationName} onChange={(e) => setSearchStationName(e.target.value)} className="h-8 text-xs" /></div>
            <div><Label className="text-xs">Zone Name</Label>
              <Select value={searchZoneName} onValueChange={setSearchZoneName}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="ALL" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">ALL</SelectItem>
                  {zones.map(z => (<SelectItem key={z} value={z}>{z.toUpperCase()}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end"><Button onClick={handleSearch} size="sm" className="h-8 text-xs w-full sm:w-auto">SHOW DETAILS</Button></div>
          </div>
          <div className="flex gap-2"><div className="relative flex-1 max-w-md"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" /><Input placeholder="Search by Station Name, Code or City..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 h-8 text-xs" /></div><Button onClick={handleSearch} size="sm" className="h-8 text-xs"><Search className="mr-1 h-3.5 w-3.5" />SEARCH</Button></div>

          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[700px] md:min-w-[900px]">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12 text-center">S#</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Unschedule Station Name</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-24 text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map((point, idx) => (
                    <TableRow key={point.id}>
                      <TableCell className="text-center">{(currentPage-1)*itemsPerPage+idx+1}</TableCell>
                      <TableCell>{point.stationCode}</TableCell>
                      <TableCell className="font-medium">{point.stationName}</TableCell>
                      <TableCell>{point.city}</TableCell>
                      <TableCell>
                        <span className={cn("px-2 py-0.5 rounded-full text-[10px]", point.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                          {point.active ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(point)} className="h-6 w-6 p-0 text-blue-500"><Pencil className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(point.id)} className="h-6 w-6 p-0 text-red-500"><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {paginated.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8">No records found</TableCell></TableRow>}
                </TableBody>
              </Table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-1">
              <Button variant="outline" size="sm" onClick={() => goToPage(currentPage-1)} disabled={currentPage===1}>Previous</Button>
              <span className="px-3 py-1 text-xs bg-muted rounded-md">Page {currentPage} of {totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => goToPage(currentPage+1)} disabled={currentPage===totalPages}>Next</Button>
            </div>
          )}
        </div>
      )}

      {/* Info Note */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 rounded-md p-3">
        <div className="flex items-start gap-2"><AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" /><div className="text-xs text-blue-700 dark:text-blue-400">Fields marked * are mandatory. Station Code is auto‑generated.</div></div>
      </div>
    </div>
  );
}