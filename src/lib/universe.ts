import { sum } from './util';

type Galaxy = [ number, number ];

type Universe = Galaxy[];

export const parseUniverse = ( input: string ): Universe =>
	input
		.split( '\n' )
		.map( ( line, y ) =>
			line
				.split( '' )
				.map( ( char, x ): Galaxy => char !== '.' ? [ x, y ] : [ -1, -1 ] )
				.filter( ( [ x, y ] ) => x !== -1 && y !== -1 )
		)
		.flat();

const expand = ( universe: Universe, factor: number = 2 ): Universe => {
	const xMax = Math.max( ...universe.map( ( [ x ] ) => x ) )
	const yMax = Math.max( ...universe.map( ( [ _, y ] ) => y ) );

	const emptyColumns = [ ...Array( xMax ) ]
		.map( ( _, i ) => i )
		.filter( ( column ) => ! universe.some( ( [ x ] ) => x === column ) );
	const emptyRows = [ ...Array( yMax ) ]
		.map( ( _, i ) => i )
		.filter( ( row ) => ! universe.some( ( [ _, y ] ) => y === row ) );

	return universe.map( ( [ x, y ] ) => [
		x + ( factor - 1 ) * emptyColumns.filter( ( row ) => row < x ).length,
		y + ( factor - 1 ) * emptyRows.filter( ( row ) => row < y ).length,
	] );
};

const galaxyPairs = ( universe: Universe ): [ Galaxy, Galaxy ][] => {
	const pairs: [ Galaxy, Galaxy ][] = [];

	for ( let i = 0; i < universe.length; i++ ) {
		for ( let j = i + 1; j < universe.length; j++ ) {
			pairs.push( [ universe[i], universe[j] ] );
		}
	}

	return pairs;
};

const distance = ( [ fromX, fromY ]: Galaxy, [ toX, toY ]: Galaxy ): number =>
	Math.abs( toX - fromX ) + Math.abs( toY - fromY );

const sumOfDistances = ( universe: Universe ): number =>
	galaxyPairs( universe )
		.map( ( [ a, b ] ) => distance( a, b ) )
		.reduce( sum );

export const sumWithSlowExpansion = ( universe: Universe ): number =>
	sumOfDistances( expand( universe ) );

export const sumWithRapidExpansion = ( universe: Universe ): number =>
	sumOfDistances( expand( universe, 1000000 ) );
