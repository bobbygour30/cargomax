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
import { CalendarIcon, Plus, Trash2, X, Save, RefreshCw, Search, Edit, Pencil, Users, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommissionCategory {
  id: number;
  categoryId: string;
  commissionType: string;
  categoryName: string;
  applicableOn: string;
  fromRange: string;
  toRange: string;
  itemName: string;
  tdsApplicable: boolean;
  tdsItemName: string;
  tdsPercentage: string;
  active: boolean;
  applicableOnFTL: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Agent {
  id: number;
  name: string;
  selected: boolean;
}

// Sample branch/agent list
const branchList = [
  "AGARTALA", "AGRA", "AHMEDABAD CITY", "AKBERPUR/AMBEDKAR NAGAR", "ALIGARH (MUKESH SINGH)",
  "ALIGARH (RAVI)", "ALIPURDUAR", "ALLAHABAD", "ALZALGARH", "AMRITSAR", "ANOOPSHER",
  "ARARIA COURT", "ARRAH", "ASANSOL", "AURANGABAD B.R", "AURANGABAD U.P", "AZAMGARH",
  "BABRALA", "BADDI", "BAHERI", "BAHJOI", "BAKROL", "BALLIA", "BANKURA", "BARAUT",
  "BAREILLY", "BARHALGANJ", "BARHI", "BARPETA ROAD", "BARWALA", "BASTI", "BAWANA",
  "BEGUSARAI", "BELTHARA ROAD", "BERHAMPORE W.B", "BETTIAH", "BHABHUA", "BHADOHI",
  "BHAGALPUR", "BHAVNAGAR", "BHIWANI", "BHULANDSHAHAR", "BIHARIGANJ", "BIHARSHARIF",
  "BIHIYA", "BIHTA", "BIJNOR", "BILASIPARA", "BONGAIGOAN", "BRAHMAPUR", "BURDWAN",
  "BUXAR", "CHANCHAL", "CHANDAUSI", "CHANDIGARH (GANESH)", "CHANDIGARH (HARGUN)",
  "CHANDPUR", "CHAS", "CHHAPRA", "COOCHBEHAR", "DALKOLA", "DALTONGANJ", "DARBHANGA",
  "DAUDNAGAR", "DAYA BASTI", "DEHRI ON SON", "DEOGHAR", "DEORIA", "DHAMPUR", "DHANAURA",
  "DHANBAD", "DHORA JI", "DHUBRI", "DHUPGURI", "DIBAI", "DINHATA", "DUMKA", "DUMROAN",
  "DURGAPUR", "FAIZABAD", "FALAKATA", "FARIDABAD", "FORBISGANJ", "GANDHI NAGAR (AJAY ANAND)",
  "GANDHI NAGAR (ASHOK)", "GANDHI NAGAR GRL", "GANGARAMPUR", "GARWA", "GAYA", "GHAZIPUR",
  "GHOSI", "GIRIDIH", "GOALPARA", "GODDA", "GOPALGANJ", "GORAKHPUR", "GOSAINGANJ",
  "GULABBAGH", "GULAOTHI", "GUMLA", "HAJIPUR", "HALOL", "HARRAIYA", "HATA", "HATHRAS",
  "HAZARIBAGH", "ISLAMPUR", "JAGADARI", "JAHANGIRABAD", "JAINAGAR", "JALALPUR", "JALANDAR",
  "JALPAIGURI", "JAMNA BAZAR", "JAMSHEDPUR", "JAMUI", "JAUNPUR", "JETPUR", "JHANJHARPUR",
  "JHARIYA", "JHILMIL", "JHUMRITALIYA", "KALA AMB", "KALIACHAK", "KALIYAGANJ",
  "KAMLA MARKET (RAMAN RAI)", "KAMLA MARKET (RAVINDER PANDEY)", "KANPUR", "KAPTANGANJ",
  "KARNAL", "KAROL BAGH (NITISH)", "KAROL BAGH (S.K.OBERI)", "KASHMERE GATE (RAM GOPAL)",
  "KASHMERE GATE (VIVEK)", "KASIA", "KATIHAR", "KHAGARIA", "KHALILABAD", "KHANNA MARKET GRL",
  "KIRATPUR", "KISHANGANJ", "KOCHAS", "KOKRAJHAR", "KRISHNAI", "KUNDA", "KUSHINAGAR",
  "LAKHISARAI", "LALGANJ", "LIBASPUR", "LOHARDGA", "LUCKNOW", "LUDHIANA", "LUDHIANA (BOBBY)",
  "LUDHIANA (GOSALA)", "LUDHIANA CITY", "LUDHIANA GILL ROAD", "MACHHALISHAR", "MADHEPURA",
  "MADHUBANI", "MADHUPUR", "MAHARAJGANJ", "MAIRWA", "MALDA", "MALERKOTLA", "MANGOLPURI",
  "MATHABHANGA", "MAU", "MAYAPURI", "MAYNAGURI", "MEERUT", "MIRZAPUR", "MOHALI",
  "MOHAMMDABAD GOHNA", "MOHANIYA", "MORADABAD", "MORI GATE GRL", "MOTIHARI", "MUBARAKPUR",
  "MUGHALSARAI", "MUNGRA BADSHAHPUR", "MURAD NAGAR", "MURLIGANJ", "MURSHIDABAD",
  "MUZAFFARNAGAR", "MUZAFFARPUR", "NAGINA", "NALBARI", "NARELA", "NARKATIYA GANJ", "NAROL",
  "NAWABGANJ", "NAWADA", "NETHAUR", "NEW LAJPAT RAI MARKET", "NOIDA", "NOJIBABAD", "NOORPUR",
  "PADRAUNA", "PANCHKULA", "PANIPAT", "PARWANOO", "PATNA", "PHAGWARA", "PHUSRO", "PILIBHIT",
  "PRATAPGARH", "PURANPUR", "PURNIA", "PURULIA", "RAFIGANJ", "RAGHUNATHGANJ", "RAIGANJ",
  "RAJKOT (METODA)", "RAJKOT (SHAPAR)", "RAJKOT - A", "RAMGARH", "RANCHI", "RANGIA",
  "RANIGANJ", "RASARA", "RAXAUL", "SADAR BAZAR", "SAHARANPUR", "SAHARSA", "SAHASWAN",
  "SALEMPUR", "SAMASTIPUR", "SAMBAL", "SAMSI", "SANJAY GANDHI GRL", "SANJAY GANDHI TPT",
  "SASARAM", "SECUNDERABAD", "SEOHARA", "SHAHDARA", "SHAHGANJ", "SHERGHATI", "SHIKARPUR",
  "SIDDHARTHNAGAR", "SILLIGURI", "SIMDEGA", "SISWABAZAR", "SITAMARHI", "SIWAN", "SIYANA",
  "SOLAN", "SULTANPUR", "SUPAUL", "SURAT", "TAMKUHI", "TANDA", "THAKURDWARA", "TRONICA CITY",
  "TUFANGANJ", "VAPI", "VARANASI", "VIKRAMGANJ", "WAZIRPUR", "YUSUFPUR", "ZAKHIRA", "ZIRAKPUR"
];

const applicableOnOptions = [
  "as per actuals",
  "aweight",
  "cweight",
  "docket",
  "fix value",
  "freight",
  "packages",
  "total freight",
  "value of gr"
];

const commissionTypeOptions = ["Booking", "Delivery", "Other"];

export default function CommissionCategoryMaster() {
  // Sheet state
  const [isEntrySheetOpen, setIsEntrySheetOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<number | null>(null);
  
  // Form state
  const [categoryId, setCategoryId] = useState<string>("");
  const [commissionType, setCommissionType] = useState<string>("");
  const [categoryName, setCategoryName] = useState<string>("");
  const [applicableOn, setApplicableOn] = useState<string>("");
  const [fromRange, setFromRange] = useState<string>("0");
  const [toRange, setToRange] = useState<string>("0");
  const [itemName, setItemName] = useState<string>("");
  const [tdsApplicable, setTdsApplicable] = useState<boolean>(false);
  const [tdsItemName, setTdsItemName] = useState<string>("");
  const [tdsPercentage, setTdsPercentage] = useState<string>("0");
  const [active, setActive] = useState<boolean>(true);
  const [applicableOnFTL, setApplicableOnFTL] = useState<string>("");

  // Search state
  const [searchResults, setSearchResults] = useState<CommissionCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Allocate to Agent modal state
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
  const [selectedCategoryForAllocate, setSelectedCategoryForAllocate] = useState<CommissionCategory | null>(null);
  const [isAgentSelectionModalOpen, setIsAgentSelectionModalOpen] = useState(false);
  const [agentSearchTerm, setAgentSearchTerm] = useState("");
  const [selectAllAgents, setSelectAllAgents] = useState(false);
  const [selectedAgents, setSelectedAgents] = useState<Agent[]>([]);
  const [allocatedAgents, setAllocatedAgents] = useState<Agent[]>([]);

  // Sample saved data
  const [savedRecords, setSavedRecords] = useState<CommissionCategory[]>([
    { id: 1, categoryId: "1", commissionType: "Booking", categoryName: "AGENCY COMMISSION", applicableOn: "cweight", fromRange: "1", toRange: "999999999", itemName: "Commission", tdsApplicable: false, tdsItemName: "", tdsPercentage: "0", active: true, applicableOnFTL: "", createdAt: new Date(), updatedAt: new Date() },
    { id: 2, categoryId: "2", commissionType: "Booking", categoryName: "CLAIM LOCAL DESTINATION", applicableOn: "as per actuals", fromRange: "0", toRange: "0", itemName: "Claim", tdsApplicable: false, tdsItemName: "", tdsPercentage: "0", active: true, applicableOnFTL: "", createdAt: new Date(), updatedAt: new Date() },
    { id: 3, categoryId: "3", commissionType: "Booking", categoryName: "CLAIM ON SHORT", applicableOn: "as per actuals", fromRange: "0", toRange: "0", itemName: "Claim", tdsApplicable: false, tdsItemName: "", tdsPercentage: "0", active: true, applicableOnFTL: "", createdAt: new Date(), updatedAt: new Date() },
    { id: 4, categoryId: "4", commissionType: "Booking", categoryName: "GREEN TAX COMMISSION", applicableOn: "fix value", fromRange: "1", toRange: "99999999", itemName: "Tax", tdsApplicable: false, tdsItemName: "", tdsPercentage: "0", active: true, applicableOnFTL: "", createdAt: new Date(), updatedAt: new Date() },
    { id: 5, categoryId: "5", commissionType: "Booking", categoryName: "LABOUR COMMISSION", applicableOn: "cweight", fromRange: "1", toRange: "999999999", itemName: "Labour", tdsApplicable: false, tdsItemName: "", tdsPercentage: "0", active: true, applicableOnFTL: "", createdAt: new Date(), updatedAt: new Date() },
    { id: 6, categoryId: "6", commissionType: "Booking", categoryName: "LESS PAID, ADVANCE COMMISSION", applicableOn: "fix value", fromRange: "0", toRange: "0", itemName: "Advance", tdsApplicable: false, tdsItemName: "", tdsPercentage: "0", active: true, applicableOnFTL: "", createdAt: new Date(), updatedAt: new Date() },
    { id: 7, categoryId: "7", commissionType: "Booking", categoryName: "LOCAL CARTAGE-HIMALI-P.F COMMISSION", applicableOn: "cweight", fromRange: "0", toRange: "0", itemName: "Local", tdsApplicable: false, tdsItemName: "", tdsPercentage: "0", active: true, applicableOnFTL: "", createdAt: new Date(), updatedAt: new Date() },
    { id: 8, categoryId: "8", commissionType: "Booking", categoryName: "LORRY FREIGHT COMMISSION", applicableOn: "cweight", fromRange: "1", toRange: "999999999", itemName: "Freight", tdsApplicable: false, tdsItemName: "", tdsPercentage: "0", active: true, applicableOnFTL: "", createdAt: new Date(), updatedAt: new Date() },
    { id: 9, categoryId: "9", commissionType: "Booking", categoryName: "OTHER EXPENSES COMMISSION", applicableOn: "fix value", fromRange: "0", toRange: "0", itemName: "Expenses", tdsApplicable: false, tdsItemName: "", tdsPercentage: "0", active: true, applicableOnFTL: "", createdAt: new Date(), updatedAt: new Date() },
  ]);

  // Load search results on mount
  useEffect(() => {
    setSearchResults(savedRecords);
  }, []);

  // Reset form
  const resetForm = () => {
    setCategoryId("");
    setCommissionType("");
    setCategoryName("");
    setApplicableOn("");
    setFromRange("0");
    setToRange("0");
    setItemName("");
    setTdsApplicable(false);
    setTdsItemName("");
    setTdsPercentage("0");
    setActive(true);
    setApplicableOnFTL("");
    setEditMode(false);
    setCurrentEditId(null);
  };

  // Generate new ID
  const generateNewId = () => {
    const maxId = Math.max(...savedRecords.map(r => r.id), 0);
    return String(maxId + 1);
  };

  const handleSave = () => {
    if (!commissionType) {
      alert("Please select Commission Type");
      return;
    }
    if (!categoryName) {
      alert("Please enter Category Name");
      return;
    }
    if (!applicableOn) {
      alert("Please select Applicable On");
      return;
    }
    if (!itemName) {
      alert("Please enter Item Name");
      return;
    }

    const newRecord: CommissionCategory = {
      id: currentEditId || Date.now(),
      categoryId: currentEditId ? String(currentEditId) : generateNewId(),
      commissionType,
      categoryName,
      applicableOn,
      fromRange,
      toRange,
      itemName,
      tdsApplicable,
      tdsItemName,
      tdsPercentage,
      active,
      applicableOnFTL,
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
        r.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.commissionType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setSearchResults(results);
    setCurrentPage(1);
  };

  const handleEdit = (record: CommissionCategory) => {
    setEditMode(true);
    setCurrentEditId(record.id);
    setCategoryId(record.categoryId);
    setCommissionType(record.commissionType);
    setCategoryName(record.categoryName);
    setApplicableOn(record.applicableOn);
    setFromRange(record.fromRange);
    setToRange(record.toRange);
    setItemName(record.itemName);
    setTdsApplicable(record.tdsApplicable);
    setTdsItemName(record.tdsItemName);
    setTdsPercentage(record.tdsPercentage);
    setActive(record.active);
    setApplicableOnFTL(record.applicableOnFTL || "");
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
    setCategoryId(generateNewId());
    setIsEntrySheetOpen(true);
  };

  // Allocate to Agent functions
  const handleAllocateToAgent = (record: CommissionCategory) => {
    setSelectedCategoryForAllocate(record);
    setAllocatedAgents([]);
    setIsAllocateModalOpen(true);
  };

  const handleSelectAgency = () => {
    const agentsList: Agent[] = branchList.map((name, index) => ({
      id: index + 1,
      name: name,
      selected: false
    }));
    setSelectedAgents(agentsList);
    setAgentSearchTerm("");
    setSelectAllAgents(false);
    setIsAgentSelectionModalOpen(true);
  };

  const handleAgentSelectionConfirm = () => {
    const newAllocatedAgents = selectedAgents.filter(agent => agent.selected);
    setAllocatedAgents(newAllocatedAgents);
    setIsAgentSelectionModalOpen(false);
  };

  const handleRemoveAllocatedAgent = (agentId: number) => {
    setAllocatedAgents(allocatedAgents.filter(agent => agent.id !== agentId));
  };

  const handleSelectAllAgents = () => {
    const newSelectAll = !selectAllAgents;
    setSelectAllAgents(newSelectAll);
    setSelectedAgents(selectedAgents.map(agent => ({ ...agent, selected: newSelectAll })));
  };

  const handleAgentCheck = (id: number) => {
    setSelectedAgents(selectedAgents.map(agent => 
      agent.id === id ? { ...agent, selected: !agent.selected } : agent
    ));
  };

  const filteredAgents = selectedAgents.filter(agent =>
    agent.name.toLowerCase().includes(agentSearchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const paginatedResults = searchResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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

  return (
    <div className="space-y-4 p-3 md:p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-wrap justify-between items-start gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-600" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">COMMISSION CATEGORY MASTER</h1>
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
            Add Commission Category
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Total Categories</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Filter className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Active Categories</p>
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
                <p className="text-sm opacity-90">Inactive Categories</p>
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
            Search Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by Category Name or Commission Type..."
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
              Commission Categories
            </CardTitle>
            <div className="text-sm text-gray-500">
              Total: {searchResults.length} records
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[800px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold py-3 w-12">#</TableHead>
                    <TableHead className="font-semibold py-3 min-w-[120px]">Category Name</TableHead>
                    <TableHead className="font-semibold py-3 min-w-[100px]">Commission Type</TableHead>
                    <TableHead className="font-semibold py-3 min-w-[100px]">Applicable On</TableHead>
                    <TableHead className="font-semibold py-3 min-w-[80px]">Range</TableHead>
                    <TableHead className="font-semibold py-3 min-w-[80px]">Status</TableHead>
                    <TableHead className="font-semibold py-3 w-28 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedResults.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        <Filter className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        No records found. Click "Add New Category" to create one.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedResults.map((record, index) => (
                      <TableRow key={record.id} className="hover:bg-gray-50">
                        <TableCell className="py-3 text-center">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </TableCell>
                        <TableCell className="py-3">
                          <div>
                            <div className="font-semibold text-gray-800">{record.categoryName}</div>
                            <div className="text-xs text-gray-500">ID: {record.categoryId}</div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge variant="outline" className="bg-blue-50">
                            {record.commissionType}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3 text-sm">{record.applicableOn}</TableCell>
                        <TableCell className="py-3 text-sm">
                          {record.fromRange} - {record.toRange}
                        </TableCell>
                        <TableCell className="py-3">{getStatusBadge(record.active)}</TableCell>
                        <TableCell className="py-3">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(record)}
                              className="h-8 w-8 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAllocateToAgent(record)}
                              className="h-8 w-8 p-0 text-green-500 hover:text-green-700 hover:bg-green-50"
                              title="Allocate to Agent"
                            >
                              <Users className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(record.id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
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
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle className="flex items-center gap-2">
              {editMode ? (
                <>
                  <Edit className="h-5 w-5 text-blue-600" />
                  Edit Commission Category
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 text-blue-600" />
                  Add New Commission Category
                </>
              )}
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-4">
            {/* Category Id */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Category ID</Label>
              <Input
                type="text"
                value={categoryId}
                readOnly
                className="h-10 bg-gray-50"
              />
            </div>

            {/* Commission Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Commission Type <span className="text-red-500">*</span>
              </Label>
              <Select value={commissionType} onValueChange={setCommissionType}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="SELECT TYPE" />
                </SelectTrigger>
                <SelectContent>
                  {commissionTypeOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Name */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Category Name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter Category Name"
                className="h-10"
              />
            </div>

            {/* Applicable On */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Applicable On <span className="text-red-500">*</span>
              </Label>
              <Select value={applicableOn} onValueChange={setApplicableOn}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="SELECT OPTION" />
                </SelectTrigger>
                <SelectContent>
                  {applicableOnOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* From Range */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">From Range</Label>
                <Input
                  type="number"
                  value={fromRange}
                  onChange={(e) => setFromRange(e.target.value)}
                  className="h-10"
                />
              </div>

              {/* To Range */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">To Range</Label>
                <Input
                  type="number"
                  value={toRange}
                  onChange={(e) => setToRange(e.target.value)}
                  className="h-10"
                />
              </div>
            </div>

            {/* Item Name */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Item Name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Enter Item Name"
                className="h-10"
              />
            </div>

            {/* TDS Applicable Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={tdsApplicable}
                onChange={(e) => setTdsApplicable(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
                id="tdsApplicable"
              />
              <Label htmlFor="tdsApplicable" className="text-sm font-medium cursor-pointer">
                TDS Applicable
              </Label>
            </div>

            {/* TDS Fields - Conditional */}
            {tdsApplicable && (
              <div className="grid grid-cols-2 gap-4 pl-6 border-l-2 border-blue-200">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">TDS Item Name</Label>
                  <Input
                    value={tdsItemName}
                    onChange={(e) => setTdsItemName(e.target.value)}
                    placeholder="Enter TDS Item Name"
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">TDS Percentage (%)</Label>
                  <Input
                    type="number"
                    value={tdsPercentage}
                    onChange={(e) => setTdsPercentage(e.target.value)}
                    className="h-10"
                    step="0.01"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {/* Active Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                  id="active"
                />
                <Label htmlFor="active" className="text-sm font-medium cursor-pointer">
                  Active
                </Label>
              </div>

              {/* Applicable On FTL */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Applicable On FTL</Label>
                <Select value={applicableOnFTL} onValueChange={setApplicableOnFTL}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="SELECT OPTION" />
                  </SelectTrigger>
                  <SelectContent>
                    {applicableOnOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t mt-4">
              <Button variant="outline" onClick={() => setIsEntrySheetOpen(false)}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                <Save className="mr-2 h-4 w-4" />
                {editMode ? "Update Category" : "Save Category"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Allocate to Agent Modal */}
      <Dialog open={isAllocateModalOpen} onOpenChange={setIsAllocateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Allocate to Agent
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 space-y-4">
            <div className="p-3 bg-blue-50 rounded-md">
              <p className="text-sm font-medium">
                Category: <span className="font-bold">{selectedCategoryForAllocate?.categoryName}</span>
              </p>
            </div>

            <Button onClick={handleSelectAgency} className="w-full bg-green-600 hover:bg-green-700">
              <Users className="mr-2 h-4 w-4" />
              SELECT AGENCY
            </Button>

            {/* Allocated Agents List */}
            {allocatedAgents.length > 0 && (
              <div className="border rounded-md">
                <div className="bg-gray-50 px-3 py-2 border-b">
                  <h4 className="text-sm font-semibold">Allocated Agents ({allocatedAgents.length})</h4>
                </div>
                <div className="max-h-[300px] overflow-y-auto p-3">
                  <div className="flex flex-wrap gap-2">
                    {allocatedAgents.map((agent) => (
                      <Badge key={agent.id} variant="secondary" className="text-sm py-1.5">
                        {agent.name}
                        <X
                          className="ml-1 h-3 w-3 cursor-pointer hover:text-red-500"
                          onClick={() => handleRemoveAllocatedAgent(agent.id)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {allocatedAgents.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm border rounded-md">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
                No agents allocated. Click "SELECT AGENCY" to add agents.
              </div>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsAllocateModalOpen(false)}>
              Close
            </Button>
            <Button onClick={() => setIsAllocateModalOpen(false)} className="bg-green-600 hover:bg-green-700">
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Agent Selection Modal */}
      <Dialog open={isAgentSelectionModalOpen} onOpenChange={setIsAgentSelectionModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Select Agency</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search agency..."
                value={agentSearchTerm}
                onChange={(e) => setAgentSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Table */}
            <div className="border rounded-md overflow-auto max-h-[50vh]">
              <Table>
                <TableHeader className="sticky top-0 bg-white">
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-12 text-center">
                      <input
                        type="checkbox"
                        checked={selectAllAgents}
                        onChange={handleSelectAllAgents}
                        className="h-4 w-4"
                      />
                    </TableHead>
                    <TableHead className="font-semibold">Agency Name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAgents.map((agent) => (
                    <TableRow key={agent.id} className="hover:bg-gray-50 cursor-pointer">
                      <TableCell className="text-center">
                        <input
                          type="checkbox"
                          checked={agent.selected}
                          onChange={() => handleAgentCheck(agent.id)}
                          className="h-4 w-4"
                        />
                      </TableCell>
                      <TableCell onClick={() => handleAgentCheck(agent.id)}>
                        {agent.name}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredAgents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-8 text-gray-500">
                        No agencies found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsAgentSelectionModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAgentSelectionConfirm} className="bg-blue-600 hover:bg-blue-700">
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}