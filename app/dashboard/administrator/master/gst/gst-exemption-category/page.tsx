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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Search,
  Plus,
  Trash2,
  Save,
  RefreshCw,
  Pencil,
  X,
  AlertCircle,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface ExemptionCategory {
  id: number;
  description: string;
  aliasName: string;
  active: boolean;
}

export default function GSTExemptionCategoryMaster() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<ExemptionCategory[]>([
    { id: 1, description: "NEW", aliasName: "TESTING", active: true },
    { id: 2, description: "NEW TEST", aliasName: "TEST", active: true },
    { id: 3, description: "TEST REASON", aliasName: "", active: true },
    { id: 4, description: "", aliasName: "", active: true },
  ]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Partial<ExemptionCategory>>({});
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter categories based on search term
  const filteredCategories = categories.filter(
    (cat) =>
      cat.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.aliasName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const goToPage = (page: number) =>
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  // Start editing a row
  const handleEdit = (category: ExemptionCategory) => {
    setEditingId(category.id);
    setEditValues({
      description: category.description,
      aliasName: category.aliasName,
      active: category.active,
    });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  // Update edited fields
  const updateEditValue = (field: keyof ExemptionCategory, value: any) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };

  // Save a single row after editing
  const handleSaveRow = (id: number) => {
    const updatedCategories = categories.map((cat) =>
      cat.id === id
        ? {
            ...cat,
            description: editValues.description ?? cat.description,
            aliasName: editValues.aliasName ?? cat.aliasName,
            active: editValues.active ?? cat.active,
          }
        : cat
    );
    setCategories(updatedCategories);
    setEditingId(null);
    setEditValues({});
    // Simulate API success
    alert("Row updated successfully!");
  };

  // Delete a row
  const handleDeleteRow = (id: number) => {
    if (confirm("Are you sure you want to delete this exemption category?")) {
      setCategories(categories.filter((cat) => cat.id !== id));
    }
  };

  // Add new row (temporary id = Date.now)
  const handleAddRow = () => {
    const newId = Date.now();
    const newCategory: ExemptionCategory = {
      id: newId,
      description: "",
      aliasName: "",
      active: true,
    };
    setCategories([...categories, newCategory]);
    // Automatically enter edit mode for the new row
    setEditingId(newId);
    setEditValues({
      description: "",
      aliasName: "",
      active: true,
    });
  };

  // Toggle active status (checkbox)
  const handleToggleActive = (id: number, currentActive: boolean) => {
    if (editingId === id) {
      updateEditValue("active", !currentActive);
    } else {
      setCategories(
        categories.map((cat) =>
          cat.id === id ? { ...cat, active: !cat.active } : cat
        )
      );
    }
  };

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">GST EXEMPTION CATEGORY MASTER</h1>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[10px] md:text-xs text-muted-foreground">
          <span>Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
          <span>Login By : MAYANK.GRLOGISTICS@GMAIL.COM</span>
          <span>Login Branch : CORPORATE OFFICE</span>
          <span>Financial Year : 2026-2027</span>
        </div>
      </div>

      {/* Search and Add Row */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by Description or Alias Name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-8 h-8 text-xs"
          />
        </div>
        <Button onClick={handleAddRow} size="sm" className="h-8 text-xs bg-green-600">
          <Plus className="mr-1 h-3.5 w-3.5" />
          Add Row
        </Button>
      </div>

      {/* Main Table */}
      <div className="rounded-md border overflow-x-auto">
        <div className="min-w-[600px]">
          <Table className="text-xs">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12 text-center">S#</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Alias Name</TableHead>
                <TableHead className="text-center w-20">Active</TableHead>
                <TableHead className="text-center w-32">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No records found. Click "Add Row" to create a new exemption category.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCategories.map((category, idx) => {
                  const isEditing = editingId === category.id;
                  return (
                    <TableRow key={category.id} className="hover:bg-muted/30">
                      <TableCell className="text-center">
                        {(currentPage - 1) * itemsPerPage + idx + 1}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input
                            value={editValues.description ?? category.description}
                            onChange={(e) =>
                              updateEditValue("description", e.target.value)
                            }
                            className="h-7 w-48 text-xs"
                            autoFocus
                          />
                        ) : (
                          <span className="font-medium">
                            {category.description || "-"}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input
                            value={editValues.aliasName ?? category.aliasName}
                            onChange={(e) =>
                              updateEditValue("aliasName", e.target.value)
                            }
                            className="h-7 w-48 text-xs"
                          />
                        ) : (
                          <span>{category.aliasName || "-"}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <input
                          type="checkbox"
                          checked={
                            isEditing
                              ? (editValues.active ?? category.active)
                              : category.active
                          }
                          onChange={() =>
                            handleToggleActive(category.id, category.active)
                          }
                          className="h-3.5 w-3.5"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        {isEditing ? (
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSaveRow(category.id)}
                              className="h-7 w-7 p-0 text-green-500"
                              title="Save"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleCancelEdit}
                              className="h-7 w-7 p-0 text-red-500"
                              title="Cancel"
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(category)}
                              className="h-7 w-7 p-0 text-blue-500"
                              title="Edit"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteRow(category.id)}
                              className="h-7 w-7 p-0 text-red-500"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
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
            {Math.min(currentPage * itemsPerPage, filteredCategories.length)} of{" "}
            {filteredCategories.length} entries
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

      {/* Global Save Button (optional, saves all pending edits) */}
      <div className="flex justify-end pt-2">
        <Button
          onClick={() => {
            // In a real application, you might call an API to sync all rows
            alert("All changes have been saved successfully!");
          }}
          size="sm"
          className="h-8 text-xs bg-blue-600"
        >
          <Save className="mr-1 h-3.5 w-3.5" />
          Save All
        </Button>
      </div>

      {/* Info Note */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 rounded-md p-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
          <div className="text-xs text-blue-700 dark:text-blue-400">
            <p className="font-medium">Note:</p>
            <ul className="list-disc list-inside mt-1 space-y-0.5">
              <li>Click "Add Row" to insert a new exemption category.</li>
              <li>Use the Edit button (pencil) to modify a row, then click the green check mark to save.</li>
              <li>The checkbox directly toggles the Active status.</li>
              <li>Use the Save All button at the bottom to persist all changes (if needed).</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}