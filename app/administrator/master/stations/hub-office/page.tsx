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
  Trash2,
  Settings,
  PlusCircle,
  X,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// ------------------------------
//  Types
// ------------------------------
interface HubOffice {
  id: number;
  hubCode: string;
  activeDate: Date;
  isBorder: boolean;
  hubName: string;
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
  controlledBy: string;
  shortCode: string;
  cashLedger: string;
  branchLedger: string;
  nearestServingAirport: string;
  backDateGrAllowedDays: number;
  invoiceCode: string;
  imprestLedger: string;
  allowBooking: boolean;
  allowDelivery: boolean;
  allowTranshipment: boolean;
  allowCashGatePassOnly: boolean;
  cashPaidBooking: boolean;
  creditBooking: boolean;
  toPayBooking: boolean;
  focBooking: boolean;
  allowComputerizeGR: boolean;
  ewbMandatory: boolean;
  otpForBooking: boolean;
  addCollection: boolean;
  requiredCounter: boolean;
  otpForDelivery: boolean;
  allowPickupDeliveryPoint: boolean;
  fundHold: boolean;
  allowBidding: boolean;
  createGodown: boolean;
  status: "active" | "inactive";
}

interface BranchAssignment {
  id: number;
  branchName: string;
}

const zones = ["north zone", "south zone", "east zone", "western zone", "central zone"];
const mockBranches: BranchAssignment[] = [
  { id: 1, branchName: "AHMEDABAD CITY" },
  { id: 2, branchName: "AHMEDABAD-ASALAI (HUB)" },
  { id: 3, branchName: "BHAVNAGAR" },
  { id: 4, branchName: "DHORA JI" },
  { id: 5, branchName: "HALOL" },
  { id: 6, branchName: "JETPUR" },
  { id: 7, branchName: "NAROL" },
  { id: 8, branchName: "RAJKOT (METODA)" },
  { id: 9, branchName: "RAJKOT (SHAPAR)" },
  { id: 10, branchName: "RAJKOT - A" },
  { id: 11, branchName: "VAPI" },
];

const sampleHubs: HubOffice[] = [
  {
    id: 1, hubCode: "355", activeDate: new Date("2026-04-01"), isBorder: false,
    hubName: "AHMEDABAD-ASALAI (HUB)", displayName: "Ahmedabad Asalai",
    address: "Asalai Char Rasta, Ahmedabad", contactNo: "9218303752", city: "AHMEDABAD",
    pinCode: "382427", manager: "Rohtash Kumar", state: "Gujarat", country: "India",
    mobileNo: "9876543210", latitude: "23.0225", longitude: "72.5714", secondaryMobileNo: "",
    zone: "west zone", emailId: "ahmedabad@cargomax.com", controlledBy: "GHAZIABAD R.O",
    shortCode: "AMD", cashLedger: "", branchLedger: "", nearestServingAirport: "Ahmedabad International",
    backDateGrAllowedDays: 0, invoiceCode: "", imprestLedger: "",
    allowBooking: true, allowDelivery: true, allowTranshipment: false, allowCashGatePassOnly: false,
    cashPaidBooking: true, creditBooking: true, toPayBooking: true, focBooking: false,
    allowComputerizeGR: true, ewbMandatory: false, otpForBooking: false, addCollection: false,
    requiredCounter: false, otpForDelivery: false, allowPickupDeliveryPoint: false, fundHold: false,
    allowBidding: false, createGodown: false, status: "active",
  },
  {
    id: 2, hubCode: "104", activeDate: new Date("2026-04-01"), isBorder: false,
    hubName: "KHERA KALAN (HUB)", displayName: "Khera Kalan",
    address: "Khera Kalan, Delhi", contactNo: "8368940586", city: "DELHI",
    pinCode: "110082", manager: "DN JHA", state: "Delhi", country: "India",
    mobileNo: "9650195301", latitude: "28.7041", longitude: "77.1025", secondaryMobileNo: "",
    zone: "north zone", emailId: "khera@cargomax.com", controlledBy: "GHAZIABAD R.O",
    shortCode: "KKD", cashLedger: "", branchLedger: "", nearestServingAirport: "Indira Gandhi International",
    backDateGrAllowedDays: 0, invoiceCode: "", imprestLedger: "",
    allowBooking: true, allowDelivery: true, allowTranshipment: false, allowCashGatePassOnly: false,
    cashPaidBooking: true, creditBooking: true, toPayBooking: true, focBooking: false,
    allowComputerizeGR: true, ewbMandatory: false, otpForBooking: false, addCollection: false,
    requiredCounter: false, otpForDelivery: false, allowPickupDeliveryPoint: false, fundHold: false,
    allowBidding: false, createGodown: false, status: "active",
  },
];

