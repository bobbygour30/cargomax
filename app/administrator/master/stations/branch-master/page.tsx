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
interface Branch {
  id: number;
  branchCode: string;
  activeDate: Date;
  isBorder: boolean;
  branchName: string;
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
  defaultHub: string;
  ledgerType: string;
  imprestLedger: string;
  cashLedger: string;
  branchLedger: string;
  shortCode: string;
  nearestServingAirport: string;
  freightOn: string;
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
  createGodown: boolean;
  otpForBooking: boolean;
  addCollection: boolean;
  allowPickupDeliveryPoint: boolean;
  requiredCounter: boolean;
  isDelivered: boolean;
  otpForDelivery: boolean;
  allowGatePassBill: boolean;
  allowDueGatePass: boolean;
  fundHold: boolean;
  allowCashGatePassOnly: boolean;
  allowBidding: boolean;
  hideDeductionInMR: boolean;
  status: "active" | "inactive";
}

// Constants
const zones = ["north zone", "south zone", "east zone", "western zone", "central zone"];
const ledgerTypeOptions = ["CASH LEDGER", "CREDIT LEDGER", "MIXED LEDGER"];
const freightOnOptions = ["CHARGE WEIGHT", "ACTUAL WEIGHT", "PER PACKAGE"];

// Mock data
const mockBranches: Branch[] = [
  {
    id: 1, branchCode: "294", activeDate: new Date("2026-04-01"), isBorder: false,
    branchName: "DIRECT PARTY", displayName: "", address: "", contactNo: "",
    city: "DELHI", pinCode: "", manager: "", state: "", country: "India",
    mobileNo: "", latitude: "", longitude: "", secondaryMobileNo: "", zone: "north zone",
    emailId: "", controlledBy: "GHAZIABAD R.O", defaultHub: "", ledgerType: "CASH LEDGER",
    imprestLedger: "", cashLedger: "", branchLedger: "", shortCode: "",
    nearestServingAirport: "", freightOn: "CHARGE WEIGHT", backDateGrAllowedDays: 0,
    invoiceCode: "",
    allowBooking: true, allowDelivery: false, allowTranshipment: false, focBooking: false,
    cashPaidBooking: false, creditBooking: false, toPayBooking: false, allowComputerizeGR: false,
    bookingOnTariffOnly: false, ewbMandatory: false, createGodown: false, otpForBooking: false,
    addCollection: false, allowPickupDeliveryPoint: false, requiredCounter: false, isDelivered: false,
    otpForDelivery: false, allowGatePassBill: false, allowDueGatePass: false, fundHold: false,
    allowCashGatePassOnly: false, allowBidding: false, hideDeductionInMR: false, status: "active",
  },
  {
    id: 2, branchCode: "128", activeDate: new Date("2026-04-01"), isBorder: false,
    branchName: "GHAZIABAD", displayName: "", address: "", contactNo: "9212450050/7065430172",
    city: "GHAZIABAD", pinCode: "", manager: "B.K JOSHI", state: "", country: "India",
    mobileNo: "", latitude: "", longitude: "", secondaryMobileNo: "", zone: "north zone",
    emailId: "", controlledBy: "GHAZIABAD R.O", defaultHub: "", ledgerType: "CASH LEDGER",
    imprestLedger: "", cashLedger: "", branchLedger: "", shortCode: "",
    nearestServingAirport: "", freightOn: "CHARGE WEIGHT", backDateGrAllowedDays: 0,
    invoiceCode: "",
    allowBooking: true, allowDelivery: false, allowTranshipment: false, focBooking: false,
    cashPaidBooking: false, creditBooking: false, toPayBooking: false, allowComputerizeGR: false,
    bookingOnTariffOnly: false, ewbMandatory: false, createGodown: false, otpForBooking: false,
    addCollection: false, allowPickupDeliveryPoint: false, requiredCounter: false, isDelivered: false,
    otpForDelivery: false, allowGatePassBill: false, allowDueGatePass: false, fundHold: false,
    allowCashGatePassOnly: false, allowBidding: false, hideDeductionInMR: false, status: "active",
  },
];

