export default function valuesFromEnum(enums: {
  [k: string]: any
}): Array<string> {
  return Object.keys(enums).filter((k) => typeof enums[k] === 'number')
}
