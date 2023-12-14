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

const tiltSouth = ( map: string[][] ): string[][] => {
	let tiltedMap = map.slice( 0 );

	for ( let i = map.length - 1; 0 <= i; i-- ) {
		for ( let j = 0; j < map[i].length; j++ ) {
			if ( tiltedMap[i][j] !== 'O' ) {
				continue;
			}

			let prev = i + 1;

			while ( prev < map.length && tiltedMap[prev][j] === '.' ) {
				tiltedMap[prev][j] = 'O';
				tiltedMap[prev - 1][j] = '.';

				prev++;
			}
		}
	}

	return tiltedMap;
};

const tiltWest = ( map: string[][] ): string[][] => {
	let tiltedMap = map.slice( 0 );

	for ( let i = 0; i < map.length; i++ ) {
		for ( let j = 0; j < map[i].length; j++ ) {
			if ( tiltedMap[i][j] !== 'O' ) {
				continue;
			}

			let prev = j - 1;

			while ( 0 <= prev && tiltedMap[i][prev] === '.' ) {
				tiltedMap[i][prev] = 'O';
				tiltedMap[i][prev + 1] = '.';

				prev--;
			}
		}
	}

	return tiltedMap;
};

const tiltEast = ( map: string[][] ): string[][] => {
	let tiltedMap = map.slice( 0 );

	for ( let i = 0; i < map.length; i++ ) {
		for ( let j = map[i].length - 1; 0 <= j; j-- ) {
			if ( tiltedMap[i][j] !== 'O' ) {
				continue;
			}

			let prev = j + 1;

			while ( prev < map[i].length && tiltedMap[i][prev] === '.' ) {
				tiltedMap[i][prev] = 'O';
				tiltedMap[i][prev - 1] = '.';

				prev++;
			}
		}
	}

	return tiltedMap;
};

export const loadSum = ( map: string[][] ): number =>
	tiltNorth( map )
		.map( ( row, i ) => row.filter( ( char ) => char === 'O' ).length * ( map.length - i) )
		.reduce( sum );

const results = new Map<string, number>();

export const loadSumAfterCycling = ( map: string[][] ): number => {
	const totalCycles = 1000000000;
	let cycledMap = map.slice( 0 );

	for ( let i = 0; i < totalCycles; i++ ) {
		cycledMap = tiltNorth( map );
		cycledMap = tiltWest( map );
		cycledMap = tiltSouth( map );
		cycledMap = tiltEast( map );

		const mapStr = cycledMap.map( line => line.join( '' ) ).join( '' );

		if ( results.has( mapStr ) ) {
			const cycleLength = i - ( results.get( mapStr ) || 0 );

			i += Math.floor( ( totalCycles - i ) / cycleLength ) * cycleLength ;
		} else {
			results.set( mapStr, i );
		}
	}

	return cycledMap
		.map( ( row, i ) => row.filter( ( char ) => char === 'O' ).length * ( map.length - i) )
		.reduce( sum );
};
