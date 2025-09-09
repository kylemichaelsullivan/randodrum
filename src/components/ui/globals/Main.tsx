import { DisplayBeat, GenerateBeat } from '@/components/ui/sections';

export function Main() {
	return (
		<main className='Main flex flex-col gap-4 items-center justify-center p-4'>
			<GenerateBeat />
			<DisplayBeat />
		</main>
	);
}
