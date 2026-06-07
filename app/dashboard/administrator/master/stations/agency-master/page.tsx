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
  Settings,
  X,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// ------------------------------
//  Types
// ------------------------------
interface Agency {
  id: number;
  agencyCode: string;
  activeDate: Date;
  agencyName: string;
  displayName: string;
  address: string;
  contactNo: string;
  contactPerson: string;
  city: string;
  pinCode: string;
  mobileNo: string;
  state: string;
  country: string;
  secondaryMobileNo: string;
  latitude: string;
  longitude: string;
  zone: string;
  emailId: string;
  controlledBy: string;
  defaultHub: string;
  agencyLedger: string;
  agencyVendor: string;
  shortCode: string;
  freightOn: string;
  nearestServingAirport: string;
  imprestLedger: string;
  backDateGrAllowedDays: number;
  invoiceCode: string;
  // Checkboxes
  allowBooking: boolean;
  allowDelivery: boolean;
  allowTranshipment: boolean;
  focBooking: boolean;
  cashPaidBooking: boolean;
  creditBooking: boolean;
  toPayBooking: boolean;
  allowComputerizeGR: boolean;
  bookingOnTariffOnly: boolean;
  ewbMandatory: boolean;
  requiredCounter: boolean;
  otpForBooking: boolean;
  addCollection: boolean;
  allowPickupDeliveryPoint: boolean;
  allowGatePass: boolean;
  createGodown: boolean;
  otpForDelivery: boolean;
  allowGatePassBill: boolean;
  allowDueGatePass: boolean;
  allowManifest: boolean;
  allowCashGatePassOnly: boolean;
  allowBidding: boolean;
  fundHold: boolean;
  status: "active" | "inactive";
}

// Constants
const zones = ["north zone", "south zone", "east zone", "western zone", "central zone"];
const freightOnOptions = ["CHARGE WEIGHT", "ACTUAL WEIGHT", "PER PACKAGE"];

// Mock data
const mockAgencies: Agency[] = [
  {
    id: 1, agencyCode: "286", activeDate: new Date("2026-04-01"), agencyName: "AGARTALA",
    displayName: "", address: "", contactNo: "9436167508/9366376012", contactPerson: "ARUN KUMAR GHOSH",
    city: "AGARTALA", pinCode: "", mobileNo: "", state: "", country: "India", secondaryMobileNo: "",
    latitude: "", longitude: "", zone: "east zone", emailId: "", controlledBy: "GHAZIABAD R.O",
    defaultHub: "", agencyLedger: "", agencyVendor: "", shortCode: "", freightOn: "CHARGE WEIGHT",
    nearestServingAirport: "", imprestLedger: "", backDateGrAllowedDays: 0, invoiceCode: "",
    allowBooking: false, allowDelivery: true, allowTranshipment: false, focBooking: false,
    cashPaidBooking: false, creditBooking: false, toPayBooking: false, allowComputerizeGR: false,
    bookingOnTariffOnly: false, ewbMandatory: false, requiredCounter: false, otpForBooking: false,
    addCollection: false, allowPickupDeliveryPoint: false, allowGatePass: false, createGodown: false,
    otpForDelivery: false, allowGatePassBill: false, allowDueGatePass: false, allowManifest: false,
    allowCashGatePassOnly: false, allowBidding: false, fundHold: false, status: "active",
  },
  {
    id: 2, agencyCode: "125", activeDate: new Date("2026-04-01"), agencyName: "AGRA (YOGESH SHARMA)",
    displayName: "", address: "", contactNo: "9319967212/9319567678", contactPerson: "YOGESH SHARMA",
    city: "AGRA", pinCode: "", mobileNo: "", state: "", country: "India", secondaryMobileNo: "",
    latitude: "", longitude: "", zone: "north zone", emailId: "", controlledBy: "GHAZIABAD R.O",
    defaultHub: "", agencyLedger: "", agencyVendor: "", shortCode: "", freightOn: "CHARGE WEIGHT",
    nearestServingAirport: "", imprestLedger: "", backDateGrAllowedDays: 0, invoiceCode: "",
    allowBooking: true, allowDelivery: false, allowTranshipment: false, focBooking: false,
    cashPaidBooking: false, creditBooking: false, toPayBooking: false, allowComputerizeGR: false,
    bookingOnTariffOnly: false, ewbMandatory: false, requiredCounter: false, otpForBooking: false,
    addCollection: false, allowPickupDeliveryPoint: false, allowGatePass: false, createGodown: false,
    otpForDelivery: false, allowGatePassBill: false, allowDueGatePass: false, allowManifest: false,
    allowCashGatePassOnly: false, allowBidding: false, fundHold: false, status: "active",
  },
];

