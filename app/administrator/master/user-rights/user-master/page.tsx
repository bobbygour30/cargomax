"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  UserPlus,
  Shield,
  Building2,
  PlusCircle,
  Users,
  MapPin,
  AlertCircle,
  X,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
interface User {
  id: number;
  userCreatedAt: Date;
  station: string;
  name: string;
  userName: string;
  aliasName: string;
  password: string;
  mobileNo: string;
  confirmPassword: string;
  roleName: string;
  executiveType: string;
  executive: string;
  emailId: string;
  otpRequiredForLogin: boolean;
  inactive: boolean;
  allowMails: boolean;
  superUser: boolean;
  hideFreight: boolean;
  machineId: string;
  employee: string;
  mobileImeiNo: string;
  employeeResignDate: Date | null;
  image: string;
  active: boolean;
  userType: string;
  employeeName: string;
  customerName: string;
  executiveName: string;
}

// Mock data for dropdowns
const stations = ["CORPORATE OFFICE", "GHAZIABAD R.O", "AGRA (YOGESH SHARMA)", "AHMEDABAD CITY", "BAWANA"];
const roleNames = ["HEAD OFFICE", "WAREHOUSE", "BOOKING", "DELIVERY"];
const executiveTypes = ["Select", "Type A", "Type B", "Type C"];
const executives = ["Executive 1", "Executive 2", "Executive 3"];
const employees = ["Employee 1", "Employee 2", "Employee 3"];

// Mock users for search tab
const mockUsers: User[] = [
  { id: 1, userCreatedAt: new Date(), station: "GHAZIABAD R.O", name: "ABHAY", userName: "ABHAY@GRLNEW", aliasName: "", password: "12345678", mobileNo: "9350167349", confirmPassword: "12345678", roleName: "HEAD OFFICE", executiveType: "", executive: "", emailId: "INFO.GRLOGISTICS@GMAIL.COM", otpRequiredForLogin: false, inactive: false, allowMails: false, superUser: false, hideFreight: false, machineId: "", employee: "", mobileImeiNo: "", employeeResignDate: null, image: "", active: true, userType: "USER", employeeName: "", customerName: "", executiveName: "" },
  { id: 2, userCreatedAt: new Date(), station: "AGRA (YOGESH SHARMA)", name: "AGRA", userName: "AGRA@GRLNEW", aliasName: "", password: "12345678", mobileNo: "9319967212", confirmPassword: "12345678", roleName: "BOOKING", executiveType: "", executive: "", emailId: "GRL.LOGITICS@GMAIL.COM", otpRequiredForLogin: false, inactive: false, allowMails: false, superUser: false, hideFreight: false, machineId: "", employee: "", mobileImeiNo: "", employeeResignDate: null, image: "", active: true, userType: "USER", employeeName: "", customerName: "", executiveName: "" },
];

// Mock data for rights tables
const mockRightsList = [
  { id: 1, application: "MOBILE", module: "ACCOUNTS", subModule: "TRANSACTION", menuName: "ACCOUNTS", allowAdd: false, allowUpdate: false, allowCancel: false, allowDelete: false, allowView: false },
  { id: 2, application: "MOBILE", module: "ACCOUNTS", subModule: "REPORT", menuName: "ALL OUTSTANDING REPORT", allowAdd: false, allowUpdate: false, allowCancel: false, allowDelete: false, allowView: false },
];

const mockAssignedRights = [
  { id: 1, assignedTo: "HEAD OFFICE", assignDone: "ROLE", menuName: "ACC PARA SETUP MASTER WEB", applicationType: "WEB", moduleName: "ADMINISTRATION", menuType: "MASTER", menuCode: "GTWEB_ACCPARASETUPMASTER", allowAdd: false, allowUpdate: false, allowCancel: false, allowDelete: false, allowPrint: false, editDays: 0 },
];

const mockDivisions = [
  { id: 1, division: "North", allAllocate: false, defaultSetup: false },
  { id: 2, division: "South", allAllocate: false, defaultSetup: false },
];
const mockCounters = [
  { id: 1, counterName: "Counter 1", allAllocate: false },
];
const mockCustomers = [
  { id: 1, customerName: "Customer A", selectAll: false },
];
const branches = ["AGARTALA", "AGRA (YOGESH SHARMA)", "AHMEDABAD CITY", "BAWANA", "DELHI"];

