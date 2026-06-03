export const STOCKS = [
  {
    symbol: "RELIANCE",
    company: "Reliance Industries",
    price: 2845,
    change: 2.4,
  },

  {
    symbol: "TCS",
    company: "Tata Consultancy Services",
    price: 4120,
    change: 1.2,
  },

  {
    symbol: "INFY",
    company: "Infosys",
    price: 1785,
    change: -0.8,
  },

  {
    symbol: "HDFCBANK",
    company: "HDFC Bank",
    price: 1920,
    change: 3.1,
  },
];

export async function getStocks() {
  return STOCKS;
}