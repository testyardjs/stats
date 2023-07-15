import BooleanStats from '../../src/BooleanStats'

describe('BooleanStats', () => {
  test('default', () => {
    const { add, result } = new BooleanStats()

    add(true)
    add(false)
    add(false)

    expect(result.true.total).toBe(1)
    expect(result.true.percent).toBe(0.3333333333333333)

    expect(result.false.total).toBe(2)
    expect(result.false.percent).toBe(0.6666666666666666)
  })
})
