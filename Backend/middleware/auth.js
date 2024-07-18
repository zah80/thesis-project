const jwt=require("jsonwebtoken");
const authMiddleWare=  (req,res,next)=>{
    const token=req.headers.token;
    console.log("the token is ",token);
    if(!token){
        res.status(500).json({success:false ,message:"not authorized login again"});
    }
 try{
const token_decode=jwt.verify(token,process.env.JWT_SECRET);
console.log("toekndecode",token_decode);
console.log('type',token_decode.type);
if (token_decode.type === 'laborer') {
    req.body.laborerID = token_decode.laborerID;
  req.body.senderType='laborer';
  } else if (token_decode.type === 'user') {
    req.body.userID = token_decode.userID;
  req.body.senderType='user';

  }
next();
    }
    catch(error){
        console.log(error);
res.status(500).json({success:false, message:"error for token"});
    }

}
module.exports=authMiddleWare