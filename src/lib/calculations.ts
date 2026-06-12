export interface SeasonalUsage {
  winterDailyMinutes: number
  winterUsesPerWeek: number
  summerDailyMinutes: number
  summerUsesPerWeek: number
}

export interface AuditAppliance {
  id: string
  applianceId: string
  dailyMinutes: number
  usesPerWeek: number
  plannedDailyMinutes: number
  plannedUsesPerWeek: number
  customWatts?: number
  member?: string
  useSeasonalPattern?: boolean
  seasonalUsage?: SeasonalUsage
  plannedSeasonalUsage?: SeasonalUsage
  gasUnitRate?: number
  oilUnitRate?: number
  lpgUnitRate?: number
}

export interface Audit {
  id: string
  householder: string
  unitRate: number
  gasUnitRate: number
  oilUnitRate: number
  lpgUnitRate: number
  standingCharge: number
  appliances: AuditAppliance[]
  createdAt: string
  updatedAt: string
}

export interface CalculationResult {
  kWhPerHour: number
  kWhPerUse: number
  weeklyKWh: number
  annualKWh: number
  costPerUse: number
  weeklyCost: number
  monthlyCost: number
  annualCost: number
  carbonKg: number
  fuelAnnualKWh?: number
  fuelAnnualCost?: number
  fuelCarbonKg?: number
  totalAnnualCost?: number
  totalCarbonKg?: number
}

export interface ApplianceCalculation {
  applianceId: string
  name: string
  watts: number
  category: string
  current: CalculationResult
  planned: CalculationResult
  savings: {
    annualCost: number
    annualKWh: number
    percentageCost: number
    percentageKWh: number
    carbonKg: number
  }
}

export interface AuditSummary {
  totalCurrentAnnualCost: number
  totalPlannedAnnualCost: number
  totalSavings: number
  totalCurrentKWh: number
  totalPlannedKWh: number
  totalKWhSavings: number
  totalCurrentCarbonKg: number
  totalPlannedCarbonKg: number
  totalCarbonSavingsKg: number
  standingCharge: number
  totalWithStandingCharge: number
  appliances: ApplianceCalculation[]
}

export const DAILY_STANDING_CHARGE = 0.53

export const UK_GRID_CARBON_INTENSITY = 0.23175

export const GAS_CARBON_INTENSITY = 0.18396

export const OIL_CARBON_INTENSITY = 0.24674

export const LPG_CARBON_INTENSITY = 0.21449

export const DEFAULT_GAS_UNIT_RATE = 0.06

export const DEFAULT_OIL_UNIT_RATE = 0.07

export const DEFAULT_LPG_UNIT_RATE = 0.08

export const WINTER_WEEKS = 26
export const SUMMER_WEEKS = 26

export function calculateUsage(
  watts: number,
  dailyMinutes: number,
  usesPerWeek: number,
  unitRate: number,
  fuelKWhRating?: number,
  fuelUnitRate?: number,
  fuelCarbonIntensity?: number,
  boilerEfficiency: number = 0.90
): CalculationResult {
  const kWhPerHour = watts / 1000
  
  const kWhPerUse = kWhPerHour * (dailyMinutes / 60)
  
  const weeklyKWh = kWhPerUse * usesPerWeek
  
  const annualKWh = weeklyKWh * 52
  
  const costPerUse = kWhPerUse * unitRate
  
  const weeklyCost = weeklyKWh * unitRate
  
  const monthlyCost = weeklyCost * 4.345
  
  const annualCost = annualKWh * unitRate

  const carbonKg = annualKWh * UK_GRID_CARBON_INTENSITY

  let fuelAnnualKWh: number | undefined
  let fuelAnnualCost: number | undefined
  let fuelCarbonKg: number | undefined
  let totalAnnualCost: number | undefined
  let totalCarbonKg: number | undefined

  if (fuelKWhRating && fuelUnitRate && fuelCarbonIntensity !== undefined) {
    const fuelKWhPerHour = fuelKWhRating
    const fuelKWhPerUse = fuelKWhPerHour * (dailyMinutes / 60)
    const fuelWeeklyKWh = fuelKWhPerUse * usesPerWeek
    fuelAnnualKWh = fuelWeeklyKWh * 52 / boilerEfficiency
    fuelAnnualCost = fuelAnnualKWh * fuelUnitRate
    fuelCarbonKg = fuelAnnualKWh * fuelCarbonIntensity
    totalAnnualCost = annualCost + fuelAnnualCost
    totalCarbonKg = carbonKg + fuelCarbonKg
  }

  return {
    kWhPerHour,
    kWhPerUse,
    weeklyKWh,
    annualKWh,
    costPerUse,
    weeklyCost,
    monthlyCost,
    annualCost,
    carbonKg,
    fuelAnnualKWh,
    fuelAnnualCost,
    fuelCarbonKg,
    totalAnnualCost,
    totalCarbonKg
  }
}

