var myData;
var myid;
var title;
var getFinish = false;
$(function(){
  $.get(baseurl + "/users",function(data,status){
    myData = data;
    myid = myData.id;
    getFinish = true; 
    console.log(data);    
  });
})


function sentTopic(){
  if(getFinish){
    var title = $("#input_topic").val();
    if(title==""){
      alert("还未输入话题名称");
    }else{
      console.log(title);
      console.log(myid);
      $.ajax({
        type: "post",
        url: baseurl + "/topics",
        data: {
          title: title,
          target_id: myid
        },
        success: function(data){
          alert("发送成功");
        },
        error: function(){
          alert("错误");
        }
      });
    }
  }
}