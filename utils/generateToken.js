import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secret_key = process.env.SECRET_KEY;

export const userToken = (user) => {
  return jwt.sign({ data: user.id, role: user.role }, secret_key, {
    expiresIn: "2d",
  });
};
