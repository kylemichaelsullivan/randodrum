import { Export, Import } from '@/components';

export function Footer() {
	const year = new Date().getFullYear();
	return (
		<footer className='Footer flex items-center justify-between border-t border-black px-1 py-2'>
			<Import />
			<p className='text-sm'>©&nbsp;{year} RandoDrum</p>
			<Export />
		</footer>
	);
}
