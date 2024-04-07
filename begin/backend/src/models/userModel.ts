// src/models/userModel.ts

import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

class UserModel {
  async createUser({
    firstname,
    lastname,
    email,
    username,
    password,
  }: {
    firstname: string;
    lastname: string;
    email: string;
    username: string;
    password: string;
  }): Promise<User> {
    return prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        username,
        password,
      },
    });
  }
  async getById(userId: number): Promise<User | null> {
    return prisma.user.findFirst({ where: { id: userId } });
  }

  async isUserNameTaken(username: string): Promise<boolean> {
    const user = await prisma.user.findFirst({ where: { username } });
    return !!user?.id;
  }

  async isEmailTaken(email: string): Promise<boolean> {
    const user = await prisma.user.findFirst({ where: { email } });
    return !!user?.id;
  }

  async editUser({
    firstname,
    lastname,
    email,
    username,
    userId,
  }: {
    firstname: string;
    lastname: string;
    email: string;
    username: string;
    userId: number;
  }): Promise<User | null> {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        firstname,
        lastname,
        email,
        username,
      },
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}

export default new UserModel();
