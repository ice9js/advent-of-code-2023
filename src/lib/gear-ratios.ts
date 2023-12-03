interface Position {
	x: number;
	y: number;
}

interface SchematicSymbol {
	position: Position;
	value: string;
}

interface SchematicNumber {
	position: Position;
	length: number;
	value: number;
}

interface Schematic {
	symbols: SchematicSymbol[];
	numbers: SchematicNumber[];
}

const parseRowNumbers = ( row: number, input: string, offset: number = 0 ): SchematicNumber[] => {
	const number = input.slice( offset ).match( /\d+/ );

	if ( ! number || number.index === undefined ) {
		return [];
	}

	return [
		{
			position: { x: offset + number.index, y: row },
			length: number[0].length,
			value: parseInt( number[0], 10 ),
		},
		...parseRowNumbers( row, input, offset + number.index + number[0].length ),
	];
}

export const parseSchematic = ( input: string ): Schematic =>
	input
		.split( '\n' )
		.map( ( line, y ) => ( {
			numbers: parseRowNumbers( y, line ),
			symbols: line
				.split( '' )
				.map( ( value, x ) => ( { position: { x, y }, value } ) )
				.filter( ( { value } ) => ! value.match( /^(\d|\.)$/ ) ),
		} ) )
		.reduce(
			( schematic, line ) => ( {
				symbols: [ ...schematic.symbols, ...line.symbols ],
				numbers: [ ...schematic.numbers, ...line.numbers ],
			} ),
			{ symbols: [], numbers: [] }
		);

export const neighboringSymbol = ( symbol: SchematicSymbol ) =>
	( n: SchematicNumber ): boolean =>
		Math.abs( n.position.y - symbol.position.y ) <= 1 &&
		n.position.x - 1 <= symbol.position.x &&
		symbol.position.x <= n.position.x + n.length;

export const partNumbers = ( schematic: Schematic ): number[] =>
	schematic.numbers
		.filter(
			( number ) => schematic.symbols.some(
				( symbol ) => neighboringSymbol( symbol )( number )
			)
		)
		.map( ( { value } ) => value )

export const gearRatios = ( schematic: Schematic ): number[] =>
	schematic.symbols
		.filter( ( { value } ) => value === '*' )
		.map(
			( symbol ) =>
				schematic.numbers
					.filter( neighboringSymbol( symbol ) )
					.map( ( { value } ) => value )
		)
		.filter( ( numbers ) => numbers.length == 2 )
		.map( ( [ a, b ] ) => a * b );
