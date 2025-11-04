'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

import { Button } from './Button';

export const Import = () => {
	return (
		<Button
			variant='hidden'
			componentName='Import'
			title='Import Beat'
			aria-label='Import beat from file'
		>
			<FontAwesomeIcon icon={faUpload} className='h-4 w-4 text-black' />
		</Button>
	);
};
