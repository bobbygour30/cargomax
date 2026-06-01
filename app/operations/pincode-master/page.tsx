// app/operations/pincode-master/page.tsx
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
    Globe,
    Clock,
    CheckCircle,
} from "lucide-react";
import { format } from "date-fns";

// Types
interface PincodeMaster {
    id: number;
    pincode: string;
    city: string;
    district: string;
    state: string;
    country: string;
    region: string;
    zone: string;
    areaType: "urban" | "rural" | "semi_urban";
    deliveryStatus: "active" | "inactive" | "partial";
    hubId: number;
    hubName: string;
    spokeId: number;
    spokeName: string;
    deliveryTimeHours: number;
    codAvailable: boolean;
    pickupAvailable: boolean;
    weightLimit: number;
    specialInstructions: string;
    latitude: string;
    longitude: string;
    createdAt: Date;
    updatedAt: Date;
}

// Options
const areaTypeOptions = [
    { value: "urban", label: "Urban", color: "bg-blue-500" },
    { value: "rural", label: "Rural", color: "bg-green-500" },
    { value: "semi_urban", label: "Semi-Urban", color: "bg-orange-500" },
];

const deliveryStatusOptions = [
    { value: "active", label: "Active", color: "bg-green-500" },
    { value: "inactive", label: "Inactive", color: "bg-gray-500" },
    { value: "partial", label: "Partial", color: "bg-yellow-500" },
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

// Sample Hub Data
const hubOptions = [
    { id: 1, name: "Delhi Main Hub", code: "HUB001" },
    { id: 2, name: "Mumbai Gateway Hub", code: "HUB002" },
    { id: 3, name: "Bangalore Tech Hub", code: "HUB003" },
    { id: 4, name: "Chennai Port Hub", code: "HUB004" },
    { id: 5, name: "Kolkata Eastern Hub", code: "HUB005" },
];

// Sample Spoke Data
const spokeOptions = [
    { id: 1, name: "Delhi North Spoke", code: "SPK001", hubId: 1 },
    { id: 2, name: "Mumbai West Spoke", code: "SPK002", hubId: 2 },
    { id: 3, name: "Bangalore East Spoke", code: "SPK003", hubId: 3 },
    { id: 4, name: "Chennai South Spoke", code: "SPK004", hubId: 4 },
    { id: 5, name: "Kolkata Central Spoke", code: "SPK005", hubId: 5 },
];

// Sample Data
const sampleData: PincodeMaster[] = [
    { id: 1, pincode: "110001", city: "New Delhi", district: "Central Delhi", state: "Delhi", country: "India", region: "North Region", zone: "Zone 1 - Delhi NCR", areaType: "urban", deliveryStatus: "active", hubId: 1, hubName: "Delhi Main Hub", spokeId: 1, spokeName: "Delhi North Spoke", deliveryTimeHours: 24, codAvailable: true, pickupAvailable: true, weightLimit: 1000, specialInstructions: "", latitude: "28.6139", longitude: "77.2090", createdAt: new Date(), updatedAt: new Date() },
    { id: 2, pincode: "110002", city: "New Delhi", district: "Central Delhi", state: "Delhi", country: "India", region: "North Region", zone: "Zone 1 - Delhi NCR", areaType: "urban", deliveryStatus: "active", hubId: 1, hubName: "Delhi Main Hub", spokeId: 1, spokeName: "Delhi North Spoke", deliveryTimeHours: 24, codAvailable: true, pickupAvailable: true, weightLimit: 1000, specialInstructions: "", latitude: "28.6140", longitude: "77.2091", createdAt: new Date(), updatedAt: new Date() },
    { id: 3, pincode: "400001", city: "Mumbai", district: "Mumbai City", state: "Maharashtra", country: "India", region: "West Region", zone: "Zone 2 - Mumbai", areaType: "urban", deliveryStatus: "active", hubId: 2, hubName: "Mumbai Gateway Hub", spokeId: 2, spokeName: "Mumbai West Spoke", deliveryTimeHours: 24, codAvailable: true, pickupAvailable: true, weightLimit: 1000, specialInstructions: "", latitude: "19.0760", longitude: "72.8777", createdAt: new Date(), updatedAt: new Date() },
    { id: 4, pincode: "560001", city: "Bangalore", district: "Bangalore Urban", state: "Karnataka", country: "India", region: "South Region", zone: "Zone 3 - Bangalore", areaType: "urban", deliveryStatus: "active", hubId: 3, hubName: "Bangalore Tech Hub", spokeId: 3, spokeName: "Bangalore East Spoke", deliveryTimeHours: 24, codAvailable: true, pickupAvailable: true, weightLimit: 1000, specialInstructions: "", latitude: "12.9716", longitude: "77.5946", createdAt: new Date(), updatedAt: new Date() },
    { id: 5, pincode: "600001", city: "Chennai", district: "Chennai", state: "Tamil Nadu", country: "India", region: "South Region", zone: "Zone 4 - Chennai", areaType: "urban", deliveryStatus: "partial", hubId: 4, hubName: "Chennai Port Hub", spokeId: 4, spokeName: "Chennai South Spoke", deliveryTimeHours: 48, codAvailable: false, pickupAvailable: true, weightLimit: 500, specialInstructions: "Limited service area", latitude: "13.0827", longitude: "80.2707", createdAt: new Date(), updatedAt: new Date() },
    { id: 6, pincode: "700001", city: "Kolkata", district: "Kolkata", state: "West Bengal", country: "India", region: "East Region", zone: "Zone 5 - Kolkata", areaType: "urban", deliveryStatus: "active", hubId: 5, hubName: "Kolkata Eastern Hub", spokeId: 5, spokeName: "Kolkata Central Spoke", deliveryTimeHours: 24, codAvailable: true, pickupAvailable: true, weightLimit: 1000, specialInstructions: "", latitude: "22.5726", longitude: "88.3639", createdAt: new Date(), updatedAt: new Date() },
    { id: 7, pincode: "110085", city: "Delhi", district: "North West Delhi", state: "Delhi", country: "India", region: "North Region", zone: "Zone 1 - Delhi NCR", areaType: "semi_urban", deliveryStatus: "active", hubId: 1, hubName: "Delhi Main Hub", spokeId: 1, spokeName: "Delhi North Spoke", deliveryTimeHours: 36, codAvailable: true, pickupAvailable: false, weightLimit: 800, specialInstructions: "Pickup not available", latitude: "28.7199", longitude: "77.1245", createdAt: new Date(), updatedAt: new Date() },
    { id: 8, pincode: "400053", city: "Mumbai", district: "Mumbai Suburban", state: "Maharashtra", country: "India", region: "West Region", zone: "Zone 2 - Mumbai", areaType: "urban", deliveryStatus: "active", hubId: 2, hubName: "Mumbai Gateway Hub", spokeId: 2, spokeName: "Mumbai West Spoke", deliveryTimeHours: 24, codAvailable: true, pickupAvailable: true, weightLimit: 1000, specialInstructions: "", latitude: "19.1190", longitude: "72.8468", createdAt: new Date(), updatedAt: new Date() },
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
                        Send Pin Code Report via Email
                    </DialogTitle>
                    <DialogDescription>
                        Enter email details to send the pin code master report
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
                            placeholder="Pin Code Master Report"
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
                            placeholder="Please find attached the pin code master report..."
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

export default function PincodeMaster() {
    // Sheet state
    const [isEntrySheetOpen, setIsEntrySheetOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentEditId, setCurrentEditId] = useState<number | null>(null);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<"grid" | "report">("report");

    // Form state
    const [formData, setFormData] = useState<Partial<PincodeMaster>>({
        pincode: "",
        city: "",
        district: "",
        state: "",
        country: "India",
        region: "",
        zone: "",
        areaType: "urban",
        deliveryStatus: "active",
        hubId: 0,
        hubName: "",
        spokeId: 0,
        spokeName: "",
        deliveryTimeHours: 24,
        codAvailable: true,
        pickupAvailable: true,
        weightLimit: 1000,
        specialInstructions: "",
        latitude: "",
        longitude: "",
    });

    // Search state
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [searchState, setSearchState] = useState<string>("all");
    const [searchStatus, setSearchStatus] = useState<string>("all");
    const [searchAreaType, setSearchAreaType] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage: number = 10;

    const [savedRecords, setSavedRecords] = useState<PincodeMaster[]>(sampleData);
    const [searchResults, setSearchResults] = useState<PincodeMaster[]>(sampleData);

    // Load search results on mount
    useEffect(() => {
        setSearchResults(savedRecords);
    }, []);

    // Generate ID
    const getNextId = (): number => {
        const maxId = savedRecords.length > 0 ? Math.max(...savedRecords.map(r => r.id)) : 0;
        return maxId + 1;
    };

    // Reset form
    const resetForm = (): void => {
        setFormData({
            pincode: "",
            city: "",
            district: "",
            state: "",
            country: "India",
            region: "",
            zone: "",
            areaType: "urban",
            deliveryStatus: "active",
            hubId: 0,
            hubName: "",
            spokeId: 0,
            spokeName: "",
            deliveryTimeHours: 24,
            codAvailable: true,
            pickupAvailable: true,
            weightLimit: 1000,
            specialInstructions: "",
            latitude: "",
            longitude: "",
        });
        setEditMode(false);
        setCurrentEditId(null);
    };

    const handleInputChange = (field: keyof PincodeMaster, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleHubChange = (hubId: string) => {
        const hub = hubOptions.find(h => h.id.toString() === hubId);
        if (hub) {
            setFormData({ ...formData, hubId: hub.id, hubName: hub.name });
        }
    };

    const handleSpokeChange = (spokeId: string) => {
        const spoke = spokeOptions.find(s => s.id.toString() === spokeId);
        if (spoke) {
            setFormData({ ...formData, spokeId: spoke.id, spokeName: spoke.name });
        }
    };

    // Filter spokes based on selected hub
    const getFilteredSpokes = () => {
        if (formData.hubId) {
            return spokeOptions.filter(s => s.hubId === formData.hubId);
        }
        return spokeOptions;
    };

    const handleSave = (): void => {
        if (!formData.pincode) {
            alert("Please enter Pincode");
            return;
        }
        if (!formData.city) {
            alert("Please enter City");
            return;
        }
        if (!formData.state) {
            alert("Please select State");
            return;
        }
        if (!formData.hubId || formData.hubId === 0) {
            alert("Please select Hub");
            return;
        }

        const selectedHub = hubOptions.find(h => h.id === formData.hubId);
        const selectedSpoke = spokeOptions.find(s => s.id === formData.spokeId);

        const newRecord: PincodeMaster = {
            id: currentEditId || getNextId(),
            pincode: formData.pincode!,
            city: formData.city!,
            district: formData.district || "",
            state: formData.state!,
            country: formData.country || "India",
            region: formData.region || "",
            zone: formData.zone || "",
            areaType: formData.areaType as "urban" | "rural" | "semi_urban",
            deliveryStatus: formData.deliveryStatus as "active" | "inactive" | "partial",
            hubId: formData.hubId!,
            hubName: selectedHub?.name || "",
            spokeId: formData.spokeId || 0,
            spokeName: selectedSpoke?.name || "",
            deliveryTimeHours: formData.deliveryTimeHours || 0,
            codAvailable: formData.codAvailable || false,
            pickupAvailable: formData.pickupAvailable || false,
            weightLimit: formData.weightLimit || 0,
            specialInstructions: formData.specialInstructions || "",
            latitude: formData.latitude || "",
            longitude: formData.longitude || "",
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

    const handleEdit = (record: PincodeMaster): void => {
        setEditMode(true);
        setCurrentEditId(record.id);
        setFormData({
            pincode: record.pincode,
            city: record.city,
            district: record.district,
            state: record.state,
            country: record.country,
            region: record.region,
            zone: record.zone,
            areaType: record.areaType,
            deliveryStatus: record.deliveryStatus,
            hubId: record.hubId,
            hubName: record.hubName,
            spokeId: record.spokeId,
            spokeName: record.spokeName,
            deliveryTimeHours: record.deliveryTimeHours,
            codAvailable: record.codAvailable,
            pickupAvailable: record.pickupAvailable,
            weightLimit: record.weightLimit,
            specialInstructions: record.specialInstructions,
            latitude: record.latitude,
            longitude: record.longitude,
        });
        setIsEntrySheetOpen(true);
    };

    const handleDelete = (id: number): void => {
        if (confirm("Are you sure you want to delete this pincode record?")) {
            const updatedRecords = savedRecords.filter(record => record.id !== id);
            setSavedRecords(updatedRecords);
            setSearchResults(updatedRecords);
            alert("Pincode record deleted successfully!");
        }
    };

    const handleSearch = (): void => {
        let results = [...savedRecords];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            results = results.filter(r =>
                r.pincode.toLowerCase().includes(term) ||
                r.city.toLowerCase().includes(term) ||
                r.district.toLowerCase().includes(term)
            );
        }

        if (searchState !== "all") {
            results = results.filter(r => r.state === searchState);
        }

        if (searchStatus !== "all") {
            results = results.filter(r => r.deliveryStatus === searchStatus);
        }

        if (searchAreaType !== "all") {
            results = results.filter(r => r.areaType === searchAreaType);
        }

        setSearchResults(results);
        setCurrentPage(1);
    };

    const handleClearSearch = (): void => {
        setSearchTerm("");
        setSearchState("all");
        setSearchStatus("all");
        setSearchAreaType("all");
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
        setIsEntrySheetOpen(true);
    };

    // Get status badge
    const getStatusBadge = (status: string) => {
        const config = deliveryStatusOptions.find(s => s.value === status);
        return (
            <Badge className={`${config?.color || 'bg-gray-500'} text-white text-[10px]`}>
                {config?.label || status}
            </Badge>
        );
    };

    // Get area type badge
    const getAreaTypeBadge = (type: string) => {
        const config = areaTypeOptions.find(s => s.value === type);
        return (
            <Badge className={`${config?.color || 'bg-gray-500'} text-white text-[10px]`}>
                {config?.label || type}
            </Badge>
        );
    };

    // Stats
    const stats = {
        total: searchResults.length,
        active: searchResults.filter(r => r.deliveryStatus === "active").length,
        partial: searchResults.filter(r => r.deliveryStatus === "partial").length,
        urban: searchResults.filter(r => r.areaType === "urban").length,
        rural: searchResults.filter(r => r.areaType === "rural").length,
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
                            <MapPin className="h-5 w-5 text-blue-600" />
                            <h1 className="text-xl md:text-2xl font-bold text-gray-800">PIN CODE MASTER</h1>
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
                        Add New Pincode
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <CardContent className="p-3">
                        <p className="text-[10px] opacity-90">Total Pincodes</p>
                        <p className="text-2xl font-bold">{stats.total}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                    <CardContent className="p-3">
                        <p className="text-[10px] opacity-90">Active Delivery</p>
                        <p className="text-2xl font-bold">{stats.active}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
                    <CardContent className="p-3">
                        <p className="text-[10px] opacity-90">Partial Delivery</p>
                        <p className="text-2xl font-bold">{stats.partial}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                    <CardContent className="p-3">
                        <p className="text-[10px] opacity-90">Urban Areas</p>
                        <p className="text-2xl font-bold">{stats.urban}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                    <CardContent className="p-3">
                        <p className="text-[10px] opacity-90">Rural Areas</p>
                        <p className="text-2xl font-bold">{stats.rural}</p>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        <div className="space-y-1">
                            <Label className="text-[10px] font-medium">Pincode/City</Label>
                            <Input
                                placeholder="Search pincode or city..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="h-8 text-xs"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[10px] font-medium">State</Label>
                            <Select value={searchState} onValueChange={setSearchState}>
                                <SelectTrigger className="h-8 text-xs">
                                    <SelectValue placeholder="All States" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All States</SelectItem>
                                    {stateOptions.map(opt => (
                                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[10px] font-medium">Delivery Status</Label>
                            <Select value={searchStatus} onValueChange={setSearchStatus}>
                                <SelectTrigger className="h-8 text-xs">
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="partial">Partial</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[10px] font-medium">Area Type</Label>
                            <Select value={searchAreaType} onValueChange={setSearchAreaType}>
                                <SelectTrigger className="h-8 text-xs">
                                    <SelectValue placeholder="All Areas" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Areas</SelectItem>
                                    <SelectItem value="urban">Urban</SelectItem>
                                    <SelectItem value="rural">Rural</SelectItem>
                                    <SelectItem value="semi_urban">Semi-Urban</SelectItem>
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
                                    Pincode Master List
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
                                            <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">Pincode</TableHead>
                                            <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[120px]">City</TableHead>
                                            <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">District</TableHead>
                                            <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">State</TableHead>
                                            <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">Area Type</TableHead>
                                            <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Hub</TableHead>
                                            <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">Delivery Time</TableHead>
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
                                                        {record.pincode}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-2 px-2 font-medium text-xs">{record.city}</TableCell>
                                                <TableCell className="py-2 px-2 text-xs">{record.district || "-"}</TableCell>
                                                <TableCell className="py-2 px-2 text-xs">{record.state}</TableCell>
                                                <TableCell className="py-2 px-2 text-xs">
                                                    {getAreaTypeBadge(record.areaType)}
                                                </TableCell>
                                                <TableCell className="py-2 px-2 text-xs">{record.hubName}</TableCell>
                                                <TableCell className="py-2 px-2 text-xs">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3 text-gray-400" />
                                                        {record.deliveryTimeHours}h
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-2 px-2 text-center">
                                                    {getStatusBadge(record.deliveryStatus)}
                                                </TableCell>
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
                                            <MapPin className="h-4 w-4 text-blue-500" />
                                            <h3 className="font-semibold text-sm">{record.pincode}</h3>
                                        </div>
                                        <p className="text-[10px] text-gray-500 mt-1">{record.city}, {record.state}</p>
                                    </div>
                                    {getStatusBadge(record.deliveryStatus)}
                                </div>
                                <div className="space-y-2 text-xs">
                                    <div className="flex items-center gap-2">
                                        <Building2 className="h-3 w-3 text-gray-400" />
                                        <span>District: {record.district || "-"}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Globe className="h-3 w-3 text-gray-400" />
                                        <span>Area: {record.areaType?.replace("_", " ")}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Building2 className="h-3 w-3 text-gray-400" />
                                        <span>Hub: {record.hubName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-3 w-3 text-gray-400" />
                                        <span>Delivery: {record.deliveryTimeHours} hours</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {record.codAvailable && (
                                            <Badge variant="outline" className="text-[10px] bg-green-50">
                                                COD Available
                                            </Badge>
                                        )}
                                        {record.pickupAvailable && (
                                            <Badge variant="outline" className="text-[10px] bg-blue-50">
                                                Pickup Available
                                            </Badge>
                                        )}
                                        <Badge variant="outline" className="text-[10px]">
                                            Weight Limit: {record.weightLimit} kg
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
                        <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                        <p className="text-gray-500 text-sm">No pincode records found</p>
                        <p className="text-xs text-gray-400 mt-1">Click "Add New Pincode" to create one</p>
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
                                    Edit Pincode Record
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4 text-blue-600" />
                                    Add New Pincode
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
                                <Label className="text-xs">Pincode <span className="text-red-500">*</span></Label>
                                <Input value={formData.pincode} onChange={(e) => handleInputChange("pincode", e.target.value)} className="h-8 text-xs" maxLength={6} />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">City <span className="text-red-500">*</span></Label>
                                <Input value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} className="h-8 text-xs" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label className="text-xs">District</Label>
                                <Input value={formData.district} onChange={(e) => handleInputChange("district", e.target.value)} className="h-8 text-xs" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">State <span className="text-red-500">*</span></Label>
                                <Select value={formData.state} onValueChange={(v) => handleInputChange("state", v)}>
                                    <SelectTrigger className="h-8 text-xs">
                                        <SelectValue placeholder="Select State" />
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
                                <Label className="text-xs">Country</Label>
                                <Input value={formData.country} onChange={(e) => handleInputChange("country", e.target.value)} className="h-8 text-xs" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Area Type</Label>
                                <Select value={formData.areaType} onValueChange={(v) => handleInputChange("areaType", v)}>
                                    <SelectTrigger className="h-8 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {areaTypeOptions.map(opt => (
                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Region & Zone */}
                        <div className="border-b pb-2 pt-2">
                            <h3 className="text-sm font-semibold text-gray-800">Region & Zone</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label className="text-xs">Region</Label>
                                <Select value={formData.region} onValueChange={(v) => handleInputChange("region", v)}>
                                    <SelectTrigger className="h-8 text-xs">
                                        <SelectValue placeholder="Select Region" />
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
                                        <SelectValue placeholder="Select Zone" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {zoneOptions.map(opt => (
                                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Hub & Spoke Assignment */}
                        <div className="border-b pb-2 pt-2">
                            <h3 className="text-sm font-semibold text-gray-800">Hub & Spoke Assignment</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
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
                            <div className="space-y-1">
                                <Label className="text-xs">Spoke</Label>
                                <Select value={formData.spokeId?.toString()} onValueChange={handleSpokeChange}>
                                    <SelectTrigger className="h-8 text-xs">
                                        <SelectValue placeholder="Select Spoke" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">None</SelectItem>
                                        {getFilteredSpokes().map(opt => (
                                            <SelectItem key={opt.id} value={opt.id.toString()}>{opt.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Delivery Settings */}
                        <div className="border-b pb-2 pt-2">
                            <h3 className="text-sm font-semibold text-gray-800">Delivery Settings</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label className="text-xs">Delivery Status</Label>
                                <Select value={formData.deliveryStatus} onValueChange={(v) => handleInputChange("deliveryStatus", v)}>
                                    <SelectTrigger className="h-8 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {deliveryStatusOptions.map(opt => (
                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Delivery Time (hours)</Label>
                                <Input type="number" value={formData.deliveryTimeHours} onChange={(e) => handleInputChange("deliveryTimeHours", Number(e.target.value))} className="h-8 text-xs" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label className="text-xs">Weight Limit (kg)</Label>
                                <Input type="number" value={formData.weightLimit} onChange={(e) => handleInputChange("weightLimit", Number(e.target.value))} className="h-8 text-xs" />
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
                                    checked={formData.codAvailable}
                                    onChange={(e) => handleInputChange("codAvailable", e.target.checked)}
                                    className="h-3.5 w-3.5"
                                    id="cod"
                                />
                                <Label htmlFor="cod" className="text-xs cursor-pointer">Cash on Delivery Available</Label>
                            </div>
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

                        {/* Special Instructions */}
                        <div className="space-y-1">
                            <Label className="text-xs">Special Instructions</Label>
                            <Textarea
                                value={formData.specialInstructions}
                                onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
                                placeholder="Enter any special instructions..."
                                rows={3}
                                className="text-xs resize-none"
                            />
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