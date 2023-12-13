import { sum } from './util';

interface Pattern {
	values: string;
	height: number;
	width: number;
};

type Coords = [ number, number ];

export const parsePatterns = ( input: string ): Pattern[] =>
	input.split( '\n\n' )
		.map( ( pattern ) => {
			const lines = pattern.split( '\n' );

			return {
				values: lines.join( '' ),
				height: lines.length,
				width: lines[0].length,
			};
		} );

const pixelValue = ( pattern: Pattern, x: number, y: number ): string => {
	 if ( 0 <= x && x < pattern.width && 0 <= y && y < pattern.height ) {
		return pattern.values[ y * pattern.width + x ];
	}

	return '';
}

const getRow = ( pattern: Pattern, y: number ): string =>
	0 <= y && y < pattern.height
		? pattern.values.slice( y * pattern.width, (y + 1) * pattern.width )
		: '';

const transpose = ( pattern: Pattern ): Pattern => ( {
	values: Array.from( pattern.values )
		.map( ( _, i ) => pixelValue( pattern, Math.floor( i / pattern.height ), i % pattern.height ) )
		.join( '' ),
	height: pattern.width,
	width: pattern.height,
} );

const reverse = ( string: string ): string =>
	Array.from( string ).reverse().join( '' );

const isVerticalMirror = ( pattern: Pattern, x: number ): boolean => {
	for ( let y = 0; y < pattern.height; y++ ) {
		const row = getRow( pattern, y );

		const a = reverse( row.slice( 0, x ) );
		const b = row.slice( x );

		if (
			( a.length <= b.length && b.indexOf( a ) !== 0  ) ||
			( b.length < a.length && a.indexOf( b ) !== 0 )
		) {
			return false;
		}
	}

	return true;
};

const findVerticalMirror = ( pattern: Pattern, skip: number = 0 ): number => {
	for ( let x = 1; x < pattern.width; x++ ) {
		if ( x === skip ) {
			continue;
		}

		if ( isVerticalMirror( pattern, x ) ) {
			return x;
		}
	}

	return 0;
};

const fixSmudge = ( pattern: Pattern ): number => {
	const previousVertical = findVerticalMirror( pattern );
	const previousHorizontal = findVerticalMirror( transpose( pattern ) );

	for ( let n = 0; n < pattern.values.length; n++ ) {
		const fixedPattern = ( {
			...pattern,
			values: pattern.values.slice( 0, n ) + ( pattern.values[n] === '#' ? '.' : '#' ) + pattern.values.slice( n + 1 )
		} );

		const newMirror = findVerticalMirror( fixedPattern, previousVertical ) || findVerticalMirror( transpose( fixedPattern ), previousHorizontal ) * 100;

		if ( newMirror ) {
			return newMirror;
		}
	}

	return 0;
};

export const partOne = ( patterns: Pattern[] ): number =>
	patterns
		.map( ( pattern ) => findVerticalMirror( pattern ) || findVerticalMirror( transpose( pattern ) ) * 100 )
		.reduce( sum );

export const partTwo = ( patterns: Pattern[] ): number =>
	patterns
		.map( ( pattern ) => fixSmudge
			( pattern ) )
		.reduce( sum );
