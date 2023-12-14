import { sum } from './util';

export const parseInput = ( input: string ): string[][] =>
	input.split( '\n' )
		.map( ( line ) => line.split( '' ) );

const tiltNorth = ( map: string[][] ): string[][] => {
	let tiltedMap = map.slice( 0 );

	for ( let i = 0; i < map.length; i++ ) {
		for ( let j = 0; j < map[i].length; j++ ) {
			if ( tiltedMap[i][j] !== 'O' ) {
				continue;
			}

			let prev = i - 1;

			while ( 0 <= prev && tiltedMap[prev][j] === '.' ) {
				tiltedMap[prev][j] = 'O';
				tiltedMap[prev + 1][j] = '.';

				prev--;
			}
		}
	}

	return tiltedMap;
};

export const loadSum = ( map: string[][] ): number =>
	tiltNorth( map )
		.map( ( row, i ) => row.filter( ( char ) => char === 'O' ).length * ( map.length - i) )
		.reduce( sum );
