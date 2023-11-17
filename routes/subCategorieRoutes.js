const router = require("express").Router();

const subCategorieController = require("../controllers/subCategoryController");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require('fs');
const SubCategory = require("../models/subCategory.model");

router.post("/", subCategorieController.createSubCategory);

router.get("/", subCategorieController.getAllSubCategories);

router.get("/productcount", subCategorieController.getSubCategoriesProductCount);

router.get("/:id", subCategorieController.getSubCategoryById);

router.get("/sub/:category_id", subCategorieController.getSubCategoriesByCatId);

router.put("/:id", subCategorieController.updateSubCategory);

router.delete("/:id", subCategorieController.deleteSubCategory);

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
      // console.log(results)
      for(const result of results){
        console.log({result})
        const category_id = parseInt(result?.category_id)
        // const no_of_employees = parseInt(result?.no_of_employees)
        const newResult = {...result, category_id}
        let newOrganization = await SubCategory.findOne({where: { name: newResult?.name }})
        if(!newOrganization){
          let creates = await SubCategory.create(newResult)
          newResults.push(creates)
          // console.log('new promise resolved')
        } 
        else {
          let updated = await SubCategory.update(
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
