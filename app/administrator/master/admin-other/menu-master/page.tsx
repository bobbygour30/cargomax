"use client";

import React, { useState } from "react";
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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Save,
  RefreshCw,
  Search,
  Pencil,
  Trash2,
  Eye,
  FileText,
  Menu,
  Globe,
  Database,
  Video,
  Smartphone,
  Shield,
  Users,
  LayoutDashboard,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface MenuMaster {
  id: number;
  module: string;
  menuCode: string;
  menuType: string;
  menuSubtype: string;
  menuName: string;
  displayName: string;
  aliasName: string;
  parent: string;
  webPath: string;
  command: string;
  mainReport: string;
  sequenceNo: number;
  systemFile: string;
  applicationType: string;
  masterTable: string;
  eventName: string;
  tutorialHindi: string;
  tutorialEnglish: string;
  tutorialYoutube: string;
  smsApi: string;
  smsSenderId: string;
  storedProcedure: string;
  scanDocument: boolean;
  isAdminMenu: boolean;
  isCustomerPortal: boolean;
  isDashboardMenu: boolean;
}

// Options
const moduleOptions = [
  "Dashboard",
  "Operations",
  "Accounts",
  "Administrator",
  "Inventory",
  "Help & Support",
  "Reports",
  "Master",
  "Transactions",
  "Utilities",
];

const menuTypeOptions = [
  { value: "FORM", label: "FORM" },
  { value: "MENU", label: "MENU" },
  { value: "REPORT", label: "REPORT" },
  { value: "DASHBOARD", label: "DASHBOARD" },
  { value: "TOOLS & UTILITIES", label: "TOOLS & UTILITIES" },
];

const menuSubtypeOptions = [
  "TRANSACTION",
  "MASTER",
  "REPORT",
  "UTILITY",
  "SETUP",
  "ENQUIRY",
];

const parentOptions = [
  "Dashboard",
  "Operations",
  "Accounts",
  "Administrator",
  "Inventory",
  "Reports",
  "Master",
  "Transactions",
  "None",
];

const applicationTypeOptions = [
  { value: "WEB", label: "WEB" },
  { value: "MOBILE", label: "MOBILE" },
  { value: "BOTH", label: "BOTH" },
];

