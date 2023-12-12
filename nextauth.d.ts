import { DefaultSession, DefaultUser } from "next-auth";
// Define a role enum
export enum Role {
  customer = "customer",
  artist = "artist",
}
// common interface for JWT and Session
interface IUser extends DefaultUser {
  role?: Role;
  id?: string;
  token?: string;
  fullName?: string;
  studioId?: string;
  customerId?: string;
  artistId?: string;
  accountId?: string;
  avatar?: string;
  studioName?: string;
}
declare module "next-auth" {
  interface User extends IUser {}
  interface Session {
    user?: User;
  }
}
declare module "next-auth/jwt" {
  interface JWT extends IUser {}
}