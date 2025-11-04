import { DisplaySize } from './DisplaySize';
import { HandLegend } from './HandLegend';

export function DisplayFooter() {
	return (
		<div className='DisplayFooter border-light-gray flex flex-col items-center justify-around gap-4 border-t pt-4 sm:flex-row'>
			<HandLegend />
			<DisplaySize />
		</div>
	);
}
