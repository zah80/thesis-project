const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const dotenv=require("dotenv");
const Laborer=require("../models/laborerModel");
dotenv.config();
const generateToken = (laborerID,type) => {
    return jwt.sign( {laborerID,type} , process.env.JWT_SECRET);
  };
const createLaborerController=async (req,res)=>{
    try{
        const {fullName,email, password, experience, phone, jobID, countryID } = req.body;
console.log("emailis ",email);
        const existingLaborer = await Laborer.findLaborerByEmail(email);
        if (existingLaborer) {
          return res.status(400).json({ message: 'Email already exists' });
        }
   
        const hashedPassword = await bcrypt.hash(password, 10);

        const laborer = {
          fullName,
          email,
          password: hashedPassword,
          experience,
          phone,
          jobID,
          countryID,
          image:req.file?`/uploads/${req.file.filename}`:null
        };
    
        const laborerID = await Laborer.createLaborer(laborer);
        res.status(201).json({ message: 'Laborer created successfully', laborerID });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
      }
}
const loginLaborer=async(req,res)=>{
try {
    const { email, password } = req.body;
    const laborer = await Laborer.findLaborerByEmail(email);
 
    if (!laborer) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, laborer.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

const token = generateToken(laborer.laborerID,"laborer");   
res.json({ success: true, token });
  } catch (error) {
    console.error('Error logging in laborer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
const AddIamgesToLaborer=async(req,res)=>{
    console.log("bodylaborer",req.body.laborerID);
    const  laborerID  = req.body.laborerID ;
    console.log("laborer",laborerID);
    try {
        const files=req.files.images;
        console.log("files is ",files);
        const results = await Promise.all(
          files.map(async (file) => {
            const imageID = await Laborer.addImageForLaborer(laborerID, file.path);
            console.log("imageid", imageID);
    
            if (imageID) {
              const image = {
                imageID: imageID,
                imageUrl: file.path,
                laborerID: laborerID
              };
              return image;
            }
          })
        );
    console.log("results",results);
      res.status(200).json({ message: 'Images uploaded and added successfully',results });
      } catch (error) {
        console.error('Error adding images for laborer:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
}
const deleteImageController = async (req, res) => {
    const imageID = req.params.imageID;
    try {
      await Laborer.deleteIamge(imageID);
      res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
      console.error('Error deleting image:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  const getAllLaborersController=async(req,res)=>{
    try {
        const result=await Laborer.getAllLaborers();
        res.status(200).json({ message: 'laborers geted successfully',result });
      } catch (error) {
        console.error('Error ', error);
        res.status(500).json({ message: 'Internal server error' });
      }
  }
  const getCommonJobNameController = async (req, res) => {
    try {
      const result = await Laborer.getCommonJobName();
      res.status(200).json({ message: 'Laborers grouped by job name fetched successfully', result });
    } catch (error) {
      console.error('Error ', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  const getOneLaborerController=async(req,res)=>{
    try {
        const laborerID=req.body.laborerID;
     
        const laborer=await Laborer.getOneLaborer(laborerID);
     
        if(!laborer){
            return res.status(404).json({ message: 'Laborer not found' });
        }
        const images=await Laborer.getAllImagesOfLaborer(laborerID)
        res.status(200).json({ message:'laborers geted successfully',laborer,images});
      } catch (error) {
        console.error('Error ', error);
        res.status(500).json({ message: 'Internal server error' });
      }
  }
  const updateLaborerController=async(req,res)=>{
    try {
        const laborerID = req.body.laborerID; 
    
        const existingLaborer = await Laborer.getOneLaborer(laborerID);
  
        if (!existingLaborer ) {
          return res.status(404).json({ message: 'Laborer not found' });
        }
    console.log("reqfile",req.file);
    console.log("req bodis",req.body);
            const laborerUpdates = {
          fullName: req.body.fullName || existingLaborer.fullName,
          experience: req.body.experience || existingLaborer.experience,
          phone: req.body.phone || existingLaborer.phone,
          jobID: req.body.jobID || existingLaborer.jobID,
          countryID: req.body.countryID || existingLaborer.countryID,
          image: req.file ? "/uploads/"+req.file.filename : existingLaborer.image 
        };
    console.log("laborerupdate",laborerUpdates);

        const updateResult = await Laborer.updateLaborer(laborerID, laborerUpdates);
         res.status(200).json({
          message: 'Laborer updated successfully',  updateResult
        });
      } catch (error) {
        console.log('Error updating laborer:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
  }
  const deleteLaborerController=async(req,res)=>{
    const laborerID = req.body.laborerID; 
    try{
await Laborer.deleteAllImagesOfLaborer(laborerID);
await Laborer.deleteLaborer(laborerID);
res.status(200).json({ message: 'Laborer and all associated images deleted successfully' });
    }
    catch(error){
        console.log('Error updating laborer:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
  }
  const deleteLaborerWithoutAuthController = async (req, res) => {
    const laborerID = req.params.laborerID;
    try {
        await Laborer.deleteAllImagesOfLaborer(laborerID);
        await Laborer.deleteLaborer(laborerID);
        res.status(200).json({ message: 'Laborer and all associated images deleted successfully' });
    } catch (error) {
        console.log('Error deleting laborer:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
const getOneLaborerControllerByID=async(req,res)=>{
  try {
      const laborerID=req.params.laborerID;
   
      const laborer=await Laborer.getOneLaborer(laborerID);
   
      if(!laborer){
          return res.status(404).json({ message: 'Laborer not found' });
      }
      const images=await Laborer.getAllImagesOfLaborer(laborerID)
      res.status(200).json({ message:'laborers geted successfully',laborer,images});
    } catch (error) {
      console.error('Error ', error);
      res.status(500).json({ message: 'Internal server error' });
    }
}
module.exports={createLaborerController,loginLaborer,AddIamgesToLaborer,deleteImageController
    ,getAllLaborersController,getCommonJobNameController,
    getOneLaborerController,updateLaborerController,deleteLaborerController,deleteLaborerWithoutAuthController,getOneLaborerControllerByID
}