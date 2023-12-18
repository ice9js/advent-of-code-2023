import { sum } from './util';

interface Point {
	x: number;
	y: number;
}

type Block = [ Point, Point, Point, Point ];

type Segment = [ Point, Point ];

type Polygon = Point[];

type Direction = { x: 1, y: 0 } | { x: -1, y: 0 } | { x: 0, y: 1 } | { x: 0, y: -1 };

interface Instruction {
	direction: Direction;
	length: number;
}

type ParseLineFn = ( line: string ) => Instruction;

const parseDirection = ( char: string ): Direction => {
	switch ( char ) {
	case 'R':
	case '0':
		return { x: 1, y: 0 };
	case 'D':
	case '1':
		return { x: 0, y: 1 };
	case 'L':
	case '2':
		return { x: -1, y: 0 };
	case 'U':
	case '3':
		return { x: 0, y: -1 };
	}

	throw new Error( `Invalid direction character: ${ char }` );
};

const plainInstruction = ( line: string ): Instruction => {
	const [ _, direction, length ] = line.match( /(\w)\s(\d+)/ )!;

	return {
		direction: parseDirection( direction ),
		length: parseInt( length, 10 ),
	};
};

const hexInstruction = ( line: string ): Instruction => {
	const [ _, length, direction ] = line.match( /\w\s\d+\s\(\#(.+)(\d)\)/ )!;

	return {
		direction: parseDirection( direction ),
		length: parseInt( length, 16 ),
	};
}

const parseInstructions = ( input: string, strategy: ParseLineFn ): Instruction[] =>
	input.split( '\n' ).map( strategy );

const polygon = ( [ current, ...instructions ]: Instruction[], position: Point = { x: 0, y: 0 } ): Polygon => {
	if ( ! current ) {
		return [];
	}

	const nextPosition = {
		x: position.x + current.direction.x * current.length,
		y: position.y + current.direction.y * current.length,
	};

	return [ position, ...polygon( instructions, nextPosition ) ];
};

const isInsidePolygon = ( polygon: Polygon, { x, y }: Point ) => {
	let inside = false;

	for ( let i = 0; i < polygon.length; i++ ) {
		const current = polygon[ i ];
		const previous = polygon[ ( polygon.length + i - 1 ) % polygon.length ];

		if (
			( y < current.y ) != ( y < previous.y ) &&
			( x < ( previous.x - current.x ) * ( y - current.y ) / ( previous.y - current.y ) + current.x )
		) {
			inside = ! inside;
		}
	}

	return inside;
};

const offsetPolygon = ( polygon: Polygon, offset: number ): Polygon =>
	polygon
		.map( ( { x, y } ) => [
			{ x: x + offset, y: y + offset },
			{ x: x - offset, y: y + offset },
			{ x: x + offset, y: y - offset },
			{ x: x - offset, y: y - offset },
		] )
		.map( ( points ) => {
			const outside = points.filter( ( point ) => ! isInsidePolygon( polygon, point ) );

			if ( outside.length === 1 ) {
				return outside[ 0 ];
			}

			return outside.filter( ( point ) =>
				outside.some( ( p ) => p.x === point.x && p.y !== point.y ) &&
				outside.some( ( p ) => p.x !== point.x && p.y === point.y )
			)[ 0 ];
		} )
		.reduce(
			( newPolygon: Polygon, point: Point ): Polygon => {
				if ( newPolygon.some( ( { x, y } ) => x === point.x && y === point.y ) ) {
					return newPolygon;
				}

				return [ ...newPolygon, point ];
			},
			[]
		);

const segments = ( polygon: Polygon ): Segment[] =>
	polygon.map( ( point, i ) => [ point, polygon[ ( i + 1 ) % polygon.length ] ] );

const area = ( polygon: Polygon ): number =>
	Math.abs(
		segments( polygon )
			.map( ( [ a, b ] ) => a.x * b.y - b.x * a.y )
			.reduce( sum )
	) / 2;

const trenchArea = ( strategy: ParseLineFn ) =>
	( input: string ): number =>
		area( offsetPolygon( polygon( parseInstructions( input, strategy ) ), 0.5 ) );

export const partOne = trenchArea( plainInstruction );

export const partTwo = trenchArea( hexInstruction );
