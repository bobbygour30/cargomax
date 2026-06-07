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
  Printer,
  FileText,
  X,
  Check,
  Truck,
  Edit,
  PlusCircle,
  Trash2,
  Package,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Plus,
  Loader2,
  DollarSign,
  Fuel,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import toast from "react-hot-toast";

// Import API services
import {
  getLHCs,
  createLHC,
  updateLHC,
  cancelLHC,
  restoreLHC,
  deleteLHC,
  getLHCStats,
  getPendingManifests,
} from "@/services/api";

// Types
interface LorryChallanItem {
  id: number;
  challanNo: string;
  challanDate: Date;
  from: string;
  to: string;
  pckgs: number;
  actualWeight: number;
  chargeableWeight: number;
  ftl: string;
  perKgPckgs: string;
  rate: number;
  calcAmount: number;
  amount: number;
  remarks: string;
}

interface AdditionalCharge {
  id: number;
  name: string;
  type: "add" | "subtract";
  amount: number;
  tdsApplicable: boolean;
  advance: number;
  hasChecklist: boolean;
}

interface BalancePayableBranch {
  id: number;
  branch: string;
  amount: number;
}

interface LorryHireChallan {
  _id?: string;
  lhcNo: string;
  branchName: string;
  despatchType: string;
  date: Date;
  modeType: string;
  modeName: string;
  owner: string;
  vendor: string;
  vehicleType: string;
  broker: string;
  route: string;
  pan: string;
  emptyLorryWeight: number;
  dharamKantaWeight: number;
  remarks: string;
  hireFreight: number;
  items: LorryChallanItem[];
  additionalCharges: AdditionalCharge[];
  balancePayableBranches: BalancePayableBranch[];
  tdsType: string;
  tdsPercentage: number;
  applicableOn: number;
  lessTds: number;
  cashAdvance: number;
  bankAdvance: number;
  petroCardAdvance: number;
  guaranteeWeight: number;
  lhcNotForPayment: boolean;
  issueFuelSlip: boolean;
  cancelledReason?: string;
  status: "active" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

interface PendingManifest {
  id: number;
  manifestNo: string;
  manifestDate: Date;
  modeName: string;
  destination: string;
  driverName: string;
  driverTelNo: string;
  noOfGR: number;
  noOfPckgs: number;
  actualWeight: number;
  chargeWeight: number;
  selected: boolean;
}

// Options
const branchOptions = [
  "CORPORATE OFFICE", "DELHI", "MUMBAI", "BANGALORE", "CHENNAI",
  "KOLKATA", "AHMEDABAD", "PUNE", "HYDERABAD", "AGARTALA"
];

const despatchTypeOptions = ["Outstation Challan", "Local Challan", "Intercity"];
const modeTypeOptions = ["Surface", "Air", "Rail", "Sea"];
const modeNameOptions = ["DL01LA0837", "DL01LAD6175", "DL01LAJ4226", "DL01LAQ0859", "SURFACE"];
const ownerOptions = ["Rajesh Kumar", "Suresh Singh", "Mahesh Sharma"];
const vendorOptions = ["TATA MOTORS", "ASHOK LEYLAND", "MAHINDRA", "EICHER"];
const vehicleTypeOptions = ["MARKET", "OWN", "CONTRACT", "HIRE"];
const brokerOptions = ["Mohan Broker", "Ravi Broker", "Amit Broker"];
const routeOptions = ["DELHI-MUMBAI", "MUMBAI-BANGALORE", "DELHI-CHENNAI", "DELHI-KOLKATA"];
const cancelledReasonOptions = [
  "Customer Request", "Vehicle Issue", "Payment Issue", "Route Cancelled", "Other"
];
const tdsTypeOptions = ["EXEMPTED", "NON-EXEMPTED", "PARTIAL"];

// Default additional charges
const defaultAdditionalCharges: AdditionalCharge[] = [
  { id: 1, name: "OTHER CHARGES", type: "add", amount: 0, tdsApplicable: false, advance: 0, hasChecklist: false },
  { id: 2, name: "OVER LOAD", type: "add", amount: 0, tdsApplicable: false, advance: 0, hasChecklist: false },
  { id: 3, name: "LABOUR CHARGE", type: "add", amount: 0, tdsApplicable: false, advance: 0, hasChecklist: false },
  { id: 4, name: "SECOND POINT", type: "add", amount: 0, tdsApplicable: false, advance: 0, hasChecklist: true },
  { id: 5, name: "LORRY HIRE", type: "add", amount: 0, tdsApplicable: true, advance: 0, hasChecklist: false },
  { id: 6, name: "CASH DISCOUNT", type: "subtract", amount: 0, tdsApplicable: false, advance: 0, hasChecklist: true },
];

const branchPaymentOptions = ["AGARTALA", "DELHI", "MUMBAI", "KOLKATA", "CHENNAI", "BANGALORE", "HYDERABAD", "PUNE"];

export default function LorryHireChallan() {
  const [mainTab, setMainTab] = useState<"active" | "pending" | "cancelled">("active");
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Cancel Dialog state
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancellingLHC, setCancellingLHC] = useState<LorryHireChallan | null>(null);
  const [cancelledReason, setCancelledReason] = useState<string>("");

  // Form state
  const [autoLHC, setAutoLHC] = useState<boolean>(true);
  const [branchName, setBranchName] = useState<string>("");
  const [despatchType, setDespatchType] = useState<string>("");
  const [lhcNo, setLhcNo] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [modeType, setModeType] = useState<string>("");
  const [modeName, setModeName] = useState<string>("");
  const [owner, setOwner] = useState<string>("");
  const [vendor, setVendor] = useState<string>("");
  const [vehicleType, setVehicleType] = useState<string>("");
  const [broker, setBroker] = useState<string>("");
  const [route, setRoute] = useState<string>("");
  const [pan, setPan] = useState<string>("");
  const [emptyLorryWeight, setEmptyLorryWeight] = useState<number>(0);
  const [dharamKantaWeight, setDharamKantaWeight] = useState<number>(0);
  const [remarks, setRemarks] = useState<string>("");
  const [hireFreight, setHireFreight] = useState<number>(0);
  const [items, setItems] = useState<LorryChallanItem[]>([
    { id: Date.now(), challanNo: "", challanDate: new Date(), from: "", to: "", pckgs: 0, actualWeight: 0, chargeableWeight: 0, ftl: "", perKgPckgs: "", rate: 0, calcAmount: 0, amount: 0, remarks: "" }
  ]);

