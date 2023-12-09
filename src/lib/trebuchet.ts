import { sum } from './util';

const SPELLED_OUT_DIGITS = [ 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine' ];

type NthDigit = 'first' | 'last';

export const parseInput = ( input: string ): string[] =>
	input.split( '\n' );

const matchDigit = ( input: string, digit: NthDigit, allowSpelledOutDigits: boolean ): string => {
	const prefix = digit === 'last' ? '.*' : '';
	const expr = [ '\\d' ].concat( allowSpelledOutDigits ? SPELLED_OUT_DIGITS : [] ).join( '|' );

	const result = input.match( new RegExp( `${ prefix }(${ expr })`) );

	if ( ! result ) {
		throw new Error( `The following input line doesn't contain any digits: ${ input }.` );
	}

	return ( SPELLED_OUT_DIGITS.indexOf( result[1] ) + 1 || result[1] ).toString();
};

const getRowDigits = ( allowSpelledOutDigits: boolean = false ) => ( input: string ): number =>
	parseInt( matchDigit( input, 'first', allowSpelledOutDigits ) + matchDigit( input, 'last', allowSpelledOutDigits ), 10 );

export const sumOfDigits = ( lines: string[] ): number =>
	lines
		.map( getRowDigits() )
		.reduce( sum );

export const sumIncludingSpelledDigits = ( lines: string[] ): number =>
	lines
		.map( getRowDigits( true ) )
		.reduce( sum );
