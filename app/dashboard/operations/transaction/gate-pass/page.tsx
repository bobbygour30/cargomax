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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Upload,
  Image,
  Trash2,
  PlusCircle,
  MinusCircle,
  Truck,
  Package,
  MapPin,
  Building,
  Phone,
  Mail,
  CreditCard,
  FileSpreadsheet,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Users,
  Clock,
  AlertCircle,
  History,
  Pencil,
  Plus,
  Edit,
  Grid3x3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ChargeItem {
  id: number;
  charges: string;
  applicableOn: string;
  rate: number;
  applicableValue: number;
  amount: number;
}

interface GatePassRecord {
  id: number;
  branch: string;
  date: Date;
  gatePassNo: string;
  grNo: string;
  refNo: string;
  origin: string;
  destination: string;
  customer: string;
  consignor: string;
  consignorGst: string;
  consignee: string;
  consigneeTelNo: string;
  consigneeEmail: string;
  grPckgs: number;
  chgWeight: number;
  actWeight: number;
  deliveryType: string;
  consigneeType: string;
  deliveredAgainstConsigneeCopy: boolean;
  ccReceived: boolean;
  pvtMarka: string;
  remarks: string;
  deliveredTo: string;
  rebooking: boolean;
  dueGatepass: boolean;
  dueOrderBy: string;
  selectCustomerForBilling: string;
  printAfterSave: boolean;
  item: string;
  packing: string;
  grType: string;
  grDate: Date;
  ddrNo: string;
  arrivalDate: Date;
  receivedPckgs: number;
  balancePckgs: number;
  deliveredPckgs: number;
  deliveredWeight: number;
  godown: string;
  grFreight: number;
  charges: ChargeItem[];
  gstPaidBy: string;
  gstType: string;
  gst: number;
  advance: number;
  balance: number;
  proofOfDelivery: string;
  images: string[];
  status: "active" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const branchOptions = [
  "CORPORATE OFFICE",
  "DELHI",
  "MUMBAI",
  "BANGALORE",
  "CHENNAI",
  "KOLKATA",
  "AHMEDABAD",
  "PUNE",
  "HYDERABAD",
  "LUCKNOW",
];

const deliveryTypeOptions = ["Door Delivery", "Pickup", "Self Collection"];
const consigneeTypeOptions = ["Regular", "Corporate", "Government", "Premium"];
const gstPaidByOptions = ["EXEMPTED", "CONSIGNOR", "CONSIGNEE", "CARRIER"];
const gstTypeOptions = ["CGST+SGST", "IGST", "UTGST"];
const grTypeOptions = ["FTL", "LTL", "Container", "Express"];
const godownOptions = ["Godown A", "Godown B", "Godown C", "Warehouse"];
const dueOrderByOptions = ["Self", "Broker", "Customer"];
const selectCustomerForBillingOptions = ["Self", "Customer", "Broker"];
const proofOfDeliveryOptions = ["Select", "Proof Received", "Pending", "Not Required"];

const chargesOptions = [
  "DELIVERY CHARGES",
  "LOADING CHARGES",
  "UNLOADING CHARGES",
  "HAMALI CHARGES",
  "STORAGE CHARGES",
  "DEMURRAGE CHARGES",
  "OCTROI CHARGES",
  "ENTRY TAX",
];

const applicableOnOptions = ["Docket", "Weight", "Package", "Freight", "Value"];

const cancelledReasonOptions = [
  "Customer Request", "Wrong Entry", "Duplicate Entry", "Payment Issue", "Other"
];

export default function GatePassEntry() {
  // Main Tab state
  const [mainTab, setMainTab] = useState<"active" | "cancelled">("active");
  
  // Modal state
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<number | null>(null);
  const [activeEntryTab, setActiveEntryTab] = useState<"entry" | "image">("entry");
  const [loading, setLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "report">("report");

  // Cancelled Dialog state
  const [isCancelledDialogOpen, setIsCancelledDialogOpen] = useState(false);
  const [cancellingGatePass, setCancellingGatePass] = useState<GatePassRecord | null>(null);
  const [cancelledReason, setCancelledReason] = useState<string>("");

  // Form state - All fields as requested
  const [branch, setBranch] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [gatePassNo, setGatePassNo] = useState<string>("");
  const [auto, setAuto] = useState<boolean>(true);
  const [grNo, setGrNo] = useState<string>("");
  const [refNo, setRefNo] = useState<string>("");
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [customer, setCustomer] = useState<string>("");
  const [consignor, setConsignor] = useState<string>("");
  const [consignorGst, setConsignorGst] = useState<string>("");
  const [consignee, setConsignee] = useState<string>("");
  const [consigneeTelNo, setConsigneeTelNo] = useState<string>("");
  const [consigneeEmail, setConsigneeEmail] = useState<string>("");
  const [grPckgs, setGrPckgs] = useState<number>(0);
  const [chgWeight, setChgWeight] = useState<number>(0);
  const [actWeight, setActWeight] = useState<number>(0);
  const [deliveryType, setDeliveryType] = useState<string>("");
  const [consigneeType, setConsigneeType] = useState<string>("");
  const [deliveredAgainstConsigneeCopy, setDeliveredAgainstConsigneeCopy] = useState<boolean>(false);
  const [ccReceived, setCcReceived] = useState<boolean>(false);
  const [pvtMarka, setPvtMarka] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  const [deliveredTo, setDeliveredTo] = useState<string>("");
  const [rebooking, setRebooking] = useState<boolean>(false);
  const [dueGatepass, setDueGatepass] = useState<boolean>(false);
  const [dueOrderBy, setDueOrderBy] = useState<string>("");
  const [selectCustomerForBilling, setSelectCustomerForBilling] = useState<string>("");
  const [printAfterSave, setPrintAfterSave] = useState<boolean>(false);
  const [item, setItem] = useState<string>("");
  const [packing, setPacking] = useState<string>("");
  const [grType, setGrType] = useState<string>("");
  const [grDate, setGrDate] = useState<Date>(new Date());
  const [ddrNo, setDdrNo] = useState<string>("");
  const [arrivalDate, setArrivalDate] = useState<Date>(new Date());
  const [receivedPckgs, setReceivedPckgs] = useState<number>(0);
  const [balancePckgs, setBalancePckgs] = useState<number>(0);
  const [deliveredPckgs, setDeliveredPckgs] = useState<number>(0);
  const [deliveredWeight, setDeliveredWeight] = useState<number>(0);
  const [godown, setGodown] = useState<string>("");
  const [grFreight, setGrFreight] = useState<number>(0);
  const [charges, setCharges] = useState<ChargeItem[]>([
    { id: 1, charges: "DELIVERY CHARGES", applicableOn: "Docket", rate: 0, applicableValue: 0, amount: 0 },
  ]);
  const [gstPaidBy, setGstPaidBy] = useState<string>("EXEMPTED");
  const [gstType, setGstType] = useState<string>("CGST+SGST");
  const [gst, setGst] = useState<number>(0);
  const [advance, setAdvance] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [proofOfDelivery, setProofOfDelivery] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);

  // Search state
  const [searchBranch, setSearchBranch] = useState<string>("");
  const [searchFromDate, setSearchFromDate] = useState<Date>(new Date());
  const [searchToDate, setSearchToDate] = useState<Date>(new Date());
  const [searchDrNo, setSearchDrNo] = useState<string>("");
  const [searchResults, setSearchResults] = useState<GatePassRecord[]>([]);
  const [cancelledSearchResults, setCancelledSearchResults] = useState<GatePassRecord[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [cancelledCurrentPage, setCancelledCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Sample data
  const [savedRecords, setSavedRecords] = useState<GatePassRecord[]>([]);

  useEffect(() => {
    filterActiveRecords();
    filterCancelledRecords();
  }, []);

  const filterActiveRecords = () => {
    const activeRecords = savedRecords.filter(r => r.status === "active");
    setSearchResults(activeRecords);
  };

  const filterCancelledRecords = () => {
    const cancelledRecords = savedRecords.filter(r => r.status === "cancelled");
    setCancelledSearchResults(cancelledRecords);
  };

  const generateGatePassNo = (): string => {
    const count = savedRecords.filter(r => r.status === "active").length + 1;
    return `GP${String(count).padStart(6, "0")}`;
  };

  const handleAutoChange = () => {
    setAuto(!auto);
    if (!auto) {
      setGatePassNo(generateGatePassNo());
    } else {
      setGatePassNo("");
    }
  };

  const addChargeRow = () => {
    const newCharge: ChargeItem = {
      id: Date.now(),
      charges: "",
      applicableOn: "",
      rate: 0,
      applicableValue: 0,
      amount: 0,
    };
    setCharges([...charges, newCharge]);
  };

  const updateCharge = (id: number, field: keyof ChargeItem, value: any) => {
    setCharges(charges.map(charge => {
      if (charge.id === id) {
        const updated = { ...charge, [field]: value };
        if (field === "rate" || field === "applicableValue") {
          updated.amount = (updated.rate * updated.applicableValue);
        }
        return updated;
      }
      return charge;
    }));
  };

  const removeCharge = (id: number) => {
    if (charges.length > 1) {
      setCharges(charges.filter(charge => charge.id !== id));
    }
  };

  const calculateTotal = () => {
    const subtotal = charges.reduce((sum, charge) => sum + charge.amount, 0);
    const gstAmount = subtotal * 0.18;
    const total = subtotal + gstAmount;
    const balanceAmount = total - advance;
    setGst(gstAmount);
    setBalance(balanceAmount);
    return total;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file.type.includes("image/jpeg") || file.type.includes("image/jpg")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImages([...images, event.target.result as string]);
          }
        };
        reader.readAsDataURL(file);
      } else {
        alert("You can only upload JPG/JPEG files.");
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setBranch("");
    setDate(new Date());
    setGatePassNo(generateGatePassNo());
    setAuto(true);
    setGrNo("");
    setRefNo("");
    setOrigin("");
    setDestination("");
    setCustomer("");
    setConsignor("");
    setConsignorGst("");
    setConsignee("");
    setConsigneeTelNo("");
    setConsigneeEmail("");
    setGrPckgs(0);
    setChgWeight(0);
    setActWeight(0);
    setDeliveryType("");
    setConsigneeType("");
    setDeliveredAgainstConsigneeCopy(false);
    setCcReceived(false);
    setPvtMarka("");
    setRemarks("");
    setDeliveredTo("");
    setRebooking(false);
    setDueGatepass(false);
    setDueOrderBy("");
    setSelectCustomerForBilling("");
    setPrintAfterSave(false);
    setItem("");
    setPacking("");
    setGrType("");
    setGrDate(new Date());
    setDdrNo("");
    setArrivalDate(new Date());
    setReceivedPckgs(0);
    setBalancePckgs(0);
    setDeliveredPckgs(0);
    setDeliveredWeight(0);
    setGodown("");
    setGrFreight(0);
    setCharges([{ id: 1, charges: "DELIVERY CHARGES", applicableOn: "Docket", rate: 0, applicableValue: 0, amount: 0 }]);
    setGstPaidBy("EXEMPTED");
    setGstType("CGST+SGST");
    setGst(0);
    setAdvance(0);
    setBalance(0);
    setProofOfDelivery("");
    setImages([]);
    setEditMode(false);
    setCurrentEditId(null);
    setActiveEntryTab("entry");
  };

  const handleSave = () => {
    if (!branch) { alert("Please select Branch"); return; }
    if (!grNo) { alert("Please enter GR #"); return; }
    if (!consignee) { alert("Please enter Consignee"); return; }
    if (!deliveredTo) { alert("Please enter Delivered To"); return; }

    setLoading(true);
    setTimeout(() => {
      const total = calculateTotal();
      const newRecord: GatePassRecord = {
        id: currentEditId || Date.now(),
        branch, date, gatePassNo, grNo, refNo, origin, destination, customer,
        consignor, consignorGst, consignee, consigneeTelNo, consigneeEmail,
        grPckgs, chgWeight, actWeight, deliveryType, consigneeType,
        deliveredAgainstConsigneeCopy, ccReceived, pvtMarka, remarks, deliveredTo,
        rebooking, dueGatepass, dueOrderBy, selectCustomerForBilling, printAfterSave,
        item, packing, grType, grDate, ddrNo, arrivalDate, receivedPckgs,
        balancePckgs, deliveredPckgs, deliveredWeight, godown, grFreight, charges,
        gstPaidBy, gstType, gst, advance, balance: total - advance,
        proofOfDelivery, images, status: "active",
        createdAt: editMode && currentEditId ? 
          savedRecords.find(r => r.id === currentEditId)?.createdAt || new Date() : 
          new Date(),
        updatedAt: new Date(),
      };

      let updatedRecords;
      if (editMode && currentEditId) {
        updatedRecords = savedRecords.map(record => record.id === currentEditId ? newRecord : record);
      } else {
        updatedRecords = [...savedRecords, newRecord];
      }
      setSavedRecords(updatedRecords);
      filterActiveRecords();
      filterCancelledRecords();
      alert(editMode ? "Record updated successfully!" : "Record saved successfully!");
      resetForm();
      setIsEntryModalOpen(false);
      setLoading(false);
    }, 500);
  };

  const handleCancelGatePass = () => {
    if (!cancelledReason) { alert("Please select cancellation reason"); return; }
    if (cancellingGatePass) {
      const updatedRecords = savedRecords.map(record => 
        record.id === cancellingGatePass.id 
          ? { ...record, status: "cancelled" as const, updatedAt: new Date() }
          : record
      );
      setSavedRecords(updatedRecords);
      filterActiveRecords();
      filterCancelledRecords();
      alert(`Gate Pass ${cancellingGatePass.gatePassNo} cancelled!`);
      setIsCancelledDialogOpen(false);
      setCancellingGatePass(null);
      setCancelledReason("");
    }
  };

  const handleRestoreGatePass = (record: GatePassRecord) => {
    if (confirm(`Restore Gate Pass ${record.gatePassNo}?`)) {
      const updatedRecords = savedRecords.map(r => 
        r.id === record.id ? { ...r, status: "active" as const, updatedAt: new Date() } : r
      );
      setSavedRecords(updatedRecords);
      filterActiveRecords();
      filterCancelledRecords();
      alert(`Gate Pass ${record.gatePassNo} restored!`);
    }
  };

  const handleSearch = () => {
    let results = savedRecords.filter(record => record.status === "active");
    if (searchBranch && searchBranch !== "all") results = results.filter(r => r.branch === searchBranch);
    if (searchDrNo) results = results.filter(r => r.gatePassNo.toLowerCase().includes(searchDrNo.toLowerCase()));
    if (searchFromDate) results = results.filter(r => r.date >= searchFromDate);
    if (searchToDate) results = results.filter(r => r.date <= searchToDate);
    setSearchResults(results);
    setCurrentPage(1);
  };

  const handleCancelledSearch = () => {
    let results = savedRecords.filter(record => record.status === "cancelled");
    if (searchBranch && searchBranch !== "all") results = results.filter(r => r.branch === searchBranch);
    if (searchDrNo) results = results.filter(r => r.gatePassNo.toLowerCase().includes(searchDrNo.toLowerCase()));
    if (searchFromDate) results = results.filter(r => r.date >= searchFromDate);
    if (searchToDate) results = results.filter(r => r.date <= searchToDate);
    setCancelledSearchResults(results);
    setCancelledCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchBranch("");
    setSearchFromDate(new Date());
    setSearchToDate(new Date());
    setSearchDrNo("");
    filterActiveRecords();
    filterCancelledRecords();
  };

  const handleEdit = (record: GatePassRecord) => {
    setEditMode(true);
    setCurrentEditId(record.id);
    setBranch(record.branch);
    setDate(record.date);
    setGatePassNo(record.gatePassNo);
    setGrNo(record.grNo);
    setRefNo(record.refNo);
    setOrigin(record.origin);
    setDestination(record.destination);
    setCustomer(record.customer);
    setConsignor(record.consignor);
    setConsignorGst(record.consignorGst);
    setConsignee(record.consignee);
    setConsigneeTelNo(record.consigneeTelNo);
    setConsigneeEmail(record.consigneeEmail);
    setGrPckgs(record.grPckgs);
    setChgWeight(record.chgWeight);
    setActWeight(record.actWeight);
    setDeliveryType(record.deliveryType);
    setConsigneeType(record.consigneeType);
    setDeliveredAgainstConsigneeCopy(record.deliveredAgainstConsigneeCopy);
    setCcReceived(record.ccReceived);
    setPvtMarka(record.pvtMarka);
    setRemarks(record.remarks);
    setDeliveredTo(record.deliveredTo);
    setRebooking(record.rebooking);
    setDueGatepass(record.dueGatepass);
    setDueOrderBy(record.dueOrderBy);
    setSelectCustomerForBilling(record.selectCustomerForBilling);
    setPrintAfterSave(record.printAfterSave);
    setItem(record.item);
    setPacking(record.packing);
    setGrType(record.grType);
    setGrDate(record.grDate);
    setDdrNo(record.ddrNo);
    setArrivalDate(record.arrivalDate);
    setReceivedPckgs(record.receivedPckgs);
    setBalancePckgs(record.balancePckgs);
    setDeliveredPckgs(record.deliveredPckgs);
    setDeliveredWeight(record.deliveredWeight);
    setGodown(record.godown);
    setGrFreight(record.grFreight);
    setCharges(record.charges);
    setGstPaidBy(record.gstPaidBy);
    setGstType(record.gstType);
    setGst(record.gst);
    setAdvance(record.advance);
    setBalance(record.balance);
    setProofOfDelivery(record.proofOfDelivery);
    setImages(record.images);
    setIsEntryModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Permanently delete?")) {
      setSavedRecords(savedRecords.filter(r => r.id !== id));
      filterActiveRecords();
      filterCancelledRecords();
    }
  };

