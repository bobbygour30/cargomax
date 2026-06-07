"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CalendarIcon,
  Save,
  RefreshCw,
  Search,
  Pencil,
  X,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// ------------------------------
//  Types
// ------------------------------
interface Zonal {
  id: number;
  roCode: string;
  activeDate: Date;
  roName: string;
  displayName: string;
  address: string;
  contactNo: string;
  city: string;
  pinCode: string;
  manager: string;
  state: string;
  country: string;
  mobileNo: string;
  latitude: string;
  longitude: string;
  secondaryMobileNo: string;
  zone: string;
  emailId: string;
  imprestLedger: string;
  stationaryControl: boolean;
  allowPickupDeliveryPoint: boolean;
  shortCode: string;
  invoiceCode: string;
  allowCashGatePassOnly: boolean;
  fundHold: boolean;
  createGodown: boolean;
  status: "active" | "inactive";
}

// Constants
const zones = ["north zone", "south zone", "east zone", "western zone", "central zone"];

// Mock data
const mockZonals: Zonal[] = [
  {
    id: 1, roCode: "101", activeDate: new Date("2026-04-01"), roName: "GHAZIABAD R.O",
    displayName: "", address: "", contactNo: "", city: "NEW DELHI", pinCode: "",
    manager: "", state: "", country: "India", mobileNo: "", latitude: "", longitude: "",
    secondaryMobileNo: "", zone: "north zone", emailId: "", imprestLedger: "",
    stationaryControl: false, allowPickupDeliveryPoint: false, shortCode: "",
    invoiceCode: "", allowCashGatePassOnly: false, fundHold: false, createGodown: false,
    status: "active",
  },
];

