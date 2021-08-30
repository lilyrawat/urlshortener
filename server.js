const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app=express()

mongoose.connect("mongodb://localhost/urlshortener",{
    useNewUrlParser:true, useUnifiedTopology:true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:false}))


app.get('/', async (req,res)=> {
    const shorturls = await ShortUrl.find()
    res.render('index', {shorturls:shorturls})
})

app.post("/shorturls", async (req,res)=>{
    await ShortUrl.create({full: req.body.fullUrl})
    res.redirect('/')
})

app.get('/:shorturl', async (req,res)=>{
    const shortUrl= await ShortUrl.findOne({short: req.params.shorturl})
    if(shortUrl==null) return res.sendStatus(404)
    
    shortUrl.clicks++
    shortUrl.save()
    res.redirect(shortUrl.full)
})

app.listen(process.env.PORT||3000);