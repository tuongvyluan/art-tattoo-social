import ArtistInfo from 'layout/Artist/Profile';
import { fetcher } from 'lib';
import { BASE_URL } from 'lib/env';
import { ROLE } from 'lib/status';
import { useSession } from 'next-auth/react';
import Router from 'next/router';
import { useState } from 'react';
import { Loading } from 'ui';

const ProfilePage = () => {
	const { status, data } = useSession();
	const [profile, setProfile] = useState(undefined);

	if (status === 'loading') {
		return (
			<div className="flex items-center justify-center h-full">
				<Loading />
			</div>
		);
	}

	if (status === 'unauthenticated') {
		Router.replace('/');
		return (
			<div className="flex items-center justify-center h-full">
				<Loading />
			</div>
		);
	}

	if (status === 'authenticated') {
		if (!profile) {
			let myProfile = {
				id: data.user.id,
				fullName: data.user.fullName,
				email: '',
				phoneNumber: '',
				avatar: data.user.avatar
			};
			if (data.user.role === ROLE.ARTIST) {
				myProfile = {
					...myProfile,
					bioContent: '',
					styles: [],
					studios: undefined,
					role: ROLE.ARTIST
				};
				if (data.user.artistId) {
					fetcher(`${BASE_URL}/artists/${data.user.artistId}/artist-details`)
						.then((data) => {
							myProfile = {
								id: data.id,
								fullName: data.fullName,
								role: ROLE.ARTIST,
								phoneNumber: data.phoneNumber,
								email: data.email,
								bioContent: data.bioContent ? data.bioContent : '',
								avatar: data.avatar ? data.avatar : '/images/avatar.png',
								styles: data.artistStyles,
								studios: data.studioArtists?.sort(
									(a, b) =>
										new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
								)
							};
							setProfile(myProfile);
						})
						.catch((e) => {
							console.log(e);
						});
				} else {
					setProfile(myProfile);
				}
			} else {
				setProfile(myProfile);
			}

			return (
				<div className="flex items-center justify-center h-full">
					<Loading />
				</div>
			);
		} else {
			return (
				<ArtistInfo
					account={profile}
					onReload={() => {
						setProfile(undefined);
					}}
				/>
			);
		}
	}
};

export default ProfilePage;
