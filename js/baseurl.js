<<<<<<< HEAD

var baseurl = 'https://graduation2019.100steps.net/api';
//var baseurl = "https://test.scut18pie1.top/api";
=======
var baseurl = 'https://graduation2019.100steps.net/api';
>>>>>>> 41db8ab64e7c717140491722a9f3d947839ea1c0

//ajax拦截器
$.ajaxSetup({
    xhrFields: {
        withCredentials: true    
    },
    statusCode: {
      401: function() {
        
       window.location = "https://graduation2019.100steps.net/auth/jump?redirect=" + encodeURI(window.location.href);
      },
      404:function(){
          
      },
      500:function(){
          alert("后端的锅");
      }
    }
 });

//默认登录
//  $.get("https://test.scut18pie1.top/auth/fake/2",function(data,status,res){ 
// })
