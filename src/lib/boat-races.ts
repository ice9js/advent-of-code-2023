interface Race {
	time: number;
	distance: number;
}

export const parseInput = ( input: string ): Race[] => {
	const [ times, distances ] = input
		.split( '\n' )
		.map( ( line ) =>
			( line.match( /\d+/g ) || [] )
				.map(( n ) => parseInt( n, 10 ) )
		);

	return [ ...Array( times.length ) ]
		.map( ( _, i ) => ( {
			time: times[ i ],
			distance: distances[ i ],
		} ) );
};

export const waysToWin = ( races: Race[] ): number =>
	races
		.map( ( { time, distance } ) => {
			let n = 0;

			for ( let i = 0; i <= time; i++ ) {
				n += distance < ( i * ( time - i ) ) ? 1 : 0;
			}

			return n;
		} )
		.reduce( ( a, b ) => a * b, 1 );

export const adjustedWaysToWin = ( races: Race[] ): number =>
	waysToWin( [ {
		time: parseInt( races.map( ( { time } ) => time ).join( '' ), 10 ),
		distance: parseInt( races.map( ( { distance } ) => distance ).join( '' ), 10 ),
	} ] );
