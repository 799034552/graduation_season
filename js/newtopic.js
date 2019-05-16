var myData;
var myid;
var title;
var getFinish = false;
var temp;
$(document).ready(function(){
  $("#reply").hide();
  var rule = /id=(.*?)$/;
  temp = rule.exec(window.location.href);
  console.log(temp);
  if(temp){
    myid = temp[1];
    getFinish = true; 
  } else {
    $.get(baseurl + "/users",function(data,status){
      myData = data;
      myid = myData.id;
      getFinish = true; 
      console.log(data);    
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

function sentTopic(){
  console.log(myid);
  if(getFinish){
    var title = $("#input_topic").val();
    var content = $("#input_content").val();
    console.log(title);
    console.log(content);
    if(title==""){
      alert("还未输入话题名称");
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