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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  CalendarIcon,
  Save,
  RefreshCw,
  Search,
  Pencil,
  Trash2,
  Plus,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Types
interface GSTPercentage {
  id: number;
  gstPercent: string;
  wef: Date;
  validUpto: Date | null;
}

interface GSTCategory {
  id: number;
  sacCode: string;
  description: string;
  cgstLedgerName: string;
  sgstLedgerName: string;
  igstLedgerName: string;
  saleLedger: string;
  isRCM: boolean;
  gstPercentages: GSTPercentage[];
}

// Mock ledger options (could be fetched from API)
const ledgerOptions = [
  "CGST - OUTPUT",
  "SGST - OUTPUT",
  "IGST - OUTPUT",
  "CGST - INPUT",
  "SGST - INPUT",
  "IGST - INPUT",
  "SALE - LOCAL",
  "SALE - INTERSTATE",
];

export default function GSTCategoryMaster() {
  const [activeTab, setActiveTab] = useState<"entry" | "search">("entry");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form state
  const [sacCode, setSacCode] = useState("");
  const [description, setDescription] = useState("");
  const [cgstLedgerName, setCgstLedgerName] = useState("");
  const [sgstLedgerName, setSgstLedgerName] = useState("");
  const [igstLedgerName, setIgstLedgerName] = useState("");
  const [saleLedger, setSaleLedger] = useState("");
  const [isRCM, setIsRCM] = useState(false);
  const [gstPercentages, setGstPercentages] = useState<GSTPercentage[]>([
    { id: Date.now(), gstPercent: "", wef: new Date(), validUpto: null },
  ]);

  // Sample data
  const [savedRecords, setSavedRecords] = useState<GSTCategory[]>([
    {
      id: 1,
      sacCode: "996511",
      description: "ROAD TRANPORTATION SERVICE @0%",
      cgstLedgerName: "",
      sgstLedgerName: "",
      igstLedgerName: "",
      saleLedger: "",
      isRCM: false,
      gstPercentages: [],
    },
    {
      id: 2,
      sacCode: "996512",
      description: "RAILWAYS TRANPORTATION SERVICE @ 0%",
      cgstLedgerName: "",
      sgstLedgerName: "",
      igstLedgerName: "",
      saleLedger: "",
      isRCM: false,
      gstPercentages: [],
    },
    {
      id: 3,
      sacCode: "996791",
      description: "GOODS TRANSPORT AGENCY SERVICES FOR ROAD TRANSPORT",
      cgstLedgerName: "",
      sgstLedgerName: "",
      igstLedgerName: "",
      saleLedger: "",
      isRCM: false,
      gstPercentages: [],
    },
    {
      id: 4,
      sacCode: "996711",
      description: "CARGO HANDLING SERVICES",
      cgstLedgerName: "",
      sgstLedgerName: "",
      igstLedgerName: "",
      saleLedger: "",
      isRCM: false,
      gstPercentages: [],
    },
    {
      id: 5,
      sacCode: "996761",
      description: "FREIGHT SERVICES @ 12% GST",
      cgstLedgerName: "",
      sgstLedgerName: "",
      igstLedgerName: "",
      saleLedger: "",
      isRCM: false,
      gstPercentages: [],
    },
  ]);

  const generateId = (): number => {
    const maxId = savedRecords.length > 0 ? Math.max(...savedRecords.map(r => r.id)) : 0;
    return maxId + 1;
  };

  const resetForm = () => {
    setSacCode("");
    setDescription("");
    setCgstLedgerName("");
    setSgstLedgerName("");
    setIgstLedgerName("");
    setSaleLedger("");
    setIsRCM(false);
    setGstPercentages([{ id: Date.now(), gstPercent: "", wef: new Date(), validUpto: null }]);
    setEditId(null);
  };

  // GST Percentage row management
  const addGstRow = () => {
    setGstPercentages([
      ...gstPercentages,
      { id: Date.now(), gstPercent: "", wef: new Date(), validUpto: null },
    ]);
  };

  const updateGstRow = (id: number, field: keyof GSTPercentage, value: any) => {
    setGstPercentages(
      gstPercentages.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const removeGstRow = (id: number) => {
    if (gstPercentages.length > 1) {
      setGstPercentages(gstPercentages.filter((row) => row.id !== id));
    } else {
      alert("At least one GST percentage row is required.");
    }
  };

  const handleSave = () => {
    if (!sacCode) {
      alert("SAC Code is required");
      return;
    }
    if (!description) {
      alert("Description is required");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const newRecord: GSTCategory = {
        id: editId || generateId(),
        sacCode,
        description,
        cgstLedgerName,
        sgstLedgerName,
        igstLedgerName,
        saleLedger,
        isRCM,
        gstPercentages: gstPercentages.filter(row => row.gstPercent.trim() !== ""),
      };

      if (editId) {
        setSavedRecords(
          savedRecords.map((record) => (record.id === editId ? newRecord : record))
        );
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

  const handleEdit = (record: GSTCategory) => {
    setEditId(record.id);
    setSacCode(record.sacCode);
    setDescription(record.description);
    setCgstLedgerName(record.cgstLedgerName);
    setSgstLedgerName(record.sgstLedgerName);
    setIgstLedgerName(record.igstLedgerName);
    setSaleLedger(record.saleLedger);
    setIsRCM(record.isRCM);
    setGstPercentages(
      record.gstPercentages.length > 0
        ? record.gstPercentages
        : [{ id: Date.now(), gstPercent: "", wef: new Date(), validUpto: null }]
    );
    setActiveTab("entry");
  };

  const handleDelete = () => {
    if (!editId && !sacCode) {
      alert("No record selected to delete");
      return;
    }
    if (confirm("Are you sure you want to delete this GST category?")) {
      if (editId) {
        setSavedRecords(savedRecords.filter((record) => record.id !== editId));
        alert("Record deleted successfully!");
        resetForm();
        setActiveTab("search");
      }
    }
  };

  const filteredRecords = savedRecords.filter(
    (record) =>
      record.sacCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedResults = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const goToPage = (page: number) =>
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">GST CATEGORY MASTER</h1>
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
        <div className="space-y-4">
          {/* Main Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">
                SAC Code <span className="text-red-500">*</span>
              </Label>
              <Input
                value={sacCode}
                onChange={(e) => setSacCode(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">
                Description <span className="text-red-500">*</span>
              </Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">CGST Ledger Name</Label>
              <Select value={cgstLedgerName} onValueChange={setCgstLedgerName}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select Ledger" />
                </SelectTrigger>
                <SelectContent>
                  {ledgerOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">SGST Ledger Name</Label>
              <Select value={sgstLedgerName} onValueChange={setSgstLedgerName}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select Ledger" />
                </SelectTrigger>
                <SelectContent>
                  {ledgerOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">IGST Ledger Name</Label>
              <Select value={igstLedgerName} onValueChange={setIgstLedgerName}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select Ledger" />
                </SelectTrigger>
                <SelectContent>
                  {ledgerOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Sale Ledger</Label>
              <Select value={saleLedger} onValueChange={setSaleLedger}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select Ledger" />
                </SelectTrigger>
                <SelectContent>
                  {ledgerOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                checked={isRCM}
                onChange={(e) => setIsRCM(e.target.checked)}
                className="h-3.5 w-3.5"
                id="rcm"
              />
              <Label htmlFor="rcm" className="text-xs cursor-pointer">
                Is RCM
              </Label>
            </div>
          </div>

          {/* GST Percentage Grid */}
          <div className="rounded-md border mt-4">
            <div className="bg-muted/50 px-3 py-2 border-b flex justify-between items-center">
              <h3 className="text-sm font-semibold">GST % Details</h3>
              <Button onClick={addGstRow} variant="ghost" size="sm" className="h-7 text-xs">
                <Plus className="mr-1 h-3 w-3" />
                Add Row
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="w-12 text-center">S.No</TableHead>
                    <TableHead>GST %</TableHead>
                    <TableHead>W.E.F</TableHead>
                    <TableHead>Valid Upto</TableHead>
                    <TableHead className="w-12 text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gstPercentages.map((row, idx) => (
                    <TableRow key={row.id}>
                      <TableCell className="text-center">{idx + 1}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={row.gstPercent}
                          onChange={(e) =>
                            updateGstRow(row.id, "gstPercent", e.target.value)
                          }
                          className="h-7 w-24 text-xs"
                          placeholder="e.g., 5"
                        />
                      </TableCell>
                      <TableCell>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="h-7 w-32 text-xs"
                            >
                              <CalendarIcon className="mr-1 h-3 w-3" />
                              {format(row.wef, "dd-MM-yyyy")}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={row.wef}
                              onSelect={(date) =>
                                date && updateGstRow(row.id, "wef", date)
                              }
                            />
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      <TableCell>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="h-7 w-32 text-xs"
                            >
                              <CalendarIcon className="mr-1 h-3 w-3" />
                              {row.validUpto
                                ? format(row.validUpto, "dd-MM-yyyy")
                                : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={row.validUpto || undefined}
                              onSelect={(date) =>
                                updateGstRow(row.id, "validUpto", date || null)
                              }
                            />
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeGstRow(row.id)}
                          className="h-6 w-6 p-0 text-red-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
        </div>
      )}

      {/* Search Tab */}
      {activeTab === "search" && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" />
              <Input
                placeholder="Search by SAC Code or Description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                    <TableHead>SAC Code</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="w-24 text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedResults.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        No records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedResults.map((record, idx) => (
                      <TableRow key={record.id} className="hover:bg-muted/30">
                        <TableCell className="text-center">
                          {(currentPage - 1) * itemsPerPage + idx + 1}
                        </TableCell>
                        <TableCell className="font-mono font-medium">
                          {record.sacCode}
                        </TableCell>
                        <TableCell>{record.description}</TableCell>
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
              <li>SAC Code and Description are mandatory fields</li>
              <li>You can add multiple GST percentage rows with effective dates</li>
              <li>Ledger fields are optional but help in automatic accounting</li>
              <li>Check "Is RCM" if Reverse Charge Mechanism applies</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}