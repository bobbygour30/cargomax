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
  Pencil,
  Trash2,
  Plus,
  Eye,
  Check,
  X,
  Truck,
  Package,
  MapPin,
  Building,
  Phone,
  Mail,
  CreditCard,
  FileText,
  Printer,
  Download,
  AlertCircle,
  TrendingUp,
  Calculator,
  Shield,
  Users,
  FileSpreadsheet,
  PlusCircle,
  MinusCircle,
  User,
  UserCheck,
  MessageSquare,
  DollarSign,
  ShieldCheck,
  Settings,
  Filter,
  ChevronLeft,
  ChevronRight,
  Send,
  Grid3x3,
  Edit,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface InvoiceItem {
  id: number;
  invoiceNo: string;
  date: Date;
  value: string;
  awayBillNo: string;
  awayBillDate: Date;
  valueUpTo: string;
}

interface BookingRecord {
  id: number;
  grNo: string;
  grDate: Date;
  bookingFrom: string;
  destination: string;
  deliveryPoint: string;
  collectionAt: string;
  consignorName: string;
  consignorCode: string;
  consignorAddress: string;
  consignorCity: string;
  consignorState: string;
  consignorPincode: string;
  consignorMobile: string;
  consignorEmail: string;
  consignorGst: string;
  consigneeName: string;
  consigneeCode: string;
  consigneeAddress: string;
  consigneeCity: string;
  consigneeState: string;
  consigneePincode: string;
  consigneeMobile: string;
  consigneeEmail: string;
  consigneeGst: string;
  deliveryType: string;
  mkExecutive: string;
  toPay: boolean;
  gst: boolean;
  surface: boolean;
  partLoad: boolean;
  freightOn: string;
  chargeWeight: number;
  manualRates: boolean;
  basicFreight: number;
  loadingCharges: number;
  unloadingCharges: number;
  doorDeliveryCharges: number;
  otherCharges: number;
  totalFreight: number;
  remarks: string;
  roRemarks: string;
  gpRemarks: string;
  insuranceCoveredBy: string;
  insuranceNo: string;
  insuranceDate: Date;
  insuranceCompany: string;
  insuranceAmount: number;
  invoices: InvoiceItem[];
  status: "active" | "cancelled";
  cancelledDate?: Date;
  cancelledReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const deliveryTypeOptions = [
  { value: "door_delivery", label: "Door Delivery" },
  { value: "pickup", label: "Pickup" },
  { value: "self_collection", label: "Self Collection" },
];

const insuranceCoveredByOptions = [
  { value: "carrier", label: "Carrier" },
  { value: "consignor", label: "Consignor" },
  { value: "consignee", label: "Consignee" },
];

const freightOnOptions = [
  { value: "to_pay", label: "To Pay" },
  { value: "prepaid", label: "Prepaid" },
  { value: "collect", label: "Collect" },
];

const loadTypeOptions = [
  { value: "ftl", label: "FTL" },
  { value: "ltl", label: "LTL" },
  { value: "container", label: "Container" },
];

// Sample branch list
const branchOptions = [
  "DELHI", "MUMBAI", "BANGALORE", "CHENNAI", "KOLKATA", 
  "AHMEDABAD", "PUNE", "HYDERABAD", "LUCKNOW", "JAIPUR"
];

// Sample executive list
const executiveOptions = [
  "Rajesh Kumar", "Suresh Singh", "Amit Sharma", "Priya Verma", 
  "Vikash Gupta", "Neha Singh", "Rahul Mehta", "Pooja Yadav"
];

// Cancelled Reason Options
const cancelledReasonOptions = [
  "Customer Request", "Payment Issue", "Wrong Booking", "Duplicate Booking",
  "Vehicle Unavailable", "Route Not Available", "Other"
];

export default function BookingComputerizeGRL() {
  // Main Tab state
  const [mainTab, setMainTab] = useState<"active" | "cancelled">("active");
  
  // Sheet state
  const [isEntrySheetOpen, setIsEntrySheetOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<number | null>(null);
  const [activeFormTab, setActiveFormTab] = useState<string>("basic");
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "report">("report");

  // Cancelled Dialog state
  const [isCancelledDialogOpen, setIsCancelledDialogOpen] = useState(false);
  const [cancellingBooking, setCancellingBooking] = useState<BookingRecord | null>(null);
  const [cancelledReason, setCancelledReason] = useState<string>("");

  // Basic Info state
  const [grNo, setGrNo] = useState<string>("");
  const [grDate, setGrDate] = useState<Date>(new Date());
  const [bookingFrom, setBookingFrom] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [deliveryPoint, setDeliveryPoint] = useState<string>("");
  const [collectionAt, setCollectionAt] = useState<string>("");
  const [deliveryType, setDeliveryType] = useState<string>("");
  const [mkExecutive, setMkExecutive] = useState<string>("");
  const [loadType, setLoadType] = useState<string>("");

  // Consignor state
  const [consignorName, setConsignorName] = useState<string>("");
  const [consignorCode, setConsignorCode] = useState<string>("");
  const [consignorAddress, setConsignorAddress] = useState<string>("");
  const [consignorCity, setConsignorCity] = useState<string>("");
  const [consignorState, setConsignorState] = useState<string>("");
  const [consignorPincode, setConsignorPincode] = useState<string>("");
  const [consignorMobile, setConsignorMobile] = useState<string>("");
  const [consignorEmail, setConsignorEmail] = useState<string>("");
  const [consignorGst, setConsignorGst] = useState<string>("");

  // Consignee state
  const [consigneeName, setConsigneeName] = useState<string>("");
  const [consigneeCode, setConsigneeCode] = useState<string>("");
  const [consigneeAddress, setConsigneeAddress] = useState<string>("");
  const [consigneeCity, setConsigneeCity] = useState<string>("");
  const [consigneeState, setConsigneeState] = useState<string>("");
  const [consigneePincode, setConsigneePincode] = useState<string>("");
  const [consigneeMobile, setConsigneeMobile] = useState<string>("");
  const [consigneeEmail, setConsigneeEmail] = useState<string>("");
  const [consigneeGst, setConsigneeGst] = useState<string>("");

  // Freight state
  const [freightOn, setFreightOn] = useState<string>("");
  const [chargeWeight, setChargeWeight] = useState<number>(0);
  const [basicFreight, setBasicFreight] = useState<number>(0);
  const [loadingCharges, setLoadingCharges] = useState<number>(0);
  const [unloadingCharges, setUnloadingCharges] = useState<number>(0);
  const [doorDeliveryCharges, setDoorDeliveryCharges] = useState<number>(0);
  const [otherCharges, setOtherCharges] = useState<number>(0);
  const [totalFreight, setTotalFreight] = useState<number>(0);

  // Status
  const [toPay, setToPay] = useState<boolean>(false);
  const [gst, setGst] = useState<boolean>(false);
  const [surface, setSurface] = useState<boolean>(false);
  const [partLoad, setPartLoad] = useState<boolean>(false);
  const [manualRates, setManualRates] = useState<boolean>(false);

  // Remarks state
  const [remarks, setRemarks] = useState<string>("");
  const [roRemarks, setRoRemarks] = useState<string>("");
  const [gpRemarks, setGpRemarks] = useState<string>("");

  // Insurance state
  const [insuranceCoveredBy, setInsuranceCoveredBy] = useState<string>("");
  const [insuranceNo, setInsuranceNo] = useState<string>("");
  const [insuranceDate, setInsuranceDate] = useState<Date>(new Date());
  const [insuranceCompany, setInsuranceCompany] = useState<string>("");
  const [insuranceAmount, setInsuranceAmount] = useState<number>(0);

  // Invoices
  const [invoices, setInvoices] = useState<InvoiceItem[]>([
    { id: 1, invoiceNo: "", date: new Date(), value: "", awayBillNo: "", awayBillDate: new Date(), valueUpTo: "" },
  ]);

  // Search state
  const [searchFromDate, setSearchFromDate] = useState<Date>(new Date());
  const [searchToDate, setSearchToDate] = useState<Date>(new Date());
  const [searchGrNo, setSearchGrNo] = useState<string>("");
  const [searchBranch, setSearchBranch] = useState<string>("all");
  const [searchResults, setSearchResults] = useState<BookingRecord[]>([]);
  const [cancelledSearchResults, setCancelledSearchResults] = useState<BookingRecord[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [cancelledCurrentPage, setCancelledCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Sample saved data with cancelled records
  const [savedRecords, setSavedRecords] = useState<BookingRecord[]>([
    {
      id: 1, grNo: "GR000001", grDate: new Date("2026-05-20"), bookingFrom: "DELHI", destination: "MUMBAI",
      deliveryPoint: "Andheri", collectionAt: "Delhi Hub", consignorName: "ABC Traders", consignorCode: "C001",
      consignorAddress: "123, Transport Nagar", consignorCity: "Delhi", consignorState: "Delhi", consignorPincode: "110001",
      consignorMobile: "9876543210", consignorEmail: "abc@traders.com", consignorGst: "07ABCDE1234F1Z5",
      consigneeName: "XYZ Enterprises", consigneeCode: "C002", consigneeAddress: "456, MIDC Area", consigneeCity: "Mumbai",
      consigneeState: "Maharashtra", consigneePincode: "400001", consigneeMobile: "9876543220", consigneeEmail: "xyz@enterprises.com",
      consigneeGst: "27FGHIJ5678K1Z6", deliveryType: "door_delivery", mkExecutive: "Rajesh Kumar", toPay: true,
      gst: true, surface: false, partLoad: false, freightOn: "to_pay", chargeWeight: 500, manualRates: false,
      basicFreight: 15000, loadingCharges: 500, unloadingCharges: 500, doorDeliveryCharges: 1000, otherCharges: 0,
      totalFreight: 17000, remarks: "Handle with care", roRemarks: "", gpRemarks: "", insuranceCoveredBy: "carrier",
      insuranceNo: "INS001", insuranceDate: new Date(), insuranceCompany: "New India", insuranceAmount: 50000,
      invoices: [], status: "active", createdAt: new Date(), updatedAt: new Date()
    },
    {
      id: 2, grNo: "GR000002", grDate: new Date("2026-05-18"), bookingFrom: "MUMBAI", destination: "BANGALORE",
      deliveryPoint: "Electronic City", collectionAt: "Mumbai Hub", consignorName: "PQR Ltd", consignorCode: "C003",
      consignorAddress: "789, Business Park", consignorCity: "Mumbai", consignorState: "Maharashtra", consignorPincode: "400002",
      consignorMobile: "9876543230", consignorEmail: "pqr@ltd.com", consignorGst: "27PQRST3456U1Z7",
      consigneeName: "LMN Corp", consigneeCode: "C004", consigneeAddress: "321, IT Park", consigneeCity: "Bangalore",
      consigneeState: "Karnataka", consigneePincode: "560001", consigneeMobile: "9876543240", consigneeEmail: "lmn@corp.com",
      consigneeGst: "29LMNOP9012Q1Z8", deliveryType: "pickup", mkExecutive: "Suresh Singh", toPay: false,
      gst: true, surface: false, partLoad: true, freightOn: "prepaid", chargeWeight: 300, manualRates: false,
      basicFreight: 12000, loadingCharges: 400, unloadingCharges: 400, doorDeliveryCharges: 0, otherCharges: 200,
      totalFreight: 13000, remarks: "", roRemarks: "", gpRemarks: "", insuranceCoveredBy: "consignor",
      insuranceNo: "", insuranceDate: new Date(), insuranceCompany: "", insuranceAmount: 0,
      invoices: [], status: "cancelled", cancelledDate: new Date("2026-05-19"), cancelledReason: "Customer Request",
      createdAt: new Date(), updatedAt: new Date()
    },
  ]);

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

  const generateGrNo = (): string => {
    const count = savedRecords.filter(r => r.status === "active").length + 1;
    return `GR${String(count).padStart(6, "0")}`;
  };

  const calculateTotalFreight = () => {
    const total = basicFreight + loadingCharges + unloadingCharges + doorDeliveryCharges + otherCharges;
    setTotalFreight(total);
    return total;
  };

  const resetForm = (): void => {
    setGrNo(generateGrNo());
    setGrDate(new Date());
    setBookingFrom("");
    setDestination("");
    setDeliveryPoint("");
    setCollectionAt("");
    setDeliveryType("");
    setMkExecutive("");
    setLoadType("");
    setConsignorName("");
    setConsignorCode("");
    setConsignorAddress("");
    setConsignorCity("");
    setConsignorState("");
    setConsignorPincode("");
    setConsignorMobile("");
    setConsignorEmail("");
    setConsignorGst("");
    setConsigneeName("");
    setConsigneeCode("");
    setConsigneeAddress("");
    setConsigneeCity("");
    setConsigneeState("");
    setConsigneePincode("");
    setConsigneeMobile("");
    setConsigneeEmail("");
    setConsigneeGst("");
    setFreightOn("");
    setChargeWeight(0);
    setBasicFreight(0);
    setLoadingCharges(0);
    setUnloadingCharges(0);
    setDoorDeliveryCharges(0);
    setOtherCharges(0);
    setTotalFreight(0);
    setToPay(false);
    setGst(false);
    setSurface(false);
    setPartLoad(false);
    setManualRates(false);
    setRemarks("");
    setRoRemarks("");
    setGpRemarks("");
    setInsuranceCoveredBy("");
    setInsuranceNo("");
    setInsuranceDate(new Date());
    setInsuranceCompany("");
    setInsuranceAmount(0);
    setInvoices([{ id: 1, invoiceNo: "", date: new Date(), value: "", awayBillNo: "", awayBillDate: new Date(), valueUpTo: "" }]);
    setEditMode(false);
    setCurrentEditId(null);
    setActiveFormTab("basic");
  };

  const addInvoiceRow = () => {
    const newInvoice: InvoiceItem = {
      id: Date.now(),
      invoiceNo: "",
      date: new Date(),
      value: "",
      awayBillNo: "",
      awayBillDate: new Date(),
      valueUpTo: "",
    };
    setInvoices([...invoices, newInvoice]);
  };

  const updateInvoice = (id: number, field: keyof InvoiceItem, value: any) => {
    setInvoices(invoices.map((inv) => (inv.id === id ? { ...inv, [field]: value } : inv)));
  };

  const removeInvoice = (id: number) => {
    if (invoices.length > 1) {
      setInvoices(invoices.filter((inv) => inv.id !== id));
    }
  };

  const handleSave = () => {
    if (!consignorName) {
      alert("Please enter Consignor Name");
      return;
    }
    if (!consigneeName) {
      alert("Please enter Consignee Name");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const newRecord: BookingRecord = {
        id: currentEditId || Date.now(),
        grNo,
        grDate,
        bookingFrom,
        destination,
        deliveryPoint,
        collectionAt,
        consignorName,
        consignorCode,
        consignorAddress,
        consignorCity,
        consignorState,
        consignorPincode,
        consignorMobile,
        consignorEmail,
        consignorGst,
        consigneeName,
        consigneeCode,
        consigneeAddress,
        consigneeCity,
        consigneeState,
        consigneePincode,
        consigneeMobile,
        consigneeEmail,
        consigneeGst,
        deliveryType,
        mkExecutive,
        toPay,
        gst,
        surface,
        partLoad,
        freightOn,
        chargeWeight,
        manualRates,
        basicFreight,
        loadingCharges,
        unloadingCharges,
        doorDeliveryCharges,
        otherCharges,
        totalFreight,
        remarks,
        roRemarks,
        gpRemarks,
        insuranceCoveredBy,
        insuranceNo,
        insuranceDate,
        insuranceCompany,
        insuranceAmount,
        invoices,
        status: "active",
        createdAt: editMode && currentEditId ? 
          savedRecords.find(r => r.id === currentEditId)?.createdAt || new Date() : 
          new Date(),
        updatedAt: new Date(),
      };

      let updatedRecords;
      if (editMode && currentEditId) {
        updatedRecords = savedRecords.map((record) => (record.id === currentEditId ? newRecord : record));
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

  const handleCancelBooking = () => {
    if (!cancelledReason) {
      alert("Please select cancellation reason");
      return;
    }
    
    if (cancellingBooking) {
      const updatedRecords = savedRecords.map(record => 
        record.id === cancellingBooking.id 
          ? { 
              ...record, 
              status: "cancelled" as const, 
              cancelledDate: new Date(), 
              cancelledReason: cancelledReason,
              updatedAt: new Date()
            }
          : record
      );
      setSavedRecords(updatedRecords);
      filterActiveRecords();
      filterCancelledRecords();
      alert(`Booking ${cancellingBooking.grNo} has been cancelled successfully!`);
      setIsCancelledDialogOpen(false);
      setCancellingBooking(null);
      setCancelledReason("");
    }
  };

  const handleRestoreBooking = (record: BookingRecord) => {
    if (confirm(`Are you sure you want to restore booking ${record.grNo}?`)) {
      const updatedRecords = savedRecords.map(r => 
        r.id === record.id 
          ? { ...r, status: "active" as const, cancelledDate: undefined, cancelledReason: undefined, updatedAt: new Date() }
          : r
      );
      setSavedRecords(updatedRecords);
      filterActiveRecords();
      filterCancelledRecords();
      alert(`Booking ${record.grNo} has been restored successfully!`);
    }
  };

  const handleSearch = () => {
    let results = savedRecords.filter(r => r.status === "active");
    if (searchGrNo) {
      results = results.filter((r) => r.grNo.toLowerCase().includes(searchGrNo.toLowerCase()));
    }
    if (searchFromDate) {
      results = results.filter((r) => r.grDate >= searchFromDate);
    }
    if (searchToDate) {
      results = results.filter((r) => r.grDate <= searchToDate);
    }
    if (searchBranch !== "all") {
      results = results.filter((r) => r.bookingFrom === searchBranch);
    }
    setSearchResults(results);
    setCurrentPage(1);
  };

  const handleCancelledSearch = () => {
    let results = savedRecords.filter(r => r.status === "cancelled");
    if (searchGrNo) {
      results = results.filter((r) => r.grNo.toLowerCase().includes(searchGrNo.toLowerCase()));
    }
    if (searchFromDate) {
      results = results.filter((r) => r.grDate >= searchFromDate);
    }
    if (searchToDate) {
      results = results.filter((r) => r.grDate <= searchToDate);
    }
    if (searchBranch !== "all") {
      results = results.filter((r) => r.bookingFrom === searchBranch);
    }
    setCancelledSearchResults(results);
    setCancelledCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchGrNo("");
    setSearchFromDate(new Date());
    setSearchToDate(new Date());
    setSearchBranch("all");
    filterActiveRecords();
    filterCancelledRecords();
    setCurrentPage(1);
    setCancelledCurrentPage(1);
  };

  const handleEdit = (record: BookingRecord) => {
    setEditMode(true);
    setCurrentEditId(record.id);
    setGrNo(record.grNo);
    setGrDate(record.grDate);
    setBookingFrom(record.bookingFrom);
    setDestination(record.destination);
    setDeliveryPoint(record.deliveryPoint);
    setCollectionAt(record.collectionAt);
    setConsignorName(record.consignorName);
    setConsignorCode(record.consignorCode);
    setConsignorAddress(record.consignorAddress);
    setConsignorCity(record.consignorCity);
    setConsignorState(record.consignorState);
    setConsignorPincode(record.consignorPincode);
    setConsignorMobile(record.consignorMobile);
    setConsignorEmail(record.consignorEmail);
    setConsignorGst(record.consignorGst);
    setConsigneeName(record.consigneeName);
    setConsigneeCode(record.consigneeCode);
    setConsigneeAddress(record.consigneeAddress);
    setConsigneeCity(record.consigneeCity);
    setConsigneeState(record.consigneeState);
    setConsigneePincode(record.consigneePincode);
    setConsigneeMobile(record.consigneeMobile);
    setConsigneeEmail(record.consigneeEmail);
    setConsigneeGst(record.consigneeGst);
    setDeliveryType(record.deliveryType);
    setMkExecutive(record.mkExecutive);
    setToPay(record.toPay);
    setGst(record.gst);
    setSurface(record.surface);
    setPartLoad(record.partLoad);
    setFreightOn(record.freightOn);
    setChargeWeight(record.chargeWeight);
    setManualRates(record.manualRates);
    setBasicFreight(record.basicFreight);
    setLoadingCharges(record.loadingCharges);
    setUnloadingCharges(record.unloadingCharges);
    setDoorDeliveryCharges(record.doorDeliveryCharges);
    setOtherCharges(record.otherCharges);
    setTotalFreight(record.totalFreight);
    setRemarks(record.remarks);
    setRoRemarks(record.roRemarks);
    setGpRemarks(record.gpRemarks);
    setInsuranceCoveredBy(record.insuranceCoveredBy);
    setInsuranceNo(record.insuranceNo);
    setInsuranceDate(record.insuranceDate);
    setInsuranceCompany(record.insuranceCompany);
    setInsuranceAmount(record.insuranceAmount);
    setInvoices(record.invoices);
    setIsEntrySheetOpen(true);
    setActiveFormTab("basic");
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to permanently delete this record?")) {
      const updatedRecords = savedRecords.filter((record) => record.id !== id);
      setSavedRecords(updatedRecords);
      filterActiveRecords();
      filterCancelledRecords();
      alert("Record deleted successfully!");
    }
  };

  const openAddSheet = () => {
    resetForm();
    setEditMode(false);
    setCurrentEditId(null);
    setGrNo(generateGrNo());
    setIsEntrySheetOpen(true);
  };

  const openCancelDialog = (record: BookingRecord) => {
    setCancellingBooking(record);
    setCancelledReason("");
    setIsCancelledDialogOpen(true);
  };

  // Stats
  const activeStats = {
    total: searchResults.length,
    totalFreight: searchResults.reduce((sum, r) => sum + r.totalFreight, 0),
  };

  const cancelledStats = {
    total: cancelledSearchResults.length,
    totalFreight: cancelledSearchResults.reduce((sum, r) => sum + r.totalFreight, 0),
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
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">BOOKING COMPUTERIZE GRL</h1>
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
            New Booking
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
          Active Bookings
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
          Cancelled Bookings
        </button>
      </div>

      {/* Active Bookings Tab */}
      {mainTab === "active" && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Total Active Bookings</p>
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
                    <p className="text-sm opacity-90">Total Freight Amount</p>
                    <p className="text-2xl font-bold">₹{activeStats.totalFreight.toLocaleString()}</p>
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
                Search Active Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
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
                  <Label className="text-[10px] font-medium">GR Number</Label>
                  <Input value={searchGrNo} onChange={(e) => setSearchGrNo(e.target.value)} placeholder="Enter GR Number" className="h-8 text-xs" />
                </div>
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

          {/* Report View Table - Active */}
          {viewMode === "report" && searchResults.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Table className="h-3.5 w-3.5 text-gray-500" />
                    <h3 className="text-[11px] font-semibold text-gray-800">Active Bookings List</h3>
                  </div>
                  <div className="text-[10px] text-gray-500">Total: {searchResults.length} records</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto">
                  <div className="min-w-[1100px]">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="text-[11px] font-semibold py-2 px-2 w-12 text-center">#</TableHead>
                          <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">GR #</TableHead>
                          <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">GR Date</TableHead>
                          <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Origin</TableHead>
                          <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Destination</TableHead>
                          <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[120px]">Consignor</TableHead>
                          <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[120px]">Consignee</TableHead>
                          <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px] text-right">Freight (₹)</TableHead>
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
                                {record.grNo}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-2 px-2 text-xs">{format(record.grDate, "dd-MM-yyyy")}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{record.bookingFrom || "-"}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{record.destination || "-"}</TableCell>
                            <TableCell className="py-2 px-2 text-xs truncate max-w-[150px]">{record.consignorName}</TableCell>
                            <TableCell className="py-2 px-2 text-xs truncate max-w-[150px]">{record.consigneeName}</TableCell>
                            <TableCell className="py-2 px-2 text-right text-xs">₹{record.totalFreight.toLocaleString()}</TableCell>
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
                                  title="Cancel Booking"
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

          {/* Grid View - Active */}
          {viewMode === "grid" && searchResults.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((record) => (
                <Card key={record.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-500" />
                          <h3 className="font-semibold text-sm">{record.grNo}</h3>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1">{format(record.grDate, "dd-MM-yyyy")}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700 text-[10px]">Active</Badge>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span>{record.bookingFrom} → {record.destination}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="h-3 w-3 text-gray-400" />
                        <span className="truncate">Cnr: {record.consignorName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3 text-gray-400" />
                        <span className="truncate">Cnee: {record.consigneeName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-3 w-3 text-gray-400" />
                        <span>Freight: ₹{record.totalFreight.toLocaleString()}</span>
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
                <p className="text-gray-500 text-sm">No active booking records found</p>
                <p className="text-xs text-gray-400 mt-1">Click "New Booking" to create one</p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Cancelled Bookings Tab */}
      {mainTab === "cancelled" && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Total Cancelled Bookings</p>
                    <p className="text-2xl font-bold">{cancelledStats.total}</p>
                  </div>
                  <X className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Total Freight Lost</p>
                    <p className="text-2xl font-bold">₹{cancelledStats.totalFreight.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search Filters for Cancelled */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-[11px] font-semibold flex items-center gap-2 text-gray-700">
                <Search className="h-3.5 w-3.5" />
                Search Cancelled Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
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
                  <Label className="text-[10px] font-medium">GR Number</Label>
                  <Input value={searchGrNo} onChange={(e) => setSearchGrNo(e.target.value)} placeholder="Enter GR Number" className="h-8 text-xs" />
                </div>
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

          {/* Report View Table - Cancelled */}
          {viewMode === "report" && cancelledSearchResults.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Table className="h-3.5 w-3.5 text-gray-500" />
                    <h3 className="text-[11px] font-semibold text-gray-800">Cancelled Bookings List</h3>
                  </div>
                  <div className="text-[10px] text-gray-500">Total: {cancelledSearchResults.length} records</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto">
                  <div className="min-w-[1200px]">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="text-[11px] font-semibold py-2 px-2 w-12 text-center">#</TableHead>
                          <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">GR #</TableHead>
                          <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">GR Date</TableHead>
                          <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Origin</TableHead>
                          <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Destination</TableHead>
                          <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[120px]">Consignor</TableHead>
                          <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[120px]">Consignee</TableHead>
                          <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px] text-right">Freight (₹)</TableHead>
                          <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Cancelled Date</TableHead>
                          <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[120px]">Cancelled Reason</TableHead>
                          <TableHead className="text-[11px] font-semibold py-2 px-2 w-32 text-center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedCancelledResults.map((record, idx) => (
                          <TableRow key={record.id} className="hover:bg-gray-50 bg-red-50/30">
                            <TableCell className="py-2 px-2 text-center text-xs">
                              {(cancelledCurrentPage - 1) * itemsPerPage + idx + 1}
                            </TableCell>
                            <TableCell className="py-2 px-2 font-mono font-semibold text-xs">
                              <Badge variant="outline" className="bg-red-50 text-red-700 text-[11px]">
                                {record.grNo}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-2 px-2 text-xs">{format(record.grDate, "dd-MM-yyyy")}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{record.bookingFrom || "-"}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{record.destination || "-"}</TableCell>
                            <TableCell className="py-2 px-2 text-xs truncate max-w-[150px]">{record.consignorName}</TableCell>
                            <TableCell className="py-2 px-2 text-xs truncate max-w-[150px]">{record.consigneeName}</TableCell>
                            <TableCell className="py-2 px-2 text-right text-xs">₹{record.totalFreight.toLocaleString()}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{record.cancelledDate ? format(record.cancelledDate, "dd-MM-yyyy") : "-"}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{record.cancelledReason || "-"}</TableCell>
                            <TableCell className="py-2 px-2 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRestoreBooking(record)}
                                  className="h-7 w-7 p-0 text-green-500 hover:text-green-700 hover:bg-green-50"
                                  title="Restore Booking"
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
                        ))}
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
          )}

          {/* Grid View - Cancelled */}
          {viewMode === "grid" && cancelledSearchResults.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cancelledSearchResults.map((record) => (
                <Card key={record.id} className="hover:shadow-md transition-shadow border-red-200 bg-red-50/30">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <X className="h-4 w-4 text-red-500" />
                          <h3 className="font-semibold text-sm">{record.grNo}</h3>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1">{format(record.grDate, "dd-MM-yyyy")}</p>
                      </div>
                      <Badge className="bg-red-100 text-red-700 text-[10px]">Cancelled</Badge>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span>{record.bookingFrom} → {record.destination}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="h-3 w-3 text-gray-400" />
                        <span className="truncate">Cnr: {record.consignorName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3 text-gray-400" />
                        <span className="truncate">Cnee: {record.consigneeName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-3 w-3 text-gray-400" />
                        <span>Freight: ₹{record.totalFreight.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-3 w-3 text-red-400" />
                        <span>Reason: {record.cancelledReason}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleRestoreBooking(record)} className="h-7 w-7 p-0 text-green-500" title="Restore">
                        <RefreshCw className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* No Data Message for Cancelled */}
          {cancelledSearchResults.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <X className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p className="text-gray-500 text-sm">No cancelled booking records found</p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Cancel Booking Dialog */}
      <Dialog open={isCancelledDialogOpen} onOpenChange={setIsCancelledDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <X className="h-5 w-5" />
              Cancel Booking
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel booking <strong>{cancellingBooking?.grNo}</strong>?
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
                Note: Cancelled bookings will be moved to Cancelled List and can be restored later.
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsCancelledDialogOpen(false)}>
              No, Keep Booking
            </Button>
            <Button variant="destructive" onClick={handleCancelBooking}>
              Yes, Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Entry Sheet (Same as before) */}
      <Sheet open={isEntrySheetOpen} onOpenChange={setIsEntrySheetOpen}>
        <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle className="flex items-center gap-2 text-base">
              {editMode ? (
                <>
                  <Edit className="h-4 w-4 text-blue-600" />
                  Edit Booking
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 text-blue-600" />
                  New Booking
                </>
              )}
            </SheetTitle>
          </SheetHeader>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 justify-end mb-4">
            <Button variant="outline" size="sm" className="h-7 text-xs">
              <PlusCircle className="mr-1 h-3 w-3" /> Add More...
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              <TrendingUp className="mr-1 h-3 w-3" /> Free Freight On
            </Button>
            <Button 
              onClick={calculateTotalFreight} 
              variant="default" 
              size="sm" 
              className="h-7 text-xs bg-green-600 hover:bg-green-700"
            >
              <Calculator className="mr-1 h-3 w-3" /> Calculate Freight
            </Button>
          </div>

          {/* Basic Information */}
          <div className="border rounded-md p-3 mb-4">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" /> Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">GR #</Label>
                <Input value={grNo} readOnly className="h-8 text-xs bg-gray-50" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">GR Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-8 w-full justify-start text-left text-xs">
                      <CalendarIcon className="mr-2 h-3 w-3" />
                      {format(grDate, "dd-MM-yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={grDate} onSelect={(date) => date && setGrDate(date)} />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Booking From</Label>
                <Input value={bookingFrom} onChange={(e) => setBookingFrom(e.target.value)} className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Destination</Label>
                <Input value={destination} onChange={(e) => setDestination(e.target.value)} className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Delivery Point</Label>
                <Input value={deliveryPoint} onChange={(e) => setDeliveryPoint(e.target.value)} className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Collection At</Label>
                <Input value={collectionAt} onChange={(e) => setCollectionAt(e.target.value)} className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Delivery Type</Label>
                <Select value={deliveryType} onValueChange={setDeliveryType}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                  <SelectContent>{deliveryTypeOptions.map((opt) => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">MKT. Executive</Label>
                <Select value={mkExecutive} onValueChange={setMkExecutive}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                  <SelectContent>{executiveOptions.map((opt) => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Load Type</Label>
                <Select value={loadType} onValueChange={setLoadType}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                  <SelectContent>{loadTypeOptions.map((opt) => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Form Tabs */}
          <Tabs value={activeFormTab} onValueChange={setActiveFormTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-gray-100">
              <TabsTrigger value="basic" className="text-xs py-1.5">
                <Settings className="h-3 w-3 mr-1" /> Basic
              </TabsTrigger>
              <TabsTrigger value="consignor" className="text-xs py-1.5">
                <Building className="h-3 w-3 mr-1" /> Consignor
              </TabsTrigger>
              <TabsTrigger value="consignee" className="text-xs py-1.5">
                <Users className="h-3 w-3 mr-1" /> Consignee
              </TabsTrigger>
              <TabsTrigger value="freight" className="text-xs py-1.5">
                <DollarSign className="h-3 w-3 mr-1" /> Freight
              </TabsTrigger>
              <TabsTrigger value="other" className="text-xs py-1.5">
                <Settings className="h-3 w-3 mr-1" /> Other
              </TabsTrigger>
            </TabsList>

            {/* Basic Tab */}
            <TabsContent value="basic" className="mt-3 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Freight On</Label>
                  <Select value={freightOn} onValueChange={setFreightOn}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                    <SelectContent>{freightOnOptions.map((opt) => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Charge Weight (kg)</Label>
                  <Input type="number" value={chargeWeight} onChange={(e) => setChargeWeight(Number(e.target.value))} className="h-8 text-xs" />
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={toPay} onChange={(e) => setToPay(e.target.checked)} className="h-3.5 w-3.5" />
                  <span className="text-xs">TO PAY</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={gst} onChange={(e) => setGst(e.target.checked)} className="h-3.5 w-3.5" />
                  <span className="text-xs">GST</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={surface} onChange={(e) => setSurface(e.target.checked)} className="h-3.5 w-3.5" />
                  <span className="text-xs">SURFACE</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={partLoad} onChange={(e) => setPartLoad(e.target.checked)} className="h-3.5 w-3.5" />
                  <span className="text-xs">PART LOAD</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={manualRates} onChange={(e) => setManualRates(e.target.checked)} className="h-3.5 w-3.5" />
                  <span className="text-xs">Manual Rates</span>
                </label>
              </div>
            </TabsContent>

            {/* Consignor Tab */}
            <TabsContent value="consignor" className="mt-3">
              <div className="border rounded-md">
                <div className="bg-gray-50 px-3 py-2 border-b">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Building className="h-4 w-4" /> CONSIGNOR DETAILS
                  </h3>
                </div>
                <div className="p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div><Label className="text-xs">Dealer Code</Label><Input value={consignorCode} onChange={(e) => setConsignorCode(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Name *</Label><Input value={consignorName} onChange={(e) => setConsignorName(e.target.value)} className="h-8 text-xs" /></div>
                  <div className="sm:col-span-2"><Label className="text-xs">Address</Label><Input value={consignorAddress} onChange={(e) => setConsignorAddress(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">City</Label><Input value={consignorCity} onChange={(e) => setConsignorCity(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">State</Label><Input value={consignorState} onChange={(e) => setConsignorState(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Pincode</Label><Input value={consignorPincode} onChange={(e) => setConsignorPincode(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Mobile No.</Label><Input value={consignorMobile} onChange={(e) => setConsignorMobile(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Email ID</Label><Input value={consignorEmail} onChange={(e) => setConsignorEmail(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">GST</Label><Input value={consignorGst} onChange={(e) => setConsignorGst(e.target.value)} className="h-8 text-xs uppercase" /></div>
                </div>
              </div>
            </TabsContent>

            {/* Consignee Tab */}
            <TabsContent value="consignee" className="mt-3">
              <div className="border rounded-md">
                <div className="bg-gray-50 px-3 py-2 border-b">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4" /> CONSIGNEE DETAILS
                  </h3>
                </div>
                <div className="p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div><Label className="text-xs">Dealer Code</Label><Input value={consigneeCode} onChange={(e) => setConsigneeCode(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Name *</Label><Input value={consigneeName} onChange={(e) => setConsigneeName(e.target.value)} className="h-8 text-xs" /></div>
                  <div className="sm:col-span-2"><Label className="text-xs">Address</Label><Input value={consigneeAddress} onChange={(e) => setConsigneeAddress(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">City</Label><Input value={consigneeCity} onChange={(e) => setConsigneeCity(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">State</Label><Input value={consigneeState} onChange={(e) => setConsigneeState(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Pincode</Label><Input value={consigneePincode} onChange={(e) => setConsigneePincode(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Mobile No.</Label><Input value={consigneeMobile} onChange={(e) => setConsigneeMobile(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Email ID</Label><Input value={consigneeEmail} onChange={(e) => setConsigneeEmail(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">GST</Label><Input value={consigneeGst} onChange={(e) => setConsigneeGst(e.target.value)} className="h-8 text-xs uppercase" /></div>
                </div>
              </div>
            </TabsContent>

            {/* Freight Tab */}
            <TabsContent value="freight" className="mt-3">
              <div className="border rounded-md">
                <div className="bg-gray-50 px-3 py-2 border-b">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <DollarSign className="h-4 w-4" /> FREIGHT DETAILS
                  </h3>
                </div>
                <div className="p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div><Label className="text-xs">Basic Freight (₹)</Label><Input type="number" value={basicFreight} onChange={(e) => setBasicFreight(Number(e.target.value))} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Loading Charges (₹)</Label><Input type="number" value={loadingCharges} onChange={(e) => setLoadingCharges(Number(e.target.value))} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Unloading Charges (₹)</Label><Input type="number" value={unloadingCharges} onChange={(e) => setUnloadingCharges(Number(e.target.value))} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Door Delivery Charges (₹)</Label><Input type="number" value={doorDeliveryCharges} onChange={(e) => setDoorDeliveryCharges(Number(e.target.value))} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Other Charges (₹)</Label><Input type="number" value={otherCharges} onChange={(e) => setOtherCharges(Number(e.target.value))} className="h-8 text-xs" /></div>
                  <div className="bg-blue-50 p-2 rounded-md">
                    <Label className="text-xs font-semibold">Total Freight (₹)</Label>
                    <p className="text-lg font-bold text-blue-600">{totalFreight.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Other Tab */}
            <TabsContent value="other" className="mt-3 space-y-3">
              <div className="border rounded-md">
                <div className="bg-gray-50 px-3 py-2 border-b">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" /> REMARKS
                  </h3>
                </div>
                <div className="p-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1"><Label className="text-xs">Remarks</Label><Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={2} className="text-xs" /></div>
                  <div className="space-y-1"><Label className="text-xs">RO Remarks</Label><Textarea value={roRemarks} onChange={(e) => setRoRemarks(e.target.value)} rows={2} className="text-xs" /></div>
                  <div className="space-y-1"><Label className="text-xs">GP Remarks</Label><Textarea value={gpRemarks} onChange={(e) => setGpRemarks(e.target.value)} rows={2} className="text-xs" /></div>
                </div>
              </div>

              <div className="border rounded-md">
                <div className="bg-gray-50 px-3 py-2 border-b">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Shield className="h-4 w-4" /> INSURANCE DETAILS
                  </h3>
                </div>
                <div className="p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div><Label className="text-xs">Insurance Covered By</Label><Select value={insuranceCoveredBy} onValueChange={setInsuranceCoveredBy}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{insuranceCoveredByOptions.map((opt) => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent></Select></div>
                  <div><Label className="text-xs">Insurance #</Label><Input value={insuranceNo} onChange={(e) => setInsuranceNo(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Insurance Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-2 h-3 w-3" />{format(insuranceDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={insuranceDate} onSelect={(date) => date && setInsuranceDate(date)} /></PopoverContent></Popover></div>
                  <div><Label className="text-xs">Insurance Company</Label><Input value={insuranceCompany} onChange={(e) => setInsuranceCompany(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Insurance Amount (₹)</Label><Input type="number" value={insuranceAmount} onChange={(e) => setInsuranceAmount(Number(e.target.value))} className="h-8 text-xs" /></div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Invoices Table */}
          <div className="rounded-md border mt-4">
            <div className="bg-gray-50 px-3 py-2 border-b flex justify-between items-center">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" /> Invoices
              </h3>
              <Button onClick={addInvoiceRow} variant="ghost" size="sm" className="h-7 text-xs">
                <Plus className="mr-1 h-3 w-3" /> ADD INVOICE
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Value (₹)</TableHead>
                    <TableHead>Away Bill #</TableHead>
                    <TableHead>Away Date</TableHead>
                    <TableHead>Value Up to</TableHead>
                    <TableHead className="w-12">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv, idx) => (
                    <TableRow key={inv.id}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell><Input value={inv.invoiceNo} onChange={(e) => updateInvoice(inv.id, "invoiceNo", e.target.value)} className="h-7 w-28 text-xs" /></TableCell>
                      <TableCell><Popover><PopoverTrigger asChild><Button variant="outline" className="h-7 w-28 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(inv.date, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={inv.date} onSelect={(date) => date && updateInvoice(inv.id, "date", date)} /></PopoverContent></Popover></TableCell>
                      <TableCell><Input value={inv.value} onChange={(e) => updateInvoice(inv.id, "value", e.target.value)} className="h-7 w-24 text-xs" /></TableCell>
                      <TableCell><Input value={inv.awayBillNo} onChange={(e) => updateInvoice(inv.id, "awayBillNo", e.target.value)} className="h-7 w-28 text-xs" /></TableCell>
                      <TableCell><Popover><PopoverTrigger asChild><Button variant="outline" className="h-7 w-28 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(inv.awayBillDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={inv.awayBillDate} onSelect={(date) => date && updateInvoice(inv.id, "awayBillDate", date)} /></PopoverContent></Popover></TableCell>
                      <TableCell><Input value={inv.valueUpTo} onChange={(e) => updateInvoice(inv.id, "valueUpTo", e.target.value)} className="h-7 w-24 text-xs" /></TableCell>
                      <TableCell><Button variant="ghost" size="sm" onClick={() => removeInvoice(inv.id)} className="h-6 w-6 p-0 text-red-500"><Trash2 className="h-3 w-3" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t mt-4">
            <Button variant="outline" onClick={() => setIsEntrySheetOpen(false)} className="h-8 text-xs">
              <X className="mr-1 h-3 w-3" /> Cancel
            </Button>
            <Button onClick={handleSave} size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700" disabled={loading}>
              <Save className="mr-1 h-3 w-3" />
              {editMode ? "Update" : "Save"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}