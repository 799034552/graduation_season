var myData;
var myid;
var title;
var getFinish = false;
var getFinish2 = false;
var temp;
$(document).ready(function(){
  $("#reply").hide();
  var rule = /id=(.*?)$/;
  temp = rule.exec(window.location.href);
  console.log(temp);
  if(temp){
    myid = temp[1];
    getFinish = true; 
    $.get(baseurl + "/users/" + temp[1],function(data,status){
        myData = data;
        console.log(data);
        myid = myData.id;
        getFinish2 = true;    
      });
  } else {
    $.get(baseurl + "/users",function(data,status){
      myData = data;
      myid = myData.id;
      getFinish = true; 
      console.log(data);
      getFinish2 = true;    
    });
  }
  
  $("#input_topic").focus(function(){
    setTimeout(() => {
      $("#input_topic").scrollIntoView(true)
      $("#input_topic").scrollIntoViewIfNeeded()
    }, 300)
  });
  $("#input_topic").blur(function(){
    setTimeout(() => {
      document.body.scrollTop = 0
    }, 600)
  });
  $("#input_content").focus(function(){
    setTimeout(() => {
      $("#input_content").scrollIntoView(true)
      $("#input_content").scrollIntoViewIfNeeded()
    }, 300)
  });
  $("#input_content").blur(function(){
    setTimeout(() => {
      document.body.scrollTop = 0
    }, 600)
  });
});
//检查是否重话题
function check(title){
  var same = false;
  for(var i in myData.collection){
    if(myData.collection[i].title == title){
      same = true;
      break;
    }    
  }
  return same;
}

function sentTopic(){
  if(getFinish&&getFinish2){   
    var title = $("#input_topic").val();
    var content = $("#input_content").val();
    console.log(title);
    console.log(content);
    if(title==""){
      alert("还未输入话题名称");
    }else if(check(title)){
      alert("不能发布相同的话题哦");
    }else{
      console.log(title);
      console.log(myid);
      $.ajax({
        type: "post",
        url: baseurl + "/topics",
        headers:{
             "Content-Type":"application/json"
        },
        data:JSON.stringify({
          target_id: myid,
          list:[
            { 
              title:title,
              content:content||"",
            }
          ],
        }),
        success: function(data){
          $("#reply").fadeIn("slow");
          setTimeout(function(){
            $("#reply").fadeOut("slow");
            setTimeout(function(){
              if(temp){
                window.location="bubble/index.html?userid=" + temp[1];
              } else {
                window.location="bubble/index.html";
              }
            },1000);
          },1000);
          
        },
        error: function(data){
          alert("错误——"+data.message);
        }
      });
    }
  }
}