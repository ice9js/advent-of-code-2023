import { useMemo, useState } from 'react';

import { maxColor, minimumSet, parseGames, setPower } from '../../lib/cube-conundrum';
import { sum } from '../../lib/util';
import InputTextarea from '../input-textarea';
import Panel from '../panel';

import './style.css';

enum Mode {
	INPUT,
}

const CubeConundrum = () => {
	const [ input, setInput ] = useState( '' );
	const [ mode, setMode ] = useState( Mode.INPUT );

	const games = useMemo(
		() => {
			try {
				return parseGames( input );
			} catch ( error ) {
				return [];
			}
		},
		[ input ]
	);

	const sumOfPossibleGames = useMemo(
		() => games
			.filter( maxColor( 12, 13, 14 ) )
			.map( ( game ) => game.id )
			.reduce( sum ),
		[ games ]
	);

	const sumOfPowers = useMemo(
		() => games
			.map( minimumSet )
			.map( setPower )
			.reduce( sum ),
		[ games]
	);

	return (
		<div className="trebuchet layout">
			<Panel.Select
				options={ [
					{ label: 'Input', value: Mode.INPUT },
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
				value={ sumOfPossibleGames }
			/>
			<Panel.Solution
				label="Part Two"
				value={ sumOfPowers }
			/>
		</div>
	);
};

export default CubeConundrum;
