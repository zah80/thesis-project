const conn=require("../database/index");
const createLaborer=async(laborer)=>{
    const sql="INSERT INTO `laborers` SET ?"
const result= await conn.query(sql,[laborer]);
console.log("resisss is ",result);
return result[0].insertId;
}
const AddImageForLaborer=async (laborerID,imageURL)=>{
  const sql='INSERT INTO `images` SET ? WHERE laborerID = ?'
    const [result]=await conn.query(sql,[imageURL,laborerID]);
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
module.exports={createLaborer,AddImageForLaborer,findLaborerByEmail};