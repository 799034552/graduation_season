var hotCommentTop = 0;//当前评论高度
var hotSort = true;//当前选中的排序方式
var dataTime = '';//时间排序数据
var dataHot = '';//热度排序数据
var topicid;//当前话题id
var commentid;//当前评论id
var dataTime;
//记录评论所在位置
var idLikeHot = [];
var idLikeTime = [];

var idLike = [];//记录评论点赞情况

var url = location.search;
var requestid = url.split("id=");
var timeReversal = false;

function ajaxFinish(){
    topicid = dataTime.id;//获取话题id
    dataTime.sort = "dataTime";
    dataHot = $.extend(true, {}, dataTime);//复制评论
    sortHot(dataHot);//按热度排序   
    dataHot.sort = "dataHot";
    //渲染评论
    loadComment(dataTime,"time",false);
    loadComment(dataHot,"hot",false);
    console.log(dataHot);    
    document.getElementById("topicName").innerHTML = dataTime.title;
    document.getElementById("topic_likes").innerHTML = dataTime.likes; 

}

//回复话题的刷新
function refreshA(){
  $("#reply_area").hide();
  $("#subcomment_detail").remove();
  $("#topic").show();
  $("#comment_hot").show();
  $("#comment_time").show();
  $("#comment_hot").empty();
  $("#comment_time").empty();
  $.get(baseurl + "/topics/" + requestid[1] ,function(data,status){
    dataTime = data;
    ajaxFinish();
    if(hotSort){
      $("#comment_time").hide();
    }else{
      $("#comment_hot").hide();
    }
  });
}
//回复评论的刷新
function refreshB(){
  $("#reply_area").hide();
  $("#subcomment_detail").remove();
  $("#topic").show();
  $("#comment_hot").show();
  $("#comment_time").show();
  $("#comment_hot").empty();
  $("#comment_time").empty();
   var a;
  $.get(baseurl + "/topics/" + requestid[1] ,function(data,status){
    dataTime = data;
    ajaxFinish();
    if(hotSort){
      $("#comment_time").hide();
      a = "comment_hot" + idLikeHot[commentid];
    }else{
      $("#comment_hot").hide();
      a = "comment_time" + [commentid];
    }
    window.location.hash = "#";
    window.location.hash = a;
  });
}

//进入页面
$(function(){
  //initiate();
    $("#reply_area").hide();
  
  $.get(baseurl + "/topics/" + requestid[1] ,function(data,status){
            dataTime = data;
            ajaxFinish();
            $("#comment_time").hide();
        });
  

  $("#sent_comment").hide();
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
      $("#sort_time_text").css("color", "rgba(22, 155, 213, 1)");
      $("#sort_hot_text").css("color", "#000000");
      $("#comment_hot").hide();
      $("#comment_time").show();
      hotSort = false;
    }else{
      $("#comment_time").empty();
      timeReversal = !timeReversal;
      loadComment(dataTime,"time",timeReversal);      
    }
  })
//按热度排序
  $("#sort_hot").click(function(){
    if(!hotSort){

      $("#sort_hot_text").css("color", "rgba(22, 155, 213, 1)");
      $("#sort_time_text").css("color", "#000000");
      $("#comment_time").hide();
      $("#comment_hot").show();
      hotSort = true;

   }
  })
  $("#input_comment").focus(function(){
    $("#topic_likes_img").hide();
    $("#topic_likes").hide();
    $("#sent_comment").show();
  })
  $("#input_comment").blur(function(){
    var content = $("#input_comment").val();
    if(content==""){
    $("#sent_comment").hide();
    $("#topic_likes_img").show();
    $("#topic_likes").show();
    }
  })

})




//回复评论
function reply(topicId, comId, subcommentCreator){
 //清空评论框
  $("#input_comment").val("");
  $("#sent_comment").hide();
  $("#topic_likes_img").show();
  $("#topic_likes").show();


  if(subcommentCreator==""){
    var timeSeat = idLikeTime[comId];
    var temp = "回复" + dataTime.comments[timeSeat].creator.name;
     $("#input_reply").attr("placeholder",temp);
     $("#input_reply").val("");
  }else{
    var replycontent = "回复 "+subcommentCreator +"：";
     $("#input_reply").val(replycontent);    
  }
  $("#reply_area").show();
  document.getElementById("input_reply").focus();
  commentid = comId;
}

