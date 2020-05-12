const port = process.env.CvCheckPort || 11111

const { renderFile: ejs } = require('ejs')
const { resolve: path } = require('path')

const knex = require('knex')
const express = require('express')

const app = express()
const db = knex({
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'covidcheck',
    password: 'covidcheck1234',
    database: 'covidcheck'
  }
})

app.use('/src', express.static(path() + '/src/'))

app.get('/', (_, res) => res.redirect('/main'))
app.get('/main', (_, res) => {
  db.select('*').orderByRaw('grade, class, number').from('checks').then((data) => {
    ejs(path() + '/page/index.ejs', { data }, (err, str) => {
      if (err) console.log(err)
      res.send(str)
    })
  })
})

app.listen(port, () => {
  console.log('Server is now on http://localhost:' + port)
})
