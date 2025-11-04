type EmptyStateProps = {
	message: string;
};

export function EmptyState({ message }: EmptyStateProps) {
	return (
		<div className='EmptyState bg-light-gray border-gray flex w-full flex-auto items-center justify-center rounded-lg border p-8'>
			<p className='text-gray'>{message}</p>
		</div>
	);
}
