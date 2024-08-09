const express=require("express");
const router=express.Router();
const authMiddleWare=require("../middleware/auth");
const postController=require("../controllers/postsJobController");
router.post("/create",authMiddleWare,postController.createPostJobController);
router.post("/edit/:postId",postController.updatePostJobController);
router.delete("/delete/:postId",postController.deletePostJobController);
router.post("/addComment/:post_jobID",authMiddleWare,postController.createCommentPostController)
router.post("/editComment/:commentId",postController.updateCommentPostController)
router.delete("/deleteComment/:commentId",postController.deleteCommentPostController)
router.get("/ofUser",authMiddleWare,postController.getPostsOfUserWithComments)
router.get("/one/:postId",postController.getPostJobByIdController)
router.post("/searchedPosts",postController.getAllSearchedPostsUsersToLaborerController);
module.exports=router;
