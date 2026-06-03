// ==================== UPDATED BOOKING COMPUTERIZE GRL WITH SELF OPTION & COLLAPSIBLE ADDRESS ====================

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
  ChevronDown,
  ChevronRight,
  Pencil,
  PlusCircle,
  Trash2,
  AlertCircle,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  User,
  Phone,
  Mail as MailIcon,
  IdCard,
  Fingerprint,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Types
interface PackageItem {
  id: number;
  noOfPackages: number;
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
  value: number;
  ewayBillNo: string;
  ewayBillDate: Date;
  validUpto: Date;
  isNcv: boolean;
}

interface ClientData {
  id: number;
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

interface ContentCategory {
  id: number;
  name: string;
  subCategories: ContentSubCategory[];
}

interface ContentSubCategory {
  id: number;
  name: string;
  parentId: number;
}

interface PackingType {
  id: number;
  name: string;
  minWeight: number;
  maxWeight: number;
  defaultWeight: number;
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
  consignorId: number;
  consignorName: string;
  consignorGst: string;
  consignorAdhaar: string;
  consignorPan: string;
  consignorDealerCode: string;
  consignorAddress: string;
  consignorCity: string;
  consignorState: string;
  consignorMobile: string;
  consignorEmail: string;
  consignorIecCode: string;
  consignorBankAdNo: string;
  consigneeId: number;
  consigneeName: string;
  consigneeGst: string;
  consigneeAdhaar: string;
  consigneePan: string;
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

// Sample Client Data
const sampleClients: ClientData[] = [
  {
    id: 1, name: "ABC Traders", gstNumber: "07ABCDE1234F1Z5", adhaarNumber: "123456789012", panNumber: "ABCDE1234F",
    address: "123, Transport Nagar", city: "Delhi", state: "Delhi", mobile: "9876543210", email: "abc@traders.com",
    dealerCode: "D001", iecCode: "IEC001", bankAdNo: "BANK001"
  },
  {
    id: 2, name: "XYZ Enterprises", gstNumber: "27FGHIJ5678K1Z6", adhaarNumber: "234567890123", panNumber: "FGHIJ5678K",
    address: "456, MIDC Area", city: "Mumbai", state: "Maharashtra", mobile: "9876543220", email: "xyz@enterprises.com",
    dealerCode: "D002", iecCode: "IEC002", bankAdNo: "BANK002"
  },
];

// Content Categories with SubCategories
const contentCategories: ContentCategory[] = [
  {
    id: 1, name: "Electrical Goods",
    subCategories: [
      { id: 11, name: "Fan", parentId: 1 },
      { id: 12, name: "Switch Boards", parentId: 1 },
      { id: 13, name: "Wires", parentId: 1 },
      { id: 14, name: "Light/LED", parentId: 1 },
    ]
  },
  {
    id: 2, name: "Electronics",
    subCategories: [
      { id: 21, name: "Mobile Phones", parentId: 2 },
      { id: 22, name: "Laptops", parentId: 2 },
      { id: 23, name: "TV/Monitors", parentId: 2 },
    ]
  },
  {
    id: 3, name: "Automobile Parts",
    subCategories: [
      { id: 31, name: "Engine Parts", parentId: 3 },
      { id: 32, name: "Tyres", parentId: 3 },
      { id: 33, name: "Batteries", parentId: 3 },
    ]
  },
  {
    id: 4, name: "General Cargo",
    subCategories: [
      { id: 41, name: "General Goods", parentId: 4 },
      { id: 42, name: "Consumer Goods", parentId: 4 },
    ]
  },
];

// Packing Types with Weight Limits
const packingTypes: PackingType[] = [
  { id: 1, name: "BOX", minWeight: 0, maxWeight: 30, defaultWeight: 0 },
  { id: 2, name: "CARTON", minWeight: 0, maxWeight: 50, defaultWeight: 0 },
  { id: 3, name: "WOODEN BOX", minWeight: 0, maxWeight: 40, defaultWeight: 0 },
  { id: 4, name: "PALLET", minWeight: 0, maxWeight: 200, defaultWeight: 0 },
  { id: 5, name: "BAG", minWeight: 0, maxWeight: 50, defaultWeight: 0 },
  { id: 6, name: "DRUM", minWeight: 0, maxWeight: 200, defaultWeight: 0 },
  { id: 7, name: "LOOSE", minWeight: 0, maxWeight: 1000, defaultWeight: 0 },
];

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

const executiveOptions = ["Rajesh Kumar", "Suresh Singh", "Amit Sharma", "Priya Verma", "Vikash Gupta", "Neha Singh", "Rahul Mehta", "Pooja Yadav"];
const branchOptions = ["DELHI", "MUMBAI", "BANGALORE", "CHENNAI", "KOLKATA", "AHMEDABAD", "PUNE", "HYDERABAD", "LUCKNOW", "JAIPUR"];
const cancelledReasonOptions = ["Customer Request", "Payment Issue", "Wrong Booking", "Duplicate Booking", "Vehicle Unavailable", "Route Not Available", "Other"];

// ID Type Options with SELF
const idTypeOptions = ["Self", "GST Number", "Adhaar Number", "PAN Number"];

export default function BookingComputerizeGRL() {
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

  // Collapsible sections state
  const [isConsignorAddressOpen, setIsConsignorAddressOpen] = useState(false);
  const [isConsigneeAddressOpen, setIsConsigneeAddressOpen] = useState(false);

  // New Client Dialog
  const [isNewConsignorDialogOpen, setIsNewConsignorDialogOpen] = useState(false);
  const [isNewConsigneeDialogOpen, setIsNewConsigneeDialogOpen] = useState(false);
  const [newClientData, setNewClientData] = useState<Partial<ClientData>>({});

  // Clients Data
  const [clients, setClients] = useState<ClientData[]>(sampleClients);

  // Consignor Selection
  const [consignorIdType, setConsignorIdType] = useState<string>("");
  const [consignorIdValue, setConsignorIdValue] = useState<string>("");
  const [consignorId, setConsignorId] = useState<number>(0);
  const [consignorName, setConsignorName] = useState<string>("");
  const [consignorGst, setConsignorGst] = useState<string>("");
  const [consignorAdhaar, setConsignorAdhaar] = useState<string>("");
  const [consignorPan, setConsignorPan] = useState<string>("");
  const [consignorDealerCode, setConsignorDealerCode] = useState<string>("");
  const [consignorAddress, setConsignorAddress] = useState<string>("");
  const [consignorCity, setConsignorCity] = useState<string>("");
  const [consignorState, setConsignorState] = useState<string>("");
  const [consignorMobile, setConsignorMobile] = useState<string>("");
  const [consignorEmail, setConsignorEmail] = useState<string>("");
  const [consignorIecCode, setConsignorIecCode] = useState<string>("");
  const [consignorBankAdNo, setConsignorBankAdNo] = useState<string>("");

  // Consignee Selection
  const [consigneeIdType, setConsigneeIdType] = useState<string>("");
  const [consigneeIdValue, setConsigneeIdValue] = useState<string>("");
  const [consigneeId, setConsigneeId] = useState<number>(0);
  const [consigneeName, setConsigneeName] = useState<string>("");
  const [consigneeGst, setConsigneeGst] = useState<string>("");
  const [consigneeAdhaar, setConsigneeAdhaar] = useState<string>("");
  const [consigneePan, setConsigneePan] = useState<string>("");
  const [consigneeDealerCode, setConsigneeDealerCode] = useState<string>("");
  const [consigneeAddress, setConsigneeAddress] = useState<string>("");
  const [consigneeCity, setConsigneeCity] = useState<string>("");
  const [consigneeState, setConsigneeState] = useState<string>("");
  const [consigneeMobile, setConsigneeMobile] = useState<string>("");
  const [consigneeEmail, setConsigneeEmail] = useState<string>("");
  const [consigneeIecCode, setConsigneeIecCode] = useState<string>("");
  const [consigneeEximCode, setConsigneeEximCode] = useState<string>("");

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

  // Packages State
  const [packages, setPackages] = useState<PackageItem[]>([
    { id: 1, noOfPackages: 0, contentCategory: "", contentSubCategory: "", content: "", packing: "BOX", actualWeight: 0, chargeWeight: 0, isWeightValid: true },
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
  const [savedRecords, setSavedRecords] = useState<BookingRecord[]>([]);

  useEffect(() => {
    filterActiveRecords();
    filterCancelledRecords();
    if (!grNo) setGrNo(generateGrNo());
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [packages]);

  const validatePackageWeight = (pkg: PackageItem): { isValid: boolean; error?: string } => {
    const packingType = packingTypes.find(p => p.name === pkg.packing);
    if (packingType && pkg.chargeWeight > 0 && pkg.noOfPackages > 0) {
      const perPackageWeight = pkg.chargeWeight / pkg.noOfPackages;
      if (perPackageWeight > packingType.maxWeight) {
        return { 
          isValid: false, 
          error: `Per package weight (${perPackageWeight.toFixed(2)} kg) exceeds limit for ${packingType.name} (Max: ${packingType.maxWeight} kg/package)` 
        };
      }
    }
    return { isValid: true };
  };

  const updatePackage = (id: number, field: keyof PackageItem, value: any) => {
    setPackages(packages.map(pkg => {
      if (pkg.id === id) {
        const updated = { ...pkg, [field]: value };
        if (field === "contentCategory") {
          updated.contentSubCategory = "";
          updated.content = "";
        }
        if (field === "contentSubCategory") {
          const category = contentCategories.find(c => c.id === Number(pkg.contentCategory));
          const subCategory = category?.subCategories.find(s => s.id === Number(value));
          updated.content = subCategory?.name || "";
        }
        const validation = validatePackageWeight(updated);
        updated.isWeightValid = validation.isValid;
        updated.weightError = validation.error;
        return updated;
      }
      return pkg;
    }));
  };

  const calculateTotals = () => {
    const pkgCount = packages.reduce((sum, pkg) => sum + (pkg.noOfPackages || 0), 0);
    const actualWt = packages.reduce((sum, pkg) => sum + (pkg.actualWeight || 0), 0);
    const chargeWt = packages.reduce((sum, pkg) => sum + (pkg.chargeWeight || 0), 0);
    setTotalPackages(pkgCount);
    setTotalActualWeight(actualWt);
    setTotalChargeWeight(chargeWt);
    setTotalFreight(chargeWt * 30);
  };

  const searchClient = (idType: string, idValue: string): ClientData | undefined => {
    if (!idValue || idType === "Self") return undefined;
    switch (idType) {
      case "GST Number": return clients.find(c => c.gstNumber === idValue);
      case "Adhaar Number": return clients.find(c => c.adhaarNumber === idValue);
      case "PAN Number": return clients.find(c => c.panNumber === idValue);
      default: return undefined;
    }
  };

  const handleConsignorSearch = () => {
    if (!consignorIdType) {
      alert("Please select ID type");
      return;
    }
    
    // If Self is selected, clear all fields and set name as "Self"
    if (consignorIdType === "Self") {
      setConsignorId(0);
      setConsignorName("Self");
      setConsignorGst("");
      setConsignorAdhaar("");
      setConsignorPan("");
      setConsignorDealerCode("");
      setConsignorAddress("");
      setConsignorCity("");
      setConsignorState("");
      setConsignorMobile("");
      setConsignorEmail("");
      setConsignorIecCode("");
      setConsignorBankAdNo("");
      return;
    }
    
    if (!consignorIdValue) {
      alert("Please enter ID value");
      return;
    }
    
    const client = searchClient(consignorIdType, consignorIdValue);
    if (client) {
      setConsignorId(client.id);
      setConsignorName(client.name);
      setConsignorGst(client.gstNumber);
      setConsignorAdhaar(client.adhaarNumber);
      setConsignorPan(client.panNumber);
      setConsignorDealerCode(client.dealerCode);
      setConsignorAddress(client.address);
      setConsignorCity(client.city);
      setConsignorState(client.state);
      setConsignorMobile(client.mobile);
      setConsignorEmail(client.email);
      setConsignorIecCode(client.iecCode);
      setConsignorBankAdNo(client.bankAdNo);
    } else {
      alert("Client not found. Please add new client.");
      setIsNewConsignorDialogOpen(true);
    }
  };

  const handleConsigneeSearch = () => {
    if (!consigneeIdType) {
      alert("Please select ID type");
      return;
    }
    
    // If Self is selected, clear all fields and set name as "Self"
    if (consigneeIdType === "Self") {
      setConsigneeId(0);
      setConsigneeName("Self");
      setConsigneeGst("");
      setConsigneeAdhaar("");
      setConsigneePan("");
      setConsigneeDealerCode("");
      setConsigneeAddress("");
      setConsigneeCity("");
      setConsigneeState("");
      setConsigneeMobile("");
      setConsigneeEmail("");
      setConsigneeIecCode("");
      setConsigneeEximCode("");
      return;
    }
    
    if (!consigneeIdValue) {
      alert("Please enter ID value");
      return;
    }
    
    const client = searchClient(consigneeIdType, consigneeIdValue);
    if (client) {
      setConsigneeId(client.id);
      setConsigneeName(client.name);
      setConsigneeGst(client.gstNumber);
      setConsigneeAdhaar(client.adhaarNumber);
      setConsigneePan(client.panNumber);
      setConsigneeDealerCode(client.dealerCode);
      setConsigneeAddress(client.address);
      setConsigneeCity(client.city);
      setConsigneeState(client.state);
      setConsigneeMobile(client.mobile);
      setConsigneeEmail(client.email);
      setConsigneeIecCode(client.iecCode);
    } else {
      alert("Client not found. Please add new client.");
      setIsNewConsigneeDialogOpen(true);
    }
  };

  const addNewClient = (type: "consignor" | "consignee") => {
    if (!newClientData.name) {
      alert("Please enter client name");
      return;
    }
    const newClient: ClientData = {
      id: clients.length + 1,
      name: newClientData.name || "",
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
    };
    const updatedClients = [...clients, newClient];
    setClients(updatedClients);

    if (type === "consignor") {
      setConsignorId(newClient.id);
      setConsignorName(newClient.name);
      setConsignorGst(newClient.gstNumber);
      setConsignorAdhaar(newClient.adhaarNumber);
      setConsignorPan(newClient.panNumber);
      setConsignorDealerCode(newClient.dealerCode);
      setConsignorAddress(newClient.address);
      setConsignorCity(newClient.city);
      setConsignorState(newClient.state);
      setConsignorMobile(newClient.mobile);
      setConsignorEmail(newClient.email);
      setConsignorIecCode(newClient.iecCode);
      setConsignorBankAdNo(newClient.bankAdNo);
      setIsNewConsignorDialogOpen(false);
    } else {
      setConsigneeId(newClient.id);
      setConsigneeName(newClient.name);
      setConsigneeGst(newClient.gstNumber);
      setConsigneeAdhaar(newClient.adhaarNumber);
      setConsigneePan(newClient.panNumber);
      setConsigneeDealerCode(newClient.dealerCode);
      setConsigneeAddress(newClient.address);
      setConsigneeCity(newClient.city);
      setConsigneeState(newClient.state);
      setConsigneeMobile(newClient.mobile);
      setConsigneeEmail(newClient.email);
      setConsigneeIecCode(newClient.iecCode);
      setIsNewConsigneeDialogOpen(false);
    }
    setNewClientData({});
    alert("New client added successfully!");
  };

  const generateGrNo = (): string => {
    const count = savedRecords.filter(r => r.status === "active").length + 1;
    return `GR${String(count).padStart(6, "0")}`;
  };

  const addPackageRow = () => {
    setPackages([...packages, { 
      id: Date.now(), noOfPackages: 0, contentCategory: "", contentSubCategory: "", 
      content: "", packing: "BOX", actualWeight: 0, chargeWeight: 0, isWeightValid: true 
    }]);
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
    
    // Reset Consignor
    setConsignorIdType("");
    setConsignorIdValue("");
    setConsignorId(0);
    setConsignorName("");
    setConsignorGst("");
    setConsignorAdhaar("");
    setConsignorPan("");
    setConsignorDealerCode("");
    setConsignorAddress("");
    setConsignorCity("");
    setConsignorState("");
    setConsignorMobile("");
    setConsignorEmail("");
    setConsignorIecCode("");
    setConsignorBankAdNo("");
    
    // Reset Consignee
    setConsigneeIdType("");
    setConsigneeIdValue("");
    setConsigneeId(0);
    setConsigneeName("");
    setConsigneeGst("");
    setConsigneeAdhaar("");
    setConsigneePan("");
    setConsigneeDealerCode("");
    setConsigneeAddress("");
    setConsigneeCity("");
    setConsigneeState("");
    setConsigneeMobile("");
    setConsigneeEmail("");
    setConsigneeIecCode("");
    setConsigneeEximCode("");
    
    setPackages([{ id: 1, noOfPackages: 0, contentCategory: "", contentSubCategory: "", content: "", packing: "BOX", actualWeight: 0, chargeWeight: 0, isWeightValid: true }]);
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
    setActiveFormTab("consignor");
    setIsConsignorAddressOpen(false);
    setIsConsigneeAddressOpen(false);
  };

  const handleSave = () => {
    if (!consignorName) { alert("Please select Consignor"); return; }
    if (!consigneeName) { alert("Please select Consignee"); return; }
    
    const hasWeightError = packages.some(pkg => !pkg.isWeightValid);
    if (hasWeightError) {
      alert("Please fix weight validation errors before saving");
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      const newRecord: BookingRecord = {
        id: currentEditId || Date.now(), grNo, grDate, bookingFrom, destination, pickupFrom, deliveryPoint,
        bookingType, collectionAt,
        consignorId, consignorName, consignorGst, consignorAdhaar, consignorPan,
        consignorDealerCode, consignorAddress, consignorCity, consignorState, consignorMobile,
        consignorEmail, consignorIecCode, consignorBankAdNo,
        consigneeId, consigneeName, consigneeGst, consigneeAdhaar, consigneePan,
        consigneeDealerCode, consigneeAddress, consigneeCity, consigneeState, consigneeMobile,
        consigneeEmail, consigneeIecCode, consigneeEximCode,
        pvtMarkaSealNo, serviceProduct, deliveryType, loadType, mkExecutive, freightOn, manualRates,
        totalPackages, totalActualWeight, totalChargeWeight, totalFreight,
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
    
    setConsignorId(record.consignorId);
    setConsignorName(record.consignorName);
    setConsignorGst(record.consignorGst);
    setConsignorAdhaar(record.consignorAdhaar);
    setConsignorPan(record.consignorPan);
    setConsignorDealerCode(record.consignorDealerCode);
    setConsignorAddress(record.consignorAddress);
    setConsignorCity(record.consignorCity);
    setConsignorState(record.consignorState);
    setConsignorMobile(record.consignorMobile);
    setConsignorEmail(record.consignorEmail);
    setConsignorIecCode(record.consignorIecCode);
    setConsignorBankAdNo(record.consignorBankAdNo);
    
    setConsigneeId(record.consigneeId);
    setConsigneeName(record.consigneeName);
    setConsigneeGst(record.consigneeGst);
    setConsigneeAdhaar(record.consigneeAdhaar);
    setConsigneePan(record.consigneePan);
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
            <CardHeader><CardTitle className="text-xs"><Search className="h-3 w-3 inline mr-1" />Search Active Bookings</CardTitle></CardHeader>
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

          <div className="flex justify-end gap-2"><Button onClick={() => setViewMode("report")} variant={viewMode === "report" ? "default" : "outline"} size="sm" className="h-7 text-xs"><Table className="h-3 w-3 mr-1" />Report</Button><Button onClick={() => setViewMode("grid")} variant={viewMode === "grid" ? "default" : "outline"} size="sm" className="h-7 text-xs"><Grid3x3 className="h-3 w-3 mr-1" />Grid</Button></div>

          {viewMode === "report" && searchResults.length > 0 && (
            <Card><CardContent className="p-0"><div className="overflow-x-auto"><Table><TableHeader><TableRow className="bg-gray-50"><TableHead className="text-[10px] p-2">#</TableHead><TableHead className="text-[10px] p-2">GR No.</TableHead><TableHead className="text-[10px] p-2">Date</TableHead><TableHead className="text-[10px] p-2">From</TableHead><TableHead className="text-[10px] p-2">To</TableHead><TableHead className="text-[10px] p-2">Consignor</TableHead><TableHead className="text-[10px] p-2">Consignee</TableHead><TableHead className="text-[10px] p-2 text-right">Freight</TableHead><TableHead className="text-[10px] p-2 text-center">Actions</TableHead></TableRow></TableHeader><TableBody>{paginatedResults.map((r, idx) => (<TableRow key={r.id}><TableCell className="text-xs p-2">{(currentPage-1)*itemsPerPage+idx+1}</TableCell><TableCell className="text-xs p-2"><Badge className="bg-blue-50">{r.grNo}</Badge></TableCell><TableCell className="text-xs p-2">{format(r.grDate, "dd-MM-yy")}</TableCell><TableCell className="text-xs p-2">{r.bookingFrom}</TableCell><TableCell className="text-xs p-2">{r.destination}</TableCell><TableCell className="text-xs p-2 truncate max-w-[120px]">{r.consignorName}</TableCell><TableCell className="text-xs p-2 truncate max-w-[120px]">{r.consigneeName}</TableCell><TableCell className="text-xs p-2 text-right">₹{r.totalFreight.toLocaleString()}</TableCell><TableCell className="text-xs p-2 text-center"><div className="flex gap-1"><Button variant="ghost" size="sm" onClick={() => handleEdit(r)} className="h-6 w-6 p-0 text-blue-500"><Pencil className="h-3 w-3" /></Button><Button variant="ghost" size="sm" onClick={() => openCancelDialog(r)} className="h-6 w-6 p-0 text-orange-500"><X className="h-3 w-3" /></Button><Button variant="ghost" size="sm" onClick={() => handleDelete(r.id)} className="h-6 w-6 p-0 text-red-500"><Trash2 className="h-3 w-3" /></Button></div></TableCell></TableRow>))}</TableBody></Table></div></CardContent></Card>
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

          {viewMode === "report" && cancelledSearchResults.length > 0 && (<Card><CardContent className="p-0"><div className="overflow-x-auto"><Table><TableHeader><TableRow className="bg-gray-50"><TableHead className="text-[10px] p-2">#</TableHead><TableHead className="text-[10px] p-2">GR No.</TableHead><TableHead className="text-[10px] p-2">Date</TableHead><TableHead className="text-[10px] p-2">From</TableHead><TableHead className="text-[10px] p-2">To</TableHead><TableHead className="text-[10px] p-2">Consignor</TableHead><TableHead className="text-[10px] p-2">Consignee</TableHead><TableHead className="text-[10px] p-2 text-right">Freight</TableHead><TableHead className="text-[10px] p-2">Cancel Date</TableHead><TableHead className="text-[10px] p-2">Reason</TableHead><TableHead className="text-[10px] p-2">Actions</TableHead></TableRow></TableHeader><TableBody>{paginatedCancelledResults.map((r, idx) => (<TableRow key={r.id} className="bg-red-50/30"><TableCell className="text-xs p-2">{(cancelledCurrentPage-1)*itemsPerPage+idx+1}</TableCell><TableCell className="text-xs p-2"><Badge className="bg-red-50 text-red-700">{r.grNo}</Badge></TableCell><TableCell className="text-xs p-2">{format(r.grDate, "dd-MM-yy")}</TableCell><TableCell className="text-xs p-2">{r.bookingFrom}</TableCell><TableCell className="text-xs p-2">{r.destination}</TableCell><TableCell className="text-xs p-2 truncate">{r.consignorName}</TableCell><TableCell className="text-xs p-2 truncate">{r.consigneeName}</TableCell><TableCell className="text-xs p-2 text-right">₹{r.totalFreight.toLocaleString()}</TableCell><TableCell className="text-xs p-2">{r.cancelledDate ? format(r.cancelledDate, "dd-MM-yy") : "-"}</TableCell><TableCell className="text-xs p-2 truncate max-w-[100px]">{r.cancelledReason}</TableCell><TableCell className="text-xs p-2"><Button variant="ghost" size="sm" onClick={() => handleRestoreBooking(r)} className="h-6 w-6 p-0 text-green-500"><RefreshCw className="h-3 w-3" /></Button></TableCell></TableRow>))}</TableBody></Table></div></CardContent></Card>)}

          {cancelledSearchResults.length === 0 && (<Card><CardContent className="py-12 text-center"><X className="h-12 w-12 mx-auto text-gray-400" /><p className="text-gray-500">No cancelled bookings</p></CardContent></Card>)}
        </>
      )}

      {/* Cancel Dialog */}
      <Dialog open={isCancelledDialogOpen} onOpenChange={setIsCancelledDialogOpen}>
        <DialogContent><DialogHeader><DialogTitle className="text-red-600 flex items-center gap-2"><X className="h-5 w-5" />Cancel Booking</DialogTitle><DialogDescription>Cancel {cancellingBooking?.grNo}?</DialogDescription></DialogHeader><div><Label>Cancellation Reason *</Label><Select value={cancelledReason} onValueChange={setCancelledReason}><SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger><SelectContent>{cancelledReasonOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></div><DialogFooter><Button variant="outline" onClick={() => setIsCancelledDialogOpen(false)}>No, Keep</Button><Button variant="destructive" onClick={handleCancelBooking}>Yes, Cancel</Button></DialogFooter></DialogContent>
      </Dialog>

      {/* New Consignor Dialog */}
      <Dialog open={isNewConsignorDialogOpen} onOpenChange={setIsNewConsignorDialogOpen}>
        <DialogContent className="max-w-md"><DialogHeader><DialogTitle>Add New Consignor</DialogTitle><DialogDescription>Enter consignor details below</DialogDescription></DialogHeader>
          <div className="space-y-3 py-4">
            <div><Label className="text-xs">Name *</Label><Input value={newClientData.name || ""} onChange={(e) => setNewClientData({...newClientData, name: e.target.value})} className="h-8 text-sm" /></div>
            <div><Label className="text-xs">GST Number</Label><Input value={newClientData.gstNumber || ""} onChange={(e) => setNewClientData({...newClientData, gstNumber: e.target.value})} className="h-8 text-sm uppercase" /></div>
            <div><Label className="text-xs">Adhaar Number</Label><Input value={newClientData.adhaarNumber || ""} onChange={(e) => setNewClientData({...newClientData, adhaarNumber: e.target.value})} className="h-8 text-sm" /></div>
            <div><Label className="text-xs">PAN Number</Label><Input value={newClientData.panNumber || ""} onChange={(e) => setNewClientData({...newClientData, panNumber: e.target.value})} className="h-8 text-sm uppercase" /></div>
            <div><Label className="text-xs">Mobile No.</Label><Input value={newClientData.mobile || ""} onChange={(e) => setNewClientData({...newClientData, mobile: e.target.value})} className="h-8 text-sm" /></div>
            <div><Label className="text-xs">Email</Label><Input value={newClientData.email || ""} onChange={(e) => setNewClientData({...newClientData, email: e.target.value})} className="h-8 text-sm" /></div>
            <div><Label className="text-xs">Address</Label><Input value={newClientData.address || ""} onChange={(e) => setNewClientData({...newClientData, address: e.target.value})} className="h-8 text-sm" /></div>
            <div><Label className="text-xs">City</Label><Input value={newClientData.city || ""} onChange={(e) => setNewClientData({...newClientData, city: e.target.value})} className="h-8 text-sm" /></div>
            <div><Label className="text-xs">State</Label><Input value={newClientData.state || ""} onChange={(e) => setNewClientData({...newClientData, state: e.target.value})} className="h-8 text-sm" /></div>
            <div><Label className="text-xs">Dealer Code</Label><Input value={newClientData.dealerCode || ""} onChange={(e) => setNewClientData({...newClientData, dealerCode: e.target.value})} className="h-8 text-sm" /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setIsNewConsignorDialogOpen(false)}>Cancel</Button><Button onClick={() => addNewClient("consignor")} className="bg-blue-600">Add Consignor</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Consignee Dialog */}
      <Dialog open={isNewConsigneeDialogOpen} onOpenChange={setIsNewConsigneeDialogOpen}>
        <DialogContent className="max-w-md"><DialogHeader><DialogTitle>Add New Consignee</DialogTitle><DialogDescription>Enter consignee details below</DialogDescription></DialogHeader>
          <div className="space-y-3 py-4">
            <div><Label className="text-xs">Name *</Label><Input value={newClientData.name || ""} onChange={(e) => setNewClientData({...newClientData, name: e.target.value})} className="h-8 text-sm" /></div>
            <div><Label className="text-xs">GST Number</Label><Input value={newClientData.gstNumber || ""} onChange={(e) => setNewClientData({...newClientData, gstNumber: e.target.value})} className="h-8 text-sm uppercase" /></div>
            <div><Label className="text-xs">Adhaar Number</Label><Input value={newClientData.adhaarNumber || ""} onChange={(e) => setNewClientData({...newClientData, adhaarNumber: e.target.value})} className="h-8 text-sm" /></div>
            <div><Label className="text-xs">PAN Number</Label><Input value={newClientData.panNumber || ""} onChange={(e) => setNewClientData({...newClientData, panNumber: e.target.value})} className="h-8 text-sm uppercase" /></div>
            <div><Label className="text-xs">Mobile No.</Label><Input value={newClientData.mobile || ""} onChange={(e) => setNewClientData({...newClientData, mobile: e.target.value})} className="h-8 text-sm" /></div>
            <div><Label className="text-xs">Email</Label><Input value={newClientData.email || ""} onChange={(e) => setNewClientData({...newClientData, email: e.target.value})} className="h-8 text-sm" /></div>
            <div><Label className="text-xs">Address</Label><Input value={newClientData.address || ""} onChange={(e) => setNewClientData({...newClientData, address: e.target.value})} className="h-8 text-sm" /></div>
            <div><Label className="text-xs">City</Label><Input value={newClientData.city || ""} onChange={(e) => setNewClientData({...newClientData, city: e.target.value})} className="h-8 text-sm" /></div>
            <div><Label className="text-xs">State</Label><Input value={newClientData.state || ""} onChange={(e) => setNewClientData({...newClientData, state: e.target.value})} className="h-8 text-sm" /></div>
            <div><Label className="text-xs">Dealer Code</Label><Input value={newClientData.dealerCode || ""} onChange={(e) => setNewClientData({...newClientData, dealerCode: e.target.value})} className="h-8 text-sm" /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setIsNewConsigneeDialogOpen(false)}>Cancel</Button><Button onClick={() => addNewClient("consignee")} className="bg-blue-600">Add Consignee</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Booking Modal */}
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
              <div><Label className="text-xs">Pvt Marka/Seal No</Label><Input value={pvtMarkaSealNo} onChange={(e) => setPvtMarkaSealNo(e.target.value)} className="h-8 text-sm" /></div>
              <div><Label className="text-xs">Service/Product *</Label><Select value={serviceProduct} onValueChange={setServiceProduct}><SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger><SelectContent>{serviceProductOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent></Select></div>
              <div><Label className="text-xs">Delivery Type *</Label><Select value={deliveryType} onValueChange={setDeliveryType}><SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger><SelectContent>{deliveryTypeOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent></Select></div>
              <div><Label className="text-xs">Load Type *</Label><Select value={loadType} onValueChange={setLoadType}><SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger><SelectContent>{loadTypeOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent></Select></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div><Label className="text-xs">MKT Executive</Label><Select value={mkExecutive} onValueChange={setMkExecutive}><SelectTrigger className="h-8 text-sm"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{executiveOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></div>
              <div><Label className="text-xs">Freight On</Label><Select value={freightOn} onValueChange={setFreightOn}><SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger><SelectContent>{freightOnOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent></Select></div>
              <div className="flex items-center"><label className="flex items-center gap-2"><input type="checkbox" checked={manualRates} onChange={(e) => setManualRates(e.target.checked)} className="rounded" /><span className="text-xs">Manual Rates</span></label></div>
            </div>

            {/* Consignor Selection Section */}
            <div className="border rounded-lg p-3 bg-blue-50/30">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2 text-blue-700"><Building className="h-4 w-4" />Consignor Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div><Label className="text-xs">Select ID Type</Label><Select value={consignorIdType} onValueChange={setConsignorIdType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{idTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
                {consignorIdType !== "Self" && (
                  <div><Label className="text-xs">Enter ID Value</Label><Input value={consignorIdValue} onChange={(e) => setConsignorIdValue(e.target.value)} placeholder="Enter GST/Adhaar/PAN" className="h-8 text-xs" /></div>
                )}
                <div className="flex items-end"><Button onClick={handleConsignorSearch} size="sm" className="h-8 text-xs bg-blue-600"><Search className="h-3 w-3 mr-1" />Search / Add</Button></div>
              </div>
              {consignorName && consignorIdType !== "Self" && (
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-white p-2 rounded">
                  <div><strong>Name:</strong> {consignorName}</div>
                  <div><strong>Mobile:</strong> {consignorMobile}</div>
                  <div><strong>Email:</strong> {consignorEmail || "-"}</div>
                </div>
              )}
              {consignorName === "Self" && (
                <div className="mt-2 text-xs text-green-600 bg-green-50 p-2 rounded">✓ Self (No ID required)</div>
              )}
              
              {/* Collapsible Address Section for Consignor */}
              <button
                onClick={() => setIsConsignorAddressOpen(!isConsignorAddressOpen)}
                className="mt-3 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
              >
                {isConsignorAddressOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                {isConsignorAddressOpen ? "Hide Address Details" : "Show Address Details"}
              </button>
              {isConsignorAddressOpen && (
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 bg-white p-3 rounded border">
                  <div><Label className="text-[10px]">Address</Label><Input value={consignorAddress} onChange={(e) => setConsignorAddress(e.target.value)} className="h-7 text-xs" /></div>
                  <div><Label className="text-[10px]">City</Label><Input value={consignorCity} onChange={(e) => setConsignorCity(e.target.value)} className="h-7 text-xs" /></div>
                  <div><Label className="text-[10px]">State</Label><Input value={consignorState} onChange={(e) => setConsignorState(e.target.value)} className="h-7 text-xs" /></div>
                  <div><Label className="text-[10px]">Dealer Code</Label><Input value={consignorDealerCode} onChange={(e) => setConsignorDealerCode(e.target.value)} className="h-7 text-xs" /></div>
                  <div><Label className="text-[10px]">IEC Code</Label><Input value={consignorIecCode} onChange={(e) => setConsignorIecCode(e.target.value)} className="h-7 text-xs" /></div>
                  <div><Label className="text-[10px]">Bank AD No.</Label><Input value={consignorBankAdNo} onChange={(e) => setConsignorBankAdNo(e.target.value)} className="h-7 text-xs" /></div>
                </div>
              )}
            </div>

            {/* Consignee Selection Section */}
            <div className="border rounded-lg p-3 bg-green-50/30">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2 text-green-700"><Users className="h-4 w-4" />Consignee Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div><Label className="text-xs">Select ID Type</Label><Select value={consigneeIdType} onValueChange={setConsigneeIdType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{idTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
                {consigneeIdType !== "Self" && (
                  <div><Label className="text-xs">Enter ID Value</Label><Input value={consigneeIdValue} onChange={(e) => setConsigneeIdValue(e.target.value)} placeholder="Enter GST/Adhaar/PAN" className="h-8 text-xs" /></div>
                )}
                <div className="flex items-end"><Button onClick={handleConsigneeSearch} size="sm" className="h-8 text-xs bg-green-600"><Search className="h-3 w-3 mr-1" />Search / Add</Button></div>
              </div>
              {consigneeName && consigneeIdType !== "Self" && (
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-white p-2 rounded">
                  <div><strong>Name:</strong> {consigneeName}</div>
                  <div><strong>Mobile:</strong> {consigneeMobile}</div>
                  <div><strong>Email:</strong> {consigneeEmail || "-"}</div>
                </div>
              )}
              {consigneeName === "Self" && (
                <div className="mt-2 text-xs text-green-600 bg-green-50 p-2 rounded">✓ Self (No ID required)</div>
              )}
              
              {/* Collapsible Address Section for Consignee */}
              <button
                onClick={() => setIsConsigneeAddressOpen(!isConsigneeAddressOpen)}
                className="mt-3 flex items-center gap-1 text-xs text-green-600 hover:text-green-800"
              >
                {isConsigneeAddressOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                {isConsigneeAddressOpen ? "Hide Address Details" : "Show Address Details"}
              </button>
              {isConsigneeAddressOpen && (
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 bg-white p-3 rounded border">
                  <div><Label className="text-[10px]">Address</Label><Input value={consigneeAddress} onChange={(e) => setConsigneeAddress(e.target.value)} className="h-7 text-xs" /></div>
                  <div><Label className="text-[10px]">City</Label><Input value={consigneeCity} onChange={(e) => setConsigneeCity(e.target.value)} className="h-7 text-xs" /></div>
                  <div><Label className="text-[10px]">State</Label><Input value={consigneeState} onChange={(e) => setConsigneeState(e.target.value)} className="h-7 text-xs" /></div>
                  <div><Label className="text-[10px]">Dealer Code</Label><Input value={consigneeDealerCode} onChange={(e) => setConsigneeDealerCode(e.target.value)} className="h-7 text-xs" /></div>
                  <div><Label className="text-[10px]">IEC Code</Label><Input value={consigneeIecCode} onChange={(e) => setConsigneeIecCode(e.target.value)} className="h-7 text-xs" /></div>
                  <div><Label className="text-[10px]">Exim Code</Label><Input value={consigneeEximCode} onChange={(e) => setConsigneeEximCode(e.target.value)} className="h-7 text-xs" /></div>
                </div>
              )}
            </div>

            {/* Packages Table */}
            <div className="border rounded-lg p-3">
              <div className="flex justify-between mb-2"><Label className="text-sm font-semibold">Package Details</Label><Button variant="outline" size="sm" onClick={addPackageRow}><PlusCircle className="h-3 w-3 mr-1" />Add Package</Button></div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow><TableHead className="text-[10px] p-1">No of Pckgs</TableHead><TableHead className="text-[10px] p-1">Content Category</TableHead><TableHead className="text-[10px] p-1">Content (Sub)</TableHead><TableHead className="text-[10px] p-1">Packing</TableHead><TableHead className="text-[10px] p-1">Actual Wt</TableHead><TableHead className="text-[10px] p-1">Charge Wt</TableHead><TableHead className="text-[10px] p-1">Status</TableHead><TableHead className="w-8"></TableHead></TableRow></TableHeader>
                  <TableBody>
                    {packages.map(pkg => {
                      const selectedCategory = contentCategories.find(c => c.id === Number(pkg.contentCategory));
                      const packingLimit = packingTypes.find(p => p.name === pkg.packing);
                      return (
                        <TableRow key={pkg.id} className={!pkg.isWeightValid ? "bg-red-50" : ""}>
                          <TableCell><Input type="number" value={pkg.noOfPackages} onChange={(e) => updatePackage(pkg.id, "noOfPackages", Number(e.target.value))} className="h-8 w-20 text-xs" /></TableCell>
                          <TableCell>
                            <Select value={pkg.contentCategory} onValueChange={(val) => updatePackage(pkg.id, "contentCategory", val)}>
                              <SelectTrigger className="h-8 w-32 text-xs"><SelectValue placeholder="Select Category" /></SelectTrigger>
                              <SelectContent>{contentCategories.map(cat => (<SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>))}</SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select value={pkg.contentSubCategory} onValueChange={(val) => updatePackage(pkg.id, "contentSubCategory", val)} disabled={!pkg.contentCategory}>
                              <SelectTrigger className="h-8 w-32 text-xs"><SelectValue placeholder="Select Sub Category" /></SelectTrigger>
                              <SelectContent>
                                {selectedCategory?.subCategories.map(sub => (<SelectItem key={sub.id} value={String(sub.id)}>{sub.name}</SelectItem>))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select value={pkg.packing} onValueChange={(val) => updatePackage(pkg.id, "packing", val)}>
                              <SelectTrigger className="h-8 w-28 text-xs"><SelectValue /></SelectTrigger>
                              <SelectContent>{packingTypes.map(opt => (<SelectItem key={opt.name} value={opt.name}>{opt.name} ({opt.maxWeight}kg max/pkg)</SelectItem>))}</SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell><Input type="number" value={pkg.actualWeight} onChange={(e) => updatePackage(pkg.id, "actualWeight", Number(e.target.value))} className="h-8 w-24 text-xs" step="0.01" /></TableCell>
                          <TableCell><Input type="number" value={pkg.chargeWeight} onChange={(e) => updatePackage(pkg.id, "chargeWeight", Number(e.target.value))} className="h-8 w-24 text-xs" step="0.01" /></TableCell>
                          <TableCell>
                            {!pkg.isWeightValid && <span className="text-red-500 text-[10px] flex items-center gap-1"><AlertCircle className="h-3 w-3" />{pkg.weightError?.substring(0, 30)}</span>}
                            {pkg.isWeightValid && pkg.chargeWeight > 0 && <span className="text-green-500 text-[10px]">✓ Valid</span>}
                          </TableCell>
                          <TableCell><Button variant="ghost" size="sm" onClick={() => removePackage(pkg.id)} disabled={packages.length === 1} className="h-7 w-7 p-0 text-red-500"><Trash2 className="h-3 w-3" /></Button></TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-2 text-xs bg-gray-50 p-2 rounded">Total: Pckgs: {totalPackages} | Actual Wt: {totalActualWeight.toFixed(2)} kg | Charge Wt: {totalChargeWeight.toFixed(2)} kg | Freight: ₹{totalFreight.toFixed(2)}</div>
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

            {/* Form Tabs */}
            <Tabs value={activeFormTab} onValueChange={setActiveFormTab} className="w-full">
              <TabsList className="grid grid-cols-6 h-auto">
                <TabsTrigger value="consignor" className="text-xs py-1">Consignor</TabsTrigger>
                <TabsTrigger value="consignee" className="text-xs py-1">Consignee</TabsTrigger>
                <TabsTrigger value="freight" className="text-xs py-1">Freight</TabsTrigger>
                <TabsTrigger value="remarks" className="text-xs py-1">Remarks</TabsTrigger>
                <TabsTrigger value="insurance" className="text-xs py-1">Insurance</TabsTrigger>
                <TabsTrigger value="billing" className="text-xs py-1">Billing</TabsTrigger>
              </TabsList>

              {/* Consignor Tab - Additional Details */}
              <TabsContent value="consignor" className="mt-4 space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div><Label className="text-xs">Dealer Code</Label><Input value={consignorDealerCode} onChange={(e) => setConsignorDealerCode(e.target.value)} className="h-8 text-sm" /></div>
                  <div><Label className="text-xs">IEC Code</Label><Input value={consignorIecCode} onChange={(e) => setConsignorIecCode(e.target.value)} className="h-8 text-sm" /></div>
                  <div><Label className="text-xs">Bank AD. No.</Label><Input value={consignorBankAdNo} onChange={(e) => setConsignorBankAdNo(e.target.value)} className="h-8 text-sm" /></div>
                </div>
              </TabsContent>

              {/* Consignee Tab - Additional Details */}
              <TabsContent value="consignee" className="mt-4 space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div><Label className="text-xs">Dealer Code</Label><Input value={consigneeDealerCode} onChange={(e) => setConsigneeDealerCode(e.target.value)} className="h-8 text-sm" /></div>
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
                <Button onClick={calculateTotals} size="sm" className="h-8 text-xs bg-green-600"><Calculator className="h-3 w-3 mr-1" />Calculate Freight</Button>
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