//发送子评论
function sentSubcomment(){
  var content = $("#input_reply").val();
  if(content ==""){
    alert("还没填写回复内容");
  }else{ 
    $.ajax({
      type: "post",
      url: baseurl + "/subcomments",
      data: {
        content: content,
        topic_id: topicid,
        comment_id: commentid
      },
      success: function(data) {
        alert("回复成功");
        refreshB();
      },
      error: function () {
        alert("错误");
      }
    });
  }
}

//发送评论
function sentComment(){
  var content = $("#input_comment").val();
  if(content==""){
    alert("请填写评论内容");
  }else{
    $.ajax({
        type: "post",
        url: baseurl + "/comments",
        data: {
          content:content,
          topic_id:topicid
        },
        success: function (data) {
          alert("发布成功");
          refreshA();
        },
        error: function () {
          alert("错误");
        }
      });
  }
}


//单条评论
function comment(topicid ,commentID, i ,sort, avatar, content, creatorName, likes, liked ,id ,dataName){
  $(commentID).append(
            "<div class=\"comments\" id=\"comment_"+ sort + i +"\" >"+
              "<img class=\"avatar\" onclick = reply("+topicid+","+id+",\"\"); src= " + avatar + ">"+
              "<p class=\"username\" onclick = reply("+topicid+","+id+",\"\");>" + creatorName +"</p>"+
              "<p class=\"likes\" id=\"likes_"+ sort + i +"\">" + likes +"</p>"+
              "<img src=\"../img/love.png\" class=\"like_img\" id=\"liked_"+ sort + i +"\" onclick = like("+id+",dataTime,dataHot,idLikeHot,idLikeTime,idLike);>"+
                  
                  "<p class=\"content\" id=\"content_"+ sort + i +"\" onclick = reply("+topicid+","+id+",\"\");>"+ content +"</p>"+
                  // "<div class=\"reply\" id=\"reply_"+ sort + i +"\">" +
                  //   //"<p class=\"reply_text\" onclick = reply("+topicid+","+id+",\"\");>回复TA</p>"+
                  // "</div>"+
                  "<div class=\"subcomment\" id=\"subcomment_"+ sort + i +"\">"+
                  "</div>"+
               "<div class = \"border_div\" id=\"border_"+ sort + i +"\">"+
               "</div>"+

            "</div>"
        );
}


