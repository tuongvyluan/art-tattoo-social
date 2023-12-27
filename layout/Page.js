import { useEffect, useState } from 'react';

import Footer from './Footer';
import Head from 'next/head';
import Header from './Header';
import NProgress from 'nprogress';
import Router from 'next/router';
import SidebarMenu from './SidebarMenu';
import { useAppState } from 'components/AppProvider';
import { useRouter } from 'next/router';
import getPageName from 'lib/pageNames';

const NonDashboardRoutes = [
	'/auth/signin',
	'/auth/register',
	'/auth/verify',
	'/forgot',
	'/lockscreen',
	'/_error',
	'/404',
	'/coming-soon',
	'/maintenance',
	'/landing'
];

const FooterHidden = [
	// '/',
	// '/tattoo',
	// '/tattoo/[id]',
	'/artist/[id]',
  '/booking/new',
	'/messages',
	'/taskboard',
	'/maps/dark',
	'/maps/satellite',
	'/media',
	'/chat',
	'/maps/vector',
	'/calendar',
	'/music',
	'/flow'
];

const Page = ({ children }) => {
	const [state] = useAppState();
	const [open, setOpen] = useState(true);
	const { pathname, asPath } = useRouter();

	useEffect(() => {
		setOpen(!state.mobile);
	}, [state.mobile]);

	const onSetOpen = (open) => {
		setOpen(open);
	};

	const toggleOpen = (ev) => {
		setOpen(!open);

		if (ev) {
			ev.preventDefault();
		}
	};

	Router.onRouteChangeStart = () => {
		NProgress.start();
	};
	Router.onRouteChangeComplete = () => {
		if (state.mobile) setOpen(false);
		NProgress.done();
		document.querySelector('body').scrollTop = 0;
	};
	Router.onRouteChangeError = () => {
		NProgress.done();
	};

	const isNotDashboard = NonDashboardRoutes.includes(pathname);
	const isFooterHidden = FooterHidden.includes(pathname);
	const sidebar = <SidebarMenu />;

	const sidebarProps = {
		sidebar,
		width: 210,
		open,
		onSetOpen: onSetOpen,
		breakpoint: state.mobile,
		sidebarClass: `${state.stickySidebar ? 'md:sticky h-screen' : 'md:relative'}`,
		contentClass: 'min-h-screen'
	};

	const pageName = asPath.split('/').at(1).split('?').at(0);

	return (
		<>
			<Head>
				<title>
					{getPageName(pageName) ? getPageName(pageName) + ' | ATL' : 'Art Tattoo Lover'}
				</title>
			</Head>

			<div
				className={`antialiased font-sans text-sm text-gray-900 dark:text-white w-full h-full min-h-screen bg-body dark:bg-gray-700 z-0 ${
					state.collapsed && 'page-sidebar-collapsed'
				} `}
				dir={state.rtl ? 'rtl' : 'ltr'}
			>
				{!isNotDashboard ? (
					<div>
						<Header toggleOpen={toggleOpen} />

						<div
							className={`w-full flex-1 relative pt-4 pr-4 pl-4 mx-auto min-h-body ${
								pathname === '/messages' ? 'p-0' : ''
							}`}
						>
							{children}
						</div>
						{!isFooterHidden && <Footer />}
					</div>
				) : (
					children
				)}
			</div>
		</>
	);
};

export default Page;
