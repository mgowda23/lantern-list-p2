function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function countLabel({ shown, activeRegion, specialty, regionMiss, requestedRegion }) {
  const place = regionMiss ? requestedRegion : activeRegion
  const marketWord = shown === 1 ? 'market' : 'markets'
  if (!place && !specialty) return `${shown} night ${marketWord}`
  if (place && specialty) return `${shown} ${marketWord} in ${place} matching “${specialty}”`
  if (place) return `${shown} ${marketWord} in ${place}`
  return `${shown} ${marketWord} matching “${specialty}”`
}

function regionLinks({ regions, activeRegion, requestedRegion, specialty }) {
  const querySuffix = specialty ? `&specialty=${encodeURIComponent(specialty)}` : ''
  const allHref = specialty ? `/?specialty=${encodeURIComponent(specialty)}` : '/'
  const allCurrent = requestedRegion ? '' : ' aria-current="page"'
  const chips = regions
    .map((region) => {
      const current = region === activeRegion ? ' aria-current="page"' : ''
      const href = `/?region=${encodeURIComponent(region)}${querySuffix}`
      return `<a href="${href}"${current}>${escapeHtml(region)}</a>`
    })
    .join('')

  return `<nav class="filters" aria-label="Filter by region">
        <a href="${allHref}"${allCurrent}>All</a>
        ${chips}
      </nav>`
}

function marketCard(market) {
  return `<a class="card" href="/markets/${encodeURIComponent(market.slug)}">
        <article>
          <div class="media">
            <img src="${escapeHtml(market.image)}" alt="${escapeHtml(market.imageAlt)}" width="1400" height="875">
            <span class="price">${escapeHtml(market.priceRange)}</span>
          </div>
          <p class="kicker">${escapeHtml(market.city)} · ${escapeHtml(market.region)}</p>
          <h2>${escapeHtml(market.name)}</h2>
          <p>${escapeHtml(market.specialty)}</p>
        </article>
      </a>`
}

export function renderHome({
  markets,
  regions,
  activeRegion,
  requestedRegion,
  regionMiss,
  specialty,
  total,
}) {
  const label = countLabel({
    shown: markets.length,
    activeRegion,
    specialty,
    regionMiss,
    requestedRegion,
  })
  const empty = markets.length
    ? ''
    : `<p class="empty">Nothing matches. <a href="/">Clear filters</a> and browse all ${total} markets.</p>`
  const hiddenRegion = activeRegion
    ? `<input type="hidden" name="region" value="${escapeHtml(activeRegion)}">`
    : ''

  const html = `<section class="hero">
        <p class="kicker">Field guide</p>
        <h1>Lantern List</h1>
        <p class="lede">Eight night markets and night food streets. Each card shows the place, the snack to hunt down, and what the evening feels like. Open one for every detail.</p>
      </section>
      ${regionLinks({ regions, activeRegion, requestedRegion, specialty })}
      <form id="search" class="search" action="/" method="get" role="search">
        ${hiddenRegion}
        <label for="specialty">Search by specialty
          <input id="specialty" type="search" name="specialty" value="${escapeHtml(specialty)}" placeholder="Try pepper bun, oyster, egg waffle…">
        </label>
      </form>
      <p id="count" class="count">${escapeHtml(label)}</p>
      ${empty}
      <section class="cards" aria-label="Night markets">
        ${markets.map(marketCard).join('')}
      </section>`

  return {
    title: 'Lantern List',
    description:
      'A field guide to night markets and night food streets in Taipei, Bangkok, Hong Kong, and Seoul.',
    html,
  }
}

function fact(label, value) {
  return `<div>
        <dt>${escapeHtml(label)}</dt>
        <dd>${escapeHtml(value)}</dd>
      </div>`
}

export function renderDetail(market) {
  const html = `<p class="back"><a href="/">← All markets</a></p>
      <article class="detail">
        <div class="detail-layout">
          <img src="${escapeHtml(market.image)}" alt="${escapeHtml(market.imageAlt)}" width="1400" height="875">
          <div>
            <p class="kicker">${escapeHtml(market.city)} · ${escapeHtml(market.region)}</p>
            <h1>${escapeHtml(market.name)}</h1>
            <p class="lede">${escapeHtml(market.description)}</p>
          </div>
        </div>
        <h2>All details</h2>
        <dl class="facts">
          ${fact('Id', market.id)}
          ${fact('Name', market.name)}
          ${fact('City', market.city)}
          ${fact('Region', market.region)}
          ${fact('Specialty', market.specialty)}
          ${fact('Hours', market.hours)}
          ${fact('Price range', market.priceRange)}
          ${fact('Best for', market.bestFor)}
          ${fact('Vibe', market.vibe)}
          ${fact('Description', market.description)}
          ${fact('Photo', market.image)}
          ${fact('Photo description', market.imageAlt)}
          ${fact('Photo credit', market.photoCredit)}
          ${fact('Slug', market.slug)}
        </dl>
      </article>`

  return {
    title: `${market.name} · Lantern List`,
    description: `${market.name} in ${market.city}: ${market.specialty}.`,
    html,
  }
}

export function renderNotFound(path) {
  const html = `<section class="missing">
        <p class="kicker">404</p>
        <h1>This stall closed early</h1>
        <p>No page is served for <code>${escapeHtml(path)}</code>. The route does not match the list or a market.</p>
        <a href="/" role="button">Back to Lantern List</a>
      </section>`

  return {
    title: 'Page not found · Lantern List',
    description: 'That route does not match a page on Lantern List.',
    html,
  }
}

export function renderError() {
  const html = `<section class="missing">
        <p class="kicker">Unavailable</p>
        <h1>The list didn't load</h1>
        <p>The page could not reach the markets API. Start the API server and refresh.</p>
      </section>`

  return {
    title: 'Unavailable · Lantern List',
    description: 'Lantern List could not reach the markets API.',
    html,
  }
}