  // Additional Charges State
  const [additionalCharges, setAdditionalCharges] = useState<AdditionalCharge[]>([...defaultAdditionalCharges]);
  const [balancePayableBranches, setBalancePayableBranches] = useState<BalancePayableBranch[]>([
    { id: Date.now(), branch: "", amount: 0 }
  ]);

  // TDS and Advance State
  const [tdsType, setTdsType] = useState<string>("EXEMPTED");
  const [tdsPercentage, setTdsPercentage] = useState<number>(0);
  const [applicableOn, setApplicableOn] = useState<number>(0);
  const [lessTds, setLessTds] = useState<number>(0);
  const [cashAdvance, setCashAdvance] = useState<number>(0);
  const [bankAdvance, setBankAdvance] = useState<number>(0);
  const [petroCardAdvance, setPetroCardAdvance] = useState<number>(0);
  const [guaranteeWeight, setGuaranteeWeight] = useState<number>(0);
  const [lhcNotForPayment, setLhcNotForPayment] = useState<boolean>(false);
  const [issueFuelSlip, setIssueFuelSlip] = useState<boolean>(false);

  // Calculated totals
  const [totalAdditionalCharges, setTotalAdditionalCharges] = useState<number>(0);
  const [totalAdvance, setTotalAdvance] = useState<number>(0);
  const [balancePayable, setBalancePayable] = useState<number>(0);

