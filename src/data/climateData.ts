// Comprehensive Climate & Frontier Physics Datasets for Earth Pulse
// Sources: NOAA GML, NASA GISS, NSIDC, Global Forest Watch, Our World in Data, IPCC AR6, IAEA, ITER, Stockholm Resilience Centre

export interface TimeSeriesPoint {
  year: number
  value: number
  baseline?: number
  lower?: number
  upper?: number
  projected?: boolean
}

export interface HotspotPin {
  id: string
  name: string
  region: string
  lat: number
  lng: number
  severity: 'critical' | 'severe' | 'moderate'
  metric: string
  trend: string
  details: string
  historicalLoss: string
  mode: 'glaciers' | 'deforestation' | 'carbon'
}

export interface MetricSummary {
  current: number
  unit: string
  delta: string
  deltaPeriod: string
  status: 'critical' | 'warning' | 'positive'
  source: string
  citation: string
  lastUpdated: string
  description: string
  sparkline: number[]
}

// 1. GLACIERS & ARCTIC DATA
export const glacierMetrics: Record<string, MetricSummary> = {
  arcticIceExtent: {
    current: 4.23,
    unit: 'M km²',
    delta: '-12.6%',
    deltaPeriod: 'per decade since 1979',
    status: 'critical',
    source: 'NSIDC / NASA',
    citation: 'National Snow and Ice Data Center Sea Ice Index v3',
    lastUpdated: 'Live Sept 2025 Satellite Pass',
    description: 'Minimum Arctic sea ice extent recorded at summer thaw. Dropped from 7.54M km² in 1980.',
    sparkline: [7.54, 7.21, 6.9, 6.5, 6.1, 5.8, 5.3, 4.9, 4.3, 4.23],
  },
  seaLevelRise: {
    current: 104.8,
    unit: 'mm',
    delta: '+3.9 mm',
    deltaPeriod: 'annual acceleration',
    status: 'critical',
    source: 'NASA Sea Level Change',
    citation: 'Jason-3 & Sentinel-6 Michael Freilich Altimetry',
    lastUpdated: 'Q3 2025 Consensus',
    description: 'Global mean sea level rise above 1993 satellite baseline, driven by thermal expansion & meltwater.',
    sparkline: [0, 11, 23, 38, 52, 67, 81, 92, 100, 104.8],
  },
  greenlandIceMass: {
    current: -5280,
    unit: 'Gigatonnes',
    delta: '-271 Gt',
    deltaPeriod: 'average yearly loss',
    status: 'critical',
    source: 'NASA GRACE / GRACE-FO',
    citation: 'Gravity Recovery and Climate Experiment Mass Balance',
    lastUpdated: '2025 Data Release',
    description: 'Cumulative ice sheet mass lost by Greenland since 2002. Equivalent to 14.6mm global sea rise.',
    sparkline: [-300, -850, -1500, -2300, -3100, -3900, -4500, -4900, -5280],
  },
  antarcticaIceMass: {
    current: -2840,
    unit: 'Gigatonnes',
    delta: '-149 Gt',
    deltaPeriod: 'average yearly loss',
    status: 'critical',
    source: 'NASA GRACE / ESA CCI',
    citation: 'Antarctic Ice Sheet Mass Balance Inter-comparison',
    lastUpdated: '2025 Data Release',
    description: 'West Antarctic Thwaites & Pine Island Glacier grounding line retreats accelerating.',
    sparkline: [-150, -420, -820, -1350, -1800, -2250, -2600, -2840],
  },
}

// 2. DEFORESTATION DATA
export const deforestationMetrics: Record<string, MetricSummary> = {
  treeCoverLostTotal: {
    current: 489,
    unit: 'M Hectares',
    delta: '+3.7M ha',
    deltaPeriod: 'lost in past 12 months',
    status: 'critical',
    source: 'Global Forest Watch / UMD',
    citation: 'Hansen/UMD/Google Landsat Global Forest Change',
    lastUpdated: '2025 Annual Synthesis',
    description: 'Cumulative global tree canopy loss since 2001, equivalent to losing an area the size of India.',
    sparkline: [8.5, 12.3, 16.7, 21.0, 24.5, 27.2, 29.8, 32.1, 35.4, 38.2],
  },
  primaryRainforestLoss: {
    current: 3.8,
    unit: 'M ha/yr',
    delta: '10 football fields',
    deltaPeriod: 'per minute destroyed',
    status: 'critical',
    source: 'World Resources Institute',
    citation: 'WRI Tropical Primary Forest Assessment',
    lastUpdated: '2025 Report',
    description: 'Irreplaceable mature tropical humid forest lost, releasing 2.5 Gt CO₂ emissions annually.',
    sparkline: [4.2, 3.9, 4.6, 4.3, 3.8, 4.1, 3.75, 3.8],
  },
  amazonDiebackProgress: {
    current: 17.6,
    unit: '%',
    delta: '20-25% limit',
    deltaPeriod: 'savannization tipping point',
    status: 'warning',
    source: 'INPE / RAISG / Science',
    citation: 'Lovejoy & Nobre Amazon Tipping Point Consensus',
    lastUpdated: '2025 Satellite Audit',
    description: 'Amazon biome deforested. Crossing 20% risks irreversible shift into dry scrubland savannas.',
    sparkline: [10.2, 11.5, 12.9, 14.1, 15.3, 16.2, 17.1, 17.6],
  },
  carbonSinkStatus: {
    current: -0.42,
    unit: 'Gt CO₂/yr',
    delta: 'Flipping',
    deltaPeriod: 'from sink to net source',
    status: 'warning',
    source: 'Nature 2021 / GCB',
    citation: 'Global Carbon Project Forest Biome Accounting',
    lastUpdated: '2025 Update',
    description: 'Southeast Amazonia now emits more carbon than it absorbs due to fires and severe droughts.',
    sparkline: [-2.1, -1.8, -1.4, -0.9, -0.6, -0.42],
  },
}

