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
  Box,
  Weight,
  Hash,
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
  ewayBillNo: string;
  ewayBillDate: Date;
  validUpto: string;
}

interface GoodsItem {
  id: number;
  noOfPckgs: number;
  content: string;
  packing: string;
  actualWeight: number;
  chargeWeight: number;
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
  consignorBillNo: string;
  consignorSupplementaryBillNo: string;
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
  consigneeBillNo: string;
  consigneeSupplementaryBillNo: string;
  pvtMarkaSealNo: string;
  serviceProduct: string;
  deliveryType: string;
  loadType: string;
  mkExecutive: string;
  freightOn: string;
  manualRates: boolean;
  ncv: boolean;
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
  insuranceBillNo: string;
  insuranceSupplementaryBillNo: string;
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
  { value: "SEA", label: "SEA" },
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

// Sample branch list
const branchOptions = [
  "DELHI", "MUMBAI", "BANGALORE", "CHENNAI", "KOLKATA", 
  "AHMEDABAD", "PUNE", "HYDERABAD", "LUCKNOW", "JAIPUR"
];

export default function BookingGRLManual() {
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

  // Consignor state
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
  const [consignorBillNo, setConsignorBillNo] = useState<string>("");
  const [consignorSupplementaryBillNo, setConsignorSupplementaryBillNo] = useState<string>("");

  // Consignee state
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
  const [consigneeBillNo, setConsigneeBillNo] = useState<string>("");
  const [consigneeSupplementaryBillNo, setConsigneeSupplementaryBillNo] = useState<string>("");

  // Goods Items
  const [goodsItems, setGoodsItems] = useState<GoodsItem[]>([
    { id: 1, noOfPckgs: 0, content: "", packing: "BOX", actualWeight: 0, chargeWeight: 0 },
  ]);

  // Invoices
  const [invoices, setInvoices] = useState<InvoiceItem[]>([
    { id: 1, invoiceNo: "", date: new Date(), value: "0", ewayBillNo: "", ewayBillDate: new Date(), validUpto: "" },
  ]);

  // Remarks state
  const [remarks, setRemarks] = useState<string>("");
  const [roRemarks, setRoRemarks] = useState<string>("");
  const [gpRemarks, setGpRemarks] = useState<string>("");
  const [billNo, setBillNo] = useState<string>("");
  const [supplementaryBillNo, setSupplementaryBillNo] = useState<string>("");

  // Insurance state
  const [insuranceCoveredBy, setInsuranceCoveredBy] = useState<string>("");
  const [insuranceNo, setInsuranceNo] = useState<string>("");
  const [insuranceDate, setInsuranceDate] = useState<Date>(new Date());
  const [insuranceCompany, setInsuranceCompany] = useState<string>("");
  const [insuranceBillNo, setInsuranceBillNo] = useState<string>("");
  const [insuranceSupplementaryBillNo, setInsuranceSupplementaryBillNo] = useState<string>("");

  // Totals
  const [totalPckgs, setTotalPckgs] = useState<number>(0);
  const [totalActualWeight, setTotalActualWeight] = useState<number>(0);
  const [totalChargeWeight, setTotalChargeWeight] = useState<number>(0);
  const [totalFreight, setTotalFreight] = useState<number>(0);

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

  // Sample saved data
  const [savedRecords, setSavedRecords] = useState<BookingRecord[]>([]);

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
    
    const freight = chgWeight * 5;
    setTotalFreight(freight);
  };

  const updateGoodsItem = (id: number, field: keyof GoodsItem, value: any) => {
    setGoodsItems(goodsItems.map(item => item.id === id ? { ...item, [field]: value } : item));
    setTimeout(calculateTotals, 0);
  };

  const addGoodsRow = () => {
    const newItem: GoodsItem = {
      id: Date.now(),
      noOfPckgs: 0,
      content: "",
      packing: "BOX",
      actualWeight: 0,
      chargeWeight: 0,
    };
    setGoodsItems([...goodsItems, newItem]);
  };

  const removeGoodsRow = (id: number) => {
    if (goodsItems.length > 1) {
      setGoodsItems(goodsItems.filter(item => item.id !== id));
      setTimeout(calculateTotals, 0);
    }
  };

