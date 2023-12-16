enum Direction {
	UP = '↑',
	DOWN = '↓',
	LEFT = '←',
	RIGHT = '→',
}

interface Position {
	x: number;
	y: number;
};

type Ray = Position[];

type Contraption = string[][];

type FindRaysFn = ( map: Contraption, start: Position, direction: Direction, visited: string[] ) => Ray[];

export const parseInput = ( input: string ): Contraption =>
	input
		.split( '\n' )
		.map( ( line ) => line.split( '' ) );

const outOfBounds = ( map: Contraption, { x, y }: Position ): boolean =>
	x < 0 || map[0].length <= x || y < 0 || map.length <= y;

const next = ( { x, y }: Position, direction: Direction ): Position => {
	if ( direction === Direction.UP || direction === Direction.DOWN ) {
		return {
			x,
			y: y + ( direction === Direction.UP ? -1 : 1 )
		};
	}

	return {
		x: x + ( direction === Direction.LEFT ? -1 : 1 ),
		y
	};
};

const cutMatrix = ( map: Contraption, fromX: number, fromY: number, toX: number, toY: number ): Contraption =>
	[ ...Array( toY - fromY ) ].map( ( _, y ) => map[ fromY + y ].slice( fromX, toX ) );

const findRay = ( map: Contraption, { x, y }: Position, direction: Direction ): Position[] => {
	switch ( direction ) {
	case Direction.UP:
		// @ts-ignore
		return cutMatrix( map, x, 0, x + 1, y + 1 )
			.flat()
			.reverse()
			.join( '' )
			.match( /^[\.\|]*(\/|\\|\-)?/ )[0]
			.split( '' )
			.map( ( _, i ) => ( { x, y: y - i } ) );
	case Direction.DOWN:
		// @ts-ignore
		return cutMatrix( map, x, y, x + 1, map.length )
			.flat()
			.join( '' )
			.match( /^[\.\|]*(\/|\\|\-)?/ )[0]
			.split( '' )
			.map( ( _, i ) => ( { x, y: y + i } ) );
	case Direction.LEFT:
		// @ts-ignore
		return cutMatrix( map, 0, y, x + 1, y + 1 )
			.flat()
			.reverse()
			.join( '' )
			.match( /^[\.-]*(\/|\\|\|)?/ )[0]
			.split( '' )
			.map( ( _, i ) => ( { x: x - i, y } ) );
	case Direction.RIGHT:
		// @ts-ignore
		return cutMatrix( map, x, y, map[0].length, y + 1 )
			.flat()
			.join( '' )
			.match( /^[\.-]*(\/|\\|\|)?/ )[0]
			.split( '' )
			.map( ( _, i ) => ( { x: x + i, y } ) );
	}
};

// const findRay = ( map: Contraption, start: Position, direction: Direction ): Ray => ( {
// 	start,
// 	direction,
// 	path: findRayLength( map, start, direction ),
// } );
// 

const label = ( { x, y }: Position, direction: Direction ): string =>
	`${ direction } [ ${ x }; ${ y } ]`;

let results = new Map<string, Ray[]>();

const memo = ( callback: FindRaysFn ) => {
	// const results = new Map<string, Ray[]>();

	return ( map: Contraption, start: Position, direction: Direction, visited: string[] = [] ): Ray[] => {
		const key = label( start, direction );

		if ( ! results.has( key ) ) {
			results.set( key, callback( map, start, direction, visited ) );
		}

		return results.get( key )!;
	};
};

