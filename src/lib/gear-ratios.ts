type Schematic = string[][];
type Cell = string;

export const parseSchematic = ( input: string ): Schematic =>
	input
		.split( '\n' )
		.map( ( line ) => line.split( '' ) );

const neighborCells = (schematic: Schematic, x: number, y: number ): string[] => {
	const neighbors = [];

	const fromX = Math.max( x - 1, 0 );
	const fromY = Math.max( y - 1, 0 );
	const toX = Math.min( x + 2, schematic[ 0 ].length );
	const toY = Math.min( y + 2, schematic.length );

	for ( let i = fromY; i < toY; i++ ) {
		neighbors.push(
			i === y
				? [ ...schematic[ i ].slice( fromX, x ), ...schematic[ i ].slice( x + 1, toX ) ]
				: schematic[ i ].slice( fromX, toX )
		);
	}

	return neighbors.flat();
};

const isNumber = ( cell: Cell ) =>
	cell.match( /^\d$/ );

const isSymbol = ( cell: Cell ) =>
	! cell.match( /^(\d|\.)$/ );

export const getPartNumbers = ( schematic: Schematic ): number[] => {
	const partNumbers = [];

	for ( let y = 0; y < schematic.length; y++ ) {
		let hasSymbolNeighbor = false;
		let partNumber = '';

		for ( let x = 0; x < schematic[y].length; x++ ) {
			if ( ! isNumber( schematic[y][x] ) ) {
				if ( hasSymbolNeighbor ) {
					partNumbers.push( partNumber );
				}

				hasSymbolNeighbor = false;
				partNumber = '';

				continue;
			}

			hasSymbolNeighbor = hasSymbolNeighbor || !! neighborCells( schematic, x, y ).filter( isSymbol ).length;
			partNumber = `${ partNumber }${ schematic[y][x] }`;
		}

		if ( hasSymbolNeighbor ) {
			partNumbers.push( partNumber );
		}
	}

	return partNumbers.map( ( n ) => parseInt( n, 10 ) );
};
