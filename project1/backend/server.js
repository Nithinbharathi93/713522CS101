import express from "express";
import { router } from "./routes/calcRoutes.js";

const app = express();
const PORT = 5234;

app.use(express.json());
app.use("/numbers", router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
