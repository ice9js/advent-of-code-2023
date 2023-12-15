import { parseInput, sumOfHashedSequence, focusingPower } from '../../lib/lens-library';
import Solution from '../solution';

const LensLibrary = () => (
	<Solution
		parseInput={ parseInput }
		partOne={ sumOfHashedSequence }
		partTwo={ focusingPower }
	/>
);

export default LensLibrary;
