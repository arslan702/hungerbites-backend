const { Op, Sequelize } = require("sequelize");
const deleteImageFromS3 = require("../utils/deleteImageFromS3");
const OrderItem = require("../models/orderItem.model");
const MenuItems = require("../models/menuItems.model");
const cloudinary = require('cloudinary');
const UserAuthentication = require("../models/userAuth.model");
const Category = require("../models/category.model");

// create product
exports.createMenuItem = async (req, res) => {
  console.log('req here-->', req.body, '--',)
  try {
    const {
      name,
      description,
      category_id,
      auth_user_id,
      price,
      available,
      image
    } = req.body;

    console.log('req here-->', req.body, '--',)

    const result = await cloudinary.v2.uploader.upload(image, { folder: 'menu-items' });

    // Get the uploaded image URL from the Cloudinary response
    const image_url = result.secure_url;

    // Update the menu item with the Cloudinary image URL
    // image = image_url;

    const menuitem = await MenuItems.create({
      name,
      description,
      category_id,
      auth_user_id,
      price,
      available,
      image_url: image_url,
    });

    res.status(201).json({
      success: true,
      message: "MenuItem created successfully",
      menuitem,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getAllItems = async (req, res) => {
  const page = req.query.page || 1; // set default page to 1
  const limit = 10; // set limit to 10 results per page
  const offset = (page - 1) * limit;
  try {
    const items = await MenuItems.findAll({
      include: [
        { model: Category, as: "Category" },
        { model: UserAuthentication, as: "UserAuthentication" }
      ],
      limit,
      offset,
    });

    const count = await MenuItems.count(); // count total number of products
    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      items,
      pagination: {
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching items" });
  }
};

//get all products for discount
exports.getAllitemsForDiscount = async (req, res) => {
  try {
    const items = await MenuItems.findAll();
    res.status(200).json(items)
  } catch (error) {
    res.status(500).json({error});
  }
}

// get out of stock products
exports.getoutOfStockItems = async (req, res) => {
  const page = req.query.page || 1; // set default page to 1
  const limit = 10; // set limit to 10 results per page
  const offset = (page - 1) * limit;

  try {
    const items = await MenuItems.findAll({
      where: {
        quantity: 0
      },
      limit,
      offset,
    });

    const count = await MenuItems.count(); // count total number of products
    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      items,
      pagination: {
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching items" });
  }
};

// instock products
exports.getInStockItems = async (req, res) => {
  const page = req.query.page || 1; // set default page to 1
  const limit = 10; // set limit to 10 results per page
  const offset = (page - 1) * limit;

  try {
    const items = await MenuItems.findAll({
      where: {
        quantity: {
          [Op.gt]: 0
        }
      },
      limit,
      offset,
    });

    const count = await MenuItems.count(); // count total number of products
    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      items,
      pagination: {
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching products" });
  }
};

// number of products on different basis
exports.getNumberofItems = async (req, res) => {
  const items = await MenuItems.findAndCountAll();
  const totalItems = items.count;
  const stock = await MenuItems.findAndCountAll({
    where: {
      quantity: {
        [Op.gt]: 0
      }
    }
  })
  const inStock = stock.count;
  const outstock = await MenuItems.findAndCountAll({
    where: {
      quantity: {
        [Op.eq]: 0
      }
    }
  })

  const outOfStock = outstock.count;
  res.status(200).json({totalItems, inStock, outOfStock})
}

// Get a product by ID

exports.getItemById = async (req, res) => {
  console.log(req.params)
  MenuItems.findByPk(req.params.id, {
  })
    .then((item) => {
      if (item) {
        res.status(200).json(item);
      } else {
        res.status(404).json({ message: "Item not found" });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Error fetching item" });
    });
};

exports.getItemsByIds = async (req, res) => {
  const itemIds = req.query.itemIds.split(',').map(Number); // Assuming itemIds is a comma-separated list in the query parameter
  console.log(req.query)
  try {
    const items = await MenuItems.findAll({
      where: {
        id: itemIds,
      },
    });

    if (items.length > 0) {
      res.status(200).json(items);
    } else {
      res.status(404).json({ message: "Items not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching items" });
  }
};

exports.getItemsByRestaurant = async (req, res) => {
  const page = req.query.page || 1;
  const limit = 10;
  const offset = (page - 1) * limit;
  const id = req.params.id;
  try {
    const items = await MenuItems.findAll({
      where: {
        auth_user_id: id,
      },
      limit,
      offset,
    })
    const count = await MenuItems.count({
      where: {
        auth_user_id: id
      }
    })
    const totalPages = Math.ceil(count / limit);
    res.status(200).json({
      items,
      pagination: {
        currentPage: page,
        totalPages,
      }
    });
  } catch (error) {
    res.status(500).json({message: "Error fetching items"});
  }
}

// Get a product by Name
exports.getItemByName = async (req, res) => {
  const item = MenuItems.findOne({
    where: { name: req.params.name }
  })
    .then((res) => {
      if (item) {
        res.status(200).json(item);
      } else {
        res.status(404).json({ message: "Item not found" });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Error fetching product" });
    });
};

// get products by search
exports.getItemBySearch = async (req, res) => {
  console.log("param-----   ", req.params)
  if(!req.params.search) {
    res.status(200).json([]);
    return;
  }
  const items = await MenuItems.findAll({
    where: { name: { [Op.like]: `%${req.params.search}%` } },
  })
    .then((result) => {
      if (result.length > 0) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Error fetching products" });
    });
};

// Get all order_items by order id
// exports.getProductsByBrandId = async (req, res, next) => {
//   const { brandId } = req.params;
//   const page = req.query.page || 1;
//   const limit = 10;
//   const offset = (page - 1) * limit;
//   try {
//     const products = await Product.findAll({
//       where: { brand_id: brandId },
//       include: [
//         { model: SubCategory, as: "SubCategory" },
//         { model: Category, as: "Category" },
//         { model: Brand, as: "Brand" },
//       ],
//       limit,
//       offset,
//     })

//     res.status(200).json({
//       products
//     })
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching products"})
//   }
// };

// get products by different brands of same category
// exports.getProductsByDifferentBrands = async (req, res, next) => {
//   // const { brandId } = req.params;
//   const page = req.query.page || 1;
//   const limit = 10;
//   const offset = (page - 1) * limit;
//   try {
//     const products = await Product.findAll({
//       where: { 
//         brand_id: { [Op.ne]: req.params.brandId },
//         category_id: req.params.categoryId
//       },
//       include: [
//         { model: SubCategory, as: "SubCategory" },
//         { model: Category, as: "Category" },
//         { model: Brand, as: "Brand" },
//       ],
//       limit,
//       offset,
//     })
  
//     res.status(200).json(products)
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching products"})
//   }
// }
// Get all order_items by order id
exports.getProductsByCategoryId = async (req, res, next) => {
  const page = req.query.page || 1;
  const limit = 10;
  const offset = (page - 1) * limit;
  const { categoryId } = req.params;
  try {
    const items = await MenuItems.findAll({
      where: {
        category_id: categoryId,
      },
      limit,
      offset,
    })
    const count = await MenuItems.count({
      where: {
        category_id: categoryId
      }
    })
    const totalPages = Math.ceil(count / limit);
    res.status(200).json({
      items,
      pagination: {
        currentPage: page,
        totalPages,
      }
    });
  } catch (error) {
    res.status(500).json({message: "Error fetching items"});
  }
};

// Get all order_items by order id
// exports.getProductsBySubCategoryId = async (req, res, next) => {
//   console.log('reached')
//   const { subCategoryId } = req.params;
//   console.log({subCategoryId})
//   const page = req.query.page || 1;
//   const limit = 9;
//   const offset = (page - 1) * limit;
//   try {
//     const products = await Product.findAll({
//     where: { sub_category_id: subCategoryId },
//     include: [
//     { model: SubCategory, as: "SubCategory" },
//     { model: Category, as: "Category" },
//     { model: Brand, as: "Brand" },
//     ],
//     limit,
//     offset,
//   })
//   const count = await Product.count({
//     where: { sub_category_id: subCategoryId },
//   })
//   const totalPages = Math.ceil(count / limit)
//   res.status(200).json({
//     products,
//     totalPages
//   })  
//   } catch (error) {
//     res.status(500).json({ message: "Error products"})
//   }
// };

// Get all order_items by order id
// exports.getProductsByCategoryId = async (req, res, next) => {
//   console.log('reached')
//   const { categoryId } = req.params;
//   console.log({categoryId})
//   const page = req.query.page || 1;
//   const limit = 12;
//   const offset = (page - 1) * limit;
//   try {
//     const products = await Product.findAll({
//     where: { category_id: categoryId },
//     include: [
//     { model: SubCategory, as: "SubCategory" },
//     { model: Category, as: "Category" },
//     { model: Brand, as: "Brand" },
//     ],
//     limit,
//     offset,
//   })
//   const count = await Product.count({
//     where: { category_id: categoryId },
//   })
//   const totalPages = Math.ceil(count / limit)
//   res.status(200).json({
//     products,
//     totalPages
//   })  
//   } catch (error) {
//     res.status(500).json({ message: "Error products"})
//   }
// };

//get order count
async function getOrderCounts() {
  try {
    const result = await MenuItems.findAll({
      attributes: ['name', [Sequelize.fn('COUNT', Sequelize.col('OrderItems.menuitem_id')), 'order_count']],
      include: [{ model: OrderItem ,as: 'OrderItems', attributes: [] }],
      group: ['menuitem.id'],
      order: [[Sequelize.literal("order_count"), "DESC"]],
    });

    return result;
  } catch (error) {
    throw new Error('Error retrieving item order counts: ' + error.message);
  }
}

//
exports.getItemOrderCounts = async (req, res) => {
  console.log('here')
  try {
    const rows = await getOrderCounts();
    res.status(200).json({ rows });
  } catch (error) {
    console.error('Error retrieving product order counts:', error);
    res.status(500).json({ message: 'Error retrieving product order counts' });
  }
}
// Update a product by ID
exports.updateMenuItem = async (req, res) => {
  try {
    const menuitem = await MenuItems.findByPk(req.params.id);
    if (menuitem) {
      await menuitem.update(req.body);
      res.status(200).json(menuitem);
    } else {
      res.status(404).json({ message: "MenuItem not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating item" });
  }
};

function extractKeyFromUrl(url) {
  const pathname = new URL(url).pathname;
  const key = pathname.substring(1); // remove the initial slash
  return key;
}
// Delete a product by ID
exports.deleteItem = async (req, res) => {
  try {
    const menuitem = await MenuItems.findByPk(req.params.id);
    if (menuitem) {
      await cloudinary.v2.uploader.destroy(menuitem?.image_url);
      await menuitem.destroy();
      res.status(200).json({ message: "Item deleted" });
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting item" });
  }
};

