const httpStatus = require('http-status');
const { Order } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create an order
 * @param {Object} orderBody
 * @returns {Promise<Order>}
 */
const createOrder = async (orderBody) => {
  return Order.create(orderBody);
};

/**
 * Query for orders
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryOrders = async (filter, options) => {
  const populateOptions = ['patient', 'orderService.service'].join(',');
  const paginationOptions = {
    ...options,
    populate: populateOptions,
  };
  if (filter.orderDate) {
    const startOfDay = new Date(filter.orderDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999);
    filter.orderDate = {
      $gte: startOfDay,
      $lte: endOfDay,
    };
  }
  const orders = await Order.paginate(filter, paginationOptions);
  const orders2 = orders.results.map((order) => {
    const patientDetails = {
      userId: order.patient.userId,
      name: order.patient.name,
      gender: order.patient.gender,
      address: order.patient.address,
      birthday: order.patient.birthday,
    };
    return {
      ...order.toObject(),
      patient: patientDetails,
    };
  });
  orders.results = orders2;
  return orders;
};

/**
 * Get order by id
 * @param {String} orderId
 * @returns {Promise<Order>}
 */
const getOrderById = async (orderId) => {
  return Order.findOne({ orderId }).populate('patient').populate('orderService.service');
};

const getOrdersByUserId = async (options, filter) => {
  const populateOptions = ['orderService.service'].join(',');
  const paginationOptions = {
    ...options,
    populate: populateOptions,
  };

  // const orders = await Order.paginate({ patient: userId }, paginationOptions);

  const orders = await Order.paginate(filter, paginationOptions);
  return orders;
};

/**
 * Update order by id
 * @param {String} orderId
 * @param {Object} updateBody
 * @returns {Promise<Order>}
 */
const updateOrderById = async (orderId, updateBody) => {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  Object.assign(order, updateBody);
  await order.save();
  return order;
};

/**
 * Delete order by id
 * @param {String} orderId
 * @returns {Promise<Order>}
 */
const deleteOrderById = async (orderId) => {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  await order.remove();
  return order;
};

//Tôi muốn lấy danh sách 9 dịch vụ nhiều lượt đặt nhất
const getTopServices = async () => {
  const orders = await Order.aggregate([
    {
      $unwind: '$orderService',
    },
    {
      $group: {
        _id: '$orderService.service',
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $lookup: {
        from: 'services',
        localField: '_id',
        foreignField: '_id',
        as: 'serviceDetails',
      },
    },
    {
      $unwind: '$serviceDetails',
    },
    {
      $lookup: {
        from: 'specialists',
        localField: 'serviceDetails.specialist',
        foreignField: '_id',
        as: 'specialistDetails',
      },
    },
    {
      $unwind: '$specialistDetails',
    },
    {
      $project: {
        serviceId: '$serviceDetails.serviceId',
        serviceName: '$serviceDetails.name',
        count: 1,
        specialistName: '$specialistDetails.name',
      },
    },
    {
      $limit: 9,
    },
  ]);
  //Trả về danh sách dịch vụ

  return orders;
};

module.exports = {
  createOrder,
  queryOrders,
  getOrderById,
  updateOrderById,
  deleteOrderById,
  getOrdersByUserId,
  getTopServices,
};
