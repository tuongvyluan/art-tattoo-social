import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { ROLE } from '../../../lib/status';
import { fetcherPost, readJwt } from 'lib';
import { BASE_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from 'lib/env';

const authOptions = {
	session: {
		strategy: 'jwt'
	},
	providers: [
		CredentialsProvider({
			id: 'credentials',
			type: 'credentials',
			credentials: {},
			async authorize(credentials, req) {
				const { email, password } = credentials;

				// perform login logic
				// find out user from db
				const payload = {
					email: email,
					password: password
				};
				const res = await fetcherPost(BASE_URL + '/Auth/Login', payload);

				// Read token from response
				const jwtObj = readJwt(res.jwt);
				// Check role
				const roleString = jwtObj['role'];
				let role;
				switch (roleString) {
					case 'Customer':
						role = ROLE.CUSTOMER;
						break;
					case 'Artist':
						role = ROLE.ARTIST;
						break;
					case 'Admin':
						role = ROLE.ADMIN;
						break;
					case 'StudioManager':
						role = ROLE.STUDIO;
						break;
					default:
						role = -1;
						break;
				}

				if (role === -1) {
					throw new Error('You are not allowed to access');
				}

				const token = {
					id: res.accountId,
					token: res.jwt,
					role: role,
					email: jwtObj['emailaddress'],
					fullName: res.fullName,
					studioId: res.studioId,
					customerId: res.customerId,
					artistId: res.artistId,
					accountId: res.accountId,
					avatar: res.avatar,
					studioName: res.studioName
				};

				// if everything is fine
				return token;
			}
		}),
		GoogleProvider({
			clientId: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET
		})
	],
	callbacks: {
		async jwt({ token, user, profile, trigger, session }) {
			if (trigger === 'update') {
				return { ...token, ...session.user };
			}
			// Only login with google the first time profile is not null
			// Here we fetch BE to get user info, the following time jwt will
			// not fall into this scope
			if (profile) {
				const data = await fetcherPost(`${BASE_URL}/Auth/GoogleAuth`, {
					token: user.name
				});
				const jwtObj = readJwt(data.accountResult.jwt);
				// Check role
				const roleString = jwtObj['role'];
				let role;
				switch (roleString) {
					case 'Customer':
						role = ROLE.CUSTOMER;
						break;
					case 'Artist':
						role = ROLE.ARTIST;
						break;
					case 'Admin':
						role = ROLE.ADMIN;
						break;
					case 'StudioManager':
						role = ROLE.STUDIO;
						break;
					default:
						role = -1;
						break;
				}
				return {
					fullName: data?.accountResult?.fullName,
					avatar: data?.accountResult?.avatar,
					id: data?.accountResult?.accountId,
					customerId: data?.accountResult?.customerId,
					studioId: data?.accountResult?.studioId,
					artistId: data?.accountResult?.artistId,
					studioName: data?.accountResult?.studioName,
					role: role
				};
			}
			if (user) {
				return {
					...token,
					accessToken: user.token,
					id: user.id,
					role: user.role,
					fullName: user.fullName,
					studioId: user.studioId,
					customerId: user.customerId,
					artistId: user.artistId,
					accountId: user.accountId,
					avatar: user.avatar,
					studioName: user.studioName
				};
			}
			return token;
		},
		async session({ session, token }) {
			if (token && session.user) {
				session.user.role = token.role;
				session.user.id = token.id;
				session.user.accessToken = token.accessToken;
				session.user.fullName = token.fullName;
				session.user.studioId = token.studioId;
				session.user.customerId = token.customerId;
				session.user.artistId = token.artistId;
				session.user.accountId = token.accountId;
				session.user.avatar = token.avatar;
				session.user.studioName = token.studioName;
			}
			return session;
		},
		async signIn({ account, profile, user, credentials }, options, param) {
			if (account.provider === 'google') {
				user.name = account.id_token;
				return profile.email_verified;
			} else {
				const { email, password } = credentials;

				// perform login logic
				// find out user from db
				const payload = {
					email: email,
					password: password
				};
				const res = await fetcherPost(BASE_URL + '/Auth/Login', payload);

				console.log(res)

				// Read token from response
				const jwtObj = readJwt(res.jwt);
				// Check role
				const roleString = jwtObj['role'];
				let role;
				switch (roleString) {
					case 'Customer':
						role = ROLE.CUSTOMER;
						break;
					case 'Artist':
						role = ROLE.ARTIST;
						break;
					case 'Admin':
						role = ROLE.ADMIN;
						break;
					case 'StudioManager':
						role = ROLE.STUDIO;
						break;
					default:
						role = -1;
						break;
				}

				if (role === -1) {
					throw new Error('You are not allowed to access');
				}

				const token = {
					id: res.accountId,
					token: res.jwt,
					role: role,
					email: jwtObj['emailaddress'],
					fullName: res.fullName,
					studioId: res.studioId,
					customerId: res.customerId,
					artistId: res.artistId,
					accountId: res.accountId,
					avatar: res.avatar,
					studioName: res.studioName
				};

				// if everything is fine
				return token;
			}
		}
	},
	pages: {
		signIn: '/auth/signin',
		signOut: '/auth/signout',
		error: '/auth/error', // Error code passed in query string as ?error=
		verifyRequest: '/auth/verify', // (used for check email message)
		newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
	},
	secret: process.env.NEXT_PUBLIC_SECRET
};
export default NextAuth(authOptions);
