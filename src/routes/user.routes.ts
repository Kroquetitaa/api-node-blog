import express, { Router } from "express";
import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";
import { loginUser, profile, refreshToken, registerUser, updateProfile } from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth";
const UserRoutes: Router = express.Router();

const userCreateRateLimit: RateLimitRequestHandler = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 2,
});

UserRoutes.post("/register", [userCreateRateLimit], registerUser);
UserRoutes.post("/login", loginUser);
UserRoutes.post("/token/refresh", [authenticate], refreshToken);
UserRoutes.get("/me/:id", [authenticate], profile);
UserRoutes.put("/me", [authenticate], updateProfile);

export default UserRoutes;
