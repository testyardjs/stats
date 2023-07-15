// x

interface Result {
  entries: Record<string, number>
  integers: number[]
  numEntries: number
  lowestValue: number
  highestValue: number
  averageValue: number
  of: (num: number) => number
}

export default class IntegerStats {
  private _result: Record<string, number> = {}

  private _numEntries = 0
  private _lowestValue = NaN
  private _highestValue = NaN
  private _sumValue = NaN

  private _numAdded = 0
  private _isSummarized = false

  add = (int: number): void => {
    if (!(int in this._result)) {
      this._result[int] = 0
    }

    this._result[int]++
    this._numAdded++
  }

  get result (): Result {
    // @ts-expect-error
    const object: Result = {
      of: (num: number) => {
        this._summarize()

        if (!(num in this._result)) {
          throw new Error(`num ${num} is not in the results.`)
        }

        return this._result[num]
      }
    }

    const props: Partial<Record<keyof Result, PropertyDescriptor>> = {
      entries: {
        get: () => {
          this._summarize()

          return { ...this._result }
        }
      },
      integers: {
        get: () => {
          this._summarize()

          return Object
            .keys(this._result)
            .map(value => parseInt(value, 10))
            .sort((a, b) => a - b)
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
