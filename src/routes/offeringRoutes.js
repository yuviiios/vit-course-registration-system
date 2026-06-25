// Course offering routes
const express = require('express');
const router = express.Router();
const offeringController = require('../controllers/offeringController');
const { validateOfferingCreation } = require('../middleware/validate');

router.post('/', validateOfferingCreation, offeringController.createOffering);
router.get('/available', offeringController.getAvailableOfferings);
router.get('/:offeringId', offeringController.getOffering);
router.put('/:offeringId', offeringController.updateOffering);
router.delete('/:offeringId', offeringController.deleteOffering);

module.exports = router;
