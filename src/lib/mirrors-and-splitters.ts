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

const findRays = ( map: Contraption, start: Position, direction: Direction, visited: string[] = [] ): Ray[] => {
	if ( outOfBounds( map, start ) ) {
		// console.log( start );
		return [];
	}

	if ( visited.includes( label( start, direction ) ) ) {
		return [];
	}

	const ray = findRay( map, start, direction );

	// I will need coordinates too!
	const last = ray[ ray.length - 1 ];

	switch ( map[ last.y ][ last.x ] ) {
	case '/':
		switch ( direction ) {
		case Direction.UP:
			return [
				ray,
				...findRays( map, { x: last.x + 1, y: last.y }, Direction.RIGHT, [ label( start, direction ), ...visited ] ),
			];
		case Direction.DOWN:
			return [
				ray,
				...findRays( map, { x: last.x - 1, y: last.y }, Direction.LEFT, [ label( start, direction ), ...visited ] ),
			];
		case Direction.LEFT:
			return [
				ray,
				...findRays( map, { x: last.x, y: last.y + 1 }, Direction.DOWN, [ label( start, direction ), ...visited ] ),
			];
		case Direction.RIGHT:
			return [
				ray,
				...findRays( map, { x: last.x, y: last.y - 1 }, Direction.UP, [ label( start, direction ), ...visited ] ),
			];
		}
	case '\\':
		switch ( direction ) {
		case Direction.UP:
			return [
				ray,
				...findRays( map, { x: last.x - 1, y: last.y }, Direction.LEFT, [ label( start, direction ), ...visited ] ),
			];
		case Direction.DOWN:
			return [
				ray,
				...findRays( map, { x: last.x + 1, y: last.y }, Direction.RIGHT, [ label( start, direction ), ...visited ] ),
			];
		case Direction.LEFT:
			return [
				ray,
				...findRays( map, { x: last.x, y: last.y - 1 }, Direction.UP, [ label( start, direction ), ...visited ] ),
			];
		case Direction.RIGHT:
			return [
				ray,
				...findRays( map, { x: last.x, y: last.y + 1 }, Direction.DOWN, [ label( start, direction ), ...visited ] ),
			];
		}
	case '|':
		return [
			ray,
			...findRays( map, { x: last.x, y: last.y - 1 }, Direction.UP, [ label( start, direction ), ...visited ] ),
			...findRays( map, { x: last.x, y: last.y + 1}, Direction.DOWN, [ label( start, direction ), ...visited ] ),
		];
	case '-':
		return [
			ray,
			...findRays( map, { x: last.x - 1, y: last.y }, Direction.LEFT, [ label( start, direction ), ...visited ] ),
			...findRays( map, { x: last.x + 1, y: last.y }, Direction.RIGHT, [ label( start, direction ), ...visited ]),
		];
	case '.':
	default:
		return [ ray ];
	}
};

export const partOne = ( map: Contraption ): number => {
	const rays = findRays( map, { x: 0, y: 0 }, Direction.RIGHT );

	const tiles = rays
		.map( ( ray ) => ray.map( ( { x, y } ) => `${ x } ${ y }` ) )
		.flat();

		// console.log( rays );
		// console.log( tiles );

	const result = ( new Set( tiles ) ).size;

	console.log( result );
	return result;
};
