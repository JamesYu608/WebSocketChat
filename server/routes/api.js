const router = require('express').Router()
const ZenUIMsgDB = require('../zuimsgdb')

router.get('/', (req, res, next) => {
  res.send({
    greeting: 'hello, world!'
  })
})

router.get('/sn', (req, res, next) => {
  const sn = req.query.sn
  if (!sn) return res.status(400).send({error: 'You must provide a serial number (query field: sn)'})

  ZenUIMsgDB.GetDeviceListBySN(sn, (err, result) => {
    return err ? res.status(422).send({error: 'Unable to process the contained instructions'}) : res.json(result)
  })
})

module.exports = router
