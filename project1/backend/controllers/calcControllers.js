import axios from "axios";

const windowSize = 10;
let windowState = [];

// Function to fetch numbers from external API
const fetchNumbersFromAPI = async (type) => {
  try {
    const response = await axios.get(`http://20.244.56.144/test/${type}`);
    return response.data.numbers; // Assuming the API returns { numbers: [...] }
  } catch (error) {
    console.error(`Error fetching ${type} numbers:`, error);
    return [];
  }
};

// Function to fetch numbers and update the window
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

  // Fetch numbers from external API
  const newNumbers = await fetchNumbersFromAPI(apiType);

  // Store previous state before update
  const prevState = [...windowState];

  // Add new numbers and maintain uniqueness
  windowState = [...new Set([...windowState, ...newNumbers])];

  // Ensure sliding window size
  if (windowState.length > windowSize) {
    windowState = windowState.slice(windowState.length - windowSize);
  }

  // Calculate the average
  const avg = windowState.reduce((a, b) => a + b, 0) / windowState.length;

  return res.json({
    windowPrevState: prevState,
    windowCurrState: windowState,
    numbers: newNumbers,
    avg: avg.toFixed(2),
  });
};
