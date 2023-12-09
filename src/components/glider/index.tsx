import { parseInput, sumOfNext, sumOfPrevious } from '../../lib/glider';
import Solution from '../solution';

const Glider = () => (
	<Solution
		parseInput={ parseInput }
		partOne={ sumOfNext }
		partTwo={ sumOfPrevious }
	/>
);

export default Glider;
