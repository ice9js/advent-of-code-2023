import classnames from 'classnames';

import './styles.css';

interface PanelProps {
	children?: any;
	className?: any;
}

interface ErrorPanelProps {
	label: string;
	message: string | null;
}

interface ResultsPanelProps {
	disabled?: boolean;
	partOne?: string | number;
	partTwo?: string | number;
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

const ErrorPanel = ( { label, message }: ErrorPanelProps ) => (
	<Panel className="error-panel">
		<p>
			<span className="error-panel__label">{ label }</span>
			{ message }
		</p>
	</Panel>
);

const ResultsPanel = ( { disabled, partOne, partTwo }: ResultsPanelProps ) => (
	<Panel className="results-panel">
		<div className="results-panel__result">
			<span className="results-panel__result-label">Part One</span>
			<p className="results-panel__result-value">{ partOne }</p>
		</div>
		<div className="results-panel__result">
			<span className="results-panel__result-label">Part Two</span>
			<p className="results-panel__result-value">{ partTwo }</p>
		</div>
		<div>
			<button
				className="results-panel__submit-button"
				disabled={ disabled }
				type="submit">
					GO
			</button>
		</div>
	</Panel>
);

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

Panel.Error = ErrorPanel;
Panel.Results = ResultsPanel;
Panel.Select = SelectPanel;
Panel.Solution = SolutionPanel;

export default Panel;
