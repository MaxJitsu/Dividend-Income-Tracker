import { useState, useMemo, useCallback, useEffect, useRef, Component } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid, AreaChart, Area, LineChart, Line } from "recharts";

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN SYSTEM — Matches ETF Portfolio Optimiser
// ═══════════════════════════════════════════════════════════════════════════════

const lightTheme = {
  colors: {
    navy: "#1B2A4A", slate: "#34495E", steel: "#536E7F",
    accent: "#2980B9", accentLt: "#AED6F1", accentDk: "#1F618D",
    green: "#27AE60", greenLt: "#D5F4E6",
    red: "#E74C3C", redLt: "#FADBD8",
    amber: "#F39C12", amberLt: "#FCF3CF",
    purple: "#8E44AD", purpleLt: "#EBDEF0",
    teal: "#1ABC9C", tealLt: "#D1F2EB",
    bg: "#F0F2F5", card: "#FFFFFF",
    text: "#2C3E50", muted: "#7F8C8D", border: "#E0E4E8",
    white: "#FFFFFF", black: "#000000",
  },
  pieColors: ["#2980B9", "#27AE60", "#E74C3C", "#F39C12", "#8E44AD", "#1ABC9C", "#34495E", "#E67E22"],
  radii: { sm: 6, md: 10, lg: 12, xl: 16 },
  shadows: { sm: "0 1px 3px rgba(0,0,0,0.08)", md: "0 4px 8px rgba(0,0,0,0.12)", lg: "0 8px 16px rgba(0,0,0,0.15)" },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 32 },
  font: { family: "system-ui, -apple-system, sans-serif" },
  fontSize: { xs: 9, sm: 10, md: 11, base: 13, lg: 14, xl: 16, xxl: 20, hero: 28, title: 15 },
  transition: { fast: "150ms ease-out", medium: "300ms ease-out", slow: "500ms ease-out" },
};

const darkTheme = {
  colors: {
    navy: "#0F3460", slate: "#16213E", steel: "#1A3A52",
    accent: "#3498DB", accentLt: "#5DADE2", accentDk: "#2874A6",
    green: "#2ECC71", greenLt: "#16A34A",
    red: "#E74C3C", redLt: "#C0392B",
    amber: "#F39C12", amberLt: "#D68910",
    purple: "#9B59B6", purpleLt: "#7D3C98",
    teal: "#1ABC9C", tealLt: "#117864",
    bg: "#1A1A2E", card: "#16213E",
    text: "#E0E0E0", muted: "#8899A6", border: "#2A3A4E",
    white: "#FFFFFF", black: "#000000",
  },
  pieColors: ["#3498DB", "#2ECC71", "#E74C3C", "#F39C12", "#9B59B6", "#1ABC9C", "#95A5A6", "#E67E22"],
  radii: { sm: 6, md: 10, lg: 12, xl: 16 },
  shadows: { sm: "0 1px 3px rgba(0,0,0,0.3)", md: "0 4px 8px rgba(0,0,0,0.4)", lg: "0 8px 16px rgba(0,0,0,0.5)" },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 32 },
  font: { family: "system-ui, -apple-system, sans-serif" },
  fontSize: { xs: 9, sm: 10, md: 11, base: 13, lg: 14, xl: 16, xxl: 20, hero: 28, title: 15 },
  transition: { fast: "150ms ease-out", medium: "300ms ease-out", slow: "500ms ease-out" },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ETF DATABASE — Shared with Portfolio Optimiser
// ═══════════════════════════════════════════════════════════════════════════════

const DB=[{t:"VHYL",n:"Vanguard FTSE All-World High Div Yield",c:"Equity Income",dy:.034,dg:.06,p:"Quarterly",oc:.0029,ls:"UK"},{t:"JEPG",n:"JPMorgan Global Equity Prem Inc UCITS",c:"Covered Call",dy:.072,dg:0,p:"Monthly",oc:.0035,ls:"UK"},{t:"JREG",n:"JPMorgan Global Eq Prem Inc Active",c:"Covered Call",dy:.068,dg:.02,p:"Monthly",oc:.0035,ls:"UK"},{t:"GLDV",n:"SPDR S&P Global Dividend Aristocrats",c:"Equity Income",dy:.042,dg:.04,p:"Quarterly",oc:.0045,ls:"UK"},{t:"ISPA",n:"iShares UK Property ETF",c:"REIT",dy:.038,dg:.02,p:"Quarterly",oc:.004,ls:"UK"},{t:"IUKD",n:"iShares UK Dividend ETF",c:"Equity Income",dy:.058,dg:.03,p:"Quarterly",oc:.004,ls:"UK"},{t:"UKDV",n:"SPDR S&P UK Dividend Aristocrats",c:"Equity Income",dy:.048,dg:.05,p:"Quarterly",oc:.003,ls:"UK"},{t:"HDLG",n:"iShares MSCI World Quality Div ESG",c:"Equity Income",dy:.032,dg:.07,p:"Quarterly",oc:.0038,ls:"UK"},{t:"EMDV",n:"ProShares MSCI EM Div Growers",c:"Equity Income",dy:.025,dg:.04,p:"Quarterly",oc:.006,ls:"UK"},{t:"EMHG",n:"iShares EM High Yield Corp Bond",c:"High Yield Bond",dy:.065,dg:0,p:"Monthly",oc:.005,ls:"UK"},{t:"SHYU",n:"iShares $ Short Duration HY Corp Bond",c:"High Yield Bond",dy:.058,dg:0,p:"Monthly",oc:.0045,ls:"UK"},{t:"IHYU",n:"iShares $ High Yield Corp Bond",c:"High Yield Bond",dy:.055,dg:0,p:"Monthly",oc:.005,ls:"UK"},{t:"HYLD",n:"iShares Global High Yield Corp Bond",c:"High Yield Bond",dy:.060,dg:0,p:"Monthly",oc:.005,ls:"UK"},{t:"SEMB",n:"iShares JPM $ EM Bond ETF",c:"Bond Income",dy:.050,dg:0,p:"Monthly",oc:.0045,ls:"UK"},{t:"IGLT",n:"iShares Core UK Gilts",c:"Bond Income",dy:.035,dg:0,p:"Semi-Annual",oc:.0007,ls:"UK"},{t:"SLXX",n:"iShares Core £ Corp Bond",c:"Bond Income",dy:.045,dg:0,p:"Semi-Annual",oc:.002,ls:"UK"},{t:"VGOV",n:"Vanguard UK Government Bond",c:"Bond Income",dy:.032,dg:0,p:"Quarterly",oc:.0007,ls:"UK"},{t:"AGBP",n:"iShares Core Global Agg Bond GBP Hdg",c:"Bond Income",dy:.028,dg:0,p:"Semi-Annual",oc:.001,ls:"UK"},{t:"CORP",n:"iShares Global Corp Bond",c:"Bond Income",dy:.035,dg:0,p:"Semi-Annual",oc:.002,ls:"UK"},{t:"INRG",n:"iShares Global Clean Energy",c:"Equity Income",dy:.012,dg:0,p:"Semi-Annual",oc:.0065,ls:"UK"},{t:"WLDS",n:"iShares MSCI World Small Cap",c:"Equity Income",dy:.015,dg:.03,p:"Semi-Annual",oc:.0035,ls:"UK"},{t:"IDTL",n:"iShares $ Treasury Bond 20+yr",c:"Bond Income",dy:.040,dg:0,p:"Semi-Annual",oc:.0007,ls:"UK"},{t:"TIPS",n:"iShares $ TIPS UCITS",c:"Bond Income",dy:.025,dg:0,p:"Semi-Annual",oc:.0012,ls:"UK"},{t:"SUAG",n:"iShares $ Corp Bond 0-3yr ESG",c:"Bond Income",dy:.040,dg:0,p:"Quarterly",oc:.002,ls:"UK"},{t:"STHE",n:"iShares Core FTSE 100 Dist",c:"Equity Income",dy:.038,dg:.03,p:"Quarterly",oc:.0007,ls:"UK"},{t:"EQDS",n:"JPM Equity Premium Income UCITS",c:"Covered Call",dy:.065,dg:.01,p:"Monthly",oc:.0035,ls:"UK"},{t:"ISPY",n:"iShares S&P 500 BuyWrite UCITS",c:"Covered Call",dy:.045,dg:0,p:"Quarterly",oc:.002,ls:"UK"},{t:"PRFD",n:"iShares $ Preferred & Income Secs",c:"Preferred Stock",dy:.055,dg:0,p:"Monthly",oc:.005,ls:"UK"},{t:"GLRE",n:"VanEck Global Real Estate UCITS",c:"REIT",dy:.035,dg:.02,p:"Quarterly",oc:.0025,ls:"UK"},{t:"REIT",n:"iShares Dev Mkts Property Yield",c:"REIT",dy:.033,dg:.02,p:"Quarterly",oc:.0059,ls:"UK"},{t:"GBDV",n:"SPDR S&P Global Div Aristocrats ESG",c:"Equity Income",dy:.040,dg:.04,p:"Quarterly",oc:.0045,ls:"UK"},{t:"JPEA",n:"JPM Europe Equity Prem Inc UCITS",c:"Covered Call",dy:.060,dg:.01,p:"Monthly",oc:.0035,ls:"UK"},{t:"FLOA",n:"iShares $ Floating Rate Bond UCITS",c:"Bond Income",dy:.058,dg:0,p:"Quarterly",oc:.001,ls:"UK"},{t:"GIST",n:"iShares Global Infrastructure UCITS",c:"Equity Income",dy:.030,dg:.03,p:"Quarterly",oc:.0065,ls:"UK"},{t:"SDHY",n:"iShares $ Short Duration HY ESG",c:"High Yield Bond",dy:.056,dg:0,p:"Monthly",oc:.003,ls:"UK"},{t:"XGSD",n:"Xtrackers Global Agg Bond Swap",c:"Bond Income",dy:.025,dg:0,p:"Annual",oc:.001,ls:"UK"},{t:"ERNX",n:"iShares MSCI Europe Quality Div ESG",c:"Equity Income",dy:.035,dg:.05,p:"Quarterly",oc:.0028,ls:"UK"},{t:"EMIM",n:"iShares Core MSCI EM IMI",c:"Equity Income",dy:.022,dg:.02,p:"Quarterly",oc:.0018,ls:"UK"},{t:"WPEA",n:"iShares World Equity High Income",c:"Covered Call",dy:.070,dg:0,p:"Monthly",oc:.0035,ls:"UK"},{t:"EMBD",n:"iShares JPM ESG $ EM Bond",c:"Bond Income",dy:.048,dg:0,p:"Monthly",oc:.0045,ls:"UK"},{t:"XDWL",n:"Xtrackers MSCI World High Div Yield",c:"Equity Income",dy:.036,dg:.05,p:"Quarterly",oc:.0029,ls:"UK"},{t:"HYLE",n:"iShares EUR High Yield Corp Bond",c:"High Yield Bond",dy:.048,dg:0,p:"Monthly",oc:.005,ls:"UK"},{t:"UBUM",n:"UBS MSCI UK IMI Socially Responsible",c:"Equity Income",dy:.030,dg:.03,p:"Quarterly",oc:.0028,ls:"UK"},{t:"JEPI",n:"JPMorgan Equity Premium Income",c:"Covered Call",dy:.072,dg:0,p:"Monthly",oc:.0035,ls:"US"},{t:"JEPQ",n:"JPMorgan Nasdaq Equity Prem Inc",c:"Covered Call",dy:.095,dg:.02,p:"Monthly",oc:.0035,ls:"US"},{t:"SCHD",n:"Schwab US Dividend Equity",c:"Equity Income",dy:.035,dg:.12,p:"Quarterly",oc:.0006,ls:"US"},{t:"VYM",n:"Vanguard High Dividend Yield",c:"Equity Income",dy:.028,dg:.08,p:"Quarterly",oc:.0006,ls:"US"},{t:"HDV",n:"iShares Core High Dividend",c:"Equity Income",dy:.035,dg:.06,p:"Quarterly",oc:.0008,ls:"US"},{t:"PFF",n:"iShares Preferred & Income Secs",c:"Preferred Stock",dy:.060,dg:0,p:"Monthly",oc:.0046,ls:"US"},{t:"PFFD",n:"Global X US Preferred ETF",c:"Preferred Stock",dy:.062,dg:0,p:"Monthly",oc:.0023,ls:"US"},{t:"XYLD",n:"Global X S&P 500 Covered Call",c:"Covered Call",dy:.095,dg:0,p:"Monthly",oc:.006,ls:"US"},{t:"QYLD",n:"Global X NASDAQ 100 Covered Call",c:"Covered Call",dy:.11,dg:0,p:"Monthly",oc:.006,ls:"US"},{t:"DIVO",n:"Amplify CWP Enhanced Div Income",c:"Covered Call",dy:.048,dg:.03,p:"Monthly",oc:.0055,ls:"US"},{t:"SPYI",n:"NEOS S&P 500 High Income",c:"Covered Call",dy:.105,dg:0,p:"Monthly",oc:.0068,ls:"US"},{t:"O",n:"Realty Income Corporation",c:"REIT",dy:.055,dg:.04,p:"Monthly",oc:0,ls:"US"},{t:"MAIN",n:"Main Street Capital Corp",c:"Alternatives",dy:.058,dg:.06,p:"Monthly",oc:0,ls:"US"},{t:"ARCC",n:"Ares Capital Corporation",c:"Alternatives",dy:.090,dg:.03,p:"Quarterly",oc:0,ls:"US"},{t:"VNQ",n:"Vanguard Real Estate ETF",c:"REIT",dy:.038,dg:.03,p:"Quarterly",oc:.0013,ls:"US"},{t:"HYG",n:"iShares iBoxx $ HY Corp Bond",c:"High Yield Bond",dy:.055,dg:0,p:"Monthly",oc:.0049,ls:"US"},{t:"TLT",n:"iShares 20+ Year Treasury Bond",c:"Bond Income",dy:.040,dg:0,p:"Monthly",oc:.0015,ls:"US"},{t:"AGG",n:"iShares Core US Aggregate Bond",c:"Bond Income",dy:.035,dg:0,p:"Monthly",oc:.0003,ls:"US"},{t:"EMB",n:"iShares JPM USD EM Bond",c:"Bond Income",dy:.050,dg:0,p:"Monthly",oc:.0039,ls:"US"},{t:"BNDX",n:"Vanguard Total Intl Bond",c:"Bond Income",dy:.030,dg:0,p:"Monthly",oc:.0007,ls:"US"},{t:"BND",n:"Vanguard Total Bond Market",c:"Bond Income",dy:.035,dg:0,p:"Monthly",oc:.0003,ls:"US"},{t:"VIG",n:"Vanguard Dividend Appreciation",c:"Equity Income",dy:.018,dg:.10,p:"Quarterly",oc:.0006,ls:"US"},{t:"DVY",n:"iShares Select Dividend",c:"Equity Income",dy:.038,dg:.05,p:"Quarterly",oc:.0038,ls:"US"},{t:"DGRO",n:"iShares Core Dividend Growth",c:"Equity Income",dy:.022,dg:.10,p:"Quarterly",oc:.0008,ls:"US"},{t:"NOBL",n:"ProShares S&P 500 Div Aristocrats",c:"Equity Income",dy:.020,dg:.08,p:"Quarterly",oc:.0035,ls:"US"},{t:"SPHD",n:"Invesco S&P 500 High Div Low Vol",c:"Equity Income",dy:.040,dg:.03,p:"Monthly",oc:.003,ls:"US"},{t:"VOO",n:"Vanguard S&P 500 ETF",c:"Equity Income",dy:.011,dg:.06,p:"Quarterly",oc:.0003,ls:"US"},{t:"DGRW",n:"WisdomTree US Quality Div Growth",c:"Equity Income",dy:.015,dg:.09,p:"Monthly",oc:.0028,ls:"US"}];