// 3. CARBON & EMISSIONS DATA
export const carbonMetrics: Record<string, MetricSummary> = {
  co2Atmospheric: {
    current: 427.8,
    unit: 'PPM',
    delta: '+2.8 ppm',
    deltaPeriod: 'annual increase',
    status: 'critical',
    source: 'NOAA Global Monitoring Lab',
    citation: 'Mauna Loa Observatory Atmospheric Keeling Curve',
    lastUpdated: 'Live Daily Flask Reading 2025',
    description: 'Atmospheric concentration of carbon dioxide. Pre-industrial baseline was 280 ppm.',
    sparkline: [315, 330, 350, 370, 390, 410, 420, 425, 427.8],
  },
  globalTempAnomaly: {
    current: 1.49,
    unit: '°C above pre-ind.',
    delta: '+0.12°C',
    deltaPeriod: 'record warmth decade',
    status: 'critical',
    source: 'NASA GISS / Copernicus',
    citation: 'GISTEMP v4 Surface Temperature Analysis',
    lastUpdated: '2025 Running 12-Month Mean',
    description: 'Global mean surface temperature anomaly relative to the 1850-1900 pre-industrial baseline.',
    sparkline: [0.05, 0.12, 0.28, 0.45, 0.65, 0.88, 1.05, 1.25, 1.49],
  },
  annualGlobalEmissions: {
    current: 37.4,
    unit: 'Gt CO₂/yr',
    delta: '+1.1%',
    deltaPeriod: 'vs 2023 levels',
    status: 'critical',
    source: 'Global Carbon Project',
    citation: 'Global Carbon Budget 2024/2025',
    lastUpdated: 'Annual Verification',
    description: 'Fossil carbon dioxide emissions from coal, oil, gas, and cement manufacturing.',
    sparkline: [15.2, 19.8, 22.4, 25.1, 30.2, 33.5, 35.8, 36.8, 37.4],
  },
  methaneAtmospheric: {
    current: 1932,
    unit: 'PPB',
    delta: '+11.2 ppb',
    deltaPeriod: 'past 12 months',
    status: 'critical',
    source: 'NOAA GML',
    citation: 'NOAA Trends in Atmospheric Methane (CH4)',
    lastUpdated: '2025 Monthly Record',
    description: 'Atmospheric methane has over 80x the warming power of CO₂ over a 20-year timescale.',
    sparkline: [1650, 1700, 1750, 1780, 1820, 1860, 1900, 1932],
  },
}

// 4. HISTORICAL TIME SERIES (1880 - 2025)
export const historicalClimateData: TimeSeriesPoint[] = [
  { year: 1880, value: -0.16, baseline: 285 },
  { year: 1900, value: -0.09, baseline: 295 },
  { year: 1920, value: -0.23, baseline: 303 },
  { year: 1940, value: 0.12, baseline: 310 },
  { year: 1960, value: -0.02, baseline: 317 },
  { year: 1970, value: 0.03, baseline: 325 },
  { year: 1980, value: 0.26, baseline: 338 },
  { year: 1990, value: 0.45, baseline: 354 },
  { year: 2000, value: 0.61, baseline: 369 },
  { year: 2005, value: 0.68, baseline: 379 },
  { year: 2010, value: 0.72, baseline: 389 },
  { year: 2015, value: 0.90, baseline: 400 },
  { year: 2018, value: 0.98, baseline: 408 },
  { year: 2020, value: 1.02, baseline: 414 },
  { year: 2021, value: 1.11, baseline: 416 },
  { year: 2022, value: 1.16, baseline: 418 },
  { year: 2023, value: 1.34, baseline: 421 },
  { year: 2024, value: 1.45, baseline: 424 },
  { year: 2025, value: 1.49, baseline: 427.8 },
]

