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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
  CalendarIcon,
  Save,
  Search,
  Trash2,
  Plus,
  AlertCircle,
  FileSpreadsheet,
  Upload,
} from "lucide-react";
import { format } from "date-fns";

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------
interface ChargeItem {
  id: number;
  charge: string;
  addLess: string;
  applicableOn: string;
  rate: number;
  amount: number;
  minimumAmount: number;
}

interface FtRate {
  id: number;
  vehicleType: string;
  oneWayTripAmount: number;
  roundTripAmount: number;
}

interface PreCustomerPcsRate {
  id: number;
  part: string;
  gender: string;
  rate: number;
  minimumAmount: number;
}

interface FixAmountRate {
  amount: number;
}

interface PerPackageRate {
  id: number;
  fromPckgs: number;
  toPckgs: number;
  uptoWeight: number;
  rate: number;
  perKgAdditionalRate: number;
  minimumAmount: number;
}

interface WeightSlabRate {
  id: number;
  fromWeight: number;
  toWeight: number;
  minWeight: number;
  maxWeight: number;
  rate: number;
  minAmount: number;
  flatAmount: number;
  additionalPerKgRate: number;
  calculationOnPckgs: boolean;
  perPckgsWt: number;
  additionalPerPckgsWt: number;
}

interface BulkyRate {
  id: number;
  fromWeight: number;
  toWeight: number;
  minWeight: number;
  rate: number;
  minAmount: number;
  flatAmount: number;
  additionalPerKgRate: number;
  bulky: string;
}

interface HeightSlabRate {
  id: number;
  fromHeight: number;
  toHeight: number;
  minHeight: number;
  maxHeight: number;
  rate: number;
  minAmount: number;
  flatAmount: number;
  additionalPerFtRate: number;
  calculationOnPckgs: boolean;
  perPckgsFt: number;
  additionalPerPckgsFt: number;
}

// ------------------------------------------------------------
// Constants
// ------------------------------------------------------------
const productOptions = ["Product A", "Product B", "Product C"];
const insuranceOptions = ["Carrier", "Consignor", "Consignee"];
const rateCategoryOptions = ["ALL", "Standard", "Premium", "Discount"];
const unitTypeOptions = ["CM", "INCH", "MM", "METER", "FEET"];
const chargeOptions = [
  "PF CHARGE",
  "DOCKET CHARGE",
  "HAMALI CHARGE",
  "GREEN TAX CHARGE",
  "DOOR DELIVERY",
  "OTHER CHARGES",
];
const applicableOnOptions = ["Docket", "Weight", "Package", "Freight", "Value"];
const addLessOptions = ["+", "-"];
const vehicleTypes = [
  "CANTER",
  "CART",
  "CONTAINER",
  "OPEN BODY TRUCK",
  "TEMPO",
  "TRAILER",
  "TRUCK",
  "TWO WHEELER",
];