export function calculateSeasonalUsage(
  watts: number,
  winterDailyMinutes: number,
  winterUsesPerWeek: number,
  summerDailyMinutes: number,
  summerUsesPerWeek: number,
  unitRate: number,
  fuelKWhRating?: number,
  fuelUnitRate?: number,
  fuelCarbonIntensity?: number,
  boilerEfficiency: number = 0.90
): CalculationResult {
  const kWhPerHour = watts / 1000
  
  const winterKWhPerUse = kWhPerHour * (winterDailyMinutes / 60)
  const winterWeeklyKWh = winterKWhPerUse * winterUsesPerWeek
  const winterAnnualKWh = winterWeeklyKWh * WINTER_WEEKS
  
  const summerKWhPerUse = kWhPerHour * (summerDailyMinutes / 60)
  const summerWeeklyKWh = summerKWhPerUse * summerUsesPerWeek
  const summerAnnualKWh = summerWeeklyKWh * SUMMER_WEEKS
  
  const annualKWh = winterAnnualKWh + summerAnnualKWh
  const weeklyKWh = annualKWh / 52
  const kWhPerUse = (winterKWhPerUse + summerKWhPerUse) / 2
  
  const costPerUse = kWhPerUse * unitRate
  const weeklyCost = weeklyKWh * unitRate
  const monthlyCost = weeklyCost * 4.345
  const annualCost = annualKWh * unitRate
  const carbonKg = annualKWh * UK_GRID_CARBON_INTENSITY

  let fuelAnnualKWh: number | undefined
  let fuelAnnualCost: number | undefined
  let fuelCarbonKg: number | undefined
  let totalAnnualCost: number | undefined
  let totalCarbonKg: number | undefined

  if (fuelKWhRating && fuelUnitRate && fuelCarbonIntensity !== undefined) {
    const fuelKWhPerHour = fuelKWhRating
    
    const winterFuelKWhPerUse = fuelKWhPerHour * (winterDailyMinutes / 60)
    const winterFuelWeeklyKWh = winterFuelKWhPerUse * winterUsesPerWeek
    const winterFuelAnnualKWh = winterFuelWeeklyKWh * WINTER_WEEKS
    
    const summerFuelKWhPerUse = fuelKWhPerHour * (summerDailyMinutes / 60)
    const summerFuelWeeklyKWh = summerFuelKWhPerUse * summerUsesPerWeek
    const summerFuelAnnualKWh = summerFuelWeeklyKWh * SUMMER_WEEKS
    
    fuelAnnualKWh = (winterFuelAnnualKWh + summerFuelAnnualKWh) / boilerEfficiency
    fuelAnnualCost = fuelAnnualKWh * fuelUnitRate
    fuelCarbonKg = fuelAnnualKWh * fuelCarbonIntensity
    totalAnnualCost = annualCost + fuelAnnualCost
    totalCarbonKg = carbonKg + fuelCarbonKg
  }

  return {
    kWhPerHour,
    kWhPerUse,
    weeklyKWh,
    annualKWh,
    costPerUse,
    weeklyCost,
    monthlyCost,
    annualCost,
    carbonKg,
    fuelAnnualKWh,
    fuelAnnualCost,
    fuelCarbonKg,
    totalAnnualCost,
    totalCarbonKg
  }
}

export function calculateSavings(
  current: CalculationResult,
  planned: CalculationResult
) {
  const annualCost = current.annualCost - planned.annualCost
  const annualKWh = current.annualKWh - planned.annualKWh
  const carbonKg = current.carbonKg - planned.carbonKg
  
  const percentageCost = current.annualCost > 0 
    ? (annualCost / current.annualCost) * 100 
    : 0
  
  const percentageKWh = current.annualKWh > 0 
    ? (annualKWh / current.annualKWh) * 100 
    : 0

  return {
    annualCost,
    annualKWh,
    percentageCost,
    percentageKWh,
    carbonKg
  }
}

export function calculateStandingCharge(dailyCharge: number = DAILY_STANDING_CHARGE): number {
  return dailyCharge * 365
}
