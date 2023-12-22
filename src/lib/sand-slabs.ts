import { sum } from './util';

interface Block {
	x: number;
	y: number;
	z: number;
}

type Slab = Block[];

const compress = ( slabs: Slab[] ): Slab[] => {
	let results = slabs;

	while ( ! results.every( isSupportedBy( results ) ) ) {
		for ( let i = 0; i < results.length; i++ ) {
			while ( ! isSupportedBy( results )( results[i], i ) ) {
				results[ i ] = results[ i ].map( ( { x, y, z } ) => ( { x, y, z: z - 1 } ) );
			}
		}

	}

	return results;
};

export const parseInput = ( input: string ): Slab[] =>
	compress(
		input
			.split( '\n' )
			.map( ( line ) => {
				const [ ax, ay, az, bx, by, bz ] = line.match( /\d+/g )!.map( ( n ) => parseInt( n, 10 ) );

				const blocks: Block[] = [];

				for ( let x = ax; x <= bx; x++ ) {
					for ( let y = ay; y <= by; y++ ) {
						for ( let z = az; z <= bz; z++ ) {
							blocks.push( { x, y, z } );
						}
					}
				}

				return blocks;
			} )
	);

const supports = ( slab: Slab ) => ( supporting: Slab ) =>
	supporting.some( ( { x, y, z } ) => slab.some( ( block ) => block.x === x && block.y === y && block.z === z + 1 ) );

const isSupportedBy = ( slabs: Slab[] ) =>
	( slab: Slab, index: number ) =>
		slab.some( ( { z } ) => z === 1 ) ||
		slabs.slice( 0, index ).some( supports( slab ) ) ||
		slabs.slice( index + 1 ).some( supports( slab ) );

export const partOne = ( slabs: Slab[] ): number =>
	slabs
		.filter( ( _, i ) => {
			const tmp = [ ...slabs.slice( 0, i ), ...slabs.slice( i + 1 ) ];

			return tmp.every( isSupportedBy( tmp ) );
		} )
		.length;

export const partTwo = ( slabs: Slab[] ): number =>
	slabs
		.map( ( _, i ) => {
			let tmp = [ ...slabs.slice( 0, i ), ...slabs.slice( i + 1 ) ];
			let count = 0;

			while ( true ) {
				let next: Slab[] = [];
				let done = true;

				for ( let j = 0; j < tmp.length; j++ ) {
					if ( ! isSupportedBy( tmp )( tmp[ j ], j ) ) {
						done = false;
						count++;
						continue;
					}

					next.push( tmp[j] );
				}

				if ( done ) {
					break;
				}

				tmp = next;
			}

			return count;
		} )
		.reduce( sum );
