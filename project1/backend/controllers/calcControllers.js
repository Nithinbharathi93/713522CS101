import axios from "axios";

const windowSize = 10;
let windowState = [];

const generateNumbersLocally = (type) => {
  switch (type) {
    case "prime":
      return generatePrimes(10);
    case "fibo":
      return generateFibonacci(10);
    case "even":
      return generateEvenNumbers(10);
    case "rand":
      return generateRandomNumbers(10);
    default:
      return [];
  }
};

const generatePrimes = (count) => {
  let primes = [];
  let num = 2;
  while (primes.length < count) {
    if (primes.every((p) => num % p !== 0)) primes.push(num);
    num++;
  }
  return primes;
};

const generateFibonacci = (count) => {
  let fib = [0, 1];
  while (fib.length < count) {
    fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
  }
  return fib;
};

const generateEvenNumbers = (count) => {
  let evens = [];
  for (let i = 0; i < count * 2; i += 2) {
    evens.push(i);
  }
  return evens;
};

const generateRandomNumbers = (count) => {
  return Array.from({ length: count }, () => Math.floor(Math.random() * 100));
};

const fetchNumbersFromAPI = async (type) => {
  try {
    return response.data.numbers || [];
  } catch (error) {
    console.error(`Error fetching ${type} numbers, using local fallback:`, error.message);
    return generateNumbersLocally(type);
  }
};

export const fetchNumbers = async (req, res) => {
  const { numberid } = req.params;
  let apiType;

  switch (numberid) {
    case "p":
      apiType = "prime";
      break;
    case "f":
      apiType = "fibo";
      break;
    case "e":
      apiType = "even";
      break;
    case "r":
      apiType = "rand";
      break;
    default:
      return res.status(400).json({ error: "Invalid number type" });
  }

  const newNumbers = await fetchNumbersFromAPI(apiType);

  const prevState = [...windowState];

  windowState = [...new Set([...windowState, ...newNumbers])];

  if (windowState.length > windowSize) {
    windowState = windowState.slice(windowState.length - windowSize);
  }

  const avg = windowState.reduce((a, b) => a + b, 0) / windowState.length;

  return res.json({
    windowPrevState: prevState,
    windowCurrState: windowState,
    numbers: newNumbers,
    avg: avg.toFixed(2),
  });
};
