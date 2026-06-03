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
  Pencil,
  Trash2,
  Plus,
  X,
  MapPin,
  Building,
  DollarSign,
  Users,
  Package,
  MessageSquare,
  Calculator,
  Shield,
  FileText,
  Printer,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Grid3x3,
  Edit,
  PlusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface GoodsItem {
  id: number;
  noOfPckgs: number;
  content: string;
  packing: string;
  actualWeight: number;
  chargeWeight: number;
}

interface InvoiceItem {
  id: number;
  invoiceNo: string;
  date: Date;
  value: string;
  ewayBillNo: string;
  ewayBillDate: Date;
  validUpto: string;
}

interface BookingRecord {
  id: number;
  grNo: string;
  bookingFrom: string;
  bookingDate: Date;
  destination: string;
  pickupFrom: string;
  deliveryPoint: string;
  bookingType: string;
  collectionAt: string;
  consignorName: string;
  consignorGst: string;
  consignorCode: string;
  consignorAddress: string;
  consignorCity: string;
  consignorState: string;
  consignorMobile: string;
  consignorEmail: string;
  consignorIec: string;
  consignorBankAd: string;
  consigneeName: string;
  consigneeGst: string;
  consigneeCode: string;
  consigneeAddress: string;
  consigneeCity: string;
  consigneeState: string;
  consigneeMobile: string;
  consigneeEmail: string;
  consigneeIec: string;
  consigneeBankAd: string;
  pvtMarkaSealNo: string;
  serviceProduct: string;
  deliveryType: string;
  loadType: string;
  mkExecutive: string;
  freightOn: string;
  manualRates: boolean;
  ncv: boolean;
  printAfterSave: boolean;
  ccAttached: boolean;
  totalPckgs: number;
  totalActualWeight: number;
  totalChargeWeight: number;
  totalFreight: number;
  remarks: string;
  roRemarks: string;
  gpRemarks: string;
  billNo: string;
  supplementaryBillNo: string;
  insuranceCoveredBy: string;
  insuranceNo: string;
  insuranceDate: Date;
  insuranceCompany: string;
  goodsItems: GoodsItem[];
  invoices: InvoiceItem[];
  status: "active" | "cancelled";
  cancelledDate?: Date;
  cancelledReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingTypeOptions = [
  { value: "TOPAY", label: "TO PAY" },
  { value: "PREPAID", label: "PREPAID" },
  { value: "FREIGHT_COLLECT", label: "FREIGHT COLLECT" },
];

const serviceProductOptions = [
  { value: "SURFACE", label: "SURFACE" },
  { value: "AIR", label: "AIR" },
  { value: "RAIL", label: "RAIL" },
];

const deliveryTypeOptions = [
  { value: "GODOWN", label: "GODOWN" },
  { value: "DOOR_DELIVERY", label: "DOOR DELIVERY" },
  { value: "PICKUP", label: "PICKUP" },
];

const loadTypeOptions = [
  { value: "PART LOAD", label: "PART LOAD" },
  { value: "FULL LOAD", label: "FULL LOAD" },
  { value: "CONTAINER", label: "CONTAINER" },
];

const freightOnOptions = [
  { value: "CHARGE WEIGHT", label: "CHARGE WEIGHT" },
  { value: "ACTUAL WEIGHT", label: "ACTUAL WEIGHT" },
  { value: "PER PACKAGE", label: "PER PACKAGE" },
];

const insuranceCoveredByOptions = [
  { value: "carrier", label: "Carrier" },
  { value: "consignor", label: "Consignor" },
  { value: "consignee", label: "Consignee" },
];

const packingOptions = [
  { value: "BOX", label: "BOX" },
  { value: "CARTON", label: "CARTON" },
  { value: "PALLET", label: "PALLET" },
  { value: "BAG", label: "BAG" },
  { value: "DRUM", label: "DRUM" },
  { value: "LOOSE", label: "LOOSE" },
];

const cancelledReasonOptions = [
  "Customer Request", "Payment Issue", "Wrong Booking", "Duplicate Booking",
  "Vehicle Unavailable", "Route Not Available", "Other"
];

const branchOptions = [
  "DELHI", "MUMBAI", "BANGALORE", "CHENNAI", "KOLKATA", 
  "AHMEDABAD", "PUNE", "HYDERABAD", "LUCKNOW", "JAIPUR"
];

export default function BookingGRLManual() {
  const [mainTab, setMainTab] = useState<"active" | "cancelled">("active");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<number | null>(null);
  const [activeFormTab, setActiveFormTab] = useState<string>("consignor");
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "report">("report");
  const [isCancelledDialogOpen, setIsCancelledDialogOpen] = useState(false);
  const [cancellingBooking, setCancellingBooking] = useState<BookingRecord | null>(null);
  const [cancelledReason, setCancelledReason] = useState<string>("");

  // Basic Info
  const [grNo, setGrNo] = useState<string>("");
  const [bookingFrom, setBookingFrom] = useState<string>("");
  const [bookingDate, setBookingDate] = useState<Date>(new Date());
  const [destination, setDestination] = useState<string>("");
  const [pickupFrom, setPickupFrom] = useState<string>("");
  const [deliveryPoint, setDeliveryPoint] = useState<string>("");
  const [bookingType, setBookingType] = useState<string>("");
  const [collectionAt, setCollectionAt] = useState<string>("");
  const [pvtMarkaSealNo, setPvtMarkaSealNo] = useState<string>("");
  const [serviceProduct, setServiceProduct] = useState<string>("");
  const [deliveryType, setDeliveryType] = useState<string>("");
  const [loadType, setLoadType] = useState<string>("");
  const [mkExecutive, setMkExecutive] = useState<string>("");
  const [freightOn, setFreightOn] = useState<string>("");
  const [manualRates, setManualRates] = useState<boolean>(false);
  const [ncv, setNcv] = useState<boolean>(false);
  const [printAfterSave, setPrintAfterSave] = useState<boolean>(false);
  const [ccAttached, setCcAttached] = useState<boolean>(false);

  // Consignor
  const [consignorName, setConsignorName] = useState<string>("");
  const [consignorGst, setConsignorGst] = useState<string>("");
  const [consignorCode, setConsignorCode] = useState<string>("");
  const [consignorAddress, setConsignorAddress] = useState<string>("");
  const [consignorCity, setConsignorCity] = useState<string>("");
  const [consignorState, setConsignorState] = useState<string>("");
  const [consignorMobile, setConsignorMobile] = useState<string>("");
  const [consignorEmail, setConsignorEmail] = useState<string>("");
  const [consignorIec, setConsignorIec] = useState<string>("");
  const [consignorBankAd, setConsignorBankAd] = useState<string>("");

  // Consignee
  const [consigneeName, setConsigneeName] = useState<string>("");
  const [consigneeGst, setConsigneeGst] = useState<string>("");
  const [consigneeCode, setConsigneeCode] = useState<string>("");
  const [consigneeAddress, setConsigneeAddress] = useState<string>("");
  const [consigneeCity, setConsigneeCity] = useState<string>("");
  const [consigneeState, setConsigneeState] = useState<string>("");
  const [consigneeMobile, setConsigneeMobile] = useState<string>("");
  const [consigneeEmail, setConsigneeEmail] = useState<string>("");
  const [consigneeIec, setConsigneeIec] = useState<string>("");
  const [consigneeBankAd, setConsigneeBankAd] = useState<string>("");

  // Goods Items
  const [goodsItems, setGoodsItems] = useState<GoodsItem[]>([
    { id: 1, noOfPckgs: 0, content: "", packing: "BOX", actualWeight: 0, chargeWeight: 0 },
  ]);

  // Invoices
  const [invoices, setInvoices] = useState<InvoiceItem[]>([
    { id: 1, invoiceNo: "", date: new Date(), value: "0", ewayBillNo: "", ewayBillDate: new Date(), validUpto: "" },
  ]);

  // Remarks
  const [remarks, setRemarks] = useState<string>("");
  const [roRemarks, setRoRemarks] = useState<string>("");
  const [gpRemarks, setGpRemarks] = useState<string>("");
  const [billNo, setBillNo] = useState<string>("");
  const [supplementaryBillNo, setSupplementaryBillNo] = useState<string>("");

  // Insurance
  const [insuranceCoveredBy, setInsuranceCoveredBy] = useState<string>("");
  const [insuranceNo, setInsuranceNo] = useState<string>("");
  const [insuranceDate, setInsuranceDate] = useState<Date>(new Date());
  const [insuranceCompany, setInsuranceCompany] = useState<string>("");

  // Totals
  const [totalPckgs, setTotalPckgs] = useState<number>(0);
  const [totalActualWeight, setTotalActualWeight] = useState<number>(0);
  const [totalChargeWeight, setTotalChargeWeight] = useState<number>(0);
  const [totalFreight, setTotalFreight] = useState<number>(0);

  // Search
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
  const [savedRecords, setSavedRecords] = useState<BookingRecord[]>([]);

  useEffect(() => {
    filterActiveRecords();
    filterCancelledRecords();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [goodsItems]);

  const filterActiveRecords = () => {
    setSearchResults(savedRecords.filter(r => r.status === "active"));
  };

  const filterCancelledRecords = () => {
    setCancelledSearchResults(savedRecords.filter(r => r.status === "cancelled"));
  };

  const generateGrNo = (): string => {
    const count = savedRecords.filter(r => r.status === "active").length + 1;
    return `GRM${String(count).padStart(6, "0")}`;
  };

  const calculateTotals = () => {
    let pckgs = 0;
    let actWeight = 0;
    let chgWeight = 0;
    
    goodsItems.forEach(item => {
      pckgs += item.noOfPckgs || 0;
      actWeight += item.actualWeight || 0;
      chgWeight += item.chargeWeight || 0;
    });
    
    setTotalPckgs(pckgs);
    setTotalActualWeight(actWeight);
    setTotalChargeWeight(chgWeight);
    setTotalFreight(chgWeight * 5);
  };

  const updateGoodsItem = (id: number, field: keyof GoodsItem, value: any) => {
    setGoodsItems(goodsItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const addGoodsRow = () => {
    setGoodsItems([...goodsItems, { id: Date.now(), noOfPckgs: 0, content: "", packing: "BOX", actualWeight: 0, chargeWeight: 0 }]);
  };

  const removeGoodsRow = (id: number) => {
    if (goodsItems.length > 1) {
      setGoodsItems(goodsItems.filter(item => item.id !== id));
    }
  };

  const addInvoiceRow = () => {
    setInvoices([...invoices, { id: Date.now(), invoiceNo: "", date: new Date(), value: "0", ewayBillNo: "", ewayBillDate: new Date(), validUpto: "" }]);
  };

  const updateInvoice = (id: number, field: keyof InvoiceItem, value: any) => {
    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, [field]: value } : inv));
  };

  const removeInvoice = (id: number) => {
    if (invoices.length > 1) {
      setInvoices(invoices.filter(inv => inv.id !== id));
    }
  };

  const resetForm = () => {
    setGrNo(generateGrNo());
    setBookingFrom("");
    setBookingDate(new Date());
    setDestination("");
    setPickupFrom("");
    setDeliveryPoint("");
    setBookingType("");
    setCollectionAt("");
    setPvtMarkaSealNo("");
    setServiceProduct("");
    setDeliveryType("");
    setLoadType("");
    setMkExecutive("");
    setFreightOn("");
    setManualRates(false);
    setNcv(false);
    setPrintAfterSave(false);
    setCcAttached(false);
    setConsignorName("");
    setConsignorGst("");
    setConsignorCode("");
    setConsignorAddress("");
    setConsignorCity("");
    setConsignorState("");
    setConsignorMobile("");
    setConsignorEmail("");
    setConsignorIec("");
    setConsignorBankAd("");
    setConsigneeName("");
    setConsigneeGst("");
    setConsigneeCode("");
    setConsigneeAddress("");
    setConsigneeCity("");
    setConsigneeState("");
    setConsigneeMobile("");
    setConsigneeEmail("");
    setConsigneeIec("");
    setConsigneeBankAd("");
    setGoodsItems([{ id: 1, noOfPckgs: 0, content: "", packing: "BOX", actualWeight: 0, chargeWeight: 0 }]);
    setInvoices([{ id: 1, invoiceNo: "", date: new Date(), value: "0", ewayBillNo: "", ewayBillDate: new Date(), validUpto: "" }]);
    setRemarks("");
    setRoRemarks("");
    setGpRemarks("");
    setBillNo("");
    setSupplementaryBillNo("");
    setInsuranceCoveredBy("");
    setInsuranceNo("");
    setInsuranceDate(new Date());
    setInsuranceCompany("");
    setTotalPckgs(0);
    setTotalActualWeight(0);
    setTotalChargeWeight(0);
    setTotalFreight(0);
    setEditMode(false);
    setCurrentEditId(null);
    setActiveFormTab("consignor");
  };

  const handlePrint = () => {
    alert("Print functionality will be implemented");
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear all form data?")) {
      resetForm();
    }
  };

