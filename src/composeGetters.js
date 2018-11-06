class GetterComposition {
  constructor(...args) {
    this.composeData = args.pop()
    this.getters = args
  }
}

export default (...args) => (
  new GetterComposition(...args)
)
