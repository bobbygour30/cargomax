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
  FileText,
  X,
  MapPin,
  Building,
  DollarSign,
  Users,
  Plus,
  Edit,
  Grid3x3,
  MessageSquare,
  Calculator,
  Shield,
  Settings,
  TrendingUp,
  Pencil,
  PlusCircle,
  Trash2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Types
interface PackageItem {
  id: number;
  noOfPackages: number;
  content: string;
  packing: string;
  actualWeight: number;
  chargeWeight: number;
}

interface InvoiceItem {
  id: number;
  invoiceNo: string;
  date: Date;
  value: number;
  ewayBillNo: string;
  ewayBillDate: Date;
  validUpto: Date;
  isNcv: boolean;
}

interface BookingRecord {
  id: number;
  grNo: string;
  grDate: Date;
  bookingFrom: string;
  destination: string;
  pickupFrom: string;
  deliveryPoint: string;
  bookingType: string;
  collectionAt: string;
  consignorName: string;
  consignorGst: string;
  consignorDealerCode: string;
  consignorAddress: string;
  consignorCity: string;
  consignorState: string;
  consignorMobile: string;
  consignorEmail: string;
  consignorIecCode: string;
  consignorBankAdNo: string;
  consigneeName: string;
  consigneeGst: string;
  consigneeDealerCode: string;
  consigneeAddress: string;
  consigneeCity: string;
  consigneeState: string;
  consigneeMobile: string;
  consigneeEmail: string;
  consigneeIecCode: string;
  consigneeEximCode: string;
  pvtMarkaSealNo: string;
  serviceProduct: string;
  deliveryType: string;
  loadType: string;
  mkExecutive: string;
  freightOn: string;
  manualRates: boolean;
  totalPackages: number;
  totalActualWeight: number;
  totalChargeWeight: number;
  totalFreight: number;
  remarks: string;
  roRemarks: string;
  gpRemarks: string;
  insuranceCoveredBy: string;
  insuranceNo: string;
  insuranceDate: Date;
  insuranceCompany: string;
  billNo: string;
  supplementaryBillNo: string;
  ccAttached: boolean;
  printAfterSave: boolean;
  packages: PackageItem[];
  invoices: InvoiceItem[];
  status: "active" | "cancelled";
  cancelledDate?: Date;
  cancelledReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Options
const bookingTypeOptions = [
  { value: "topay", label: "TOPAY" },
  { value: "prepaid", label: "PREPAID" },
  { value: "tobill", label: "TO BILL" },
];

const serviceProductOptions = [
  { value: "surface", label: "SURFACE" },
  { value: "express", label: "EXPRESS" },
  { value: "air", label: "AIR" },
];

const deliveryTypeOptions = [
  { value: "godown", label: "GODOWN" },
  { value: "door_delivery", label: "DOOR DELIVERY" },
  { value: "pickup", label: "PICKUP" },
];

const loadTypeOptions = [
  { value: "part_load", label: "PART LOAD" },
  { value: "full_load", label: "FULL LOAD" },
  { value: "container", label: "CONTAINER" },
];

const freightOnOptions = [
  { value: "charge_weight", label: "CHARGE WEIGHT" },
  { value: "actual_weight", label: "ACTUAL WEIGHT" },
  { value: "per_package", label: "PER PACKAGE" },
];

const insuranceCoveredByOptions = [
  { value: "self", label: "Self" },
  { value: "customer", label: "Customer" },
  { value: "third_party", label: "Third Party" },
];

const packingOptions = ["BOX", "BAG", "PALLET", "DRUM", "LOOSE", "ROLL", "CARTON", "STRAPPED"];

const executiveOptions = [
  "Rajesh Kumar", "Suresh Singh", "Amit Sharma", "Priya Verma", 
  "Vikash Gupta", "Neha Singh", "Rahul Mehta", "Pooja Yadav"
];

const branchOptions = [
  "DELHI", "MUMBAI", "BANGALORE", "CHENNAI", "KOLKATA", 
  "AHMEDABAD", "PUNE", "HYDERABAD", "LUCKNOW", "JAIPUR"
];

const cancelledReasonOptions = [
  "Customer Request", "Payment Issue", "Wrong Booking", "Duplicate Booking",
  "Vehicle Unavailable", "Route Not Available", "Other"
];

export default function BookingComputerizeGRL() {
  const [mainTab, setMainTab] = useState<"active" | "cancelled">("active");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<number | null>(null);
  // IMPORTANT: Default tab set to "consignor"
  const [activeFormTab, setActiveFormTab] = useState<string>("consignor");
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "report">("report");
  const [isCancelledDialogOpen, setIsCancelledDialogOpen] = useState(false);
  const [cancellingBooking, setCancellingBooking] = useState<BookingRecord | null>(null);
  const [cancelledReason, setCancelledReason] = useState<string>("");

  // Basic Info State
  const [grNo, setGrNo] = useState<string>("");
  const [grDate, setGrDate] = useState<Date>(new Date());
  const [bookingFrom, setBookingFrom] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [pickupFrom, setPickupFrom] = useState<string>("");
  const [deliveryPoint, setDeliveryPoint] = useState<string>("");
  const [bookingType, setBookingType] = useState<string>("topay");
  const [collectionAt, setCollectionAt] = useState<string>("");
  const [serviceProduct, setServiceProduct] = useState<string>("surface");
  const [deliveryType, setDeliveryType] = useState<string>("godown");
  const [loadType, setLoadType] = useState<string>("part_load");
  const [mkExecutive, setMkExecutive] = useState<string>("");
  const [freightOn, setFreightOn] = useState<string>("charge_weight");
  const [manualRates, setManualRates] = useState<boolean>(false);
  const [pvtMarkaSealNo, setPvtMarkaSealNo] = useState<string>("");
  const [ccAttached, setCcAttached] = useState<boolean>(false);
  const [printAfterSave, setPrintAfterSave] = useState<boolean>(false);

  // Consignor State
  const [consignorName, setConsignorName] = useState<string>("");
  const [consignorGst, setConsignorGst] = useState<string>("");
  const [consignorDealerCode, setConsignorDealerCode] = useState<string>("");
  const [consignorAddress, setConsignorAddress] = useState<string>("");
  const [consignorCity, setConsignorCity] = useState<string>("");
  const [consignorState, setConsignorState] = useState<string>("");
  const [consignorMobile, setConsignorMobile] = useState<string>("");
  const [consignorEmail, setConsignorEmail] = useState<string>("");
  const [consignorIecCode, setConsignorIecCode] = useState<string>("");
  const [consignorBankAdNo, setConsignorBankAdNo] = useState<string>("");

  // Consignee State
  const [consigneeName, setConsigneeName] = useState<string>("");
  const [consigneeGst, setConsigneeGst] = useState<string>("");
  const [consigneeDealerCode, setConsigneeDealerCode] = useState<string>("");
  const [consigneeAddress, setConsigneeAddress] = useState<string>("");
  const [consigneeCity, setConsigneeCity] = useState<string>("");
  const [consigneeState, setConsigneeState] = useState<string>("");
  const [consigneeMobile, setConsigneeMobile] = useState<string>("");
  const [consigneeEmail, setConsigneeEmail] = useState<string>("");
  const [consigneeIecCode, setConsigneeIecCode] = useState<string>("");
  const [consigneeEximCode, setConsigneeEximCode] = useState<string>("");

  // Packages State
  const [packages, setPackages] = useState<PackageItem[]>([
    { id: 1, noOfPackages: 0, content: "", packing: "BOX", actualWeight: 0, chargeWeight: 0 },
  ]);

  // Invoices State
  const [invoices, setInvoices] = useState<InvoiceItem[]>([
    { id: 1, invoiceNo: "", date: new Date(), value: 0, ewayBillNo: "", ewayBillDate: new Date(), validUpto: new Date(), isNcv: false },
  ]);

  // Remarks State
  const [remarks, setRemarks] = useState<string>("");
  const [roRemarks, setRoRemarks] = useState<string>("");
  const [gpRemarks, setGpRemarks] = useState<string>("");

  // Insurance State
  const [insuranceCoveredBy, setInsuranceCoveredBy] = useState<string>("");
  const [insuranceNo, setInsuranceNo] = useState<string>("");
  const [insuranceDate, setInsuranceDate] = useState<Date>(new Date());
  const [insuranceCompany, setInsuranceCompany] = useState<string>("");
  const [billNo, setBillNo] = useState<string>("");
  const [supplementaryBillNo, setSupplementaryBillNo] = useState<string>("");

  // Totals
  const [totalPackages, setTotalPackages] = useState<number>(0);
  const [totalActualWeight, setTotalActualWeight] = useState<number>(0);
  const [totalChargeWeight, setTotalChargeWeight] = useState<number>(0);
  const [totalFreight, setTotalFreight] = useState<number>(0);

  // Search State
  const [searchFromDate, setSearchFromDate] = useState<Date>(new Date());
  const [searchToDate, setSearchToDate] = useState<Date>(new Date());
  const [searchGrNo, setSearchGrNo] = useState<string>("");
  const [searchBranch, setSearchBranch] = useState<string>("all");
  const [searchResults, setSearchResults] = useState<BookingRecord[]>([]);
  const [cancelledSearchResults, setCancelledSearchResults] = useState<BookingRecord[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [cancelledCurrentPage, setCancelledCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Sample Data
  const [savedRecords, setSavedRecords] = useState<BookingRecord[]>([
    {
      id: 1, grNo: "GR000001", grDate: new Date(), bookingFrom: "DELHI", destination: "MUMBAI",
      pickupFrom: "Delhi Transport Nagar", deliveryPoint: "Andheri West", bookingType: "topay",
      collectionAt: "Delhi Hub", consignorName: "ABC Traders", consignorGst: "07ABCDE1234F1Z5",
      consignorDealerCode: "D001", consignorAddress: "123, Transport Nagar", consignorCity: "Delhi",
      consignorState: "Delhi", consignorMobile: "9876543210", consignorEmail: "abc@traders.com",
      consignorIecCode: "IEC001", consignorBankAdNo: "BANK001", consigneeName: "XYZ Enterprises",
      consigneeGst: "27FGHIJ5678K1Z6", consigneeDealerCode: "D002", consigneeAddress: "456, MIDC Area",
      consigneeCity: "Mumbai", consigneeState: "Maharashtra", consigneeMobile: "9876543220",
      consigneeEmail: "xyz@enterprises.com", consigneeIecCode: "IEC002", consigneeEximCode: "EXIM001",
      pvtMarkaSealNo: "MARKA001", serviceProduct: "surface", deliveryType: "godown", loadType: "part_load",
      mkExecutive: "Rajesh Kumar", freightOn: "charge_weight", manualRates: false,
      totalPackages: 5, totalActualWeight: 500, totalChargeWeight: 550, totalFreight: 15000,
      remarks: "Handle with care", roRemarks: "", gpRemarks: "", insuranceCoveredBy: "self",
      insuranceNo: "INS001", insuranceDate: new Date(), insuranceCompany: "New India",
      billNo: "BILL001", supplementaryBillNo: "SUPP001", ccAttached: false, printAfterSave: false,
      packages: [{ id: 1, noOfPackages: 5, content: "GENERAL CARGO", packing: "BOX", actualWeight: 500, chargeWeight: 550 }],
      invoices: [{ id: 1, invoiceNo: "INV001", date: new Date(), value: 50000, ewayBillNo: "EWB001", ewayBillDate: new Date(), validUpto: new Date(), isNcv: false }],
      status: "active", createdAt: new Date(), updatedAt: new Date()
    },
  ]);

  useEffect(() => {
    filterActiveRecords();
    filterCancelledRecords();
    if (!grNo) setGrNo(generateGrNo());
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [packages]);

  const calculateTotals = () => {
    const pkgCount = packages.reduce((sum, pkg) => sum + (pkg.noOfPackages || 0), 0);
    const actualWt = packages.reduce((sum, pkg) => sum + (pkg.actualWeight || 0), 0);
    const chargeWt = packages.reduce((sum, pkg) => sum + (pkg.chargeWeight || 0), 0);
    setTotalPackages(pkgCount);
    setTotalActualWeight(actualWt);
    setTotalChargeWeight(chargeWt);
  };

  const generateGrNo = (): string => {
    const count = savedRecords.filter(r => r.status === "active").length + 1;
    return `GR${String(count).padStart(6, "0")}`;
  };

  const addPackageRow = () => {
    setPackages([...packages, { id: Date.now(), noOfPackages: 0, content: "", packing: "BOX", actualWeight: 0, chargeWeight: 0 }]);
  };

  const updatePackage = (id: number, field: keyof PackageItem, value: any) => {
    setPackages(packages.map(pkg => pkg.id === id ? { ...pkg, [field]: value } : pkg));
  };

  const removePackage = (id: number) => {
    if (packages.length > 1) setPackages(packages.filter(pkg => pkg.id !== id));
  };

  const addInvoiceRow = () => {
    setInvoices([...invoices, { id: Date.now(), invoiceNo: "", date: new Date(), value: 0, ewayBillNo: "", ewayBillDate: new Date(), validUpto: new Date(), isNcv: false }]);
  };

  const updateInvoice = (id: number, field: keyof InvoiceItem, value: any) => {
    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, [field]: value } : inv));
  };

  const removeInvoice = (id: number) => {
    if (invoices.length > 1) setInvoices(invoices.filter(inv => inv.id !== id));
  };

  const filterActiveRecords = () => setSearchResults(savedRecords.filter(r => r.status === "active"));
  const filterCancelledRecords = () => setCancelledSearchResults(savedRecords.filter(r => r.status === "cancelled"));

  const calculateTotalFreight = () => {
    const calculatedFreight = totalChargeWeight * 30;
    setTotalFreight(calculatedFreight);
  };

  const resetForm = () => {
    setGrNo(generateGrNo());
    setGrDate(new Date());
    setBookingFrom("");
    setDestination("");
    setPickupFrom("");
    setDeliveryPoint("");
    setBookingType("topay");
    setCollectionAt("");
    setServiceProduct("surface");
    setDeliveryType("godown");
    setLoadType("part_load");
    setMkExecutive("");
    setFreightOn("charge_weight");
    setManualRates(false);
    setPvtMarkaSealNo("");
    setCcAttached(false);
    setPrintAfterSave(false);
    setConsignorName("");
    setConsignorGst("");
    setConsignorDealerCode("");
    setConsignorAddress("");
    setConsignorCity("");
    setConsignorState("");
    setConsignorMobile("");
    setConsignorEmail("");
    setConsignorIecCode("");
    setConsignorBankAdNo("");
    setConsigneeName("");
    setConsigneeGst("");
    setConsigneeDealerCode("");
    setConsigneeAddress("");
    setConsigneeCity("");
    setConsigneeState("");
    setConsigneeMobile("");
    setConsigneeEmail("");
    setConsigneeIecCode("");
    setConsigneeEximCode("");
    setPackages([{ id: 1, noOfPackages: 0, content: "", packing: "BOX", actualWeight: 0, chargeWeight: 0 }]);
    setInvoices([{ id: 1, invoiceNo: "", date: new Date(), value: 0, ewayBillNo: "", ewayBillDate: new Date(), validUpto: new Date(), isNcv: false }]);
    setRemarks("");
    setRoRemarks("");
    setGpRemarks("");
    setInsuranceCoveredBy("");
    setInsuranceNo("");
    setInsuranceDate(new Date());
    setInsuranceCompany("");
    setBillNo("");
    setSupplementaryBillNo("");
    setTotalFreight(0);
    setEditMode(false);
    setCurrentEditId(null);
    // Reset tab to consignor when opening new form
    setActiveFormTab("consignor");
  };

  const handleSave = () => {
    if (!consignorName) { alert("Please enter Consignor Name"); return; }
    if (!consigneeName) { alert("Please enter Consignee Name"); return; }
    
    setLoading(true);
    setTimeout(() => {
      const newRecord: BookingRecord = {
        id: currentEditId || Date.now(), grNo, grDate, bookingFrom, destination, pickupFrom, deliveryPoint,
        bookingType, collectionAt, consignorName, consignorGst, consignorDealerCode, consignorAddress, consignorCity,
        consignorState, consignorMobile, consignorEmail, consignorIecCode, consignorBankAdNo, consigneeName,
        consigneeGst, consigneeDealerCode, consigneeAddress, consigneeCity, consigneeState, consigneeMobile,
        consigneeEmail, consigneeIecCode, consigneeEximCode, pvtMarkaSealNo, serviceProduct, deliveryType, loadType,
        mkExecutive, freightOn, manualRates, totalPackages, totalActualWeight, totalChargeWeight, totalFreight,
        remarks, roRemarks, gpRemarks, insuranceCoveredBy, insuranceNo, insuranceDate, insuranceCompany,
        billNo, supplementaryBillNo, ccAttached, printAfterSave, packages, invoices, status: "active",
        createdAt: editMode && currentEditId ? savedRecords.find(r => r.id === currentEditId)?.createdAt || new Date() : new Date(),
        updatedAt: new Date()
      };
      const updatedRecords = editMode && currentEditId ? savedRecords.map(r => r.id === currentEditId ? newRecord : r) : [...savedRecords, newRecord];
      setSavedRecords(updatedRecords);
      filterActiveRecords();
      filterCancelledRecords();
      alert(editMode ? "Record updated!" : "Record saved!");
      resetForm();
      setIsBookingModalOpen(false);
      setLoading(false);
    }, 500);
  };

  const handleCancelBooking = () => {
    if (!cancelledReason) { alert("Please select cancellation reason"); return; }
    if (cancellingBooking) {
      const updatedRecords = savedRecords.map(record => record.id === cancellingBooking.id ? { ...record, status: "cancelled" as const, cancelledDate: new Date(), cancelledReason, updatedAt: new Date() } : record);
      setSavedRecords(updatedRecords);
      filterActiveRecords();
      filterCancelledRecords();
      alert(`Booking ${cancellingBooking.grNo} cancelled!`);
      setIsCancelledDialogOpen(false);
      setCancellingBooking(null);
      setCancelledReason("");
    }
  };

  const handleRestoreBooking = (record: BookingRecord) => {
    if (confirm(`Restore booking ${record.grNo}?`)) {
      const updatedRecords = savedRecords.map(r => r.id === record.id ? { ...r, status: "active" as const, cancelledDate: undefined, cancelledReason: undefined, updatedAt: new Date() } : r);
      setSavedRecords(updatedRecords);
      filterActiveRecords();
      filterCancelledRecords();
      alert(`Booking ${record.grNo} restored!`);
    }
  };

  const handleSearch = () => {
    let results = savedRecords.filter(r => r.status === "active");
    if (searchGrNo) results = results.filter(r => r.grNo.toLowerCase().includes(searchGrNo.toLowerCase()));
    if (searchFromDate) results = results.filter(r => r.grDate >= searchFromDate);
    if (searchToDate) results = results.filter(r => r.grDate <= searchToDate);
    if (searchBranch !== "all") results = results.filter(r => r.bookingFrom === searchBranch);
    setSearchResults(results);
    setCurrentPage(1);
  };

  const handleCancelledSearch = () => {
    let results = savedRecords.filter(r => r.status === "cancelled");
    if (searchGrNo) results = results.filter(r => r.grNo.toLowerCase().includes(searchGrNo.toLowerCase()));
    if (searchFromDate) results = results.filter(r => r.grDate >= searchFromDate);
    if (searchToDate) results = results.filter(r => r.grDate <= searchToDate);
    if (searchBranch !== "all") results = results.filter(r => r.bookingFrom === searchBranch);
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
  };

  const handleEdit = (record: BookingRecord) => {
    setEditMode(true);
    setCurrentEditId(record.id);
    setGrNo(record.grNo);
    setGrDate(record.grDate);
    setBookingFrom(record.bookingFrom);
    setDestination(record.destination);
    setPickupFrom(record.pickupFrom);
    setDeliveryPoint(record.deliveryPoint);
    setBookingType(record.bookingType);
    setCollectionAt(record.collectionAt);
    setServiceProduct(record.serviceProduct);
    setDeliveryType(record.deliveryType);
    setLoadType(record.loadType);
    setMkExecutive(record.mkExecutive);
    setFreightOn(record.freightOn);
    setManualRates(record.manualRates);
    setPvtMarkaSealNo(record.pvtMarkaSealNo);
    setCcAttached(record.ccAttached);
    setPrintAfterSave(record.printAfterSave);
    setConsignorName(record.consignorName);
    setConsignorGst(record.consignorGst);
    setConsignorDealerCode(record.consignorDealerCode);
    setConsignorAddress(record.consignorAddress);
    setConsignorCity(record.consignorCity);
    setConsignorState(record.consignorState);
    setConsignorMobile(record.consignorMobile);
    setConsignorEmail(record.consignorEmail);
    setConsignorIecCode(record.consignorIecCode);
    setConsignorBankAdNo(record.consignorBankAdNo);
    setConsigneeName(record.consigneeName);
    setConsigneeGst(record.consigneeGst);
    setConsigneeDealerCode(record.consigneeDealerCode);
    setConsigneeAddress(record.consigneeAddress);
    setConsigneeCity(record.consigneeCity);
    setConsigneeState(record.consigneeState);
    setConsigneeMobile(record.consigneeMobile);
    setConsigneeEmail(record.consigneeEmail);
    setConsigneeIecCode(record.consigneeIecCode);
    setConsigneeEximCode(record.consigneeEximCode);
    setPackages(record.packages);
    setInvoices(record.invoices);
    setRemarks(record.remarks);
    setRoRemarks(record.roRemarks);
    setGpRemarks(record.gpRemarks);
    setInsuranceCoveredBy(record.insuranceCoveredBy);
    setInsuranceNo(record.insuranceNo);
    setInsuranceDate(record.insuranceDate);
    setInsuranceCompany(record.insuranceCompany);
    setBillNo(record.billNo);
    setSupplementaryBillNo(record.supplementaryBillNo);
    setTotalFreight(record.totalFreight);
    setIsBookingModalOpen(true);
    setActiveFormTab("consignor");
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
    setGrNo(generateGrNo());
    setIsBookingModalOpen(true);
  };

  const openCancelDialog = (record: BookingRecord) => {
    setCancellingBooking(record);
    setCancelledReason("");
    setIsCancelledDialogOpen(true);
  };

  const activeStats = { total: searchResults.length, totalFreight: searchResults.reduce((sum, r) => sum + r.totalFreight, 0) };
  const cancelledStats = { total: cancelledSearchResults.length, totalFreight: cancelledSearchResults.reduce((sum, r) => sum + r.totalFreight, 0) };

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
          <Button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700"><Plus className="mr-2 h-4 w-4" />New Booking</Button>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b bg-white rounded-t-lg">
        <button onClick={() => { setMainTab("active"); filterActiveRecords(); }} className={cn("px-6 py-2.5 text-sm font-medium rounded-t-lg", mainTab === "active" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100")}>Active Bookings</button>
        <button onClick={() => { setMainTab("cancelled"); filterCancelledRecords(); }} className={cn("px-6 py-2.5 text-sm font-medium rounded-t-lg", mainTab === "cancelled" ? "bg-red-600 text-white" : "text-gray-600 hover:bg-gray-100")}>Cancelled Bookings</button>
      </div>

      {/* Active Bookings Tab */}
      {mainTab === "active" && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white"><CardContent className="p-4"><div className="flex justify-between"><div><p className="text-sm">Total Active</p><p className="text-2xl font-bold">{activeStats.total}</p></div><FileText className="h-8 w-8 opacity-80" /></div></CardContent></Card>
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white"><CardContent className="p-4"><div className="flex justify-between"><div><p className="text-sm">Total Freight</p><p className="text-2xl font-bold">₹{activeStats.totalFreight.toLocaleString()}</p></div><DollarSign className="h-8 w-8 opacity-80" /></div></CardContent></Card>
          </div>

          <Card>
            <CardHeader><CardTitle className="text-xs flex items-center gap-2"><Search className="h-3 w-3" />Search Active Bookings</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                <div><Label className="text-[10px]">From Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(searchFromDate, "dd-MM-yy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={searchFromDate} onSelect={(d) => d && setSearchFromDate(d)} /></PopoverContent></Popover></div>
                <div><Label className="text-[10px]">To Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(searchToDate, "dd-MM-yy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={searchToDate} onSelect={(d) => d && setSearchToDate(d)} /></PopoverContent></Popover></div>
                <div><Label className="text-[10px]">GR No.</Label><Input value={searchGrNo} onChange={(e) => setSearchGrNo(e.target.value)} className="h-8 text-xs" /></div>
                <div><Label className="text-[10px]">Branch</Label><Select value={searchBranch} onValueChange={setSearchBranch}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem>{branchOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></div>
                <div className="flex gap-1 items-end"><Button onClick={handleSearch} size="sm" className="h-8 text-xs bg-blue-600"><Search className="h-3 w-3 mr-1" />Search</Button><Button onClick={handleClearSearch} variant="outline" size="sm" className="h-8 text-xs"><RefreshCw className="h-3 w-3" /></Button></div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button onClick={() => setViewMode("report")} variant={viewMode === "report" ? "default" : "outline"} size="sm" className="h-7 text-xs"><Table className="h-3 w-3 mr-1" />Report</Button>
            <Button onClick={() => setViewMode("grid")} variant={viewMode === "grid" ? "default" : "outline"} size="sm" className="h-7 text-xs"><Grid3x3 className="h-3 w-3 mr-1" />Grid</Button>
          </div>

          {viewMode === "report" && searchResults.length > 0 && (
            <Card><CardContent className="p-0"><div className="overflow-x-auto"><Table><TableHeader><TableRow className="bg-gray-50"><TableHead className="text-[10px] p-2">#</TableHead><TableHead className="text-[10px] p-2">GR No.</TableHead><TableHead className="text-[10px] p-2">Date</TableHead><TableHead className="text-[10px] p-2">From</TableHead><TableHead className="text-[10px] p-2">To</TableHead><TableHead className="text-[10px] p-2">Consignor</TableHead><TableHead className="text-[10px] p-2">Consignee</TableHead><TableHead className="text-[10px] p-2 text-right">Freight</TableHead><TableHead className="text-[10px] p-2 text-center">Actions</TableHead></TableRow></TableHeader><TableBody>{paginatedResults.map((r, idx) => (<TableRow key={r.id}><TableCell className="text-xs p-2">{(currentPage-1)*itemsPerPage+idx+1}</TableCell><TableCell className="text-xs p-2 font-mono font-bold"><Badge variant="outline" className="bg-blue-50">{r.grNo}</Badge></TableCell><TableCell className="text-xs p-2">{format(r.grDate, "dd-MM-yy")}</TableCell><TableCell className="text-xs p-2">{r.bookingFrom}</TableCell><TableCell className="text-xs p-2">{r.destination}</TableCell><TableCell className="text-xs p-2 truncate max-w-[120px]">{r.consignorName}</TableCell><TableCell className="text-xs p-2 truncate max-w-[120px]">{r.consigneeName}</TableCell><TableCell className="text-xs p-2 text-right">₹{r.totalFreight.toLocaleString()}</TableCell><TableCell className="text-xs p-2 text-center"><div className="flex gap-1"><Button variant="ghost" size="sm" onClick={() => handleEdit(r)} className="h-6 w-6 p-0 text-blue-500"><Pencil className="h-3 w-3" /></Button><Button variant="ghost" size="sm" onClick={() => openCancelDialog(r)} className="h-6 w-6 p-0 text-orange-500"><X className="h-3 w-3" /></Button><Button variant="ghost" size="sm" onClick={() => handleDelete(r.id)} className="h-6 w-6 p-0 text-red-500"><Trash2 className="h-3 w-3" /></Button></div></TableCell></TableRow>))}</TableBody></Table></div></CardContent></Card>
          )}

          {searchResults.length === 0 && (<Card><CardContent className="py-12 text-center"><FileText className="h-12 w-12 mx-auto text-gray-400" /><p className="text-gray-500">No active bookings</p></CardContent></Card>)}
        </>
      )}

      {/* Cancelled Bookings Tab */}
      {mainTab === "cancelled" && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white"><CardContent className="p-4"><div className="flex justify-between"><div><p className="text-sm">Total Cancelled</p><p className="text-2xl font-bold">{cancelledStats.total}</p></div><X className="h-8 w-8 opacity-80" /></div></CardContent></Card>
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white"><CardContent className="p-4"><div className="flex justify-between"><div><p className="text-sm">Freight Lost</p><p className="text-2xl font-bold">₹{cancelledStats.totalFreight.toLocaleString()}</p></div><DollarSign className="h-8 w-8 opacity-80" /></div></CardContent></Card>
          </div>

          <Card><CardHeader><CardTitle className="text-xs"><Search className="h-3 w-3 inline mr-1" />Search Cancelled</CardTitle></CardHeader><CardContent><div className="grid grid-cols-2 md:grid-cols-5 gap-2"><div><Label className="text-[10px]">From Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(searchFromDate, "dd-MM-yy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={searchFromDate} onSelect={(d) => d && setSearchFromDate(d)} /></PopoverContent></Popover></div><div><Label className="text-[10px]">To Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(searchToDate, "dd-MM-yy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={searchToDate} onSelect={(d) => d && setSearchToDate(d)} /></PopoverContent></Popover></div><div><Label className="text-[10px]">GR No.</Label><Input value={searchGrNo} onChange={(e) => setSearchGrNo(e.target.value)} className="h-8 text-xs" /></div><div><Label className="text-[10px]">Branch</Label><Select value={searchBranch} onValueChange={setSearchBranch}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem>{branchOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></div><div className="flex gap-1 items-end"><Button onClick={handleCancelledSearch} size="sm" className="h-8 text-xs bg-red-600"><Search className="h-3 w-3 mr-1" />Search</Button><Button onClick={handleClearSearch} variant="outline" size="sm" className="h-8 text-xs"><RefreshCw className="h-3 w-3" /></Button></div></div></CardContent></Card>

          {viewMode === "report" && cancelledSearchResults.length > 0 && (<Card><CardContent className="p-0"><div className="overflow-x-auto"><Table><TableHeader><TableRow className="bg-gray-50"><TableHead className="text-[10px] p-2">#</TableHead><TableHead className="text-[10px] p-2">GR No.</TableHead><TableHead className="text-[10px] p-2">Date</TableHead><TableHead className="text-[10px] p-2">From</TableHead><TableHead className="text-[10px] p-2">To</TableHead><TableHead className="text-[10px] p-2">Consignor</TableHead><TableHead className="text-[10px] p-2">Consignee</TableHead><TableHead className="text-[10px] p-2 text-right">Freight</TableHead><TableHead className="text-[10px] p-2">Cancel Date</TableHead><TableHead className="text-[10px] p-2">Reason</TableHead><TableHead className="text-[10px] p-2">Actions</TableHead></TableRow></TableHeader><TableBody>{paginatedCancelledResults.map((r, idx) => (<TableRow key={r.id} className="bg-red-50/30"><TableCell className="text-xs p-2">{(cancelledCurrentPage-1)*itemsPerPage+idx+1}</TableCell><TableCell className="text-xs p-2"><Badge variant="outline" className="bg-red-50 text-red-700">{r.grNo}</Badge></TableCell><TableCell className="text-xs p-2">{format(r.grDate, "dd-MM-yy")}</TableCell><TableCell className="text-xs p-2">{r.bookingFrom}</TableCell><TableCell className="text-xs p-2">{r.destination}</TableCell><TableCell className="text-xs p-2 truncate">{r.consignorName}</TableCell><TableCell className="text-xs p-2 truncate">{r.consigneeName}</TableCell><TableCell className="text-xs p-2 text-right">₹{r.totalFreight.toLocaleString()}</TableCell><TableCell className="text-xs p-2">{r.cancelledDate ? format(r.cancelledDate, "dd-MM-yy") : "-"}</TableCell><TableCell className="text-xs p-2 truncate max-w-[100px]">{r.cancelledReason}</TableCell><TableCell className="text-xs p-2"><Button variant="ghost" size="sm" onClick={() => handleRestoreBooking(r)} className="h-6 w-6 p-0 text-green-500"><RefreshCw className="h-3 w-3" /></Button></TableCell></TableRow>))}</TableBody></Table></div></CardContent></Card>)}

          {cancelledSearchResults.length === 0 && (<Card><CardContent className="py-12 text-center"><X className="h-12 w-12 mx-auto text-gray-400" /><p className="text-gray-500">No cancelled bookings</p></CardContent></Card>)}
        </>
      )}

      {/* Cancel Dialog */}
      <Dialog open={isCancelledDialogOpen} onOpenChange={setIsCancelledDialogOpen}>
        <DialogContent><DialogHeader><DialogTitle className="text-red-600 flex items-center gap-2"><X className="h-5 w-5" />Cancel Booking</DialogTitle><DialogDescription>Cancel {cancellingBooking?.grNo}?</DialogDescription></DialogHeader><div><Label>Cancellation Reason *</Label><Select value={cancelledReason} onValueChange={setCancelledReason}><SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger><SelectContent>{cancelledReasonOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></div><DialogFooter><Button variant="outline" onClick={() => setIsCancelledDialogOpen(false)}>No, Keep</Button><Button variant="destructive" onClick={handleCancelBooking}>Yes, Cancel</Button></DialogFooter></DialogContent>
      </Dialog>

      {/* Main Booking Modal - CONSignor TAB OPEN BY DEFAULT */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="max-w-[95vw] w-full max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="sticky top-0 bg-white z-10 px-6 pt-6 pb-3 border-b">
            <DialogTitle>{editMode ? "Edit Booking" : "Create New Booking"}</DialogTitle>
            <DialogDescription>Fill in all booking details below. Consignor tab is open by default.</DialogDescription>
          </DialogHeader>

          <div className="px-6 py-4 space-y-4">
            {/* Basic Info Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <div><Label className="text-xs">GR # *</Label><Input value={grNo} readOnly className="h-8 text-sm bg-gray-50" /></div>
              <div><Label className="text-xs">Booking From *</Label><Input value={bookingFrom} onChange={(e) => setBookingFrom(e.target.value)} className="h-8 text-sm" /></div>
              <div><Label className="text-xs">Booking Date *</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-sm"><CalendarIcon className="mr-1 h-3 w-3" />{format(grDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={grDate} onSelect={(d) => d && setGrDate(d)} /></PopoverContent></Popover></div>
              <div><Label className="text-xs">Destination *</Label><Input value={destination} onChange={(e) => setDestination(e.target.value)} className="h-8 text-sm" /></div>
              <div><Label className="text-xs">Pickup From</Label><Input value={pickupFrom} onChange={(e) => setPickupFrom(e.target.value)} className="h-8 text-sm" /></div>
              <div><Label className="text-xs">Delivery Point</Label><Input value={deliveryPoint} onChange={(e) => setDeliveryPoint(e.target.value)} className="h-8 text-sm" /></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <div><Label className="text-xs">Booking Type *</Label><Select value={bookingType} onValueChange={setBookingType}><SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger><SelectContent>{bookingTypeOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent></Select></div>
              <div><Label className="text-xs">Collection At *</Label><Input value={collectionAt} onChange={(e) => setCollectionAt(e.target.value)} className="h-8 text-sm" /></div>
              <div><Label className="text-xs">Consignor *</Label><Input value={consignorName} onChange={(e) => setConsignorName(e.target.value)} className="h-8 text-sm" placeholder="Consignor Name" /></div>
              <div><Label className="text-xs">Consignor GST</Label><Input value={consignorGst} onChange={(e) => setConsignorGst(e.target.value)} className="h-8 text-sm" /></div>
              <div><Label className="text-xs">Consignee *</Label><Input value={consigneeName} onChange={(e) => setConsigneeName(e.target.value)} className="h-8 text-sm" placeholder="Consignee Name" /></div>
              <div><Label className="text-xs">Consignee GST</Label><Input value={consigneeGst} onChange={(e) => setConsigneeGst(e.target.value)} className="h-8 text-sm" /></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <div><Label className="text-xs">Pvt Marka/Seal No</Label><Input value={pvtMarkaSealNo} onChange={(e) => setPvtMarkaSealNo(e.target.value)} className="h-8 text-sm" /></div>
              <div><Label className="text-xs">Service/Product *</Label><Select value={serviceProduct} onValueChange={setServiceProduct}><SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger><SelectContent>{serviceProductOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent></Select></div>
              <div><Label className="text-xs">Delivery Type *</Label><Select value={deliveryType} onValueChange={setDeliveryType}><SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger><SelectContent>{deliveryTypeOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent></Select></div>
              <div><Label className="text-xs">Load Type *</Label><Select value={loadType} onValueChange={setLoadType}><SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger><SelectContent>{loadTypeOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent></Select></div>
              <div><Label className="text-xs">MKT Executive</Label><Select value={mkExecutive} onValueChange={setMkExecutive}><SelectTrigger className="h-8 text-sm"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{executiveOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></div>
              <div><Label className="text-xs">Freight On</Label><Select value={freightOn} onValueChange={setFreightOn}><SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger><SelectContent>{freightOnOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent></Select></div>
            </div>

            {/* Packages Table */}
            <div className="border rounded-lg p-3">
              <div className="flex justify-between mb-2"><Label className="text-sm font-semibold">Package Details</Label><Button variant="outline" size="sm" onClick={addPackageRow}><PlusCircle className="h-3 w-3 mr-1" />Add Package</Button></div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow><TableHead className="text-[10px] p-1">No of Pckgs</TableHead><TableHead className="text-[10px] p-1">Content</TableHead><TableHead className="text-[10px] p-1">Packing</TableHead><TableHead className="text-[10px] p-1">Actual Wt</TableHead><TableHead className="text-[10px] p-1">Charge Wt</TableHead><TableHead className="w-8"></TableHead></TableRow></TableHeader>
                  <TableBody>{packages.map(pkg => (<TableRow key={pkg.id}><TableCell><Input type="number" value={pkg.noOfPackages} onChange={(e) => updatePackage(pkg.id, "noOfPackages", Number(e.target.value))} className="h-8 w-20 text-xs" /></TableCell><TableCell><Input value={pkg.content} onChange={(e) => updatePackage(pkg.id, "content", e.target.value)} className="h-8 w-28 text-xs" /></TableCell><TableCell><Select value={pkg.packing} onValueChange={(val) => updatePackage(pkg.id, "packing", val)}><SelectTrigger className="h-8 w-24 text-xs"><SelectValue /></SelectTrigger><SelectContent>{packingOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></TableCell><TableCell><Input type="number" value={pkg.actualWeight} onChange={(e) => updatePackage(pkg.id, "actualWeight", Number(e.target.value))} className="h-8 w-24 text-xs" /></TableCell><TableCell><Input type="number" value={pkg.chargeWeight} onChange={(e) => updatePackage(pkg.id, "chargeWeight", Number(e.target.value))} className="h-8 w-24 text-xs" /></TableCell><TableCell><Button variant="ghost" size="sm" onClick={() => removePackage(pkg.id)} disabled={packages.length === 1} className="h-7 w-7 p-0 text-red-500"><Trash2 className="h-3 w-3" /></Button></TableCell></TableRow>))}</TableBody>
                </Table>
              </div>
              <div className="mt-2 text-xs bg-gray-50 p-2 rounded">Total: Pckgs: {totalPackages} | Actual Wt: {totalActualWeight} kg | Charge Wt: {totalChargeWeight} kg | Freight: ₹{totalFreight}</div>
            </div>

            {/* Invoices Table */}
            <div className="border rounded-lg p-3">
              <div className="flex justify-between mb-2"><Label className="text-sm font-semibold">Invoice Details</Label><div className="flex gap-2"><label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={printAfterSave} onChange={(e) => setPrintAfterSave(e.target.checked)} />Print After Save</label><label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={ccAttached} onChange={(e) => setCcAttached(e.target.checked)} />CC Attached</label><Button variant="outline" size="sm" onClick={addInvoiceRow}><PlusCircle className="h-3 w-3 mr-1" />Add Invoice</Button></div></div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow><TableHead className="text-[10px] p-1">S#</TableHead><TableHead className="text-[10px] p-1">Invoice #</TableHead><TableHead className="text-[10px] p-1">Date</TableHead><TableHead className="text-[10px] p-1">Value</TableHead><TableHead className="text-[10px] p-1">Eway Bill #</TableHead><TableHead className="text-[10px] p-1">Eway Date</TableHead><TableHead className="text-[10px] p-1">Valid Upto</TableHead><TableHead className="text-[10px] p-1">NCV</TableHead><TableHead></TableHead></TableRow></TableHeader>
                  <TableBody>{invoices.map((inv, idx) => (<TableRow key={inv.id}><TableCell className="text-xs">{idx+1}</TableCell><TableCell><Input value={inv.invoiceNo} onChange={(e) => updateInvoice(inv.id, "invoiceNo", e.target.value)} className="h-8 w-24 text-xs" /></TableCell><TableCell><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-28 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(inv.date, "dd-MM-yy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={inv.date} onSelect={(d) => d && updateInvoice(inv.id, "date", d)} /></PopoverContent></Popover></TableCell><TableCell><Input type="number" value={inv.value} onChange={(e) => updateInvoice(inv.id, "value", Number(e.target.value))} className="h-8 w-24 text-xs" /></TableCell><TableCell><Input value={inv.ewayBillNo} onChange={(e) => updateInvoice(inv.id, "ewayBillNo", e.target.value)} className="h-8 w-24 text-xs" /></TableCell><TableCell><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-28 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(inv.ewayBillDate, "dd-MM-yy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={inv.ewayBillDate} onSelect={(d) => d && updateInvoice(inv.id, "ewayBillDate", d)} /></PopoverContent></Popover></TableCell><TableCell><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-28 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(inv.validUpto, "dd-MM-yy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={inv.validUpto} onSelect={(d) => d && updateInvoice(inv.id, "validUpto", d)} /></PopoverContent></Popover></TableCell><TableCell className="text-center"><input type="checkbox" checked={inv.isNcv} onChange={(e) => updateInvoice(inv.id, "isNcv", e.target.checked)} /></TableCell><TableCell><Button variant="ghost" size="sm" onClick={() => removeInvoice(inv.id)} disabled={invoices.length === 1} className="text-red-500"><Trash2 className="h-3 w-3" /></Button></TableCell></TableRow>))}</TableBody>
                </Table>
              </div>
            </div>

            {/* Form Tabs - DEFAULT TAB IS "consignor" */}
            <Tabs value={activeFormTab} onValueChange={setActiveFormTab} className="w-full">
              <TabsList className="grid grid-cols-6 h-auto">
                <TabsTrigger value="consignor" className="text-xs py-1">Consignor</TabsTrigger>
                <TabsTrigger value="consignee" className="text-xs py-1">Consignee</TabsTrigger>
                <TabsTrigger value="freight" className="text-xs py-1">Freight</TabsTrigger>
                <TabsTrigger value="remarks" className="text-xs py-1">Remarks</TabsTrigger>
                <TabsTrigger value="insurance" className="text-xs py-1">Insurance</TabsTrigger>
                <TabsTrigger value="billing" className="text-xs py-1">Billing</TabsTrigger>
              </TabsList>

              {/* Consignor Tab - Now Opens First */}
              <TabsContent value="consignor" className="mt-4 space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div><Label className="text-xs">Dealer Code</Label><Input value={consignorDealerCode} onChange={(e) => setConsignorDealerCode(e.target.value)} className="h-8 text-sm" /></div>
                  <div><Label className="text-xs">Address</Label><Input value={consignorAddress} onChange={(e) => setConsignorAddress(e.target.value)} className="h-8 text-sm" /></div>
                  <div><Label className="text-xs">City</Label><Input value={consignorCity} onChange={(e) => setConsignorCity(e.target.value)} className="h-8 text-sm" /></div>
                  <div><Label className="text-xs">State</Label><Input value={consignorState} onChange={(e) => setConsignorState(e.target.value)} className="h-8 text-sm" /></div>
                  <div><Label className="text-xs">Mobile No.</Label><Input value={consignorMobile} onChange={(e) => setConsignorMobile(e.target.value)} className="h-8 text-sm" /></div>
                  <div><Label className="text-xs">Email ID</Label><Input value={consignorEmail} onChange={(e) => setConsignorEmail(e.target.value)} className="h-8 text-sm" /></div>
                  <div><Label className="text-xs">IEC Code</Label><Input value={consignorIecCode} onChange={(e) => setConsignorIecCode(e.target.value)} className="h-8 text-sm" /></div>
                  <div><Label className="text-xs">Bank AD. No.</Label><Input value={consignorBankAdNo} onChange={(e) => setConsignorBankAdNo(e.target.value)} className="h-8 text-sm" /></div>
                </div>
              </TabsContent>

              {/* Consignee Tab */}
              <TabsContent value="consignee" className="mt-4 space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div><Label className="text-xs">Dealer Code</Label><Input value={consigneeDealerCode} onChange={(e) => setConsigneeDealerCode(e.target.value)} className="h-8 text-sm" /></div>
                  <div><Label className="text-xs">Address</Label><Input value={consigneeAddress} onChange={(e) => setConsigneeAddress(e.target.value)} className="h-8 text-sm" /></div>
                  <div><Label className="text-xs">City</Label><Input value={consigneeCity} onChange={(e) => setConsigneeCity(e.target.value)} className="h-8 text-sm" /></div>
                  <div><Label className="text-xs">State</Label><Input value={consigneeState} onChange={(e) => setConsigneeState(e.target.value)} className="h-8 text-sm" /></div>
                  <div><Label className="text-xs">Mobile No.</Label><Input value={consigneeMobile} onChange={(e) => setConsigneeMobile(e.target.value)} className="h-8 text-sm" /></div>
                  <div><Label className="text-xs">Email ID</Label><Input value={consigneeEmail} onChange={(e) => setConsigneeEmail(e.target.value)} className="h-8 text-sm" /></div>
                  <div><Label className="text-xs">IEC Code</Label><Input value={consigneeIecCode} onChange={(e) => setConsigneeIecCode(e.target.value)} className="h-8 text-sm" /></div>
                  <div><Label className="text-xs">Exim Code</Label><Input value={consigneeEximCode} onChange={(e) => setConsigneeEximCode(e.target.value)} className="h-8 text-sm" /></div>
                </div>
              </TabsContent>

              {/* Freight Tab */}
              <TabsContent value="freight" className="mt-4 space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div><Label className="text-xs">Freight On</Label><Select value={freightOn} onValueChange={setFreightOn}><SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger><SelectContent>{freightOnOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent></Select></div>
                  <div className="flex items-center gap-2"><Label className="text-xs">Manual Rates</Label><input type="checkbox" checked={manualRates} onChange={(e) => setManualRates(e.target.checked)} className="rounded" /></div>
                  <div><Label className="text-xs font-bold text-green-600">Total Freight (₹)</Label><Input type="number" value={totalFreight} onChange={(e) => setTotalFreight(Number(e.target.value))} className="h-8 text-sm font-bold" /></div>
                </div>
                <Button onClick={calculateTotalFreight} size="sm" className="h-8 text-xs bg-green-600"><Calculator className="h-3 w-3 mr-1" />Calculate Freight</Button>
              </TabsContent>

              {/* Remarks Tab */}
              <TabsContent value="remarks" className="mt-4 space-y-3">
                <div><Label className="text-xs">Remarks</Label><Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={2} className="text-sm" /></div>
                <div><Label className="text-xs">RO Remarks</Label><Textarea value={roRemarks} onChange={(e) => setRoRemarks(e.target.value)} rows={2} className="text-sm" /></div>
                <div><Label className="text-xs">GP Remarks</Label><Textarea value={gpRemarks} onChange={(e) => setGpRemarks(e.target.value)} rows={2} className="text-sm" /></div>
              </TabsContent>

              {/* Insurance Tab */}
              <TabsContent value="insurance" className="mt-4 space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div><Label className="text-xs">Insurance Covered By</Label><Select value={insuranceCoveredBy} onValueChange={setInsuranceCoveredBy}><SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{insuranceCoveredByOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent></Select></div>
                  <div><Label className="text-xs">Insurance #</Label><Input value={insuranceNo} onChange={(e) => setInsuranceNo(e.target.value)} className="h-8 text-sm" /></div>
                  <div><Label className="text-xs">Insurance Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-sm"><CalendarIcon className="mr-1 h-3 w-3" />{format(insuranceDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={insuranceDate} onSelect={(d) => d && setInsuranceDate(d)} /></PopoverContent></Popover></div>
                  <div><Label className="text-xs">Insurance Company</Label><Input value={insuranceCompany} onChange={(e) => setInsuranceCompany(e.target.value)} className="h-8 text-sm" /></div>
                </div>
              </TabsContent>

              {/* Billing Tab */}
              <TabsContent value="billing" className="mt-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs">Bill No</Label><Input value={billNo} onChange={(e) => setBillNo(e.target.value)} className="h-8 text-sm" /></div>
                  <div><Label className="text-xs">Supplementary Bill No</Label><Input value={supplementaryBillNo} onChange={(e) => setSupplementaryBillNo(e.target.value)} className="h-8 text-sm" /></div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <DialogFooter className="sticky bottom-0 bg-white border-t px-6 py-4 gap-3">
            <Button variant="outline" onClick={() => setIsBookingModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={loading} className="bg-blue-600">{loading ? <><RefreshCw className="mr-2 h-4 w-4 animate-spin" />Saving...</> : <><Save className="mr-2 h-4 w-4" />{editMode ? "Update" : "Save"} Booking</>}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}