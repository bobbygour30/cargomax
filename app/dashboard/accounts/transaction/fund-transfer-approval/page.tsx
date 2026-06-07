"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, RefreshCw, CheckCircle, XCircle, Eye } from "lucide-react";

// ==================== Types ====================
interface FundTransferRequest {
  id: string;
  transferId: string;
  transferDate: string;
  fromBranch: string;
  toBranch: string;
  amount: number;
  fromLedger: string;
  transferVoucher: string;
  remarks: string;
  status: "UnApproved" | "Acknowledged" | "Pending" | "Approved" | "Rejected";
}

// Helper
const generateId = () => Math.random().toString(36).substr(2, 9);

// Mock Data
const mockTransferRequests: FundTransferRequest[] = [
  {
    id: "1",
    transferId: "FT-2026-001",
    transferDate: "2026-05-10",
    fromBranch: "Head Office - Mumbai",
    toBranch: "North Branch - Delhi",
    amount: 500000,
    fromLedger: "SBI Current Account",
    transferVoucher: "VCH-001",
    remarks: "Monthly fund transfer for operations",
    status: "UnApproved",
  },
  {
    id: "2",
    transferId: "FT-2026-002",
    transferDate: "2026-05-11",
    fromBranch: "Head Office - Mumbai",
    toBranch: "South Branch - Chennai",
    amount: 350000,
    fromLedger: "HDFC Bank",
    transferVoucher: "VCH-002",
    remarks: "Project funding",
    status: "Pending",
  },
  {
    id: "3",
    transferId: "FT-2026-003",
    transferDate: "2026-05-12",
    fromBranch: "North Branch - Delhi",
    toBranch: "East Branch - Kolkata",
    amount: 200000,
    fromLedger: "ICICI Bank",
    transferVoucher: "VCH-003",
    remarks: "Inter-branch transfer",
    status: "Acknowledged",
  },
  {
    id: "4",
    transferId: "FT-2026-004",
    transferDate: "2026-05-08",
    fromBranch: "Head Office - Mumbai",
    toBranch: "West Branch - Ahmedabad",
    amount: 150000,
    fromLedger: "Axis Bank",
    transferVoucher: "VCH-004",
    remarks: "Petty cash transfer",
    status: "Approved",
  },
  {
    id: "5",
    transferId: "FT-2026-005",
    transferDate: "2026-05-09",
    fromBranch: "South Branch - Chennai",
    toBranch: "Central Branch - Bhopal",
    amount: 75000,
    fromLedger: "SBI Current Account",
    transferVoucher: "VCH-005",
    remarks: "Emergency fund",
    status: "UnApproved",
  },
  {
    id: "6",
    transferId: "FT-2026-006",
    transferDate: "2026-05-13",
    fromBranch: "East Branch - Kolkata",
    toBranch: "North Branch - Delhi",
    amount: 100000,
    fromLedger: "Cash Ledger",
    transferVoucher: "VCH-006",
    remarks: "Reimbursement",
    status: "Pending",
  },
];

