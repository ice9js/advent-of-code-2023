import { sum } from './util';

type Lens = [ string, number ];

type Box = Lens[];

export const parseInput = ( input: string ): string[] =>
	input.split( ',' );

const hash = ( input: string ): number =>
	input
		.split( '' )
		.map( ( char ) => char.charCodeAt( 0 ) )
		.reduce(
			( current, next ) => ( 17 * ( current + next ) ) % 256,
			0
		);

export const sumOfHashedSequence = ( sequence: string[] ): number =>
	sequence
		.map( hash )
		.reduce( sum );

export const focusingPower = ( sequence: string[] ): number =>
	sequence
		.reduce(
			( boxes: Box[], step: string ): Box[] => {
				const instruction = step.match( /^(.*)(=|-)(\d+)?$/ );

				if ( ! instruction ) {
					throw new Error( `Invalid instruction: ${ instruction }` );
				}

				const [ _, label, op, focalLength ] = instruction;
				const box = hash( label );

				if ( op === '-' ) {
					return [
						...boxes.slice( 0, box ),
						boxes[ box ].filter( ( lens ) => lens[0] !== label ),
						...boxes.slice( box + 1 ),
					];
				}

				const lensIndex = boxes[ box ].findIndex( ( lens ) => lens[0] === label );
				const newLens: Lens = [ label, parseInt( focalLength, 10 ) ];

				return [
					...boxes.slice( 0, box ),
					lensIndex < 0
						? [ ...boxes[ box ], newLens ]
						: boxes[ box ].map( ( lens ) => lens[0] === label ? newLens : lens ),
					...boxes.slice( box + 1 ),
				];
			},
			[ ...Array( 256 ) ].map( () => [] )
		)
		.map(
			( box, n ) => box.map(
				( [ _, focalLength ], slot ) => ( n + 1 ) * ( slot + 1 ) * focalLength
			)
		)
		.flat()
		.reduce( sum );

