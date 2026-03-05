import NextAuth, { NextAuthOptions, Session } from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import NaverProvider from "next-auth/providers/naver";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcryptjs";
import hashSocialID from "../../../lib/utils/hashSocialID";

declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
      provider: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: "user" | "admin";
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    provider?: string | null;
    role: "user" | "admin";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    name?: string | null;
    email?: string | null;
    picture?: string | null;
    provider?: string | null;
    role?: "user" | "admin";
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 3 * 60 * 60,
  },
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
      id: "kakao",
      name: "Kakao",
      version: "2.0",
      authorization: {
        url: "https://kauth.kakao.com/oauth/authorize",
        params: { scope: "profile_nickname profile_image" },
      },
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.properties?.nickname || null,
          email: profile.kakao_account?.email || null,
          provider: "kakao",
          image: profile.properties?.profile_image || null,
          role: "user",
        };
      },
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID ?? "",
      clientSecret: process.env.NAVER_CLIENT_SECRET ?? "",
      profile(profile) {
        return {
          id: profile.response.id.toString(),
          name: profile.response.name,
          email: profile.response.email,
          provider: "naver",
          image: profile.response.profile_image || null,
          role: "user",
        };
      },
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "example@mail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db("mymovieticket");
        const user = await db.collection("users").findOne<{
          profileImage: string | null | undefined;
          _id: any;
          email: string;
          password: string;
          name: string;
          role: "user" | "admin";
        }>({
          email: credentials!.email,
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials!.password,
          user.password,
        );
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.profileImage ?? null,
          provider: "credentials",
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, profile, session, trigger }) {
      if (trigger === "update" && session) {
        const { name, email, image } = session;
        if (name) token.name = name;
        if (image) token.picture = image;
        if (email) token.email = email;
        return token;
      }

      if (account?.provider === "credentials" && user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.provider = "credentials";
        token.role = user.role;
      }

      if (account?.provider === "kakao" || account?.provider === "naver") {
        const client = await clientPromise;
        const db = client.db("mymovieticket");
        const users = db.collection("users");

        const provider = account.provider;
        const providerId = token.sub as string;
        const socialKey = hashSocialID(provider, providerId);

        const email =
          provider === "kakao"
            ? (profile as any).kakao_account?.email || null
            : (profile as any).response?.email || null;

        const adminEmails = (process.env.ADMIN_EMAILS ?? "")
          .split(",")
          .map((email) => email.trim())
          .filter((email) => email.length > 0);

        const emailLower = (email ?? "").toLowerCase();
        const FindAdminEmail = adminEmails.includes(emailLower)
          ? "admin"
          : "user";

        if (!token.role && token.id) {
          const client = await clientPromise;
          const db = client.db("mymovieticket");
          const u = await db
            .collection("users")
            .findOne({ _id: new (require("mongodb").ObjectId)(token.id) });
          if (u) {
            token.role = u.role ?? "user";
          }
        }

        await users.updateOne(
          { provider, socialKey },
          {
            $setOnInsert: {
              provider,
              socialKey,
              name: profile?.name || "",
              email: email,
              profileImage: profile?.image || null,
              agreeSms: false,
              agreeEmail: false,
              role: FindAdminEmail,
            },
          },
          { upsert: true },
        );

        const userDoc = await users.findOne({ provider, socialKey });
        if (userDoc) {
          token.id = userDoc._id.toString();
          token.provider = provider;
          token.role = userDoc.role ?? "user";
          token.picture = userDoc.profileImage || null;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        name: token.name as string,
        email: token.email as string,
        image: token.picture as string,
        provider: token.provider as string,
        role: token.role as "user" | "admin",
      };

      return session;
    },
  },
  pages: {
    signIn: "/authPage/signup",
    signOut: "/",
  },
  debug: false,
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};

export default NextAuth(authOptions);
