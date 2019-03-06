const toArray = items => {
  if (Array.isArray(items)) return items
  if (items != null) return [items]
  return []
}

module.exports = toArray