//渲染评论
function loadComment(data, sort ,Reversal){
  var temp1 = 0;
  var temp2 = 1;
  if(Reversal){
    temp1 = getLength(data.comments)-1;
    temp2 = -1;
  }
  var commentID = "#comment_" + sort;
  var commentTop = 0;
  for(var i = temp1; i!=(-1)&&i!=getLength(data.comments); ){
    //加载单条评论
    comment(topicid,commentID, i ,sort, data.comments[i].creator.avatar, data.comments[i].content, data.comments[i].creator.name, data.comments[i].likes, data.comments[i].liked,data.comments[i].id,data.sort);

    var ID = "#comment_"+ sort + i ; //评论ID
    var contentID = "#content_" + sort + i; //评论内容id
    var replyID = "#reply_" + sort + i;  //回复按钮id
    var subcommentID = "#subcomment_" + sort + i;//子评论区id
    var subcontentHeight = 0;
    idLike[data.comments[i].id] = data.comments[i].liked;
    if(sort == "hot"){
    idLikeHot[data.comments[i].id] = i;
    }else{
    idLikeTime[data.comments[i].id] = i;
    }

    
    var subcomment = data.comments[i].subcomments;
    var subcommentNum = getLength(subcomment);
    
    if(subcommentNum==0){
      ;
    }else{
      for(var j = 0; j < 1; j++){
         $(subcommentID).append(
          "<img class=\"sub_avatar\"  src= " + data.comments[i].subcomments[j].creator.avatar + ">"+
          "<p class=\"sub_username\">" + data.comments[i].subcomments[j].creator.name +"</p>"+
          "<p class=\"subcontent\" id=\"subcontent_" + sort + i + "_" + j + "\">"+data.comments[i].subcomments[j].content+"</p>"
          );
         var subcontentID = "#subcontent_" + sort + i + "_" + j;   
         if(j == 0){
          subcontentHeight = parseInt($(subcontentID).css("top"));
         }//获取初始高度
          

          $(subcontentID).css("top", subcontentHeight);
          var subcontentTop = parseInt($(subcontentID).css("height")) ;//获取子评论高度
          subcontentHeight = subcontentHeight + subcontentTop;//累加子评论区高度
      }
      $(subcommentID).append(
        "<p class=\"more_subcomment\" id=\"subcontent_"+ sort + i + "\" onclick=\"subcomment("+subcommentNum+"," + i+ ","+data.sort+");\">查看全部的" + subcommentNum + "条回复</p>"
      )
      var moreSubcomment = "#subcontent_"+ sort + i;
      subcontentHeight = subcontentHeight + parseInt($(moreSubcomment).css("top"));
      $(moreSubcomment).css("top", subcontentHeight);     
      subcontentHeight = subcontentHeight + parseInt($(moreSubcomment).css("height")) ;
    }
    
  
    subcontentHeight = parseInt($(subcommentID).css("height")) + subcontentHeight; //子评论区高度
    if(subcommentNum==0){
      subcontentHeight = 0;
    }
    var contentHight = parseInt($(contentID).css("height"));  //获取内容高度

    //var replyTop = parseInt($(replyID).css("top")) + contentHight;//获取按钮位置
    //
    var subcommentTop = parseInt($(subcommentID).css("top")) + contentHight ;//子评论区位置
    var commentHeight = parseInt($(ID).css("height")) + subcontentHeight + subcommentTop;//评论高度
  
    $(ID).css("top", commentTop);//调整评论位置

    //$(replyID).css("top", replyTop);//调整回复按钮位置
    //
    $(subcommentID).css("top", subcommentTop);//调整子评论区位置
    if(subcommentNum==0){
      subcontentHeight = 0;
    }
    $(subcommentID).css("height", subcontentHeight);
    $(ID).css("height", commentHeight);
    var border = "#border_" + sort + i;
    $(border).css("height",commentHeight);


      commentTop = commentTop + parseInt($(ID).css("height"));//累加评论高度
  
    i = i + temp2;
  }
  if(sort=="hot"){
    hotCommentTop = commentTop;
  }
  var foot = "#foot_" + sort;
  $(commentID).append(
    "<p class=\"comment_foot\" id=\"foot_"+sort+"\">没有更多评论了哦</p>"
    )
  var footTop = parseInt($(foot).css("top")) + commentTop;
  $(foot).css("top", footTop);
  commentTop = footTop + parseInt($(foot).css("height"));
  $("#blank").css("height", commentTop);
}  


