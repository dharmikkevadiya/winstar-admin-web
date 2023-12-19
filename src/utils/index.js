const { currencySymbolList } = require('./data')

exports.isAccess = (permissions, category, subCategory, action) => {
  // Check if the category exists in permissions
  if (permissions?.length && permissions[category]) {
    // Check if the subCategory exists in the category
    if (permissions[category][subCategory]) {
      // Check if the action exists in the subCategory
      if (permissions[category][subCategory].includes(action)) {
        return true
      }
    }
  }

  return false
}

exports.renderAmount = params => {
  const currencyName = params.row.currency // Extracting the image URL from the field value
  const amount = params.row.amount // Extracting the image URL from the field value

  if (currencyName && amount) {
    const symbol = currencySymbolList[currencyName]

    return symbol ? `${symbol} ${amount.toFixed(2)}` : `${amount.toFixed(2)}`
  } else {
    return '-'
  }
}

exports.renderWinAmount = params => {
  const currencyName = params.row.currency // Extracting the image URL from the field value
  const amount = params.row.winAmount // Extracting the image URL from the field value

  if (currencyName && amount) {
    const symbol = currencySymbolList[currencyName]

    return symbol ? `${symbol}${amount.toFixed(2)}` : `${amount.toFixed(2)}`
  } else {
    return '-'
  }
}

exports.generateColorsForChart = len => {
  const baseColors = [
    '#826bf8',
    '#00d4bd',
    '#3949AB',
    '#00897B',
    '#558B2F',
    '#F4511E',
    '#5D4037',
    '#757575',
    '#BF360C',
    '#1A237E',
    '#E65100',
    '#263238',
    '#455A64',
    '#3E2723',
    '#424242',
    '#BF360C',
    '#004D40',
    '#212121',
    '#FF6F00',
    '#004D40',
    '#33691E',
    '#827717'
  ]
  const colors = [...baseColors]

  while (colors.length < len) {
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16)
    if (!colors.includes(randomColor)) {
      colors.push(randomColor)
    }
  }

  return colors
}
