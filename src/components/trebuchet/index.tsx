import { useMemo, useState } from 'react';

import { getRowDigits, sumDigits } from '../../lib/trebuchet';
import InputTextarea from '../input-textarea';
import Panel from '../panel';

import './styles.css';

enum Mode {
	INPUT,
	DEBUG_DIGITS,
	DEBUG_SPELLED,
}

const Trebuchet = () => {
	const [ input, setInput ] = useState( '' );
	const [ mode, setMode ] = useState( Mode.INPUT );

	const sumOfDigits = useMemo( () => sumDigits( input, getRowDigits() ), [ input ] );
	const sumIncludingSpelledDigits = useMemo( () => sumDigits( input, getRowDigits( true ) ), [ input ] );

	return (
		<div className="trebuchet layout">
			<Panel.Select
				options={ [
					{ label: 'Input', value: Mode.INPUT },
					{ label: 'Digits', value: Mode.INPUT },
					{ label: 'Spelled', value: Mode.INPUT },
				] }
				activeOption={ mode }
				onSelect={ setMode }
			/>
			<Panel>
				{ mode === Mode.INPUT && (
					<InputTextarea
						defaultValue={ input }
						onChange={ setInput }
					/>
				) }
			</Panel>
			<Panel.Solution
				label="Part One"
				value={ sumOfDigits }
			/>
			<Panel.Solution
				label="Part Two"
				value={ sumIncludingSpelledDigits }
			/>
		</div>
	);
};

export default Trebuchet;
