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


// Handling
app.use('/api', express.json({ limit: '500K' })) // 클라에서 데이터를 받을 수 있게
app.use('/src', express.static(path() + '/src/')) 

app.get('/', (_, res) => res.redirect('/main'))
app.get('/alert', (_, res) => res.sendFile(path() + '/etc/ieSuck.html'))
app.put('/api', apiHandle)
app.put('/api/v1', apiHandle)


// Page
app.get('/main', (req, res) => {
  db.select('*').orderByRaw('grade, class, number, id').from('checks').then((data) => {
    ejs(path() + '/page/index.ejs', { data, query: req.query || {} }, (err, str) => {
      if (err) console.log(err)
      res.send(str)
    })
  })
})


/**
 * API
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
function apiHandle (req, res) {
  const { process, multi, ondo, ...body } = req.body
  if (!process) return res.status(406).send('data "process" not found')
  switch (process) {
    case 'info': {
      db.select('*').where(body).from('checks').then((data) => {
        if (!data) return res.send({ success: false })
        if (multi) return res.send({ success: true, data: data })
        res.send({ success: true, data: data[0] })
      })
      break
    }

    case 'check': {
      if (ondo) {
        db.update({ checked: 2 }).where(body).from('checks').then(() => {
          db.select('*').where(body).from('checks').then(([data]) => {
            if (!data) return res.send({ success: false })
            res.send({ success: true, data: data })
          })
        })
        return
      }
      db.update({ checked: 1 }).where(body).from('checks').then(() => {
        db.select('*').where(body).from('checks').then(([data]) => {
          if (!data) return res.send({ success: false })
          res.send({ success: true, data: data })
        })
      })
      break
    }

    case 'uncheck': {
      db.update({ checked: 0 }).where(body).from('checks').then(() => {
        db.select('*').where(body).from('checks').then(([data]) => {
          if (!data) return res.send({ success: false })
          res.send({ success: true, data })
        })
      })
      break
    }

    case 'delete': {
      db.select('*').where(body).from('checks').then(([data]) => {
        db.delete().where(body).from('checks').then(() => {
          res.send({ success: true, data })
        }).catch((reason) => res.send({ success: false, reason }))
      })
      break
    }

    case 'insert': {
      const ignoreFlag =
        body.id === undefined
          || body.grade === undefined
          || body.class === undefined
          || body.number === undefined
          || body.name === undefined

      if (ignoreFlag) return res.status(406).send('data "id || grade || class || number || name" not found')
      db.insert(body).from('checks').then(() => {
        db.select('*').where('id', body.id).from('checks').then(([data]) => {
          if (!data) return res.send({ success: false })
          res.send({ success: true, data })
        })
      }).catch((reason) => res.send({ success: false, reason }) )
      break
    }

    case 'reset': {
      db.update({ checked: 0 }).from('checks').then(() => {
        res.send({ success: true })
      })
      break
    }

    default: {
      res.status(406).send('data "process" not found')
      break
    }
  }
}

// 404
app.use((_, res) => res.sendFile(path() + '/etc/404.html'))

// listen
app.listen(port, () => {
  console.log('Server is now on http://localhost:' + port)
})
