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
  FileText,
  Printer,
  AlertCircle,
  Building,
  Users,
  Package,
  MessageSquare,
  Calculator,
  Shield,
  ChevronDown,
  ChevronRight as ChevronRightIcon,
  Loader2,
  CheckCircle,
  DollarSign,
  PlusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import toast from "react-hot-toast";

// Import API services
import {
  getBookings,
  createBooking,
  updateBooking,
  cancelBooking,
  restoreBooking,
  deleteBooking,
  getBookingStats,
  getClients,
  createClient,
  searchClient,
  getContentCategories,
  getPackingTypes,
  getBranches,
} from "@/services/api";

// Types
interface GoodsItem {
  id: number;
  noOfPckgs: number;
  contentCategory: string;
  contentSubCategory: string;
  content: string;
  packing: string;
  actualWeight: number;
  chargeWeight: number;
  isWeightValid: boolean;
  weightError?: string;
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

interface ClientData {
  _id?: string;
  id?: number;
  name: string;
  gstNumber: string;
  adhaarNumber: string;
  panNumber: string;
  address: string;
  city: string;
  state: string;
  mobile: string;
  email: string;
  dealerCode: string;
  iecCode: string;
  bankAdNo: string;
}

interface BookingRecord {
  _id?: string;
  id?: number;
  grNo: string;
  bookingFrom: string;
  bookingDate: Date;
  destination: string;
  pickupFrom: string;
  deliveryPoint: string;
  bookingType: string;
  collectionAt: string;
  consignorId: string;
  consignorName: string;
  consignorGst: string;
  consignorAdhaar: string;
  consignorPan: string;
  consignorMobile: string;
  consignorEmail: string;
  consignorDealerCode: string;
  consignorAddress: string;
  consignorCity: string;
  consignorState: string;
  consignorIec: string;
  consignorBankAd: string;
  consigneeId: string;
  consigneeName: string;
  consigneeGst: string;
  consigneeAdhaar: string;
  consigneePan: string;
  consigneeMobile: string;
  consigneeEmail: string;
  consigneeDealerCode: string;
  consigneeAddress: string;
  consigneeCity: string;
  consigneeState: string;
  consigneeIec: string;
  consigneeEximCode: string;
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
  { value: "DOOR_DELIVERY", label: "DOOR_DELIVERY" },
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

const cancelledReasonOptions = [
  "Customer Request", "Payment Issue", "Wrong Booking", "Duplicate Booking",
  "Vehicle Unavailable", "Route Not Available", "Other"
];

const idTypeOptions = ["Self", "GST Number", "Adhaar Number", "PAN Number"];

export default function BookingComputerizedGRL() {
  const [mainTab, setMainTab] = useState<"active" | "cancelled">("active");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "report">("report");
  const [isCancelledDialogOpen, setIsCancelledDialogOpen] = useState(false);
  const [cancellingBooking, setCancellingBooking] = useState<BookingRecord | null>(null);
  const [cancelledReason, setCancelledReason] = useState<string>("");

  // Static data from API
  const [contentCategories, setContentCategories] = useState<any[]>([]);
  const [packingTypes, setPackingTypes] = useState<any[]>([]);
  const [branchOptions, setBranchOptions] = useState<string[]>([]);
  const [clients, setClients] = useState<ClientData[]>([]);

  // Collapsible sections state
  const [isConsignorAddressOpen, setIsConsignorAddressOpen] = useState(false);
  const [isConsigneeAddressOpen, setIsConsigneeAddressOpen] = useState(false);

  // New Client Dialog
  const [isNewConsignorDialogOpen, setIsNewConsignorDialogOpen] = useState(false);
  const [isNewConsigneeDialogOpen, setIsNewConsigneeDialogOpen] = useState(false);
  const [newClientData, setNewClientData] = useState<Partial<ClientData>>({});

  // Consignor Selection
  const [consignorIdType, setConsignorIdType] = useState<string>("");
  const [consignorIdValue, setConsignorIdValue] = useState<string>("");
  const [consignorId, setConsignorId] = useState<string>("");
  const [consignorName, setConsignorName] = useState<string>("");
  const [consignorGst, setConsignorGst] = useState<string>("");
  const [consignorAdhaar, setConsignorAdhaar] = useState<string>("");
  const [consignorPan, setConsignorPan] = useState<string>("");
  const [consignorMobile, setConsignorMobile] = useState<string>("");
  const [consignorEmail, setConsignorEmail] = useState<string>("");
  const [consignorDealerCode, setConsignorDealerCode] = useState<string>("");
  const [consignorAddress, setConsignorAddress] = useState<string>("");
  const [consignorCity, setConsignorCity] = useState<string>("");
  const [consignorState, setConsignorState] = useState<string>("");
  const [consignorIec, setConsignorIec] = useState<string>("");
  const [consignorBankAd, setConsignorBankAd] = useState<string>("");

  // Consignee Selection
  const [consigneeIdType, setConsigneeIdType] = useState<string>("");
  const [consigneeIdValue, setConsigneeIdValue] = useState<string>("");
  const [consigneeId, setConsigneeId] = useState<string>("");
  const [consigneeName, setConsigneeName] = useState<string>("");
  const [consigneeGst, setConsigneeGst] = useState<string>("");
  const [consigneeAdhaar, setConsigneeAdhaar] = useState<string>("");
  const [consigneePan, setConsigneePan] = useState<string>("");
  const [consigneeMobile, setConsigneeMobile] = useState<string>("");
  const [consigneeEmail, setConsigneeEmail] = useState<string>("");
  const [consigneeDealerCode, setConsigneeDealerCode] = useState<string>("");
  const [consigneeAddress, setConsigneeAddress] = useState<string>("");
  const [consigneeCity, setConsigneeCity] = useState<string>("");
  const [consigneeState, setConsigneeState] = useState<string>("");
  const [consigneeIec, setConsigneeIec] = useState<string>("");
  const [consigneeEximCode, setConsigneeEximCode] = useState<string>("");

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

  // Goods Items
  const [goodsItems, setGoodsItems] = useState<GoodsItem[]>([
    { id: Date.now(), noOfPckgs: 0, contentCategory: "", contentSubCategory: "", content: "", packing: "BOX", actualWeight: 0, chargeWeight: 0, isWeightValid: true },
  ]);

  // Invoices
  const [invoices, setInvoices] = useState<InvoiceItem[]>([
    { id: Date.now(), invoiceNo: "", date: new Date(), value: "0", ewayBillNo: "", ewayBillDate: new Date(), validUpto: "" },
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
  const [totalPages, setTotalPages] = useState<number>(1);
  const [cancelledTotalPages, setCancelledTotalPages] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Stats
  const [stats, setStats] = useState({ active: { count: 0, totalFreight: 0 }, cancelled: { count: 0, totalFreight: 0 } });

  // Load static data on mount
  useEffect(() => {
    loadStaticData();
    loadBookings();
    loadStats();
    loadClients();
  }, []);

  // Calculate totals whenever goods items change
  useEffect(() => {
    calculateTotals();
  }, [goodsItems]);

  const loadStaticData = async () => {
    try {
      const [categoriesRes, packingRes, branchesRes] = await Promise.all([
        getContentCategories(),
        getPackingTypes(),
        getBranches()
      ]);
      setContentCategories(categoriesRes.data || []);
      setPackingTypes(packingRes.data || []);
      setBranchOptions(branchesRes.data || []);
    } catch (error) {
      console.error('Error loading static data:', error);
      toast.error('Failed to load static data');
    }
  };

  const loadClients = async () => {
    try {
      const response = await getClients({ limit: 100 });
      setClients(response.data || []);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const loadBookings = async () => {
    setLoading(true);
    try {
      const response = await getBookings({ status: 'active', limit: 100 });
      setSearchResults(response.data || []);
      setTotalPages(Math.ceil((response.pagination?.total || 0) / itemsPerPage));
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const loadCancelledBookings = async () => {
    setLoading(true);
    try {
      const response = await getBookings({ status: 'cancelled', limit: 100 });
      setCancelledSearchResults(response.data || []);
      setCancelledTotalPages(Math.ceil((response.pagination?.total || 0) / itemsPerPage));
    } catch (error) {
      console.error('Error loading cancelled bookings:', error);
      toast.error('Failed to load cancelled bookings');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await getBookingStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const validatePackageWeight = (item: GoodsItem): { isValid: boolean; error?: string } => {
    const packingType = packingTypes.find(p => p.name === item.packing);
    if (packingType && item.chargeWeight > 0 && item.noOfPckgs > 0) {
      const perPackageWeight = item.chargeWeight / item.noOfPckgs;
      if (perPackageWeight > packingType.maxWeight) {
        return { 
          isValid: false, 
          error: `Per package weight (${perPackageWeight.toFixed(2)} kg) exceeds limit for ${packingType.name} (Max: ${packingType.maxWeight} kg/package)` 
        };
      }
    }
    return { isValid: true };
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
    setGoodsItems(goodsItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        
        if (field === "contentCategory") {
          updated.contentSubCategory = "";
          updated.content = "";
        }
        if (field === "contentSubCategory") {
          const category = contentCategories.find(c => c.id === Number(item.contentCategory));
          const subCategory = category?.subCategories?.find((s: any) => s.id === Number(value));
          updated.content = subCategory?.name || "";
        }
        
        const validation = validatePackageWeight(updated);
        updated.isWeightValid = validation.isValid;
        updated.weightError = validation.error;
        
        return updated;
      }
      return item;
    }));
  };

  const addGoodsRow = () => {
    setGoodsItems([...goodsItems, { 
      id: Date.now(), noOfPckgs: 0, contentCategory: "", contentSubCategory: "", 
      content: "", packing: "BOX", actualWeight: 0, chargeWeight: 0, isWeightValid: true 
    }]);
    toast.success("New goods row added");
  };

  const removeGoodsRow = (id: number) => {
    if (goodsItems.length > 1) {
      setGoodsItems(goodsItems.filter(item => item.id !== id));
      toast.success("Goods row removed");
    }
  };

  const addInvoiceRow = () => {
    setInvoices([...invoices, { id: Date.now(), invoiceNo: "", date: new Date(), value: "0", ewayBillNo: "", ewayBillDate: new Date(), validUpto: "" }]);
    toast.success("New invoice row added");
  };

  const updateInvoice = (id: number, field: keyof InvoiceItem, value: any) => {
    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, [field]: value } : inv));
  };

  const removeInvoice = (id: number) => {
    if (invoices.length > 1) {
      setInvoices(invoices.filter(inv => inv.id !== id));
      toast.success("Invoice row removed");
    }
  };

  const handleConsignorSearch = async () => {
    if (!consignorIdType) {
      toast.error("Please select ID type");
      return;
    }
    if (consignorIdType === "Self") {
      setConsignorId("self");
      setConsignorName("Self");
      setConsignorGst("");
      setConsignorAdhaar("");
      setConsignorPan("");
      setConsignorMobile("");
      setConsignorEmail("");
      setConsignorDealerCode("");
      setConsignorAddress("");
      setConsignorCity("");
      setConsignorState("");
      setConsignorIec("");
      setConsignorBankAd("");
      toast.success("Self selected - No ID required");
      return;
    }
    if (!consignorIdValue) {
      toast.error("Please enter ID value");
      return;
    }
    
    try {
      const response = await searchClient(consignorIdType, consignorIdValue);
      if (response.data) {
        const client = response.data;
        setConsignorId(client._id || "");
        setConsignorName(client.name);
        setConsignorGst(client.gstNumber || "");
        setConsignorAdhaar(client.adhaarNumber || "");
        setConsignorPan(client.panNumber || "");
        setConsignorMobile(client.mobile || "");
        setConsignorEmail(client.email || "");
        setConsignorDealerCode(client.dealerCode || "");
        setConsignorAddress(client.address || "");
        setConsignorCity(client.city || "");
        setConsignorState(client.state || "");
        setConsignorIec(client.iecCode || "");
        setConsignorBankAd(client.bankAdNo || "");
        toast.success(`Consignor "${client.name}" loaded successfully!`);
      } else {
        toast.error("Client not found. Please add new client.");
        setIsNewConsignorDialogOpen(true);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error("Error searching client");
      setIsNewConsignorDialogOpen(true);
    }
  };

  const handleConsigneeSearch = async () => {
    if (!consigneeIdType) {
      toast.error("Please select ID type");
      return;
    }
    if (consigneeIdType === "Self") {
      setConsigneeId("self");
      setConsigneeName("Self");
      setConsigneeGst("");
      setConsigneeAdhaar("");
      setConsigneePan("");
      setConsigneeMobile("");
      setConsigneeEmail("");
      setConsigneeDealerCode("");
      setConsigneeAddress("");
      setConsigneeCity("");
      setConsigneeState("");
      setConsigneeIec("");
      setConsigneeEximCode("");
      toast.success("Self selected - No ID required");
      return;
    }
    if (!consigneeIdValue) {
      toast.error("Please enter ID value");
      return;
    }
    
    try {
      const response = await searchClient(consigneeIdType, consigneeIdValue);
      if (response.data) {
        const client = response.data;
        setConsigneeId(client._id || "");
        setConsigneeName(client.name);
        setConsigneeGst(client.gstNumber || "");
        setConsigneeAdhaar(client.adhaarNumber || "");
        setConsigneePan(client.panNumber || "");
        setConsigneeMobile(client.mobile || "");
        setConsigneeEmail(client.email || "");
        setConsigneeDealerCode(client.dealerCode || "");
        setConsigneeAddress(client.address || "");
        setConsigneeCity(client.city || "");
        setConsigneeState(client.state || "");
        setConsigneeIec(client.iecCode || "");
        toast.success(`Consignee "${client.name}" loaded successfully!`);
      } else {
        toast.error("Client not found. Please add new client.");
        setIsNewConsigneeDialogOpen(true);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error("Error searching client");
      setIsNewConsigneeDialogOpen(true);
    }
  };

  const addNewClient = async (type: "consignor" | "consignee") => {
    if (!newClientData.name) {
      toast.error("Please enter client name");
      return;
    }
    
    try {
      const response = await createClient({
        name: newClientData.name,
        gstNumber: newClientData.gstNumber || "",
        adhaarNumber: newClientData.adhaarNumber || "",
        panNumber: newClientData.panNumber || "",
        address: newClientData.address || "",
        city: newClientData.city || "",
        state: newClientData.state || "",
        mobile: newClientData.mobile || "",
        email: newClientData.email || "",
        dealerCode: newClientData.dealerCode || "",
        iecCode: newClientData.iecCode || "",
        bankAdNo: newClientData.bankAdNo || "",
      });
      
      const newClient = response.data;
      await loadClients();
      
      if (type === "consignor") {
        setConsignorId(newClient._id || "");
        setConsignorName(newClient.name);
        setConsignorGst(newClient.gstNumber);
        setConsignorAdhaar(newClient.adhaarNumber);
        setConsignorPan(newClient.panNumber);
        setConsignorMobile(newClient.mobile);
        setConsignorEmail(newClient.email);
        setConsignorDealerCode(newClient.dealerCode);
        setConsignorAddress(newClient.address);
        setConsignorCity(newClient.city);
        setConsignorState(newClient.state);
        setConsignorIec(newClient.iecCode);
        setConsignorBankAd(newClient.bankAdNo);
        setIsNewConsignorDialogOpen(false);
        toast.success(`Consignor "${newClient.name}" added successfully!`);
      } else {
        setConsigneeId(newClient._id || "");
        setConsigneeName(newClient.name);
        setConsigneeGst(newClient.gstNumber);
        setConsigneeAdhaar(newClient.adhaarNumber);
        setConsigneePan(newClient.panNumber);
        setConsigneeMobile(newClient.mobile);
        setConsigneeEmail(newClient.email);
        setConsigneeDealerCode(newClient.dealerCode);
        setConsigneeAddress(newClient.address);
        setConsigneeCity(newClient.city);
        setConsigneeState(newClient.state);
        setConsigneeIec(newClient.iecCode);
        setIsNewConsigneeDialogOpen(false);
        toast.success(`Consignee "${newClient.name}" added successfully!`);
      }
      setNewClientData({});
    } catch (error: any) {
      console.error('Add client error:', error);
      toast.error(error.response?.data?.message || "Failed to add client");
    }
  };

  const handlePrint = () => {
    window.print();
    toast.success("Print dialog opened");
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear all form data?")) {
      resetForm();
      toast.success("Form cleared");
    }
  };

  const resetForm = () => {
    setGrNo("");
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
    
    setConsignorIdType("");
    setConsignorIdValue("");
    setConsignorId("");
    setConsignorName("");
    setConsignorGst("");
    setConsignorAdhaar("");
    setConsignorPan("");
    setConsignorMobile("");
    setConsignorEmail("");
    setConsignorDealerCode("");
    setConsignorAddress("");
    setConsignorCity("");
    setConsignorState("");
    setConsignorIec("");
    setConsignorBankAd("");
    
    setConsigneeIdType("");
    setConsigneeIdValue("");
    setConsigneeId("");
    setConsigneeName("");
    setConsigneeGst("");
    setConsigneeAdhaar("");
    setConsigneePan("");
    setConsigneeMobile("");
    setConsigneeEmail("");
    setConsigneeDealerCode("");
    setConsigneeAddress("");
    setConsigneeCity("");
    setConsigneeState("");
    setConsigneeIec("");
    setConsigneeEximCode("");
    
    setGoodsItems([{ id: Date.now(), noOfPckgs: 0, contentCategory: "", contentSubCategory: "", content: "", packing: "BOX", actualWeight: 0, chargeWeight: 0, isWeightValid: true }]);
    setInvoices([{ id: Date.now(), invoiceNo: "", date: new Date(), value: "0", ewayBillNo: "", ewayBillDate: new Date(), validUpto: "" }]);
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
    setIsConsignorAddressOpen(false);
    setIsConsigneeAddressOpen(false);
  };

  const handleSave = async () => {
    console.log("=== SAVE BUTTON CLICKED ===");
    
    // Validation
    if (!bookingFrom) { 
      toast.error("Please enter Booking From"); 
      return; 
    }
    if (!destination) { 
      toast.error("Please enter Destination"); 
      return; 
    }
    if (!consignorName) { 
      toast.error("Please select Consignor"); 
      return; 
    }
    if (!consigneeName) { 
      toast.error("Please select Consignee"); 
      return; 
    }
    
    const hasWeightError = goodsItems.some(item => !item.isWeightValid);
    if (hasWeightError) {
      toast.error("Please fix weight validation errors before saving");
      return;
    }

    setLoading(true);
    
    const bookingData = {
      bookingFrom, 
      bookingDate, 
      destination, 
      pickupFrom, 
      deliveryPoint,
      bookingType, 
      collectionAt,
      consignorId: consignorId === "self" ? "" : consignorId,
      consignorName, 
      consignorGst, 
      consignorAdhaar, 
      consignorPan,
      consignorMobile, 
      consignorEmail, 
      consignorDealerCode, 
      consignorAddress,
      consignorCity, 
      consignorState, 
      consignorIec, 
      consignorBankAd,
      consigneeId: consigneeId === "self" ? "" : consigneeId,
      consigneeName, 
      consigneeGst, 
      consigneeAdhaar, 
      consigneePan,
      consigneeMobile, 
      consigneeEmail, 
      consigneeDealerCode, 
      consigneeAddress,
      consigneeCity, 
      consigneeState, 
      consigneeIec, 
      consigneeEximCode,
      pvtMarkaSealNo, 
      serviceProduct, 
      deliveryType, 
      loadType, 
      mkExecutive, 
      freightOn,
      manualRates, 
      ncv, 
      printAfterSave, 
      ccAttached,
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
      goodsItems: goodsItems.map(({ id, ...rest }) => rest),
      invoices: invoices.map(({ id, ...rest }) => ({ 
        ...rest, 
        date: rest.date, 
        ewayBillDate: rest.ewayBillDate 
      })),
    };

    console.log("Sending booking data:", JSON.stringify(bookingData, null, 2));

    try {
      let response;
      if (editMode && currentEditId) {
        response = await updateBooking(currentEditId, bookingData);
        toast.success("Booking updated successfully!");
      } else {
        response = await createBooking(bookingData);
        toast.success(`Booking created successfully! GR No: ${response.data.grNo}`);
      }
      
      await loadBookings();
      await loadStats();
      
      if (printAfterSave) handlePrint();
      resetForm();
      setIsBookingModalOpen(false);
    } catch (error: any) {
      console.error('Save error:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to save booking. Check console for details.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!cancelledReason) { 
      toast.error("Please select cancellation reason"); 
      return; 
    }
    if (cancellingBooking) {
      setLoading(true);
      try {
        await cancelBooking(cancellingBooking._id!, cancelledReason);
        toast.success(`Booking ${cancellingBooking.grNo} cancelled!`);
        await loadBookings();
        await loadCancelledBookings();
        await loadStats();
        setIsCancelledDialogOpen(false);
        setCancellingBooking(null);
        setCancelledReason("");
      } catch (error: any) {
        console.error('Cancel error:', error);
        toast.error(error.response?.data?.message || "Failed to cancel booking");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRestoreBooking = async (record: BookingRecord) => {
    if (confirm(`Restore booking ${record.grNo}?`)) {
      setLoading(true);
      try {
        await restoreBooking(record._id!);
        toast.success(`Booking ${record.grNo} restored!`);
        await loadBookings();
        await loadCancelledBookings();
        await loadStats();
      } catch (error: any) {
        console.error('Restore error:', error);
        toast.error(error.response?.data?.message || "Failed to restore booking");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Permanently delete this booking? This action cannot be undone.")) {
      setLoading(true);
      try {
        await deleteBooking(id);
        toast.success("Booking deleted permanently!");
        await loadBookings();
        await loadCancelledBookings();
        await loadStats();
      } catch (error: any) {
        console.error('Delete error:', error);
        toast.error(error.response?.data?.message || "Failed to delete booking");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const filters: any = { status: 'active', limit: 100 };
      if (searchGrNo) filters.grNo = searchGrNo;
      if (searchFromDate) filters.fromDate = searchFromDate.toISOString();
      if (searchToDate) filters.toDate = searchToDate.toISOString();
      if (searchBranch !== "all") filters.branch = searchBranch;
      
      const response = await getBookings(filters);
      setSearchResults(response.data || []);
      setTotalPages(Math.ceil((response.pagination?.total || 0) / itemsPerPage));
      setCurrentPage(1);
      toast.success(`Found ${response.data?.length || 0} bookings`);
    } catch (error: any) {
      console.error('Search error:', error);
      toast.error(error.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelledSearch = async () => {
    setLoading(true);
    try {
      const filters: any = { status: 'cancelled', limit: 100 };
      if (searchGrNo) filters.grNo = searchGrNo;
      if (searchFromDate) filters.fromDate = searchFromDate.toISOString();
      if (searchToDate) filters.toDate = searchToDate.toISOString();
      if (searchBranch !== "all") filters.branch = searchBranch;
      
      const response = await getBookings(filters);
      setCancelledSearchResults(response.data || []);
      setCancelledTotalPages(Math.ceil((response.pagination?.total || 0) / itemsPerPage));
      setCancelledCurrentPage(1);
      toast.success(`Found ${response.data?.length || 0} cancelled bookings`);
    } catch (error: any) {
      console.error('Search error:', error);
      toast.error(error.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchGrNo("");
    setSearchFromDate(new Date());
    setSearchToDate(new Date());
    setSearchBranch("all");
    loadBookings();
    loadCancelledBookings();
    toast.success("Search filters cleared");
  };

  const handleEdit = (record: BookingRecord) => {
    setEditMode(true);
    setCurrentEditId(record._id!);
    setGrNo(record.grNo);
    setBookingFrom(record.bookingFrom);
    setBookingDate(new Date(record.bookingDate));
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
    
    setConsignorId(String(record.consignorId));
    setConsignorName(record.consignorName);
    setConsignorGst(record.consignorGst);
    setConsignorAdhaar(record.consignorAdhaar);
    setConsignorPan(record.consignorPan);
    setConsignorMobile(record.consignorMobile);
    setConsignorEmail(record.consignorEmail);
    setConsignorDealerCode(record.consignorDealerCode);
    setConsignorAddress(record.consignorAddress);
    setConsignorCity(record.consignorCity);
    setConsignorState(record.consignorState);
    setConsignorIec(record.consignorIec);
    setConsignorBankAd(record.consignorBankAd);
    
    setConsigneeId(String(record.consigneeId));
    setConsigneeName(record.consigneeName);
    setConsigneeGst(record.consigneeGst);
    setConsigneeAdhaar(record.consigneeAdhaar);
    setConsigneePan(record.consigneePan);
    setConsigneeMobile(record.consigneeMobile);
    setConsigneeEmail(record.consigneeEmail);
    setConsigneeDealerCode(record.consigneeDealerCode);
    setConsigneeAddress(record.consigneeAddress);
    setConsigneeCity(record.consigneeCity);
    setConsigneeState(record.consigneeState);
    setConsigneeIec(record.consigneeIec);
    setConsigneeEximCode(record.consigneeEximCode);
    
    setGoodsItems(record.goodsItems.map((item, idx) => ({ ...item, id: Date.now() + idx })));
    setInvoices(record.invoices.map((inv, idx) => ({ ...inv, id: Date.now() + idx })));
    setRemarks(record.remarks);
    setRoRemarks(record.roRemarks);
    setGpRemarks(record.gpRemarks);
    setBillNo(record.billNo);
    setSupplementaryBillNo(record.supplementaryBillNo);
    setInsuranceCoveredBy(record.insuranceCoveredBy);
    setInsuranceNo(record.insuranceNo);
    setInsuranceDate(new Date(record.insuranceDate));
    setInsuranceCompany(record.insuranceCompany);
    setTotalPckgs(record.totalPckgs);
    setTotalActualWeight(record.totalActualWeight);
    setTotalChargeWeight(record.totalChargeWeight);
    setTotalFreight(record.totalFreight);
    setIsBookingModalOpen(true);
  };

  const openAddModal = () => {
    resetForm();
    setEditMode(false);
    setCurrentEditId(null);
    setGrNo("");
    setIsBookingModalOpen(true);
  };

  const openCancelDialog = (record: BookingRecord) => {
    setCancellingBooking(record);
    setCancelledReason("");
    setIsCancelledDialogOpen(true);
  };

  const activeStats = {
    total: stats.active.count,
    totalFreight: stats.active.totalFreight,
  };

  const cancelledStats = {
    total: stats.cancelled.count,
    totalFreight: stats.cancelled.totalFreight,
  };

  const paginatedResults = searchResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const paginatedCancelledResults = cancelledSearchResults.slice((cancelledCurrentPage - 1) * itemsPerPage, cancelledCurrentPage * itemsPerPage);

  return (
    <div className="space-y-4 p-4 md:p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-wrap justify-between items-start gap-3">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">BOOKING COMPUTERIZED GRL</h1>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
              <span>🏢 Company: GOLDEN ROADWAYS &amp; LOGISTICS PVT LTD</span>
              <span>👤 Login: MAYANK.GRLOGISTICS@GMAIL.COM</span>
              <span>📍 Branch: CORPORATE OFFICE</span>
              <span>📅 Financial Year: 2026-2027</span>
            </div>
          </div>
          <Button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />New Booking
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b bg-white rounded-t-lg">
        <button 
          onClick={() => { setMainTab("active"); loadBookings(); }} 
          className={cn("px-6 py-2.5 text-sm font-medium rounded-t-lg transition-colors", 
            mainTab === "active" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100")}
        >
          Active Bookings
        </button>
        <button 
          onClick={() => { setMainTab("cancelled"); loadCancelledBookings(); }} 
          className={cn("px-6 py-2.5 text-sm font-medium rounded-t-lg transition-colors", 
            mainTab === "cancelled" ? "bg-red-600 text-white" : "text-gray-600 hover:bg-gray-100")}
        >
          Cancelled Bookings
        </button>
      </div>

      {/* Active Tab Content */}
      {mainTab === "active" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm opacity-90">Total Active</p>
                    <p className="text-2xl font-bold">{activeStats.total}</p>
                  </div>
                  <FileText className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm opacity-90">Total Freight</p>
                    <p className="text-2xl font-bold">₹{activeStats.totalFreight.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                <Search className="h-4 w-4 inline mr-1" />Search Active Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                <div>
                  <Label className="text-sm">From Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-9 w-full text-sm justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(searchFromDate, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="z-[10000]">
                      <Calendar mode="single" selected={searchFromDate} onSelect={(d) => d && setSearchFromDate(d)} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label className="text-sm">To Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-9 w-full text-sm justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(searchToDate, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="z-[10000]">
                      <Calendar mode="single" selected={searchToDate} onSelect={(d) => d && setSearchToDate(d)} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label className="text-sm">GR No.</Label>
                  <Input 
                    value={searchGrNo} 
                    onChange={(e) => setSearchGrNo(e.target.value)} 
                    placeholder="Enter GR Number" 
                    className="h-9 text-sm" 
                  />
                </div>
                <div>
                  <Label className="text-sm">Branch</Label>
                  <Select value={searchBranch} onValueChange={setSearchBranch}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="All Branches" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Branches</SelectItem>
                      {branchOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 items-end">
                  <Button onClick={handleSearch} className="h-9 text-sm bg-blue-600" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Search className="h-4 w-4 mr-1" />}
                    Search
                  </Button>
                  <Button onClick={handleClearSearch} variant="outline" className="h-9 text-sm">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button onClick={() => setViewMode("report")} variant={viewMode === "report" ? "default" : "outline"} size="sm" className="h-8 text-sm">
              <FileText className="h-4 w-4 mr-1" />Report
            </Button>
            <Button onClick={() => setViewMode("grid")} variant={viewMode === "grid" ? "default" : "outline"} size="sm" className="h-8 text-sm">
              <Package className="h-4 w-4 mr-1" />Grid
            </Button>
          </div>

          {loading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Loader2 className="h-12 w-12 mx-auto text-blue-500 animate-spin" />
                <p className="text-gray-500 mt-2">Loading bookings...</p>
              </CardContent>
            </Card>
          ) : viewMode === "report" && searchResults.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="text-sm p-3">#</TableHead>
                        <TableHead className="text-sm p-3">GR No.</TableHead>
                        <TableHead className="text-sm p-3">Date</TableHead>
                        <TableHead className="text-sm p-3">From</TableHead>
                        <TableHead className="text-sm p-3">To</TableHead>
                        <TableHead className="text-sm p-3">Consignor</TableHead>
                        <TableHead className="text-sm p-3">Consignee</TableHead>
                        <TableHead className="text-sm p-3 text-right">Freight</TableHead>
                        <TableHead className="text-sm p-3 text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedResults.map((r, idx) => (
                        <TableRow key={r._id} className="hover:bg-gray-50">
                          <TableCell className="text-sm p-3">{(currentPage-1)*itemsPerPage+idx+1}</TableCell>
                          <TableCell className="text-sm p-3 font-mono font-bold">
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700">{r.grNo}</Badge>
                          </TableCell>
                          <TableCell className="text-sm p-3">{format(new Date(r.bookingDate), "dd-MM-yyyy")}</TableCell>
                          <TableCell className="text-sm p-3">{r.bookingFrom}</TableCell>
                          <TableCell className="text-sm p-3">{r.destination}</TableCell>
                          <TableCell className="text-sm p-3 truncate max-w-[150px]" title={r.consignorName}>
                            {r.consignorName}
                          </TableCell>
                          <TableCell className="text-sm p-3 truncate max-w-[150px]" title={r.consigneeName}>
                            {r.consigneeName}
                          </TableCell>
                          <TableCell className="text-sm p-3 text-right font-semibold">₹{r.totalFreight.toLocaleString()}</TableCell>
                          <TableCell className="text-sm p-3 text-center">
                            <div className="flex gap-1 justify-center">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleEdit(r)} 
                                className="h-8 w-8 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => openCancelDialog(r)} 
                                className="h-8 w-8 p-0 text-orange-500 hover:text-orange-700 hover:bg-orange-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDelete(r._id!)} 
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 p-4 border-t">
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>
                      Previous
                    </Button>
                    <span className="px-4 py-2 text-sm">Page {currentPage} of {totalPages}</span>
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>
                      Next
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : searchResults.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-gray-400" />
                <p className="text-gray-500 mt-2">No active bookings found</p>
              </CardContent>
            </Card>
          ) : null}
        </>
      )}

      {/* Cancelled Tab Content */}
      {mainTab === "cancelled" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm opacity-90">Total Cancelled</p>
                    <p className="text-2xl font-bold">{cancelledStats.total}</p>
                  </div>
                  <X className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm opacity-90">Freight Lost</p>
                    <p className="text-2xl font-bold">₹{cancelledStats.totalFreight.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                <Search className="h-4 w-4 inline mr-1" />Search Cancelled Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                <div>
                  <Label className="text-sm">From Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-9 w-full text-sm justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(searchFromDate, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="z-[10000]">
                      <Calendar mode="single" selected={searchFromDate} onSelect={(d) => d && setSearchFromDate(d)} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label className="text-sm">To Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-9 w-full text-sm justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(searchToDate, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="z-[10000]">
                      <Calendar mode="single" selected={searchToDate} onSelect={(d) => d && setSearchToDate(d)} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label className="text-sm">GR No.</Label>
                  <Input value={searchGrNo} onChange={(e) => setSearchGrNo(e.target.value)} className="h-9 text-sm" />
                </div>
                <div>
                  <Label className="text-sm">Branch</Label>
                  <Select value={searchBranch} onValueChange={setSearchBranch}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="All Branches" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Branches</SelectItem>
                      {branchOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 items-end">
                  <Button onClick={handleCancelledSearch} className="h-9 text-sm bg-red-600" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Search className="h-4 w-4 mr-1" />}
                    Search
                  </Button>
                  <Button onClick={handleClearSearch} variant="outline" className="h-9 text-sm">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Loader2 className="h-12 w-12 mx-auto text-red-500 animate-spin" />
                <p className="text-gray-500 mt-2">Loading cancelled bookings...</p>
              </CardContent>
            </Card>
          ) : viewMode === "report" && cancelledSearchResults.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="text-sm p-3">#</TableHead>
                        <TableHead className="text-sm p-3">GR No.</TableHead>
                        <TableHead className="text-sm p-3">Date</TableHead>
                        <TableHead className="text-sm p-3">From</TableHead>
                        <TableHead className="text-sm p-3">To</TableHead>
                        <TableHead className="text-sm p-3">Consignor</TableHead>
                        <TableHead className="text-sm p-3">Consignee</TableHead>
                        <TableHead className="text-sm p-3 text-right">Freight</TableHead>
                        <TableHead className="text-sm p-3">Cancel Date</TableHead>
                        <TableHead className="text-sm p-3">Reason</TableHead>
                        <TableHead className="text-sm p-3 text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedCancelledResults.map((r, idx) => (
                        <TableRow key={r._id} className="bg-red-50/30 hover:bg-red-50">
                          <TableCell className="text-sm p-3">{(cancelledCurrentPage-1)*itemsPerPage+idx+1}</TableCell>
                          <TableCell className="text-sm p-3">
                            <Badge variant="secondary" className="bg-red-100 text-red-700">{r.grNo}</Badge>
                          </TableCell>
                          <TableCell className="text-sm p-3">{format(new Date(r.bookingDate), "dd-MM-yyyy")}</TableCell>
                          <TableCell className="text-sm p-3">{r.bookingFrom}</TableCell>
                          <TableCell className="text-sm p-3">{r.destination}</TableCell>
                          <TableCell className="text-sm p-3 truncate max-w-[150px]">{r.consignorName}</TableCell>
                          <TableCell className="text-sm p-3 truncate max-w-[150px]">{r.consigneeName}</TableCell>
                          <TableCell className="text-sm p-3 text-right">₹{r.totalFreight.toLocaleString()}</TableCell>
                          <TableCell className="text-sm p-3">{r.cancelledDate ? format(new Date(r.cancelledDate), "dd-MM-yyyy") : "-"}</TableCell>
                          <TableCell className="text-sm p-3 truncate max-w-[150px]" title={r.cancelledReason}>
                            {r.cancelledReason}
                          </TableCell>
                          <TableCell className="text-sm p-3 text-center">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRestoreBooking(r)} 
                              className="h-8 w-8 p-0 text-green-500 hover:text-green-700 hover:bg-green-50"
                              title="Restore Booking"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {cancelledTotalPages > 1 && (
                  <div className="flex justify-center gap-2 p-4 border-t">
                    <Button variant="outline" size="sm" onClick={() => setCancelledCurrentPage(prev => Math.max(1, prev - 1))} disabled={cancelledCurrentPage === 1}>
                      Previous
                    </Button>
                    <span className="px-4 py-2 text-sm">Page {cancelledCurrentPage} of {cancelledTotalPages}</span>
                    <Button variant="outline" size="sm" onClick={() => setCancelledCurrentPage(prev => Math.min(cancelledTotalPages, prev + 1))} disabled={cancelledCurrentPage === cancelledTotalPages}>
                      Next
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : cancelledSearchResults.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <X className="h-12 w-12 mx-auto text-gray-400" />
                <p className="text-gray-500 mt-2">No cancelled bookings found</p>
              </CardContent>
            </Card>
          ) : null}
        </>
      )}

      {/* Cancel Dialog */}
      <Dialog open={isCancelledDialogOpen} onOpenChange={setIsCancelledDialogOpen}>
        <DialogContent className="z-[9999]">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <X className="h-5 w-5" />Cancel Booking
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel {cancellingBooking?.grNo}?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label className="text-sm font-semibold">Cancellation Reason *</Label>
            <Select value={cancelledReason} onValueChange={setCancelledReason}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select cancellation reason" />
              </SelectTrigger>
              <SelectContent>
                {cancelledReasonOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelledDialogOpen(false)}>No, Keep</Button>
            <Button variant="destructive" onClick={handleCancelBooking} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Yes, Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Consignor Dialog */}
      <Dialog open={isNewConsignorDialogOpen} onOpenChange={setIsNewConsignorDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto z-[9999]">
          <DialogHeader>
            <DialogTitle>Add New Consignor</DialogTitle>
            <DialogDescription>Enter consignor details below</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div><Label className="text-sm">Name *</Label><Input value={newClientData.name || ""} onChange={(e) => setNewClientData({...newClientData, name: e.target.value})} className="h-9 text-sm" /></div>
            <div><Label className="text-sm">GST Number</Label><Input value={newClientData.gstNumber || ""} onChange={(e) => setNewClientData({...newClientData, gstNumber: e.target.value})} className="h-9 text-sm uppercase" /></div>
            <div><Label className="text-sm">Adhaar Number</Label><Input value={newClientData.adhaarNumber || ""} onChange={(e) => setNewClientData({...newClientData, adhaarNumber: e.target.value})} className="h-9 text-sm" /></div>
            <div><Label className="text-sm">PAN Number</Label><Input value={newClientData.panNumber || ""} onChange={(e) => setNewClientData({...newClientData, panNumber: e.target.value})} className="h-9 text-sm uppercase" /></div>
            <div><Label className="text-sm">Mobile No.</Label><Input value={newClientData.mobile || ""} onChange={(e) => setNewClientData({...newClientData, mobile: e.target.value})} className="h-9 text-sm" /></div>
            <div><Label className="text-sm">Email</Label><Input value={newClientData.email || ""} onChange={(e) => setNewClientData({...newClientData, email: e.target.value})} className="h-9 text-sm" /></div>
            <div><Label className="text-sm">Address</Label><Input value={newClientData.address || ""} onChange={(e) => setNewClientData({...newClientData, address: e.target.value})} className="h-9 text-sm" /></div>
            <div><Label className="text-sm">City</Label><Input value={newClientData.city || ""} onChange={(e) => setNewClientData({...newClientData, city: e.target.value})} className="h-9 text-sm" /></div>
            <div><Label className="text-sm">State</Label><Input value={newClientData.state || ""} onChange={(e) => setNewClientData({...newClientData, state: e.target.value})} className="h-9 text-sm" /></div>
            <div><Label className="text-sm">Dealer Code</Label><Input value={newClientData.dealerCode || ""} onChange={(e) => setNewClientData({...newClientData, dealerCode: e.target.value})} className="h-9 text-sm" /></div>
            <div><Label className="text-sm">IEC Code</Label><Input value={newClientData.iecCode || ""} onChange={(e) => setNewClientData({...newClientData, iecCode: e.target.value})} className="h-9 text-sm" /></div>
            <div><Label className="text-sm">Bank AD No.</Label><Input value={newClientData.bankAdNo || ""} onChange={(e) => setNewClientData({...newClientData, bankAdNo: e.target.value})} className="h-9 text-sm" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewConsignorDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => addNewClient("consignor")} className="bg-blue-600" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Add Consignor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Consignee Dialog */}
      <Dialog open={isNewConsigneeDialogOpen} onOpenChange={setIsNewConsigneeDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto z-[9999]">
          <DialogHeader>
            <DialogTitle>Add New Consignee</DialogTitle>
            <DialogDescription>Enter consignee details below</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div><Label className="text-sm">Name *</Label><Input value={newClientData.name || ""} onChange={(e) => setNewClientData({...newClientData, name: e.target.value})} className="h-9 text-sm" /></div>
            <div><Label className="text-sm">GST Number</Label><Input value={newClientData.gstNumber || ""} onChange={(e) => setNewClientData({...newClientData, gstNumber: e.target.value})} className="h-9 text-sm uppercase" /></div>
            <div><Label className="text-sm">Adhaar Number</Label><Input value={newClientData.adhaarNumber || ""} onChange={(e) => setNewClientData({...newClientData, adhaarNumber: e.target.value})} className="h-9 text-sm" /></div>
            <div><Label className="text-sm">PAN Number</Label><Input value={newClientData.panNumber || ""} onChange={(e) => setNewClientData({...newClientData, panNumber: e.target.value})} className="h-9 text-sm uppercase" /></div>
            <div><Label className="text-sm">Mobile No.</Label><Input value={newClientData.mobile || ""} onChange={(e) => setNewClientData({...newClientData, mobile: e.target.value})} className="h-9 text-sm" /></div>
            <div><Label className="text-sm">Email</Label><Input value={newClientData.email || ""} onChange={(e) => setNewClientData({...newClientData, email: e.target.value})} className="h-9 text-sm" /></div>
            <div><Label className="text-sm">Address</Label><Input value={newClientData.address || ""} onChange={(e) => setNewClientData({...newClientData, address: e.target.value})} className="h-9 text-sm" /></div>
            <div><Label className="text-sm">City</Label><Input value={newClientData.city || ""} onChange={(e) => setNewClientData({...newClientData, city: e.target.value})} className="h-9 text-sm" /></div>
            <div><Label className="text-sm">State</Label><Input value={newClientData.state || ""} onChange={(e) => setNewClientData({...newClientData, state: e.target.value})} className="h-9 text-sm" /></div>
            <div><Label className="text-sm">Dealer Code</Label><Input value={newClientData.dealerCode || ""} onChange={(e) => setNewClientData({...newClientData, dealerCode: e.target.value})} className="h-9 text-sm" /></div>
            <div><Label className="text-sm">IEC Code</Label><Input value={newClientData.iecCode || ""} onChange={(e) => setNewClientData({...newClientData, iecCode: e.target.value})} className="h-9 text-sm" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewConsigneeDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => addNewClient("consignee")} className="bg-blue-600" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Add Consignee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Booking Modal */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="w-[95vw] max-w-6xl h-[90vh] max-h-[90vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="sticky top-0 bg-white z-10 px-6 pt-6 pb-3 border-b shrink-0">
            <DialogTitle className="text-xl">{editMode ? "Edit Booking" : "Create New Booking"}</DialogTitle>
            <DialogDescription>Fill in all booking details below.</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 justify-end sticky top-0 bg-white py-2 z-10 border-b">
              <Button variant="outline" size="sm" className="h-8 text-sm" onClick={addGoodsRow}>
                <PlusCircle className="mr-1 h-4 w-4" /> Add Goods
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-sm">
                <Calculator className="mr-1 h-4 w-4" /> Manual Rates
              </Button>
              <Button onClick={calculateTotals} size="sm" className="h-8 text-sm bg-green-600">
                <Calculator className="mr-1 h-4 w-4" /> Calculate Freight
              </Button>
            </div>

            {/* Basic Information */}
            <div className="border rounded-lg p-4">
              <h3 className="text-base font-semibold mb-3 flex items-center gap-2 text-blue-600">
                <FileText className="h-5 w-5" /> Basic Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm">GR #</Label>
                  <Input value={grNo} readOnly className="h-9 text-sm bg-gray-50" placeholder="Auto-generated" />
                </div>
                <div>
                  <Label className="text-sm">Booking From <span className="text-red-500">*</span></Label>
                  <Input value={bookingFrom} onChange={(e) => setBookingFrom(e.target.value)} className="h-9 text-sm" placeholder="Enter source branch" />
                </div>
                <div>
                  <Label className="text-sm">Booking Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-9 w-full text-sm justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(bookingDate, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="z-[10000]">
                      <Calendar mode="single" selected={bookingDate} onSelect={(d) => d && setBookingDate(d)} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label className="text-sm">Destination <span className="text-red-500">*</span></Label>
                  <Input value={destination} onChange={(e) => setDestination(e.target.value)} className="h-9 text-sm" placeholder="Enter destination" />
                </div>
                <div>
                  <Label className="text-sm">Pickup From</Label>
                  <Input value={pickupFrom} onChange={(e) => setPickupFrom(e.target.value)} className="h-9 text-sm" />
                </div>
                <div>
                  <Label className="text-sm">Delivery Point</Label>
                  <Input value={deliveryPoint} onChange={(e) => setDeliveryPoint(e.target.value)} className="h-9 text-sm" />
                </div>
                <div>
                  <Label className="text-sm">Booking Type <span className="text-red-500">*</span></Label>
                  <Select value={bookingType} onValueChange={setBookingType}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="SELECT" /></SelectTrigger>
                    <SelectContent>{bookingTypeOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm">Collection At <span className="text-red-500">*</span></Label>
                  <Input value={collectionAt} onChange={(e) => setCollectionAt(e.target.value)} className="h-9 text-sm" />
                </div>
                <div>
                  <Label className="text-sm">Pvt Marka/Seal No</Label>
                  <Input value={pvtMarkaSealNo} onChange={(e) => setPvtMarkaSealNo(e.target.value)} className="h-9 text-sm" />
                </div>
                <div>
                  <Label className="text-sm">Service/Product <span className="text-red-500">*</span></Label>
                  <Select value={serviceProduct} onValueChange={setServiceProduct}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="SELECT" /></SelectTrigger>
                    <SelectContent>{serviceProductOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm">Delivery Type <span className="text-red-500">*</span></Label>
                  <Select value={deliveryType} onValueChange={setDeliveryType}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="SELECT" /></SelectTrigger>
                    <SelectContent>{deliveryTypeOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm">Load Type <span className="text-red-500">*</span></Label>
                  <Select value={loadType} onValueChange={setLoadType}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="SELECT" /></SelectTrigger>
                    <SelectContent>{loadTypeOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm">MKT. Executive</Label>
                  <Input value={mkExecutive} onChange={(e) => setMkExecutive(e.target.value)} className="h-9 text-sm" />
                </div>
                <div>
                  <Label className="text-sm">Freight On</Label>
                  <Select value={freightOn} onValueChange={setFreightOn}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="SELECT" /></SelectTrigger>
                    <SelectContent>{freightOnOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={manualRates} onChange={(e) => setManualRates(e.target.checked)} className="h-4 w-4 rounded" />
                    <span className="text-sm">Manual Rates</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Consignor Section */}
            <div className="border rounded-lg p-4 bg-blue-50/30">
              <h3 className="text-base font-semibold mb-3 flex items-center gap-2 text-blue-700">
                <Building className="h-5 w-5" />Consignor Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm">Select ID Type</Label>
                  <Select value={consignorIdType} onValueChange={setConsignorIdType}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="SELECT" /></SelectTrigger>
                    <SelectContent>{idTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                {consignorIdType !== "Self" && consignorIdType !== "" && (
                  <div>
                    <Label className="text-sm">Enter ID Value</Label>
                    <Input value={consignorIdValue} onChange={(e) => setConsignorIdValue(e.target.value)} placeholder="Enter GST/Adhaar/PAN" className="h-9 text-sm" />
                  </div>
                )}
                <div className="flex items-end">
                  <Button onClick={handleConsignorSearch} className="h-9 text-sm bg-blue-600">
                    <Search className="h-4 w-4 mr-1" />Search / Add
                  </Button>
                </div>
              </div>
              {consignorName && consignorIdType !== "Self" && consignorName !== "Self" && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-sm bg-white p-3 rounded border">
                  <div><strong>Name:</strong> {consignorName}</div>
                  <div><strong>Mobile:</strong> {consignorMobile}</div>
                  <div><strong>Email:</strong> {consignorEmail || "-"}</div>
                </div>
              )}
              {consignorName === "Self" && (
                <div className="mt-2 text-sm text-green-600 bg-green-50 p-2 rounded">✓ Self (No ID required)</div>
              )}
              
              <button
                onClick={() => setIsConsignorAddressOpen(!isConsignorAddressOpen)}
                className="mt-3 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
              >
                {isConsignorAddressOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRightIcon className="h-4 w-4" />}
                {isConsignorAddressOpen ? "Hide Address Details" : "Show Address Details"}
              </button>
              {isConsignorAddressOpen && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-white p-3 rounded border">
                  <div><Label className="text-sm">Address</Label><Input value={consignorAddress} onChange={(e) => setConsignorAddress(e.target.value)} className="h-9 text-sm" /></div>
                  <div><Label className="text-sm">City</Label><Input value={consignorCity} onChange={(e) => setConsignorCity(e.target.value)} className="h-9 text-sm" /></div>
                  <div><Label className="text-sm">State</Label><Input value={consignorState} onChange={(e) => setConsignorState(e.target.value)} className="h-9 text-sm" /></div>
                  <div><Label className="text-sm">Dealer Code</Label><Input value={consignorDealerCode} onChange={(e) => setConsignorDealerCode(e.target.value)} className="h-9 text-sm" /></div>
                  <div><Label className="text-sm">IEC Code</Label><Input value={consignorIec} onChange={(e) => setConsignorIec(e.target.value)} className="h-9 text-sm" /></div>
                  <div><Label className="text-sm">Bank AD No.</Label><Input value={consignorBankAd} onChange={(e) => setConsignorBankAd(e.target.value)} className="h-9 text-sm" /></div>
                </div>
              )}
            </div>

            {/* Consignee Section */}
            <div className="border rounded-lg p-4 bg-green-50/30">
              <h3 className="text-base font-semibold mb-3 flex items-center gap-2 text-green-700">
                <Users className="h-5 w-5" />Consignee Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm">Select ID Type</Label>
                  <Select value={consigneeIdType} onValueChange={setConsigneeIdType}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="SELECT" /></SelectTrigger>
                    <SelectContent>{idTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                {consigneeIdType !== "Self" && consigneeIdType !== "" && (
                  <div>
                    <Label className="text-sm">Enter ID Value</Label>
                    <Input value={consigneeIdValue} onChange={(e) => setConsigneeIdValue(e.target.value)} placeholder="Enter GST/Adhaar/PAN" className="h-9 text-sm" />
                  </div>
                )}
                <div className="flex items-end">
                  <Button onClick={handleConsigneeSearch} className="h-9 text-sm bg-green-600">
                    <Search className="h-4 w-4 mr-1" />Search / Add
                  </Button>
                </div>
              </div>
              {consigneeName && consigneeIdType !== "Self" && consigneeName !== "Self" && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-sm bg-white p-3 rounded border">
                  <div><strong>Name:</strong> {consigneeName}</div>
                  <div><strong>Mobile:</strong> {consigneeMobile}</div>
                  <div><strong>Email:</strong> {consigneeEmail || "-"}</div>
                </div>
              )}
              {consigneeName === "Self" && (
                <div className="mt-2 text-sm text-green-600 bg-green-50 p-2 rounded">✓ Self (No ID required)</div>
              )}
              
              <button
                onClick={() => setIsConsigneeAddressOpen(!isConsigneeAddressOpen)}
                className="mt-3 flex items-center gap-1 text-sm text-green-600 hover:text-green-800"
              >
                {isConsigneeAddressOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRightIcon className="h-4 w-4" />}
                {isConsigneeAddressOpen ? "Hide Address Details" : "Show Address Details"}
              </button>
              {isConsigneeAddressOpen && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-white p-3 rounded border">
                  <div><Label className="text-sm">Address</Label><Input value={consigneeAddress} onChange={(e) => setConsigneeAddress(e.target.value)} className="h-9 text-sm" /></div>
                  <div><Label className="text-sm">City</Label><Input value={consigneeCity} onChange={(e) => setConsigneeCity(e.target.value)} className="h-9 text-sm" /></div>
                  <div><Label className="text-sm">State</Label><Input value={consigneeState} onChange={(e) => setConsigneeState(e.target.value)} className="h-9 text-sm" /></div>
                  <div><Label className="text-sm">Dealer Code</Label><Input value={consigneeDealerCode} onChange={(e) => setConsigneeDealerCode(e.target.value)} className="h-9 text-sm" /></div>
                  <div><Label className="text-sm">IEC Code</Label><Input value={consigneeIec} onChange={(e) => setConsigneeIec(e.target.value)} className="h-9 text-sm" /></div>
                  <div><Label className="text-sm">Exim Code</Label><Input value={consigneeEximCode} onChange={(e) => setConsigneeEximCode(e.target.value)} className="h-9 text-sm" /></div>
                </div>
              )}
            </div>

            {/* Goods Table */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                <h3 className="text-base font-semibold flex items-center gap-2">
                  <Package className="h-5 w-5" /> GOODS DETAILS
                </h3>
                <Button onClick={addGoodsRow} variant="ghost" size="sm" className="h-8 text-sm">
                  <Plus className="mr-1 h-4 w-4" />ADD GOODS
                </Button>
              </div>
              <div className="overflow-x-auto p-4">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-sm w-12">#</TableHead>
                      <TableHead className="text-sm">No Of Pckgs</TableHead>
                      <TableHead className="text-sm">Content Category</TableHead>
                      <TableHead className="text-sm">Content (Sub)</TableHead>
                      <TableHead className="text-sm">Packing</TableHead>
                      <TableHead className="text-sm">Actual Weight</TableHead>
                      <TableHead className="text-sm">Charge Weight</TableHead>
                      <TableHead className="text-sm">Status</TableHead>
                      <TableHead className="text-sm w-12">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {goodsItems.map((item, idx) => {
                      const selectedCategory = contentCategories.find(c => c.id === Number(item.contentCategory));
                      return (
                        <TableRow key={item.id} className={!item.isWeightValid ? "bg-red-50" : ""}>
                          <TableCell className="text-sm">{idx + 1}</TableCell>
                          <TableCell>
                            <Input 
                              type="number" 
                              value={item.noOfPckgs} 
                              onChange={(e) => updateGoodsItem(item.id, "noOfPckgs", Number(e.target.value))} 
                              className="h-8 w-24 text-sm" 
                            />
                          </TableCell>
                          <TableCell>
                            <Select value={item.contentCategory} onValueChange={(val) => updateGoodsItem(item.id, "contentCategory", val)}>
                              <SelectTrigger className="h-8 w-32 text-sm"><SelectValue placeholder="Select Category" /></SelectTrigger>
                              <SelectContent>
                                {contentCategories.map(cat => (<SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select 
                              value={item.contentSubCategory} 
                              onValueChange={(val) => updateGoodsItem(item.id, "contentSubCategory", val)} 
                              disabled={!item.contentCategory}
                            >
                              <SelectTrigger className="h-8 w-32 text-sm"><SelectValue placeholder="Select Sub Category" /></SelectTrigger>
                              <SelectContent>
                                {selectedCategory?.subCategories?.map((sub: any) => (<SelectItem key={sub.id} value={String(sub.id)}>{sub.name}</SelectItem>))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select value={item.packing} onValueChange={(val) => updateGoodsItem(item.id, "packing", val)}>
                              <SelectTrigger className="h-8 w-28 text-sm"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {packingTypes.map(opt => (<SelectItem key={opt.name} value={opt.name}>{opt.name} ({opt.maxWeight}kg max/pkg)</SelectItem>))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input type="number" value={item.actualWeight} onChange={(e) => updateGoodsItem(item.id, "actualWeight", Number(e.target.value))} className="h-8 w-24 text-sm" step="0.01" />
                          </TableCell>
                          <TableCell>
                            <Input type="number" value={item.chargeWeight} onChange={(e) => updateGoodsItem(item.id, "chargeWeight", Number(e.target.value))} className="h-8 w-24 text-sm" step="0.01" />
                          </TableCell>
                          <TableCell>
                            {!item.isWeightValid && <span className="text-red-500 text-sm flex items-center gap-1"><AlertCircle className="h-4 w-4" />{item.weightError?.substring(0, 40)}</span>}
                            {item.isWeightValid && item.chargeWeight > 0 && <span className="text-green-500 text-sm flex items-center gap-1"><CheckCircle className="h-4 w-4" />Valid</span>}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => removeGoodsRow(item.id)} disabled={goodsItems.length === 1} className="h-8 w-8 p-0 text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              <div className="p-3 bg-gray-50 flex flex-wrap gap-4 justify-end border-t">
                <span className="text-sm font-medium">Total Pckgs: <strong className="text-blue-600">{totalPckgs}</strong></span>
                <span className="text-sm font-medium">Total Actual Weight: <strong className="text-blue-600">{totalActualWeight.toFixed(2)} kg</strong></span>
                <span className="text-sm font-medium">Total Charge Weight: <strong className="text-blue-600">{totalChargeWeight.toFixed(2)} kg</strong></span>
                <span className="text-sm font-medium">Total Freight: <strong className="text-green-600">₹{totalFreight.toFixed(2)}</strong></span>
              </div>
            </div>

            {/* Invoices Table */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                <h3 className="text-base font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5" /> INVOICES
                </h3>
                <div className="flex gap-3 items-center">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="checkbox" checked={ncv} onChange={(e) => setNcv(e.target.checked)} className="h-4 w-4 rounded" />
                    <span className="text-sm">NCV</span>
                  </label>
                  <Button onClick={addInvoiceRow} variant="ghost" size="sm" className="h-8 text-sm">
                    <Plus className="mr-1 h-4 w-4" />ADD INVOICE
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto p-4">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-sm w-12">S#</TableHead>
                      <TableHead className="text-sm">Invoice #</TableHead>
                      <TableHead className="text-sm">Date</TableHead>
                      <TableHead className="text-sm">Value</TableHead>
                      <TableHead className="text-sm">Eway Bill #</TableHead>
                      <TableHead className="text-sm">Eway Date</TableHead>
                      <TableHead className="text-sm">Valid Upto</TableHead>
                      <TableHead className="text-sm w-12">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((inv, idx) => (
                      <TableRow key={inv.id}>
                        <TableCell className="text-sm">{idx + 1}</TableCell>
                        <TableCell><Input value={inv.invoiceNo} onChange={(e) => updateInvoice(inv.id, "invoiceNo", e.target.value)} className="h-8 w-28 text-sm" /></TableCell>
                        <TableCell>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="h-8 w-28 text-sm justify-start">
                                <CalendarIcon className="mr-1 h-4 w-4" />
                                {format(inv.date, "dd-MM-yyyy")}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="z-[10000]">
                              <Calendar mode="single" selected={inv.date} onSelect={(d) => d && updateInvoice(inv.id, "date", d)} />
                            </PopoverContent>
                          </Popover>
                        </TableCell>
                        <TableCell><Input value={inv.value} onChange={(e) => updateInvoice(inv.id, "value", e.target.value)} className="h-8 w-24 text-sm" /></TableCell>
                        <TableCell><Input value={inv.ewayBillNo} onChange={(e) => updateInvoice(inv.id, "ewayBillNo", e.target.value)} className="h-8 w-28 text-sm" /></TableCell>
                        <TableCell>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="h-8 w-28 text-sm justify-start">
                                <CalendarIcon className="mr-1 h-4 w-4" />
                                {format(inv.ewayBillDate, "dd-MM-yyyy")}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="z-[10000]">
                              <Calendar mode="single" selected={inv.ewayBillDate} onSelect={(d) => d && updateInvoice(inv.id, "ewayBillDate", d)} />
                            </PopoverContent>
                          </Popover>
                        </TableCell>
                        <TableCell><Input value={inv.validUpto} onChange={(e) => updateInvoice(inv.id, "validUpto", e.target.value)} className="h-8 w-24 text-sm" placeholder="Valid upto" /></TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => removeInvoice(inv.id)} disabled={invoices.length === 1} className="h-8 w-8 p-0 text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Remarks Section */}
            <div className="border rounded-lg p-4">
              <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" /> Remarks & Billing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label className="text-sm">Remarks</Label><Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={2} className="text-sm" /></div>
                <div><Label className="text-sm">RO Remarks</Label><Textarea value={roRemarks} onChange={(e) => setRoRemarks(e.target.value)} rows={2} className="text-sm" /></div>
                <div><Label className="text-sm">GP Remarks</Label><Textarea value={gpRemarks} onChange={(e) => setGpRemarks(e.target.value)} rows={2} className="text-sm" /></div>
                <div><Label className="text-sm">Bill No</Label><Input value={billNo} onChange={(e) => setBillNo(e.target.value)} className="h-9 text-sm" /></div>
                <div><Label className="text-sm">Supplementary Bill No</Label><Input value={supplementaryBillNo} onChange={(e) => setSupplementaryBillNo(e.target.value)} className="h-9 text-sm" /></div>
              </div>
            </div>

            {/* Insurance Section */}
            <div className="border rounded-lg p-4">
              <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5" /> Insurance Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm">Insurance Covered By</Label>
                  <Select value={insuranceCoveredBy} onValueChange={setInsuranceCoveredBy}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="SELECT" /></SelectTrigger>
                    <SelectContent>{insuranceCoveredByOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label className="text-sm">Insurance #</Label><Input value={insuranceNo} onChange={(e) => setInsuranceNo(e.target.value)} className="h-9 text-sm" /></div>
                <div>
                  <Label className="text-sm">Insurance Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-9 w-full text-sm justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(insuranceDate, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="z-[10000]">
                      <Calendar mode="single" selected={insuranceDate} onSelect={(d) => d && setInsuranceDate(d)} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div><Label className="text-sm">Insurance Company</Label><Input value={insuranceCompany} onChange={(e) => setInsuranceCompany(e.target.value)} className="h-9 text-sm" /></div>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex flex-wrap justify-between items-center gap-3 shrink-0">
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={printAfterSave} onChange={(e) => setPrintAfterSave(e.target.checked)} className="h-4 w-4 rounded" />
                <span className="text-sm">Print After Save</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={ccAttached} onChange={(e) => setCcAttached(e.target.checked)} className="h-4 w-4 rounded" />
                <span className="text-sm">CC Attached</span>
              </label>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePrint} className="h-9 text-sm">
                <Printer className="mr-1 h-4 w-4" /> Print
              </Button>
              <Button variant="outline" onClick={handleClear} className="h-9 text-sm">
                <RefreshCw className="mr-1 h-4 w-4" /> Clear
              </Button>
              <Button variant="outline" onClick={() => setIsBookingModalOpen(false)} className="h-9 text-sm">
                <X className="mr-1 h-4 w-4" /> Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading} className="h-9 text-sm bg-blue-600 hover:bg-blue-700">
                {loading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Save className="mr-1 h-4 w-4" />}
                {editMode ? "Update" : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}