export class GetterComposition {
  constructor(...args) {
    this.composeData = args.pop()
    this.getters = args
    this.calculated = false
    this.calculatedResult = undefined
  }

  updateCalculatedResult = (result) => {
    this.calculated = true
    this.calculatedResult = result
  }
}

export default (...args) => (
  new GetterComposition(...args)
)
