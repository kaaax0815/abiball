const DEFAULT_REDIRECT_URL = '/tickets';
const ALLOWED_URLS = ['/tickets', '/'];

export function parseRedirect(url: string) {
  if (ALLOWED_URLS.includes(url)) {
    return url;
  }
  return DEFAULT_REDIRECT_URL;
}

export function parseRedirectToFromForm(url: FormDataEntryValue | null) {
  if (!url || typeof url !== 'string') {
    return DEFAULT_REDIRECT_URL;
  }
  return parseRedirect(url);
}

export function parseRedirectToFromRequest(request: Request) {
  const url = new URL(request.url);
  const urlParam = url.searchParams.get('redirectTo');
  if (!urlParam) {
    return DEFAULT_REDIRECT_URL;
  }
  return parseRedirect(urlParam);
}
