import { sum } from './util';

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
			[ key ]: parseInt( values[ i ], 10 ),
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

const maxColor = ( red: number, green: number, blue: number ) =>
	( { sets }: Game ) => ! sets.some( ( set ) => red < set.red || green < set.green || blue < set.blue );

const minimumSet = ( game: Game ): CubeSet =>
	game.sets.reduce(
		( minimumSet, set ) => ( {
			red: Math.max( minimumSet.red, set.red ),
			green: Math.max( minimumSet.green, set.green ),
			blue: Math.max( minimumSet.blue, set.blue ),
		} ),
		{ red: 0, green: 0, blue: 0 }
	);

const setPower = ( set: CubeSet ) => set.red * set.green * set.blue;

export const sumOfPossibleGames = ( games: Game[] ): number =>
	games
		.filter( maxColor( 12, 13, 14 ) )
		.map( ( game ) => game.id )
		.reduce( sum );

export const sumOfPowers = ( games: Game[] ): number =>
	games
		.map( minimumSet )
		.map( setPower )
		.reduce( sum );
