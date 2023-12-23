import { sum } from './util';

interface Position {
	x: number;
	y: number;
}

type Trail = {
	start: Position;
	end: Position;
	length: number;
};

type Path = '.';
type Forest = '#';
type Slope = '^' | '>' | 'v' | '<';

type TrailMapTile = Path | Forest | Slope;

type TrailMap = TrailMapTile[][];

export const parseTrailMap = ( input: string ): TrailMap =>
	// @ts-ignore
	input
		.split( '\n' )
		.map( ( line ) => line.split( '' ) );

const neighborTiles = ( map: TrailMap, { x, y }: Position ): Position[] => {
	const maybeNeighbors = [
		{ x, y: y - 1 },
		{ x, y: y + 1 },
		{ x: x - 1, y },
		{ x: x + 1, y },
	];

	return maybeNeighbors.filter(
		( p ) => map[ p.y ] && map[ p.y ][ p.x ] && map[ p.y ][ p.x ] !== '#'
	);
};

const isSlope = ( value: any ): value is Slope =>
	value === '^' || value === '>' || value === "v" || value === '<';

const isJunction = ( map: TrailMap, position: Position ): boolean =>
	neighborTiles( map, position ).every( ( pos ) => isSlope( map[ pos.y ][ pos.x ] ) );

const equals = ( a: Position ) => ( b: Position ) =>
	a.x === b.x && a.y === b.y;

const isValidContinuationFrom = ( map: TrailMap, previous: Position ) => ( { x, y }: Position ): boolean =>
	( x === previous.x && y === previous.y + 1 && map[ y ][ x ] === 'v' ) ||
	( x === previous.x && y === previous.y - 1 && map[ y ][ x ] === '^' ) ||
	( x === previous.x + 1 && y === previous.y && map[ y ][ x ] === '>' ) ||
	( x === previous.x - 1 && y === previous.y && map[ y ][ x ] === '<' ) ||
	map[ y ][ x ] === '.';

const readTrails = ( map: TrailMap, start: Position ): Trail[] => {
	const trails: Trail[] = [];

	const queue = [ start ];

	while ( queue.length ) {
		const head = queue.shift()!;
		const possibleTrails = neighborTiles( map, head )
			.filter( isValidContinuationFrom( map, head ) );

		for ( let trailStart of possibleTrails ) {
			const trail = [ head ];

			let current = trailStart;

			while ( current && ! isJunction( map, current ) ) {
				trail.push( current );

				const next = neighborTiles( map, trail[ trail.length - 1 ] )
					.filter( ( position ) => ! equals( position )( trail[ trail.length - 2 ] ) );

				current = next[ 0 ];
			}

			if ( current ) {
				trail.push( current );
			}

			trails.push( {
				start: trail[ 0 ],
				end: trail[ trail.length - 1 ],
				length: trail.length,
			} );

			if (
				current &&
				isJunction( map, current ) &&
				! trails.some( ( { start } ) => equals( start )( current ) )
			) {
				queue.push( current );
			}
		}
	}

	return trails;
};

const pathDistance = ( trails: Trail[] ): number =>
	trails
		.map( ( { length } ) => length )
		.reduce( sum, 0 ) - trails.length;

const distanceTo = ( trails: Trail[], start: Trail, target: Trail, visited: Trail[] = [] ): Trail[] => {
	if ( start.start === target.start ) {
		return visited;
	}

	if ( visited.some( ( trail ) => start === trail ) ) {
		return [];
	}

	return trails
			.filter( ( trail ) => equals( trail.start )( start.end ) )
			.map( ( trail ) => distanceTo( trails, trail, target, [ ...visited, start ] ) )
			.reduce(
				( results, path ) => path.length && pathDistance( path ) > pathDistance( results ) ? path : results,
				[]
			);
}

const push = ( queue: number[][], weight: number, path: number ): void => {
	if ( ! queue[ weight ] ) {
		queue[ weight ] = [];
	}

	queue[ weight ].push( path );
};

const take = ( queue: number[][] ): number => {
	for ( let i = 0; i < queue.length; i++ ) {
		if ( queue[i] && queue[i].length ) {
			return queue[i].shift()!;
		}
	}

	return 0;
};


const getDistances = ( trails: Trail[], target: Trail ): Trail[][] => {
	const start = trails.findIndex( ( trail ) => trail === target );

	const distances: Trail[][] = [];
	distances[ start ] = [ target ];

	const queue = [ [ start ] ];

	while ( queue.some( ( q ) => q.length ) ) {
		const current = take( queue );

		// distances[ current ] = trails[ current ].length;

		for ( let i = 0; i < trails.length; i++ ) {
			if ( ! equals( trails[ i ].end )( trails[ current ].start ) ) {
				continue;
			}

			const path = [ trails[ i ], ...distances[ current ] ];
			const distance = pathDistance( path );

			// const distance = distances[ current ] + trails[ i ].length;

			if ( ! distances[ i ] || pathDistance( distances[ i ] ) < distance ) {
				distances[ i ] = path;

				push( queue, distance,  i );
			}
		}
	}

	return distances;
};

// 2205 - too low
// 2257 - too high

export const partOne = ( map: TrailMap ): number => {
	const trails = readTrails( map, { x: 1, y: 0 } );

	// Figure out the longest combination :) 

	console.log( trails );

	const first = trails.find( ( { start } ) => equals( { x: 1, y: 0 } )( start ) )!;
	const last = trails.find( ( { end } ) => equals( { x: map[0].length - 2, y: map.length - 1 } )( end ) )!

	console.log( { x: map[0].length - 2, y: map.length - 1 } );
	console.log( first );
	console.log( last );

	const distances = getDistances( trails, last );

	console.log( distances[ 0 ] );

	return pathDistance( distances[ 0 ] );

	// const path = distanceTo( trails, first, last );

	// console.log( path );

	// return pathDistance( path );
};

export const partTwo = ( map: TrailMap ): number => {
	return 0;
};
