export const sum = ( a: number, b: number ): number => a + b;

export const lcm = ( a: number, b: number ): number =>
	( a * b ) / gcd( a, b );

export const gcd = ( a: number, b: number ): number => {
	if ( ! b ) {
		return a;
	}

	return gcd( b, a % b );
};