const findRays = memo( ( map: Contraption, start: Position, direction: Direction, visited: string[] = [] ): Ray[] => {
	if ( outOfBounds( map, start ) ) {
		// console.log( start );
		return [];
	}

	// if ( visited.includes( label( start, direction ) ) ) {
	// 	return [];
	// }

	const ray = findRay( map, start, direction );
	const last = ray[ ray.length - 1 ];

	if ( visited.includes( label( last, direction ) ) ) {
		return [ ray ];
	}

	switch ( map[ last.y ][ last.x ] ) {
	case '/':
		switch ( direction ) {
		case Direction.UP:
			return [
				ray,
				...findRays( map, { x: last.x + 1, y: last.y }, Direction.RIGHT, [ label( last, direction ), ...visited ] ),
			];
		case Direction.DOWN:
			return [
				ray,
				...findRays( map, { x: last.x - 1, y: last.y }, Direction.LEFT, [ label( last, direction ), ...visited ] ),
			];
		case Direction.LEFT:
			return [
				ray,
				...findRays( map, { x: last.x, y: last.y + 1 }, Direction.DOWN, [ label( last, direction ), ...visited ] ),
			];
		case Direction.RIGHT:
			return [
				ray,
				...findRays( map, { x: last.x, y: last.y - 1 }, Direction.UP, [ label( last, direction ), ...visited ] ),
			];
		}
	case '\\':
		switch ( direction ) {
		case Direction.UP:
			return [
				ray,
				...findRays( map, { x: last.x - 1, y: last.y }, Direction.LEFT, [ label( last, direction ), ...visited ] ),
			];
		case Direction.DOWN:
			return [
				ray,
				...findRays( map, { x: last.x + 1, y: last.y }, Direction.RIGHT, [ label( last, direction ), ...visited ] ),
			];
		case Direction.LEFT:
			return [
				ray,
				...findRays( map, { x: last.x, y: last.y - 1 }, Direction.UP, [ label( last, direction ), ...visited ] ),
			];
		case Direction.RIGHT:
			return [
				ray,
				...findRays( map, { x: last.x, y: last.y + 1 }, Direction.DOWN, [ label( last, direction ), ...visited ] ),
			];
		}
	case '|':
		return [
			ray,
			...findRays( map, { x: last.x, y: last.y - 1 }, Direction.UP, [ label( last, direction ), ...visited ] ),
			...findRays( map, { x: last.x, y: last.y + 1}, Direction.DOWN, [ label( last, direction ), ...visited ] ),
		];
	case '-':
		return [
			ray,
			...findRays( map, { x: last.x - 1, y: last.y }, Direction.LEFT, [ label( last, direction ), ...visited ] ),
			...findRays( map, { x: last.x + 1, y: last.y }, Direction.RIGHT, [ label( last, direction ), ...visited ]),
		];
	case '.':
	default:
		return [ ray ];
	}
} );

export const partOne = ( map: Contraption ): number => {
	const tiles = findRays( map, { x: 0, y: 0 }, Direction.RIGHT )
		.map( ( ray ) => ray.map( ( { x, y } ) => `${ x } ${ y }` ) )
		.flat();

	return ( new Set( tiles ) ).size;
};

export const partTwo = ( map: Contraption ): number => {
	// Need to reset memoization for every start, should rewrite most of it so it looks nicer
	const topDown = [ ...Array( map.length ) ]
		.map( ( _, i ) => {
			results = new Map<string, Ray[]>();

			return findRays( map, { x: i, y: 0 }, Direction.DOWN )
				.map(  ( ray ) => ray.map( ( { x, y } ) => `${ x } ${ y }` ) )
				.flat();
		} )
		.map( ( coords ) => ( new Set( coords ) ).size );
	const bottomUp = [ ...Array( map.length ) ]
		.map( ( _, i ) => {
			results = new Map<string, Ray[]>();

			return findRays( map, { x: i, y: map.length - 1 }, Direction.UP )
				.map(  ( ray ) => ray.map( ( { x, y } ) => `${ x } ${ y }` ) )
				.flat();
		} )
		.map( ( coords ) => ( new Set( coords ) ).size );
	const leftRight = [ ...Array( map.length ) ]
		.map( ( _, i ) => {
			results = new Map<string, Ray[]>();

			return findRays( map, { x: 0, y: i }, Direction.RIGHT )
				.map(  ( ray ) => ray.map( ( { x, y } ) => `${ x } ${ y }` ) )
				.flat();
		} )
		.map( ( coords ) => ( new Set( coords ) ).size );
	const rightLeft = [ ...Array( map.length ) ]
		.map( ( _, i ) => {
			results = new Map<string, Ray[]>();

			return findRays( map, { x: map[0].length - 1, y: i }, Direction.LEFT )
				.map(  ( ray ) => ray.map( ( { x, y } ) => `${ x } ${ y }` ) )
				.flat();
		} )
		.map( ( coords ) => ( new Set( coords ) ).size );

	return Math.max( ...[ ...topDown, ...bottomUp, ...leftRight, ...rightLeft ] );
};
