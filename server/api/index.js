import { Router } from 'express';
import Vendor from './vendor';
import Customer from './customer';

export default function() {
	const api = Router();

	const vendor = new Vendor();
	const customer = new Customer();

	// mount controller
	api.get('/vendor/authorize', vendor.getVendorAuthorizeUrl);
	api.get('/vendor/auth-success', vendor.vendorAuthSuccess);
	api.get('/vendor/auth-cancel', vendor.vendorAuthCancel);
	api.get('/vendor/capture-payment', vendor.capturePayment);

	api.get('/customer/pay', customer.getPaymentUrl);
	api.get('/customer/auth-success', customer.customerAuthSuccess);
	api.get('/customer/auth-cancel', customer.customerAuthCancel);
	api.get('/customer/capture-payment', customer.doExpressCheckout);

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({
			version : '1.0'
		});
	});

	return api;
}
