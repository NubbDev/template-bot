const endsWithAny = (values: string[], str: string) => {
    return values.some(value => str.endsWith(value))
}

export {
    endsWithAny
}