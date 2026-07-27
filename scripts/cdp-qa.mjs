import fs from 'node:fs/promises'
import path from 'node:path'

const DEVTOOLS_URL = 'http://127.0.0.1:9222'
const BASE_URL = 'http://localhost:3000'

async function requestJson(url, init) {
  const response = await fetch(url, init)

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${url}`)
  }

  return response.json()
}

async function openPage() {
  const target = await requestJson(`${DEVTOOLS_URL}/json/new?${BASE_URL}/`, {
    method: 'PUT',
  })

  return connect(target.webSocketDebuggerUrl)
}

function connect(webSocketDebuggerUrl) {
  const ws = new WebSocket(webSocketDebuggerUrl)
  let id = 0
  const pending = new Map()

  ws.addEventListener('message', (event) => {
    const message = JSON.parse(event.data)

    if (message.id && pending.has(message.id)) {
      pending.get(message.id)(message)
      pending.delete(message.id)
    }
  })

  const opened = new Promise((resolve) => {
    ws.addEventListener('open', resolve, { once: true })
  })

  async function send(method, params = {}) {
    await opened

    return new Promise((resolve) => {
      const commandId = ++id
      pending.set(commandId, resolve)
      ws.send(JSON.stringify({ id: commandId, method, params }))
    })
  }

  return { send, close: () => ws.close() }
}

async function evaluate(page, expression) {
  const result = await page.send('Runtime.evaluate', {
    awaitPromise: true,
    expression,
    returnByValue: true,
  })

  if (result.error || result.result.exceptionDetails) {
    throw new Error(JSON.stringify(result))
  }

  return result.result.result.value
}

async function settle(page) {
  await page.send('Runtime.evaluate', {
    expression: 'new Promise((resolve) => setTimeout(resolve, 750))',
    awaitPromise: true,
  })
}

async function navigate(page, route, width) {
  await navigateTo(page, `${BASE_URL}${route}`, width)
}

async function navigateTo(page, url, width) {
  await page.send('Emulation.setDeviceMetricsOverride', {
    width,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: width < 768,
  })
  await page.send('Page.navigate', { url })
  await settle(page)
}

const auditExpression = String.raw`
(() => {
  const round = (number) => Math.round(number * 100) / 100
  const clean = (element) =>
    (element?.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 100)
  const visible = (selector) =>
    Array.from(document.querySelectorAll(selector)).find((element) => {
      const box = element.getBoundingClientRect()
      const style = getComputedStyle(element)
      return (
        box.width > 0 &&
        box.height > 0 &&
        style.display !== 'none' &&
        style.visibility !== 'hidden'
      )
    })
  const styleFor = (element) => {
    if (!element) return null
    const style = getComputedStyle(element)
    const box = element.getBoundingClientRect()

    return {
      text: clean(element),
      tag: element.tagName.toLowerCase(),
      fontFamily: style.fontFamily,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      lineHeight: style.lineHeight,
      color: style.color,
      backgroundColor: style.backgroundColor,
      textTransform: style.textTransform,
      letterSpacing: style.letterSpacing,
      width: round(box.width) + 'px',
      height: round(box.height) + 'px',
      x: round(box.x),
      y: round(box.y),
      paddingLeft: style.paddingLeft,
      paddingRight: style.paddingRight,
      paddingTop: style.paddingTop,
      paddingBottom: style.paddingBottom,
      marginTop: style.marginTop,
      marginBottom: style.marginBottom,
      borderTop:
        style.borderTopWidth + ' ' + style.borderTopStyle + ' ' + style.borderTopColor,
      borderRight:
        style.borderRightWidth + ' ' + style.borderRightStyle + ' ' + style.borderRightColor,
      borderBottom:
        style.borderBottomWidth + ' ' + style.borderBottomStyle + ' ' + style.borderBottomColor,
      borderLeft:
        style.borderLeftWidth + ' ' + style.borderLeftStyle + ' ' + style.borderLeftColor,
    }
  }

  const body = getComputedStyle(document.body)
  const html = getComputedStyle(document.documentElement)

  return {
    viewport: { width: innerWidth, height: innerHeight },
    html: {
      backgroundColor: html.backgroundColor,
      color: html.color,
      fontSize: html.fontSize,
    },
    body: {
      backgroundColor: body.backgroundColor,
      color: body.color,
      fontFamily: body.fontFamily,
      fontSize: body.fontSize,
      fontWeight: body.fontWeight,
      lineHeight: body.lineHeight,
    },
    h1: styleFor(visible('h1')),
    h2: styleFor(visible('section h2,h2')),
    main: styleFor(visible('main')),
    content: styleFor(visible('main > div')),
    nav: styleFor(visible('header')),
    footer: styleFor(visible('footer')),
    sectionHeads: Array.from(document.querySelectorAll('section h2'))
      .slice(0, 6)
      .map(styleFor),
    links: Array.from(document.querySelectorAll('a'))
      .filter((element) => element.getBoundingClientRect().width > 0)
      .slice(0, 6)
      .map((element) => {
        const style = getComputedStyle(element)
        return {
          text: clean(element),
          color: style.color,
          textDecoration: style.textDecorationLine,
          borderBottom:
            style.borderBottomWidth + ' ' + style.borderBottomStyle + ' ' + style.borderBottomColor,
          fontSize: style.fontSize,
        }
      }),
    icons: Array.from(document.querySelectorAll('footer svg, footer img, a svg, a img'))
      .filter((element) => element.getBoundingClientRect().width > 0)
      .slice(0, 8)
      .map((element) => {
        const box = element.getBoundingClientRect()
        return {
          tag: element.tagName.toLowerCase(),
          width: round(box.width) + 'px',
          height: round(box.height) + 'px',
        }
      }),
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }
})()
`

async function audit() {
  const page = await openPage()
  await page.send('Page.enable')
  await page.send('Runtime.enable')

  const results = []
  for (const width of [390, 1280, 1440]) {
    await navigate(page, '/', width)
    results.push(await evaluate(page, auditExpression))
  }

  page.close()
  console.log(JSON.stringify(results, null, 2))
}

async function auditUrl() {
  const page = await openPage()
  await page.send('Page.enable')
  await page.send('Runtime.enable')

  const url = process.argv[3]
  const results = []

  for (const width of [390, 1280, 1440]) {
    await navigateTo(page, url, width)
    results.push(await evaluate(page, auditExpression))
  }

  page.close()
  console.log(JSON.stringify(results, null, 2))
}

async function screenshot() {
  const page = await openPage()
  await page.send('Page.enable')
  await page.send('Runtime.enable')

  const [, , , route, widthValue, output] = process.argv
  const width = Number(widthValue)

  await navigate(page, route, width)
  const metrics = await page.send('Page.getLayoutMetrics')
  const contentSize = metrics.result.contentSize
  const result = await page.send('Page.captureScreenshot', {
    captureBeyondViewport: true,
    clip: {
      x: 0,
      y: 0,
      width: contentSize.width,
      height: Math.min(contentSize.height, 12000),
      scale: 1,
    },
    format: 'png',
    fromSurface: true,
  })

  if (result.error || !result.result?.data) {
    throw new Error(JSON.stringify(result))
  }

  await fs.mkdir(path.dirname(output), { recursive: true })
  await fs.writeFile(output, Buffer.from(result.result.data, 'base64'))
  page.close()
}

const qaExpression = String.raw`
(() => {
  const focusable = Array.from(
    document.querySelectorAll(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => {
    const box = element.getBoundingClientRect()
    const style = getComputedStyle(element)
    return box.width > 0 && box.height > 0 && style.visibility !== 'hidden'
  })
  const tags = Array.from(document.querySelectorAll('li')).filter((element) => {
    const style = getComputedStyle(element)
    return (
      style.borderTopWidth !== '0px' &&
      style.borderTopStyle !== 'none' &&
      element.textContent.trim().length > 0
    )
  })
  const footerIcons = Array.from(document.querySelectorAll('footer svg')).map(
    (element) => {
      const box = element.getBoundingClientRect()
      return { width: box.width, height: box.height }
    },
  )

  return {
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
    hasFooter: Boolean(document.querySelector('footer')),
    hasHeading: Boolean(document.querySelector('h1')),
    focusableCount: focusable.length,
    tagCount: tags.length,
    footerIcons,
  }
})()
`

async function qa() {
  const page = await openPage()
  await page.send('Page.enable')
  await page.send('Runtime.enable')

  const routes = [
    '/',
    '/essays',
    '/demos',
    '/demos/alan',
    '/demos/mlp',
    '/contact',
    '/does-not-exist-pr10',
  ]
  const widths = [320, 390, 768, 1024, 1280, 1440]
  const results = []

  for (const route of routes) {
    for (const width of widths) {
      await navigate(page, route, width)
      results.push({ route, width, ...(await evaluate(page, qaExpression)) })
    }
  }

  page.close()
  console.log(JSON.stringify(results, null, 2))
}

if (process.argv[2] === 'screenshot') {
  await screenshot()
} else if (process.argv[2] === 'qa') {
  await qa()
} else if (process.argv[2] === 'audit-url') {
  await auditUrl()
} else {
  await audit()
}
