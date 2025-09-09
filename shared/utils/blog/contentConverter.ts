export function contentConverter(content: string) {
  const replacements: Record<string, string> = {
    '<h5': '<h6',
    '</h5>': '</h6>',
    '<h4': '<h5',
    '</h4>': '</h5>',
    '<h3': '<h4',
    '</h3>': '</h4>',
    '<h2': '<h3',
    '</h2>': '</h3>',
    '<h1': '<h2',
    '</h1>': '</h2>',
  }

  return Object.entries(replacements).reduce((acc, [oldTag, newTag]) => {
    const regex = new RegExp(oldTag, 'g')
    return acc.replace(regex, newTag)
  }, content)
}