export default function FundTransferApproval() {
  // Filter State
  const [branch, setBranch] = useState<string>("");
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [searchType, setSearchType] = useState<string>("all");
  const [globalSearch, setGlobalSearch] = useState<string>("");

  // Table Data
  const [transferRequests, setTransferRequests] = useState<FundTransferRequest[]>(mockTransferRequests);

  // Dialog State for Transfer Details
  const [selectedTransfer, setSelectedTransfer] = useState<FundTransferRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Branches for filter dropdown
  const branches = useMemo(() => {
    const uniqueBranches = new Set(transferRequests.map(t => t.fromBranch));
    return Array.from(uniqueBranches);
  }, [transferRequests]);

  // Filtered Data
  const filteredTransfers = useMemo(() => {
    let filtered = transferRequests;

    // Filter by Branch
    if (branch && branch !== "all") {
      filtered = filtered.filter(t => t.fromBranch === branch);
    }

    // Filter by Date Range
    if (startDate) {
      filtered = filtered.filter(t => t.transferDate >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter(t => t.transferDate <= endDate);
    }

    // Filter by Search Type
    if (searchType !== "all") {
      filtered = filtered.filter(t => {
        if (searchType === "UnApproved") return t.status === "UnApproved";
        if (searchType === "Acknowledged") return t.status === "Acknowledged";
        if (searchType === "Pending") return t.status === "Pending";
        return true;
      });
    }

    // Global Search
    if (globalSearch.trim()) {
      const searchLower = globalSearch.toLowerCase();
      filtered = filtered.filter(
        t =>
          t.transferId.toLowerCase().includes(searchLower) ||
          t.fromBranch.toLowerCase().includes(searchLower) ||
          t.toBranch.toLowerCase().includes(searchLower) ||
          t.fromLedger.toLowerCase().includes(searchLower) ||
          t.transferVoucher.toLowerCase().includes(searchLower) ||
          t.remarks.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [transferRequests, branch, startDate, endDate, searchType, globalSearch]);

  // Status Badge Color
  const getStatusBadge = (status: string) => {
    const styles = {
      UnApproved: "bg-red-100 text-red-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Acknowledged: "bg-blue-100 text-blue-800",
      Approved: "bg-green-100 text-green-800",
      Rejected: "bg-gray-100 text-gray-800",
    };
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800";
  };

  // Handle Transfer Approval
  const handleApprove = (transfer: FundTransferRequest) => {
    if (confirm(`Approve transfer ${transfer.transferId} for amount ₹${transfer.amount.toLocaleString()}?`)) {
      setTransferRequests(prev =>
        prev.map(t =>
          t.id === transfer.id ? { ...t, status: "Approved" as const } : t
        )
      );
      alert(`Transfer ${transfer.transferId} has been approved.`);
    }
  };

  // Handle Transfer Rejection
  const handleReject = (transfer: FundTransferRequest) => {
    if (confirm(`Reject transfer ${transfer.transferId}?`)) {
      setTransferRequests(prev =>
        prev.map(t =>
          t.id === transfer.id ? { ...t, status: "Rejected" as const } : t
        )
      );
      alert(`Transfer ${transfer.transferId} has been rejected.`);
    }
  };

  // View Details
  const handleViewDetails = (transfer: FundTransferRequest) => {
    setSelectedTransfer(transfer);
    setDialogOpen(true);
  };

  // Clear all filters
  const handleClear = () => {
    setBranch("");
    setStartDate(new Date().toISOString().split("T")[0]);
    setEndDate(new Date().toISOString().split("T")[0]);
    setSearchType("all");
    setGlobalSearch("");
  };

  // Show button action
  const handleShow = () => {
    // Just triggers re-render via filters - already reactive
    alert(`Showing ${filteredTransfers.length} transfer requests`);
  };

  return (
    <div className="space-y-6 p-3 sm:p-4 md:p-6 max-w-full overflow-x-hidden">
      <h1 className="text-xl sm:text-2xl font-bold text-primary">Fund Transfer Approval</h1>

      {/* Filter Card */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Transfer Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label>Branch</Label>
              <Select value={branch} onValueChange={setBranch}>
                <SelectTrigger>
                  <SelectValue placeholder="All Branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {branches.map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Period From</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label>Period To</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div>
              <Label>Search Type</Label>
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="UnApproved">UnApproved</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Acknowledged">Acknowledged</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t">
            <Button onClick={handleShow} className="bg-blue-600 hover:bg-blue-700">
              <Search className="mr-2 h-4 w-4" /> Show
            </Button>
            <Button onClick={handleClear} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" /> Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Transfer ID, Branch, Ledger, Voucher, Remarks..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={() => {}} variant="secondary">
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </div>

      {/* Transfer Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transfer Requests List</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="min-w-[1000px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">S#</TableHead>
                  <TableHead>Transfer Id</TableHead>
                  <TableHead>Transfer Date</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>From Ledger</TableHead>
                  <TableHead>Transfer Voucher</TableHead>
                  <TableHead>Remarks</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransfers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                      No transfer requests found matching the criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransfers.map((transfer, idx) => (
                    <TableRow key={transfer.id}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell className="font-medium">{transfer.transferId}</TableCell>
                      <TableCell>{transfer.transferDate}</TableCell>
                      <TableCell>{transfer.fromBranch}</TableCell>
                      <TableCell>{transfer.toBranch}</TableCell>
                      <TableCell className="text-right">
                        ₹ {transfer.amount.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell>{transfer.fromLedger}</TableCell>
                      <TableCell>{transfer.transferVoucher}</TableCell>
                      <TableCell className="max-w-[200px] truncate" title={transfer.remarks}>
                        {transfer.remarks}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(transfer.status)}`}>
                          {transfer.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(transfer)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {(transfer.status === "UnApproved" || transfer.status === "Pending") && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleApprove(transfer)}
                                className="text-green-600 hover:text-green-700"
                                title="Approve"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleReject(transfer)}
                                className="text-red-600 hover:text-red-700"
                                title="Reject"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Footer */}
      {filteredTransfers.length > 0 && (
        <div className="text-sm text-muted-foreground border-t pt-3 flex justify-between">
          <span>Total Requests: {filteredTransfers.length}</span>
          <span>
            Total Amount: ₹ {filteredTransfers.reduce((sum, t) => sum + t.amount, 0).toLocaleString('en-IN')}
          </span>
          <span>
            UnApproved: {filteredTransfers.filter(t => t.status === "UnApproved").length} |
            Pending: {filteredTransfers.filter(t => t.status === "Pending").length} |
            Acknowledged: {filteredTransfers.filter(t => t.status === "Acknowledged").length}
          </span>
        </div>
      )}

      {/* Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Transfer Details</DialogTitle>
            <DialogDescription>
              Complete information for transfer request
            </DialogDescription>
          </DialogHeader>
          {selectedTransfer && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <Label className="text-muted-foreground">Transfer ID</Label>
                <p className="font-medium">{selectedTransfer.transferId}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Transfer Date</Label>
                <p className="font-medium">{selectedTransfer.transferDate}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">From Branch</Label>
                <p className="font-medium">{selectedTransfer.fromBranch}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">To Branch</Label>
                <p className="font-medium">{selectedTransfer.toBranch}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Amount</Label>
                <p className="font-medium text-blue-600">₹ {selectedTransfer.amount.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">From Ledger</Label>
                <p className="font-medium">{selectedTransfer.fromLedger}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Transfer Voucher</Label>
                <p className="font-medium">{selectedTransfer.transferVoucher}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <p className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedTransfer.status)}`}>
                  {selectedTransfer.status}
                </p>
              </div>
              <div className="col-span-2">
                <Label className="text-muted-foreground">Remarks</Label>
                <p className="font-medium">{selectedTransfer.remarks}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Close
            </Button>
            {selectedTransfer && (selectedTransfer.status === "UnApproved" || selectedTransfer.status === "Pending") && (
              <>
                <Button
                  onClick={() => {
                    handleApprove(selectedTransfer);
                    setDialogOpen(false);
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Approve Transfer
                </Button>
                <Button
                  onClick={() => {
                    handleReject(selectedTransfer);
                    setDialogOpen(false);
                  }}
                  variant="destructive"
                >
                  Reject Transfer
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}