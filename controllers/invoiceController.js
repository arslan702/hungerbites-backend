const { Sequelize, Op } = require("sequelize");
const Invoice = require("../models/invoice.model");
const Order = require("../models/order.model");
const UserAuthentication = require("../models/userAuth.model");

// Create a new invoice
exports.createInvoice = (req, res) => {
  const invoice = {
    order_id: req.body.order_id,
    amount: req.body.amount,
    auth_user_id: req.body.auth_user_id,
    status: req.body.status,
    due_date: req.body.due_date
  };

  Invoice.create(invoice)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
};

// Get all invoices
exports.getAllInvoices = (req, res) => {
  Invoice.findAll({ include: [ 
    {model: Order, as: "Order" },  
    {model: UserAuthentication, as: "UserAuthentication"} 
  ]})

    .then((invoices) => {
      res.status(200).json(invoices);
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
};

// get collected invoice
exports.getCollectedInvoices = (req, res) => {
  Invoice.findAll({ 
    include: [ 
      {model: Order, as: "Order" },  
      {model: UserAuthentication, as: "UserAuthentication"} 
    ],
    where: { status: 'collected' } // add this where clause to filter by status
  })
    .then((invoices) => {
      res.status(200).json(invoices);
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
};

// get outstanding invoice
exports.getOutstandingInvoices = (req, res) => {
  Invoice.findAll({ 
    include: [ 
      {model: Order, as: "Order" },  
      {model: UserAuthentication, as: "UserAuthentication"} 
    ],
    where: { status: 'outstanding' } // add this where clause to filter by status
  })
    .then((invoices) => {
      res.status(200).json(invoices);
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
};

// get over due invoices
exports.getOverdueInvoices = (req, res) => {
  Invoice.findAll({ 
    include: [ 
      { model: Order, as: "Order" },  
      { model: UserAuthentication, as: "UserAuthentication" } 
    ],
    where: {
      due_date: { [Op.lt]: new Date() },
      status: "outstanding"
    }
  })
  .then((invoices) => {
    res.status(200).json(invoices);
  })
  .catch((error) => {
    res.status(500).send(error.message);
  });
};

// get invoices sum
exports.getSumOfInvoices = async(req, res) => {
  const currentDate = new Date();
  const collected = await Invoice.findOne({
    attributes: [[Sequelize.fn('sum', Sequelize.col('amount')), 'total']],
    where: { status: 'collected'}
  });
  const collectedInvoice = collected.get('total');

  const outstanding = await Invoice.findOne({
    attributes: [[Sequelize.fn('sum', Sequelize.col('amount')), 'total']],
    where: { status: 'outstanding'}
  });
  const outstandingInvoice = outstanding.get('total');

  const overdue = await Invoice.findOne({
    attributes: [[Sequelize.fn('sum', Sequelize.col('amount')), 'total']],
    where: { 
      status: 'outstanding',
      due_date: {[Sequelize.Op.lt]: currentDate}
    }
  });
  const overdueInvoice = overdue.get('total');
  res.status(200).json({ collectedInvoice, outstandingInvoice, overdueInvoice})
}

// Get an invoice by ID
exports.getInvoiceById = (req, res) => {
  const id = req.params.id;

  Invoice.findByPk(id)
    .then((invoice) => {
      if (invoice) {
        res.status(200).json(invoice);
      } else {
        res.status(404).send("Invoice not found");
      }
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
};

// Update an invoice by ID
exports.updateInvoiceById = (req, res) => {
  const id = req.params.id;

  Invoice.findByPk(id)
    .then((invoice) => {
      if (invoice) {
        // invoice.order_id = req.body.order_id;
        // invoice.total_amount = req.body.total_amount;
        invoice.status = req.body.status;

        invoice
          .save()
          .then((result) => {
            res.status(200).json(result);
          })
          .catch((error) => {
            res.status(500).send(error.message);
          });
      } else {
        res.status(404).send("Invoice not found");
      }
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
};

// Delete an invoice by ID
exports.deleteInvoiceById = (req, res) => {
  const id = req.params.id;

  Invoice.destroy({
    where: { id: id },
  })
    .then((result) => {
      if (result === 1) {
        res.status(204).send();
      } else {
        res.status(404).send("Invoice not found");
      }
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
};
