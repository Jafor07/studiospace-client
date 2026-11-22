import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

// A profile photo must be a short web link. Pasted image data (data:image/...)
// can be tens of thousands of characters long and would end up inside the
// session cookie and the login token, which have strict size limits.
function cleanImage(value) {
  if (typeof value !== "string") return null;
  const image = value.trim();
  if (!image || image.length > 500) return null;
  try {
    const { protocol } = new URL(image);
    return protocol === "https:" || protocol === "http:" ? image : null;
  } catch {
    return null;
  }
}

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
    // The assignment says "at least 6 characters" (BetterAuth's default is 8)
    minPasswordLength: 6,
  },
  // "Continue with Google" button on the Login and Register pages
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => ({
          data: { ...user, image: cleanImage(user.image) },
        }),
      },
      update: {
        before: async (user) => ({
          data: "image" in user ? { ...user, image: cleanImage(user.image) } : user,
        }),
      },
    },
  },

  plugins: [jwt()],
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 7 * 24 * 60 * 60,
    },
  },
});