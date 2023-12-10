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

const getTile = ( maze: Maze, position: number ): string =>
	maze.tiles[ position ] || '.';

const findStartingPosition = ( maze: Maze ): number => {
	for ( let i = 0; i < maze.tiles.length; i++ ) {
		if ( maze.tiles[i] === 'S' ) {
			return i;
		}
	}

	throw new Error( 'Starting position not found!' );
};

const neighbor = ( maze: Maze, position: number, x: number, y: number ) =>
	0 <= ( position % maze.width ) - x && ( position % maze.width ) + x < maze.width
		? getTile( maze, position + x + ( y * maze.width ) )
		: '.';

const pipeType = ( maze: Maze, position: number ): string => {
	if ( getTile( maze, position ) !== 'S' ) {
		return getTile( maze, position );
	}

	const neighbors = [
		'7|F'.indexOf( neighbor( maze, position, 0, -1 ) ),
		'J-7'.indexOf( neighbor( maze, position, 1, 0 ) ),
		'J|L'.indexOf( neighbor( maze, position, 0, 1 ) ),
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

export const findLoop = ( maze: Maze ): number[] => {
	let position = findStartingPosition( maze );
	const visited: number[] = [];

	while ( visited.indexOf( position ) < 0 ) {
		visited.unshift( position );

		switch ( pipeType( maze, position ) ) {
		case '|':
			position += visited[ 1 ] === position - maze.width ? maze.width : -maze.width;
			break;
		case '-':
			position += visited[ 1 ] === position + 1 ? -1 : 1;
			break;
		case 'L':
			position += visited[ 1 ] === position + 1 ? -maze.width : 1;
			break;
		case 'J':
			position += visited[ 1 ] === position - 1 ? -maze.width : -1;
			break;
		case 'F':
			position += visited[ 1 ] === position + 1 ? maze.width : 1;
			break;
		case '7':
			position += visited[ 1 ] === position - 1 ? maze.width : -1;
			break;
		default:
			throw new Error(
				`Unexpected pipe element: [${ position % maze.width }; ${ Math.floor( position / maze.width ) }]: ${pipeType( maze, position)}`
			);
		}
	}

	return visited;
}

export const filterMaze = ( maze: Maze, positions: number[] ): Maze => ( {
	...maze,
	tiles: maze.tiles.map( ( tile, position ) => 0 <= positions.indexOf( position ) ? tile : '.' ),
} );

export const findInsideTiles = ( maze: Maze, loop: number[] ): number[] => {
	const filteredMaze = filterMaze( maze, loop ); // Remove any pipe elements that aren't part of the loop
	const tiles: number[] = [];

	let previousValues = '';

	for ( let position = 0; position < maze.tiles.length; position++ ) {
		const currentValue = pipeType( filteredMaze, position );

		if ( currentValue !== '.' || previousValues.length ) {
			tiles.push( position );
		}

		switch ( currentValue ) {
		case 'L':
		case 'F':
			previousValues = currentValue + previousValues;
			break;
		case '|':
			previousValues = previousValues
				? previousValues.slice( 1 )
				: '|';
			break;
		case '7':
			if ( previousValues[ 0 ] === 'L' ) {
				previousValues = previousValues[ 1 ] === '|'
					? previousValues.slice( 2 )
					: '|' + previousValues.slice( 1 );
			}

			if ( previousValues[ 0 ] === 'F' ) {
				previousValues = previousValues.slice( 1 );
			}
			break;
		case 'J':
			if ( previousValues[ 0 ] === 'F' ) {
				previousValues = previousValues[ 1 ] === '|'
					? previousValues.slice( 2 )
					: '|' + previousValues.slice( 1 );
			}

			if ( previousValues[ 0 ] === 'L' ) {
				previousValues = previousValues.slice( 1 );
			}
			break;
		}
	}

	return tiles.filter( ( position ) => loop.indexOf( position ) < 0 );
};

export const stepsToFurthestPointInLoop = ( maze: Maze ): number =>
	findLoop( maze ).length / 2;

export const insideTilesCount = ( maze: Maze ): number =>
	findInsideTiles( maze, findLoop( maze ) ).length;
