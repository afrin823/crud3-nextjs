import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@models/user"; // User model for MongoDB
import { connectToDB } from "@/utils/database";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        await connectToDB();

        const { email, password } = credentials;

        // Check if the user is trying to sign up or sign in based on the request
        const existingUser = await User.findOne({ email });

        if (existingUser) {
          // This is a sign-in flow
          if (existingUser.password === password) {
            return existingUser;
          } else {
            throw new Error('Invalid credentials');
          }
        } else {
          // This is a sign-up flow
          const newUser = new User({
            name: "Anonymous", // Default name or you can request the name
            email,
            password, // Storing plain text password (not secure for production)
          });

          await newUser.save(); // Save the new user to the database
          return newUser;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      const user = await User.findOne({ email: session.user.email });
      session.user.id = user._id;
      return session;
    },
  },
  pages: {
    signIn: '/auth', // Custom sign-in/sign-up page
  },
});

export { handler as GET, handler as POST };