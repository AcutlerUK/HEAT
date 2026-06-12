# Planning Guide

A professional web-based Home Energy Audit Tool (HEAT) that enables energy advisors to calculate appliance running costs, demonstrate savings potential, and generate comprehensive reports for householders during home visits.

**Experience Qualities**:
1. **Efficient** - Streamlined workflow allowing advisors to complete audits quickly during home visits with minimal data entry
2. **Authoritative** - Professional presentation that builds trust with householders through clear calculations and accurate data
3. **Empowering** - Provides actionable insights that help householders understand their energy usage and make informed decisions

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This application requires sophisticated calculation engines, multi-step workflows, data persistence across sessions, admin functionality for managing appliance databases, report generation capabilities, and a responsive interface that works across devices. The scope includes user management, multiple data entry screens, real-time calculations, and professional report output.

## Essential Features

### Audit Creation & Management
- **Functionality**: Create new energy audits with householder information and all applicable energy unit rates (electricity, gas, oil, and LPG)
- **Purpose**: Initiates the audit process and captures all essential pricing data upfront for accurate cost calculations across different fuel types
- **Trigger**: User clicks "New Audit" from dashboard
- **Progression**: Dashboard → New Audit Form → Enter householder name + all energy tariff rates (electricity, gas, oil, LPG) → Save → Appliance Selection
- **Success criteria**: Audit saved with unique ID, householder name displayed, all unit rates stored and automatically applied to relevant appliances (electric rate for electric appliances, gas rate for gas boilers, oil rate for oil boilers, LPG rate for LPG boilers)

### Appliance Database Management
- **Functionality**: Browse, search, add, and configure appliances with wattages and default usage patterns
- **Purpose**: Maintains accurate reference data for consistent calculations across all audits
- **Trigger**: Admin accesses appliance library or user searches during appliance selection
- **Progression**: Appliance Library → Search/Browse → Select appliance → View/Edit details (admin only) → Save
- **Success criteria**: All Excel appliances imported, search returns relevant results, edits persist, non-admins cannot modify

### Usage Input & Calculation
- **Functionality**: Record current and planned usage for each appliance with real-time cost calculations, including support for custom wattages for specific appliance models, seasonal usage patterns for heating/cooling appliances, and fuel-based heating systems (gas, oil, and LPG boilers with automatic application of respective fuel rates). Additionally, individual appliances with fuel-based systems can have custom fuel rates that override the audit-level defaults for specific circumstances (e.g., different tariffs for different fuel sources). Bulk editing allows users to select multiple fuel-based appliances and update their fuel rates simultaneously.
- **Purpose**: Captures behavioral data and demonstrates financial impact of usage changes with accurate power consumption for specific appliance models, accounting for seasonal variations in heating/cooling needs and different fuel types for heating systems using the appropriate fuel rates collected during audit creation, with flexibility to override rates per appliance individually or in bulk when needed
- **Trigger**: User adds appliance to audit
- **Progression**: Add Appliance → Enter daily minutes + uses per week → (Optional) Enter custom wattage for specific model → (Optional) For fuel-based appliances, override gas/oil/LPG rate for this specific appliance or select multiple fuel appliances for bulk rate updates → (Optional) Enable seasonal patterns for heating/cooling → Set winter/summer usage → For fuel-based boilers, gas/oil/LPG rates are automatically applied from audit settings or use appliance-specific overrides → View calculated costs (electric + fuel costs displayed separately) → Enter planned usage → View savings → Confirm
- **Success criteria**: Calculations match Excel formulas exactly, updates reflect immediately, all cost metrics displayed correctly, custom wattages override defaults and are clearly indicated, appliance-level fuel rates override audit defaults when set and are visually indicated with badges, bulk editing allows selection of multiple fuel appliances and simultaneous rate updates with clear confirmation, seasonal patterns split year into 26-week winter and summer periods with accurate annual totals, fuel-based boilers (gas, oil, LPG) automatically use the correct fuel rate from audit settings or appliance-specific overrides to calculate both electric and fuel consumption with appropriate carbon intensity factors, fuel costs clearly distinguished from electric costs in the UI

### Savings Analysis
- **Functionality**: Compare current vs planned usage showing monetary, kWh, and carbon savings
- **Purpose**: Visualizes potential savings to motivate householder behavior change and demonstrates environmental impact
- **Trigger**: User enters planned usage different from current usage
- **Progression**: Usage Input → Enter planned values → Calculate difference → Display savings (£ + kWh + CO₂) → Show percentage reduction
- **Success criteria**: Savings calculated correctly, negative values handled (increased usage), visual indicators show improvement, carbon calculations accurate using UK grid carbon intensity

