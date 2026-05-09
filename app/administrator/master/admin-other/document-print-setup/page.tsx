"use client";

import React, { useState } from "react";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Save,
  RefreshCw,
  Eye,
  Printer,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Document Name Options
const documentNameOptions = [
  { value: "G", label: "GR" },
  { value: "I", label: "LOCAL MANIFEST" },
  { value: "O", label: "LONG ROUTE MANIFEST" },
  { value: "L", label: "LORRY HIRE CHALLAN" },
  { value: "B", label: "BILL" },
];

// Print Format Options
const printFormatOptions = [
  { value: "STANDARD", label: "Standard Format" },
  { value: "THERMAL", label: "Thermal Print Format" },
  { value: "A4", label: "A4 Size Format" },
  { value: "LETTER", label: "Letter Size Format" },
  { value: "CUSTOM", label: "Custom Format" },
];

// Current Print Format Options
const currentPrintFormatOptions = [
  { value: "STANDARD", label: "Standard Format" },
  { value: "THERMAL", label: "Thermal Print Format" },
  { value: "A4", label: "A4 Size Format" },
  { value: "LETTER", label: "Letter Size Format" },
];

interface DocumentPrintSetup {
  id: number;
  documentName: string;
  currentPrintFormat: string;
  printFormat: string;
  documentLabel: string;
}

