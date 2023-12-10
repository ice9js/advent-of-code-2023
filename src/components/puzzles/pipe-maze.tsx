import { useMemo } from 'react';
import classnames from 'classnames';

import { Maze, parseMaze, stepsToFurthestPointInLoop, insideTilesCount, findInsideTiles, findLoop, filterMaze } from '../../lib/pipe-maze';
import Panel from '../panel';
import Solution from '../solution';

import './pipe-maze.css';

interface GridProps {
	className?: string,
	coords: number[],
	maze: Maze,
	width: number;
}

interface VisualizationProps {
	data: Maze;
}

const Grid = ( { coords, className, maze, width }: GridProps ) => (
	<Panel className="pipe-maze__grid">
		<div className="pipe-maze__grid-container">
			{ coords.map( ( position ) => {
				const value = maze.tiles[ position ];

				const classes = classnames( 'pipe-maze__grid-dot', className, {
					'is-start': value === 'S',
					'is-vertical': value === '|',
					'is-horizontal': value === '-',
					'is-top-right': value === 'L',
					'is-top-left': value === 'J',
					'is-bottom-left': value === '7',
					'is-bottom-right': value === 'F',
					'is-dot': value === '.',
				} );

				const styles = {
					top: Math.floor( position / width ) * 4,
					left: ( position % width ) * 4
				};

				return <div key={ position } className={ classes } style={ styles } />;
			} ) }
		</div>
	</Panel>
);

const Visualization = ( { data }: VisualizationProps ) => {
	const loop = useMemo( () => findLoop( data ), [ data ] );

	const filteredMaze = useMemo( () => filterMaze( data, loop ), [ data, loop ] );
	const insideTiles = useMemo( () => findInsideTiles( data, loop ), [ data, loop ] );

	return (
		<>
			<Grid maze={ data } coords={ loop } width={ data.width } />
			<Grid
				className="is-combined"
				maze={ filteredMaze }
				coords={ [ ...loop, ...insideTiles] }
				width={ data.width }
			/>
		</>
	);
};

const PipeMaze = () => (
	<Solution
		parseInput={ parseMaze }
		partOne={ stepsToFurthestPointInLoop }
		partTwo={ insideTilesCount }
		visualization={ Visualization }
	/>
);

export default PipeMaze;
