import { useState } from "react"
import { useKV } from "@github/spark/hooks"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Plus, 
  House, 
  Lightning, 
  Trash, 
  FilePdf, 
  Lightbulb,
  MagnifyingGlass,
  CheckCircle,
  FloppyDisk,
  ChartBar,
  Download,
  Leaf,
  Snowflake,
  Sun,
  PencilSimple
} from "@phosphor-icons/react"
import { APPLIANCES, APPLIANCE_CATEGORIES, Appliance } from "@/lib/appliances"
import { Audit, AuditAppliance, ApplianceCalculation } from "@/lib/calculations"
import { calculateUsage, calculateSeasonalUsage, calculateSavings, calculateStandingCharge, DAILY_STANDING_CHARGE, GAS_CARBON_INTENSITY, OIL_CARBON_INTENSITY, LPG_CARBON_INTENSITY } from "@/lib/calculations"
import { formatCurrency, formatKWh, formatPercentage, formatCarbon, generateId } from "@/lib/formatters"
import { ENERGY_TIPS } from "@/lib/energy-tips"
import { MetricCard } from "@/components/MetricCard"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import jsPDF from "jspdf"

function App() {
  const [audits, setAudits] = useKV<Audit[]>("heat-audits", [])
  const [currentAuditId, setCurrentAuditId] = useState<string | null>(null)
  const [showNewAuditDialog, setShowNewAuditDialog] = useState(false)
  const [showApplianceDialog, setShowApplianceDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [showReport, setShowReport] = useState(false)
  const [showBulkEditDialog, setShowBulkEditDialog] = useState(false)
  const [selectedApplianceIds, setSelectedApplianceIds] = useState<Set<string>>(new Set())
  const [bulkEditRates, setBulkEditRates] = useState({
    gasRate: "",
    oilRate: "",
    lpgRate: ""
  })
  
  const [newAudit, setNewAudit] = useState({
    householder: "",
    unitRate: "0.24",
    gasUnitRate: "0.06",
    oilUnitRate: "0.07",
    lpgUnitRate: "0.08"
  })

  const currentAudit = currentAuditId 
    ? audits?.find(a => a.id === currentAuditId) 
    : null

  const handleCreateAudit = () => {
    if (!newAudit.householder || !newAudit.unitRate) {
      toast.error("Please fill in all fields")
      return
    }

    const audit: Audit = {
      id: generateId(),
      householder: newAudit.householder,
      unitRate: parseFloat(newAudit.unitRate),
      gasUnitRate: parseFloat(newAudit.gasUnitRate),
      oilUnitRate: parseFloat(newAudit.oilUnitRate),
      lpgUnitRate: parseFloat(newAudit.lpgUnitRate),
      standingCharge: DAILY_STANDING_CHARGE,
      appliances: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setAudits(current => [...(current || []), audit])
    setCurrentAuditId(audit.id)
    setShowNewAuditDialog(false)
    setNewAudit({ householder: "", unitRate: "0.24", gasUnitRate: "0.06", oilUnitRate: "0.07", lpgUnitRate: "0.08" })
    toast.success("Audit created successfully")
  }

  const handleAddAppliance = (appliance: Appliance) => {
    if (!currentAudit) return

    const auditAppliance: AuditAppliance = {
      id: generateId(),
      applianceId: appliance.id,
      dailyMinutes: appliance.defaultMinutes,
      usesPerWeek: appliance.defaultUsesPerWeek,
      plannedDailyMinutes: appliance.defaultMinutes,
      plannedUsesPerWeek: appliance.defaultUsesPerWeek
    }

    setAudits(current =>
      (current || []).map(a =>
        a.id === currentAudit.id
          ? { ...a, appliances: [...a.appliances, auditAppliance], updatedAt: new Date().toISOString() }
          : a
      )
    )
    setShowApplianceDialog(false)
    setSearchTerm("")
    toast.success(`${appliance.name} added to audit`)
  }

  const handleUpdateAppliance = (applianceId: string, updates: Partial<AuditAppliance>) => {
    if (!currentAudit) return

    setAudits(current =>
      (current || []).map(a =>
        a.id === currentAudit.id
          ? {
              ...a,
              appliances: a.appliances.map(app =>
                app.id === applianceId ? { ...app, ...updates } : app
              ),
              updatedAt: new Date().toISOString()
            }
          : a
      )
    )

    if (updates.customWatts !== undefined) {
      if (updates.customWatts) {
        toast.success("Custom wattage applied", {
          description: `Calculations will use ${updates.customWatts}W`
        })
      } else {
        const auditApp = currentAudit.appliances.find(a => a.id === applianceId)
        if (auditApp) {
          const appliance = APPLIANCES.find(a => a.id === auditApp.applianceId)
          toast.success("Reset to default wattage", {
            description: `Calculations will use ${appliance?.watts}W`
          })
        }
      }
    }

    if (updates.gasUnitRate !== undefined) {
      if (updates.gasUnitRate) {
        toast.success("Custom gas rate applied", {
          description: `Calculations will use £${updates.gasUnitRate.toFixed(2)}/kWh`
        })
      } else {
        toast.success("Reset to audit default", {
          description: `Using £${currentAudit.gasUnitRate.toFixed(2)}/kWh for gas`
        })
      }
    }

    if (updates.oilUnitRate !== undefined) {
      if (updates.oilUnitRate) {
        toast.success("Custom oil rate applied", {
          description: `Calculations will use £${updates.oilUnitRate.toFixed(2)}/kWh`
        })
      } else {
        toast.success("Reset to audit default", {
          description: `Using £${currentAudit.oilUnitRate.toFixed(2)}/kWh for oil`
        })
      }
    }

    if (updates.lpgUnitRate !== undefined) {
      if (updates.lpgUnitRate) {
        toast.success("Custom LPG rate applied", {
          description: `Calculations will use £${updates.lpgUnitRate.toFixed(2)}/kWh`
        })
      } else {
        toast.success("Reset to audit default", {
          description: `Using £${currentAudit.lpgUnitRate.toFixed(2)}/kWh for LPG`
        })
      }
    }
  }

  const handleDeleteAppliance = (applianceId: string) => {
    if (!currentAudit) return

    setAudits(current =>
      (current || []).map(a =>
        a.id === currentAudit.id
          ? {
              ...a,
              appliances: a.appliances.filter(app => app.id !== applianceId),
              updatedAt: new Date().toISOString()
            }
          : a
      )
    )
    toast.success("Appliance removed")
  }

  const handleToggleApplianceSelection = (applianceId: string) => {
    setSelectedApplianceIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(applianceId)) {
        newSet.delete(applianceId)
      } else {
        newSet.add(applianceId)
      }
      return newSet
    })
  }

  const handleSelectAllAppliances = () => {
    if (!currentAudit) return
    
    const fuelAppliances = currentAudit.appliances.filter(auditApp => {
      const appliance = APPLIANCES.find(a => a.id === auditApp.applianceId)
      return appliance && appliance.fuelType && appliance.fuelType !== 'electric'
    })
    
    if (selectedApplianceIds.size === fuelAppliances.length) {
      setSelectedApplianceIds(new Set())
    } else {
      setSelectedApplianceIds(new Set(fuelAppliances.map(a => a.id)))
    }
  }

  const handleBulkEditFuelRates = () => {
    if (!currentAudit || selectedApplianceIds.size === 0) return

    let updateCount = 0
    const updates: { gas?: number, oil?: number, lpg?: number } = {}

    setAudits(current =>
      (current || []).map(a =>
        a.id === currentAudit.id
          ? {
              ...a,
              appliances: a.appliances.map(app => {
                if (!selectedApplianceIds.has(app.id)) return app

                const appliance = APPLIANCES.find(ap => ap.id === app.applianceId)
                if (!appliance || !appliance.fuelType) return app

                const updatedApp = { ...app }
                let hasUpdate = false

                if (appliance.fuelType === 'gas' && bulkEditRates.gasRate) {
                  updatedApp.gasUnitRate = parseFloat(bulkEditRates.gasRate)
                  hasUpdate = true
                  updates.gas = updatedApp.gasUnitRate
                }

                if (appliance.fuelType === 'oil' && bulkEditRates.oilRate) {
                  updatedApp.oilUnitRate = parseFloat(bulkEditRates.oilRate)
                  hasUpdate = true
                  updates.oil = updatedApp.oilUnitRate
                }

                if (appliance.fuelType === 'lpg' && bulkEditRates.lpgRate) {
                  updatedApp.lpgUnitRate = parseFloat(bulkEditRates.lpgRate)
                  hasUpdate = true
                  updates.lpg = updatedApp.lpgUnitRate
                }

                if (hasUpdate) updateCount++

                return updatedApp
              }),
              updatedAt: new Date().toISOString()
            }
          : a
      )
    )

    const messages = []
    if (updates.gas !== undefined) messages.push(`Gas: £${updates.gas.toFixed(2)}/kWh`)
    if (updates.oil !== undefined) messages.push(`Oil: £${updates.oil.toFixed(2)}/kWh`)
    if (updates.lpg !== undefined) messages.push(`LPG: £${updates.lpg.toFixed(2)}/kWh`)

    toast.success(`Updated ${updateCount} appliance${updateCount !== 1 ? 's' : ''}`, {
      description: messages.join(' · ')
    })

    setShowBulkEditDialog(false)
    setSelectedApplianceIds(new Set())
    setBulkEditRates({ gasRate: "", oilRate: "", lpgRate: "" })
  }

  const handleClearBulkSelection = () => {
    setSelectedApplianceIds(new Set())
  }

  const handleSaveAudit = () => {
    toast.success("Audit saved", {
      description: "All changes have been saved automatically"
    })
  }

  const calculateAuditSummary = () => {
    if (!currentAudit) return null

    const calculations: ApplianceCalculation[] = currentAudit.appliances.map(auditApp => {
      const appliance = APPLIANCES.find(a => a.id === auditApp.applianceId)
      if (!appliance) throw new Error(`Appliance not found: ${auditApp.applianceId}`)

      const watts = auditApp.customWatts ?? appliance.watts
      
      let fuelKWhRating: number | undefined
      let fuelUnitRate: number | undefined
      let fuelCarbonIntensity: number | undefined
      
      if (appliance.fuelType === 'gas' && appliance.gasKWhRating) {
        fuelKWhRating = appliance.gasKWhRating
        fuelUnitRate = auditApp.gasUnitRate ?? currentAudit.gasUnitRate
        fuelCarbonIntensity = GAS_CARBON_INTENSITY
      } else if (appliance.fuelType === 'oil' && appliance.oilKWhRating) {
        fuelKWhRating = appliance.oilKWhRating
        fuelUnitRate = auditApp.oilUnitRate ?? currentAudit.oilUnitRate
        fuelCarbonIntensity = OIL_CARBON_INTENSITY
      } else if (appliance.fuelType === 'lpg' && appliance.lpgKWhRating) {
        fuelKWhRating = appliance.lpgKWhRating
        fuelUnitRate = auditApp.lpgUnitRate ?? currentAudit.lpgUnitRate
        fuelCarbonIntensity = LPG_CARBON_INTENSITY
      }

      const current = auditApp.useSeasonalPattern && auditApp.seasonalUsage
        ? calculateSeasonalUsage(
            watts,
            auditApp.seasonalUsage.winterDailyMinutes,
            auditApp.seasonalUsage.winterUsesPerWeek,
            auditApp.seasonalUsage.summerDailyMinutes,
            auditApp.seasonalUsage.summerUsesPerWeek,
            currentAudit.unitRate,
            fuelKWhRating,
            fuelUnitRate,
            fuelCarbonIntensity
          )
        : calculateUsage(
            watts,
            auditApp.dailyMinutes,
            auditApp.usesPerWeek,
            currentAudit.unitRate,
            fuelKWhRating,
            fuelUnitRate,
            fuelCarbonIntensity
          )

      const planned = auditApp.useSeasonalPattern && auditApp.plannedSeasonalUsage
        ? calculateSeasonalUsage(
            watts,
            auditApp.plannedSeasonalUsage.winterDailyMinutes,
            auditApp.plannedSeasonalUsage.winterUsesPerWeek,
            auditApp.plannedSeasonalUsage.summerDailyMinutes,
            auditApp.plannedSeasonalUsage.summerUsesPerWeek,
            currentAudit.unitRate,
            fuelKWhRating,
            fuelUnitRate,
            fuelCarbonIntensity
          )
        : calculateUsage(
            watts,
            auditApp.plannedDailyMinutes,
            auditApp.plannedUsesPerWeek,
            currentAudit.unitRate,
            fuelKWhRating,
            fuelUnitRate,
            fuelCarbonIntensity
          )

      const savings = calculateSavings(current, planned)

      return {
        applianceId: auditApp.id,
        name: appliance.name,
        watts,
        category: appliance.category,
        current,
        planned,
        savings
      }
    })

    const totalCurrentAnnualCost = calculations.reduce((sum, calc) => sum + (calc.current.totalAnnualCost ?? calc.current.annualCost), 0)
    const totalPlannedAnnualCost = calculations.reduce((sum, calc) => sum + (calc.planned.totalAnnualCost ?? calc.planned.annualCost), 0)
    const totalSavings = totalCurrentAnnualCost - totalPlannedAnnualCost
    const totalCurrentKWh = calculations.reduce((sum, calc) => sum + calc.current.annualKWh, 0)
    const totalPlannedKWh = calculations.reduce((sum, calc) => sum + calc.planned.annualKWh, 0)
    const totalKWhSavings = totalCurrentKWh - totalPlannedKWh
    const totalCurrentCarbonKg = calculations.reduce((sum, calc) => sum + (calc.current.totalCarbonKg ?? calc.current.carbonKg), 0)
    const totalPlannedCarbonKg = calculations.reduce((sum, calc) => sum + (calc.planned.totalCarbonKg ?? calc.planned.carbonKg), 0)
    const totalCarbonSavingsKg = totalCurrentCarbonKg - totalPlannedCarbonKg
    const standingCharge = calculateStandingCharge(currentAudit.standingCharge)
    const totalWithStandingCharge = totalCurrentAnnualCost + standingCharge

    return {
      totalCurrentAnnualCost,
      totalPlannedAnnualCost,
      totalSavings,
      totalCurrentKWh,
      totalPlannedKWh,
      totalKWhSavings,
      totalCurrentCarbonKg,
      totalPlannedCarbonKg,
      totalCarbonSavingsKg,
      standingCharge,
      totalWithStandingCharge,
      appliances: calculations
    }
  }

  const summary = calculateAuditSummary()

  const generatePDF = () => {
    if (!currentAudit || !summary) return

    const pdf = new jsPDF()
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 20
    let yPos = margin

    pdf.setFontSize(22)
    pdf.setFont("helvetica", "bold")
    pdf.text("Home Energy Audit Report", margin, yPos)
    yPos += 15

    pdf.setFontSize(12)
    pdf.setFont("helvetica", "normal")
    pdf.text(`Householder: ${currentAudit.householder}`, margin, yPos)
    yPos += 7
    pdf.text(`Report Date: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`, margin, yPos)
    yPos += 7
    pdf.text(`Electricity Rate: ${formatCurrency(currentAudit.unitRate)}/kWh`, margin, yPos)
    yPos += 7
    pdf.text(`Gas Rate: ${formatCurrency(currentAudit.gasUnitRate)}/kWh`, margin, yPos)
    yPos += 7
    pdf.text(`Oil Rate: ${formatCurrency(currentAudit.oilUnitRate)}/kWh`, margin, yPos)
    yPos += 7
    pdf.text(`LPG Rate: ${formatCurrency(currentAudit.lpgUnitRate)}/kWh`, margin, yPos)
    yPos += 12

    pdf.setDrawColor(200, 200, 200)
    pdf.line(margin, yPos, pageWidth - margin, yPos)
    yPos += 10

    pdf.setFontSize(14)
    pdf.setFont("helvetica", "bold")
    pdf.text("Summary", margin, yPos)
    yPos += 10

    pdf.setFontSize(11)
    pdf.setFont("helvetica", "normal")
    
    const summaryData = [
      { label: "Current Annual Cost:", value: formatCurrency(summary.totalCurrentAnnualCost) },
      { label: "Potential Annual Cost:", value: formatCurrency(summary.totalPlannedAnnualCost) },
      { label: "Potential Savings:", value: formatCurrency(summary.totalSavings) },
      { label: "Annual kWh Saved:", value: `${(summary.totalKWhSavings ?? 0).toFixed(1)} kWh` },
      { label: "Carbon Saved:", value: formatCarbon(summary.totalCarbonSavingsKg) },
      { label: "Standing Charge:", value: `${formatCurrency(summary.standingCharge)}/year` },
      { label: "Total with Standing Charge:", value: formatCurrency(summary.totalWithStandingCharge) }
    ]

    summaryData.forEach(item => {
      pdf.setFont("helvetica", "bold")
      pdf.text(item.label, margin, yPos)
      pdf.setFont("helvetica", "normal")
      pdf.text(item.value, margin + 70, yPos)
      yPos += 7
    })

    yPos += 5
    pdf.line(margin, yPos, pageWidth - margin, yPos)
    yPos += 10

    pdf.setFontSize(14)
    pdf.setFont("helvetica", "bold")
    pdf.text("Appliance Breakdown", margin, yPos)
    yPos += 10

    pdf.setFontSize(9)
    pdf.setFont("helvetica", "bold")
    const colX = [margin, margin + 50, margin + 95, margin + 135]
    pdf.text("Appliance", colX[0], yPos)
    pdf.text("Current", colX[1], yPos)
    pdf.text("Planned", colX[2], yPos)
    pdf.text("Savings", colX[3], yPos)
    yPos += 5

    pdf.setDrawColor(200, 200, 200)
    pdf.line(margin, yPos, pageWidth - margin, yPos)
    yPos += 5

    pdf.setFont("helvetica", "normal")
    summary.appliances.forEach((calc, idx) => {
      if (yPos > pageHeight - 40) {
        pdf.addPage()
        yPos = margin
      }

      if (idx % 2 === 0) {
        pdf.setFillColor(245, 245, 245)
        pdf.rect(margin - 2, yPos - 4, pageWidth - 2 * margin + 4, 10, 'F')
      }

      pdf.text(calc.name.substring(0, 20), colX[0], yPos)
      pdf.text(formatCurrency(calc.current.totalAnnualCost ?? calc.current.annualCost), colX[1], yPos)
      pdf.text(formatCurrency(calc.planned.totalAnnualCost ?? calc.planned.annualCost), colX[2], yPos)
      
      if (calc.savings.annualCost > 0) {
        pdf.setTextColor(34, 139, 34)
      } else if (calc.savings.annualCost < 0) {
        pdf.setTextColor(220, 38, 38)
      }
      pdf.text(formatCurrency(calc.savings.annualCost), colX[3], yPos)
      pdf.setTextColor(0, 0, 0)
      
      yPos += 10
    })

    if (yPos > pageHeight - 80) {
      pdf.addPage()
      yPos = margin
    }

    yPos += 5
    pdf.line(margin, yPos, pageWidth - margin, yPos)
    yPos += 10

    if (summary.totalCarbonSavingsKg > 0) {
      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.text("Environmental Impact", margin, yPos)
      yPos += 10

      pdf.setFillColor(220, 252, 231)
      pdf.rect(margin, yPos - 5, pageWidth - 2 * margin, 35, 'F')

      pdf.setFontSize(11)
      pdf.setFont("helvetica", "normal")
      pdf.text("By implementing these planned changes, you could reduce your annual", margin + 5, yPos)
      yPos += 6
      pdf.text(`carbon emissions by:`, margin + 5, yPos)
      yPos += 8

      pdf.setFontSize(16)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(34, 139, 34)
      pdf.text(formatCarbon(summary.totalCarbonSavingsKg), margin + 5, yPos)
      pdf.setTextColor(0, 0, 0)
      yPos += 10

      pdf.setFontSize(9)
      pdf.setFont("helvetica", "italic")
      pdf.text(`Equivalent to ${((summary.totalCarbonSavingsKg ?? 0) / 0.43).toFixed(0)} miles not driven or ${((summary.totalCarbonSavingsKg ?? 0) / 21.77).toFixed(1)} trees planted`, margin + 5, yPos)
      yPos += 15

      if (yPos > pageHeight - 80) {
        pdf.addPage()
        yPos = margin
      }

      pdf.line(margin, yPos, pageWidth - margin, yPos)
      yPos += 10
    }

    pdf.setFontSize(14)
    pdf.setFont("helvetica", "bold")
    pdf.text("Energy Saving Tips", margin, yPos)
    yPos += 10

    pdf.setFontSize(9)
    pdf.setFont("helvetica", "normal")

    ENERGY_TIPS.slice(0, 10).forEach((tip, idx) => {
      if (yPos > pageHeight - 30) {
        pdf.addPage()
        yPos = margin
      }

      pdf.setFont("helvetica", "bold")
      pdf.text(`${idx + 1}. ${tip.title}`, margin, yPos)
      yPos += 5

      pdf.setFont("helvetica", "normal")
      const lines = pdf.splitTextToSize(tip.description, pageWidth - 2 * margin)
      pdf.text(lines, margin + 5, yPos)
      yPos += lines.length * 4 + 3

      if (tip.potentialSaving) {
        pdf.setFont("helvetica", "italic")
        pdf.text(`💡 ${tip.potentialSaving}`, margin + 5, yPos)
        yPos += 7
      }
    })

    const filename = `HEAT_${currentAudit.householder.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
    pdf.save(filename)
    toast.success("PDF downloaded successfully", {
      description: filename
    })
  }

  const filteredAppliances = APPLIANCES.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || app.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (!currentAudit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-success/5">
        <div className="container max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Lightning size={40} weight="fill" className="text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">HEAT</h1>
            </div>
            <p className="text-lg text-muted-foreground">Home Energy Audit Tool</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all hover:scale-105" 
              onClick={() => setShowNewAuditDialog(true)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>New Audit</CardTitle>
                  <Plus size={24} className="text-primary" />
                </div>
                <CardDescription>
                  Start a new home energy audit
                </CardDescription>
              </CardHeader>
            </Card>

            {audits?.map(audit => (
              <Card 
                key={audit.id}
                className="cursor-pointer hover:shadow-lg transition-all"
                onClick={() => setCurrentAuditId(audit.id)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <House size={20} />
                    {audit.householder}
                  </CardTitle>
                  <CardDescription>
                    {audit.appliances.length} appliances · Updated {new Date(audit.updatedAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <Dialog open={showNewAuditDialog} onOpenChange={setShowNewAuditDialog}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Audit</DialogTitle>
                <DialogDescription>
                  Enter the householder's details and all energy tariff rates (electricity, gas, oil, and LPG will be automatically applied to relevant appliances)
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="householder">Householder Name</Label>
                  <Input
                    id="householder"
                    placeholder="Enter name"
                    value={newAudit.householder}
                    onChange={(e) => setNewAudit(prev => ({ ...prev, householder: e.target.value }))}
                  />
                </div>
                
                <Separator />
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold">Energy Tariff Rates</h3>
                  <p className="text-xs text-muted-foreground">
                    Enter all applicable rates. Gas/Oil/LPG rates will be automatically applied to fuel-burning appliances.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit-rate">Electricity Unit Rate (£ per kWh)</Label>
                  <Input
                    id="unit-rate"
                    type="number"
                    step="0.01"
                    placeholder="0.24"
                    value={newAudit.unitRate}
                    onChange={(e) => setNewAudit(prev => ({ ...prev, unitRate: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Used for all electric appliances. Typical UK: £0.24-0.30/kWh
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gas-unit-rate">Gas Unit Rate (£ per kWh)</Label>
                  <Input
                    id="gas-unit-rate"
                    type="number"
                    step="0.01"
                    placeholder="0.06"
                    value={newAudit.gasUnitRate}
                    onChange={(e) => setNewAudit(prev => ({ ...prev, gasUnitRate: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Applied to gas boilers and heating. Typical UK: £0.06-0.07/kWh
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="oil-unit-rate">Oil Unit Rate (£ per kWh)</Label>
                  <Input
                    id="oil-unit-rate"
                    type="number"
                    step="0.01"
                    placeholder="0.07"
                    value={newAudit.oilUnitRate}
                    onChange={(e) => setNewAudit(prev => ({ ...prev, oilUnitRate: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Applied to oil boilers and heating. Typical UK: £0.07-0.09/kWh
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lpg-unit-rate">LPG Unit Rate (£ per kWh)</Label>
                  <Input
                    id="lpg-unit-rate"
                    type="number"
                    step="0.01"
                    placeholder="0.08"
                    value={newAudit.lpgUnitRate}
                    onChange={(e) => setNewAudit(prev => ({ ...prev, lpgUnitRate: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Applied to LPG boilers and heating. Typical UK: £0.08-0.10/kWh
                  </p>
                </div>
                <Button onClick={handleCreateAudit} className="w-full">
                  Create Audit
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-success/5">
      <div className="container max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Button 
              variant="ghost" 
              onClick={() => setCurrentAuditId(null)}
              className="mb-2 -ml-2"
            >
              ← Back to Dashboard
            </Button>
            <div className="flex items-center gap-3">
              <House size={32} className="text-primary" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{currentAudit.householder}</h1>
                <p className="text-sm text-muted-foreground">
                  Electricity: {formatCurrency(currentAudit.unitRate)}/kWh · Gas: {formatCurrency(currentAudit.gasUnitRate)}/kWh · Oil: {formatCurrency(currentAudit.oilUnitRate)}/kWh · LPG: {formatCurrency(currentAudit.lpgUnitRate)}/kWh
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSaveAudit}>
              <FloppyDisk size={18} className="mr-2" />
              Save
            </Button>
            <Button variant="outline" onClick={generatePDF}>
              <Download size={18} className="mr-2" />
              Export PDF
            </Button>
            <Button onClick={() => setShowReport(true)}>
              <FilePdf size={18} className="mr-2" />
              View Report
            </Button>
          </div>
        </div>

        {summary && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
            <MetricCard
              label="Current Annual Cost"
              value={formatCurrency(summary.totalCurrentAnnualCost)}
              valueClassName="text-foreground"
            />
            <MetricCard
              label="Potential Annual Cost"
              value={formatCurrency(summary.totalPlannedAnnualCost)}
              valueClassName="text-accent"
            />
            <MetricCard
              label="Potential Savings"
              value={formatCurrency(summary.totalSavings)}
              trend={summary.totalSavings > 0 ? "down" : summary.totalSavings < 0 ? "up" : "neutral"}
              trendValue={formatPercentage(
                summary.totalCurrentAnnualCost > 0 
                  ? (summary.totalSavings / summary.totalCurrentAnnualCost) * 100 
                  : 0
              )}
              valueClassName={summary.totalSavings > 0 ? "text-success" : "text-foreground"}
            />
            <MetricCard
              label="Annual kWh Saved"
              value={formatKWh(summary.totalKWhSavings)}
              valueClassName="text-primary"
            />
            <MetricCard
              label="Carbon Saved"
              value={formatCarbon(summary.totalCarbonSavingsKg)}
              trend={summary.totalCarbonSavingsKg > 0 ? "down" : summary.totalCarbonSavingsKg < 0 ? "up" : "neutral"}
              valueClassName={summary.totalCarbonSavingsKg > 0 ? "text-success" : "text-foreground"}
            />
          </div>
        )}

        {summary && summary.totalCarbonSavingsKg > 0 && (
          <Card className="mb-6 bg-success/5 border-success/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="bg-success/10 p-3 rounded-lg">
                  <Leaf size={28} weight="fill" className="text-success" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Environmental Impact</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    By implementing these planned changes, you could save <span className="font-semibold text-success">{formatCarbon(summary.totalCarbonSavingsKg)}</span> of carbon emissions annually.
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-success"></div>
                      <span className="text-muted-foreground">
                        Equivalent to {((summary.totalCarbonSavingsKg ?? 0) / 0.43).toFixed(0)} miles not driven by car
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-success"></div>
                      <span className="text-muted-foreground">
                        Or {((summary.totalCarbonSavingsKg ?? 0) / 21.77).toFixed(1)} trees planted
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Appliances</CardTitle>
                <CardDescription>
                  {currentAudit.appliances.length} appliances in this audit
                </CardDescription>
              </div>
              <Button onClick={() => setShowApplianceDialog(true)}>
                <Plus size={18} className="mr-2" />
                Add Appliance
              </Button>
            </div>
            {currentAudit.appliances.some(auditApp => {
              const appliance = APPLIANCES.find(a => a.id === auditApp.applianceId)
              return appliance && appliance.fuelType && appliance.fuelType !== 'electric'
            }) && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="select-all-fuel"
                      checked={selectedApplianceIds.size > 0 && selectedApplianceIds.size === currentAudit.appliances.filter(auditApp => {
                        const appliance = APPLIANCES.find(a => a.id === auditApp.applianceId)
                        return appliance && appliance.fuelType && appliance.fuelType !== 'electric'
                      }).length}
                      onCheckedChange={handleSelectAllAppliances}
                    />
                    <Label htmlFor="select-all-fuel" className="text-sm font-medium cursor-pointer">
                      {selectedApplianceIds.size > 0 
                        ? `${selectedApplianceIds.size} appliance${selectedApplianceIds.size !== 1 ? 's' : ''} selected`
                        : "Select fuel-based appliances"}
                    </Label>
                  </div>
                  {selectedApplianceIds.size > 0 && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearBulkSelection}
                      >
                        Clear Selection
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setShowBulkEditDialog(true)}
                      >
                        <PencilSimple size={16} className="mr-2" />
                        Bulk Edit Rates
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {currentAudit.appliances.length === 0 ? (
              <div className="text-center py-12">
                <Lightning size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">No appliances yet</p>
                <p className="text-muted-foreground mb-4">
                  Add appliances to start calculating energy costs
                </p>
                <Button onClick={() => setShowApplianceDialog(true)}>
                  <Plus size={18} className="mr-2" />
                  Add Your First Appliance
                </Button>
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {summary?.appliances.map((calc) => {
                  const auditApp = currentAudit.appliances.find(a => a.id === calc.applianceId)
                  if (!auditApp) return null
                  
                  const appliance = APPLIANCES.find(a => a.id === auditApp.applianceId)
                  const hasFuel = appliance?.fuelType && appliance.fuelType !== 'electric'
                  const fuelLabel = appliance?.fuelType === 'gas' ? 'Gas' : 
                                   appliance?.fuelType === 'oil' ? 'Oil' : 
                                   appliance?.fuelType === 'lpg' ? 'LPG' : ''
                  const fuelRating = appliance?.fuelType === 'gas' ? appliance.gasKWhRating :
                                    appliance?.fuelType === 'oil' ? appliance.oilKWhRating :
                                    appliance?.fuelType === 'lpg' ? appliance.lpgKWhRating : undefined
                  
                  const isFuelBased = hasFuel && appliance?.fuelType !== 'electric'

                  return (
                    <AccordionItem key={calc.applianceId} value={calc.applianceId}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center justify-between w-full pr-4">
                          <div className="flex items-center gap-3">
                            {isFuelBased && (
                              <Checkbox
                                id={`select-${calc.applianceId}`}
                                checked={selectedApplianceIds.has(calc.applianceId)}
                                onCheckedChange={() => {
                                  handleToggleApplianceSelection(calc.applianceId)
                                }}
                                onClick={(e) => e.stopPropagation()}
                              />
                            )}
                            <Lightning size={20} className="text-primary" />
                            <div className="text-left">
                              <p className="font-semibold">{calc.name}</p>
                              <div className="flex gap-2 mt-1 flex-wrap">
                                <Badge variant="secondary" className="text-xs">
                                  {calc.category}
                                </Badge>
                                {hasFuel && fuelRating && (
                                  <Badge 
                                    variant={(appliance?.fuelType === 'gas' && auditApp.gasUnitRate) || 
                                            (appliance?.fuelType === 'oil' && auditApp.oilUnitRate) || 
                                            (appliance?.fuelType === 'lpg' && auditApp.lpgUnitRate) ? "default" : "outline"} 
                                    className="text-xs bg-orange-50 border-orange-300 text-orange-700"
                                  >
                                    {fuelLabel} {fuelRating}kW
                                    {((appliance?.fuelType === 'gas' && auditApp.gasUnitRate) || 
                                      (appliance?.fuelType === 'oil' && auditApp.oilUnitRate) || 
                                      (appliance?.fuelType === 'lpg' && auditApp.lpgUnitRate)) && " (Custom Rate)"}
                                  </Badge>
                                )}
                                <Badge 
                                  variant={auditApp.customWatts ? "default" : "outline"} 
                                  className="text-xs"
                                >
                                  {calc.watts}W{auditApp.customWatts ? " (Custom)" : ""}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="hidden md:flex items-center gap-6 text-sm">
                            <div>
                              <p className="text-muted-foreground text-xs">Current</p>
                              <p className="font-semibold">{formatCurrency(calc.current.totalAnnualCost ?? calc.current.annualCost)}/yr</p>
                            </div>
                            {calc.savings.annualCost !== 0 && (
                              <div>
                                <p className="text-muted-foreground text-xs">Savings</p>
                                <p className={cn(
                                  "font-semibold",
                                  calc.savings.annualCost > 0 ? "text-success" : "text-destructive"
                                )}>
                                  {formatCurrency(Math.abs(calc.savings.annualCost))}/yr
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-4 space-y-6">
                          <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                            <h4 className="text-sm font-semibold">Appliance Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`custom-watts-${calc.applianceId}`}>
                                  Custom Wattage (Optional)
                                </Label>
                                <Input
                                  id={`custom-watts-${calc.applianceId}`}
                                  type="number"
                                  placeholder={`Default: ${APPLIANCES.find(a => a.id === auditApp.applianceId)?.watts}W`}
                                  value={auditApp.customWatts || ""}
                                  onChange={(e) => handleUpdateAppliance(auditApp.id, {
                                    customWatts: e.target.value ? parseInt(e.target.value) : undefined
                                  })}
                                />
                                <p className="text-xs text-muted-foreground">
                                  Enter specific model wattage if different from default
                                </p>
                              </div>
                              {auditApp.customWatts && (
                                <div className="flex items-end pb-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleUpdateAppliance(auditApp.id, {
                                      customWatts: undefined
                                    })}
                                  >
                                    Reset to Default ({APPLIANCES.find(a => a.id === auditApp.applianceId)?.watts}W)
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>

                          {hasFuel && (
                            <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800 space-y-3">
                              <h4 className="text-sm font-semibold">Custom {fuelLabel} Rate (Optional)</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`custom-fuel-rate-${calc.applianceId}`}>
                                    Custom {fuelLabel} Unit Rate (£ per kWh)
                                  </Label>
                                  <Input
                                    id={`custom-fuel-rate-${calc.applianceId}`}
                                    type="number"
                                    step="0.01"
                                    placeholder={`Default: £${appliance?.fuelType === 'gas' ? currentAudit.gasUnitRate.toFixed(2) : 
                                                                 appliance?.fuelType === 'oil' ? currentAudit.oilUnitRate.toFixed(2) : 
                                                                 currentAudit.lpgUnitRate.toFixed(2)}/kWh`}
                                    value={
                                      appliance?.fuelType === 'gas' ? (auditApp.gasUnitRate ?? "") :
                                      appliance?.fuelType === 'oil' ? (auditApp.oilUnitRate ?? "") :
                                      (auditApp.lpgUnitRate ?? "")
                                    }
                                    onChange={(e) => {
                                      const value = e.target.value ? parseFloat(e.target.value) : undefined
                                      if (appliance?.fuelType === 'gas') {
                                        handleUpdateAppliance(auditApp.id, { gasUnitRate: value })
                                      } else if (appliance?.fuelType === 'oil') {
                                        handleUpdateAppliance(auditApp.id, { oilUnitRate: value })
                                      } else if (appliance?.fuelType === 'lpg') {
                                        handleUpdateAppliance(auditApp.id, { lpgUnitRate: value })
                                      }
                                    }}
                                  />
                                  <p className="text-xs text-muted-foreground">
                                    Override the audit-level {fuelLabel.toLowerCase()} rate for this specific appliance
                                  </p>
                                </div>
                                {(
                                  (appliance?.fuelType === 'gas' && auditApp.gasUnitRate !== undefined) ||
                                  (appliance?.fuelType === 'oil' && auditApp.oilUnitRate !== undefined) ||
                                  (appliance?.fuelType === 'lpg' && auditApp.lpgUnitRate !== undefined)
                                ) && (
                                  <div className="flex items-end pb-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        if (appliance?.fuelType === 'gas') {
                                          handleUpdateAppliance(auditApp.id, { gasUnitRate: undefined })
                                        } else if (appliance?.fuelType === 'oil') {
                                          handleUpdateAppliance(auditApp.id, { oilUnitRate: undefined })
                                        } else if (appliance?.fuelType === 'lpg') {
                                          handleUpdateAppliance(auditApp.id, { lpgUnitRate: undefined })
                                        }
                                      }}
                                    >
                                      Reset to Audit Default (£{
                                        appliance?.fuelType === 'gas' ? currentAudit.gasUnitRate.toFixed(2) :
                                        appliance?.fuelType === 'oil' ? currentAudit.oilUnitRate.toFixed(2) :
                                        currentAudit.lpgUnitRate.toFixed(2)
                                      }/kWh)
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {calc.category === "Heating & Cooling" && (
                            <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Snowflake size={20} className="text-primary" weight="fill" />
                                  <h4 className="text-sm font-semibold">Seasonal Usage Pattern</h4>
                                </div>
                                <Switch
                                  id={`seasonal-${calc.applianceId}`}
                                  checked={auditApp.useSeasonalPattern || false}
                                  onCheckedChange={(checked) => {
                                    const appliance = APPLIANCES.find(a => a.id === auditApp.applianceId)
                                    if (!appliance) return
                                    
                                    handleUpdateAppliance(auditApp.id, {
                                      useSeasonalPattern: checked,
                                      seasonalUsage: checked ? {
                                        winterDailyMinutes: auditApp.dailyMinutes,
                                        winterUsesPerWeek: auditApp.usesPerWeek,
                                        summerDailyMinutes: 0,
                                        summerUsesPerWeek: 0
                                      } : undefined,
                                      plannedSeasonalUsage: checked ? {
                                        winterDailyMinutes: auditApp.plannedDailyMinutes,
                                        winterUsesPerWeek: auditApp.plannedUsesPerWeek,
                                        summerDailyMinutes: 0,
                                        summerUsesPerWeek: 0
                                      } : undefined
                                    })
                                  }}
                                />
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Set different usage for winter (26 weeks) vs summer (26 weeks) periods
                              </p>
                            </div>
                          )}

                          <Tabs defaultValue="current" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="current">Current Usage</TabsTrigger>
                              <TabsTrigger value="planned">Planned Usage</TabsTrigger>
                            </TabsList>
                            <TabsContent value="current" className="space-y-4">
                              {auditApp.useSeasonalPattern && auditApp.seasonalUsage ? (
                                <>
                                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <div className="flex items-center gap-2 mb-3">
                                      <Snowflake size={18} className="text-blue-600" weight="fill" />
                                      <h5 className="font-semibold text-sm">Winter Usage (26 weeks)</h5>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label htmlFor={`winter-daily-minutes-${calc.applianceId}`}>
                                          Daily Minutes
                                        </Label>
                                        <Input
                                          id={`winter-daily-minutes-${calc.applianceId}`}
                                          type="number"
                                          value={auditApp.seasonalUsage.winterDailyMinutes}
                                          onChange={(e) => handleUpdateAppliance(auditApp.id, {
                                            seasonalUsage: {
                                              ...auditApp.seasonalUsage!,
                                              winterDailyMinutes: parseInt(e.target.value) || 0
                                            }
                                          })}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor={`winter-uses-week-${calc.applianceId}`}>
                                          Uses Per Week
                                        </Label>
                                        <Input
                                          id={`winter-uses-week-${calc.applianceId}`}
                                          type="number"
                                          value={auditApp.seasonalUsage.winterUsesPerWeek}
                                          onChange={(e) => handleUpdateAppliance(auditApp.id, {
                                            seasonalUsage: {
                                              ...auditApp.seasonalUsage!,
                                              winterUsesPerWeek: parseInt(e.target.value) || 0
                                            }
                                          })}
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                                    <div className="flex items-center gap-2 mb-3">
                                      <Sun size={18} className="text-amber-600" weight="fill" />
                                      <h5 className="font-semibold text-sm">Summer Usage (26 weeks)</h5>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label htmlFor={`summer-daily-minutes-${calc.applianceId}`}>
                                          Daily Minutes
                                        </Label>
                                        <Input
                                          id={`summer-daily-minutes-${calc.applianceId}`}
                                          type="number"
                                          value={auditApp.seasonalUsage.summerDailyMinutes}
                                          onChange={(e) => handleUpdateAppliance(auditApp.id, {
                                            seasonalUsage: {
                                              ...auditApp.seasonalUsage!,
                                              summerDailyMinutes: parseInt(e.target.value) || 0
                                            }
                                          })}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor={`summer-uses-week-${calc.applianceId}`}>
                                          Uses Per Week
                                        </Label>
                                        <Input
                                          id={`summer-uses-week-${calc.applianceId}`}
                                          type="number"
                                          value={auditApp.seasonalUsage.summerUsesPerWeek}
                                          onChange={(e) => handleUpdateAppliance(auditApp.id, {
                                            seasonalUsage: {
                                              ...auditApp.seasonalUsage!,
                                              summerUsesPerWeek: parseInt(e.target.value) || 0
                                            }
                                          })}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`daily-minutes-${calc.applianceId}`}>
                                      Daily Minutes
                                    </Label>
                                    <Input
                                      id={`daily-minutes-${calc.applianceId}`}
                                      type="number"
                                      value={auditApp.dailyMinutes}
                                      onChange={(e) => handleUpdateAppliance(auditApp.id, {
                                        dailyMinutes: parseInt(e.target.value) || 0
                                      })}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`uses-week-${calc.applianceId}`}>
                                      Uses Per Week
                                    </Label>
                                    <Input
                                      id={`uses-week-${calc.applianceId}`}
                                      type="number"
                                      value={auditApp.usesPerWeek}
                                      onChange={(e) => handleUpdateAppliance(auditApp.id, {
                                        usesPerWeek: parseInt(e.target.value) || 0
                                      })}
                                    />
                                  </div>
                                </div>
                              )}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-muted/50 p-4 rounded-lg">
                                <div>
                                  <p className="text-xs text-muted-foreground">Weekly Cost</p>
                                  <p className="font-semibold">{formatCurrency(calc.current.weeklyCost)}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Monthly Cost</p>
                                  <p className="font-semibold">{formatCurrency(calc.current.monthlyCost)}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Annual Cost{hasFuel ? ' (Elec)' : ''}</p>
                                  <p className="font-semibold">{formatCurrency(calc.current.annualCost)}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Annual kWh{hasFuel ? ' (Elec)' : ''}</p>
                                  <p className="font-semibold">{(calc.current.annualKWh ?? 0).toFixed(1)}</p>
                                </div>
                              </div>
                              {hasFuel && calc.current.fuelAnnualCost && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-orange-50 border border-orange-200 p-4 rounded-lg">
                                  <div>
                                    <p className="text-xs text-muted-foreground">{fuelLabel} Annual kWh</p>
                                    <p className="font-semibold text-orange-700">{(calc.current.fuelAnnualKWh ?? 0).toFixed(1)}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">{fuelLabel} Annual Cost</p>
                                    <p className="font-semibold text-orange-700">{formatCurrency(calc.current.fuelAnnualCost)}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Total Annual Cost</p>
                                    <p className="font-semibold text-lg text-orange-700">{formatCurrency(calc.current.totalAnnualCost ?? 0)}</p>
                                  </div>
                                </div>
                              )}
                              <div className="bg-muted/30 p-3 rounded-lg">
                                <p className="text-xs text-muted-foreground mb-1">Annual Carbon Emissions{hasFuel ? ' (Total)' : ''}</p>
                                <p className="font-semibold text-sm">{formatCarbon(calc.current.totalCarbonKg ?? calc.current.carbonKg)}</p>
                                {hasFuel && calc.current.fuelCarbonKg && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Electric: {formatCarbon(calc.current.carbonKg)} · {fuelLabel}: {formatCarbon(calc.current.fuelCarbonKg)}
                                  </p>
                                )}
                              </div>
                            </TabsContent>
                            <TabsContent value="planned" className="space-y-4">
                              {auditApp.useSeasonalPattern && auditApp.plannedSeasonalUsage ? (
                                <>
                                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <div className="flex items-center gap-2 mb-3">
                                      <Snowflake size={18} className="text-blue-600" weight="fill" />
                                      <h5 className="font-semibold text-sm">Winter Usage (26 weeks)</h5>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label htmlFor={`planned-winter-daily-minutes-${calc.applianceId}`}>
                                          Planned Daily Minutes
                                        </Label>
                                        <Input
                                          id={`planned-winter-daily-minutes-${calc.applianceId}`}
                                          type="number"
                                          value={auditApp.plannedSeasonalUsage.winterDailyMinutes}
                                          onChange={(e) => handleUpdateAppliance(auditApp.id, {
                                            plannedSeasonalUsage: {
                                              ...auditApp.plannedSeasonalUsage!,
                                              winterDailyMinutes: parseInt(e.target.value) || 0
                                            }
                                          })}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor={`planned-winter-uses-week-${calc.applianceId}`}>
                                          Planned Uses Per Week
                                        </Label>
                                        <Input
                                          id={`planned-winter-uses-week-${calc.applianceId}`}
                                          type="number"
                                          value={auditApp.plannedSeasonalUsage.winterUsesPerWeek}
                                          onChange={(e) => handleUpdateAppliance(auditApp.id, {
                                            plannedSeasonalUsage: {
                                              ...auditApp.plannedSeasonalUsage!,
                                              winterUsesPerWeek: parseInt(e.target.value) || 0
                                            }
                                          })}
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                                    <div className="flex items-center gap-2 mb-3">
                                      <Sun size={18} className="text-amber-600" weight="fill" />
                                      <h5 className="font-semibold text-sm">Summer Usage (26 weeks)</h5>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label htmlFor={`planned-summer-daily-minutes-${calc.applianceId}`}>
                                          Planned Daily Minutes
                                        </Label>
                                        <Input
                                          id={`planned-summer-daily-minutes-${calc.applianceId}`}
                                          type="number"
                                          value={auditApp.plannedSeasonalUsage.summerDailyMinutes}
                                          onChange={(e) => handleUpdateAppliance(auditApp.id, {
                                            plannedSeasonalUsage: {
                                              ...auditApp.plannedSeasonalUsage!,
                                              summerDailyMinutes: parseInt(e.target.value) || 0
                                            }
                                          })}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor={`planned-summer-uses-week-${calc.applianceId}`}>
                                          Planned Uses Per Week
                                        </Label>
                                        <Input
                                          id={`planned-summer-uses-week-${calc.applianceId}`}
                                          type="number"
                                          value={auditApp.plannedSeasonalUsage.summerUsesPerWeek}
                                          onChange={(e) => handleUpdateAppliance(auditApp.id, {
                                            plannedSeasonalUsage: {
                                              ...auditApp.plannedSeasonalUsage!,
                                              summerUsesPerWeek: parseInt(e.target.value) || 0
                                            }
                                          })}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`planned-minutes-${calc.applianceId}`}>
                                      Planned Daily Minutes
                                    </Label>
                                    <Input
                                      id={`planned-minutes-${calc.applianceId}`}
                                      type="number"
                                      value={auditApp.plannedDailyMinutes}
                                      onChange={(e) => handleUpdateAppliance(auditApp.id, {
                                        plannedDailyMinutes: parseInt(e.target.value) || 0
                                      })}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`planned-uses-${calc.applianceId}`}>
                                      Planned Uses Per Week
                                    </Label>
                                    <Input
                                      id={`planned-uses-${calc.applianceId}`}
                                      type="number"
                                      value={auditApp.plannedUsesPerWeek}
                                      onChange={(e) => handleUpdateAppliance(auditApp.id, {
                                        plannedUsesPerWeek: parseInt(e.target.value) || 0
                                      })}
                                    />
                                  </div>
                                </div>
                              )}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-accent/10 p-4 rounded-lg">
                                <div>
                                  <p className="text-xs text-muted-foreground">Weekly Cost</p>
                                  <p className="font-semibold">{formatCurrency(calc.planned.weeklyCost)}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Monthly Cost</p>
                                  <p className="font-semibold">{formatCurrency(calc.planned.monthlyCost)}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Annual Cost{hasFuel ? ' (Elec)' : ''}</p>
                                  <p className="font-semibold">{formatCurrency(calc.planned.annualCost)}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Annual kWh{hasFuel ? ' (Elec)' : ''}</p>
                                  <p className="font-semibold">{(calc.planned.annualKWh ?? 0).toFixed(1)}</p>
                                </div>
                              </div>
                              {hasFuel && calc.planned.fuelAnnualCost && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-orange-50 border border-orange-200 p-4 rounded-lg">
                                  <div>
                                    <p className="text-xs text-muted-foreground">{fuelLabel} Annual kWh</p>
                                    <p className="font-semibold text-orange-700">{(calc.planned.fuelAnnualKWh ?? 0).toFixed(1)}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">{fuelLabel} Annual Cost</p>
                                    <p className="font-semibold text-orange-700">{formatCurrency(calc.planned.fuelAnnualCost)}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Total Annual Cost</p>
                                    <p className="font-semibold text-lg text-orange-700">{formatCurrency(calc.planned.totalAnnualCost ?? 0)}</p>
                                  </div>
                                </div>
                              )}
                              <div className="bg-accent/10 p-3 rounded-lg border border-accent/20">
                                <p className="text-xs text-muted-foreground mb-1">Planned Carbon Emissions{hasFuel ? ' (Total)' : ''}</p>
                                <p className="font-semibold text-sm">{formatCarbon(calc.planned.totalCarbonKg ?? calc.planned.carbonKg)}</p>
                                {hasFuel && calc.planned.fuelCarbonKg && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Electric: {formatCarbon(calc.planned.carbonKg)} · {fuelLabel}: {formatCarbon(calc.planned.fuelCarbonKg)}
                                  </p>
                                )}
                              </div>
                              {calc.savings.annualCost !== 0 && (
                                <div className={cn(
                                  "p-4 rounded-lg border-2",
                                  calc.savings.annualCost > 0 
                                    ? "bg-success/10 border-success" 
                                    : "bg-destructive/10 border-destructive"
                                )}>
                                  <div className="flex items-center gap-2 mb-2">
                                    <ChartBar size={20} className={
                                      calc.savings.annualCost > 0 ? "text-success" : "text-destructive"
                                    } />
                                    <p className="font-semibold">
                                      {calc.savings.annualCost > 0 ? "Potential Savings" : "Increased Cost"}
                                    </p>
                                  </div>
                                  <div className="grid grid-cols-3 gap-3">
                                    <div>
                                      <p className="text-xs text-muted-foreground">Annual £</p>
                                      <p className="font-bold text-lg">
                                        {formatCurrency(Math.abs(calc.savings.annualCost))}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground">Annual kWh</p>
                                      <p className="font-bold text-lg">
                                        {(Math.abs(calc.savings.annualKWh) ?? 0).toFixed(1)}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground">Carbon Saved</p>
                                      <p className="font-bold text-lg">
                                        {formatCarbon(Math.abs(calc.savings.carbonKg))}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </TabsContent>
                          </Tabs>
                          <div className="pt-4 border-t">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteAppliance(auditApp.id)}
                            >
                              <Trash size={16} className="mr-2" />
                              Remove Appliance
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            )}
          </CardContent>
        </Card>

        <Dialog open={showApplianceDialog} onOpenChange={setShowApplianceDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Add Appliance</DialogTitle>
              <DialogDescription>
                Select an appliance from our database
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
              <div className="relative">
                <MagnifyingGlass className="absolute left-3 top-3 text-muted-foreground" size={18} />
                <Input
                  placeholder="Search appliances..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                >
                  All
                </Button>
                {APPLIANCE_CATEGORIES.map(cat => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
              <div className="flex-1 overflow-y-auto pr-2">
                <div className="grid gap-2">
                  {filteredAppliances.map(appliance => (
                    <Card
                      key={appliance.id}
                      className="cursor-pointer hover:bg-accent/5 transition-colors"
                      onClick={() => handleAddAppliance(appliance)}
                    >
                      <CardHeader className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base mb-2">{appliance.name}</CardTitle>
                            <div className="flex gap-2 mb-2">
                              <Badge variant="secondary" className="text-xs">
                                {appliance.category}
                              </Badge>
                              {appliance.fuelType === 'gas' && (
                                <Badge variant="outline" className="text-xs bg-orange-50 border-orange-300 text-orange-700">
                                  Gas {appliance.gasKWhRating}kW
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs">
                                {appliance.watts}W
                              </Badge>
                            </div>
                            {appliance.notes && (
                              <p className="text-xs text-muted-foreground">{appliance.notes}</p>
                            )}
                          </div>
                          <Plus size={20} className="text-primary flex-shrink-0 ml-2" />
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {showReport && summary && (
          <Dialog open={showReport} onOpenChange={setShowReport}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Energy Audit Report</DialogTitle>
                <DialogDescription>
                  Summary and recommendations for {currentAudit.householder}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 print:text-black" id="report-content">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{currentAudit.householder}</h2>
                  <p className="text-sm text-muted-foreground">
                    Report generated on {new Date().toLocaleDateString('en-GB', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Electricity Rate</p>
                    <p className="text-lg font-bold">{formatCurrency(currentAudit.unitRate)}/kWh</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Gas Rate</p>
                    <p className="text-lg font-bold">{formatCurrency(currentAudit.gasUnitRate)}/kWh</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Oil Rate</p>
                    <p className="text-lg font-bold">{formatCurrency(currentAudit.oilUnitRate)}/kWh</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">LPG Rate</p>
                    <p className="text-lg font-bold">{formatCurrency(currentAudit.lpgUnitRate)}/kWh</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Current Annual Cost</p>
                    <p className="text-lg font-bold">{formatCurrency(summary.totalCurrentAnnualCost)}</p>
                  </div>
                  <div className="bg-accent/10 p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Potential Annual Cost</p>
                    <p className="text-lg font-bold text-accent">{formatCurrency(summary.totalPlannedAnnualCost)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-success/10 p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Potential Savings</p>
                    <p className="text-lg font-bold text-success">{formatCurrency(summary.totalSavings)}</p>
                  </div>
                  <div className="bg-success/10 p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Carbon Saved</p>
                    <p className="text-lg font-bold text-success">{formatCarbon(summary.totalCarbonSavingsKg)}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Appliance Breakdown</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left p-3">Appliance</th>
                          <th className="text-right p-3">Current Annual</th>
                          <th className="text-right p-3">Planned Annual</th>
                          <th className="text-right p-3">Savings</th>
                        </tr>
                      </thead>
                      <tbody>
                        {summary.appliances.map((calc, idx) => (
                          <tr key={calc.applianceId} className={idx % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                            <td className="p-3">
                              <div>
                                <p className="font-medium">{calc.name}</p>
                                <p className="text-xs text-muted-foreground">{calc.watts}W</p>
                              </div>
                            </td>
                            <td className="p-3 text-right font-medium">
                              {formatCurrency(calc.current.totalAnnualCost ?? calc.current.annualCost)}
                            </td>
                            <td className="p-3 text-right font-medium">
                              {formatCurrency(calc.planned.totalAnnualCost ?? calc.planned.annualCost)}
                            </td>
                            <td className={cn(
                              "p-3 text-right font-bold",
                              calc.savings.annualCost > 0 ? "text-success" : calc.savings.annualCost < 0 ? "text-destructive" : ""
                            )}>
                              {calc.savings.annualCost > 0 ? "+" : ""}{formatCurrency(calc.savings.annualCost)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <Separator />

                {summary.totalCarbonSavingsKg > 0 && (
                  <>
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Leaf size={24} className="text-success" weight="fill" />
                        <h3 className="text-lg font-semibold">Environmental Impact</h3>
                      </div>
                      <Card className="bg-success/5 border-success/20">
                        <CardContent className="p-6">
                          <p className="text-base mb-4">
                            By implementing these planned changes, you could reduce your annual carbon emissions by <span className="font-bold text-success text-lg">{formatCarbon(summary.totalCarbonSavingsKg)}</span>.
                          </p>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-background/50 p-4 rounded-lg">
                              <p className="text-xs text-muted-foreground mb-1">Equivalent to</p>
                              <p className="font-semibold text-lg">{((summary.totalCarbonSavingsKg ?? 0) / 0.43).toFixed(0)} miles</p>
                              <p className="text-xs text-muted-foreground">not driven by average car</p>
                            </div>
                            <div className="bg-background/50 p-4 rounded-lg">
                              <p className="text-xs text-muted-foreground mb-1">Same as planting</p>
                              <p className="font-semibold text-lg">{((summary.totalCarbonSavingsKg ?? 0) / 21.77).toFixed(1)} trees</p>
                              <p className="text-xs text-muted-foreground">and growing for 10 years</p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-4 italic">
                            * Carbon calculations based on UK grid carbon intensity of 0.232 kg CO₂ per kWh
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    <Separator />
                  </>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb size={24} className="text-accent" weight="fill" />
                    <h3 className="text-lg font-semibold">Energy Saving Tips</h3>
                  </div>
                  <div className="grid gap-3">
                    {ENERGY_TIPS.slice(0, 10).map(tip => (
                      <Card key={tip.id} className="bg-muted/30">
                        <CardHeader className="p-4">
                          <CardTitle className="text-sm mb-1">{tip.title}</CardTitle>
                          <CardDescription className="text-xs">
                            {tip.description}
                          </CardDescription>
                          {tip.potentialSaving && (
                            <p className="text-xs font-semibold text-success mt-2">
                              💡 {tip.potentialSaving}
                            </p>
                          )}
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={generatePDF}>
                  <Download size={18} className="mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" onClick={() => window.print()}>
                  <FilePdf size={18} className="mr-2" />
                  Print
                </Button>
                <Button onClick={() => setShowReport(false)}>
                  Close
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Dialog open={showBulkEditDialog} onOpenChange={setShowBulkEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Edit Fuel Rates</DialogTitle>
            <DialogDescription>
              Update fuel rates for {selectedApplianceIds.size} selected appliance{selectedApplianceIds.size !== 1 ? 's' : ''}. Only enter values for fuel types you want to update.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {currentAudit && selectedApplianceIds.size > 0 && (
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <p className="text-sm font-semibold mb-2">Selected Appliances:</p>
                <div className="flex flex-wrap gap-2">
                  {Array.from(selectedApplianceIds).map(id => {
                    const auditApp = currentAudit.appliances.find(a => a.id === id)
                    if (!auditApp) return null
                    const appliance = APPLIANCES.find(a => a.id === auditApp.applianceId)
                    if (!appliance) return null
                    const fuelType = appliance.fuelType === 'gas' ? 'Gas' : 
                                    appliance.fuelType === 'oil' ? 'Oil' : 
                                    appliance.fuelType === 'lpg' ? 'LPG' : ''
                    return (
                      <Badge key={id} variant="secondary" className="text-xs">
                        {appliance.name} ({fuelType})
                      </Badge>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="bulk-gas-rate">Gas Unit Rate (£ per kWh)</Label>
                <Input
                  id="bulk-gas-rate"
                  type="number"
                  step="0.01"
                  placeholder="Leave empty to skip gas appliances"
                  value={bulkEditRates.gasRate}
                  onChange={(e) => setBulkEditRates(prev => ({ ...prev, gasRate: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">
                  Will update all selected gas boilers and heating appliances
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bulk-oil-rate">Oil Unit Rate (£ per kWh)</Label>
                <Input
                  id="bulk-oil-rate"
                  type="number"
                  step="0.01"
                  placeholder="Leave empty to skip oil appliances"
                  value={bulkEditRates.oilRate}
                  onChange={(e) => setBulkEditRates(prev => ({ ...prev, oilRate: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">
                  Will update all selected oil boilers and heating appliances
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bulk-lpg-rate">LPG Unit Rate (£ per kWh)</Label>
                <Input
                  id="bulk-lpg-rate"
                  type="number"
                  step="0.01"
                  placeholder="Leave empty to skip LPG appliances"
                  value={bulkEditRates.lpgRate}
                  onChange={(e) => setBulkEditRates(prev => ({ ...prev, lpgRate: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">
                  Will update all selected LPG boilers and heating appliances
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowBulkEditDialog(false)
                  setBulkEditRates({ gasRate: "", oilRate: "", lpgRate: "" })
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleBulkEditFuelRates}
                disabled={!bulkEditRates.gasRate && !bulkEditRates.oilRate && !bulkEditRates.lpgRate}
                className="flex-1"
              >
                Update Rates
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default App