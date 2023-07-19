import StringStats from '../../src/StringStats'

describe('StringStats', () => {
  test('basics', () => {
    const { add, result } = new StringStats()

    add('a')
    add('bb')
    add('ccc')

    expect(result.characters).toBe('abc')

    expect(result.lowestLength).toBe(1)
    expect(result.highestLength).toBe(3)
    expect(result.averageLength).toBe(2)
  })
})
