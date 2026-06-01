// app/operations/spoke-confi/page.tsx
"use client";

import React, { useState, useEffect } from "react";
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
    CalendarIcon,
    Search,
    Plus,
    Edit,
    Trash2,
    Save,
    X,
    RefreshCw,
    Send,
    Mail,
    Filter,
    ChevronLeft,
    ChevronRight,
    MapPin,
    Phone,
    Mail as MailIcon,
    User,
    Building2,
    Navigation,
} from "lucide-react";
import { format } from "date-fns";

// Types
interface SpokeConfig {
    id: number;
    spokeCode: string;
    spokeName: string;
    spokeType: string;
    hubId: number;
    hubName: string;
    region: string;
    zone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    contactPerson: string;
    contactNumber: string;
    alternateNumber: string;
    email: string;
    gstNo: string;
    panNo: string;
    latitude: string;
    longitude: string;
    radius: number;
    serviceablePincodes: string[];
    deliveryTimeHours: number;
    pickupAvailable: boolean;
    deliveryAvailable: boolean;
    cashOnDelivery: boolean;
    status: "active" | "inactive" | "maintenance";
    capacity: number;
    currentLoad: number;
    createdAt: Date;
    updatedAt: Date;
}

// Options
const spokeTypeOptions = [
    { value: "DELIVERY_SPOKE", label: "Delivery Spoke" },
    { value: "PICKUP_SPOKE", label: "Pickup Spoke" },
    { value: "BOTH_SPOKE", label: "Both (Pickup & Delivery)" },
    { value: "MICRO_SPOKE", label: "Micro Spoke" },
];

const regionOptions = [
    "North Region",
    "South Region",
    "East Region",
    "West Region",
    "Central Region",
    "North-East Region",
];

const zoneOptions = [
    "Zone 1 - Delhi NCR",
    "Zone 2 - Mumbai",
    "Zone 3 - Bangalore",
    "Zone 4 - Chennai",
    "Zone 5 - Kolkata",
    "Zone 6 - Hyderabad",
    "Zone 7 - Ahmedabad",
    "Zone 8 - Pune",
];

const stateOptions = [
    "Delhi", "Maharashtra", "Karnataka", "Tamil Nadu", "West Bengal",
    "Uttar Pradesh", "Gujarat", "Rajasthan", "Punjab", "Haryana",
    "Telangana", "Kerala", "Bihar", "Madhya Pradesh", "Assam"
];

const statusOptions = [
    { value: "active", label: "Active", color: "bg-green-500" },
    { value: "inactive", label: "Inactive", color: "bg-gray-500" },
    { value: "maintenance", label: "Maintenance", color: "bg-orange-500" },
];

// Sample Hub Data
const hubOptions = [
    { id: 1, name: "Delhi Main Hub", code: "HUB001" },
    { id: 2, name: "Mumbai Gateway Hub", code: "HUB002" },
    { id: 3, name: "Bangalore Tech Hub", code: "HUB003" },
    { id: 4, name: "Chennai Port Hub", code: "HUB004" },
    { id: 5, name: "Kolkata Eastern Hub", code: "HUB005" },
];

