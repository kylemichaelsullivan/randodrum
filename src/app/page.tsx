import { Header } from '@/components/ui/globals/Header';
import { Main } from '@/components/ui/globals/Main';
import { Footer } from '@/components/ui/globals/Footer';

export default function Page() {
	return (
		<div className='Page relative flex flex-col min-h-screen'>
			<Header />
			<Main />
			<Footer />
		</div>
	);
}
