import { memo, useMemo } from 'react';

import clsx from 'clsx';
import { getDurationSymbol, getDynamicSymbol, getOrnamentSymbol } from '@/utils';
import { isDottedDuration } from '@/types/duration';
import { useDominantHand } from '@/components';

import type { Note } from '@/types';

type NoteDisplayProps = {
	note: Note;
};

function NoteDisplayComponent({ note }: NoteDisplayProps) {
	const { dominantHand } = useDominantHand();

	// Use optimized symbol lookup functions for O(1) performance
	const hasDot = useMemo(() => {
		return isDottedDuration(note.dur);
	}, [note.dur]);

	const noteSymbol = useMemo(() => {
		return getDurationSymbol(note.dur);
	}, [note.dur]);

	const dynamicSymbol = useMemo(() => {
		return note.dynamic !== 'normal' ? getDynamicSymbol(note.dynamic) : '';
	}, [note.dynamic]);

	const ornamentSymbol = useMemo(() => {
		return note.ornament ? getOrnamentSymbol(note.ornament) : '';
	}, [note.ornament]);

	const isDisplayedAsDominant = useMemo(() => {
		return (
			(note.isDominant && dominantHand === 'right') || (!note.isDominant && dominantHand === 'left')
		);
	}, [note.isDominant, dominantHand]);

	const stickingColor = useMemo(() => {
		return isDisplayedAsDominant ? 'text-green' : 'text-red';
	}, [isDisplayedAsDominant]);

	const stickingLetter = useMemo(() => {
		return isDisplayedAsDominant ? 'R' : 'L';
	}, [isDisplayedAsDominant]);

	return (
		<div className='NoteDisplay flex flex-col items-center justify-center flex-1 text-center text-black h-full min-h-[5rem]'>
			<div className='flex items-center justify-center h-5'>
				<span className='text-sm font-medium'>
					{dynamicSymbol}
					{ornamentSymbol ? ` ${ornamentSymbol}` : ''}
				</span>
			</div>
			<span
				className={clsx('NoteSymbol text-5xl font-musisync leading-none', {
					hasDot,
				})}
			>
				{noteSymbol}
			</span>
			<span className={`text-sm font-bold ${stickingColor}`}>{stickingLetter}</span>
		</div>
	);
}

export const NoteDisplay = memo(NoteDisplayComponent, (prevProps, nextProps) => {
	return (
		prevProps.note.dur === nextProps.note.dur &&
		prevProps.note.dynamic === nextProps.note.dynamic &&
		prevProps.note.ornament === nextProps.note.ornament &&
		prevProps.note.isDominant === nextProps.note.isDominant
	);
});

NoteDisplay.displayName = 'NoteDisplay';