// ═══════════════════════════════════════════════════════════════════════════════
// DATA FEED ARCHITECTURE — Ready for live API integration
// ═══════════════════════════════════════════════════════════════════════════════

const DATA_FEED_CONFIG = {
  enabled: false,
  apiEndpoint: null,
  refreshInterval: 300000, // 5 minutes
  lastSync: null,
  provider: "static", // "static" | "api" | "websocket"
};

// Data feed adapter interface — swap this for live data when ready
const DataFeedAdapter = {
  // Returns current dividend data for a ticker
  async getDividendData(ticker) {
    const etf = DB.find(e => e.t === ticker);
    if (!etf) return null;
    return {
      ticker: etf.t,
      name: etf.n,
      yield: etf.dy,
      dividendGrowth: etf.dg,
      frequency: etf.p,
      category: etf.c,
      ocf: etf.oc,
      listing: etf.ls,
      source: DATA_FEED_CONFIG.provider,
      timestamp: new Date().toISOString(),
    };
  },

  // Returns dividend history for a ticker (simulated for now)
  async getDividendHistory(ticker, years = 5) {
    const etf = DB.find(e => e.t === ticker);
    if (!etf) return [];
    const history = [];
    const now = new Date();
    const periodsPerYear = etf.p === "Monthly" ? 12 : etf.p === "Quarterly" ? 4 : etf.p === "Semi-Annual" ? 2 : 1;
    const totalPeriods = years * periodsPerYear;
    let baseAmount = etf.dy / periodsPerYear;

    for (let i = totalPeriods - 1; i >= 0; i--) {
      const dt = new Date(now);
      dt.setMonth(dt.getMonth() - Math.round(i * (12 / periodsPerYear)));
      const growthFactor = 1 + (etf.dg * (totalPeriods - i) / totalPeriods);
      const variance = 0.95 + Math.random() * 0.10;
      history.push({
        date: dt.toISOString().slice(0, 10),
        amount: baseAmount * growthFactor * variance,
        type: "regular",
      });
    }
    return history;
  },

  // Returns ex-dividend dates (simulated)
  async getExDividendDates(ticker) {
    const etf = DB.find(e => e.t === ticker);
    if (!etf) return [];
    const dates = [];
    const now = new Date();
    const year = now.getFullYear();
    const months = etf.p === "Monthly" ? [0,1,2,3,4,5,6,7,8,9,10,11] :
                   etf.p === "Quarterly" ? [2,5,8,11] :
                   etf.p === "Semi-Annual" ? [5,11] :
                   etf.p === "Annual" ? [11] : [];

    for (const m of months) {
      const seed = (ticker.charCodeAt(0) + ticker.charCodeAt(ticker.length - 1)) % 10;
      const exDay = Math.min(28, Math.max(5, seed + 8));
      const payDay = Math.min(28, exDay + 15 + (seed % 10));
      dates.push({
        exDate: new Date(year, m, exDay).toISOString().slice(0, 10),
        payDate: new Date(year, m, payDay).toISOString().slice(0, 10),
        recordDate: new Date(year, m, exDay + 2).toISOString().slice(0, 10),
      });
    }
    return dates;
  },

  // Batch fetch for all holdings
  async refreshAll(holdings) {
    const results = {};
    for (const h of holdings) {
      results[h.ticker] = await this.getDividendData(h.ticker);
    }
    DATA_FEED_CONFIG.lastSync = new Date().toISOString();
    return results;
  },
};

