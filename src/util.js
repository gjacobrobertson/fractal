const composer = (result, fn) => fn(result)

export const compose = (...fns) => (...args) => fns.reduceRight(composer, args)
export const sequence = (...fns) => (...args) => fns.reduce(composer, args)
