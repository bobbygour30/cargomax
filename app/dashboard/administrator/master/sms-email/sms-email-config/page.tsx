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
import { Checkbox } from "@/components/ui/checkbox";
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
  Search,
  AlertCircle,
  Mail,
  Smartphone,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ------------------------------
//  Types
// ------------------------------
interface EventConfig {
  id: number;
  eventName: string;
  smsEnabled: boolean;
  emailEnabled: boolean;
  smsTemplate: string;
  emailTemplate: string;
}

// Event list as per requirement
const eventList: Omit<EventConfig, "smsEnabled" | "emailEnabled" | "smsTemplate" | "emailTemplate">[] = [
  { id: 1, eventName: "Booked" },
  { id: 2, eventName: "Pickup Manifest" },
  { id: 3, eventName: "Pickup Received at Hub" },
  { id: 4, eventName: "Dispatched" },
  { id: 5, eventName: "In-Transit" },
  { id: 6, eventName: "Arrived At Destination" },
  { id: 7, eventName: "GatePass Prepared" },
  { id: 8, eventName: "Out For Delivery" },
  { id: 9, eventName: "Delivered" },
  { id: 10, eventName: "Undelivered" },
  { id: 11, eventName: "Booking Cancelled" },
  { id: 12, eventName: "BILLING" },
  { id: 13, eventName: "MONEY RECEIPT" },
  { id: 14, eventName: "EXPENSE APPROVE" },
  { id: 15, eventName: "EXPENSE REJECTION" },
  { id: 16, eventName: "REVERSE MR" },
];

// Mock available templates (would normally come from API)
const smsTemplates = [
  "Booking Confirmation SMS",
  "Dispatch Alert SMS",
  "Delivery SMS",
  "Payment Received SMS",
];
const emailTemplates = [
  "Booking Confirmation Email",
  "Dispatch Alert Email",
  "Delivery Email",
  "Payment Received Email",
];

