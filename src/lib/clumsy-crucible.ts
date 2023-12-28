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

const getDirectionLabel = ( map: HeatLossMap, from: Position, to: Position ): String => {
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

const nextPositions = ( map: HeatLossMap, isValidPath: CrucibleConstraints ) =>
	( [ currentPosition, ...path ]: Path ) =>
		neighborPositions( map, currentPosition )
			.filter( ( maybeNextPosition ) => isValidPath( [ maybeNextPosition, currentPosition, ...path ] ) );

const directionHistory = ( map: HeatLossMap, path: number[], history: string = '' ): string => {
	if ( path.length < 2 ) {
		return history;
	}

	const currentDirection = getDirectionLabel( map, path[ 1 ], path[ 0 ] );

	if ( history && currentDirection !== history[ 0 ] ) {
		return history;
	}

	return directionHistory( map, path.slice( 1 ), currentDirection + history );
};

const minHeatLoss = (
	map: HeatLossMap,
	from: Position,
	to: Position,
	constraints: CrucibleConstraints
) => {
	const minHeatLossPath = findPath( from, to, {
		next: nextPositions( map, constraints ),
		priority: ( path: Path ) => heatLoss( map, path ),
		signature: ( path: Path ) => directionHistory( map, path ),
	} )
	.slice( 1 );

	return heatLoss( map, minHeatLossPath );
}

const isValidCruciblePath = ( map: HeatLossMap ) => ( path: Path ) =>
	directionHistory( map, path ).length <= 3;

const isValidUltraCruciblePath = ( map: HeatLossMap, end: Position ) => ( path: Path ) => {
	const currentDirection = directionHistory( map, path );
	const previousDirection = directionHistory( map, path.slice( currentDirection.length ) );

	if ( path[ 0 ] === end ) {
		return 4 <= currentDirection.length;
	}

	return currentDirection.length <= 10 &&
		( ! previousDirection.length || 4 <= previousDirection.length );
};

export const minimumHeatLoss = ( map: HeatLossMap ) =>
	minHeatLoss( map, 0, map.values.length - 1, isValidCruciblePath( map ) );

export const minimumHeatLossPartTwo = ( map: HeatLossMap ): number =>
	minHeatLoss( map, 0, map.values.length - 1, isValidUltraCruciblePath( map, map.values.length - 1 ) );
