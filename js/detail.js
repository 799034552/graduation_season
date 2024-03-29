var hotCommentTop = 0;//当前评论高度
var hotSort = true;//当前选中的排序方式
var dataTime = '';//时间排序数据
var dataHot = '';//热度排序数据
var topicid;//当前话题id
var commentid;//当前评论id
var sb = false;
var replySub;
var canlike = true;

//记录评论所在位置
var idLikeHot = [];
var idLikeTime = [];
var lastSbid;
var idLike = [];//记录评论点赞情况
var idName=[];
var url = location.search;
var requestid = url.split("id=");
var timeReversal = false;

function enter(){
  document.getElementById("topicName").innerHTML = dataTime.title;
  document.getElementById("topic_content").innerHTML = dataTime.content;
  document.getElementById("topic_likes").innerHTML = dataTime.likes;
  if(dataTime.content == ""){
    var sortTop = parseInt($("#sort").css("top")) + parseInt($("#topicName").css("height")) - parseInt($("#topicName").css("top"));
    var commentAreaTop = sortTop + parseInt($("#sort").css("height"));
  }else{
    var contentTop = parseInt($("#topicName").css("height")) + parseInt($("#topic_content").css("top"));    
    var sortTop = parseInt($("#sort").css("top")) + parseInt($("#topic_content").css("height")) + parseInt($("#topicName").css("height"));
    var commentAreaTop = sortTop + parseInt($("#sort").css("height"));
    $("#topic_content").css("top",contentTop);
  }
  $("#sort").css("top",sortTop);  
  $("#comment_hot").css("top",commentAreaTop);
  $("#comment_time").css("top",commentAreaTop);
}

function ajaxFinish(){
  
    topicid = dataTime.id;//获取话题id
    dataTime.sort = "dataTime";
    dataHot = $.extend(true, {}, dataTime);//复制评论
    sortHot(dataHot);//按热度排序   
    dataHot.sort = "dataHot";
    //渲染评论
    loadComment(dataTime,"time",timeReversal);
    loadComment(dataHot,"hot",false);   
}

//刷新
function refreshA(){ 
  $.get(baseurl + "/topics/" + requestid[1] ,function(data,status){
    canlike = true;
    dataTime = data;
    $("#reply_area").hide();
    $("#subcomment_detail").remove();
    $("#topic").show();
    $("#comment_hot").show();
    $("#comment_time").show();
    $("#comment_hot").empty();
    $("#comment_time").empty();
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
   var a;
  $.get(baseurl + "/topics/" + requestid[1] ,function(data,status){
    dataTime = data;
    $("#reply_area").hide();
    $("#subcomment_detail").remove();
    $("#topic").show();
    $("#comment_hot").show();
    $("#comment_time").show();
    $("#comment_hot").empty();
    $("#comment_time").empty();
    ajaxFinish();
    canlike = true;
    if(hotSort){
      $("#comment_time").hide();
      a = "comment_hot" + idLikeHot[commentid];
    }else{
      $("#comment_hot").hide();
      a = "comment_time" + [commentid];
    }
    if(sb){
      if(sortHot){
        var num = idLikeHot[lastSbid];
        subcomment(getLength(dataHot.comments[num].subcomments) , num , dataHot );
      }else{
        var num = idLikeTime[lastSbid];
        subcomment(getLength(dataTime.comments[num].subcomments) , num , dataTime );
      }
      if(replySub){
        var a = parseInt($("#sub_foot").css("top"));
        window.scrollTo({ 
            top: a, 
            behavior: "instant" 
        })
      }
    }
  });
}

//点赞子评论页刷新
function refreshC(){ 
   var a;
  $.get(baseurl + "/topics/" + requestid[1] ,function(data,status){
    dataTime = data;
    $("#reply_area").hide();
    $("#subcomment_detail").remove();
    $("#topic").show();
    $("#comment_hot").show();
    $("#comment_time").show();
    $("#comment_hot").empty();
    $("#comment_time").empty();
    ajaxFinish();
    canlike = true;
    if(hotSort){
      $("#comment_time").hide();
      a = "comment_hot" + idLikeHot[commentid];
    }else{
      $("#comment_hot").hide();
      a = "comment_time" + [commentid];
    }
    if(sb){
      if(sortHot){
        var num = idLikeHot[lastSbid];
        subcomment(getLength(dataHot.comments[num].subcomments) , num , dataHot );
      }else{
        var num = idLikeTime[lastSbid];
        subcomment(getLength(dataTime.comments[num].subcomments) , num , dataTime );
      }
    }
  });
}


//进入页面
$(function(){
  //pushHistory();
  $("#reply_success").hide();
  $("#reply_area").hide();

  
  $.get(baseurl + "/topics/" + requestid[1] ,function(data,status){
            dataTime = data;
            enter();
            ajaxFinish();
            $("#comment_time").hide();
  });
  // $("#sent_comment").hide();
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
      if(timeReversal){
        $("#sort_img").attr("src","../img/sort_old.png"); 
      }else{
        $("#sort_img").attr("src","../img/sort_new.png");
      } 
    }
  })
//按热度排序
  $("#sort_hot").click(function(){
      $("#sort_hot_text").css("color", "rgba(22, 155, 213, 1)");
      $("#sort_time_text").css("color", "#000000");
      $("#comment_time").hide();
      $("#comment_hot").show();
      hotSort = true;
      refreshA();
  })

  // $("#input_comment").focus(function(){
  //   $("#topic_likes_img").hide();
  //   $("#topic_likes").hide();
  //   $("#sent_comment").show();
  // })
  // $("#input_comment").blur(function(){
  //   var content = $("#input_comment").val();
  //   if(content==""){
  //   $("#sent_comment").hide();
  //   $("#topic_likes_img").show();
  //   $("#topic_likes").show();
  //   }
  // })
  $("#input_comment").focus(function(){
    setTimeout(() => {
      $("#input_comment").scrollIntoView(true)
      $("#input_comment").scrollIntoViewIfNeeded()
    }, 300)
    var str = navigator.userAgent.toLowerCase()
    var ver = str.match(/CPU iPhone OS (\d+)_(\d+)_?(\d+)?/i)
    if (ver) { // 判断IOS设备
      ver = parseInt(ver[1], 10)
      if (ver !== 11) { // ios11 不需要做任何的处理
        setTimeout(() => {
          document.body.scrollTop = 9999
        }, 600)
      }
    }
  });
  $("#input_comment").blur(function(){
    setTimeout(() => {
      document.body.scrollTop = 0
    }, 600)
  });
  $("#input_reply").focus(function(){
    setTimeout(() => {
      $("#input_reply").scrollIntoView(true)
      $("#input_reply").scrollIntoViewIfNeeded()
    }, 300)
    var str = navigator.userAgent.toLowerCase()
    var ver = str.match(/CPU iPhone OS (\d+)_(\d+)_?(\d+)?/i)
    if (ver) { // 判断IOS设备
      ver = parseInt(ver[1], 10)
      if (ver !== 11) { // ios11 不需要做任何的处理
        setTimeout(() => {
          document.body.scrollTop = 9999
        }, 600)
      }
    }
  });
  $("#input_reply").blur(function(){
    setTimeout(() => {
      document.body.scrollTop = 0
    }, 600)
  });

})




