import { binaryHeap, insert, isEmpty, pop } from './heap';

type Key = string | number | symbol;

export interface FindPathParams<T> {
	getNext: ( [ currentNode, ...history ]: T[] ) => T[];
	getNodeId: ( currentNode: T ) => Key;
	getNodeHistoryId: ( [ currentNode, ...history ]: T[] ) => Key;
	getPriority: ( [ currentNode, ...history ]: T[] ) => number;
}

const markVisited = ( visited: Record<Key, Key[]>, nodeId: Key, historyId: Key ) => {
	if ( ! visited[ nodeId ] ) {
		visited[ nodeId ] = [];
	}

	visited[ nodeId ].push( historyId );
};

const hasVisited = ( visited: Record<Key, Key[]>, nodeId: Key, historyId: Key ) =>
	visited[ nodeId ] && visited[ nodeId ].includes( historyId );

export const findPath = <T>(
	from: T,
	to: T,
	{ getNext, getNodeId, getNodeHistoryId, getPriority }: FindPathParams<T>
): T[] => {
	const visited: Record<Key, Key[]> = {};
	const queue = binaryHeap<T[]>();

	insert( queue, 0, [ from ] );

	console.time( 'dijkstra' );

	while ( ! isEmpty( queue ) ) {
		const path = pop( queue );

		if ( path[ 0 ] === to ) {
			console.timeEnd( 'dijkstra' );
			return path.reverse();
		}

		const nodeId = getNodeId( path[ 0 ] );
		const history = getNodeHistoryId( path );

		if ( hasVisited( visited, nodeId, history ) ) {
			continue;
		}

		markVisited( visited, nodeId, history );

		getNext( path )
			.filter( ( node ) => ! path.includes( node ) )
			.map( ( node ) => [ node, ...path ] )
			.filter( ( nextPath ) => ! hasVisited( visited, getNodeId( nextPath[ 0 ] ), getNodeHistoryId( nextPath ) ) )
			.forEach( ( nextPath ) => insert( queue, getPriority( nextPath ), nextPath ) );
	}

	console.timeEnd( 'dijkstra' );

	throw new Error( `Path between ${ from } and ${ to } not found!` );
};


