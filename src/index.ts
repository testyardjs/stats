/**
 * Default iteration length for gathering stats data.
 * This ***(1 million iterations by default)*** should be enough
 * in most stats gathering cases.
 *
 * @default 1000000
 */
export const LENGTH = 1_000_000

export { default as BooleanStats } from './BooleanStats'
export { default as CharacterStats } from './CharacterStats'
export { default as FloatStats } from './FloatStats'
export { default as IntegerStats } from './IntegerStats'
export { default as BigIntStats } from './BigIntStats'
