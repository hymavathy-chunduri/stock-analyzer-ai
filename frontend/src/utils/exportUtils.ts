import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { AnalysisData } from "./api";

// Excel Export
export function exportToExcel(data: AnalysisData) {
  const wb = XLSX.utils.book_new();

  // Summary Sheet
  const summaryData = [
    ["STOCK ANALYZER AI - FINANCIAL SUMMARY REPORT"],
    [],
    ["Company Name", data.metadata.name],
    ["Ticker Symbol", data.metadata.ticker],
    ["Sector", data.metadata.sector],
    ["Industry", data.metadata.industry],
    ["Current Price", `₹ ${data.metadata.currentPrice}`],
    ["Market Capitalization", `₹ ${data.metadata.marketCap} Cr`],
    ["Book Value", `₹ ${data.metadata.bookValue}`],
    ["Dividend Yield", `${data.metadata.dividendYield}%`],
    [],
    ["VALUATION & DECISION ENGINE"],
    ["Recommendation", data.decision.recommendation],
    ["Confidence Score", `${data.decision.confidenceScore}%`],
    ["Intrinsic Value (DCF)", `₹ ${data.metrics.intrinsicValue}`],
    ["Margin of Safety", `${data.metrics.marginOfSafety}%`],
    ["Graham Number", `₹ ${data.metrics.grahamNumber} (${data.metrics.grahamStatus})`],
    ["Piotroski Score", `${data.metrics.piotroskiScore}/9`],
    ["Altman Z-Score", `${data.metrics.altmanZScore} (${data.metrics.altmanZStatus})`],
    [],
    ["DECISION RATIONALE"],
    ...data.decision.reasons.map((r, i) => [`${i + 1}.`, r])
  ];

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, "Overview");

  // 5-Year Historical Statements Sheet
  const yearsHeader = ["Metric", ...data.charts.revenueAndProfit.map(d => d.year)];
  const yearsRows = [
    ["Revenue (₹ Cr)", ...data.charts.revenueAndProfit.map(d => d.revenue)],
    ["Net Profit (₹ Cr)", ...data.charts.revenueAndProfit.map(d => d.netProfit)],
    ["EPS (₹)", ...data.charts.eps.map(d => d.eps)],
    ["Borrowings (₹ Cr)", ...data.charts.debt.map(d => d.borrowings)],
    ["Debt to Equity", ...data.charts.debt.map(d => d.debtToEquity)],
    ["Operating Cash Flow (₹ Cr)", ...data.charts.cashFlow.map(d => d.operatingCashFlow)],
    ["Free Cash Flow (₹ Cr)", ...data.charts.cashFlow.map(d => d.freeCashFlow)],
    ["ROE (%)", ...data.charts.returnRatios.map(d => d.roe)],
    ["ROCE (%)", ...data.charts.returnRatios.map(d => d.roce)],
    ["ROA (%)", ...data.charts.returnRatios.map(d => d.roa)]
  ];

  const wsYears = XLSX.utils.aoa_to_sheet([yearsHeader, ...yearsRows]);
  XLSX.utils.book_append_sheet(wb, wsYears, "5-Year Statements");

  // Quarterly Sheet
  const qHeader = ["Quarter", "Sales (₹ Cr)", "Net Profit (₹ Cr)"];
  const qRows = data.charts.quarterly.map(q => [q.quarter, q.sales, q.netProfit]);
  const wsQuarterly = XLSX.utils.aoa_to_sheet([qHeader, ...qRows]);
  XLSX.utils.book_append_sheet(wb, wsQuarterly, "Quarterly Results");

  // Save File
  XLSX.writeFile(wb, `${data.metadata.ticker}_Financial_Report.xlsx`);
}

// PDF Exporter using html2canvas & jsPDF
export async function exportToPDF(elementId: string, companyName: string) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error("Target element for PDF export not found.");
    return;
  }

  // Set visual scale config to fit nicely
  const canvas = await html2canvas(element, {
    scale: 2, // High resolution
    useCORS: true,
    backgroundColor: "#0B0F19", // Force dark background color
    logging: false
  });

  const imgData = canvas.toDataURL("image/png");
  
  // PDF setup
  const pdf = new jsPDF("p", "mm", "a4");
  const imgWidth = 210; // A4 size width
  const pageHeight = 295; // A4 size height
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;

  // Add pages if required
  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(`${companyName.replace(/\s+/g, "_")}_Stock_Analysis.pdf`);
}

// Browser Print Exporter
export function printReport() {
  window.print();
}
