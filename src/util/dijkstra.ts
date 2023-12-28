import { binaryHeap, insert, isEmpty, pop } from './heap';

type Key = string | number;

export interface FindPathParams<T> {
	getNext: ( [ currentNode, ...history ]: T[] ) => T[];
	getNodeId: ( currentNode: T ) => Key;
	getNodeHistoryId: ( [ currentNode, ...history ]: T[] ) => Key;
	getPriority: ( [ currentNode, ...history ]: T[] ) => number;
}

export const findPath = <T>(
	from: T,
	to: T,
	{ getNext, getNodeId, getNodeHistoryId, getPriority }: FindPathParams<T>
): T[] => {
	const visited: Set<Key> = new Set();
	const queue = binaryHeap<T[]>();

	insert( queue, 0, [ from ] );

	while ( ! isEmpty( queue ) ) {
		const path = pop( queue );

		if ( path[ 0 ] === to ) {
			return path.reverse();
		}

		const nodeId = getNodeId( path[ 0 ] );
		const history = getNodeHistoryId( path );

		if ( visited.has( [ nodeId, history ].join() ) ) {
			continue;
		}

		visited.add( [ nodeId, history ].join() );

		getNext( path )
			.filter( ( node ) => ! path.includes( node ) )
			.map( ( node ) => [ node ].concat( path ) )
			.filter( ( nextPath ) => ! visited.has( [ getNodeId( nextPath[ 0 ] ), getNodeHistoryId( nextPath ) ].join() ) )
			.forEach( ( nextPath ) => insert( queue, getPriority( nextPath ), nextPath ) );
	}

	throw new Error( `Path between ${ from } and ${ to } not found!` );
};
