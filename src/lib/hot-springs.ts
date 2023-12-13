import { sum } from './util';

type GeneratorFn = ( springs: string, checksums: number[] ) => number;

type Row = [ string, number[] ];

const parseRow = ( input: string ): Row => {
	const [ springs, checksums ] = input.split( ' ' );

	return [
		springs,
		checksums.split( ',' ).map( ( n ) => parseInt( n, 10 ) ),
	];
};

export const parseRows = ( input: string ): Row[] =>
	input.split( '\n' ).map( parseRow );

function memo( callback: GeneratorFn ) {
	const results = new Map<string, number>();

	return ( springs: string, checksums: number[] ): number => {
		const key = `${ springs }|${ checksums.join( ',' ) }`;

		if ( ! results.has( key ) ) {
			results.set( key, callback( springs, checksums ) );
		}

		return results.get( key )!;
	};
}

const generateArrangements = memo( ( springs: string, checksums: number[] ): number => {
	if ( ! checksums.length ) {
		return springs.indexOf( '#' ) < 0 ? 1 : 0;
	}

	if ( ! springs ) {
		return 0;
	}

	if ( springs[0] === '#' ) {
		if ( ! springs.match( new RegExp( `^[#?]{${ checksums[0] }}([\.?].*)?$` ) ) ) {
			return 0;
		}

		return generateArrangements( springs.slice( checksums[0] + 1 ), checksums.slice( 1 ) );
	}

	if ( springs[0] === '?' ) {
		return generateArrangements( '#' + springs.slice( 1 ), checksums )
			+ generateArrangements( '.' + springs.slice( 1 ), checksums );
	}

	return generateArrangements( springs.replace( /\.+/, '' ), checksums );		
} );

export const countPossibleSpringArrangements = ( rows: Row[] ): number =>
	rows
		.map( ( [ springs, checksums ] ) => generateArrangements( springs, checksums ) )
		.reduce( sum );

export const countPossibleUnfoldedArrangements = ( rows: Row[] ): number =>
	countPossibleSpringArrangements(
		rows.map( ( [ springs, checksums ] ) => [
			[ springs, springs, springs, springs, springs ].join( '?' ),
			[ ...checksums, ...checksums, ...checksums, ...checksums, ...checksums ]
		] )
	);
