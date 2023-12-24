interface Position {
	x: number;
	y: number;
	z: number;
}

type Vector = Position;

type Line = [ Position, Vector ];

export const parseInput = ( input: string ): Line[] =>
	input
		.split( '\n' )
		.map( ( line ) => {
			const [ px, py, pz, vx, vy, vz ] = line.match( /\-?\d+/g )!.map( ( n ) => parseInt( n, 10 ) );

			return [
				{ x: px, y: py, z: pz },
				{ x: vx, y: vy, z: vz },
			];
		} );

const xyIntersection = ( [ pa, va ]: Line, [ pb, vb ]: Line ): Position | null => {
	const t = ( vb.y * ( pb.x - pa. x) - vb.x * ( pb.y - pa.y ) ) / ( va.x * vb.y - vb.x * va.y );

	if ( t === Infinity ) {
		return null;
	}

	const intersection = {
		x: pa.x + va.x * t,
		y: pa.y + va.y * t,
		z: 0,
	};

	// Only count future intersections!
	if (
		Math.sign( intersection.x - pa.x ) === -Math.sign( va.x ) ||
		Math.sign( intersection.y - pa.y ) === -Math.sign( va.y ) ||
		Math.sign( intersection.x - pb.x ) === -Math.sign( vb.x ) ||
		Math.sign( intersection.y - pb.y ) === -Math.sign( vb.y )
	) {
		return null;
	}

	return intersection;
};

export const partOne = ( input: Line[] ) => {
	const min = { x: 200000000000000, y: 200000000000000, z: 200000000000000 };
	const max = { x: 400000000000000, y: 400000000000000, z: 400000000000000 };
	// const min = { x: 7, y: 7, z: 7 };
	// const max = { x: 27, y: 27, z: 27 };

	return input
		.map(
			( a, i ) => input
				.slice( i + 1 )
				.map( ( b ) => xyIntersection( a, b ) )
		)
		.flat()
		.filter(
			( position ) =>
				position &&
				min.x <= position.x &&
				 position.x <= max.x &&
				  min.y <= position.y &&
				   position.y <= max.y
		)
		.length;
};

export const partTwo = ( input: Line[] ) => {
	return 0;
}
