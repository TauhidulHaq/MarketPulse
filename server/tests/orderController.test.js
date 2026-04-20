const orderController = require('../controllers/orderController');

jest.mock('../models/Order', () => ({ findById: jest.fn(), find: jest.fn(), findOne: jest.fn(), findByIdAndUpdate: jest.fn(), }));
const Order = require('../models/Order');

describe('orderController', () => {
  beforeEach(() => jest.clearAllMocks());

  test('updateStatus rejects invalid status', async () => {
    const req = { params: { orderId: 'o1' }, body: { status: 'invalid' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await orderController.updateStatus(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('updateStatus updates order when valid status', async () => {
    Order.findById.mockResolvedValue({ _id: 'o1', save: jest.fn() });
    const req = { params: { orderId: 'o1' }, body: { status: 'processing' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await orderController.updateStatus(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
