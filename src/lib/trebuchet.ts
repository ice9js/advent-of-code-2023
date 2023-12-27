import { sum } from './util';

const PLAIN_DIGITS = [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '0' ];
const SPELLED_OUT_DIGITS = [ 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine' ];

export const parseInput = ( input: string ) =>
	input.split( '\n' );

const matchRowNumbers = ( patterns: string[] ) => ( line: string ) => {
	const first = line.match( new RegExp( `(${ patterns.join( '|' ) })` ) )![ 1 ];
	const last = line.match( new RegExp( `.*(${ patterns.join( '|' ) })` ) )![ 1 ];

	return ( ( patterns.indexOf( first ) + 1 ) % 10 ) * 10 + ( patterns.indexOf( last ) + 1 ) % 10;
};

export const sumOfDigits = ( lines: string[], patterns: string[] = PLAIN_DIGITS ) =>
	lines
		.map( matchRowNumbers( patterns ) )
		.reduce( sum );

export const sumIncludingSpelledDigits = ( lines: string[] ) =>
	sumOfDigits( lines, [ ...PLAIN_DIGITS, ...SPELLED_OUT_DIGITS ] );
