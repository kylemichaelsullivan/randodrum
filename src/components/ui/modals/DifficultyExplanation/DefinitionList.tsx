import { Definition } from './Definition';

type DefinitionListProps = {
	title: string;
	definitions: Record<string, string>;
};

export function DefinitionList({ title, definitions }: DefinitionListProps) {
	return (
		<div className={`DefinitionList flex flex-col gap-2`}>
			<h4 className='text-black text-base font-semibold italic'>{title}</h4>
			<div className='flex flex-col gap-1'>
				{Object.entries(definitions).map(([term, definition]) => (
					<Definition term={term} definition={definition} key={term} />
				))}
			</div>
		</div>
	);
}
