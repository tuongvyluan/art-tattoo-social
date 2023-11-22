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
	const [loading, setLoading] = useState(true);
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
						setLoading(false);
					})
					.catch((e) => {
						setLoading(false);
						return <ArtistInfo account={myProfile} handleSubmit={handleSubmit} />;
					});
			} else {
				setLoading(false);
			}
			setProfile(myProfile);
		}
		if (loading) {
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
