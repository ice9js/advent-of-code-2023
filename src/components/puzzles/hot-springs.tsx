import { parseRows, countPossibleSpringArrangements, countPossibleUnfoldedArrangements } from '../../lib/hot-springs';
import Solution from '../solution';

const HotSprings = () => (
	<Solution
		parseInput={ parseRows }
		partOne={ countPossibleSpringArrangements }
		partTwo={ countPossibleUnfoldedArrangements }
	/>
);

export default HotSprings;
