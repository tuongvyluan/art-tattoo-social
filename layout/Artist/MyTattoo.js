import Button from 'components/Button';
import TattooListUpdate from 'layout/TattooListUpdate';
import { ROLE } from 'lib/status';
import PropTypes from 'prop-types';

const ArtistMyTattooPage = ({url}) => {
	return (
		<div>
			<div className="flex pb-3">
				<a href={`/tattoo/update/new`}>
					<div>
						<Button>Thêm hình xăm</Button>
					</div>
				</a>
			</div>
			<TattooListUpdate role={ROLE.ARTIST} url={url} />
		</div>
	);
};

ArtistMyTattooPage.propTypes = {
	url: PropTypes.string.isRequired
};

export default ArtistMyTattooPage;
