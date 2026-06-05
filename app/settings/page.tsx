"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import {
  Settings,
  User,
  Bell,
  Shield,
  Globe,
  Truck,
  Database,
  Mail,
  Phone,
  Building,
  Save,
  Key,
  Palette,
  Monitor,
  Sun,
  Moon,
  Camera,
  X,
  Check,
  AlertCircle,
  Loader2,
  Smartphone,
  RefreshCw,
  Users,
  Trash2,
  Edit,
  Eye,
  Plus,
} from "lucide-react"
import { 
  createUser, 
  getAllUsers, 
  getUser, 
  updateUser, 
  deleteUser, 
  uploadProfileImage, 
  changeUserPassword 
} from "@/services/api"

export default function SettingsPage() {
  const { toast } = useToast()
  const fileInputRef = useRef(null)
  const [activeTab, setActiveTab] = useState("general")
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [showUserList, setShowUserList] = useState(false)
  const [allUsers, setAllUsers] = useState([])
  const [error, setError] = useState(null)

  // Profile Image State
  const [profileImage, setProfileImage] = useState(null)

  // User State
  const [userProfile, setUserProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "Admin",
    department: "Management",
    password: "",
  })

  // Company Settings State
  const [companySettings, setCompanySettings] = useState({
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyAddress: "",
    companyWebsite: "",
    taxId: "",
    gstNumber: "",
    panNumber: "",
  })

  // Notification Settings State
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    deliveryAlerts: true,
    maintenanceAlerts: true,
    lowInventoryAlerts: false,
    securityAlerts: true,
    promotionalEmails: false,
  })

  // System Settings State
  const [systemSettings, setSystemSettings] = useState({
    theme: "system",
    language: "en",
    timezone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
    currency: "INR",
    currencySymbol: "₹",
    distanceUnit: "km",
    weightUnit: "kg",
  })

  // Security State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  })

  // Integrations State
  const [integrations, setIntegrations] = useState([
    { id: 1, name: "Google Maps API", description: "Route optimization and tracking", status: "connected", icon: <Globe className="h-5 w-5" />, bg: "bg-blue-100", text: "text-blue-600" },
    { id: 2, name: "SendGrid", description: "Email notifications and alerts", status: "connected", icon: <Mail className="h-5 w-5" />, bg: "bg-green-100", text: "text-green-600" },
    { id: 3, name: "Twilio", description: "SMS notifications and alerts", status: "disconnected", icon: <Phone className="h-5 w-5" />, bg: "bg-purple-100", text: "text-purple-600" },
    { id: 4, name: "Razorpay", description: "Payment gateway integration", status: "connected", icon: <Database className="h-5 w-5" />, bg: "bg-blue-100", text: "text-blue-600" },
  ])

  // Load all users on mount
  useEffect(() => {
    loadAllUsers()
  }, [])

  const loadAllUsers = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await getAllUsers()
      console.log("API Response:", res.data)
      if (res.data.success) {
        setAllUsers(res.data.data || [])
      }
    } catch (error) {
      console.error("Error loading users:", error)
      setError(error.response?.data?.message || error.message)
      toast({ 
        title: "Error", 
        description: "Failed to load users. Make sure backend is running on port 4000", 
        variant: "destructive" 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadUserData = async (userId) => {
    setIsLoading(true)
    try {
      const res = await getUser(userId)
      if (res.data.success) {
        const { user, settings } = res.data.data
        
        setUserProfile({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          phone: user.phone || "",
          role: user.role || "Admin",
          department: user.department || "Management",
          password: "",
        })
        setProfileImage(user.profileImage)
        
        if (settings) {
          setCompanySettings({
            companyName: settings.companyName || "",
            companyEmail: settings.companyEmail || "",
            companyPhone: settings.companyPhone || "",
            companyAddress: settings.companyAddress || "",
            companyWebsite: settings.companyWebsite || "",
            taxId: settings.taxId || "",
            gstNumber: settings.gstNumber || "",
            panNumber: settings.panNumber || "",
          })
          
          setNotifications({
            emailNotifications: settings.emailNotifications ?? true,
            smsNotifications: settings.smsNotifications ?? false,
            pushNotifications: settings.pushNotifications ?? true,
            deliveryAlerts: settings.deliveryAlerts ?? true,
            maintenanceAlerts: settings.maintenanceAlerts ?? true,
            lowInventoryAlerts: settings.lowInventoryAlerts ?? false,
            securityAlerts: settings.securityAlerts ?? true,
            promotionalEmails: settings.promotionalEmails ?? false,
          })
          
          setSystemSettings({
            theme: settings.theme || "system",
            language: settings.language || "en",
            timezone: settings.timezone || "Asia/Kolkata",
            dateFormat: settings.dateFormat || "DD/MM/YYYY",
            currency: settings.currency || "INR",
            currencySymbol: settings.currencySymbol || "₹",
            distanceUnit: settings.distanceUnit || "km",
            weightUnit: settings.weightUnit || "kg",
          })
          
          setTwoFactorEnabled(settings.twoFactorEnabled || false)
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error)
      toast({ title: "Error", description: "Failed to load user data", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!userProfile.firstName || !userProfile.lastName || !userProfile.email || !userProfile.phone) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" })
      return
    }
    
    if (!userProfile.password) {
      toast({ title: "Error", description: "Please enter a password", variant: "destructive" })
      return
    }
    
    if (userProfile.password && userProfile.password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" })
      return
    }
    
    setIsLoading(true)
    try {
      const allSettings = {
        ...companySettings,
        ...notifications,
        ...systemSettings,
        twoFactorEnabled,
      }
      
      const requestData = {
        user: userProfile,
        settings: allSettings,
      }
      
      console.log("Sending request:", requestData)
      
      const res = await createUser(requestData)
      console.log("Response:", res.data)
      
      if (res.data.success) {
        toast({ title: "Success!", description: "User created successfully!" })
        resetForm()
        await loadAllUsers()
        setShowUserList(true)
      }
    } catch (error) {
      console.error("Create user error:", error)
      toast({ 
        title: "Error", 
        description: error.response?.data?.message || "Failed to create user", 
        variant: "destructive" 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateUser = async () => {
    if (!selectedUserId) return
    
    setIsLoading(true)
    try {
      const allSettings = {
        ...companySettings,
        ...notifications,
        ...systemSettings,
        twoFactorEnabled,
      }
      
      await updateUser(selectedUserId, {
        user: userProfile,
        settings: allSettings,
      })
      
      toast({ title: "Success!", description: "User updated successfully!" })
      await loadAllUsers()
    } catch (error) {
      console.error("Update user error:", error)
      toast({ title: "Error", description: "Failed to update user", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setIsLoading(true)
      try {
        await deleteUser(userId)
        toast({ title: "Success!", description: "User deleted successfully!" })
        if (selectedUserId === userId) {
          resetForm()
          setSelectedUserId(null)
        }
        await loadAllUsers()
      } catch (error) {
        console.error("Delete user error:", error)
        toast({ title: "Error", description: "Failed to delete user", variant: "destructive" })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleChangePassword = async () => {
    if (!selectedUserId) return
    
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" })
      return
    }
    
    if (passwordData.newPassword.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" })
      return
    }
    
    setIsLoading(true)
    try {
      await changeUserPassword(selectedUserId, { newPassword: passwordData.newPassword })
      toast({ title: "Success!", description: "Password changed successfully!" })
      setPasswordData({ newPassword: "", confirmNewPassword: "" })
    } catch (error) {
      console.error("Change password error:", error)
      toast({ title: "Error", description: "Failed to change password", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setUserProfile({
      firstName: "", lastName: "", email: "", phone: "", role: "Admin", department: "Management", password: "",
    })
    setCompanySettings({
      companyName: "", companyEmail: "", companyPhone: "", companyAddress: "", companyWebsite: "", taxId: "", gstNumber: "", panNumber: "",
    })
    setNotifications({
      emailNotifications: true, smsNotifications: false, pushNotifications: true,
      deliveryAlerts: true, maintenanceAlerts: true, lowInventoryAlerts: false,
      securityAlerts: true, promotionalEmails: false,
    })
    setSystemSettings({
      theme: "system", language: "en", timezone: "Asia/Kolkata", dateFormat: "DD/MM/YYYY",
      currency: "INR", currencySymbol: "₹", distanceUnit: "km", weightUnit: "kg",
    })
    setProfileImage(null)
    setSelectedUserId(null)
    setTwoFactorEnabled(false)
    setPasswordData({ newPassword: "", confirmNewPassword: "" })
  }

  const handleSelectUser = (user) => {
    setSelectedUserId(user._id)
    loadUserData(user._id)
    setShowUserList(false)
  }

  const handleFileSelect = () => fileInputRef.current?.click()

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "Error", description: "File size must be less than 2MB", variant: "destructive" })
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("profileImage", file)
      formData.append("userId", selectedUserId)
      
      const res = await uploadProfileImage(formData)
      if (res.data.success) {
        setProfileImage(res.data.imageUrl)
        toast({ title: "Success!", description: "Profile photo uploaded successfully" })
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast({ title: "Upload Failed", description: "Failed to upload image", variant: "destructive" })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleRemovePhoto = () => {
    setProfileImage(null)
    toast({ title: "Photo Removed", description: "Profile photo has been removed" })
  }

  return (
    <div className="space-y-6">
      {/* Header with User Selection */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Settings Management</h1>
          <p className="text-gray-500 text-sm">Create and manage multiple user accounts with their settings</p>
        </div>
        
        <div className="flex gap-3">
          {!showUserList && !selectedUserId && (
            <Button onClick={() => setShowUserList(true)} variant="outline" className="flex items-center gap-2">
              <Users className="h-4 w-4" /> View All Users ({allUsers.length})
            </Button>
          )}
          
          {selectedUserId && (
            <Button onClick={resetForm} variant="outline" className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Create New User
            </Button>
          )}
        </div>
      </div>

      {/* User List View */}
      {showUserList && !selectedUserId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />All Users</CardTitle>
            <CardDescription>Select a user to edit their settings or create a new user</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {isLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
                  <p className="text-gray-500 mt-2">Loading users...</p>
                </div>
              ) : allUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p>No users found. Create your first user!</p>
                  <Button onClick={() => setShowUserList(false)} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" /> Create User
                  </Button>
                </div>
              ) : (
                allUsers.map((user) => (
                  <div key={user._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        {user.profileImage ? (
                          <AvatarImage src={user.profileImage} />
                        ) : (
                          <AvatarFallback className="bg-blue-500 text-white">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleSelectUser(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(user._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setShowUserList(false)} variant="outline">Close</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Settings Form */}
      {(!showUserList || selectedUserId) && (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">
                {selectedUserId ? `Edit: ${userProfile.firstName} ${userProfile.lastName}` : "Create New User"}
              </h2>
            </div>
            {selectedUserId && (
              <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(selectedUserId)}>
                <Trash2 className="h-4 w-4 mr-2" /> Delete User
              </Button>
            )}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="flex flex-wrap gap-2 justify-start h-max">
              <TabsTrigger value="general" className="flex items-center gap-2"><Building className="h-4 w-4" />General</TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2"><User className="h-4 w-4" />Profile</TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2"><Bell className="h-4 w-4" />Notifications</TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2"><Shield className="h-4 w-4" />Security</TabsTrigger>
              <TabsTrigger value="system" className="flex items-center gap-2"><Monitor className="h-4 w-4" />System</TabsTrigger>
              <TabsTrigger value="integrations" className="flex items-center gap-2"><Database className="h-4 w-4" />Integrations</TabsTrigger>
            </TabsList>

            {/* General Tab - Company Information */}
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Building className="h-5 w-5" />Company Information</CardTitle>
                  <CardDescription>Update company details for this user</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Company Name</Label>
                      <Input value={companySettings.companyName} onChange={(e) => setCompanySettings({ ...companySettings, companyName: e.target.value })} placeholder="Enter company name" />
                    </div>
                    <div className="space-y-2">
                      <Label>GST Number</Label>
                      <Input value={companySettings.gstNumber} onChange={(e) => setCompanySettings({ ...companySettings, gstNumber: e.target.value })} placeholder="Enter GST number" />
                    </div>
                    <div className="space-y-2">
                      <Label>PAN Number</Label>
                      <Input value={companySettings.panNumber} onChange={(e) => setCompanySettings({ ...companySettings, panNumber: e.target.value })} placeholder="Enter PAN number" />
                    </div>
                    <div className="space-y-2">
                      <Label>Tax ID</Label>
                      <Input value={companySettings.taxId} onChange={(e) => setCompanySettings({ ...companySettings, taxId: e.target.value })} placeholder="Enter tax ID" />
                    </div>
                    <div className="space-y-2">
                      <Label>Company Email</Label>
                      <Input type="email" value={companySettings.companyEmail} onChange={(e) => setCompanySettings({ ...companySettings, companyEmail: e.target.value })} placeholder="company@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>Company Phone</Label>
                      <Input value={companySettings.companyPhone} onChange={(e) => setCompanySettings({ ...companySettings, companyPhone: e.target.value })} placeholder="+91 XXXXXXXXXX" />
                    </div>
                    <div className="space-y-2">
                      <Label>Website</Label>
                      <Input value={companySettings.companyWebsite} onChange={(e) => setCompanySettings({ ...companySettings, companyWebsite: e.target.value })} placeholder="www.example.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Company Address</Label>
                    <Textarea rows={3} value={companySettings.companyAddress} onChange={(e) => setCompanySettings({ ...companySettings, companyAddress: e.target.value })} placeholder="Enter complete address" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" />Personal Information</CardTitle>
                  <CardDescription>Manage user profile and account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24 border-4 shadow-lg">
                        {profileImage ? (
                          <AvatarImage src={profileImage} alt="Profile" className="object-cover" />
                        ) : (
                          <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-blue-600 to-blue-500 text-white">
                            {userProfile.firstName?.[0]}{userProfile.lastName?.[0]}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      {profileImage && selectedUserId && (
                        <Button size="sm" variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0" onClick={handleRemovePhoto}>
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-4 flex-1">
                      {selectedUserId && (
                        <div className="flex flex-wrap gap-3">
                          <Button variant="outline" onClick={handleFileSelect} disabled={isUploading}>
                            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                            {profileImage ? "Change Photo" : "Upload Photo"}
                          </Button>
                        </div>
                      )}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="h-4 w-4 text-green-500" /> JPG, PNG or GIF formats supported
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="h-4 w-4 text-green-500" /> Maximum file size: 2MB
                        </div>
                      </div>
                    </div>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/gif" onChange={handleFileChange} className="hidden" />
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>First Name *</Label>
                      <Input value={userProfile.firstName} onChange={(e) => setUserProfile({ ...userProfile, firstName: e.target.value })} placeholder="Enter first name" />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name *</Label>
                      <Input value={userProfile.lastName} onChange={(e) => setUserProfile({ ...userProfile, lastName: e.target.value })} placeholder="Enter last name" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email *</Label>
                      <Input type="email" value={userProfile.email} onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })} placeholder="user@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone *</Label>
                      <Input value={userProfile.phone} onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })} placeholder="+91 XXXXXXXXXX" />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Input value={userProfile.role} onChange={(e) => setUserProfile({ ...userProfile, role: e.target.value })} placeholder="Admin / Manager / Staff" />
                    </div>
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Input value={userProfile.department} onChange={(e) => setUserProfile({ ...userProfile, department: e.target.value })} placeholder="IT / HR / Operations" />
                    </div>
                    {!selectedUserId && (
                      <div className="space-y-2">
                        <Label>Password * (min 6 characters)</Label>
                        <Input type="password" value={userProfile.password} onChange={(e) => setUserProfile({ ...userProfile, password: e.target.value })} placeholder="Enter password" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" />Notification Preferences</CardTitle>
                  <CardDescription>Configure how user receives notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Communication Channels</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div><Label className="flex items-center gap-2"><Mail className="h-4 w-4" />Email Notifications</Label><p className="text-sm text-muted-foreground">Receive notifications via email</p></div>
                        <Switch checked={notifications.emailNotifications} onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div><Label className="flex items-center gap-2"><Smartphone className="h-4 w-4" />SMS Notifications</Label><p className="text-sm text-muted-foreground">Receive notifications via SMS</p></div>
                        <Switch checked={notifications.smsNotifications} onCheckedChange={(checked) => setNotifications({ ...notifications, smsNotifications: checked })} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div><Label className="flex items-center gap-2"><Bell className="h-4 w-4" />Push Notifications</Label><p className="text-sm text-muted-foreground">Receive push notifications in browser</p></div>
                        <Switch checked={notifications.pushNotifications} onCheckedChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })} />
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <h4 className="font-medium">Alert Types</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div><Label className="flex items-center gap-2"><Truck className="h-4 w-4" />Delivery Alerts</Label><p className="text-sm text-muted-foreground">Notifications about delivery status</p></div>
                        <Switch checked={notifications.deliveryAlerts} onCheckedChange={(checked) => setNotifications({ ...notifications, deliveryAlerts: checked })} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div><Label className="flex items-center gap-2"><RefreshCw className="h-4 w-4" />Maintenance Alerts</Label><p className="text-sm text-muted-foreground">Notifications about maintenance schedules</p></div>
                        <Switch checked={notifications.maintenanceAlerts} onCheckedChange={(checked) => setNotifications({ ...notifications, maintenanceAlerts: checked })} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div><Label className="flex items-center gap-2"><Database className="h-4 w-4" />Low Inventory Alerts</Label><p className="text-sm text-muted-foreground">When inventory levels are low</p></div>
                        <Switch checked={notifications.lowInventoryAlerts} onCheckedChange={(checked) => setNotifications({ ...notifications, lowInventoryAlerts: checked })} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div><Label className="flex items-center gap-2"><Shield className="h-4 w-4" />Security Alerts</Label><p className="text-sm text-muted-foreground">Login alerts and security notifications</p></div>
                        <Switch checked={notifications.securityAlerts} onCheckedChange={(checked) => setNotifications({ ...notifications, securityAlerts: checked })} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div><Label className="flex items-center gap-2"><Mail className="h-4 w-4" />Promotional Emails</Label><p className="text-sm text-muted-foreground">Newsletters and marketing emails</p></div>
                        <Switch checked={notifications.promotionalEmails} onCheckedChange={(checked) => setNotifications({ ...notifications, promotionalEmails: checked })} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Security Settings</CardTitle>
                  <CardDescription>Manage user security and authentication</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {selectedUserId && (
                    <div className="space-y-4">
                      <h4 className="font-medium flex items-center gap-2"><Key className="h-4 w-4" />Change Password</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>New Password</Label>
                          <Input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} placeholder="Enter new password" />
                        </div>
                        <div className="space-y-2">
                          <Label>Confirm New Password</Label>
                          <Input type="password" value={passwordData.confirmNewPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })} placeholder="Confirm new password" />
                        </div>
                      </div>
                      <Button onClick={handleChangePassword} disabled={isLoading} className="flex items-center gap-2">
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
                        Change Password
                      </Button>
                    </div>
                  )}

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2 items-center justify-between">
                      <div>
                        <h4 className="font-medium flex items-center gap-2"><Shield className="h-4 w-4" />Two-Factor Authentication</h4>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={twoFactorEnabled ? "default" : "secondary"}>{twoFactorEnabled ? "Enabled" : "Disabled"}</Badge>
                        <Button variant="outline" onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}>
                          {twoFactorEnabled ? "Disable" : "Enable"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* System Tab */}
            <TabsContent value="system" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Monitor className="h-5 w-5" />System Preferences</CardTitle>
                  <CardDescription>Configure system-wide settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium flex items-center gap-2"><Palette className="h-4 w-4" />Appearance</h4>
                      <div className="space-y-2">
                        <Label>Theme</Label>
                        <Select value={systemSettings.theme} onValueChange={(value) => setSystemSettings({ ...systemSettings, theme: value })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light"><div className="flex items-center gap-2"><Sun className="h-4 w-4" />Light</div></SelectItem>
                            <SelectItem value="dark"><div className="flex items-center gap-2"><Moon className="h-4 w-4" />Dark</div></SelectItem>
                            <SelectItem value="system"><div className="flex items-center gap-2"><Monitor className="h-4 w-4" />System</div></SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium flex items-center gap-2"><Globe className="h-4 w-4" />Localization</h4>
                      <div className="space-y-2">
                        <Label>Language</Label>
                        <Select value={systemSettings.language} onValueChange={(value) => setSystemSettings({ ...systemSettings, language: value })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="hi">Hindi</SelectItem>
                            <SelectItem value="ta">Tamil</SelectItem>
                            <SelectItem value="te">Telugu</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Timezone</Label>
                        <Select value={systemSettings.timezone} onValueChange={(value) => setSystemSettings({ ...systemSettings, timezone: value })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Asia/Kolkata">India (IST)</SelectItem>
                            <SelectItem value="Asia/Dubai">Dubai (GST)</SelectItem>
                            <SelectItem value="Asia/Singapore">Singapore (SGT)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium">Date & Currency</h4>
                      <div className="space-y-2">
                        <Label>Date Format</Label>
                        <Select value={systemSettings.dateFormat} onValueChange={(value) => setSystemSettings({ ...systemSettings, dateFormat: value })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Currency</Label>
                        <Select value={systemSettings.currency} onValueChange={(value) => {
                          const symbols = { INR: "₹", USD: "$", EUR: "€", GBP: "£" }
                          setSystemSettings({ ...systemSettings, currency: value, currencySymbol: symbols[value] || "₹" })
                        }}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                            <SelectItem value="USD">US Dollar ($)</SelectItem>
                            <SelectItem value="EUR">Euro (€)</SelectItem>
                            <SelectItem value="GBP">British Pound (£)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium">Units</h4>
                      <div className="space-y-2">
                        <Label>Distance Unit</Label>
                        <Select value={systemSettings.distanceUnit} onValueChange={(value) => setSystemSettings({ ...systemSettings, distanceUnit: value })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="km">Kilometers (km)</SelectItem>
                            <SelectItem value="miles">Miles (mi)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Weight Unit</Label>
                        <Select value={systemSettings.weightUnit} onValueChange={(value) => setSystemSettings({ ...systemSettings, weightUnit: value })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kg">Kilograms (kg)</SelectItem>
                            <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Integrations Tab */}
            <TabsContent value="integrations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Database className="h-5 w-5" />Third-Party Integrations</CardTitle>
                  <CardDescription>Manage connections to external services</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {integrations.map((integration) => (
                      <div key={integration.id} className="flex flex-wrap gap-2 items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-all duration-300">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 ${integration.bg} rounded-lg flex items-center justify-center`}>
                            <div className={integration.text}>{integration.icon}</div>
                          </div>
                          <div>
                            <h4 className="font-medium">{integration.name}</h4>
                            <p className="text-sm text-muted-foreground">{integration.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={integration.status === "connected" ? "default" : "secondary"}>
                            {integration.status === "connected" ? "Connected" : "Disconnected"}
                          </Badge>
                          <Button variant="outline" size="sm">
                            {integration.status === "connected" ? "Configure" : "Connect"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 sticky bottom-4">
            {selectedUserId ? (
              <Button onClick={handleUpdateUser} disabled={isLoading} className="flex items-center gap-2">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Update User
              </Button>
            ) : (
              <Button onClick={handleCreateUser} disabled={isLoading} className="flex items-center gap-2">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Create User
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  )
}