import { lcm, gcd } from './util';

type Instruction = 0 | 1;

type Nodes = Record<string, [string, string]>;

interface Map {
	nodes: Nodes;
	instructions: Instruction[];
};

const parseInstructions = ( input: string ): Instruction[] =>
	input
		.split( '' )
		.map( ( c ) => c === 'L' ? 0 : 1 );

const parseNodes = ( input: string[] ): Nodes =>
	input.reduce(
		( nodes, row ) => {
			const [ _, label, left, right ] = row.match( /([0-9A-Z]{3}).*([0-9A-Z]{3}).*([0-9A-Z]{3})/ ) || [];

			if ( ! label || ! left || ! right ) {
				return nodes;
			}

			return {
				...nodes,
				[ label ]: [ left, right ],
			};
		},
		{}
	);

export const parseMap = ( input: string ): Map => ( {
	instructions: parseInstructions( input.split( '\n\n' )[ 0 ] || '' ),
	nodes: parseNodes( ( input.split( '\n\n' )[ 1 ] || '' ).split( '\n' ) || '' ),
} );


export const steps = ( map: Map ): number => {
	let c = 'AAA';
	let i = 0;

	while ( c !== 'ZZZ' ) {
		c = map.nodes[ c ][ map.instructions[ i++ % map.instructions.length ] ];
	}

	return i;
};

export const ghostSteps = ( map: Map ): number => {
	let i = 0;
	let nodes: string[] = Object.keys( map.nodes )
		.reduce( ( n: string[], c: string ): string[] => c[2] === 'A' ? [ ...n, c ] : n, [] );

	let loops = nodes.map( () => 0 );

	while ( ! loops.every( ( n ) => n > 0 ) ) {
		nodes = nodes.map( ( n, j ) => {
			if ( n[2] === 'Z' && loops[j] === 0 ) {
				loops[j] = i;
			}

			return map.nodes[ n ][ map.instructions[ i % map.instructions.length ] ];
		} );

		i++;
	}

	return loops.reduce( lcm );
};