// 5. 800,000-YEAR ICE CORE PALEOCLIMATE CO2 DATA (EPICA Dome C & Vostok)
export const paleoclimateIceCoreData = [
  { kYearsAgo: 800, co2: 195, tempDelta: -6.2 },
  { kYearsAgo: 700, co2: 240, tempDelta: -2.1 },
  { kYearsAgo: 600, co2: 185, tempDelta: -7.0 },
  { kYearsAgo: 500, co2: 250, tempDelta: -1.5 },
  { kYearsAgo: 400, co2: 280, tempDelta: 0.2 }, // MIS 11 interglacial
  { kYearsAgo: 340, co2: 180, tempDelta: -8.1 },
  { kYearsAgo: 240, co2: 260, tempDelta: -1.0 },
  { kYearsAgo: 140, co2: 190, tempDelta: -7.5 },
  { kYearsAgo: 125, co2: 285, tempDelta: 1.2 }, // Eemian interglacial
  { kYearsAgo: 20, co2: 185, tempDelta: -6.8 },  // Last Glacial Maximum
  { kYearsAgo: 10, co2: 265, tempDelta: -0.5 },  // Early Holocene
  { kYearsAgo: 0.2, co2: 280, tempDelta: 0.0 }, // 1800 AD Pre-industrial
  { kYearsAgo: 0, co2: 428, tempDelta: 1.49 },   // Present Day Anthropocene Spike!
]

// 6. 9 PLANETARY BOUNDARIES (Stockholm Resilience Centre / Richardson et al. 2023)
export const planetaryBoundaries = [
  {
    id: 'climate',
    name: 'Climate Change',
    controlVariable: 'Atmospheric CO₂ concentration (ppm) & Radiative Forcing (W/m²)',
    safeLimit: '350 ppm / 1.0 W/m²',
    currentValue: '427.8 ppm / 2.91 W/m²',
    status: 'transgressed',
    impact: 'Accelerated cryosphere loss, severe extreme events, ocean deoxygenation.',
  },
  {
    id: 'biosphere',
    name: 'Biosphere Integrity',
    controlVariable: 'Extinction rate (E/MSY) & Functional genetic diversity',
    safeLimit: '< 10 E/MSY',
    currentValue: '> 100 - 1000 E/MSY',
    status: 'transgressed',
    impact: 'Sixth mass extinction event underway; 1 million species at imminent extinction risk.',
  },
  {
    id: 'land',
    name: 'Land-System Change',
    controlVariable: 'Global forested area remaining relative to potential forest cover',
    safeLimit: '≥ 75% forest area',
    currentValue: '60% remaining',
    status: 'transgressed',
    impact: 'Destabilization of rainfall regimes, carbon sink collapse, habitat fragmentation.',
  },
  {
    id: 'freshwater',
    name: 'Freshwater Change',
    controlVariable: 'Blue water (surface/groundwater) & Green water (soil moisture deviation)',
    safeLimit: '< 10.2% runoff disruption',
    currentValue: '18.2% disrupted',
    status: 'transgressed',
    impact: 'Continent-wide hydrological shifts, severe agrarian droughts, drying river basins.',
  },
  {
    id: 'biogeochemical',
    name: 'Biogeochemical Flows',
    controlVariable: 'Synthetic Nitrogen (Tg N/yr) & Phosphorus (Tg P/yr) fertilizer influx',
    safeLimit: '62 Tg N/yr / 11 Tg P/yr',
    currentValue: '190 Tg N/yr / 28 Tg P/yr',
    status: 'transgressed',
    impact: 'Over 500 oceanic dead zones (hypoxia), widespread eutrophication of freshwater lakes.',
  },
  {
    id: 'novel-entities',
    name: 'Novel Entities (Synthetic Pollutants)',
    controlVariable: 'Mass production rate of untested chemicals, plastics & pesticides',
    safeLimit: '0% unregulated release',
    currentValue: '350,000+ chemicals active',
    status: 'transgressed',
    impact: 'PFAS "forever chemicals" present in all global rainwater; microplastics in human blood & placentas.',
  },
  {
    id: 'ocean-acidification',
    name: 'Ocean Acidification',
    controlVariable: 'Aragonite saturation state in surface seawater (Ωarag)',
    safeLimit: '≥ 80% pre-industrial',
    currentValue: '84% (Borderline)',
    status: 'approaching',
    impact: 'Seawater pH dropped from 8.25 to 8.14 (30% increase in acidity). Dissolving pteropods and coral calcification.',
  },
  {
    id: 'aerosol',
    name: 'Atmospheric Aerosol Loading',
    controlVariable: 'Aerosol Optical Depth (AOD) inter-hemispheric difference',
    safeLimit: 'AOD delta < 0.1',
    currentValue: '0.08 (Regional hotspot breach)',
    status: 'safe',
    impact: 'Indo-Gangetic and East Asian regional monsoon disruptions due to black carbon and sulfate haze.',
  },
  {
    id: 'ozone',
    name: 'Stratospheric Ozone Depletion',
    controlVariable: 'Antarctic stratospheric ozone thickness in Dobson Units (DU)',
    safeLimit: '≥ 276 DU',
    currentValue: '290 DU (Healing)',
    status: 'safe',
    impact: 'Montreal Protocol 1987 success story. Ozone hole projected to heal completely by 2066.',
  },
]

