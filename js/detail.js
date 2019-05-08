var hotCommentTop = 0;
var hotSort = true;
//回复
function reply(topicId, comId, subcommentCreator){
  if(subcommentCreator==""){
     $("#input_reply").val("");
  }else{
    var replycontent = "回复 "+subcommentCreator +"：";
     $("#input_reply").val(replycontent);
  }
  $("#reply_area").show();
  
  document.getElementById("input_reply").focus();
}

//单条评论
function comment(commentID, i ,haha, avatar, content, creatorName, likes, liked){
  $(commentID).append(
            "<div class=\"comments\" id=\"comment_"+ haha + i +"\">"+
              "<img class=\"avatar\"  src= " + avatar + " + >"+
              "<p class=\"username\">" + creatorName +"</p>"+
              "<p class=\"likes\">" + likes +"</p>"+
              "<div class=\"like_img\">👍</div>"+
                  
                  "<p class=\"content\" id=\"content_"+ haha + i +"\">"+ content +"</p>"+
                  "<div class=\"reply\" id=\"reply_"+ haha + i +"\">" +
                    "<p class=\"reply_text\" onclick = reply(6,6,\"\");>回复TA</p>"+
                  "</div>"+
                  "<div class=\"subcomment\" id=\"subcomment_"+ haha + i +"\">"+
                  "</div>"+
            "</div>"
        );
}


//加载评论
function loadCommentA(commentNum, subcommentNum, haha){
  var commentID = "#comment_" + haha;
  var commentTop = 0;
  for(var i = 0; i < commentNum; i++){
    //加载单条评论
    comment(commentID, i ,haha, "../img/akari.jpg", "评论的内容啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊", "用户名", 0, true);

    var ID = "#comment_"+ haha + i ; //评论ID
    var contentID = "#content_" + haha + i; //评论内容id
    var replyID = "#reply_" + haha + i;  //回复按钮id
    var subcommentID = "#subcomment_" + haha + i;//子评论区id
    var subcontentHeight = 0;
    
    if(subcommentNum < 4){
      for(var j = 0; j < subcommentNum; j++){
         $(subcommentID).append(
          "<p class=\"subcontent\" id=\"subcontent_" + haha + i + "_" + j + "\"><span class=\"sub_name\">用户名</span>：子评论内容啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊</p>"
          )
         var subcontentID = "#subcontent_" + haha + i + "_" + j;   
         if(j == 0){
          subcontentHeight = parseInt($(subcontentID).css("top"));
         }//获取初始高度
          
          $(subcontentID).css("top", subcontentHeight);
          var subcontentTop = parseInt($(subcontentID).css("height")) ;//获取子评论高度
          subcontentHeight = subcontentHeight + subcontentTop;//累加子评论区高度
      } 
    }else{
      for(var j = 0; j < 3; j++){
         $(subcommentID).append(
          "<p class=\"subcontent\" id=\"subcontent_" + haha + i + "_" + j + "\"><span class=\"sub_name\">用户名</span>：子评论内容啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊</p>"
          )
         var subcontentID = "#subcontent_" + haha + i + "_" + j;   
         if(j == 0){
          subcontentHeight = parseInt($(subcontentID).css("top"));
         }//获取初始高度
          
          $(subcontentID).css("top", subcontentHeight);
          var subcontentTop = parseInt($(subcontentID).css("height")) ;//获取子评论高度
          subcontentHeight = subcontentHeight + subcontentTop;//累加子评论区高度
      }
      $(subcommentID).append(
        "<p class=\"subcontent\" id=\"subcontent_"+ haha + i + "\" onclick=\"subcomment(6," + i+ ");\"><span class=\"sub_name\">查看全部的" + subcommentNum + "条回复</span></p>"
      )
      var moreSubcomment = "#subcontent_"+ haha + i;
      $(moreSubcomment).css("top", subcontentHeight);     
      subcontentHeight = subcontentHeight + parseInt($(moreSubcomment).css("height")) ;
    }
    
  
    subcontentHeight = parseInt($(subcommentID).css("height")) + subcontentHeight; //子评论区高度
  
    var contentHight = parseInt($(contentID).css("height"));  //获取内容高度
    var replyTop = parseInt($(replyID).css("top")) + contentHight;//获取按钮位置
    var subcommentTop = parseInt($(subcommentID).css("top")) + contentHight + parseInt($(replyID).css("height"));//子评论区位置
    var commentHeight = parseInt($(ID).css("height")) + subcontentHeight + subcommentTop;//评论高度
  
    $(ID).css("top", commentTop);//调整评论位置
    $(replyID).css("top", replyTop);//调整回复按钮位置
    $(subcommentID).css("top", subcommentTop);//调整子评论区位置
    $(subcommentID).css("height", subcontentHeight);
    $(ID).css("height", commentHeight);
  
      commentTop = commentTop + parseInt($(ID).css("height"));//累加评论高度
  }
  if(haha=="hot"){
    hotCommentTop = commentTop;
  }
}  


