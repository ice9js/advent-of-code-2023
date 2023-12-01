import classnames from 'classnames';

import './styles.css';

interface PanelProps {
	children?: any;
	className?: any;
}

interface SolutionPanelProps {
	label: string;
	value: string | number;
}

interface SelectOption {
	label: string;
	value: any;
}

interface SelectPanelProps {
	activeOption: any;
	options: SelectOption[];
	onSelect: ( value: any ) => void;
}

const Panel = ( { children, className }: PanelProps ) => {
	const classes = classnames( 'panel', className );

	return (
		<div className={ classes }>
			{ children }
		</div>
	);
};

const SolutionPanel = ( { label, value }: SolutionPanelProps ) => (
	<Panel className="solution-panel">
		<h3 className="solution-panel__label">{ label }</h3>
		<p className="solution-panel__value">{ value }</p>
	</Panel>
);

const SelectPanel = ( { activeOption, options, onSelect }: SelectPanelProps ) => (
	<Panel className="select-panel">
		{ options.map( ( { label, value } ) => (
			<button className="select-panel__button" onClick={ () => onSelect( value ) }>
				{ label }
			</button>
		) ) }
	</Panel>
);

Panel.Select = SelectPanel;
Panel.Solution = SolutionPanel;

export default Panel;