export default function BranchMaster() {
  const [activeTab, setActiveTab] = useState<"entry" | "search">("entry");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchStationName, setSearchStationName] = useState("");
  const [searchZoneName, setSearchZoneName] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [branches, setBranches] = useState<Branch[]>(mockBranches);
  const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);

  // Form state
  const [formData, setFormData] = useState<Branch>({
    id: 0, branchCode: "", activeDate: new Date("2026-04-01"), isBorder: false,
    branchName: "", displayName: "", address: "", contactNo: "", city: "", pinCode: "",
    manager: "", state: "", country: "India", mobileNo: "", latitude: "", longitude: "",
    secondaryMobileNo: "", zone: "", emailId: "", controlledBy: "", defaultHub: "",
    ledgerType: "CASH LEDGER", imprestLedger: "", cashLedger: "", branchLedger: "",
    shortCode: "", nearestServingAirport: "", freightOn: "CHARGE WEIGHT",
    backDateGrAllowedDays: 0, invoiceCode: "",
    allowBooking: false, allowDelivery: false, allowTranshipment: false, focBooking: false,
    cashPaidBooking: false, creditBooking: false, toPayBooking: false, allowComputerizeGR: false,
    bookingOnTariffOnly: false, ewbMandatory: false, createGodown: false, otpForBooking: false,
    addCollection: false, allowPickupDeliveryPoint: false, requiredCounter: false, isDelivered: false,
    otpForDelivery: false, allowGatePassBill: false, allowDueGatePass: false, fundHold: false,
    allowCashGatePassOnly: false, allowBidding: false, hideDeductionInMR: false, status: "active",
  });

  // Modal states
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [setupBranch, setSetupBranch] = useState<Branch | null>(null);
  const [closeStationModalOpen, setCloseStationModalOpen] = useState(false);
  const [closeStationBranch, setCloseStationBranch] = useState<Branch | null>(null);
  const [closeDate, setCloseDate] = useState<Date>(new Date());
  const [closeReason, setCloseReason] = useState("");
  const [changeOfficeTypeModalOpen, setChangeOfficeTypeModalOpen] = useState(false);
  const [officeTypeBranch, setOfficeTypeBranch] = useState<Branch | null>(null);
  const [newOfficeType, setNewOfficeType] = useState("");

  // Helper functions
  const generateBranchCode = () => {
    const maxCode = branches.reduce((max, b) => Math.max(max, parseInt(b.branchCode) || 0), 0);
    return (maxCode + 1).toString();
  };

  const resetForm = () => {
    setFormData({
      id: 0, branchCode: generateBranchCode(), activeDate: new Date("2026-04-01"), isBorder: false,
      branchName: "", displayName: "", address: "", contactNo: "", city: "", pinCode: "",
      manager: "", state: "", country: "India", mobileNo: "", latitude: "", longitude: "",
      secondaryMobileNo: "", zone: "", emailId: "", controlledBy: "", defaultHub: "",
      ledgerType: "CASH LEDGER", imprestLedger: "", cashLedger: "", branchLedger: "",
      shortCode: "", nearestServingAirport: "", freightOn: "CHARGE WEIGHT",
      backDateGrAllowedDays: 0, invoiceCode: "",
      allowBooking: false, allowDelivery: false, allowTranshipment: false, focBooking: false,
      cashPaidBooking: false, creditBooking: false, toPayBooking: false, allowComputerizeGR: false,
      bookingOnTariffOnly: false, ewbMandatory: false, createGodown: false, otpForBooking: false,
      addCollection: false, allowPickupDeliveryPoint: false, requiredCounter: false, isDelivered: false,
      otpForDelivery: false, allowGatePassBill: false, allowDueGatePass: false, fundHold: false,
      allowCashGatePassOnly: false, allowBidding: false, hideDeductionInMR: false, status: "active",
    });
    setEditId(null);
  };

  const handleSave = () => {
    if (!formData.branchName) { alert("Branch Name is required"); return; }
    if (!formData.address) { alert("Address is required"); return; }
    if (!formData.city) { alert("City is required"); return; }
    if (!formData.zone) { alert("Zone is required"); return; }
    if (!formData.controlledBy) { alert("Controlled By is required"); return; }

    setLoading(true);
    setTimeout(() => {
      if (editId) {
        setBranches(branches.map(b => b.id === editId ? { ...formData, id: editId } : b));
        alert("Branch updated");
      } else {
        const newBranch = { ...formData, id: Date.now(), branchCode: generateBranchCode() };
        setBranches([...branches, newBranch]);
        alert("Branch saved");
      }
      resetForm();
      setActiveTab("search");
      setLoading(false);
    }, 500);
  };

  const handleEdit = (branch: Branch) => {
    setFormData({ ...branch });
    setEditId(branch.id);
    setActiveTab("entry");
  };

  const handleSearch = () => {
    let results = [...branches];
    if (searchStationName) {
      results = results.filter(b => b.branchName.toLowerCase().includes(searchStationName.toLowerCase()));
    }
    if (searchZoneName !== "ALL") {
      results = results.filter(b => b.zone === searchZoneName);
    }
    if (searchTerm) {
      results = results.filter(b =>
        b.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.branchCode.includes(searchTerm) ||
        b.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredBranches(results);
    setCurrentPage(1);
  };

  const handleSetup = (branch: Branch) => {
    setSetupBranch(branch);
    setSetupModalOpen(true);
  };

  const handleCloseStation = (branch: Branch) => {
    setCloseStationBranch(branch);
    setCloseDate(new Date());
    setCloseReason("");
    setCloseStationModalOpen(true);
  };

  const handleChangeOfficeType = (branch: Branch) => {
    setOfficeTypeBranch(branch);
    setNewOfficeType("Branch");
    setChangeOfficeTypeModalOpen(true);
  };

  const paginated = (filteredBranches.length ? filteredBranches : branches).slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil((filteredBranches.length ? filteredBranches.length : branches.length) / itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">BRANCH MASTER</h1>
        <div className="mt-1 text-[10px] md:text-xs text-muted-foreground break-words">
          Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD | Login By : MAYANK.GRLOGISTICS@GMAIL.COM | Login Branch : CORPORATE OFFICE | FY : 2026-2027
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button onClick={() => { setActiveTab("entry"); resetForm(); }} className={cn("px-4 py-2 text-sm font-medium", activeTab === "entry" ? "border-b-2 border-primary text-primary" : "text-muted-foreground")}>Entry</button>
        <button onClick={() => { setActiveTab("search"); setFilteredBranches([]); setSearchStationName(""); setSearchZoneName("ALL"); setSearchTerm(""); setCurrentPage(1); }} className={cn("px-4 py-2 text-sm font-medium", activeTab === "search" ? "border-b-2 border-primary text-primary" : "text-muted-foreground")}>Search</button>
      </div>

      {/* Entry Tab */}
      {activeTab === "entry" && (
        <Card>
          <CardHeader><CardTitle className="text-base">Branch Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div><Label className="text-xs">Branch Code</Label><Input value={formData.branchCode} readOnly className="h-8 text-xs bg-muted" /></div>
              <div><Label className="text-xs">Active Date <span className="text-red-500">*</span></Label>
                <Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(formData.activeDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={formData.activeDate} onSelect={(d) => d && setFormData({ ...formData, activeDate: d })} /></PopoverContent></Popover>
              </div>
              <div className="flex items-center gap-2 mt-6"><Checkbox checked={formData.isBorder} onCheckedChange={(c) => setFormData({ ...formData, isBorder: !!c })} id="isBorder" /><Label htmlFor="isBorder" className="text-xs">Is Border</Label></div>
              <div><Label className="text-xs">Branch Name <span className="text-red-500">*</span></Label><Input value={formData.branchName} onChange={(e) => setFormData({ ...formData, branchName: e.target.value })} className="h-8 text-xs" /></div>
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
              <div><Label className="text-xs">Controlled By <span className="text-red-500">*</span></Label><Input value={formData.controlledBy} onChange={(e) => setFormData({ ...formData, controlledBy: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Default Hub</Label><Input value={formData.defaultHub} onChange={(e) => setFormData({ ...formData, defaultHub: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Ledger Type <span className="text-red-500">*</span></Label>
                <Select value={formData.ledgerType} onValueChange={(v) => setFormData({ ...formData, ledgerType: v })}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{ledgerTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs">Imprest Ledger</Label><Input value={formData.imprestLedger} onChange={(e) => setFormData({ ...formData, imprestLedger: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Cash Ledger</Label><Input value={formData.cashLedger} onChange={(e) => setFormData({ ...formData, cashLedger: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Branch Ledger</Label><Input value={formData.branchLedger} onChange={(e) => setFormData({ ...formData, branchLedger: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Short Code</Label><Input value={formData.shortCode} onChange={(e) => setFormData({ ...formData, shortCode: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Nearest Serving Airport</Label><Input value={formData.nearestServingAirport} onChange={(e) => setFormData({ ...formData, nearestServingAirport: e.target.value })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Freight On</Label>
                <Select value={formData.freightOn} onValueChange={(v) => setFormData({ ...formData, freightOn: v })}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{freightOnOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs">Back Date Gr Allowed Days</Label><Input type="number" value={formData.backDateGrAllowedDays} onChange={(e) => setFormData({ ...formData, backDateGrAllowedDays: Number(e.target.value) })} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Invoice Code</Label><Input value={formData.invoiceCode} onChange={(e) => setFormData({ ...formData, invoiceCode: e.target.value })} className="h-8 text-xs" /></div>
            </div>

            {/* Checkboxes - responsive grid */}
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
              <div className="flex items-center gap-2"><Checkbox checked={formData.createGodown} onCheckedChange={(c) => setFormData({ ...formData, createGodown: !!c })} id="createGodown" /><Label className="text-xs">Create Godown</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.otpForBooking} onCheckedChange={(c) => setFormData({ ...formData, otpForBooking: !!c })} id="otpForBooking" /><Label className="text-xs">OTP For Booking</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.addCollection} onCheckedChange={(c) => setFormData({ ...formData, addCollection: !!c })} id="addCollection" /><Label className="text-xs">Add Collection</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.allowPickupDeliveryPoint} onCheckedChange={(c) => setFormData({ ...formData, allowPickupDeliveryPoint: !!c })} id="allowPickupDeliveryPoint" /><Label className="text-xs">Allow Pickup/Delivery Point</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.requiredCounter} onCheckedChange={(c) => setFormData({ ...formData, requiredCounter: !!c })} id="requiredCounter" /><Label className="text-xs">Required Counter</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.isDelivered} onCheckedChange={(c) => setFormData({ ...formData, isDelivered: !!c })} id="isDelivered" /><Label className="text-xs">Is Delivered</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.otpForDelivery} onCheckedChange={(c) => setFormData({ ...formData, otpForDelivery: !!c })} id="otpForDelivery" /><Label className="text-xs">OTP For Delivery</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.allowGatePassBill} onCheckedChange={(c) => setFormData({ ...formData, allowGatePassBill: !!c })} id="allowGatePassBill" /><Label className="text-xs">Allow Gate Pass Bill</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.allowDueGatePass} onCheckedChange={(c) => setFormData({ ...formData, allowDueGatePass: !!c })} id="allowDueGatePass" /><Label className="text-xs">Allow Due Gate Pass</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.fundHold} onCheckedChange={(c) => setFormData({ ...formData, fundHold: !!c })} id="fundHold" /><Label className="text-xs">Fund Hold</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.allowCashGatePassOnly} onCheckedChange={(c) => setFormData({ ...formData, allowCashGatePassOnly: !!c })} id="allowCashGatePassOnly" /><Label className="text-xs">Allow Cash Gate Pass Only</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.allowBidding} onCheckedChange={(c) => setFormData({ ...formData, allowBidding: !!c })} id="allowBidding" /><Label className="text-xs">Allow Bidding</Label></div>
              <div className="flex items-center gap-2"><Checkbox checked={formData.hideDeductionInMR} onCheckedChange={(c) => setFormData({ ...formData, hideDeductionInMR: !!c })} id="hideDeductionInMR" /><Label className="text-xs">Hide Deduction In MR</Label></div>
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
          <div className="flex gap-2"><div className="relative flex-1 max-w-md"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" /><Input placeholder="Search by Branch Name, Code or City..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 h-8 text-xs" /></div><Button onClick={handleSearch} size="sm" className="h-8 text-xs"><Search className="mr-1 h-3.5 w-3.5" />SEARCH</Button></div>

          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[1200px]">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12 text-center">S#</TableHead>
                    <TableHead>Branch Code</TableHead>
                    <TableHead>Branch Name</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Contact #</TableHead>
                    <TableHead>Hub</TableHead>
                    <TableHead>R.O. Name</TableHead>
                    <TableHead>Manager</TableHead>
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
                  {paginated.map((branch, idx) => (
                    <TableRow key={branch.id}>
                      <TableCell className="text-center">{(currentPage-1)*itemsPerPage+idx+1}</TableCell>
                      <TableCell>{branch.branchCode}</TableCell>
                      <TableCell className="font-medium">{branch.branchName}</TableCell>
                      <TableCell>{branch.city}</TableCell>
                      <TableCell>{branch.contactNo || "-"}</TableCell>
                      <TableCell>{branch.defaultHub || "-"}</TableCell>
                      <TableCell>{branch.controlledBy}</TableCell>
                      <TableCell>{branch.manager || "-"}</TableCell>
                      <TableCell>{branch.mobileNo || "-"}</TableCell>
                      <TableCell><span className={cn("px-2 py-0.5 rounded-full text-[10px]", branch.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>{branch.status === "active" ? "Active" : "Inactive"}</span></TableCell>
                      <TableCell>{branch.allowBooking ? "Yes" : "No"}</TableCell>
                      <TableCell>{branch.allowDelivery ? "Yes" : "No"}</TableCell>
                      <TableCell>{branch.allowTranshipment ? "Yes" : "No"}</TableCell>
                      <TableCell>{branch.shortCode || "-"}</TableCell>
                      <TableCell>
                        <div className="flex flex-nowrap gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(branch)} className="h-6 w-6 p-0 text-blue-500"><Pencil className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => handleSetup(branch)} className="h-6 w-6 p-0 text-green-500"><Settings className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => handleCloseStation(branch)} className="h-6 w-6 p-0 text-red-500"><X className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => handleChangeOfficeType(branch)} className="h-6 w-6 p-0 text-orange-500"><RefreshCw className="h-3.5 w-3.5" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {paginated.length === 0 && <TableRow><TableCell colSpan={15} className="text-center py-8">No branches found</TableCell></TableRow>}
                </TableBody>
              </Table>
            </div>
          </div>
          {totalPages > 1 && <div className="flex justify-center gap-1"><Button variant="outline" size="sm" onClick={() => goToPage(currentPage-1)} disabled={currentPage===1}>Previous</Button><span className="px-3 py-1 text-xs bg-muted rounded-md">Page {currentPage} of {totalPages}</span><Button variant="outline" size="sm" onClick={() => goToPage(currentPage+1)} disabled={currentPage===totalPages}>Next</Button></div>}
        </div>
      )}

      {/* Setup Modal */}
      <Dialog open={setupModalOpen} onOpenChange={setSetupModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Setup - {setupBranch?.branchName}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-xs">Cash Ledger</Label><Input className="h-8 text-xs" /></div>
            <div><Label className="text-xs">Cash Market Ledger</Label><Input className="h-8 text-xs" /></div>
            <div><Label className="text-xs">Ledger</Label><Input value={`${setupBranch?.branchName} - BRANCH A/C`} readOnly className="h-8 text-xs bg-muted" /></div>
            <div><Label className="text-xs">Group Ledger</Label><Input className="h-8 text-xs" /></div>
            <div><Label className="text-xs">Branch Ledger</Label><Input value={`${setupBranch?.branchName} - BRANCH A/C`} readOnly className="h-8 text-xs bg-muted" /></div>
            <div><Label className="text-xs">Fix Branch Collection Station</Label><Input className="h-8 text-xs" /></div>
            <div className="flex gap-2"><Button size="sm" className="bg-green-600">Update</Button><Button size="sm" variant="outline">Create</Button><Button size="sm" variant="destructive">Remove</Button><Button variant="outline" size="sm" onClick={() => setSetupModalOpen(false)}>Close</Button></div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Close Station Modal */}
      <Dialog open={closeStationModalOpen} onOpenChange={setCloseStationModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Close Station</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-xs">Branch Code <span className="text-red-500">*</span></Label><Input value={closeStationBranch?.branchCode} readOnly className="h-8 text-xs bg-muted" /></div>
            <div><Label className="text-xs">Branch Name <span className="text-red-500">*</span></Label><Input value={closeStationBranch?.branchName} readOnly className="h-8 text-xs bg-muted" /></div>
            <div><Label className="text-xs">Close Date <span className="text-red-500">*</span></Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(closeDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={closeDate} onSelect={(d) => d && setCloseDate(d)} /></PopoverContent></Popover></div>
            <div><Label className="text-xs">Reason <span className="text-red-500">*</span></Label><Textarea value={closeReason} onChange={(e) => setCloseReason(e.target.value)} rows={2} className="text-xs" /></div>
            <div className="flex gap-2"><Button size="sm" className="bg-red-600">Close Branch</Button><Button variant="outline" size="sm" onClick={() => setCloseStationModalOpen(false)}>Cancel</Button></div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Office Type Modal */}
      <Dialog open={changeOfficeTypeModalOpen} onOpenChange={setChangeOfficeTypeModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Change Office Type</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-xs">Name</Label><Input value={officeTypeBranch?.branchName} readOnly className="h-8 text-xs bg-muted" /></div>
            <div><Label className="text-xs">Current Office Type</Label><Input value="BRANCH" readOnly className="h-8 text-xs bg-muted" /></div>
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
        <div className="flex items-start gap-2"><AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" /><div className="text-xs text-blue-700 dark:text-blue-400">Fields marked * are mandatory. Use action buttons to edit, setup, close, or change office type.</div></div>
      </div>
    </div>
  );
}