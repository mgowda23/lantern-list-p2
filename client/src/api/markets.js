function marketsUrl({ region, specialty }) {
  const url = new URL('/api/markets', window.location.origin)
  if (region) url.searchParams.set('region', region)
  if (specialty) url.searchParams.set('specialty', specialty)
  return url
}

export async function getMarkets({ region = '', specialty = '' } = {}) {
  const response = await fetch(marketsUrl({ region, specialty }))
  if (!response.ok) throw new Error('Could not load markets')
  return response.json()
}

export async function getMarket(slug) {
  const response = await fetch(`/api/markets/${encodeURIComponent(slug)}`)
  if (response.status === 404) return null
  if (!response.ok) throw new Error('Could not load market')
  return response.json()
}
