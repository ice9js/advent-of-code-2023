import { parseInput, sumOfDigits, sumIncludingSpelledDigits } from '../../lib/trebuchet';
import Solution from '../solution';

const Trebuchet = () => (
	<Solution
		parseInput={ parseInput }
		partOne={ sumOfDigits }
		partTwo={ sumIncludingSpelledDigits }
	/>
);

export default Trebuchet;
