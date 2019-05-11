var baseurl = 'https://test.scut18pie1.top/api';

//ajax拦截器
$.ajaxSetup({
    xhrFields: {
        withCredentials: true    
    },
    statusCode: {
      401: function(a,b,c) {
          alert("没授权，滚");
      },
      404:function(){
          
      },
      500:function(){
          alert("服务器问题，滚");
      }
    }
 });

//默认登录
//  $.get("https://test.scut18pie1.top/auth/fake/2",function(data,status,res){ 
// })