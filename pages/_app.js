import '../index.css';

import App from 'next/app';
import AppProvider from 'components/AppProvider';
import Head from 'next/head';
import Page from 'layout/Page';
import { SessionProvider } from 'next-auth/react';

class MyApp extends App {
	render() {
		const { Component, pageProps } = this.props;

		return (
			<>
				<Head>
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<meta charSet="utf-8" />
					<link
						rel="apple-touch-icon"
						sizes="180x180"
						href="/images/ATL.png"
					/>
					<link
						rel="icon"
						type="/images/png"
						sizes="32x32"
						href="/images/ATL.png"
					/>
					<link
						rel="icon"
						type="/images/png"
						sizes="16x16"
						href="/images/ATL.png"
					/>
					<link
						rel="mask-icon"
						href="/images/ATL.png"
						color="#5bbad5"
					/>
					<meta name="msapplication-TileColor" content="#da532c" />
					<meta name="theme-color" content="#ffffff" />
					<meta property="og:image" content="/images/ATL.png"></meta>
					<link rel="preconnect" href="https://fonts.gstatic.com"></link>
					<title>ATL - Art Tattoo Lover Platform</title>
				</Head>
				<SessionProvider session={pageProps.session}>
					<AppProvider>
						<Page>
							<Component {...pageProps} />
						</Page>
					</AppProvider>
				</SessionProvider>
			</>
		);
	}
}

MyApp.getInitialProps = async (appContext) => ({
	...(await App.getInitialProps(appContext))
});

export default MyApp;
