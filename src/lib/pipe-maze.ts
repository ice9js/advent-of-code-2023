export type Coords = [number, number];

type Pipe = string;

export type Maze = Record<number, Record<number, Pipe>>;

const isPipe = ( char: string ): boolean =>
	0 <= '|-LJ7FS'.indexOf( char );

export const parseMaze = ( input: string ): Maze => {
	const points = input
		.split( '\n' )
		.map( ( line ) => line.split( '' ) );

	const maze: Record<number, Record<number, Pipe>> = {};

	for ( let y = 0; y < points.length; y++ ) {
		maze[y] = {};

		for ( let x = 0; x < points[y].length; x++ ) {
			if ( isPipe( points[y][x] ) ) {
				maze[y][x] = points[y][x];
			}
		}
	}

	return maze;
};

const findStartingPoint = ( maze: Maze ): Coords => {
	for ( let y in maze ) {
		for ( let x in maze[y] ) {
			if ( maze[y][x] === 'S' ) {
				return [ parseInt( x, 10 ), parseInt( y, 10 ) ];
			}
		}
	}

	throw new Error( 'Starting point not found!' );
};

const contains = ( visited: Coords[], [ x, y ]: Coords ): boolean =>
	visited.some( ( [ vx, vy ] ) => vx === x && vy === y );

export const findLoop = ( maze: Maze ): Coords[] => {
	let [ x, y ] = findStartingPoint( maze );
	const visited: Coords[] = [];

	while ( ! contains( visited, [ x, y ] ) ) {
		visited.push( [ x, y ] );

		switch ( maze[y][x] ) {
		case '|':
			y = contains( visited, [x, y + 1 ] ) ? y - 1 : y + 1;
			break;
		case '-':
			x = contains( visited, [x - 1, y] ) ? x + 1 : x - 1;
			break;
		case 'L':
			[ x, y ] = contains( visited, [x, y - 1] ) ? [ x + 1, y ] : [ x, y - 1];
			break;
		case 'J':
			[ x, y ] = contains( visited, [x, y - 1] ) ? [ x - 1, y ] : [ x, y - 1 ];
			break;
		case '7':
			[ x, y ] = contains( visited, [x, y + 1] ) ? [ x - 1, y ] : [ x, y + 1 ];
			break;
		case 'F':
			[ x, y ] = contains( visited, [x, y + 1] ) ? [ x + 1, y ] : [ x, y + 1 ];
			break;
		case 'S':
			if ( 0 <='-J7'.indexOf( maze[ y ][ x + 1 ] ) ) {
				x = x + 1;
				break;
			}

			y = 0 <='|LJ'.indexOf( maze[ y - 1 ][ x ] ) ? y + 1 : y - 1;
			break;
		default:
			throw new Error( `Unexpected pipe element: [${x}; ${y}]: ${maze[y][x]}` );
		}
	}

	return visited;
}

const startingPipeType = ( maze: Maze, [x, y]: Coords ): Pipe => {
	const neighbors = [ ( maze[ y - 1 ] || {} )[ x ], maze[ y ][ x + 1], ( maze[ y + 1 ] || {} )[ x ], maze[ y ][ x - 1] ];

	if ( neighbors[ 0 ] ) {
		if ( neighbors[ 1 ] ) {
			return 'L';
		}

		return neighbors[ 2 ] ? '|' : 'J';
	}

	if ( neighbors[ 1 ] ) {
		return neighbors[ 2 ] ? 'F' : '-';
	}

	return '7';
};

export const findInsideTiles = ( maze: Maze ): Coords[] => {
	const insideTiles: Coords[] = [];

	for ( let a of Object.keys( maze ) ) {
		const y = parseInt( a, 10 );
		const xs = Object.keys( maze[ y ] ).map( n => parseInt( n, 10 ) );

		let previousValue = '';

		for ( let x = Math.min( ...xs ); x < Math.max( ...xs ) + 1; x++ ) {
			if ( 0 < previousValue.length || maze[ y ][ x ] ) {
				insideTiles.push( [ x, y ] );
			}

			const value = maze[ y ][ x ] === 'S'
				? startingPipeType( maze, [x, y])
				: maze[ y ][ x ] || '';

			switch ( value ) {
				case 'L':
				case 'F':
					previousValue += value;
					break;

				case '|':
					if ( ! previousValue.length ) {
						previousValue = '|';
						break;
					}

					previousValue = previousValue.slice( 0, -1 );
					break;

				case '7':
					if ( previousValue[ previousValue.length - 1 ] === 'L' ) {
						previousValue = previousValue[ previousValue.length - 2 ] === '|'
							? previousValue.slice( 0, -2 )
							: previousValue.slice( 0, -1 ) + '|';
					}

					if ( previousValue[ previousValue.length - 1 ] === 'F' ) {
						previousValue = previousValue.slice( 0, -1 );
					}

					break;

				case 'J':
					if ( previousValue[ previousValue.length - 1 ] === 'F' ) {
						previousValue = previousValue[ previousValue.length - 2 ] === '|'
							? previousValue.slice( 0, -2 )
							: previousValue.slice( 0, -1 ) + '|';
					}

					if ( previousValue[ previousValue.length - 1 ] === 'L' ) {
						previousValue = previousValue.slice( 0, -1 );
					}
					break;
			}
		}
	}

	return insideTiles;
};

export const filterMaze = ( maze: Maze, coords: Coords[] ): Maze => {
	const filtered: Maze = {};

	for ( let [ x, y ] of coords ) {
		if ( ! filtered[ y ] ) {
			filtered[ y ] = {};
		}

		filtered[ y ][ x ] = maze[ y ][ x ];
	}

	return filtered;
};

export const stepsToFurthestPointInLoop = ( maze: Maze ): number =>
	findLoop( maze ).length / 2;

export const insideTilesCount = ( maze: Maze ): number => {
	const loop = findLoop( maze );

	return findInsideTiles( filterMaze( maze, loop ) )
		.filter( ( coords ) => ! contains( loop, coords ) )
		.length;
};