### Report Generation
- **Functionality**: Generate comprehensive PDF/HTML reports with all calculations, carbon savings, and energy-saving tips
- **Purpose**: Provides householder with take-away documentation of their audit results including environmental impact
- **Trigger**: User clicks "Generate Report" after completing audit
- **Progression**: Complete Audit → Generate Report → Preview → Download/Email → Save to audit history
- **Success criteria**: Report includes all required sections, calculations accurate (including carbon), formatting professional, downloadable as PDF

### Energy Saving Tips Library
- **Functionality**: Display contextual energy-saving advice based on appliances in the audit
- **Purpose**: Educates householders on practical steps to reduce consumption
- **Trigger**: Displayed in report and optionally during appliance entry
- **Progression**: View Report → Energy Tips Section → Categorized by appliance type → Copy to clipboard/share
- **Success criteria**: All Excel tips imported, categorized appropriately, displayed in report

### Admin Panel
- **Functionality**: MEA staff can manage appliances, users, organizations, and unit rates
- **Purpose**: Maintains data quality and controls access to the system
- **Trigger**: Admin user accesses admin panel from navigation
- **Progression**: Admin Menu → Select management area (Appliances/Users/Rates) → CRUD operations → Save changes → Confirm
- **Success criteria**: Only authorized users access admin functions, changes persist, data validation prevents errors

## Edge Case Handling

- **Missing Data** - Validate required fields before calculations; show clear error messages for incomplete entries
- **Zero Usage** - Handle appliances with 0 minutes/uses gracefully; allow for standby power calculations
- **Custom Wattages** - Allow users to override default wattages for specific models; clearly indicate when custom values are in use
- **Custom Fuel Rates** - Allow users to override audit-level gas/oil/LPG rates for individual appliances; display badges indicating custom rates are active; provide easy reset to audit defaults
- **Bulk Fuel Rate Editing** - Allow selection of multiple fuel-based appliances (gas/oil/LPG) and update their custom rates simultaneously; provide visual feedback showing which appliances are selected and which fuel types will be updated
- **Seasonal Patterns** - For heating/cooling appliances, allow separate winter (26 weeks) and summer (26 weeks) usage patterns; calculate weighted annual averages
- **Negative Savings** - Display when planned usage exceeds current (increased costs and emissions) with warning styling
- **Decimal Precision** - Round currency to 2 decimals, kWh to 3 decimals, percentages to 1 decimal, carbon to 1 decimal for kg or 2 decimals for tonnes
- **Carbon Calculations** - Use UK grid carbon intensity (0.23175 kg CO₂ per kWh) for electric consumption, gas carbon intensity (0.18396 kg CO₂ per kWh) for gas boilers, oil carbon intensity (0.24674 kg CO₂ per kWh) for oil boilers, and LPG carbon intensity (0.21449 kg CO₂ per kWh) for LPG boilers
- **Multiple Unit Rates** - Support different rates for different appliances or time-of-use tariffs; allow per-appliance fuel rate overrides
- **Offline Usage** - Cache appliance database and allow audit completion without internet connection
- **Large Appliance Lists** - Implement search, filtering, and pagination for households with many appliances
- **Browser Compatibility** - Ensure calculations work consistently across modern browsers
- **Data Loss Prevention** - Auto-save audit progress to local storage every 30 seconds

## Design Direction

The design should evoke **professional competence** and **trustworthy expertise** while remaining **approachable and easy to use**. This is a tool used by trained advisors working with householders, so it must project authority and accuracy while avoiding intimidation. The interface should feel like a modern productivity tool - clean, focused, and efficient - with subtle warmth through color and typography choices that make complex energy data feel accessible.

## Color Selection

A professional yet approachable palette centered on energy-efficiency greens with supporting neutrals and alert colors.

- **Primary Color**: Deep Teal `oklch(0.45 0.12 200)` - Conveys environmental responsibility and professionalism; used for primary actions and key metrics
- **Secondary Colors**: 
  - Warm Slate `oklch(0.35 0.01 240)` for secondary buttons and structural elements
  - Soft Sage `oklch(0.85 0.05 150)` for background accents and success states
- **Accent Color**: Vibrant Lime `oklch(0.72 0.18 130)` - Energy and growth; highlights savings and positive changes
- **Foreground/Background Pairings**:
  - Primary Teal: White text `oklch(1 0 0)` - Ratio 7.2:1 ✓
  - Accent Lime: Dark Slate `oklch(0.25 0.01 240)` - Ratio 8.1:1 ✓
  - Background White `oklch(0.99 0 0)`: Charcoal text `oklch(0.25 0 0)` - Ratio 12.5:1 ✓
  - Card Light Gray `oklch(0.97 0 0)`: Charcoal text - Ratio 11.8:1 ✓

## Font Selection

Typography should communicate **clarity and precision** while maintaining **modern professionalism** - similar to financial or technical applications where accuracy matters but approachability is valued.

