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
				fullName: '',
				email: '',
				phoneNumber: ''
			};
			if (data.user.role === ROLE.ARTIST) {
				myProfile = {
					...myProfile,
					bioContent: '',
					styles: [],
					studios: [],
					role: ROLE.ARTIST
				};
				fetcher(`${BASE_URL}/artists/${data.user.id}/artist-details`)
					.then((data) => {
						myProfile = {
							id: data.id,
							fullName: data.fullName,
							role: ROLE.ARTIST,
							bioContent: data.bioContent ? data.bioContent : '',
							avatar: data.avatar ? data.avatar : '/images/avatar.png',
							styles: data.artistStyles,
							studio: data.studioArtists?.at(0)
						};
						setProfile(myProfile);
					})
					.catch((e) => {
						console.log(e);
					});
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
