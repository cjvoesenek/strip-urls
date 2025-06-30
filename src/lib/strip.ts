export function stripUrl(url: string): URL {
  // The URL constructor will throw for invalid URLs.
  const parsed = new URL(url);
  return stripUrlImpl(parsed);
}

function stripUrlImpl(url: URL): URL {
  let isStripped = true;
  let newUrl: URL;
  if (matchesOutlookUrl(url)) {
    newUrl = stripOutlookUrl(url);
  } else if (matchesUrlDefenseUrl(url)) {
    newUrl = stripUrlDefenseUrl(url);
  } else {
    newUrl = url;
    isStripped = false;
  }
  // If we did something, see if can strip some more, otherwise, just return
  // the URL.
  return isStripped ? stripUrlImpl(newUrl) : newUrl;
}

function matchesOutlookUrl(url: URL): boolean {
  // The first part is usually "eur01" but may change, I think the rest is
  // probably quite stable.
  return url.host.endsWith(".safelinks.protection.outlook.com");
}

function matchesUrlDefenseUrl(url: URL): boolean {
  // We may get other subdomains, but the main domain should probably be this.
  return url.host.endsWith("urldefense.com");
}

function stripOutlookUrl(url: URL): URL {
  const innerUrl = url.searchParams.get("url");
  if (innerUrl === null) {
    throw new Error(`Outlook URL "${url}" has no "url" search parameter.`);
  }
  // This may throw for invalid inner URLs, which we are not interested in
  // anyway.
  return new URL(innerUrl);
}

function stripUrlDefenseUrl(url: URL): URL {
  const innerUrl = url.toString().match(/__([^;]*)__;/)?.[1];
  if (!innerUrl) {
    throw new Error(`URL Defense URL "${url}" contains no inner URL.`);
  }
  // Weirdly, this handles single slashes in protocols? Apparently that is
  // allowed.
  return new URL(innerUrl);
}
