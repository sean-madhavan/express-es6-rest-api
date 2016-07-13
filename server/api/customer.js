import PaypalEC from 'paypal-express-checkout';
import debugLib from 'debug';

const debug = debugLib('paypal-api-test');

const CONFIG = {
  isSandbox: true,
	USER: 'testing-paypal_api1.slacktravel.com',
  PWD: '7UKXS892JN3HBQAU',
  SIGNATURE: 'Afr2TDACNdQKalblDgN.0-CyAhz1A88c9dvz.xWqcY.FIskG2KMrIJzn'
};

const paypal = new PaypalEC(CONFIG);

export default class {
  getPaymentUrl(req, res) {
    const params = [{
      PAYMENTREQUESTID: 'camp-123',
      PAYMENTACTION: 'Order',
      DESC: 'camping pack',
      AMT: 250,
      ITEMAMT: 225,
      TAXAMT: 25,
      SELLERPAYPALACCOUNTID: 'testing-vendor1@slacktravel.com',
      items: [{
        NAME: 'hiking boots',
        DESC: 'this is hiking boots description',
        AMT: 125,
        TAXAMT: 15,
        QTY: 1,
        NUMBER: 'boot-1'
      }, {
        NAME: 'sunglasses',
        DESC: 'this is sunglasses description',
        AMT: 50,
        TAXAMT: 5,
        QTY: 2,
        NUMBER: 'sunglasses-1'
      }]
    }, {
      PAYMENTREQUESTID: 'food-123',
      PAYMENTACTION: 'Order',
      DESC: 'food pack',
      AMT: 100,
      ITEMAMT: 100,
      SELLERPAYPALACCOUNTID: 'testing-vendor2@slacktravel.com',
      items: [{
        NAME: 'bread',
        DESC: 'this is bread description',
        AMT: 50,
        QTY: 1,
        NUMBER: 'bread-1'
      }, {
        NAME: 'milk',
        DESC: 'this is milk description',
        AMT: 10,
        QTY: 5
      }]
    }];
    paypal.setExpressCheckout(
      params,
      'http://localhost:3000/api/customer/auth-success',
      'http://localhost:3000/api/customer/auth-cancel'
    )
    .then((response) => {
      const { result } = response;
      res.json({
        response,
        url: paypal.getUrlFromToken(result.TOKEN)
      });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
  }

  customerAuthSuccess(req, res) {
    debug('request %s', JSON.stringify(req.query, null, 2));
    const { token, PayerID } = req.query;
    paypal
      .getExpressCheckoutDetails(token)
      .then((response) => {
        res.json(response);
      })
      .catch((err) => {
        res.status(400).json(err);
      })
  }

  customerAuthCancel(req, res) {
    debug('request %s', JSON.stringify(req.query, null, 2));
    res.json(req.query);
  }

  doExpressCheckout(req, res) {
    debug('request %s', JSON.stringify(req.query, null, 2));
    const { token, PayerID } = req.query;
    const params = [{
      AMT: 250,
      SELLERPAYPALACCOUNTID: 'testing-vendor1@slacktravel.com',
      PAYMENTREQUESTID: 'camp-123'
    }, {
      AMT: 100,
      SELLERPAYPALACCOUNTID: 'testing-vendor2@slacktravel.com',
      PAYMENTREQUESTID: 'food-123'
    }];
    paypal
      .doExpressCheckoutPayment(token, PayerID, params)
      .then(response => {
        res.json(response);
      })
      .catch(err => {
        res.status(400).json(err);
      });
  }
};
