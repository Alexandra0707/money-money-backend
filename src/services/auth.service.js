// В файле: src/services/auth.service.js

import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { SessionsCollection } from "../models/session.js";
import User from "../models/User.js";
// import crypto from "node:crypto"; // Не используется

// Импортируем константы, добавляя .js в конце пути
// import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js'; // <-- ИЗМЕНЕНИЕ ЗДЕСЬ
import { TWO_HOURS, ONE_DAY } from '../constants/index.js';

// eslint-disable-next-line no-unused-vars
import dotenv from 'dotenv';
// Вызов dotenv.config() лучше оставить только в точке входа (server.js/app.js)
// dotenv.config({ path: './.env' });

export async function registerUser(payload) {
  const user = await User.findOne({ email: payload.email });
  if (user !== null) {
    throw createHttpError.Conflict("Email in use");
  }
  payload.password = await bcrypt.hash(payload.password, 10);

  return User.create(payload);
}

export async function loginUser(email, password) {
  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError.Unauthorized("Invalid login or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw createHttpError.Unauthorized("Invalid login or password");
  }

  const payload = { userId: user._id };

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in .env');
  }
  const refreshSecret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;

  const accessToken = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    // { expiresIn: '15m' }
    { expiresIn: '2h' }
  );

  const refreshToken = jwt.sign(
    payload,
    refreshSecret,
    { expiresIn: '7d' }
  );

  await SessionsCollection.deleteOne({ userId: user._id });

  const newSession = await SessionsCollection.create({
    userId: user._id,
    accessToken: accessToken,
    refreshToken: refreshToken,
    // accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    accessTokenValidUntil: new Date(Date.now() + TWO_HOURS),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY * 7),
  });

  return newSession;
}

export async function logoutUser(sessionId, refreshToken) {
  const session = await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });
  if (session.deletedCount === 0) {
    throw createHttpError.Unauthorized("Invalid session or refresh token");
  }
  return undefined;
}