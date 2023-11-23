import TattooListPage from 'layout/TattooList';
import { BASE_URL } from 'lib/env';

const TattooList = () => {
	return <TattooListPage url={`${BASE_URL}/TattooArts/AllTattooArts`} pageSize={25} />;
};

export default TattooList;
