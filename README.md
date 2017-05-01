# GoCardless Web Scraper Interview Question
Solution to the GoCardless Web Scraper interview question

## Task
We would like you to write a simple (not concurrent) web crawler. Given a starting URL, it should visit every reachable page under that domain, and should not cross subdomains. For example when crawling “www.google.com” it would not crawl “mail.google.com”. For each page, it should determine the URLs of every static asset (images, javascript, stylesheets) on that page. The crawler should output to STDOUT in JSON format listing the URLs of every static asset, grouped by page.

For example:
```json
[
  {
    "url": "http://www.example.org",
    "assets": [
      "http://www.example.org/image.jpg",
      "http://www.example.org/script.js"
    ]
  },
  {
    "url": "http://www.example.org/about",
    "assets": [
      "http://www.example.org/company_photo.jpg",
      "http://www.example.org/script.js"
    ]
  },
  ...
]
```
 
You may use whatever language you are most comfortable with. You may use third party libraries for things like HTML parsing or making requests, but the overall coordination of the task must be handled by your code. An example of something you shouldn’t use is the web crawling framework Scrapy. You should include a README with clear installation and running instructions.

We will assess your submission on the following key aspects:
- Functionality
- Code clarity & structure
- Robustness
- Testing

We will test your submission against gocardless.com, although it should be possible to run it against any website.

## Requirements
- NodeJS (v6.X.X)

## Running the code
1. Clone the Repo onto your local machine
2. Install the dependancies: `npm i`
3. Build the code (ts->js): `npm run typescript`
4. Run a scrape (can replace BASE_URL with any starting URL): `BASE_URL=https://gocardless.com/ node src/Main.js`

## Running the tests
1. Clone the Repo onto your local machine
2. Install the dependancies: `npm i`
3. Build the code (ts->js): `npm run typescript`
4. Run the tests: `npm run tests`
