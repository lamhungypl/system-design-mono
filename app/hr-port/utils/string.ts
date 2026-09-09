export function getRegexFromString(regexString: string) {
  // Match the regular expression literal format: /pattern/flags
  const regexMatch = regexString.match(/^\/(.*?)\/([gimsuy]*)$/)

  if (regexMatch) {
    const pattern = regexMatch[1]
    const flags = regexMatch[2]

    return new RegExp(pattern, flags)
  } else {
    return null
  }
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
