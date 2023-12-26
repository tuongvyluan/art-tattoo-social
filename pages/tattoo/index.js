import TattooStudioTabs from 'components/TattooStudioTabs';
import TattooListPage from 'layout/TattooList';
import { BASE_URL } from 'lib/env';

const TattooList = () => {
	return (
		<div className='min-h-body'>
			<TattooStudioTabs />
			<TattooListPage url={`${BASE_URL}/TattooArts/AllTattooArts`} pageSize={12} />
		</div>
	);
};

TattooList.getInitialProps = async () => ({
	namespacesRequired: ['header', 'footer', 'sidebar']
});

export default TattooList;
