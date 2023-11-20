import TattooListPage from 'layout/TattooList';
import { Card, CardBody } from 'ui';

const TattooDetails = () => {
	return (
    <div>
      <Card>
        <CardBody>
          <div className='block md:flex md:gap-3 md:items-start'>
            <div></div>
          </div>
        </CardBody>
      </Card>
      <TattooListPage />
    </div>
  )
}

export default TattooDetails;