  const openAddModal = () => {
    resetForm();
    setEditMode(false);
    setCurrentEditId(null);
    setGatePassNo(generateGatePassNo());
    setIsEntryModalOpen(true);
  };

  const openCancelDialog = (record: GatePassRecord) => {
    setCancellingGatePass(record);
    setCancelledReason("");
    setIsCancelledDialogOpen(true);
  };

  const activeStats = {
    total: searchResults.length,
    totalAmount: searchResults.reduce((sum, r) => sum + r.charges.reduce((s, c) => s + c.amount, 0), 0),
  };

  const cancelledStats = { total: cancelledSearchResults.length };

  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const paginatedResults = searchResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  const cancelledTotalPages = Math.ceil(cancelledSearchResults.length / itemsPerPage);
  const paginatedCancelledResults = cancelledSearchResults.slice((cancelledCurrentPage - 1) * itemsPerPage, cancelledCurrentPage * itemsPerPage);
  const goToCancelledPage = (page: number) => setCancelledCurrentPage(Math.max(1, Math.min(page, cancelledTotalPages)));

  return (
    <div className="space-y-4 p-3 md:p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-wrap justify-between items-start gap-3">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">GATE PASS ENTRY</h1>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
              <span>🏢 Company: GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
              <span>👤 Login: MAYANK.GRLOGISTICS@GMAIL.COM</span>
              <span>📍 Branch: CORPORATE OFFICE</span>
              <span>📅 Financial Year: 2026-2027</span>
            </div>
          </div>
          <Button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700"><Plus className="mr-2 h-4 w-4" />New Gate Pass</Button>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b bg-white rounded-t-lg">
        <button onClick={() => { setMainTab("active"); filterActiveRecords(); }} className={cn("px-6 py-2.5 text-sm font-medium rounded-t-lg", mainTab === "active" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100")}>Active Gate Passes</button>
        <button onClick={() => { setMainTab("cancelled"); filterCancelledRecords(); }} className={cn("px-6 py-2.5 text-sm font-medium rounded-t-lg", mainTab === "cancelled" ? "bg-red-600 text-white" : "text-gray-600 hover:bg-gray-100")}>Cancelled Gate Passes</button>
      </div>

      {/* Active Gate Passes Tab */}
      {mainTab === "active" && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white"><CardContent className="p-4"><div className="flex justify-between"><div><p className="text-sm">Total Active</p><p className="text-2xl font-bold">{activeStats.total}</p></div><FileText className="h-8 w-8 opacity-80" /></div></CardContent></Card>
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white"><CardContent className="p-4"><div className="flex justify-between"><div><p className="text-sm">Total Amount</p><p className="text-2xl font-bold">₹{activeStats.totalAmount.toLocaleString()}</p></div><DollarSign className="h-8 w-8 opacity-80" /></div></CardContent></Card>
          </div>

          <Card><CardHeader><CardTitle className="text-xs"><Search className="h-3 w-3 inline mr-1" />Search Gate Passes</CardTitle></CardHeader><CardContent><div className="grid grid-cols-2 md:grid-cols-5 gap-2"><div><Label className="text-[10px]">Branch</Label><Select value={searchBranch} onValueChange={setSearchBranch}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="All" /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem>{branchOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></div><div><Label className="text-[10px]">From Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(searchFromDate, "dd-MM-yy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={searchFromDate} onSelect={(d) => d && setSearchFromDate(d)} /></PopoverContent></Popover></div><div><Label className="text-[10px]">To Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(searchToDate, "dd-MM-yy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={searchToDate} onSelect={(d) => d && setSearchToDate(d)} /></PopoverContent></Popover></div><div><Label className="text-[10px]">GP No.</Label><Input value={searchDrNo} onChange={(e) => setSearchDrNo(e.target.value)} className="h-8 text-xs" /></div><div className="flex gap-1 items-end"><Button onClick={handleSearch} size="sm" className="h-8 text-xs bg-blue-600"><Search className="h-3 w-3 mr-1" />Search</Button><Button onClick={handleClearSearch} variant="outline" size="sm" className="h-8 text-xs"><RefreshCw className="h-3 w-3" /></Button></div></div></CardContent></Card>

          <div className="flex justify-end gap-2"><Button onClick={() => setViewMode("report")} variant={viewMode === "report" ? "default" : "outline"} size="sm" className="h-7 text-xs"><Table className="h-3 w-3 mr-1" />Report</Button><Button onClick={() => setViewMode("grid")} variant={viewMode === "grid" ? "default" : "outline"} size="sm" className="h-7 text-xs"><Grid3x3 className="h-3 w-3 mr-1" />Grid</Button></div>

          {viewMode === "report" && searchResults.length > 0 && (
            <Card><CardContent className="p-0"><div className="overflow-x-auto"><Table><TableHeader><TableRow className="bg-gray-50"><TableHead className="text-[10px] p-2">#</TableHead><TableHead className="text-[10px] p-2">GP No.</TableHead><TableHead className="text-[10px] p-2">Date</TableHead><TableHead className="text-[10px] p-2">GR #</TableHead><TableHead className="text-[10px] p-2">Branch</TableHead><TableHead className="text-[10px] p-2">Consignee</TableHead><TableHead className="text-[10px] p-2 text-center">Pckgs</TableHead><TableHead className="text-[10px] p-2 text-right">Amount</TableHead><TableHead className="text-[10px] p-2 text-center">Actions</TableHead></TableRow></TableHeader><TableBody>{paginatedResults.map((r, idx) => (<TableRow key={r.id}><TableCell className="text-xs p-2">{(currentPage-1)*itemsPerPage+idx+1}</TableCell><TableCell className="text-xs p-2"><Badge className="bg-blue-50">{r.gatePassNo}</Badge></TableCell><TableCell className="text-xs p-2">{format(r.date, "dd-MM-yy")}</TableCell><TableCell className="text-xs p-2">{r.grNo}</TableCell><TableCell className="text-xs p-2">{r.branch}</TableCell><TableCell className="text-xs p-2 truncate max-w-[120px]">{r.consignee}</TableCell><TableCell className="text-xs p-2 text-center">{r.grPckgs}</TableCell><TableCell className="text-xs p-2 text-right">₹{r.charges.reduce((s, c) => s + c.amount, 0).toLocaleString()}</TableCell><TableCell className="text-xs p-2 text-center"><div className="flex gap-1"><Button variant="ghost" size="sm" onClick={() => handleEdit(r)} className="h-6 w-6 p-0 text-blue-500"><Pencil className="h-3 w-3" /></Button><Button variant="ghost" size="sm" onClick={() => openCancelDialog(r)} className="h-6 w-6 p-0 text-orange-500"><X className="h-3 w-3" /></Button><Button variant="ghost" size="sm" onClick={() => handleDelete(r.id)} className="h-6 w-6 p-0 text-red-500"><Trash2 className="h-3 w-3" /></Button></div></TableCell></TableRow>))}</TableBody></Table></div></CardContent></Card>
          )}

          {searchResults.length === 0 && (<Card><CardContent className="py-12 text-center"><FileText className="h-12 w-12 mx-auto text-gray-400" /><p className="text-gray-500">No active gate passes</p></CardContent></Card>)}
        </>
      )}

      {/* Cancelled Gate Passes Tab */}
      {mainTab === "cancelled" && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white"><CardContent className="p-4"><div className="flex justify-between"><div><p className="text-sm">Total Cancelled</p><p className="text-2xl font-bold">{cancelledStats.total}</p></div><X className="h-8 w-8 opacity-80" /></div></CardContent></Card>
          </div>

          <Card><CardHeader><CardTitle className="text-xs"><Search className="h-3 w-3 inline mr-1" />Search Cancelled</CardTitle></CardHeader><CardContent><div className="grid grid-cols-2 md:grid-cols-5 gap-2"><div><Label className="text-[10px]">Branch</Label><Select value={searchBranch} onValueChange={setSearchBranch}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="All" /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem>{branchOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></div><div><Label className="text-[10px]">From Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(searchFromDate, "dd-MM-yy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={searchFromDate} onSelect={(d) => d && setSearchFromDate(d)} /></PopoverContent></Popover></div><div><Label className="text-[10px]">To Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(searchToDate, "dd-MM-yy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={searchToDate} onSelect={(d) => d && setSearchToDate(d)} /></PopoverContent></Popover></div><div><Label className="text-[10px]">GP No.</Label><Input value={searchDrNo} onChange={(e) => setSearchDrNo(e.target.value)} className="h-8 text-xs" /></div><div className="flex gap-1 items-end"><Button onClick={handleCancelledSearch} size="sm" className="h-8 text-xs bg-red-600"><Search className="h-3 w-3 mr-1" />Search</Button><Button onClick={handleClearSearch} variant="outline" size="sm" className="h-8 text-xs"><RefreshCw className="h-3 w-3" /></Button></div></div></CardContent></Card>

          {paginatedCancelledResults.length > 0 && (
            <Card><CardContent className="p-0"><div className="overflow-x-auto"><Table><TableHeader><TableRow className="bg-gray-50"><TableHead className="text-[10px] p-2">#</TableHead><TableHead className="text-[10px] p-2">GP No.</TableHead><TableHead className="text-[10px] p-2">Date</TableHead><TableHead className="text-[10px] p-2">GR #</TableHead><TableHead className="text-[10px] p-2">Branch</TableHead><TableHead className="text-[10px] p-2">Consignee</TableHead><TableHead className="text-[10px] p-2 text-center">Actions</TableHead></TableRow></TableHeader><TableBody>{paginatedCancelledResults.map((r, idx) => (<TableRow key={r.id} className="bg-red-50/30"><TableCell className="text-xs p-2">{(cancelledCurrentPage-1)*itemsPerPage+idx+1}</TableCell><TableCell className="text-xs p-2"><Badge className="bg-red-50 text-red-700">{r.gatePassNo}</Badge></TableCell><TableCell className="text-xs p-2">{format(r.date, "dd-MM-yy")}</TableCell><TableCell className="text-xs p-2">{r.grNo}</TableCell><TableCell className="text-xs p-2">{r.branch}</TableCell><TableCell className="text-xs p-2 truncate">{r.consignee}</TableCell><TableCell className="text-xs p-2"><div className="flex gap-1"><Button variant="ghost" size="sm" onClick={() => handleRestoreGatePass(r)} className="h-6 w-6 p-0 text-green-500"><RefreshCw className="h-3 w-3" /></Button><Button variant="ghost" size="sm" onClick={() => handleDelete(r.id)} className="h-6 w-6 p-0 text-red-500"><Trash2 className="h-3 w-3" /></Button></div></TableCell></TableRow>))}</TableBody></Table></div></CardContent></Card>
          )}

          {cancelledSearchResults.length === 0 && (<Card><CardContent className="py-12 text-center"><X className="h-12 w-12 mx-auto text-gray-400" /><p className="text-gray-500">No cancelled gate passes</p></CardContent></Card>)}
        </>
      )}

      {/* Cancel Dialog */}
      <Dialog open={isCancelledDialogOpen} onOpenChange={setIsCancelledDialogOpen}>
        <DialogContent><DialogHeader><DialogTitle className="text-red-600 flex items-center gap-2"><X className="h-5 w-5" />Cancel Gate Pass</DialogTitle><DialogDescription>Cancel {cancellingGatePass?.gatePassNo}?</DialogDescription></DialogHeader><div><Label>Cancellation Reason *</Label><Select value={cancelledReason} onValueChange={setCancelledReason}><SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger><SelectContent>{cancelledReasonOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></div><DialogFooter><Button variant="outline" onClick={() => setIsCancelledDialogOpen(false)}>No, Keep</Button><Button variant="destructive" onClick={handleCancelGatePass}>Yes, Cancel</Button></DialogFooter></DialogContent>
      </Dialog>

      {/* Main Entry Modal */}
      <Dialog open={isEntryModalOpen} onOpenChange={setIsEntryModalOpen}>
        <DialogContent className="max-w-[95vw] w-full max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="sticky top-0 bg-white z-10 px-6 pt-6 pb-3 border-b">
            <DialogTitle className="text-xl">{editMode ? "Edit Gate Pass" : "Create New Gate Pass"}</DialogTitle>
            <DialogDescription>Fill in all gate pass details below.</DialogDescription>
          </DialogHeader>

          <div className="px-6 py-4 space-y-4">
            <Tabs value={activeEntryTab} onValueChange={(v) => setActiveEntryTab(v as "entry" | "image")} className="w-full">
              <TabsList className="grid w-full max-w-[200px] grid-cols-2">
                <TabsTrigger value="entry" className="text-xs">Entry</TabsTrigger>
                <TabsTrigger value="image" className="text-xs">Image</TabsTrigger>
              </TabsList>

              {/* Entry Form Tab - All Fields as Requested */}
              <TabsContent value="entry" className="space-y-4 mt-4">
                {/* Row 1: Branch, Date, Gate Pass#, Auto, GR # */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  <div><Label className="text-xs">Branch <span className="text-red-500">*</span></Label><Select value={branch} onValueChange={setBranch}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{branchOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
                  <div><Label className="text-xs">Date <span className="text-red-500">*</span></Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(date, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} /></PopoverContent></Popover></div>
                  <div><Label className="text-xs">Gate Pass# <span className="text-red-500">*</span></Label><div className="flex gap-2"><Input value={gatePassNo} onChange={(e) => setGatePassNo(e.target.value)} readOnly={auto} className={cn("h-8 text-xs flex-1", auto && "bg-gray-50")} /><div className="flex items-center gap-1"><input type="checkbox" checked={auto} onChange={handleAutoChange} className="h-3.5 w-3.5" id="auto" /><Label htmlFor="auto" className="text-xs cursor-pointer">Auto</Label></div></div></div>
                  <div><Label className="text-xs">GR # <span className="text-red-500">*</span></Label><Input value={grNo} onChange={(e) => setGrNo(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Ref.#</Label><Input value={refNo} onChange={(e) => setRefNo(e.target.value)} className="h-8 text-xs" /></div>
                </div>

                {/* Row 2: Origin, Destination, Customer, Consignor, CNGE GST# */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  <div><Label className="text-xs">Origin</Label><Input value={origin} onChange={(e) => setOrigin(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Destination</Label><Input value={destination} onChange={(e) => setDestination(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Customer</Label><Input value={customer} onChange={(e) => setCustomer(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Consignor</Label><Input value={consignor} onChange={(e) => setConsignor(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">CNGE GST#</Label><Input value={consignorGst} onChange={(e) => setConsignorGst(e.target.value)} className="h-8 text-xs uppercase" /></div>
                </div>

                {/* Row 3: Consignee*, Consignee Tel.#*, Consignee Email, GR Pckgs, Chg. Weight */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  <div><Label className="text-xs">Consignee <span className="text-red-500">*</span></Label><Input value={consignee} onChange={(e) => setConsignee(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Consignee Tel. #</Label><Input value={consigneeTelNo} onChange={(e) => setConsigneeTelNo(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Consignee Email</Label><Input type="email" value={consigneeEmail} onChange={(e) => setConsigneeEmail(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">GR Pckgs</Label><Input type="number" value={grPckgs} onChange={(e) => setGrPckgs(Number(e.target.value))} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Chg. Weight</Label><Input type="number" value={chgWeight} onChange={(e) => setChgWeight(Number(e.target.value))} className="h-8 text-xs" /></div>
                </div>

                {/* Row 4: Act. Weight, Delivery Type, Consignee Type, PVT Marka, Remarks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  <div><Label className="text-xs">Act. Weight</Label><Input type="number" value={actWeight} onChange={(e) => setActWeight(Number(e.target.value))} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Delivery Type</Label><Select value={deliveryType} onValueChange={setDeliveryType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{deliveryTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
                  <div><Label className="text-xs">Consignee Type</Label><Select value={consigneeType} onValueChange={setConsigneeType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{consigneeTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
                  <div><Label className="text-xs">PVT Marka</Label><Input value={pvtMarka} onChange={(e) => setPvtMarka(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Remarks</Label><Input value={remarks} onChange={(e) => setRemarks(e.target.value)} className="h-8 text-xs" /></div>
                </div>

                {/* Row 5: Checkboxes - Delivered Against Consignee Copy, CC Received, Rebooking, Due Gatepass */}
                <div className="flex flex-wrap gap-6 items-center">
                  <label className="flex items-center gap-2"><input type="checkbox" checked={deliveredAgainstConsigneeCopy} onChange={(e) => setDeliveredAgainstConsigneeCopy(e.target.checked)} className="rounded" /><span className="text-xs">Delivered Against Consignee Copy</span></label>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={ccReceived} onChange={(e) => setCcReceived(e.target.checked)} className="rounded" /><span className="text-xs">CC Received</span></label>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={rebooking} onChange={(e) => setRebooking(e.target.checked)} className="rounded" /><span className="text-xs">Rebooking</span></label>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={dueGatepass} onChange={(e) => setDueGatepass(e.target.checked)} className="rounded" /><span className="text-xs">Due Gatepass</span></label>
                </div>

                {/* Row 6: Delivered To*, Due Order By, Select Customer For Billing, Print After Save */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div><Label className="text-xs">Delivered To <span className="text-red-500">*</span></Label><Input value={deliveredTo} onChange={(e) => setDeliveredTo(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Due Order By</Label><Select value={dueOrderBy} onValueChange={setDueOrderBy}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{dueOrderByOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
                  <div><Label className="text-xs">Select Customer For Billing</Label><Select value={selectCustomerForBilling} onValueChange={setSelectCustomerForBilling}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{selectCustomerForBillingOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
                  <div className="flex items-center"><label className="flex items-center gap-2"><input type="checkbox" checked={printAfterSave} onChange={(e) => setPrintAfterSave(e.target.checked)} className="rounded" /><span className="text-xs">Print After Save</span></label></div>
                </div>

                {/* Row 7: Item, Packing, GR Type, GR Date, DDR # */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  <div><Label className="text-xs">Item</Label><Input value={item} onChange={(e) => setItem(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Packing</Label><Input value={packing} onChange={(e) => setPacking(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">GR Type</Label><Select value={grType} onValueChange={setGrType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{grTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
                  <div><Label className="text-xs">GR Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(grDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={grDate} onSelect={(d) => d && setGrDate(d)} /></PopoverContent></Popover></div>
                  <div><Label className="text-xs">DDR #</Label><Input value={ddrNo} onChange={(e) => setDdrNo(e.target.value)} className="h-8 text-xs" /></div>
                </div>

                {/* Row 8: Arrival Date, Received Pckgs, Balance Pckgs, Delivered Pckgs, Delivered Weight */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  <div><Label className="text-xs">Arrival Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(arrivalDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={arrivalDate} onSelect={(d) => d && setArrivalDate(d)} /></PopoverContent></Popover></div>
                  <div><Label className="text-xs">Received Pckgs</Label><Input type="number" value={receivedPckgs} onChange={(e) => setReceivedPckgs(Number(e.target.value))} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Balance Pckgs</Label><Input type="number" value={balancePckgs} onChange={(e) => setBalancePckgs(Number(e.target.value))} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Delivered Pckgs</Label><Input type="number" value={deliveredPckgs} onChange={(e) => setDeliveredPckgs(Number(e.target.value))} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Delivered Weight</Label><Input type="number" value={deliveredWeight} onChange={(e) => setDeliveredWeight(Number(e.target.value))} className="h-8 text-xs" /></div>
                </div>

                {/* Row 9: Godown, GR Freight */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><Label className="text-xs">Godown</Label><Select value={godown} onValueChange={setGodown}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{godownOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
                  <div><Label className="text-xs">GR Freight</Label><Input type="number" value={grFreight} onChange={(e) => setGrFreight(Number(e.target.value))} className="h-8 text-xs" /></div>
                </div>

                {/* Charges Table */}
                <div className="rounded-md border">
                  <div className="bg-gray-50 px-3 py-2 border-b flex justify-between items-center"><h3 className="text-sm font-semibold">Charges</h3><Button onClick={addChargeRow} variant="ghost" size="sm" className="h-7 text-xs"><PlusCircle className="mr-1 h-3 w-3" />Add Charge</Button></div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader><TableRow className="bg-gray-50"><TableHead className="w-12 text-xs">S#</TableHead><TableHead className="text-xs">Charges</TableHead><TableHead className="text-xs">Applicable On</TableHead><TableHead className="text-xs">Rate</TableHead><TableHead className="text-xs">Applicable Value</TableHead><TableHead className="text-xs">Amount</TableHead><TableHead className="w-12"></TableHead></TableRow></TableHeader>
                      <TableBody>{charges.map((charge, idx) => (<TableRow key={charge.id}><TableCell className="text-xs">{idx+1}</TableCell><TableCell><Select value={charge.charges} onValueChange={(v) => updateCharge(charge.id, "charges", v)}><SelectTrigger className="h-7 w-32 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{chargesOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></TableCell><TableCell><Select value={charge.applicableOn} onValueChange={(v) => updateCharge(charge.id, "applicableOn", v)}><SelectTrigger className="h-7 w-28 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{applicableOnOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></TableCell><TableCell><Input type="number" value={charge.rate} onChange={(e) => updateCharge(charge.id, "rate", Number(e.target.value))} className="h-7 w-20 text-xs" /></TableCell><TableCell><Input type="number" value={charge.applicableValue} onChange={(e) => updateCharge(charge.id, "applicableValue", Number(e.target.value))} className="h-7 w-20 text-xs" /></TableCell><TableCell className="text-xs">₹{charge.amount.toFixed(2)}</TableCell><TableCell><Button variant="ghost" size="sm" onClick={() => removeCharge(charge.id)} className="h-6 w-6 p-0 text-red-500"><Trash2 className="h-3 w-3" /></Button></TableCell></TableRow>))}</TableBody>
                    </Table>
                  </div>
                </div>

                {/* GST Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  <div><Label className="text-xs">GST Paid By</Label><Select value={gstPaidBy} onValueChange={setGstPaidBy}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent>{gstPaidByOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
                  <div><Label className="text-xs">SubTotal</Label><Input type="number" value={charges.reduce((sum, c) => sum + c.amount, 0)} readOnly className="h-8 text-xs bg-gray-50" /></div>
                  <div><Label className="text-xs">GST Type</Label><Select value={gstType} onValueChange={setGstType}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent>{gstTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
                  <div><Label className="text-xs">GST</Label><Input type="number" value={gst} readOnly className="h-8 text-xs bg-gray-50" /></div>
                  <div><Label className="text-xs">Total</Label><Input type="number" value={charges.reduce((sum, c) => sum + c.amount, 0) + gst} readOnly className="h-8 text-xs bg-gray-50 font-bold" /></div>
                  <div><Label className="text-xs">GST Status</Label><Input value="Calculated" readOnly className="h-8 text-xs bg-gray-50" /></div>
                </div>

                {/* Advance and Balance */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><Label className="text-xs">Advance</Label><Input type="number" value={advance} onChange={(e) => setAdvance(Number(e.target.value))} onBlur={calculateTotal} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Balance</Label><Input type="number" value={balance} readOnly className="h-8 text-xs bg-gray-50 font-bold" /></div>
                </div>

                {/* Proof of Delivery */}
                <div><Label className="text-xs">Proof Of Delivery</Label><Select value={proofOfDelivery} onValueChange={setProofOfDelivery}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{proofOfDeliveryOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
              </TabsContent>

              {/* Image Tab */}
              <TabsContent value="image" className="space-y-4 mt-4">
                <div className="border rounded-md p-4">
                  <div className="mb-4"><Label className="text-xs">Upload Images</Label><Input type="file" accept="image/jpeg,image/jpg" onChange={handleImageUpload} className="h-8 text-xs file:h-7 file:text-xs" /></div>
                  <p className="text-[10px] text-gray-500 mb-3">You can only upload JPG/JPEG files.</p>
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-3">
                      {images.map((img, idx) => (<div key={idx} className="relative border rounded-md p-2"><img src={img} alt={`Upload ${idx+1}`} className="w-full h-24 object-cover rounded" /><Button variant="ghost" size="sm" onClick={() => removeImage(idx)} className="absolute top-1 right-1 h-6 w-6 p-0 bg-red-500 text-white rounded-full"><X className="h-3 w-3" /></Button></div>))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t mt-4">
              <Button variant="outline" onClick={() => setIsEntryModalOpen(false)} className="h-8 text-sm"><X className="mr-1 h-3 w-3" /> Cancel</Button>
              <Button onClick={handleSave} disabled={loading} className="h-8 text-sm bg-blue-600 hover:bg-blue-700"><Save className="mr-1 h-3 w-3" />{editMode ? "Update" : "Save"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}