export type Coords = [number, number];

export interface Maze {
	tiles: string[];
	height: number;
	width: number;
};

export const parseMaze = ( input: string ): Maze => {
	const tiles = input
		.split( '\n' )
		.map( ( line ) => line.split( '' ) );

	return {
		tiles: tiles.flat(),
		height: tiles.length,
		width: tiles[ 0 ].length,
	};
};

const coordsForPosition = ( maze: Maze, position: number ): Coords =>
	[ position % maze.width, Math.floor( position / maze.width ) ];

const getTile = ( maze: Maze, [ x, y ]: Coords ): string => {
	if ( y < 0 || maze.height <= y || x < 0 || maze.width <= x ) {
		return '.';
	}

	return maze.tiles[ y * maze.width + x ];
}

const findStartingCoords = ( maze: Maze ): Coords => {
	for ( let i = 0; i < maze.tiles.length; i++ ) {
		if ( maze.tiles[i] === 'S' ) {
			return coordsForPosition( maze, i );
		}
	}

	throw new Error( 'Starting point not found!' );
};

const matchingCoords = ( [ x, y ]: Coords ) =>
	( [ otherX, otherY ]: Coords ) => x === otherX && y === otherY;

const pipeType = ( maze: Maze, [ x, y ]: Coords ): string => {
	const tile = getTile( maze, [ x, y ] );

	if ( tile !== 'S' ) {
		return tile;
	}

	const neighbors = [
		'7|F'.indexOf( getTile( maze, [ x, y - 1 ] ) ),
		'J-7'.indexOf( getTile( maze, [ x + 1, y ] ) ),
		'J|L'.indexOf( getTile( maze, [ x, y + 1 ] ) ),
	].map( ( result ) => 0 <= result );

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
}

export const findLoop = ( maze: Maze ): Coords[] => {
	let [ x, y ] = findStartingCoords( maze );
	const visited: Coords[] = [];

	while ( ! visited.some( matchingCoords( [ x, y ] ) ) ) {
		visited.push( [ x, y ] );

		switch ( pipeType( maze, [ x, y ] ) ) {
		case '|':
			y = visited.some( matchingCoords( [x, y + 1 ] ) ) ? y - 1 : y + 1;
			break;
		case '-':
			x = visited.some( matchingCoords( [x - 1, y] ) ) ? x + 1 : x - 1;
			break;
		case 'L':
			[ x, y ] = visited.some( matchingCoords( [x, y - 1] ) ) ? [ x + 1, y ] : [ x, y - 1];
			break;
		case 'J':
			[ x, y ] = visited.some( matchingCoords( [x, y - 1] ) ) ? [ x - 1, y ] : [ x, y - 1 ];
			break;
		case '7':
			[ x, y ] = visited.some( matchingCoords( [x, y + 1] ) ) ? [ x - 1, y ] : [ x, y + 1 ];
			break;
		case 'F':
			[ x, y ] = visited.some( matchingCoords( [x, y + 1] ) ) ? [ x + 1, y ] : [ x, y + 1 ];
			break;
		default:
			throw new Error( `Unexpected pipe element: [${x}; ${y}]: ${pipeType( maze, [x, y])}` );
		}
	}

	return visited;
}

export const filterMaze = ( maze: Maze, coords: Coords[] ): Maze => ( {
	...maze,
	tiles: maze.tiles.map(
		( tile, position ) =>
			coords.some( matchingCoords( coordsForPosition( maze, position ) ) )
				? tile
				: '.'
	),
} );

export const findInsideTiles = ( maze: Maze, loop: Coords[] ): Coords[] => {
	const filteredMaze = filterMaze( maze, loop ); // Remove any pipe elements that aren't part of the loop
	const tiles: Coords[] = [];

	let previousValue = '';

	for ( let position = 0; position < maze.tiles.length; position++ ) {
		const coords = coordsForPosition( maze, position );
		const currentValue = pipeType( filteredMaze, coords );

		if ( currentValue !== '.' || 0 < previousValue.length ) {
			tiles.push( coords );
		}

		switch ( currentValue ) {
		case 'L':
		case 'F':
			previousValue = currentValue + previousValue;
			break;
		case '|':
			previousValue = previousValue
				? previousValue.slice( 1 )
				: '|';
			break;
		case '7':
			if ( previousValue[ 0 ] === 'L' ) {
				previousValue = previousValue[ 1 ] === '|'
					? previousValue.slice( 2 )
					: '|' + previousValue.slice( 1 );
			}

			if ( previousValue[ 0 ] === 'F' ) {
				previousValue = previousValue.slice( 1 );
			}
			break;
		case 'J':
			if ( previousValue[ 0 ] === 'F' ) {
				previousValue = previousValue[ 1 ] === '|'
					? previousValue.slice( 2 )
					: '|' + previousValue.slice( 1 );
			}

			if ( previousValue[ 0 ] === 'L' ) {
				previousValue = previousValue.slice( 1 );
			}
			break;
		}
	}

	return tiles.filter( ( coords ) => ! loop.some( matchingCoords( coords ) ) );
};

export const stepsToFurthestPointInLoop = ( maze: Maze ): number =>
	findLoop( maze ).length / 2;

export const insideTilesCount = ( maze: Maze ): number =>
	findInsideTiles( maze, findLoop( maze ) ).length;
