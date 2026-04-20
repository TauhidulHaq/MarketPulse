const reviewController = require('../controllers/reviewController');

jest.mock('../models/Product', () => ({
  findById: jest.fn(),
}));
jest.mock('../models/Review', () => ({
  create: jest.fn(),
  find: jest.fn(),
  aggregate: jest.fn(),
}));

const Product = require('../models/Product');
const Review = require('../models/Review');

describe('reviewController', () => {
  beforeEach(() => jest.clearAllMocks());

  test('addReview returns 404 when product not found', async () => {
    Product.findById.mockResolvedValue(null);
    const req = { params: { productId: 'pid' }, body: { rating: 5, comment: 'x' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await reviewController.addReview(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalled();
  });

  test('addReview creates review when product exists', async () => {
    Product.findById.mockResolvedValue({ _id: 'pid', shop: 'sid' });
    Review.create.mockResolvedValue({ _id: 'r1' });
    const req = { params: { productId: 'pid' }, body: { rating: 4, comment: 'ok', customerName: 'Sam' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await reviewController.addReview(req, res);

    expect(Review.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
