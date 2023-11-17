const router = require("express").Router();

const categoryController = require("../controllers/categoryController");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require('fs');
const Category = require("../models/category.model");

router.post("/", categoryController.createCategory);

router.get("/", categoryController.getCategories);

router.get("/productcount", categoryController.getCategoryMenuItemCount);

router.get("/count", categoryController.getCount);

router.get("/:id", categoryController.getCategoryById);

router.put("/:id", categoryController.updateCategory);

router.delete("/:id", categoryController.deleteCategory);

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
        // const founded = parseInt(result?.founded)
        // const no_of_employees = parseInt(result?.no_of_employees)
        // const newResult = {...result, founded, no_of_employees}
        // newResults.push(newResult)
        let newOrganization = await Category.findOne({where: { name: result?.name }})
        if(!newOrganization){
          let creates = await Category.create(result)
          newResults.push(creates)
          // console.log('new promise resolved')
        } 
        else {
          let updated = await Category.update(
            result, { where: { name: result?.name } }
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