  const addInvoiceRow = () => {
    const newInvoice: InvoiceItem = {
      id: Date.now(),
      invoiceNo: "",
      date: new Date(),
      value: "0",
      ewayBillNo: "",
      ewayBillDate: new Date(),
      validUpto: "",
    };
    setInvoices([...invoices, newInvoice]);
  };

  const updateInvoice = (id: number, field: keyof InvoiceItem, value: any) => {
    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, [field]: value } : inv));
  };

  const removeInvoice = (id: number) => {
    if (invoices.length > 1) {
      setInvoices(invoices.filter(inv => inv.id !== id));
    }
  };

  const resetForm = (): void => {
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
    setConsignorBillNo("");
    setConsignorSupplementaryBillNo("");
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
    setConsigneeBillNo("");
    setConsigneeSupplementaryBillNo("");
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
    setInsuranceBillNo("");
    setInsuranceSupplementaryBillNo("");
    setTotalPckgs(0);
    setTotalActualWeight(0);
    setTotalChargeWeight(0);
    setTotalFreight(0);
    setEditMode(false);
    setCurrentEditId(null);
    setActiveFormTab("basic");
  };

  const handleSave = () => {
    if (!bookingFrom) {
      alert("Please enter Booking From");
      return;
    }
    if (!destination) {
      alert("Please enter Destination");
      return;
    }
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
        bookingFrom,
        bookingDate,
        destination,
        pickupFrom,
        deliveryPoint,
        bookingType,
        collectionAt,
        consignorName,
        consignorGst,
        consignorCode,
        consignorAddress,
        consignorCity,
        consignorState,
        consignorMobile,
        consignorEmail,
        consignorIec,
        consignorBankAd,
        consignorBillNo,
        consignorSupplementaryBillNo,
        consigneeName,
        consigneeGst,
        consigneeCode,
        consigneeAddress,
        consigneeCity,
        consigneeState,
        consigneeMobile,
        consigneeEmail,
        consigneeIec,
        consigneeBankAd,
        consigneeBillNo,
        consigneeSupplementaryBillNo,
        pvtMarkaSealNo,
        serviceProduct,
        deliveryType,
        loadType,
        mkExecutive,
        freightOn,
        manualRates,
        ncv,
        totalPckgs,
        totalActualWeight,
        totalChargeWeight,
        totalFreight,
        remarks,
        roRemarks,
        gpRemarks,
        billNo,
        supplementaryBillNo,
        insuranceCoveredBy,
        insuranceNo,
        insuranceDate,
        insuranceCompany,
        insuranceBillNo,
        insuranceSupplementaryBillNo,
        goodsItems,
        invoices,
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
      results = results.filter(r => r.grNo.toLowerCase().includes(searchGrNo.toLowerCase()));
    }
    if (searchFromDate) {
      results = results.filter(r => r.bookingDate >= searchFromDate);
    }
    if (searchToDate) {
      results = results.filter(r => r.bookingDate <= searchToDate);
    }
    if (searchBranch !== "all") {
      results = results.filter(r => r.bookingFrom === searchBranch);
    }
    setSearchResults(results);
    setCurrentPage(1);
  };

  const handleCancelledSearch = () => {
    let results = savedRecords.filter(r => r.status === "cancelled");
    if (searchGrNo) {
      results = results.filter(r => r.grNo.toLowerCase().includes(searchGrNo.toLowerCase()));
    }
    if (searchFromDate) {
      results = results.filter(r => r.bookingDate >= searchFromDate);
    }
    if (searchToDate) {
      results = results.filter(r => r.bookingDate <= searchToDate);
    }
    if (searchBranch !== "all") {
      results = results.filter(r => r.bookingFrom === searchBranch);
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
    setConsignorBillNo(record.consignorBillNo);
    setConsignorSupplementaryBillNo(record.consignorSupplementaryBillNo);
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
    setConsigneeBillNo(record.consigneeBillNo);
    setConsigneeSupplementaryBillNo(record.consigneeSupplementaryBillNo);
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
    setInsuranceBillNo(record.insuranceBillNo);
    setInsuranceSupplementaryBillNo(record.insuranceSupplementaryBillNo);
    setTotalPckgs(record.totalPckgs);
    setTotalActualWeight(record.totalActualWeight);
    setTotalChargeWeight(record.totalChargeWeight);
    setTotalFreight(record.totalFreight);
    setIsEntrySheetOpen(true);
    setActiveFormTab("basic");
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
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">BOOKING GRL MANUAL</h1>
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
                          <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">Booking Date</TableHead>
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
                            <TableCell className="py-2 px-2 text-xs">{format(record.bookingDate, "dd-MM-yyyy")}</TableCell>
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
                        <p className="text-[10px] text-gray-500 mt-1">{format(record.bookingDate, "dd-MM-yyyy")}</p>
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
                      <div className="flex items-center gap-2">
                        <Package className="h-3 w-3 text-gray-400" />
                        <span>Pckgs: {record.totalPckgs} | Wt: {record.totalChargeWeight} kg</span>
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
                          <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">Booking Date</TableHead>
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
                            <TableCell className="py-2 px-2 text-xs">{format(record.bookingDate, "dd-MM-yyyy")}</TableCell>
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
                        <p className="text-[10px] text-gray-500 mt-1">{format(record.bookingDate, "dd-MM-yyyy")}</p>
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

      {/* Entry Sheet */}
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
              <Calculator className="mr-1 h-3 w-3" /> Manual Rates
            </Button>
            <Button onClick={calculateTotals} variant="default" size="sm" className="h-7 text-xs bg-green-600 hover:bg-green-700">
              <Calculator className="mr-1 h-3 w-3" /> Calculate Freight
            </Button>
          </div>

          {/* Basic Information */}
          <div className="border rounded-md p-3 mb-4">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" /> Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1"><Label className="text-xs">GR #</Label><Input value={grNo} readOnly className="h-8 text-xs bg-gray-50" /></div>
              <div className="space-y-1"><Label className="text-xs">Booking From <span className="text-red-500">*</span></Label><Input value={bookingFrom} onChange={(e) => setBookingFrom(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Booking Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-2 h-3 w-3" />{format(bookingDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={bookingDate} onSelect={(date) => date && setBookingDate(date)} /></PopoverContent></Popover></div>
              <div className="space-y-1"><Label className="text-xs">Destination <span className="text-red-500">*</span></Label><Input value={destination} onChange={(e) => setDestination(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Pickup From</Label><Input value={pickupFrom} onChange={(e) => setPickupFrom(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Delivery Point</Label><Input value={deliveryPoint} onChange={(e) => setDeliveryPoint(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Booking Type <span className="text-red-500">*</span></Label><Select value={bookingType} onValueChange={setBookingType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{bookingTypeOptions.map(opt => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent></Select></div>
              <div className="space-y-1"><Label className="text-xs">Collection At <span className="text-red-500">*</span></Label><Input value={collectionAt} onChange={(e) => setCollectionAt(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Pvt Marka/Seal No</Label><Input value={pvtMarkaSealNo} onChange={(e) => setPvtMarkaSealNo(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Service/Product <span className="text-red-500">*</span></Label><Select value={serviceProduct} onValueChange={setServiceProduct}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{serviceProductOptions.map(opt => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent></Select></div>
              <div className="space-y-1"><Label className="text-xs">Delivery Type <span className="text-red-500">*</span></Label><Select value={deliveryType} onValueChange={setDeliveryType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{deliveryTypeOptions.map(opt => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent></Select></div>
              <div className="space-y-1"><Label className="text-xs">Load Type <span className="text-red-500">*</span></Label><Select value={loadType} onValueChange={setLoadType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{loadTypeOptions.map(opt => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent></Select></div>
              <div className="space-y-1"><Label className="text-xs">MKT. Executive</Label><Input value={mkExecutive} onChange={(e) => setMkExecutive(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Freight On</Label><Select value={freightOn} onValueChange={setFreightOn}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{freightOnOptions.map(opt => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent></Select></div>
              <div className="flex items-end"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={manualRates} onChange={(e) => setManualRates(e.target.checked)} className="h-3.5 w-3.5" /><span className="text-xs">Manual Rates</span></label></div>
            </div>
          </div>

          {/* Form Tabs */}
          <Tabs value={activeFormTab} onValueChange={setActiveFormTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6 h-auto p-1 bg-gray-100">
              <TabsTrigger value="basic" className="text-xs py-1.5"><FileText className="h-3 w-3 mr-1" /> Basic</TabsTrigger>
              <TabsTrigger value="consignor" className="text-xs py-1.5"><Building className="h-3 w-3 mr-1" /> Consignor</TabsTrigger>
              <TabsTrigger value="consignee" className="text-xs py-1.5"><Users className="h-3 w-3 mr-1" /> Consignee</TabsTrigger>
              <TabsTrigger value="goods" className="text-xs py-1.5"><Package className="h-3 w-3 mr-1" /> Goods</TabsTrigger>
              <TabsTrigger value="remarks" className="text-xs py-1.5"><MessageSquare className="h-3 w-3 mr-1" /> Remarks</TabsTrigger>
              <TabsTrigger value="insurance" className="text-xs py-1.5"><Shield className="h-3 w-3 mr-1" /> Insurance</TabsTrigger>
            </TabsList>

            {/* Basic Tab */}
            <TabsContent value="basic" className="mt-3 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div><Label className="text-xs">Consignor <span className="text-red-500">*</span></Label><Input value={consignorName} onChange={(e) => setConsignorName(e.target.value)} className="h-8 text-xs" /></div>
                <div><Label className="text-xs">Consignor GST</Label><Input value={consignorGst} onChange={(e) => setConsignorGst(e.target.value)} className="h-8 text-xs uppercase" /></div>
                <div><Label className="text-xs">Consignee <span className="text-red-500">*</span></Label><Input value={consigneeName} onChange={(e) => setConsigneeName(e.target.value)} className="h-8 text-xs" /></div>
                <div><Label className="text-xs">Consignee GST</Label><Input value={consigneeGst} onChange={(e) => setConsigneeGst(e.target.value)} className="h-8 text-xs uppercase" /></div>
              </div>
            </TabsContent>

            {/* Consignor Tab */}
            <TabsContent value="consignor" className="mt-3">
              <div className="border rounded-md">
                <div className="bg-gray-50 px-3 py-2 border-b"><h3 className="text-sm font-semibold">CONSIGNOR DETAILS</h3></div>
                <div className="p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div><Label className="text-xs">Dealer Code</Label><Input value={consignorCode} onChange={(e) => setConsignorCode(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Address</Label><Input value={consignorAddress} onChange={(e) => setConsignorAddress(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">City</Label><Input value={consignorCity} onChange={(e) => setConsignorCity(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">State</Label><Input value={consignorState} onChange={(e) => setConsignorState(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Mobile No.</Label><Input value={consignorMobile} onChange={(e) => setConsignorMobile(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Email ID</Label><Input value={consignorEmail} onChange={(e) => setConsignorEmail(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">IEC Code</Label><Input value={consignorIec} onChange={(e) => setConsignorIec(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Bank AD. No.</Label><Input value={consignorBankAd} onChange={(e) => setConsignorBankAd(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Bill No</Label><Input value={consignorBillNo} onChange={(e) => setConsignorBillNo(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Supplementary Bill No</Label><Input value={consignorSupplementaryBillNo} onChange={(e) => setConsignorSupplementaryBillNo(e.target.value)} className="h-8 text-xs" /></div>
                </div>
              </div>
            </TabsContent>

            {/* Consignee Tab */}
            <TabsContent value="consignee" className="mt-3">
              <div className="border rounded-md">
                <div className="bg-gray-50 px-3 py-2 border-b"><h3 className="text-sm font-semibold">CONSIGNEE DETAILS</h3></div>
                <div className="p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div><Label className="text-xs">Dealer Code</Label><Input value={consigneeCode} onChange={(e) => setConsigneeCode(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Address</Label><Input value={consigneeAddress} onChange={(e) => setConsigneeAddress(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">City</Label><Input value={consigneeCity} onChange={(e) => setConsigneeCity(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">State</Label><Input value={consigneeState} onChange={(e) => setConsigneeState(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Mobile No.</Label><Input value={consigneeMobile} onChange={(e) => setConsigneeMobile(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Email ID</Label><Input value={consigneeEmail} onChange={(e) => setConsigneeEmail(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">IEC Code</Label><Input value={consigneeIec} onChange={(e) => setConsigneeIec(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Bank AD. No.</Label><Input value={consigneeBankAd} onChange={(e) => setConsigneeBankAd(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Bill No</Label><Input value={consigneeBillNo} onChange={(e) => setConsigneeBillNo(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Supplementary Bill No</Label><Input value={consigneeSupplementaryBillNo} onChange={(e) => setConsigneeSupplementaryBillNo(e.target.value)} className="h-8 text-xs" /></div>
                </div>
              </div>
            </TabsContent>

            {/* Goods Tab */}
            <TabsContent value="goods" className="mt-3">
              <div className="border rounded-md">
                <div className="bg-gray-50 px-3 py-2 border-b flex justify-between items-center">
                  <h3 className="text-sm font-semibold">GOODS DETAILS</h3>
                  <Button onClick={addGoodsRow} variant="ghost" size="sm" className="h-7 text-xs"><Plus className="mr-1 h-3 w-3" />ADD GOODS</Button>
                </div>
                <div className="overflow-x-auto">
                  <Table className="text-xs">
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>No Of Pckgs</TableHead>
                        <TableHead>Content</TableHead>
                        <TableHead>Packing</TableHead>
                        <TableHead>Actual Weight</TableHead>
                        <TableHead>Charge Weight</TableHead>
                        <TableHead className="w-12">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {goodsItems.map((item, idx) => (
                        <TableRow key={item.id}>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell><Input type="number" value={item.noOfPckgs} onChange={(e) => updateGoodsItem(item.id, "noOfPckgs", Number(e.target.value))} className="h-7 w-24 text-xs" /></TableCell>
                          <TableCell><Input value={item.content} onChange={(e) => updateGoodsItem(item.id, "content", e.target.value)} className="h-7 w-32 text-xs" /></TableCell>
                          <TableCell><Select value={item.packing} onValueChange={(val) => updateGoodsItem(item.id, "packing", val)}><SelectTrigger className="h-7 w-24 text-xs"><SelectValue /></SelectTrigger><SelectContent>{packingOptions.map(opt => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent></Select></TableCell>
                          <TableCell><Input type="number" value={item.actualWeight} onChange={(e) => updateGoodsItem(item.id, "actualWeight", Number(e.target.value))} className="h-7 w-24 text-xs" step="0.01" /></TableCell>
                          <TableCell><Input type="number" value={item.chargeWeight} onChange={(e) => updateGoodsItem(item.id, "chargeWeight", Number(e.target.value))} className="h-7 w-24 text-xs" step="0.01" /></TableCell>
                          <TableCell><Button variant="ghost" size="sm" onClick={() => removeGoodsRow(item.id)} className="h-6 w-6 p-0 text-red-500"><Trash2 className="h-3 w-3" /></Button></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="p-3 bg-gray-50 flex flex-wrap gap-4 justify-end">
                  <span className="text-xs">Total Pckgs: <strong>{totalPckgs}</strong></span>
                  <span className="text-xs">Total Actual Weight: <strong>{totalActualWeight.toFixed(2)}</strong></span>
                  <span className="text-xs">Total Charge Weight: <strong>{totalChargeWeight.toFixed(2)}</strong></span>
                  <span className="text-xs">Total Freight: <strong>₹{totalFreight.toFixed(2)}</strong></span>
                </div>
              </div>

              {/* Invoices Table */}
              <div className="border rounded-md mt-3">
                <div className="bg-gray-50 px-3 py-2 border-b flex justify-between items-center">
                  <h3 className="text-sm font-semibold">INVOICES</h3>
                  <div className="flex gap-2 items-center">
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={ncv} onChange={(e) => setNcv(e.target.checked)} className="h-3.5 w-3.5" /><span className="text-xs">NCV</span></label>
                    <Button onClick={addInvoiceRow} variant="ghost" size="sm" className="h-7 text-xs"><Plus className="mr-1 h-3 w-3" />ADD INVOICE</Button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <Table className="text-xs">
                    <TableHeader><TableRow className="bg-gray-50"><TableHead className="w-12">#</TableHead><TableHead>Invoice #</TableHead><TableHead>Date</TableHead><TableHead>Value</TableHead><TableHead>Eway Bill #</TableHead><TableHead>Date</TableHead><TableHead>Valid Upto</TableHead><TableHead className="w-12">Action</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {invoices.map((inv, idx) => (
                        <TableRow key={inv.id}>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell><Input value={inv.invoiceNo} onChange={(e) => updateInvoice(inv.id, "invoiceNo", e.target.value)} className="h-7 w-28 text-xs" /></TableCell>
                          <TableCell><Popover><PopoverTrigger asChild><Button variant="outline" className="h-7 w-28 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(inv.date, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={inv.date} onSelect={(date) => date && updateInvoice(inv.id, "date", date)} /></PopoverContent></Popover></TableCell>
                          <TableCell><Input value={inv.value} onChange={(e) => updateInvoice(inv.id, "value", e.target.value)} className="h-7 w-24 text-xs" /></TableCell>
                          <TableCell><Input value={inv.ewayBillNo} onChange={(e) => updateInvoice(inv.id, "ewayBillNo", e.target.value)} className="h-7 w-28 text-xs" /></TableCell>
                          <TableCell><Popover><PopoverTrigger asChild><Button variant="outline" className="h-7 w-28 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(inv.ewayBillDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={inv.ewayBillDate} onSelect={(date) => date && updateInvoice(inv.id, "ewayBillDate", date)} /></PopoverContent></Popover></TableCell>
                          <TableCell><Input value={inv.validUpto} onChange={(e) => updateInvoice(inv.id, "validUpto", e.target.value)} className="h-7 w-24 text-xs" /></TableCell>
                          <TableCell><Button variant="ghost" size="sm" onClick={() => removeInvoice(inv.id)} className="h-6 w-6 p-0 text-red-500"><Trash2 className="h-3 w-3" /></Button></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            {/* Remarks Tab */}
            <TabsContent value="remarks" className="mt-3">
              <div className="border rounded-md">
                <div className="bg-gray-50 px-3 py-2 border-b"><h3 className="text-sm font-semibold">REMARKS</h3></div>
                <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1"><Label className="text-xs">Remarks</Label><Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={2} className="text-xs" /></div>
                  <div className="space-y-1"><Label className="text-xs">RO Remarks</Label><Textarea value={roRemarks} onChange={(e) => setRoRemarks(e.target.value)} rows={2} className="text-xs" /></div>
                  <div className="space-y-1"><Label className="text-xs">GP Remarks</Label><Textarea value={gpRemarks} onChange={(e) => setGpRemarks(e.target.value)} rows={2} className="text-xs" /></div>
                  <div className="space-y-1"><Label className="text-xs">Bill No</Label><Input value={billNo} onChange={(e) => setBillNo(e.target.value)} className="h-8 text-xs" /></div>
                  <div className="space-y-1"><Label className="text-xs">Supplementary Bill No</Label><Input value={supplementaryBillNo} onChange={(e) => setSupplementaryBillNo(e.target.value)} className="h-8 text-xs" /></div>
                </div>
              </div>
            </TabsContent>

            {/* Insurance Tab */}
            <TabsContent value="insurance" className="mt-3">
              <div className="border rounded-md">
                <div className="bg-gray-50 px-3 py-2 border-b"><h3 className="text-sm font-semibold">INSURANCE DETAILS</h3></div>
                <div className="p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div><Label className="text-xs">Insurance Covered By</Label><Select value={insuranceCoveredBy} onValueChange={setInsuranceCoveredBy}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{insuranceCoveredByOptions.map(opt => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent></Select></div>
                  <div><Label className="text-xs">Insurance #</Label><Input value={insuranceNo} onChange={(e) => setInsuranceNo(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Insurance Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-2 h-3 w-3" />{format(insuranceDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={insuranceDate} onSelect={(date) => date && setInsuranceDate(date)} /></PopoverContent></Popover></div>
                  <div><Label className="text-xs">Insurance Company</Label><Input value={insuranceCompany} onChange={(e) => setInsuranceCompany(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Bill No</Label><Input value={insuranceBillNo} onChange={(e) => setInsuranceBillNo(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Supplementary Bill No</Label><Input value={insuranceSupplementaryBillNo} onChange={(e) => setInsuranceSupplementaryBillNo(e.target.value)} className="h-8 text-xs" /></div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

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