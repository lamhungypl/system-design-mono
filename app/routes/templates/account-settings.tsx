"use client"

import { useState } from "react"
import { Camera } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input, Textarea } from "~/components/ui/input"
import { Select } from "~/components/ui/select"
import { Avatar } from "~/components/ui/avatar"
import { Switch } from "~/components/ui/switch"
import { cn } from "~/lib/utils"

const menuItems = [
  { label: "Basic Settings", id: "basic" },
  { label: "Security Settings", id: "security" },
  { label: "Account Binding", id: "binding" },
  { label: "Message Notifications", id: "notifications" },
]

const countryOptions = [
  { value: "cn", label: "China" },
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
]

const provinceOptions = [
  { value: "zj", label: "Zhejiang" },
  { value: "gd", label: "Guangdong" },
  { value: "bj", label: "Beijing" },
]

const cityOptions = [
  { value: "hz", label: "Hangzhou" },
  { value: "sz", label: "Shenzhen" },
  { value: "bj", label: "Beijing" },
]

function BasicSettings() {
  return (
    <div className="space-y-5">
      <h2 className="text-base font-semibold">Basic Settings</h2>

      <div className="flex gap-8">
        <div className="flex-1 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <Input type="email" defaultValue="ant-design@alipay.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Nickname</label>
            <Input defaultValue="Serati Ma" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Personal Introduction</label>
            <Textarea rows={3} defaultValue="Front-end engineer at Ant Financial, focused on enterprise design systems." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Country / Region</label>
            <Select options={countryOptions} defaultValue="cn" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">Province</label>
              <Select options={provinceOptions} defaultValue="zj" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">City</label>
              <Select options={cityOptions} defaultValue="hz" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Street Address</label>
            <Input placeholder="Enter your street address" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Contact Phone</label>
            <Input type="tel" placeholder="Enter phone number" />
          </div>

          <div className="flex gap-3 pt-2">
            <Button>Update Information</Button>
          </div>
        </div>

        {/* Avatar Upload */}
        <div className="w-40 flex flex-col items-center gap-3">
          <div className="relative group cursor-pointer">
            <Avatar size={96}>U</Avatar>
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="size-6 text-white" />
            </div>
          </div>
          <Button variant="link" size="sm">Change Avatar</Button>
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            Recommended size: 200×200px<br />
            Max file size: 2MB
          </p>
        </div>
      </div>
    </div>
  )
}

function SecuritySettings() {
  const items = [
    { label: "Account Password", desc: "Current password security: strong. Last changed 3 months ago.", action: "Modify" },
    { label: "Security Phone", desc: "Bound phone: 138****8293. Can be used for login verification.", action: "Modify" },
    { label: "Security Email", desc: "Bound email: ant***@alipay.com. Can be used for login verification.", action: "Modify" },
    { label: "MFA Device", desc: "No MFA device bound. After binding, you can confirm your identity with the device.", action: "Bind" },
  ]
  return (
    <div>
      <h2 className="text-base font-semibold mb-4">Security Settings</h2>
      <div className="divide-y">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between py-4">
            <div>
              <div className="text-sm font-medium">{item.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
            </div>
            <Button variant="link" size="sm">{item.action}</Button>
          </div>
        ))}
      </div>
    </div>
  )
}

function BindingSettings() {
  const providers = [
    { name: "Taobao", icon: "🛒", bound: true, account: "taobao_user_01" },
    { name: "Alipay", icon: "💳", bound: true, account: "ant-design@alipay.com" },
    { name: "DingTalk", icon: "📱", bound: false, account: null },
    { name: "WeChat", icon: "💬", bound: false, account: null },
  ]
  return (
    <div>
      <h2 className="text-base font-semibold mb-4">Account Binding</h2>
      <div className="divide-y">
        {providers.map((p) => (
          <div key={p.name} className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{p.icon}</span>
              <div>
                <div className="text-sm font-medium">{p.name}</div>
                {p.bound && <div className="text-xs text-muted-foreground">{p.account}</div>}
              </div>
            </div>
            <Button variant={p.bound ? "outline" : "link"} size="sm">
              {p.bound ? "Unbind" : "Bind"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

function NotificationSettings() {
  const [settings, setSettings] = useState<Record<string, Record<string, boolean>>>({
    account: { email: true, sms: true, push: false },
    payments: { email: true, sms: false, push: true },
    todo: { email: false, sms: true, push: true },
    updates: { email: true, sms: false, push: false },
  })

  const toggle = (category: string, channel: string) => {
    setSettings((prev) => ({
      ...prev,
      [category]: { ...prev[category], [channel]: !prev[category][channel] },
    }))
  }

  const rows = [
    { id: "account", label: "Account Login Notification" },
    { id: "payments", label: "Payment Notification" },
    { id: "todo", label: "To-Do Notification" },
    { id: "updates", label: "System Updates" },
  ]

  return (
    <div>
      <h2 className="text-base font-semibold mb-4">Message Notifications</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left pb-3 font-medium text-muted-foreground">Notification Type</th>
            {["Email", "SMS", "Push"].map((c) => (
              <th key={c} className="pb-3 font-medium text-muted-foreground text-center">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="py-3">{row.label}</td>
              {(["email", "sms", "push"] as const).map((channel) => (
                <td key={channel} className="py-3 text-center">
                  <Switch
                    checked={settings[row.id][channel]}
                    onCheckedChange={() => toggle(row.id, channel)}
                    size="small"
                    aria-label={`${row.label} ${channel}`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function AccountSettings() {
  const [active, setActive] = useState("basic")

  const content: Record<string, React.ReactNode> = {
    basic: <BasicSettings />,
    security: <SecuritySettings />,
    binding: <BindingSettings />,
    notifications: <NotificationSettings />,
  }

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-xl font-semibold">Account Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your account information and preferences.</p>
      </div>

      <div className="flex gap-6">
        <nav className="w-48 shrink-0 space-y-0.5">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={cn(
                "w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors",
                active === item.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex-1 rounded-xl border bg-card p-6">
          {content[active]}
        </div>
      </div>
    </div>
  )
}
