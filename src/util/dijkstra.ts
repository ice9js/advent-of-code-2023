import { binaryHeap, insert, isEmpty, pop } from './heap';

type Key = string | number | symbol;

export interface FindPathParams<T> {
	next: ( [ currentNode, ...history ]: T[] ) => T[];
	priority: ( [ currentNode, ...history ]: T[] ) => number;
	signature: ( [ currentNode, ...history ]: T[] ) => Key;
}

const markVisited = <T>( visited: Record<Key, T[]>, key: Key, item: T ) => {
	if ( ! visited[ key ] ) {
		visited[ key ] = [];
	}

	visited[ key ].push( item );
}

const hasVisited = <T>( visited: Record<Key, T[]>, key: Key, item: T ) =>
	visited[ key ] && visited[ key ].includes( item );

export const findPath = <T>(
	from: T,
	to: T,
	{ next, priority, signature }: FindPathParams<T>
): T[] => {
	const visited: Record<Key, T[]> = {};
	const queue = binaryHeap<T[]>();

	insert( queue, 0, [ from ] );

	console.time( 'dijkstra' );

	while ( ! isEmpty( queue ) ) {
		const path = pop( queue );

		if ( path[ 0 ] === to ) {
			console.timeEnd( 'dijkstra' );
			return path.reverse();
		}

		const pathSignature = signature( path );

		if ( hasVisited( visited, pathSignature, path[ 0 ] ) ) {
			continue;
		}

		markVisited( visited, pathSignature, path[ 0 ] );

		next( path )
			.filter( ( node ) => ! path.includes( node ) )
			.map( ( node ) => [ node, ...path ] )
			.filter( ( nextPath ) => ! hasVisited( visited, signature( nextPath ), nextPath[ 0 ] ) )
			.forEach( ( nextPath ) => insert( queue, priority( nextPath ), nextPath ) );
	}

	console.timeEnd( 'dijkstra' );

	throw new Error( `Path between ${ from } and ${ to } not found!` );
};


