import type {
  Adapter,
  AdapterUser,
  AdapterAccount,
  AdapterSession,
  VerificationToken,
} from "@auth/core/adapters";
import dbConnect from "./db.js";
import {
  accountSchema,
  sessionSchema,
  userSchema,
  verificationTokenSchema,
} from "./models.js";

export const format = {
  /** Takes a MongoDB object and returns a plain old JavaScript object */
  from<T = Record<string, unknown>>(object: Record<string, any>): T {
    const newObject: Record<string, unknown> = {};
    for (const key in object) {
      const value = object[key];
      if (key === "_id") {
        newObject.id = value.toHexString();
      } else if (key === "userId") {
        newObject[key] = value.toHexString();
      } else {
        newObject[key] = value;
      }
    }
    return newObject as T;
  },
};

export function MongooseAdapter(uri: string): Adapter {
  const { from } = format;

  const db = dbConnect(uri);

  const UserModel = db.model("User", userSchema);
  const AccountModel = db.model("Account", accountSchema);
  const SessionModel = db.model("Session", sessionSchema);
  const VerificationTokenModel = db.model(
    "VerificationToken",
    verificationTokenSchema
  );

  return {
    async createUser(data) {
      const user = await UserModel.create(data);
      return from<AdapterUser>(user);
    },
    async getUser(id) {
      try {
        const user = await UserModel.findById(id).lean();
        if (!user) return null;
        return from<AdapterUser>(user);
      } catch (error) {
        return null;
      }
    },
    async getUserByEmail(email) {
      const user = await UserModel.findOne({ email: email }).lean();
      if (!user) return null;
      return from<AdapterUser>(user);
    },
    async getUserByAccount(provider_providerAccountId) {
      const account = await AccountModel.findOne(
        provider_providerAccountId
      ).lean();
      if (!account) return null;
      const user = await UserModel.findById(account.userId).lean();
      if (!user) return null;
      return from<AdapterUser>(user);
    },
    async updateUser(data) {
      const user = await UserModel.findByIdAndUpdate(data.id, data, {
        new: true,
      }).lean();
      return from<AdapterUser>(user!);
    },
    async deleteUser(id) {
      await Promise.all([
        AccountModel.deleteMany({ userId: id }),
        SessionModel.deleteMany({ userId: id }),
        UserModel.findByIdAndDelete(id),
      ]);
    },
    linkAccount: async (data) => {
      const account = await AccountModel.create(data);
      return from<AdapterAccount>(account);
    },
    async unlinkAccount(provider_providerAccountId) {
      await AccountModel.findOneAndDelete(provider_providerAccountId);
    },
    async getSessionAndUser(sessionToken) {
      const session = await SessionModel.findOne({
        sessionToken,
      }).lean();
      if (!session) return null;
      const user = await UserModel.findById(session.userId).lean();
      if (!user) return null;
      return {
        user: from<AdapterUser>(user),
        session: from<AdapterSession>(session),
      };
    },
    async createSession(data) {
      const session = await SessionModel.create(data);
      return from<AdapterSession>(session);
    },
    async updateSession(data) {
      const session = await SessionModel.findOneAndUpdate(
        {
          sessionToken: data.sessionToken,
        },
        data,
        { new: true }
      ).lean();
      return from<AdapterSession>(session!);
    },
    async deleteSession(sessionToken) {
      await SessionModel.findOneAndDelete({
        sessionToken,
      });
    },
    async createVerificationToken(data) {
      const verificationToken = await VerificationTokenModel.create(data);
      return from<VerificationToken>(verificationToken);
    },
    async useVerificationToken(identifier_token) {
      const verificationToken =
        await VerificationTokenModel.findOneAndDelete(identifier_token).lean();
      if (!verificationToken) return null;
      const { _id, __v, ...rest } = verificationToken;
      return rest;
    },
  };
}
