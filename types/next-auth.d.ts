import type { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role_id?: number | null;
      is_active?: boolean | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role_id?: number | null;
    is_active?: boolean | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role_id?: number | null;
    is_active?: boolean | null;
  }
}
