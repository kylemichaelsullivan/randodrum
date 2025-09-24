import { BorderedSection } from './BorderedSection';
import { DefinitionList } from './DefinitionList';
import { DYNAMIC_DEFINITIONS, TECHNIQUE_DEFINITIONS } from '@/utils';

export function Definitions() {
	return (
		<BorderedSection title='Definitions' ariaLabelledBy='definitions-title'>
			<DefinitionList title='Dynamics' definitions={DYNAMIC_DEFINITIONS} />
			<DefinitionList title='Techniques' definitions={TECHNIQUE_DEFINITIONS} />
		</BorderedSection>
	);
}
