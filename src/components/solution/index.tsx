import { ReactNode, SyntheticEvent, useCallback, useMemo, useState } from 'react';
import classnames from 'classnames'

import InputTextarea from '../input-textarea';
import Panel from '../panel';

import './styles.css';

type SolutionFunction<T> = ( data: T ) => string | number;

interface SolutionProps<T> {
	children?: ReactNode;
	className?: string;
	parseInput: ( input: string ) => T;
	partOne?: SolutionFunction<T>;
	partTwo?: SolutionFunction<T>;
}

function notSolved<T>( data: T ) {
	return '-';
}

function useSolution<T>( getResult: SolutionFunction<T> ) {
	const [ error, setError ] = useState<string | null>( null );
	const [ result, setResult ] = useState<string | number>( '-' );

	const get = useCallback( ( data: T ) => {
		setError( null );

		try {
			setResult( getResult( data ) );
		} catch ( error: any ) {
			setResult( '-' );
			setError( error?.message );
		}
	}, [ getResult, setError, setResult ] );

	return { error, result, get };
};

export const pass = ( input: string ) => input;

function Solution<T>( { children, className, parseInput, partOne, partTwo }: SolutionProps<T> ) {
	const [ input, setInput ] = useState( '' );
	const [ error, setError ] = useState<string | null>( null );

	const partOneSolution = useSolution<T>( partOne || notSolved );
	const partTwoSolution = useSolution<T>( partTwo || notSolved );

	const handleSubmit = useCallback( ( event: SyntheticEvent ) => {
		event.preventDefault();
		setError( null );

		try {
			const data = parseInput( input );

			partOneSolution.get( data );
			partTwoSolution.get( data );
		} catch ( error: any ) {
			setError( error?.message );
		}
	}, [ input, parseInput, partOneSolution.get, partTwoSolution.get ] );

	const classes = classnames( 'solution', className );

	return (
		<form className={ classes } onSubmit={ handleSubmit }>
			<Panel.Results
				disabled={ ! input }
				partOne={ partOneSolution.result }
				partTwo={ partTwoSolution.result }
			/>

			{ error && <Panel.Error label="⇢" message={ error } /> }
			{ partOneSolution.error && <Panel.Error label="①" message={ partOneSolution.error } /> }
			{ partTwoSolution.error && <Panel.Error label="②" message={ partTwoSolution.error } /> }

			<Panel>
				<InputTextarea defaultValue={ input } onChange={ setInput } />
			</Panel>
		</form>
	);
};

export default Solution;