- **Primary Font**: Space Grotesk (headings and key metrics) - Technical precision with contemporary character
- **Secondary Font**: Inter (body text and data tables) - Exceptional readability for dense information

**Typographic Hierarchy**:
- H1 (Page Titles): Space Grotesk Bold / 32px / -0.02em / line-height 1.2
- H2 (Section Headers): Space Grotesk Semibold / 24px / -0.01em / line-height 1.3
- H3 (Subsections): Space Grotesk Medium / 18px / normal / line-height 1.4
- Body (Content): Inter Regular / 15px / normal / line-height 1.6
- Data Values (Metrics): Space Grotesk Medium / 20px / tabular-nums / line-height 1.3
- Small Text (Labels): Inter Regular / 13px / normal / line-height 1.5
- Button Text: Inter Semibold / 14px / 0.01em / line-height 1

## Animations

Animations should **reinforce data relationships** and **guide attention to calculated results** without slowing down the workflow. Use motion purposefully to show cause-and-effect in calculations.

- Number transitions when calculations update (counter animation for costs)
- Subtle fade-in for newly added appliances to the audit list
- Smooth expansion for accordion sections containing usage details
- Spring-based drawer animations for admin panel and modals (natural, responsive feel)
- Progress indicator animation during report generation
- Gentle highlight pulse on savings values when they exceed certain thresholds
- Micro-interactions on form inputs (subtle scale on focus, checkmark animation on save)

## Component Selection

### Components
- **Dialog** - For adding/editing appliances and confirming deletions; keep user in context
- **Card** - Primary container for appliance entries, calculation summaries, and audit cards on dashboard
- **Accordion** - Expand/collapse detailed calculations per appliance without overwhelming the view
- **Table** - Display appliance database in admin panel with sortable columns
- **Form** + **Input** + **Label** - All data entry with consistent validation styling
- **Select** - Appliance picker from database with search functionality
- **Tabs** - Switch between Current Usage, Planned Usage, and Savings views
- **Button** - Distinct variants: primary (Deep Teal) for main actions, secondary (Warm Slate) for cancel/back, accent (Vibrant Lime) for generate report
- **Badge** - Tag appliances by category (Heating, Lighting, Cooking, etc.) and show status indicators
- **Progress** - Show completion status of audit (steps completed)
- **Separator** - Divide sections in reports and forms
- **Sheet** - Mobile-friendly drawer for navigation and admin functions

### Customizations
- **Metric Display Cards** - Custom component showing large numbers (costs, savings, kWh, carbon emissions) with labels and trend indicators (up/down arrows)
- **Appliance Usage Row** - Custom layout combining appliance icon/name, usage inputs, and inline calculations including carbon footprint
- **Savings Indicator** - Visual component showing percentage and absolute savings with color coding (green for savings, amber for neutral, red for increases); displays monetary, energy, and carbon savings
- **Report Preview** - Print-optimized layout component that mirrors final PDF output including carbon metrics

### States
- **Buttons**: Default (solid color), Hover (darken 10%), Active (scale 0.98), Focus (ring-2 ring-ring), Disabled (opacity-50)
- **Inputs**: Default (border-input), Focus (border-primary ring-2 ring-primary/20), Error (border-destructive), Success (border-accent), Disabled (bg-muted)
- **Cards**: Default (shadow-sm), Hover (shadow-md transition), Selected (border-primary border-2), Loading (skeleton animation)

### Icon Selection
- **Plus** - Add appliance, new audit
- **Trash** - Delete appliance from audit
- **FloppyDisk** - Save audit
- **FilePdf** - Generate report
- **Lightning** - Energy/power indicators
- **ChartBar** - View savings analysis
- **Lightbulb** - Energy tips
- **Gear** - Admin settings
- **MagnifyingGlass** - Search appliances
- **PencilSimple** - Edit values, bulk edit
- **CheckCircle** - Saved confirmation, selection checkbox
- **Warning** - Validation errors
- **House** - Dashboard/home
- **Snowflake** - Winter season/heating
- **Sun** - Summer season/cooling
- **Leaf** - Environmental/carbon impact

### Spacing
- Card padding: `p-6`
- Section gaps: `gap-8`
- Form field gaps: `gap-4`
- Inline element gaps: `gap-2`
- Page margins: `px-4 md:px-6 lg:px-8`
- Container max-width: `max-w-7xl mx-auto`

### Mobile
- Stack all forms vertically on mobile
- Convert data tables to card-based layouts below 768px
- Collapse navigation to Sheet drawer on mobile
- Increase touch targets to minimum 44px
- Single-column appliance cards instead of table rows
- Fixed bottom action bar for primary CTAs (Save, Generate Report)
- Sticky headers on scrollable lists
- Bottom sheet for appliance selection on mobile
