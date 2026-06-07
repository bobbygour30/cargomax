"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  XCircle,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Search,
  FileText,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Document Types Options
const documentTypeOptions = [
  { value: "AGPYA", label: "Agency Payment Advice" },
  { value: "B", label: "BILL" },
  { value: "BILLC", label: "BILL CANCEL" },
  { value: "CNOTE", label: "CREDIT NOTE" },
  { value: "CREXP", label: "CROSSING EXPENSE" },
  { value: "C", label: "CROSSING MANIFEST" },
  { value: "DDR", label: "DDR" },
  { value: "DNOTE", label: "DEBIT NOTE" },
  { value: "D", label: "DELIVERY RECEIPT" },
  { value: "T", label: "DELIVERY TRIP SHEET" },
  { value: "DRVAD", label: "DRIVER ADVANCE" },
  { value: "DRVTS", label: "DRIVER PAYABLE / RECEIVABLE" },
  { value: "LOAN", label: "EMPLOYEE LOAN" },
  { value: "FLADV", label: "FUEL ADVANCE" },
  { value: "FT", label: "FUND TRANSFER" },
  { value: "FTACK", label: "FUND TRANSFER ACKNOWLEDGEMENT" },
  { value: "G", label: "GR" },
  { value: "INTCN", label: "INTERNATIONAL CONSIGNMENT NOTE" },
  { value: "LPYMT", label: "LABOUR PAYMENT" },
  { value: "I", label: "LOCAL MANIFEST" },
  { value: "O", label: "LONG ROUTE MANIFEST" },
  { value: "LHXP", label: "LORRY HIRE ADDITIONAL EXPENSE" },
  { value: "ATH", label: "LORRY HIRE ADVANCE PAYMENT" },
  { value: "BTH", label: "LORRY HIRE BALANCE PAYMENT" },
  { value: "L", label: "LORRY HIRE CHALLAN" },
  { value: "LHP", label: "LORRY HIRE PAYMENT" },
  { value: "LPR", label: "LORRY HIRE PAYMENT REVERSAL" },
  { value: "BTSAR", label: "LORRY HIRE TRIP SETTLEMENT" },
  { value: "OPSPY", label: "OPERATIONAL EXPENSE PAYMENT" },
  { value: "PFBL", label: "PF BILL" },
  { value: "POSTS", label: "POST SALARY" },
  { value: "REVMR", label: "REVERSEMR" },
  { value: "SPYMT", label: "SALARY PAYMENT" },
  { value: "TDSC", label: "TDS CHALLAN" },
  { value: "U", label: "TOUR & TRAVEL" },
  { value: "TRPAD", label: "TRIP ADVANCE" },
  { value: "TRIPC", label: "TRIP COLLECTION" },
  { value: "TE", label: "TRIP EXPENSE" },
  { value: "VLOAN", label: "VEHICLE LOAN" },
  { value: "VPR", label: "VENDOR PAYMENT REVERSAL" },
];

interface DocumentInfo {
  documentType: string;
  documentNumber: string;
  reason: string;
  status: "active" | "cancelled";
  documentDate?: string;
  amount?: number;
  partyName?: string;
}