// 7. SECTOR EMISSIONS BREAKDOWN
export const emissionsBySector = [
  { name: 'Electricity & Heat', share: 31.9, co2Gt: 15.8, color: '#38BDF8' },
  { name: 'Transport (Road/Air/Ship)', share: 16.2, co2Gt: 8.2, color: '#FF6B5A' },
  { name: 'Manufacturing & Industry', share: 21.4, co2Gt: 10.6, color: '#FF2E88' },
  { name: 'Buildings & Heating', share: 5.6, co2Gt: 2.8, color: '#7C5CFF' },
  { name: 'Agriculture & Land Use', share: 18.4, co2Gt: 9.1, color: '#22C55E' },
  { name: 'Fugitive & Waste', share: 6.5, co2Gt: 3.2, color: '#F59E0B' },
]

// 8. TOP EMITTING COUNTRIES (Mt CO₂/yr)
export const countryEmissions = [
  { country: 'China', mt: 11400, perCapita: 8.1, share: 29.2, reductionTarget: 'Net Zero 2060' },
  { country: 'United States', mt: 4980, perCapita: 14.9, share: 12.8, reductionTarget: '50% by 2030' },
  { country: 'India', mt: 2710, perCapita: 1.9, share: 7.0, reductionTarget: 'Net Zero 2070' },
  { country: 'European Union (27)', mt: 2650, perCapita: 5.9, share: 6.8, reductionTarget: '55% by 2030' },
  { country: 'Russia', mt: 1750, perCapita: 12.1, share: 4.5, reductionTarget: 'Net Zero 2060' },
  { country: 'Japan', mt: 1060, perCapita: 8.5, share: 2.7, reductionTarget: '46% by 2030' },
  { country: 'International Aviation/Shipping', mt: 1020, perCapita: 0, share: 2.6, reductionTarget: 'Net Zero 2050' },
]

// 9. GLOBAL MAP HOTSPOT PINS
export const climateHotspots: HotspotPin[] = [
  {
    id: 'greenland',
    name: 'Jakobshavn Glacier & Ice Sheet',
    region: 'West Greenland',
    lat: 69.17,
    lng: -49.83,
    severity: 'critical',
    metric: '46 km/yr flow speed',
    trend: 'Record thinning: losing 270 Gt ice annually',
    details: 'One of the fastest moving glaciers on Earth. Calves massive icebergs into Disko Bay.',
    historicalLoss: '-1,450 km³ ice lost since 2000',
    mode: 'glaciers',
  },
  {
    id: 'thwaites',
    name: 'Thwaites "Doomsday" Glacier',
    region: 'Amundsen Sea, Antarctica',
    lat: -75.5,
    lng: -106.75,
    severity: 'critical',
    metric: '65cm potential sea rise alone',
    trend: 'Grounding line retreat of 14km observed',
    details: 'Vulnerable to Marine Ice Sheet Instability (MISI) as warm deep circumpolar water enters beneath.',
    historicalLoss: 'Doubled ice discharge rate since 1990',
    mode: 'glaciers',
  },
  {
    id: 'himalayas',
    name: 'Khumbu & Third Pole Glaciers',
    region: 'Himalayas / Tibetan Plateau',
    lat: 27.98,
    lng: 86.92,
    severity: 'severe',
    metric: 'Water tower for 1.9B humans',
    trend: 'Retreating 20-30m annually',
    details: 'Supplies Indus, Ganges, Brahmaputra, Yangtze, and Yellow Rivers. Accelerating glacial lake outburst flood risk.',
    historicalLoss: '-29% ice volume since 1970',
    mode: 'glaciers',
  },
  {
    id: 'alps',
    name: 'Aletsch Glacier',
    region: 'Swiss Alps',
    lat: 46.5,
    lng: 8.03,
    severity: 'severe',
    metric: 'Losing 50m length/yr',
    trend: 'Projected 90% loss by 2100 under +2°C',
    details: 'Largest glacier in the Alps. Swiss glaciers lost 10% of their remaining volume between 2022-2023 alone.',
    historicalLoss: '-1.2km retreat since 1980',
    mode: 'glaciers',
  },
  {
    id: 'amazon-arc',
    name: 'Arc of Deforestation',
    region: 'Pará & Mato Grosso, Brazil',
    lat: -9.5,
    lng: -55.0,
    severity: 'critical',
    metric: '1.2M ha lost/year',
    trend: 'Pasture & soybean expansion frontier',
    details: 'Severe fragmentation breaking moisture recycling "flying rivers" that hydrate South America.',
    historicalLoss: '20% of Brazilian Amazon converted',
    mode: 'deforestation',
  },
  {
    id: 'borneo',
    name: 'Heart of Borneo Rainforests',
    region: 'Kalimantan & Sarawak',
    lat: 0.5,
    lng: 114.5,
    severity: 'critical',
    metric: 'Oil palm & pulpwood crisis',
    trend: 'Peatland draining causing massive fires',
    details: 'Tropical peatlands store up to 28x more carbon than mineral soils; drainage triggers catastrophic emissions.',
    historicalLoss: '50% forest cover lost in 40 years',
    mode: 'deforestation',
  },
  {
    id: 'congo',
    name: 'Congo Basin Peatlands & Canopy',
    region: 'DR Congo / Republic of Congo',
    lat: -0.22,
    lng: 18.25,
    severity: 'severe',
    metric: 'Last giant net carbon sink',
    trend: 'Smallholder slash-and-burn & logging',
    details: 'Cuvette Centrale peatland stores 30 Gt carbon (3 years of global emissions). Threat of industrial oil leasing.',
    historicalLoss: '500,000 ha/yr loss accelerating',
    mode: 'deforestation',
  },
  {
    id: 'pearl-river',
    name: 'Pearl River Megacity Smog Corridor',
    region: 'Guangdong, China',
    lat: 23.12,
    lng: 113.26,
    severity: 'critical',
    metric: '620 Mt CO₂eq cluster',
    trend: 'High industrial & coal density',
    details: 'World largest continuous urban agglomeration with intense port, refinery, and electronics manufacturing footprint.',
    historicalLoss: 'Carbon density > 50,000 t/km²',
    mode: 'carbon',
  },
  {
    id: 'permian',
    name: 'Permian Basin Methane Super-Emitters',
    region: 'Texas / New Mexico, USA',
    lat: 31.85,
    lng: -102.36,
    severity: 'critical',
    metric: '2.7 Mt CH₄ vented/flared',
    trend: 'Satellite detected methane plumes',
    details: 'Hydraulic fracturing and shale oil extraction leaks massive invisible plumes of potent methane.',
    historicalLoss: 'Methane leakage rate 3.7%',
    mode: 'carbon',
  },
  {
    id: 'ruhr-rhine',
    name: 'Rhine-Ruhr Industrial Axis',
    region: 'Germany / Netherlands',
    lat: 51.45,
    lng: 7.01,
    severity: 'moderate',
    metric: 'Lignite coal phase-out zone',
    trend: 'Transitioning to green hydrogen & offshore wind',
    details: 'Historical coal heartland undergoing rapid renewable transformation with Garzweiler mine retirement.',
    historicalLoss: 'Emissions down 42% since 1990',
    mode: 'carbon',
  },
]

