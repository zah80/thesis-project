const conn=require("../database/index");
const createLaborer=async(laborer)=>{
    const sql="INSERT INTO `laborers` SET ?"
const result= await conn.query(sql,[laborer]);
console.log("resisss is ",result);
return result[0].insertId;
}
const addImageForLaborer=async (laborerID,imageURL)=>{
    const sql = 'INSERT INTO `images` (laborerID, imageURL) VALUES (?, ?)';
    const [result] = await conn.query(sql, [laborerID, imageURL]);
    return result;
}
const findLaborerByEmail=async (email)=>{

 const sql=   'SELECT * FROM `laborers` WHERE email = ?';
const [result]=  await conn.query(sql,[email]);
if (!result) {
    return null;
  }
  return result[0];
}
const deleteAllImagesOfLaborer=async(laborerID)=>{
    const sql=   'delete  FROM `images` WHERE laborerID = ?';
    const [result]=  await conn.query(sql,[laborerID]);
    
      return result[0];
}
const deleteIamge=async(imageID)=>{
    const sql = 'DELETE FROM `images` WHERE imageID = ?';
    const [result] = await conn.query(sql, [imageID]);
    return result;
}
const getAllLaborers=async()=>{
    const sql = `
    SELECT 
    l.laborerID,
      l.fullName,
      l.email,
      l.experience,
      l.phone,
      l.jobID,
      l.countryID,
      l.image,
      j.jobName,
      c.countryName
    FROM 
      laborers l
     JOIN 
      jobs j ON l.jobID = j.jobID
     JOIN 
      countrys c ON l.countryID = c.countryID
  `;
  
  const [result] = await conn.query(sql);
  return result;
}
const getOneLaborer=async(laborerID)=>{
    const sql = `
    SELECT 
    l.laborerID,
      l.fullName,
      l.email,
      l.experience,
      l.phone,
      l.jobID,
      l.countryID,
      l.image,
      j.jobName,
      c.countryName
    FROM 
      laborers l
     JOIN 
      jobs j ON l.jobID = j.jobID
     JOIN 
      countrys c ON l.countryID = c.countryID
 WHERE laborerID = ?
      `;
  
  const [result] = await conn.query(sql,[laborerID]);
  return result[0];
}
const getAllImagesOfLaborer=async(laborerID)=>{
    const sql='SELECT * FROM images WHERE laborerID=?';
    const [result] = await conn.query(sql,[laborerID]);
    return result;
}
const updateLaborer=async(laborerID,laborer)=>{
  
    const sql = `
    UPDATE laborers
    SET fullName = ?, experience = ?, phone = ?, jobID = ?, countryID = ?, image = ?
    WHERE laborerID = ?
  `;
  const [result] = await conn.query(sql, [
    laborer.fullName,
    laborer.experience,
    laborer.phone,
    laborer.jobID,
    laborer.countryID,
    laborer.image,
    laborerID
  ]);
  return result;
}
const deleteLaborer=async(laborerID)=>{
    const sql = 'DELETE FROM `laborers` WHERE laborerID = ?';
    const [result] = await conn.query(sql, [laborerID]);
    return result;
}
module.exports={createLaborer,addImageForLaborer,findLaborerByEmail,deleteAllImagesOfLaborer,deleteIamge,
    getAllLaborers,getOneLaborer,getAllImagesOfLaborer,updateLaborer,deleteLaborer
};