let puppeteer = require('puppeteer');

const tdkSearch = async (req, res) => {
  // decodes turkish letters
  decodedSearch = decodeURIComponent(req.headers.search);

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage({ headless: false });
    // goes to https://sozluk.gov.tr/
    await page.goto('https://sozluk.gov.tr/');
    // types decodedSearch variable into search bar
    await page.type(`[name="q"]`, decodedSearch);
    // clicks search button
    await page.click('#tdk-search-btn');
    // Instead of using waitFor or waitForNavigation,
    // using screenshot is more effective for waiting to page load 
    await page.screenshot();

    // gets all meanings of provided text and put into an array
    const text = await page.evaluate(() => Array.from(document.querySelectorAll('#anlamlar-gts0 >p'), element => element.textContent));
    // added for space checking
    const textType = await page.evaluate(() => Array.from(document.querySelectorAll('#ozellikler-gts0'), element => element.textContent));

    let temp = [];
    let anlamlar = [{}];
    let allTypes = [{}];

    //checks having single item
    if (textType != ' ' && text.length == 1) {
      // separates meaning and example
      temp = text[0].split(':')
      anlamlar[0] = {
        type: temp[0],
        anlam: temp[1]
      }
    }
    // separates type, meaning and example
    else {
      for (let j = 0; j < text.length; j++) {

        if (text[j].includes('  ')) {
          temp[j] = text[j].split('  ')
        }
        else {
          temp[j] = text[j].split(' ')
        }

        for (let r = 0; r < temp[j].length; r++) {
          if (temp[j][r] == 'isim' ||
            temp[j][r] == 'mecaz' ||
            temp[j][r] == 'sıfat' ||
            temp[j][r] == 'bağlaç' ||
            temp[j][r] == 'matematik' ||
            temp[j][r] == 'ünlem'
          ) {
            temp[j].shift()
          }
        }
        allTypes[j] = temp[j][0].split('.')
        for (let z = 0; z < allTypes[j].length; z++) {
          if (allTypes[j].length > 1) {
            allTypes[j].shift()
            allTypes[j][0] = allTypes[j][0].trim()
          }
        }

        temp[j].splice(0, 1)
        temp[j] = temp[j].join(' ');

        // checks if there is a sample
        temp[j] = temp[j].split(':');
        if (temp[j][1] == undefined) {
          temp[j][1] = ''
        }

        anlamlar[j] = {
          type: allTypes[j][0],
          meaning: temp[j][0],
          example: temp[j][1]
        }
      }
    }

    res.status(200).json(anlamlar);
    browser.close();
  } catch (error) {
    res.status(400).json(null);
  }
};

const tdkIcerik = async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage({ headless: false });
  // goes to https://sozluk.gov.tr/
  await page.goto('https://sozluk.gov.tr/');
  // Instead of using waitFor or waitForNavigation,
  // using screenshot is more effective for waiting to page load 
  await page.screenshot();
  const result = await page.evaluate(async () => {
    const kelime = document.querySelector('#column-1').innerText;
    const kelimeAnlam = document.querySelector('#column0').innerText;
    const atasozu = document.querySelector('.atasoz0').innerText;
    const atasozuAnlam = document.querySelector('.atasozAnlam0').innerText;
    const arananKelime = document.querySelector('#tdk-srch-input').value;
    //const aranan = document.querySelector('#bulunan-gts0').innerText;
    return {
      kelime,
      kelimeAnlam,
      atasozu,
      atasozuAnlam,
      arananKelime
      //aranan,
    };
  });
  if (req != null) {
    res.status(200).json(result);
  }
  return result;
}

module.exports = {
  tdkSearch: tdkSearch,
  tdkIcerik: tdkIcerik
};
