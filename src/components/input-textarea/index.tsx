import { useCallback } from 'react';
import classnames from 'classnames';

import './styles.css';

const InputTextarea = ( props: any ) => {
	const classes = classnames( 'input-textarea', props.className );

	const handleChange = useCallback( ( event: any ) => props.onChange( event.target.value ), [ props.onChange ] );

	return (
		<textarea spellCheck={ false } { ...props } className={ classes } onChange={ handleChange }>
		</textarea>
	);
};

export default InputTextarea;
