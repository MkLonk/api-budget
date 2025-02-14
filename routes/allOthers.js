const router = require('express').Router();
const { allOthers } = require('../controllers/allOthers');

router.get('/*', allOthers);
router.post('/*', allOthers);
router.patch('/*', allOthers);
router.delete('/*', allOthers);
router.put('/*', allOthers);

module.exports = router;
