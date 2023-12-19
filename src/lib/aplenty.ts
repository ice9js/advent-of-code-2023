import { sum } from './util';

interface Part {
	x: number;
	m: number;
	a: number;
	s: number;
}

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

			return { x, m, a, s };
		} );

export const parseInput = ( input: string ): [ WorkflowIndex, Part[] ] => {
	const [ workflows, parts ] = input.split( '\n\n' );

	return [ parseWorkflows( workflows ), parseParts( parts ) ];
};

const applyRule = ( rule: Rule, part: Part ): string =>
	Math.sign( rule.value - part[ rule.category ] ) === rule.sign
		? rule.next
		: '';


const applyWorkflow = ( workflow: Workflow, part: Part ): string =>
	workflow.rules.reduce( ( next, rule ) => next || applyRule( rule, part ), '' ) || workflow.fallback;

const isAccepted = ( workflows: WorkflowIndex ) => ( part: Part ): boolean => {
	let next = 'in';

	while ( next !== 'R' && next !== 'A' ) {
		next = applyWorkflow( workflows[ next ], part );
	}

	return next === 'A';
};

export const partOne = ( [ workflows, parts ]: [ WorkflowIndex, Part[] ] ): number =>
	parts
		.filter( isAccepted( workflows ) )
		.map( ( { x, m, a, s } ) => x + m + a + s )
		.reduce( sum );
