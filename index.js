const PORT = 8000
const axios = require('axios')
const express = require('express')
const cheerio = require('cheerio')  
const res = require('express/lib/response')

const app = express()

const newspapers = [ 
    {
        name: 'thetimes',
        base: '',
        address: 'https://www.thetimes.co.uk/topic/cricket'
    },
    {
        name: 'theguardian',
        base: '',
        address: 'https://www.theguardian.com/sport/cricket'
    },
    {
        name: 'thetelegraph',
        base: 'https://www.telegraph.co.uk',
        address: 'https://www.telegraph.co.uk/cricket/'
    },
    {
        name: 'bbc',
        base: '',
        address: 'https://www.bbc.com/sport/cricket'
    },
    {
        name: 'standard',
        base: 'https://www.standard.co.uk',
        address: 'https://www.standard.co.uk/sport/cricket'
    },
    {
        name: 'thesun',
        base: '',
        address: 'https://www.thesun.co.uk/sport/cricket/'
    },
    {
        name: 'dailymail',
        base: 'https://www.dailymail.co.uk',
        address: 'https://www.dailymail.co.uk/sport/cricket/'
    }
]

const articles = []

newspapers.forEach(newspaper => {

    axios.get(newspaper.address)
    .then((response) => {
        const html = response.data
        const $ = cheerio.load(html)

        $(('a:contains("cricket")'), html).each(function () {
            
            const source = newspaper.name
            const title = $(this).text().trim()
            const url = newspaper.base + $(this).attr('href')
            
            articles.push({
                source,
                title,
                url,
            })
        })
    }).catch((err) => console.log(err))
});

app.get('/', (req, res) => {
    res.json('Welcome to my Cricket API')
})

app.get('/cricket', (req, res) => {
    res.json(articles) 
})

app.get('/cricket/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId
    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    axios.get(newspaperAddress)
    .then((response) => {
        const html = response.data
        const $ = cheerio.load(html)
        const specificArticles = []

        $(('a:contains("cricket")'), html).each(function () {
            
            const source = newspaperId
            const title = $(this).text().trim()
            const url = newspaperBase + $(this).attr('href')
            
            specificArticles.push({
                source,
                title,
                url,
            })
        })

        res.json(specificArticles)

    }).catch((err) => console.log(err))  
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))