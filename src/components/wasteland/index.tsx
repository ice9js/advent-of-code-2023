import { parseMap, steps, ghostSteps } from '../../lib/wasteland';
import Solution from '../solution';

const Wasteland = () => (
	<Solution
		parseInput={ parseMap }
		partOne={ steps }
		partTwo={ ghostSteps }
	/>
);

export default Wasteland;
