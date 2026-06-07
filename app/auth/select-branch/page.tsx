"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Building2, ChevronRight, Store } from "lucide-react";
import toast from "react-hot-toast";

// Indian cities/branches data
const INDIAN_CITIES = [
  { id: 1, name: "DELHI", code: "DEL", region: "North" },
  { id: 2, name: "MUMBAI", code: "BOM", region: "West" },
  { id: 3, name: "BANGALORE", code: "BLR", region: "South" },
  { id: 4, name: "CHENNAI", code: "MAA", region: "South" },
  { id: 5, name: "KOLKATA", code: "CCU", region: "East" },
  { id: 6, name: "AHMEDABAD", code: "AMD", region: "West" },
  { id: 7, name: "PUNE", code: "PNQ", region: "West" },
  { id: 8, name: "HYDERABAD", code: "HYD", region: "South" },
  { id: 9, name: "LUCKNOW", code: "LKO", region: "North" },
  { id: 10, name: "JAIPUR", code: "JAI", region: "North" },
  { id: 11, name: "SURAT", code: "STV", region: "West" },
  { id: 12, name: "INDORE", code: "IDR", region: "Central" },
  { id: 13, name: "BHOPAL", code: "BHO", region: "Central" },
  { id: 14, name: "PATNA", code: "PAT", region: "East" },
  { id: 15, name: "CHANDIGARH", code: "IXC", region: "North" },
];

const regions = ["All", "North", "South", "East", "West", "Central"];

export default function SelectBranchPage() {
  const router = useRouter();
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [loading, setLoading] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const user = localStorage.getItem("user");
    
    if (!isLoggedIn || !user) {
      router.push("/login");
    }
  }, [router]);

  const filteredCities = INDIAN_CITIES.filter((city) => {
    const matchesSearch = city.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === "All" || city.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const handleBranchSelect = (branchName: string) => {
    setSelectedBranch(branchName);
  };

  const handleLogin = () => {
    if (!selectedBranch) {
      toast.error("Please select a branch");
      return;
    }

    setLoading(true);
    
    // Store selected branch
    localStorage.setItem("selectedBranch", selectedBranch);
    localStorage.setItem("branchCode", INDIAN_CITIES.find(c => c.name === selectedBranch)?.code || "");
    
    toast.success(`Welcome to ${selectedBranch} branch!`);
    
    // Redirect to dashboard
    setTimeout(() => {
      router.push("/dashboard/overview");
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-4xl shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-600 p-3 rounded-full">
              <Store className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Select Your Branch</CardTitle>
          <CardDescription>Choose the branch you want to work with</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label className="text-sm">Search Branch</Label>
              <input
                type="text"
                placeholder="Search by city name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:w-48">
              <Label className="text-sm">Filter by Region</Label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Branch Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-1">
            {filteredCities.map((city) => (
              <button
                key={city.id}
                onClick={() => handleBranchSelect(city.name)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedBranch === city.name
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-800">{city.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{city.region}</div>
                  </div>
                  {selectedBranch === city.name && (
                    <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-white" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {filteredCities.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Building2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No branches found</p>
            </div>
          )}

          {/* Selected Branch Info */}
          {selectedBranch && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Selected Branch</p>
                  <p className="font-semibold text-lg text-blue-700">{selectedBranch}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Branch Code</p>
                  <p className="font-mono text-sm">{INDIAN_CITIES.find(c => c.name === selectedBranch)?.code}</p>
                </div>
              </div>
            </div>
          )}

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            className="w-full h-11 bg-green-600 hover:bg-green-700"
            disabled={!selectedBranch || loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Logging in...
              </div>
            ) : (
              <>
                Proceed to Dashboard
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}