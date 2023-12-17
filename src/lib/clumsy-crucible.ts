import { sum } from './util';

type Path = number[];

interface HeatLossMap {
	values: number[];
	width: number;
};

type Direction = '↑' | '↓' | '←' | '→';

type VisitedNode = Record<string, Path>;

type CrucibleStrategy = ( map: HeatLossMap, path: Path, next: number ) => boolean;

export const parseHeatLossMap = ( input: string ): HeatLossMap => {
	const values = input
		.split( '\n' )
		.map( ( line ) => line.split( '' ).map( ( n ) => parseInt( n, 10 ) ) );

	return {
		values: values.flat(),
		width: values[0].length
	};
};

const heatLoss = ( map: HeatLossMap, path: Path ) =>
	path
		.map( ( position ) => map.values[ position ] )
		.reduce( sum, 0 );

const neighbors = ( map: HeatLossMap, position: number ): number[] => [
	position - map.width,
	position + map.width,
	position % map.width ? position - 1 : -1,
	( position + 1 ) % map.width ? position + 1 : -1,
].filter( ( number ) => 0 <= number && number < map.values.length );

const isValidContinuation = ( map: HeatLossMap, path: Path, next: number ): boolean =>
		! path.includes( next ) &&
		! ( path[ 0 ] === next - 1 && path[ 1 ] === next - 2 && path[ 2 ] === next - 3 && path[ 3 ] === next - 4 ) &&
		! ( path[ 0 ] === next + 1 && path[ 1 ] === next + 2 && path[ 2 ] === next + 3 && path[ 3 ] === next + 4 ) &&
		! ( path[ 0 ] === next - map.width && path[ 1 ] === next - 2 * map.width && path[ 2 ] === next - 3 * map.width && path[ 3 ] === next - 4 * map.width ) &&
		! ( path[ 0 ] === next + map.width && path[ 1 ] === next + 2 * map.width && path[ 2 ] === next + 3 * map.width && path[ 3 ] === next + 4 * map.width );

const getDirection = ( map: HeatLossMap, from: number, to: number ): Direction => {
	switch ( to - from ) {
	case -map.width:
		return '↑';
	case map.width:
		return '↓';
	case -1:
		return '←';
	case 1:
		return '→';
	}

	throw new Error( `That took an unexpected turn: ${ from - to }!` );
};

const dirdirdir = ( map: HeatLossMap, path: Path, suffix: string = '' ): string => {
	if ( path.length < 2 ) {
		return suffix;
	}

	const current = getDirection( map, path[ 1 ], path[ 0 ] );

	if ( suffix && current !== suffix[ 0 ] ) {
		return suffix;
	}

	return dirdirdir( map, path.slice( 1 ), current + suffix );
};

const markVisited = ( map: HeatLossMap, visited: VisitedNode[], path: Path ): void => {
	const key = dirdirdir( map, path );

	if ( ! visited[ path[ 0 ] ] ) {
		visited[ path[ 0 ] ] = {
			[ key ]: path,
		};

		return;
	}

	visited[ path[ 0 ] ][ key ] = path;
};

const hasVisited = ( visited: VisitedNode[], position: number, directions: string ): boolean =>
	!! visited[ position ] && !! visited[ position ][ directions ];

const push = ( queue: Path[][], weight: number, path: Path ): void => {
	if ( ! queue[ weight ] ) {
		queue[ weight ] = [];
	}

	queue[ weight ].push( path );
};

const take = ( queue: Path[][] ): Path => {
	for ( let i = 0; i < queue.length; i++ ) {
		if ( queue[i] && queue[i].length ) {
			return queue[i].shift()!;
		}
	}

	return [];
};


const isValidContinuationExt = ( map: HeatLossMap, path: Path, next: number ): boolean => {
	const currentDirection = dirdirdir( map, [ next, ...path ] );
	const previousDirection = dirdirdir( map, path.slice( currentDirection.length - 1 ) );

	if ( 10 < currentDirection.length ) {
		return false;
	}

	if ( ! previousDirection ) {
		return true;
	}

	return 4 <= previousDirection.length && previousDirection.length <= 10;
};

const shortestPath = ( map: HeatLossMap, from: number, to: number, isValidNext: CrucibleStrategy ): Path => {
	const visited: VisitedNode[] = [];
	const queue: Path[][] = [];

	push( queue, 0, [ from ] );

	while ( 0 < queue.length ) {
		const path = take( queue );

		if ( hasVisited( visited, path[ 0 ], dirdirdir( map, path ) ) ) {
			continue;
		}

		if ( path[ 0 ] === to ) {
			return path.reverse().slice( 1 );
		}

		markVisited( map, visited, path );

		for ( let next of neighbors( map, path[ 0 ] ) ) {
			if (
				! isValidNext( map, path, next ) ||
				hasVisited( visited, next, dirdirdir( map, [ next, ...path ] ) )
			) {
				continue;
			}

			push( queue, heatLoss( map, [ next, ...path ] ), [ next, ...path ] );
		}
	}

	return [];
}

export const minimumHeatLoss = ( map: HeatLossMap ): number =>
	heatLoss( map, shortestPath( map, 0, map.values.length - 1, isValidContinuation ) );

// 904
export const minimumHeatLossPartTwo = ( map: HeatLossMap ): number =>
	heatLoss( map, shortestPath( map, 0, map.values.length - 1, isValidContinuationExt ) );

