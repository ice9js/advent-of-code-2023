import { sum } from './util';

export const parseInput = ( input: string ): number[][] =>
	input
		.split( '\n' )
		.map(
			( line ) =>
				line
					.split( ' ' )
					.map( ( d ) => parseInt( d, 10 ) )
		);

const nextNumber = ( numbers: number[] ): number => {
	const diffs = [ ...Array( numbers.length - 1 ) ]
		.map( ( _, i ) => numbers[ i + 1 ] - numbers[ i ] );

	if ( diffs.every( ( d ) => d === 0 ) ) {
		return numbers[ diffs.length ] + 0;
	}

	return numbers[ diffs.length ] + nextNumber( diffs );
};

export const sumOfNext = ( numbers: number[][] ): number =>
	numbers
		.map( nextNumber )
		.reduce( sum );

export const sumOfPrevious = ( numbers: number[][] ): number =>
	numbers
		.map( ( sequence ) => sequence.reverse() )
		.map( nextNumber )
		.reduce( sum );
