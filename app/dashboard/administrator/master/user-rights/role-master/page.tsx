"use client";

import React, { useState } from "react";
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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Save,
  RefreshCw,
  Trash2,
  Search,
  Pencil,
  Settings,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
interface Role {
  id: number;
  role: string;
  expired: boolean;
}

// ------------------------------------------------------------------
// Mock data
// ------------------------------------------------------------------
const initialRoles: Role[] = [
  { id: 1, role: "WAREHOUSE", expired: false },
  { id: 2, role: "BOOKING", expired: false },
  { id: 3, role: "BOOKING AND LONG ROU", expired: false },
  { id: 4, role: "HEAD OFFICE", expired: false },
  { id: 5, role: "DELIVERY", expired: false },
];

export default function RoleMaster() {
  const [activeTab, setActiveTab] = useState<"entry" | "search">("entry");
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Form state
  const [roleName, setRoleName] = useState("");
  const [expired, setExpired] = useState(false);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  // Helper functions
  const resetForm = () => {
    setRoleName("");
    setExpired(false);
    setEditId(null);
  };

  const handleSave = () => {
    if (!roleName.trim()) {
      alert("Role name is required.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      if (editId) {
        // Update existing role
        setRoles(
          roles.map((r) =>
            r.id === editId ? { ...r, role: roleName, expired } : r
          )
        );
        alert("Role updated successfully.");
      } else {
        // Create new role
        const newId = Math.max(...roles.map((r) => r.id), 0) + 1;
        const newRole: Role = {
          id: newId,
          role: roleName,
          expired,
        };
        setRoles([...roles, newRole]);
        alert("Role saved successfully.");
      }
      resetForm();
      setActiveTab("search");
      setLoading(false);
    }, 300);
  };

  const handleEdit = (role: Role) => {
    setEditId(role.id);
    setRoleName(role.role);
    setExpired(role.expired);
    setActiveTab("entry");
  };

  const handleDeleteClick = (role: Role) => {
    setRoleToDelete(role);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (roleToDelete) {
      setRoles(roles.filter((r) => r.id !== roleToDelete.id));
      alert(`Role "${roleToDelete.role}" deleted.`);
      if (editId === roleToDelete.id) resetForm();
      setDeleteDialogOpen(false);
      setRoleToDelete(null);
    }
  };

  const handleAssignRights = (role: Role) => {
    // In a real application, you would navigate to a rights assignment page
    alert(`Assign rights for role: ${role.role}`);
  };

  // Search and pagination
  const filteredRoles = roles.filter((r) =>
    r.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const paginatedRoles = filteredRoles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const goToPage = (page: number) =>
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">ROLE MASTER</h1>
        <div className="mt-1 text-[10px] md:text-xs text-muted-foreground">
          Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD | Login By :
          MAYANK.GRLOGISTICS@GMAIL.COM
          <br />
          Login Branch : CORPORATE OFFICE | Financial Year : 2026-2027
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => {
            setActiveTab("entry");
            resetForm();
          }}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-all",
            activeTab === "entry"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Entry
        </button>
        <button
          onClick={() => {
            setActiveTab("search");
            setCurrentPage(1);
          }}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-all",
            activeTab === "search"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Search
        </button>
      </div>

      {/* Entry Tab */}
      {activeTab === "entry" && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Role Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xs">
                Role <span className="text-red-500">*</span>
              </Label>
              <Input
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="Enter role name"
                className="h-8 text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={expired}
                onCheckedChange={(checked) => setExpired(!!checked)}
                id="expired"
              />
              <Label htmlFor="expired" className="text-xs cursor-pointer">
                Expired
              </Label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                onClick={handleSave}
                size="sm"
                className="h-8 text-xs bg-green-600"
                disabled={loading}
              >
                <Save className="mr-1 h-3 w-3" />
                {editId ? "UPDATE" : "SAVE"}
              </Button>
              <Button
                onClick={resetForm}
                variant="outline"
                size="sm"
                className="h-8 text-xs"
              >
                <RefreshCw className="mr-1 h-3 w-3" />
                CLEAR
              </Button>
              <Button
                onClick={() => {
                  if (editId) {
                    const role = roles.find((r) => r.id === editId);
                    if (role) handleDeleteClick(role);
                  } else {
                    alert("No role selected to delete.");
                  }
                }}
                variant="destructive"
                size="sm"
                className="h-8 text-xs"
                disabled={!editId}
              >
                <Trash2 className="mr-1 h-3 w-3" />
                DELETE
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Tab */}
      {activeTab === "search" && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search by role name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-8 h-8 text-xs"
              />
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[600px]">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12 text-center">S#</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-center">Expired</TableHead>
                    <TableHead className="w-32 text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRoles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        No roles found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedRoles.map((role, idx) => (
                      <TableRow key={role.id} className="hover:bg-muted/30">
                        <TableCell className="text-center">
                          {(currentPage - 1) * itemsPerPage + idx + 1}
                        </TableCell>
                        <TableCell className="font-medium">{role.role}</TableCell>
                        <TableCell className="text-center">
                          {role.expired ? (
                            <span className="text-red-600 text-xs">Yes</span>
                          ) : (
                            <span className="text-green-600 text-xs">No</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(role)}
                              className="h-6 w-6 p-0 text-blue-500"
                              title="Edit"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAssignRights(role)}
                              className="h-6 w-6 p-0 text-purple-500"
                              title="Assign Rights"
                            >
                              <Settings className="h-3.5 w-3.5" />
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
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
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Role</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the role{" "}
              <strong>{roleToDelete?.role}</strong>?
              <br />
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmDelete} className="bg-red-600">
              Yes, Delete
            </Button>
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
              <li>Role name is mandatory.</li>
              <li>Expired checkbox flags roles that are no longer active.</li>
              <li>Click Edit to modify a role, Assign Rights to set permissions.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}