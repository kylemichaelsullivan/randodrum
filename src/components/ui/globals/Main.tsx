import { DisplayBeat, GenerateBeat } from '@/components';

export function Main() {
	return (
		<main className='Main flex flex-auto flex-col items-center justify-center gap-4 p-4'>
			<GenerateBeat />
			<DisplayBeat />
		</main>
	);
}