// 10. POLLUTION HUB DATA
export const plasticPollutionData = {
  oceanTonsPerYear: 11.2,
  totalFloatingPieces: '5.25 Trillion',
  greatPacificGarbagePatchSqKm: 1600000,
  topRivers: [
    { river: 'Pasig (Philippines)', metricTons: 63000 },
    { river: 'Klang (Malaysia)', metricTons: 15000 },
    { river: 'Ulhas (India)', metricTons: 13000 },
    { river: 'Ganges (India/Bangladesh)', metricTons: 115000 },
    { river: 'Yangtze (China)', metricTons: 330000 },
  ],
  recyclingBreakdown: [
    { category: 'Mismanaged & Dumped', pct: 46, color: '#FF6B5A' },
    { category: 'Landfilled', pct: 32, color: '#F59E0B' },
    { category: 'Incinerated (Air Pollution)', pct: 13, color: '#FF2E88' },
    { category: 'Recycled', pct: 9, color: '#22C55E' },
  ],
  polymerLifespans: [
    { polymer: 'PET (Polyethylene Terephthalate - Bottles)', lifespanYears: 450, degradationMechanism: 'Photo-oxidative chain scission' },
    { polymer: 'HDPE (High-Density Polyethylene - Jugs)', lifespanYears: 500, degradationMechanism: 'UV embrittlement & surface cracking' },
    { polymer: 'PP (Polypropylene - Bottle Caps, Straws)', lifespanYears: 300, degradationMechanism: 'Thermal & oxidative degradation' },
    { polymer: 'PS (Polystyrene - Styrofoam)', lifespanYears: 500, degradationMechanism: 'Virtually non-biodegradable; fragments into micro-beads' },
    { polymer: 'Nylon / Polyamide (Fishing Gear/Nets)', lifespanYears: 600, degradationMechanism: 'Hydrolysis and mechanical shearing in surf zones' },
  ],
}

export const radiationData = {
  safecastSensorsLive: 4210,
  exclusionZones: [
    {
      name: 'Chernobyl Exclusion Zone',
      country: 'Ukraine',
      lat: 51.27,
      lng: 30.22,
      dose_uSv_h: 4.85,
      normalBaseline_uSv_h: 0.12,
      keyIsotope: 'Caesium-137 (30.17y half-life) & Strontium-90 (28.8y)',
      status: 'Active restricted zone (2,600 km²)',
      physicsNotes: 'Beta and gamma emitter. Caesium-137 decays via beta-minus into metastable Barium-137m, emitting 662 keV gamma photon.',
    },
    {
      name: 'Fukushima Daiichi Coastal Zone',
      country: 'Japan',
      lat: 37.42,
      lng: 141.03,
      dose_uSv_h: 1.45,
      normalBaseline_uSv_h: 0.08,
      keyIsotope: 'Tritium (H-3, 12.32y) & Strontium-90',
      status: 'Ongoing decommissioning & ALPS discharge monitoring',
      physicsNotes: 'Advanced Liquid Processing System (ALPS) extracts 62 radionuclides via multi-stage ion-exchange resins except hydrogen isotope Tritium.',
    },
    {
      name: 'Bikini Atoll Nuclear Testing Crater',
      country: 'Marshall Islands',
      lat: 11.58,
      lng: 165.38,
      dose_uSv_h: 2.1,
      normalBaseline_uSv_h: 0.1,
      keyIsotope: 'Plutonium-239 (24,110y) & Americium-241',
      status: 'Uninhabited coral atoll crater',
      physicsNotes: 'Castle Bravo 15 Megaton thermonuclear detonation crater. Alpha radiation hazard persists in coconut crabs and root crops.',
    },
  ],
}

