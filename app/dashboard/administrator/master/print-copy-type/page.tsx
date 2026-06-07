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
  Trash2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface PrintCopyType {
  id: number;
  copyTypeId: number;
  branch: string;
  allBranch: boolean;
  copyTypeName: string;
  menuName: string;
  printSequenceNo: number;
}

// Mock data
const mockCopyTypes: PrintCopyType[] = [
  { id: 1, copyTypeId: 12, branch: "", allBranch: true, copyTypeName: "ADMIN COPY", menuName: "GOODS ARRIVAL", printSequenceNo: 2 },
  { id: 2, copyTypeId: 22, branch: "", allBranch: true, copyTypeName: "CONSIGNEE COPY", menuName: "BOOKING GRL MANUAL", printSequenceNo: 2 },
  { id: 3, copyTypeId: 21, branch: "", allBranch: true, copyTypeName: "CONSIGNOR COPY", menuName: "BOOKING GRL MANUAL", printSequenceNo: 1 },
  { id: 4, copyTypeId: 2, branch: "", allBranch: true, copyTypeName: "CUSTOMER COPY", menuName: "LHC ADVANCE PAYMENT", printSequenceNo: 2 },
  { id: 5, copyTypeId: 23, branch: "", allBranch: true, copyTypeName: "DRIVER COPY", menuName: "BOOKING GRL MANUAL", printSequenceNo: 3 },
  { id: 6, copyTypeId: 13, branch: "", allBranch: true, copyTypeName: "DRIVER COPY", menuName: "GOODS ARRIVAL", printSequenceNo: 1 },
  { id: 7, copyTypeId: 1, branch: "", allBranch: true, copyTypeName: "HEAD OFFICE", menuName: "LHC ADVANCE PAYMENT", printSequenceNo: 1 },
];

const branchOptions = [
  "CORPORATE OFFICE",
  "DELHI",
  "MUMBAI",
  "BANGALORE",
  "CHENNAI",
  "KOLKATA",
  "AHMEDABAD",
  "PUNE",
];

const menuNameOptions = [
  "GOODS ARRIVAL",
  "BOOKING GRL MANUAL",
  "LHC ADVANCE PAYMENT",
  "LOCAL MANIFEST",
  "POD ENTRY",
];