  // Pending Manifest State
  const [pendingBranch, setPendingBranch] = useState<string>("");
  const [pendingToDate, setPendingToDate] = useState<Date>(new Date());
  const [pendingModeType, setPendingModeType] = useState<string>("Surface");
  const [pendingDespatchType, setPendingDespatchType] = useState<string>("Outstation Challan");
  const [pendingManifestFor, setPendingManifestFor] = useState<number>(90);
  const [pendingManifests, setPendingManifests] = useState<PendingManifest[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [pendingCurrentPage, setPendingCurrentPage] = useState<number>(1);
  const [pendingStats, setPendingStats] = useState({ total: 0, selected: 0 });

  // Search State
  const [searchFromDate, setSearchFromDate] = useState<Date>(new Date());
  const [searchToDate, setSearchToDate] = useState<Date>(new Date());
  const [searchBranch, setSearchBranch] = useState<string>("all");
  const [searchResults, setSearchResults] = useState<LorryHireChallan[]>([]);
  const [cancelledResults, setCancelledResults] = useState<LorryHireChallan[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [cancelledPage, setCancelledPage] = useState<number>(1);
  const [stats, setStats] = useState({ active: { count: 0, totalFreight: 0 }, cancelled: { count: 0 } });
  const itemsPerPage: number = 10;

  // Calculate all totals
  const calculateTotals = () => {
    // Calculate additional charges total
    const chargesTotal = additionalCharges.reduce((sum, charge) => {
      if (charge.type === "add") return sum + charge.amount;
      return sum - charge.amount;
    }, 0);
    setTotalAdditionalCharges(chargesTotal);

    // Calculate total advance
    const totalAdv = cashAdvance + bankAdvance + petroCardAdvance;
    setTotalAdvance(totalAdv);

    // Calculate TDS
    const tdsAmount = (applicableOn * tdsPercentage) / 100;
    setLessTds(tdsAmount);

    // Calculate balance payable
    const total = hireFreight + chargesTotal;
    const balance = total - tdsAmount - totalAdv;
    setBalancePayable(balance > 0 ? balance : 0);
  };

  // Update additional charge
  const updateAdditionalCharge = (id: number, field: keyof AdditionalCharge, value: any) => {
    setAdditionalCharges(prev => prev.map(charge =>
      charge.id === id ? { ...charge, [field]: value } : charge
    ));
    setTimeout(calculateTotals, 0);
  };

  // Add balance payable branch
  const addBalancePayableBranch = () => {
    setBalancePayableBranches([
      ...balancePayableBranches,
      { id: Date.now(), branch: "", amount: 0 }
    ]);
  };

  // Remove balance payable branch
  const removeBalancePayableBranch = (id: number) => {
    if (balancePayableBranches.length > 1) {
      setBalancePayableBranches(prev => prev.filter(branch => branch.id !== id));
    }
  };

  // Update balance payable branch
  const updateBalancePayableBranch = (id: number, field: keyof BalancePayableBranch, value: any) => {
    setBalancePayableBranches(prev => prev.map(branch =>
      branch.id === id ? { ...branch, [field]: value } : branch
    ));
  };

  // Load data on mount
  useEffect(() => {
    loadLHCs();
    loadStats();
    calculateTotals();
  }, [hireFreight, additionalCharges, cashAdvance, bankAdvance, petroCardAdvance, applicableOn, tdsPercentage]);

  const loadLHCs = async () => {
    setLoading(true);
    try {
      const response = await getLHCs({ status: "active", limit: 100 });
      setSearchResults(response.data || []);
    } catch (error) {
      console.error("Error loading LHCs:", error);
      toast.error("Failed to load LHCs");
    } finally {
      setLoading(false);
    }
  };

  const loadCancelledLHCs = async () => {
    setLoading(true);
    try {
      const response = await getLHCs({ status: "cancelled", limit: 100 });
      setCancelledResults(response.data || []);
    } catch (error) {
      console.error("Error loading cancelled LHCs:", error);
      toast.error("Failed to load cancelled LHCs");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await getLHCStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const loadPendingManifests = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (pendingBranch) filters.branch = pendingBranch;
      if (pendingToDate) filters.toDate = pendingToDate.toISOString();
      if (pendingModeType) filters.modeType = pendingModeType;
      if (pendingDespatchType) filters.despatchType = pendingDespatchType;
      if (pendingManifestFor) filters.manifestForDays = pendingManifestFor;

      const response = await getPendingManifests(filters);
      const manifests = response.data.map((item: any, index: number) => ({
        ...item,
        id: index + 1,
        selected: false,
      }));
      setPendingManifests(manifests);
      setPendingStats({
        total: manifests.length,
        selected: 0,
      });
      setSelectAll(false);
      toast.success(`Found ${manifests.length} pending manifests`);
    } catch (error) {
      console.error("Error loading pending manifests:", error);
      toast.error("Failed to load pending manifests");
    } finally {
      setLoading(false);
    }
  };

  const calculateAmount = (rate: number, chargeableWeight: number, perKgPckgs: string): number => {
    if (perKgPckgs === "Per Kg") return rate * chargeableWeight;
    if (perKgPckgs === "Per Ton") return rate * (chargeableWeight / 1000);
    return rate;
  };

  const updateItem = (id: number, field: keyof LorryChallanItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === "rate" || field === "chargeableWeight" || field === "perKgPckgs") {
          updated.calcAmount = calculateAmount(
            field === "rate" ? value : item.rate,
            field === "chargeableWeight" ? value : item.chargeableWeight,
            field === "perKgPckgs" ? value : item.perKgPckgs
          );
        }
        return updated;
      }
      return item;
    }));
  };

  const addItemRow = () => {
    const newItem: LorryChallanItem = {
      id: Date.now(),
      challanNo: "",
      challanDate: new Date(),
      from: "",
      to: "",
      pckgs: 0,
      actualWeight: 0,
      chargeableWeight: 0,
      ftl: "",
      perKgPckgs: "",
      rate: 0,
      calcAmount: 0,
      amount: 0,
      remarks: "",
    };
    setItems([...items, newItem]);
    toast.success("New item row added");
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
      toast.success("Item row removed");
    }
  };

  const updateHireFreight = () => {
    const total = items.reduce((sum, item) => sum + (item.amount || item.calcAmount), 0);
    setHireFreight(total);
    toast.success(`Hire freight calculated: ₹${total.toFixed(2)}`);
  };

  const resetForm = () => {
    setBranchName("");
    setDespatchType("");
    setLhcNo("");
    setDate(new Date());
    setModeType("");
    setModeName("");
    setOwner("");
    setVendor("");
    setVehicleType("");
    setBroker("");
    setRoute("");
    setPan("");
    setEmptyLorryWeight(0);
    setDharamKantaWeight(0);
    setRemarks("");
    setHireFreight(0);
    setItems([{ id: Date.now(), challanNo: "", challanDate: new Date(), from: "", to: "", pckgs: 0, actualWeight: 0, chargeableWeight: 0, ftl: "", perKgPckgs: "", rate: 0, calcAmount: 0, amount: 0, remarks: "" }]);
    setAdditionalCharges([...defaultAdditionalCharges]);
    setBalancePayableBranches([{ id: Date.now(), branch: "", amount: 0 }]);
    setTdsType("EXEMPTED");
    setTdsPercentage(0);
    setApplicableOn(0);
    setLessTds(0);
    setCashAdvance(0);
    setBankAdvance(0);
    setPetroCardAdvance(0);
    setGuaranteeWeight(0);
    setLhcNotForPayment(false);
    setIssueFuelSlip(false);
    setEditMode(false);
    setCurrentEditId(null);
    setAutoLHC(true);
    calculateTotals();
  };

  const handleSave = async () => {
    if (!branchName) {
      toast.error("Please select Branch Name");
      return;
    }
    if (!date) {
      toast.error("Please select Date");
      return;
    }

    setLoading(true);

    const lhcData: any = {
      branchName,
      despatchType: despatchType || "",
      date,
      modeType: modeType || "",
      modeName: modeName || "",
      owner: owner || "",
      vendor: vendor || "",
      vehicleType: vehicleType || "",
      broker: broker || "",
      route: route || "",
      pan: pan || "",
      emptyLorryWeight: emptyLorryWeight || 0,
      dharamKantaWeight: dharamKantaWeight || 0,
      remarks: remarks || "",
      hireFreight,
      items: items.map(({ id, ...rest }) => rest),
      additionalCharges,
      balancePayableBranches,
      tdsType,
      tdsPercentage,
      applicableOn,
      lessTds,
      cashAdvance,
      bankAdvance,
      petroCardAdvance,
      guaranteeWeight,
      lhcNotForPayment,
      issueFuelSlip,
      autoLHC,
    };

    if (!autoLHC && lhcNo) {
      lhcData.lhcNo = lhcNo;
    }

    try {
      let response;
      if (editMode && currentEditId) {
        response = await updateLHC(currentEditId, lhcData);
        toast.success("Lorry Hire Challan updated successfully!");
      } else {
        response = await createLHC(lhcData);
        toast.success(`Lorry Hire Challan created successfully! No: ${response.data.lhcNo}`);
      }

      await loadLHCs();
      await loadCancelledLHCs();
      await loadStats();
      resetForm();
      setIsEntryModalOpen(false);
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error.response?.data?.message || "Failed to save LHC");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const filters: any = { status: "active", limit: 100 };
      if (searchFromDate) filters.fromDate = searchFromDate.toISOString();
      if (searchToDate) filters.toDate = searchToDate.toISOString();
      if (searchBranch !== "all") filters.branch = searchBranch;

      const response = await getLHCs(filters);
      setSearchResults(response.data || []);
      setCurrentPage(1);
      toast.success(`Found ${response.data?.length || 0} LHCs`);
    } catch (error: any) {
      console.error("Search error:", error);
      toast.error(error.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSearch = async () => {
    setLoading(true);
    try {
      const filters: any = { status: "cancelled", limit: 100 };
      if (searchFromDate) filters.fromDate = searchFromDate.toISOString();
      if (searchToDate) filters.toDate = searchToDate.toISOString();
      if (searchBranch !== "all") filters.branch = searchBranch;

      const response = await getLHCs(filters);
      setCancelledResults(response.data || []);
      setCancelledPage(1);
      toast.success(`Found ${response.data?.length || 0} cancelled LHCs`);
    } catch (error: any) {
      console.error("Search error:", error);
      toast.error(error.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchFromDate(new Date());
    setSearchToDate(new Date());
    setSearchBranch("all");
    loadLHCs();
    loadCancelledLHCs();
    toast.success("Search filters cleared");
  };

  const handlePendingSearch = async () => {
    await loadPendingManifests();
    setPendingCurrentPage(1);
  };

  const handleClearPendingSearch = () => {
    setPendingBranch("");
    setPendingToDate(new Date());
    setPendingModeType("Surface");
    setPendingDespatchType("Outstation Challan");
    setPendingManifestFor(90);
    setPendingManifests([]);
    setSelectAll(false);
    setPendingStats({ total: 0, selected: 0 });
    toast.success("Pending search filters cleared");
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    const updatedManifests = pendingManifests.map(item => ({ ...item, selected: newSelectAll }));
    setPendingManifests(updatedManifests);
    setPendingStats({
      ...pendingStats,
      selected: newSelectAll ? pendingManifests.length : 0,
    });
  };

  const handleSelectItem = (id: number) => {
    const updatedManifests = pendingManifests.map(item =>
      item.id === id ? { ...item, selected: !item.selected } : item
    );
    setPendingManifests(updatedManifests);
    setPendingStats({
      ...pendingStats,
      selected: updatedManifests.filter(i => i.selected).length,
    });
    setSelectAll(updatedManifests.every(i => i.selected));
  };

  const handleEdit = (record: LorryHireChallan) => {
    setEditMode(true);
    setCurrentEditId(record._id!);
    setBranchName(record.branchName);
    setDespatchType(record.despatchType);
    setLhcNo(record.lhcNo);
    setDate(new Date(record.date));
    setModeType(record.modeType);
    setModeName(record.modeName);
    setOwner(record.owner);
    setVendor(record.vendor);
    setVehicleType(record.vehicleType);
    setBroker(record.broker);
    setRoute(record.route);
    setPan(record.pan);
    setEmptyLorryWeight(record.emptyLorryWeight);
    setDharamKantaWeight(record.dharamKantaWeight);
    setRemarks(record.remarks);
    setHireFreight(record.hireFreight);
    if (record.items && record.items.length > 0) {
      setItems(record.items.map((item, idx) => ({ ...item, id: Date.now() + idx })));
    }
    if (record.additionalCharges) setAdditionalCharges(record.additionalCharges);
    if (record.balancePayableBranches) setBalancePayableBranches(record.balancePayableBranches);
    setTdsType(record.tdsType || "EXEMPTED");
    setTdsPercentage(record.tdsPercentage || 0);
    setApplicableOn(record.applicableOn || 0);
    setLessTds(record.lessTds || 0);
    setCashAdvance(record.cashAdvance || 0);
    setBankAdvance(record.bankAdvance || 0);
    setPetroCardAdvance(record.petroCardAdvance || 0);
    setGuaranteeWeight(record.guaranteeWeight || 0);
    setLhcNotForPayment(record.lhcNotForPayment || false);
    setIssueFuelSlip(record.issueFuelSlip || false);
    setAutoLHC(false);
    setIsEntryModalOpen(true);
    setTimeout(calculateTotals, 100);
  };

  const handleCancelLHC = async () => {
    if (!cancelledReason) {
      toast.error("Please select cancellation reason");
      return;
    }
    if (cancellingLHC) {
      setLoading(true);
      try {
        await cancelLHC(cancellingLHC._id!, cancelledReason);
        toast.success(`LHC ${cancellingLHC.lhcNo} cancelled successfully!`);
        await loadLHCs();
        await loadCancelledLHCs();
        await loadStats();
        setIsCancelDialogOpen(false);
        setCancellingLHC(null);
        setCancelledReason("");
      } catch (error: any) {
        console.error("Cancel error:", error);
        toast.error(error.response?.data?.message || "Failed to cancel LHC");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRestoreLHC = async (record: LorryHireChallan) => {
    if (confirm(`Restore LHC ${record.lhcNo}?`)) {
      setLoading(true);
      try {
        await restoreLHC(record._id!);
        toast.success(`LHC ${record.lhcNo} restored!`);
        await loadLHCs();
        await loadCancelledLHCs();
        await loadStats();
      } catch (error: any) {
        console.error("Restore error:", error);
        toast.error(error.response?.data?.message || "Failed to restore LHC");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async (id: string, lhcNo: string) => {
    if (confirm(`Permanently delete LHC ${lhcNo}? This action cannot be undone.`)) {
      setLoading(true);
      try {
        await deleteLHC(id);
        toast.success("LHC deleted permanently!");
        await loadLHCs();
        await loadCancelledLHCs();
        await loadStats();
      } catch (error: any) {
        console.error("Delete error:", error);
        toast.error(error.response?.data?.message || "Failed to delete LHC");
      } finally {
        setLoading(false);
      }
    }
  };

  const openAddModal = () => {
    resetForm();
    setEditMode(false);
    setCurrentEditId(null);
    setLhcNo("");
    setAutoLHC(true);
    setIsEntryModalOpen(true);
  };

  const openCancelDialog = (record: LorryHireChallan) => {
    setCancellingLHC(record);
    setCancelledReason("");
    setIsCancelDialogOpen(true);
  };

  const handlePrint = () => {
    window.print();
    toast.success("Print dialog opened");
  };

  const activeStats = {
    total: stats.active.count,
    totalFreight: stats.active.totalFreight,
  };

  const cancelledStats = {
    total: stats.cancelled.count,
  };

  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const paginatedResults = searchResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  const totalCancelledPages = Math.ceil(cancelledResults.length / itemsPerPage);
  const paginatedCancelledResults = cancelledResults.slice((cancelledPage - 1) * itemsPerPage, cancelledPage * itemsPerPage);
  const goToCancelledPage = (page: number) => setCancelledPage(Math.max(1, Math.min(page, totalCancelledPages)));

  const totalPendingPages = Math.ceil(pendingManifests.length / itemsPerPage);
  const paginatedPending = pendingManifests.slice((pendingCurrentPage - 1) * itemsPerPage, pendingCurrentPage * itemsPerPage);
  const goToPendingPage = (page: number) => setPendingCurrentPage(Math.max(1, Math.min(page, totalPendingPages)));

  return (
    <div className="space-y-4 p-4 md:p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-wrap justify-between items-start gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-600" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">LORRY HIRE CHALLAN</h1>
            </div>
          </div>
          <Button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            New LHC
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b bg-white rounded-t-lg">
        <button onClick={() => { setMainTab("active"); loadLHCs(); }} className={cn("px-6 py-2.5 text-sm font-medium transition-all rounded-t-lg", mainTab === "active" ? "bg-blue-600 text-white shadow-md" : "text-gray-600 hover:text-gray-800 hover:bg-gray-100")}>Active LHC</button>
        <button onClick={() => { setMainTab("pending"); handlePendingSearch(); }} className={cn("px-6 py-2.5 text-sm font-medium transition-all rounded-t-lg", mainTab === "pending" ? "bg-yellow-600 text-white shadow-md" : "text-gray-600 hover:text-gray-800 hover:bg-gray-100")}>Pending Manifest</button>
        <button onClick={() => { setMainTab("cancelled"); loadCancelledLHCs(); }} className={cn("px-6 py-2.5 text-sm font-medium transition-all rounded-t-lg", mainTab === "cancelled" ? "bg-red-600 text-white shadow-md" : "text-gray-600 hover:text-gray-800 hover:bg-gray-100")}>Cancelled LHC</button>
      </div>

      {/* Active LHC Tab */}
      {mainTab === "active" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white"><CardContent className="p-4"><div className="flex justify-between items-center"><div><p className="text-sm opacity-90">Total Active LHC</p><p className="text-2xl font-bold">{activeStats.total}</p></div><Truck className="h-8 w-8 opacity-80" /></div></CardContent></Card>
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white"><CardContent className="p-4"><div className="flex justify-between items-center"><div><p className="text-sm opacity-90">Total Hire Freight</p><p className="text-2xl font-bold">₹{activeStats.totalFreight.toLocaleString()}</p></div><DollarSign className="h-8 w-8 opacity-80" /></div></CardContent></Card>
          </div>

          <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-semibold flex items-center gap-2"><Search className="h-4 w-4" />Search LHC</CardTitle></CardHeader><CardContent><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div><Label className="text-xs">From Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-9 w-full text-sm justify-start"><CalendarIcon className="mr-2 h-4 w-4" />{format(searchFromDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={searchFromDate} onSelect={(d) => d && setSearchFromDate(d)} /></PopoverContent></Popover></div>
            <div><Label className="text-xs">To Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-9 w-full text-sm justify-start"><CalendarIcon className="mr-2 h-4 w-4" />{format(searchToDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={searchToDate} onSelect={(d) => d && setSearchToDate(d)} /></PopoverContent></Popover></div>
            <div><Label className="text-xs">Branch</Label><Select value={searchBranch} onValueChange={setSearchBranch}><SelectTrigger className="h-9 text-sm"><SelectValue placeholder="All Branches" /></SelectTrigger><SelectContent><SelectItem value="all">All Branches</SelectItem>{branchOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></div>
            <div className="flex gap-2"><Button onClick={handleSearch} className="h-9 text-sm bg-blue-600"><Search className="h-4 w-4 mr-1" />Search</Button><Button onClick={handleClearSearch} variant="outline" className="h-9 text-sm"><RefreshCw className="h-4 w-4" /></Button></div>
          </div></CardContent></Card>

          <Card><CardContent className="p-0"><div className="overflow-x-auto"><Table><TableHeader><TableRow className="bg-gray-50"><TableHead className="text-xs p-3 text-center">#</TableHead><TableHead className="text-xs p-3">LHC #</TableHead><TableHead className="text-xs p-3">Date</TableHead><TableHead className="text-xs p-3">Branch</TableHead><TableHead className="text-xs p-3">Route</TableHead><TableHead className="text-xs p-3">Vehicle Type</TableHead><TableHead className="text-xs p-3 text-right">Hire Freight</TableHead><TableHead className="text-xs p-3 text-center">Actions</TableHead></TableRow></TableHeader><TableBody>
            {loading ? <TableRow><TableCell colSpan={8} className="text-center py-12"><Loader2 className="h-8 w-8 mx-auto animate-spin" /><p>Loading...</p></TableCell></TableRow> : paginatedResults.length === 0 ? <TableRow><TableCell colSpan={8} className="text-center py-12"><Truck className="h-12 w-12 mx-auto opacity-30" /><p>No records found</p></TableCell></TableRow> : paginatedResults.map((record, idx) => (<TableRow key={record._id}><TableCell className="text-center">{(currentPage-1)*itemsPerPage+idx+1}</TableCell><TableCell><Badge variant="outline" className="bg-blue-50">{record.lhcNo}</Badge></TableCell><TableCell>{format(new Date(record.date), "dd-MM-yyyy")}</TableCell><TableCell>{record.branchName}</TableCell><TableCell>{record.route}</TableCell><TableCell>{record.vehicleType}</TableCell><TableCell className="text-right font-semibold">₹{record.hireFreight.toLocaleString()}</TableCell><TableCell><div className="flex gap-1 justify-center"><Button variant="ghost" size="sm" onClick={() => handleEdit(record)}><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="sm" onClick={() => openCancelDialog(record)}><X className="h-4 w-4" /></Button></div></TableCell></TableRow>))}
          </TableBody></Table></div>{totalPages > 1 && <div className="flex justify-center gap-2 p-4"><Button variant="outline" size="sm" onClick={() => goToPage(currentPage-1)} disabled={currentPage===1}>Previous</Button><span className="px-4 py-2 text-sm">Page {currentPage} of {totalPages}</span><Button variant="outline" size="sm" onClick={() => goToPage(currentPage+1)} disabled={currentPage===totalPages}>Next</Button></div>}</CardContent></Card>
        </>
      )}

      {/* Pending Manifest Tab */}
      {mainTab === "pending" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white"><CardContent className="p-4"><div className="flex justify-between"><div><p className="text-sm">Total Pending</p><p className="text-2xl font-bold">{pendingStats.total}</p></div><Clock className="h-8 w-8 opacity-80" /></div></CardContent></Card><Card className="bg-gradient-to-r from-green-500 to-green-600 text-white"><CardContent className="p-4"><div className="flex justify-between"><div><p className="text-sm">Selected Items</p><p className="text-2xl font-bold">{pendingStats.selected}</p></div><Check className="h-8 w-8 opacity-80" /></div></CardContent></Card></div>

          <Card><CardHeader><CardTitle className="text-sm"><Search className="h-4 w-4 inline mr-1" />Search Pending Manifests</CardTitle></CardHeader><CardContent><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            <div><Label>Branch</Label><Select value={pendingBranch} onValueChange={setPendingBranch}><SelectTrigger><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent><SelectItem value="">Select</SelectItem>{branchOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></div>
            <div><Label>To Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="w-full justify-start"><CalendarIcon className="mr-2 h-4 w-4" />{format(pendingToDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={pendingToDate} onSelect={(d) => d && setPendingToDate(d)} /></PopoverContent></Popover></div>
            <div><Label>Mode Type</Label><Select value={pendingModeType} onValueChange={setPendingModeType}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{modeTypeOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></div>
            <div><Label>Despatch Type</Label><Select value={pendingDespatchType} onValueChange={setPendingDespatchType}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{despatchTypeOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></div>
            <div><Label>Manifest For (Days)</Label><Input type="number" value={pendingManifestFor} onChange={(e) => setPendingManifestFor(Number(e.target.value))} /></div>
            <div className="flex gap-2"><Button onClick={handlePendingSearch} className="bg-yellow-600"><Search className="h-4 w-4 mr-1" />Show</Button><Button onClick={handleClearPendingSearch} variant="outline"><RefreshCw className="h-4 w-4" /></Button></div>
          </div></CardContent></Card>

          <Card><CardContent><div className="overflow-x-auto"><Table><TableHeader><TableRow className="bg-gray-50"><TableHead className="w-8 text-center"><input type="checkbox" checked={selectAll} onChange={handleSelectAll} className="h-4 w-4 rounded" /></TableHead><TableHead>#</TableHead><TableHead>Manifest #</TableHead><TableHead>Date</TableHead><TableHead>Mode Name</TableHead><TableHead>Destination</TableHead><TableHead>Driver Name</TableHead><TableHead className="text-center">Pckgs</TableHead><TableHead className="text-right">Weight</TableHead></TableRow></TableHeader><TableBody>
            {loading ? <TableRow><TableCell colSpan={9} className="text-center py-12"><Loader2 className="h-8 w-8 mx-auto animate-spin" /><p>Loading...</p></TableCell></TableRow> : paginatedPending.length === 0 ? <TableRow><TableCell colSpan={9} className="text-center py-12"><Clock className="h-12 w-12 mx-auto opacity-30" /><p>No pending manifests found</p></TableCell></TableRow> : paginatedPending.map((item, idx) => (<TableRow key={item.id}><TableCell className="text-center"><input type="checkbox" checked={item.selected} onChange={() => handleSelectItem(item.id)} className="h-4 w-4 rounded" /></TableCell><TableCell>{(pendingCurrentPage-1)*itemsPerPage+idx+1}</TableCell><TableCell className="font-mono">{item.manifestNo}</TableCell><TableCell>{format(new Date(item.manifestDate), "dd-MM-yyyy")}</TableCell><TableCell>{item.modeName}</TableCell><TableCell>{item.destination}</TableCell><TableCell>{item.driverName}</TableCell><TableCell className="text-center">{item.noOfPckgs}</TableCell><TableCell className="text-right">{item.chargeWeight}</TableCell></TableRow>))}
          </TableBody></Table></div>{totalPendingPages > 1 && <div className="flex justify-center gap-2 p-4"><Button variant="outline" size="sm" onClick={() => goToPendingPage(pendingCurrentPage-1)} disabled={pendingCurrentPage===1}>Previous</Button><span className="px-4 py-2 text-sm">Page {pendingCurrentPage} of {totalPendingPages}</span><Button variant="outline" size="sm" onClick={() => goToPendingPage(pendingCurrentPage+1)} disabled={pendingCurrentPage===totalPendingPages}>Next</Button></div>}</CardContent></Card>
        </>
      )}

      {/* Cancelled LHC Tab */}
      {mainTab === "cancelled" && (
        <>
          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white"><CardContent className="p-4"><div className="flex justify-between"><div><p className="text-sm">Total Cancelled LHC</p><p className="text-2xl font-bold">{cancelledStats.total}</p></div><X className="h-8 w-8 opacity-80" /></div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm"><Search className="h-4 w-4 inline mr-1" />Search Cancelled LHC</CardTitle></CardHeader><CardContent><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"><div><Label>From Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="w-full justify-start"><CalendarIcon className="mr-2 h-4 w-4" />{format(searchFromDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={searchFromDate} onSelect={(d) => d && setSearchFromDate(d)} /></PopoverContent></Popover></div><div><Label>To Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="w-full justify-start"><CalendarIcon className="mr-2 h-4 w-4" />{format(searchToDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={searchToDate} onSelect={(d) => d && setSearchToDate(d)} /></PopoverContent></Popover></div><div><Label>Branch</Label><Select value={searchBranch} onValueChange={setSearchBranch}><SelectTrigger><SelectValue placeholder="All Branches" /></SelectTrigger><SelectContent><SelectItem value="all">All Branches</SelectItem>{branchOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></div><div className="flex gap-2"><Button onClick={handleCancelSearch} className="bg-red-600"><Search className="h-4 w-4 mr-1" />Search</Button><Button onClick={handleClearSearch} variant="outline"><RefreshCw className="h-4 w-4" /></Button></div></div></CardContent></Card>
          <Card><CardContent><div className="overflow-x-auto"><Table><TableHeader><TableRow className="bg-gray-50"><TableHead>#</TableHead><TableHead>LHC #</TableHead><TableHead>Date</TableHead><TableHead>Branch</TableHead><TableHead>Route</TableHead><TableHead className="text-center">Status</TableHead><TableHead className="text-center">Actions</TableHead></TableRow></TableHeader><TableBody>
            {loading ? <TableRow><TableCell colSpan={7} className="text-center py-12"><Loader2 className="h-8 w-8 mx-auto animate-spin" /><p>Loading...</p></TableCell></TableRow> : paginatedCancelledResults.length === 0 ? <TableRow><TableCell colSpan={7} className="text-center py-12"><X className="h-12 w-12 mx-auto opacity-30" /><p>No cancelled records found</p></TableCell></TableRow> : paginatedCancelledResults.map((record, idx) => (<TableRow key={record._id} className="bg-red-50/30"><TableCell>{(cancelledPage-1)*itemsPerPage+idx+1}</TableCell><TableCell><Badge variant="outline" className="bg-red-50 text-red-700">{record.lhcNo}</Badge></TableCell><TableCell>{format(new Date(record.date), "dd-MM-yyyy")}</TableCell><TableCell>{record.branchName}</TableCell><TableCell>{record.route}</TableCell><TableCell className="text-center"><Badge className="bg-red-100 text-red-700">Cancelled</Badge></TableCell><TableCell className="text-center"><div className="flex gap-1 justify-center"><Button variant="ghost" size="sm" onClick={() => handleRestoreLHC(record)}><RefreshCw className="h-4 w-4 text-green-500" /></Button><Button variant="ghost" size="sm" onClick={() => handleDelete(record._id!, record.lhcNo)}><Trash2 className="h-4 w-4 text-red-500" /></Button></div></TableCell></TableRow>))}
          </TableBody></Table></div>{totalCancelledPages > 1 && <div className="flex justify-center gap-2 p-4"><Button variant="outline" size="sm" onClick={() => goToCancelledPage(cancelledPage-1)} disabled={cancelledPage===1}>Previous</Button><span className="px-4 py-2 text-sm">Page {cancelledPage} of {totalCancelledPages}</span><Button variant="outline" size="sm" onClick={() => goToCancelledPage(cancelledPage+1)} disabled={cancelledPage===totalCancelledPages}>Next</Button></div>}</CardContent></Card>
        </>
      )}

      {/* Cancel LHC Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}><DialogContent><DialogHeader><DialogTitle className="flex items-center gap-2 text-red-600"><X className="h-5 w-5" />Cancel Lorry Hire Challan</DialogTitle><DialogDescription>Are you sure you want to cancel LHC <strong>{cancellingLHC?.lhcNo}</strong>?</DialogDescription></DialogHeader><div className="py-4"><Label>Cancellation Reason *</Label><Select value={cancelledReason} onValueChange={setCancelledReason}><SelectTrigger><SelectValue placeholder="Select cancellation reason" /></SelectTrigger><SelectContent>{cancelledReasonOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></div><DialogFooter><Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>No, Keep LHC</Button><Button variant="destructive" onClick={handleCancelLHC} disabled={loading}>{loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Yes, Cancel LHC</Button></DialogFooter></DialogContent></Dialog>

      {/* Main Entry Modal */}
      <Dialog open={isEntryModalOpen} onOpenChange={setIsEntryModalOpen}>
        <DialogContent className="w-[95vw] max-w-7xl max-h-[90vh] overflow-y-auto z-[9999]">
          <DialogHeader className="sticky top-0 bg-white z-10 pb-3 border-b"><DialogTitle className="text-xl flex items-center gap-2">{editMode ? <><Edit className="h-5 w-5 text-blue-600" /> Edit Lorry Hire Challan</> : <><Plus className="h-5 w-5 text-blue-600" /> Create New Lorry Hire Challan</>}</DialogTitle><DialogDescription>Fill in all LHC details below.</DialogDescription></DialogHeader>

          <div className="space-y-4 py-4">
            {/* Basic Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div><Label>Branch Name <span className="text-red-500">*</span></Label><Select value={branchName} onValueChange={setBranchName}><SelectTrigger><SelectValue placeholder="SELECT BRANCH" /></SelectTrigger><SelectContent>{branchOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Despatch Type</Label><Select value={despatchType} onValueChange={setDespatchType}><SelectTrigger><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{despatchTypeOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>LHC #</Label><div className="flex gap-2"><Input value={lhcNo} onChange={(e) => setLhcNo(e.target.value)} readOnly={autoLHC} className={cn("flex-1", autoLHC && "bg-gray-50")} placeholder={autoLHC ? "Auto-generated" : "Enter LHC No"} /><div className="flex items-center gap-2"><input type="checkbox" checked={autoLHC} onChange={(e) => setAutoLHC(e.target.checked)} className="h-4 w-4 rounded" id="auto" /><Label htmlFor="auto" className="text-sm cursor-pointer">Auto</Label></div></div></div>
              <div><Label>Date <span className="text-red-500">*</span></Label><Popover><PopoverTrigger asChild><Button variant="outline" className="w-full justify-start"><CalendarIcon className="mr-2 h-4 w-4" />{format(date, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} /></PopoverContent></Popover></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div><Label>Mode Type</Label><Select value={modeType} onValueChange={setModeType}><SelectTrigger><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{modeTypeOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Mode Name</Label><Select value={modeName} onValueChange={setModeName}><SelectTrigger><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{modeNameOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Owner</Label><Select value={owner} onValueChange={setOwner}><SelectTrigger><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{ownerOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Vendor</Label><Select value={vendor} onValueChange={setVendor}><SelectTrigger><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{vendorOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div><Label>Vehicle Type</Label><Select value={vehicleType} onValueChange={setVehicleType}><SelectTrigger><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{vehicleTypeOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Broker</Label><Select value={broker} onValueChange={setBroker}><SelectTrigger><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{brokerOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Route</Label><Select value={route} onValueChange={setRoute}><SelectTrigger><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{routeOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>PAN</Label><Input value={pan} onChange={(e) => setPan(e.target.value.toUpperCase())} placeholder="Enter PAN" className="uppercase" /></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label>Empty Lorry Weight (kg)</Label><Input type="number" value={emptyLorryWeight} onChange={(e) => setEmptyLorryWeight(Number(e.target.value))} /></div>
              <div><Label>Dharam Kanta Weight (kg)</Label><Input type="number" value={dharamKantaWeight} onChange={(e) => setDharamKantaWeight(Number(e.target.value))} /></div>
            </div>

            <div><Label>Remarks</Label><Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={2} placeholder="Enter remarks..." /></div>

            {/* Items Table */}
            <div className="rounded-md border">
              <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center"><h3 className="font-semibold">Challan Details</h3><Button onClick={addItemRow} variant="ghost" size="sm"><PlusCircle className="mr-1 h-4 w-4" /> Add Row</Button></div>
              <div className="overflow-x-auto p-4"><Table><TableHeader><TableRow className="bg-gray-50"><TableHead className="w-12">#</TableHead><TableHead>Challan#</TableHead><TableHead>Challan Date</TableHead><TableHead>From</TableHead><TableHead>To</TableHead><TableHead>Pckgs</TableHead><TableHead>Chargeable Wt</TableHead><TableHead>Rate</TableHead><TableHead>Amount</TableHead><TableHead className="w-8">Action</TableHead></TableRow></TableHeader><TableBody>
                {items.map((item, idx) => (<TableRow key={item.id}><TableCell>{idx+1}</TableCell><TableCell><Input value={item.challanNo} onChange={(e) => updateItem(item.id, "challanNo", e.target.value)} className="h-8 w-28" /></TableCell><TableCell><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-28"><CalendarIcon className="mr-1 h-3 w-3" />{format(item.challanDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={item.challanDate} onSelect={(d) => d && updateItem(item.id, "challanDate", d)} /></PopoverContent></Popover></TableCell><TableCell><Input value={item.from} onChange={(e) => updateItem(item.id, "from", e.target.value)} className="h-8 w-24" /></TableCell><TableCell><Input value={item.to} onChange={(e) => updateItem(item.id, "to", e.target.value)} className="h-8 w-24" /></TableCell><TableCell><Input type="number" value={item.pckgs} onChange={(e) => updateItem(item.id, "pckgs", Number(e.target.value))} className="h-8 w-20" /></TableCell><TableCell><Input type="number" value={item.chargeableWeight} onChange={(e) => updateItem(item.id, "chargeableWeight", Number(e.target.value))} className="h-8 w-24" step="0.01" /></TableCell><TableCell><Input type="number" value={item.rate} onChange={(e) => updateItem(item.id, "rate", Number(e.target.value))} className="h-8 w-20" /></TableCell><TableCell className="font-mono">₹{item.calcAmount.toFixed(2)}</TableCell><TableCell><Button variant="ghost" size="sm" onClick={() => removeItem(item.id)} className="h-8 w-8 p-0 text-red-500"><Trash2 className="h-4 w-4" /></Button></TableCell></TableRow>))}
              </TableBody></Table></div>
            </div>

            <div className="flex justify-end items-center gap-3"><div><Label className="font-semibold">Hire Freight</Label><Input type="number" value={hireFreight} onChange={(e) => setHireFreight(Number(e.target.value))} className="h-9 w-48 text-right font-bold" /></div><Button onClick={updateHireFreight} variant="outline"><Calculator className="mr-1 h-4 w-4" /> Recalculate</Button></div>

            {/* Additional Charges Table */}
            <div className="rounded-md border">
              <div className="bg-gray-50 px-4 py-3 border-b"><h3 className="font-semibold">Additional Charges</h3></div>
              <div className="overflow-x-auto p-4"><Table><TableHeader><TableRow className="bg-gray-50"><TableHead>#</TableHead><TableHead>Particulars</TableHead><TableHead className="w-24">Address(+/-)</TableHead><TableHead>Amount</TableHead><TableHead className="w-24">TDS Applicable</TableHead><TableHead>Advance</TableHead><TableHead className="w-24">Check List</TableHead></TableRow></TableHeader><TableBody>
                {additionalCharges.map((charge, idx) => (<TableRow key={charge.id}><TableCell>{idx+1}</TableCell><TableCell>{charge.name}</TableCell><TableCell><Select value={charge.type} onValueChange={(val) => updateAdditionalCharge(charge.id, "type", val as "add" | "subtract")}><SelectTrigger className="h-8 w-20"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="add">+</SelectItem><SelectItem value="subtract">-</SelectItem></SelectContent></Select></TableCell><TableCell><Input type="number" value={charge.amount} onChange={(e) => updateAdditionalCharge(charge.id, "amount", Number(e.target.value))} className="h-8 w-32 text-right" /></TableCell><TableCell className="text-center"><input type="checkbox" checked={charge.tdsApplicable} onChange={(e) => updateAdditionalCharge(charge.id, "tdsApplicable", e.target.checked)} className="h-4 w-4" /></TableCell><TableCell><Input type="number" value={charge.advance} onChange={(e) => updateAdditionalCharge(charge.id, "advance", Number(e.target.value))} className="h-8 w-32 text-right" /></TableCell><TableCell className="text-center">{charge.hasChecklist && <input type="checkbox" className="h-4 w-4" />}</TableCell></TableRow>))}
              </TableBody></Table></div>
            </div>

            {/* TDS and Advance Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3"><div><Label>TDS Type <span className="text-red-500">*</span></Label><Select value={tdsType} onValueChange={setTdsType}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{tdsTypeOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></div><div><Label>TDS%</Label><Input type="number" value={tdsPercentage} onChange={(e) => setTdsPercentage(Number(e.target.value))} /></div><div><Label>Applicable On</Label><Input type="number" value={applicableOn} onChange={(e) => setApplicableOn(Number(e.target.value))} /></div><div><Label>Less TDS</Label><Input type="number" value={lessTds} readOnly className="bg-gray-50" /></div></div>
                <div className="grid grid-cols-3 gap-3"><div><Label>Cash Advance</Label><Input type="number" value={cashAdvance} onChange={(e) => setCashAdvance(Number(e.target.value))} /></div><div><Label>Bank Advance</Label><Input type="number" value={bankAdvance} onChange={(e) => setBankAdvance(Number(e.target.value))} /></div><div><Label>Petro Card Advance</Label><Input type="number" value={petroCardAdvance} onChange={(e) => setPetroCardAdvance(Number(e.target.value))} /></div></div>
              </div>
              <div className="space-y-3">
                <div><Label>Guarantee Weight (kg)</Label><Input type="number" value={guaranteeWeight} onChange={(e) => setGuaranteeWeight(Number(e.target.value))} /></div>
                <div className="flex gap-4"><label className="flex items-center gap-2"><input type="checkbox" checked={lhcNotForPayment} onChange={(e) => setLhcNotForPayment(e.target.checked)} className="h-4 w-4 rounded" /><span>LHC Not For Payment</span></label><label className="flex items-center gap-2"><input type="checkbox" checked={issueFuelSlip} onChange={(e) => setIssueFuelSlip(e.target.checked)} className="h-4 w-4 rounded" /><Fuel className="h-4 w-4" /><span>ISSUE FUEL SLIP</span></label></div>
              </div>
            </div>

            {/* Balance Payable Section */}
            <div className="rounded-md border">
              <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center"><h3 className="font-semibold">Balance Payable At</h3><Button onClick={addBalancePayableBranch} variant="ghost" size="sm"><PlusCircle className="mr-1 h-4 w-4" /> ADD MORE...</Button></div>
              <div className="p-4"><Table><TableHeader><TableRow><TableHead>S#</TableHead><TableHead>Branch</TableHead><TableHead>Amount</TableHead><TableHead className="w-8">Action</TableHead></TableRow></TableHeader><TableBody>
                {balancePayableBranches.map((branch, idx) => (<TableRow key={branch.id}><TableCell>{idx+1}</TableCell><TableCell><Select value={branch.branch} onValueChange={(val) => updateBalancePayableBranch(branch.id, "branch", val)}><SelectTrigger><SelectValue placeholder="SELECT BRANCH" /></SelectTrigger><SelectContent>{branchPaymentOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></TableCell><TableCell><Input type="number" value={branch.amount} onChange={(e) => updateBalancePayableBranch(branch.id, "amount", Number(e.target.value))} className="w-40 text-right" /></TableCell><TableCell><Button variant="ghost" size="sm" onClick={() => removeBalancePayableBranch(branch.id)} disabled={balancePayableBranches.length === 1}><Trash2 className="h-4 w-4 text-red-500" /></Button></TableCell></TableRow>))}
              </TableBody></Table></div>
              <div className="p-4 bg-gray-50 border-t flex justify-between items-center"><span className="font-bold">Balance Payable</span><span className="text-xl font-bold text-blue-600">₹{balancePayable.toFixed(2)}</span></div>
              <div className="p-4 bg-gray-100 border-t flex justify-between items-center"><span className="font-bold">Total:</span><span className="text-xl font-bold text-green-600">₹{(hireFreight + totalAdditionalCharges).toFixed(2)}</span><span className="font-bold">Amount:</span><span className="text-xl font-bold text-orange-600">₹{balancePayable.toFixed(2)}</span></div>
            </div>
          </div>

          <DialogFooter className="sticky bottom-0 bg-white pt-3 border-t gap-2">
            <Button variant="outline" onClick={handlePrint}><Printer className="mr-1 h-4 w-4" /> Print</Button>
            <Button variant="outline" onClick={() => setIsEntryModalOpen(false)}><X className="mr-1 h-4 w-4" /> Cancel</Button>
            <Button onClick={handleSave} disabled={loading} className="bg-blue-600"><Save className="mr-1 h-4 w-4" />{editMode ? "Update" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}