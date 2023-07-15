import BigIntStats from '../../src/BigIntStats'

describe('BigIntStats', () => {
  test('default', () => {
    const { add, result } = new BigIntStats()

    add(0n)
    add(1n)
    add(1n)
    add(2n)
    add(2n)
    add(2n)

    expect(result.numEntries).toBe(3)
    expect(result.bigints).toEqual(['0n', '1n', '2n'])

    expect(result.lowestValue).toBe(0.16666666666666666)
    expect(result.highestValue).toBe(0.5)
    expect(result.averageValue).toBe(0.3333333333333333)

    expect(result.of(0n)).toBe(0.16666666666666666)
    expect(result.of(1n)).toBe(0.3333333333333333)
    expect(result.of(2n)).toBe(0.5)
  })
})
