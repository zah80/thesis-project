
const {
  createPostJob,
  getPostJobById,
  updatePostJob,
  deletePostJob,
  createCommentPost,
  updateCommentPost,
  deleteCommentPost,
  getCommentsOfPostsOneUser,
  getCommentsOfOnePost,
  getPostsOfUser,
  deleteAllCommentPost,
  getAllSearchedPostsUsersToLaborer

} = require('../models/postsJobModel');
const {getAllLaborers}=require("../models/laborerModel");
const {laborers,socketServer}=require("../socket/socketServer");
const {addNotification}=require("../models/notificationLaborerModel");
const createPostJobController =async (req, res) => {
  const post={ 
    userID:req.body.userID,
    jobID: req.body.jobID,
    countryID: req.body.countryID,
    text: req.body.text,
    image: req.body.image,
  };
  console.log("post from backend ",post);
  console.log("post body from backend ",req.body);
  try {
    const postId = await createPostJob(post);
    const allLaborers = await getAllLaborers();
console.log("alllaborers",allLaborers);
    const notificationPromises = allLaborers.map(async (laborer) => {
      const notification = {
        typeNotification: 'post',
        postID: postId,
        jobRequestID: null,
        text: `New post created: ${post.text}`,
        userID: post.userID,
        laborerID: laborer.laborerID,
      };
    
      const notificatioID = await addNotification(notification);
      console.log("notificationid",notificatioID,notification);
    
      if (laborers[laborer.laborerID]) {
        socketServer.to(laborers[laborer.laborerID]).emit("newPostNotification", {
          notificatioID: notificatioID,
          ...notification,
        });
      }
    });
    

    await Promise.all(notificationPromises);
    res.status(201).json({ postId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getPostJobByIdController = async (req, res) => {
  try {
    const post = await getPostJobById(req.params.postId);
    const comments=await getCommentsOfOnePost(req.params.postId);
    if (post) {
      res.status(200).json({post ,comments});
    }else{
      res.status(404).json({ message: 'Post not found' });
    }
  }catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePostJobController = async (req, res) =>{


  try {
    const post = await getPostJobById(req.params.postId);
    if(!post){
        res.status(200).json({ message: 'Post not found' });
    }
    const newPost = {
        userID: req.body.userID||post.userID,
        jobID: req.body.jobID||post.jobID,
        countryID: req.body.countryID||post.countryID,
        text: req.body.text||post.text,
        image: req.body.image||post.image,
      };
    await updatePostJob(req.params.postId, newPost);
    res.status(200).json({ message: 'Post updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletePostJobController = async (req, res) => {
  try {
   await deleteAllCommentPost(req.params.postId);
    await deletePostJob(req.params.postId);
    res.status(204).json({message:"delete post success"}); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCommentPostController = async (req, res) => {
 const comment = {
    post_jobID: req.params.post_jobID,
    laborerID: req.body.laborerID,
    text: req.body.text,
   
  };

  try {
    const comment_postID = await createCommentPost(comment);
    comment.sent_at=Date.now();
    res.status(201).json({ comment_postID,...comment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const updateCommentPostController = async (req, res) => {
 
 
  const comment = {
    text: req.body.text
  };
console.log("comment",comment);
  try {
    await updateCommentPost(req.params.commentId, comment);
    res.status(200).json({ message: 'Comment updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCommentPostController = async (req, res) => {
  try {
    await deleteCommentPost(req.params.commentId);
    res.status(204).json({message:"delete comment success"}); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getPostsOfUserWithComments = async (req, res) => {
    try {
    const userID=req.body.userID;
    const posts=await getPostsOfUser(userID);
    if(posts.length>0){
        const postsIDs=posts.map(post=>post.posts_jobID);
        const commentsPosts=await getCommentsOfPostsOneUser(postsIDs);
        console.log("comments post",commentsPosts);
        const commentsJoinForEachPost=commentsPosts.reduce((acc,comment)=>{
if(!acc[comment.post_jobID]){
    acc[comment.post_jobID]=[]
}
acc[comment.post_jobID].push(comment);
return acc;
        },{})
    posts.map(post=>{
        post.comments=commentsJoinForEachPost[post.posts_jobID]||[];
    })
    return res.status(200).json(posts);
    }
    else{
        res.status(400).json({ message: 'no posts found' });
    }
    }catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
const  getAllSearchedPostsUsersToLaborerController=async(req,res)=>{
const {countryID,jobID}=req.body;
console.log("countryiscontrol",countryID);
console.log("jobicontroll",jobID);
try{
const result=await getAllSearchedPostsUsersToLaborer(countryID?countryID:null,jobID?jobID:null);
const results=result;
console.log("resulsts",results);
res.status(200).json({ message: '  geted successfully' ,results});
}

catch (error) {
    console.log(error);
  res.status(500).json({ error: error.message });
}  
}
module.exports = {
  createPostJobController,
  getPostJobByIdController,
  updatePostJobController,
  deletePostJobController,
  createCommentPostController,
  updateCommentPostController,
  deleteCommentPostController,
  getPostsOfUserWithComments,
  getAllSearchedPostsUsersToLaborerController
};