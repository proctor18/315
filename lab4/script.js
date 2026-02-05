

const PRICES = { coffee: 3.25, sandwich: 8.50, salad: 7.25 };
const TAX_RATE = 0.05;
const STUDENT_RATE = 0.10;
const ECO_FEE = 1.00;
const BULK_QTY = 6;
const BULK_OFF = 2.00;

function money(n){
  return `$${n.toFixed(2)}`;
}

function normalizeType(raw){
  if (raw === null) return "";
  return String(raw).trim().toLowerCase();
}

function isValidType(t){
  return t === "coffee" || t === "sandwich" || t === "salad";
}

function iconsFor(type, qty){
  const map = { coffee: "☕", sandwich: "🥪", salad: "🥗" };
  const icon = map[type] || "•";
  const cap = Math.min(qty, 10);

  let line = "";
  for (let i = 0; i < cap; i++){
    line += icon;
  }
  return line;
}

function processQuote(type, qty, isStudent, ecoCup){
  const unitPrice = PRICES[type];

  const subtotal = unitPrice * qty;
  const studentDiscount = isStudent ? (subtotal * STUDENT_RATE) : 0;
  const ecoFee = (type === "coffee" && ecoCup) ? ECO_FEE : 0;
  const bulkDiscount = (qty >= BULK_QTY) ? BULK_OFF : 0;

  const taxable = subtotal - studentDiscount + ecoFee - bulkDiscount;
  const tax = taxable * TAX_RATE;
  const total = taxable + tax;

  return { unitPrice, subtotal, studentDiscount, ecoFee, bulkDiscount, tax, total };
}

function buildReceipt(type, qty, isStudent, ecoCup, calc){
  const icons = iconsFor(type, qty);
  const studentText = isStudent ? "Yes" : "No";
  const ecoText = (type === "coffee") ? (ecoCup ? "Yes" : "No") : "N/A";

  return `CAMPUS CAFÉ RECEIPT
--------------------------------
Item: ${type}
Unit price: ${money(calc.unitPrice)}
Quantity: ${qty} ${icons}
Student disc.: ${studentText}
Eco cup add-on: ${ecoText}
Subtotal: ${money(calc.subtotal)}
Student -10%: -${money(calc.studentDiscount)}
Eco cup fee: ${money(calc.ecoFee)}
Bulk deal: -${money(calc.bulkDiscount)}
Tax (5%): ${money(calc.tax)}
--------------------------------
TOTAL: ${money(calc.total)}
`;
}

function showError(msg){
  document.getElementById("display").textContent =
`ERROR
--------------------------------
${msg}
`;
}

function resetUI(){
  document.getElementById("display").textContent = "No order data.";
}

async function loadWeather(){
  const box = document.getElementById("weatherBox");
  const url =
    "https://api.open-meteo.com/v1/forecast" +
    "?latitude=53.5461&longitude=-113.4938" +
    "&current=temperature_2m,wind_speed_10m" +
    "&timezone=America/Edmonton";

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Bad response");
    const data = await res.json();

    const t = data.current.temperature_2m;
    const w = data.current.wind_speed_10m;

    box.textContent = `Edmonton: ${t}°C • Wind ${w} km/h`;
  } catch {
    box.textContent = "Weather unavailable.";
  }
}

function main(){
  loadWeather();
  resetUI();

  document.getElementById("calcBtn").addEventListener("click", () => {
    const type = normalizeType(prompt("Enter item type: coffee / sandwich / salad"));
    const qty = Number(prompt("Enter quantity (1–10):"));

    if (!isValidType(type)){
      showError("Item must be coffee, sandwich, or salad.");
      return;
    }

    if (!Number.isInteger(qty) || qty < 1 || qty > 10){
      showError("Quantity must be an integer between 1 and 10.");
      return;
    }

    const isStudent = confirm("Student discount? (10% off)");
    const ecoCup = (type === "coffee") ? confirm("Add reusable cup? (+$1.00)") : false;

    const calc = processQuote(type, qty, isStudent, ecoCup);

    document.getElementById("display").textContent =
      buildReceipt(type, qty, isStudent, ecoCup, calc);
  });

  document.getElementById("resetBtn").addEventListener("click", () => {
    resetUI();
  });
}

main();
