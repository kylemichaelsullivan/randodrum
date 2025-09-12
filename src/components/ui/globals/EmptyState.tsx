type EmptyStateProps = {
	message: string;
};

export function EmptyState({ message }: EmptyStateProps) {
	return (
		<div className='EmptyState flex items-center justify-center bg-light-gray border border-gray rounded-lg p-8'>
			<p className='text-gray'>{message}</p>
		</div>
	);
}
