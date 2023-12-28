export interface Node<T> {
	key: number;
	value: T;
}

export type BinaryHeap<T> = Node<T>[];

const parent = ( index: number ) =>
	Math.floor( ( index - 1 ) / 2);

const left = ( index: number ) =>
	2 * index + 1;

const right = ( index: number ) =>
	2 * index + 2;

const hasLeft = <T>( heap: BinaryHeap<T>, index: number ) =>
	left( index ) < heap.length;

const hasRight = <T>( heap: BinaryHeap<T>, index: number ) =>
	right( index ) < heap.length;

const swap = <T>( heap: BinaryHeap<T>, a: number, b: number ) =>
	[ heap[ a ], heap[ b ] ] = [ heap[ b ], heap[ a ] ];

export const isEmpty = <T>( heap: BinaryHeap<T> ) =>
	heap.length === 0;

export const insert = <T>( heap: BinaryHeap<T>, key: number, value: T ) => {
	heap.push( { key, value } );

	let i = heap.length - 1;
	while ( 0 < i && heap[ i ].key < heap[ parent( i ) ].key ) {
		swap( heap, i, parent( i ) );
		i = parent( i );
	}

	return heap;
}

export const pop = <T>( heap: BinaryHeap<T> ) => {
	swap( heap, 0, heap.length - 1 );

	const item = heap.pop()!;

	let i = 0;
	while ( true ) {
		let smallest = i;

		if ( hasLeft( heap, i ) && heap[ left( i ) ].key < heap[ smallest ].key ) {
			smallest = left( i );
		}

		if ( hasRight( heap, i ) && heap[ right( i ) ].key < heap[ smallest ].key ) {
			smallest = right( i );
		}

		if ( smallest === i ) {
			break;
		}

		swap( heap, i, smallest );
		i = smallest;
	}

	return item.value;
};

export const binaryHeap = <T>( initialValues: [ number, T ][] = [] ) =>
	initialValues.reduce(
		( heap: BinaryHeap<T>, [ key, value ]: [ number, T ] ) => insert( heap, key, value ),
		[]
	);
