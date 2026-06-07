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
import { RefreshCw, AlertCircle, Save } from "lucide-react";

interface GstParameter {
  id: number;
  particular: string;
  info: string;
  value: string;
  isReadOnly?: boolean; // flag to mark read-only rows
}

export default function GSTConfigurationMaster() {
  const [gstNumber, setGstNumber] = useState("");
  const [registeredUnderGst, setRegisteredUnderGst] = useState("Yes");
  const [gstReturnFromSoftware, setGstReturnFromSoftware] = useState("No");
  const [freightExempted, setFreightExempted] = useState("751");

  const [parameters, setParameters] = useState<GstParameter[]>([
    { id: 1, particular: "CGST INVOICE CODE", info: "", value: "14", isReadOnly: false },
    { id: 2, particular: "COMPANY GST NUMBER", info: "", value: "", isReadOnly: false },
    { id: 3, particular: "DEFAULT GST CATEGROY ID", info: "", value: "3", isReadOnly: false },
    { id: 4, particular: "DEFAULT GST CATEGORY ID FOR EXEMPTION", info: "", value: "1", isReadOnly: false },
    { id: 5, particular: "COMPANY REGISTERED UNDER GST, GST WILL BE CHARGED", info: "", value: "Y", isReadOnly: false },
    { id: 6, particular: "ACTIVATE NEW PROCESS FOR GST APPLICABLE", info: "", value: "N", isReadOnly: false },
    { id: 7, particular: "GST EXEMPTION SACCODE", info: "", value: "996721", isReadOnly: false },
    { id: 8, particular: "GST APPLICABLE FREIGHT VALUE", info: "", value: "751", isReadOnly: false },
    { id: 9, particular: "GST RETURN ON BILL", info: "", value: "N", isReadOnly: false },
  ]);

  const updateParameter = (id: number, newValue: string) => {
    setParameters(prev =>
      prev.map(param =>
        param.id === id && !param.isReadOnly ? { ...param, value: newValue } : param
      )
    );
  };

  const handleRefreshFreightExempted = () => {
    alert("Freight Exempted value refreshed!");
    setFreightExempted("751");
  };

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">GST CONFIGURATION MASTER</h1>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[10px] md:text-xs text-muted-foreground">
          <span>Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
          <span>Login By : MAYANK.GRLOGISTICS@GMAIL.COM</span>
          <span>Login Branch : CORPORATE OFFICE</span>
          <span>Financial Year : 2026-2027</span>
        </div>
      </div>

      {/* Configuration Form */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">GST Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <Label className="text-xs">GST #</Label>
              <Input value={gstNumber} onChange={(e)=>setGstNumber(e.target.value)}  placeholder="07AAGCG5997B1ZE"  className="h-8 text-xs bg-muted" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Registered Under GST</Label>
              <Select value={registeredUnderGst} onValueChange={setRegisteredUnderGst}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">GST Return From Software</Label>
              <Select value={gstReturnFromSoftware} onValueChange={setGstReturnFromSoftware}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Freight Exempted</Label>
              <div className="flex gap-2">
                <Input
                  value={freightExempted}
                  onChange={(e) => setFreightExempted(e.target.value)}
                  className="h-8 text-xs flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={handleRefreshFreightExempted}
                  title="Refresh"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parameters Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">GST Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[600px]">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12 text-center">S#</TableHead>
                    <TableHead>Particular</TableHead>
                    <TableHead>Info</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead className="w-24 text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parameters.map((param, idx) => (
                    <TableRow key={param.id} className="hover:bg-muted/30">
                      <TableCell className="text-center">{idx + 1}</TableCell>
                      <TableCell className="font-medium">{param.particular}</TableCell>
                      <TableCell>{param.info || "-"}</TableCell>
                      <TableCell>
                        {param.isReadOnly ? (
                          // Display as plain text (like a placeholder, non-editable)
                          <div className="px-2 py-1 bg-muted/30 rounded font-mono text-xs">
                            {param.value}
                          </div>
                        ) : (
                          <Input
                            value={param.value}
                            onChange={(e) => updateParameter(param.id, e.target.value)}
                            className="h-7 w-32 text-xs"
                          />
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (param.isReadOnly) {
                              alert("This value is system‑generated and cannot be changed.");
                            } else {
                              alert(`${param.particular} updated to ${param.value}`);
                            }
                          }}
                          className="h-7 px-2 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200"
                          disabled={param.isReadOnly}
                        >
                          <Save className="h-3 w-3 mr-1" />
                          Update
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Note */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 rounded-md p-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
          <div className="text-xs text-blue-700 dark:text-blue-400">
            <p className="font-medium">Note:</p>
            <ul className="list-disc list-inside mt-1 space-y-0.5">
              <li>GST # and COMPANY GST NUMBER are read‑only system values.</li>
              <li>Other parameters can be edited; click the Update button to save each row.</li>
              <li>The refresh button next to Freight Exempted reloads its default value.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}