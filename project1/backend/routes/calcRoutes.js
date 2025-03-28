import express from "express";
import { fetchNumbers } from "../controllers/calcControllers.js";

const router = express.Router();

router.get("/:numberid", fetchNumbers);

export { router };