  const handleSave = () => {
    if (!bookingFrom) { alert("Please enter Booking From"); return; }
    if (!destination) { alert("Please enter Destination"); return; }
    if (!consignorName) { alert("Please enter Consignor Name"); return; }
    if (!consigneeName) { alert("Please enter Consignee Name"); return; }

    setLoading(true);
    setTimeout(() => {
      const newRecord: BookingRecord = {
        id: currentEditId || Date.now(),
        grNo, bookingFrom, bookingDate, destination, pickupFrom, deliveryPoint,
        bookingType, collectionAt, consignorName, consignorGst, consignorCode,
        consignorAddress, consignorCity, consignorState, consignorMobile, consignorEmail,
        consignorIec, consignorBankAd, consigneeName, consigneeGst, consigneeCode,
        consigneeAddress, consigneeCity, consigneeState, consigneeMobile, consigneeEmail,
        consigneeIec, consigneeBankAd, pvtMarkaSealNo, serviceProduct, deliveryType,
        loadType, mkExecutive, freightOn, manualRates, ncv, printAfterSave, ccAttached,
        totalPckgs, totalActualWeight, totalChargeWeight, totalFreight, remarks, roRemarks,
        gpRemarks, billNo, supplementaryBillNo, insuranceCoveredBy, insuranceNo,
        insuranceDate, insuranceCompany, goodsItems, invoices, status: "active",
        createdAt: editMode && currentEditId ? savedRecords.find(r => r.id === currentEditId)?.createdAt || new Date() : new Date(),
        updatedAt: new Date(),
      };

      const updatedRecords = editMode && currentEditId
        ? savedRecords.map(r => r.id === currentEditId ? newRecord : r)
        : [...savedRecords, newRecord];
      
      setSavedRecords(updatedRecords);
      filterActiveRecords();
      filterCancelledRecords();
      
      if (printAfterSave) handlePrint();
      alert(editMode ? "Record updated!" : "Record saved!");
      resetForm();
      setIsBookingModalOpen(false);
      setLoading(false);
    }, 500);
  };

