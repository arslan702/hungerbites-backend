const Category = require("../models/category.model");
const MenuItem = require("../models/menuItems.model");
const sequelize = require("../config/database");
const cloudinary = require('cloudinary');

exports.getCategoryMenuItemCount = async (req, res) => {
  try {
    const category = await Category.findAll({
      attributes: [
        'id',
        'name'
        [sequelize.fn('COUNT', sequelize.col('MenuItem.id')), 'menuItemCount']
      ],
    });

    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching categories" });
  }
}

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({ order: [['name', 'ASC']] });
    return res.status(200).json({ categories });
  } catch (error) {
    console.log(`Error retrieving categories: ${error}`);
    return res.status(500).json({ error: "Error retrieving categories" });
  }
};


// get categories and sub count
exports.getCount = async (req, res) => {
  const cat = await Category.findAndCountAll();
  const categoryCount = cat?.count;
  res.status(200).json({ categoryCount});
}

// exports.categoriesList = (req, res) => {
//   Category.findAll().then((categories) => {
//     const result = [];

//     for (const category of categories) {
//       const children = [];

//       SubCategory.findAll({
//         where: {
//           category_id: category.id,
//         },
//       })
//         .then((subcategories) => {
//           for (const subcategory of subcategories) {
//             childeren
//               .push({
//                 id: subcategory.id,
//                 name: subcategory.name,
//                 slug: `/${subcategory.name.toLowerCase().replace(/\s+/g, "")}`,
//               })
//               .catch((error) => {
//                 console.log(
//                   `Error retrieving subcategories for category ${category.name}: ${error}`
//                 );
//                 return res.status(500).json({
//                   error: `Error retrieving subcategories for category ${category.name}`,
//                 });
//               });
//             result.push({
//               id: category.id,
//               name: category.name,
//               slug: `/${category.name.toLowerCase().replace(/\s+/g, "")}`,
//               children: children,
//             });
//           }
//           res.status(200).json({ categories: result });
//         })
//         .catch((error) => {
//           console.log(`Error retrieving categories: ${error}`);
//           return res.status(500).json({ error: "Error retrieving categories" });
//         });
//     }
//   });
// };

// Get a single category by id
exports.getCategoryById = (req, res) => {
  const id = req.params.id;
  Category.findByPk(id)
    .then((category) => {
      if (!category) {
        res.status(404).send(`Category with id ${id} not found`);
        return;
      }
      res.status(200).json(category);
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
};

// Create a new category
exports.createCategory = async(req, res) => {
  try {
    const { name } = req.body;
  const category = await Category.create({
    name
  })
  res.status(201).json({
    success: true,
    message: "Category created",
    category
  })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
};

// Update an existing category
exports.updateCategory = (req, res) => {
  const id = req.params.id;
  const { name } = req.body;
  Category.update({ name }, { where: { id } })
    .then((result) => {
      if (result[0] === 0) {
        res.status(404).send(`Category with id ${id} not found`);
        return;
      }
      res.status(200).send(`Category modified with ID: ${id}`);
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
};

// Delete a category
exports.deleteCategory = (req, res) => {
  const id = req.params.id;
  Category.destroy({ where: { id } })
    .then((result) => {
      if (result === 0) {
        res.status(404).send(`Category with id ${id} not found`);
        return;
      }
      res.status(200).send(`Category deleted with ID: ${id}`);
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
};
