import { binaryHeap, insert, isEmpty, pop } from './heap';

test( 'heap insert and pop should maintain heap order', () => {
	const heap = binaryHeap<String>();

	insert( heap, 10, 'a' );

	expect( heap ).toEqual( [ { key: 10, value: 'a' } ] );

	insert( heap, 5, 'b' );

	expect( heap ).toEqual( [
		{ key: 5, value: 'b' },
		{ key: 10, value: 'a' },
	] );

	insert( heap, 2, 'c' );

	expect( heap ).toEqual( [
		{ key: 2, value: 'c' },
		{ key: 10, value: 'a' },
		{ key: 5, value: 'b' },
	] );

	insert( heap, 6, 'd' );

	expect( heap ).toEqual( [
		{ key: 2, value: 'c' },
		{ key: 6, value: 'd' },
		{ key: 5, value: 'b' },
		{ key: 10, value: 'a' },
	] );

	expect( pop( heap ) ).toBe( 'c' );
	expect( pop( heap ) ).toBe( 'b' );
	expect( pop( heap ) ).toBe( 'd' );
	expect( pop( heap ) ).toBe( 'a' );
} );