export const thermalPlantsData = {
  globalCoalPlantsOperating: 2420,
  totalCapacityGW: 2130,
  annualSo2EmissionsMt: 32.4,
  annualNoxEmissionsMt: 19.8,
  annualCo2Gigatons: 15.8,
  topClusters: [
    { country: 'China (Inner Mongolia & Shanxi)', capacityGW: 1110, status: 'Ultra-supercritical retrofit with wet limestone FGD' },
    { country: 'India (Singrauli / Korba)', capacityGW: 236, status: 'FGD scrubber retrofits in progress to cut SO₂' },
    { country: 'United States (Midwest Basin)', capacityGW: 188, status: 'Rapid retirement underway (-45% capacity by 2030)' },
    { country: 'Europe (Poland / Germany Lignite)', capacityGW: 82, status: 'Legally binding coal exit by 2030-2038' },
  ],
}

// 11. EXPANDED FRONTIER ENERGY & PHYSICS SOLUTIONS
export interface SolutionTech {
  id: string
  title: string
  category: 'Nuclear' | 'Renewables' | 'Solid-State Harvesting' | 'Storage & Grid'
  physicsPrinciple: string
  formula: string
  formulaExplanation: string
  efficiency: string
  levelizedCost: string
  trl: string // Technology Readiness Level (1-9)
  installedCapacity: string
  co2Offset: string
  icon: string
  deepDive: {
    howItWorks: string
    keyEngineeringChallenge: string
    climateImpact: string
    simulationParams: Record<string, any>
  }
}

