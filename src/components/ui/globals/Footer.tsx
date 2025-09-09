import { Export, Import } from '../buttons';

export function Footer() {
	const year = new Date().getFullYear();
	return (
		<footer className='Footer flex justify-between items-center border-t border-black p-1'>
			<Import />
			<p className='text-sm'>©&nbsp;{year} RandoDrum</p>
			<Export />
		</footer>
	);
}
