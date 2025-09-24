import { memo, useMemo } from 'react';

import clsx from 'clsx';
import { getNoteSymbol, getRestSymbol } from '@/types';
import { useDominantHand } from '@/components';

import type { Note } from '@/types';

type NoteDisplayProps = {
	note: Note;
};

function NoteDisplayComponent({ note }: NoteDisplayProps) {
	const { dominantHand } = useDominantHand();

	const noteSymbol = useMemo(() => {
		return note.isRest ? getRestSymbol(note.dur) : getNoteSymbol(note.dur);
	}, [note.dur, note.isRest]);

	const hasAccent = useMemo(() => {
		return !note.isRest && note.dynamic === 'Accent';
	}, [note.dynamic, note.isRest]);

	const hasRimshot = useMemo(() => {
		return !note.isRest && note.dynamic === 'Rimshot';
	}, [note.dynamic, note.isRest]);

	const hasDrag = useMemo(() => {
		return !note.isRest && note.ornament === 'Drag';
	}, [note.ornament, note.isRest]);

	const hasFlam = useMemo(() => {
		return !note.isRest && note.ornament === 'Flam';
	}, [note.ornament, note.isRest]);

	const isDisplayedAsDominant = useMemo(() => {
		return (
			!note.isRest &&
			((note.isDominant && dominantHand === 'right') ||
				(!note.isDominant && dominantHand === 'left'))
		);
	}, [note.isDominant, dominantHand, note.isRest]);

	const stickingColor = useMemo(() => {
		return isDisplayedAsDominant ? 'text-green' : 'text-red';
	}, [isDisplayedAsDominant]);

	const stickingLetter = useMemo(() => {
		return isDisplayedAsDominant ? 'R' : 'L';
	}, [isDisplayedAsDominant]);

	return (
		<div className='NoteDisplay flex flex-col items-center justify-center flex-1 text-center text-black h-full min-h-[5rem]'>
			<span
				className={clsx('NoteSymbol font-musisync text-5xl leading-none', {
					hasAccent,
					hasRimshot,
					hasDrag,
					hasFlam,
				})}
			>
				{noteSymbol}
			</span>
			{!note.isRest && (
				<span className={`text-sm font-bold ${stickingColor}`}>{stickingLetter}</span>
			)}
		</div>
	);
}

export const NoteDisplay = memo(NoteDisplayComponent, (prevProps, nextProps) => {
	return (
		prevProps.note.dur === nextProps.note.dur &&
		prevProps.note.isRest === nextProps.note.isRest &&
		prevProps.note.dynamic === nextProps.note.dynamic &&
		prevProps.note.ornament === nextProps.note.ornament &&
		prevProps.note.isDominant === nextProps.note.isDominant
	);
});

NoteDisplay.displayName = 'NoteDisplay';
