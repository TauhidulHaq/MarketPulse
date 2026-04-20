const dashboardController = require('../controllers/dashboardController');

jest.mock('../models/Order', () => ({ aggregate: jest.fn(), }));
const Order = require('../models/Order');

describe('dashboardController', () => {
  beforeEach(() => jest.clearAllMocks());

  test('getTopHours aggregates and maps days', async () => {
    Order.aggregate.mockResolvedValue([{ day: 1, hour: 10, revenue: 100 }]);
    const req = { params: { shopId: 's1' }, query: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await dashboardController.getTopHours(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });
});
