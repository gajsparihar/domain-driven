// src/controllers/userController.ts

import { Request, Response } from "express";
import UserModel from "../models/userModel";
import { User } from "@prisma/client";

const generateRandomPassword = (length: number): string => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
  const passwordArray = [];

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    passwordArray.push(charset[randomIndex]);
  }

  return passwordArray.join("");
};

const parseUserForResponse = (user: User) => {
  const returnData = JSON.parse(JSON.stringify(user));
  delete returnData.password;
  return returnData;
};

const Errors = {
  UsernameAlreadyTaken: "UserNameAlreadyTaken",
  EmailAlreadyInUse: "EmailAlreadyInUse",
  ValidationError: "ValidationError",
  ServerError: "ServerError",
  ClientError: "ClientError",
  UserNotFound: "UserNotFound",
};

class UserController {
  async createUser(req: Request, res: Response) {
    try {
      const { firstname, lastname, username, email } = req.body;

      if (!firstname || !lastname || !username || !email) {
        return res.status(400).json({
          error: Errors.ValidationError,
          data: undefined,
          success: false,
        });
      }

      // check if username exists or not
      const isUserNameTaken = await UserModel.isUserNameTaken(username);
      if (isUserNameTaken) {
        return res.status(409).json({
          error: Errors.UsernameAlreadyTaken,
          data: undefined,
          success: false,
        });
      }

      // check if email exists or not
      const isEmailTaken = await UserModel.isEmailTaken(email);
      if (isEmailTaken) {
        return res.status(409).json({
          error: Errors.EmailAlreadyInUse,
          data: undefined,
          success: false,
        });
      }

      const newUser = await UserModel.createUser({
        firstname,
        lastname,
        username,
        email,
        password: generateRandomPassword(10),
      });

      return res.status(201).json({
        data: parseUserForResponse(newUser),
        success: false,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({
        error: "ServerError",
        data: undefined,
        success: false,
      });
    }
  }

  async editUser(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const { firstname, lastname, username, email } = req.body;

      if (!firstname || !lastname || !username || !email) {
        return res.status(400).json({
          error: Errors.ValidationError,
          data: undefined,
          success: false,
        });
      }

      // get user
      const user = await UserModel.getById(userId);

      if (!user) {
        return res.status(404).json({
          error: Errors.UserNotFound,
          data: undefined,
          success: false,
        });
      }

      // check if username exists or not
      const isUserNameTaken = await UserModel.isUserNameTaken(username);
      if (isUserNameTaken) {
        return res.status(409).json({
          error: Errors.UsernameAlreadyTaken,
          data: undefined,
          success: false,
        });
      }

      // check if email exists or not
      const isEmailTaken = await UserModel.isEmailTaken(email);
      if (isEmailTaken) {
        return res.status(409).json({
          error: Errors.EmailAlreadyInUse,
          data: undefined,
          success: false,
        });
      }

      const updatedUser = await UserModel.editUser({
        userId,
        firstname,
        username,
        lastname,
        email,
      });

      if (updatedUser) {
        return res.status(201).json({
          data: parseUserForResponse(updatedUser),
          success: false,
        });
      } else {
        return res.status(404).json({
          error: Errors.UserNotFound,
          data: undefined,
          success: false,
        });
      }
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({
        error: "ServerError",
        data: undefined,
        success: false,
      });
    }
  }

  async getUserByEmail(req: Request, res: Response) {
    try {
      const email = req.query.email?.toString() || "";

      if (!email) {
        return res.status(400).json({
          error: Errors.ValidationError,
          data: undefined,
          success: false,
        });
      }

      const user = await UserModel.getUserByEmail(email);
      if (user) {
        return res.status(400).json({
          data: parseUserForResponse(user),
          success: true,
        });
      } else {
        return res.status(400).json({
          error: Errors.UserNotFound,
          data: undefined,
          success: false,
        });
      }
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({
        error: "ServerError",
        data: undefined,
        success: false,
      });
    }
  }
}

export default new UserController();