  const handleCancelBooking = () => {
    if (!cancelledReason) { alert("Please select cancellation reason"); return; }
    if (cancellingBooking) {
      const updatedRecords = savedRecords.map(record => 
        record.id === cancellingBooking.id 
          ? { ...record, status: "cancelled" as const, cancelledDate: new Date(), cancelledReason, updatedAt: new Date() }
          : record
      );
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
      const updatedRecords = savedRecords.map(r => 
        r.id === record.id ? { ...r, status: "active" as const, cancelledDate: undefined, cancelledReason: undefined, updatedAt: new Date() } : r
      );
      setSavedRecords(updatedRecords);
      filterActiveRecords();
      filterCancelledRecords();
      alert(`Booking ${record.grNo} restored!`);
    }
  };

  const handleSearch = () => {
    let results = savedRecords.filter(r => r.status === "active");
    if (searchGrNo) results = results.filter(r => r.grNo.toLowerCase().includes(searchGrNo.toLowerCase()));
    if (searchFromDate) results = results.filter(r => r.bookingDate >= searchFromDate);
    if (searchToDate) results = results.filter(r => r.bookingDate <= searchToDate);
    if (searchBranch !== "all") results = results.filter(r => r.bookingFrom === searchBranch);
    setSearchResults(results);
    setCurrentPage(1);
  };

