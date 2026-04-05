import { subDays, subMonths, format } from "date-fns";

const categories = ["Food & Dining", "Transport", "Shopping", "Entertainment", "Health", "Utilities", "Salary", "Freelance", "Investment", "Rent"];
const categoryIcons = {
  "Food & Dining": "🍔",
  "Transport": "🚗",
  "Shopping": "🛍️",
  "Entertainment": "🎬",
  "Health": "💊",
  "Utilities": "💡",
  "Salary": "💼",
  "Freelance": "💻",
  "Investment": "📈",
  "Rent": "🏠",
};

const categoryColors = {
  "Food & Dining": "#f97316",
  "Transport": "#3b82f6",
  "Shopping": "#ec4899",
  "Entertainment": "#a855f7",
  "Health": "#10b981",
  "Utilities": "#f59e0b",
  "Salary": "#22c55e",
  "Freelance": "#06b6d4",
  "Investment": "#6366f1",
  "Rent": "#ef4444",
};

const merchants = {
  "Food & Dining": ["Starbucks", "McDonald's", "Pizza Hut", "Sushi Express", "Local Bistro", "Chipotle"],
  "Transport": ["Uber", "Shell Gas", "Metro Card", "Lyft", "BP Station"],
  "Shopping": ["Amazon", "Target", "H&M", "IKEA", "Zara", "Best Buy"],
  "Entertainment": ["Netflix", "Spotify", "Cinema City", "Steam", "HBO Max"],
  "Health": ["CVS Pharmacy", "Dr. Smith Clinic", "Gym Membership", "Dental Care"],
  "Utilities": ["Electric Co.", "Water Bill", "Internet Provider", "Gas Bill"],
  "Salary": ["Acme Corp", "TechStart Inc", "Design Studio"],
  "Freelance": ["Client A", "Client B", "Upwork", "Fiverr"],
  "Investment": ["Robinhood", "Coinbase", "Fidelity", "Vanguard"],
  "Rent": ["Downtown Apartments", "City Living", "Metro Rentals"],
};

let idCounter = 1;

function generateTransaction(daysAgo, type = null) {
  const isIncome = type === "income" || (!type && Math.random() > 0.65);
  const incomeCategories = ["Salary", "Freelance", "Investment"];
  const expenseCategories = ["Food & Dining", "Transport", "Shopping", "Entertainment", "Health", "Utilities", "Rent"];

  const category = isIncome
    ? incomeCategories[Math.floor(Math.random() * incomeCategories.length)]
    : expenseCategories[Math.floor(Math.random() * expenseCategories.length)];

  const merchantList = merchants[category];
  const merchant = merchantList[Math.floor(Math.random() * merchantList.length)];

  let amount;
  if (category === "Salary") amount = Math.floor(Math.random() * 2000 + 3000);
  else if (category === "Rent") amount = Math.floor(Math.random() * 500 + 1000);
  else if (category === "Freelance") amount = Math.floor(Math.random() * 800 + 200);
  else if (category === "Investment") amount = Math.floor(Math.random() * 600 + 50);
  else amount = Math.floor(Math.random() * 150 + 5);

  const date = subDays(new Date(), daysAgo);

  return {
    id: `txn_${String(idCounter++).padStart(4, "0")}`,
    date: format(date, "yyyy-MM-dd"),
    merchant,
    category,
    amount,
    type: isIncome ? "income" : "expense",
    note: "",
  };
}

// Generate 6 months of transactions
export const generateInitialTransactions = () => {
  const transactions = [];

  // Ensure regular salary entries
  for (let month = 0; month < 6; month++) {
    transactions.push({
      id: `txn_salary_${month}`,
      date: format(subMonths(new Date(), month), "yyyy-MM-01"),
      merchant: "Acme Corp",
      category: "Salary",
      amount: 5200,
      type: "income",
      note: "Monthly salary",
    });
    transactions.push({
      id: `txn_rent_${month}`,
      date: format(subMonths(new Date(), month), "yyyy-MM-03"),
      merchant: "Downtown Apartments",
      category: "Rent",
      amount: 1400,
      type: "expense",
      note: "Monthly rent",
    });
  }

  // Random transactions
  for (let i = 0; i < 120; i++) {
    const daysAgo = Math.floor(Math.random() * 180);
    transactions.push(generateTransaction(daysAgo));
  }

  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export { categoryIcons, categoryColors, categories };
