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
    Save,
    RefreshCw,
    Search,
    Pencil,
    Trash2,
    XCircle,
    AlertCircle,
    Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Types
interface ModuleLock {
    id: number;
    menuType: string;
    menu: string;
    branch: string;
    unlockDays: number;
    lockFromDate: Date;
    lockUptoDate: Date | null;
    excludeUsers: string;
    excludeUsersAllBranches: boolean;
    unlockDaysAllBranches: boolean;
    excludeCOUsers: boolean;
}

// Sample Options
const menuTypeOptions = [
    { value: "MASTER", label: "MASTER" },
    { value: "TRANSACTION", label: "TRANSACTION" },
    { value: "REPORT", label: "REPORT" },
];

// Menu options based on Menu Type (simulated)
const masterMenuOptions = [
    "Consignor Master", "Consignee Master", "Vehicle Master", "Driver Master",
    "Godown Master", "Tariff Master", "Packing Master", "Freight On Master"
];
const transactionMenuOptions = [
    "GR Booking", "Goods Arrival", "Gate Pass Entry", "Local Manifest",
    "Lorry Hire Challan", "POD Entry", "DDR", "Delivery Receipt"
];
const reportMenuOptions = [
    "Daily Sales Report", "Pending POD Report", "GR Register", "Delivery Register",
    "Branch Stock Report", "LHC Report", "Booking Summary"
];

const branchOptions = [
    "CORPORATE OFFICE", "DELHI", "MUMBAI", "BANGALORE", "CHENNAI",
    "KOLKATA", "AHMEDABAD", "PUNE", "HYDERABAD", "JAIPUR"
];