//调至子评论页面
function subcomment(subcommentNum , sequenceNum , data ){
  $("#input_comment_area").hide();
  $("#topic").hide();
  $("#base").append(
            "<div id=\"subcomment_detail\">"+
              "<div id=\"subcomment_detail_head\">"+
              "<img id=\"back\" onclick=\"back("+ sequenceNum + ", hotSort )\" src=\"../img/cross.png\">"+
              "<p class=\"subtopic\">" +data.comments[sequenceNum].creator.name+ "的评论</p>"+
              "</div>"+
            "</div>"
        );

  var commentID = "#comment_" ;
  var commentTop = parseInt($("#subcomment_detail_head").css("height"));
//该条评论
  $("#subcomment_detail").append(
    "<div class=\"comments\" id=\"comment_detail\">"+
              "<img class=\"avatar\" onclick = reply("+data.id+","+data.comments[sequenceNum].id+",\"\"); src="+ data.comments[sequenceNum].creator.avatar +" >"+
              "<p class=\"username\" id=\"comment_detail_creator\" onclick = reply("+data.id+","+data.comments[sequenceNum].id+",\"\");>"+ data.comments[sequenceNum].creator.name +"</p>"+ 
              "<p id=\"owner\">楼主</P>"+
              "<p class=\"likes\" id=\"comment_detail_likes\">"+data.comments[sequenceNum].likes+"</p>"+
              "<img src=\"../img/love.png\" class=\"like_img\" id=\"comment_detail_liked\" onclick = subLike("+data.comments[sequenceNum].id+",dataTime,dataHot,idLikeHot,idLikeTime,idLike);>"+                 
              "<p class=\"content\" onclick = reply("+data.id+","+data.comments[sequenceNum].id+",\"\"); id=\"comment_detail_content\">"+data.comments[sequenceNum].content+"</p>"+
                  //"<div class=\"reply\" id=\"comment_detail_reply\" onclick = reply("+data.id+","+data.comments[sequenceNum].id+",\"\");>" +
                  //  "<p class=\"reply_text\" >回复TA</p>"+
                  //"</div>"+
            "</div>"

  )
  //对该评论的位置大小调整
  $("#comment_detail").css("top", commentTop);
  var firstTop = parseInt($("#comment_detail_content").css("height")) + parseInt($("#comment_detail_content").css("top"));
  var firstHight = firstTop + parseInt($("#comment_detail").css("height"));
  //$("#comment_detail_reply").css("top",firstTop);
  $("#comment_detail").css("height", firstHight);
  commentTop = commentTop + firstHight;
  var ownerLeft = parseInt($("#owner").css("left")) + parseInt($("#comment_detail_creator").css("left")) + parseInt($("#comment_detail_creator").css("width"));
  $("#owner").css("left", ownerLeft);


  var subcomment = data.comments[sequenceNum].subcomments;
  var subcommentNum = getLength(subcomment);


  for(var i = 0; i < subcommentNum; i++){
    $("#subcomment_detail").append(
            "<div class=\"comments\" id=\"subcomment_detail_"+ i +"\">"+
              "<img class=\"avatar\" onclick = reply("+data.id+","+data.comments[sequenceNum].id+",\""+subcomment[i].creator.name+"\"); src="+subcomment[i].creator.avatar+">"+
              "<p class=\"username\" onclick = reply("+data.id+","+data.comments[sequenceNum].id+",\""+subcomment[i].creator.name+"\");>"+subcomment[i].creator.name+"</p>"+                  
              "<p class=\"content\" onclick = reply("+data.id+","+data.comments[sequenceNum].id+",\""+subcomment[i].creator.name+"\"); id=\"subcomment_detail_content_" + i +"\">"+subcomment[i].content+"</p>"+
                  //"<div class=\"reply\" id=\"subcomment_detail_reply_" + i +"\" onclick = reply("+data.id+","+data.comments[sequenceNum].id+",\""+subcomment[i].creator.name+"\");>" +
                   // "<p class=\"reply_text\" >回复TA</p>"+
                  //"</div>"+
              "<div class=\"border_div\" id=\"subcomment_detail_border"+ i +"\"></div>"+
            "</div>"
        );
     
    var ID = "#subcomment_detail_" + i ; //评论ID
    var contentID = "#subcomment_detail_content_" + i; //评论内容id
    var replyID = "#subcomment_detail_reply_" + i;  //回复按钮id
    var subcontentHeight = 0;
     
  
    var contentHight = parseInt($(contentID).css("height"));  //获取内容高度
   // var replyTop = parseInt($(replyID).css("top")) + contentHight;//获取按钮位置
    var commentHeight = parseInt($(".username").css("top"))  + contentHight + parseInt($(contentID).css("top"));;//评论高度

    $(ID).css("top", commentTop);//调整评论位置
    //$(replyID).css("top", replyTop);//调整回复按钮位置
    $(ID).css("height", commentHeight);
    commentTop = commentTop + parseInt($(ID).css("height"));//累加评论高度

    var border="#subcomment_detail_border" + i;
    $(border).css("height", commentHeight);
    
  }
  $("#subcomment_detail").append(
    "<p class=\"comment_foot\" id=\"sub_foot\">没有更多评论了哦</p>"
    )
  var foot = "#sub_foot"
  var footTop = parseInt($(foot).css("top")) + commentTop;
  $(foot).css("top", footTop);


}

