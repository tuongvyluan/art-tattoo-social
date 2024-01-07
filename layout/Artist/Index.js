import TattooListNotFilter from 'layout/TattooListNotFilter';
import { BASE_URL } from 'lib/env';
import PropTypes from 'prop-types';
import ArtistIndexProfileSection from './ArtistIndexProfileSection';

const ArtistPage = ({ artist, account }) => {
	return (
		<div className="relative">
			{
				// Artist profile
			}
			<ArtistIndexProfileSection artist={artist} account={account} />
			<div className="hidden md:block pb-5 pt-0 text-center text-3xl text-gray-700">
				Tác phẩm
			</div>
			<TattooListNotFilter
				url={`${BASE_URL}/TattooArts/TattooUser?artistId=${artist.id}${
					account?.id ? '&accountId=' + account?.id : ''
				}`}
				pageSize={12}
			/>
		</div>
	);
};

ArtistPage.propTypes = {
	artist: PropTypes.object.isRequired,
	account: PropTypes.object
};

export default ArtistPage;
