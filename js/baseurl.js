var baseurl = 'https://test.scut18pie1.top/api'; //本地node调试用http://localhost:3000

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
          alert("没找到，滚");
      }
    }
 });

 //默认登录
 $.get("https://test.scut18pie1.top/auth/fake/2",function(data,status,res){
        
})