export default function AgencyMaster() {
  const [activeTab, setActiveTab] = useState<"entry" | "search">("entry");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchStationName, setSearchStationName] = useState("");
  const [searchZoneName, setSearchZoneName] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [agencies, setAgencies] = useState<Agency[]>(mockAgencies);
  const [filteredAgencies, setFilteredAgencies] = useState<Agency[]>([]);

  // Form state
  const [formData, setFormData] = useState<Agency>({
    id: 0, agencyCode: "", activeDate: new Date("2026-04-01"), agencyName: "", displayName: "",
    address: "", contactNo: "", contactPerson: "", city: "", pinCode: "", mobileNo: "", state: "",
    country: "India", secondaryMobileNo: "", latitude: "", longitude: "", zone: "", emailId: "",
    controlledBy: "", defaultHub: "", agencyLedger: "", agencyVendor: "", shortCode: "",
    freightOn: "CHARGE WEIGHT", nearestServingAirport: "", imprestLedger: "", backDateGrAllowedDays: 0,
    invoiceCode: "", allowBooking: false, allowDelivery: false, allowTranshipment: false, focBooking: false,
    cashPaidBooking: false, creditBooking: false, toPayBooking: false, allowComputerizeGR: false,
    bookingOnTariffOnly: false, ewbMandatory: false, requiredCounter: false, otpForBooking: false,
    addCollection: false, allowPickupDeliveryPoint: false, allowGatePass: false, createGodown: false,
    otpForDelivery: false, allowGatePassBill: false, allowDueGatePass: false, allowManifest: false,
    allowCashGatePassOnly: false, allowBidding: false, fundHold: false, status: "active",
  });

  // Modal states
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [setupAgency, setSetupAgency] = useState<Agency | null>(null);
  const [closeStationModalOpen, setCloseStationModalOpen] = useState(false);
  const [closeStationAgency, setCloseStationAgency] = useState<Agency | null>(null);
  const [closeDate, setCloseDate] = useState<Date>(new Date());
  const [closeReason, setCloseReason] = useState("");
  const [changeOfficeTypeModalOpen, setChangeOfficeTypeModalOpen] = useState(false);
  const [officeTypeAgency, setOfficeTypeAgency] = useState<Agency | null>(null);
  const [newOfficeType, setNewOfficeType] = useState("");

  // Helper functions
  const generateAgencyCode = () => {
    const maxCode = agencies.reduce((max, a) => Math.max(max, parseInt(a.agencyCode) || 0), 0);
    return (maxCode + 1).toString();
  };

  const resetForm = () => {
    setFormData({
      id: 0, agencyCode: generateAgencyCode(), activeDate: new Date("2026-04-01"), agencyName: "",
      displayName: "", address: "", contactNo: "", contactPerson: "", city: "", pinCode: "",
      mobileNo: "", state: "", country: "India", secondaryMobileNo: "", latitude: "", longitude: "",
      zone: "", emailId: "", controlledBy: "", defaultHub: "", agencyLedger: "", agencyVendor: "",
      shortCode: "", freightOn: "CHARGE WEIGHT", nearestServingAirport: "", imprestLedger: "",
      backDateGrAllowedDays: 0, invoiceCode: "", allowBooking: false, allowDelivery: false,
      allowTranshipment: false, focBooking: false, cashPaidBooking: false, creditBooking: false,
      toPayBooking: false, allowComputerizeGR: false, bookingOnTariffOnly: false, ewbMandatory: false,
      requiredCounter: false, otpForBooking: false, addCollection: false, allowPickupDeliveryPoint: false,
      allowGatePass: false, createGodown: false, otpForDelivery: false, allowGatePassBill: false,
      allowDueGatePass: false, allowManifest: false, allowCashGatePassOnly: false, allowBidding: false,
      fundHold: false, status: "active",
    });
    setEditId(null);
  };

  const handleSave = () => {
    if (!formData.agencyName) { alert("Agency Name is required"); return; }
    if (!formData.address) { alert("Address is required"); return; }
    if (!formData.city) { alert("City is required"); return; }
    if (!formData.zone) { alert("Zone is required"); return; }
    if (!formData.controlledBy) { alert("Controlled By is required"); return; }

    setLoading(true);
    setTimeout(() => {
      if (editId) {
        setAgencies(agencies.map(a => a.id === editId ? { ...formData, id: editId } : a));
        alert("Agency updated");
      } else {
        const newAgency = { ...formData, id: Date.now(), agencyCode: generateAgencyCode() };
        setAgencies([...agencies, newAgency]);
        alert("Agency saved");
      }
      resetForm();
      setActiveTab("search");
      setLoading(false);
    }, 500);
  };

  const handleEdit = (agency: Agency) => {
    setFormData({ ...agency });
    setEditId(agency.id);
    setActiveTab("entry");
  };

  const handleSearch = () => {
    let results = [...agencies];
    if (searchStationName) {
      results = results.filter(a => a.agencyName.toLowerCase().includes(searchStationName.toLowerCase()));
    }
    if (searchZoneName !== "ALL") {
      results = results.filter(a => a.zone === searchZoneName);
    }
    if (searchTerm) {
      results = results.filter(a =>
        a.agencyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.agencyCode.includes(searchTerm) ||
        a.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredAgencies(results);
    setCurrentPage(1);
  };

  const handleSetup = (agency: Agency) => {
    setSetupAgency(agency);
    setSetupModalOpen(true);
  };

  const handleCloseStation = (agency: Agency) => {
    setCloseStationAgency(agency);
    setCloseDate(new Date());
    setCloseReason("");
    setCloseStationModalOpen(true);
  };

  const handleChangeOfficeType = (agency: Agency) => {
    setOfficeTypeAgency(agency);
    setNewOfficeType("Agency");
    setChangeOfficeTypeModalOpen(true);
  };

  const paginated = (filteredAgencies.length ? filteredAgencies : agencies).slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil((filteredAgencies.length ? filteredAgencies.length : agencies.length) / itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">AGENCY MASTER</h1>
        <div className="mt-1 text-[10px] md:text-xs text-muted-foreground break-words">
          Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD | Login By : MAYANK.GRLOGISTICS@GMAIL.COM | Login Branch : CORPORATE OFFICE | FY : 2026-2027
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button onClick={() => { setActiveTab("entry"); resetForm(); }} className={cn("px-4 py-2 text-sm font-medium", activeTab === "entry" ? "border-b-2 border-primary text-primary" : "text-muted-foreground")}>Entry</button>
        <button onClick={() => { setActiveTab("search"); setFilteredAgencies([]); setSearchStationName(""); setSearchZoneName("ALL"); setSearchTerm(""); setCurrentPage(1); }} className={cn("px-4 py-2 text-sm font-medium", activeTab === "search" ? "border-b-2 border-primary text-primary" : "text-muted-foreground")}>Search</button>
      </div>

      {/* Entry Tab */}
      {activeTab === "entry" && (
        <Card>
          <CardHeader><CardTitle className="text-base">Agency Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div><Label className="text-xs">Agency Code</Label><Input value={formData.agencyCode} readOnly className="h-8 text-xs bg-muted" /></div>
              <div><Label className="text-xs">Active Date <span className="text-red-500">*</span></Label>
                <Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(formData.activeDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={formData.activeDate} onSelect={(d) => d && setFormData({ ...formData, activeDate: d })} /></PopoverContent></Popover>
              </div>
              <div><Label className="text-xs">Agency Name <span className="text-red-500">*</span></Label><Input value={formData.agencyName} onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Display Name</Label><Input value={formData.displayName} onChange={(e) => setFormData({ ...formData, displayName: e.target.value })} className="h-8 text-xs" /></div>
              <div className="sm:col-span-2 lg:col-span-1"><Label className="text-xs">Address <span className="text-red-500">*</span></Label><Textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} rows={2} className="text-xs" /></div>
              <div><Label className="text-xs">Contact #</Label><Input value={formData.contactNo} onChange={(e) => setFormData({ ...formData, contactNo: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Contact Person</Label><Input value={formData.contactPerson} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">City <span className="text-red-500">*</span></Label><Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Pin Code</Label><Input value={formData.pinCode} onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Mobile #</Label><Input value={formData.mobileNo} onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">State</Label><Input value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Country</Label><Input value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Secondary Mobile #</Label><Input value={formData.secondaryMobileNo} onChange={(e) => setFormData({ ...formData, secondaryMobileNo: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Latitude</Label><Input value={formData.latitude} onChange={(e) => setFormData({ ...formData, latitude: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Longitude</Label><Input value={formData.longitude} onChange={(e) => setFormData({ ...formData, longitude: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Zone <span className="text-red-500">*</span></Label>
                <Select value={formData.zone} onValueChange={(v) => setFormData({ ...formData, zone: v })}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                  <SelectContent>{zones.map(z => (<SelectItem key={z} value={z}>{z.toUpperCase()}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs">Email Id</Label><Input value={formData.emailId} onChange={(e) => setFormData({ ...formData, emailId: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Controlled By <span className="text-red-500">*</span></Label><Input value={formData.controlledBy} onChange={(e) => setFormData({ ...formData, controlledBy: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Default Hub</Label><Input value={formData.defaultHub} onChange={(e) => setFormData({ ...formData, defaultHub: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Agency Ledger</Label><Input value={formData.agencyLedger} onChange={(e) => setFormData({ ...formData, agencyLedger: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Agency Vendor</Label><Input value={formData.agencyVendor} onChange={(e) => setFormData({ ...formData, agencyVendor: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Short Code</Label><Input value={formData.shortCode} onChange={(e) => setFormData({ ...formData, shortCode: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Freight On</Label>
                <Select value={formData.freightOn} onValueChange={(v) => setFormData({ ...formData, freightOn: v })}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{freightOnOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs">Nearest Serving Airport</Label><Input value={formData.nearestServingAirport} onChange={(e) => setFormData({ ...formData, nearestServingAirport: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Imprest Ledger</Label><Input value={formData.imprestLedger} onChange={(e) => setFormData({ ...formData, imprestLedger: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Back Date Gr Allowed Days</Label><Input type="number" value={formData.backDateGrAllowedDays} onChange={(e) => setFormData({ ...formData, backDateGrAllowedDays: Number(e.target.value) })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Invoice Code</Label><Input value={formData.invoiceCode} onChange={(e) => setFormData({ ...formData, invoiceCode: e.target.value })} className="h-8 text-xs" /></div>
            </div>

            {/* Checkboxes - multi-column responsive */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
              <div className="flex items-center gap-2"><Checkbox checked={formData.allowBooking} onCheckedChange={(c) => setFormData({ ...formData, allowBooking: !!c })} id="allowBooking" /><Label className="text-xs">Booking</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.allowDelivery} onCheckedChange={(c) => setFormData({ ...formData, allowDelivery: !!c })} id="allowDelivery" /><Label className="text-xs">Delivery</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.allowTranshipment} onCheckedChange={(c) => setFormData({ ...formData, allowTranshipment: !!c })} id="allowTranshipment" /><Label className="text-xs">Transhipment</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.focBooking} onCheckedChange={(c) => setFormData({ ...formData, focBooking: !!c })} id="focBooking" /><Label className="text-xs">FOC Booking</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.cashPaidBooking} onCheckedChange={(c) => setFormData({ ...formData, cashPaidBooking: !!c })} id="cashPaidBooking" /><Label className="text-xs">Cash / Paid Booking</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.creditBooking} onCheckedChange={(c) => setFormData({ ...formData, creditBooking: !!c })} id="creditBooking" /><Label className="text-xs">Credit Booking</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.toPayBooking} onCheckedChange={(c) => setFormData({ ...formData, toPayBooking: !!c })} id="toPayBooking" /><Label className="text-xs">To Pay Booking</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.allowComputerizeGR} onCheckedChange={(c) => setFormData({ ...formData, allowComputerizeGR: !!c })} id="allowComputerizeGR" /><Label className="text-xs">Allow Computerize GR</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.bookingOnTariffOnly} onCheckedChange={(c) => setFormData({ ...formData, bookingOnTariffOnly: !!c })} id="bookingOnTariffOnly" /><Label className="text-xs">Booking On Tariff Only</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.ewbMandatory} onCheckedChange={(c) => setFormData({ ...formData, ewbMandatory: !!c })} id="ewbMandatory" /><Label className="text-xs">EWB Mandatory</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.requiredCounter} onCheckedChange={(c) => setFormData({ ...formData, requiredCounter: !!c })} id="requiredCounter" /><Label className="text-xs">Required Counter</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.otpForBooking} onCheckedChange={(c) => setFormData({ ...formData, otpForBooking: !!c })} id="otpForBooking" /><Label className="text-xs">OTP For Booking</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.addCollection} onCheckedChange={(c) => setFormData({ ...formData, addCollection: !!c })} id="addCollection" /><Label className="text-xs">Add Collection</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.allowPickupDeliveryPoint} onCheckedChange={(c) => setFormData({ ...formData, allowPickupDeliveryPoint: !!c })} id="allowPickupDeliveryPoint" /><Label className="text-xs">Allow Pickup/Delivery Point</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.allowGatePass} onCheckedChange={(c) => setFormData({ ...formData, allowGatePass: !!c })} id="allowGatePass" /><Label className="text-xs">Allow Gate Pass</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.createGodown} onCheckedChange={(c) => setFormData({ ...formData, createGodown: !!c })} id="createGodown" /><Label className="text-xs">Create Godown</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.otpForDelivery} onCheckedChange={(c) => setFormData({ ...formData, otpForDelivery: !!c })} id="otpForDelivery" /><Label className="text-xs">OTP For Delivery</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.allowGatePassBill} onCheckedChange={(c) => setFormData({ ...formData, allowGatePassBill: !!c })} id="allowGatePassBill" /><Label className="text-xs">Allow Gate Pass Bill</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.allowDueGatePass} onCheckedChange={(c) => setFormData({ ...formData, allowDueGatePass: !!c })} id="allowDueGatePass" /><Label className="text-xs">Allow Due Gate Pass</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.allowManifest} onCheckedChange={(c) => setFormData({ ...formData, allowManifest: !!c })} id="allowManifest" /><Label className="text-xs">Allow Manifest</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.allowCashGatePassOnly} onCheckedChange={(c) => setFormData({ ...formData, allowCashGatePassOnly: !!c })} id="allowCashGatePassOnly" /><Label className="text-xs">Allow Cash Gate Pass Only</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.allowBidding} onCheckedChange={(c) => setFormData({ ...formData, allowBidding: !!c })} id="allowBidding" /><Label className="text-xs">Allow Bidding</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.fundHold} onCheckedChange={(c) => setFormData({ ...formData, fundHold: !!c })} id="fundHold" /><Label className="text-xs">Fund Hold</Label></div>
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
          <div className="flex gap-2"><div className="relative flex-1 max-w-md"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" /><Input placeholder="Search by Agency Name, Code or City..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 h-8 text-xs" /></div><Button onClick={handleSearch} size="sm" className="h-8 text-xs"><Search className="mr-1 h-3.5 w-3.5" />SEARCH</Button></div>

          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[1200px]">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12 text-center">S#</TableHead>
                    <TableHead>Agency Code</TableHead>
                    <TableHead>Agency Name</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Contact #</TableHead>
                    <TableHead>Hub</TableHead>
                    <TableHead>R.O. Name</TableHead>
                    <TableHead>Contact person</TableHead>
                    <TableHead>Mobile #</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Booking</TableHead>
                    <TableHead>Delivery</TableHead>
                    <TableHead>Transhipment</TableHead>
                    <TableHead>Short Code</TableHead>
                    <TableHead className="w-32 text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map((agency, idx) => (
                    <TableRow key={agency.id}>
                      <TableCell className="text-center">{(currentPage-1)*itemsPerPage+idx+1}</TableCell>
                      <TableCell>{agency.agencyCode}</TableCell>
                      <TableCell className="font-medium">{agency.agencyName}</TableCell>
                      <TableCell>{agency.city}</TableCell>
                      <TableCell>{agency.contactNo}</TableCell>
                      <TableCell>{agency.defaultHub || "-"}</TableCell>
                      <TableCell>{agency.controlledBy}</TableCell>
                      <TableCell>{agency.contactPerson}</TableCell>
                      <TableCell>{agency.mobileNo}</TableCell>
                      <TableCell><span className={cn("px-2 py-0.5 rounded-full text-[10px]", agency.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>{agency.status === "active" ? "Active" : "Inactive"}</span></TableCell>
                      <TableCell>{agency.allowBooking ? "Yes" : "No"}</TableCell>
                      <TableCell>{agency.allowDelivery ? "Yes" : "No"}</TableCell>
                      <TableCell>{agency.allowTranshipment ? "Yes" : "No"}</TableCell>
                      <TableCell>{agency.shortCode}</TableCell>
                      <TableCell>
                        <div className="flex flex-nowrap gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(agency)} className="h-6 w-6 p-0 text-blue-500"><Pencil className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => handleSetup(agency)} className="h-6 w-6 p-0 text-green-500"><Settings className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => handleCloseStation(agency)} className="h-6 w-6 p-0 text-red-500"><X className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => handleChangeOfficeType(agency)} className="h-6 w-6 p-0 text-orange-500"><RefreshCw className="h-3.5 w-3.5" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {paginated.length === 0 && <TableRow><TableCell colSpan={15} className="text-center py-8">No agencies found</TableCell></TableRow>}
                </TableBody>
              </Table>
            </div>
          </div>
          {totalPages > 1 && <div className="flex justify-center gap-1"><Button variant="outline" size="sm" onClick={() => goToPage(currentPage-1)} disabled={currentPage===1}>Previous</Button><span className="px-3 py-1 text-xs bg-muted rounded-md">Page {currentPage} of {totalPages}</span><Button variant="outline" size="sm" onClick={() => goToPage(currentPage+1)} disabled={currentPage===totalPages}>Next</Button></div>}
        </div>
      )}

      {/* Setup Modal - added readOnly to static fields */}
      <Dialog open={setupModalOpen} onOpenChange={setSetupModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Setup - {setupAgency?.agencyName}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-xs">Cash Ledger</Label><Input className="h-8 text-xs" /></div>
            <div><Label className="text-xs">Cash Market Ledger</Label><Input className="h-8 text-xs" /></div>
            <div><Label className="text-xs">Ledger</Label><Input value={`${setupAgency?.agencyName} - AGENCY A/C`} readOnly className="h-8 text-xs bg-muted" /></div>
            <div><Label className="text-xs">Group Ledger</Label><Input className="h-8 text-xs" /></div>
            <div><Label className="text-xs">Agency Ledger</Label><Input value={`${setupAgency?.agencyName} - AGENCY A/C`} readOnly className="h-8 text-xs bg-muted" /></div>
            <div><Label className="text-xs">Fix Branch Collection Station</Label><Input className="h-8 text-xs" /></div>
            <div className="flex gap-2"><Button size="sm" className="bg-green-600">Update</Button><Button size="sm" variant="outline">Create</Button><Button size="sm" variant="destructive">Remove</Button><Button variant="outline" size="sm" onClick={() => setSetupModalOpen(false)}>Close</Button></div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Close Station Modal - fields already have readOnly */}
      <Dialog open={closeStationModalOpen} onOpenChange={setCloseStationModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Close Station</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-xs">Agency Code <span className="text-red-500">*</span></Label><Input value={closeStationAgency?.agencyCode} readOnly className="h-8 text-xs bg-muted" /></div>
            <div><Label className="text-xs">Agency Name <span className="text-red-500">*</span></Label><Input value={closeStationAgency?.agencyName} readOnly className="h-8 text-xs bg-muted" /></div>
            <div><Label className="text-xs">Close Date <span className="text-red-500">*</span></Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(closeDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={closeDate} onSelect={(d) => d && setCloseDate(d)} /></PopoverContent></Popover></div>
            <div><Label className="text-xs">Reason <span className="text-red-500">*</span></Label><Textarea value={closeReason} onChange={(e) => setCloseReason(e.target.value)} rows={2} className="text-xs" /></div>
            <div className="flex gap-2"><Button size="sm" className="bg-red-600">Close Agency</Button><Button variant="outline" size="sm" onClick={() => setCloseStationModalOpen(false)}>Cancel</Button></div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Office Type Modal */}
      <Dialog open={changeOfficeTypeModalOpen} onOpenChange={setChangeOfficeTypeModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Change Office Type</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-xs">Name</Label><Input value={officeTypeAgency?.agencyName} readOnly className="h-8 text-xs bg-muted" /></div>
            <div><Label className="text-xs">Current Office Type</Label><Input value="AGENCY" readOnly className="h-8 text-xs bg-muted" /></div>
            <div><Label className="text-xs">New Office Type</Label>
              <Select value={newOfficeType} onValueChange={setNewOfficeType}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Hub">Hub</SelectItem><SelectItem value="Agency">Agency</SelectItem><SelectItem value="Branch">Branch</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="flex gap-2"><Button size="sm" className="bg-green-600">Save</Button><Button variant="outline" size="sm" onClick={() => setChangeOfficeTypeModalOpen(false)}>Close</Button></div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Info Note */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 rounded-md p-3">
        <div className="flex items-start gap-2"><AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" /><div className="text-xs text-blue-700 dark:text-blue-400">Fields marked * are mandatory. Use the action buttons to edit, setup, close station, or change office type.</div></div>
      </div>
    </div>
  );
}