export default function DocumentPrintSetupMaster() {
  const [documentName, setDocumentName] = useState<string>("");
  const [currentPrintFormat, setCurrentPrintFormat] = useState<string>("");
  const [printFormat, setPrintFormat] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
  const [savedRecords, setSavedRecords] = useState<DocumentPrintSetup[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

  const getDocumentLabel = (value: string) => {
    const option = documentNameOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  const handleSave = () => {
    if (!documentName) {
      alert("Please select Document Name");
      return;
    }
    if (!currentPrintFormat) {
      alert("Please select Current Print Format");
      return;
    }
    if (!printFormat) {
      alert("Please select Print Format");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const newRecord: DocumentPrintSetup = {
        id: editId || Date.now(),
        documentName: documentName,
        currentPrintFormat: currentPrintFormat,
        printFormat: printFormat,
        documentLabel: getDocumentLabel(documentName),
      };

      if (editId) {
        setSavedRecords(savedRecords.map(record => record.id === editId ? newRecord : record));
        alert("Print format updated successfully!");
      } else {
        setSavedRecords([...savedRecords, newRecord]);
        alert("Print format saved successfully!");
      }
      
      handleClear();
      setLoading(false);
    }, 500);
  };

  const handleClear = () => {
    setDocumentName("");
    setCurrentPrintFormat("");
    setPrintFormat("");
    setEditId(null);
  };

  const handleViewPrintFormat = () => {
    if (!documentName) {
      alert("Please select Document Name first");
      return;
    }
    setIsPreviewModalOpen(true);
  };

  const getPrintPreviewContent = () => {
    const docLabel = getDocumentLabel(documentName);
    const formatLabel = printFormatOptions.find(opt => opt.value === printFormat)?.label || "Standard Format";
    
    return (
      <div className="space-y-4">
        <div className="text-center border-b pb-2">
          <h3 className="font-bold text-lg">{docLabel}</h3>
          <p className="text-xs text-muted-foreground">Print Preview - {formatLabel}</p>
        </div>
        
        {/* Sample Print Preview based on document type */}
        {documentName === "G" && (
          <div className="space-y-2 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div><strong>GR No:</strong> GR-2026-001</div>
              <div><strong>Date:</strong> 09-05-2026</div>
              <div><strong>Origin:</strong> DELHI</div>
              <div><strong>Destination:</strong> MUMBAI</div>
              <div><strong>Consignor:</strong> ABC Traders</div>
              <div><strong>Consignee:</strong> XYZ Enterprises</div>
              <div><strong>Pckgs:</strong> 50</div>
              <div><strong>Weight:</strong> 2500 kg</div>
              <div><strong>Freight:</strong> ₹15,000.00</div>
            </div>
          </div>
        )}

        {documentName === "I" && (
          <div className="space-y-2 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div><strong>Manifest No:</strong> I110001263</div>
              <div><strong>Date:</strong> 09-05-2026</div>
              <div><strong>Branch:</strong> DELHI</div>
              <div><strong>To Station:</strong> MUMBAI</div>
              <div><strong>Vehicle No:</strong> UP14AB1234</div>
              <div><strong>Driver:</strong> Rajesh Kumar</div>
              <div><strong>No of Pckgs:</strong> 60</div>
              <div><strong>Gross Weight:</strong> 3090 kg</div>
            </div>
          </div>
        )}

        {documentName === "O" && (
          <div className="space-y-2 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div><strong>Manifest No:</strong> LR001</div>
              <div><strong>Date:</strong> 09-05-2026</div>
              <div><strong>From Station:</strong> DELHI</div>
              <div><strong>To Station:</strong> MUMBAI</div>
              <div><strong>Vehicle No:</strong> UP14AB1234</div>
              <div><strong>Driver:</strong> Rajesh Kumar</div>
              <div><strong>Dispatched Pckgs:</strong> 50</div>
              <div><strong>Dispatched Wt:</strong> 2500 kg</div>
            </div>
          </div>
        )}

        {documentName === "L" && (
          <div className="space-y-2 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div><strong>LHC No:</strong> LHC001</div>
              <div><strong>Date:</strong> 09-05-2026</div>
              <div><strong>Branch:</strong> DELHI</div>
              <div><strong>Vehicle No:</strong> UP14AB1234</div>
              <div><strong>Driver:</strong> Rajesh Kumar</div>
              <div><strong>Route:</strong> DELHI-MUMBAI</div>
              <div><strong>Hire Freight:</strong> ₹15,000.00</div>
            </div>
          </div>
        )}

        {documentName === "B" && (
          <div className="space-y-2 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div><strong>Bill No:</strong> INV-2026-001</div>
              <div><strong>Date:</strong> 09-05-2026</div>
              <div><strong>Customer:</strong> ABC Traders</div>
              <div><strong>Amount:</strong> ₹15,000.00</div>
              <div><strong>GST:</strong> ₹2,700.00</div>
              <div><strong>Total:</strong> ₹17,700.00</div>
            </div>
          </div>
        )}

        <div className="border-t pt-2 mt-2 text-center text-[10px] text-muted-foreground">
          This is a sample preview. Actual print may vary based on format settings.
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">DOCUMENT PRINT SETUP MASTER</h1>
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
            <Printer className="h-5 w-5 text-primary" />
            Document Print Setup
          </CardTitle>
          <CardDescription className="text-xs">
            Configure print format settings for different documents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Document Name */}
          <div className="space-y-1">
            <Label className="text-xs font-medium">
              Document Name <span className="text-red-500">*</span>
            </Label>
            <Select value={documentName} onValueChange={setDocumentName}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select Document Name" />
              </SelectTrigger>
              <SelectContent>
                {documentNameOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Current Print Format */}
          <div className="space-y-1">
            <Label className="text-xs font-medium">
              Current Print Format <span className="text-red-500">*</span>
            </Label>
            <Select value={currentPrintFormat} onValueChange={setCurrentPrintFormat}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select Current Print Format" />
              </SelectTrigger>
              <SelectContent>
                {currentPrintFormatOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Print Format */}
          <div className="space-y-1">
            <Label className="text-xs font-medium">
              Print Format <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Select value={printFormat} onValueChange={setPrintFormat}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select Print Format" />
                  </SelectTrigger>
                  <SelectContent>
                    {printFormatOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleViewPrintFormat}
                variant="outline"
                size="sm"
                className="h-9 text-xs"
                disabled={!documentName}
              >
                <Eye className="mr-1 h-3.5 w-3.5" />
                View Print Format
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              onClick={handleSave}
              size="sm"
              className="h-9 text-xs bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? (
                <RefreshCw className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-1 h-4 w-4" />
              )}
              SAVE
            </Button>
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

      {/* View Print Format Modal */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center gap-2">
              <Printer className="h-5 w-5" />
              Print Preview - {getDocumentLabel(documentName)}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {getPrintPreviewContent()}
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsPreviewModalOpen(false)}>
              Close
            </Button>
            <Button size="sm" className="bg-blue-600" onClick={() => alert("Print initiated!")}>
              <Printer className="mr-1 h-4 w-4" />
              Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Saved Configurations List */}
      {savedRecords.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Saved Configurations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {savedRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-2 border rounded-md hover:bg-muted/30 cursor-pointer"
                  onClick={() => {
                    setDocumentName(record.documentName);
                    setCurrentPrintFormat(record.currentPrintFormat);
                    setPrintFormat(record.printFormat);
                    setEditId(record.id);
                  }}
                >
                  <div>
                    <p className="text-sm font-medium">{record.documentLabel}</p>
                    <p className="text-xs text-muted-foreground">
                      Format: {record.printFormat} | Current: {record.currentPrintFormat}
                    </p>
                  </div>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Note */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 rounded-md p-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
          <div className="text-xs text-blue-700 dark:text-blue-400">
            <p className="font-medium">Note:</p>
            <ul className="list-disc list-inside mt-1 space-y-0.5">
              <li>Select Document Name to configure print format</li>
              <li>Current Print Format shows the currently active format</li>
              <li>Print Format allows you to change to a different format</li>
              <li>Click View Print Format to see preview before saving</li>
              <li>Saved configurations can be edited by clicking on them</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}