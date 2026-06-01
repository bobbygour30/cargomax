"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { CalendarIcon, Plus, Trash2, X, Save, RefreshCw, Search, Edit, Pencil, Users, Package, Calendar, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ConsignmentCharge {
  id: number;
  chargeCode: string;
  active: boolean;
  chargeName: string;
  displayName: string;
  aliasName: string;
  chargeType: string;
  amountType: string;
  chargeAmount: string;
  minimumAmount: string;
  applicableOn: string;
  sacCode: string;
  bookingOnFreightLedger: boolean;
  printSequenceNo: string;
  ledger: string;
  chargeAmountOnBankBuilty: string;
  applicableOnBooking: boolean;
  applicableOnAirBooking: boolean;
  gstApplicable: boolean;
  applicableOnDelivery: boolean;
  applicableOnTrainBooking: boolean;
  allowAtBillUpdation: boolean;
  applicableOnMarketLoad: boolean;
  applicableOnSurfaceBooking: boolean;
  allowToUpdateFromAdditionalCharges: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface GoodsWiseCharge {
  id: number;
  goodsGroup: string;
  rate: string;
  amount: string;
  wefDate: Date;
  uptoDate?: Date;
}

interface BranchSelection {
  id: number;
  name: string;
  selected: boolean;
}

// Sample branch list
const branchList = [
  "AGARTALA", "AGRA", "AHMEDABAD CITY", "AHMEDABAD-ASALAI (HUB)", "AKBERPUR/AMBEDKAR NAGAR",
  "ALIGARH (MUKESH SINGH)", "ALIGARH (RAVI)", "ALIPURDUAR", "ALLAHABAD", "ALZALGARH",
  "AMRITSAR", "ANOOPSHER", "ARARIA COURT", "ARRAH", "ASANSOL", "AURANGABAD B.R",
  "AURANGABAD U.P", "AZAMGARH", "BABRALA", "BADDI", "BAHERI", "BAHJOI", "BAKROL",
  "BALLIA", "BANKURA", "BARAUT", "BAREILLY", "BARHALGANJ", "BARHI", "BARPETA ROAD",
  "BARWALA", "BASTI", "BAWANA", "BEGUSARAI", "BELTHARA ROAD", "BERHAMPORE W.B",
  "BETTIAH", "BHABHUA", "BHADOHI", "BHAGALPUR", "BHAVNAGAR", "BHIWANI", "BHULANDSHAHAR",
  "BIHARIGANJ", "BIHARSHARIF", "BIHIYA", "BIHTA", "BIJNOR", "BILASIPARA", "BONGAIGOAN"
];

const applicableOnOptions = [
  "Docket", "Freight", "Weight", "Packages", "Value of GR", "Total Freight"
];

const ledgerOptions = [
  "Freight Ledger", "Other Income Ledger", "Expense Ledger"
];

const chargeTypeOptions = ["Amount", "Percentage", "Slab"];
const amountTypeOptions = ["Fixed", "Variable"];

