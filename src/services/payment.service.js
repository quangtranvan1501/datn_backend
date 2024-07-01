// Viết cho tôi hàm
const axios = require('axios');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { Order } = require('../models');

const apiKey = process.env.API_KEY;
const clientId = process.env.CLIENT_ID;
const checkSumKey = process.env.CHECK_SUM_KEY;

class PaymentRequest {
  constructor({
    orderCode,
    amount = null,
    description = null,
    buyerName = null,
    buyerEmail = null,
    buyerPhone = null,
    buyerAddress = null,
    items = [],
    cancelUrl = null,
    returnUrl = null,
    expiredAt = null,
    signature = null,
  }) {
    this.orderCode = orderCode;
    this.amount = amount;
    this.description = description;
    this.buyerName = buyerName;
    this.buyerEmail = buyerEmail;
    this.buyerPhone = buyerPhone;
    this.buyerAddress = buyerAddress;
    this.items = items;
    this.cancelUrl = cancelUrl;
    this.returnUrl = returnUrl;
    this.expiredAt = expiredAt;
    this.signature = signature;
  }
}

const generateSignature = (amount, cancelUrl, description, orderCode, returnUrl) => {
  // Construct the data string in the specified format
  const dataString = `amount=${amount}&cancelUrl=${cancelUrl}&description=${description}&orderCode=${orderCode}&returnUrl=${returnUrl}`;

  // Compute the HMAC_SHA256 hash
  return crypto.createHmac('sha256', checkSumKey).update(dataString).digest('hex');
};

const createPayment = async (body) => {
  const { paymentRequest } = body;

  if (!paymentRequest) {
    return new Error('Thanh toán không hợp lệ');
  }

  const insertReq = new PaymentRequest({
    ...paymentRequest,
    expiredAt: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
    returnUrl: paymentRequest.returnUrl || 'http://localhost:4200/payment',
    cancelUrl: paymentRequest.cancelUrl || 'http://localhost:4200/payment',
  });

  insertReq.signature = generateSignature(
    insertReq.amount,
    insertReq.cancelUrl,
    insertReq.description,
    insertReq.orderCode,
    insertReq.returnUrl,
    checkSumKey
  );

  console.log(JSON.stringify(insertReq));

  try {
    const response = await axios.post('https://api-merchant.payos.vn/v2/payment-requests', insertReq, {
      headers: {
        'x-client-id': clientId,
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    return error;
  }
};

const deletePayment = async (body) => {
  const { id, reason } = body;

  const insertReq = { cancellationReason: reason };

  try {
    const response = await axios.post(`https://api-merchant.payos.vn/v2/payment-requests/${id}/cancel`, insertReq, {
      headers: {
        'x-client-id': clientId,
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    return json(response.data);
  } catch (error) {
    return error;
  }
};

module.exports = {
  createPayment,
  deletePayment,
};
