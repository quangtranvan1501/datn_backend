const httpStatus = require('http-status');
const { User, Order } = require('../models');
const ApiError = require('../utils/ApiError');

const getUserByUserId = async (userId) => {
    return User.findOne({ userId });
}

const updateUserById = async (userId, updateBody) => {
    const user = await getUserByUserId(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    if (updateBody.email && (await User.isEmailTaken2(updateBody.email, userId))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    Object.assign(user, updateBody);
    await user.save();
    return user;
};


const countGenderByRole = async (role) => {
    const maleCount = await User.countDocuments({ gender: 'Male', role });
    const femaleCount = await User.countDocuments({ gender: 'Female', role });
    return [
        { 'gender': 'Nam', 'tong': maleCount },
        { 'gender': 'Nữ', 'tong': femaleCount }
    ];
};

const getTotalRevenueByMonth = async () =>{
    try {
      const results = await Order.aggregate([
        {
          $match: { status: '1' } // Lọc các đơn hàng có trạng thái '1' (đã thanh toán thành công)
        },
        {
          $group: {
            _id: {
              year: { $year: "$orderDate" },
              month: { $month: "$orderDate" }
            },
            totalRevenue: { $sum: "$totalAmount" }
          }
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 } // Sắp xếp kết quả theo năm và tháng
        },
        {
          $project: {
            _id: 0, // Loại bỏ trường _id khỏi kết quả
            year: "$_id.year",
            month: "$_id.month",
            totalRevenue: 1
          }
        }
      ]);
  
      return results;
    } catch (error) {
      console.error('Lỗi khi tổng hợp tổng thu nhập theo tháng:', error);
      throw error;
    }
}

const getTop10Services = async () => {
    try {
        const results = await Order.aggregate([
          {
            $unwind: "$orderService" // Tách mảng orderService để mỗi dịch vụ là một document riêng biệt
          },
          {
            $match: {'status': '1'}
          },
          {
            $group: {
              _id: "$orderService.service",
              totalQuantity: { $sum: "$orderService.quantity" },
              count: { $sum: 1 } // Đếm số lượng đặt hàng của mỗi dịch vụ
            }
          },
          {
            $sort: { totalQuantity: -1 } // Sắp xếp theo tổng số lượng giảm dần
          },
          {
            $limit: 10 // Giới hạn kết quả chỉ lấy top 10
          },
          {
            $lookup: {
              from: 'services',
              localField: '_id',
              foreignField: '_id',
              as: 'serviceDetails'
            }
          },
          {
            $unwind: "$serviceDetails" // Tách mảng serviceDetails để truy cập chi tiết dịch vụ
          },
          {
            $project: {
              _id: 0,
              serviceId: "$_id",
              serviceName: "$serviceDetails.name",
              totalQuantity: 1,
              count: 1
            }
          }
        ]);
    
        return results;
      } catch (error) {
        console.error('Lỗi khi tổng hợp top 10 dịch vụ:', error);
        throw error;
      }
}
module.exports = {
    updateUserById,
    countGenderByRole,
    getTotalRevenueByMonth,
    getTop10Services
};