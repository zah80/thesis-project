const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const dotenv=require("dotenv");
const Laborer=require("../models/laborerModel");
dotenv.config();
const generateToken = (laborerID) => {
    return jwt.sign( laborerID , process.env.JWT_SECRET);
  };
const createLaborerController=async (req,res)=>{
    try {
        const { fullName, email, password, experience, phone, jobID, countryID } = req.body;


        const existingLaborer = await Laborer.findLaborerByEmail(email);
console.log("existlabo",existingLaborer);
        if (existingLaborer) {
          return res.status(400).json({ message: 'Email already exists' });
        }
    console.log("here after");
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
    console.log("laborid",laborerID);
        res.status(201).json({ message: 'Laborer created successfully', laborerID });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
      }
}
const loginLaborer=async(req,res)=>{
try {
    const { email, password } = req.body;
    console.log("email",email);
    console.log("pass1",password);
    const laborer = await Laborer.findLaborerByEmail(email);
    console.log("labaorpor ",laborer);
    if (!laborer) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
console.log("pass2",laborer.password);
    const isMatch = await bcrypt.compare(password, laborer.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

const token = generateToken(laborer.laborerID);
    res.json({ success: true, token });
  } catch (error) {
    console.error('Error logging in laborer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
module.exports={createLaborerController,loginLaborer}