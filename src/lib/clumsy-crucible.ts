import { findPath } from '../util/dijkstra';

type Position = number;

type Path = Position[];

interface HeatLossMap {
	values: number[];
	width: number;
};

type CrucibleConstraints = ( path: Path ) => boolean;

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
	path.reduce( ( sum, position ) => sum + map.values[ position ], 0 );

const neighborPositions = ( map: HeatLossMap, position: Position ): Position[] => [
	position - map.width,
	position + map.width,
	position % map.width ? position - 1 : -1,
	( position + 1 ) % map.width ? position + 1 : -1,
].filter( ( number ) => 0 <= number && number < map.values.length );

const nextPositions = ( map: HeatLossMap, isValidPath: CrucibleConstraints ) =>
	( path: Path ) =>
		neighborPositions( map, path[ 0 ] )
			.filter( ( maybeNextPosition ) => isValidPath( [ maybeNextPosition ].concat( path ) ) );

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

const minHeatLoss = ( map: HeatLossMap, constraints: CrucibleConstraints ) => {
	const minHeatLossPath = findPath( 0, map.values.length - 1, {
		getNext: nextPositions( map, constraints ),
		getNodeId: ( position: Position ) => position,
		getNodeHistoryId: ( path: Path ) => directionHistory( map, path ).join(),
		getPriority: ( path: Path ) => heatLoss( map, path ),
	} )
	.slice( 1 );

	return heatLoss( map, minHeatLossPath );
};

const isValidCruciblePath = ( map: HeatLossMap ) => ( path: Path ) =>
	directionHistory( map, path ).length <= 3;

const isValidUltraCruciblePath = ( map: HeatLossMap ) => ( path: Path ) => {
	const currentDirection = directionHistory( map, path ).length;
	const previousDirection = directionHistory( map, path.slice( currentDirection ) ).length;

	// The last stretch to the end must be at least 4 units long too!
	if ( path[ 0 ] === map.values.length - 1 ) {
		return 4 <= currentDirection;
	}

	return currentDirection <= 10 &&
		( ! previousDirection || 4 <= previousDirection );
};

export const minimumHeatLoss = ( map: HeatLossMap ) =>
	minHeatLoss( map, isValidCruciblePath( map ) );

export const minimumHeatLossPartTwo = ( map: HeatLossMap ): number =>
	minHeatLoss( map, isValidUltraCruciblePath( map ) );
