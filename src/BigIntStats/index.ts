const toString = (bigint: bigint): string => {
  return bigint.toString() + 'n'
}

interface Result {
  entries: Record<string, number>
  bigints: string[]
  numEntries: number
  lowestValue: bigint
  highestValue: bigint
  averageValue: bigint
  of: (num: bigint) => number
}

export default class BigIntStats {
  private _result: Record<string, number> = {}

  private _numEntries = 0
  private _lowestValue = NaN
  private _highestValue = NaN
  private _sumValue = NaN

  private _numAdded = 0
  private _isSummarized = false

  add = (int: bigint): void => {
    const bigintAsString = toString(int)

    if (!(bigintAsString in this._result)) {
      this._result[bigintAsString] = 0
    }

    this._result[bigintAsString]++
    this._numAdded++
  }

  get result (): Result {
    // @ts-expect-error
    const object: Result = {
      of: (num: bigint) => {
        this._summarize()

        const bigintAsString = toString(num)

        if (!(bigintAsString in this._result)) {
          throw new Error(`bigint ${bigintAsString} is not in the results.`)
        }

        return this._result[bigintAsString]
      }
    }

    const props: Partial<Record<keyof Result, PropertyDescriptor>> = {
      entries: {
        get: () => {
          this._summarize()

          return { ...this._result }
        }
      },
      bigints: {
        get: () => {
          this._summarize()

          return Object
            .keys(this._result)
            .map(value => BigInt(value.slice(0, -1)))
            .sort((a, b) => {
              if (a > b) {
                return 1
              } else if (a < b) {
                return -1
              }

              return 0
            })
            .map(value => toString(value))
        }
      },
      numEntries: {
        get: () => {
          this._summarize()

          return this._numEntries
        }
      },
      lowestValue: {
        get: () => {
          this._summarize()

          return this._lowestValue
        }
      },
      highestValue: {
        get: () => {
          this._summarize()

          return this._highestValue
        }
      },
      averageValue: {
        get: () => {
          this._summarize()

          return this._sumValue / this._numEntries
        }
      }
    }

    Object.defineProperties(object, props)

    return object
  }

  private _summarize (): void {
    if (!this._isSummarized) {
      for (const [key, value] of Object.entries(this._result)) {
        this._result[key] = value / this._numAdded
      }

      this._numEntries = Object.keys(this._result).length

      for (const value of Object.values(this._result)) {
        // eslint-disable-next-line no-self-compare
        if (this._lowestValue !== this._lowestValue) {
          this._lowestValue = value
        }

        if (this._lowestValue > value) {
          this._lowestValue = value
        }

        // eslint-disable-next-line no-self-compare
        if (this._highestValue !== this._highestValue) {
          this._highestValue = value
        }

        if (this._highestValue < value) {
          this._highestValue = value
        }

        // eslint-disable-next-line no-self-compare
        if (this._sumValue !== this._sumValue) {
          this._sumValue = 0
        }

        this._sumValue += value
      }

      this._isSummarized = true
    }
  }
}
