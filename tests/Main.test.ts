import WebScraper from "../src/WebScraper"
import * as assert from "assert"
import { describe, before, it } from "mocha"
import * as URL from "url-parse"

describe("WebScraper", () => {

	describe("constructor", () => {

		let scraper = new WebScraper("http://gocardless.com")

		it("should create a queue with the base url as the first item",() => {

			assert.equal(scraper["queue"].length, 1)
			assert.equal(scraper["queue"][0], "http://gocardless.com")

		})

	})

	describe("fetchHTML", () => {

		let scraper = new WebScraper("http://gocardless.com")
		var html

		before(() => {

			return scraper.fetchHTML("http://gocardless.com")
				.then((response) => {

					html = response

				})

		})
		
		it("should fetch the HTML of a url",() => {

			assert.equal(typeof html, "string")

		})

	})

	describe("parseHTML", () => {

		let scraper = new WebScraper("http://example.com")
		var links, assets

		before(() => {

			return scraper.parseHTML({hostname: "example.com", href: "http://example.com/"}, '<html><a href="http://example.com/test/">link 1</a><a href="http://google.com/">google</a><a href="http://example.com/test2/">link 2</a><script src="http://example.com/assets/script.js"></script></html>')
				.then((response) => {
					
					[links, assets] = response

				})

		})
		
		it("should pull the links from the same host",() => {

			assert.equal(links.length, 2)
			assert.equal(links[0], "http://example.com/test/")
			assert.equal(links[1], "http://example.com/test2/")

		})

		it("should pull the assets",() => {

			assert.equal(assets.length, 1)
			assert.equal(assets[0], "http://example.com/assets/script.js")

		})

	})

	describe("pushToQueue", () => {

		let scraper = new WebScraper("http://example.com")
		
		it("should add a url to the queue",() => {

			assert.equal(scraper["queue"].length, 1)

			scraper.pushToQueue("http://example.com/test")

			assert.equal(scraper["queue"].length, 2)

		})

		it("should not add the url to the queue if it is already there",() => {

			scraper.pushToQueue("http://example.com/test")

			assert.equal(scraper["queue"].length, 2)

		})

	})

})