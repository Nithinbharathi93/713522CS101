const windowSize = 10;
let windowState = [];

const generatePrimes = (count) => {
  let primes = [];
  let num = 2;
  while (primes.length < count) {
    if (primes.every(p => num % p !== 0)) {
      primes.push(num);
    }
    num++;
  }
  return primes;
};

const generateFibonacci = (count) => {
  let fib = [0, 1];
  for (let i = 2; i < count; i++) {
    fib.push(fib[i - 1] + fib[i - 2]);
  }
  return fib;
};

const generateEvenNumbers = (count) => {
  return Array.from({ length: count }, (_, i) => (i + 1) * 2);
};

const generateRandomNumbers = (count) => {
  return Array.from({ length: count }, () => Math.floor(Math.random() * 100) + 1);
};

export const fetchNumbers = (req, res) => {
  const { numberid } = req.params;
  let newNumbers = [];

  switch (numberid) {
    case "p":
      newNumbers = generatePrimes(10);
      break;
    case "f":
      newNumbers = generateFibonacci(10);
      break;
    case "e":
      newNumbers = generateEvenNumbers(10);
      break;
    case "r":
      newNumbers = generateRandomNumbers(10);
      break;
    default:
      return res.status(400).json({ error: "Invalid number type" });
  }

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
    avg: avg.toFixed(2)
  });
};
