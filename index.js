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

app.use('/api', express.json({ limit: '500K' }))
app.use('/src', express.static(path() + '/src/'))

app.get('/', (_, res) => res.redirect('/main'))
app.get('/main', (_, res) => {
  db.select('*').orderByRaw('grade, class, number, id').from('checks').then((data) => {
    ejs(path() + '/page/index.ejs', { data }, (err, str) => {
      if (err) console.log(err)
      res.send(str)
    })
  })
})

app.put('/api', apiHandle)
app.put('/api/v1', apiHandle)

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
function apiHandle (req, res) {
  const { process, ...body } = req.body
  if (!process) return res.status(406).send('data "process" not found')
  switch (process) {
    case 'check': {
      if (!body.id) return res.status(406).send('data "id" not found')
      db.update({ checked: 1 }).where('id', body.id).from('checks').then(() => {
        db.select('*').where('id', body.id).from('checks').then(([data]) => {
          if (!data) return res.send({ success: false })
          res.send({ success: true, data: data })
        })
      })
      break
    }

    case 'uncheck': {
      if (!body.id) return res.status(406).send('data "id" not found')
      db.update({ checked: 0 }).where('id', body.id).from('checks').then(() => {
        db.select('*').where('id', body.id).from('checks').then((data) => {
          if (!data) return res.send({ success: false })
          res.send({ success: true, data })
        })
      })
      break
    }

    default: {
      res.status(406).send('data "process" not found')
      break
    }
  }
}

app.listen(port, () => {
  console.log('Server is now on http://localhost:' + port)
})
