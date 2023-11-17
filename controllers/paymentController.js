const Stripe = require('stripe')
// const stripe = new Stripe('sk_test_51MiJZrDcFnOiz5snzgbVomIHEpJFWkDCuc2coOtreNcVUha1rV7sztHMJglmGhnIJlj18nSjztL3ON1sd93ac5GN00KzRuOJRr')
const stripe = new Stripe('sk_test_51IqurQFZ6cVEIy9oUN7th5yUgQdptI6xPLWtgolfb1g58unocwjXTmeAphU485oJuyReJGlJGwetohbfMEXhexJ6005Q35AS9t');

exports.createPayment = async (req, res) => {
  let status, error;
  const { token, amount } = req.body;
  try {
    await stripe.charges.create({
      source: token.id,
      amount,
      currency: 'usd',
    });
    status = 'success';
    console.log('success')
  } catch (error) {
    console.log(error);
    status = 'Failure';
  }
  res.json({ error, status });
};