import express, { Router } from "express";
import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";
import { authenticate } from "../middlewares/auth";
import { allCategories, categoriesByID, createCategories, deleteCategoriesByID, updateCategoriesByID } from "../controllers/categories.controller";

const CategoriesRoutes: Router = express.Router();

const userCreateRateLimit: RateLimitRequestHandler = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
});


CategoriesRoutes.post("/",[authenticate, userCreateRateLimit], createCategories);
CategoriesRoutes.get("/:page?", [authenticate], allCategories);
CategoriesRoutes.get("/find/:id", [authenticate], categoriesByID);
CategoriesRoutes.put("/update/:id", [authenticate], updateCategoriesByID);
CategoriesRoutes.delete("/delete/:id", [authenticate], deleteCategoriesByID);

export default CategoriesRoutes;
