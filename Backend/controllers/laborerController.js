const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const dotenv=require("dotenv");
const Laborer=require("../models/laborerModel");
dotenv.config();
const generateToken = (laborerID,type) => {
    return jwt.sign( {laborerID,type} , process.env.JWT_SECRET);
  };
const createLaborerController=async (req,res)=>{
    try {
        const {fullName,email, password, experience, phone, jobID, countryID } = req.body;

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
      await files.map(file => Laborer.addImageForLaborer(laborerID, file.path));
        
        res.status(200).json({ message: 'Images uploaded and added successfully' });
      } catch (error) {
        console.error('Error adding images for laborer:', error);
        res.status(500).json({ message: 'Internal server error' });
      }

}
module.exports={createLaborerController,loginLaborer,AddIamgesToLaborer}