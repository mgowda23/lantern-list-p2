import './css/styles.css'
import { getMarket, getMarkets } from './api/markets.js'
import { renderDetail, renderError, renderHome, renderNotFound } from './render.js'

const content = document.querySelector('#content')
const description = document.querySelector('meta[name="description"]')

let renderId = 0
let searchTimer = 0
let pendingFocus = false
let pendingCursor = null

function show(view) {
  document.title = view.title
  if (description) description.setAttribute('content', view.description)
  content.innerHTML = view.html

  if (!pendingFocus) return
  const input = document.querySelector('#specialty')
  if (!input) return
  input.focus()
  if (pendingCursor != null) input.setSelectionRange(pendingCursor, pendingCursor)
  pendingFocus = false
  pendingCursor = null
}

function rememberSearchFocus() {
  const input = document.activeElement
  if (!input || input.id !== 'specialty') return
  pendingFocus = true
  pendingCursor = input.selectionStart
}

async function render() {
  const id = ++renderId
  const url = new URL(window.location.href)
  let path = url.pathname
  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1)
    history.replaceState({}, '', path + url.search)
  }

  try {
    const marketMatch = path.match(/^\/markets\/([^/]+)$/)
    if (marketMatch) {
      const market = await getMarket(decodeURIComponent(marketMatch[1]))
      if (id !== renderId) return
      show(market ? renderDetail(market) : renderNotFound(path))
      return
    }

    if (path !== '/') {
      if (id !== renderId) return
      show(renderNotFound(path))
      return
    }

    const requestedRegion = url.searchParams.get('region')?.trim() || ''
    const specialty = url.searchParams.get('specialty')?.trim() || ''
    const data = await getMarkets({ region: requestedRegion, specialty })
    if (id !== renderId) return

    const activeRegion =
      data.regions.find((region) => region.toLowerCase() === requestedRegion.toLowerCase()) || ''

    show(
      renderHome({
        markets: data.markets,
        regions: data.regions,
        activeRegion,
        requestedRegion,
        regionMiss: Boolean(requestedRegion) && !activeRegion,
        specialty,
        total: data.total,
      }),
    )
  } catch (error) {
    if (id !== renderId) return
    console.error(error)
    show(renderError())
  }
}

function samePlace(next) {
  return next.pathname === location.pathname && next.search === location.search
}

document.addEventListener('click', (event) => {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return
  }

  const link = event.target.closest('a')
  if (!link || link.target === '_blank' || link.origin !== location.origin) return
  event.preventDefault()
  const next = new URL(link.href)
  if (samePlace(next)) return
  history.pushState({}, '', next)
  render()
})

document.addEventListener('submit', (event) => {
  const form = event.target
  if (!(form instanceof HTMLFormElement) || form.id !== 'search') return
  event.preventDefault()
  const next = new URL(form.action || window.location.href)
  const specialty = new FormData(form).get('specialty')
  const region = new FormData(form).get('region')
  next.search = ''
  if (typeof region === 'string' && region.trim()) next.searchParams.set('region', region.trim())
  if (typeof specialty === 'string' && specialty.trim()) {
    next.searchParams.set('specialty', specialty.trim())
  }
  if (samePlace(next)) return
  history.pushState({}, '', next)
  render()
})

document.addEventListener('input', (event) => {
  if (event.target.id !== 'specialty') return
  clearTimeout(searchTimer)
  const value = event.target.value
  const cursor = event.target.selectionStart
  searchTimer = setTimeout(() => {
    const next = new URL(window.location.href)
    const trimmed = value.trim()
    if (trimmed) next.searchParams.set('specialty', trimmed)
    else next.searchParams.delete('specialty')
    if (samePlace(next)) return
    rememberSearchFocus()
    pendingCursor = cursor
    history.replaceState({}, '', next)
    render()
  }, 200)
})

window.addEventListener('popstate', render)
render()
