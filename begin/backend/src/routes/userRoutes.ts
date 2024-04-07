// src/routes/userRoutes.ts

import express from "express";
import UserController from "../controllers/userController";

const router = express.Router();

router.post("/new", UserController.createUser);
router.post('/edit/:userId', UserController.editUser);
router.get("/", UserController.getUserByEmail);

export default router;
