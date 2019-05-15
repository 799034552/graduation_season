(function() {
  var url = location.search;
  if (/debug=true/.test(url)) {
    var hm = document.createElement("script");
    hm.src = "https://cdn.bootcss.com/vConsole/3.3.0/vconsole.min.js";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
    hm.onload = function() {
      var hm = document.createElement("script");
      hm.innerHTML = "var vConsole = new VConsole();"
      var s = document.getElementsByTagName("script")[1];
      s.parentNode.insertBefore(hm, s);
    }
  }
})();

var baseurl = 'https://graduation2019.100steps.net/api';
//var baseurl = "https://test.scut18pie1.top/api";

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
          console.log("后端的锅");
      }
    }
 });

//默认登录
//  $.get("https://graduation2019.100steps.net/auth/fake/2",function(data,status,res){ 
// })
