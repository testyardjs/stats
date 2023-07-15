const cutToDecimals = (num: number, decimals = 1): number => {
  const factor = Math.pow(10, decimals)
  return Math.floor(num * factor) / factor

  // return parseFloat(num.toFixed(decimals))
}

interface Result {
  entries: Record<string, number>
  floats: number[]
  numEntries: number
  lowestValue: number
  highestValue: number
  averageValue: number
  of: (num: number) => number
  firstEntry: { value: number, percent: number }
  lastEntry: { value: number, percent: number }
}

export default class FloatStats {
  private _result: Record<string, number> = {}

  private _numEntries = 0
  private _lowestValue = NaN
  private _highestValue = NaN

  private _sumValue = NaN

  private _numAdded = 0
  private _isSummarized = false

  add = (num: number, decimals = 1): void => {
    // console.log('input', num)

    // num = parseFloat(num.toFixed(decimals + 2))
    // num = Math.round((num + Number.EPSILON) * 1000) / 1000
    num = cutToDecimals(num, decimals)

    // console.log('formatted', num)

    if (!(num in this._result)) {
      this._result[num] = 0
    }

    this._result[num]++
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
      floats: {
        get: () => {
          this._summarize()

          return Object
            .keys(this._result)
            .map(value => parseFloat(value))
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
      },
      firstEntry: {
        get: () => {
          this._summarize()

          const floats = Object.keys(this._result)
            .map(value => parseFloat(value))
            .sort((a, b) => a - b)

          return {
            value: floats[0],
            percent: this._result[floats[0]]
          }
        }
      },
      lastEntry: {
        get: () => {
          this._summarize()

          const floats = Object.keys(this._result)
            .map(value => parseFloat(value))
            .sort((a, b) => a - b)

          return {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            value: floats.at(-1)!,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            percent: this._result[floats.at(-1)!]
          }
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
