import { sum } from './util';

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

const parseRowNumbers = ( input: string, row: number, offset: number = 0 ): SchematicNumber[] => {
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
		...parseRowNumbers(input, row, offset + number.index + number[0].length ),
	];
};

const parseRowSymbols = ( input: string, row: number ): SchematicSymbol[] =>
	input
		.split( '' )
		.map( ( value, x ) => ( { position: { x, y: row }, value } ) )
		.filter( ( { value } ) => ! value.match( /^(\d|\.)$/ ) );

export const parseSchematic = ( input: string ): Schematic => ( {
	symbols: input.split( '\n' ).map( parseRowSymbols ).flat(),
	numbers: input.split( '\n' ).map( ( line, row ) => parseRowNumbers( line, row ) ).flat(),
} );

const neighboringSymbol = ( symbol: SchematicSymbol ) =>
	( n: SchematicNumber ): boolean =>
		Math.abs( n.position.y - symbol.position.y ) <= 1 &&
		n.position.x - 1 <= symbol.position.x &&
		symbol.position.x <= n.position.x + n.length;

const partNumbers = ( schematic: Schematic ): number[] =>
	schematic.numbers
		.filter(
			( number ) => schematic.symbols.some(
				( symbol ) => neighboringSymbol( symbol )( number )
			)
		)
		.map( ( { value } ) => value )

const gearRatios = ( schematic: Schematic ): number[] =>
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

export const partNumbersSum = ( schematic: Schematic ): number =>
	partNumbers( schematic ).reduce( sum );

export const gearRatiosSum = ( schematic: Schematic ): number =>
	gearRatios( schematic ).reduce( sum );
