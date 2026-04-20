const Order = require('../models/Order');
const geoData = require('../data/bangladeshGeo');

exports.getDivisions = (req, res) => res.status(200).json({ data: Object.keys(geoData) });

exports.getDistricts = (req, res) => {
  const { division } = req.params;
  res.status(200).json({ data: geoData[division] || [] });
};

exports.getLocationRevenue = async (req, res) => {
  try {
    const { division, district } = req.query;
    const stats = await Order.aggregate([
      { $match: { "customer.division": division, "customer.district": district, status: "completed" } },
      { $unwind: "$products" },
      { $group: { _id: "$products.name", totalRevenue: { $sum: { $multiply: ["$products.price", "$products.quantity"] } } } }
    ]);
    res.status(200).json({ data: { labels: stats.map(s => s._id), values: stats.map(s => s.totalRevenue) } });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
