

interface CubeSet {
	red: number;
	green: number;
	blue: number;
}

interface Game {
	id: number;
	sets: CubeSet[];
}

const parseSet = ( input: string ): CubeSet => {
	const keys = input.match( /red|green|blue/g );
	const values = input.match( /\d+/g );

	if ( ! keys || ! values ) {
		throw new Error( `Invalid game set description: ${ input }` );
	}

	return keys.reduce(
		( set, key, i ) => ( {
			...set,
			[ key ]: values[ i ],
		} ),
		{ red: 0, green: 0, blue: 0 }
	);
};

export const parseGames = ( input: string ): Game[] =>
	input
		.split('\n')
		.map( ( line, idx ) => ( {
				id: idx + 1,
				sets: line.replace( /.*\:/, '' ).split(';').map( parseSet )
		} ) );

export const filterGames = ( games: Game[], red: number, green: number, blue: number) =>
	games.filter( ( { sets } ) => ! sets.some( ( set ) => red < set.red || green < set.green || blue < set.blue ) );

export const sumGameIds = ( games: Game[] ) =>
	games.reduce( ( sum, game ) => { console.log( game ); return sum + game.id; }, 0 );
