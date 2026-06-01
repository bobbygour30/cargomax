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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2, X, Save, RefreshCw, Search, Edit, Pencil, Eye, Check, AlertCircle, Phone, Mail, MapPin, Building, User, CreditCard, FileText, Globe, Calendar, Filter, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ConsignorConsignee {
  id: number;
  branch: string;
  consignorConsignee: string;
  active: boolean;
  code: string;
  dealerGroupCode: string;
  name: string;
  aliasDisplayName: string;
  linkedWithCustomer: string;
  address: string;
  aliasAddress: string;
  city: string;
  zipCode: string;
  contactPerson: string;
  state: string;
  country: string;
  mobileNo: string;
  secondaryMobileNo: string;
  creditDays: string;
  panNo: string;
  gstNotApplicable: boolean;
  gstin: string;
  gstIssueDate: Date | undefined;
  emailId: string;
  icCode: string;
  referenceCode: string;
  insurancePolicyNo: string;
  insuranceCoName: string;
  billingCriteria: string;
  freightOn: string;
  creditLimit: string;
  creditLimitApplicable: boolean;
  openingBalance: string;
  openingBalanceType: string;
  tanNumber: string;
  createSubLedger: string;
  billingCycle: string;
  marketingExecutive: string;
  customerType: string;
  industryType: string;
  loadType: string;
  rebateNotAllow: boolean;
  allowLiveTrackingOnPortal: boolean;
  disableManualRatesInBooking: boolean;
  invoiceRequired: boolean;
  isWhatsAppAlert: boolean;
  hideFreightInGR: boolean;
  kycCompleted: boolean;
  roundOffWeightNotRequired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Sample branch list
const branchList = [
  "CORPORATE OFFICE", "MEERUT", "DELHI", "MUMBAI", "BANGALORE", "CHENNAI", "KOLKATA",
  "AHMEDABAD", "PUNE", "HYDERABAD", "LUCKNOW", "KANPUR", "JAIPUR", "CHANDIGARH"
];

const consignorConsigneeOptions = ["Consignor", "Consignee", "Both"];
const stateList = ["Uttar Pradesh", "Delhi", "Maharashtra", "Karnataka", "Tamil Nadu", "West Bengal", "Gujarat", "Rajasthan"];
const countryList = ["India", "USA", "UK", "Canada", "Australia", "Singapore", "UAE"];
const billingCriteriaOptions = ["On Delivery", "On Booking", "Monthly", "Weekly", "Fortnightly"];
const freightOnOptions = ["To Pay", "Prepaid", "Collect"];
const createSubLedgerOptions = ["Yes", "No"];
const billingCycleOptions = ["Monthly", "Quarterly", "Half Yearly", "Yearly"];
const customerTypeOptions = ["Regular", "Corporate", "Government", "International", "Premium"];
const industryTypeOptions = ["Logistics", "Manufacturing", "Retail", "Wholesale", "E-commerce", "Pharma", "Automobile"];
const loadTypeOptions = ["BOTH", "FTL", "LTL", "Container"];

export default function ConsignorConsigneeMaster() {
  // Sheet state
  const [isEntrySheetOpen, setIsEntrySheetOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<number | null>(null);
  
  // Form state
  const [branch, setBranch] = useState<string>("");
  const [consignorConsignee, setConsignorConsignee] = useState<string>("");
  const [active, setActive] = useState<boolean>(true);
  const [code, setCode] = useState<string>("");
  const [dealerGroupCode, setDealerGroupCode] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [aliasDisplayName, setAliasDisplayName] = useState<string>("");
  const [linkedWithCustomer, setLinkedWithCustomer] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [aliasAddress, setAliasAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const [contactPerson, setContactPerson] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [mobileNo, setMobileNo] = useState<string>("");
  const [secondaryMobileNo, setSecondaryMobileNo] = useState<string>("");
  const [creditDays, setCreditDays] = useState<string>("");
  const [panNo, setPanNo] = useState<string>("");
  const [gstNotApplicable, setGstNotApplicable] = useState<boolean>(false);
  const [gstin, setGstin] = useState<string>("");
  const [gstIssueDate, setGstIssueDate] = useState<Date | undefined>();
  const [emailId, setEmailId] = useState<string>("");
  const [icCode, setIcCode] = useState<string>("");
  const [referenceCode, setReferenceCode] = useState<string>("");
  const [insurancePolicyNo, setInsurancePolicyNo] = useState<string>("");
  const [insuranceCoName, setInsuranceCoName] = useState<string>("");
  const [billingCriteria, setBillingCriteria] = useState<string>("");
  const [freightOn, setFreightOn] = useState<string>("");
  const [creditLimit, setCreditLimit] = useState<string>("0");
  const [creditLimitApplicable, setCreditLimitApplicable] = useState<boolean>(false);
  const [openingBalance, setOpeningBalance] = useState<string>("0");
  const [openingBalanceType, setOpeningBalanceType] = useState<string>("DR");
  const [tanNumber, setTanNumber] = useState<string>("");
  const [createSubLedger, setCreateSubLedger] = useState<string>("No");
  const [billingCycle, setBillingCycle] = useState<string>("");
  const [marketingExecutive, setMarketingExecutive] = useState<string>("");
  const [customerType, setCustomerType] = useState<string>("");
  const [industryType, setIndustryType] = useState<string>("");
  const [loadType, setLoadType] = useState<string>("BOTH");
  const [rebateNotAllow, setRebateNotAllow] = useState<boolean>(false);
  const [allowLiveTrackingOnPortal, setAllowLiveTrackingOnPortal] = useState<boolean>(false);
  const [disableManualRatesInBooking, setDisableManualRatesInBooking] = useState<boolean>(false);
  const [invoiceRequired, setInvoiceRequired] = useState<boolean>(false);
  const [isWhatsAppAlert, setIsWhatsAppAlert] = useState<boolean>(false);
  const [hideFreightInGR, setHideFreightInGR] = useState<boolean>(false);
  const [kycCompleted, setKycCompleted] = useState<boolean>(false);
  const [roundOffWeightNotRequired, setRoundOffWeightNotRequired] = useState<boolean>(false);

  // Search state
  const [searchResults, setSearchResults] = useState<ConsignorConsignee[]>([]);
  const [searchBranch, setSearchBranch] = useState<string>("");
  const [searchName, setSearchName] = useState<string>("");
  const [searchType, setSearchType] = useState<string>("all");
  const [searchStatus, setSearchStatus] = useState<string>("all");
  const [searchGstNo, setSearchGstNo] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sample saved data
  const [savedRecords, setSavedRecords] = useState<ConsignorConsignee[]>([
    {
      id: 1, branch: "CORPORATE OFFICE", consignorConsignee: "Both", active: true, code: "C0001",
      dealerGroupCode: "DG001", name: "M/S GOLDEN LOGISTICS", aliasDisplayName: "GOLDEN LOGISTICS",
      linkedWithCustomer: "", address: "123, Transport Nagar", aliasAddress: "", city: "Delhi",
      zipCode: "110001", contactPerson: "Rajesh Kumar", state: "Delhi", country: "India",
      mobileNo: "9876543210", secondaryMobileNo: "", creditDays: "30", panNo: "ABCDE1234F",
      gstNotApplicable: false, gstin: "07ABCDE1234F1Z5", gstIssueDate: new Date("2023-01-01"),
      emailId: "info@goldenlogistics.com", icCode: "IC001", referenceCode: "REF001",
      insurancePolicyNo: "POL123456", insuranceCoName: "New India Assurance", billingCriteria: "On Delivery",
      freightOn: "To Pay", creditLimit: "500000", creditLimitApplicable: true, openingBalance: "0",
      openingBalanceType: "DR", tanNumber: "TAN123456", createSubLedger: "Yes", billingCycle: "Monthly",
      marketingExecutive: "Amit Sharma", customerType: "Corporate", industryType: "Logistics",
      loadType: "BOTH", rebateNotAllow: false, allowLiveTrackingOnPortal: true, disableManualRatesInBooking: false,
      invoiceRequired: true, isWhatsAppAlert: true, hideFreightInGR: false, kycCompleted: true,
      roundOffWeightNotRequired: false, createdAt: new Date(), updatedAt: new Date()
    },
    {
      id: 2, branch: "MEERUT", consignorConsignee: "Consignor", active: true, code: "C0002",
      dealerGroupCode: "", name: "M/S MEERUT TRANSPORT", aliasDisplayName: "MEERUT TRANSPORT",
      linkedWithCustomer: "", address: "456, Transport Complex", aliasAddress: "", city: "Meerut",
      zipCode: "250001", contactPerson: "Suresh Singh", state: "Uttar Pradesh", country: "India",
      mobileNo: "9876543211", secondaryMobileNo: "", creditDays: "15", panNo: "FGHIJ5678K",
      gstNotApplicable: false, gstin: "09FGHIJ5678K1Z6", gstIssueDate: new Date("2023-02-01"),
      emailId: "contact@meeruttransport.com", icCode: "", referenceCode: "", insurancePolicyNo: "",
      insuranceCoName: "", billingCriteria: "On Booking", freightOn: "Prepaid", creditLimit: "100000",
      creditLimitApplicable: true, openingBalance: "0", openingBalanceType: "DR", tanNumber: "",
      createSubLedger: "No", billingCycle: "Quarterly", marketingExecutive: "Priya Verma",
      customerType: "Regular", industryType: "Transport", loadType: "FTL", rebateNotAllow: false,
      allowLiveTrackingOnPortal: false, disableManualRatesInBooking: false, invoiceRequired: true,
      isWhatsAppAlert: false, hideFreightInGR: false, kycCompleted: true, roundOffWeightNotRequired: false,
      createdAt: new Date(), updatedAt: new Date()
    },
  ]);

  // Load search results on mount
  useEffect(() => {
    setSearchResults(savedRecords);
  }, []);

  const generateCode = () => {
    const lastCode = savedRecords[savedRecords.length - 1]?.code;
    if (lastCode) {
      const num = parseInt(lastCode.substring(1)) + 1;
      return `C${String(num).padStart(4, '0')}`;
    }
    return "C0001";
  };

  const resetForm = () => {
    setBranch("");
    setConsignorConsignee("");
    setActive(true);
    setCode(generateCode());
    setDealerGroupCode("");
    setName("");
    setAliasDisplayName("");
    setLinkedWithCustomer("");
    setAddress("");
    setAliasAddress("");
    setCity("");
    setZipCode("");
    setContactPerson("");
    setState("");
    setCountry("");
    setMobileNo("");
    setSecondaryMobileNo("");
    setCreditDays("");
    setPanNo("");
    setGstNotApplicable(false);
    setGstin("");
    setGstIssueDate(undefined);
    setEmailId("");
    setIcCode("");
    setReferenceCode("");
    setInsurancePolicyNo("");
    setInsuranceCoName("");
    setBillingCriteria("");
    setFreightOn("");
    setCreditLimit("0");
    setCreditLimitApplicable(false);
    setOpeningBalance("0");
    setOpeningBalanceType("DR");
    setTanNumber("");
    setCreateSubLedger("No");
    setBillingCycle("");
    setMarketingExecutive("");
    setCustomerType("");
    setIndustryType("");
    setLoadType("BOTH");
    setRebateNotAllow(false);
    setAllowLiveTrackingOnPortal(false);
    setDisableManualRatesInBooking(false);
    setInvoiceRequired(false);
    setIsWhatsAppAlert(false);
    setHideFreightInGR(false);
    setKycCompleted(false);
    setRoundOffWeightNotRequired(false);
    setEditMode(false);
    setCurrentEditId(null);
  };

  const handleSave = () => {
    if (!branch) {
      alert("Please select Branch");
      return;
    }
    if (!consignorConsignee) {
      alert("Please select Consignor/Consignee type");
      return;
    }
    if (!name) {
      alert("Please enter Name");
      return;
    }
    if (!aliasDisplayName) {
      alert("Please enter Alias/Display Name");
      return;
    }
    if (!address) {
      alert("Please enter Address");
      return;
    }
    if (!city) {
      alert("Please enter City");
      return;
    }
    if (!gstin && !gstNotApplicable) {
      alert("Please enter GSTIN or check GST Not Applicable");
      return;
    }

    const newRecord: ConsignorConsignee = {
      id: currentEditId || Date.now(),
      branch, consignorConsignee, active, code, dealerGroupCode, name, aliasDisplayName,
      linkedWithCustomer, address, aliasAddress, city, zipCode, contactPerson, state, country,
      mobileNo, secondaryMobileNo, creditDays, panNo, gstNotApplicable, gstin, gstIssueDate,
      emailId, icCode, referenceCode, insurancePolicyNo, insuranceCoName, billingCriteria,
      freightOn, creditLimit, creditLimitApplicable, openingBalance, openingBalanceType, tanNumber,
      createSubLedger, billingCycle, marketingExecutive, customerType, industryType, loadType,
      rebateNotAllow, allowLiveTrackingOnPortal, disableManualRatesInBooking, invoiceRequired,
      isWhatsAppAlert, hideFreightInGR, kycCompleted, roundOffWeightNotRequired,
      createdAt: editMode && currentEditId ? 
        savedRecords.find(r => r.id === currentEditId)?.createdAt || new Date() : 
        new Date(),
      updatedAt: new Date()
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

  const handleDelete = () => {
    if (currentEditId && confirm("Are you sure you want to delete this record?")) {
      setSavedRecords(savedRecords.filter(record => record.id !== currentEditId));
      setSearchResults(searchResults.filter(record => record.id !== currentEditId));
      resetForm();
      setIsEntrySheetOpen(false);
      alert("Record deleted successfully!");
    }
  };

  const handleSearch = () => {
    let results = [...savedRecords];
    if (searchBranch) results = results.filter(r => r.branch === searchBranch);
    if (searchName) results = results.filter(r => r.name.toLowerCase().includes(searchName.toLowerCase()));
    if (searchType !== "all") results = results.filter(r => r.consignorConsignee === searchType);
    if (searchStatus !== "all") results = results.filter(r => r.active === (searchStatus === "active"));
    if (searchGstNo) results = results.filter(r => r.gstin.toLowerCase().includes(searchGstNo.toLowerCase()));
    setSearchResults(results);
    setCurrentPage(1);
  };

  const handleEdit = (record: ConsignorConsignee) => {
    setEditMode(true);
    setCurrentEditId(record.id);
    setBranch(record.branch);
    setConsignorConsignee(record.consignorConsignee);
    setActive(record.active);
    setCode(record.code);
    setDealerGroupCode(record.dealerGroupCode);
    setName(record.name);
    setAliasDisplayName(record.aliasDisplayName);
    setLinkedWithCustomer(record.linkedWithCustomer);
    setAddress(record.address);
    setAliasAddress(record.aliasAddress);
    setCity(record.city);
    setZipCode(record.zipCode);
    setContactPerson(record.contactPerson);
    setState(record.state);
    setCountry(record.country);
    setMobileNo(record.mobileNo);
    setSecondaryMobileNo(record.secondaryMobileNo);
    setCreditDays(record.creditDays);
    setPanNo(record.panNo);
    setGstNotApplicable(record.gstNotApplicable);
    setGstin(record.gstin);
    setGstIssueDate(record.gstIssueDate);
    setEmailId(record.emailId);
    setIcCode(record.icCode);
    setReferenceCode(record.referenceCode);
    setInsurancePolicyNo(record.insurancePolicyNo);
    setInsuranceCoName(record.insuranceCoName);
    setBillingCriteria(record.billingCriteria);
    setFreightOn(record.freightOn);
    setCreditLimit(record.creditLimit);
    setCreditLimitApplicable(record.creditLimitApplicable);
    setOpeningBalance(record.openingBalance);
    setOpeningBalanceType(record.openingBalanceType);
    setTanNumber(record.tanNumber);
    setCreateSubLedger(record.createSubLedger);
    setBillingCycle(record.billingCycle);
    setMarketingExecutive(record.marketingExecutive);
    setCustomerType(record.customerType);
    setIndustryType(record.industryType);
    setLoadType(record.loadType);
    setRebateNotAllow(record.rebateNotAllow);
    setAllowLiveTrackingOnPortal(record.allowLiveTrackingOnPortal);
    setDisableManualRatesInBooking(record.disableManualRatesInBooking);
    setInvoiceRequired(record.invoiceRequired);
    setIsWhatsAppAlert(record.isWhatsAppAlert);
    setHideFreightInGR(record.hideFreightInGR);
    setKycCompleted(record.kycCompleted);
    setRoundOffWeightNotRequired(record.roundOffWeightNotRequired);
    setIsEntrySheetOpen(true);
  };

  const clearSearch = () => {
    setSearchBranch("");
    setSearchName("");
    setSearchType("all");
    setSearchStatus("all");
    setSearchGstNo("");
    setSearchResults(savedRecords);
  };

  const openAddSheet = () => {
    resetForm();
    setEditMode(false);
    setCurrentEditId(null);
    setCode(generateCode());
    setIsEntrySheetOpen(true);
  };

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
  const paginatedResults = searchResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);

  return (
    <div className="space-y-4 p-3 md:p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-wrap justify-between items-start gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">CONSIGNOR CONSIGNEE MASTER</h1>
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
            Add New Consignor Consignee
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Total Records</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Active Records</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
              <Check className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-gray-500 to-gray-600 text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Inactive Records</p>
                <p className="text-2xl font-bold">{stats.inactive}</p>
              </div>
              <AlertCircle className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Branch</Label>
              <Select value={searchBranch} onValueChange={setSearchBranch}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="All" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {branchList.map(b => (<SelectItem key={b} value={b}>{b}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Name</Label>
              <Input value={searchName} onChange={(e) => setSearchName(e.target.value)} placeholder="Enter name" className="h-9 text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Type</Label>
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Consignor">Consignor</SelectItem>
                  <SelectItem value="Consignee">Consignee</SelectItem>
                  <SelectItem value="Both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Status</Label>
              <Select value={searchStatus} onValueChange={setSearchStatus}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">GST Number</Label>
              <Input value={searchGstNo} onChange={(e) => setSearchGstNo(e.target.value)} placeholder="Enter GST Number" className="h-9 text-sm" />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={handleSearch} size="sm" className="h-9">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
            <Button onClick={clearSearch} variant="outline" size="sm" className="h-9">
              <RefreshCw className="mr-2 h-4 w-4" />
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
              Records List
            </CardTitle>
            <div className="text-sm text-gray-500">
              Total: {searchResults.length} records
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[1200px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Alias Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>GST No</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-24 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedResults.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center py-8 text-gray-500">
                        <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        No records found. Click "Add New Record" to create one.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedResults.map((record, idx) => (
                      <TableRow key={record.id} className="hover:bg-gray-50">
                        <TableCell>{(currentPage - 1) * itemsPerPage + idx + 1}</TableCell>
                        <TableCell>{record.branch}</TableCell>
                        <TableCell className="font-medium">{record.name}</TableCell>
                        <TableCell>{record.aliasDisplayName}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50">
                            {record.consignorConsignee}
                          </Badge>
                        </TableCell>
                        <TableCell>{record.city}</TableCell>
                        <TableCell>{record.state}</TableCell>
                        <TableCell className="font-mono text-xs">{record.gstin}</TableCell>
                        <TableCell>{record.mobileNo}</TableCell>
                        <TableCell>{getStatusBadge(record.active)}</TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(record)}
                            className="h-8 w-8 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                            title="Edit Record"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
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
                  Edit Consignor/Consignee
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 text-blue-600" />
                  Add New Consignor/Consignee
                </>
              )}
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-4">
            {/* Row 1 - Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Branch <span className="text-red-500">*</span></Label>
                <Select value={branch} onValueChange={setBranch}>
                  <SelectTrigger className="h-10"><SelectValue placeholder="Select Branch" /></SelectTrigger>
                  <SelectContent>{branchList.map(b => (<SelectItem key={b} value={b}>{b}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Type <span className="text-red-500">*</span></Label>
                <Select value={consignorConsignee} onValueChange={setConsignorConsignee}>
                  <SelectTrigger className="h-10"><SelectValue placeholder="Select Type" /></SelectTrigger>
                  <SelectContent>{consignorConsigneeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2 flex items-end">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-4 w-4 rounded" id="active" />
                  <Label htmlFor="active" className="text-sm font-medium cursor-pointer">Active</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Code</Label>
                <Input value={code} readOnly className="h-10 bg-gray-50" />
              </div>
            </div>

            {/* Row 2 - Name Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Name <span className="text-red-500">*</span></Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Name" className="h-10" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Alias/Display Name <span className="text-red-500">*</span></Label>
                <Input value={aliasDisplayName} onChange={(e) => setAliasDisplayName(e.target.value)} placeholder="Enter Alias Name" className="h-10" />
              </div>
            </div>

            {/* Row 3 - Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Address <span className="text-red-500">*</span></Label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter Address" className="h-10" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Alias Address</Label>
                <Input value={aliasAddress} onChange={(e) => setAliasAddress(e.target.value)} placeholder="Enter Alias Address" className="h-10" />
              </div>
            </div>

            {/* Row 4 - Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">City <span className="text-red-500">*</span></Label>
                <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter City" className="h-10" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Zip Code</Label>
                <Input value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder="Enter Zip Code" className="h-10" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Contact Person</Label>
                <Input value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} placeholder="Enter Contact Person" className="h-10" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">State</Label>
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger className="h-10"><SelectValue placeholder="Select State" /></SelectTrigger>
                  <SelectContent>{stateList.map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}</SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 5 - Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Country</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="h-10"><SelectValue placeholder="Select Country" /></SelectTrigger>
                  <SelectContent>{countryList.map(c => (<SelectItem key={c} value={c}>{c}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Mobile No.</Label>
                <Input value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} placeholder="Enter Mobile No" className="h-10" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Secondary Mobile</Label>
                <Input value={secondaryMobileNo} onChange={(e) => setSecondaryMobileNo(e.target.value)} placeholder="Enter Secondary Mobile" className="h-10" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Email ID</Label>
                <Input value={emailId} onChange={(e) => setEmailId(e.target.value)} placeholder="Enter Email" className="h-10" />
              </div>
            </div>

            {/* Row 6 - GST Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">PAN No.</Label>
                <Input value={panNo} onChange={(e) => setPanNo(e.target.value)} placeholder="Enter PAN Number" className="h-10" />
              </div>
              <div className="space-y-2 flex items-end">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={gstNotApplicable} onChange={(e) => setGstNotApplicable(e.target.checked)} className="h-4 w-4 rounded" id="gstNotApp" />
                  <Label htmlFor="gstNotApp" className="text-sm font-medium cursor-pointer">GST Not Applicable</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">GSTIN <span className="text-red-500">*</span></Label>
                <Input value={gstin} onChange={(e) => setGstin(e.target.value)} placeholder="Enter GSTIN" className="h-10" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">GST Issue Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-10 w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {gstIssueDate ? format(gstIssueDate, "dd-MM-yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent mode="single" selected={gstIssueDate} onSelect={setGstIssueDate} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Row 7 - Billing & Credit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Billing Criteria</Label>
                <Select value={billingCriteria} onValueChange={setBillingCriteria}>
                  <SelectTrigger className="h-10"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{billingCriteriaOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Freight On</Label>
                <Select value={freightOn} onValueChange={setFreightOn}>
                  <SelectTrigger className="h-10"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{freightOnOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Credit Days</Label>
                <Input value={creditDays} onChange={(e) => setCreditDays(e.target.value)} placeholder="Enter Credit Days" className="h-10" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Credit Limit</Label>
                <Input type="number" value={creditLimit} onChange={(e) => setCreditLimit(e.target.value)} className="h-10" />
              </div>
            </div>

            {/* Row 8 - More Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Customer Type</Label>
                <Select value={customerType} onValueChange={setCustomerType}>
                  <SelectTrigger className="h-10"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{customerTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Industry Type</Label>
                <Select value={industryType} onValueChange={setIndustryType}>
                  <SelectTrigger className="h-10"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{industryTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Load Type</Label>
                <Select value={loadType} onValueChange={setLoadType}>
                  <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                  <SelectContent>{loadTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Billing Cycle</Label>
                <Select value={billingCycle} onValueChange={setBillingCycle}>
                  <SelectTrigger className="h-10"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{billingCycleOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                </Select>
              </div>
            </div>

            {/* Checkboxes Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-4 border rounded-md bg-gray-50">
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={creditLimitApplicable} onChange={(e) => setCreditLimitApplicable(e.target.checked)} className="h-4 w-4 rounded" id="creditLimit" />
                <Label htmlFor="creditLimit" className="text-sm cursor-pointer">Credit Limit Applicable</Label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={invoiceRequired} onChange={(e) => setInvoiceRequired(e.target.checked)} className="h-4 w-4 rounded" id="invoiceReq" />
                <Label htmlFor="invoiceReq" className="text-sm cursor-pointer">Invoice Required</Label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={isWhatsAppAlert} onChange={(e) => setIsWhatsAppAlert(e.target.checked)} className="h-4 w-4 rounded" id="whatsapp" />
                <Label htmlFor="whatsapp" className="text-sm cursor-pointer">WhatsApp Alert</Label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={allowLiveTrackingOnPortal} onChange={(e) => setAllowLiveTrackingOnPortal(e.target.checked)} className="h-4 w-4 rounded" id="liveTracking" />
                <Label htmlFor="liveTracking" className="text-sm cursor-pointer">Live Tracking On Portal</Label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={kycCompleted} onChange={(e) => setKycCompleted(e.target.checked)} className="h-4 w-4 rounded" id="kyc" />
                <Label htmlFor="kyc" className="text-sm cursor-pointer">KYC Completed</Label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={rebateNotAllow} onChange={(e) => setRebateNotAllow(e.target.checked)} className="h-4 w-4 rounded" id="rebate" />
                <Label htmlFor="rebate" className="text-sm cursor-pointer">Rebate Not Allow</Label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={hideFreightInGR} onChange={(e) => setHideFreightInGR(e.target.checked)} className="h-4 w-4 rounded" id="hideFreight" />
                <Label htmlFor="hideFreight" className="text-sm cursor-pointer">Hide Freight In GR</Label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={roundOffWeightNotRequired} onChange={(e) => setRoundOffWeightNotRequired(e.target.checked)} className="h-4 w-4 rounded" id="roundOff" />
                <Label htmlFor="roundOff" className="text-sm cursor-pointer">Round Off Weight Not Required</Label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsEntrySheetOpen(false)}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              {editMode && (
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              )}
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                <Save className="mr-2 h-4 w-4" />
                {editMode ? "Update Record" : "Save Record"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}