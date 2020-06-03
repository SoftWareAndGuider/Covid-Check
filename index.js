// API, 페이지 요청을 받을 포트
const port = process.env.CvCheckPort || 11111

// 모듈 불러오기
const { writeFile: save, mkdirSync: init, existsSync: exist } = require('fs')
const { renderFile: ejs } = require('ejs')
const { resolve: path } = require('path')

const knex = require('knex')
const express = require('express')

// 미들웨어, DB 연결
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

// 기록이 저장될 폴더 생성
if (!exist(path() + '/saves')) init(path() + '/saves')

// I/O 기본 설정
app.use('/api', express.json({ limit: '500K' }))     // API, 500kb까지 수용
app.use('/src', express.static(path() + '/src/'))    // 리소스
app.use('/saves', express.static(path() + '/saves/'))// 초기화 기록

// 페이지 요청 받기
app.get('/', (_, res) => res.redirect('/main'))
app.get('/alert', (_, res) => res.sendFile(path() + '/etc/ieSuck.html'))
app.get('/rights', (_, res) => res.sendFile(path() + '/etc/copyrights.html'))
app.get('/main', (req, res) => {
  db.select('*').orderByRaw('grade, class, number, id').from('checks').then((data) => {
    ejs(path() + '/page/index.ejs', { data, query: req.query || {} }, (err, str) => {
      if (err) console.log(err)
      res.send(str)
    })
  })
})
app.get('/history', (_, res) => {
  db.select('*').orderBy('savedAt', 'desc').from('saves').then((data) => {
    ejs(path() + '/page/history.ejs', { data }, (err, str) => {
      if (err) console.log(err)
      res.send(str)
    })
  })
})

// API 요청 받기
app.put('/api', apiHandle)
app.put('/api/v1', apiHandle)

/**
 * API
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
function apiHandle (req, res) {
  const { process, multi, ondo, ...body } = req.body
  if (!process) return res.status(406).send('data "process" not found')
  switch (process) {

    // 사용자 정보 조회
    case 'info': {
      db.select('*').where(body).from('checks').then((data) => {
        if (!data) return res.send({ success: false })
        if (multi) return res.send({ success: true, data: data })
        res.send({ success: true, data: data[0] })
      })
      break
    }

    // 발열 체크 표시하기
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

    // 발열 체크 취소하기
    case 'uncheck': {
      db.update({ checked: 0 }).where(body).from('checks').then(() => {
        db.select('*').where(body).from('checks').then(([data]) => {
          if (!data) return res.send({ success: false })
          res.send({ success: true, data })
        })
      })
      break
    }

    // 사용자 삭제
    case 'delete': {
      db.select('*').where(body).from('checks').then(([data]) => {
        db.delete().where(body).from('checks').then(() => {
          res.send({ success: true, data })
        }).catch((reason) => res.send({ success: false, reason }))
      })
      break
    }

    // 사용자 추가
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

    // 기록 저장 후 모든 체크 초기화
    case 'reset': {
      saveTable(() => {
        db.update({ checked: 0 }).from('checks').then(() => {
          res.send({ success: true })
        })
      })
      break
    }

    // 나머지
    default: {
      res.status(406).send('unknown data "process"')
      break
    }
  }
}

let resetProtect = false // 충돌방지

// 0.5초 간격으로 체크해서 오전 12시마다 저장
setInterval(() => {
  let now = new Date()
  if (now.getHours === 0 && now.getMinutes === 0 && now.getSeconds === 0) {
    
    if (resetProtect) return                         // 충돌방지
    resetProtect = true                              // 충돌방지
    setTimeout(() => { resetProtect = false }, 3000) // 충돌방지

    saveTable(() => {
      db.update({ checked: 0 }).from('checks').then(() => {
        res.send({ success: true })
      })
    })
  }
}, 500)

// 기록 저장
function saveTable (cb) {
  // 저장할 파일 이름
  const filename = '장곡중-발열체크-기록-' + new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }).split(' ').join('-').split('/').join('.') + '.csv'
  let rendered = '학년,반,번호,이름,체크여부'

  // 렌더링
  db.select('*').orderByRaw('grade, class, number, id').from('checks').then((data) => {
    data.forEach((d) => {
      rendered += '\r\n'
      if (d.grade < 1) {
        rendered += '선생님,-,' + d.number + ','
      } else {
        rendered += d.grade + ',' + d.class + ',' + d.number + ','
      }

      rendered += d.name + ','

      const ments = ['체크 안함', '체크 완료', '발열 확인됨']
      rendered += ments[d.checked]
    })

    // 파일로 저장
    save(path() + '/saves/' + filename, '\ufeff' + rendered, { encoding: 'utf-8' }, (err) => {
      if (err) console.log(err)
      db.insert({ filename }).from('saves').then(cb)
    })
  })
}

// 찾는 페이지가 없을때
app.use((_, res) => res.redirect('/main'))

// API, 웹페이지 요청 받기
app.listen(port, () => {
  console.log('Server is now on http://localhost:' + port)
})
