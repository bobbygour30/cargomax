"use client";

import React, { useState } from "react";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  CalendarIcon,
  Search,
  RefreshCw,
  UserCheck,
  UserX,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Shield,
  Users,
  Lock,
  Unlock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Types
interface User {
  id: number;
  username: string;
  displayName: string;
  mobileNo: string;
  password: string;
  allowLogin: boolean;
  email?: string;
  role?: string;
  branch?: string;
  lastLogin?: Date;
  createdDate?: Date;
}

// Options
const branchOptions = [
  "CORPORATE OFFICE",
  "DELHI",
  "MUMBAI",
  "BANGALORE",
  "CHENNAI",
  "KOLKATA",
  "AHMEDABAD",
  "PUNE",
  "HYDERABAD",
  "JAIPUR",
  "LUCKNOW",
];

const roleOptions = [
  "Admin",
  "Super Admin",
  "Manager",
  "Supervisor",
  "Operator",
  "Viewer",
  "Accountant",
];

export default function ActivateDeactivateUser() {
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showPassword, setShowPassword] = useState<Record<number, boolean>>({});
  const itemsPerPage: number = 10;

  // Form State for Add/Edit
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [username, setUsername] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [mobileNo, setMobileNo] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [branch, setBranch] = useState<string>("");
  const [allowLogin, setAllowLogin] = useState<boolean>(true);

  // Sample Data
  const [savedRecords, setSavedRecords] = useState<User[]>([
    { id: 1, username: "VIJAY@GRLNEW", displayName: "VIJAY", mobileNo: "", password: "12345678", allowLogin: false, email: "vijay@grl.com", role: "Operator", branch: "DELHI" },
    { id: 2, username: "GANDHINAGARAJAY@GRLNEW", displayName: "GANDHINAGARAJAY", mobileNo: "", password: "7834888503", allowLogin: false, email: "ajay@grl.com", role: "Supervisor", branch: "MUMBAI" },
    { id: 3, username: "HIMANSHU@GRLNEW", displayName: "HIMANSHU", mobileNo: "", password: "HIMANSHU", allowLogin: false, email: "himanshu@grl.com", role: "Operator", branch: "BANGALORE" },
    { id: 4, username: "RAJESH@GRLNEW", displayName: "RAJESH KUMAR", mobileNo: "9876543210", password: "rajesh123", allowLogin: true, email: "rajesh@grl.com", role: "Manager", branch: "DELHI" },
    { id: 5, username: "SURESH@GRLNEW", displayName: "SURESH SINGH", mobileNo: "9876543211", password: "suresh123", allowLogin: true, email: "suresh@grl.com", role: "Admin", branch: "MUMBAI" },
    { id: 6, username: "MAHESH@GRLNEW", displayName: "MAHESH SHARMA", mobileNo: "9876543212", password: "mahesh123", allowLogin: false, email: "mahesh@grl.com", role: "Operator", branch: "BANGALORE" },
  ]);

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      let results = [...savedRecords];
      if (searchTerm) {
        results = results.filter(r => 
          r.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.mobileNo.includes(searchTerm)
        );
      }
      setSearchResults(results);
      setCurrentPage(1);
      setLoading(false);
    }, 300);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setCurrentPage(1);
  };

  const handleActivateUser = (id: number) => {
    if (confirm("Are you sure you want to activate this user?")) {
      setSavedRecords(savedRecords.map(user => 
        user.id === id ? { ...user, allowLogin: true } : user
      ));
      setSearchResults(searchResults.map(user => 
        user.id === id ? { ...user, allowLogin: true } : user
      ));
      alert("User activated successfully!");
    }
  };

  const handleDeactivateUser = (id: number) => {
    if (confirm("Are you sure you want to deactivate this user?")) {
      setSavedRecords(savedRecords.map(user => 
        user.id === id ? { ...user, allowLogin: false } : user
      ));
      setSearchResults(searchResults.map(user => 
        user.id === id ? { ...user, allowLogin: false } : user
      ));
      alert("User deactivated successfully!");
    }
  };

  const handleTogglePasswordVisibility = (userId: number) => {
    setShowPassword(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  const handleAddUser = () => {
    setEditUserId(null);
    setUsername("");
    setDisplayName("");
    setMobileNo("");
    setPassword("");
    setEmail("");
    setRole("");
    setBranch("");
    setAllowLogin(true);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditUserId(user.id);
    setUsername(user.username);
    setDisplayName(user.displayName);
    setMobileNo(user.mobileNo || "");
    setPassword(user.password);
    setEmail(user.email || "");
    setRole(user.role || "");
    setBranch(user.branch || "");
    setAllowLogin(user.allowLogin);
    setIsModalOpen(true);
  };

  const handleSaveUser = () => {
    if (!username) { alert("Please enter Username"); return; }
    if (!displayName) { alert("Please enter Display Name"); return; }
    if (!password) { alert("Please enter Password"); return; }

    if (editUserId) {
      setSavedRecords(savedRecords.map(user => 
        user.id === editUserId 
          ? { ...user, username, displayName, mobileNo, password, email, role, branch, allowLogin }
          : user
      ));
      alert("User updated successfully!");
    } else {
      const newUser: User = {
        id: Date.now(),
        username,
        displayName,
        mobileNo,
        password,
        email,
        role,
        branch,
        allowLogin,
      };
      setSavedRecords([...savedRecords, newUser]);
      alert("User added successfully!");
    }
    setIsModalOpen(false);
    handleSearch();
  };

  const paginatedResults = searchResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">ACTIVATE DEACTIVATE USER</h1>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[10px] md:text-xs text-muted-foreground">
          <span>Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
          <span>Login By : MAYANK.GRLOGISTICS@GMAIL.COM</span>
          <span>Login Branch : CORPORATE OFFICE</span>
          <span>Financial Year : 2026-2027</span>
        </div>
      </div>

      {/* Search Section */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by Username, Display Name or Mobile No..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
        <Button onClick={handleSearch} size="sm" className="h-8 text-xs">
          <Search className="mr-1 h-3.5 w-3.5" />
          SHOW
        </Button>
        <Button onClick={handleClearSearch} variant="outline" size="sm" className="h-8 text-xs">
          <RefreshCw className="mr-1 h-3.5 w-3.5" />
          CLEAR
        </Button>
        <Button onClick={handleAddUser} size="sm" className="h-8 text-xs bg-green-600 hover:bg-green-700">
          <UserCheck className="mr-1 h-3.5 w-3.5" />
          ADD USER
        </Button>
      </div>

      {/* Results Table */}
      <div className="rounded-md border overflow-x-auto">
        <div className="min-w-[800px]">
          <Table className="text-xs">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Username</TableHead>
                <TableHead>Display Name</TableHead>
                <TableHead>Mobile No</TableHead>
                <TableHead>Password</TableHead>
                <TableHead className="text-center">Allow Login</TableHead>
                <TableHead className="text-center w-32">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedResults.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No users found. Click ADD USER to create a new user.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedResults.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono font-medium">{user.username}</TableCell>
                    <TableCell>{user.displayName}</TableCell>
                    <TableCell>{user.mobileNo || "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="font-mono">
                          {showPassword[user.id] ? user.password : "•".repeat(Math.min(user.password.length, 8))}
                        </span>
                        <button
                          onClick={() => handleTogglePasswordVisibility(user.id)}
                          className="p-1 hover:bg-muted rounded"
                        >
                          {showPassword[user.id] ? 
                            <EyeOff className="h-3.5 w-3.5 text-muted-foreground" /> : 
                            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                          }
                        </button>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {user.allowLogin ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                          <CheckCircle className="h-3 w-3" /> Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                          <XCircle className="h-3 w-3" /> No
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        {!user.allowLogin ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleActivateUser(user.id)}
                            className="h-7 px-2 text-xs bg-green-100 text-green-700 hover:bg-green-200"
                            title="Activate User"
                          >
                            <Unlock className="h-3.5 w-3.5 mr-1" />
                            Activate
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeactivateUser(user.id)}
                            className="h-7 px-2 text-xs bg-red-100 text-red-700 hover:bg-red-200"
                            title="Deactivate User"
                          >
                            <Lock className="h-3.5 w-3.5 mr-1" />
                            Deactivate
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                          className="h-7 w-7 p-0 text-blue-500"
                          title="Edit User"
                        >
                          <UserCheck className="h-3.5 w-3.5" />
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
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="text-xs text-muted-foreground">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, searchResults.length)} of {searchResults.length} entries
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-7 text-xs"
            >
              Previous
            </Button>
            <span className="px-3 py-1 text-xs bg-muted rounded-md">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-7 text-xs"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Add/Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-950 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-950 border-b p-4">
              <h2 className="text-lg font-semibold">
                {editUserId ? "Edit User" : "Add New User"}
              </h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-1">
                <Label className="text-xs">Username <span className="text-red-500">*</span></Label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Display Name <span className="text-red-500">*</span></Label>
                <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Mobile No</Label>
                <Input value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Password <span className="text-red-500">*</span></Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select Role" /></SelectTrigger>
                  <SelectContent>{roleOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Branch</Label>
                <Select value={branch} onValueChange={setBranch}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select Branch" /></SelectTrigger>
                  <SelectContent>{branchOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={allowLogin} onChange={(e) => setAllowLogin(e.target.checked)} className="h-3.5 w-3.5" id="allowLogin" />
                <Label htmlFor="allowLogin" className="text-xs cursor-pointer">Allow Login</Label>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white dark:bg-gray-950 border-t p-4 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)} className="h-8 text-xs">CANCEL</Button>
              <Button onClick={handleSaveUser} size="sm" className="h-8 text-xs bg-blue-600">SAVE</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}