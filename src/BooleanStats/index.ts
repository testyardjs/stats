interface Result {
  true: {
    total: number
    percent: number
  }
  false: {
    total: number
    percent: number
  }
}

export default class BooleanStats {
  private _numTrue = 0
  private _numFalse = 0
  private _numAdded = 0

  // private _isSummarized = false
  // constructor () {}

  add = (value: boolean): void => {
    if (typeof value !== 'boolean') {
      throw new Error(`value should be boolean, got: ${typeof value}.`)
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
    if (value === true) {
      this._numTrue++
    } else {
      this._numFalse++
    }

    this._numAdded++
  }

  get result (): Result {
    // @ts-expect-error
    const object: {
      true: { total: number, percent: number }
      false: { total: number, percent: number }
    } = {}

    const props: Partial<Record<keyof Result, PropertyDescriptor>> = {
      true: {
        get: () => ({
          total: this._numTrue,
          percent: this._numTrue / this._numAdded
        })
      },
      false: {
        get: () => ({
          total: this._numFalse,
          percent: this._numFalse / this._numAdded
        })
      }
    }

    Object.defineProperties(object, props)

    return object
  }
}
