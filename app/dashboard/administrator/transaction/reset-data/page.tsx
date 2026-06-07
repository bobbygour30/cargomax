"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Send, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ResetDataPage() {
  const [resetType, setResetType] = useState<string>("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleSendOTP = () => {
    if (!resetType) {
      alert("Please select Reset Type");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setOtpSent(true);
      setLoading(false);
      alert("OTP has been sent to your registered email and mobile number.");
    }, 800);
  };

  const handleResetData = () => {
    if (!otp || otp.length < 4) {
      alert("Please enter valid OTP");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setConfirmed(true);
      setLoading(false);
      alert("✅ Data Reset Successfully Completed!");
      
      // Reset form after success
      setTimeout(() => {
        setResetType("");
        setOtp("");
        setOtpSent(false);
        setConfirmed(false);
      }, 2000);
    }, 1200);
  };

  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-xl font-bold text-red-600">RESET DATA MASTER</h1>
        <div className="text-xs text-muted-foreground mt-1">
          Company : GOLDEN ROADWAYS &amp; LOGISTICS PVT LTD | Login By : MAYANK.GRLOGISTICS@GMAIL.COM
          <br />
          Login Branch : CORPORATE OFFICE | Financial Year : 2026-2027
        </div>
      </div>

      <Card className="border-red-200">
        <CardHeader className="bg-red-50 border-b">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <CardTitle className="text-red-700">!!! DANGER ZONE !!!</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Warning Message */}
          <div className="bg-red-50 border border-red-300 rounded-lg p-6 mb-8">
            <p className="text-red-700 font-semibold text-center text-lg">
              !!! WARNING !!!
            </p>
            <p className="text-red-600 text-center mt-2 leading-relaxed">
              All the data will be lost, please make sure that you are authorized to perform this action.
            </p>
          </div>

          <div className="space-y-6">
            {/* Reset Type */}
            <div className="space-y-2">
              <Label className="text-base font-medium">
                Reset Type <span className="text-red-500">*</span>
              </Label>
              <Select value={resetType} onValueChange={setResetType}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select Reset Option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_reset">
                    Remove All Data &amp; Reset To Original Position
                  </SelectItem>
                  <SelectItem value="transaction_reset">
                    Remove All Transaction Data Except Masters
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Send OTP Button */}
            {!otpSent && (
              <Button
                onClick={handleSendOTP}
                disabled={!resetType || loading}
                className="w-full h-12 bg-red-600 hover:bg-red-700 text-white text-base"
              >
                <Send className="mr-2 h-5 w-5" />
                {loading ? "Sending OTP..." : "SEND OTP"}
              </Button>
            )}

            {/* OTP Section */}
            {otpSent && !confirmed && (
              <div className="space-y-4 border-t pt-6">
                <div className="flex items-center gap-2 text-green-600 font-medium">
                  <ShieldCheck className="h-5 w-5" />
                  OTP Sent Successfully
                </div>

                <div>
                  <Label>Enter OTP</Label>
                  <Input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="Enter 6 digit OTP"
                    className="text-center text-lg tracking-widest h-12"
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleResetData}
                    disabled={loading || otp.length < 4}
                    className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white"
                  >
                    {loading ? "Processing Reset..." : "CONFIRM RESET"}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp("");
                    }}
                    className="flex-1 h-12"
                  >
                    Cancel
                  </Button>
                </div>

                <p className="text-xs text-center text-muted-foreground">
                  This action is irreversible. Proceed with caution.
                </p>
              </div>
            )}

            {/* Success State */}
            {confirmed && (
              <div className="text-center py-12 bg-green-50 border border-green-300 rounded-xl">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-green-700">Data Reset Completed</h3>
                <p className="text-green-600 mt-2">System has been successfully reset.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <div className="text-xs text-muted-foreground text-center">
        Only users with Super Admin rights can perform data reset operation.
      </div>
    </div>
  );
}