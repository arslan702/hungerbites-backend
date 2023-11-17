const router = require("express").Router();

const invoiceController = require("../controllers/invoiceController");

router.post("/", invoiceController.createInvoice);

router.get("/", invoiceController.getAllInvoices);

router.get("/sumofinvoices", invoiceController.getSumOfInvoices);

router.get("/collected", invoiceController.getCollectedInvoices);

router.get("/outstanding", invoiceController.getOutstandingInvoices);

router.get("/overdue", invoiceController.getOverdueInvoices);

router.get("/:id", invoiceController.getInvoiceById);

router.put("/:id", invoiceController.updateInvoiceById);

router.delete("/:id", invoiceController.deleteInvoiceById);

module.exports = router;
