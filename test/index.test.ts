// Using the same tests as defined in the official MongoDB adapter
// https://github.com/nextauthjs/next-auth/blob/main/packages/adapter-mongodb/test/index.test.ts

import { runBasicTests } from "./common";
import { format, MongooseAdapter } from "../src";
import dbConnect from "../src/db";
import {
  accountSchema,
  sessionSchema,
  userSchema,
  verificationTokenSchema,
} from "../src/models";

const uri = "mongodb://localhost:27017/test";

const db = dbConnect(uri);

const UserModel = db.model("User", userSchema);
const AccountModel = db.model("Account", accountSchema);
const SessionModel = db.model("Session", sessionSchema);
const VerificationTokenModel = db.model(
  "VerificationToken",
  verificationTokenSchema
);

runBasicTests({
  adapter: MongooseAdapter(uri),
  db: {
    async disconnect() {
      await db.dropDatabase();
      await db.close();
    },
    async user(id) {
      const user = await UserModel.findById(id).lean();
      if (!user) return null;
      return format.from(user);
    },
    async account(provider_providerAccountId) {
      const account = await AccountModel.findOne(
        provider_providerAccountId
      ).lean();
      if (!account) return null;
      return format.from(account);
    },
    async session(sessionToken) {
      const session = await SessionModel.findOne({ sessionToken }).lean();
      if (!session) return null;
      return format.from(session);
    },
    async verificationToken(identifier_token) {
      const token =
        await VerificationTokenModel.findOne(identifier_token).lean();
      if (!token) return null;
      const { _id, __v, ...rest } = token;
      return rest;
    },
  },
});