  const handleCancelledSearch = () => {
    let results = savedRecords.filter(r => r.status === "cancelled");
    if (searchGrNo) results = results.filter(r => r.grNo.toLowerCase().includes(searchGrNo.toLowerCase()));
    if (searchFromDate) results = results.filter(r => r.bookingDate >= searchFromDate);
    if (searchToDate) results = results.filter(r => r.bookingDate <= searchToDate);
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
    setBookingFrom(record.bookingFrom);
    setBookingDate(record.bookingDate);
    setDestination(record.destination);
    setPickupFrom(record.pickupFrom);
    setDeliveryPoint(record.deliveryPoint);
    setBookingType(record.bookingType);
    setCollectionAt(record.collectionAt);
    setPvtMarkaSealNo(record.pvtMarkaSealNo);
    setServiceProduct(record.serviceProduct);
    setDeliveryType(record.deliveryType);
    setLoadType(record.loadType);
    setMkExecutive(record.mkExecutive);
    setFreightOn(record.freightOn);
    setManualRates(record.manualRates);
    setNcv(record.ncv);
    setPrintAfterSave(record.printAfterSave);
    setCcAttached(record.ccAttached);
    setConsignorName(record.consignorName);
    setConsignorGst(record.consignorGst);
    setConsignorCode(record.consignorCode);
    setConsignorAddress(record.consignorAddress);
    setConsignorCity(record.consignorCity);
    setConsignorState(record.consignorState);
    setConsignorMobile(record.consignorMobile);
    setConsignorEmail(record.consignorEmail);
    setConsignorIec(record.consignorIec);
    setConsignorBankAd(record.consignorBankAd);
    setConsigneeName(record.consigneeName);
    setConsigneeGst(record.consigneeGst);
    setConsigneeCode(record.consigneeCode);
    setConsigneeAddress(record.consigneeAddress);
    setConsigneeCity(record.consigneeCity);
    setConsigneeState(record.consigneeState);
    setConsigneeMobile(record.consigneeMobile);
    setConsigneeEmail(record.consigneeEmail);
    setConsigneeIec(record.consigneeIec);
    setConsigneeBankAd(record.consigneeBankAd);
    setGoodsItems(record.goodsItems);
    setInvoices(record.invoices);
    setRemarks(record.remarks);
    setRoRemarks(record.roRemarks);
    setGpRemarks(record.gpRemarks);
    setBillNo(record.billNo);
    setSupplementaryBillNo(record.supplementaryBillNo);
    setInsuranceCoveredBy(record.insuranceCoveredBy);
    setInsuranceNo(record.insuranceNo);
    setInsuranceDate(record.insuranceDate);
    setInsuranceCompany(record.insuranceCompany);
    setTotalPckgs(record.totalPckgs);
    setTotalActualWeight(record.totalActualWeight);
    setTotalChargeWeight(record.totalChargeWeight);
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

  const activeStats = {
    total: searchResults.length,
    totalFreight: searchResults.reduce((sum, r) => sum + r.totalFreight, 0),
  };

  const cancelledStats = {
    total: cancelledSearchResults.length,
    totalFreight: cancelledSearchResults.reduce((sum, r) => sum + r.totalFreight, 0),
  };

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
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">BOOKING GRL MANUAL</h1>
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

      {/* Active Tab Content */}
      {mainTab === "active" && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white"><CardContent className="p-4"><div className="flex justify-between"><div><p className="text-sm">Total Active</p><p className="text-2xl font-bold">{activeStats.total}</p></div><FileText className="h-8 w-8 opacity-80" /></div></CardContent></Card>
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white"><CardContent className="p-4"><div className="flex justify-between"><div><p className="text-sm">Total Freight</p><p className="text-2xl font-bold">₹{activeStats.totalFreight.toLocaleString()}</p></div><DollarSign className="h-8 w-8 opacity-80" /></div></CardContent></Card>
          </div>

          <Card><CardHeader><CardTitle className="text-xs"><Search className="h-3 w-3 inline mr-1" />Search Active Bookings</CardTitle></CardHeader><CardContent><div className="grid grid-cols-2 md:grid-cols-5 gap-2"><div><Label className="text-[10px]">From Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(searchFromDate, "dd-MM-yy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={searchFromDate} onSelect={(d) => d && setSearchFromDate(d)} /></PopoverContent></Popover></div><div><Label className="text-[10px]">To Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(searchToDate, "dd-MM-yy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={searchToDate} onSelect={(d) => d && setSearchToDate(d)} /></PopoverContent></Popover></div><div><Label className="text-[10px]">GR No.</Label><Input value={searchGrNo} onChange={(e) => setSearchGrNo(e.target.value)} className="h-8 text-xs" /></div><div><Label className="text-[10px]">Branch</Label><Select value={searchBranch} onValueChange={setSearchBranch}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem>{branchOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></div><div className="flex gap-1 items-end"><Button onClick={handleSearch} size="sm" className="h-8 text-xs bg-blue-600"><Search className="h-3 w-3 mr-1" />Search</Button><Button onClick={handleClearSearch} variant="outline" size="sm" className="h-8 text-xs"><RefreshCw className="h-3 w-3" /></Button></div></div></CardContent></Card>

          <div className="flex justify-end gap-2"><Button onClick={() => setViewMode("report")} variant={viewMode === "report" ? "default" : "outline"} size="sm" className="h-7 text-xs"><Table className="h-3 w-3 mr-1" />Report</Button><Button onClick={() => setViewMode("grid")} variant={viewMode === "grid" ? "default" : "outline"} size="sm" className="h-7 text-xs"><Grid3x3 className="h-3 w-3 mr-1" />Grid</Button></div>

          {viewMode === "report" && searchResults.length > 0 && (
            <Card><CardContent className="p-0"><div className="overflow-x-auto"><Table><TableHeader><TableRow className="bg-gray-50"><TableHead className="text-[10px] p-2">#</TableHead><TableHead className="text-[10px] p-2">GR No.</TableHead><TableHead className="text-[10px] p-2">Date</TableHead><TableHead className="text-[10px] p-2">From</TableHead><TableHead className="text-[10px] p-2">To</TableHead><TableHead className="text-[10px] p-2">Consignor</TableHead><TableHead className="text-[10px] p-2">Consignee</TableHead><TableHead className="text-[10px] p-2 text-right">Freight</TableHead><TableHead className="text-[10px] p-2 text-center">Actions</TableHead></TableRow></TableHeader><TableBody>{paginatedResults.map((r, idx) => (<TableRow key={r.id}><TableCell className="text-xs p-2">{(currentPage-1)*itemsPerPage+idx+1}</TableCell><TableCell className="text-xs p-2"><Badge className="bg-blue-50">{r.grNo}</Badge></TableCell><TableCell className="text-xs p-2">{format(r.bookingDate, "dd-MM-yy")}</TableCell><TableCell className="text-xs p-2">{r.bookingFrom}</TableCell><TableCell className="text-xs p-2">{r.destination}</TableCell><TableCell className="text-xs p-2 truncate max-w-[120px]">{r.consignorName}</TableCell><TableCell className="text-xs p-2 truncate max-w-[120px]">{r.consigneeName}</TableCell><TableCell className="text-xs p-2 text-right">₹{r.totalFreight.toLocaleString()}</TableCell><TableCell className="text-xs p-2 text-center"><div className="flex gap-1"><Button variant="ghost" size="sm" onClick={() => handleEdit(r)} className="h-6 w-6 p-0 text-blue-500"><Pencil className="h-3 w-3" /></Button><Button variant="ghost" size="sm" onClick={() => openCancelDialog(r)} className="h-6 w-6 p-0 text-orange-500"><X className="h-3 w-3" /></Button><Button variant="ghost" size="sm" onClick={() => handleDelete(r.id)} className="h-6 w-6 p-0 text-red-500"><Trash2 className="h-3 w-3" /></Button></div></TableCell></TableRow>))}</TableBody></Table></div></CardContent></Card>
          )}

          {searchResults.length === 0 && (<Card><CardContent className="py-12 text-center"><FileText className="h-12 w-12 mx-auto text-gray-400" /><p className="text-gray-500">No active bookings</p></CardContent></Card>)}
        </>
      )}

      {/* Cancelled Tab Content */}
      {mainTab === "cancelled" && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white"><CardContent className="p-4"><div className="flex justify-between"><div><p className="text-sm">Total Cancelled</p><p className="text-2xl font-bold">{cancelledStats.total}</p></div><X className="h-8 w-8 opacity-80" /></div></CardContent></Card>
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white"><CardContent className="p-4"><div className="flex justify-between"><div><p className="text-sm">Freight Lost</p><p className="text-2xl font-bold">₹{cancelledStats.totalFreight.toLocaleString()}</p></div><DollarSign className="h-8 w-8 opacity-80" /></div></CardContent></Card>
          </div>

          <Card><CardHeader><CardTitle className="text-xs"><Search className="h-3 w-3 inline mr-1" />Search Cancelled</CardTitle></CardHeader><CardContent><div className="grid grid-cols-2 md:grid-cols-5 gap-2"><div><Label className="text-[10px]">From Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(searchFromDate, "dd-MM-yy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={searchFromDate} onSelect={(d) => d && setSearchFromDate(d)} /></PopoverContent></Popover></div><div><Label className="text-[10px]">To Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(searchToDate, "dd-MM-yy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={searchToDate} onSelect={(d) => d && setSearchToDate(d)} /></PopoverContent></Popover></div><div><Label className="text-[10px]">GR No.</Label><Input value={searchGrNo} onChange={(e) => setSearchGrNo(e.target.value)} className="h-8 text-xs" /></div><div><Label className="text-[10px]">Branch</Label><Select value={searchBranch} onValueChange={setSearchBranch}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem>{branchOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></div><div className="flex gap-1 items-end"><Button onClick={handleCancelledSearch} size="sm" className="h-8 text-xs bg-red-600"><Search className="h-3 w-3 mr-1" />Search</Button><Button onClick={handleClearSearch} variant="outline" size="sm" className="h-8 text-xs"><RefreshCw className="h-3 w-3" /></Button></div></div></CardContent></Card>

          {viewMode === "report" && cancelledSearchResults.length > 0 && (
            <Card><CardContent className="p-0"><div className="overflow-x-auto"><Table><TableHeader><TableRow className="bg-gray-50"><TableHead className="text-[10px] p-2">#</TableHead><TableHead className="text-[10px] p-2">GR No.</TableHead><TableHead className="text-[10px] p-2">Date</TableHead><TableHead className="text-[10px] p-2">From</TableHead><TableHead className="text-[10px] p-2">To</TableHead><TableHead className="text-[10px] p-2">Consignor</TableHead><TableHead className="text-[10px] p-2">Consignee</TableHead><TableHead className="text-[10px] p-2 text-right">Freight</TableHead><TableHead className="text-[10px] p-2">Cancel Date</TableHead><TableHead className="text-[10px] p-2">Reason</TableHead><TableHead className="text-[10px] p-2">Actions</TableHead></TableRow></TableHeader><TableBody>{paginatedCancelledResults.map((r, idx) => (<TableRow key={r.id} className="bg-red-50/30"><TableCell className="text-xs p-2">{(cancelledCurrentPage-1)*itemsPerPage+idx+1}</TableCell><TableCell className="text-xs p-2"><Badge className="bg-red-50 text-red-700">{r.grNo}</Badge></TableCell><TableCell className="text-xs p-2">{format(r.bookingDate, "dd-MM-yy")}</TableCell><TableCell className="text-xs p-2">{r.bookingFrom}</TableCell><TableCell className="text-xs p-2">{r.destination}</TableCell><TableCell className="text-xs p-2 truncate">{r.consignorName}</TableCell><TableCell className="text-xs p-2 truncate">{r.consigneeName}</TableCell><TableCell className="text-xs p-2 text-right">₹{r.totalFreight.toLocaleString()}</TableCell><TableCell className="text-xs p-2">{r.cancelledDate ? format(r.cancelledDate, "dd-MM-yy") : "-"}</TableCell><TableCell className="text-xs p-2 truncate max-w-[100px]">{r.cancelledReason}</TableCell><TableCell className="text-xs p-2"><Button variant="ghost" size="sm" onClick={() => handleRestoreBooking(r)} className="h-6 w-6 p-0 text-green-500"><RefreshCw className="h-3 w-3" /></Button></TableCell></TableRow>))}</TableBody></Table></div></CardContent></Card>
          )}

          {cancelledSearchResults.length === 0 && (<Card><CardContent className="py-12 text-center"><X className="h-12 w-12 mx-auto text-gray-400" /><p className="text-gray-500">No cancelled bookings</p></CardContent></Card>)}
        </>
      )}

      {/* Cancel Dialog */}
      <Dialog open={isCancelledDialogOpen} onOpenChange={setIsCancelledDialogOpen}>
        <DialogContent><DialogHeader><DialogTitle className="text-red-600 flex items-center gap-2"><X className="h-5 w-5" />Cancel Booking</DialogTitle><DialogDescription>Cancel {cancellingBooking?.grNo}?</DialogDescription></DialogHeader><div><Label>Cancellation Reason *</Label><Select value={cancelledReason} onValueChange={setCancelledReason}><SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger><SelectContent>{cancelledReasonOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></div><DialogFooter><Button variant="outline" onClick={() => setIsCancelledDialogOpen(false)}>No, Keep</Button><Button variant="destructive" onClick={handleCancelBooking}>Yes, Cancel</Button></DialogFooter></DialogContent>
      </Dialog>

      {/* Main Booking Modal */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="max-w-[95vw] w-full max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="sticky top-0 bg-white z-10 px-6 pt-6 pb-3 border-b">
            <DialogTitle className="text-xl">{editMode ? "Edit Booking" : "Create New Booking"}</DialogTitle>
            <DialogDescription>Fill in all booking details below.</DialogDescription>
          </DialogHeader>

          <div className="px-6 py-4 space-y-4">
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 justify-end">
              <Button variant="outline" size="sm" className="h-7 text-xs"><PlusCircle className="mr-1 h-3 w-3" /> Add More...</Button>
              <Button variant="outline" size="sm" className="h-7 text-xs"><Calculator className="mr-1 h-3 w-3" /> Manual Rates</Button>
              <Button onClick={calculateTotals} size="sm" className="h-7 text-xs bg-green-600"><Calculator className="mr-1 h-3 w-3" /> Calculate Freight</Button>
            </div>

            {/* Basic Information */}
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-blue-600"><FileText className="h-4 w-4" /> Basic Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                <div><Label className="text-xs">GR #</Label><Input value={grNo} readOnly className="h-8 text-sm bg-gray-50" /></div>
                <div><Label className="text-xs">Booking From *</Label><Input value={bookingFrom} onChange={(e) => setBookingFrom(e.target.value)} className="h-8 text-sm" /></div>
                <div><Label className="text-xs">Booking Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-sm"><CalendarIcon className="mr-1 h-3 w-3" />{format(bookingDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={bookingDate} onSelect={(d) => d && setBookingDate(d)} /></PopoverContent></Popover></div>
                <div><Label className="text-xs">Destination *</Label><Input value={destination} onChange={(e) => setDestination(e.target.value)} className="h-8 text-sm" /></div>
                <div><Label className="text-xs">Pickup From</Label><Input value={pickupFrom} onChange={(e) => setPickupFrom(e.target.value)} className="h-8 text-sm" /></div>
                <div><Label className="text-xs">Delivery Point</Label><Input value={deliveryPoint} onChange={(e) => setDeliveryPoint(e.target.value)} className="h-8 text-sm" /></div>
                <div><Label className="text-xs">Booking Type *</Label><Select value={bookingType} onValueChange={setBookingType}><SelectTrigger className="h-8 text-sm"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{bookingTypeOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent></Select></div>
                <div><Label className="text-xs">Collection At *</Label><Input value={collectionAt} onChange={(e) => setCollectionAt(e.target.value)} className="h-8 text-sm" /></div>
                <div><Label className="text-xs">Pvt Marka/Seal No</Label><Input value={pvtMarkaSealNo} onChange={(e) => setPvtMarkaSealNo(e.target.value)} className="h-8 text-sm" /></div>
                <div><Label className="text-xs">Service/Product *</Label><Select value={serviceProduct} onValueChange={setServiceProduct}><SelectTrigger className="h-8 text-sm"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{serviceProductOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent></Select></div>
                <div><Label className="text-xs">Delivery Type *</Label><Select value={deliveryType} onValueChange={setDeliveryType}><SelectTrigger className="h-8 text-sm"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{deliveryTypeOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent></Select></div>
                <div><Label className="text-xs">Load Type *</Label><Select value={loadType} onValueChange={setLoadType}><SelectTrigger className="h-8 text-sm"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{loadTypeOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent></Select></div>
                <div><Label className="text-xs">MKT. Executive</Label><Input value={mkExecutive} onChange={(e) => setMkExecutive(e.target.value)} className="h-8 text-sm" /></div>
                <div><Label className="text-xs">Freight On</Label><Select value={freightOn} onValueChange={setFreightOn}><SelectTrigger className="h-8 text-sm"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{freightOnOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent></Select></div>
                <div className="flex items-center"><label className="flex items-center gap-2"><input type="checkbox" checked={manualRates} onChange={(e) => setManualRates(e.target.checked)} className="rounded" /><span className="text-xs">Manual Rates</span></label></div>
              </div>
            </div>

            {/* Goods Table - Moved here from Goods Tab */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b flex justify-between items-center">
                <h3 className="text-sm font-semibold flex items-center gap-2"><Package className="h-4 w-4" /> GOODS DETAILS</h3>
                <Button onClick={addGoodsRow} variant="ghost" size="sm" className="h-7 text-xs"><Plus className="mr-1 h-3 w-3" />ADD GOODS</Button>
              </div>
              <div className="overflow-x-auto p-4">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-xs w-12">#</TableHead>
                      <TableHead className="text-xs">No Of Pckgs</TableHead>
                      <TableHead className="text-xs">Content</TableHead>
                      <TableHead className="text-xs">Packing</TableHead>
                      <TableHead className="text-xs">Actual Weight</TableHead>
                      <TableHead className="text-xs">Charge Weight</TableHead>
                      <TableHead className="text-xs w-12">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {goodsItems.map((item, idx) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-xs">{idx + 1}</TableCell>
                        <TableCell><Input type="number" value={item.noOfPckgs} onChange={(e) => updateGoodsItem(item.id, "noOfPckgs", Number(e.target.value))} className="h-8 w-24 text-xs" /></TableCell>
                        <TableCell><Input value={item.content} onChange={(e) => updateGoodsItem(item.id, "content", e.target.value)} className="h-8 w-32 text-xs" placeholder="Content" /></TableCell>
                        <TableCell><Select value={item.packing} onValueChange={(val) => updateGoodsItem(item.id, "packing", val)}><SelectTrigger className="h-8 w-24 text-xs"><SelectValue /></SelectTrigger><SelectContent>{packingOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent></Select></TableCell>
                        <TableCell><Input type="number" value={item.actualWeight} onChange={(e) => updateGoodsItem(item.id, "actualWeight", Number(e.target.value))} className="h-8 w-24 text-xs" step="0.01" /></TableCell>
                        <TableCell><Input type="number" value={item.chargeWeight} onChange={(e) => updateGoodsItem(item.id, "chargeWeight", Number(e.target.value))} className="h-8 w-24 text-xs" step="0.01" /></TableCell>
                        <TableCell><Button variant="ghost" size="sm" onClick={() => removeGoodsRow(item.id)} disabled={goodsItems.length === 1} className="h-7 w-7 p-0 text-red-500"><Trash2 className="h-3 w-3" /></Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="p-3 bg-gray-50 flex flex-wrap gap-4 justify-end border-t">
                <span className="text-xs font-medium">Total Pckgs: <strong className="text-blue-600">{totalPckgs}</strong></span>
                <span className="text-xs font-medium">Total Actual Weight: <strong className="text-blue-600">{totalActualWeight.toFixed(2)} kg</strong></span>
                <span className="text-xs font-medium">Total Charge Weight: <strong className="text-blue-600">{totalChargeWeight.toFixed(2)} kg</strong></span>
                <span className="text-xs font-medium">Total Freight: <strong className="text-green-600">₹{totalFreight.toFixed(2)}</strong></span>
              </div>
            </div>

            {/* Invoices Table */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b flex justify-between items-center">
                <h3 className="text-sm font-semibold flex items-center gap-2"><FileText className="h-4 w-4" /> INVOICES</h3>
                <div className="flex gap-3 items-center">
                  <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={ncv} onChange={(e) => setNcv(e.target.checked)} className="rounded" /><span className="text-xs">NCV</span></label>
                  <Button onClick={addInvoiceRow} variant="ghost" size="sm" className="h-7 text-xs"><Plus className="mr-1 h-3 w-3" />ADD INVOICE</Button>
                </div>
              </div>
              <div className="overflow-x-auto p-4">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-xs w-12">S#</TableHead>
                      <TableHead className="text-xs">Invoice #</TableHead>
                      <TableHead className="text-xs">Date</TableHead>
                      <TableHead className="text-xs">Value</TableHead>
                      <TableHead className="text-xs">Eway Bill #</TableHead>
                      <TableHead className="text-xs">Eway Date</TableHead>
                      <TableHead className="text-xs">Valid Upto</TableHead>
                      <TableHead className="text-xs w-12">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((inv, idx) => (
                      <TableRow key={inv.id}>
                        <TableCell className="text-xs">{idx + 1}</TableCell>
                        <TableCell><Input value={inv.invoiceNo} onChange={(e) => updateInvoice(inv.id, "invoiceNo", e.target.value)} className="h-8 w-28 text-xs" /></TableCell>
                        <TableCell><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-28 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(inv.date, "dd-MM-yy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={inv.date} onSelect={(d) => d && updateInvoice(inv.id, "date", d)} /></PopoverContent></Popover></TableCell>
                        <TableCell><Input value={inv.value} onChange={(e) => updateInvoice(inv.id, "value", e.target.value)} className="h-8 w-24 text-xs" /></TableCell>
                        <TableCell><Input value={inv.ewayBillNo} onChange={(e) => updateInvoice(inv.id, "ewayBillNo", e.target.value)} className="h-8 w-28 text-xs" /></TableCell>
                        <TableCell><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-28 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(inv.ewayBillDate, "dd-MM-yy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={inv.ewayBillDate} onSelect={(d) => d && updateInvoice(inv.id, "ewayBillDate", d)} /></PopoverContent></Popover></TableCell>
                        <TableCell><Input value={inv.validUpto} onChange={(e) => updateInvoice(inv.id, "validUpto", e.target.value)} className="h-8 w-24 text-xs" placeholder="Valid upto" /></TableCell>
                        <TableCell><Button variant="ghost" size="sm" onClick={() => removeInvoice(inv.id)} disabled={invoices.length === 1} className="h-7 w-7 p-0 text-red-500"><Trash2 className="h-3 w-3" /></Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Tabs - Consignor, Consignee, Remarks, Insurance only (No Goods Tab) */}
            <Tabs value={activeFormTab} onValueChange={setActiveFormTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-gray-100 rounded-lg">
                <TabsTrigger value="consignor" className="text-xs py-2"><Building className="h-3 w-3 mr-1" />Consignor</TabsTrigger>
                <TabsTrigger value="consignee" className="text-xs py-2"><Users className="h-3 w-3 mr-1" />Consignee</TabsTrigger>
                <TabsTrigger value="remarks" className="text-xs py-2"><MessageSquare className="h-3 w-3 mr-1" />Remarks</TabsTrigger>
                <TabsTrigger value="insurance" className="text-xs py-2"><Shield className="h-3 w-3 mr-1" />Insurance</TabsTrigger>
              </TabsList>

              {/* Consignor Tab */}
              <TabsContent value="consignor" className="mt-4">
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-semibold mb-3">CONSIGNOR DETAILS</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div><Label className="text-xs">Dealer Code</Label><Input value={consignorCode} onChange={(e) => setConsignorCode(e.target.value)} className="h-8 text-sm" /></div>
                    <div><Label className="text-xs">Address</Label><Input value={consignorAddress} onChange={(e) => setConsignorAddress(e.target.value)} className="h-8 text-sm" /></div>
                    <div><Label className="text-xs">City</Label><Input value={consignorCity} onChange={(e) => setConsignorCity(e.target.value)} className="h-8 text-sm" /></div>
                    <div><Label className="text-xs">State</Label><Input value={consignorState} onChange={(e) => setConsignorState(e.target.value)} className="h-8 text-sm" /></div>
                    <div><Label className="text-xs">Mobile No.</Label><Input value={consignorMobile} onChange={(e) => setConsignorMobile(e.target.value)} className="h-8 text-sm" /></div>
                    <div><Label className="text-xs">Email ID</Label><Input value={consignorEmail} onChange={(e) => setConsignorEmail(e.target.value)} className="h-8 text-sm" /></div>
                    <div><Label className="text-xs">IEC Code</Label><Input value={consignorIec} onChange={(e) => setConsignorIec(e.target.value)} className="h-8 text-sm" /></div>
                    <div><Label className="text-xs">Bank AD. No.</Label><Input value={consignorBankAd} onChange={(e) => setConsignorBankAd(e.target.value)} className="h-8 text-sm" /></div>
                  </div>
                </div>
              </TabsContent>

              {/* Consignee Tab */}
              <TabsContent value="consignee" className="mt-4">
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-semibold mb-3">CONSIGNEE DETAILS</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div><Label className="text-xs">Dealer Code</Label><Input value={consigneeCode} onChange={(e) => setConsigneeCode(e.target.value)} className="h-8 text-sm" /></div>
                    <div><Label className="text-xs">Address</Label><Input value={consigneeAddress} onChange={(e) => setConsigneeAddress(e.target.value)} className="h-8 text-sm" /></div>
                    <div><Label className="text-xs">City</Label><Input value={consigneeCity} onChange={(e) => setConsigneeCity(e.target.value)} className="h-8 text-sm" /></div>
                    <div><Label className="text-xs">State</Label><Input value={consigneeState} onChange={(e) => setConsigneeState(e.target.value)} className="h-8 text-sm" /></div>
                    <div><Label className="text-xs">Mobile No.</Label><Input value={consigneeMobile} onChange={(e) => setConsigneeMobile(e.target.value)} className="h-8 text-sm" /></div>
                    <div><Label className="text-xs">Email ID</Label><Input value={consigneeEmail} onChange={(e) => setConsigneeEmail(e.target.value)} className="h-8 text-sm" /></div>
                    <div><Label className="text-xs">IEC Code</Label><Input value={consigneeIec} onChange={(e) => setConsigneeIec(e.target.value)} className="h-8 text-sm" /></div>
                    <div><Label className="text-xs">Bank AD. No.</Label><Input value={consigneeBankAd} onChange={(e) => setConsigneeBankAd(e.target.value)} className="h-8 text-sm" /></div>
                  </div>
                </div>
              </TabsContent>

              {/* Remarks Tab */}
              <TabsContent value="remarks" className="mt-4">
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-semibold mb-3">REMARKS</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label className="text-xs">Remarks</Label><Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={2} className="text-sm" /></div>
                    <div><Label className="text-xs">RO Remarks</Label><Textarea value={roRemarks} onChange={(e) => setRoRemarks(e.target.value)} rows={2} className="text-sm" /></div>
                    <div><Label className="text-xs">GP Remarks</Label><Textarea value={gpRemarks} onChange={(e) => setGpRemarks(e.target.value)} rows={2} className="text-sm" /></div>
                    <div><Label className="text-xs">Bill No</Label><Input value={billNo} onChange={(e) => setBillNo(e.target.value)} className="h-8 text-sm" /></div>
                    <div><Label className="text-xs">Supplementary Bill No</Label><Input value={supplementaryBillNo} onChange={(e) => setSupplementaryBillNo(e.target.value)} className="h-8 text-sm" /></div>
                  </div>
                </div>
              </TabsContent>

              {/* Insurance Tab */}
              <TabsContent value="insurance" className="mt-4">
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-semibold mb-3">INSURANCE DETAILS</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div><Label className="text-xs">Insurance Covered By</Label><Select value={insuranceCoveredBy} onValueChange={setInsuranceCoveredBy}><SelectTrigger className="h-8 text-sm"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{insuranceCoveredByOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent></Select></div>
                    <div><Label className="text-xs">Insurance #</Label><Input value={insuranceNo} onChange={(e) => setInsuranceNo(e.target.value)} className="h-8 text-sm" /></div>
                    <div><Label className="text-xs">Insurance Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-sm"><CalendarIcon className="mr-1 h-3 w-3" />{format(insuranceDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={insuranceDate} onSelect={(d) => d && setInsuranceDate(d)} /></PopoverContent></Popover></div>
                    <div><Label className="text-xs">Insurance Company</Label><Input value={insuranceCompany} onChange={(e) => setInsuranceCompany(e.target.value)} className="h-8 text-sm" /></div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Footer Buttons */}
            <div className="flex flex-wrap justify-between items-center pt-4 border-t mt-4">
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={printAfterSave} onChange={(e) => setPrintAfterSave(e.target.checked)} className="h-4 w-4 rounded" /><span className="text-sm">Print After Save</span></label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={ccAttached} onChange={(e) => setCcAttached(e.target.checked)} className="h-4 w-4 rounded" /><span className="text-sm">CC Attached</span></label>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handlePrint} className="h-8 text-sm"><Printer className="mr-1 h-3 w-3" /> Print</Button>
                <Button variant="outline" onClick={handleClear} className="h-8 text-sm"><RefreshCw className="mr-1 h-3 w-3" /> Clear</Button>
                <Button variant="outline" onClick={() => setIsBookingModalOpen(false)} className="h-8 text-sm"><X className="mr-1 h-3 w-3" /> Cancel</Button>
                <Button onClick={handleSave} disabled={loading} className="h-8 text-sm bg-blue-600 hover:bg-blue-700"><Save className="mr-1 h-3 w-3" />{editMode ? "Update" : "Save"}</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}