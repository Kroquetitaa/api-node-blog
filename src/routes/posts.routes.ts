import express, { Router } from "express";
import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";
import { authenticate } from "../middlewares/auth";
import { createPosts, deletedPostByID, listPost } from "../controllers/posts.controller";

const PostsRoutes: Router = express.Router();

const userCreateRateLimit: RateLimitRequestHandler = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
});


PostsRoutes.post("/",[authenticate, userCreateRateLimit], createPosts);
PostsRoutes.get("/",[authenticate], listPost);
PostsRoutes.delete("/delete/:id", [authenticate], deletedPostByID);

export default PostsRoutes;
