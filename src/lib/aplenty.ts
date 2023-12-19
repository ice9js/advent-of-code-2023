import { sum } from './util';

type Range = [ number, number ]; // start, end

interface Part {
	x: Range;
	m: Range;
	a: Range;
	s: Range;
}

type PartIndex = Record<string, Part[]>;

type RuleCategory = keyof Part;

type RuleSign = -1 | 1;

interface Rule {
	category: RuleCategory;
	sign: RuleSign;
	value: number;
	next: string;
};

interface Workflow {
	label: string;
	rules: Rule[];
	fallback: string;
}

type WorkflowIndex = Record<string, Workflow>;

const parseRule = ( input: string ): Rule => {
	const [ _, category, op, value, next ] = input.match( /(x|m|a|s)(<|>)(\d+)\:(\w+)/ )!;

	return {
		// @ts-ignore
		category,
		sign: op === '<' ? 1 : - 1,
		value: parseInt( value, 10 ),
		next,
	};
};

const parseWorkflows = ( input: string ): WorkflowIndex =>
	input
		.split( '\n' )
		.map( ( line ) => {
			const [ _, label, rules, fallback ] = line.match( /^(\w+)\{(.*),(\w+)\}/ )!;

			return {
				label,
				fallback,
				rules: rules.split( ',' ).map( parseRule ),
			};
		} )
		.reduce( ( workflows, flow ) => ( { ...workflows, [ flow.label ]: flow } ), {} );

const parseParts = ( input: string ): Part[] =>
	input
		.split( '\n' )
		.map( ( line ) => {
			const [ x, m, a, s ] = line.match( /\d+/g )!.map( ( n ) => parseInt( n, 10 ) );

			return {
				x: [ x, x ],
				m: [ m, m ],
				a: [ a, a ],
				s: [ s, s ]
			};
		} );

export const parseInput = ( input: string ): [ WorkflowIndex, Part[] ] => {
	const [ workflows, parts ] = input.split( '\n\n' );

	return [ parseWorkflows( workflows ), parseParts( parts ) ];
};

const applyRule = ( rule: Rule, part: Part ): [ Part | null, Part | null ] => {
	const range = part[ rule.category ];

	if ( Math.abs( Math.sign( rule.value - range[ 0 ] ) - Math.sign( rule.value - range[ 1 ] ) ) < 2 ) {
		// the whole range falls on one side of it
		return Math.sign( rule.value - part[ rule.category ][ 0 ] ) === rule.sign
			? [ part, null ]
			: [ null, part ];
	}

	const splitPoint = rule.sign === 1 ? rule.value : rule.value + 1;

	const a = applyRule( rule, { ...part, [ rule.category ]: [ range[0], splitPoint - 1 ] } );
	const b = applyRule( rule, { ...part, [ rule.category ]: [ splitPoint, range[1] ] } );

	return [ a[0] || b[0], a[1] || b[1] ];
};

// Returns an index of where current things go.	
const applyWorkflow = ( workflow: Workflow, part: Part ): PartIndex =>
	workflow.rules.reduce(
		( index: PartIndex, rule: Rule ): PartIndex => {
			if ( ! index[ workflow.fallback ].length ) {
				return index;
			}

			const [ accepted, rejected ] = applyRule( rule, index[ workflow.fallback ].pop()! );

			// if ( workflow.label === 'pv' ) {
				// console.log( '--------')
				// console.log( index );
				// console.log( rule );
				// console.log( accepted );
				// console.log( rejected );
				// console.log( '--------')
			// }

			// I previously lost one here
			if ( rule.next === workflow.fallback ) {
				return {
					...index,
					[ rule.next ]: [
						...( index[ rule.next ] || [] ),
						accepted!,
						rejected!
					].filter( ( n ) => n !== null )
				};
			}


			return {
				...index,
				[ rule.next ]: [
					...( index[ rule.next ] || [] ),
					accepted!
				].filter( ( n ) => n !== null ),
				[ workflow.fallback ]: [
					...( index[ workflow.fallback ] || [] ),
					rejected!
				].filter( ( n ) => n !== null ),
			};
		},
		{ [ workflow.fallback ]: [ part ] }
	);

// const applyRule = ( rule: Rule, part: Part ): string =>
// 	Math.sign( rule.value - part[ rule.category ] ) === rule.sign
// 		? rule.next
// 		: '';

// const applyWorkflow = ( workflow: Workflow, part: Part ): string =>
// 	workflow.rules.reduce( ( next, rule ) => next || applyRule( rule, part ), '' ) || workflow.fallback;

// const isAccepted = ( workflows: WorkflowIndex ) => ( part: Part ): boolean => {
// 	let next = 'in';

// 	while ( next !== 'R' && next !== 'A' ) {
// 		next = applyWorkflow( workflows[ next ], part );
// 	}

// 	return next === 'A';
// };

// export const partOne = ( [ workflows, parts ]: [ WorkflowIndex, Part[] ] ): number =>
// 	parts
// 		.filter( isAccepted( workflows ) )
// 		.map( ( { x, m, a, s } ) => x + m + a + s )
// 		.reduce( sum );

// 140474978284494
// 140809783868000
// 
// 167409079868000
// 167409079868000
// 
// 
// 
// 
// 95402211127421 too low
// 116273403200343 too low
// 

const getPartIndex = ( workflows: WorkflowIndex, parts: Part[] ): PartIndex => {
	let partIndex: PartIndex = {
		in: parts,
		A: [],
	};

	while ( 1 < Object.keys( partIndex ).length ) {
		const newIndex: PartIndex = {
			A: partIndex.A,
		};

		for ( let workflow of Object.keys( partIndex ) ) {
			if ( workflow === 'A' || workflow === 'R' ) {
				continue;
			}

			for ( let range of partIndex[ workflow ] ) {
				const results = applyWorkflow( workflows[ workflow ], range );

				for ( let key of Object.keys( results ) ) {
					if ( key === 'R' ) {
						continue;
					}

					if ( ! newIndex[ key ] ) {
						newIndex[ key ] = [];
					}

					for ( let rrr of results[ key ] ) {
						newIndex[ key ].push( rrr );
					}
				}
			}
		}

		partIndex = newIndex;
	}

	return partIndex;
}

export const partOne = ( [ workflows, parts ]: [ WorkflowIndex, Part[] ] ): number => {
	const partIndex = getPartIndex( workflows, parts );

	return Object.values( partIndex[ 'A' ] )
		.map( ( { x, m, a, s } ) => x[0] + m[0] + a[0] + s[0] )
		.reduce( sum );
};

// 125455345557345
// but day one is broken now
export const partTwo = ( [ workflows ]: [ WorkflowIndex, Part[] ] ): number => {
	const partIndex = getPartIndex(
		workflows,
		[ {
			x: [ 1, 4000 ],
			m: [ 1, 4000 ],
			a: [ 1, 4000 ],
			s: [ 1, 4000 ],

		} ]
	);

	console.log( partIndex );

	return Object.values( partIndex[ 'A' ] )
		.map( ( range ) => ( range.x[1] - range.x[0] + 1 ) * ( range.m[1] - range.m[0] + 1 ) * ( range.a[1] - range.a[0] + 1 ) * ( range.s[1] - range.s[0] + 1 ) )
		.reduce( sum );
};

