"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Search,
  Edit,
  Trash2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
interface MenuRight {
  id: number;
  application: string;
  module: string;
  subModule: string;
  menuName: string;
  allowAdd: boolean;
  allowUpdate: boolean;
  allowCancel: boolean;
  allowDelete: boolean;
  allowView: boolean;
  allowEditDays: number;
}

interface UserRightAssignment {
  id: number;
  rightsOn: string;        // "User"
  rightTo: string;         // Username
  application: string;
  module: string;
  subModule: string;
  menuName: string;
  allowAdd: boolean;
  allowUpdate: boolean;
  allowCancel: boolean;
  allowDelete: boolean;
  allowView: boolean;
  allowEditDays: number;
}

// ------------------------------------------------------------------
// Mock data for dropdowns
// ------------------------------------------------------------------
const users = [
  "ABHAY@GRLNEW",
  "AGRA@GRLNEW",
  "AHMEDABADCITY@GRLNEW",
  "AHMEDABADHUB@GRLNEW",
  "AKBERPUR/AMBEDKARNAGAR@GRLNEW",
  "AKIBKHAN@GRLNEW",
  "ALIGARHRAVI@GRLNEW",
  "ALIGHARMUKESH@GRLNEW",
  "ALIPURDUAR@GRLNEW",
  "ALLAHABAD@GRLNEW",
];
const applicationTypes = ["Web", "App"];
const modules = [
  "ACCOUNTS",
  "ADMINISTRATION",
  "APP REPORTS",
  "CUSTOMER RELATIONSHIP",
  "DASHBOARD",
  "FLEET",
  "HUMAN RESOURCES",
  "INVENTORY",
  "OPERATIONS",
  "PRODUCTION & PLANNING",
  "SALES & MARKETING",
];
const menuTypes = ["MASTER", "TRANSACTION", "REPORT", "FORM", "DASHBOARD", "Tools & Utilities"];
const assignedUnassignedOptions = [
  { value: "2", label: "ALL" },
  { value: "1", label: "ASSIGNED" },
  { value: "0", label: "UNASSIGNED" },
];

// ------------------------------------------------------------------
// Mock menu data for the permissions table (entry tab)
// ------------------------------------------------------------------
const mockMenuRights: MenuRight[] = [
  { id: 1, application: "Web", module: "OPERATIONS", subModule: "Masters", menuName: "Agency Commission Master", allowAdd: false, allowUpdate: false, allowCancel: false, allowDelete: false, allowView: false, allowEditDays: 0 },
  { id: 2, application: "Web", module: "OPERATIONS", subModule: "Masters", menuName: "Commission Category Master", allowAdd: false, allowUpdate: false, allowCancel: false, allowDelete: false, allowView: false, allowEditDays: 0 },
  { id: 3, application: "Web", module: "OPERATIONS", subModule: "Transactions", menuName: "Booking Computerize GRL", allowAdd: false, allowUpdate: false, allowCancel: false, allowDelete: false, allowView: false, allowEditDays: 0 },
  { id: 4, application: "App", module: "ACCOUNTS", subModule: "Reports", menuName: "Day Book Report", allowAdd: false, allowUpdate: false, allowCancel: false, allowDelete: false, allowView: false, allowEditDays: 0 },
];

// Mock existing assignments for search tab
const mockAssignments: UserRightAssignment[] = [
  { id: 1, rightsOn: "User", rightTo: "ABHAY@GRLNEW", application: "Web", module: "Misleneous", subModule: "", menuName: "Misleneous", allowAdd: false, allowUpdate: false, allowCancel: false, allowDelete: false, allowView: false, allowEditDays: 0 },
  { id: 2, rightsOn: "User", rightTo: "AGRA@GRLNEW", application: "Web", module: "Misleneous", subModule: "", menuName: "Misleneous", allowAdd: false, allowUpdate: false, allowCancel: false, allowDelete: false, allowView: false, allowEditDays: 0 },
  { id: 3, rightsOn: "User", rightTo: "AHMEDABADCITY@GRLNEW", application: "Web", module: "Misleneous", subModule: "", menuName: "Misleneous", allowAdd: false, allowUpdate: false, allowCancel: false, allowDelete: false, allowView: false, allowEditDays: 0 },
  { id: 4, rightsOn: "User", rightTo: "AHMEDABADHUB@GRLNEW", application: "Web", module: "Misleneous", subModule: "", menuName: "Misleneous", allowAdd: false, allowUpdate: false, allowCancel: false, allowDelete: false, allowView: false, allowEditDays: 0 },
  { id: 5, rightsOn: "User", rightTo: "AKBERPUR/AMBEDKARNAGAR@GRLNEW", application: "Web", module: "Misleneous", subModule: "", menuName: "Misleneous", allowAdd: false, allowUpdate: false, allowCancel: false, allowDelete: false, allowView: false, allowEditDays: 0 },
];

