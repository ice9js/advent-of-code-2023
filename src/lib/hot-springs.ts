import { sum } from './util';

type Row = [ string, number[] ];

const parseRow = ( input: string ): Row => {
	const [ springs, groups ] = input.split( ' ' );

	return [
		springs,
		groups.split( ',' ).map( ( n ) => parseInt( n, 10 ) ),
	];
};

export const parseRows = ( input: string ): Row[] =>
	input.split( '\n' ).map( parseRow );

const springGroups = ( springs: string ): number[] =>
	( springs.match( /\#+/g ) || [] ).map( ( group ) => group.length );

const generateArrangements = ( springs: string, checksums: number[], result: string = '' ): string[] => {
	const groups = springGroups( result );

	if ( ! groups.every( ( group, i ) => group <= checksums[i] ) ) {
		return [];
	}

	if ( springs === '' ) {
		return checksums.every( ( checksum, i ) => checksum === groups[i] )
			? [ result ]
			: [];
	}

	if ( springs[0] === '?' ) {
		return [
			...generateArrangements( springs.slice( 1 ), checksums, result + '.' ),
			...generateArrangements( springs.slice( 1 ), checksums, result + '#' ),
		];
	}

	return generateArrangements( springs.slice( 1 ), checksums, result + springs[ 0 ] );
};

export const countPossibleSpringArrangements = ( rows: Row[] ): number =>
	rows
		.map( ( [ springs, checksums ] ) => generateArrangements( springs, checksums ).length )
		.reduce( sum );
