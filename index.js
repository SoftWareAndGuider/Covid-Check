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

app.get('/compact', (_, res) => {
  db.select('*').orderByRaw('grade, class, number, id').from('checks').then((data) => {
    ejs(path() + '/page/compact.ejs', { data }, (err, str) => {
      if (err) console.log(err)
      res.send(str)
    })
  })
})

app.get('/ajax/data', (_, res) => {
  db.select('*').orderByRaw('grade, class, number, id').from('checks').then((data) => {
    const rData = []
    data.forEach((v) => {
      const rrData = []

      rrData[0] = v.id
      rrData[2] = v.name

      if (v.grade < 1) {
        rrData[1] = '선생님 #' + v.number
      } else {
        rrData[1] = v.grade + '학년 ' + v.class + '반 ' + v.number + '번 <span class="d-none">' + v.grade + v.class.toString().padStart(2, '0') + v.number.toString().padStart(2, '0') + '</span>'
      }
      if (v.checked) {
        rrData[3] = '<i class="yes-icon"></i> 체크완료 <button class="m-0 ml-2 p-1 btn btn-secondary" onclick="uncheck(\''+ v.id + '\')">체크취소</button>'
      } else if (!v.checked) {
        rrData[3] = '<i class="no-icon"></i> 체크안함 <button class="m-0 ml-2 p-1 btn btn-success" onclick="check(\'' + v.id + '\')">체크하기</button>'
      } else {
        rrData[3] = 'ERROR: Data Not Found'
      }
      rData.push(rrData)
    })

    res.send({ data: rData })
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
      db.delete().where(body).from('checks').then(() => {
        res.send({ success: true })
      }).catch((reason) => res.send({ success: false, reason }))
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

app.listen(port, () => {
  console.log('Server is now on http://localhost:' + port)
})
