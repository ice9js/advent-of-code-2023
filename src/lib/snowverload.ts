type Connection = [string, string];

type Diagram = Connection[];

export const parseInput = ( input: string ): Diagram =>
	input
		.split( '\n' )
		.map( ( line ) => line.match( /\w+/g )! )
		.map(
			( [ from, ...destinations ] ) =>
				destinations.map( ( to ): Connection => [ from, to ] )
		)
		.flat();

export const partOne = ( wires: Diagram ): number => {
	// Found edges using visualization
	const toRemove = [
		[ 'gqr', 'vbk' ],
		[ 'klj', 'scr' ],
		[ 'sdv', 'mxv' ],
	];

	const toTest = wires.filter( ( [ from, to ] ) => ! toRemove.some( ( e ) => e[ 0 ] === from && e[ 1 ] === to ) );

	const results: number[] = [];
	const queue = [ 0 ];

	while ( queue.length ) {
		const current = queue.shift()!;

		results.push( current );

		const [ from, to ] = toTest[ current ];

		toTest
			.map( ( _, i ) => i )
			.filter( ( i ) => from === toTest[ i ][ 0 ] || from === toTest[ i ][ 1 ] || to === toTest[ i ][ 0 ] || to === toTest[ i ][ 1 ] )
			.filter( ( i ) => ! results.includes( i ) && ! queue.includes( i ) )
			.forEach( ( i ) => queue.push( i ) );
	}

	if ( results.length !== toTest.length ) {
		const others = toTest.filter( ( _, i ) => ! results.includes( i ) );

		const g1 = new Set( results.map( ( i ) => toTest[ i ] ).flat() );
		const g2 = new Set( others.flat() );

		return g1.size * g2.size;
	}

	return 0;
};

export const partTwo = ( wires: Diagram ): number => {
	return 0;
}
