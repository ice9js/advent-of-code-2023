import { parseMaze, findLoop, findInsideTiles } from './pipe-maze';
import { sum } from './util';

interface Position {
	x: number;
	y: number;
}

interface Instruction {
	direction: string;
	length: number;
	hexCode: string;
}

export const parseInstructions = ( input: string ): Instruction[] =>
	input
		.split( '\n' )
		.map( ( line ) => {
			const [ _, direction, length, hexCode ] = line.match( /(\w)\s(\d+)\s\((\#.+)\)/ )!;

			return {
				direction,
				length: parseInt( length, 10 ),
				hexCode,
			};
		} );

const toPipeMazeInput = ( instructions: Instruction[] ): string => {
	const maze: string[][] = [];

	maze[ 200 ] = [];
	maze[ 200 ][ 200 ] = 'S';

	let previous = 'R';
	let previousPosition = { x: 200, y: 200 };
	let position: Position = { x: 200, y: 200 };

	for ( let current of instructions ) {
		const direction = {
			x: current.direction === 'R' ? 1 : ( current.direction === 'L' ? -1 : 0),
			y: current.direction === 'D' ? 1 : ( current.direction === 'U' ? -1 : 0),
		};

		// I remember the previous

		for ( let i = 0; i < current.length; i++ ) {
			let piece = direction.x ? '-' : '|'; // no corners

			previousPosition.x = position.x;
			previousPosition.y = position.y;

			position.x += direction.x;
			position.y += direction.y;

			if ( i === 0 && maze[ previousPosition.y ][ previousPosition.x ] !== 'S' ) {
				switch ( previous ) {
				case 'R':
					maze[ previousPosition.y ][ previousPosition.x ] = current.direction === 'D' ? '7' : 'J';
					break;
				case 'L':
					maze[ previousPosition.y ][ previousPosition.x ] = current.direction === 'D' ? 'F' : 'L';
					break;
				case 'D':
					maze[ previousPosition.y ][ previousPosition.x ] = current.direction === 'R' ? 'L' : 'J';
					break;
				case 'U':
					maze[ previousPosition.y ][ previousPosition.x ] = current.direction === 'R' ? 'F' : '7';
					break;
				}
			}

			if ( ! maze[ position.y ] ) {
				maze[ position.y ] = [];
			}

			if ( maze[ position.y ][ position.x ] !== 'S' ) {
				maze[ position.y ][ position.x ] = piece;
			}
		}

		previous = current.direction;
	}

	const width = maze.reduce( ( max, row ) => Math.max( max, row.length ), 0 );

	return [ ...maze ]
		// .filter( ( row ) => row.length )
		.map( ( _, y ) => [ ...Array( width ) ].map( ( c, x ) =>  ( maze[ y ] && maze[ y ][ x ] ) || '.' ).join( '' ) )
		.join( '\n' );
};

export const partOne = ( instructions: Instruction[] ): number => {
	const mazeInput = toPipeMazeInput( instructions );
	console.log( mazeInput );

	const maze = parseMaze( mazeInput );


	const loop = findLoop( maze );

	const insideTiles = findInsideTiles( maze, loop );

	return loop.length + insideTiles.length;
};