//从子评论页面后退
function back(sequenceNum,hotSort){
  $("#input_comment_area").show();
  var type="";
  if(hotSort){
    type="hot";
  }else{
    type="time";
  }
    $("#subcomment_detail").remove();
    $("#topic").show();
    var a = "comment_" + type + sequenceNum;
    window.location.hash = "#";
    window.location.hash = a;

}

//获取json数组数量
function getLength(a){
  var length = 0;
  for(var i in a){
    length++;
  }
  return length;
}

//按热度排序
function sortLike(a,b){
  return -(a.likes - b.likes);
}
function sortHot(data){
  data.comments.sort(sortLike);
}

//点赞

function like(id , data ,data2,idLikeHot,idLikeTime,idLike ){
  var hotLikeSeat = idLikeHot[id];
  var timeLikeSeat = idLikeTime[id];
  $.ajax({
    url:baseurl + "/likecomments/" + id,
    method:"PUT",
    success(data){
        console.log(data);
    }
  })
  if(idLike[id]){
    var a1 = "#liked_time" + idLikeTime[id];
    var a2 = "likes_time" + idLikeTime[id];
    
    
    var b1 = "#liked_hot" + hotLikeSeat;
    var b2 = "likes_hot" + hotLikeSeat;
    //$(b1).attr('src', "");
    // $(b).attr('src', "");
    idLike[id] = false;
    var newlikes = data.comments[timeLikeSeat].likes - 1;
    data.comments[timeLikeSeat].likes = newlikes;
    data2.comments[hotLikeSeat].likes = newlikes;
    document.getElementById(b2).innerHTML = newlikes;
    document.getElementById(a2).innerHTML = newlikes;

    //ajax
  }else{

    var a1 = "#liked_time" + idLikeTime[id];
    var a2 = "likes_time" + idLikeTime[id];
    
    
    var b1 = "#liked_hot" + hotLikeSeat;
    var b2 = "likes_hot" + hotLikeSeat;
    //$(b1).attr('src', "");
    // $(b).attr('src', "");
    idLike[id] = true;
    var newlikes = data.comments[timeLikeSeat].likes + 1;
    data.comments[timeLikeSeat].likes = newlikes;
    data2.comments[hotLikeSeat].likes = newlikes;
    document.getElementById(b2).innerHTML = newlikes;
    document.getElementById(a2).innerHTML = newlikes;
  }
}
//子评论页点赞
function subLike(id,data,data2,idLikeHot,idLikeTime,idLike){
  like(id,data,data2,idLikeHot,idLikeTime,idLike);
  var a = idLikeTime[id];
  if(idLike[id]){
    document.getElementById("comment_detail_likes").innerHTML = data.comments[a].likes;
    // $(a).attr('src', "");
  }else{
    // $(a).attr('src', "");
    document.getElementById("comment_detail_likes").innerHTML = data.comments[a].likes;
 }

}

function topicLike(){
  if(dataTime.liked){
    dataTime.likes = dataTime.likes - 1;
    dataTime.liked = !dataTime.liked;
    dataHot.likes = dataTime.likes;
    dataHot.liked = dataTime.liked;
    document.getElementById("topic_likes").innerHTML = dataTime.likes;

  }else{
    dataTime.likes = dataTime.likes + 1;
    dataTime.liked = !dataTime.liked;
    dataHot.likes = dataTime.likes;
    dataHot.liked = dataTime.liked;
    document.getElementById("topic_likes").innerHTML = dataTime.likes;
  }
  $.ajax({
    url:baseurl + "/liketopics/" + topicid,
    method:"PUT",
    success(data){
        console.log(data);
    }
  })
}


function initiate(){
  $(document).ready(function (e) {
    var counter = 0;
    if (window.history && window.history.pushState) {
        $(window).on('popstate', function () {
          var rule = /from=(.+?)$/;
          var ruleResult = rule.exec(window.location.href);
          if(ruleResult){
            //window.location = ruleResult[1] + "?from=2";
            console.log(ruleResult[1] + "?from=2");
          }
          //
             alert("不可回退");  //如果需在弹框就有它
            //  this.url
            //self.location="orderinfo.html"; //如查需要跳转页面就用它
        });
    }

    window.history.pushState('forward', null, '#'); //在IE中必须得有这两行
    window.history.forward(1);
  });
}