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
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ------------------------------
//  Types & Mock Data
// ------------------------------
interface SqlProcedure {
  id: number;
  menuName: string;
  event: string;
  spName: string;
}

const eventOptions = [
  "ADD",
  "EDIT",
  "CANCEL",
  "DELETE",
  "GET DETAILS",
  "SEARCH LIST",
  "OTHERS",
];

const mockRecords: SqlProcedure[] = [
  { id: 1, menuName: "User Master", event: "ADD", spName: "usp_AddUser" },
  { id: 2, menuName: "User Master", event: "EDIT", spName: "usp_UpdateUser" },
  { id: 3, menuName: "Role Master", event: "SEARCH LIST", spName: "usp_SearchRoles" },
];

export default function SqlProcedureMaster() {
  const [activeTab, setActiveTab] = useState<"entry" | "search">("entry");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchMenuName, setSearchMenuName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form state
  const [menuName, setMenuName] = useState("");
  const [event, setEvent] = useState("");
  const [spName, setSpName] = useState("");

  // Data state
  const [records, setRecords] = useState<SqlProcedure[]>(mockRecords);
  const [filteredRecords, setFilteredRecords] = useState<SqlProcedure[]>([]);

  const generateId = () => {
    const maxId = records.length > 0 ? Math.max(...records.map((r) => r.id)) : 0;
    return maxId + 1;
  };

  const resetForm = () => {
    setMenuName("");
    setEvent("");
    setSpName("");
    setEditId(null);
  };

  const handleSave = () => {
    if (!menuName.trim()) {
      alert("Menu Name is required");
      return;
    }
    if (!event) {
      alert("Event is required");
      return;
    }
    if (!spName.trim()) {
      alert("SP Name is required");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      if (editId) {
        // Update existing
        const updated = records.map((r) =>
          r.id === editId ? { ...r, menuName, event, spName } : r
        );
        setRecords(updated);
        alert("Record updated successfully");
      } else {
        // Create new
        const newRecord: SqlProcedure = {
          id: generateId(),
          menuName,
          event,
          spName,
        };
        setRecords([...records, newRecord]);
        alert("Record saved successfully");
      }
      resetForm();
      setActiveTab("search");
      setLoading(false);
    }, 500);
  };

  const handleEdit = (record: SqlProcedure) => {
    setEditId(record.id);
    setMenuName(record.menuName);
    setEvent(record.event);
    setSpName(record.spName);
    setActiveTab("entry");
  };

  const handleSearch = () => {
    if (!searchMenuName.trim()) {
      setFilteredRecords([]);
      return;
    }
    const filtered = records.filter((r) =>
      r.menuName.toLowerCase().includes(searchMenuName.toLowerCase())
    );
    setFilteredRecords(filtered);
    setCurrentPage(1);
  };

  // For the second search button (if needed) – we can reuse handleSearch
  // Also a general search term input (optional) but we'll keep simple
  const handleSearchTerm = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredRecords([]);
    } else {
      const filtered = records.filter(
        (r) =>
          r.menuName.toLowerCase().includes(term.toLowerCase()) ||
          r.event.toLowerCase().includes(term.toLowerCase()) ||
          r.spName.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredRecords(filtered);
      setCurrentPage(1);
    }
  };

  // Pagination for search results
  const displayRecords = filteredRecords.length ? filteredRecords : records;
  const paginated = displayRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(displayRecords.length / itemsPerPage);
  const goToPage = (page: number) =>
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">SQL PROCEDURE MASTER</h1>
        <div className="mt-1 text-[10px] md:text-xs text-muted-foreground">
          Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD | Login By :
          MAYANK.GRLOGISTICS@GMAIL.COM | Login Branch : CORPORATE OFFICE | FY :
          2026-2027
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
            setFilteredRecords([]);
            setSearchMenuName("");
            setSearchTerm("");
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
          <CardHeader>
            <CardTitle className="text-base">SQL Procedure Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs">
                  Menu Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={menuName}
                  onChange={(e) => setMenuName(e.target.value)}
                  className="h-8 text-xs"
                  placeholder="e.g., User Master"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">
                  Event <span className="text-red-500">*</span>
                </Label>
                <Select value={event} onValueChange={setEvent}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select Event" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label className="text-xs">
                  SP Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={spName}
                  onChange={(e) => setSpName(e.target.value)}
                  className="h-8 text-xs"
                  placeholder="e.g., usp_AddUser"
                />
              </div>
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
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Tab */}
      {activeTab === "search" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px]">
              <Label className="text-xs">Menu Name</Label>
              <Input
                value={searchMenuName}
                onChange={(e) => setSearchMenuName(e.target.value)}
                placeholder="Enter Menu Name"
                className="h-8 text-xs"
              />
            </div>
            <div className="flex items-end gap-2">
              <Button
                onClick={handleSearch}
                size="sm"
                className="h-8 text-xs"
              >
                <Search className="mr-1 h-3.5 w-3.5" />
                SHOW
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" />
              <Input
                placeholder="Search by Menu Name, Event or SP Name..."
                value={searchTerm}
                onChange={(e) => handleSearchTerm(e.target.value)}
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
                    <TableHead>Menu Name</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>SP Name</TableHead>
                    <TableHead className="w-24 text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        No records found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginated.map((record, idx) => (
                      <TableRow key={record.id} className="hover:bg-muted/30">
                        <TableCell className="text-center">
                          {(currentPage - 1) * itemsPerPage + idx + 1}
                        </TableCell>
                        <TableCell className="font-medium">
                          {record.menuName}
                        </TableCell>
                        <TableCell>{record.event}</TableCell>
                        <TableCell className="font-mono">{record.spName}</TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(record)}
                            className="h-6 w-6 p-0 text-blue-500"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
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

      {/* Info Note */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 rounded-md p-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
          <div className="text-xs text-blue-700 dark:text-blue-400">
            <p className="font-medium">Note:</p>
            <ul className="list-disc list-inside mt-1 space-y-0.5">
              <li>All fields are mandatory in the Entry tab.</li>
              <li>Event must be one of the predefined values.</li>
              <li>SP Name should be a valid stored procedure name in your database.</li>
              <li>Use the Search tab to find records by Menu Name, Event, or SP Name.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}