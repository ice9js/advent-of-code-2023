import { useMemo } from 'react';

import { Coords, Maze, parseMaze, stepsToFurthestPointInLoop, insideTilesCount, findInsideTiles, findLoop, filterMaze } from '../../lib/pipe-maze';
import Panel from '../panel';
import Solution from '../solution';

import './pipe-maze.css';

interface GridProps {
	coords: Coords[],
}

interface VisualizationProps {
	data: Maze;
}

const Grid = ( { coords }: GridProps ) => (
	<Panel className="pipe-maze__grid">
		<div className="pipe-maze__grid-container">
			{ coords.map( ( [ x, y ] ) => {
				const styles = { top: y * 3, left: x * 3 };

				return (
					<div className="pipe-maze__grid-dot" style={ styles } />
				);
			} ) }
		</div>
	</Panel>
);

const Visualization = ( { data }: VisualizationProps ) => {
	const loop = useMemo( () => findLoop( data ), [ data ] );
	const insideTiles = useMemo( () => findInsideTiles( data, loop ), [ data, loop ] );

	return (
		<>
			<Grid coords={ loop } />
			<Grid coords={ insideTiles } />
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
