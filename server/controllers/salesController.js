const Order = require('../models/Order');
const geoData = require('../data/bangladeshGeo');


exports.getDivisions = (req, res) => {
  res.status(200).json({ data: Object.keys(geoData) });
};


exports.getDistricts = (req, res) => {
  const { division } = req.params;
  res.status(200).json({ data: geoData[division] || [] });
};


exports.getLocationRevenue = async (req, res) => {
  try {
    const { division, district } = req.query;


    if (!division || !district) {
      return res.status(400).json({ error: "Division and District are required." });
    }

    console.log(`Searching database for: Division=${division}, District=${district}`);

  
    const stats = await Order.aggregate([
      { 
        $match: { 

          "customerLocation.division": { $regex: new RegExp(`^${division}$`, 'i') },
          "customerLocation.district": { $regex: new RegExp(`^${district}$`, 'i') },
          status: "completed" 
        } 
      },
      { $unwind: "$products" },
      { 
        $group: { 
          _id: "$products.name", 
          totalRevenue: { $sum: { $multiply: ["$products.price", "$products.quantity"] } } 
        } 
      }
    ]);

    console.log("Aggregation Result:", stats);

    res.status(200).json({ 
      data: { 
        labels: stats.map(s => s._id), 
        values: stats.map(s => s.totalRevenue) 
      } 
    });
  } catch (err) { 
    console.error("Sales Controller Error:", err);
    res.status(500).json({ error: err.message }); 
  }
};
