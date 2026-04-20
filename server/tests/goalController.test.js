const goalController = require('../controllers/goalController');

jest.mock('../models/Shop', () => ({ findById: jest.fn(), }));
jest.mock('../models/Order', () => ({ aggregate: jest.fn(), }));

const Shop = require('../models/Shop');
const Order = require('../models/Order');

describe('goalController', () => {
  beforeEach(() => jest.clearAllMocks());

  test('getGoal returns shop not found', async () => {
    Shop.findById.mockResolvedValue(null);
    const req = { params: { shopId: 's1' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await goalController.getGoal(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('getGoal returns todayRevenue and goal', async () => {
    Shop.findById.mockResolvedValue({ dailyGoal: 100 });
    Order.aggregate.mockResolvedValue([{ total: 250 }]);
    const req = { params: { shopId: 's1' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await goalController.getGoal(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });
});