//回复评论
function reply(topicId, comId, subcommentCreatorId){
 //清空评论框
  $("#input_comment").val("");
  // $("#sent_comment").hide();
  // $("#topic_likes_img").show();
  // $("#topic_likes").show();


  if(subcommentCreatorId===""){
    replySub = false;
    var timeSeat = idLikeTime[comId];
    var temp = "回复" + dataTime.comments[timeSeat].creator.name;
     $("#input_reply").attr("placeholder",temp);
     $("#input_reply").val("");
  }else{
    replySub = true;
    var replycontent = "回复 "+idName[subcommentCreatorId] +"：";
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
         $("#input_reply").val("");
         $("#reply_success").show();        
         refreshB();
         setTimeout(function(){
           $("#reply_success").fadeOut("slow");},1000);
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
          $("#input_comment").val("");
          $("#reply_success").show();
          setTimeout(function(){
            $("#reply_success").fadeOut("slow");},1000);
          refreshA();
          // $("#sent_comment").hide();
          // $("#topic_likes_img").show();
          // $("#topic_likes").show();
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
    idName[data.comments[i].creator.id] = data.comments[i].creator.name;
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
    for(var j in data.comments[i].subcomments){
      var userid = data.comments[i].subcomments[j].creator.id;
      idName[userid] = data.comments[i].subcomments[j].creator.name;
    }
    
    var subcomment = data.comments[i].subcomments;
    var subcommentNum = getLength(subcomment);
    
    if(subcommentNum==0){
      ;
    }else if(subcommentNum<4){
      for(var j = 0; j < subcommentNum; j++){
         $(subcommentID).append(
          "<div id=\"subcomment_" + sort + i + "_" + j + "\" class=\"comment_subcomment\" >"+
            "<img class=\"sub_avatar\"  src= " + data.comments[i].subcomments[j].creator.avatar + ">"+
            "<p class=\"sub_username\">" + data.comments[i].subcomments[j].creator.name +"</p>"+
            "<p class=\"subcontent\" id=\"subcontent_" + sort + i + "_" + j + "\">"+data.comments[i].subcomments[j].content+"</p>"+
          "</div>"
          );
         var comment_subcommentID ="#subcomment_"+ sort + i + "_" + j;
         
         var subcontentID = "#subcontent_" + sort + i + "_" + j; 
         var commentHeight = parseInt($(subcontentID).css("height")) + parseInt($(comment_subcommentID).css("height"));
        $(comment_subcommentID).css("top", subcontentHeight);
        $(comment_subcommentID).css("height", commentHeight);
        subcontentHeight = subcontentHeight + commentHeight;//累加子评论区高度
      }

    }else {
      for(var j = 0; j < 3; j++){
         $(subcommentID).append(
          "<div id=\"subcomment_" + sort + i + "_" + j + "\" class=\"comment_subcomment\" >"+
            "<img class=\"sub_avatar\"  src= " + data.comments[i].subcomments[j].creator.avatar + ">"+
            "<p class=\"sub_username\">" + data.comments[i].subcomments[j].creator.name +"</p>"+
            "<p class=\"subcontent\" id=\"subcontent_" + sort + i + "_" + j + "\">"+data.comments[i].subcomments[j].content+"</p>"+
          "</div>"
          );
         var comment_subcommentID ="#subcomment_"+ sort + i + "_" + j;
         
         var subcontentID = "#subcontent_" + sort + i + "_" + j; 
         var commentHeight = parseInt($(subcontentID).css("height")) + parseInt($(comment_subcommentID).css("height"));
        $(comment_subcommentID).css("top", subcontentHeight);
        $(comment_subcommentID).css("height", commentHeight);
        subcontentHeight = subcontentHeight + commentHeight;//累加子评论区高度
      }
      $(subcommentID).append(
        "<p class=\"more_subcomment\" id=\"subcontent_"+ sort + i + "\" onclick=\"openSubcomment("+subcommentNum+"," + i+ ","+data.sort+");\">查看全部的" + subcommentNum + "条回复</p>"
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
  var blockHeight = commentTop + parseInt($("#sort").css("top"));
  $("#blank_topic").css("height", blockHeight);
}  

function openSubcomment(subcommentNum , sequenceNum , data){
  subcomment(subcommentNum , sequenceNum , data );
  window.scrollTo({ 
            top: 0, 
            behavior: "instant" 
  });
}

//调至子评论页面
function subcomment(subcommentNum , sequenceNum , data ){
  $("#blank_topic").hide();
  $("#blank_sub").show();
  lastSbid = data.comments[sequenceNum].id;
  sb = true;
  $("#input_comment_area").hide();
  $("#topic").hide();
  $("#base").append(
            "<div id=\"subcomment_detail\">"+
              "<div id=\"subcomment_detail_head\">"+
              "<img id=\"back\" onclick=\"back("+ sequenceNum + ", hotSort )\" src=\"../img/back.png\">"+
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
              "<img class=\"avatar\" onclick = reply("+data.id+","+data.comments[sequenceNum].id+","+subcomment[i].creator.id+"); src="+subcomment[i].creator.avatar+">"+
              "<p class=\"username\" onclick = reply("+data.id+","+data.comments[sequenceNum].id+","+subcomment[i].creator.id+");>"+subcomment[i].creator.name+"</p>"+                  
              "<p class=\"content\" onclick = reply("+data.id+","+data.comments[sequenceNum].id+","+subcomment[i].creator.id+"); id=\"subcomment_detail_content_" + i +"\">"+subcomment[i].content+"</p>"+
              "<div class=\"border_div\" id=\"subcomment_detail_border"+ i +"\"></div>"+
            "</div>"
        );
     
    var ID = "#subcomment_detail_" + i ; //评论ID
    var contentID = "#subcomment_detail_content_" + i; //评论内容id
    var replyID = "#subcomment_detail_reply_" + i;  //回复按钮id
    var subcontentHeight = 0;
     
  
    var contentHight = parseInt($(contentID).css("height"));  //获取内容高
    var commentHeight = parseInt($(".username").css("top"))  + contentHight + parseInt($(contentID).css("top"));;//评论高度

    $(ID).css("top", commentTop);//调整评论位置
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
  var blankHeight = footTop + parseInt($(foot).css("height"));
  $("#blank_sub").css("height",blankHeight);


}

//从子评论页面后退
function back(sequenceNum,hotSort){
  sb = false;
  $("#blank_sub").hide();
  $("#blank_topic").show();
  $("#input_comment_area").show();
  var type="";
  if(hotSort){
    type="hot";
  }else{
    type="time";
  }
    $("#subcomment_detail").remove();
    $("#topic").show();
    var a = "#comment_" + type + sequenceNum;
    var seat = parseInt($(a).css("top"));
    window.scrollTo({ 
            top: seat, 
            behavior: "instant" 
        })
    // window.location.hash = "#";
    // window.location.hash = a;

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
  if(canlike){
    canlike = false;
    var hotLikeSeat = idLikeHot[id];
    var timeLikeSeat = idLikeTime[id];
    $.ajax({
      url:baseurl + "/likecomments/" + id,
      method:"PUT",
      success(data){
          refreshA();
      }
     });
  }
}
//子评论页点赞
function subLike(id,data,data2,idLikeHot,idLikeTime,idLike){
  if(canlike){
    canlike = false;
    var hotLikeSeat = idLikeHot[id];
    var timeLikeSeat = idLikeTime[id];
    $.ajax({
      url:baseurl + "/likecomments/" + id,
      method:"PUT",
      success(data){
          refreshC();
      }
     });
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

function intoDelete(){
  
}
function pushHistory() {
  console.log(document.URL);
  //history.pushState(null, null, document.URL);
  window.addEventListener("popstate", function(e) {
      console.log("回退");
      history.back();
      console.log(self.location);
      self.location.reload();
  }, false);
  var state = {
      title : "",
      url : "#"
  };
  window.history.pushState(state, "", "#");
};


