
const SPELLED_OUT_DIGITS = [ 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine' ];

type NthDigit = 'first' | 'last';

export const matchDigit = ( input: string, digit: NthDigit, allowSpelledOutDigits: boolean ): string => {
	const prefix = digit === 'last' ? '.*' : '';
	const expr = [ '\\d' ].concat( allowSpelledOutDigits ? SPELLED_OUT_DIGITS : [] ).join( '|' );

	const result = input.match( new RegExp( `${ prefix }(${ expr })`) );

	if ( ! result ) {
		throw new Error( `The following input line doesn't contain any digits: ${ input }.` );
	}

	return ( SPELLED_OUT_DIGITS.indexOf( result[1] ) + 1 || result[1] ).toString();
};

export const getRowDigits = ( allowSpelledOutDigits: boolean = false ) => ( input: string ): number =>
	parseInt( matchDigit( input, 'first', allowSpelledOutDigits ) + matchDigit( input, 'last', allowSpelledOutDigits ), 10 );

export const sumDigits = ( input: string, linesToDigits: (input: string) => number ): string | number => {
	try {
		return input
			.split( '\n' )
			.map( linesToDigits )
			.reduce( ( sum, next ) => sum + next, 0 );
	} catch ( error ) {
		return '-';
	}
}