export default function TariffMaster() {
  const [activeTab, setActiveTab] = useState<"entry" | "search">("entry");
  const [loading, setLoading] = useState(false);
  const [contractId, setContractId] = useState<number | null>(null);

  // Contract form state
  const [contractNo, setContractNo] = useState("");
  const [autoContract, setAutoContract] = useState(true);
  const [contractDate, setContractDate] = useState(new Date());
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [product, setProduct] = useState("");
  const [selectOriginOn] = useState("Whole Country");
  const [selectDestinationOn] = useState("Whole Country");
  const [insuranceCoveredBy, setInsuranceCoveredBy] = useState("");
  const [rateCategory, setRateCategory] = useState("ALL");
  const [charges, setCharges] = useState<ChargeItem[]>([
    { id: 1, charge: "PF CHARGE", addLess: "+", applicableOn: "Docket", rate: 0, amount: 0, minimumAmount: 0 },
    { id: 2, charge: "DOCKET CHARGE", addLess: "+", applicableOn: "Docket", rate: 0, amount: 100, minimumAmount: 0 },
    { id: 3, charge: "HAMALI CHARGE", addLess: "+", applicableOn: "Docket", rate: 0, amount: 0, minimumAmount: 0 },
    { id: 4, charge: "GREEN TAX CHARGE", addLess: "+", applicableOn: "Docket", rate: 0, amount: 0, minimumAmount: 0 },
    { id: 5, charge: "DOOR DELIVERY", addLess: "+", applicableOn: "Docket", rate: 0, amount: 0, minimumAmount: 0 },
    { id: 6, charge: "OTHER CHARGES", addLess: "+", applicableOn: "Docket", rate: 0, amount: 0, minimumAmount: 0 },
  ]);
  const [bankBuiltyCharges, setBankBuiltyCharges] = useState(0);
  const [unitType, setUnitType] = useState("CM");
  const [cft, setCft] = useState(0);
  const [remarks, setRemarks] = useState("");

  // Modal visibility
  const [ftlModalOpen, setFtlModalOpen] = useState(false);
  const [preCustomerModalOpen, setPreCustomerModalOpen] = useState(false);
  const [fixAmountModalOpen, setFixAmountModalOpen] = useState(false);
  const [perPackageModalOpen, setPerPackageModalOpen] = useState(false);
  const [weightSlabModalOpen, setWeightSlabModalOpen] = useState(false);
  const [bulkyModalOpen, setBulkyModalOpen] = useState(false);
  const [heightSlabModalOpen, setHeightSlabModalOpen] = useState(false);
  const [vehicleSelectModalOpen, setVehicleSelectModalOpen] = useState(false);

  // Rate data
  const [ftlRates, setFtlRates] = useState<FtRate[]>([]);
  const [preCustomerPcsRates, setPreCustomerPcsRates] = useState<PreCustomerPcsRate[]>([
    { id: Date.now(), part: "", gender: "", rate: 0, minimumAmount: 0 },
  ]);
  const [fixAmountRate, setFixAmountRate] = useState<FixAmountRate>({ amount: 0 });
  const [perPackageRates, setPerPackageRates] = useState<PerPackageRate[]>([
    { id: Date.now(), fromPckgs: 0, toPckgs: 0, uptoWeight: 0, rate: 0, perKgAdditionalRate: 0, minimumAmount: 0 },
  ]);
  const [weightSlabRates, setWeightSlabRates] = useState<WeightSlabRate[]>([
    { id: Date.now(), fromWeight: 0, toWeight: 0, minWeight: 0, maxWeight: 0, rate: 0, minAmount: 0, flatAmount: 0, additionalPerKgRate: 0, calculationOnPckgs: false, perPckgsWt: 0, additionalPerPckgsWt: 0 },
  ]);
  const [bulkyRates, setBulkyRates] = useState<BulkyRate[]>([
    { id: Date.now(), fromWeight: 0, toWeight: 0, minWeight: 0, rate: 0, minAmount: 0, flatAmount: 0, additionalPerKgRate: 0, bulky: "Y" },
  ]);
  const [heightSlabRates, setHeightSlabRates] = useState<HeightSlabRate[]>([
    { id: Date.now(), fromHeight: 0, toHeight: 0, minHeight: 0, maxHeight: 0, rate: 0, minAmount: 0, flatAmount: 0, additionalPerFtRate: 0, calculationOnPckgs: false, perPckgsFt: 0, additionalPerPckgsFt: 0 },
  ]);

  const [vehicleSearch, setVehicleSearch] = useState("");
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState<string[]>([]);

  // Search state
  const [searchBranchName, setSearchBranchName] = useState("");
  const [searchStatus, setSearchStatus] = useState("ALL");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ------------------------------------------------------------
  // Handlers
  // ------------------------------------------------------------
  const handleAddChargeRow = () => {
    setCharges([...charges, { id: Date.now(), charge: "", addLess: "+", applicableOn: "Docket", rate: 0, amount: 0, minimumAmount: 0 }]);
  };
  const updateCharge = (id: number, field: keyof ChargeItem, value: any) => {
    setCharges(charges.map(c => (c.id === id ? { ...c, [field]: value } : c)));
  };
  const removeCharge = (id: number) => {
    setCharges(charges.filter(c => c.id !== id));
  };
  const clearAllCharges = () => setCharges([]);

  const addFtlRate = () => setFtlRates([...ftlRates, { id: Date.now(), vehicleType: "", oneWayTripAmount: 0, roundTripAmount: 0 }]);
  const updateFtlRate = (id: number, field: keyof FtRate, value: any) => {
    setFtlRates(ftlRates.map(r => (r.id === id ? { ...r, [field]: value } : r)));
  };
  const removeFtlRate = (id: number) => setFtlRates(ftlRates.filter(r => r.id !== id));

  const addPreCustomerRow = () => setPreCustomerPcsRates([...preCustomerPcsRates, { id: Date.now(), part: "", gender: "", rate: 0, minimumAmount: 0 }]);
  const updatePreCustomer = (id: number, field: keyof PreCustomerPcsRate, value: any) => {
    setPreCustomerPcsRates(preCustomerPcsRates.map(r => (r.id === id ? { ...r, [field]: value } : r)));
  };
  const removePreCustomer = (id: number) => setPreCustomerPcsRates(preCustomerPcsRates.filter(r => r.id !== id));

  const addPerPackageRow = () => setPerPackageRates([...perPackageRates, { id: Date.now(), fromPckgs: 0, toPckgs: 0, uptoWeight: 0, rate: 0, perKgAdditionalRate: 0, minimumAmount: 0 }]);
  const updatePerPackage = (id: number, field: keyof PerPackageRate, value: any) => {
    setPerPackageRates(perPackageRates.map(r => (r.id === id ? { ...r, [field]: value } : r)));
  };
  const removePerPackage = (id: number) => setPerPackageRates(perPackageRates.filter(r => r.id !== id));

  const addWeightSlabRow = () => setWeightSlabRates([...weightSlabRates, { id: Date.now(), fromWeight: 0, toWeight: 0, minWeight: 0, maxWeight: 0, rate: 0, minAmount: 0, flatAmount: 0, additionalPerKgRate: 0, calculationOnPckgs: false, perPckgsWt: 0, additionalPerPckgsWt: 0 }]);
  const updateWeightSlab = (id: number, field: keyof WeightSlabRate, value: any) => {
    setWeightSlabRates(weightSlabRates.map(r => (r.id === id ? { ...r, [field]: value } : r)));
  };
  const removeWeightSlab = (id: number) => setWeightSlabRates(weightSlabRates.filter(r => r.id !== id));

  const addBulkyRow = () => setBulkyRates([...bulkyRates, { id: Date.now(), fromWeight: 0, toWeight: 0, minWeight: 0, rate: 0, minAmount: 0, flatAmount: 0, additionalPerKgRate: 0, bulky: "Y" }]);
  const updateBulky = (id: number, field: keyof BulkyRate, value: any) => {
    setBulkyRates(bulkyRates.map(r => (r.id === id ? { ...r, [field]: value } : r)));
  };
  const removeBulky = (id: number) => setBulkyRates(bulkyRates.filter(r => r.id !== id));

  const addHeightSlabRow = () => setHeightSlabRates([...heightSlabRates, { id: Date.now(), fromHeight: 0, toHeight: 0, minHeight: 0, maxHeight: 0, rate: 0, minAmount: 0, flatAmount: 0, additionalPerFtRate: 0, calculationOnPckgs: false, perPckgsFt: 0, additionalPerPckgsFt: 0 }]);
  const updateHeightSlab = (id: number, field: keyof HeightSlabRate, value: any) => {
    setHeightSlabRates(heightSlabRates.map(r => (r.id === id ? { ...r, [field]: value } : r)));
  };
  const removeHeightSlab = (id: number) => setHeightSlabRates(heightSlabRates.filter(r => r.id !== id));

  const handleSaveContract = () => alert("Contract saved (mock)");
  const handleSearch = () => setSearchResults([]);

  const paginated = searchResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">TARIFF MASTER</h1>
        <div className="mt-1 text-[10px] md:text-xs text-muted-foreground">
          Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD | Login By : MAYANK.GRLOGISTICS@GMAIL.COM | Login Branch : CORPORATE OFFICE | FY : 2026-2027
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "entry" | "search")}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="entry">Entry</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
        </TabsList>

        {/* ENTRY TAB */}
        <TabsContent value="entry" className="space-y-4 mt-4">
          {/* Import buttons */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm"><FileSpreadsheet className="mr-1 h-3.5 w-3.5" /> Manual</Button>
            <Button variant="outline" size="sm"><Upload className="mr-1 h-3.5 w-3.5" /> Import From Excel Air</Button>
            <Button variant="outline" size="sm"><Upload className="mr-1 h-3.5 w-3.5" /> Import From Excel Other</Button>
            <Button variant="outline" size="sm"><Upload className="mr-1 h-3.5 w-3.5" /> Import From Excel FTL</Button>
          </div>

          {/* Contract header */}
          <div className="border rounded-md p-4">
            <h3 className="text-sm font-semibold mb-3">Contract Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div><Label className="text-xs">Rate ID</Label><Input value={contractId ? String(contractId) : ""} readOnly className="h-8 bg-muted" /></div>
              <div><Label className="text-xs">Contract # /Date <span className="text-red-500">*</span></Label><div className="flex gap-2"><Input value={contractNo} onChange={(e) => setContractNo(e.target.value)} className="h-8 flex-1" /><div className="flex items-center gap-1"><Checkbox checked={autoContract} onCheckedChange={(checked) => setAutoContract(checked === true)} id="auto" /><Label htmlFor="auto" className="text-xs">Auto</Label></div></div></div>
              <div><Label className="text-xs">Contract Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full"><CalendarIcon className="mr-1 h-3 w-3" />{format(contractDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={contractDate} onSelect={(d) => d && setContractDate(d)} /></PopoverContent></Popover></div>
              <div><Label className="text-xs">Contract Period <span className="text-red-500">*</span></Label><div className="flex gap-2"><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 flex-1"><CalendarIcon className="mr-1 h-3 w-3" />{format(fromDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={fromDate} onSelect={(d) => d && setFromDate(d)} /></PopoverContent></Popover><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 flex-1"><CalendarIcon className="mr-1 h-3 w-3" />{format(toDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={toDate} onSelect={(d) => d && setToDate(d)} /></PopoverContent></Popover></div></div>
              <div><Label className="text-xs">Product <span className="text-red-500">*</span></Label><Select value={product} onValueChange={setProduct}><SelectTrigger className="h-8"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{productOptions.map(p => (<SelectItem key={p} value={p}>{p}</SelectItem>))}</SelectContent></Select></div>
              <div><Label className="text-xs">Select Origin On</Label><Input value={selectOriginOn} readOnly className="h-8 bg-muted" /></div>
              <div><Label className="text-xs">Select Destination On</Label><Input value={selectDestinationOn} readOnly className="h-8 bg-muted" /></div>
              <div><Label className="text-xs">Insurance Covered By</Label><Select value={insuranceCoveredBy} onValueChange={setInsuranceCoveredBy}><SelectTrigger className="h-8"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{insuranceOptions.map(i => (<SelectItem key={i} value={i}>{i}</SelectItem>))}</SelectContent></Select></div>
              <div><Label className="text-xs">Rate Category</Label><Select value={rateCategory} onValueChange={setRateCategory}><SelectTrigger className="h-8"><SelectValue /></SelectTrigger><SelectContent>{rateCategoryOptions.map(c => (<SelectItem key={c} value={c}>{c}</SelectItem>))}</SelectContent></Select></div>
            </div>
          </div>

          {/* Charges table */}
          <div className="border rounded-md">
            <div className="flex justify-between items-center p-3 border-b"><h3 className="text-sm font-semibold">Charges</h3><Button onClick={handleAddChargeRow} variant="ghost" size="sm"><Plus className="h-3.5 w-3.5" /> Add Row</Button></div>
            <div className="overflow-x-auto p-3">
              <table className="w-full text-xs border-collapse">
                <thead><tr className="bg-muted/50"><th className="p-2 border">S#</th><th className="p-2 border">Charge</th><th className="p-2 border">Add/Less</th><th className="p-2 border">Applicable On</th><th className="p-2 border">Rate</th><th className="p-2 border">Amount</th><th className="p-2 border">Minimum Amount</th><th className="p-2 border">Action</th></tr></thead>
                <tbody>{charges.map((c, idx) => (<tr key={c.id}><td className="p-2 border text-center">{idx+1}</td><td className="p-2 border"><Select value={c.charge} onValueChange={(v) => updateCharge(c.id, "charge", v)}><SelectTrigger className="h-7 w-32"><SelectValue /></SelectTrigger><SelectContent>{chargeOptions.map(ch => (<SelectItem key={ch} value={ch}>{ch}</SelectItem>))}</SelectContent></Select></td><td className="p-2 border"><Select value={c.addLess} onValueChange={(v) => updateCharge(c.id, "addLess", v)}><SelectTrigger className="h-7 w-20"><SelectValue /></SelectTrigger><SelectContent>{addLessOptions.map(al => (<SelectItem key={al} value={al}>{al}</SelectItem>))}</SelectContent></Select></td><td className="p-2 border"><Select value={c.applicableOn} onValueChange={(v) => updateCharge(c.id, "applicableOn", v)}><SelectTrigger className="h-7 w-24"><SelectValue /></SelectTrigger><SelectContent>{applicableOnOptions.map(a => (<SelectItem key={a} value={a}>{a}</SelectItem>))}</SelectContent></Select></td><td className="p-2 border"><Input type="number" value={c.rate} onChange={(e) => updateCharge(c.id, "rate", Number(e.target.value))} className="h-7 w-20" /></td><td className="p-2 border"><Input type="number" value={c.amount} onChange={(e) => updateCharge(c.id, "amount", Number(e.target.value))} className="h-7 w-20" /></td><td className="p-2 border"><Input type="number" value={c.minimumAmount} onChange={(e) => updateCharge(c.id, "minimumAmount", Number(e.target.value))} className="h-7 w-20" /></td><td className="p-2 border text-center"><Button variant="ghost" size="sm" onClick={() => removeCharge(c.id)}><Trash2 className="h-3.5 w-3.5" /></Button></td></tr>))}</tbody>
              </table>
              <div className="flex justify-end mt-2"><Button onClick={clearAllCharges} variant="outline" size="sm">Clear All Charges</Button></div>
            </div>
          </div>

          {/* Bank Builty, Unit Type, CFT */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div><Label className="text-xs">Bank Builty Charges</Label><Input type="number" value={bankBuiltyCharges} onChange={(e) => setBankBuiltyCharges(Number(e.target.value))} className="h-8" /></div>
            <div><Label className="text-xs">Unit Type</Label><Select value={unitType} onValueChange={setUnitType}><SelectTrigger className="h-8"><SelectValue /></SelectTrigger><SelectContent>{unitTypeOptions.map(u => (<SelectItem key={u} value={u}>{u}</SelectItem>))}</SelectContent></Select></div>
            <div><Label className="text-xs">CFT</Label><Input type="number" value={cft} onChange={(e) => setCft(Number(e.target.value))} className="h-8" /></div>
          </div>

          <Textarea placeholder="Please Enter Remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={2} className="text-xs" />

          {/* Rate type buttons */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setFtlModalOpen(true)}>FTL RATES</Button>
            <Button variant="outline" size="sm" onClick={() => setPreCustomerModalOpen(true)}>PRE CUSTOMER PCS RATES</Button>
            <Button variant="outline" size="sm" onClick={() => setFixAmountModalOpen(true)}>FIX AMOUNT RATES</Button>
            <Button variant="outline" size="sm" onClick={() => setPerPackageModalOpen(true)}>PER PACKAGE RATES</Button>
            <Button variant="outline" size="sm" onClick={() => setWeightSlabModalOpen(true)}>WEIGHT SLAB RATES</Button>
            <Button variant="outline" size="sm" onClick={() => setBulkyModalOpen(true)}>BULKY RATES</Button>
            <Button variant="outline" size="sm" onClick={() => setHeightSlabModalOpen(true)}>HEIGHT SLAB RATES</Button>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2">
            <Button onClick={handleSaveContract} size="sm" className="bg-green-600">Save Rates</Button>
            <Button variant="outline" size="sm">Approve & Close Contract</Button>
            <Button variant="destructive" size="sm">Delete Contract</Button>
            <Button variant="outline" size="sm">Clear</Button>
          </div>
        </TabsContent>

        {/* SEARCH TAB */}
        <TabsContent value="search" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 border rounded-md bg-muted/20">
            <div><Label className="text-xs">Branch Name</Label><Input value={searchBranchName} onChange={(e) => setSearchBranchName(e.target.value)} className="h-8" /></div>
            <div><Label className="text-xs">Status</Label><Select value={searchStatus} onValueChange={setSearchStatus}><SelectTrigger className="h-8"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ALL">ALL</SelectItem><SelectItem value="ACTIVE">ACTIVE</SelectItem><SelectItem value="INACTIVE">INACTIVE</SelectItem></SelectContent></Select></div>
            <div className="flex gap-2"><Button onClick={handleSearch} size="sm">SEARCH</Button><Button variant="outline" size="sm">TARIFF</Button></div>
          </div>
          <div className="rounded-md border overflow-x-auto"><Table className="text-xs"><TableHeader><TableRow><TableHead>Rate Id</TableHead><TableHead>Customer</TableHead><TableHead>Department</TableHead><TableHead>Branch</TableHead><TableHead>Destination</TableHead><TableHead>Rate For</TableHead><TableHead>Mode Type</TableHead><TableHead>From Date</TableHead><TableHead>To Date</TableHead><TableHead>Options</TableHead></TableRow></TableHeader><TableBody>{paginated.length === 0 ? (<TableRow><TableCell colSpan={10} className="text-center py-8">No data</TableCell></TableRow>) : paginated.map((row, idx) => (<TableRow key={idx}><TableCell>{row.id}</TableCell><TableCell>{row.customer}</TableCell><TableCell>{row.department}</TableCell><TableCell>{row.branch}</TableCell><TableCell>{row.destination}</TableCell><TableCell>{row.rateFor}</TableCell><TableCell>{row.modeType}</TableCell><TableCell>{row.fromDate}</TableCell><TableCell>{row.toDate}</TableCell><TableCell>...</TableCell></TableRow>))}</TableBody></Table></div>
          {totalPages > 1 && (<div className="flex justify-center gap-1"><Button variant="outline" size="sm" onClick={() => goToPage(currentPage-1)} disabled={currentPage===1}>Previous</Button><span className="px-3 py-1 text-xs bg-muted rounded-md">Page {currentPage} of {totalPages}</span><Button variant="outline" size="sm" onClick={() => goToPage(currentPage+1)} disabled={currentPage===totalPages}>Next</Button></div>)}
        </TabsContent>
      </Tabs>

      {/* -------------------- MODALS -------------------- */}

      {/* FTL RATES MODAL */}
      <Dialog open={ftlModalOpen} onOpenChange={setFtlModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader><DialogTitle>FTL Rates</DialogTitle></DialogHeader>
          <div className="flex gap-2 mb-2"><Input placeholder="Search vehicle type..." value={vehicleSearch} onChange={(e) => setVehicleSearch(e.target.value)} className="h-8" /><Button onClick={() => setVehicleSelectModalOpen(true)} size="sm">Select Vehicle Type</Button></div>
          <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>S#</TableHead><TableHead>Vehicle Type</TableHead><TableHead>One way Trip Amount</TableHead><TableHead>Round Trip Amount</TableHead><TableHead>Action</TableHead></TableRow></TableHeader><TableBody>{ftlRates.map((r, idx) => (<TableRow key={r.id}><TableCell>{idx+1}</TableCell><TableCell><Input value={r.vehicleType} onChange={(e) => updateFtlRate(r.id, "vehicleType", e.target.value)} className="h-7 w-36" /></TableCell><TableCell><Input type="number" value={r.oneWayTripAmount} onChange={(e) => updateFtlRate(r.id, "oneWayTripAmount", Number(e.target.value))} className="h-7 w-28" /></TableCell><TableCell><Input type="number" value={r.roundTripAmount} onChange={(e) => updateFtlRate(r.id, "roundTripAmount", Number(e.target.value))} className="h-7 w-28" /></TableCell><TableCell><Button variant="ghost" size="sm" onClick={() => removeFtlRate(r.id)}><Trash2 className="h-3.5 w-3.5" /></Button></TableCell></TableRow>))}</TableBody></Table></div>
          <div className="flex justify-between"><Button onClick={addFtlRate} size="sm"><Plus className="h-3.5 w-3.5" /> Add Row</Button><div><Button variant="outline" className="mr-2">Clear</Button><Button className="bg-green-600">Add to Contract</Button></div></div>
        </DialogContent>
      </Dialog>

      {/* PRE CUSTOMER PCS RATES MODAL */}
      <Dialog open={preCustomerModalOpen} onOpenChange={setPreCustomerModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader><DialogTitle>Pre Customer PCS Rates</DialogTitle></DialogHeader>
          <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>S#</TableHead><TableHead>Part</TableHead><TableHead>Gender</TableHead><TableHead>Rate</TableHead><TableHead>Minimum Amount</TableHead><TableHead>Action</TableHead></TableRow></TableHeader><TableBody>{preCustomerPcsRates.map((r, idx) => (<TableRow key={r.id}><TableCell>{idx+1}</TableCell><TableCell><Input value={r.part} onChange={(e) => updatePreCustomer(r.id, "part", e.target.value)} className="h-7 w-32" /></TableCell><TableCell><Input value={r.gender} onChange={(e) => updatePreCustomer(r.id, "gender", e.target.value)} className="h-7 w-24" /></TableCell><TableCell><Input type="number" value={r.rate} onChange={(e) => updatePreCustomer(r.id, "rate", Number(e.target.value))} className="h-7 w-28" /></TableCell><TableCell><Input type="number" value={r.minimumAmount} onChange={(e) => updatePreCustomer(r.id, "minimumAmount", Number(e.target.value))} className="h-7 w-28" /></TableCell><TableCell><Button variant="ghost" size="sm" onClick={() => removePreCustomer(r.id)}><Trash2 /></Button></TableCell></TableRow>))}</TableBody></Table></div>
          <div className="flex justify-between"><Button onClick={addPreCustomerRow} size="sm"><Plus /> Add More</Button><div><Button variant="outline" className="mr-2">Clear</Button><Button className="bg-green-600">Add to Contract</Button></div></div>
        </DialogContent>
      </Dialog>

      {/* FIX AMOUNT RATES MODAL */}
      <Dialog open={fixAmountModalOpen} onOpenChange={setFixAmountModalOpen}>
        <DialogContent><DialogHeader><DialogTitle>Fix Amount Rates</DialogTitle></DialogHeader><div><Label>Fix Amount</Label><Input type="number" value={fixAmountRate.amount} onChange={(e) => setFixAmountRate({ amount: Number(e.target.value) })} className="mt-1" /></div><div className="flex justify-end gap-2 mt-4"><Button variant="outline">Clear</Button><Button className="bg-green-600">Add to Contract</Button></div></DialogContent>
      </Dialog>

      {/* PER PACKAGE RATES MODAL */}
      <Dialog open={perPackageModalOpen} onOpenChange={setPerPackageModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader><DialogTitle>Per Package Rates</DialogTitle></DialogHeader>
          <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>S#</TableHead><TableHead>From Pckgs</TableHead><TableHead>To Pckgs</TableHead><TableHead>Upto Weight</TableHead><TableHead>Rate</TableHead><TableHead>Per Kg Additional Rate</TableHead><TableHead>Minimum Amount</TableHead><TableHead>Action</TableHead></TableRow></TableHeader><TableBody>{perPackageRates.map((r, idx) => (<TableRow key={r.id}><TableCell>{idx+1}</TableCell><TableCell><Input type="number" value={r.fromPckgs} onChange={(e) => updatePerPackage(r.id, "fromPckgs", Number(e.target.value))} className="h-7 w-24" /></TableCell><TableCell><Input type="number" value={r.toPckgs} onChange={(e) => updatePerPackage(r.id, "toPckgs", Number(e.target.value))} className="h-7 w-24" /></TableCell><TableCell><Input type="number" value={r.uptoWeight} onChange={(e) => updatePerPackage(r.id, "uptoWeight", Number(e.target.value))} className="h-7 w-24" /></TableCell><TableCell><Input type="number" value={r.rate} onChange={(e) => updatePerPackage(r.id, "rate", Number(e.target.value))} className="h-7 w-24" /></TableCell><TableCell><Input type="number" value={r.perKgAdditionalRate} onChange={(e) => updatePerPackage(r.id, "perKgAdditionalRate", Number(e.target.value))} className="h-7 w-24" /></TableCell><TableCell><Input type="number" value={r.minimumAmount} onChange={(e) => updatePerPackage(r.id, "minimumAmount", Number(e.target.value))} className="h-7 w-24" /></TableCell><TableCell><Button variant="ghost" size="sm" onClick={() => removePerPackage(r.id)}><Trash2 /></Button></TableCell></TableRow>))}</TableBody></Table></div>
          <div className="flex justify-between"><Button onClick={addPerPackageRow} size="sm"><Plus /> Add More</Button><div><Button variant="outline">Clear</Button><Button className="bg-green-600">Add to Contract</Button></div></div>
        </DialogContent>
      </Dialog>

      {/* WEIGHT SLAB RATES MODAL */}
      <Dialog open={weightSlabModalOpen} onOpenChange={setWeightSlabModalOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader><DialogTitle>Weight Slab Rates</DialogTitle></DialogHeader>
          <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>S#</TableHead><TableHead>From Weight</TableHead><TableHead>To Weight</TableHead><TableHead>Min Weight</TableHead><TableHead>Max Weight</TableHead><TableHead>Rate</TableHead><TableHead>Min Amount</TableHead><TableHead>Flat Amount</TableHead><TableHead>Additional Per Kg Rate</TableHead><TableHead>Calc On Pckgs</TableHead><TableHead>Per Pckgs Wt</TableHead><TableHead>Additional Per Pckgs Wt</TableHead><TableHead>Action</TableHead></TableRow></TableHeader><TableBody>{weightSlabRates.map((r, idx) => (<TableRow key={r.id}><TableCell>{idx+1}</TableCell><TableCell><Input type="number" value={r.fromWeight} onChange={(e) => updateWeightSlab(r.id, "fromWeight", Number(e.target.value))} className="h-7 w-20" /></TableCell><TableCell><Input type="number" value={r.toWeight} onChange={(e) => updateWeightSlab(r.id, "toWeight", Number(e.target.value))} className="h-7 w-20" /></TableCell><TableCell><Input type="number" value={r.minWeight} onChange={(e) => updateWeightSlab(r.id, "minWeight", Number(e.target.value))} className="h-7 w-20" /></TableCell><TableCell><Input type="number" value={r.maxWeight} onChange={(e) => updateWeightSlab(r.id, "maxWeight", Number(e.target.value))} className="h-7 w-20" /></TableCell><TableCell><Input type="number" value={r.rate} onChange={(e) => updateWeightSlab(r.id, "rate", Number(e.target.value))} className="h-7 w-20" /></TableCell><TableCell><Input type="number" value={r.minAmount} onChange={(e) => updateWeightSlab(r.id, "minAmount", Number(e.target.value))} className="h-7 w-20" /></TableCell><TableCell><Input type="number" value={r.flatAmount} onChange={(e) => updateWeightSlab(r.id, "flatAmount", Number(e.target.value))} className="h-7 w-20" /></TableCell><TableCell><Input type="number" value={r.additionalPerKgRate} onChange={(e) => updateWeightSlab(r.id, "additionalPerKgRate", Number(e.target.value))} className="h-7 w-20" /></TableCell><TableCell><Checkbox checked={r.calculationOnPckgs} onCheckedChange={(c) => updateWeightSlab(r.id, "calculationOnPckgs", !!c)} /></TableCell><TableCell><Input type="number" value={r.perPckgsWt} onChange={(e) => updateWeightSlab(r.id, "perPckgsWt", Number(e.target.value))} className="h-7 w-20" /></TableCell><TableCell><Input type="number" value={r.additionalPerPckgsWt} onChange={(e) => updateWeightSlab(r.id, "additionalPerPckgsWt", Number(e.target.value))} className="h-7 w-20" /></TableCell><TableCell><Button variant="ghost" onClick={() => removeWeightSlab(r.id)}><Trash2 /></Button></TableCell></TableRow>))}</TableBody></Table></div>
          <div className="flex justify-between"><Button onClick={addWeightSlabRow} size="sm"><Plus /> Add More</Button><div><Button variant="outline">Clear</Button><Button className="bg-green-600">Add to Contract</Button></div></div>
        </DialogContent>
      </Dialog>

      {/* BULKY RATES MODAL */}
      <Dialog open={bulkyModalOpen} onOpenChange={setBulkyModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader><DialogTitle>Bulky Rates</DialogTitle></DialogHeader>
          <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>S#</TableHead><TableHead>From Weight</TableHead><TableHead>To Weight</TableHead><TableHead>Min Weight</TableHead><TableHead>Rate</TableHead><TableHead>Min Amount</TableHead><TableHead>Flat Amount</TableHead><TableHead>Additional Per Kg Rate</TableHead><TableHead>Bulky</TableHead><TableHead>Action</TableHead></TableRow></TableHeader><TableBody>{bulkyRates.map((r, idx) => (<TableRow key={r.id}><TableCell>{idx+1}</TableCell><TableCell><Input type="number" value={r.fromWeight} onChange={(e) => updateBulky(r.id, "fromWeight", Number(e.target.value))} className="h-7 w-20" /></TableCell><TableCell><Input type="number" value={r.toWeight} onChange={(e) => updateBulky(r.id, "toWeight", Number(e.target.value))} className="h-7 w-20" /></TableCell><TableCell><Input type="number" value={r.minWeight} onChange={(e) => updateBulky(r.id, "minWeight", Number(e.target.value))} className="h-7 w-20" /></TableCell><TableCell><Input type="number" value={r.rate} onChange={(e) => updateBulky(r.id, "rate", Number(e.target.value))} className="h-7 w-20" /></TableCell><TableCell><Input type="number" value={r.minAmount} onChange={(e) => updateBulky(r.id, "minAmount", Number(e.target.value))} className="h-7 w-20" /></TableCell><TableCell><Input type="number" value={r.flatAmount} onChange={(e) => updateBulky(r.id, "flatAmount", Number(e.target.value))} className="h-7 w-20" /></TableCell><TableCell><Input type="number" value={r.additionalPerKgRate} onChange={(e) => updateBulky(r.id, "additionalPerKgRate", Number(e.target.value))} className="h-7 w-20" /></TableCell><TableCell><Select value={r.bulky} onValueChange={(v) => updateBulky(r.id, "bulky", v)}><SelectTrigger className="h-7 w-20"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Y">Y</SelectItem><SelectItem value="N">N</SelectItem></SelectContent></Select></TableCell><TableCell><Button variant="ghost" onClick={() => removeBulky(r.id)}><Trash2 /></Button></TableCell></TableRow>))}</TableBody></Table></div>
          <div className="flex justify-between"><Button onClick={addBulkyRow} size="sm"><Plus /> Add More</Button><div><Button variant="outline">Clear</Button><Button className="bg-green-600">Add to Contract</Button></div></div>
        </DialogContent>
      </Dialog>

      {/* HEIGHT SLAB RATES MODAL */}
      <Dialog open={heightSlabModalOpen} onOpenChange={setHeightSlabModalOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader><DialogTitle>Height Slab Rates</DialogTitle></DialogHeader>
          <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>S#</TableHead><TableHead>From Height</TableHead><TableHead>To Height</TableHead><TableHead>Min Height</TableHead><TableHead>Max Height</TableHead><TableHead>Rate</TableHead><TableHead>Min Amount</TableHead><TableHead>Flat Amount</TableHead><TableHead>Additional Per Ft. Rate</TableHead><TableHead>Calc On Pckgs</TableHead><TableHead>Per Pckgs Ft.</TableHead><TableHead>Additional Per Pckgs Ft.</TableHead><TableHead>Action</TableHead></TableRow></TableHeader><TableBody>{heightSlabRates.map((r, idx) => (<TableRow key={r.id}><TableCell>{idx+1}</TableCell><TableCell><Input type="number" value={r.fromHeight} onChange={(e) => updateHeightSlab(r.id, "fromHeight", Number(e.target.value))} className="h-7 w-20" /></TableCell><TableCell><Input type="number" value={r.toHeight} onChange={(e) => updateHeightSlab(r.id, "toHeight", Number(e.target.value))} className="h-7 w-20" /></TableCell><TableCell><Input type="number" value={r.minHeight} onChange={(e) => updateHeightSlab(r.id, "minHeight", Number(e.target.value))} className="h-7 w-20" /></TableCell><TableCell><Input type="number" value={r.maxHeight} onChange={(e) => updateHeightSlab(r.id, "maxHeight", Number(e.target.value))} className="h-7 w-20" /></TableCell><TableCell><Input type="number" value={r.rate} onChange={(e) => updateHeightSlab(r.id, "rate", Number(e.target.value))} className="h-7 w-20" /></TableCell><TableCell><Input type="number" value={r.minAmount} onChange={(e) => updateHeightSlab(r.id, "minAmount", Number(e.target.value))} className="h-7 w-20" /></TableCell><TableCell><Input type="number" value={r.flatAmount} onChange={(e) => updateHeightSlab(r.id, "flatAmount", Number(e.target.value))} className="h-7 w-20" /></TableCell><TableCell><Input type="number" value={r.additionalPerFtRate} onChange={(e) => updateHeightSlab(r.id, "additionalPerFtRate", Number(e.target.value))} className="h-7 w-20" /></TableCell><TableCell><Checkbox checked={r.calculationOnPckgs} onCheckedChange={(c) => updateHeightSlab(r.id, "calculationOnPckgs", !!c)} /></TableCell><TableCell><Input type="number" value={r.perPckgsFt} onChange={(e) => updateHeightSlab(r.id, "perPckgsFt", Number(e.target.value))} className="h-7 w-20" /></TableCell><TableCell><Input type="number" value={r.additionalPerPckgsFt} onChange={(e) => updateHeightSlab(r.id, "additionalPerPckgsFt", Number(e.target.value))} className="h-7 w-20" /></TableCell><TableCell><Button variant="ghost" onClick={() => removeHeightSlab(r.id)}><Trash2 /></Button></TableCell></TableRow>))}</TableBody></Table></div>
          <div className="flex justify-between"><Button onClick={addHeightSlabRow} size="sm"><Plus /> Add More</Button><div><Button variant="outline">Clear</Button><Button className="bg-green-600">Add to Contract</Button></div></div>
        </DialogContent>
      </Dialog>

      {/* Vehicle Selection Modal - CORRECTED */}
      <Dialog open={vehicleSelectModalOpen} onOpenChange={setVehicleSelectModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Select Vehicle Type</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Search..."
            value={vehicleSearch}
            onChange={(e) => setVehicleSearch(e.target.value)}
            className="mb-2"
          />
          <div className="border rounded-md h-64 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox />
                  </TableHead>
                  <TableHead>Vehicle Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicleTypes
                  .filter((v) =>
                    v.toLowerCase().includes(vehicleSearch.toLowerCase())
                  )
                  .map((vt) => (
                    <TableRow key={vt}>
                      <TableCell>
                        <Checkbox
                          checked={selectedVehicleTypes.includes(vt)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedVehicleTypes([...selectedVehicleTypes, vt]);
                            } else {
                              setSelectedVehicleTypes(
                                selectedVehicleTypes.filter((s) => s !== vt)
                              );
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>{vt}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button onClick={() => setVehicleSelectModalOpen(false)}>OK</Button>
            <Button variant="outline" onClick={() => setVehicleSelectModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Info note */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
          <div className="text-xs text-blue-700">
            Fields marked * are mandatory. Use the buttons to open rate configuration modals.
          </div>
        </div>
      </div>
    </div>
  );
}