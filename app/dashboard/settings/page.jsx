"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Bell,
  Shield,
  CreditCard,
  MapPin,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { api } from "@/lib/api"
import { useAuth } from "@/lib/AuthContext"

export default function SettingsPage() {
  const { user } = useAuth()

  const [profile, setProfile] = useState({ name: "", email: "", phone: "", address: "" })
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileMsg, setProfileMsg] = useState(null)

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState(null)

  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    appointments: true,
    reminders: true,
    promotions: false,
    newsletter: true,
  })

  // Populate from auth context when user loads
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      })
    }
  }, [user])

  const handleProfileSave = async () => {
    try {
      setProfileSaving(true)
      setProfileMsg(null)
      await api.updateProfile({ name: profile.name, phone: profile.phone, address: profile.address })
      setProfileMsg({ type: "success", text: "Profile updated successfully!" })
    } catch (error) {
      setProfileMsg({ type: "error", text: error.message || "Failed to update profile." })
    } finally {
      setProfileSaving(false)
      setTimeout(() => setProfileMsg(null), 4000)
    }
  }

  const handlePasswordUpdate = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordMsg({ type: "error", text: "New passwords do not match." })
      return
    }
    if (passwords.newPassword.length < 6) {
      setPasswordMsg({ type: "error", text: "New password must be at least 6 characters." })
      return
    }
    try {
      setPasswordSaving(true)
      setPasswordMsg(null)
      await api.updatePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      })
      setPasswordMsg({ type: "success", text: "Password updated successfully!" })
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (error) {
      setPasswordMsg({ type: "error", text: error.message || "Failed to update password." })
    } finally {
      setPasswordSaving(false)
      setTimeout(() => setPasswordMsg(null), 4000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        {/* Tab bar — always horizontal, always full-width 4 columns */}
        <TabsList className="grid w-full grid-cols-4 h-12 rounded-xl p-1">
          <TabsTrigger value="profile" className="flex items-center gap-2 rounded-lg text-sm font-medium">
            <User className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2 rounded-lg text-sm font-medium">
            <Bell className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2 rounded-lg text-sm font-medium">
            <Shield className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2 rounded-lg text-sm font-medium">
            <CreditCard className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Billing</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader className="border-b border-border pb-6">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-primary" />
                Profile Information
              </CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Avatar row */}
              <div className="flex items-center gap-4 rounded-xl bg-muted/40 p-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 ring-2 ring-primary/20">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{profile.name || "Your Name"}</p>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                </div>
              </div>

              {profileMsg && (
                <div
                  className={`flex items-center gap-2 rounded-md p-3 text-sm ${
                    profileMsg.type === "success"
                      ? "bg-primary/10 text-primary"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {profileMsg.type === "success" ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  {profileMsg.text}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="cursor-not-allowed opacity-60"
                  />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="e.g. +1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">
                  <MapPin className="mr-1 inline h-4 w-4" />
                  Address
                </Label>
                <Input
                  id="address"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  placeholder="Enter your address for home consultations"
                />
              </div>

              <Button onClick={handleProfileSave} className="gap-2" disabled={profileSaving}>
                {profileSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {profileSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader className="border-b border-border pb-6">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="h-5 w-5 text-primary" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-border pt-0">
              {/* Communication Channels */}
              <div className="space-y-1 py-6">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Communication Channels
                </p>
                <div className="flex items-center justify-between rounded-lg px-1 py-3">
                  <div>
                    <p className="font-medium text-foreground">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, email: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg px-1 py-3">
                  <div>
                    <p className="font-medium text-foreground">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates via text message</p>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, sms: checked })
                    }
                  />
                </div>
              </div>

              {/* Notification Types */}
              <div className="space-y-1 py-6">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Notification Types
                </p>
                <div className="flex items-center justify-between rounded-lg px-1 py-3">
                  <div>
                    <p className="font-medium text-foreground">Appointment Updates</p>
                    <p className="text-sm text-muted-foreground">Booking confirmations and changes</p>
                  </div>
                  <Switch
                    checked={notifications.appointments}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, appointments: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg px-1 py-3">
                  <div>
                    <p className="font-medium text-foreground">Appointment Reminders</p>
                    <p className="text-sm text-muted-foreground">Reminders before scheduled appointments</p>
                  </div>
                  <Switch
                    checked={notifications.reminders}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, reminders: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg px-1 py-3">
                  <div>
                    <p className="font-medium text-foreground">Promotions & Offers</p>
                    <p className="text-sm text-muted-foreground">Special deals and discounts</p>
                  </div>
                  <Switch
                    checked={notifications.promotions}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, promotions: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg px-1 py-3">
                  <div>
                    <p className="font-medium text-foreground">Newsletter</p>
                    <p className="text-sm text-muted-foreground">Pet care tips and platform updates</p>
                  </div>
                  <Switch
                    checked={notifications.newsletter}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, newsletter: checked })
                    }
                  />
                </div>
              </div>

              {/* Save button */}
              <div className="pt-6">
                <Button className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader className="border-b border-border pb-6">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="h-5 w-5 text-primary" />
                  Change Password
                </CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {passwordMsg && (
                  <div
                    className={`flex items-center gap-2 rounded-md p-3 text-sm ${
                      passwordMsg.type === "success"
                        ? "bg-primary/10 text-primary"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {passwordMsg.type === "success" ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    {passwordMsg.text}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={passwords.currentPassword}
                    onChange={(e) =>
                      setPasswords({ ...passwords, currentPassword: e.target.value })
                    }
                    placeholder="Enter current password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={passwords.newPassword}
                    onChange={(e) =>
                      setPasswords({ ...passwords, newPassword: e.target.value })
                    }
                    placeholder="At least 6 characters"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={(e) =>
                      setPasswords({ ...passwords, confirmPassword: e.target.value })
                    }
                    placeholder="Repeat new password"
                  />
                </div>
                <Button onClick={handlePasswordUpdate} disabled={passwordSaving}>
                  {passwordSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-destructive/40">
              <CardHeader className="border-b border-destructive/20 pb-6">
                <CardTitle className="flex items-center gap-2 text-lg text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription>Irreversible actions for your account</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between rounded-lg bg-destructive/5 p-4">
                  <div>
                    <p className="font-medium text-foreground">Delete Account</p>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing">
          <BillingTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function BillingTab() {
  const [billingHistory, setBillingHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBilling = async () => {
      try {
        const response = await api.getAppointments({ status: "completed" })
        setBillingHistory((response.data || []).slice(0, 10))
      } catch {
        // silent fail
      } finally {
        setLoading(false)
      }
    }
    fetchBilling()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return "—"
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Card>
      <CardHeader className="border-b border-border pb-6">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CreditCard className="h-5 w-5 text-primary" />
          Billing History
        </CardTitle>
        <CardDescription>Your past consultation transactions</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : billingHistory.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-6">No transactions yet</p>
        ) : (
          <div className="space-y-4">
            {billingHistory.map((appt) => (
              <div
                key={appt._id}
                className="flex items-center justify-between border-b border-border pb-4 last:border-0"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {appt.doctor?.user?.name
                      ? `Dr. ${appt.doctor.user.name} — Consultation`
                      : "Consultation"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(appt.appointmentDate)}
                  </p>
                </div>
                <p className="font-medium text-foreground">
                  {appt.payment?.amount ? `$${appt.payment.amount}` : "—"}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
