const { uploadImage } = require("../middlewares/uploadImage");
const { uploadImageToS3 } = require("../utils/uploadProductImgeToS3");

const router = require("express").Router();
const menuitemController = require("../controllers/menuItemController");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require('fs');
const MenuItem = require("../models/menuItems.model")

async function uploadImageMiddleware(req,res,next){
  console.log('heree  --- ')
    await new Promise((resolve, reject) => {
        uploadImage("products", "image")(req, res, (err) => {
          if (err) {
            reject(err);
          }
          resolve(req.file);
        });
      });

      console.log('req-->', req.body.image)
  
      // await uploadImageToS3(file);
      next();
      console.log('out  --- ')
}

router.post("/", 
// uploadImageMiddleware, 
menuitemController.createMenuItem);

router.get("/", menuitemController.getAllItems);

router.get("/discount", menuitemController.getAllitemsForDiscount);

router.get("/productscount", menuitemController.getNumberofItems);

router.get("/restaurant/:id", menuitemController.getItemsByRestaurant);

router.get("/category/:categoryId", menuitemController.getProductsByCategoryId);

router.get("/outstock", menuitemController.getoutOfStockItems);

router.get("/instock", menuitemController.getInStockItems);

router.get("/:id", menuitemController.getItemById);

router.get("/itemids", menuitemController.getItemsByIds);

router.get("/name/keyword/:search", menuitemController.getItemBySearch);

router.get("/o/r/product-order-count", menuitemController.getItemOrderCounts);

router.put("/:id", menuitemController.updateMenuItem);

router.delete("/:id", menuitemController.deleteItem);

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb (null, 'products');
  },
  filename: function(req, file, cb) {
    cb( null, file.originalname)
  }
})

const upload = multer({ storage: storage})

const results = []

router.post('/insertFile', upload.single('file'), async(req, res) => {
  console.log(req.file.originalname)
  fs.createReadStream(`products/${req.file.originalname}`)
  .pipe(csv())
  .on('data', (data) => {
    results.push(data)
    // console.log(data)
  })
  .on('end', async() => {
    try {
      const newResults = [];
      for(const result of results){
        console.log({result})
        const price = parseInt(result?.price)
        const corp_brand_id = parseInt(result?.corp_brand_id)
        const brand_id = parseInt(result?.brand_id)
        const restaurant_id = parseInt(result?.restaurant_id)
        const sub_restaurant_id = parseInt(result?.sub_restaurant_id)
        const sell_count = parseInt(result?.sell_count)
        const newResult = {...result, price, corp_brand_id, brand_id, restaurant_id, sub_restaurant_id, sell_count}
        let newOrganization = await Product.findOne({where: { name: newResult?.name }})
        if(!newOrganization){
          let creates = await Product.create(newResult)
          newResults.push(creates)
          // console.log('new promise resolved')
        } 
        else {
          let updated = await Product.update(
            newResult, { where: { name: newResult?.name } }
              )
          newResults.push(updated)
          // await Promise.all(updateResults)
          // console.log('updated promise resolved')
        }
      }
      res.send("created")
      await Promise.all(newResults)
    } catch (error) {
      res.send({error})
      console.log('error===  ',error)
    }
  })
})

module.exports = router;