export default function UserMaster() {
  const [activeTab, setActiveTab] = useState<"entry" | "search">("entry");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchStatus, setSearchStatus] = useState("Active");
  const [searchUserType, setSearchUserType] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Entry form state
  const [userCreatedAt, setUserCreatedAt] = useState<Date>(new Date());
  const [station, setStation] = useState("");
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [aliasName, setAliasName] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [roleName, setRoleName] = useState("");
  const [executiveType, setExecutiveType] = useState("");
  const [executive, setExecutive] = useState("");
  const [emailId, setEmailId] = useState("");
  const [otpRequiredForLogin, setOtpRequiredForLogin] = useState(false);
  const [inactive, setInactive] = useState(false);
  const [allowMails, setAllowMails] = useState(false);
  const [superUser, setSuperUser] = useState(false);
  const [hideFreight, setHideFreight] = useState(false);
  const [machineId, setMachineId] = useState("");
  const [employee, setEmployee] = useState("");
  const [mobileImeiNo, setMobileImeiNo] = useState("");
  const [employeeResignDate, setEmployeeResignDate] = useState<Date | null>(null);
  const [image, setImage] = useState("");

  // Modal states
  const [assignRightsModalOpen, setAssignRightsModalOpen] = useState(false);
  const [checkRightsModalOpen, setCheckRightsModalOpen] = useState(false);
  const [allocateDivisionModalOpen, setAllocateDivisionModalOpen] = useState(false);
  const [addCounterModalOpen, setAddCounterModalOpen] = useState(false);
  const [allocateCustomerModalOpen, setAllocateCustomerModalOpen] = useState(false);
  const [allocateBranchModalOpen, setAllocateBranchModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Modal data
  const [rightsList, setRightsList] = useState(mockRightsList);
  const [assignedRights, setAssignedRights] = useState(mockAssignedRights);
  const [divisions, setDivisions] = useState(mockDivisions);
  const [counters, setCounters] = useState(mockCounters);
  const [customers, setCustomers] = useState(mockCustomers);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);

  // Helper functions
  const resetForm = () => {
    setUserCreatedAt(new Date());
    setStation("");
    setName("");
    setUserName("");
    setAliasName("");
    setPassword("");
    setMobileNo("");
    setConfirmPassword("");
    setRoleName("");
    setExecutiveType("");
    setExecutive("");
    setEmailId("");
    setOtpRequiredForLogin(false);
    setInactive(false);
    setAllowMails(false);
    setSuperUser(false);
    setHideFreight(false);
    setMachineId("");
    setEmployee("");
    setMobileImeiNo("");
    setEmployeeResignDate(null);
    setImage("");
    setEditId(null);
  };

  const handleSave = () => {
    if (!name) { alert("Name is required"); return; }
    if (!userName) { alert("User Name is required"); return; }
    if (!password || password.length < 8) { alert("Password must be at least 8 characters"); return; }
    if (password !== confirmPassword) { alert("Passwords do not match"); return; }
    if (!mobileNo) { alert("Mobile No. is required"); return; }
    if (!emailId) { alert("Email ID is required"); return; }

    setLoading(true);
    setTimeout(() => {
      const newUser: User = {
        id: editId || Date.now(),
        userCreatedAt,
        station,
        name,
        userName,
        aliasName,
        password,
        mobileNo,
        confirmPassword,
        roleName,
        executiveType,
        executive,
        emailId,
        otpRequiredForLogin,
        inactive,
        allowMails,
        superUser,
        hideFreight,
        machineId,
        employee,
        mobileImeiNo,
        employeeResignDate,
        image,
        active: true,
        userType: "USER",
        employeeName: "",
        customerName: "",
        executiveName: "",
      };
      if (editId) {
        setUsers(users.map(u => u.id === editId ? newUser : u));
        alert("User updated");
      } else {
        setUsers([...users, newUser]);
        alert("User saved");
      }
      resetForm();
      setActiveTab("search");
      setLoading(false);
    }, 500);
  };

  const handleEdit = (user: User) => {
    setEditId(user.id);
    setUserCreatedAt(user.userCreatedAt);
    setStation(user.station);
    setName(user.name);
    setUserName(user.userName);
    setAliasName(user.aliasName);
    setPassword(user.password);
    setMobileNo(user.mobileNo);
    setConfirmPassword(user.confirmPassword);
    setRoleName(user.roleName);
    setExecutiveType(user.executiveType);
    setExecutive(user.executive);
    setEmailId(user.emailId);
    setOtpRequiredForLogin(user.otpRequiredForLogin);
    setInactive(user.inactive);
    setAllowMails(user.allowMails);
    setSuperUser(user.superUser);
    setHideFreight(user.hideFreight);
    setMachineId(user.machineId);
    setEmployee(user.employee);
    setMobileImeiNo(user.mobileImeiNo);
    setEmployeeResignDate(user.employeeResignDate);
    setImage(user.image);
    setActiveTab("entry");
  };

  // Search handling
  const filteredUsers = users.filter(u =>
    (searchStatus === "Active" ? u.active : !u.active) &&
    (searchUserType === "All" || u.userType === searchUserType) &&
    (u.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage-1)*itemsPerPage, currentPage*itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  // Modal handlers
  const openAssignRights = (user: User) => {
    setSelectedUser(user);
    setAssignRightsModalOpen(true);
  };
  const openCheckRights = (user: User) => {
    setSelectedUser(user);
    setCheckRightsModalOpen(true);
  };
  const openAllocateDivision = (user: User) => {
    setSelectedUser(user);
    setAllocateDivisionModalOpen(true);
  };
  const openAddCounter = (user: User) => {
    setSelectedUser(user);
    setAddCounterModalOpen(true);
  };
  const openAllocateCustomer = (user: User) => {
    setSelectedUser(user);
    setAllocateCustomerModalOpen(true);
  };
  const openAllocateBranch = (user: User) => {
    setSelectedUser(user);
    setAllocateBranchModalOpen(true);
  };

  // Toggle helpers for modals
  const toggleRights = (id: number, field: string) => {
    // In real app, update state
  };
  const toggleDivisionAll = (id: number) => {
    // Update division
  };
  const toggleCounterAll = (id: number) => { };
  const toggleCustomerAll = (id: number) => { };
  const handleBranchSelect = (branch: string) => {
    setSelectedBranches(prev => prev.includes(branch) ? prev.filter(b => b !== branch) : [...prev, branch]);
  };

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">USER MASTER</h1>
        <div className="mt-1 text-[10px] md:text-xs text-muted-foreground">
          Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD | Login By : MAYANK.GRLOGISTICS@GMAIL.COM
          <br />
          Login Branch : CORPORATE OFFICE | Financial Year : 2026-2027
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "entry" | "search")}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="entry">Entry</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
        </TabsList>

        {/* -------------------- ENTRY TAB -------------------- */}
        <TabsContent value="entry" className="space-y-4 mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">User Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div><Label className="text-xs">User Created At <span className="text-red-500">*</span></Label>
                  <Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(userCreatedAt, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={userCreatedAt} onSelect={(d) => d && setUserCreatedAt(d)} /></PopoverContent></Popover>
                </div>
                <div><Label className="text-xs">Station <span className="text-red-500">*</span></Label>
                  <Select value={station} onValueChange={setStation}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{stations.map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}</SelectContent></Select>
                </div>
                <div><Label className="text-xs">Name <span className="text-red-500">*</span></Label><Input value={name} onChange={(e) => setName(e.target.value)} className="h-8 text-xs" /></div>
                <div><Label className="text-xs">User Name</Label><Input value={userName} onChange={(e) => setUserName(e.target.value)} className="h-8 text-xs" /></div>
                <div><Label className="text-xs">Alias Name</Label><Input value={aliasName} onChange={(e) => setAliasName(e.target.value)} className="h-8 text-xs" /></div>
                <div><Label className="text-xs">Password <span className="text-red-500">*</span></Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-8 text-xs" /><p className="text-[10px] text-muted-foreground">Minimum 8 Character Required</p></div>
                <div><Label className="text-xs">Mobile No. <span className="text-red-500">*</span></Label><Input value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} className="h-8 text-xs" /></div>
                <div><Label className="text-xs">Confirm Password <span className="text-red-500">*</span></Label><Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="h-8 text-xs" /><p className="text-[10px] text-muted-foreground">Minimum 8 Character Required</p></div>
                <div><Label className="text-xs">Role Name</Label><Select value={roleName} onValueChange={setRoleName}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{roleNames.map(r => (<SelectItem key={r} value={r}>{r}</SelectItem>))}</SelectContent></Select></div>
                <div><Label className="text-xs">Executive Type</Label><Select value={executiveType} onValueChange={setExecutiveType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{executiveTypes.map(et => (<SelectItem key={et} value={et}>{et}</SelectItem>))}</SelectContent></Select></div>
                <div><Label className="text-xs">Executive</Label><Select value={executive} onValueChange={setExecutive}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{executives.map(e => (<SelectItem key={e} value={e}>{e}</SelectItem>))}</SelectContent></Select></div>
                <div><Label className="text-xs">Email ID <span className="text-red-500">*</span></Label><Input value={emailId} onChange={(e) => setEmailId(e.target.value)} className="h-8 text-xs" /></div>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2"><Checkbox checked={otpRequiredForLogin} onCheckedChange={c => setOtpRequiredForLogin(!!c)} /><Label className="text-xs">OTP Required For Login</Label></div>
                <div className="flex items-center gap-2"><Checkbox checked={inactive} onCheckedChange={c => setInactive(!!c)} /><Label className="text-xs">Inactive</Label></div>
                <div className="flex items-center gap-2"><Checkbox checked={allowMails} onCheckedChange={c => setAllowMails(!!c)} /><Label className="text-xs">Allow Mails</Label></div>
                <div className="flex items-center gap-2"><Checkbox checked={superUser} onCheckedChange={c => setSuperUser(!!c)} /><Label className="text-xs">Super User</Label></div>
                <div className="flex items-center gap-2"><Checkbox checked={hideFreight} onCheckedChange={c => setHideFreight(!!c)} /><Label className="text-xs">Hide Freight</Label></div>
              </div>

              <div className="border-t pt-3 mt-2">
                <h4 className="text-sm font-semibold mb-2">Other Setting</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div><Label className="text-xs">Machine ID</Label><Input value={machineId} onChange={(e) => setMachineId(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Employee</Label><Select value={employee} onValueChange={setEmployee}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{employees.map(e => (<SelectItem key={e} value={e}>{e}</SelectItem>))}</SelectContent></Select></div>
                  <div><Label className="text-xs">Mobile IMEI No</Label><Input value={mobileImeiNo} onChange={(e) => setMobileImeiNo(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Employee Resign Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{employeeResignDate ? format(employeeResignDate, "dd-MM-yyyy") : "Select date"}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={employeeResignDate || undefined} onSelect={(d) => setEmployeeResignDate(d || null)} /></PopoverContent></Popover></div>
                  <div className="col-span-2"><Label className="text-xs">Select Image</Label><Input type="file" accept="image/*" onChange={(e) => e.target.files && setImage(e.target.files[0].name)} className="h-8 text-xs file:h-7" /><p className="text-[10px] text-muted-foreground">No file chosen</p></div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button onClick={handleSave} size="sm" className="bg-green-600" disabled={loading}><Save className="mr-1 h-3 w-3" />{editId ? "UPDATE" : "SAVE"}</Button>
                <Button onClick={resetForm} variant="outline" size="sm"><RefreshCw className="mr-1 h-3 w-3" />CLEAR</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* -------------------- SEARCH TAB -------------------- */}
        <TabsContent value="search" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 border rounded-md bg-muted/20">
            <div><Label className="text-xs">Status</Label><Select value={searchStatus} onValueChange={setSearchStatus}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Active">Active</SelectItem><SelectItem value="Inactive">Inactive</SelectItem></SelectContent></Select></div>
            <div><Label className="text-xs">User Type</Label><Select value={searchUserType} onValueChange={setSearchUserType}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="All">All</SelectItem><SelectItem value="USER">USER</SelectItem><SelectItem value="ADMIN">ADMIN</SelectItem></SelectContent></Select></div>
            <div className="flex gap-2"><div className="relative flex-1"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" /><Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 h-8 text-xs" /></div><Button onClick={() => setCurrentPage(1)} size="sm" className="h-8 text-xs">SEARCH</Button></div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[1000px]">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>S#</TableHead><TableHead>User Name</TableHead><TableHead>Alias Name</TableHead><TableHead>User Branch</TableHead><TableHead>Role Assigned</TableHead><TableHead>Email Id</TableHead><TableHead>Mobile #</TableHead><TableHead>User Type</TableHead><TableHead>Employee Name</TableHead><TableHead>Customer Name</TableHead><TableHead>Executive Name</TableHead><TableHead>Active</TableHead><TableHead className="w-12">Options</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.map((user, idx) => (
                    <TableRow key={user.id}>
                      <TableCell>{(currentPage-1)*itemsPerPage+idx+1}</TableCell>
                      <TableCell>{user.userName}</TableCell><TableCell>{user.aliasName}</TableCell><TableCell>{user.station}</TableCell><TableCell>{user.roleName}</TableCell><TableCell>{user.emailId}</TableCell><TableCell>{user.mobileNo}</TableCell><TableCell>{user.userType}</TableCell><TableCell>{user.employeeName}</TableCell><TableCell>{user.customerName}</TableCell><TableCell>{user.executiveName}</TableCell>
                      <TableCell>{user.active ? "Y" : "N"}</TableCell>
                      <TableCell>
                        
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(user)} className="h-6 w-6 p-0 text-blue-500"><Edit className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => openAssignRights(user)} className="h-6 w-6 p-0 text-purple-500"><Shield className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => openCheckRights(user)} className="h-6 w-6 p-0 text-green-500"><Eye className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => openAllocateDivision(user)} className="h-6 w-6 p-0 text-orange-500"><Building2 className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => openAddCounter(user)} className="h-6 w-6 p-0 text-indigo-500"><PlusCircle className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => openAllocateCustomer(user)} className="h-6 w-6 p-0 text-pink-500"><Users className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => openAllocateBranch(user)} className="h-6 w-6 p-0 text-cyan-500"><MapPin className="h-3.5 w-3.5" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          {totalPages > 1 && (<div className="flex justify-center gap-1"><Button variant="outline" size="sm" onClick={() => goToPage(currentPage-1)} disabled={currentPage===1}>Previous</Button><span className="px-3 py-1 text-xs bg-muted rounded-md">Page {currentPage} of {totalPages}</span><Button variant="outline" size="sm" onClick={() => goToPage(currentPage+1)} disabled={currentPage===totalPages}>Next</Button></div>)}
        </TabsContent>
      </Tabs>

      {/* -------------------- MODALS -------------------- */}

      {/* Assign Rights Modal */}
      <Dialog open={assignRightsModalOpen} onOpenChange={setAssignRightsModalOpen}>
        <DialogContent className="max-w-5xl max-h-[80vh] flex flex-col p-0">
          <DialogHeader className="px-4 pt-4 pb-2 border-b"><DialogTitle>Assign Rights - {selectedUser?.userName}</DialogTitle></DialogHeader>
          <div className="flex-1 overflow-auto px-4 py-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
              <div><Label className="text-xs">Assign Rights On</Label><Input value="USER" readOnly className="h-8 bg-muted" /></div>
              <div><Label className="text-xs">Role Name</Label><Input value={selectedUser?.userName} readOnly className="h-8 bg-muted" /></div>
              <div><Label className="text-xs">Application Type</Label><Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="Web">Web</SelectItem><SelectItem value="App">App</SelectItem></SelectContent></Select></div>
              <div><Label className="text-xs">Assigned/Unassigned</Label><Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="ALL" /></SelectTrigger><SelectContent><SelectItem value="ALL">ALL</SelectItem><SelectItem value="ASSIGNED">ASSIGNED</SelectItem><SelectItem value="UNASSIGNED">UNASSIGNED</SelectItem></SelectContent></Select></div>
              <div><Label className="text-xs">Module</Label><Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="ACCOUNTS">ACCOUNTS</SelectItem><SelectItem value="OPERATIONS">OPERATIONS</SelectItem></SelectContent></Select></div>
              <div><Label className="text-xs">Menu Type</Label><Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="MASTER">MASTER</SelectItem><SelectItem value="TRANSACTION">TRANSACTION</SelectItem></SelectContent></Select></div>
            </div>
            <div className="rounded-md border overflow-x-auto"><Table className="text-xs"><TableHeader><TableRow><TableHead>S#</TableHead><TableHead>Application</TableHead><TableHead>Module</TableHead><TableHead>Sub Module</TableHead><TableHead>Menu Name</TableHead><TableHead>Allow Add</TableHead><TableHead>Allow Update</TableHead><TableHead>Allow Cancel</TableHead><TableHead>Allow Delete</TableHead><TableHead>Allow View</TableHead><TableHead>Action</TableHead></TableRow></TableHeader><TableBody>{rightsList.map((r, i) => (<TableRow key={r.id}><TableCell>{i+1}</TableCell><TableCell>{r.application}</TableCell><TableCell>{r.module}</TableCell><TableCell>{r.subModule}</TableCell><TableCell>{r.menuName}</TableCell><TableCell><Checkbox checked={r.allowAdd} onCheckedChange={()=>toggleRights(r.id,"allowAdd")} /></TableCell><TableCell><Checkbox checked={r.allowUpdate} /></TableCell><TableCell><Checkbox checked={r.allowCancel} /></TableCell><TableCell><Checkbox checked={r.allowDelete} /></TableCell><TableCell><Checkbox checked={r.allowView} /></TableCell><TableCell><Button variant="ghost" size="sm" className="text-red-500"><X className="h-3.5 w-3.5" /></Button></TableCell></TableRow>))}</TableBody></Table></div>
          </div>
          <DialogFooter className="px-4 py-3 border-t"><Button variant="outline" onClick={() => setAssignRightsModalOpen(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Check Rights Modal */}
      <Dialog open={checkRightsModalOpen} onOpenChange={setCheckRightsModalOpen}>
        <DialogContent className="max-w-5xl max-h-[80vh] flex flex-col p-0">
          <DialogHeader className="px-4 pt-4 pb-2 border-b"><DialogTitle>Check Rights - {selectedUser?.userName}</DialogTitle></DialogHeader>
          <div className="flex-1 overflow-auto px-4 py-3">
            <div className="rounded-md border overflow-x-auto"><Table className="text-xs"><TableHeader><TableRow><TableHead>S#</TableHead><TableHead>Assigned To</TableHead><TableHead>Assign Done</TableHead><TableHead>Menu Name</TableHead><TableHead>Application Type</TableHead><TableHead>Module Name</TableHead><TableHead>Menu Type</TableHead><TableHead>Menu Code</TableHead><TableHead>Add</TableHead><TableHead>Update</TableHead><TableHead>Cancel</TableHead><TableHead>Delete</TableHead><TableHead>Print</TableHead><TableHead>Edit Days</TableHead></TableRow></TableHeader><TableBody>{assignedRights.map((r, i) => (<TableRow key={r.id}><TableCell>{i+1}</TableCell><TableCell>{r.assignedTo}</TableCell><TableCell>{r.assignDone}</TableCell><TableCell>{r.menuName}</TableCell><TableCell>{r.applicationType}</TableCell><TableCell>{r.moduleName}</TableCell><TableCell>{r.menuType}</TableCell><TableCell>{r.menuCode}</TableCell><TableCell>{r.allowAdd ? "Yes" : "No"}</TableCell><TableCell>{r.allowUpdate ? "Yes" : "No"}</TableCell><TableCell>{r.allowCancel ? "Yes" : "No"}</TableCell><TableCell>{r.allowDelete ? "Yes" : "No"}</TableCell><TableCell>{r.allowPrint ? "Yes" : "No"}</TableCell><TableCell>{r.editDays}</TableCell></TableRow>))}</TableBody></Table></div>
          </div>
          <DialogFooter className="px-4 py-3 border-t"><Button variant="outline" onClick={() => setCheckRightsModalOpen(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Allocate Division Modal */}
      <Dialog open={allocateDivisionModalOpen} onOpenChange={setAllocateDivisionModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Allocate Division - {selectedUser?.userName}</DialogTitle></DialogHeader>
          <div className="overflow-x-auto"><Table className="text-xs"><TableHeader><TableRow><TableHead>S#</TableHead><TableHead>Division</TableHead><TableHead className="text-center">ALL Allocate</TableHead><TableHead className="text-center">Default Setup</TableHead></TableRow></TableHeader><TableBody>{divisions.map((d, i) => (<TableRow key={d.id}><TableCell>{i+1}</TableCell><TableCell>{d.division}</TableCell><TableCell className="text-center"><Checkbox checked={d.allAllocate} onCheckedChange={()=>toggleDivisionAll(d.id)} /></TableCell><TableCell className="text-center"><Checkbox checked={d.defaultSetup} /></TableCell></TableRow>))}</TableBody></Table></div>
          <DialogFooter className="gap-2 mt-4"><Button variant="outline">Clear</Button><Button className="bg-green-600">Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Counter Modal */}
      <Dialog open={addCounterModalOpen} onOpenChange={setAddCounterModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Add Counter - {selectedUser?.userName}</DialogTitle></DialogHeader>
          <div><Label className="text-xs">Branch</Label><Input value={selectedUser?.station} readOnly className="h-8 bg-muted" /></div>
          <div className="mt-3 overflow-x-auto"><Table className="text-xs"><TableHeader><TableRow><TableHead>S#</TableHead><TableHead>Counter Name</TableHead><TableHead className="text-center">ALL Allocate</TableHead></TableRow></TableHeader><TableBody>{counters.map((c, i) => (<TableRow key={c.id}><TableCell>{i+1}</TableCell><TableCell>{c.counterName}</TableCell><TableCell className="text-center"><Checkbox checked={c.allAllocate} onCheckedChange={()=>toggleCounterAll(c.id)} /></TableCell></TableRow>))}</TableBody></Table></div>
          <DialogFooter className="gap-2 mt-4"><Button variant="outline">Clear</Button><Button className="bg-green-600">Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Allocate Customer Modal */}
      <Dialog open={allocateCustomerModalOpen} onOpenChange={setAllocateCustomerModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Allocate Customer - {selectedUser?.userName}</DialogTitle></DialogHeader>
          <div className="overflow-x-auto"><Table className="text-xs"><TableHeader><TableRow><TableHead>S#</TableHead><TableHead>Customer Name</TableHead><TableHead className="text-center">Select All</TableHead></TableRow></TableHeader><TableBody>{customers.map((c, i) => (<TableRow key={c.id}><TableCell>{i+1}</TableCell><TableCell>{c.customerName}</TableCell><TableCell className="text-center"><Checkbox checked={c.selectAll} onCheckedChange={()=>toggleCustomerAll(c.id)} /></TableCell></TableRow>))}</TableBody></Table></div>
          <DialogFooter className="gap-2 mt-4"><Button variant="outline">Clear</Button><Button className="bg-green-600">Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Allocate Additional Branch Modal */}
      <Dialog open={allocateBranchModalOpen} onOpenChange={setAllocateBranchModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Allocate Additional Branch - {selectedUser?.userName}</DialogTitle></DialogHeader>
          <div><Label className="text-xs">Branch</Label>
            <div className="border rounded-md p-2 max-h-60 overflow-y-auto">
              {branches.map(b => (
                <div key={b} className="flex items-center gap-2 py-1">
                  <Checkbox checked={selectedBranches.includes(b)} onCheckedChange={() => handleBranchSelect(b)} />
                  <span className="text-xs">{b}</span>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter className="gap-2 mt-4"><Button variant="outline">Clear</Button><Button className="bg-green-600">Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Info Note */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 rounded-md p-3">
        <div className="flex items-start gap-2"><AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" /><div className="text-xs text-blue-700">Fields marked * are mandatory. Use the three‑dot menu or action icons to manage rights, divisions, counters, customers and branches.</div></div>
      </div>
    </div>
  );
}