export default function RightAssignment() {
  const [activeTab, setActiveTab] = useState<"entry" | "search">("entry");

  // Entry tab filter state
  const [assignRightsOn] = useState("USER");
  const [userName, setUserName] = useState("");
  const [applicationType, setApplicationType] = useState<string>("");
  const [assignedUnassigned, setAssignedUnassigned] = useState("2");
  const [module, setModule] = useState<string>("");
  const [menuType, setMenuType] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [menuRights, setMenuRights] = useState<MenuRight[]>(mockMenuRights);
  const [filteredRights, setFilteredRights] = useState<MenuRight[]>(mockMenuRights);

  // Search tab state
  const [assignments, setAssignments] = useState<UserRightAssignment[]>(mockAssignments);
  const [searchAssignments, setSearchAssignments] = useState<UserRightAssignment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Revoke All modal
  const [revokeModalOpen, setRevokeModalOpen] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<UserRightAssignment | null>(null);

  // Apply filter on entry tab
  const handleApplyFilter = () => {
    let filtered = [...menuRights];
    if (applicationType) {
      filtered = filtered.filter(r => r.application === applicationType);
    }
    if (module) {
      filtered = filtered.filter(r => r.module === module);
    }
    if (menuType) {
      filtered = filtered.filter(r => r.menuName.includes(menuType));
    }
    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.menuName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.subModule.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredRights(filtered);
  };

  // Toggle a single permission on a menu item
  const togglePermission = (id: number, field: keyof MenuRight, value: boolean) => {
    setMenuRights(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
    setFilteredRights(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const updateEditDays = (id: number, days: number) => {
    setMenuRights(prev => prev.map(r => r.id === id ? { ...r, allowEditDays: days } : r));
    setFilteredRights(prev => prev.map(r => r.id === id ? { ...r, allowEditDays: days } : r));
  };

  // Save the entire assignment for the selected user
  const handleSaveAssignment = () => {
    if (!userName) {
      alert("Please select a user.");
      return;
    }
    alert(`Rights for ${userName} saved successfully!`);
  };

  // Search tab actions
  const handleSearch = () => {
    const filtered = assignments.filter(a =>
      a.rightTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.module.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchAssignments(filtered);
    setCurrentPage(1);
  };

  const handleEditAssignment = (assignment: UserRightAssignment) => {
    setUserName(assignment.rightTo);
    setApplicationType(assignment.application);
    setModule(assignment.module);
    setActiveTab("entry");
  };

  const handleRevokeAll = (assignment: UserRightAssignment) => {
    setRevokeTarget(assignment);
    setRevokeModalOpen(true);
  };

  const confirmRevokeAll = () => {
    if (revokeTarget) {
      setAssignments(prev => prev.filter(a => a.id !== revokeTarget.id));
      setSearchAssignments(prev => prev.filter(a => a.id !== revokeTarget.id));
      alert(`All rights revoked for ${revokeTarget.rightTo}`);
    }
    setRevokeModalOpen(false);
    setRevokeTarget(null);
  };

  // Pagination for search results
  const displayedAssignments = searchAssignments.length ? searchAssignments : assignments;
  const totalPages = Math.ceil(displayedAssignments.length / itemsPerPage);
  const paginatedAssignments = displayedAssignments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">RIGHT ASSIGNMENT</h1>
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
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Assign Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
                <div className="space-y-1">
                  <Label className="text-xs">Assign Rights On</Label>
                  <Input value={assignRightsOn} readOnly className="h-8 text-xs bg-muted" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">User Name</Label>
                  <Select value={userName} onValueChange={setUserName}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Select User" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map(u => (<SelectItem key={u} value={u}>{u}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Application Type</Label>
                  <Select value={applicationType} onValueChange={setApplicationType}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {applicationTypes.map(at => (<SelectItem key={at} value={at}>{at}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Assigned/Unassigned</Label>
                  <Select value={assignedUnassigned} onValueChange={setAssignedUnassigned}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {assignedUnassignedOptions.map(opt => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Module</Label>
                  <Select value={module} onValueChange={setModule}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {modules.map(m => (<SelectItem key={m} value={m}>{m}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Menu Type</Label>
                  <Select value={menuType} onValueChange={setMenuType}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {menuTypes.map(mt => (<SelectItem key={mt} value={mt}>{mt}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 items-end">
                  <Button onClick={handleApplyFilter} size="sm" className="h-8 text-xs">
                    Apply Filter
                  </Button>
                </div>
              </div>

              {/* Search input inside entry tab */}
              <div className="flex gap-2">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 h-8 text-xs"
                  />
                </div>
                <Button onClick={handleApplyFilter} size="sm" className="h-8 text-xs">
                  <Search className="mr-1 h-3.5 w-3.5" />
                  SEARCH
                </Button>
              </div>

              {/* Permissions table */}
              <div className="rounded-md border overflow-x-auto">
                <div className="min-w-[1000px]">
                  <Table className="text-xs">
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-12 text-center">S#</TableHead>
                        <TableHead>Application</TableHead>
                        <TableHead>Module</TableHead>
                        <TableHead>Sub Module</TableHead>
                        <TableHead>Menu Name</TableHead>
                        <TableHead className="text-center">Allow Add</TableHead>
                        <TableHead className="text-center">Allow Update</TableHead>
                        <TableHead className="text-center">Allow Cancel</TableHead>
                        <TableHead className="text-center">Allow Delete</TableHead>
                        <TableHead className="text-center">Allow View</TableHead>
                        <TableHead className="text-center">Allow Edit Days</TableHead>
                        <TableHead className="w-20 text-center">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRights.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={12} className="text-center py-8">
                            No menu items found. Apply filter to see rights.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredRights.map((item, idx) => (
                          <TableRow key={item.id}>
                            <TableCell className="text-center">{idx + 1}</TableCell>
                            <TableCell>{item.application}</TableCell>
                            <TableCell>{item.module}</TableCell>
                            <TableCell>{item.subModule}</TableCell>
                            <TableCell className="font-medium">{item.menuName}</TableCell>
                            <TableCell className="text-center">
                              <Checkbox
                                checked={item.allowAdd}
                                onCheckedChange={(c) => togglePermission(item.id, "allowAdd", !!c)}
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Checkbox
                                checked={item.allowUpdate}
                                onCheckedChange={(c) => togglePermission(item.id, "allowUpdate", !!c)}
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Checkbox
                                checked={item.allowCancel}
                                onCheckedChange={(c) => togglePermission(item.id, "allowCancel", !!c)}
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Checkbox
                                checked={item.allowDelete}
                                onCheckedChange={(c) => togglePermission(item.id, "allowDelete", !!c)}
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Checkbox
                                checked={item.allowView}
                                onCheckedChange={(c) => togglePermission(item.id, "allowView", !!c)}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={item.allowEditDays}
                                onChange={(e) => updateEditDays(item.id, Number(e.target.value))}
                                className="h-7 w-20 text-center"
                                min="0"
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-blue-500" disabled>
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Save button for the whole assignment */}
              <div className="flex justify-end pt-2">
                <Button onClick={handleSaveAssignment} size="sm" className="h-8 text-xs bg-green-600">
                  Save Assignment
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* -------------------- SEARCH TAB -------------------- */}
        <TabsContent value="search" className="space-y-4 mt-4">
          <div className="flex flex-wrap gap-2 items-end">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" />
              <Input
                placeholder="Search by User Name or Module..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-xs"
              />
            </div>
            <Button onClick={handleSearch} size="sm" className="h-8 text-xs">
              <Search className="mr-1 h-3.5 w-3.5" />
              SEARCH
            </Button>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[800px]">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12 text-center">S#</TableHead>
                    <TableHead>Rights On</TableHead>
                    <TableHead>Right To</TableHead>
                    <TableHead>Applications</TableHead>
                    <TableHead>Modules</TableHead>
                    <TableHead className="text-center">Add</TableHead>
                    <TableHead className="text-center">Update</TableHead>
                    <TableHead className="text-center">Cancel</TableHead>
                    <TableHead className="text-center">Delete</TableHead>
                    <TableHead className="text-center">View</TableHead>
                    <TableHead className="w-24 text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAssignments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center py-8">
                        No assignments found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedAssignments.map((ass, idx) => (
                      <TableRow key={ass.id}>
                        <TableCell className="text-center">{(currentPage - 1) * itemsPerPage + idx + 1}</TableCell>
                        <TableCell>{ass.rightsOn}</TableCell>
                        <TableCell className="font-medium">{ass.rightTo}</TableCell>
                        <TableCell>{ass.application}</TableCell>
                        <TableCell>{ass.module}</TableCell>
                        <TableCell className="text-center">{ass.allowAdd ? "✓" : "—"}</TableCell>
                        <TableCell className="text-center">{ass.allowUpdate ? "✓" : "—"}</TableCell>
                        <TableCell className="text-center">{ass.allowCancel ? "✓" : "—"}</TableCell>
                        <TableCell className="text-center">{ass.allowDelete ? "✓" : "—"}</TableCell>
                        <TableCell className="text-center">{ass.allowView ? "✓" : "—"}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditAssignment(ass)}
                              className="h-6 w-6 p-0 text-blue-500"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRevokeAll(ass)}
                              className="h-6 w-6 p-0 text-red-500"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
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

          {totalPages > 1 && (
            <div className="flex justify-center gap-1">
              <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                Previous
              </Button>
              <span className="px-3 py-1 text-xs bg-muted rounded-md">Page {currentPage} of {totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                Next
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Revoke All Confirmation Modal */}
      <Dialog open={revokeModalOpen} onOpenChange={setRevokeModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Revoke All Rights</DialogTitle>
            <DialogDescription>
              Are you sure you want to revoke all rights for <strong>{revokeTarget?.rightTo}</strong>?
              <br />
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setRevokeModalOpen(false)}>No</Button>
            <Button onClick={confirmRevokeAll} className="bg-red-600">Yes, Revoke All</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Info Note */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 rounded-md p-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
          <div className="text-xs text-blue-700 dark:text-blue-400">
            <p className="font-medium">Note:</p>
            <ul className="list-disc list-inside mt-1 space-y-0.5">
              <li>Select a user, apply filters, and check/uncheck permissions.</li>
              <li>Click "Save Assignment" to store the rights for the selected user.</li>
              <li>In the Search tab, you can edit an existing assignment or revoke all rights.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}