export default function HubOffice() {
  const [activeTab, setActiveTab] = useState<"entry" | "search">("entry");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchStationName, setSearchStationName] = useState("");
  const [searchZoneName, setSearchZoneName] = useState("");
  const [searchStatus, setSearchStatus] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [hubs, setHubs] = useState<HubOffice[]>(sampleHubs);
  const [filteredHubs, setFilteredHubs] = useState<HubOffice[]>([]);

  // Form state
  const [formData, setFormData] = useState<HubOffice>({
    id: 0, hubCode: "", activeDate: new Date("2026-04-01"), isBorder: false,
    hubName: "", displayName: "", address: "", contactNo: "", city: "", pinCode: "",
    manager: "", state: "", country: "India", mobileNo: "", latitude: "", longitude: "",
    secondaryMobileNo: "", zone: "", emailId: "", controlledBy: "", shortCode: "",
    cashLedger: "", branchLedger: "", nearestServingAirport: "", backDateGrAllowedDays: 0,
    invoiceCode: "", imprestLedger: "", allowBooking: false, allowDelivery: false,
    allowTranshipment: false, allowCashGatePassOnly: false, cashPaidBooking: false,
    creditBooking: false, toPayBooking: false, focBooking: false, allowComputerizeGR: false,
    ewbMandatory: false, otpForBooking: false, addCollection: false, requiredCounter: false,
    otpForDelivery: false, allowPickupDeliveryPoint: false, fundHold: false, allowBidding: false,
    createGodown: false, status: "active",
  });

  // Modal states
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [setupHub, setSetupHub] = useState<HubOffice | null>(null);
  const [addBranchModalOpen, setAddBranchModalOpen] = useState(false);
  const [addBranchHub, setAddBranchHub] = useState<HubOffice | null>(null);
  const [assignedBranches, setAssignedBranches] = useState<BranchAssignment[]>([]);
  const [closeStationModalOpen, setCloseStationModalOpen] = useState(false);
  const [closeStationHub, setCloseStationHub] = useState<HubOffice | null>(null);
  const [closeDate, setCloseDate] = useState<Date>(new Date());
  const [closeReason, setCloseReason] = useState("");
  const [changeOfficeTypeModalOpen, setChangeOfficeTypeModalOpen] = useState(false);
  const [officeTypeHub, setOfficeTypeHub] = useState<HubOffice | null>(null);
  const [newOfficeType, setNewOfficeType] = useState("");

  // Helper functions
  const generateHubCode = () => {
    const maxCode = hubs.reduce((max, h) => Math.max(max, parseInt(h.hubCode) || 0), 0);
    return (maxCode + 1).toString();
  };

  const resetForm = () => {
    setFormData({
      id: 0, hubCode: generateHubCode(), activeDate: new Date("2026-04-01"), isBorder: false,
      hubName: "", displayName: "", address: "", contactNo: "", city: "", pinCode: "",
      manager: "", state: "", country: "India", mobileNo: "", latitude: "", longitude: "",
      secondaryMobileNo: "", zone: "", emailId: "", controlledBy: "", shortCode: "",
      cashLedger: "", branchLedger: "", nearestServingAirport: "", backDateGrAllowedDays: 0,
      invoiceCode: "", imprestLedger: "", allowBooking: false, allowDelivery: false,
      allowTranshipment: false, allowCashGatePassOnly: false, cashPaidBooking: false,
      creditBooking: false, toPayBooking: false, focBooking: false, allowComputerizeGR: false,
      ewbMandatory: false, otpForBooking: false, addCollection: false, requiredCounter: false,
      otpForDelivery: false, allowPickupDeliveryPoint: false, fundHold: false, allowBidding: false,
      createGodown: false, status: "active",
    });
    setEditId(null);
  };

  const handleSave = () => {
    if (!formData.hubName) { alert("Hub Name is required"); return; }
    if (!formData.address) { alert("Address is required"); return; }
    if (!formData.city) { alert("City is required"); return; }
    if (!formData.zone) { alert("Zone is required"); return; }
    if (!formData.controlledBy) { alert("Controlled By is required"); return; }

    setLoading(true);
    setTimeout(() => {
      if (editId) {
        setHubs(hubs.map(h => h.id === editId ? { ...formData, id: editId } : h));
        alert("Hub updated successfully");
      } else {
        const newHub = { ...formData, id: Date.now(), hubCode: generateHubCode() };
        setHubs([...hubs, newHub]);
        alert("Hub saved successfully");
      }
      resetForm();
      setActiveTab("search");
      setLoading(false);
    }, 500);
  };

  const handleEdit = (hub: HubOffice) => {
    setFormData({ ...hub });
    setEditId(hub.id);
    setActiveTab("entry");
  };

  const handleSearch = () => {
    let results = [...hubs];
    if (searchStationName) {
      results = results.filter(h => h.hubName.toLowerCase().includes(searchStationName.toLowerCase()));
    }
    if (searchZoneName && searchZoneName !== "ALL") {
      results = results.filter(h => h.zone === searchZoneName);
    }
    if (searchStatus !== "ALL") {
      results = results.filter(h => h.status === (searchStatus === "active" ? "active" : "inactive"));
    }
    if (searchTerm) {
      results = results.filter(h =>
        h.hubName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.hubCode.includes(searchTerm) ||
        h.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredHubs(results);
    setCurrentPage(1);
  };

  const handleSetup = (hub: HubOffice) => {
    setSetupHub(hub);
    setSetupModalOpen(true);
  };

  const handleAddBranch = (hub: HubOffice) => {
    setAddBranchHub(hub);
    setAssignedBranches(mockBranches.slice(0, 5));
    setAddBranchModalOpen(true);
  };

  const handleCloseStation = (hub: HubOffice) => {
    setCloseStationHub(hub);
    setCloseDate(new Date());
    setCloseReason("");
    setCloseStationModalOpen(true);
  };

  const handleChangeOfficeType = (hub: HubOffice) => {
    setOfficeTypeHub(hub);
    setNewOfficeType("Hub");
    setChangeOfficeTypeModalOpen(true);
  };

  const paginated = (filteredHubs.length ? filteredHubs : hubs).slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil((filteredHubs.length ? filteredHubs.length : hubs.length) / itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">HUB OFFICE</h1>
        <div className="mt-1 text-[10px] md:text-xs text-muted-foreground">
          Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD | Login By : MAYANK.GRLOGISTICS@GMAIL.COM | Login Branch : CORPORATE OFFICE | FY : 2026-2027
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button onClick={() => { setActiveTab("entry"); resetForm(); }} className={cn("px-4 py-2 text-sm font-medium", activeTab === "entry" ? "border-b-2 border-primary text-primary" : "text-muted-foreground")}>Entry</button>
        <button onClick={() => { setActiveTab("search"); setFilteredHubs([]); setSearchStationName(""); setSearchZoneName(""); setSearchStatus("ALL"); setSearchTerm(""); setCurrentPage(1); }} className={cn("px-4 py-2 text-sm font-medium", activeTab === "search" ? "border-b-2 border-primary text-primary" : "text-muted-foreground")}>Search</button>
      </div>

      {/* Entry Tab */}
      {activeTab === "entry" && (
        <Card>
          <CardHeader><CardTitle className="text-base">Hub Office Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div><Label className="text-xs">Hub Code</Label><Input value={formData.hubCode} readOnly className="h-8 text-xs bg-muted" /></div>
              <div><Label className="text-xs">Active Date <span className="text-red-500">*</span></Label>
                <Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(formData.activeDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={formData.activeDate} onSelect={(d) => d && setFormData({ ...formData, activeDate: d })} /></PopoverContent></Popover>
              </div>
              <div className="flex items-center gap-2 mt-6"><Checkbox checked={formData.isBorder} onCheckedChange={(c) => setFormData({ ...formData, isBorder: !!c })} id="isBorder" /><Label htmlFor="isBorder" className="text-xs">Is Border</Label></div>
              <div><Label className="text-xs">Hub Name <span className="text-red-500">*</span></Label><Input value={formData.hubName} onChange={(e) => setFormData({ ...formData, hubName: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Display Name</Label><Input value={formData.displayName} onChange={(e) => setFormData({ ...formData, displayName: e.target.value })} className="h-8 text-xs" /></div>
              <div className="col-span-2"><Label className="text-xs">Address <span className="text-red-500">*</span></Label><Textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} rows={2} className="text-xs" /></div>
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
                <Select value={formData.zone} onValueChange={(v) => setFormData({ ...formData, zone: v })}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{zones.map(z => (<SelectItem key={z} value={z}>{z.toUpperCase()}</SelectItem>))}</SelectContent></Select>
              </div>
              <div><Label className="text-xs">Email Id</Label><Input value={formData.emailId} onChange={(e) => setFormData({ ...formData, emailId: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Controlled By <span className="text-red-500">*</span></Label><Input value={formData.controlledBy} onChange={(e) => setFormData({ ...formData, controlledBy: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Short Code</Label><Input value={formData.shortCode} onChange={(e) => setFormData({ ...formData, shortCode: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Cash Ledger</Label><Input value={formData.cashLedger} onChange={(e) => setFormData({ ...formData, cashLedger: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Branch Ledger</Label><Input value={formData.branchLedger} onChange={(e) => setFormData({ ...formData, branchLedger: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Nearest Serving Airport</Label><Input value={formData.nearestServingAirport} onChange={(e) => setFormData({ ...formData, nearestServingAirport: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Back Date Gr Allowed Days</Label><Input type="number" value={formData.backDateGrAllowedDays} onChange={(e) => setFormData({ ...formData, backDateGrAllowedDays: Number(e.target.value) })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Invoice Code</Label><Input value={formData.invoiceCode} onChange={(e) => setFormData({ ...formData, invoiceCode: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Imprest Ledger</Label><Input value={formData.imprestLedger} onChange={(e) => setFormData({ ...formData, imprestLedger: e.target.value })} className="h-8 text-xs" /></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="flex items-center gap-2"><Checkbox checked={formData.allowBooking} onCheckedChange={(c) => setFormData({ ...formData, allowBooking: !!c })} id="allowBooking" /><Label className="text-xs">Booking</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.allowDelivery} onCheckedChange={(c) => setFormData({ ...formData, allowDelivery: !!c })} id="allowDelivery" /><Label className="text-xs">Delivery</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.allowTranshipment} onCheckedChange={(c) => setFormData({ ...formData, allowTranshipment: !!c })} id="allowTranshipment" /><Label className="text-xs">Transhipment</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.allowCashGatePassOnly} onCheckedChange={(c) => setFormData({ ...formData, allowCashGatePassOnly: !!c })} id="allowCashGatePassOnly" /><Label className="text-xs">Allow Cash Gate Pass Only</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.cashPaidBooking} onCheckedChange={(c) => setFormData({ ...formData, cashPaidBooking: !!c })} id="cashPaidBooking" /><Label className="text-xs">Cash / Paid Booking</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.creditBooking} onCheckedChange={(c) => setFormData({ ...formData, creditBooking: !!c })} id="creditBooking" /><Label className="text-xs">Credit Booking</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.toPayBooking} onCheckedChange={(c) => setFormData({ ...formData, toPayBooking: !!c })} id="toPayBooking" /><Label className="text-xs">To Pay Booking</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.focBooking} onCheckedChange={(c) => setFormData({ ...formData, focBooking: !!c })} id="focBooking" /><Label className="text-xs">FOC Booking</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.allowComputerizeGR} onCheckedChange={(c) => setFormData({ ...formData, allowComputerizeGR: !!c })} id="allowComputerizeGR" /><Label className="text-xs">Allow Computerize GR</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.ewbMandatory} onCheckedChange={(c) => setFormData({ ...formData, ewbMandatory: !!c })} id="ewbMandatory" /><Label className="text-xs">EWB Mandatory</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.otpForBooking} onCheckedChange={(c) => setFormData({ ...formData, otpForBooking: !!c })} id="otpForBooking" /><Label className="text-xs">OTP For Booking</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.addCollection} onCheckedChange={(c) => setFormData({ ...formData, addCollection: !!c })} id="addCollection" /><Label className="text-xs">Add Collection</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.requiredCounter} onCheckedChange={(c) => setFormData({ ...formData, requiredCounter: !!c })} id="requiredCounter" /><Label className="text-xs">Required Counter</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.otpForDelivery} onCheckedChange={(c) => setFormData({ ...formData, otpForDelivery: !!c })} id="otpForDelivery" /><Label className="text-xs">OTP For Delivery</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.allowPickupDeliveryPoint} onCheckedChange={(c) => setFormData({ ...formData, allowPickupDeliveryPoint: !!c })} id="allowPickupDeliveryPoint" /><Label className="text-xs">Allow Pickup/Delivery Point</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.fundHold} onCheckedChange={(c) => setFormData({ ...formData, fundHold: !!c })} id="fundHold" /><Label className="text-xs">Fund Hold</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.allowBidding} onCheckedChange={(c) => setFormData({ ...formData, allowBidding: !!c })} id="allowBidding" /><Label className="text-xs">Allow Bidding</Label></div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 border rounded-md bg-muted/20">
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
            <div><Label className="text-xs">Status</Label>
              <Select value={searchStatus} onValueChange={setSearchStatus}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">ALL</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2"><Button onClick={handleSearch} size="sm" className="h-8 text-xs">SHOW DETAILS</Button></div>
          </div>
          <div className="flex gap-2"><div className="relative flex-1 max-w-md"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" /><Input placeholder="Search by Hub Name, Code or City..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 h-8 text-xs" /></div><Button onClick={handleSearch} size="sm" className="h-8 text-xs"><Search className="mr-1 h-3.5 w-3.5" />SEARCH</Button></div>

          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[1200px]"><Table className="text-xs"><TableHeader><TableRow className="bg-muted/50"><TableHead className="w-12 text-center">S#</TableHead><TableHead>Hub Code</TableHead><TableHead>Hub Name</TableHead><TableHead>City</TableHead><TableHead>Contact #</TableHead><TableHead>R.O. Name</TableHead><TableHead>Manager</TableHead><TableHead>Contact #</TableHead><TableHead>Status</TableHead><TableHead>Short Code</TableHead><TableHead className="w-32 text-center">Action</TableHead></TableRow></TableHeader>
            <TableBody>{paginated.map((hub, idx) => (<TableRow key={hub.id}><TableCell>{(currentPage-1)*itemsPerPage+idx+1}</TableCell><TableCell>{hub.hubCode}</TableCell><TableCell className="font-medium">{hub.hubName}</TableCell><TableCell>{hub.city}</TableCell><TableCell>{hub.contactNo}</TableCell><TableCell>{hub.controlledBy}</TableCell><TableCell>{hub.manager}</TableCell><TableCell>{hub.mobileNo}</TableCell><TableCell><span className={cn("px-2 py-0.5 rounded-full text-[10px]", hub.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>{hub.status === "active" ? "Active" : "Inactive"}</span></TableCell><TableCell>{hub.shortCode}</TableCell><TableCell><div className="flex gap-1"><Button variant="ghost" size="sm" onClick={() => handleEdit(hub)} className="h-6 w-6 p-0 text-blue-500"><Pencil className="h-3.5 w-3.5" /></Button><Button variant="ghost" size="sm" onClick={() => handleSetup(hub)} className="h-6 w-6 p-0 text-green-500"><Settings className="h-3.5 w-3.5" /></Button><Button variant="ghost" size="sm" onClick={() => handleAddBranch(hub)} className="h-6 w-6 p-0 text-purple-500"><PlusCircle className="h-3.5 w-3.5" /></Button><Button variant="ghost" size="sm" onClick={() => handleCloseStation(hub)} className="h-6 w-6 p-0 text-red-500"><X className="h-3.5 w-3.5" /></Button><Button variant="ghost" size="sm" onClick={() => handleChangeOfficeType(hub)} className="h-6 w-6 p-0 text-orange-500"><RefreshCw className="h-3.5 w-3.5" /></Button></div></TableCell></TableRow>))}</TableBody></Table></div>
          </div>
          {totalPages > 1 && (<div className="flex justify-center gap-1"><Button variant="outline" size="sm" onClick={() => goToPage(currentPage-1)} disabled={currentPage===1}>Previous</Button><span className="px-3 py-1 text-xs bg-muted rounded-md">Page {currentPage} of {totalPages}</span><Button variant="outline" size="sm" onClick={() => goToPage(currentPage+1)} disabled={currentPage===totalPages}>Next</Button></div>)}
        </div>
      )}

      {/* Setup Modal */}
      <Dialog open={setupModalOpen} onOpenChange={setSetupModalOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Setup - {setupHub?.hubName}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-xs">Cash Ledger</Label><Input className="h-8 text-xs" /></div>
            <div><Label className="text-xs">Cash Market Ledger</Label><Input className="h-8 text-xs" /></div>
            <div><Label className="text-xs">Ledger</Label><Input value={`${setupHub?.hubName} - AGENCY A/C`} className="h-8 text-xs bg-muted" /></div>
            <div><Label className="text-xs">Group Ledger</Label><Input className="h-8 text-xs" /></div>
            <div><Label className="text-xs">Agency Ledger</Label><Input value={`${setupHub?.hubName} - AGENCY A/C`} className="h-8 text-xs bg-muted" /></div>
            <div><Label className="text-xs">Fix Branch Collection Station</Label><Input className="h-8 text-xs" /></div>
            <div className="flex gap-2"><Button size="sm" className="h-8 text-xs bg-green-600">Update</Button><Button size="sm" variant="outline" className="h-8 text-xs">Create</Button><Button size="sm" variant="destructive" className="h-8 text-xs">Remove</Button><Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setSetupModalOpen(false)}>Close</Button></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setSetupModalOpen(false)}>CLOSE</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Branch Modal - Fully Responsive */}
<Dialog open={addBranchModalOpen} onOpenChange={setAddBranchModalOpen}>
  <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-3xl lg:max-w-4xl max-h-[85vh] flex flex-col p-0">
    <DialogHeader className="px-4 pt-4 pb-2 border-b">
      <DialogTitle className="text-base md:text-lg">Add Branch - {addBranchHub?.hubName}</DialogTitle>
    </DialogHeader>
    
    <div className="flex-1 overflow-y-auto px-4 py-3">
      <div className="space-y-3">
        <div>
          <Label className="text-xs">Hub Name <span className="text-red-500">*</span></Label>
          <Input value={addBranchHub?.hubName} readOnly className="h-8 text-xs bg-muted" />
        </div>
        
        <div className="rounded-md border overflow-x-auto">
          <div className="min-w-[500px] md:min-w-[600px]">
            <Table className="text-xs">
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-12 text-center">S #</TableHead>
                  <TableHead>Branch Name</TableHead>
                  <TableHead className="w-20 text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockBranches.map((b, i) => (
                  <TableRow key={b.id}>
                    <TableCell className="text-center">{i+1}</TableCell>
                    <TableCell>{b.branchName}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-500">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>

    <DialogFooter className="px-4 py-3 border-t gap-2 flex-wrap">
      <Button size="sm" className="h-8 text-xs bg-green-600 w-full sm:w-auto">Save</Button>
      <Button variant="outline" size="sm" className="h-8 text-xs w-full sm:w-auto" onClick={() => setAddBranchModalOpen(false)}>Cancel</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

      {/* Close Station Modal */}
      <Dialog open={closeStationModalOpen} onOpenChange={setCloseStationModalOpen}>
        <DialogContent><DialogHeader><DialogTitle>Close Station</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-xs">Hub Code <span className="text-red-500">*</span></Label><Input value={closeStationHub?.hubCode} readOnly className="h-8 text-xs bg-muted" /></div>
            <div><Label className="text-xs">Hub Name <span className="text-red-500">*</span></Label><Input value={closeStationHub?.hubName} readOnly className="h-8 text-xs bg-muted" /></div>
            <div><Label className="text-xs">Close Date <span className="text-red-500">*</span></Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(closeDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={closeDate} onSelect={(d) => d && setCloseDate(d)} /></PopoverContent></Popover></div>
            <div><Label className="text-xs">Reason <span className="text-red-500">*</span></Label><Textarea value={closeReason} onChange={(e) => setCloseReason(e.target.value)} rows={2} className="text-xs" /></div>
            <div className="flex gap-2"><Button size="sm" className="bg-red-600">Close Hub</Button><Button variant="outline" size="sm" onClick={() => setCloseStationModalOpen(false)}>Cancel</Button></div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Office Type Modal */}
      <Dialog open={changeOfficeTypeModalOpen} onOpenChange={setChangeOfficeTypeModalOpen}>
        <DialogContent><DialogHeader><DialogTitle>Change Office Type</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-xs">Name</Label><Input value={officeTypeHub?.hubName} readOnly className="h-8 text-xs bg-muted" /></div>
            <div><Label className="text-xs">Current Office Type</Label><Input value="HUB" readOnly className="h-8 text-xs bg-muted" /></div>
            <div><Label className="text-xs">New Office Type</Label>
              <Select value={newOfficeType} onValueChange={setNewOfficeType}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hub">Hub</SelectItem>
                  <SelectItem value="agency">Agency</SelectItem>
                  <SelectItem value="branch">Branch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2"><Button size="sm" className="bg-green-600">Save</Button><Button variant="outline" size="sm" onClick={() => setChangeOfficeTypeModalOpen(false)}>Close</Button></div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Info Note */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 rounded-md p-3">
        <div className="flex items-start gap-2"><AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" /><div className="text-xs text-blue-700 dark:text-blue-400"><p className="font-medium">Note:</p><ul className="list-disc list-inside mt-1 space-y-0.5"><li>Fields marked * are mandatory.</li><li>Use the search tab to find hubs by name, zone, or status.</li><li>Action buttons: Edit, Setup, Add Branch, Close Station, Change Office Type.</li></ul></div></div>
      </div>
    </div>
  );
}