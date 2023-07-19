interface Result {
  characters: string
  lowestLength: number
  highestLength: number
  averageLength: number
}

export default class StringStats {
  private _strings: Record<string, number> = {}
  private _characters: Record<string, number> = {}

  private _lowestLength = NaN
  private _highestLength = NaN
  private _sumLength = NaN

  private _numStrings = 0

  private _numStringsAdded = 0
  private _numCharactersAdded = 0
  private _isSummarized = false

  add = (string: string): void => {
    if (typeof string !== 'string') {
      throw new Error(`string must be typeof === 'string', got: typeof === '${typeof string}'.`)
    }

    if (!(string in this._strings)) {
      this._strings[string] = 0
    }

    this._strings[string]++
    this._numStringsAdded++

    const chars: string[] = string.split('')

    for (const char of chars) {
      if (!(char in this._characters)) {
        this._characters[char] = 0
      }

      this._characters[char]++
      this._numCharactersAdded++
    }
  }

  get result (): Result {
    // @ts-expect-error
    const object: Result = {}

    const props: Partial<Record<keyof Result, PropertyDescriptor>> = {
      characters: {
        get: (): Result['characters'] => {
          this._summarize()

          return Object
            .keys(this._characters)
            .sort()
            .join('')
        }
      },
      lowestLength: {
        get: (): Result['lowestLength'] => {
          this._summarize()

          return this._lowestLength
        }
      },
      highestLength: {
        get: (): Result['highestLength'] => {
          this._summarize()

          return this._highestLength
        }
      },
      averageLength: {
        get: (): Result['averageLength'] => {
          this._summarize()

          return this._sumLength / this._numStrings
        }
      }
    }

    Object.defineProperties(object, props)

    return object
  }

  private _summarize (): void {
    if (!this._isSummarized) {
      // for (const [key, value] of Object.entries(this._characters)) {
      //   this._characters[key] = value / this._numCharactersAdded
      // }

      this._numStrings = Object.keys(this._strings).length

      for (const key of Object.keys(this._strings)) {
        const length = key.length

        // eslint-disable-next-line no-self-compare
        if (this._lowestLength !== this._lowestLength) {
          this._lowestLength = length
        }

        if (this._lowestLength > length) {
          this._lowestLength = length
        }

        // eslint-disable-next-line no-self-compare
        if (this._highestLength !== this._highestLength) {
          this._highestLength = length
        }

        if (this._highestLength < length) {
          this._highestLength = length
        }

        // eslint-disable-next-line no-self-compare
        if (this._sumLength !== this._sumLength) {
          this._sumLength = 0
        }

        this._sumLength += length
      }

      this._isSummarized = true
    }
  }
}