export default function MenuMaster() {
  const [activeTab, setActiveTab] = useState<"entry" | "search">("entry");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchMenuName, setSearchMenuName] = useState<string>("");
  const [searchMenuType, setSearchMenuType] = useState<string>("ALL");
  const [searchApplicationType, setSearchApplicationType] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Form State
  const [module, setModule] = useState<string>("");
  const [menuCode, setMenuCode] = useState<string>("");
  const [menuType, setMenuType] = useState<string>("");
  const [menuSubtype, setMenuSubtype] = useState<string>("");
  const [menuName, setMenuName] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [aliasName, setAliasName] = useState<string>("");
  const [parent, setParent] = useState<string>("");
  const [webPath, setWebPath] = useState<string>("");
  const [command, setCommand] = useState<string>("");
  const [mainReport, setMainReport] = useState<string>("");
  const [sequenceNo, setSequenceNo] = useState<number>(0);
  const [systemFile, setSystemFile] = useState<string>("");
  const [applicationType, setApplicationType] = useState<string>("");
  const [masterTable, setMasterTable] = useState<string>("");
  const [eventName, setEventName] = useState<string>("");
  const [tutorialHindi, setTutorialHindi] = useState<string>("");
  const [tutorialEnglish, setTutorialEnglish] = useState<string>("");
  const [tutorialYoutube, setTutorialYoutube] = useState<string>("");
  const [smsApi, setSmsApi] = useState<string>("");
  const [smsSenderId, setSmsSenderId] = useState<string>("");
  const [storedProcedure, setStoredProcedure] = useState<string>("");
  const [scanDocument, setScanDocument] = useState<boolean>(false);
  const [isAdminMenu, setIsAdminMenu] = useState<boolean>(false);
  const [isCustomerPortal, setIsCustomerPortal] = useState<boolean>(false);
  const [isDashboardMenu, setIsDashboardMenu] = useState<boolean>(false);

  // Sample Data
  const [savedRecords, setSavedRecords] = useState<MenuMaster[]>([
    { id: 1, module: "Operations", menuCode: "OP001", menuType: "FORM", menuSubtype: "TRANSACTION", menuName: "Booking Computerize GRL", displayName: "Booking GRL", aliasName: "Booking", parent: "Transactions", webPath: "/operations/transaction/booking-computerize", command: "", mainReport: "", sequenceNo: 1, systemFile: "", applicationType: "WEB", masterTable: "", eventName: "", tutorialHindi: "", tutorialEnglish: "", tutorialYoutube: "", smsApi: "", smsSenderId: "", storedProcedure: "", scanDocument: false, isAdminMenu: false, isCustomerPortal: false, isDashboardMenu: false },
    { id: 2, module: "Accounts", menuCode: "ACC001", menuType: "FORM", menuSubtype: "MASTER", menuName: "Customer Master", displayName: "Customer", aliasName: "Cust", parent: "Master", webPath: "/accounts/customers", command: "", mainReport: "", sequenceNo: 2, systemFile: "", applicationType: "WEB", masterTable: "", eventName: "", tutorialHindi: "", tutorialEnglish: "", tutorialYoutube: "", smsApi: "", smsSenderId: "", storedProcedure: "", scanDocument: false, isAdminMenu: false, isCustomerPortal: false, isDashboardMenu: false },
    { id: 3, module: "Administrator", menuCode: "ADM001", menuType: "MENU", menuSubtype: "SETUP", menuName: "User Management", displayName: "Users", aliasName: "User", parent: "Administrator", webPath: "/admin/users", command: "", mainReport: "", sequenceNo: 3, systemFile: "", applicationType: "WEB", masterTable: "", eventName: "", tutorialHindi: "", tutorialEnglish: "", tutorialYoutube: "", smsApi: "", smsSenderId: "", storedProcedure: "", scanDocument: false, isAdminMenu: true, isCustomerPortal: false, isDashboardMenu: false },
  ]);

  const generateMenuCode = (): string => {
    const prefix = module.substring(0, 3).toUpperCase();
    const count = savedRecords.length + 1;
    return `${prefix}${String(count).padStart(3, "0")}`;
  };

  const resetForm = () => {
    setModule("");
    setMenuCode(generateMenuCode());
    setMenuType("");
    setMenuSubtype("");
    setMenuName("");
    setDisplayName("");
    setAliasName("");
    setParent("");
    setWebPath("");
    setCommand("");
    setMainReport("");
    setSequenceNo(0);
    setSystemFile("");
    setApplicationType("");
    setMasterTable("");
    setEventName("");
    setTutorialHindi("");
    setTutorialEnglish("");
    setTutorialYoutube("");
    setSmsApi("");
    setSmsSenderId("");
    setStoredProcedure("");
    setScanDocument(false);
    setIsAdminMenu(false);
    setIsCustomerPortal(false);
    setIsDashboardMenu(false);
    setEditId(null);
  };

  const handleSave = () => {
    if (!module) { alert("Please select Module"); return; }
    if (!menuCode) { alert("Please enter Menu Code"); return; }
    if (!menuType) { alert("Please select Menu Type"); return; }
    if (!menuName) { alert("Please enter Menu Name"); return; }
    if (!parent) { alert("Please select Parent"); return; }

    setLoading(true);
    setTimeout(() => {
      const newRecord: MenuMaster = {
        id: editId || Date.now(),
        module,
        menuCode,
        menuType,
        menuSubtype,
        menuName,
        displayName,
        aliasName,
        parent,
        webPath,
        command,
        mainReport,
        sequenceNo,
        systemFile,
        applicationType,
        masterTable,
        eventName,
        tutorialHindi,
        tutorialEnglish,
        tutorialYoutube,
        smsApi,
        smsSenderId,
        storedProcedure,
        scanDocument,
        isAdminMenu,
        isCustomerPortal,
        isDashboardMenu,
      };

      if (editId) {
        setSavedRecords(savedRecords.map(record => record.id === editId ? newRecord : record));
        alert("Record updated successfully!");
      } else {
        setSavedRecords([...savedRecords, newRecord]);
        alert("Record saved successfully!");
      }
      resetForm();
      setActiveTab("search");
      setLoading(false);
    }, 500);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this record?")) {
      setSavedRecords(savedRecords.filter(record => record.id !== id));
      alert("Record deleted successfully!");
    }
  };

  const handleEdit = (record: MenuMaster) => {
    setEditId(record.id);
    setModule(record.module);
    setMenuCode(record.menuCode);
    setMenuType(record.menuType);
    setMenuSubtype(record.menuSubtype);
    setMenuName(record.menuName);
    setDisplayName(record.displayName);
    setAliasName(record.aliasName);
    setParent(record.parent);
    setWebPath(record.webPath);
    setCommand(record.command);
    setMainReport(record.mainReport);
    setSequenceNo(record.sequenceNo);
    setSystemFile(record.systemFile);
    setApplicationType(record.applicationType);
    setMasterTable(record.masterTable);
    setEventName(record.eventName);
    setTutorialHindi(record.tutorialHindi);
    setTutorialEnglish(record.tutorialEnglish);
    setTutorialYoutube(record.tutorialYoutube);
    setSmsApi(record.smsApi);
    setSmsSenderId(record.smsSenderId);
    setStoredProcedure(record.storedProcedure);
    setScanDocument(record.scanDocument);
    setIsAdminMenu(record.isAdminMenu);
    setIsCustomerPortal(record.isCustomerPortal);
    setIsDashboardMenu(record.isDashboardMenu);
    setActiveTab("entry");
  };

  // Search Filters
  const filteredRecords = savedRecords.filter(record => {
    let match = true;
    if (searchMenuName && !record.menuName.toLowerCase().includes(searchMenuName.toLowerCase())) match = false;
    if (searchMenuType !== "ALL" && record.menuType !== searchMenuType) match = false;
    if (searchApplicationType !== "ALL" && record.applicationType !== searchApplicationType) match = false;
    if (searchTerm && !record.menuName.toLowerCase().includes(searchTerm.toLowerCase()) && !record.menuCode.toLowerCase().includes(searchTerm.toLowerCase())) match = false;
    return match;
  });

  const paginatedResults = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  const handleShowDetails = () => {
    // Trigger search with current filters
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">MENU MASTER</h1>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[10px] md:text-xs text-muted-foreground">
          <span>Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
          <span>Login By : MAYANK.GRLOGISTICS@GMAIL.COM</span>
          <span>Login Branch : CORPORATE OFFICE</span>
          <span>Financial Year : 2026-2027</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button onClick={() => { setActiveTab("entry"); resetForm(); }} className={cn("px-4 py-2 text-sm font-medium transition-all", activeTab === "entry" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground")}>Entry</button>
        <button onClick={() => { setActiveTab("search"); setCurrentPage(1); }} className={cn("px-4 py-2 text-sm font-medium transition-all", activeTab === "search" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground")}>Search</button>
      </div>

      {/* Entry Tab */}
      {activeTab === "entry" && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Menu className="h-5 w-5 text-primary" />
              Menu Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1"><Label className="text-xs">Module <span className="text-red-500">*</span></Label><Select value={module} onValueChange={setModule}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{moduleOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
              <div className="space-y-1"><Label className="text-xs">Menu Code <span className="text-red-500">*</span></Label><Input value={menuCode} onChange={(e) => setMenuCode(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Menu Type <span className="text-red-500">*</span></Label><Select value={menuType} onValueChange={setMenuType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{menuTypeOptions.map(opt => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent></Select></div>
              <div className="space-y-1"><Label className="text-xs">Menu Subtype</Label><Select value={menuSubtype} onValueChange={setMenuSubtype}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{menuSubtypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1"><Label className="text-xs">Menu Name <span className="text-red-500">*</span></Label><Input value={menuName} onChange={(e) => setMenuName(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Display Name</Label><Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Alias Name</Label><Input value={aliasName} onChange={(e) => setAliasName(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Parent <span className="text-red-500">*</span></Label><Select value={parent} onValueChange={setParent}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{parentOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1"><Label className="text-xs">Web Path</Label><Input value={webPath} onChange={(e) => setWebPath(e.target.value)} placeholder="https://" className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Command</Label><Input value={command} onChange={(e) => setCommand(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Main Report</Label><Input value={mainReport} onChange={(e) => setMainReport(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Sequence #</Label><Input type="number" value={sequenceNo} onChange={(e) => setSequenceNo(Number(e.target.value))} className="h-8 text-xs" /></div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1"><Label className="text-xs">System File</Label><Input value={systemFile} onChange={(e) => setSystemFile(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Application Type</Label><Select value={applicationType} onValueChange={setApplicationType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{applicationTypeOptions.map(opt => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent></Select></div>
              <div className="space-y-1"><Label className="text-xs">Master Table</Label><Input value={masterTable} onChange={(e) => setMasterTable(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Event Name</Label><Input value={eventName} onChange={(e) => setEventName(e.target.value)} className="h-8 text-xs" /></div>
            </div>

            {/* Tutorial Documents */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1"><Label className="text-xs">Tutorial Document (Hindi)</Label><Input value={tutorialHindi} onChange={(e) => setTutorialHindi(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Tutorial Document (English)</Label><Input value={tutorialEnglish} onChange={(e) => setTutorialEnglish(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Tutorial Document (Youtube)</Label><Input value={tutorialYoutube} onChange={(e) => setTutorialYoutube(e.target.value)} className="h-8 text-xs" /></div>
            </div>

            {/* SMS & Stored Procedure */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1"><Label className="text-xs">Sms Api</Label><Input value={smsApi} onChange={(e) => setSmsApi(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Sms Sender ID</Label><Input value={smsSenderId} onChange={(e) => setSmsSenderId(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Stored Procedure</Label><Input value={storedProcedure} onChange={(e) => setStoredProcedure(e.target.value)} className="h-8 text-xs" /></div>
            </div>

            {/* Checkboxes Row */}
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2"><input type="checkbox" checked={scanDocument} onChange={(e) => setScanDocument(e.target.checked)} className="h-3.5 w-3.5" id="scanDoc" /><Label htmlFor="scanDoc" className="text-xs cursor-pointer">Scan Document</Label></div>
              <div className="flex items-center gap-2"><input type="checkbox" checked={isAdminMenu} onChange={(e) => setIsAdminMenu(e.target.checked)} className="h-3.5 w-3.5" id="adminMenu" /><Label htmlFor="adminMenu" className="text-xs cursor-pointer">Is Admin Menu</Label></div>
              <div className="flex items-center gap-2"><input type="checkbox" checked={isCustomerPortal} onChange={(e) => setIsCustomerPortal(e.target.checked)} className="h-3.5 w-3.5" id="customerPortal" /><Label htmlFor="customerPortal" className="text-xs cursor-pointer">Is Customer Portal</Label></div>
              <div className="flex items-center gap-2"><input type="checkbox" checked={isDashboardMenu} onChange={(e) => setIsDashboardMenu(e.target.checked)} className="h-3.5 w-3.5" id="dashboardMenu" /><Label htmlFor="dashboardMenu" className="text-xs cursor-pointer">Is Dashboard Menu</Label></div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button onClick={handleSave} size="sm" className="h-8 text-xs bg-green-600" disabled={loading}><Save className="mr-1 h-3 w-3" />{editId ? "UPDATE" : "SAVE"}</Button>
              <Button onClick={resetForm} variant="outline" size="sm" className="h-8 text-xs"><RefreshCw className="mr-1 h-3 w-3" />CLEAR</Button>
              {editId && (<Button onClick={() => handleDelete(editId)} variant="destructive" size="sm" className="h-8 text-xs"><Trash2 className="mr-1 h-3 w-3" />DELETE</Button>)}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Tab */}
      {activeTab === "search" && (
        <div className="space-y-4">
          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 border rounded-md bg-muted/20">
            <div className="space-y-1"><Label className="text-xs">Menu Name</Label><Input value={searchMenuName} onChange={(e) => setSearchMenuName(e.target.value)} placeholder="Enter Menu Name" className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Menu Type</Label><Select value={searchMenuType} onValueChange={setSearchMenuType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="ALL" /></SelectTrigger><SelectContent><SelectItem value="ALL">ALL</SelectItem>{menuTypeOptions.map(opt => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">Application Type</Label><Select value={searchApplicationType} onValueChange={setSearchApplicationType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="ALL" /></SelectTrigger><SelectContent><SelectItem value="ALL">ALL</SelectItem>{applicationTypeOptions.map(opt => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent></Select></div>
            <div className="flex items-end"><Button onClick={handleShowDetails} size="sm" className="h-8 text-xs"><Eye className="mr-1 h-3.5 w-3.5" />SHOW DETAILS</Button></div>
          </div>

          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" />
              <Input placeholder="Search by Menu Name or Code..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 h-8 text-xs" />
            </div>
            <Button onClick={() => setCurrentPage(1)} size="sm" className="h-8 text-xs"><Search className="mr-1 h-3.5 w-3.5" />SEARCH</Button>
          </div>

          {/* Results Table */}
          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[1000px]">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12 text-center">S#</TableHead>
                    <TableHead>Module Name</TableHead>
                    <TableHead>Menu Code</TableHead>
                    <TableHead>Menu Name</TableHead>
                    <TableHead>Display Name</TableHead>
                    <TableHead>Alias Name</TableHead>
                    <TableHead>Menu Type</TableHead>
                    <TableHead>Application Type</TableHead>
                    <TableHead className="w-24 text-center">Options</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedResults.length === 0 ? (
                    <TableRow><TableCell colSpan={9} className="text-center py-8">No records found</TableCell></TableRow>
                  ) : (
                    paginatedResults.map((record, idx) => (
                      <TableRow key={record.id} className="hover:bg-muted/30">
                        <TableCell className="text-center">{(currentPage - 1) * itemsPerPage + idx + 1}</TableCell>
                        <TableCell>{record.module}</TableCell>
                        <TableCell className="font-mono">{record.menuCode}</TableCell>
                        <TableCell className="font-medium">{record.menuName}</TableCell>
                        <TableCell>{record.displayName || "-"}</TableCell>
                        <TableCell>{record.aliasName || "-"}</TableCell>
                        <TableCell>{record.menuType}</TableCell>
                        <TableCell>{record.applicationType || "-"}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(record)} className="h-6 w-6 p-0 text-blue-500"><Pencil className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(record.id)} className="h-6 w-6 p-0 text-red-500"><Trash2 className="h-3.5 w-3.5" /></Button>
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
            <div className="flex justify-center gap-1">
              <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="h-7 text-xs">Previous</Button>
              <span className="px-3 py-1 text-xs bg-muted rounded-md">Page {currentPage} of {totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="h-7 text-xs">Next</Button>
            </div>
          )}
        </div>
      )}

      {/* Info Note */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 rounded-md p-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
          <div className="text-xs text-blue-700 dark:text-blue-400">
            <p className="font-medium">Note:</p>
            <ul className="list-disc list-inside mt-1 space-y-0.5">
              <li>Menu Code should be unique across all modules</li>
              <li>Parent menu determines the hierarchical structure</li>
              <li>Web Path is the URL route for the menu item</li>
              <li>Tutorial documents can be file paths or URLs</li>
              <li>Is Admin Menu hides the menu from non-admin users</li>
              <li>Is Dashboard Menu displays the menu on dashboard widget</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}