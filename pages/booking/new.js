import BookingForm from 'layout/BookingForm';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import { useState } from 'react';
import { Loading } from 'ui';
import { v4 } from 'uuid';

const BookingFormPage = () => {
	const { data, status } = useSession();
  const [artist, setArtist] = useState({
    firstName: 'Vy',
    lastName: 'Luan',
    id: v4(),
    avatar: '/images/avatar.png'
  })
  const [isArtist, setIsArtist] = useState(true)
  const [studio, setStudio] = useState({})

  const router = useRouter();
  const artistId = router.query.artist ? router.query.artist : ''
  const studioId = router.query.studio ? router.query.studio : ''

  if (artistId === '' && studioId === '') {
    Router.replace('/')
  }
  if (studioId !== '') {
    setIsArtist(false)
  }

	if (status === 'loading') {
		return (
			<div className="flex items-center justify-center h-full">
				<Loading />
			</div>
		);
	}

	if (status === 'unauthenticated') {
		return (
			<div className="flex items-center justify-center h-full">
				<div>
					<div>Bạn phải đăng nhập để được đặt lịch</div>
					<div>
						Đi tới trang{' '}
						<Link href="/auth/signin" target="_blank">
							<span className="underline text-blue-700">đăng nhập</span>
						</Link>
						/
						<Link href="/auth/register" target="_blank">
							<span className="underline text-blue-700">đăng ký</span>
						</Link>
						?
					</div>
				</div>
			</div>
		);
	}

  return (
    <BookingForm isArtist={isArtist} artist={artist} studio={studio} />
  )
};

export default BookingFormPage;