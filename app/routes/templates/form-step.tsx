"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { PasswordInput } from "~/components/ui/input"
import { InputNumber } from "~/components/ui/input-number"
import { Select } from "~/components/ui/select"
import { Steps } from "~/components/ui/steps"
import { Check } from "lucide-react"

const stepItems = [
  { title: "Payment Account" },
  { title: "Confirm Transfer" },
  { title: "Done" },
]

const accountOptions = [
  { value: "ant-design@alipay.com", label: "ant-design@alipay.com" },
  { value: "admin@example.com", label: "admin@example.com" },
]

function Step0({ onNext }: { onNext: () => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1.5">
          Payment Account <span className="text-destructive">*</span>
        </label>
        <Select options={accountOptions} defaultValue="ant-design@alipay.com" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">
          Recipient Account <span className="text-destructive">*</span>
        </label>
        <Input placeholder="Enter account number" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Recipient Name</label>
        <Input placeholder="Enter recipient name" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">
          Transfer Amount <span className="text-destructive">*</span>
        </label>
        <InputNumber
          placeholder="0.00"
          min={0}
          prefix="¥"
          className="w-full"
        />
      </div>
      <div className="pt-4">
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  )
}

function Step1({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-muted/50 p-4 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Payment Account</span>
          <span className="font-medium">ant-design@alipay.com</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Recipient Account</span>
          <span className="font-medium">test@example.com</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Recipient Name</span>
          <span className="font-medium">Alex Wang</span>
        </div>
        <div className="flex justify-between border-t pt-3">
          <span className="text-muted-foreground">Transfer Amount</span>
          <span className="text-2xl font-semibold text-primary">¥5,000.00</span>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">
          Payment Password <span className="text-destructive">*</span>
        </label>
        <PasswordInput placeholder="Enter payment password" />
      </div>
      <div className="pt-4 flex gap-3">
        <Button onClick={onNext}>Submit</Button>
        <Button variant="outline" onClick={onPrev}>Previous</Button>
      </div>
    </div>
  )
}

function Step2({ onReset }: { onReset: () => void }) {
  return (
    <div className="text-center py-8 space-y-4">
      <div className="size-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
        <Check className="size-8 text-green-600" />
      </div>
      <div>
        <h2 className="text-lg font-semibold">Transfer Successful</h2>
        <p className="text-sm text-muted-foreground mt-1">
          ¥5,000.00 has been transferred to alex@example.com
        </p>
      </div>
      <div className="rounded-lg bg-muted/50 p-4 text-sm text-left max-w-xs mx-auto">
        <div className="flex justify-between mb-2">
          <span className="text-muted-foreground">Amount</span>
          <span className="font-medium">¥5,000.00</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Transaction ID</span>
          <span className="font-mono text-xs">2024-03-28-893</span>
        </div>
      </div>
      <div className="flex gap-3 justify-center pt-2">
        <Button onClick={onReset}>New Transfer</Button>
        <Button variant="outline">View Records</Button>
      </div>
    </div>
  )
}

export default function FormStep() {
  const [step, setStep] = useState(0)

  return (
    <div className="p-6 max-w-xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Step Form</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Transfer funds between accounts in a guided flow.</p>
      </div>

      <div className="rounded-xl border bg-card p-8">
        <Steps current={step} items={stepItems} className="mb-8" />
        {step === 0 && <Step0 onNext={() => setStep(1)} />}
        {step === 1 && <Step1 onNext={() => setStep(2)} onPrev={() => setStep(0)} />}
        {step === 2 && <Step2 onReset={() => setStep(0)} />}
      </div>
    </div>
  )
}
