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
import { Checkbox } from "@/components/ui/checkbox";
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
  Plus,
  AlertCircle,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ------------------------------
//  Types & Mock Data
// ------------------------------
interface ContactEntry {
  id: number;
  name: string;
  mobileNo: string;
  emailId: string;
  cc: string;
  type: "both" | "email" | "sms" | "whatsapp";
  offLoad: boolean;
  pickup: boolean;
  booking: boolean;
  dispatch: boolean;
  arrival: boolean;
  drs: boolean;
  delivery: boolean;
  undelivery: boolean;
  billing: boolean;
  mr: boolean;
  voucherApproved: boolean;
  voucherRejected: boolean;
  googleSheet: boolean;
}

// Sample data (for demonstration)
const sampleData: ContactEntry[] = [
  {
    id: 1,
    name: "Rajesh Kumar",
    mobileNo: "9876543210",
    emailId: "rajesh@example.com",
    cc: "cc1@example.com",
    type: "both",
    offLoad: true,
    pickup: false,
    booking: true,
    dispatch: false,
    arrival: true,
    drs: false,
    delivery: true,
    undelivery: false,
    billing: true,
    mr: false,
    voucherApproved: true,
    voucherRejected: false,
    googleSheet: true,
  },
  {
    id: 2,
    name: "Suresh Singh",
    mobileNo: "9876543211",
    emailId: "suresh@example.com",
    cc: "",
    type: "sms",
    offLoad: false,
    pickup: true,
    booking: false,
    dispatch: true,
    arrival: false,
    drs: true,
    delivery: false,
    undelivery: true,
    billing: false,
    mr: true,
    voucherApproved: false,
    voucherRejected: true,
    googleSheet: false,
  },
];

// Event labels
const eventColumns = [
  { key: "offLoad", label: "Off Load" },
  { key: "pickup", label: "Pickup" },
  { key: "booking", label: "Booking" },
  { key: "dispatch", label: "Dispatch" },
  { key: "arrival", label: "Arrival" },
  { key: "drs", label: "DRS" },
  { key: "delivery", label: "Delivery" },
  { key: "undelivery", label: "Undelivery" },
  { key: "billing", label: "Billing" },
  { key: "mr", label: "MR" },
  { key: "voucherApproved", label: "Voucher Approved" },
  { key: "voucherRejected", label: "Voucher Rejected" },
  { key: "googleSheet", label: "Google Sheet" },
];

// Type options
const typeOptions = [
  { value: "both", label: "Both" },
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "whatsapp", label: "WhatsApp" },
];