export default function ModuleLock() {
    const [activeTab, setActiveTab] = useState<"entry" | "search">("entry");
    const [editId, setEditId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Entry Form State
    const [menuType, setMenuType] = useState<string>("");
    const [menu, setMenu] = useState<string>("");
    const [branch, setBranch] = useState<string>("");
    const [unlockDays, setUnlockDays] = useState<number>(0);
    const [lockFromDate, setLockFromDate] = useState<Date>(new Date());
    const [lockUptoDate, setLockUptoDate] = useState<Date | null>(null);
    const [excludeUsers, setExcludeUsers] = useState<string>("");
    const [excludeUsersAllBranches, setExcludeUsersAllBranches] = useState<boolean>(false);
    const [unlockDaysAllBranches, setUnlockDaysAllBranches] = useState<boolean>(false);
    const [excludeCOUsers, setExcludeCOUsers] = useState<boolean>(false);

    // Search State
    const [searchMenuName, setSearchMenuName] = useState<string>("");
    const [searchBranch, setSearchBranch] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [searchResults, setSearchResults] = useState<ModuleLock[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage: number = 10;

    // Sample saved data
    const [savedRecords, setSavedRecords] = useState<ModuleLock[]>([
        { id: 1, menuType: "MASTER", menu: "Consignor Master", branch: "DELHI", unlockDays: 5, lockFromDate: new Date("2026-05-01"), lockUptoDate: new Date("2026-05-10"), excludeUsers: "", excludeUsersAllBranches: false, unlockDaysAllBranches: false, excludeCOUsers: false },
        { id: 2, menuType: "TRANSACTION", menu: "GR Booking", branch: "MUMBAI", unlockDays: 3, lockFromDate: new Date("2026-05-02"), lockUptoDate: new Date("2026-05-08"), excludeUsers: "admin,supervisor", excludeUsersAllBranches: true, unlockDaysAllBranches: false, excludeCOUsers: false },
    ]);

    // Get menu list based on selected type
    const getMenuOptions = () => {
        if (menuType === "MASTER") return masterMenuOptions;
        if (menuType === "TRANSACTION") return transactionMenuOptions;
        if (menuType === "REPORT") return reportMenuOptions;
        return [];
    };

    const resetForm = () => {
        setMenuType("");
        setMenu("");
        setBranch("");
        setUnlockDays(0);
        setLockFromDate(new Date());
        setLockUptoDate(null);
        setExcludeUsers("");
        setExcludeUsersAllBranches(false);
        setUnlockDaysAllBranches(false);
        setExcludeCOUsers(false);
        setEditId(null);
    };

    const handleSave = () => {
        if (!menuType) { alert("Please select Menu Type"); return; }
        if (!menu) { alert("Please select Menu"); return; }
        if (!branch) { alert("Please select Branch"); return; }

        setLoading(true);
        setTimeout(() => {
            const newRecord: ModuleLock = {
                id: editId || Date.now(),
                menuType,
                menu,
                branch,
                unlockDays,
                lockFromDate,
                lockUptoDate,
                excludeUsers,
                excludeUsersAllBranches,
                unlockDaysAllBranches,
                excludeCOUsers,
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

    const handleClearDate = () => {
        setLockUptoDate(null);
    };

    const handleSearch = () => {
        let results = [...savedRecords];
        if (searchMenuName) {
            results = results.filter(r => r.menu.toLowerCase().includes(searchMenuName.toLowerCase()));
        }
        if (searchBranch) {
            results = results.filter(r => r.branch === searchBranch);
        }
        if (searchTerm) {
            results = results.filter(r =>
                r.menu.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.branch.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setSearchResults(results);
        setCurrentPage(1);
    };

    const handleEdit = (record: ModuleLock) => {
        setEditId(record.id);
        setMenuType(record.menuType);
        setMenu(record.menu);
        setBranch(record.branch);
        setUnlockDays(record.unlockDays);
        setLockFromDate(record.lockFromDate);
        setLockUptoDate(record.lockUptoDate);
        setExcludeUsers(record.excludeUsers);
        setExcludeUsersAllBranches(record.excludeUsersAllBranches);
        setUnlockDaysAllBranches(record.unlockDaysAllBranches);
        setExcludeCOUsers(record.excludeCOUsers);
        setActiveTab("entry");
    };

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this lock configuration?")) {
            setSavedRecords(savedRecords.filter(record => record.id !== id));
            setSearchResults(searchResults.filter(record => record.id !== id));
            alert("Record deleted successfully!");
        }
    };

    const paginatedResults = searchResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(searchResults.length / itemsPerPage);
    const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

    return (
        <div className="space-y-4 p-3 md:p-4">
            {/* Header */}
            <div className="border-b pb-3">
                <h1 className="text-base md:text-lg font-bold">MODULE LOCK</h1>
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
                <button onClick={() => { setActiveTab("search"); handleSearch(); }} className={cn("px-4 py-2 text-sm font-medium transition-all", activeTab === "search" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground")}>Search</button>
            </div>

            {/* Entry Tab */}
            {activeTab === "entry" && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="space-y-1">
                            <Label className="text-xs">Menu Type</Label>
                            <Select value={menuType} onValueChange={setMenuType}>
                                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                                <SelectContent>
                                    {menuTypeOptions.map(opt => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Menu <span className="text-red-500">*</span></Label>
                            <Select value={menu} onValueChange={setMenu} disabled={!menuType}>
                                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder={menuType ? "SELECT MENU" : "SELECT MENU TYPE FIRST"} /></SelectTrigger>
                                <SelectContent>
                                    {getMenuOptions().map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Branch <span className="text-red-500">*</span></Label>
                            <Select value={branch} onValueChange={setBranch}>
                                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                                <SelectContent>
                                    {branchOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Unlock Days</Label>
                            <Input type="number" value={unlockDays} onChange={(e) => setUnlockDays(Number(e.target.value))} className="h-8 text-xs" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <Label className="text-xs">Lock From Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="h-8 w-full text-xs">
                                        <CalendarIcon className="mr-1 h-3 w-3" />
                                        {format(lockFromDate, "dd-MM-yyyy")}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={lockFromDate} onSelect={(d) => d && setLockFromDate(d)} />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between items-center">
                                <Label className="text-xs">Lock Upto Date</Label>
                                <Button variant="ghost" size="sm" onClick={handleClearDate} className="h-6 text-xs text-red-500"><XCircle className="h-3 w-3 mr-1" /> CLEAR DATE</Button>
                            </div>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="h-8 w-full text-xs">
                                        <CalendarIcon className="mr-1 h-3 w-3" />
                                        {lockUptoDate ? format(lockUptoDate, "dd-MM-yyyy") : "Select date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={lockUptoDate || undefined}
                                        onSelect={(date) => setLockUptoDate(date || null)}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label className="text-xs">Exclude Users</Label>
                        <Input value={excludeUsers} onChange={(e) => setExcludeUsers(e.target.value)} placeholder="Enter usernames (comma separated)" className="h-8 text-xs" />
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2"><input type="checkbox" checked={excludeUsersAllBranches} onChange={(e) => setExcludeUsersAllBranches(e.target.checked)} className="h-3.5 w-3.5" id="excludeAll" /><Label htmlFor="excludeAll" className="text-xs cursor-pointer">Exclude users update at all branches</Label></div>
                        <div className="flex items-center gap-2"><input type="checkbox" checked={unlockDaysAllBranches} onChange={(e) => setUnlockDaysAllBranches(e.target.checked)} className="h-3.5 w-3.5" id="unlockAll" /><Label htmlFor="unlockAll" className="text-xs cursor-pointer">Unlock days update at all branches</Label></div>
                        <div className="flex items-center gap-2"><input type="checkbox" checked={excludeCOUsers} onChange={(e) => setExcludeCOUsers(e.target.checked)} className="h-3.5 w-3.5" id="excludeCO" /><Label htmlFor="excludeCO" className="text-xs cursor-pointer">Exclude CO Users</Label></div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button onClick={handleSave} size="sm" className="h-8 text-xs bg-green-600" disabled={loading}><Save className="mr-1 h-3 w-3" />{editId ? "UPDATE" : "SAVE"}</Button>
                        <Button onClick={resetForm} variant="outline" size="sm" className="h-8 text-xs"><RefreshCw className="mr-1 h-3 w-3" />CLEAR</Button>
                    </div>
                </div>
            )}

            {/* Search Tab */}
            {activeTab === "search" && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 border rounded-md bg-muted/20">
                        <div className="space-y-1"><Label className="text-xs">Menu Name</Label><Input value={searchMenuName} onChange={(e) => setSearchMenuName(e.target.value)} placeholder="Enter Menu Name" className="h-8 text-xs" /></div>
                        <div className="space-y-1"><Label className="text-xs">Branch</Label><Select value={searchBranch} onValueChange={setSearchBranch}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="ALL" /></SelectTrigger><SelectContent><SelectItem value="">ALL</SelectItem>{branchOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
                        <div className="flex items-end"><Button onClick={handleSearch} size="sm" className="h-8 text-xs"><Eye className="mr-1 h-3.5 w-3.5" />SHOW</Button></div>
                    </div>

                    <div className="flex gap-2">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" />
                            <Input placeholder="Search by Menu or Branch..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 h-8 text-xs" />
                        </div>
                        <Button onClick={handleSearch} size="sm" className="h-8 text-xs"><Search className="mr-1 h-3.5 w-3.5" />SEARCH</Button>
                    </div>

                    <div className="rounded-md border overflow-x-auto">
                        <div className="min-w-[600px]">
                            <Table className="text-xs">
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="w-12 text-center">S#</TableHead>
                                        <TableHead>Menu</TableHead>
                                        <TableHead>Branch</TableHead>
                                        <TableHead>Lock Date</TableHead>
                                        <TableHead>Unlock Days</TableHead>
                                        <TableHead className="w-24 text-center">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedResults.length === 0 ? (
                                        <TableRow><TableCell colSpan={6} className="text-center py-8">No records found</TableCell></TableRow>
                                    ) : (
                                        paginatedResults.map((record, idx) => (
                                            <TableRow key={record.id} className="hover:bg-muted/30">
                                                <TableCell className="text-center">{(currentPage - 1) * itemsPerPage + idx + 1}</TableCell>
                                                <TableCell className="font-medium">{record.menu}</TableCell>
                                                <TableCell>{record.branch}</TableCell>
                                                <TableCell>{format(record.lockFromDate, "dd-MM-yyyy")} {record.lockUptoDate ? `to ${format(record.lockUptoDate, "dd-MM-yyyy")}` : ""}</TableCell>
                                                <TableCell>{record.unlockDays}</TableCell>
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
            <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 rounded-md p-3">
                <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div className="text-xs text-yellow-700 dark:text-yellow-400">
                        <p className="font-medium">Note:</p>
                        <ul className="list-disc list-inside mt-1 space-y-0.5">
                            <li>Lock From Date and Lock Upto Date define the period during which the module is locked.</li>
                            <li>Unlock Days: Number of days after which the lock automatically expires.</li>
                            <li>Exclude Users: Comma-separated list of usernames who bypass the lock.</li>
                            <li>Checkboxes allow applying settings across all branches or excluding corporate office users.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}