export const frontierEnergySolutions: SolutionTech[] = [
  {
    id: 'nuclear-fission',
    title: 'Advanced Nuclear Fission & SMRs',
    category: 'Nuclear',
    physicsPrinciple: 'Neutron-Induced Nuclear Fission of Heavy Actinide Nuclei',
    formula: '²³⁵₉₂U + ¹₀n → ¹⁴¹₅₆Ba + ⁹²₃₆Kr + 3 ¹₀n + 200 MeV (3.2 × 10⁻¹¹ J)',
    formulaExplanation: 'A thermal neutron induces fission of Uranium-235, releasing ~200 MeV per event and 2.43 prompt neutrons driving a self-sustaining controlled chain reaction ($k_{eff} = 1.0$).',
    efficiency: '33% - 45% Thermal-to-Electric (Gen IV MSR)',
    levelizedCost: '$65 - $85 / MWh',
    trl: 'TRL 9 (Commercial Gen III+) / TRL 7 (SMRs)',
    installedCapacity: '413 GWe across 438 reactors',
    co2Offset: 'Prevents ~2.0 Gt CO₂/year vs coal',
    icon: 'Atom',
    deepDive: {
      howItWorks:
        'Uranium dioxide fuel pellets generate intense decay heat inside zirconium-clad fuel pins. Pressurized water or liquid molten fluoride salts transfer thermal energy to steam turbines. Small Modular Reactors (SMRs) like NuScale and Natrium employ passive gravity-fed decay heat removal without external electrical power.',
      keyEngineeringChallenge:
        'High capital expenditure ($6k-9k/kWe), long construction lead times, deep geological repository licensing (e.g. Onkalo, Finland), and proliferation-resistant enrichment safeguards.',
      climateImpact:
        'Highest energy density of any civilian power source: 1 kg of Uranium produces 24,000,000 kWh of heat—equivalent to burning 3,000 tons of coal. Lowest lifecycle greenhouse emissions (12 g CO₂/kWh).',
      simulationParams: {
        neutronFlux: '1.2e14 n/cm²·s',
        fuelEnrichmentPct: 4.5,
        controlRodInsertion: 50, // 0 = full power, 100 = scrammed
        thermalOutputMWth: 300,
      },
    },
  },
  {
    id: 'nuclear-fusion',
    title: 'Magnetic Confinement Fusion (Tokamaks & Stellarators)',
    category: 'Nuclear',
    physicsPrinciple: 'Thermonuclear Fusion via Lawson Criterion Plasma Confinement',
    formula: '²₁H (Deuterium) + ³₁H (Tritium) → ⁴₂He (3.5 MeV) + ¹₀n (14.1 MeV) + 17.6 MeV',
    formulaExplanation: 'At 150 million °C (10x hotter than the Sun\'s core), positive nuclei overcome Coulomb electrostatic repulsion, fusing through quantum tunneling and releasing 17.6 MeV per reaction.',
    efficiency: 'Q > 10 Net Thermal Gain Target (ITER) / Electricity Generation by 2035',
    levelizedCost: '$45 - $60 / MWh (Projected at scale)',
    trl: 'TRL 6 (System demonstration: NIF net energy gain & ITER)',
    installedCapacity: 'Experimental pilots (ITER, SPARC, STEP)',
    co2Offset: 'Infinite zero-carbon baseload; 1 glass of seawater fuels 1 family for 1 year',
    icon: 'Flame',
    deepDive: {
      howItWorks:
        'Deuterium and Tritium gases are injected into a toroidal vacuum chamber and ionized by RF antennas into plasma. Massive superconducting magnetic coils (e.g., Rare-Earth Barium Copper Oxide - REBCO magnets generating 20 Tesla) compress and suspend the charged plasma away from physical walls. High-energy 14.1 MeV neutrons penetrate the vacuum vessel and hit lithium blankets, transferring heat to coolants while breeding new tritium fuel.',
      keyEngineeringChallenge:
        'Maintaining stable plasma against magnetohydrodynamic (MHD) instabilities (edge localized modes - ELMs), heat exhaust in the divertor region (>20 MW/m²), and neutron damage to plasma-facing tungsten tiles.',
      climateImpact:
        'Zero risk of meltdown (loss of magnetic field instantly quenches plasma in milliseconds), zero greenhouse gases, no long-lived transuranic nuclear waste (structural activation decays within ~100 years). Deuterium is virtually limitless in seawater.',
      simulationParams: {
        plasmaTempMillionC: 150,
        magneticFieldTesla: 18.5,
        confinementTimeSec: 4.2,
        gainFactorQ: 11.2,
      },
    },
  },
  {
    id: 'piezoelectric',
    title: 'Piezoelectric Kinetic & Vibration Harvesters',
    category: 'Solid-State Harvesting',
    physicsPrinciple: 'Direct Piezoelectric Effect in Non-Centrosymmetric Crystal Lattices',
    formula: 'Dᵢ = dᵢⱼₖ σⱼₖ + εᵀᵢₖ Eₖ  |  V = (g₃₃ × F × t) / A',
    formulaExplanation: 'Mechanical stress (σ) displaces non-centrosymmetric cations (e.g., Ti⁴⁺/Zr⁴⁺ in PZT or Nb⁵⁺ in KNN), inducing an electric dipole polarization (D) that yields open-circuit voltage proportional to applied force.',
    efficiency: '65% - 85% Mechanical-to-Electrical conversion',
    levelizedCost: '$0.05 / kWh harvested from ambient waste motion',
    trl: 'TRL 8 (Commercial in smart infrastructure & wireless IoT)',
    installedCapacity: 'Harvesting millions of road & industrial vibration nodes',
    co2Offset: 'Enables 100% self-powered, battery-free sensors & highway power generation',
    icon: 'Zap',
    deepDive: {
      howItWorks:
        'Piezoelectric ceramics (such as Lead Zirconate Titanate PZT or biocompatible KNN potassium sodium niobate) produce instantaneous electric potentials when compressed or bent. Deployed embedded beneath highway asphalt, railway ties, and airport runways, every passing 40-ton vehicle compresses the crystal stacks, generating 200–500 kWh per kilometer of busy expressway to power roadside lighting, traffic sensors, and EV wireless chargers.',
      keyEngineeringChallenge:
        'Mechanical fatigue over billions of stress cycles, impedance matching between high-impedance piezoelectric elements and low-impedance battery charging circuits, and lead-free regulatory compliance (RoHS).',
      climateImpact:
        'Harvests gigawatt-hours of currently wasted mechanical kinetic energy from transportation networks and industrial machinery vibrations without burning any fuel.',
      simulationParams: {
        appliedStressMPa: 15.0,
        couplingCoefficientK33: 0.72,
        vibrationFrequencyHz: 60,
        voltageGeneratedVolts: 48.5,
      },
    },
  },
  {
    id: 'thermoelectric-peltier',
    title: 'Thermoelectric Energy Harvesting (Seebeck & Peltier Effects)',
    category: 'Solid-State Harvesting',
    physicsPrinciple: 'Seebeck Voltage Generation & Peltier Thermoelectric Heat Pumping',
    formula: 'ΔV = -S · ΔT  |  Q = Π · I = S · T · I  |  ZT = (S² σ / κ) · T',
    formulaExplanation: 'A thermal gradient (ΔT) causes charge carriers (electrons in n-type, holes in p-type semiconductors) to diffuse toward the cold side, generating a Seebeck electric potential. The figure of merit ZT determines thermodynamic efficiency.',
    efficiency: '8% - 15% Carnot-limited direct solid-state conversion',
    levelizedCost: '$35 / MWh (Utilizing free industrial waste heat)',
    trl: 'TRL 9 (Space RTGs: Voyager/Curiosity) / TRL 8 (Industrial)',
    installedCapacity: 'Deployed on industrial smokestacks, exhaust systems, and space probes',
    co2Offset: 'Recovers up to 25% of all wasted industrial combustion heat globally',
    icon: 'Flame',
    deepDive: {
      howItWorks:
        'Thermoelectric generators (TEGs) consist of heavily doped bismuth telluride (Bi₂Te₃) or silicon-germanium (SiGe) semiconductor couples wired electrically in series and thermally in parallel. When attached to vehicle exhaust pipes, steel mill furnaces, or geothermal vents, the heat difference between the hot flue gas and ambient air drives continuous electric current with zero moving parts, zero lubricants, and 30+ year maintenance-free lifespans.',
      keyEngineeringChallenge:
        'Maximizing electrical conductivity (σ) while minimizing thermal conductivity (κ) to keep ZT > 2.0. Addressing thermal expansion stress cracking across large temperature deltas (>400°C).',
      climateImpact:
        'Approximately 65% of all fossil energy combusted globally is lost directly as unrecovered waste heat. Deploying thermoelectric generators across heavy industry recovers gigawatts of clean power from already-spent thermal gradients.',
      simulationParams: {
        hotJunctionTempC: 350,
        coldJunctionTempC: 30,
        seebeckCoefficientuVK: 215,
        figureOfMeritZT: 1.45,
      },
    },
  },
  {
    id: 'perovskite-solar',
    title: 'Perovskite-Silicon Tandem Solar Photovoltaics',
    category: 'Renewables',
    physicsPrinciple: 'Dual Bandgap Optical Photon Splitting Exceeding Shockley-Queisser Limit',
    formula: 'E_g1 = 1.68 eV (Perovskite Top) + E_g2 = 1.12 eV (Silicon Bottom) → η > 34%',
    formulaExplanation: 'Wide-bandgap metal-halide perovskite top layer absorbs high-energy blue photons, while narrow-bandgap silicon bottom absorbs infrared, crushing the 29.4% single-junction theoretical ceiling.',
    efficiency: '33.9% Certified Laboratory World Record / 28% Commercial Module',
    levelizedCost: '$24 - $29 / MWh (Cheapest power in human history)',
    trl: 'TRL 8 (Commercial roll-to-roll manufacturing launching)',
    installedCapacity: 'Over 1,600 GW global PV installed base',
    co2Offset: 'Cuts 1.4 Gt CO₂ annually worldwide',
    icon: 'Sun',
    deepDive: {
      howItWorks:
        'Solution-processable organometal halide perovskites ($ABX_3$ crystal structure, e.g., methylammonium lead iodide) possess exceptional electron-hole diffusion lengths (>1 µm) and tunable bandgaps. Applying a sub-micron perovskite film onto standard silicon wafers increases module power by 25% with minimal incremental manufacturing cost.',
      keyEngineeringChallenge:
        'Moisture, thermal, and UV stability over 25-year operational lifespans. Advanced atomic layer deposition (ALD) encapsulation barriers (e.g. Al₂O₃/SnO₂) are overcoming degradation.',
      climateImpact:
        'Reduces land footprint required for solar energy by 35% while driving levelized power costs below 2 cents per kilowatt-hour in sunny regions.',
      simulationParams: {
        irradianceWm2: 1000,
        cellTempC: 25,
        bandgapEgTopEV: 1.68,
        conversionEfficiencyPct: 33.9,
      },
    },
  },
  {
    id: 'floating-offshore-wind',
    title: 'Deepwater Floating Offshore Wind Turbines',
    category: 'Renewables',
    physicsPrinciple: 'Aerodynamic Lift on High-Tip-Speed Ratio Aerofoils & Betz Limit',
    formula: 'P = ½ · ρ · A · v³ · C_p  |  Betz Limit: C_p,max = 16/27 ≈ 59.3%',
    formulaExplanation: 'Power output scales with the cube of wind velocity (v³). Offshore oceanic winds average 10–12 m/s, yielding up to 3x higher energy yield than onshore turbine locations.',
    efficiency: '55% - 63% Oceanic Capacity Factor (Nearly baseload)',
    levelizedCost: '$44 - $55 / MWh',
    trl: 'TRL 8 (Commercial arrays operating: Hywind Scotland, Kincardine)',
    installedCapacity: '75 GW offshore (Projected 380 GW by 2030)',
    co2Offset: 'Prevents 180 Mt CO₂/year',
    icon: 'Wind',
    deepDive: {
      howItWorks:
        'Gigantic 15–20 Megawatt wind turbines (rotor diameters exceeding 240 meters, taller than the Eiffel Tower) mounted on semi-submersible or tension-leg floating platforms anchored by synthetic mooring lines in water depths from 60m to 1,000m. Exploits steady, unobstructed ocean winds.',
      keyEngineeringChallenge:
        'Dynamic wave-induced fatigue loading on pitch bearings, underwater dynamic high-voltage subsea power transmission cables, and specialized installation vessel availability.',
      climateImpact:
        'Unlocks 80% of global offshore wind potential located in waters deeper than 60 meters where bottom-fixed foundations are impossible.',
      simulationParams: {
        windSpeedMs: 11.5,
        rotorDiameterMeters: 236,
        airDensityKgM3: 1.225,
        powerOutputMWe: 16.2,
      },
    },
  },
]
