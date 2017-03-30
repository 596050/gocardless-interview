import axios from "axios"
import * as Bluebird from "bluebird"
import * as cheerio from "cheerio"
import * as URL from "url-parse"

type SitemapURL = {

	url: string

	assets: [string]

}

/**
 * The scraper class
 * 
 * @class WebScraper
 */
export default class WebScraper {

	/**
	 * An array representing the processed/failed URLs
	 * 
	 * @private
	 * @type {[string]}
	 * @memberOf WebScraper
	 */
	private completed: [string] = [] as [string]


	/**
	 * An array representing the URLs that still need to be processed
	 * Mimics a queue
	 * 
	 * @private
	 * @type {[string]}
	 * @memberOf WebScraper
	 */
	private queue: [string] = [] as [string]


	/**
	 * An array keeping track of the final sitemap entires
	 * 
	 * @private
	 * @type {[SitemapURL]}
	 * @memberOf WebScraper
	 */
	private sitemap: [SitemapURL] = [] as [SitemapURL]


	/**
	 * Creates an instance of WebScraper.
	 * 
	 * @param {string} start_url 
	 * 
	 * @memberOf WebScraper
	 */
	constructor(start_url: string) {

		let parsed_url = new URL(start_url)

		this.queue = [parsed_url.href]

	}

	/**
	 * Process the next URL in the queue
	 * 
	 * @memberOf WebScraper
	 */
	processQueueItem() {

		// Shift the first item off the queue
		let current_item = this.queue.shift()

		// Add the shifted URL to the completed array
		this.completed.push(current_item)

		// Parse the URL into an easier to use form
		let parsed_url = new URL(current_item)

		// Fetch the HTML of the URL
		this.fetchHTML(current_item)
			.then((html) => {

				// Pass the html into the parser
				return this.parseHTML(parsed_url, html)

			})
			.then(([links, assets]) => {

				// Add each link found into the queue
				links.map(this.pushToQueue.bind(this))

				// Add a sitemap entry to the sitemap
				this.sitemap.push({
					url: parsed_url.href,
					assets: assets
				})

				console.log(`Successfully Scraped ${parsed_url.href}. Found ${assets.length} assets`)

				return

			})
			.catch((error) => {

				console.log(`Failed to fetch ${parsed_url.href}`)

				return

			})
			.then(() => {

				console.log(`${this.queue.length} remaining in queue\n${this.completed.length} URLs scraped`)

				// Check if there's anything else in the queue
				if ( this.queue.length > 0 ) {

					// Process the next item
					this.processQueueItem()

				} else {

					// Print out the sitemap
					console.log(this.sitemap)

				}

			})
		
	}

	/**
	 * Fetch the HTML at a URL
	 * 
	 * @param {string} url The url to fetch
	 * 
	 * @memberOf WebScraper
	 */
	fetchHTML(url: string) {

		// Make a GET request to the URL
		return axios.get(url, {
			timeout: 1500 // Using a timeout just so it runs through faster
		})
			.then((response) => {

				return response.data

			})


	}

	parseHTML(parsed_base_url: any, html: string): Bluebird<[string][]> {

		return Bluebird.resolve()
			.then(() => {

				return cheerio.load(html)

			})
			.then(($) => {

				var links: [string] = [] as [string],
					assets: [string] = [] as [string]

				// Go through each a tag on the page (with an href attribute)
				$("a[href]").each((i, elem) => {
					
					// Pull the href value from the current a tag and strip it of any hash
					let href = elem.attribs.href.split("#")[0]

					// Use a link parser to normalise the value taken from the href
					// For example /test -> http://example.com/test
					let parsed_link = new URL(href, parsed_base_url.href)
					
					// Check that the hostname of the base url is the same as the newly found url
					if ( parsed_link.hostname === parsed_base_url.hostname ) {

						links.push(parsed_link.href)

					}

				})

				// Go through each static resource found on the page
				$("script[src], img[src], link[rel=\"stylesheet\"][href]").each((i, elem) => {

					// Pull the href or src value from the current tag
					let src = elem.attribs.src || elem.attribs.href
					
					// Use a link parser to normalise the value taken from the src/href
					// For example /test.css -> http://example.com/test.css
					let parsed_asset = new URL(src, parsed_base_url.href)

					// Add the asset url to the array
					assets.push(parsed_asset.href)

				})

				return [
					links,
					assets
				]

			})

	}

	/**
	 * Add a new URL to the queue
	 * 
	 * @param {string} url The url to add the queue
	 * 
	 * @memberOf WebScraper
	 */
	pushToQueue(url: string) {

		// Check if the pushed url is already on the queue or has already been processed
		if ( this.queue.indexOf(url) === -1 && this.completed.indexOf(url) === -1 ) {

			// Actually add the url to the queue
			this.queue.push(url)

		}

	}

}