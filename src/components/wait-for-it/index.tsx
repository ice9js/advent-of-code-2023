import { parseInput, waysToWin, adjustedWaysToWin } from '../../lib/boat-races';
import Solution from '../solution';

const WaitForIt = () => (
	<Solution
		parseInput={ parseInput }
		partOne={ waysToWin }
		partTwo={ adjustedWaysToWin }
	/>
);

export default WaitForIt;
