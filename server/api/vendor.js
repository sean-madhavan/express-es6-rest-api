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

  // Authorizes vendor to capture future payments under the hood.
  // When the vendor authorizes the app, an auth token is returned to success url
  getVendorAuthorizeUrl(req, res) {
    paypal
      .getReferenceAuthToken(
        'MerchantInitiatedBilling',
        'Slack-Travel Vendor',
        'http://localhost:3000/api/vendor/auth-success',
        'http://localhost:3000/api/vendor/auth-cancel'
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

  // upon vendor authorizes the app, this endpoint is called with token attached to query string.
  vendorAuthSuccess(req, res) {
    debug('request %s', JSON.stringify(req.params, null, 2));
    const { token } = req.query;
    paypal
      .createBillingAgreement(token)
      .then((response) => {
        res.json({
          response,
          referenceID: response.result.BILLINGAGREEMENTID
        });
      })
      .catch((err) => {
        res.status(400).json(err);
      })
  }

  vendorAuthCancel(req, res) {
    debug('request %s', JSON.stringify(req.query, null, 2));
    res.json(req.query);
  }

  // captures future payments. This endpoint will be used to capture payment when a customer buys vendor's product.
  capturePayment(req, res) {
    const { referenceID, amount } = req.query;
    paypal
      .doReferenceTransaction(amount, 'SALE', referenceID)
      .then(response => {
        res.json(response);
      })
      .catch(err => {
        res.status(400).json(err);
      });
  }
};
