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
if (result[0].length === 0) {
    return null;
  }
  return result[0];
}
module.exports={createLaborer,addImageForLaborer,findLaborerByEmail};