export default function ZonalMaster() {
  const [activeTab, setActiveTab] = useState<"entry" | "search">("entry");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchStationName, setSearchStationName] = useState("");
  const [searchZoneName, setSearchZoneName] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [zonals, setZonals] = useState<Zonal[]>(mockZonals);
  const [filteredZonals, setFilteredZonals] = useState<Zonal[]>([]);

  // Form state
  const [formData, setFormData] = useState<Zonal>({
    id: 0, roCode: "", activeDate: new Date("2026-04-01"), roName: "", displayName: "",
    address: "", contactNo: "", city: "", pinCode: "", manager: "", state: "",
    country: "India", mobileNo: "", latitude: "", longitude: "", secondaryMobileNo: "",
    zone: "", emailId: "", imprestLedger: "", stationaryControl: false,
    allowPickupDeliveryPoint: false, shortCode: "", invoiceCode: "",
    allowCashGatePassOnly: false, fundHold: false, createGodown: false, status: "active",
  });

  // Modal states
  const [closeStationModalOpen, setCloseStationModalOpen] = useState(false);
  const [closeStationZonal, setCloseStationZonal] = useState<Zonal | null>(null);
  const [closeDate, setCloseDate] = useState<Date>(new Date());
  const [closeReason, setCloseReason] = useState("");

  // Helper functions
  const generateRoCode = () => {
    const maxCode = zonals.reduce((max, z) => Math.max(max, parseInt(z.roCode) || 0), 0);
    return (maxCode + 1).toString();
  };

  const resetForm = () => {
    setFormData({
      id: 0, roCode: generateRoCode(), activeDate: new Date("2026-04-01"), roName: "",
      displayName: "", address: "", contactNo: "", city: "", pinCode: "", manager: "",
      state: "", country: "India", mobileNo: "", latitude: "", longitude: "",
      secondaryMobileNo: "", zone: "", emailId: "", imprestLedger: "",
      stationaryControl: false, allowPickupDeliveryPoint: false, shortCode: "",
      invoiceCode: "", allowCashGatePassOnly: false, fundHold: false, createGodown: false,
      status: "active",
    });
    setEditId(null);
  };

  const handleSave = () => {
    if (!formData.roName) { alert("R.O. Name is required"); return; }
    if (!formData.address) { alert("Address is required"); return; }
    if (!formData.city) { alert("City is required"); return; }
    if (!formData.zone) { alert("Zone is required"); return; }

    setLoading(true);
    setTimeout(() => {
      if (editId) {
        setZonals(zonals.map(z => z.id === editId ? { ...formData, id: editId } : z));
        alert("Zonal updated");
      } else {
        const newZonal = { ...formData, id: Date.now(), roCode: generateRoCode() };
        setZonals([...zonals, newZonal]);
        alert("Zonal saved");
      }
      resetForm();
      setActiveTab("search");
      setLoading(false);
    }, 500);
  };

  const handleEdit = (zonal: Zonal) => {
    setFormData({ ...zonal });
    setEditId(zonal.id);
    setActiveTab("entry");
  };

  const handleSearch = () => {
    let results = [...zonals];
    if (searchStationName) {
      results = results.filter(z => z.roName.toLowerCase().includes(searchStationName.toLowerCase()));
    }
    if (searchZoneName !== "ALL") {
      results = results.filter(z => z.zone === searchZoneName);
    }
    if (searchTerm) {
      results = results.filter(z =>
        z.roName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        z.roCode.includes(searchTerm) ||
        z.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredZonals(results);
    setCurrentPage(1);
  };

  const handleCloseStation = (zonal: Zonal) => {
    setCloseStationZonal(zonal);
    setCloseDate(new Date());
    setCloseReason("");
    setCloseStationModalOpen(true);
  };

  const handleCloseSubmit = () => {
    if (!closeDate) { alert("Close Date is required"); return; }
    if (!closeReason.trim()) { alert("Reason is required"); return; }
    // In a real app, update the status or delete
    alert(`Zonal ${closeStationZonal?.roName} closed on ${format(closeDate, "dd-MM-yyyy")}`);
    setCloseStationModalOpen(false);
  };

  const paginated = (filteredZonals.length ? filteredZonals : zonals).slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil((filteredZonals.length ? filteredZonals.length : zonals.length) / itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">ZONAL MASTER</h1>
        <div className="mt-1 text-[10px] md:text-xs text-muted-foreground break-words">
          Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD | Login By : MAYANK.GRLOGISTICS@GMAIL.COM | Login Branch : CORPORATE OFFICE | FY : 2026-2027
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button onClick={() => { setActiveTab("entry"); resetForm(); }} className={cn("px-4 py-2 text-sm font-medium", activeTab === "entry" ? "border-b-2 border-primary text-primary" : "text-muted-foreground")}>Entry</button>
        <button onClick={() => { setActiveTab("search"); setFilteredZonals([]); setSearchStationName(""); setSearchZoneName("ALL"); setSearchTerm(""); setCurrentPage(1); }} className={cn("px-4 py-2 text-sm font-medium", activeTab === "search" ? "border-b-2 border-primary text-primary" : "text-muted-foreground")}>Search</button>
      </div>

      {/* Entry Tab */}
      {activeTab === "entry" && (
        <Card>
          <CardHeader><CardTitle className="text-base">Zonal Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div><Label className="text-xs">R.O. Code</Label><Input value={formData.roCode} readOnly className="h-8 text-xs bg-muted" /></div>
              <div><Label className="text-xs">Active Date <span className="text-red-500">*</span></Label>
                <Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(formData.activeDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={formData.activeDate} onSelect={(d) => d && setFormData({ ...formData, activeDate: d })} /></PopoverContent></Popover>
              </div>
              <div><Label className="text-xs">R.O. Name <span className="text-red-500">*</span></Label><Input value={formData.roName} onChange={(e) => setFormData({ ...formData, roName: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Display Name</Label><Input value={formData.displayName} onChange={(e) => setFormData({ ...formData, displayName: e.target.value })} className="h-8 text-xs" /></div>
              <div className="sm:col-span-2 lg:col-span-1"><Label className="text-xs">Address <span className="text-red-500">*</span></Label><Textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} rows={2} className="text-xs" /></div>
              <div><Label className="text-xs">Contact #</Label><Input value={formData.contactNo} onChange={(e) => setFormData({ ...formData, contactNo: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">City <span className="text-red-500">*</span></Label><Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Pin Code</Label><Input value={formData.pinCode} onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Manager</Label><Input value={formData.manager} onChange={(e) => setFormData({ ...formData, manager: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">State</Label><Input value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Country</Label><Input value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Mobile #</Label><Input value={formData.mobileNo} onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Latitude</Label><Input value={formData.latitude} onChange={(e) => setFormData({ ...formData, latitude: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Longitude</Label><Input value={formData.longitude} onChange={(e) => setFormData({ ...formData, longitude: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Secondary Mobile #</Label><Input value={formData.secondaryMobileNo} onChange={(e) => setFormData({ ...formData, secondaryMobileNo: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Zone <span className="text-red-500">*</span></Label>
                <Select value={formData.zone} onValueChange={(v) => setFormData({ ...formData, zone: v })}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                  <SelectContent>{zones.map(z => (<SelectItem key={z} value={z}>{z.toUpperCase()}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs">Email Id</Label><Input value={formData.emailId} onChange={(e) => setFormData({ ...formData, emailId: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Imprest Ledger</Label><Input value={formData.imprestLedger} onChange={(e) => setFormData({ ...formData, imprestLedger: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Short Code</Label><Input value={formData.shortCode} onChange={(e) => setFormData({ ...formData, shortCode: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Invoice Code</Label><Input value={formData.invoiceCode} onChange={(e) => setFormData({ ...formData, invoiceCode: e.target.value })} className="h-8 text-xs" /></div>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2"><Checkbox checked={formData.stationaryControl} onCheckedChange={(c) => setFormData({ ...formData, stationaryControl: !!c })} id="stationaryControl" /><Label className="text-xs">Stationary Control</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.allowPickupDeliveryPoint} onCheckedChange={(c) => setFormData({ ...formData, allowPickupDeliveryPoint: !!c })} id="allowPickupDeliveryPoint" /><Label className="text-xs">Allow Pickup/Delivery Point</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.allowCashGatePassOnly} onCheckedChange={(c) => setFormData({ ...formData, allowCashGatePassOnly: !!c })} id="allowCashGatePassOnly" /><Label className="text-xs">Allow Cash Gate Pass Only</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.fundHold} onCheckedChange={(c) => setFormData({ ...formData, fundHold: !!c })} id="fundHold" /><Label className="text-xs">Fund Hold</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.createGodown} onCheckedChange={(c) => setFormData({ ...formData, createGodown: !!c })} id="createGodown" /><Label className="text-xs">Create Godown</Label></div>
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
                <SelectContent><SelectItem value="ALL">ALL</SelectItem>{zones.map(z => (<SelectItem key={z} value={z}>{z.toUpperCase()}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div className="flex items-end"><Button onClick={handleSearch} size="sm" className="h-8 text-xs w-full sm:w-auto">SHOW DETAILS</Button></div>
          </div>
          <div className="flex gap-2"><div className="relative flex-1 max-w-md"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" /><Input placeholder="Search by R.O. Name, Code or City..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 h-8 text-xs" /></div><Button onClick={handleSearch} size="sm" className="h-8 text-xs"><Search className="mr-1 h-3.5 w-3.5" />SEARCH</Button></div>

          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[1000px]">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12 text-center">S#</TableHead>
                    <TableHead>R.O. Code</TableHead>
                    <TableHead>R.O. Name</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Contact #</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Mobile #</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Short Code</TableHead>
                    <TableHead className="w-24 text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map((zonal, idx) => (
                    <TableRow key={zonal.id}>
                      <TableCell className="text-center">{(currentPage-1)*itemsPerPage+idx+1}</TableCell>
                      <TableCell>{zonal.roCode}</TableCell>
                      <TableCell className="font-medium">{zonal.roName}</TableCell>
                      <TableCell>{zonal.city || "-"}</TableCell>
                      <TableCell>{zonal.contactNo || "-"}</TableCell>
                      <TableCell>{zonal.manager || "-"}</TableCell>
                      <TableCell>{zonal.mobileNo || "-"}</TableCell>
                      <TableCell><span className={cn("px-2 py-0.5 rounded-full text-[10px]", zonal.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>{zonal.status === "active" ? "Active" : "Inactive"}</span></TableCell>
                      <TableCell>{zonal.shortCode || "-"}</TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(zonal)} className="h-6 w-6 p-0 text-blue-500"><Pencil className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => handleCloseStation(zonal)} className="h-6 w-6 p-0 text-red-500"><X className="h-3.5 w-3.5" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {paginated.length === 0 && <TableRow><TableCell colSpan={10} className="text-center py-8">No records found</TableCell></TableRow>}
                </TableBody>
              </Table>
            </div>
          </div>
          {totalPages > 1 && <div className="flex justify-center gap-1"><Button variant="outline" size="sm" onClick={() => goToPage(currentPage-1)} disabled={currentPage===1}>Previous</Button><span className="px-3 py-1 text-xs bg-muted rounded-md">Page {currentPage} of {totalPages}</span><Button variant="outline" size="sm" onClick={() => goToPage(currentPage+1)} disabled={currentPage===totalPages}>Next</Button></div>}
        </div>
      )}

      {/* Close Station Modal */}
      <Dialog open={closeStationModalOpen} onOpenChange={setCloseStationModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Close Station</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-xs">R.O. Code <span className="text-red-500">*</span></Label><Input value={closeStationZonal?.roCode} readOnly className="h-8 text-xs bg-muted" /></div>
            <div><Label className="text-xs">R.O. Name <span className="text-red-500">*</span></Label><Input value={closeStationZonal?.roName} readOnly className="h-8 text-xs bg-muted" /></div>
            <div><Label className="text-xs">Close Date <span className="text-red-500">*</span></Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(closeDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={closeDate} onSelect={(d) => d && setCloseDate(d)} /></PopoverContent></Popover></div>
            <div><Label className="text-xs">Reason <span className="text-red-500">*</span></Label><Textarea value={closeReason} onChange={(e) => setCloseReason(e.target.value)} rows={2} className="text-xs" /></div>
            <div className="flex gap-2"><Button onClick={handleCloseSubmit} size="sm" className="bg-red-600">Close Zonal</Button><Button variant="outline" size="sm" onClick={() => setCloseStationModalOpen(false)}>Cancel</Button></div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Info Note */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 rounded-md p-3">
        <div className="flex items-start gap-2"><AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" /><div className="text-xs text-blue-700 dark:text-blue-400">Fields marked * are mandatory. Use Edit to modify, Close Station to close a zonal office.</div></div>
      </div>
    </div>
  );
}