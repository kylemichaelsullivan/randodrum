import { memo, useMemo } from 'react';

import clsx from 'clsx';
import { getDurationSymbol, getDynamicSymbol } from '@/utils';
import { useDominantHand } from '@/components';

import type { Note } from '@/types';

type NoteDisplayProps = {
	note: Note;
};

function NoteDisplayComponent({ note }: NoteDisplayProps) {
	const { dominantHand } = useDominantHand();

	const noteSymbol = useMemo(() => {
		return getDurationSymbol(note.dur);
	}, [note.dur]);

	const dynamicSymbol = useMemo(() => {
		return note.dynamic !== 'normal' ? getDynamicSymbol(note.dynamic) : '';
	}, [note.dynamic]);

	const hasDrag = useMemo(() => {
		return note.ornament === 'drag';
	}, [note.ornament]);

	const hasGhost = useMemo(() => {
		return note.dynamic === 'ghost';
	}, [note.dynamic]);

	const hasFlam = useMemo(() => {
		return note.ornament === 'flam';
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
				<span className='text-sm font-medium'>{dynamicSymbol}</span>
			</div>
			<span
				className={clsx('NoteSymbol font-musisync text-5xl leading-none', {
					hasGhost,
					hasFlam,
					hasDrag,
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
