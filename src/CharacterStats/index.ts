interface Result {
  entries: Record<string, number>
  characters: string[]
  numEntries: number
  lowestValue: number
  highestValue: number
  averageValue: number
  of: (character: string) => number
}

export default class CharacterStats {
  private _result: Record<string, number> = {}

  private _numEntries = 0
  private _lowestValue = NaN
  private _highestValue = NaN
  private _sumValue = NaN

  private _numAdded = 0
  private _isSummarized = false

  add = (character: string | string[]): void => {
    const chars: string[] = []

    if (typeof character === 'string') {
      chars.push(...character.split(''))
    } else if (Array.isArray(character)) {
      for (const entry of character) {
        chars.push(...entry.split(''))
      }
    }

    for (const char of chars) {
      if (!(char in this._result)) {
        this._result[char] = 0
      }

      this._result[char]++
      this._numAdded++
    }
  }

  get result (): Result {
    // @ts-expect-error
    const object: Result = {
      of: (character: string) => {
        this._summarize()

        if (character.length > 1) {
          throw new Error(`character ${character} must be .length === 1, got .length === ${character.length}.`)
        }

        if (!(character in this._result)) {
          throw new Error(`character ${character} is not in the results.`)
        }

        return this._result[character]
      }
    }

    const props: Partial<Record<keyof Result, PropertyDescriptor>> = {
      entries: {
        get: () => {
          this._summarize()

          return { ...this._result }
        }
      },
      characters: {
        get: () => {
          this._summarize()

          return Object
            .keys(this._result)
            .sort()
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