export default function SmsEmailMaster() {
  const [activeTab, setActiveTab] = useState<"entry" | "search">("entry");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Main data store
  const [savedRecords, setSavedRecords] = useState<ContactEntry[]>(sampleData);

  // Editable rows in Entry tab (temporary)
  const [editableRows, setEditableRows] = useState<ContactEntry[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

  // Top dropdown states (currently not used for logic, but present as per requirement)
  const [smsTo, setSmsTo] = useState<string>("");
  const [selectOption, setSelectOption] = useState<string>("");

  // Initialize editable rows when entering entry tab
  const initEntry = () => {
    // For a clean slate, start with one empty row
    if (editableRows.length === 0) {
      const emptyRow: ContactEntry = {
        id: Date.now(),
        name: "",
        mobileNo: "",
        emailId: "",
        cc: "",
        type: "both",
        offLoad: false,
        pickup: false,
        booking: false,
        dispatch: false,
        arrival: false,
        drs: false,
        delivery: false,
        undelivery: false,
        billing: false,
        mr: false,
        voucherApproved: false,
        voucherRejected: false,
        googleSheet: false,
      };
      setEditableRows([emptyRow]);
    }
    setEditId(null);
  };

  // Add a new empty row
  const addRow = () => {
    const newRow: ContactEntry = {
      id: Date.now(),
      name: "",
      mobileNo: "",
      emailId: "",
      cc: "",
      type: "both",
      offLoad: false,
      pickup: false,
      booking: false,
      dispatch: false,
      arrival: false,
      drs: false,
      delivery: false,
      undelivery: false,
      billing: false,
      mr: false,
      voucherApproved: false,
      voucherRejected: false,
      googleSheet: false,
    };
    setEditableRows([...editableRows, newRow]);
  };

  // Update a specific field of a row (by its temporary id)
  const updateRowField = <K extends keyof ContactEntry>(
    rowId: number,
    field: K,
    value: ContactEntry[K]
  ) => {
    setEditableRows((rows) =>
      rows.map((row) => (row.id === rowId ? { ...row, [field]: value } : row))
    );
  };

  // Save a row (add/update to savedRecords)
  const saveRow = (row: ContactEntry) => {
    // Validate required fields
    if (!row.name.trim()) {
      alert("Name is required");
      return;
    }
    if (!row.mobileNo.trim() && !row.emailId.trim()) {
      alert("Either Mobile No or Email Id is required");
      return;
    }

    if (savedRecords.some((r) => r.id === row.id)) {
      // Update existing
      setSavedRecords((prev) =>
        prev.map((r) => (r.id === row.id ? { ...row } : r))
      );
    } else {
      // Add new
      setSavedRecords((prev) => [...prev, { ...row }]);
    }
    // Remove from editable rows after saving (only if it's a new row and not being edited further)
    setEditableRows((rows) => rows.filter((r) => r.id !== row.id));
    alert("Record saved successfully!");
  };

  // Remove a row from editable list (without saving)
  const removeEditableRow = (id: number) => {
    setEditableRows((rows) => rows.filter((row) => row.id !== id));
  };

  // Delete a saved record (from search tab or after editing)
  const deleteRecord = (id: number) => {
    if (confirm("Delete this contact permanently?")) {
      setSavedRecords((prev) => prev.filter((r) => r.id !== id));
      // Also remove from editable if present
      setEditableRows((rows) => rows.filter((r) => r.id !== id));
    }
  };

  // Load a saved record into the entry tab for editing
  const handleEdit = (record: ContactEntry) => {
    // Put the record into editableRows, replacing any existing rows
    setEditableRows([{ ...record }]);
    setEditId(record.id);
    setActiveTab("entry");
  };

  // Search filter
  const filteredRecords = savedRecords.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.mobileNo.includes(searchTerm) ||
      r.emailId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedRecords = filteredRecords.slice(
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
        <h1 className="text-base md:text-lg font-bold">SMS/EMAIL MASTER</h1>
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
            initEntry();
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
          <CardHeader>
            <CardTitle className="text-base">Contact & Event Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Dropdowns row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs">
                  SMS To <span className="text-red-500">*</span>
                </Label>
                <Select value={smsTo} onValueChange={setSmsTo}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="branch">Branch</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="consignee">Consignee</SelectItem>
                    <SelectItem value="consignor">Consignor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Select</Label>
                <Select value={selectOption} onValueChange={setSelectOption}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Table of contacts/events */}
            <div className="rounded-md border overflow-x-auto">
              <div className="min-w-[1000px]">
                <Table className="text-xs">
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-12 text-center">S#</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Mobile #</TableHead>
                      <TableHead>Email Id</TableHead>
                      <TableHead>CC</TableHead>
                      <TableHead>Type</TableHead>
                      {eventColumns.map((col) => (
                        <TableHead key={col.key} className="text-center">
                          {col.label}
                        </TableHead>
                      ))}
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {editableRows.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6 + eventColumns.length + 1}
                          className="text-center py-8"
                        >
                          No rows. Click "Add Row" below to add a contact.
                        </TableCell>
                      </TableRow>
                    ) : (
                      editableRows.map((row, idx) => (
                        <TableRow key={row.id} className="hover:bg-muted/30">
                          <TableCell className="text-center">{idx + 1}</TableCell>
                          <TableCell>
                            <Input
                              value={row.name}
                              onChange={(e) =>
                                updateRowField(row.id, "name", e.target.value)
                              }
                              className="h-7 w-36 text-xs"
                              placeholder="Name"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={row.mobileNo}
                              onChange={(e) =>
                                updateRowField(row.id, "mobileNo", e.target.value)
                              }
                              className="h-7 w-28 text-xs"
                              placeholder="Mobile"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={row.emailId}
                              onChange={(e) =>
                                updateRowField(row.id, "emailId", e.target.value)
                              }
                              className="h-7 w-36 text-xs"
                              placeholder="Email"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={row.cc}
                              onChange={(e) =>
                                updateRowField(row.id, "cc", e.target.value)
                              }
                              className="h-7 w-28 text-xs"
                              placeholder="CC"
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={row.type}
                              onValueChange={(val) =>
                                updateRowField(
                                  row.id,
                                  "type",
                                  val as ContactEntry["type"]
                                )
                              }
                            >
                              <SelectTrigger className="h-7 w-24 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {typeOptions.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          {eventColumns.map((col) => (
                            <TableCell key={col.key} className="text-center">
                              <Checkbox
                                checked={row[col.key as keyof ContactEntry] as boolean}
                                onCheckedChange={(checked) =>
                                  updateRowField(
                                    row.id,
                                    col.key as keyof ContactEntry,
                                    !!checked
                                  )
                                }
                              />
                            </TableCell>
                          ))}
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => saveRow(row)}
                                className="h-6 w-6 p-0 text-green-500"
                                title="Save"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeEditableRow(row.id)}
                                className="h-6 w-6 p-0 text-red-500"
                                title="Remove"
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

            {/* Add Row Button */}
            <div className="flex justify-end">
              <Button onClick={addRow} size="sm" className="h-8 text-xs">
                <Plus className="mr-1 h-3.5 w-3.5" />
                Add Row
              </Button>
            </div>

            {/* Clear Button (optional) */}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                onClick={() => {
                  if (confirm("Clear all unsaved rows?")) {
                    setEditableRows([]);
                    initEntry();
                  }
                }}
                variant="outline"
                size="sm"
                className="h-8 text-xs"
              >
                <RefreshCw className="mr-1 h-3.5 w-3.5" />
                Clear All
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
                placeholder="Search by Name, Mobile or Email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8 text-xs"
              />
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[1000px]">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12 text-center">S#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Mobile #</TableHead>
                    <TableHead>Email Id</TableHead>
                    <TableHead>CC</TableHead>
                    <TableHead>Type</TableHead>
                    {eventColumns.map((col) => (
                      <TableHead key={col.key} className="text-center">
                        {col.label}
                      </TableHead>
                    ))}
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRecords.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6 + eventColumns.length + 1}
                        className="text-center py-8"
                      >
                        No records found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedRecords.map((record, idx) => (
                      <TableRow key={record.id} className="hover:bg-muted/30">
                        <TableCell className="text-center">
                          {(currentPage - 1) * itemsPerPage + idx + 1}
                        </TableCell>
                        <TableCell>{record.name}</TableCell>
                        <TableCell>{record.mobileNo}</TableCell>
                        <TableCell>{record.emailId}</TableCell>
                        <TableCell>{record.cc || "-"}</TableCell>
                        <TableCell className="capitalize">{record.type}</TableCell>
                        {eventColumns.map((col) => (
                          <TableCell key={col.key} className="text-center">
                            {record[col.key as keyof ContactEntry] ? "✓" : "—"}
                          </TableCell>
                        ))}
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(record)}
                              className="h-6 w-6 p-0 text-blue-500"
                              title="Edit"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteRecord(record.id)}
                              className="h-6 w-6 p-0 text-red-500"
                              title="Delete"
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
              <li>Fill the contact details and check/uncheck the events for which notifications should be sent.</li>
              <li>Type options: Both (SMS+Email), Email only, SMS only, WhatsApp only.</li>
              <li>Click the green checkmark (Save) to store the row, red trash to remove.</li>
              <li>Use "Add Row" to create multiple contacts.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}