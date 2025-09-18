import { Header, Main, Footer } from '@/components';

export default function Page() {
	return (
		<div className='Page relative flex flex-col min-h-screen'>
			<Header />
			<Main />
			<Footer />
		</div>
	);
}
