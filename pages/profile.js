import ArtistInfo from 'layout/Artist/Profile';
import { fetcher, fetcherPost } from 'lib';
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
		console.log(artist, artistStyles, artistStudios);
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
				firstName: '',
				lastName: '',
				email: '',
				phoneNumber: ''
			};
			if (data.user.role === ROLE.ARTIST) {
				myProfile = {
					...myProfile,
					bio: '',
					styles: [],
					studios: []
				};
				fetcher(`${BASE_URL}/artists/${data.user.id}/artist-details`)
					.then((data) => {
						console.log('success');
					})
					.catch((e) => {
						fetcherPost(`${BASE_URL}/Auth/CreateArtist`, {
							id: data.user.id,
							bioContent: '',
							status: ARTIST_STATUS.AVAILABLE,
							styleIds: []
						})
							.then((data) => {
								fetcher(`${BASE_URL}/artists/${data.user.id}/artist-details`)
									.then((data) => {
										myProfile = data;
									})
									.catch((e) => {
										console.log(e);
									});
							})
							.catch((e) => {
								console.log(e);
							});
					});
			}
			setProfile(myProfile);
			console.log([profile]);
			return (
				<div className="flex items-center justify-center h-full">
					<Loading />
				</div>
			);
		}
	} else {
		Router.replace('/');
	}

	return <ArtistInfo handleSubmit={handleSubmit} account={profile} />;
};

export default ProfilePage;
