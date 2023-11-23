import ArtistInfo from 'layout/Artist/Profile';
import { fetcher, fetcherPost, fetcherPut } from 'lib';
import { BASE_URL } from 'lib/env';
import { ARTIST_STATUS, ROLE } from 'lib/status';
import { useSession } from 'next-auth/react';
import Router from 'next/router';
import { useState } from 'react';
import { Loading } from 'ui';

const ProfilePage = () => {
	const { status, data } = useSession();
	const [profile, setProfile] = useState(undefined);
	const [studios, setStudios] = useState([]);
	const [styles, setStyles] = useState([]);

	const handleSubmit = (account, artistStyles, artistStudios) => {
		fetcherPut(`${BASE_URL}/artist-profile`, account)
	};

	if (status === 'loading') {
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
				firstName: '',
				lastName: '',
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
							firstName: data.firstName,
							lastName: data.lastName,
							role: ROLE.ARTIST,
							bioContent: data.bioContent ? data.bioContent : '',
							avatar: data.avatar ? data.avatar : '/images/avatar.png',
							styles: data.artistStyles,
							studios: data.studioArtists
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
			return <ArtistInfo handleSubmit={handleSubmit} account={profile} />;
		}
	} else {
		Router.replace('/');
	}
};

export default ProfilePage;