// Sample Data
const sampleData: SpokeConfig[] = [
    { id: 1, spokeCode: "SPK001", spokeName: "Delhi North Spoke", spokeType: "BOTH_SPOKE", hubId: 1, hubName: "Delhi Main Hub", region: "North Region", zone: "Zone 1 - Delhi NCR", address: "Sector 15, Rohini", city: "Delhi", state: "Delhi", pincode: "110085", country: "India", contactPerson: "Rajesh Kumar", contactNumber: "9876543210", alternateNumber: "9876543211", email: "delhi-north.spoke@cargomax.com", gstNo: "07ABCDE1234F1Z5", panNo: "ABCDE1234F", latitude: "28.7199", longitude: "77.1245", radius: 15, serviceablePincodes: ["110001", "110002", "110003", "110085", "110086"], deliveryTimeHours: 4, pickupAvailable: true, deliveryAvailable: true, cashOnDelivery: true, status: "active", capacity: 2000, currentLoad: 1200, createdAt: new Date("2025-01-01"), updatedAt: new Date("2025-01-01") },
    { id: 2, spokeCode: "SPK002", spokeName: "Mumbai West Spoke", spokeType: "DELIVERY_SPOKE", hubId: 2, hubName: "Mumbai Gateway Hub", region: "West Region", zone: "Zone 2 - Mumbai", address: "Andheri West", city: "Mumbai", state: "Maharashtra", pincode: "400053", country: "India", contactPerson: "Suresh Patil", contactNumber: "9876543220", alternateNumber: "", email: "mumbai-west.spoke@cargomax.com", gstNo: "27FGHIJ5678K1Z6", panNo: "FGHIJ5678K", latitude: "19.1190", longitude: "72.8468", radius: 12, serviceablePincodes: ["400001", "400053", "400054", "400055"], deliveryTimeHours: 3, pickupAvailable: false, deliveryAvailable: true, cashOnDelivery: true, status: "active", capacity: 1500, currentLoad: 800, createdAt: new Date("2025-01-15"), updatedAt: new Date("2025-01-15") },
    { id: 3, spokeCode: "SPK003", spokeName: "Bangalore East Spoke", spokeType: "PICKUP_SPOKE", hubId: 3, hubName: "Bangalore Tech Hub", region: "South Region", zone: "Zone 3 - Bangalore", address: "Indiranagar", city: "Bangalore", state: "Karnataka", pincode: "560038", country: "India", contactPerson: "Venkatesh", contactNumber: "9876543230", alternateNumber: "9876543231", email: "bangalore-east.spoke@cargomax.com", gstNo: "29KLMNO9012P1Z7", panNo: "KLMNO9012P", latitude: "12.9784", longitude: "77.6408", radius: 10, serviceablePincodes: ["560001", "560038", "560039", "560040"], deliveryTimeHours: 2, pickupAvailable: true, deliveryAvailable: false, cashOnDelivery: false, status: "active", capacity: 1000, currentLoad: 600, createdAt: new Date("2025-02-01"), updatedAt: new Date("2025-02-01") },
    { id: 4, spokeCode: "SPK004", spokeName: "Chennai South Spoke", spokeType: "MICRO_SPOKE", hubId: 4, hubName: "Chennai Port Hub", region: "South Region", zone: "Zone 4 - Chennai", address: "Adyar", city: "Chennai", state: "Tamil Nadu", pincode: "600020", country: "India", contactPerson: "Murugan", contactNumber: "9876543240", alternateNumber: "", email: "chennai-south.spoke@cargomax.com", gstNo: "33PQRST3456U1Z8", panNo: "PQRST3456U", latitude: "13.0060", longitude: "80.2540", radius: 8, serviceablePincodes: ["600001", "600020", "600021"], deliveryTimeHours: 2, pickupAvailable: true, deliveryAvailable: true, cashOnDelivery: true, status: "maintenance", capacity: 500, currentLoad: 0, createdAt: new Date("2025-02-15"), updatedAt: new Date("2025-02-15") },
    { id: 5, spokeCode: "SPK005", spokeName: "Kolkata Central Spoke", spokeType: "BOTH_SPOKE", hubId: 5, hubName: "Kolkata Eastern Hub", region: "East Region", zone: "Zone 5 - Kolkata", address: "Salt Lake City", city: "Kolkata", state: "West Bengal", pincode: "700064", country: "India", contactPerson: "Sourav Das", contactNumber: "9876543250", alternateNumber: "9876543251", email: "kolkata-central.spoke@cargomax.com", gstNo: "19UVWXY7890Z1Z9", panNo: "UVWXY7890Z", latitude: "22.5800", longitude: "88.4360", radius: 14, serviceablePincodes: ["700001", "700064", "700065", "700066"], deliveryTimeHours: 3, pickupAvailable: true, deliveryAvailable: true, cashOnDelivery: true, status: "active", capacity: 1200, currentLoad: 900, createdAt: new Date("2025-03-01"), updatedAt: new Date("2025-03-01") },
];

