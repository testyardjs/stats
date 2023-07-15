import IntegerStats from '../../src/IntegerStats'

describe('IntegerStats', () => {
  test('default', () => {
    const { add, result } = new IntegerStats()

    add(0)
    add(1)
    add(1)
    add(2)
    add(2)
    add(2)

    expect(result.numEntries).toBe(3)
    expect(result.integers).toEqual([0, 1, 2])

    expect(result.lowestValue).toBe(0.16666666666666666)
    expect(result.highestValue).toBe(0.5)
    expect(result.averageValue).toBe(0.3333333333333333)

    expect(result.of(0)).toBe(0.16666666666666666)
    expect(result.of(1)).toBe(0.3333333333333333)
    expect(result.of(2)).toBe(0.5)
  })
})
