import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const outputPath = path.resolve("bsnl-visit.pdf");
const doc = new PDFDocument({ margin: 60, size: "A4" });
const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

function line() {
  doc.moveDown(0.2);
  doc.moveTo(60, doc.y).lineTo(535, doc.y).strokeColor("#dddddd").lineWidth(0.5).stroke();
  doc.moveDown(0.4);
}

function section(title: string) {
  doc.moveDown(0.8);
  doc.fillColor("#000000").rect(60, doc.y, 475, 24).fill();
  doc.moveDown(0.05);
  doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(10)
    .text(title, { indent: 8 });
  doc.moveDown(0.5);
}

function row(label: string, value: string) {
  doc.fillColor("#888888").font("Helvetica").fontSize(10)
    .text(label, { continued: false });
  doc.fillColor("#000000").font("Helvetica-Bold").fontSize(11)
    .text(value);
  line();
}

// ── TITLE ─────────────────────────────────────────────────────────────────
doc.fillColor("#000000").font("Helvetica-Bold").fontSize(32)
  .text("VEDHHA", { align: "center", characterSpacing: 8 });
doc.moveDown(0.1);
doc.fillColor("#555555").font("Helvetica").fontSize(10)
  .text("The Eklavya Wear  —  Mumbai, India", { align: "center" });
doc.moveDown(0.6);
doc.fillColor("#000000").rect(140, doc.y, 315, 24).fill();
doc.moveDown(0.05);
doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(10)
  .text("BSNL DLT OFFICE VISIT DOCUMENT", { align: "center" });
doc.moveDown(0.8);
doc.moveTo(60, doc.y).lineTo(535, doc.y).strokeColor("#000000").lineWidth(2).stroke();

// ── 1. REGISTRATION ───────────────────────────────────────────────────────
section("1.  REGISTRATION DETAILS");
row("Registration Ref No.", "BL-1400079318");
row("Registration Date", "3rd May 2026");
row("Status", "Pending Activation (4+ days)");

// ── 2. PAYMENT ────────────────────────────────────────────────────────────
section("2.  PAYMENT DETAILS");
row("Amount Paid", "Rs. 5,900");
row("Payment Reference No.", "0246644066");
row("Payment Date", "3rd May 2026");
row("Bank", "Kotak Bank");

// ── 3. ENTITY ─────────────────────────────────────────────────────────────
section("3.  ENTITY / APPLICANT DETAILS");
row("Entity Name", "VEDHHA");
row("Owner Name", "Aakash Sharma");
row("PAN Number", "FZQPA4913Q");
row("Udyam Number", "UDYAM-MH-18-0540701");
row("Email", "vedhhatheeklavyawear@gmail.com");
row("City", "Mumbai, Maharashtra");

// ── 4. CHECKLIST ──────────────────────────────────────────────────────────
section("4.  DOCUMENTS TO CARRY  (Tick before leaving)");

const docs = [
  "Aadhaar Card  —  Original + 1 Photocopy",
  "PAN Card  —  Original + 1 Photocopy  (FZQPA4913Q)",
  "Bank Statement / Screenshot  —  Rs. 5,900 payment  (Kotak, Ref: 0246644066)",
  "Udyam Certificate  —  Printout  (UDYAM-MH-18-0540701)",
  "This Document  —  Printed copy",
];

docs.forEach((item) => {
  doc.moveDown(0.15);
  doc.fillColor("#000000").font("Helvetica").fontSize(10.5)
    .text("  \u2610   " + item, { indent: 4 });
  line();
});

// ── 5. SCRIPT ─────────────────────────────────────────────────────────────
section("5.  OFFICE MEIN YEH BOLNA HAI");
doc.moveDown(0.2);
doc.fillColor("#222222").font("Helvetica-Oblique").fontSize(10.5);

const lines = [
  '"Namaste. Maine BSNL DLT platform pe 3 May 2026 ko',
  ' registration kiya tha.',
  " ",
  " Mera registration number BL-1400079318 hai.",
  " ",
  " Rs. 5,900 ki payment bhi ho gayi hai —",
  " Kotak Bank, Ref: 0246644066.",
  " ",
  " 4 din se zyada ho gaye hain,",
  " account abhi tak activate nahi hua.",
  " ",
  ' Kripya mera account jaldi activate karwa dijiye."',
];

lines.forEach((l) => {
  doc.text(l, { indent: 8, lineGap: 2 });
});

// ── FOOTER ────────────────────────────────────────────────────────────────
doc.moveDown(1.2);
doc.moveTo(60, doc.y).lineTo(535, doc.y).strokeColor("#cccccc").lineWidth(0.8).stroke();
doc.moveDown(0.5);
doc.fillColor("#aaaaaa").font("Helvetica").fontSize(9)
  .text("VEDHHA — The Eklavya Wear  |  vedhha.com  |  vedhhatheeklavyawear@gmail.com", {
    align: "center",
  });

doc.end();
stream.on("finish", () => console.log("Done:", outputPath));
