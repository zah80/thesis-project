
const conn = require('../database/index');

const createPostJob = async (post) => {
  const sql = 'INSERT INTO posts_job SET ?';
  const [result] = await conn.query(sql, [post]);
  return result.insertId;
};
const getPostsOfUser=async(userID)=>{
    const sql =`
    SELECT pj.*, j.jobName, c.countryName, u.fullName AS userFullName, u.image AS userImage
    FROM posts_job pj
    LEFT JOIN jobs j ON pj.jobID = j.jobID
    LEFT JOIN countrys c ON pj.countryID = c.countryID
    LEFT JOIN users u ON pj.userID = u.userID
    WHERE pj.userID = ?
  `;
    const [result] = await conn.query(sql, [userID]);
    return  result;
}
const getPostJobById = async (postId) => {
  const sql =  `
  SELECT pj.*, j.jobName, c.countryName, u.fullName AS userFullName, u.image AS userImage
  FROM posts_job pj
  LEFT JOIN jobs j ON pj.jobID = j.jobID
  LEFT JOIN countrys c ON pj.countryID = c.countryID
  LEFT JOIN users u ON pj.userID = u.userID
  WHERE pj.posts_jobID = ?
`;
  const [result] = await conn.query(sql, [postId]);
  return result.length ? result[0] : null;
};

const updatePostJob = async (postId, post) => {
  const sql = 'UPDATE posts_job SET ? WHERE posts_jobID = ?';
  const [result] = await conn.query(sql, [post, postId]);
  return result;
};

const deletePostJob = async (postId) => {
  const sql = 'DELETE FROM posts_job WHERE posts_jobID = ?';
  const [result] = await conn.query(sql, [postId]);
  return result;
};
const getCommentsOfOnePost=async(postId)=>{
    const sql = `
    SELECT cm.*, l.fullName AS laborerFullName, l.image AS laborerImage
    FROM comments_post cm
    LEFT JOIN laborers l ON cm.laborerID = l.laborerID
    WHERE cm.post_jobID = ?
    ORDER BY cm.sent_at ASC 
  `;
    const [result] = await conn.query(sql,[postId]);
    return result;
}
const getCommentsOfPostsOneUser=async(postIds)=>{
    const sql = `
      SELECT c.*, l.fullName AS laborerFullName, l.image AS laborerImage
      FROM comments_post c
      LEFT JOIN laborers l ON c.laborerID = l.laborerID
      WHERE c.post_jobID IN (?)
      ORDER BY c.sent_at DESC
    `;
    const [result] = await conn.query(sql,[postIds]);
    return result; 
}
const createCommentPost = async (comment) => {
  const sql = 'INSERT INTO comments_post SET ?';
  const [result] = await conn.query(sql, [comment]);
  return result.insertId;
};

const updateCommentPost = async (commentId, comment) => {
  const sql = 'UPDATE comments_post SET ? WHERE comment_postID = ?';
  const [result] = await conn.query(sql, [comment, commentId]);
  return result;
};

const deleteCommentPost = async (commentId) => {
  const sql = 'DELETE FROM comments_post WHERE comment_postID = ?';
  const [result] = await conn.query(sql, [commentId]);
  return result;
};
const deleteAllCommentPost = async (postId) => {
    const sql = 'DELETE FROM comments_post WHERE post_jobID = ?';
    const [result] = await conn.query(sql, [postId]);
    return result;
  };
  const getAllSearchedPostsUsersToLaborer=async(countryID,jobID)=>{
    let sql =  `
  SELECT pj.*, j.jobName, c.countryName, u.fullName AS userFullName, u.image AS userImage,
  (SELECT JSON_ARRAYAGG(
    JSON_OBJECT(
    'laborerID',cm.laborerID,
      'commentID', cm.comment_postID,
      'tex', cm.text,
      'sent_at', cm.sent_at,
      'laborerFullName', l.fullName,
      'laborerImage', l.image
    )
  )
  FROM comments_post cm
  LEFT JOIN laborers l ON cm.laborerID = l.laborerID
  WHERE cm.post_jobID = pj.posts_jobID
  ORDER BY cm.sent_at DESC
  ) as comments
FROM posts_job pj
LEFT JOIN jobs j ON pj.jobID = j.jobID
LEFT JOIN countrys c ON pj.countryID = c.countryID
LEFT JOIN users u ON pj.userID = u.userID
WHERE 1=1
  `;
  let pushData=[];
  if(countryID){
    sql+=" AND pj.countryID=?";
    pushData.push(countryID);
  }
  if(jobID){
    sql+=" AND pj.jobID=?";
    pushData.push(jobID);

  }
  console.log("countryismodel",countryID);
  console.log("jobidmodel",jobID);
  const [result] =await conn.query(sql, pushData);
  return result;
  }
module.exports = {
  createPostJob,
  updatePostJob,
  deletePostJob,
  createCommentPost,
  updateCommentPost,
  deleteCommentPost,
  getCommentsOfPostsOneUser,
  getCommentsOfOnePost,
  getPostJobById,
  getPostsOfUser,
  deleteAllCommentPost,
  getAllSearchedPostsUsersToLaborer
};
