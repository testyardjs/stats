import CharacterStats from '../../src/CharacterStats'

describe('CharacterStats', () => {
  test('basics', () => {
    const { add, result } = new CharacterStats()

    add('a')
    add('b')
    add('b')
    add('c')
    add('c')
    add('c')

    expect(result.numEntries).toBe(3)
    expect(result.characters).toEqual(['a', 'b', 'c'])

    expect(result.lowestValue).toBe(0.16666666666666666)
    expect(result.highestValue).toBe(0.5)
    expect(result.averageValue).toBe(0.3333333333333333)

    expect(result.of('a')).toBe(0.16666666666666666)
    expect(result.of('b')).toBe(0.3333333333333333)
    expect(result.of('c')).toBe(0.5)
  })

  test('flexibility', () => {
    const { add, result } = new CharacterStats()

    add('a')
    add('bb')
    add(['c', 'c', 'c'])
    add(['d', 'dd', 'ddd'])

    expect(result.numEntries).toBe(4)
    expect(result.characters).toEqual(['a', 'b', 'c', 'd'])

    expect(result.lowestValue).toBe(0.08333333333333333)
    expect(result.highestValue).toBe(0.5)
    expect(result.averageValue).toBe(0.25)

    expect(result.of('a')).toBe(0.08333333333333333)
    expect(result.of('b')).toBe(0.16666666666666666)
    expect(result.of('c')).toBe(0.25)
    expect(result.of('d')).toBe(0.5)
  })
})
