import type { Types } from "mongoose";
import { Schema } from "mongoose";

interface User {
  _id: Types.ObjectId;
  __v: string;
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
}

interface Account {
  _id: Types.ObjectId;
  __v: string;
  id: string;
  userId: Types.ObjectId;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token: string;
  access_token: string | null;
  expires_at: number | null;
  token_type: string | null;
  scope: string;
  id_token: string;
  oauth_token_secret: string;
  oauth_token: string;
  session_state: string;
}

interface Session {
  _id: Types.ObjectId;
  __v: string;
  id: string;
  sessionToken: string;
  userId: Types.ObjectId;
  expires: Date;
}

interface VerificationToken {
  _id: Types.ObjectId;
  __v: string;
  id: string;
  token: string;
  identifier: string;
  expires: Date;
}

export const userSchema = new Schema<User>({
  name: { type: String },
  email: { type: String, unique: true },
  emailVerified: { type: Date },
  image: { type: String },
});

export const accountSchema = new Schema<Account>({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  type: { type: String },
  provider: { type: String },
  providerAccountId: { type: String },
  refresh_token: { type: String },
  access_token: { type: String },
  expires_at: { type: Number },
  token_type: { type: String },
  scope: { type: String },
  id_token: { type: String },
  oauth_token_secret: { type: String },
  oauth_token: { type: String },
  session_state: { type: String },
});

export const sessionSchema = new Schema<Session>({
  sessionToken: { type: String, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  expires: { type: Date },
});

export const verificationTokenSchema = new Schema<VerificationToken>({
  token: { type: String },
  identifier: { type: String },
  expires: { type: Date },
});
