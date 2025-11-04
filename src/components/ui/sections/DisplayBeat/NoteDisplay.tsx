import { useMemo } from 'react';

import clsx from 'clsx';
import { createMemoizedComponent } from '@/utils';
import { getNoteSymbol, getRestSymbol } from '@/types';
import { useSticking } from '@/components';

import type { DisplayUnit } from '@/types';

type NoteDisplayProps = {
	displayUnit: DisplayUnit;
};

function NoteDisplayComponent({ displayUnit }: NoteDisplayProps) {
	const { sticking } = useSticking();

	const displayProps = useMemo(() => {
		if (displayUnit.type === 'single') {
			const note = displayUnit.note;
			const isRest = note.isRest;
			const noteSymbol = isRest
				? getRestSymbol(note.dur)
				: getNoteSymbol(note.dur, note.symbolOverride);

			// Dynamic properties (only for notes, not rests)
			const hasAccent = !isRest && note.dynamic === 'Accent';
			const hasRimshot = !isRest && note.dynamic === 'Rimshot';
			const hasDrag = !isRest && note.ornament === 'Drag';
			const hasFlam = !isRest && note.ornament === 'Flam';

			// Sticking properties (only for notes, not rests)
			const isDisplayedAsDominant = isRest
				? false
				: note.isDominant === (sticking === 'right');
			const stickingColor = isDisplayedAsDominant ? 'text-green' : 'text-red';
			const stickingLetter = isDisplayedAsDominant ? 'R' : 'L';

			return {
				type: 'single' as const,
				noteSymbol,
				hasAccent,
				hasRimshot,
				hasDrag,
				hasFlam,
				stickingColor,
				stickingLetter,
				isRest,
			};
		} else if (displayUnit.type === 'triplet') {
			// Triplet pattern (3 notes, may include rests)
			const [note1, note2, note3] = displayUnit.notes;

			// Get properties for each note (handle rests)
			const note1IsDominant =
				!note1.isRest && note1.isDominant === (sticking === 'right');
			const note2IsDominant =
				!note2.isRest && note2.isDominant === (sticking === 'right');
			const note3IsDominant =
				!note3.isRest && note3.isDominant === (sticking === 'right');

			return {
				type: 'triplet' as const,
				symbol: displayUnit.symbol,
				className: displayUnit.className,
				note1: {
					isRest: note1.isRest,
					hasAccent: !note1.isRest && note1.dynamic === 'Accent',
					hasRimshot: !note1.isRest && note1.dynamic === 'Rimshot',
					hasDrag: !note1.isRest && note1.ornament === 'Drag',
					hasFlam: !note1.isRest && note1.ornament === 'Flam',
					stickingColor: note1IsDominant ? 'text-green' : 'text-red',
					stickingLetter: !note1.isRest ? (note1IsDominant ? 'R' : 'L') : '',
				},
				note2: {
					isRest: note2.isRest,
					hasAccent: !note2.isRest && note2.dynamic === 'Accent',
					hasRimshot: !note2.isRest && note2.dynamic === 'Rimshot',
					hasDrag: !note2.isRest && note2.ornament === 'Drag',
					hasFlam: !note2.isRest && note2.ornament === 'Flam',
					stickingColor: note2IsDominant ? 'text-green' : 'text-red',
					stickingLetter: !note2.isRest ? (note2IsDominant ? 'R' : 'L') : '',
				},
				note3: {
					isRest: note3.isRest,
					hasAccent: !note3.isRest && note3.dynamic === 'Accent',
					hasRimshot: !note3.isRest && note3.dynamic === 'Rimshot',
					hasDrag: !note3.isRest && note3.ornament === 'Drag',
					hasFlam: !note3.isRest && note3.ornament === 'Flam',
					stickingColor: note3IsDominant ? 'text-green' : 'text-red',
					stickingLetter: !note3.isRest ? (note3IsDominant ? 'R' : 'L') : '',
				},
			};
		} else if (displayUnit.type === 'beamed') {
			// Beamed pair
			const [note1, note2] = displayUnit.notes;

			// Get properties for each note
			const note1IsDominant = note1.isDominant === (sticking === 'right');
			const note2IsDominant = note2.isDominant === (sticking === 'right');

			return {
				type: 'beamed' as const,
				symbol: displayUnit.symbol,
				className: displayUnit.className,
				note1: {
					hasAccent: note1.dynamic === 'Accent',
					hasRimshot: note1.dynamic === 'Rimshot',
					hasDrag: note1.ornament === 'Drag',
					hasFlam: note1.ornament === 'Flam',
					stickingColor: note1IsDominant ? 'text-green' : 'text-red',
					stickingLetter: note1IsDominant ? 'R' : 'L',
				},
				note2: {
					hasAccent: note2.dynamic === 'Accent',
					hasRimshot: note2.dynamic === 'Rimshot',
					hasDrag: note2.ornament === 'Drag',
					hasFlam: note2.ornament === 'Flam',
					stickingColor: note2IsDominant ? 'text-green' : 'text-red',
					stickingLetter: note2IsDominant ? 'R' : 'L',
				},
			};
		} else {
			// Syncopated pattern (3 notes)
			const [note1, note2, note3] = displayUnit.notes;

			// Get properties for each note
			const note1IsDominant = note1.isDominant === (sticking === 'right');
			const note2IsDominant = note2.isDominant === (sticking === 'right');
			const note3IsDominant = note3.isDominant === (sticking === 'right');

			return {
				type: 'syncopated' as const,
				symbol: displayUnit.symbol,
				className: displayUnit.className,
				note1: {
					hasAccent: note1.dynamic === 'Accent',
					hasRimshot: note1.dynamic === 'Rimshot',
					hasDrag: note1.ornament === 'Drag',
					hasFlam: note1.ornament === 'Flam',
					stickingColor: note1IsDominant ? 'text-green' : 'text-red',
					stickingLetter: note1IsDominant ? 'R' : 'L',
				},
				note2: {
					hasAccent: note2.dynamic === 'Accent',
					hasRimshot: note2.dynamic === 'Rimshot',
					hasDrag: note2.ornament === 'Drag',
					hasFlam: note2.ornament === 'Flam',
					stickingColor: note2IsDominant ? 'text-green' : 'text-red',
					stickingLetter: note2IsDominant ? 'R' : 'L',
				},
				note3: {
					hasAccent: note3.dynamic === 'Accent',
					hasRimshot: note3.dynamic === 'Rimshot',
					hasDrag: note3.ornament === 'Drag',
					hasFlam: note3.ornament === 'Flam',
					stickingColor: note3IsDominant ? 'text-green' : 'text-red',
					stickingLetter: note3IsDominant ? 'R' : 'L',
				},
			};
		}
	}, [displayUnit, sticking]);

	if (displayProps.type === 'single') {
		if (displayProps.isRest) {
			// Rest structure: just RestSymbol
			return (
				<div className='NoteDisplay flex h-full min-h-[5rem] flex-1 flex-col items-center justify-center text-center text-black'>
					<span className='RestSymbol font-musisync leading-none'>
						{displayProps.noteSymbol}
					</span>
				</div>
			);
		} else {
			// Note structure: NoteAccent + NoteSymbol + NoteSticking
			// Apply is4Sixteenths class to syncopated patterns that span 4 sixteenth positions
			const isSyncopatedPattern = ['š', 'm', 'o'].includes(
				displayProps.noteSymbol,
			);

			return (
				<div className='NoteDisplay flex h-full min-h-[5rem] flex-1 flex-col items-center justify-center text-center text-black'>
					<span className='NoteAccent font-bold'>
						{displayProps.hasAccent && '>'}
						{displayProps.hasRimshot && (
							<span className='hasRimshot'>{'>'}</span>
						)}
					</span>
					<span
						className={clsx('NoteSymbol font-musisync leading-none', {
							hasDrag: displayProps.hasDrag,
							hasFlam: displayProps.hasFlam,
							is4Sixteenths: isSyncopatedPattern,
						})}
					>
						{displayProps.noteSymbol}
					</span>
					<span
						className={`NoteSticking font-bold ${displayProps.stickingColor}`}
					>
						{displayProps.stickingLetter}
					</span>
				</div>
			);
		}
	} else if (displayProps.type === 'triplet') {
		// Render triplet pattern (3 notes) - NoteAccent (grid-cols-3) + NoteSymbol + NoteSticking (grid-cols-3)
		return (
			<div className='NoteDisplay flex h-full min-h-[5rem] flex-1 flex-col items-center justify-center text-center text-black'>
				<span className='NoteAccent grid w-full grid-cols-3 font-bold'>
					<span>
						{displayProps.note1.hasAccent && '>'}
						{displayProps.note1.hasRimshot && (
							<span className='hasRimshot'>{'>'}</span>
						)}
					</span>
					<span>
						{displayProps.note2.hasAccent && '>'}
						{displayProps.note2.hasRimshot && (
							<span className='hasRimshot'>{'>'}</span>
						)}
					</span>
					<span>
						{displayProps.note3.hasAccent && '>'}
						{displayProps.note3.hasRimshot && (
							<span className='hasRimshot'>{'>'}</span>
						)}
					</span>
				</span>
				<span
					className={clsx(
						'NoteSymbol font-musisync leading-none',
						displayProps.className,
						{
							hasDrag:
								displayProps.note1.hasDrag ||
								displayProps.note2.hasDrag ||
								displayProps.note3.hasDrag,
							'hasFlam-1': displayProps.note1.hasFlam,
							'hasFlam-2': displayProps.note2.hasFlam,
							'hasFlam-3': displayProps.note3.hasFlam,
						},
					)}
				>
					{displayProps.symbol}
				</span>
				<span className='NoteSticking grid w-full grid-cols-3 font-bold'>
					<span className={displayProps.note1.stickingColor}>
						{displayProps.note1.stickingLetter}
					</span>
					<span className={displayProps.note2.stickingColor}>
						{displayProps.note2.stickingLetter}
					</span>
					<span className={displayProps.note3.stickingColor}>
						{displayProps.note3.stickingLetter}
					</span>
				</span>
			</div>
		);
	} else if (displayProps.type === 'beamed') {
		// Render beamed pair - NoteAccent (grid) + NoteSymbol + NoteSticking (grid)
		return (
			<div className='NoteDisplay flex h-full min-h-[5rem] flex-1 flex-col items-center justify-center text-center text-black'>
				<span className='NoteAccent grid w-full grid-cols-2 font-bold'>
					<span>
						{displayProps.note1.hasAccent && '>'}
						{displayProps.note1.hasRimshot && (
							<span className='hasRimshot'>{'>'}</span>
						)}
					</span>
					<span>
						{displayProps.note2.hasAccent && '>'}
						{displayProps.note2.hasRimshot && (
							<span className='hasRimshot'>{'>'}</span>
						)}
					</span>
				</span>
				<span
					className={clsx(
						'NoteSymbol font-musisync leading-none',
						displayProps.className,
						{
							hasDrag: displayProps.note1.hasDrag || displayProps.note2.hasDrag,
							'hasFlam-1': displayProps.note1.hasFlam,
							'hasFlam-2': displayProps.note2.hasFlam,
						},
					)}
				>
					{displayProps.symbol}
				</span>
				<span className='NoteSticking grid w-full grid-cols-2 font-bold'>
					<span className={displayProps.note1.stickingColor}>
						{displayProps.note1.stickingLetter}
					</span>
					<span className={displayProps.note2.stickingColor}>
						{displayProps.note2.stickingLetter}
					</span>
				</span>
			</div>
		);
	} else {
		// Render syncopated pattern (3 notes) - NoteAccent (grid-cols-3) + NoteSymbol + NoteSticking (grid-cols-3)
		return (
			<div className='NoteDisplay flex h-full min-h-[5rem] flex-1 flex-col items-center justify-center text-center text-black'>
				<span className='NoteAccent grid w-full grid-cols-3 font-bold'>
					<span>
						{displayProps.note1.hasAccent && '>'}
						{displayProps.note1.hasRimshot && (
							<span className='hasRimshot'>{'>'}</span>
						)}
					</span>
					<span>
						{displayProps.note2.hasAccent && '>'}
						{displayProps.note2.hasRimshot && (
							<span className='hasRimshot'>{'>'}</span>
						)}
					</span>
					<span>
						{displayProps.note3.hasAccent && '>'}
						{displayProps.note3.hasRimshot && (
							<span className='hasRimshot'>{'>'}</span>
						)}
					</span>
				</span>
				<span
					className={clsx(
						'NoteSymbol font-musisync leading-none',
						displayProps.className,
						{
							hasDrag:
								displayProps.note1.hasDrag ||
								displayProps.note2.hasDrag ||
								displayProps.note3.hasDrag,
							'hasFlam-1': displayProps.note1.hasFlam,
							'hasFlam-2': displayProps.note2.hasFlam,
							'hasFlam-3': displayProps.note3.hasFlam,
						},
					)}
				>
					{displayProps.symbol}
				</span>
				<span className='NoteSticking grid w-full grid-cols-3 font-bold'>
					<span className={displayProps.note1.stickingColor}>
						{displayProps.note1.stickingLetter}
					</span>
					<span className={displayProps.note2.stickingColor}>
						{displayProps.note2.stickingLetter}
					</span>
					<span className={displayProps.note3.stickingColor}>
						{displayProps.note3.stickingLetter}
					</span>
				</span>
			</div>
		);
	}
}

export const NoteDisplay = createMemoizedComponent(
	NoteDisplayComponent,
	'NoteDisplay',
);
