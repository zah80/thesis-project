const jwt=require("jsonwebtoken");
const authMiddleWare= (type)=>{
return (req,res,next)=>{
    const token=req.headers.token;
    console.log("the token is ",token);
    if(!token){
        res.status(500).json({success:false ,message:"not authorized login again"});
    }
 try{
const token_decode=jwt.verify(token,process.env.JWT_SECRET);
if(token_decode.type!==type){
    return res.status(403).json({ message: 'Access denied' });
}
console.log("toekndecode",token_decode);
if (token_decode.type === 'laborer') {
    req.body.laborerID = token_decode.laborerID;
    console.log("reachbodylaborer",req.body.laborerID);
  } else if (token_decode.type === 'user') {
    req.body.userID = token_decode.userID;
  }
next();
    }
    catch(error){
        console.log(error);
res.status(500).json({success:false, message:"error for token"});
    }
}
}
module.exports=authMiddleWare