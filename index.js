const port = process.env.CvCheckPort || 11111

const { renderFile: ejs } = require('ejs')
const { resolve: path } = require('path')

const knex = require('knex')
const express = require('express')

const app = express()
const db = knex({
  client: 'mysql',
  connection: {
    host: 'covid.xyz',
    user: 'covid',
    pw: 'covid1234'
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

app.get('/alert', (req, res) => {
  ejs(path() + '/page/ieSuck.ejs', (err, str) => {
    if (err) console.log(err)
    res.send(str)
  })
})

app.get('/mobile', (_, res) => {
  db.select('*').orderByRaw('grade, class, number, id').from('checks').then((data) => {
    ejs(path() + '/page/mobile.ejs', { data }, (err, str) => {
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

      rrData[1] = v.name

      if (v.grade < 1) {
        rrData[0] = '선생님 #' + v.number
      } else {
        rrData[0] = v.grade + '학년 ' + v.class + '반 ' + v.number + '번 <span class="d-none">' + v.grade + v.class.toString().padStart(2, '0') + v.number.toString().padStart(2, '0') + '</span>'
      }
      if (v.checked === 1) {
        rrData[2] = '<i class="fas fa-check-circle"></i> 체크 완료 <button class="m-0 ml-2 p-1 btn btn-secondary" onclick="uncheck(\''+ v.id + '\')">체크 취소</button>'
      } else if (v.checked === 0) {
        rrData[2] = '<i class="far fa-circle"></i> 체크 안함 <button class="m-0 ml-2 p-1 btn btn-success" onclick="check(\'' + v.id + '\')">체크 하기</button>  <button class="m-0 ml-2 p-1 btn btn-danger" onclick="check(\'' + v.id + '\', true)">발열 확인됨</button>'
      } else if (v.checked === 2) {
        rrData[2] = '<i class="far fa-check-circle"></i> 발열 확인 <button class="m-0 ml-2 p-1 btn btn-secondary" onclick="uncheck(\''+ v.id + '\')">체크 취소</button>'
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
