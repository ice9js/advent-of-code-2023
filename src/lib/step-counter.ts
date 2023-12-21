interface PlotMap {
	values: string[];
	height: number;
	width: number;
}

export const parsePlotMap = ( input: string ): PlotMap => ( {
	values: input
		.split( '\n' )
		.map( ( line ) => line.split( '' ) )
		.flat(),
	height: input.split( '\n' ).length,
	width: input.match( /^.*/ )![ 0 ].length,
} );

const drawMap = ( map: PlotMap, visited: number[] ): string => {
	let result = '';

	for ( let i = 0; i < map.values.length; i++ ) {
		result += visited.includes( i ) ? 'O' : map.values[ i ];

		if ( ( i + 1 ) % map.width === 0 ) {
			result += '\n';
		}
	}

	return result;
};

const neighboringPlots = ( map: PlotMap, plot: number ): number[] => [
	plot - map.width,
	plot + map.width,
	plot % map.width ? plot - 1 : -1,
	( plot + 1 ) % map.width ? plot + 1 : -1,
].filter( ( number ) => 0 <= number && number < map.values.length );

const findPlotsInNSteps = ( map: PlotMap, startPlot: number, steps: number ): number[] => {
	const results: number[] = [];

	let nextQueue: number[] = [];
	let queue: number[] = [ startPlot ];

	let step = 0;

	while ( step < steps ) {
		while ( queue.length ) {
			neighboringPlots( map, queue.shift()! )
				.filter( ( plot ) => map.values[ plot ] !== '#' && ! results.includes( plot ) )
				.forEach( ( plot ) => {
					if ( ( steps - step - 1 ) % 2 === 0 ) {
						results.push( plot );
					}

					nextQueue.push( plot );
				} );
		}

		queue = nextQueue;
		nextQueue = [];

		step++;
	}

	return results;
};

export const partOne = ( map: PlotMap ): number =>
	Object.values( findPlotsInNSteps( map, map.values.indexOf( 'S' ), 64 ) ).length;

// Solved based on this explanation: https://github.com/villuna/aoc23/wiki/A-Geometric-solution-to-advent-of-code-2023,-day-21
export const partTwo = ( map: PlotMap ): number => {
	const nEven = findPlotsInNSteps( map, map.values.indexOf( 'S' ), 132 ).length;
	const nOdd = findPlotsInNSteps( map, map.values.indexOf( 'S' ), 131 ).length;

	const evenCorners = nEven - findPlotsInNSteps( map, map.values.indexOf( 'S' ), 64 ).length;
	const oddCorners = nOdd - findPlotsInNSteps( map, map.values.indexOf( 'S' ), 65 ).length;

	const n = ( 26501365 - 65 ) / 131;

	return ( ( n + 1 ) * ( n + 1 ) * nOdd ) + ( n * n * nEven ) - ( n + 1 ) * oddCorners + n * evenCorners;
};