export default function DocumentCancelUncancel() {
  const [documentType, setDocumentType] = useState<string>("");
  const [documentNumber, setDocumentNumber] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [documentInfo, setDocumentInfo] = useState<DocumentInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false);
  const [actionType, setActionType] = useState<"cancel" | "uncancel" | "delete">("cancel");
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false);

  const handleSearch = () => {
    if (!documentType) {
      alert("Please select Document Type");
      return;
    }
    if (!documentNumber) {
      alert("Please enter Document Number");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const sampleDoc: DocumentInfo = {
        documentType: documentType,
        documentNumber: documentNumber,
        reason: "",
        status: "active",
        documentDate: "2026-05-09",
        amount: Math.random() * 50000,
        partyName: "Sample Party Name",
      };
      setDocumentInfo(sampleDoc);
      setSearchPerformed(true);
      setLoading(false);
    }, 500);
  };

  const handleClear = () => {
    setDocumentType("");
    setDocumentNumber("");
    setReason("");
    setDocumentInfo(null);
    setSearchPerformed(false);
  };

  const handleDelete = () => {
    if (!documentInfo) {
      alert("No document selected to delete");
      return;
    }
    setActionType("delete");
    setIsConfirmDialogOpen(true);
  };

  const handleCancel = () => {
    if (!reason.trim()) {
      alert("Please enter reason for cancellation");
      return;
    }
    setActionType("cancel");
    setIsConfirmDialogOpen(true);
  };

  const handleUncancel = () => {
    if (!documentInfo) {
      alert("No document selected to uncancel");
      return;
    }
    setActionType("uncancel");
    setIsConfirmDialogOpen(true);
  };

  const confirmAction = () => {
    if (actionType === "cancel") {
      setDocumentInfo(prev => prev ? { ...prev, status: "cancelled", reason: reason } : null);
      alert(`Document ${documentNumber} has been cancelled successfully!`);
    } else if (actionType === "uncancel") {
      setDocumentInfo(prev => prev ? { ...prev, status: "active", reason: "" } : null);
      alert(`Document ${documentNumber} has been uncancelled successfully!`);
    } else if (actionType === "delete") {
      setDocumentInfo(null);
      setSearchPerformed(false);
      setDocumentNumber("");
      setDocumentType("");
      alert(`Document ${documentNumber} has been deleted successfully!`);
    }
    setIsConfirmDialogOpen(false);
    setReason("");
  };

  const getDocumentTypeLabel = (value: string) => {
    const option = documentTypeOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">
          <CheckCircle className="h-3 w-3" />
          ACTIVE
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs">
          <XCircle className="h-3 w-3" />
          CANCELLED
        </span>
      );
    }
  };

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">DOCUMENT CANCEL / UNCANCEL</h1>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[10px] md:text-xs text-muted-foreground">
          <span>Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
          <span>Login By : MAYANK.GRLOGISTICS@GMAIL.COM</span>
          <span>Login Branch : CORPORATE OFFICE</span>
          <span>Financial Year : 2026-2027</span>
        </div>
      </div>

      {/* Main Form Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Document Information
          </CardTitle>
          <CardDescription className="text-xs">
            Select document type, enter document number and reason to cancel/uncancel/delete
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Document Type and Document Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Document Type Select */}
            <div className="space-y-1">
              <Label className="text-xs font-medium">
                Document Type <span className="text-red-500">*</span>
              </Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select Document Type" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {documentTypeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Document Number Input */}
            <div className="space-y-1">
              <Label className="text-xs font-medium">
                Document Number <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  placeholder="Enter Document Number"
                  className="h-9 text-xs flex-1"
                />
                <Button
                  onClick={handleSearch}
                  size="sm"
                  className="h-9 text-xs"
                  disabled={loading}
                >
                  {loading ? (
                    <RefreshCw className="mr-1 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Search className="mr-1 h-3.5 w-3.5" />
                  )}
                  Search
                </Button>
              </div>
            </div>
          </div>

          {/* Document Details Display */}
          {searchPerformed && documentInfo && (
            <div className="border rounded-lg p-4 bg-muted/20 mt-2">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Document Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <Label className="text-[10px] text-muted-foreground">Document Type</Label>
                  <p className="text-sm font-medium">{getDocumentTypeLabel(documentInfo.documentType)}</p>
                </div>
                <div>
                  <Label className="text-[10px] text-muted-foreground">Document Number</Label>
                  <p className="text-sm font-mono font-medium">{documentInfo.documentNumber}</p>
                </div>
                <div>
                  <Label className="text-[10px] text-muted-foreground">Document Date</Label>
                  <p className="text-sm">{documentInfo.documentDate || "-"}</p>
                </div>
                <div>
                  <Label className="text-[10px] text-muted-foreground">Status</Label>
                  <div>{getStatusBadge(documentInfo.status)}</div>
                </div>
                <div>
                  <Label className="text-[10px] text-muted-foreground">Amount</Label>
                  <p className="text-sm">₹{documentInfo.amount?.toLocaleString() || "0"}</p>
                </div>
                <div>
                  <Label className="text-[10px] text-muted-foreground">Party Name</Label>
                  <p className="text-sm">{documentInfo.partyName || "-"}</p>
                </div>
              </div>
            </div>
          )}

          {/* No Document Found */}
          {searchPerformed && !documentInfo && (
            <div className="border rounded-lg p-4 bg-yellow-50 dark:bg-yellow-950/20 text-center">
              <AlertCircle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                No document found with the given Document Type and Document Number.
              </p>
            </div>
          )}

          {/* Reason Input (for cancellation) */}
          {documentInfo && documentInfo.status === "active" && (
            <div className="space-y-1">
              <Label className="text-xs font-medium">
                Reason <span className="text-red-500">*</span>
              </Label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for cancellation..."
                rows={3}
                className="text-xs resize-none"
              />
            </div>
          )}

          {/* Action Buttons - Cancel, Uncancel, Clear, Delete */}
          <div className="flex flex-wrap justify-end gap-3 pt-4 border-t">
            {/* Cancel Button - shows only when document is active */}
            {documentInfo && documentInfo.status === "active" && (
              <Button
                onClick={handleCancel}
                size="sm"
                className="h-9 text-xs bg-red-600 hover:bg-red-700"
              >
                <XCircle className="mr-1 h-4 w-4" />
                CANCEL
              </Button>
            )}

            {/* Uncancel Button - shows only when document is cancelled */}
            {documentInfo && documentInfo.status === "cancelled" && (
              <Button
                onClick={handleUncancel}
                size="sm"
                className="h-9 text-xs bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="mr-1 h-4 w-4" />
                UNCANCEL
              </Button>
            )}

            {/* Delete Button */}
            <Button
              onClick={handleDelete}
              variant="destructive"
              size="sm"
              className="h-9 text-xs"
              disabled={!documentInfo}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              DELETE
            </Button>

            {/* Clear Button */}
            <Button
              onClick={handleClear}
              variant="outline"
              size="sm"
              className="h-9 text-xs"
            >
              <RefreshCw className="mr-1 h-4 w-4" />
              CLEAR
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {actionType === "cancel" && (
                <>
                  <XCircle className="h-5 w-5 text-red-600" />
                  Confirm Cancellation
                </>
              )}
              {actionType === "uncancel" && (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Confirm Uncancellation
                </>
              )}
              {actionType === "delete" && (
                <>
                  <Trash2 className="h-5 w-5 text-red-600" />
                  Confirm Deletion
                </>
              )}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "cancel" && (
                <>
                  Are you sure you want to cancel document <strong>{documentNumber}</strong>?
                  <br />
                  This action cannot be undone.
                  {reason && (
                    <div className="mt-2 p-2 bg-muted rounded text-xs">
                      <strong>Reason:</strong> {reason}
                    </div>
                  )}
                </>
              )}
              {actionType === "uncancel" && (
                <>
                  Are you sure you want to uncancel document <strong>{documentNumber}</strong>?
                  <br />
                  This will restore the document to active status.
                </>
              )}
              {actionType === "delete" && (
                <>
                  Are you sure you want to permanently delete document <strong>{documentNumber}</strong>?
                  <br />
                  This action cannot be undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-8 text-xs">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              className={cn(
                "h-8 text-xs",
                (actionType === "cancel" || actionType === "delete") 
                  ? "bg-red-600 hover:bg-red-700" 
                  : "bg-green-600 hover:bg-green-700"
              )}
            >
              {actionType === "cancel" && "Yes, Cancel Document"}
              {actionType === "uncancel" && "Yes, Uncancel Document"}
              {actionType === "delete" && "Yes, Delete Document"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

     
    </div>
  );
}