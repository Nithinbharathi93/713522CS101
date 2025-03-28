import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();

const WINDOW_SIZE = 10;
let numberWindow = [];

const BASE_URL = process.env.BASE_URL;
const AUTH_URL = process.env.AUTH_URL;

let accessToken = process.env.ACCESS_TOKEN; 

const credentials = {
    companyName: "goMart",
    clientID: "a725c58e-52d4-4a06-a647-de7ec768f7ce",
    clientSecret: "hNNyAoWTXVlClGzZ",
    ownerName: "Nithinbharathi.T",
    ownerEmail: "nithinthelordest@gmail.com",
    rollNo: "713522CS101"
};

const TYPE_MAPPING = {
  p: "prime",
  f: "fibo",
  e: "even",
  r: "rand",
};

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

const getAccessToken = async () => {
  try {
    const response = await axios.post(AUTH_URL, credentials);
    accessToken = response.data.access_token;
    console.log("Access token obtained:", accessToken);
  } catch (error) {
    console.error("Error obtaining access token:", error.message);
    accessToken = null;
  }
};

const fetchNumbersFromServer = async (type) => {
  if (!accessToken) {
    await getAccessToken();
    if (!accessToken) return generateNumbersLocally(type);
  }

  try {
    const response = await axios.get(`${BASE_URL}/${type}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      timeout: 5000,
    });

    if (!response.data || !Array.isArray(response.data.numbers)) {
      throw new Error("Invalid response from API");
    }

    return response.data.numbers;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log("Access token expired, refreshing token...");
      await getAccessToken();
      return fetchNumbersFromServer(type);
    }

    console.error(`Error fetching ${type} numbers, using local fallback:`, error.message);
    return generateNumbersLocally(type);
  }
};

export const fetchNumbers = async (req, res) => {
  const { numberid } = req.params;
  const type = TYPE_MAPPING[numberid];

  if (!type) {
    return res.status(400).json({ error: "Invalid number type" });
  }

  console.log(`Received request for type: ${type}`);

  const prevState = [...numberWindow];


  let newNumbers = await fetchNumbersFromServer(type);


  newNumbers = newNumbers.filter((num) => !numberWindow.includes(num));


  numberWindow.push(...newNumbers);
  numberWindow = numberWindow.slice(-WINDOW_SIZE);


  const avg =
    numberWindow.length > 0
      ? (numberWindow.reduce((sum, num) => sum + num, 0) / numberWindow.length).toFixed(2)
      : "N/A";

  res.json({
    windowPrevState: prevState,
    windowCurrState: numberWindow,
    numbers: newNumbers,
    avg,
  });
};