//调至子评论页面
function subcomment(subcommentNum , sequenceNum ){
  
  $("#topic").hide();
  $("#base").append(
            "<div id=\"subcomment_detail\">"+
              "<div id=\"subcomment_detail_head\">"+
              "<div class=\"avatar\" id=\"back\" onclick=\"back("+ sequenceNum + ", hotSort )\" src=\"../img/akari.jpg\">后退</div>"+
              "<p class=\"subtopic\">子评论页面"+ sequenceNum +"</p>"+
              "</div>"+
            "</div>"
        );

  var commentID = "#comment_" ;
  var commentTop = parseInt($("#subcomment_detail_head").css("height"));
//该条评论
  $("#subcomment_detail").append(
    "<div class=\"comments\" id=\"comment_detail\">"+
              "<img class=\"avatar\" src=\"../img/akari.jpg\" >"+
              "<p class=\"username\" id=\"comment_detail_creator\">用户名</p>"+ 
              "<p id=\"owner\">楼主</P>"+
              "<p class=\"likes\">0</p>"+
              "<div class=\"like_img\">👍</div>"+                 
              "<p class=\"content\" id=\"comment_detail_content\">评论"+ sequenceNum +"</p>"+
                  "<div class=\"reply\" id=\"comment_detail_reply\" onclick = reply(6,5,\"\");>" +
                    "<p class=\"reply_text\" >回复TA</p>"+
                  "</div>"+
            "</div>"

  )
  //对该评论的位置大小调整
  $("#comment_detail").css("top", commentTop);
  var firstTop = parseInt($("#comment_detail_reply").css("top")) + parseInt($("#comment_detail_content").css("height"));
  var firstHight = firstTop + parseInt($("#comment_detail").css("height")) + parseInt($("#comment_detail_reply").css("height"));
  $("#comment_detail_reply").css("top",firstTop);
  $("#comment_detail").css("height", firstHight);
  commentTop = commentTop + firstHight;
  var ownerLeft = parseInt($("#owner").css("left")) + parseInt($("#comment_detail_creator").css("left")) + parseInt($("#comment_detail_creator").css("width"));
  $("#owner").css("left", ownerLeft);



  for(var i = 0; i < subcommentNum; i++){
    $("#subcomment_detail").append(
            "<div class=\"comments\" id=\"subcomment_detail_"+ i +"\">"+
              "<img class=\"avatar\" src=\"../img/akari.jpg\" >"+
              "<p class=\"username\">嘿嘿</p>"+                  
              "<p class=\"content\" id=\"subcomment_detail_content_" + i +"\">啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊</p>"+
                  "<div class=\"reply\" id=\"subcomment_detail_reply_" + i +"\" onclick = reply(6,5,\"你好\");>" +
                    "<p class=\"reply_text\" >回复TA</p>"+
                  "</div>"+
            "</div>"
        );
     
    var ID = "#subcomment_detail_" + i ; //评论ID
    var contentID = "#subcomment_detail_content_" + i; //评论内容id
    var replyID = "#subcomment_detail_reply_" + i;  //回复按钮id
    var subcontentHeight = 0;
     
  
    var contentHight = parseInt($(contentID).css("height"));  //获取内容高度
    var replyTop = parseInt($(replyID).css("top")) + contentHight;//获取按钮位置
    var commentHeight = parseInt($(ID).css("height")) + replyTop + parseInt($(replyID).css("height"));//评论高度
  
    $(ID).css("top", commentTop);//调整评论位置
    $(replyID).css("top", replyTop);//调整回复按钮位置
    $(ID).css("height", commentHeight);
    commentTop = commentTop + parseInt($(ID).css("height"));//累加评论高度
  }

}

//从子评论页面后退
function back(sequenceNum,hotSort){
  var type="";
  if(hotSort){
    type="hot";
  }else{
    type="time";
  }
    $("#subcomment_detail").remove();
    $("#topic").show();
    a = "comment_" + type + sequenceNum;
    window.location.hash = a;

}

//进入页面
$(function(){
  loadCommentA(6,4,"hot");
  loadCommentA(6,6,"time");
  // loadCommentA(10,10,"time");
  
  $("#comment_time").hide();
  $("#reply_area").hide();

  //点击回复区外隐藏回复框
  $(document).mouseup(function (e) {
        var con = $("#reply_area");   // 设置目标区域
        if (!con.is(e.target) && con.has(e.target).length === 0) {
            con.hide();
        }
  });



//按时间排序
  $("#sort_time").click(function(){
    if(hotSort){
      $("#sort_time").css("background-color", "rgba(22, 155, 213, 1)");
      $("#sort_time_text").css("color", "#FFFFFF");
      $("#sort_hot").css("background-color", "#FFFFFF");
      $("#sort_hot_text").css("color", "#000000");
      $("#comment_hot").hide();
      $("#comment_time").show();
      hotSort = false;
    }
  })
//按热度排序
  $("#sort_hot").click(function(){
    if(!hotSort){
      $("#sort_hot").css("background-color", "rgba(22, 155, 213, 1)");
      $("#sort_hot_text").css("color", "#FFFFFF");
      $("#sort_time").css("background-color", "#FFFFFF");
      $("#sort_time_text").css("color", "#000000");
      $("#comment_time").hide();
      $("#comment_hot").show();
      
      hotSort = true;
   }
  })
})