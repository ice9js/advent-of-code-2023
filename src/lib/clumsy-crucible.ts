import { findPath } from '../util/dijkstra';
import { sum } from './util';

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
	path
		.map( ( position ) => map.values[ position ] )
		.reduce( sum, 0 );

const neighborPositions = ( map: HeatLossMap, position: Position ): Position[] => [
	position - map.width,
	position + map.width,
	position % map.width ? position - 1 : -1,
	( position + 1 ) % map.width ? position + 1 : -1,
].filter( ( number ) => 0 <= number && number < map.values.length );

const nextPositions = ( map: HeatLossMap, isValidPath: CrucibleConstraints ) =>
	( [ currentPosition, ...path ]: Path ) =>
		neighborPositions( map, currentPosition )
			.filter( ( maybeNextPosition ) => isValidPath( [ maybeNextPosition, currentPosition, ...path ] ) );

const directionHistory = ( map: HeatLossMap, path: number[], history: number[] = [] ): number[] => {
	if ( path.length < 2 ) {
		return history;
	}

	const direction = path[ 0 ] - path[ 1 ];

	if ( history.length && direction !== history[ 0 ] ) {
		return history;
	}

	return directionHistory( map, path.slice( 1 ), [ direction, ...history ] );
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
	const currentDirection = directionHistory( map, path );
	const previousDirection = directionHistory( map, path.slice( currentDirection.length ) );

	// The last stretch to the end must be at least 4 units long too!
	if ( path[ 0 ] === map.values.length - 1 ) {
		return 4 <= currentDirection.length;
	}

	return currentDirection.length <= 10 &&
		( ! previousDirection.length || 4 <= previousDirection.length );
};

export const minimumHeatLoss = ( map: HeatLossMap ) =>
	minHeatLoss( map, isValidCruciblePath( map ) );

export const minimumHeatLossPartTwo = ( map: HeatLossMap ): number =>
	minHeatLoss( map, isValidUltraCruciblePath( map ) );
