app.get('/category-stats', async (req, res) => {

    const paymentsCollection = db.collection('payments');
    const menuCollection = db.collection('menu');

    // Perform aggregation to get quantity and revenue by category
    const result = await paymentsCollection.aggregate([
      {
        $unwind: '$menuItemIds',
      },
      {
        $lookup: {
          from: 'menu',
          localField: 'menuItemIds',
          foreignField: '_id',
          as: 'menuItems',
        },
      },
      {
        $unwind: '$menuItems',
      },
      {
        $group: {
          _id: '$menuItems.category',
          quantity: { $sum: 1 },
          revenue: { $sum: '$menuItems.price' },
        },
      },
      {
        $project: {
          category: '$_id',
          quantity: 1,
          revenue: 1,
          _id: 0,
        },
      },
    ]).toArray();

});