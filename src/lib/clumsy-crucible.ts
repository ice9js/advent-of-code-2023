import { findPath } from '../util/dijkstra';

interface HeatLossMap {
	values: number[];
	width: number;
};

interface SegmentConstraints {
	minLength: number;
	maxLength: number;
};

export const parseHeatLossMap = ( input: string ): HeatLossMap => ( {
	values: input
		.split( '\n' )
		.map( ( line ) => line.split( '' ) )
		.flat()
		.map( ( n ) => parseInt( n, 10 ) ),
	width: input.split( '\n' )[0].length
} );

const heatLoss = ( map: HeatLossMap, path: number[] ) =>
	path.reduce( ( sum, position ) => sum + map.values[ position ], 0 );

const isValidPath = ( map: HeatLossMap, { minLength, maxLength }: SegmentConstraints, path: number[] ) => {
	const currentDirection = directionHistory( map, path ).length;
	const previousDirection = directionHistory( map, path.slice( currentDirection ) ).length;

	// Ensure the last segment matches the minimum length too
	if ( path[ 0 ] === map.values.length - 1 ) {
		return minLength <= currentDirection;
	}

	return currentDirection <= maxLength && ( ! previousDirection || minLength <= previousDirection );
};

const maybeNext = ( map: HeatLossMap, position: number ): number[] => [
	position - map.width,
	position + map.width,
	position % map.width ? position - 1 : -1,
	( position + 1 ) % map.width ? position + 1 : -1,
];

const nextPositions = ( map: HeatLossMap, constraints: SegmentConstraints ) =>
	( path: number[] ) =>
		maybeNext( map, path[ 0 ] ).filter(
			( position ) =>
				0 <= position &&
				position < map.values.length &&
				! path.includes( position ) &&
				isValidPath( map, constraints, [ position ].concat( path ) )
		);

const directionHistory = ( map: HeatLossMap, path: number[] ): number[] => {
	const history: number[] = [];

	for ( let i = 0; i < path.length - 1; i++ ) {
		if ( history.length && path[ i ] - path[ i + 1 ] !== history[ i - 1 ] ) {
			return history;
		}

		history.push( path[ i ] - path[ i + 1 ] );
	}

	return history;
};

const minHeatLossPath = ( map: HeatLossMap, constraints: SegmentConstraints ) =>
	findPath( 0, map.values.length - 1, {
		getNext: nextPositions( map, constraints ),
		getNodeId: ( position: number ) => position,
		getNodeHistoryId: ( path: number[] ) => directionHistory( map, path ).join(),
		getPriority: ( path: number[] ) => heatLoss( map, path ),
	} )
	.slice( 1 );

export const minimumHeatLoss = ( map: HeatLossMap ) =>
	heatLoss( map, minHeatLossPath( map, { minLength: 1, maxLength: 3 } ) );

export const minimumHeatLossPartTwo = ( map: HeatLossMap ): number =>
	heatLoss( map, minHeatLossPath( map, { minLength: 4, maxLength: 10 } ) );
