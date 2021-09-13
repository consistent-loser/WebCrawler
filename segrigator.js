const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const { splitt } = require('./formatter');

async function getInfo(url) {

    let browser;
    try {
        let data = [];                          //stores the final data
        browser = await puppeteer.launch({
            headless: false,
        });
        const page = await browser.newPage();      // new puppeteer page

        while (true) {
            await page.goto(url, { waitUntil: 'load' });    // go to the target link and wait until the page is loaded completely
            try {
                await page.click('#reviewtab');             //if #reviewtab exists then click to expose the reviews
            }
            catch (err) {
                console.log(err);
                return ("No reviews found");               // no #reviewtab means no review yet
            }

            const htmlContent = await page.content();

            const $ = cheerio.load(htmlContent);

            //------------------------------------------------------------------------------------------//
            //------------------ Reviewer class contains reviewer Name and date -------------------------//
            //-----------------------------------------------------------------------------------------//

            let reviewernDate = $('.review .reviewer').map((index, element) => {
                let data = $(element).text().trim()
                return data;

            });

            //---------------------------------------------------------------------------------------//
            //------------------Item rating class contains the overall item rating--------------------//
            //---------------------------------------------------------------------------------------//

            rating = $('.itemRating').map((index, element) => {
                return $(element).text().trim();
            });

            //-------------------------------------------------------------------------------------//
            //------------------Blockquote tag for the heading and comment--------------------------//
            //-------------------------------------------------------------------------------------//
            const oneliner = $('blockquote h6').map((index, element) => {
                return $(element).text().trim();
            });

            const comment = $('blockquote p').map((index, element) => {
                return $(element).text().trim();
            });

            rating.splice(0, 1);

            let temp = [];
            //----------------------------------------------------------------------------------------//
            //-------------------------Processing the data into correct format-------------------------//
            //----------------------------------------------------------------------------------------//
            for (let i = 0; i < reviewernDate.length; i++) {
                temp.push(splitt(reviewernDate[i]));
            }

            //----------------------------------------------------------------------------------------//
            //------------------------Finally modelling the data object to be returned-----------------//
            //---------------------------------------------------------------------------------------//

            for (let i = 0; i < rating.length; i++) {
                let tempdata = {
                    name: temp[i][1],
                    date: temp[i][3],
                    rating: rating[i],
                    heading: oneliner[i],
                    comment: comment[i]
                }

                data.push(tempdata);
            }
            //-------------------------------------------------------------------------------------------//
            //-----------------logic for fetching the review distributed in multiple pages----------------//
            //-------------------------------------------------------------------------------------------//
            if ($('.reviewPage dd').text().trim() == '') {         // if reviews are not more than 5
                console.log("Fetch complete");
                return data;
            }


            const selector = $('.reviewPage dd a')[1];

            if ($(selector).attr('title') == 'Previous') {          // if the page is last page
                console.log("Fetch complete");
                return data;
            }
            url = $(selector).attr('href').trim();


            url = 'https://www.tigerdirect.com' + url;              //move to next page
            console.log(url);


        }


    }
    catch (err) {
        console.log("unable to open puppeteer ", err);
    }
    finally {
        await browser?.close();
    }

}

exports.getInfo = getInfo;