import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { client } from '../../../../../lib/urqlClient';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        // Look up the user from the credentials supplied
        const SignInQuery = `
          query($email: String!) {
            user(email: $email) {
            id
            name  
            email
            password
            }
          }
        `;
        // if credentials is undefined, return null
        if (!credentials) {
          return null;
        }
        const result = await client
          .query(SignInQuery, {
            email: credentials.email,
          })
          .toPromise();
        if (result.data) {
          if (!result.data.user) {
            return null;
          }
          // Match passwords
          if (
            await bcrypt.compare(
              credentials.password,
              result.data.user.password,
            )
          ) {
            // Any object returned will be saved in `user` property of the JWT
            return {
              id: result.data.user.id,
              name: result.data.user.name,
              email: result.data.user.email,
            };
          } else {
            return null;
          }
        } else {
          // Return null then an error will be displayed advising the user to check their details.
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 15 * 60, // token is valid for 15 minutes
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // Control token valid period
    async jwt({ token, user, account }) {
      const now = Math.floor(Date.now() / 1000); // current time in seconds

      // First time: when user logs in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.iat = now; // record issue time
      }

      // If signed in with Google, store OAuth tokens
      if (account?.provider === 'google') {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = account.expires_in; // epoch seconds
      }

      // If signed in via Google and token is expired, refresh it
      if (
        token.accessTokenExpires &&
        now >= (token.accessTokenExpires as number) &&
        token.refreshToken
      ) {
        try {
          const refreshed = await refreshGoogleAccessToken(
            token.refreshToken as string,
          );
          token.accessToken = refreshed.access_token;
          token.accessTokenExpires = now + refreshed.expires_in;
          token.refreshToken = refreshed.refresh_token ?? token.refreshToken;
        } catch (err) {
          console.error('Failed to refresh access token:', err);
          token.error = 'RefreshAccessTokenError';
        }
      }

      const refreshInterval = 5 * 60; // 5 mins

      // Reissue the token if it's older than refreshInterval (Credentails login)
      if (token.iat && now - Number(token.iat) > refreshInterval) {
        token.iat = now;
      }

      return token;
    },
    async session({ session, token }) {
      // You control what session() returns to the client here
      if (session.user) {
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }

      // Add any custom fields to session if needed
      // session.customField = token.customField;

      return session;
    },
    // async redirect({ url, baseUrl }) {
    //   // Allow relative URLs (e.g. /dashboard)
    //   if (url.startsWith('/')) return baseUrl + url;
    //   // Allow absolute URLs only if same origin
    //   if (new URL(url).origin === baseUrl) return url;
    //   // Otherwise, fallback to baseUrl (e.g., homepage)
    //   return baseUrl;
    // },
  },
});

async function refreshGoogleAccessToken(refreshToken: string) {
  const url =
    'https://oauth2.googleapis.com/token?' +
    new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to refresh token');
  }

  return data;
}

export { handler as GET, handler as POST };
