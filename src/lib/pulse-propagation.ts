import { lcm } from './util';

type Pulse = 0 | 1;

interface Module {
	address: string;
	type: string;
	inputs: string[];
	outputs: string[];
	state: Pulse[];
}

type Network = Record<string, Module>;

interface Message {
	from: string,
	to: string,
	pulse: Pulse,
};

export const parseNetwork = ( input: string ): Network => {
	const modules = input
		.split( '\n' )
		.map( ( line ) => {
			const [ _, moduleType, address, outputs ] = line.match( /^(\%|\&)?(\w+)\s+\-\>\s+(.*)/ )!;

			return {
				address,
				type: moduleType,
				outputs: outputs.split( /\s*,\s*/ ),
			};
		} );

	return modules.reduce(
		( network, { address, type, outputs } ) => {
			const inputs = modules
				.filter( ( { outputs } ) => outputs.includes( address ) )
				.map( ( { address } ) => address );

			return {
				...network,
				[ address ]: {
					address,
					type,
					inputs,
					outputs,
					state: inputs.map( () => 0 ),
				},
			};
		},
		{}
	);
};

let loops: Record<string, number> = {};
let i = 0;

const processMessage = ( module: Module, { from, pulse }: Message ): Message[] => {
	if ( module.type === '%' ) {
		if ( pulse ) {
			return [];
		}

		module.state[ 0 ] = module.state[ 0 ] ? 0 : 1;

		return module.outputs.map( ( to ) => ( {
			from: module.address,
			to,
			pulse: module.state[ 0 ]
		} ) );
	}

	if ( module.type === '&' ) {
		module.state[ module.inputs.indexOf( from ) ] = pulse;

		if ( module.state.every( ( n ) => n === 0 ) ) {
			if ( ! loops[ module.address ] ) {
				loops[ module.address ] = i;
			}

			if ( i % loops[ module.address ] !== 0 ) {
				console.log( module.address + ' ' + i + ' ' + ( i - loops[ module.address ] ) );
			}
		}

		return module.outputs.map( ( to ) => ( {
			from: module.address,
			to,
			pulse: module.state.reduce( ( result, mem ) => result || ( mem === 1 ? 0 : 1 ), 0 ),
		} ) );
	}

	return module.outputs.map( ( to ) => ( { from: module.address, to, pulse } ) );
};

const countSignals = ( network: Network, initialMessage: Message ): [ number, number ] => {
	const messageQueue = [ initialMessage ];

	let low = 0;
	let high = 0;

	while ( messageQueue.length ) {
		const current = messageQueue.shift()!

		if ( current.pulse ) {
			high++;
		} else {
			low++;
		}

		if ( network[ current.to ] ) {
			processMessage( network[ current.to ], current )
				.forEach( ( message ) => messageQueue.push( message ) );
		}
	}

	return [ low, high ];
}

export const partOne = ( network: Network ) => {
	let low = 0;
	let high = 0;

	console.log( network );

	for ( let module of Object.values( network ) ) {
		if ( module.type === '&' ) {
			loops[ module.address ] = 0;
		}
	}

	for ( i = 0; i < 10000; i++ ) {
		const result = countSignals( network, { from: '', to: 'broadcaster', pulse: 0 } );

		low += result[ 0 ];
		high += result[ 1 ];
	}

	console.log( loops );

	return low * high;
}

const rxReached = ( network: Network, initialMessage: Message ): boolean => {
	const messageQueue = [ initialMessage ];

	while ( messageQueue.length ) {
		const current = messageQueue.shift()!

		if ( current.to === 'rx' ) {
			if ( current.pulse === 0 ) {
				return true;
			}
		}

		if ( network[ current.to ] ) {
			processMessage( network[ current.to ], current )
				.forEach( ( message ) => messageQueue.push( message ) );
		}
	}

	return false;
}

export const partTwo = ( network: Network ) => {
	let i = 1;

	console.log( network );

	// while ( ! rxReached( network, { from: '', to: 'broadcaster', pulse: 0 } ) ) i++;

	return i;
}

console.log( [ 3917, 4013, 3793, 4051 ].reduce( lcm ) );