// Email Modal Component
function EmailModal({ isOpen, onClose, onSend }: { isOpen: boolean; onClose: () => void; onSend: (data: { to: string; subject: string; body: string }) => void }) {
    const [emailTo, setEmailTo] = useState("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");

    const handleSend = () => {
        if (!emailTo) {
            alert("Please enter email address");
            return;
        }
        if (!subject) {
            alert("Please enter subject");
            return;
        }
        onSend({ to: emailTo, subject, body });
        setEmailTo("");
        setSubject("");
        setBody("");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Send Spoke Report via Email
                    </DialogTitle>
                    <DialogDescription>
                        Enter email details to send the spoke configuration report
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="emailTo" className="text-sm font-medium">
                            Email To <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="emailTo"
                            type="email"
                            placeholder="recipient@example.com"
                            value={emailTo}
                            onChange={(e) => setEmailTo(e.target.value)}
                            className="h-9"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="subject" className="text-sm font-medium">
                            Subject <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="subject"
                            type="text"
                            placeholder="Spoke Configuration Report"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="h-9"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="body" className="text-sm font-medium">
                            Body
                        </Label>
                        <Textarea
                            id="body"
                            placeholder="Please find attached the spoke configuration report..."
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            rows={6}
                            className="resize-none"
                        />
                    </div>
                </div>
                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={onClose} className="h-9">
                        Discard
                    </Button>
                    <Button onClick={handleSend} className="h-9 bg-blue-600 hover:bg-blue-700">
                        <Send className="mr-2 h-4 w-4" />
                        Send
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function SpokeConfiguration() {
    // Sheet state
    const [isEntrySheetOpen, setIsEntrySheetOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentEditId, setCurrentEditId] = useState<number | null>(null);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<"grid" | "report">("report");

    // Form state
    const [formData, setFormData] = useState<Partial<SpokeConfig>>({
        spokeCode: "",
        spokeName: "",
        spokeType: "",
        hubId: 0,
        hubName: "",
        region: "",
        zone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
        contactPerson: "",
        contactNumber: "",
        alternateNumber: "",
        email: "",
        gstNo: "",
        panNo: "",
        latitude: "",
        longitude: "",
        radius: 10,
        serviceablePincodes: [],
        deliveryTimeHours: 0,
        pickupAvailable: true,
        deliveryAvailable: true,
        cashOnDelivery: true,
        status: "active",
        capacity: 0,
        currentLoad: 0,
    });

    // Search state
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [searchStatus, setSearchStatus] = useState<string>("all");
    const [searchHub, setSearchHub] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage: number = 10;

    const [savedRecords, setSavedRecords] = useState<SpokeConfig[]>(sampleData);
    const [searchResults, setSearchResults] = useState<SpokeConfig[]>(sampleData);
    const [pincodeInput, setPincodeInput] = useState<string>("");

    // Load search results on mount
    useEffect(() => {
        setSearchResults(savedRecords);
    }, []);

    // Generate Spoke Code
    const generateSpokeCode = (): string => {
        const maxId = savedRecords.length > 0 ? Math.max(...savedRecords.map(r => r.id)) : 0;
        const count = maxId + 1;
        return `SPK${String(count).padStart(3, '0')}`;
    };

    // Reset form
    const resetForm = (): void => {
        setFormData({
            spokeCode: generateSpokeCode(),
            spokeName: "",
            spokeType: "",
            hubId: 0,
            hubName: "",
            region: "",
            zone: "",
            address: "",
            city: "",
            state: "",
            pincode: "",
            country: "India",
            contactPerson: "",
            contactNumber: "",
            alternateNumber: "",
            email: "",
            gstNo: "",
            panNo: "",
            latitude: "",
            longitude: "",
            radius: 10,
            serviceablePincodes: [],
            deliveryTimeHours: 0,
            pickupAvailable: true,
            deliveryAvailable: true,
            cashOnDelivery: true,
            status: "active",
            capacity: 0,
            currentLoad: 0,
        });
        setPincodeInput("");
        setEditMode(false);
        setCurrentEditId(null);
    };

    const handleInputChange = (field: keyof SpokeConfig, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleHubChange = (hubId: string) => {
        const hub = hubOptions.find(h => h.id.toString() === hubId);
        if (hub) {
            setFormData({ ...formData, hubId: hub.id, hubName: hub.name });
        }
    };

    const addPincode = () => {
        if (pincodeInput && !formData.serviceablePincodes?.includes(pincodeInput)) {
            handleInputChange("serviceablePincodes", [...(formData.serviceablePincodes || []), pincodeInput]);
            setPincodeInput("");
        }
    };

    const removePincode = (pincode: string) => {
        handleInputChange("serviceablePincodes", formData.serviceablePincodes?.filter(p => p !== pincode));
    };

    const handleSave = (): void => {
        if (!formData.spokeName) {
            alert("Please enter Spoke Name");
            return;
        }
        if (!formData.spokeType) {
            alert("Please select Spoke Type");
            return;
        }
        if (!formData.hubId || formData.hubId === 0) {
            alert("Please select Hub");
            return;
        }
        if (!formData.contactPerson) {
            alert("Please enter Contact Person");
            return;
        }
        if (!formData.contactNumber) {
            alert("Please enter Contact Number");
            return;
        }

        const selectedHub = hubOptions.find(h => h.id === formData.hubId);

        const newRecord: SpokeConfig = {
            id: currentEditId || Date.now(),
            spokeCode: formData.spokeCode || generateSpokeCode(),
            spokeName: formData.spokeName!,
            spokeType: formData.spokeType!,
            hubId: formData.hubId!,
            hubName: selectedHub?.name || "",
            region: formData.region || "",
            zone: formData.zone || "",
            address: formData.address || "",
            city: formData.city || "",
            state: formData.state || "",
            pincode: formData.pincode || "",
            country: formData.country || "India",
            contactPerson: formData.contactPerson!,
            contactNumber: formData.contactNumber!,
            alternateNumber: formData.alternateNumber || "",
            email: formData.email || "",
            gstNo: formData.gstNo || "",
            panNo: formData.panNo || "",
            latitude: formData.latitude || "",
            longitude: formData.longitude || "",
            radius: formData.radius || 0,
            serviceablePincodes: formData.serviceablePincodes || [],
            deliveryTimeHours: formData.deliveryTimeHours || 0,
            pickupAvailable: formData.pickupAvailable || false,
            deliveryAvailable: formData.deliveryAvailable || false,
            cashOnDelivery: formData.cashOnDelivery || false,
            status: formData.status as "active" | "inactive" | "maintenance",
            capacity: formData.capacity || 0,
            currentLoad: formData.currentLoad || 0,
            createdAt: editMode && currentEditId ?
                savedRecords.find(r => r.id === currentEditId)?.createdAt || new Date() :
                new Date(),
            updatedAt: new Date(),
        };

        if (editMode && currentEditId) {
            const updatedRecords = savedRecords.map(record => record.id === currentEditId ? newRecord : record);
            setSavedRecords(updatedRecords);
            setSearchResults(updatedRecords);
            alert("Record updated successfully!");
        } else {
            const updatedRecords = [...savedRecords, newRecord];
            setSavedRecords(updatedRecords);
            setSearchResults(updatedRecords);
            alert("Record saved successfully!");
        }

        resetForm();
        setIsEntrySheetOpen(false);
    };

    const handleEdit = (record: SpokeConfig): void => {
        setEditMode(true);
        setCurrentEditId(record.id);
        setFormData({
            spokeCode: record.spokeCode,
            spokeName: record.spokeName,
            spokeType: record.spokeType,
            hubId: record.hubId,
            hubName: record.hubName,
            region: record.region,
            zone: record.zone,
            address: record.address,
            city: record.city,
            state: record.state,
            pincode: record.pincode,
            country: record.country,
            contactPerson: record.contactPerson,
            contactNumber: record.contactNumber,
            alternateNumber: record.alternateNumber,
            email: record.email,
            gstNo: record.gstNo,
            panNo: record.panNo,
            latitude: record.latitude,
            longitude: record.longitude,
            radius: record.radius,
            serviceablePincodes: record.serviceablePincodes,
            deliveryTimeHours: record.deliveryTimeHours,
            pickupAvailable: record.pickupAvailable,
            deliveryAvailable: record.deliveryAvailable,
            cashOnDelivery: record.cashOnDelivery,
            status: record.status,
            capacity: record.capacity,
            currentLoad: record.currentLoad,
        });
        setIsEntrySheetOpen(true);
    };

    const handleDelete = (id: number): void => {
        if (confirm("Are you sure you want to delete this spoke?")) {
            const updatedRecords = savedRecords.filter(record => record.id !== id);
            setSavedRecords(updatedRecords);
            setSearchResults(updatedRecords);
            alert("Spoke deleted successfully!");
        }
    };

    const handleSearch = (): void => {
        let results = [...savedRecords];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            results = results.filter(r =>
                r.spokeName.toLowerCase().includes(term) ||
                r.spokeCode.toLowerCase().includes(term) ||
                r.city.toLowerCase().includes(term) ||
                r.contactPerson.toLowerCase().includes(term)
            );
        }

        if (searchStatus !== "all") {
            results = results.filter(r => r.status === searchStatus);
        }

        if (searchHub !== "all") {
            const hub = hubOptions.find(h => h.name === searchHub);
            if (hub) {
                results = results.filter(r => r.hubId === hub.id);
            }
        }

        setSearchResults(results);
        setCurrentPage(1);
    };

    const handleClearSearch = (): void => {
        setSearchTerm("");
        setSearchStatus("all");
        setSearchHub("all");
        setSearchResults(savedRecords);
        setCurrentPage(1);
    };

    const handleSendReport = () => {
        if (searchResults.length === 0) {
            alert("No records to send. Please search for data first.");
            return;
        }
        setIsEmailModalOpen(true);
    };

    const handleEmailSend = (emailData: { to: string; subject: string; body: string }) => {
        console.log("Sending email to:", emailData.to);
        console.log("Subject:", emailData.subject);
        console.log("Body:", emailData.body);
        console.log("Data:", searchResults);
        alert(`Report sent successfully to ${emailData.to} with ${searchResults.length} records!`);
    };

    const openAddSheet = (): void => {
        resetForm();
        setEditMode(false);
        setCurrentEditId(null);
        setFormData({ ...formData, spokeCode: generateSpokeCode() });
        setIsEntrySheetOpen(true);
    };

    // Get status badge
    const getStatusBadge = (status: string) => {
        const config = statusOptions.find(s => s.value === status);
        return (
            <Badge className={`${config?.color || 'bg-gray-500'} text-white text-[10px]`}>
                {config?.label || status}
            </Badge>
        );
    };

    // Get spoke type badge
    const getSpokeTypeBadge = (type: string) => {
        const config = spokeTypeOptions.find(s => s.value === type);
        return (
            <Badge variant="outline" className="bg-purple-50 text-purple-700 text-[10px]">
                {config?.label || type}
            </Badge>
        );
    };

    // Stats
    const stats = {
        total: searchResults.length,
        active: searchResults.filter(r => r.status === "active").length,
        maintenance: searchResults.filter(r => r.status === "maintenance").length,
        totalCapacity: searchResults.reduce((sum, r) => sum + r.capacity, 0),
        currentLoad: searchResults.reduce((sum, r) => sum + r.currentLoad, 0),
    };

    // Pagination
    const totalPages = Math.ceil(searchResults.length / itemsPerPage);
    const paginatedResults = searchResults.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    return (
        <div className="space-y-4 p-3 md:p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex flex-wrap justify-between items-start gap-3">
                    <div>
                        <div className="flex items-center gap-2">
                            <Navigation className="h-5 w-5 text-blue-600" />
                            <h1 className="text-xl md:text-2xl font-bold text-gray-800">SPOKE CONFIGURATION</h1>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
                            <span>🏢 Company: GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
                            <span>👤 Login: MAYANK.GRLOGISTICS@GMAIL.COM</span>
                            <span>📍 Branch: CORPORATE OFFICE</span>
                            <span>📅 Financial Year: 2026-2027</span>
                        </div>
                    </div>
                    <Button onClick={openAddSheet} size="default" className="bg-blue-600 hover:bg-blue-700 shadow-md">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Spoke
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <CardContent className="p-3">
                        <p className="text-[10px] opacity-90">Total Spokes</p>
                        <p className="text-2xl font-bold">{stats.total}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                    <CardContent className="p-3">
                        <p className="text-[10px] opacity-90">Active Spokes</p>
                        <p className="text-2xl font-bold">{stats.active}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                    <CardContent className="p-3">
                        <p className="text-[10px] opacity-90">Maintenance</p>
                        <p className="text-2xl font-bold">{stats.maintenance}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                    <CardContent className="p-3">
                        <p className="text-[10px] opacity-90">Total Capacity</p>
                        <p className="text-xl font-bold">{stats.totalCapacity.toLocaleString()}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                    <CardContent className="p-3">
                        <p className="text-[10px] opacity-90">Current Load</p>
                        <p className="text-xl font-bold">{stats.currentLoad.toLocaleString()}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Search Filters */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-[11px] font-semibold flex items-center gap-2 text-gray-700">
                        <Filter className="h-3.5 w-3.5" />
                        Search Filters
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="space-y-1">
                            <Label className="text-[10px] font-medium">Search</Label>
                            <Input
                                placeholder="Spoke name, code, city..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="h-8 text-xs"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[10px] font-medium">Status</Label>
                            <Select value={searchStatus} onValueChange={setSearchStatus}>
                                <SelectTrigger className="h-8 text-xs">
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="maintenance">Maintenance</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[10px] font-medium">Hub</Label>
                            <Select value={searchHub} onValueChange={setSearchHub}>
                                <SelectTrigger className="h-8 text-xs">
                                    <SelectValue placeholder="All Hubs" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Hubs</SelectItem>
                                    {hubOptions.map(opt => (
                                        <SelectItem key={opt.id} value={opt.name}>{opt.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-end gap-2">
                            <Button onClick={handleSearch} size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700">
                                <Search className="mr-1 h-3 w-3" />
                                Search
                            </Button>
                            <Button onClick={handleClearSearch} variant="outline" size="sm" className="h-8 text-xs">
                                <RefreshCw className="mr-1 h-3 w-3" />
                                Clear
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-between items-center gap-2">
                <div className="flex gap-2">
                    <Button
                        onClick={() => setViewMode("report")}
                        variant={viewMode === "report" ? "default" : "outline"}
                        size="sm"
                        className="h-7 text-xs"
                    >
                        Report View
                    </Button>
                    <Button
                        onClick={() => setViewMode("grid")}
                        variant={viewMode === "grid" ? "default" : "outline"}
                        size="sm"
                        className="h-7 text-xs"
                    >
                        Grid View
                    </Button>
                </div>
                <Button onClick={handleSendReport} variant="outline" size="sm" className="h-7 text-xs">
                    <Send className="mr-1 h-3 w-3" /> Send Report
                </Button>
            </div>

            {/* Report View Table */}
            {viewMode === "report" && searchResults.length > 0 && (
                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                            <div className="gap-2 w-full">
                                <Table className="text-gray-500" />
                                <h3 className="text-[15px] font-semibold text-gray-800">
                                    Spoke Configuration List
                                </h3>
                            </div>
                            <div className="text-[10px] text-gray-500">
                                Total: {searchResults.length} records
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border overflow-x-auto">
                            <div className="min-w-[1000px]">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50">
                                            <TableHead className="text-[11px] font-semibold py-2 px-2 w-12 text-center">#</TableHead>
                                            <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Spoke Code</TableHead>
                                            <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[150px]">Spoke Name</TableHead>
                                            <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Spoke Type</TableHead>
                                            <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[120px]">Hub</TableHead>
                                            <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">City</TableHead>
                                            <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[120px]">Contact</TableHead>
                                            <TableHead className="text-[11px] font-semibold py-2 px-2 w-20 text-center">Status</TableHead>
                                            <TableHead className="text-[11px] font-semibold py-2 px-2 w-24 text-center">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedResults.map((record, index) => (
                                            <TableRow key={record.id} className="hover:bg-gray-50">
                                                <TableCell className="py-2 px-2 text-center text-xs">
                                                    {(currentPage - 1) * itemsPerPage + index + 1}
                                                </TableCell>
                                                <TableCell className="py-2 px-2 font-mono font-semibold text-xs">
                                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 text-[11px]">
                                                        {record.spokeCode}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-2 px-2 font-medium text-xs">{record.spokeName}</TableCell>
                                                <TableCell className="py-2 px-2 text-xs">
                                                    {getSpokeTypeBadge(record.spokeType)}
                                                </TableCell>
                                                <TableCell className="py-2 px-2 text-xs">
                                                    <Badge variant="outline" className="bg-cyan-50 text-cyan-700 text-[11px]">
                                                        {record.hubName}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-2 px-2 text-xs">{record.city}</TableCell>
                                                <TableCell className="py-2 px-2 text-xs">{record.contactNumber}</TableCell>
                                                <TableCell className="py-2 px-2 text-center">{getStatusBadge(record.status)}</TableCell>
                                                <TableCell className="py-2 px-2 text-center">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleEdit(record)}
                                                            className="h-7 w-7 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                                            title="Edit"
                                                        >
                                                            <Edit className="h-3.5 w-3.5" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDelete(record.id)}
                                                            className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-[10px] text-gray-500">
                                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, searchResults.length)} of {searchResults.length} entries
                                </div>
                                <div className="flex gap-1">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => goToPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="h-7 text-[10px]"
                                    >
                                        <ChevronLeft className="h-3 w-3 mr-1" />
                                        Previous
                                    </Button>
                                    <span className="px-3 py-1 text-[10px]">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => goToPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="h-7 text-[10px]"
                                    >
                                        Next
                                        <ChevronRight className="h-3 w-3 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Grid View */}
            {viewMode === "grid" && searchResults.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.map((record) => (
                        <Card key={record.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <Navigation className="h-4 w-4 text-blue-500" />
                                            <h3 className="font-semibold text-sm">{record.spokeName}</h3>
                                        </div>
                                        <p className="text-[10px] text-gray-500 mt-1">{record.spokeCode}</p>
                                    </div>
                                    {getStatusBadge(record.status)}
                                </div>
                                <div className="space-y-2 text-xs">
                                    <div className="flex items-center gap-2">
                                        <Building2 className="h-3 w-3 text-gray-400" />
                                        <span>Hub: {record.hubName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-3 w-3 text-gray-400" />
                                        <span>{record.city}, {record.state}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User className="h-3 w-3 text-gray-400" />
                                        <span>{record.contactPerson}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-3 w-3 text-gray-400" />
                                        <span>{record.contactNumber}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {getSpokeTypeBadge(record.spokeType)}
                                        <Badge variant="outline" className="text-[10px]">
                                            Radius: {record.radius} km
                                        </Badge>
                                        <Badge variant="outline" className="text-[10px]">
                                            Delivery: {record.deliveryTimeHours}h
                                        </Badge>
                                    </div>
                                </div>
                                <div className="mt-3 flex justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEdit(record)}
                                        className="h-7 w-7 p-0 text-blue-500"
                                    >
                                        <Edit className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(record.id)}
                                        className="h-7 w-7 p-0 text-red-500"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* No Data Message */}
            {searchResults.length === 0 && (
                <Card>
                    <CardContent className="py-12 text-center">
                        <Navigation className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                        <p className="text-gray-500 text-sm">No spoke records found</p>
                        <p className="text-xs text-gray-400 mt-1">Click "Add New Spoke" to create one</p>
                    </CardContent>
                </Card>
            )}

            {/* Entry Sheet */}
            <Sheet open={isEntrySheetOpen} onOpenChange={setIsEntrySheetOpen}>
                <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                    <SheetHeader className="mb-4">
                        <SheetTitle className="flex items-center gap-2 text-base">
                            {editMode ? (
                                <>
                                    <Edit className="h-4 w-4 text-blue-600" />
                                    Edit Spoke Configuration
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4 text-blue-600" />
                                    Add New Spoke
                                </>
                            )}
                        </SheetTitle>
                    </SheetHeader>

                    <div className="space-y-4">
                        {/* Basic Information */}
                        <div className="border-b pb-2">
                            <h3 className="text-sm font-semibold text-gray-800">Basic Information</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label className="text-xs">Spoke Code</Label>
                                <Input value={formData.spokeCode} readOnly className="h-8 text-xs bg-gray-50" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Spoke Name <span className="text-red-500">*</span></Label>
                                <Input value={formData.spokeName} onChange={(e) => handleInputChange("spokeName", e.target.value)} className="h-8 text-xs" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label className="text-xs">Spoke Type <span className="text-red-500">*</span></Label>
                                <Select value={formData.spokeType} onValueChange={(v) => handleInputChange("spokeType", v)}>
                                    <SelectTrigger className="h-8 text-xs">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {spokeTypeOptions.map(opt => (
                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Hub <span className="text-red-500">*</span></Label>
                                <Select value={formData.hubId?.toString()} onValueChange={handleHubChange}>
                                    <SelectTrigger className="h-8 text-xs">
                                        <SelectValue placeholder="Select Hub" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {hubOptions.map(opt => (
                                            <SelectItem key={opt.id} value={opt.id.toString()}>{opt.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label className="text-xs">Region</Label>
                                <Select value={formData.region} onValueChange={(v) => handleInputChange("region", v)}>
                                    <SelectTrigger className="h-8 text-xs">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {regionOptions.map(opt => (
                                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Zone</Label>
                                <Select value={formData.zone} onValueChange={(v) => handleInputChange("zone", v)}>
                                    <SelectTrigger className="h-8 text-xs">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {zoneOptions.map(opt => (
                                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label className="text-xs">Radius (km)</Label>
                                <Input type="number" value={formData.radius} onChange={(e) => handleInputChange("radius", Number(e.target.value))} className="h-8 text-xs" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Delivery Time (hours)</Label>
                                <Input type="number" value={formData.deliveryTimeHours} onChange={(e) => handleInputChange("deliveryTimeHours", Number(e.target.value))} className="h-8 text-xs" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label className="text-xs">Status</Label>
                                <Select value={formData.status} onValueChange={(v) => handleInputChange("status", v)}>
                                    <SelectTrigger className="h-8 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statusOptions.map(opt => (
                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Capacity (kg)</Label>
                                <Input type="number" value={formData.capacity} onChange={(e) => handleInputChange("capacity", Number(e.target.value))} className="h-8 text-xs" />
                            </div>
                        </div>

                        {/* Address Information */}
                        <div className="border-b pb-2 pt-2">
                            <h3 className="text-sm font-semibold text-gray-800">Address Information</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <Label className="text-xs">Address</Label>
                                <Input value={formData.address} onChange={(e) => handleInputChange("address", e.target.value)} className="h-8 text-xs" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs">City</Label>
                                    <Input value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} className="h-8 text-xs" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">State</Label>
                                    <Select value={formData.state} onValueChange={(v) => handleInputChange("state", v)}>
                                        <SelectTrigger className="h-8 text-xs">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {stateOptions.map(opt => (
                                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs">Pincode</Label>
                                    <Input value={formData.pincode} onChange={(e) => handleInputChange("pincode", e.target.value)} className="h-8 text-xs" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Country</Label>
                                    <Input value={formData.country} onChange={(e) => handleInputChange("country", e.target.value)} className="h-8 text-xs" />
                                </div>
                            </div>
                        </div>

                        {/* Serviceable Pincodes */}
                        <div className="border-b pb-2 pt-2">
                            <h3 className="text-sm font-semibold text-gray-800">Serviceable Pincodes</h3>
                        </div>
                        <div className="space-y-2">
                            <div className="flex gap-2">
                                <Input
                                    value={pincodeInput}
                                    onChange={(e) => setPincodeInput(e.target.value)}
                                    placeholder="Enter pincode"
                                    className="h-8 text-xs flex-1"
                                />
                                <Button onClick={addPincode} size="sm" className="h-8 text-xs">
                                    <Plus className="h-3 w-3" /> Add
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {formData.serviceablePincodes?.map((pincode) => (
                                    <Badge key={pincode} variant="secondary" className="text-xs">
                                        {pincode}
                                        <X
                                            className="ml-1 h-3 w-3 cursor-pointer hover:text-red-500"
                                            onClick={() => removePincode(pincode)}
                                        />
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="border-b pb-2 pt-2">
                            <h3 className="text-sm font-semibold text-gray-800">Contact Information</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <Label className="text-xs">Contact Person <span className="text-red-500">*</span></Label>
                                <Input value={formData.contactPerson} onChange={(e) => handleInputChange("contactPerson", e.target.value)} className="h-8 text-xs" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs">Contact Number <span className="text-red-500">*</span></Label>
                                    <Input value={formData.contactNumber} onChange={(e) => handleInputChange("contactNumber", e.target.value)} className="h-8 text-xs" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Alternate Number</Label>
                                    <Input value={formData.alternateNumber} onChange={(e) => handleInputChange("alternateNumber", e.target.value)} className="h-8 text-xs" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Email</Label>
                                <Input value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} className="h-8 text-xs" type="email" />
                            </div>
                        </div>

                        {/* Service Options */}
                        <div className="border-b pb-2 pt-2">
                            <h3 className="text-sm font-semibold text-gray-800">Service Options</h3>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.pickupAvailable}
                                    onChange={(e) => handleInputChange("pickupAvailable", e.target.checked)}
                                    className="h-3.5 w-3.5"
                                    id="pickup"
                                />
                                <Label htmlFor="pickup" className="text-xs cursor-pointer">Pickup Available</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.deliveryAvailable}
                                    onChange={(e) => handleInputChange("deliveryAvailable", e.target.checked)}
                                    className="h-3.5 w-3.5"
                                    id="delivery"
                                />
                                <Label htmlFor="delivery" className="text-xs cursor-pointer">Delivery Available</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.cashOnDelivery}
                                    onChange={(e) => handleInputChange("cashOnDelivery", e.target.checked)}
                                    className="h-3.5 w-3.5"
                                    id="cod"
                                />
                                <Label htmlFor="cod" className="text-xs cursor-pointer">Cash on Delivery</Label>
                            </div>
                        </div>

                        {/* GST & PAN Information */}
                        <div className="border-b pb-2 pt-2">
                            <h3 className="text-sm font-semibold text-gray-800">GST & PAN Information</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label className="text-xs">GST No</Label>
                                <Input value={formData.gstNo} onChange={(e) => handleInputChange("gstNo", e.target.value)} className="h-8 text-xs uppercase" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">PAN No</Label>
                                <Input value={formData.panNo} onChange={(e) => handleInputChange("panNo", e.target.value)} className="h-8 text-xs uppercase" />
                            </div>
                        </div>

                        {/* Location Coordinates */}
                        <div className="border-b pb-2 pt-2">
                            <h3 className="text-sm font-semibold text-gray-800">Location Coordinates</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label className="text-xs">Latitude</Label>
                                <Input value={formData.latitude} onChange={(e) => handleInputChange("latitude", e.target.value)} className="h-8 text-xs" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Longitude</Label>
                                <Input value={formData.longitude} onChange={(e) => handleInputChange("longitude", e.target.value)} className="h-8 text-xs" />
                            </div>
                        </div>

                        {/* Current Load */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label className="text-xs">Current Load (kg)</Label>
                                <Input type="number" value={formData.currentLoad} onChange={(e) => handleInputChange("currentLoad", Number(e.target.value))} className="h-8 text-xs" />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                            <Button variant="outline" onClick={() => setIsEntrySheetOpen(false)} className="h-8 text-xs">
                                <X className="mr-1 h-3 w-3" />
                                Cancel
                            </Button>
                            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 h-8 text-xs">
                                <Save className="mr-1 h-3 w-3" />
                                {editMode ? "Update" : "Save"}
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Email Modal */}
            <EmailModal
                isOpen={isEmailModalOpen}
                onClose={() => setIsEmailModalOpen(false)}
                onSend={handleEmailSend}
            />
        </div>
    );
}