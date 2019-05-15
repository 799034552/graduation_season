var myData;
var myid;
var title;
var getFinish = false;
var rule = /id=(.*?)$/;
$(function(){
  var temp = rule.exec(window.location.href);
  if(temp){
    myid = temp[1];
  } else {
    $.get(baseurl + "/users",function(data,status){
      myData = data;
      myid = myData.id;
      getFinish = true; 
      console.log(data);    
    });

  }

})


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
          alert("发送成功");
          window.location="bubble/index.html";
        },
        error: function(){
          alert("错误");
        }
      });
    }
  }
}