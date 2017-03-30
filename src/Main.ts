import WebScraper from "./WebScraper"

let url = process.env.BASE_URL || "https://gocardless.com"

// Init an instance of WebScraper with the base url
var scraper = new WebScraper(url)
// Start processing the queue
scraper.processQueueItem()