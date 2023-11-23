import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { ROLE } from '../../../lib/status';
import { fetcherPost, readJwt } from 'lib';
import { BASE_URL } from 'lib/env';

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
					firstName: jwtObj['surname'],
					lastName: jwtObj['name'],
					studioId: res.studioId,
					customerId: res.customerId,
					artistId: res.artistId,
					accountId: res.accountId
				}

				// if everything is fine
				return token;
			}
		})
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				return {
					...token,
					accessToken: user.token,
					id: user.id,
					role: user.role,
					firstName: user.firstName,
					lastName: user.lastName,
					studioId: user.studioId,
					customerId: user.customerId,
					artistId: user.artistId,
					accountId: user.accountId
				};
			}
			return token;
		},
		async session({ session, token }) {
			if (token && session.user) {
				session.user.role = token.role;
				session.user.id = token.id;
				session.user.accessToken = token.accessToken;
				session.user.firstName = token.firstName;
				session.user.lastName = token.lastName;
				session.user.studioId = token.studioId;
				session.user.customerId = token.customerId;
				session.user.artistId = token.artistId;
				session.user.accountId = token.accountId;
			}
			return session;
		}
	},
	pages: {
		signIn: '/auth/signin',
		signOut: '/auth/signout',
		error: '/auth/error', // Error code passed in query string as ?error=
		verifyRequest: '/auth/verify-request', // (used for check email message)
		newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
	},
	secret: process.env.NEXT_PUBLIC_SECRET
};
export default NextAuth(authOptions);
