import Link from 'next/link';
import { useRouter } from 'next/router';

const TattooStudioTabs = () => {
	const router = useRouter();
	const isStudioTab = router.pathname.includes('studio');
	return (
		<div className="flex flex-wrap mx-6 mb-3 border-b border-gray-300 text-base">
			<div
				className={`px-3 pb-2 border-b cursor-pointer ${
					!isStudioTab && 'border-gray-600 font-semibold'
				}`}
			>
				<Link href={'/tattoo'}>
					<div className="text-black">Hình xăm</div>
				</Link>
			</div>
			<div
				className={`px-3 pb-2 border-b cursor-pointer ${
					isStudioTab && 'border-gray-600 font-semibold'
				}`}
			>
				<Link className="text-black" href={'/studio'}>
					<div className="text-black">Tiệm xăm</div>
				</Link>
			</div>
		</div>
	);
};

export default TattooStudioTabs;