export default function PrintCopyTypeMaster() {
  const [activeTab, setActiveTab] = useState<"entry" | "search">("entry");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form state
  const [branch, setBranch] = useState<string>("");
  const [allBranch, setAllBranch] = useState<boolean>(false);
  const [copyTypeName, setCopyTypeName] = useState<string>("");
  const [menuName, setMenuName] = useState<string>("");
  const [printSequenceNo, setPrintSequenceNo] = useState<number>(0);

  // Data state
  const [copyTypes, setCopyTypes] = useState<PrintCopyType[]>(mockCopyTypes);

  const generateCopyTypeId = (): number => {
    const maxId = copyTypes.length > 0 ? Math.max(...copyTypes.map(c => c.copyTypeId)) : 0;
    return maxId + 1;
  };

  const resetForm = () => {
    setBranch("");
    setAllBranch(false);
    setCopyTypeName("");
    setMenuName("");
    setPrintSequenceNo(0);
    setEditId(null);
  };

  const handleSave = () => {
    if (!copyTypeName) {
      alert("Copy Type Name is required");
      return;
    }
    if (!menuName) {
      alert("Menu Name is required");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      if (editId) {
        // Update existing record
        const updated = copyTypes.map(c =>
          c.id === editId
            ? {
                ...c,
                branch: allBranch ? "" : branch,
                allBranch,
                copyTypeName,
                menuName,
                printSequenceNo,
              }
            : c
        );
        setCopyTypes(updated);
        alert("Record updated successfully!");
      } else {
        // Create new record
        const newRecord: PrintCopyType = {
          id: Date.now(),
          copyTypeId: generateCopyTypeId(),
          branch: allBranch ? "" : branch,
          allBranch,
          copyTypeName,
          menuName,
          printSequenceNo,
        };
        setCopyTypes([...copyTypes, newRecord]);
        alert("Record saved successfully!");
      }
      resetForm();
      setActiveTab("search");
      setLoading(false);
    }, 500);
  };

  const handleEdit = (record: PrintCopyType) => {
    setEditId(record.id);
    setBranch(record.branch);
    setAllBranch(record.allBranch);
    setCopyTypeName(record.copyTypeName);
    setMenuName(record.menuName);
    setPrintSequenceNo(record.printSequenceNo);
    setActiveTab("entry");
  };

  const handleDelete = () => {
    if (!editId && !copyTypeName) {
      alert("No record selected to delete");
      return;
    }
    if (confirm("Are you sure you want to delete this print copy type?")) {
      if (editId) {
        setCopyTypes(copyTypes.filter(c => c.id !== editId));
        alert("Record deleted successfully!");
        resetForm();
        setActiveTab("search");
      }
    }
  };

  const filteredCopyTypes = copyTypes.filter(
    (c) =>
      c.copyTypeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.menuName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedResults = filteredCopyTypes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredCopyTypes.length / itemsPerPage);
  const goToPage = (page: number) =>
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">PRINT COPY TYPE MASTER</h1>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[10px] md:text-xs text-muted-foreground">
          <span>Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
          <span>Login By : MAYANK.GRLOGISTICS@GMAIL.COM</span>
          <span>Login Branch : CORPORATE OFFICE</span>
          <span>Financial Year : 2026-2027</span>
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
            <CardTitle className="text-base">Print Copy Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Branch */}
              <div className="space-y-1">
                <Label className="text-xs">Branch</Label>
                <div className="flex items-center gap-3">
                  <Select value={branch} onValueChange={setBranch} disabled={allBranch}>
                    <SelectTrigger className="h-8 flex-1 text-xs">
                      <SelectValue placeholder="Select Branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branchOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={allBranch}
                      onChange={(e) => setAllBranch(e.target.checked)}
                      className="h-3.5 w-3.5"
                      id="allBranch"
                    />
                    <Label htmlFor="allBranch" className="text-xs cursor-pointer">
                      ALL
                    </Label>
                  </div>
                </div>
              </div>

              {/* Copy Type Name */}
              <div className="space-y-1">
                <Label className="text-xs">
                  Copy Type Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={copyTypeName}
                  onChange={(e) => setCopyTypeName(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              {/* Menu Name */}
              <div className="space-y-1">
                <Label className="text-xs">
                  Menu Name <span className="text-red-500">*</span>
                </Label>
                <Select value={menuName} onValueChange={setMenuName}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select Menu" />
                  </SelectTrigger>
                  <SelectContent>
                    {menuNameOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Print Sequence No */}
              <div className="space-y-1">
                <Label className="text-xs">Print Sequence No</Label>
                <Input
                  type="number"
                  value={printSequenceNo}
                  onChange={(e) => setPrintSequenceNo(Number(e.target.value))}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            {/* Action Buttons */}
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
                onClick={handleDelete}
                variant="destructive"
                size="sm"
                className="h-8 text-xs"
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
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" />
              <Input
                placeholder="Search by Copy Type Name or Menu Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8 text-xs"
              />
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[700px]">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12 text-center">S #</TableHead>
                    <TableHead>Copy Type ID</TableHead>
                    <TableHead>Copy Type</TableHead>
                    <TableHead>Menu Name</TableHead>
                    <TableHead>Print Seq #</TableHead>
                    <TableHead className="w-24 text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedResults.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedResults.map((record, idx) => (
                      <TableRow key={record.id} className="hover:bg-muted/30">
                        <TableCell className="text-center">
                          {(currentPage - 1) * itemsPerPage + idx + 1}
                        </TableCell>
                        <TableCell className="font-mono text-center">
                          {record.copyTypeId}
                        </TableCell>
                        <TableCell className="font-medium">{record.copyTypeName}</TableCell>
                        <TableCell>{record.menuName}</TableCell>
                        <TableCell className="text-center">{record.printSequenceNo}</TableCell>
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
              <li>Select "ALL" checkbox to apply the copy type to all branches.</li>
              <li>Copy Type Name and Menu Name are mandatory fields.</li>
              <li>Print Sequence No determines the order in which copies are printed.</li>
              <li>Use Edit (pencil) button to modify existing records.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}