# Astrobio Paper Scan · DeepAstroBio

*Towards Deeper Integration of Biology for the Next-Generation of Astrobiology Research*

**Live site: https://deepastrobio.github.io/astrobio-paper-scan/**

DeepAstroBio is an open platform for finding and connecting the biology literature that matters to
astrobiology. Its first tool is **Astrobio Paper Scan**.

## What it does

How often do the biology papers cited by the *International Journal of Astrobiology* (IJA) actually
use the word "astrobiology"? Pick a date range, and the page lists the IJA papers published in it,
collects every work they cite, keeps the ones published in **biology journals**, and checks whether
those works' **abstracts** mention astrobiology.

Everything runs in your browser: there is no server, and nothing you enter leaves your machine except
the queries sent to the public APIs below.

### How it works

| Step | Source | Notes |
|---|---|---|
| IJA papers in range + reference lists | Crossref | Filtered by **online** publication date (print date is year-only). OpenAlex lags months for this journal, so it is not used here. |
| Metadata of every cited DOI | OpenAlex | Batched 50 DOIs per request. References without a DOI are skipped (shown in the stats). |
| "Is this a biology journal?" | OpenAlex source topics | Share of the journal's topics whose *field* is one of the selected biology fields, at or above the threshold (default 50%; fields: Agricultural & Biological Sci., Biochem/Genetics/Mol. Bio., Immunology & Microbiology, Neuroscience). |
| Abstract | OpenAlex, then Europe PMC, then Crossref | About 94% coverage in testing. |
| Astrobiology mention | Regex, in the browser | Relevant = the abstract contains *astrobiology* in some form (`astrobiolog*`, `astro-biolog*`: astrobiological, astrobiologist…). The term list is editable and re-scores instantly. |

API responses are cached in your browser (IndexedDB), so re-runs and overlapping date ranges are
fast. A one-year scan takes about 20 seconds the first time and about a second after that.

**Download as HTML** saves the current results as a single file that opens offline.

### API budget

OpenAlex without a key allows a small free daily budget per IP address; a one-year scan uses roughly
40 requests. For heavy use, get a free key at https://openalex.org/settings/api and paste it into
"API settings" in the sidebar. The contact email there puts your Crossref requests in Crossref's
polite pool. Both are stored only in your browser.

### Caveats

- The criterion is deliberately strict: a paper about, say, Mars analogues that never uses the word
  "astrobiology" counts as no mention. Add terms in the sidebar to widen it.
- Multidisciplinary journals (Nature Communications, PNAS, PLoS ONE) can pass the 50% threshold.
  Raise the threshold to make the biology filter stricter.

## Development

The whole app is [`index.html`](index.html): open it in a browser to run it locally, no build step.

## License

[MIT](LICENSE)
