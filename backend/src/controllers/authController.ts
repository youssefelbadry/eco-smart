import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { pool } from "../database";
import { success, error } from "../utils/response";

const getBody = (req: Request) =>
  req.body && Object.keys(req.body).length ? req.body : {};

export async function login(req: Request, res: Response) {
  const body = getBody(req);
  const emailOrUsername = String(body.email_or_username || "");
  const password = String(body.password || "");

  if (!emailOrUsername || !password) {
    return error({
      res,
      message: "email_or_username and password required",
      statusCode: 400,
    });
  }

  const [user] = await pool.execute<any[]>(
    "SELECT id, name, email, password FROM users WHERE email = ? OR name = ? LIMIT 1",
    [emailOrUsername, emailOrUsername],
  );
  const userRow = user[0];

  if (!userRow || !bcrypt.compareSync(password, userRow.password)) {
    return error({
      res,
      message: "Invalid credentials",
      statusCode: 401,
    });
  }

  const payload = {
    sub: Number(userRow.id),
    email: userRow.email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + Number(config.jwtExpiration || 86400),
  };

  const token = jwt.sign(payload, config.jwtSecret, { algorithm: "HS256" });

  return success({
    res,
    data: {
      token,
      user: {
        id: Number(userRow.id),
        name: userRow.name,
        email: userRow.email,
      },
    },
    message: "Login success",
  });
}

export async function signup(req: Request, res: Response) {
  const body = getBody(req);
  const name = String(body.full_name || "").trim();
  const email = String(body.email || "").trim();
  const password = String(body.password || "");

  const requiredField = ["full_name", "email", "password"].find(
    (field) => !body[field],
  );
  if (requiredField) {
    return error({
      res,
      message: `${requiredField} is required`,
      statusCode: 400,
    });
  }

  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!emailRegex.test(email)) {
    return error({
      res,
      message: "Invalid email address",
      statusCode: 400,
    });
  }

  const passwordStrong =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password);
  if (!passwordStrong) {
    return error({
      res,
      message:
        "Password must be at least 8 characters, include upper and lower case letters, and contain a number",
      statusCode: 400,
    });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const result = await pool.execute(
    "INSERT INTO users (name, email, password, remember_token, created_at, updated_at) VALUES (?, ?, ?, NULL, NOW(), NOW())",
    [name, email, passwordHash],
  );

  return success({
    res,
    data: {
      user: {
        name,
        email,
      },
    },
    message: "User registered successfully",
  });
}

export async function forgotPassword(req: Request, res: Response) {
  const body = getBody(req);
  const email = String(body.email || "").trim();
  if (!email) {
    return error({
      res,
      message: "email required",
      statusCode: 400,
    });
  }

  const token = require("crypto").randomBytes(32).toString("hex");
  await pool.execute(
    "INSERT INTO password_reset_tokens (email, token, created_at) VALUES (?, ?, NOW())",
    [email, token],
  );

  return success({
    res,
    data: { reset_token_demo: token },
    message: "Reset token generated",
  });
}

export async function resetPassword(req: Request, res: Response) {
  const body = getBody(req);
  const token = String(body.reset_token || "").trim();
  const newPassword = String(body.new_password || "");

  if (!token || !newPassword) {
    return error({
      res,
      message: "reset_token and new_password required",
      statusCode: 400,
    });
  }

  const passwordStrong =
    newPassword.length >= 8 &&
    /[A-Z]/.test(newPassword) &&
    /[a-z]/.test(newPassword) &&
    /[0-9]/.test(newPassword);
  if (!passwordStrong) {
    return error({
      res,
      message:
        "Password must be at least 8 characters, include upper and lower case letters, and contain a number",
      statusCode: 400,
    });
  }

  const [rows] = await pool.execute<any[]>(
    "SELECT email, token, created_at FROM password_reset_tokens WHERE token = ? LIMIT 1",
    [token],
  );
  const row = rows[0];
  if (!row) {
    return error({
      res,
      message: "Invalid token",
      statusCode: 400,
    });
  }

  const createdAt = new Date(row.created_at).getTime();
  if (Date.now() > createdAt + 1800 * 1000) {
    return error({
      res,
      message: "Token expired",
      statusCode: 400,
    });
  }

  const passwordHash = bcrypt.hashSync(newPassword, 10);
  await pool.execute("DELETE FROM password_reset_tokens WHERE email = ?", [
    row.email,
  ]);
  await pool.execute("UPDATE users SET password = ? WHERE email = ?", [
    passwordHash,
    row.email,
  ]);

  return success({
    res,
    data: {},
    message: "Password updated successfully",
  });
}