export default function SmsEmailConfiguration() {
  // Left side settings
  const [smsSenderId, setSmsSenderId] = useState("LOGIXP");
  const [smtpFrom, setSmtpFrom] = useState("INFO@GREENSOFTSOLUTIONS.CO.IN");
  const [hostFrom, setHostFrom] = useState("SMTP.GMAIL.COM");
  const [port, setPort] = useState("587");
  const [sendMailId, setSendMailId] = useState("INFO@GREENSOFTSOLUTIONS.CO.IN");
  const [sendMailPassword, setSendMailPassword] = useState("cxmlzqllgkldmqbb");
  const [enableSsl, setEnableSsl] = useState(false);

  // Right side table data
  const [events, setEvents] = useState<EventConfig[]>(
    eventList.map((e) => ({
      ...e,
      smsEnabled: false,
      emailEnabled: false,
      smsTemplate: "",
      emailTemplate: "",
    }))
  );

  // Search term for filtering events
  const [searchTerm, setSearchTerm] = useState("");
  // Dialog for choosing template
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<number | null>(null);
  const [currentChannel, setCurrentChannel] = useState<"sms" | "email" | null>(
    null
  );

  // Filtered events based on search
  const filteredEvents = events.filter((ev) =>
    ev.eventName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers for checkboxes
  const toggleSms = (id: number) => {
    setEvents(
      events.map((ev) =>
        ev.id === id ? { ...ev, smsEnabled: !ev.smsEnabled } : ev
      )
    );
  };

  const toggleEmail = (id: number) => {
    setEvents(
      events.map((ev) =>
        ev.id === id ? { ...ev, emailEnabled: !ev.emailEnabled } : ev
      )
    );
  };

  // Open template selection dialog
  const openTemplateDialog = (eventId: number, channel: "sms" | "email") => {
    setCurrentEventId(eventId);
    setCurrentChannel(channel);
    setIsTemplateDialogOpen(true);
  };

  // Select a template and update the event
  const selectTemplate = (template: string) => {
    if (currentEventId !== null && currentChannel !== null) {
      setEvents(
        events.map((ev) =>
          ev.id === currentEventId
            ? {
                ...ev,
                [currentChannel === "sms" ? "smsTemplate" : "emailTemplate"]:
                  template,
              }
            : ev
        )
      );
    }
    setIsTemplateDialogOpen(false);
    setCurrentEventId(null);
    setCurrentChannel(null);
  };

  // Save all configurations
  const handleSave = () => {
    // Validate required fields
    if (!smsSenderId) return alert("SMS Sender ID is required");
    if (!smtpFrom) return alert("SMTP Form is required");
    if (!hostFrom) return alert("Host Form is required");
    if (!port) return alert("PORT # is required");
    if (!sendMailId) return alert("SEND Mail ID is required");
    if (!sendMailPassword) return alert("SEND Mail ID PASSWORD is required");

    const config = {
      smsSenderId,
      smtpFrom,
      hostFrom,
      port,
      sendMailId,
      sendMailPassword,
      enableSsl,
      eventConfigs: events,
    };
    console.log("Saving configuration:", config);
    alert("Configuration saved successfully!");
    // Here you would call an API to save the data
  };

  // Reset form (optional)
  const handleReset = () => {
    if (confirm("Reset all settings to default?")) {
      setSmsSenderId("LOGIXP");
      setSmtpFrom("INFO@GREENSOFTSOLUTIONS.CO.IN");
      setHostFrom("SMTP.GMAIL.COM");
      setPort("587");
      setSendMailId("INFO@GREENSOFTSOLUTIONS.CO.IN");
      setSendMailPassword("cxmlzqllgkldmqbb");
      setEnableSsl(false);
      setEvents(
        eventList.map((e) => ({
          ...e,
          smsEnabled: false,
          emailEnabled: false,
          smsTemplate: "",
          emailTemplate: "",
        }))
      );
      setSearchTerm("");
    }
  };

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">
          SMS/EMAIL CONFIGURATION
        </h1>
        <div className="mt-1 text-[10px] md:text-xs text-muted-foreground">
          Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD | Login By :
          MAYANK.GRLOGISTICS@GMAIL.COM | Login Branch : CORPORATE OFFICE | FY :
          2026-2027
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT SIDE - Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-5 w-5" /> Configuration Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* SMS Settings */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Smartphone className="h-4 w-4" /> SMS Settings
              </h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">
                    Your SMS Sender ID <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={smsSenderId}
                    onChange={(e) => setSmsSenderId(e.target.value)}
                    className="h-8 text-xs"
                    placeholder="e.g., LOGIXP"
                  />
                </div>
              </div>
            </div>

            {/* Email Settings */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Mail className="h-4 w-4" /> Email Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">
                    SMTP Form <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={smtpFrom}
                    onChange={(e) => setSmtpFrom(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">
                    Host Form <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={hostFrom}
                    onChange={(e) => setHostFrom(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">
                    PORT # <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={port}
                    onChange={(e) => setPort(e.target.value)}
                    className="h-8 text-xs"
                    type="number"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">
                    SEND Mail ID <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={sendMailId}
                    onChange={(e) => setSendMailId(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">
                    SEND Mail ID PASSWORD <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="password"
                    value={sendMailPassword}
                    onChange={(e) => setSendMailPassword(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Checkbox
                    checked={enableSsl}
                    onCheckedChange={(checked) => setEnableSsl(!!checked)}
                    id="ssl"
                  />
                  <Label htmlFor="ssl" className="text-xs cursor-pointer">
                    Enable SSL
                  </Label>
                </div>
              </div>
            </div>

            {/* Update Button */}
            <div className="flex justify-end pt-2">
              <Button
                onClick={handleSave}
                size="sm"
                className="h-8 text-xs bg-green-600"
              >
                <Save className="mr-1 h-3.5 w-3.5" />
                UPDATE
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* RIGHT SIDE - Events Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notification Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* SMS To Select + Search */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">
                  SMS To <span className="text-red-500">*</span>
                </Label>
                <Select defaultValue="">
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="consignor">Consignor</SelectItem>
                    <SelectItem value="consignee">Consignee</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">
                  Select <span className="text-red-500">*</span>
                </Label>
                <Select defaultValue="">
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="active">Active Only</SelectItem>
                    <SelectItem value="inactive">Inactive Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 h-8 text-xs"
                />
              </div>
            </div>

            {/* Events Table */}
            <div className="rounded-md border overflow-x-auto">
              <div className="min-w-[700px]">
                <Table className="text-xs">
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-12 text-center">S#</TableHead>
                      <TableHead>Events</TableHead>
                      <TableHead className="text-center w-16">SMS</TableHead>
                      <TableHead className="min-w-[120px]">
                        Choose Template
                      </TableHead>
                      <TableHead className="text-center w-16">Email</TableHead>
                      <TableHead className="min-w-[120px]">
                        Choose Template
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No events found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEvents.map((event, idx) => (
                        <TableRow key={event.id} className="hover:bg-muted/30">
                          <TableCell className="text-center">{idx + 1}</TableCell>
                          <TableCell className="font-medium">
                            {event.eventName}
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox
                              checked={event.smsEnabled}
                              onCheckedChange={() => toggleSms(event.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1 items-center">
                              <Input
                                value={event.smsTemplate}
                                readOnly
                                placeholder="Select template"
                                className="h-7 text-xs flex-1 bg-muted"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  openTemplateDialog(event.id, "sms")
                                }
                                className="h-7 px-2 text-xs"
                              >
                                Choose
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox
                              checked={event.emailEnabled}
                              onCheckedChange={() => toggleEmail(event.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1 items-center">
                              <Input
                                value={event.emailTemplate}
                                readOnly
                                placeholder="Select template"
                                className="h-7 text-xs flex-1 bg-muted"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  openTemplateDialog(event.id, "email")
                                }
                                className="h-7 px-2 text-xs"
                              >
                                Choose
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

            {/* Reset/Update buttons (optional) */}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                onClick={handleReset}
                variant="outline"
                size="sm"
                className="h-8 text-xs"
              >
                <RefreshCw className="mr-1 h-3.5 w-3.5" />
                RESET
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Template Selection Dialog */}
      <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Select {currentChannel === "sms" ? "SMS" : "Email"} Template
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            {(currentChannel === "sms" ? smsTemplates : emailTemplates).map(
              (template) => (
                <Button
                  key={template}
                  variant="outline"
                  className="w-full justify-start text-xs"
                  onClick={() => selectTemplate(template)}
                >
                  {template}
                </Button>
              )
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsTemplateDialogOpen(false)}
            >
              Cancel
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
              <li>All fields marked with * are mandatory.</li>
              <li>SMS Sender ID must be registered with your SMS provider.</li>
              <li>SMTP settings must be correct for email delivery.</li>
              <li>Enable events by checking SMS / Email checkboxes.</li>
              <li>Click "Choose" to select a template for each event.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}