export default function ConsignmentChargesMaster() {
  // Sheet state
  const [isEntrySheetOpen, setIsEntrySheetOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<number | null>(null);
  
  // Form state
  const [chargeCode, setChargeCode] = useState<string>("");
  const [active, setActive] = useState<boolean>(true);
  const [chargeName, setChargeName] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [aliasName, setAliasName] = useState<string>("");
  const [chargeType, setChargeType] = useState<string>("");
  const [amountType, setAmountType] = useState<string>("");
  const [chargeAmount, setChargeAmount] = useState<string>("0");
  const [minimumAmount, setMinimumAmount] = useState<string>("0");
  const [applicableOn, setApplicableOn] = useState<string>("");
  const [sacCode, setSacCode] = useState<string>("");
  const [bookingOnFreightLedger, setBookingOnFreightLedger] = useState<boolean>(false);
  const [printSequenceNo, setPrintSequenceNo] = useState<string>("");
  const [ledger, setLedger] = useState<string>("");
  const [chargeAmountOnBankBuilty, setChargeAmountOnBankBuilty] = useState<string>("0");
  const [applicableOnBooking, setApplicableOnBooking] = useState<boolean>(false);
  const [applicableOnAirBooking, setApplicableOnAirBooking] = useState<boolean>(false);
  const [gstApplicable, setGstApplicable] = useState<boolean>(false);
  const [applicableOnDelivery, setApplicableOnDelivery] = useState<boolean>(false);
  const [applicableOnTrainBooking, setApplicableOnTrainBooking] = useState<boolean>(false);
  const [allowAtBillUpdation, setAllowAtBillUpdation] = useState<boolean>(false);
  const [applicableOnMarketLoad, setApplicableOnMarketLoad] = useState<boolean>(false);
  const [applicableOnSurfaceBooking, setApplicableOnSurfaceBooking] = useState<boolean>(false);
  const [allowToUpdateFromAdditionalCharges, setAllowToUpdateFromAdditionalCharges] = useState<boolean>(false);

  // Search state
  const [searchResults, setSearchResults] = useState<ConsignmentCharge[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Goods Wise Charges Modal state
  const [isGoodsWiseModalOpen, setIsGoodsWiseModalOpen] = useState(false);
  const [selectedChargeForGoods, setSelectedChargeForGoods] = useState<ConsignmentCharge | null>(null);
  const [goodsWiseActiveTab, setGoodsWiseActiveTab] = useState<"entry" | "search">("entry");
  const [goodsWiseCharges, setGoodsWiseCharges] = useState<GoodsWiseCharge[]>([]);
  const [editGoodsWiseId, setEditGoodsWiseId] = useState<number | null>(null);
  const [wefDate, setWefDate] = useState<Date>(new Date());
  const [uptoDate, setUptoDate] = useState<Date | undefined>();
  const [goodsGroup, setGoodsGroup] = useState<string>("");
  const [rate, setRate] = useState<string>("0");
  const [amount, setAmount] = useState<string>("0");

  // Add Branch Modal state
  const [isAddBranchModalOpen, setIsAddBranchModalOpen] = useState(false);
  const [selectedChargeForBranch, setSelectedChargeForBranch] = useState<ConsignmentCharge | null>(null);
  const [branchSearchTerm, setBranchSearchTerm] = useState("");
  const [selectAllBranches, setSelectAllBranches] = useState(false);
  const [branches, setBranches] = useState<BranchSelection[]>([]);
  const [allocatedBranches, setAllocatedBranches] = useState<BranchSelection[]>([]);

  // Sample saved data
  const [savedRecords, setSavedRecords] = useState<ConsignmentCharge[]>([
    {
      id: 1, chargeCode: "A0005", active: true, chargeName: "OTHER CHARGES", displayName: "OTHER CHARGES",
      aliasName: "OTHER CHARGES", chargeType: "Amount", amountType: "Fixed", chargeAmount: "0", minimumAmount: "0",
      applicableOn: "Docket", sacCode: "996511", bookingOnFreightLedger: false, printSequenceNo: "", ledger: "Freight Ledger",
      chargeAmountOnBankBuilty: "0", applicableOnBooking: false, applicableOnAirBooking: false, gstApplicable: false,
      applicableOnDelivery: false, applicableOnTrainBooking: false, allowAtBillUpdation: false, applicableOnMarketLoad: false,
      applicableOnSurfaceBooking: false, allowToUpdateFromAdditionalCharges: false, createdAt: new Date(), updatedAt: new Date()
    },
    {
      id: 2, chargeCode: "A0102", active: true, chargeName: "GREEN TAX CHARGE", displayName: "GREEN TAX CHARGE",
      aliasName: "GREEN TAX CHARGE", chargeType: "Amount", amountType: "Fixed", chargeAmount: "0", minimumAmount: "0",
      applicableOn: "Docket", sacCode: "996511", bookingOnFreightLedger: false, printSequenceNo: "", ledger: "Freight Ledger",
      chargeAmountOnBankBuilty: "0", applicableOnBooking: false, applicableOnAirBooking: false, gstApplicable: false,
      applicableOnDelivery: false, applicableOnTrainBooking: false, allowAtBillUpdation: false, applicableOnMarketLoad: false,
      applicableOnSurfaceBooking: false, allowToUpdateFromAdditionalCharges: false, createdAt: new Date(), updatedAt: new Date()
    },
    {
      id: 3, chargeCode: "A0103", active: true, chargeName: "HAMALI CHARGE", displayName: "HAMALI CHARGE",
      aliasName: "", chargeType: "Amount", amountType: "Fixed", chargeAmount: "0", minimumAmount: "0",
      applicableOn: "Docket", sacCode: "996511", bookingOnFreightLedger: false, printSequenceNo: "", ledger: "Freight Ledger",
      chargeAmountOnBankBuilty: "0", applicableOnBooking: false, applicableOnAirBooking: false, gstApplicable: false,
      applicableOnDelivery: false, applicableOnTrainBooking: false, allowAtBillUpdation: false, applicableOnMarketLoad: false,
      applicableOnSurfaceBooking: false, allowToUpdateFromAdditionalCharges: false, createdAt: new Date(), updatedAt: new Date()
    },
    {
      id: 4, chargeCode: "A0107", active: true, chargeName: "FOV CHARGES", displayName: "FOV CHARGES",
      aliasName: "FOV CHARGES", chargeType: "Amount", amountType: "Fixed", chargeAmount: "0", minimumAmount: "0",
      applicableOn: "Docket", sacCode: "996761", bookingOnFreightLedger: false, printSequenceNo: "", ledger: "Freight Ledger",
      chargeAmountOnBankBuilty: "0", applicableOnBooking: false, applicableOnAirBooking: false, gstApplicable: false,
      applicableOnDelivery: false, applicableOnTrainBooking: false, allowAtBillUpdation: false, applicableOnMarketLoad: false,
      applicableOnSurfaceBooking: false, allowToUpdateFromAdditionalCharges: false, createdAt: new Date(), updatedAt: new Date()
    },
    {
      id: 5, chargeCode: "A0108", active: true, chargeName: "DOOR DELIVERY", displayName: "DOOR DELIVERY",
      aliasName: "", chargeType: "Amount", amountType: "Fixed", chargeAmount: "0", minimumAmount: "0",
      applicableOn: "Docket", sacCode: "996511", bookingOnFreightLedger: false, printSequenceNo: "", ledger: "Freight Ledger",
      chargeAmountOnBankBuilty: "0", applicableOnBooking: false, applicableOnAirBooking: false, gstApplicable: false,
      applicableOnDelivery: false, applicableOnTrainBooking: false, allowAtBillUpdation: false, applicableOnMarketLoad: false,
      applicableOnSurfaceBooking: false, allowToUpdateFromAdditionalCharges: false, createdAt: new Date(), updatedAt: new Date()
    },
    {
      id: 6, chargeCode: "A0120", active: true, chargeName: "DOCKET CHARGE", displayName: "DOCKET CHARGE",
      aliasName: "DOCKET CHARGE", chargeType: "Amount", amountType: "Fixed", chargeAmount: "100", minimumAmount: "0",
      applicableOn: "Docket", sacCode: "996511", bookingOnFreightLedger: false, printSequenceNo: "", ledger: "Freight Ledger",
      chargeAmountOnBankBuilty: "0", applicableOnBooking: false, applicableOnAirBooking: false, gstApplicable: false,
      applicableOnDelivery: false, applicableOnTrainBooking: false, allowAtBillUpdation: false, applicableOnMarketLoad: false,
      applicableOnSurfaceBooking: false, allowToUpdateFromAdditionalCharges: false, createdAt: new Date(), updatedAt: new Date()
    },
  ]);

  // Sample goods wise charges data
  const [savedGoodsWiseCharges, setSavedGoodsWiseCharges] = useState<Record<number, GoodsWiseCharge[]>>({});

  // Load search results on mount
  useEffect(() => {
    setSearchResults(savedRecords);
  }, []);

  const generateChargeCode = () => {
    const lastCode = savedRecords[savedRecords.length - 1]?.chargeCode;
    if (lastCode) {
      const num = parseInt(lastCode.substring(1)) + 1;
      return `A${String(num).padStart(4, '0')}`;
    }
    return "A0001";
  };

  // Reset form
  const resetForm = () => {
    setChargeCode(generateChargeCode());
    setActive(true);
    setChargeName("");
    setDisplayName("");
    setAliasName("");
    setChargeType("");
    setAmountType("");
    setChargeAmount("0");
    setMinimumAmount("0");
    setApplicableOn("");
    setSacCode("");
    setBookingOnFreightLedger(false);
    setPrintSequenceNo("");
    setLedger("");
    setChargeAmountOnBankBuilty("0");
    setApplicableOnBooking(false);
    setApplicableOnAirBooking(false);
    setGstApplicable(false);
    setApplicableOnDelivery(false);
    setApplicableOnTrainBooking(false);
    setAllowAtBillUpdation(false);
    setApplicableOnMarketLoad(false);
    setApplicableOnSurfaceBooking(false);
    setAllowToUpdateFromAdditionalCharges(false);
    setEditMode(false);
    setCurrentEditId(null);
  };

  const handleSave = () => {
    if (!chargeName) {
      alert("Please enter Charge Name");
      return;
    }
    if (!chargeType) {
      alert("Please select Charge Type");
      return;
    }
    if (!amountType) {
      alert("Please select Amount Type");
      return;
    }
    if (!ledger) {
      alert("Please select Ledger");
      return;
    }

    const newRecord: ConsignmentCharge = {
      id: currentEditId || Date.now(),
      chargeCode: chargeCode,
      active: active,
      chargeName: chargeName,
      displayName: displayName || chargeName,
      aliasName: aliasName,
      chargeType: chargeType,
      amountType: amountType,
      chargeAmount: chargeAmount,
      minimumAmount: minimumAmount,
      applicableOn: applicableOn,
      sacCode: sacCode,
      bookingOnFreightLedger: bookingOnFreightLedger,
      printSequenceNo: printSequenceNo,
      ledger: ledger,
      chargeAmountOnBankBuilty: chargeAmountOnBankBuilty,
      applicableOnBooking: applicableOnBooking,
      applicableOnAirBooking: applicableOnAirBooking,
      gstApplicable: gstApplicable,
      applicableOnDelivery: applicableOnDelivery,
      applicableOnTrainBooking: applicableOnTrainBooking,
      allowAtBillUpdation: allowAtBillUpdation,
      applicableOnMarketLoad: applicableOnMarketLoad,
      applicableOnSurfaceBooking: applicableOnSurfaceBooking,
      allowToUpdateFromAdditionalCharges: allowToUpdateFromAdditionalCharges,
      createdAt: editMode && currentEditId ? 
        savedRecords.find(r => r.id === currentEditId)?.createdAt || new Date() : 
        new Date(),
      updatedAt: new Date(),
    };

    if (editMode && currentEditId) {
      setSavedRecords(savedRecords.map(record => record.id === currentEditId ? newRecord : record));
      alert("Record updated successfully!");
    } else {
      setSavedRecords([...savedRecords, newRecord]);
      alert("Record saved successfully!");
    }
    
    resetForm();
    setIsEntrySheetOpen(false);
    handleSearch();
  };

  const handleSearch = () => {
    let results = [...savedRecords];
    if (searchTerm) {
      results = results.filter(r => 
        r.chargeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.chargeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.aliasName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setSearchResults(results);
    setCurrentPage(1);
  };

  const handleEdit = (record: ConsignmentCharge) => {
    setEditMode(true);
    setCurrentEditId(record.id);
    setChargeCode(record.chargeCode);
    setActive(record.active);
    setChargeName(record.chargeName);
    setDisplayName(record.displayName);
    setAliasName(record.aliasName);
    setChargeType(record.chargeType);
    setAmountType(record.amountType);
    setChargeAmount(record.chargeAmount);
    setMinimumAmount(record.minimumAmount);
    setApplicableOn(record.applicableOn);
    setSacCode(record.sacCode);
    setBookingOnFreightLedger(record.bookingOnFreightLedger);
    setPrintSequenceNo(record.printSequenceNo);
    setLedger(record.ledger);
    setChargeAmountOnBankBuilty(record.chargeAmountOnBankBuilty);
    setApplicableOnBooking(record.applicableOnBooking);
    setApplicableOnAirBooking(record.applicableOnAirBooking);
    setGstApplicable(record.gstApplicable);
    setApplicableOnDelivery(record.applicableOnDelivery);
    setApplicableOnTrainBooking(record.applicableOnTrainBooking);
    setAllowAtBillUpdation(record.allowAtBillUpdation);
    setApplicableOnMarketLoad(record.applicableOnMarketLoad);
    setApplicableOnSurfaceBooking(record.applicableOnSurfaceBooking);
    setAllowToUpdateFromAdditionalCharges(record.allowToUpdateFromAdditionalCharges);
    setIsEntrySheetOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this record?")) {
      setSavedRecords(savedRecords.filter(record => record.id !== id));
      setSearchResults(searchResults.filter(record => record.id !== id));
      alert("Record deleted successfully!");
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults(savedRecords);
  };

  const openAddSheet = () => {
    resetForm();
    setEditMode(false);
    setCurrentEditId(null);
    setChargeCode(generateChargeCode());
    setIsEntrySheetOpen(true);
  };

  // Goods Wise Charges functions
  const handleGoodsWiseCharges = (record: ConsignmentCharge) => {
    setSelectedChargeForGoods(record);
    setGoodsWiseCharges(savedGoodsWiseCharges[record.id] || []);
    setGoodsWiseActiveTab("entry");
    resetGoodsWiseForm();
    setIsGoodsWiseModalOpen(true);
  };

  const resetGoodsWiseForm = () => {
    setWefDate(new Date());
    setUptoDate(undefined);
    setGoodsGroup("");
    setRate("0");
    setAmount("0");
    setEditGoodsWiseId(null);
  };

  const handleSaveGoodsWise = () => {
    if (!goodsGroup) {
      alert("Please enter Goods Group");
      return;
    }

    const newGoodsWise: GoodsWiseCharge = {
      id: editGoodsWiseId || Date.now(),
      goodsGroup: goodsGroup,
      rate: rate,
      amount: amount,
      wefDate: wefDate,
      uptoDate: uptoDate,
    };

    let updatedCharges: GoodsWiseCharge[];
    if (editGoodsWiseId) {
      updatedCharges = goodsWiseCharges.map(c => c.id === editGoodsWiseId ? newGoodsWise : c);
    } else {
      updatedCharges = [...goodsWiseCharges, newGoodsWise];
    }

    setGoodsWiseCharges(updatedCharges);
    
    if (selectedChargeForGoods) {
      setSavedGoodsWiseCharges({
        ...savedGoodsWiseCharges,
        [selectedChargeForGoods.id]: updatedCharges
      });
    }
    
    resetGoodsWiseForm();
    alert("Goods wise charge saved successfully!");
  };

  const handleDeleteGoodsWise = (id: number) => {
    if (confirm("Are you sure you want to remove this goods wise charge?")) {
      const updatedCharges = goodsWiseCharges.filter(c => c.id !== id);
      setGoodsWiseCharges(updatedCharges);
      if (selectedChargeForGoods) {
        setSavedGoodsWiseCharges({
          ...savedGoodsWiseCharges,
          [selectedChargeForGoods.id]: updatedCharges
        });
      }
    }
  };

  // Add Branch functions
  const handleAddBranch = (record: ConsignmentCharge) => {
    setSelectedChargeForBranch(record);
    const branchListData: BranchSelection[] = branchList.map((name, index) => ({
      id: index + 1,
      name: name,
      selected: allocatedBranches.some(b => b.name === name)
    }));
    setBranches(branchListData);
    setBranchSearchTerm("");
    setSelectAllBranches(false);
    setIsAddBranchModalOpen(true);
  };

  const handleSelectAllBranches = () => {
    const newSelectAll = !selectAllBranches;
    setSelectAllBranches(newSelectAll);
    setBranches(branches.map(branch => ({ ...branch, selected: newSelectAll })));
  };

  const handleBranchCheck = (id: number) => {
    setBranches(branches.map(branch => 
      branch.id === id ? { ...branch, selected: !branch.selected } : branch
    ));
  };

  const handleSaveBranches = () => {
    const selectedBranches = branches.filter(b => b.selected);
    setAllocatedBranches(selectedBranches);
    setIsAddBranchModalOpen(false);
    alert(`${selectedBranches.length} branches allocated successfully!`);
  };

  const filteredBranches = branches.filter(branch =>
    branch.name.toLowerCase().includes(branchSearchTerm.toLowerCase())
  );

  // Get status badge
  const getStatusBadge = (active: boolean) => {
    return active ? (
      <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
    ) : (
      <Badge variant="secondary" className="bg-gray-500">Inactive</Badge>
    );
  };

  // Stats
  const stats = {
    total: searchResults.length,
    active: searchResults.filter(r => r.active).length,
    inactive: searchResults.filter(r => !r.active).length,
  };

  // Pagination
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const paginatedResults = searchResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4 p-3 md:p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-wrap justify-between items-start gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">CONSIGNMENT CHARGES MASTER</h1>
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
            Add Consignment Charges
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Total Charges</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Package className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Active Charges</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
              <Badge className="bg-white/20 text-white">Active</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-gray-500 to-gray-600 text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Inactive Charges</p>
                <p className="text-2xl font-bold">{stats.inactive}</p>
              </div>
              <Badge className="bg-white/20 text-white">Inactive</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search Charges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by Charge Code, Charge Name or Alias Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <Button onClick={handleSearch} className="h-9 bg-blue-600 hover:bg-blue-700">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
            <Button onClick={clearSearch} variant="outline" className="h-9">
              <RefreshCw className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base flex items-center gap-2">
              <Table className="h-4 w-4" />
              Consignment Charges List
            </CardTitle>
            <div className="text-sm text-gray-500">
              Total: {searchResults.length} records
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[1000px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold py-3 w-12">#</TableHead>
                    <TableHead className="font-semibold py-3 min-w-[80px]">Charge Code</TableHead>
                    <TableHead className="font-semibold py-3 min-w-[150px]">Charge Name</TableHead>
                    <TableHead className="font-semibold py-3 min-w-[100px]">Alias Name</TableHead>
                    <TableHead className="font-semibold py-3 min-w-[80px]">Charge Type</TableHead>
                    <TableHead className="font-semibold py-3 min-w-[100px]">Applicable On</TableHead>
                    <TableHead className="font-semibold py-3 min-w-[120px]">Ledger Name</TableHead>
                    <TableHead className="font-semibold py-3 min-w-[100px]">Amount / Min</TableHead>
                    <TableHead className="font-semibold py-3 min-w-[80px]">Status</TableHead>
                    <TableHead className="font-semibold py-3 w-32 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedResults.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                        <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        No records found. Click "Add New Charge" to create one.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedResults.map((record, index) => (
                      <TableRow key={record.id} className="hover:bg-gray-50">
                        <TableCell className="py-3 text-center">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </TableCell>
                        <TableCell className="py-3 font-mono font-semibold">{record.chargeCode}</TableCell>
                        <TableCell className="py-3 font-medium">{record.chargeName}</TableCell>
                        <TableCell className="py-3">{record.aliasName || "-"}</TableCell>
                        <TableCell className="py-3">
                          <Badge variant="outline" className="bg-blue-50">
                            {record.chargeType}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3">{record.applicableOn}</TableCell>
                        <TableCell className="py-3">{record.ledger}</TableCell>
                        <TableCell className="py-3">
                          <div className="text-sm">Amount: ₹{record.chargeAmount}</div>
                          <div className="text-xs text-gray-500">Min: ₹{record.minimumAmount}</div>
                        </TableCell>
                        <TableCell className="py-3">{getStatusBadge(record.active)}</TableCell>
                        <TableCell className="py-3">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(record)}
                              className="h-8 w-8 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                              title="Edit Charge"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleGoodsWiseCharges(record)}
                              className="h-8 w-8 p-0 text-purple-500 hover:text-purple-700 hover:bg-purple-50"
                              title="Goods Wise Charges"
                            >
                              <Package className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAddBranch(record)}
                              className="h-8 w-8 p-0 text-green-500 hover:text-green-700 hover:bg-green-50"
                              title="Add Branch"
                            >
                              <Users className="h-4 w-4" />
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, searchResults.length)} of {searchResults.length} entries
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="px-3 py-1 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="h-8"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Entry Sheet */}
      <Sheet open={isEntrySheetOpen} onOpenChange={setIsEntrySheetOpen}>
        <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle className="flex items-center gap-2">
              {editMode ? (
                <>
                  <Edit className="h-5 w-5 text-blue-600" />
                  Edit Consignment Charge
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 text-blue-600" />
                  Add New Consignment Charge                </>
              )}
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-4">
            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Charge Code</Label>
                <Input value={chargeCode} readOnly className="h-10 bg-gray-50" />
              </div>
              <div className="space-y-2 flex items-end">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-4 w-4 rounded border-gray-300" id="active" />
                  <Label htmlFor="active" className="text-sm font-medium cursor-pointer">Active</Label>
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Charge Name <span className="text-red-500">*</span></Label>
                <Input value={chargeName} onChange={(e) => setChargeName(e.target.value)} placeholder="Enter Charge Name" className="h-10" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Alias Name</Label>
                <Input value={aliasName} onChange={(e) => setAliasName(e.target.value)} placeholder="Enter Alias Name" className="h-10" />
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Charge Type <span className="text-red-500">*</span></Label>
                <Select value={chargeType} onValueChange={setChargeType}>
                  <SelectTrigger className="h-10"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{chargeTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Amount Type <span className="text-red-500">*</span></Label>
                <Select value={amountType} onValueChange={setAmountType}>
                  <SelectTrigger className="h-10"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{amountTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Charge Amount</Label>
                <Input type="number" value={chargeAmount} onChange={(e) => setChargeAmount(e.target.value)} className="h-10" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Minimum Amount</Label>
                <Input type="number" value={minimumAmount} onChange={(e) => setMinimumAmount(e.target.value)} className="h-10" />
              </div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Applicable On</Label>
                <Select value={applicableOn} onValueChange={setApplicableOn}>
                  <SelectTrigger className="h-10"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{applicableOnOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">SAC Code</Label>
                <Input value={sacCode} onChange={(e) => setSacCode(e.target.value)} placeholder="Enter SAC Code" className="h-10" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Print Sequence No</Label>
                <Input value={printSequenceNo} onChange={(e) => setPrintSequenceNo(e.target.value)} className="h-10" />
              </div>
            </div>

            {/* Row 5 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Ledger <span className="text-red-500">*</span></Label>
                <Select value={ledger} onValueChange={setLedger}>
                  <SelectTrigger className="h-10"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{ledgerOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Charge Amount On Bank Builty</Label>
                <Input type="number" value={chargeAmountOnBankBuilty} onChange={(e) => setChargeAmountOnBankBuilty(e.target.value)} className="h-10" />
              </div>
            </div>

            {/* Checkboxes Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 p-4 border rounded-md bg-gray-50">
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={applicableOnBooking} onChange={(e) => setApplicableOnBooking(e.target.checked)} className="h-4 w-4 rounded" id="appBooking" />
                <Label htmlFor="appBooking" className="text-sm cursor-pointer">Applicable On Booking</Label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={applicableOnAirBooking} onChange={(e) => setApplicableOnAirBooking(e.target.checked)} className="h-4 w-4 rounded" id="appAir" />
                <Label htmlFor="appAir" className="text-sm cursor-pointer">Applicable On Air Booking</Label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={gstApplicable} onChange={(e) => setGstApplicable(e.target.checked)} className="h-4 w-4 rounded" id="gstApp" />
                <Label htmlFor="gstApp" className="text-sm cursor-pointer">GST Applicable</Label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={applicableOnDelivery} onChange={(e) => setApplicableOnDelivery(e.target.checked)} className="h-4 w-4 rounded" id="appDelivery" />
                <Label htmlFor="appDelivery" className="text-sm cursor-pointer">Applicable On Delivery</Label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={applicableOnTrainBooking} onChange={(e) => setApplicableOnTrainBooking(e.target.checked)} className="h-4 w-4 rounded" id="appTrain" />
                <Label htmlFor="appTrain" className="text-sm cursor-pointer">Applicable On Train Booking</Label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={allowAtBillUpdation} onChange={(e) => setAllowAtBillUpdation(e.target.checked)} className="h-4 w-4 rounded" id="allowBill" />
                <Label htmlFor="allowBill" className="text-sm cursor-pointer">Allow At Bill Updation</Label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={applicableOnMarketLoad} onChange={(e) => setApplicableOnMarketLoad(e.target.checked)} className="h-4 w-4 rounded" id="appMarket" />
                <Label htmlFor="appMarket" className="text-sm cursor-pointer">Applicable On Market Load</Label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={applicableOnSurfaceBooking} onChange={(e) => setApplicableOnSurfaceBooking(e.target.checked)} className="h-4 w-4 rounded" id="appSurface" />
                <Label htmlFor="appSurface" className="text-sm cursor-pointer">Applicable On Surface Booking</Label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={bookingOnFreightLedger} onChange={(e) => setBookingOnFreightLedger(e.target.checked)} className="h-4 w-4 rounded" id="bookingFreight" />
                <Label htmlFor="bookingFreight" className="text-sm cursor-pointer">Booking On Freight Ledger</Label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={allowToUpdateFromAdditionalCharges} onChange={(e) => setAllowToUpdateFromAdditionalCharges(e.target.checked)} className="h-4 w-4 rounded" id="allowUpdate" />
                <Label htmlFor="allowUpdate" className="text-sm cursor-pointer">Allow Update From Addl Charges</Label>
              </div>
            </div>

            <div className="text-xs text-gray-500">*Marked fields are mandatory</div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsEntrySheetOpen(false)}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                <Save className="mr-2 h-4 w-4" />
                {editMode ? "Update Charge" : "Save Charge"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Goods Wise Charges Modal */}
      <Dialog open={isGoodsWiseModalOpen} onOpenChange={setIsGoodsWiseModalOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-purple-600" />
              Goods Wise Charges - {selectedChargeForGoods?.chargeName}
            </DialogTitle>
          </DialogHeader>

          <Tabs value={goodsWiseActiveTab} onValueChange={(v) => setGoodsWiseActiveTab(v as "entry" | "search")} className="w-full">
            <TabsList className="grid w-full max-w-[200px] grid-cols-2">
              <TabsTrigger value="entry">Add Goods</TabsTrigger>
              <TabsTrigger value="search">Goods List</TabsTrigger>
            </TabsList>

            <TabsContent value="entry" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">W.E.F Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-10 w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {wefDate ? format(wefDate, "dd-MM-yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent mode="single" selected={wefDate} onSelect={(date) => date && setWefDate(date)} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Up To Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-10 w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {uptoDate ? format(uptoDate, "dd-MM-yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent mode="single" selected={uptoDate} onSelect={setUptoDate} />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Goods Group <span className="text-red-500">*</span></Label>
                  <Input value={goodsGroup} onChange={(e) => setGoodsGroup(e.target.value)} placeholder="Enter Goods Group" className="h-10" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Rate (%)</Label>
                  <Input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="h-10" step="0.01" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Amount (₹)</Label>
                  <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="h-10" step="0.01" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveGoodsWise} className="bg-purple-600 hover:bg-purple-700">
                  <Save className="mr-2 h-4 w-4" />
                  Add Goods Charge
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="search" className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Goods Group</TableHead>
                      <TableHead>Rate (%)</TableHead>
                      <TableHead>Amount (₹)</TableHead>
                      <TableHead>W.E.F Date</TableHead>
                      <TableHead>Up To Date</TableHead>
                      <TableHead className="w-20">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {goodsWiseCharges.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          No goods wise charges found. Click "Add Goods" to add.
                        </TableCell>
                      </TableRow>
                    ) : (
                      goodsWiseCharges.map((charge, idx) => (
                        <TableRow key={charge.id}>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>{charge.goodsGroup}</TableCell>
                          <TableCell>{charge.rate}%</TableCell>
                          <TableCell>₹{charge.amount}</TableCell>
                          <TableCell>{format(charge.wefDate, "dd-MM-yyyy")}</TableCell>
                          <TableCell>{charge.uptoDate ? format(charge.uptoDate, "dd-MM-yyyy") : "-"}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteGoodsWise(charge.id)} className="h-8 w-8 p-0 text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsGoodsWiseModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Branch Modal */}
      <Dialog open={isAddBranchModalOpen} onOpenChange={setIsAddBranchModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Allocate Branches - {selectedChargeForBranch?.chargeName}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search branch..."
                value={branchSearchTerm}
                onChange={(e) => setBranchSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="border rounded-md overflow-auto max-h-[50vh]">
              <Table>
                <TableHeader className="sticky top-0 bg-white">
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-12 text-center">
                      <input type="checkbox" checked={selectAllBranches} onChange={handleSelectAllBranches} className="h-4 w-4" />
                    </TableHead>
                    <TableHead className="font-semibold">Branch Name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBranches.map((branch) => (
                    <TableRow key={branch.id} className="hover:bg-gray-50 cursor-pointer">
                      <TableCell className="text-center">
                        <input type="checkbox" checked={branch.selected} onChange={() => handleBranchCheck(branch.id)} className="h-4 w-4" />
                      </TableCell>
                      <TableCell onClick={() => handleBranchCheck(branch.id)}>{branch.name}</TableCell>
                    </TableRow>
                  ))}
                  {filteredBranches.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-8 text-gray-500">
                        No branches found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsAddBranchModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveBranches} className="bg-green-600 hover:bg-green-700">Save Branches</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}