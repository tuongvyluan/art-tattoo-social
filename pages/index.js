import TattooListPage from 'layout/TattooList';

const TattooList = () => {
	return <TattooListPage url='/api/tattooArt' pageSize={20} />;
};

export default TattooList;