// Portfolio export/import format — shared between apps
const PortfolioExchange = {
  VERSION: "1.0",
  APP_ID: "dividend-tracker",

  exportPortfolio(holdings, metadata = {}) {
    return JSON.stringify({
      version: this.VERSION,
      app: this.APP_ID,
      exported: new Date().toISOString(),
      metadata,
      holdings: holdings.map(h => ({
        ticker: h.ticker,
        shares: h.shares,
        costBasis: h.costBasis,
        dateAdded: h.dateAdded,
      })),
    }, null, 2);
  },

  importPortfolio(jsonStr) {
    try {
      const data = JSON.parse(jsonStr);
      if (!data.holdings || !Array.isArray(data.holdings)) throw new Error("Invalid format");
      return {
        success: true,
        source: data.app || "unknown",
        holdings: data.holdings.map(h => {
          const etf = DB.find(e => e.t === h.ticker);
          const shares = h.shares || (h.alloc && etf ? Math.round(h.alloc / (etf.dy > 0 ? 100 : 50)) : h.weight ? Math.round((h.weight * 100000) / 100) : 0);
          return {
            ticker: h.ticker,
            shares: shares,
            costBasis: h.costBasis || h.alloc || (shares * 100),
            dateAdded: h.dateAdded || new Date().toISOString().slice(0, 10),
          };
        }).filter(h => DB.find(e => e.t === h.ticker)),
      };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getPaymentMonths(freq) {
  if (freq === "Monthly") return [0,1,2,3,4,5,6,7,8,9,10,11];
  if (freq === "Quarterly") return [2,5,8,11];
  if (freq === "Semi-Annual") return [5,11];
  if (freq === "Annual") return [11];
  return [];
}

function getPeriodsPerYear(freq) {
  if (freq === "Monthly") return 12;
  if (freq === "Quarterly") return 4;
  if (freq === "Semi-Annual") return 2;
  if (freq === "Annual") return 1;
  return 0;
}

function generatePayDay(ticker, monthIdx) {
  const seed = (ticker.charCodeAt(0) + ticker.charCodeAt(ticker.length - 1)) % 15;
  return Math.min(28, Math.max(5, seed + 10));
}

function generateExDay(ticker) {
  const seed = (ticker.charCodeAt(0) + ticker.charCodeAt(ticker.length - 1)) % 10;
  return Math.min(28, Math.max(5, seed + 8));
}

function fmtCurrency(amount, currency = "£") {
  if (Math.abs(amount) >= 1000000) return `${currency}${(amount / 1000000).toFixed(2)}m`;
  if (Math.abs(amount) >= 1000) return `${currency}${amount.toLocaleString("en-GB", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  return `${currency}${amount.toFixed(2)}`;
}

function fmtPct(value) {
  return `${(value * 100).toFixed(2)}%`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CORE COMPUTATION
// ═══════════════════════════════════════════════════════════════════════════════

function computeHoldingIncome(holding) {
  const etf = DB.find(e => e.t === holding.ticker);
  if (!etf || etf.p === "None") return { ...holding, annualIncome: 0, monthlyIncome: 0, perPayment: 0, frequency: "None", yieldOnCost: 0 };
  const totalValue = holding.shares * (holding.costBasis / holding.shares || 100);
  const annualIncome = totalValue * etf.dy;
  const periods = getPeriodsPerYear(etf.p);
  const perPayment = periods > 0 ? annualIncome / periods : 0;
  const yieldOnCost = holding.costBasis > 0 ? annualIncome / holding.costBasis : 0;
  return {
    ...holding,
    etfName: etf.n,
    category: etf.c,
    yield: etf.dy,
    dividendGrowth: etf.dg,
    frequency: etf.p,
    annualIncome,
    monthlyIncome: annualIncome / 12,
    perPayment,
    yieldOnCost,
    totalValue,
  };
}

function computeMonthlyProjection(holdings, months = 12) {
  const projection = [];
  const enriched = holdings.map(computeHoldingIncome);
  const now = new Date();

  for (let m = 0; m < months; m++) {
    const dt = new Date(now.getFullYear(), now.getMonth() + m, 1);
    const monthIdx = dt.getMonth();
    const monthLabel = `${MONTHS[monthIdx]} ${dt.getFullYear()}`;
    let total = 0;
    const payments = [];

    for (const h of enriched) {
      const etf = DB.find(e => e.t === h.ticker);
      if (!etf || etf.p === "None") continue;
      const payMonths = getPaymentMonths(etf.p);
      if (payMonths.includes(monthIdx)) {
        const growthMultiplier = 1 + (etf.dg * m / 12);
        const payment = h.perPayment * growthMultiplier;
        total += payment;
        payments.push({ ticker: h.ticker, amount: payment, day: generatePayDay(h.ticker, monthIdx), category: etf.c });
      }
    }

    payments.sort((a, b) => a.day - b.day);
    projection.push({ month: monthLabel, monthIdx, total, payments, cumulative: 0 });
  }

  let cum = 0;
  for (const p of projection) { cum += p.total; p.cumulative = cum; }
  return projection;
}

function computeDividendAlerts(holdings, previousDividends = {}) {
  const alerts = [];
  const enriched = holdings.map(computeHoldingIncome);

  for (const h of enriched) {
    const etf = DB.find(e => e.t === h.ticker);
    if (!etf) continue;

    // Dividend growth alerts
    if (etf.dg > 0.08) {
      alerts.push({ type: "raise", severity: "positive", ticker: h.ticker, name: etf.n, message: `Strong dividend growth: ${(etf.dg * 100).toFixed(1)}% p.a.`, icon: "📈" });
    }
    if (etf.dg === 0) {
      alerts.push({ type: "flat", severity: "warning", ticker: h.ticker, name: etf.n, message: `Flat dividends — no growth expected`, icon: "➡️" });
    }

    // High yield warning
    if (etf.dy > 0.09) {
      alerts.push({ type: "high-yield", severity: "caution", ticker: h.ticker, name: etf.n, message: `Very high yield (${fmtPct(etf.dy)}) — may not be sustainable`, icon: "⚠️" });
    }

    // Cost drag
    if (etf.oc > 0.005) {
      alerts.push({ type: "cost", severity: "info", ticker: h.ticker, name: etf.n, message: `High OCF (${fmtPct(etf.oc)}) eroding income`, icon: "💸" });
    }

    // Concentration check
    const totalValue = enriched.reduce((a, x) => a + (x.totalValue || 0), 0);
    if (totalValue > 0 && (h.totalValue / totalValue) > 0.25) {
      alerts.push({ type: "concentration", severity: "warning", ticker: h.ticker, name: etf.n, message: `Over 25% of portfolio — consider diversifying`, icon: "⚖️" });
    }
  }

  return alerts;
}

function computeIncomeByCategory(holdings) {
  const catMap = {};
  const enriched = holdings.map(computeHoldingIncome);
  for (const h of enriched) {
    const cat = h.category || "Other";
    catMap[cat] = (catMap[cat] || 0) + h.annualIncome;
  }
  return Object.entries(catMap).map(([name, value]) => ({ name, value: Math.round(value) })).sort((a, b) => b.value - a.value);
}

function computeIncomeByFrequency(holdings) {
  const freqMap = {};
  const enriched = holdings.map(computeHoldingIncome);
  for (const h of enriched) {
    const freq = h.frequency || "None";
    freqMap[freq] = (freqMap[freq] || 0) + h.annualIncome;
  }
  return Object.entries(freqMap).map(([name, value]) => ({ name, value: Math.round(value) })).sort((a, b) => b.value - a.value);
}

function forecastIncome(holdings, years = 5) {
  const enriched = holdings.map(computeHoldingIncome);
  const baseAnnual = enriched.reduce((a, h) => a + h.annualIncome, 0);
  const weightedGrowth = enriched.reduce((a, h) => {
    const weight = h.annualIncome / (baseAnnual || 1);
    return a + weight * (h.dividendGrowth || 0);
  }, 0);

  const forecast = [];
  for (let y = 0; y <= years; y++) {
    const growth = Math.pow(1 + weightedGrowth, y);
    forecast.push({
      year: new Date().getFullYear() + y,
      annual: Math.round(baseAnnual * growth),
      monthly: Math.round((baseAnnual * growth) / 12),
      growth: weightedGrowth,
    });
  }
  return forecast;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED UI COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      const C = lightTheme.colors;
      return <div style={{ padding: "20px", background: C.redLt, color: C.red, borderRadius: "8px", textAlign: "center" }}>
        <div style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "10px" }}>Something went wrong</div>
        <button onClick={() => this.setState({ hasError: false })} style={{ padding: "8px 16px", background: C.red, color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>Try Again</button>
      </div>;
    }
    return this.props.children;
  }
}

const Card = ({ children, isDark, style = {} }) => {
  const T = isDark ? darkTheme : lightTheme;
  const C = T.colors;
  return <div style={{ background: C.card, borderRadius: `${T.radii.md}px`, padding: `${T.spacing.lg}px`, boxShadow: T.shadows.sm, border: `1px solid ${C.border}`, marginBottom: `${T.spacing.lg}px`, ...style }}>{children}</div>;
};

const KPI = ({ label, value, icon, trend, isDark, sub }) => {
  const T = isDark ? darkTheme : lightTheme;
  const C = T.colors;
  return <div style={{ background: C.card, padding: `${T.spacing.md}px`, borderRadius: `${T.radii.md}px`, border: `1px solid ${C.border}`, flex: "1 1 auto", minWidth: "140px", boxShadow: T.shadows.sm }}>
    <div style={{ fontSize: T.fontSize.sm, color: C.muted, marginBottom: `${T.spacing.xs}px`, display: "flex", alignItems: "center", gap: `${T.spacing.xs}px` }}>{icon} {label}</div>
    <div style={{ fontSize: T.fontSize.hero, fontWeight: "bold", color: C.text, marginBottom: sub ? `${T.spacing.xs}px` : 0 }}>{value}</div>
    {trend !== undefined && <div style={{ fontSize: T.fontSize.sm, color: trend >= 0 ? C.green : C.red }}>{trend >= 0 ? "↑" : "↓"}{Math.abs(trend).toFixed(1)}%</div>}
    {sub && <div style={{ fontSize: T.fontSize.xs, color: C.muted }}>{sub}</div>}
  </div>;
};

const NavBtn = ({ label, icon, active, onClick, isDark, badge }) => {
  const T = isDark ? darkTheme : lightTheme;
  const C = T.colors;
  return <button onClick={onClick} style={{ flex: 1, padding: `${T.spacing.md}px`, border: "none", borderTop: active ? `3px solid ${C.accent}` : `3px solid transparent`, background: active ? C.card : C.bg, color: active ? C.accent : C.muted, cursor: "pointer", transition: `all ${T.transition.fast}`, fontSize: T.fontSize.md, display: "flex", flexDirection: "column", alignItems: "center", gap: `${T.spacing.xs}px`, position: "relative" }}>
    <span style={{ fontSize: "20px" }}>{icon}</span>
    <span style={{ fontSize: T.fontSize.xs }}>{label}</span>
    {badge > 0 && <span style={{ position: "absolute", top: "4px", right: "calc(50% - 16px)", background: C.red, color: C.white, fontSize: "8px", fontWeight: "bold", padding: "1px 4px", borderRadius: "6px", minWidth: "14px", textAlign: "center" }}>{badge}</span>}
  </button>;
};

const Select = ({ label, value, onChange, options, icon = "", isDark }) => {
  const T = isDark ? darkTheme : lightTheme;
  const C = T.colors;
  return <div style={{ marginBottom: `${T.spacing.md}px` }}>
    <label style={{ display: "block", fontSize: T.fontSize.base, color: C.text, marginBottom: `${T.spacing.xs}px`, fontWeight: "500" }}>{icon} {label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)} style={{ width: "100%", padding: `${T.spacing.sm}px`, border: `1px solid ${C.border}`, borderRadius: `${T.radii.sm}px`, fontSize: T.fontSize.base, fontFamily: T.font.family, background: C.card, color: C.text, cursor: "pointer" }}>
      {options.map((o, i) => <option key={i} value={o.value}>{o.label}</option>)}
    </select>
  </div>;
};

const NumInput = ({ label, value, onChange, step = 1, unit = "", icon = "", isDark }) => {
  const T = isDark ? darkTheme : lightTheme;
  const C = T.colors;
  return <div style={{ marginBottom: `${T.spacing.md}px`, flex: "1 1 auto" }}>
    <label style={{ display: "block", fontSize: T.fontSize.base, color: C.text, marginBottom: `${T.spacing.xs}px`, fontWeight: "500" }}>{icon} {label}</label>
    <div style={{ display: "flex", gap: `${T.spacing.xs}px`, alignItems: "center" }}>
      <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} step={step} style={{ flex: "1", padding: `${T.spacing.sm}px`, border: `1px solid ${C.border}`, borderRadius: `${T.radii.sm}px`, fontSize: T.fontSize.base, fontFamily: T.font.family, color: C.text, background: C.card, boxSizing: "border-box" }} />
      {unit && <span style={{ fontSize: T.fontSize.base, color: C.muted, minWidth: "30px" }}>{unit}</span>}
    </div>
  </div>;
};

const Badge = ({ text, color, bg, isDark }) => {
  const T = isDark ? darkTheme : lightTheme;
  return <span style={{ display: "inline-block", fontSize: T.fontSize.xs, fontWeight: "bold", padding: "2px 8px", borderRadius: `${T.radii.sm}px`, color, background: bg }}>{text}</span>;
};

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD VIEW
// ═══════════════════════════════════════════════════════════════════════════════

function DashboardView({ isDark, holdings, currency }) {
  const T = isDark ? darkTheme : lightTheme;
  const C = T.colors;
  const enriched = useMemo(() => holdings.map(computeHoldingIncome), [holdings]);
  const totalAnnual = useMemo(() => enriched.reduce((a, h) => a + h.annualIncome, 0), [enriched]);
  const totalMonthly = totalAnnual / 12;
  const totalValue = useMemo(() => enriched.reduce((a, h) => a + (h.totalValue || 0), 0), [enriched]);
  const portfolioYield = totalValue > 0 ? totalAnnual / totalValue : 0;
  const weightedGrowth = useMemo(() => enriched.reduce((a, h) => {
    const w = h.annualIncome / (totalAnnual || 1);
    return a + w * (h.dividendGrowth || 0);
  }, 0), [enriched, totalAnnual]);
  const monthlyProjection = useMemo(() => computeMonthlyProjection(holdings, 12), [holdings]);
  const catData = useMemo(() => computeIncomeByCategory(holdings), [holdings]);
  const freqData = useMemo(() => computeIncomeByFrequency(holdings), [holdings]);
  const alerts = useMemo(() => computeDividendAlerts(holdings), [holdings]);
  const forecast = useMemo(() => forecastIncome(holdings, 5), [holdings]);

  const nextPayment = useMemo(() => {
    const now = new Date();
    for (const mp of monthlyProjection) {
      if (mp.payments.length > 0) return mp;
    }
    return null;
  }, [monthlyProjection]);

  if (holdings.length === 0) {
    return <div style={{ padding: `${T.spacing.xxl}px`, textAlign: "center" }}>
      <div style={{ fontSize: "48px", marginBottom: `${T.spacing.lg}px` }}>💰</div>
      <div style={{ fontSize: T.fontSize.xl, fontWeight: "bold", color: C.text, marginBottom: `${T.spacing.md}px` }}>Welcome to Dividend Tracker</div>
      <div style={{ fontSize: T.fontSize.base, color: C.muted, marginBottom: `${T.spacing.lg}px`, maxWidth: "320px", margin: "0 auto" }}>Add your holdings or import your portfolio from the ETF Optimiser to get started.</div>
      <div style={{ fontSize: T.fontSize.sm, color: C.accent }}>Go to Holdings tab to begin →</div>
    </div>;
  }

  return <div style={{ padding: `${T.spacing.lg}px`, overflow: "auto", paddingBottom: "100px" }}>
    {/* KPI Grid */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: `${T.spacing.md}px`, marginBottom: `${T.spacing.lg}px` }}>
      <KPI label="Monthly Income" value={fmtCurrency(totalMonthly, currency)} icon="💸" isDark={isDark} />
      <KPI label="Annual Income" value={fmtCurrency(totalAnnual, currency)} icon="📊" isDark={isDark} />
      <KPI label="Portfolio Yield" value={fmtPct(portfolioYield)} icon="📈" isDark={isDark} />
      <KPI label="Div Growth" value={fmtPct(weightedGrowth)} icon="🌱" isDark={isDark} trend={weightedGrowth * 100} />
      <KPI label="Holdings" value={holdings.length} icon="💼" isDark={isDark} />
      <KPI label="Portfolio Value" value={fmtCurrency(totalValue, currency)} icon="💵" isDark={isDark} />
    </div>

    {/* Next Payment Banner */}
    {nextPayment && <Card isDark={isDark} style={{ background: isDark ? C.accentDk : C.accentLt, border: `1px solid ${C.accent}` }}>
      <div style={{ fontSize: T.fontSize.sm, color: C.accent, fontWeight: "bold", marginBottom: `${T.spacing.xs}px` }}>📅 Next Dividends — {nextPayment.month}</div>
      <div style={{ fontSize: T.fontSize.hero, fontWeight: "bold", color: C.text }}>{fmtCurrency(nextPayment.total, currency)}</div>
      <div style={{ fontSize: T.fontSize.xs, color: C.muted, marginTop: `${T.spacing.xs}px` }}>{nextPayment.payments.length} payment{nextPayment.payments.length !== 1 ? "s" : ""} expected</div>
    </Card>}

    {/* Monthly Income Chart */}
    <Card isDark={isDark}>
      <div style={{ fontSize: T.fontSize.lg, fontWeight: "bold", color: C.text, marginBottom: `${T.spacing.md}px` }}>📊 Monthly Income Projection</div>
      <div style={{ height: "200px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyProjection}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="month" tick={{ fontSize: 9, fill: C.muted }} angle={-45} textAnchor="end" height={50} />
            <YAxis tick={{ fontSize: 9, fill: C.muted }} tickFormatter={v => `${currency}${v}`} />
            <Tooltip formatter={(v) => `${currency}${v.toFixed(2)}`} contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: `${T.radii.sm}px`, fontSize: T.fontSize.sm }} />
            <Bar dataKey="total" fill={C.accent} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>

    {/* 5-Year Forecast */}
    <Card isDark={isDark}>
      <div style={{ fontSize: T.fontSize.lg, fontWeight: "bold", color: C.text, marginBottom: `${T.spacing.md}px` }}>🔮 5-Year Income Forecast</div>
      <div style={{ fontSize: T.fontSize.xs, color: C.muted, marginBottom: `${T.spacing.md}px` }}>Based on weighted average dividend growth of {fmtPct(weightedGrowth)} p.a.</div>
      <div style={{ height: "180px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={forecast}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="year" tick={{ fontSize: 10, fill: C.muted }} />
            <YAxis tick={{ fontSize: 9, fill: C.muted }} tickFormatter={v => `${currency}${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v) => `${currency}${v.toLocaleString()}`} contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: `${T.radii.sm}px`, fontSize: T.fontSize.sm }} />
            <Area type="monotone" dataKey="annual" stroke={C.green} fill={C.greenLt} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>

    {/* Income by Category */}
    <Card isDark={isDark}>
      <div style={{ fontSize: T.fontSize.lg, fontWeight: "bold", color: C.text, marginBottom: `${T.spacing.md}px` }}>📊 Income by Category</div>
      <div style={{ height: "160px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={catData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
              {catData.map((_, i) => <Cell key={i} fill={T.pieColors[i % T.pieColors.length]} />)}
            </Pie>
            <Tooltip formatter={(v) => `${currency}${v}`} contentStyle={{ background: C.card, border: `1px solid ${C.border}`, fontSize: T.fontSize.sm }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>

    {/* Alerts Summary */}
    {alerts.length > 0 && <Card isDark={isDark}>
      <div style={{ fontSize: T.fontSize.lg, fontWeight: "bold", color: C.text, marginBottom: `${T.spacing.md}px` }}>🔔 Dividend Alerts ({alerts.length})</div>
      {alerts.slice(0, 5).map((a, i) => (
        <div key={i} style={{
          padding: `${T.spacing.sm}px`, marginBottom: `${T.spacing.sm}px`,
          background: a.severity === "positive" ? C.greenLt : a.severity === "warning" ? C.amberLt : a.severity === "caution" ? C.redLt : C.accentLt,
          borderRadius: `${T.radii.sm}px`,
          color: a.severity === "positive" ? C.green : a.severity === "warning" ? C.amber : a.severity === "caution" ? C.red : C.accent,
        }}>
          <div style={{ fontSize: T.fontSize.sm, fontWeight: "bold" }}>{a.icon} {a.ticker}: {a.message}</div>
        </div>
      ))}
      {alerts.length > 5 && <div style={{ fontSize: T.fontSize.sm, color: C.accent, textAlign: "center", padding: `${T.spacing.sm}px` }}>View all {alerts.length} alerts in Alerts tab →</div>}
    </Card>}
  </div>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOLDINGS VIEW
// ═══════════════════════════════════════════════════════════════════════════════

function HoldingsView({ isDark, holdings, setHoldings, currency, location }) {
  const T = isDark ? darkTheme : lightTheme;
  const C = T.colors;
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importJson, setImportJson] = useState("");
  const [importResult, setImportResult] = useState(null);
  const [selectedTicker, setSelectedTicker] = useState(DB[0]?.t || "");
  const [addShares, setAddShares] = useState(100);
  const [addCostBasis, setAddCostBasis] = useState(10000);
  const [editIdx, setEditIdx] = useState(-1);

  const enriched = useMemo(() => holdings.map(computeHoldingIncome), [holdings]);
  const totalValue = enriched.reduce((a, h) => a + (h.totalValue || 0), 0);
  const totalIncome = enriched.reduce((a, h) => a + h.annualIncome, 0);

  const addHolding = () => {
    if (!selectedTicker || addShares <= 0) return;
    const existing = holdings.findIndex(h => h.ticker === selectedTicker);
    if (existing >= 0) {
      const updated = [...holdings];
      updated[existing] = { ...updated[existing], shares: updated[existing].shares + addShares, costBasis: updated[existing].costBasis + addCostBasis };
      setHoldings(updated);
    } else {
      setHoldings([...holdings, { ticker: selectedTicker, shares: addShares, costBasis: addCostBasis, dateAdded: new Date().toISOString().slice(0, 10) }]);
    }
    setShowAdd(false);
    setAddShares(100);
    setAddCostBasis(10000);
  };

  const removeHolding = (idx) => {
    setHoldings(holdings.filter((_, i) => i !== idx));
    setEditIdx(-1);
  };

  const handleImport = () => {
    const result = PortfolioExchange.importPortfolio(importJson);
    setImportResult(result);
    if (result.success) {
      setHoldings(result.holdings);
      setShowImport(false);
      setImportJson("");
    }
  };

  const handleExport = () => {
    const json = PortfolioExchange.exportPortfolio(holdings, { currency, location });
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dividend-portfolio.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredDB = useMemo(() => DB.filter(e => e.p !== "None"), []);

  return <div style={{ padding: `${T.spacing.lg}px`, overflow: "auto", paddingBottom: "100px" }}>
    {/* Action Bar */}
    <div style={{ display: "flex", gap: `${T.spacing.sm}px`, marginBottom: `${T.spacing.lg}px`, flexWrap: "wrap" }}>
      <button onClick={() => { setShowAdd(!showAdd); setShowImport(false); }} style={{ flex: "1 1 auto", padding: `${T.spacing.md}px`, background: C.accent, color: C.white, border: "none", borderRadius: `${T.radii.md}px`, cursor: "pointer", fontWeight: "bold", fontSize: T.fontSize.base }}>+ Add Holding</button>
      <button onClick={() => { setShowImport(!showImport); setShowAdd(false); }} style={{ flex: "1 1 auto", padding: `${T.spacing.md}px`, background: C.purple, color: C.white, border: "none", borderRadius: `${T.radii.md}px`, cursor: "pointer", fontWeight: "bold", fontSize: T.fontSize.base }}>📥 Import</button>
      {holdings.length > 0 && <button onClick={handleExport} style={{ flex: "1 1 auto", padding: `${T.spacing.md}px`, background: C.green, color: C.white, border: "none", borderRadius: `${T.radii.md}px`, cursor: "pointer", fontWeight: "bold", fontSize: T.fontSize.base }}>📤 Export</button>}
    </div>

    {/* Import Panel */}
    {showImport && <Card isDark={isDark}>
      <div style={{ fontSize: T.fontSize.lg, fontWeight: "bold", color: C.text, marginBottom: `${T.spacing.md}px` }}>📥 Import from ETF Optimiser</div>
      <div style={{ fontSize: T.fontSize.sm, color: C.muted, marginBottom: `${T.spacing.md}px` }}>Paste the JSON export from the ETF Portfolio Optimiser, or any portfolio JSON file.</div>
      <textarea value={importJson} onChange={(e) => setImportJson(e.target.value)} placeholder='Paste portfolio JSON here...' style={{ width: "100%", height: "120px", padding: `${T.spacing.sm}px`, border: `1px solid ${C.border}`, borderRadius: `${T.radii.sm}px`, fontSize: T.fontSize.sm, fontFamily: "monospace", color: C.text, background: C.bg, boxSizing: "border-box", resize: "vertical" }} />
      {importResult && !importResult.success && <div style={{ color: C.red, fontSize: T.fontSize.sm, padding: `${T.spacing.sm}px 0` }}>Error: {importResult.error}</div>}
      <button onClick={handleImport} style={{ width: "100%", padding: `${T.spacing.md}px`, background: C.purple, color: C.white, border: "none", borderRadius: `${T.radii.md}px`, cursor: "pointer", fontWeight: "bold", marginTop: `${T.spacing.md}px` }}>Import Portfolio</button>
    </Card>}

    {/* Add Holding Panel */}
    {showAdd && <Card isDark={isDark}>
      <div style={{ fontSize: T.fontSize.lg, fontWeight: "bold", color: C.text, marginBottom: `${T.spacing.md}px` }}>+ Add New Holding</div>
      <Select label="ETF / Stock" value={selectedTicker} onChange={setSelectedTicker} options={filteredDB.map(e => ({ value: e.t, label: `${e.t} — ${e.n.substring(0, 35)} (${fmtPct(e.dy)} yield)` }))} isDark={isDark} icon="📈" />
      <div style={{ display: "flex", gap: `${T.spacing.md}px` }}>
        <NumInput label="Shares" value={addShares} onChange={setAddShares} step={1} isDark={isDark} icon="🔢" />
        <NumInput label="Cost Basis" value={addCostBasis} onChange={setAddCostBasis} step={100} unit={currency} isDark={isDark} icon="💰" />
      </div>
      {selectedTicker && (() => {
        const etf = DB.find(e => e.t === selectedTicker);
        if (!etf) return null;
        const annInc = (addCostBasis * etf.dy);
        return <div style={{ padding: `${T.spacing.sm}px`, background: C.greenLt, borderRadius: `${T.radii.sm}px`, color: C.green, fontSize: T.fontSize.sm, marginBottom: `${T.spacing.md}px` }}>
          Estimated income: {fmtCurrency(annInc, currency)}/yr ({fmtCurrency(annInc / 12, currency)}/mo) • Paid {etf.p}
        </div>;
      })()}
      <button onClick={addHolding} style={{ width: "100%", padding: `${T.spacing.md}px`, background: C.green, color: C.white, border: "none", borderRadius: `${T.radii.md}px`, cursor: "pointer", fontWeight: "bold" }}>Add to Portfolio</button>
    </Card>}

    {/* Summary Bar */}
    {holdings.length > 0 && <div style={{ display: "flex", gap: `${T.spacing.md}px`, marginBottom: `${T.spacing.lg}px`, flexWrap: "wrap" }}>
      <KPI label="Total Value" value={fmtCurrency(totalValue, currency)} icon="💵" isDark={isDark} />
      <KPI label="Annual Income" value={fmtCurrency(totalIncome, currency)} icon="💸" isDark={isDark} />
      <KPI label="Avg Yield" value={fmtPct(totalValue > 0 ? totalIncome / totalValue : 0)} icon="📊" isDark={isDark} />
    </div>}

    {/* Holdings List */}
    {enriched.length === 0 ? (
      <Card isDark={isDark} style={{ textAlign: "center" }}>
        <div style={{ fontSize: "32px", marginBottom: `${T.spacing.md}px` }}>📋</div>
        <div style={{ fontSize: T.fontSize.base, color: C.muted }}>No holdings yet. Add your first ETF or import from the Portfolio Optimiser.</div>
      </Card>
    ) : (
      <Card isDark={isDark} style={{ padding: 0, overflow: "hidden" }}>
        {enriched.map((h, i) => (
          <div key={i} onClick={() => setEditIdx(editIdx === i ? -1 : i)} style={{ padding: `${T.spacing.md}px`, borderBottom: i < enriched.length - 1 ? `1px solid ${C.border}` : "none", cursor: "pointer", transition: `background ${T.transition.fast}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: T.fontSize.base, fontWeight: "bold", color: C.text }}>{h.ticker}</div>
                <div style={{ fontSize: T.fontSize.xs, color: C.muted }}>{h.etfName?.substring(0, 35)}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: T.fontSize.base, fontWeight: "bold", color: C.green }}>{fmtCurrency(h.monthlyIncome, currency)}/mo</div>
                <div style={{ fontSize: T.fontSize.xs, color: C.muted }}>{fmtPct(h.yield)} yield • {h.frequency}</div>
              </div>
            </div>
            {editIdx === i && <div style={{ marginTop: `${T.spacing.md}px`, padding: `${T.spacing.sm}px`, background: C.bg, borderRadius: `${T.radii.sm}px` }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: `${T.spacing.sm}px`, fontSize: T.fontSize.sm, color: C.text, marginBottom: `${T.spacing.md}px` }}>
                <div>Shares: <strong>{h.shares}</strong></div>
                <div>Cost: <strong>{fmtCurrency(h.costBasis, currency)}</strong></div>
                <div>Value: <strong>{fmtCurrency(h.totalValue, currency)}</strong></div>
                <div>Annual: <strong>{fmtCurrency(h.annualIncome, currency)}</strong></div>
                <div>Yield on Cost: <strong>{fmtPct(h.yieldOnCost)}</strong></div>
                <div>Growth: <strong>{fmtPct(h.dividendGrowth)}</strong></div>
                <div>Category: <strong>{h.category}</strong></div>
                <div>Per Payment: <strong>{fmtCurrency(h.perPayment, currency)}</strong></div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); removeHolding(i); }} style={{ width: "100%", padding: `${T.spacing.sm}px`, background: C.red, color: C.white, border: "none", borderRadius: `${T.radii.sm}px`, cursor: "pointer", fontWeight: "bold", fontSize: T.fontSize.sm }}>Remove Holding</button>
            </div>}
          </div>
        ))}
      </Card>
    )}
  </div>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CALENDAR VIEW
// ═══════════════════════════════════════════════════════════════════════════════

function CalendarView({ isDark, holdings, currency }) {
  const T = isDark ? darkTheme : lightTheme;
  const C = T.colors;
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const now = new Date();

  const calendar = useMemo(() => {
    const cal = Array.from({ length: 12 }, (_, i) => ({
      month: MONTHS[i],
      monthFull: MONTH_FULL[i],
      monthIdx: i,
      year: now.getFullYear(),
      payments: [],
      exDates: [],
      total: 0,
    }));

    const enriched = holdings.map(computeHoldingIncome);
    for (const h of enriched) {
      const etf = DB.find(e => e.t === h.ticker);
      if (!etf || etf.p === "None") continue;
      const payMonths = getPaymentMonths(etf.p);
      for (const m of payMonths) {
        const payDay = generatePayDay(h.ticker, m);
        const exDay = generateExDay(h.ticker);
        cal[m].payments.push({ ticker: h.ticker, name: etf.n, amount: h.perPayment, day: payDay, category: etf.c, frequency: etf.p });
        cal[m].exDates.push({ ticker: h.ticker, day: Math.max(1, exDay), type: "ex-div" });
        cal[m].total += h.perPayment;
      }
    }

    for (const m of cal) {
      m.payments.sort((a, b) => a.day - b.day);
      m.exDates.sort((a, b) => a.day - b.day);
    }
    return cal;
  }, [holdings]);

  const barData = calendar.map(m => ({ month: m.month, total: Math.round(m.total * 100) / 100, payments: m.payments.length }));
  const sel = calendar[selectedMonth];

  if (holdings.length === 0) {
    return <div style={{ padding: `${T.spacing.xxl}px`, textAlign: "center" }}>
      <div style={{ fontSize: "48px", marginBottom: `${T.spacing.lg}px` }}>📅</div>
      <div style={{ fontSize: T.fontSize.xl, fontWeight: "bold", color: C.text }}>Payment Calendar</div>
      <div style={{ fontSize: T.fontSize.base, color: C.muted, marginTop: `${T.spacing.md}px` }}>Add holdings to see your dividend payment schedule.</div>
    </div>;
  }

  return <div style={{ padding: `${T.spacing.lg}px`, overflow: "auto", paddingBottom: "100px" }}>
    {/* Annual Overview Chart */}
    <Card isDark={isDark}>
      <div style={{ fontSize: T.fontSize.lg, fontWeight: "bold", color: C.text, marginBottom: `${T.spacing.md}px` }}>📅 {now.getFullYear()} Payment Calendar</div>
      <div style={{ height: "160px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="month" tick={{ fontSize: 9, fill: C.muted }} />
            <YAxis tick={{ fontSize: 9, fill: C.muted }} tickFormatter={v => `${currency}${v}`} />
            <Tooltip formatter={(v, name) => name === "total" ? `${currency}${v.toFixed(2)}` : v} contentStyle={{ background: C.card, border: `1px solid ${C.border}`, fontSize: T.fontSize.sm }} />
            <Bar dataKey="total" fill={C.green} radius={[4, 4, 0, 0]} cursor="pointer" onClick={(data, idx) => setSelectedMonth(idx)} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>

    {/* Month Selector */}
    <div style={{ display: "flex", gap: `${T.spacing.xs}px`, marginBottom: `${T.spacing.lg}px`, flexWrap: "wrap" }}>
      {MONTHS.map((m, i) => (
        <button key={i} onClick={() => setSelectedMonth(i)} style={{
          flex: "1 1 auto", minWidth: "40px", padding: `${T.spacing.sm}px ${T.spacing.xs}px`,
          background: selectedMonth === i ? C.accent : (i === now.getMonth() ? C.accentLt : C.card),
          color: selectedMonth === i ? C.white : C.text,
          border: `1px solid ${selectedMonth === i ? C.accent : C.border}`,
          borderRadius: `${T.radii.sm}px`, cursor: "pointer",
          fontSize: T.fontSize.xs, fontWeight: selectedMonth === i ? "bold" : "normal",
        }}>{m}</button>
      ))}
    </div>

    {/* Month Detail */}
    <Card isDark={isDark}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: `${T.spacing.md}px` }}>
        <div style={{ fontSize: T.fontSize.lg, fontWeight: "bold", color: C.text }}>{sel.monthFull} {sel.year}</div>
        <div style={{ fontSize: T.fontSize.xl, fontWeight: "bold", color: C.green }}>{fmtCurrency(sel.total, currency)}</div>
      </div>

      {sel.payments.length === 0 ? (
        <div style={{ padding: `${T.spacing.lg}px`, textAlign: "center", color: C.muted, fontSize: T.fontSize.base }}>No dividend payments scheduled this month</div>
      ) : (
        <>
          {/* Ex-Dividend Dates */}
          {sel.exDates.length > 0 && <div style={{ marginBottom: `${T.spacing.md}px` }}>
            <div style={{ fontSize: T.fontSize.sm, fontWeight: "bold", color: C.amber, marginBottom: `${T.spacing.sm}px` }}>⚡ Ex-Dividend Dates</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: `${T.spacing.xs}px` }}>
              {sel.exDates.map((ex, i) => (
                <span key={i} style={{ fontSize: T.fontSize.xs, padding: "2px 6px", background: C.amberLt, color: C.amber, borderRadius: `${T.radii.sm}px`, fontWeight: "bold" }}>
                  {ex.ticker} — {ex.day}{ex.day === 1 ? "st" : ex.day === 2 ? "nd" : ex.day === 3 ? "rd" : "th"}
                </span>
              ))}
            </div>
          </div>}

          {/* Payment Schedule */}
          <div style={{ fontSize: T.fontSize.sm, fontWeight: "bold", color: C.green, marginBottom: `${T.spacing.sm}px` }}>💰 Payment Schedule</div>
          {sel.payments.map((p, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: `${T.spacing.sm}px`, borderBottom: i < sel.payments.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <div>
                <div style={{ fontSize: T.fontSize.base, fontWeight: "bold", color: C.text }}>{p.ticker}</div>
                <div style={{ fontSize: T.fontSize.xs, color: C.muted }}>~{p.day}{p.day === 1 ? "st" : p.day === 2 ? "nd" : p.day === 3 ? "rd" : "th"} {sel.monthFull} • {p.category}</div>
              </div>
              <div style={{ fontSize: T.fontSize.base, fontWeight: "bold", color: C.green }}>{fmtCurrency(p.amount, currency)}</div>
            </div>
          ))}
        </>
      )}
    </Card>
  </div>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ALERTS VIEW
// ═══════════════════════════════════════════════════════════════════════════════

function AlertsView({ isDark, holdings, currency }) {
  const T = isDark ? darkTheme : lightTheme;
  const C = T.colors;
  const [filter, setFilter] = useState("all");

  const alerts = useMemo(() => computeDividendAlerts(holdings), [holdings]);
  const filtered = filter === "all" ? alerts : alerts.filter(a => a.severity === filter);

  const severityCounts = useMemo(() => {
    const counts = { positive: 0, warning: 0, caution: 0, info: 0 };
    alerts.forEach(a => counts[a.severity] = (counts[a.severity] || 0) + 1);
    return counts;
  }, [alerts]);

  if (holdings.length === 0) {
    return <div style={{ padding: `${T.spacing.xxl}px`, textAlign: "center" }}>
      <div style={{ fontSize: "48px", marginBottom: `${T.spacing.lg}px` }}>🔔</div>
      <div style={{ fontSize: T.fontSize.xl, fontWeight: "bold", color: C.text }}>Dividend Alerts</div>
      <div style={{ fontSize: T.fontSize.base, color: C.muted, marginTop: `${T.spacing.md}px` }}>Add holdings to receive dividend alerts.</div>
    </div>;
  }

  return <div style={{ padding: `${T.spacing.lg}px`, overflow: "auto", paddingBottom: "100px" }}>
    {/* Summary Badges */}
    <div style={{ display: "flex", gap: `${T.spacing.sm}px`, marginBottom: `${T.spacing.lg}px`, flexWrap: "wrap" }}>
      <button onClick={() => setFilter("all")} style={{ flex: "1 1 auto", padding: `${T.spacing.sm}px`, background: filter === "all" ? C.accent : C.card, color: filter === "all" ? C.white : C.text, border: `1px solid ${C.border}`, borderRadius: `${T.radii.md}px`, cursor: "pointer", fontWeight: "bold", fontSize: T.fontSize.sm }}>All ({alerts.length})</button>
      <button onClick={() => setFilter("positive")} style={{ flex: "1 1 auto", padding: `${T.spacing.sm}px`, background: filter === "positive" ? C.green : C.card, color: filter === "positive" ? C.white : C.green, border: `1px solid ${C.border}`, borderRadius: `${T.radii.md}px`, cursor: "pointer", fontWeight: "bold", fontSize: T.fontSize.sm }}>📈 Positive ({severityCounts.positive})</button>
      <button onClick={() => setFilter("warning")} style={{ flex: "1 1 auto", padding: `${T.spacing.sm}px`, background: filter === "warning" ? C.amber : C.card, color: filter === "warning" ? C.white : C.amber, border: `1px solid ${C.border}`, borderRadius: `${T.radii.md}px`, cursor: "pointer", fontWeight: "bold", fontSize: T.fontSize.sm }}>⚠️ Warning ({severityCounts.warning})</button>
      <button onClick={() => setFilter("caution")} style={{ flex: "1 1 auto", padding: `${T.spacing.sm}px`, background: filter === "caution" ? C.red : C.card, color: filter === "caution" ? C.white : C.red, border: `1px solid ${C.border}`, borderRadius: `${T.radii.md}px`, cursor: "pointer", fontWeight: "bold", fontSize: T.fontSize.sm }}>🔴 Caution ({severityCounts.caution})</button>
    </div>

    {/* Alert List */}
    {filtered.length === 0 ? (
      <Card isDark={isDark} style={{ textAlign: "center" }}>
        <div style={{ fontSize: T.fontSize.base, color: C.muted, padding: `${T.spacing.lg}px` }}>No alerts matching this filter</div>
      </Card>
    ) : filtered.map((a, i) => (
      <Card key={i} isDark={isDark} style={{
        background: a.severity === "positive" ? (isDark ? "#1a3a2a" : C.greenLt) :
                    a.severity === "warning" ? (isDark ? "#3a3a1a" : C.amberLt) :
                    a.severity === "caution" ? (isDark ? "#3a1a1a" : C.redLt) :
                    (isDark ? "#1a2a3a" : C.accentLt),
        border: `1px solid ${a.severity === "positive" ? C.green : a.severity === "warning" ? C.amber : a.severity === "caution" ? C.red : C.accent}20`,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <div>
            <div style={{ fontSize: T.fontSize.base, fontWeight: "bold", color: C.text, marginBottom: `${T.spacing.xs}px` }}>{a.icon} {a.ticker}</div>
            <div style={{ fontSize: T.fontSize.sm, color: C.muted, marginBottom: `${T.spacing.xs}px` }}>{a.name}</div>
            <div style={{ fontSize: T.fontSize.base, color: C.text }}>{a.message}</div>
          </div>
          <Badge
            text={a.severity === "positive" ? "Positive" : a.severity === "warning" ? "Warning" : a.severity === "caution" ? "Caution" : "Info"}
            color={a.severity === "positive" ? C.green : a.severity === "warning" ? C.amber : a.severity === "caution" ? C.red : C.accent}
            bg={a.severity === "positive" ? C.greenLt : a.severity === "warning" ? C.amberLt : a.severity === "caution" ? C.redLt : C.accentLt}
            isDark={isDark}
          />
        </div>
      </Card>
    ))}

    {/* Data Feed Status */}
    <Card isDark={isDark}>
      <div style={{ fontSize: T.fontSize.sm, fontWeight: "bold", color: C.text, marginBottom: `${T.spacing.sm}px` }}>📡 Data Feed Status</div>
      <div style={{ fontSize: T.fontSize.xs, color: C.muted }}>
        Provider: <strong>{DATA_FEED_CONFIG.provider}</strong> •
        Status: <strong>{DATA_FEED_CONFIG.enabled ? "Live" : "Static Data"}</strong> •
        Last sync: <strong>{DATA_FEED_CONFIG.lastSync || "N/A"}</strong>
      </div>
      <div style={{ fontSize: T.fontSize.xs, color: C.accent, marginTop: `${T.spacing.xs}px` }}>Live data feed integration ready — connect your API to enable real-time alerts</div>
    </Card>
  </div>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANALYTICS VIEW
// ═══════════════════════════════════════════════════════════════════════════════

function AnalyticsView({ isDark, holdings, currency }) {
  const T = isDark ? darkTheme : lightTheme;
  const C = T.colors;

  const enriched = useMemo(() => holdings.map(computeHoldingIncome), [holdings]);
  const totalAnnual = enriched.reduce((a, h) => a + h.annualIncome, 0);
  const totalValue = enriched.reduce((a, h) => a + (h.totalValue || 0), 0);
  const forecast = useMemo(() => forecastIncome(holdings, 10), [holdings]);
  const catData = useMemo(() => computeIncomeByCategory(holdings), [holdings]);
  const freqData = useMemo(() => computeIncomeByFrequency(holdings), [holdings]);

  // Top yielders
  const topYielders = useMemo(() => [...enriched].sort((a, b) => b.annualIncome - a.annualIncome).slice(0, 5), [enriched]);

  // Income concentration
  const incomeConcentration = useMemo(() => {
    if (enriched.length === 0) return 0;
    const sorted = [...enriched].sort((a, b) => b.annualIncome - a.annualIncome);
    const top3Income = sorted.slice(0, 3).reduce((a, h) => a + h.annualIncome, 0);
    return totalAnnual > 0 ? top3Income / totalAnnual : 0;
  }, [enriched, totalAnnual]);

  // Monthly income smoothness
  const monthlyProjection = useMemo(() => computeMonthlyProjection(holdings, 12), [holdings]);
  const incomeStdDev = useMemo(() => {
    if (monthlyProjection.length === 0) return 0;
    const avg = monthlyProjection.reduce((a, m) => a + m.total, 0) / monthlyProjection.length;
    const variance = monthlyProjection.reduce((a, m) => a + Math.pow(m.total - avg, 2), 0) / monthlyProjection.length;
    return Math.sqrt(variance);
  }, [monthlyProjection]);

  if (holdings.length === 0) {
    return <div style={{ padding: `${T.spacing.xxl}px`, textAlign: "center" }}>
      <div style={{ fontSize: "48px", marginBottom: `${T.spacing.lg}px` }}>📈</div>
      <div style={{ fontSize: T.fontSize.xl, fontWeight: "bold", color: C.text }}>Income Analytics</div>
      <div style={{ fontSize: T.fontSize.base, color: C.muted, marginTop: `${T.spacing.md}px` }}>Add holdings to see detailed income analytics.</div>
    </div>;
  }

  return <div style={{ padding: `${T.spacing.lg}px`, overflow: "auto", paddingBottom: "100px" }}>
    {/* Income Health Score */}
    <Card isDark={isDark}>
      <div style={{ fontSize: T.fontSize.lg, fontWeight: "bold", color: C.text, marginBottom: `${T.spacing.md}px` }}>🏥 Income Health Score</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: `${T.spacing.md}px` }}>
        <div style={{ padding: `${T.spacing.sm}px`, background: C.bg, borderRadius: `${T.radii.sm}px` }}>
          <div style={{ fontSize: T.fontSize.xs, color: C.muted }}>Diversification</div>
          <div style={{ fontSize: T.fontSize.lg, fontWeight: "bold", color: incomeConcentration > 0.7 ? C.red : incomeConcentration > 0.5 ? C.amber : C.green }}>
            {incomeConcentration > 0.7 ? "Poor" : incomeConcentration > 0.5 ? "Fair" : "Good"}
          </div>
          <div style={{ fontSize: T.fontSize.xs, color: C.muted }}>Top 3 = {(incomeConcentration * 100).toFixed(0)}%</div>
        </div>
        <div style={{ padding: `${T.spacing.sm}px`, background: C.bg, borderRadius: `${T.radii.sm}px` }}>
          <div style={{ fontSize: T.fontSize.xs, color: C.muted }}>Smoothness</div>
          <div style={{ fontSize: T.fontSize.lg, fontWeight: "bold", color: incomeStdDev > totalAnnual / 24 ? C.amber : C.green }}>
            {incomeStdDev > totalAnnual / 24 ? "Lumpy" : "Smooth"}
          </div>
          <div style={{ fontSize: T.fontSize.xs, color: C.muted }}>StdDev: {fmtCurrency(incomeStdDev, currency)}</div>
        </div>
        <div style={{ padding: `${T.spacing.sm}px`, background: C.bg, borderRadius: `${T.radii.sm}px` }}>
          <div style={{ fontSize: T.fontSize.xs, color: C.muted }}>Categories</div>
          <div style={{ fontSize: T.fontSize.lg, fontWeight: "bold", color: catData.length >= 4 ? C.green : catData.length >= 2 ? C.amber : C.red }}>{catData.length}</div>
          <div style={{ fontSize: T.fontSize.xs, color: C.muted }}>{catData.length >= 4 ? "Well diversified" : "Add variety"}</div>
        </div>
        <div style={{ padding: `${T.spacing.sm}px`, background: C.bg, borderRadius: `${T.radii.sm}px` }}>
          <div style={{ fontSize: T.fontSize.xs, color: C.muted }}>Growth Rate</div>
          <div style={{ fontSize: T.fontSize.lg, fontWeight: "bold", color: C.green }}>{forecast.length > 0 ? fmtPct(forecast[0].growth) : "0%"}</div>
          <div style={{ fontSize: T.fontSize.xs, color: C.muted }}>Weighted avg</div>
        </div>
      </div>
    </Card>

    {/* 10-Year Forecast */}
    <Card isDark={isDark}>
      <div style={{ fontSize: T.fontSize.lg, fontWeight: "bold", color: C.text, marginBottom: `${T.spacing.md}px` }}>🔮 10-Year Income Forecast</div>
      <div style={{ height: "200px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={forecast}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="year" tick={{ fontSize: 10, fill: C.muted }} />
            <YAxis tick={{ fontSize: 9, fill: C.muted }} tickFormatter={v => `${currency}${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v) => `${currency}${v.toLocaleString()}`} contentStyle={{ background: C.card, border: `1px solid ${C.border}`, fontSize: T.fontSize.sm }} />
            <Area type="monotone" dataKey="annual" stroke={C.green} fill={C.greenLt} strokeWidth={2} name="Annual Income" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: `${T.spacing.sm}px`, marginTop: `${T.spacing.md}px` }}>
        {forecast.filter((_, i) => i % 2 === 0 || i === forecast.length - 1).map((f, i) => (
          <div key={i} style={{ padding: `${T.spacing.sm}px`, background: C.bg, borderRadius: `${T.radii.sm}px`, textAlign: "center" }}>
            <div style={{ fontSize: T.fontSize.xs, color: C.muted }}>{f.year}</div>
            <div style={{ fontSize: T.fontSize.base, fontWeight: "bold", color: C.green }}>{fmtCurrency(f.annual, currency)}</div>
            <div style={{ fontSize: T.fontSize.xs, color: C.muted }}>{fmtCurrency(f.monthly, currency)}/mo</div>
          </div>
        ))}
      </div>
    </Card>

    {/* Top Income Contributors */}
    <Card isDark={isDark}>
      <div style={{ fontSize: T.fontSize.lg, fontWeight: "bold", color: C.text, marginBottom: `${T.spacing.md}px` }}>🏆 Top Income Contributors</div>
      {topYielders.map((h, i) => {
        const pct = totalAnnual > 0 ? (h.annualIncome / totalAnnual) * 100 : 0;
        return <div key={i} style={{ marginBottom: `${T.spacing.sm}px` }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: T.fontSize.sm, color: C.text, marginBottom: "2px" }}>
            <span style={{ fontWeight: "bold" }}>{h.ticker}</span>
            <span>{fmtCurrency(h.annualIncome, currency)}/yr ({pct.toFixed(1)}%)</span>
          </div>
          <div style={{ background: C.bg, height: "6px", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ height: "100%", background: T.pieColors[i], width: `${pct}%`, transition: `width ${T.transition.medium}` }} />
          </div>
        </div>;
      })}
    </Card>

    {/* Income by Frequency */}
    <Card isDark={isDark}>
      <div style={{ fontSize: T.fontSize.lg, fontWeight: "bold", color: C.text, marginBottom: `${T.spacing.md}px` }}>⏱️ Income by Payment Frequency</div>
      <div style={{ height: "160px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={freqData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
              {freqData.map((_, i) => <Cell key={i} fill={T.pieColors[i % T.pieColors.length]} />)}
            </Pie>
            <Tooltip formatter={(v) => `${currency}${v}`} contentStyle={{ background: C.card, border: `1px solid ${C.border}`, fontSize: T.fontSize.sm }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  </div>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SETTINGS VIEW
// ═══════════════════════════════════════════════════════════════════════════════

function SettingsView({ isDark, setIsDark, location, setLocation, currency }) {
  const T = isDark ? darkTheme : lightTheme;
  const C = T.colors;

  return <div style={{ padding: `${T.spacing.lg}px`, overflow: "auto", paddingBottom: "100px" }}>
    <Card isDark={isDark}>
      <div style={{ fontSize: T.fontSize.lg, fontWeight: "bold", color: C.text, marginBottom: `${T.spacing.lg}px` }}>⚙️ Settings</div>

      {/* Theme */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: `${T.spacing.lg}px`, padding: `${T.spacing.md}px`, background: C.bg, borderRadius: `${T.radii.sm}px` }}>
        <div>
          <div style={{ fontSize: T.fontSize.base, fontWeight: "bold", color: C.text }}>🌙 Dark Mode</div>
          <div style={{ fontSize: T.fontSize.xs, color: C.muted }}>Switch between light and dark theme</div>
        </div>
        <button onClick={() => setIsDark(!isDark)} style={{ width: "50px", height: "28px", borderRadius: "14px", border: "none", background: isDark ? C.green : C.border, cursor: "pointer", position: "relative" }}>
          <div style={{ position: "absolute", width: "24px", height: "24px", borderRadius: "12px", background: C.white, top: "2px", left: isDark ? "24px" : "2px", transition: `left ${T.transition.fast}` }} />
        </button>
      </div>

      {/* Location */}
      <div style={{ marginBottom: `${T.spacing.lg}px`, padding: `${T.spacing.md}px`, background: C.bg, borderRadius: `${T.radii.sm}px` }}>
        <div style={{ fontSize: T.fontSize.base, fontWeight: "bold", color: C.text, marginBottom: `${T.spacing.sm}px` }}>📍 Location</div>
        <div style={{ display: "flex", gap: `${T.spacing.sm}px` }}>
          <button onClick={() => setLocation("UK")} style={{ flex: 1, padding: `${T.spacing.md}px`, background: location === "UK" ? C.accent : C.card, color: location === "UK" ? C.white : C.text, border: `1px solid ${C.border}`, borderRadius: `${T.radii.md}px`, cursor: "pointer", fontWeight: "bold" }}>🇬🇧 UK</button>
          <button onClick={() => setLocation("US")} style={{ flex: 1, padding: `${T.spacing.md}px`, background: location === "US" ? C.accent : C.card, color: location === "US" ? C.white : C.text, border: `1px solid ${C.border}`, borderRadius: `${T.radii.md}px`, cursor: "pointer", fontWeight: "bold" }}>🇺🇸 USA</button>
        </div>
      </div>
    </Card>

    {/* Companion App Link */}
    <Card isDark={isDark}>
      <div style={{ fontSize: T.fontSize.lg, fontWeight: "bold", color: C.text, marginBottom: `${T.spacing.md}px` }}>🔗 Companion Apps</div>
      <div style={{ padding: `${T.spacing.md}px`, background: C.accentLt, borderRadius: `${T.radii.md}px`, cursor: "pointer" }} onClick={() => window.open("/", "_blank")}>
        <div style={{ fontSize: T.fontSize.base, fontWeight: "bold", color: C.accent }}>📊 ETF Portfolio Optimiser</div>
        <div style={{ fontSize: T.fontSize.xs, color: C.muted, marginTop: `${T.spacing.xs}px` }}>Model and compare ETF allocations for your SIPP or IRA</div>
      </div>
    </Card>

    {/* Data Feed Config */}
    <Card isDark={isDark}>
      <div style={{ fontSize: T.fontSize.lg, fontWeight: "bold", color: C.text, marginBottom: `${T.spacing.md}px` }}>📡 Data Feed Configuration</div>
      <div style={{ padding: `${T.spacing.md}px`, background: C.bg, borderRadius: `${T.radii.sm}px` }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: `${T.spacing.sm}px`, fontSize: T.fontSize.sm }}>
          <div style={{ color: C.muted }}>Provider:</div>
          <div style={{ color: C.text, fontWeight: "bold" }}>{DATA_FEED_CONFIG.provider}</div>
          <div style={{ color: C.muted }}>Status:</div>
          <div style={{ color: DATA_FEED_CONFIG.enabled ? C.green : C.amber, fontWeight: "bold" }}>{DATA_FEED_CONFIG.enabled ? "Connected" : "Static (Offline)"}</div>
          <div style={{ color: C.muted }}>Refresh:</div>
          <div style={{ color: C.text, fontWeight: "bold" }}>{DATA_FEED_CONFIG.refreshInterval / 1000}s</div>
          <div style={{ color: C.muted }}>API Endpoint:</div>
          <div style={{ color: C.text, fontWeight: "bold" }}>{DATA_FEED_CONFIG.apiEndpoint || "Not configured"}</div>
        </div>
        <div style={{ fontSize: T.fontSize.xs, color: C.accent, marginTop: `${T.spacing.md}px`, padding: `${T.spacing.sm}px`, background: C.accentLt, borderRadius: `${T.radii.sm}px` }}>
          Ready for live data feed integration. Configure your API endpoint to enable real-time dividend data, ex-date tracking, and automatic cut/raise alerts.
        </div>
      </div>
    </Card>

    {/* About */}
    <Card isDark={isDark}>
      <div style={{ textAlign: "center", color: C.muted, fontSize: T.fontSize.sm }}>
        <div style={{ fontWeight: "bold", marginBottom: `${T.spacing.xs}px` }}>Dividend Income Tracker v1.0</div>
        <div>Part of the SIPP Portfolio Suite</div>
        <div style={{ marginTop: `${T.spacing.xs}px`, fontSize: T.fontSize.xs }}>Data feed architecture ready for live API integration</div>
      </div>
    </Card>
  </div>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [tab, setTab] = useState("dashboard");
  const [location, setLocation] = useState("UK");
  const [holdings, setHoldings] = useState([]);

  const currency = location === "UK" ? "£" : "$";
  const T = isDark ? darkTheme : lightTheme;
  const C = T.colors;

  const alerts = useMemo(() => computeDividendAlerts(holdings), [holdings]);
  const alertCount = alerts.filter(a => a.severity === "warning" || a.severity === "caution").length;

  return (
    <ErrorBoundary>
      <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: C.bg, fontFamily: T.font.family, color: C.text, maxWidth: "480px", margin: "0 auto", boxShadow: T.shadows.lg }}>
        {/* Header */}
        <div style={{ background: C.navy, padding: `${T.spacing.md}px ${T.spacing.lg}px`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: T.fontSize.lg, fontWeight: "bold", color: C.white }}>💰 Dividend Tracker</div>
            <div style={{ fontSize: T.fontSize.xs, color: C.accentLt }}>{holdings.length} holding{holdings.length !== 1 ? "s" : ""} • {currency}{(holdings.map(computeHoldingIncome).reduce((a, h) => a + h.monthlyIncome, 0)).toFixed(0)}/mo</div>
          </div>
          <div style={{ display: "flex", gap: `${T.spacing.sm}px`, alignItems: "center" }}>
            <button onClick={() => setIsDark(!isDark)} style={{ background: "transparent", border: "none", fontSize: "18px", cursor: "pointer", color: C.white, padding: `${T.spacing.xs}px` }}>
              {isDark ? "☀️" : "🌙"}
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: "auto" }}>
          {tab === "dashboard" && <DashboardView isDark={isDark} holdings={holdings} currency={currency} />}
          {tab === "holdings" && <HoldingsView isDark={isDark} holdings={holdings} setHoldings={setHoldings} currency={currency} location={location} />}
          {tab === "calendar" && <CalendarView isDark={isDark} holdings={holdings} currency={currency} />}
          {tab === "alerts" && <AlertsView isDark={isDark} holdings={holdings} currency={currency} />}
          {tab === "analytics" && <AnalyticsView isDark={isDark} holdings={holdings} currency={currency} />}
          {tab === "settings" && <SettingsView isDark={isDark} setIsDark={setIsDark} location={location} setLocation={setLocation} currency={currency} />}
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", borderTop: `1px solid ${C.border}`, flexShrink: 0, background: C.bg }}>
          <NavBtn label="Dashboard" icon="📊" active={tab === "dashboard"} onClick={() => setTab("dashboard")} isDark={isDark} />
          <NavBtn label="Holdings" icon="💼" active={tab === "holdings"} onClick={() => setTab("holdings")} isDark={isDark} />
          <NavBtn label="Calendar" icon="📅" active={tab === "calendar"} onClick={() => setTab("calendar")} isDark={isDark} />
          <NavBtn label="Alerts" icon="🔔" active={tab === "alerts"} onClick={() => setTab("alerts")} isDark={isDark} badge={alertCount} />
          <NavBtn label="Analytics" icon="📈" active={tab === "analytics"} onClick={() => setTab("analytics")} isDark={isDark} />
          <NavBtn label="Settings" icon="⚙️" active={tab === "settings"} onClick={() => setTab("settings")} isDark={isDark} />
        </div>
      </div>
    </ErrorBoundary>
  );
}
