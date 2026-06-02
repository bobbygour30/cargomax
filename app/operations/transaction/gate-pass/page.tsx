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
  grPckgs: number;
  chgWeight: number;
  actWeight: number;
  deliveryType: string;
  consigneeType: string;
  deliveredAgainstConsigneeCopy: boolean;
  ccReceived: boolean;
  consigneeEmail: string;
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
  
  // Sheet state
  const [isEntrySheetOpen, setIsEntrySheetOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<number | null>(null);
  const [activeEntryTab, setActiveEntryTab] = useState<"entry" | "image">("entry");
  const [loading, setLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "report">("report");

  // Cancelled Dialog state
  const [isCancelledDialogOpen, setIsCancelledDialogOpen] = useState(false);
  const [cancellingGatePass, setCancellingGatePass] = useState<GatePassRecord | null>(null);
  const [cancelledReason, setCancelledReason] = useState<string>("");

  // Form state
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
  const [grPckgs, setGrPckgs] = useState<number>(0);
  const [chgWeight, setChgWeight] = useState<number>(0);
  const [actWeight, setActWeight] = useState<number>(0);
  const [deliveryType, setDeliveryType] = useState<string>("");
  const [consigneeType, setConsigneeType] = useState<string>("");
  const [deliveredAgainstConsigneeCopy, setDeliveredAgainstConsigneeCopy] = useState<boolean>(false);
  const [ccReceived, setCcReceived] = useState<boolean>(false);
  const [consigneeEmail, setConsigneeEmail] = useState<string>("");
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
  const [gstPaidBy, setGstPaidBy] = useState<string>("");
  const [gstType, setGstType] = useState<string>("");
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

  // Load search results on mount
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
    setGrPckgs(0);
    setChgWeight(0);
    setActWeight(0);
    setDeliveryType("");
    setConsigneeType("");
    setDeliveredAgainstConsigneeCopy(false);
    setCcReceived(false);
    setConsigneeEmail("");
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
    setGstPaidBy("");
    setGstType("");
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
    if (!branch) {
      alert("Please select Branch");
      return;
    }
    if (!grNo) {
      alert("Please enter GR #");
      return;
    }
    if (!consignee) {
      alert("Please enter Consignee");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const total = calculateTotal();
      const newRecord: GatePassRecord = {
        id: currentEditId || Date.now(),
        branch, date, gatePassNo, grNo, refNo, origin, destination, customer,
        consignor, consignorGst, consignee, consigneeTelNo, grPckgs, chgWeight,
        actWeight, deliveryType, consigneeType, deliveredAgainstConsigneeCopy,
        ccReceived, consigneeEmail, pvtMarka, remarks, deliveredTo, rebooking,
        dueGatepass, dueOrderBy, selectCustomerForBilling, printAfterSave, item,
        packing, grType, grDate, ddrNo, arrivalDate, receivedPckgs, balancePckgs,
        deliveredPckgs, deliveredWeight, godown, grFreight, charges, gstPaidBy,
        gstType, gst, advance, balance: total - advance, proofOfDelivery, images,
        status: "active",
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
      setIsEntrySheetOpen(false);
      setLoading(false);
    }, 500);
  };

  const handleCancelGatePass = () => {
    if (!cancelledReason) {
      alert("Please select cancellation reason");
      return;
    }
    
    if (cancellingGatePass) {
      const updatedRecords = savedRecords.map(record => 
        record.id === cancellingGatePass.id 
          ? { 
              ...record, 
              status: "cancelled" as const, 
              updatedAt: new Date()
            }
          : record
      );
      setSavedRecords(updatedRecords);
      filterActiveRecords();
      filterCancelledRecords();
      alert(`Gate Pass ${cancellingGatePass.gatePassNo} has been cancelled successfully!`);
      setIsCancelledDialogOpen(false);
      setCancellingGatePass(null);
      setCancelledReason("");
    }
  };

  const handleRestoreGatePass = (record: GatePassRecord) => {
    if (confirm(`Are you sure you want to restore Gate Pass ${record.gatePassNo}?`)) {
      const updatedRecords = savedRecords.map(r => 
        r.id === record.id 
          ? { ...r, status: "active" as const, updatedAt: new Date() }
          : r
      );
      setSavedRecords(updatedRecords);
      filterActiveRecords();
      filterCancelledRecords();
      alert(`Gate Pass ${record.gatePassNo} has been restored successfully!`);
    }
  };

  const handleSearch = () => {
    let results = savedRecords.filter(record => record.status === "active");
    if (searchBranch) results = results.filter(r => r.branch === searchBranch);
    if (searchDrNo) results = results.filter(r => r.gatePassNo.toLowerCase().includes(searchDrNo.toLowerCase()));
    if (searchFromDate) results = results.filter(r => r.date >= searchFromDate);
    if (searchToDate) results = results.filter(r => r.date <= searchToDate);
    setSearchResults(results);
    setCurrentPage(1);
  };

  const handleCancelledSearch = () => {
    let results = savedRecords.filter(record => record.status === "cancelled");
    if (searchBranch) results = results.filter(r => r.branch === searchBranch);
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
    setCurrentPage(1);
    setCancelledCurrentPage(1);
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
    setGrPckgs(record.grPckgs);
    setChgWeight(record.chgWeight);
    setActWeight(record.actWeight);
    setDeliveryType(record.deliveryType);
    setConsigneeType(record.consigneeType);
    setDeliveredAgainstConsigneeCopy(record.deliveredAgainstConsigneeCopy);
    setCcReceived(record.ccReceived);
    setConsigneeEmail(record.consigneeEmail);
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
    setIsEntrySheetOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to permanently delete this record?")) {
      const updatedRecords = savedRecords.filter(record => record.id !== id);
      setSavedRecords(updatedRecords);
      filterActiveRecords();
      filterCancelledRecords();
      alert("Record deleted successfully!");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const openAddSheet = () => {
    resetForm();
    setEditMode(false);
    setCurrentEditId(null);
    setGatePassNo(generateGatePassNo());
    setIsEntrySheetOpen(true);
  };

  const openCancelDialog = (record: GatePassRecord) => {
    setCancellingGatePass(record);
    setCancelledReason("");
    setIsCancelledDialogOpen(true);
  };

  // Stats
  const activeStats = {
    total: searchResults.length,
    totalAmount: searchResults.reduce((sum, r) => sum + r.charges.reduce((s, c) => s + c.amount, 0), 0),
  };

  const cancelledStats = {
    total: cancelledSearchResults.length,
  };

  // Pagination
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
          <Button onClick={openAddSheet} size="default" className="bg-blue-600 hover:bg-blue-700 shadow-md">
            <Plus className="mr-2 h-4 w-4" />
            New Gate Pass
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b bg-white rounded-t-lg">
        <button
          onClick={() => {
            setMainTab("active");
            filterActiveRecords();
          }}
          className={cn(
            "px-6 py-2.5 text-sm font-medium transition-all rounded-t-lg",
            mainTab === "active"
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          )}
        >
          Active Gate Passes
        </button>
        <button
          onClick={() => {
            setMainTab("cancelled");
            filterCancelledRecords();
          }}
          className={cn(
            "px-6 py-2.5 text-sm font-medium transition-all rounded-t-lg",
            mainTab === "cancelled"
              ? "bg-red-600 text-white shadow-md"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          )}
        >
          Cancelled Gate Passes
        </button>
      </div>

      {/* Active Gate Passes Tab */}
      {mainTab === "active" && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Total Active Gate Passes</p>
                    <p className="text-2xl font-bold">{activeStats.total}</p>
                  </div>
                  <FileText className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Total Amount</p>
                    <p className="text-2xl font-bold">₹{activeStats.totalAmount.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search Filters */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-[11px] font-semibold flex items-center gap-2 text-gray-700">
                <Search className="h-3.5 w-3.5" />
                Search Gate Passes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">Branch</Label>
                  <Select value={searchBranch} onValueChange={setSearchBranch}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="All Branches" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Branches</SelectItem>
                      {branchOptions.map(opt => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">From Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-8 w-full text-xs justify-start">
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {format(searchFromDate, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={searchFromDate} onSelect={(date) => date && setSearchFromDate(date)} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">To Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-8 w-full text-xs justify-start">
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {format(searchToDate, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={searchToDate} onSelect={(date) => date && setSearchToDate(date)} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">Gate Pass #</Label>
                  <Input value={searchDrNo} onChange={(e) => setSearchDrNo(e.target.value)} placeholder="Enter GP Number" className="h-8 text-xs" />
                </div>
                <div className="flex items-end gap-2">
                  <Button onClick={handleSearch} size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700">
                    <Search className="mr-1 h-3 w-3" />
                    Search
                  </Button>
                  <Button onClick={handleClearSearch} variant="outline" size="sm" className="h-8 text-xs">
                    <RefreshCw className="mr-1 h-3 w-3" />
                    Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* View Mode Toggle */}
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => setViewMode("report")}
              variant={viewMode === "report" ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs"
            >
              <Table className="h-3.5 w-3.5 mr-1" /> Report View
            </Button>
            <Button
              onClick={() => setViewMode("grid")}
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs"
            >
              <Grid3x3 className="h-3.5 w-3.5 mr-1" /> Grid View
            </Button>
          </div>

          {/* Report View Table */}
          {viewMode === "report" && searchResults.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Table className="h-3.5 w-3.5 text-gray-500" />
                    <h3 className="text-[11px] font-semibold text-gray-800">Gate Passes List</h3>
                  </div>
                  <div className="text-[10px] text-gray-500">Total: {searchResults.length} records</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto">
                  <div className="min-w-[1000px]">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="text-[11px] font-semibold py-2 px-2 w-12 text-center">#</TableHead>
                          <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Gate Pass #</TableHead>
                          <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">Date</TableHead>
                          <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">GR #</TableHead>
                          <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Branch</TableHead>
                          <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[120px]">Consignee</TableHead>
                          <TableHead className="text-[11px] font-semibold py-2 px-2 w-[60px] text-center">Pckgs</TableHead>
                          <TableHead className="text-[11px] font-semibold py-2 px-2 w-[80px] text-right">Amount</TableHead>
                          <TableHead className="text-[11px] font-semibold py-2 px-2 w-32 text-center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedResults.map((record, idx) => (
                          <TableRow key={record.id} className="hover:bg-gray-50">
                            <TableCell className="py-2 px-2 text-center text-xs">
                              {(currentPage - 1) * itemsPerPage + idx + 1}
                            </TableCell>
                            <TableCell className="py-2 px-2 font-mono font-semibold text-xs">
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 text-[11px]">
                                {record.gatePassNo}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-2 px-2 text-xs">{format(record.date, "dd-MM-yyyy")}</TableCell>
                            <TableCell className="py-2 px-2 font-mono text-xs">{record.grNo}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{record.branch}</TableCell>
                            <TableCell className="py-2 px-2 text-xs truncate max-w-[150px]">{record.consignee}</TableCell>
                            <TableCell className="py-2 px-2 text-center text-xs">{record.grPckgs}</TableCell>
                            <TableCell className="py-2 px-2 text-right text-xs">₹{record.charges.reduce((sum, c) => sum + c.amount, 0).toLocaleString()}</TableCell>
                            <TableCell className="py-2 px-2 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(record)}
                                  className="h-7 w-7 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                  title="Edit"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openCancelDialog(record)}
                                  className="h-7 w-7 p-0 text-orange-500 hover:text-orange-700 hover:bg-orange-50"
                                  title="Cancel Gate Pass"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(record.id)}
                                  className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  title="Delete"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
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
          )}

          {/* Grid View */}
          {viewMode === "grid" && searchResults.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((record) => (
                <Card key={record.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-500" />
                          <h3 className="font-semibold text-sm">{record.gatePassNo}</h3>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1">{format(record.date, "dd-MM-yyyy")}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700 text-[10px]">Active</Badge>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <Package className="h-3 w-3 text-gray-400" />
                        <span>GR #: {record.grNo}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="h-3 w-3 text-gray-400" />
                        <span>Branch: {record.branch}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3 text-gray-400" />
                        <span className="truncate">Consignee: {record.consignee}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-3 w-3 text-gray-400" />
                        <span>Pckgs: {record.grPckgs}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-3 w-3 text-gray-400" />
                        <span>Amount: ₹{record.charges.reduce((sum, c) => sum + c.amount, 0).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(record)} className="h-7 w-7 p-0 text-blue-500">
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openCancelDialog(record)} className="h-7 w-7 p-0 text-orange-500">
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* No Data Message */}
          {searchResults.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p className="text-gray-500 text-sm">No active gate pass records found</p>
                <p className="text-xs text-gray-400 mt-1">Click "New Gate Pass" to create one</p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Cancelled Gate Passes Tab */}
      {mainTab === "cancelled" && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Total Cancelled Gate Passes</p>
                    <p className="text-2xl font-bold">{cancelledStats.total}</p>
                  </div>
                  <X className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search Filters for Cancelled */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-[11px] font-semibold flex items-center gap-2 text-gray-700">
                <Search className="h-3.5 w-3.5" />
                Search Cancelled Gate Passes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">Branch</Label>
                  <Select value={searchBranch} onValueChange={setSearchBranch}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="All Branches" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Branches</SelectItem>
                      {branchOptions.map(opt => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">From Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-8 w-full text-xs justify-start">
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {format(searchFromDate, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={searchFromDate} onSelect={(date) => date && setSearchFromDate(date)} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">To Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-8 w-full text-xs justify-start">
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {format(searchToDate, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={searchToDate} onSelect={(date) => date && setSearchToDate(date)} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">Gate Pass #</Label>
                  <Input value={searchDrNo} onChange={(e) => setSearchDrNo(e.target.value)} placeholder="Enter GP Number" className="h-8 text-xs" />
                </div>
                <div className="flex items-end gap-2">
                  <Button onClick={handleCancelledSearch} size="sm" className="h-8 text-xs bg-red-600 hover:bg-red-700">
                    <Search className="mr-1 h-3 w-3" />
                    Search
                  </Button>
                  <Button onClick={handleClearSearch} variant="outline" size="sm" className="h-8 text-xs">
                    <RefreshCw className="mr-1 h-3 w-3" />
                    Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cancelled Records Table */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Table className="h-3.5 w-3.5 text-gray-500" />
                  <h3 className="text-[11px] font-semibold text-gray-800">Cancelled Gate Passes List</h3>
                </div>
                <div className="text-[10px] text-gray-500">Total: {cancelledSearchResults.length} records</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <div className="min-w-[800px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="text-[11px] font-semibold py-2 px-2 w-12 text-center">#</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Gate Pass #</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">Date</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">GR #</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Branch</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[120px]">Consignee</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 w-24 text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedCancelledResults.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                            <X className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            No cancelled gate pass records found
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedCancelledResults.map((record, idx) => (
                          <TableRow key={record.id} className="hover:bg-gray-50 bg-red-50/30">
                            <TableCell className="py-2 px-2 text-center text-xs">
                              {(cancelledCurrentPage - 1) * itemsPerPage + idx + 1}
                            </TableCell>
                            <TableCell className="py-2 px-2 font-mono font-semibold text-xs">
                              <Badge variant="outline" className="bg-red-50 text-red-700 text-[11px]">
                                {record.gatePassNo}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-2 px-2 text-xs">{format(record.date, "dd-MM-yyyy")}</TableCell>
                            <TableCell className="py-2 px-2 font-mono text-xs">{record.grNo}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{record.branch}</TableCell>
                            <TableCell className="py-2 px-2 text-xs truncate max-w-[150px]">{record.consignee}</TableCell>
                            <TableCell className="py-2 px-2 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRestoreGatePass(record)}
                                  className="h-7 w-7 p-0 text-green-500 hover:text-green-700 hover:bg-green-50"
                                  title="Restore Gate Pass"
                                >
                                  <RefreshCw className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(record.id)}
                                  className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  title="Delete"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
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

              {/* Pagination for Cancelled */}
              {cancelledTotalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-[10px] text-gray-500">
                    Showing {((cancelledCurrentPage - 1) * itemsPerPage) + 1} to {Math.min(cancelledCurrentPage * itemsPerPage, cancelledSearchResults.length)} of {cancelledSearchResults.length} entries
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" onClick={() => goToCancelledPage(cancelledCurrentPage - 1)} disabled={cancelledCurrentPage === 1} className="h-7 text-[10px]">
                      <ChevronLeft className="h-3 w-3 mr-1" /> Previous
                    </Button>
                    <span className="px-3 py-1 text-[10px]">Page {cancelledCurrentPage} of {cancelledTotalPages}</span>
                    <Button variant="outline" size="sm" onClick={() => goToCancelledPage(cancelledCurrentPage + 1)} disabled={cancelledCurrentPage === cancelledTotalPages} className="h-7 text-[10px]">
                      Next <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Cancel Gate Pass Dialog */}
      <Dialog open={isCancelledDialogOpen} onOpenChange={setIsCancelledDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <X className="h-5 w-5" />
              Cancel Gate Pass
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel Gate Pass <strong>{cancellingGatePass?.gatePassNo}</strong>?
              This action cannot be undone immediately.
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
                <SelectContent>
                  {cancelledReasonOptions.map(opt => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="bg-yellow-50 p-3 rounded-md">
              <p className="text-xs text-yellow-800 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Note: Cancelled gate passes will be moved to Cancelled List and can be restored later.
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsCancelledDialogOpen(false)}>
              No, Keep Gate Pass
            </Button>
            <Button variant="destructive" onClick={handleCancelGatePass}>
              Yes, Cancel Gate Pass
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Entry Sheet */}
      <Sheet open={isEntrySheetOpen} onOpenChange={setIsEntrySheetOpen}>
        <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle className="flex items-center gap-2 text-base">
              {editMode ? (
                <>
                  <Edit className="h-4 w-4 text-blue-600" />
                  Edit Gate Pass
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 text-blue-600" />
                  New Gate Pass
                </>
              )}
            </SheetTitle>
          </SheetHeader>

          <Tabs value={activeEntryTab} onValueChange={(v) => setActiveEntryTab(v as "entry" | "image")} className="w-full">
            <TabsList className="grid w-full max-w-[200px] grid-cols-2">
              <TabsTrigger value="entry" className="text-xs">Entry</TabsTrigger>
              <TabsTrigger value="image" className="text-xs">Image</TabsTrigger>
            </TabsList>

            {/* Entry Form Tab */}
            <TabsContent value="entry" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1"><Label className="text-xs">Branch <span className="text-red-500">*</span></Label><Select value={branch} onValueChange={setBranch}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{branchOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
                <div className="space-y-1"><Label className="text-xs">Date <span className="text-red-500">*</span></Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-2 h-3 w-3" />{format(date, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} /></PopoverContent></Popover></div>
                <div className="space-y-1"><Label className="text-xs">Gate Pass# <span className="text-red-500">*</span></Label><div className="flex gap-2"><Input value={gatePassNo} onChange={(e) => setGatePassNo(e.target.value)} readOnly={auto} className={cn("h-8 text-xs flex-1", auto && "bg-gray-50")} /><div className="flex items-center gap-1"><input type="checkbox" checked={auto} onChange={handleAutoChange} className="h-3.5 w-3.5" id="auto" /><Label htmlFor="auto" className="text-xs cursor-pointer">Auto</Label></div></div></div>
                <div className="space-y-1"><Label className="text-xs">GR # <span className="text-red-500">*</span></Label><Input value={grNo} onChange={(e) => setGrNo(e.target.value)} className="h-8 text-xs" /></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1"><Label className="text-xs">Ref.#</Label><Input value={refNo} onChange={(e) => setRefNo(e.target.value)} className="h-8 text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Origin</Label><Input value={origin} onChange={(e) => setOrigin(e.target.value)} className="h-8 text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Destination</Label><Input value={destination} onChange={(e) => setDestination(e.target.value)} className="h-8 text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Customer</Label><Input value={customer} onChange={(e) => setCustomer(e.target.value)} className="h-8 text-xs" /></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1"><Label className="text-xs">Consignor</Label><Input value={consignor} onChange={(e) => setConsignor(e.target.value)} className="h-8 text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">CNGE GST#</Label><Input value={consignorGst} onChange={(e) => setConsignorGst(e.target.value)} className="h-8 text-xs uppercase" /></div>
                <div className="space-y-1"><Label className="text-xs">Consignee <span className="text-red-500">*</span></Label><Input value={consignee} onChange={(e) => setConsignee(e.target.value)} className="h-8 text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Consignee Tel. #</Label><Input value={consigneeTelNo} onChange={(e) => setConsigneeTelNo(e.target.value)} className="h-8 text-xs" /></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1"><Label className="text-xs">GR Pckgs</Label><Input type="number" value={grPckgs} onChange={(e) => setGrPckgs(Number(e.target.value))} className="h-8 text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Chg. Weight</Label><Input type="number" value={chgWeight} onChange={(e) => setChgWeight(Number(e.target.value))} className="h-8 text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Act. Weight</Label><Input type="number" value={actWeight} onChange={(e) => setActWeight(Number(e.target.value))} className="h-8 text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Delivery Type</Label><Select value={deliveryType} onValueChange={setDeliveryType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{deliveryTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1"><Label className="text-xs">Delivered To</Label><Input value={deliveredTo} onChange={(e) => setDeliveredTo(e.target.value)} className="h-8 text-xs" /></div>
                <div className="flex items-center gap-3"><input type="checkbox" checked={deliveredAgainstConsigneeCopy} onChange={(e) => setDeliveredAgainstConsigneeCopy(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-xs">Against Consignee Copy</Label></div>
                <div className="flex items-center gap-3"><input type="checkbox" checked={ccReceived} onChange={(e) => setCcReceived(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-xs">CC Received</Label></div>
                <div className="flex items-center gap-3"><input type="checkbox" checked={rebooking} onChange={(e) => setRebooking(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-xs">Rebooking</Label></div>
              </div>

              {/* Charges Table */}
              <div className="rounded-md border">
                <div className="bg-gray-50 px-3 py-2 border-b flex justify-between items-center"><h3 className="text-sm font-semibold">Charges</h3><Button onClick={addChargeRow} variant="ghost" size="sm" className="h-7 text-xs"><PlusCircle className="mr-1 h-3 w-3" />Add Charge</Button></div>
                <div className="overflow-x-auto">
                  <Table className="text-xs">
                    <TableHeader><TableRow className="bg-gray-50"><TableHead className="w-12">#</TableHead><TableHead>Charges</TableHead><TableHead>Applicable On</TableHead><TableHead>Rate</TableHead><TableHead>Applicable Value</TableHead><TableHead>Amount</TableHead><TableHead className="w-12">Action</TableHead></TableRow></TableHeader>
                    <TableBody>{charges.map((charge, idx) => (<TableRow key={charge.id}><TableCell>{idx+1}</TableCell><TableCell><Select value={charge.charges} onValueChange={(v) => updateCharge(charge.id, "charges", v)}><SelectTrigger className="h-7 w-32 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{chargesOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></TableCell><TableCell><Select value={charge.applicableOn} onValueChange={(v) => updateCharge(charge.id, "applicableOn", v)}><SelectTrigger className="h-7 w-28 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{applicableOnOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></TableCell><TableCell><Input type="number" value={charge.rate} onChange={(e) => updateCharge(charge.id, "rate", Number(e.target.value))} className="h-7 w-24 text-xs" /></TableCell><TableCell><Input type="number" value={charge.applicableValue} onChange={(e) => updateCharge(charge.id, "applicableValue", Number(e.target.value))} className="h-7 w-24 text-xs" /></TableCell><TableCell>₹{charge.amount.toFixed(2)}</TableCell><TableCell><Button variant="ghost" size="sm" onClick={() => removeCharge(charge.id)} className="h-6 w-6 p-0 text-red-500"><Trash2 className="h-3 w-3" /></Button></TableCell></TableRow>))}</TableBody>
                  </Table>
                </div>
              </div>

              {/* GST and Totals */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1"><Label className="text-xs">GST Paid By</Label><Select value={gstPaidBy} onValueChange={setGstPaidBy}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{gstPaidByOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
                <div className="space-y-1"><Label className="text-xs">GST Type</Label><Select value={gstType} onValueChange={setGstType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{gstTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
                <div className="space-y-1"><Label className="text-xs">Advance</Label><Input type="number" value={advance} onChange={(e) => setAdvance(Number(e.target.value))} className="h-8 text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Remarks</Label><Input value={remarks} onChange={(e) => setRemarks(e.target.value)} className="h-8 text-xs" /></div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsEntrySheetOpen(false)} className="h-8 text-xs">
                  <X className="mr-1 h-3 w-3" /> Cancel
                </Button>
                <Button onClick={handleSave} size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700" disabled={loading}>
                  <Save className="mr-1 h-3 w-3" />
                  {editMode ? "Update" : "Save"}
                </Button>
              </div>
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
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsEntrySheetOpen(false)} className="h-8 text-xs">
                  <X className="mr-1 h-3 w-3" /> Cancel
                </Button>
                <Button onClick={handleSave} size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700">
                  <Save className="mr-1 h-3 w-3" />
                  {editMode ? "Update" : "Save"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// Missing imports
import { Plus, Edit, Grid3x3 } from "lucide-react";