
var mySwiper;//滑动页面
var timeOutEvent; //检测长按的标志
var timeOutEvent2;//热评长按标志
var startLocation = []; // 开始点击的坐标
var clone;//克隆出来的对象
var beCloned;//被克隆的对象
var isDelete;//是否可以删除移动对象的标识
var isMoving;//是否正在移动
var isMoving2 = false;
var rule = /userid=(.+?)(&|#|$|\/)/;//检测是否是二维码进入的正则
var userId = undefined;
var showTopic;  //我的话题
var infoUrl;
var enterStatus = undefined; //0 不是扫码进来的  1扫码新用户 2扫码老用户
var ajaxCount = 0;
var addToMY = false;//添加到我的热搜榜标识
var myurl = "./index.html";
var addTopicUrl = "/??";
var timeouts = [];
var count1 = 0;
var scale = [1,0.9,0.95,1,0.8,0.7];//气泡缩放
var hotSearch ;
var makecount = 100;
var isPageHide;
var hotComment;
var receiveData;
var myData;//用户个人信息
//初始化
$(function(){
    isMoving2 = false;
    window.addEventListener('pageshow', function () {
        if (isPageHide) {
            console.log("qu")
            window.location.reload();
        }
    });
    window.addEventListener('pagehide', function () {
        console.log("qu");
        isPageHide = true;
    });
    $(".hotComment li").hide();
    slideInit();//初始化滑动插件
    if(!localStorage.getItem("old")){
        localStorage.setItem("old","1");
        showStep();
    }
    $(".maxShow").show();
    //pushHistory();//ios后退
    //检测是否是二维码进来的
    var ruleResult = rule.exec(window.location.href);
    console.log(window.location.search);
    if(ruleResult){
        userId = Number(ruleResult[1]);
    } else {
        enterStatus = 0;
    }
    dragInit();
        //  $.get("https://graduation2019.100steps.net/auth/fake/2",function(data,status,res){
    //获取用户信息
    $.get(baseurl + '/users',function(data,status,res){
        myData = data;
        console.log(data);
        // $.ajax({
        //     url:baseurl + "/users/collection",
        //     method:'put',
        //     data:{collection:[]},
        //     success(){
        //         console.log("ok");
        //     }
        // })
        if(myData.collection.length === 0){
            enterStatus = 1;
        } else {
            if(enterStatus === undefined){
                if(myData.id === userId){
                    enterStatus = 0;
                } else {
                    enterStatus = 2;
                }
            }
        }
       console.log("用户的身份是:",enterStatus);
        if(enterStatus === 0 ){
            delInit();
            codeInit();
            receiveData = myData;
        } else {
            if(userId == undefined){
                alert("你没有初始话题，却又不是扫码进来的，帮你跳转到扫码开发者的二维码界面");
                window.location = 'index.html?userid=1';
            }
            $.get(baseurl + '/users/' + userId,function(da,sta){
                console.log(da);
                receiveData = da;
                isOver();
            })
        }
        isOver();
        if(enterStatus == 0){
            userId = myData.id;
        }
         //获取热搜榜
         $.get(baseurl + "/users/" + userId + "/heattopics" ,function(data,status){
             hotSearch = data;
             console.log(data);
             isOver();
         })
         //获取热评榜
         $.get(baseurl + "/users/" + userId + "/heatcomments" ,function(data,status){
             console.log(data);
             hotComment = data;
             isOver();
         })
        })
    })
    
    //删除热搜
    $(".hotSearch").on("click",".del",function(e){
        var temp =  $(".hotSearch li:not(.hotSearchTitle)");
        var temp2 = $(".readyDel");
        console.log(temp,temp2);
        console.log(temp.length - temp2.length);
        if((temp.length - temp2.length) <= 5){
            $(".errorMess").css({
                "display":"none"
            });
            setTimeout(()=>{
                $(".errorMess").css({
                    "display":"block"
                })

            },10);

        } else {
            var index = Number($(this).parent("li")[0].getAttribute("id"));
            $(this).parent("li").addClass("readyDel");
            $.ajax({
                url:baseurl + "/topics/" + index,
                method:"delete",
                success(data){
                    console.log(data);
                }
            })
        }

        
        e.stopPropagation();
    })
    document.getElementsByClassName("picBoxMask")[0].addEventListener("click",function(e){
        if(e.target.id == "two"){
            return;
        }
        isPicShow(0);

    })
    //动画结束后删除动画避免复制时干扰
    $('.oneItemBox').on("webkitAnimationEnd",function(){
        this.classList.remove("animate");
        $(".cancelScrool").removeClass("cancelScrool");
    })
    //点赞
    $(".hotComment").on('click',".love",function(e){
        var index = Number($(this).parent("li")[0].getAttribute("index"));
        var liked = Number(hotComment[index].heat.liked);
        var _this = this;
        console.log(hotComment);
        console.log(liked);
        $.ajax({
            url:baseurl + "/likecomments/" + hotComment[index].heat.comment_id,
            method:"PUT",
            success(data){
                $.get(baseurl + "/users/" + userId + "/heatcomments" ,function(data,status){
                    hotComment = data;
                    hotCommentInit();
                })
            }
        })
        
        e.stopPropagation();
        

    });
    //热评的点击
    $(".hotComment").on('click','li',function(){
        changeUrl(2);
         goToTopic(hotComment[Number(this.getAttribute("index"))].topic_id);
    });

    //热搜的点击
    $('.hotSearch').on('click','li:not(.hotSearchTitle)',function(){
        changeUrl(0);

        if(isMoving2 === false){
            goToTopic(this.getAttribute("id"));
        } else {
            $(this).removeClass("readyDel");
        }
    });

        
    

// })
//刷新泡泡
function reFresh(){
    // if($(".animate").length>0){
    //     return;
    // }
    $(".oneItemBox").removeClass("animate");
    $(".oneItemBox").css({
        'display':'none'
    })
    $(".second")[0].setAttribute("style","dispaly:none")
    $(".oneItemBox").addClass("animate");
    $(".bubbleBox").addClass("cancelScrool");
    for(var i = 0;i<6;i++){
        clearTimeout(timeouts[i]);
    }
    timeouts[0] = setTimeout(function(){$(".second").css({'display':'flex'})},500);
    timeouts[1] = setTimeout(function(){$(".first").css({'display':'flex'})},500);
    timeouts[2] = setTimeout(function(){$(".third").css({'display':'flex'})},1000);
    timeouts[3] = setTimeout(function(){$(".forth").css({'display':'flex'})},1500);
    timeouts[4] = setTimeout(function(){$(".five").css({'display':'flex'})},1700);
    if(!addToMY){
        timeouts[5] = setTimeout(function(){$(".add").css({'display':'flex'})},2000);

    }
    
}

//上一页
function toForward(){
    mySwiper.slidePrev();
}
//下一页
function toNext(){
    mySwiper.slideNext();
}

//显示二维码
function isPicShow(status){
    if(status === 0){
        $(".picBoxMask").fadeOut();
    } else {
        $(".picBoxMask").fadeIn();
    }
}

//ios后退
function pushHistory() {
    //history.pushState(null, null, document.URL);
    window.addEventListener("popstate", function(e) {
        console.log("回退");
        //self.location.reload();
    }, false);
    var state = {
        title : "",
        url : "#"
    };
    window.history.replaceState(state, "", "#");
};

//初始化滑动插件
function slideInit(){
    var ru = /#from=(.+?)($|\/|\#|\&)/
    var from = (ru.exec(window.location.href));
    
    mySwiper1 = new Swiper('.swiper-container1', {
        observer:true,observeParents:true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },

    })
    if(from){
        mySwiper = new Swiper('.swiper-container-h', {
            observer:true,observeParents:true,
            initialSlide : Number(from[1]) ,
            on:{
                sliderMove: function(){
                    $(".toFirstPage").hide();
                    $(".toThirdPage").hide();
                    if(timeOutEvent2){
                        clearTimeout(timeOutEvent2);
                        timeOutEvent2 = 0;
                    }
                  },
                  transitionEnd: function(){
                    $(".toFirstPage").fadeIn();
                    $(".toThirdPage").fadeIn();
                  },
            }
            
        })
    } else {
        mySwiper = new Swiper('.swiper-container-h', {
            initialSlide : 1 ,
            on:{
                sliderMove: function(){
                    $(".toFirstPage").hide();
                    $(".toThirdPage").hide();
                    console.log("Eeee");
                    console.log(timeOutEvent2);
                    if(timeOutEvent2){
                        clearTimeout(timeOutEvent2);
                        timeOutEvent2 = 0;
                    }
                  },
                  transitionEnd: function(){
                    $(".toFirstPage").fadeIn();
                    $(".toThirdPage").fadeIn();
                  },
            }
            
        })

    }
    window.history.replaceState("","",window.location.href.replace(/#from.*$/,""));
}
//初始化二维码
function codeInit(){
    var qrcode = new QRCode(document.getElementById("qrcode"), {
        text:"https://graduation2019.100steps.net/public/html/bubble?userid=" + myData.id,
        width : 300,
        height : 300,
        correctLevel : QRCode.CorrectLevel.H,
    });
    document.getElementById("qrcode").lastChild.onload = function () {
        // console.log(document.getElementById("qrcode").lastChild.src)
        drawAndShareImage();
    }
    drawAndShareImage();
    function drawAndShareImage() {
            var myImage = new Image();
            myImage.src = "../../img/two.jpg";    
            myImage.crossOrigin = "anonymous";
            myImage.onload = function () {
                console.log(this.height,this.width);
                var wid1 = 400;
                var hei1 = 900;
                var canvas = document.createElement("canvas"); 
                canvas.width = this.width;
                canvas.height = this.height;
                var context = canvas.getContext("2d");
                context.rect(0, 0, canvas.width, canvas.height);
                context.fillStyle = "#fff";
                context.fill();
                context.drawImage(myImage, 0, 0, this.width, this.height);
                myImage2 = $('#qrcode').find('img')[0];
                if(myImage2.src == ""){
                    setTimeout(function(){
                        if(makecount--){
                            drawAndShareImage();
                        }
                    },500);
                } else {
                    myImage2.crossOrigin = "anonymous";
                    console.log(myImage,myImage2);
                    context.drawImage(myImage2, wid1, hei1, 300, 300);
                    var base64 = canvas.toDataURL("image/jpg");  
                    var img = document.getElementById('two');
                        document.getElementById('two').src = base64;
                    img.setAttribute('src', base64);
                }


            }
        }
}

//全部初始化
function initiateAll(){
    refreshTopic();
    hopSearchInit();
    hotCommentInit();
    
    
    if(enterStatus === 0){
        $(".s2Show").hide();
        $(".s1Show").hide();
        $(".s0Show").show();
        
    } else if(enterStatus === 1){
        $(".s2Show").hide();
        $(".s1Show").show();
        $(".s0Show").hide();
    } else {
        $(".s1Show").hide();
        $(".s0Show").hide();
        $(".s2Show").show();
    }
}
//判断是否完成ajax
function isOver(){
    ajaxCount++;
    if(enterStatus === 0){
        if(ajaxCount >= 3){
            initiateAll();
            $(".tool").css({
                "display":'flex',
                "opacity":"1",
            });
        }
    } else {
        if(ajaxCount >= 4){
            initiateAll();
            $(".tool").css({
                "display":'flex',
                "opacity":"1",
            });
        }
    }
    
}

//解除拖拽
function cancelDrag(){
    $(".bubbleBox .oneItemBox").off("touchstart");
    $(".bubbleBox .oneItemBox").off("touchmove");
    $(".bubbleBox .oneItemBox").off("touchend");
}
//删除话题的长按
function delInit(){
    var temp = document.getElementsByClassName("hotSearch")[0];
    temp.addEventListener("touchstart",function(e){
        timeOutEvent2 = setTimeout(function(){
            isMoving2 = true;
            timeOutEvent2 = 0;
            $(".del").fadeIn();
            mySwiper.detachEvents();
            window.history.pushState("","",window.location.href);
            window.addEventListener("popstate",function(){
                mySwiper.attachEvents();
                
                isMoving2 = false;
                console.log("back");
                $(".del").fadeOut();
                changeUrl(0);
                reFreshButCom();
            })
        },500);
    });
    temp.addEventListener("touchmove",function(e){
        if(timeOutEvent2){
            clearTimeout(timeOutEvent2);
            timeOutEvent2 = 0;
        } else {
        }
    })
    temp.addEventListener("touchend",function(e){
        if(timeOutEvent2){ 
            clearTimeout(timeOutEvent2);
            timeOutEvent2 = 0;
        } 
    })


}
//初始化拖拽
function dragInit(){
    var temp = document.getElementsByClassName("oneItemBox");
    console.log(temp.length);
    for(var i = 0;i<temp.length;i++){
        temp[i].addEventListener("touchstart",function(e){
            console.log(this);
            startLocation[0] = e.touches[0].clientX;
            startLocation[1] = e.touches[0].clientY;
            clone = 0;
            isMoving = false;
            if($(e.target).parents(".oneItemBox").hasClass("add")){
                return;
            }
            timeOutEvent = setTimeout(function(){
                timeOutEvent = 0;
                isMoving = true;
                
                $(e.target).parents(".oneItemBox").addClass("beCloned");
                $(".deleteBox").addClass("deleteBoxShow");
            },500);

        });
        temp[i].addEventListener("touchmove",function(e){
            if(!isMoving){
                clearTimeout(timeOutEvent);
            } else {
                if(clone !== 0){
                    var x = e.touches[0].clientX;
                    var y = e.touches[0].clientY;
                    var height = $(".deleteBox").height();
                    var sa = scale[Number(clone[0].getAttribute("index"))];
                    clone.css({
                        'transform':'translate(' + (x - startLocation[0]) + 'px,' + (y - startLocation[1]) + 'px) ' + "scale(" + sa +")"
                    })
                    if(height > y){
                        $(".deleteBox").addClass("deleteBoxActive");
                        isDelete = true;

                    } else {
                        $(".deleteBoxActive").removeClass("deleteBoxActive");
                        isDelete = false;
                    }
                } else {
                    beCloned = $(e.target).parents(".oneItemBox");
                    clone = beCloned.clone(true);
                    console.log(clone[0].style);
                    clone.addClass("clone");
                    $(".bubbleBox").append(clone);
                    console.log(clone[0].style.transform);
                }
                e.stopPropagation();
                e.preventDefault();

            }
        })
        temp[i].addEventListener("touchend",function(e){
            if(timeOutEvent!=0){ 
                clearTimeout(timeOutEvent);
            } 
            if(clone !== 0){
                clone.remove();
                if(isDelete){
                    beCloned.css({
                        'display':'none'
                    })
                    if(!addToMY){
                        var index = (beCloned.find(".oneItem")[0].getAttribute("id"));
                        var temp = getAnother(index);
                        console.log(temp);
                        if(temp !== false){
                            $(beCloned).find(".oneItem")[0].setAttribute("id",receiveData.collection[temp].topic_id);
                            $(beCloned).find(".message").html(receiveData.collection[temp].title);
                        }

                        setTimeout(function(){
                            beCloned.addClass("animate");
                            beCloned.css({
                                'display':'flex',
                            })
                        },500);

                    }
                }
            }
            $(".deleteBoxShow").removeClass("deleteBoxShow");
            $(".deleteBox").removeClass("deleteBoxActive");
            $(".beCloned").removeClass("beCloned");


        })
    }
}

//随机数值中返回5个
function getFiveTop(collection){
    var i = 0,result = [],temp = [],flag = false,count = 0;
    //生成5个不同的随机数
    while(i < 5){
        if(count++ > 50000){
            break;
            
        }
        flag = false;
        temp [i] = Math.floor(Math.random()*collection.length);
        for(var j = 0;j<i;j++){
            if(temp[j] === temp[i]){
                flag = true;
                break;
            }

        }
        if(!flag){
            i++;
        }
    }
    for(var j = 0;j<i;j++){
        result.push(collection[temp[j]]);
    }
    return result;
}
//点击气泡变大
function change(e){
    if($(e).parents(".animate").length !== 0){
        return;
    }
    $(e).parent(".oneItemBox").css({
        "z-index":'999'
    });
    $(".bubbleBox").css({
        "z-index":"300"
    })
    // $(".toThirdPage").css({
    //     "z-index":"0"
    // })
    // $(".toFirstPage").css({
    //     "z-index":"0"
    // })
    setTimeout(function(){
        changeUrl(1);
        goToTopic(e.id);
    },1000);
    e.classList.add("myAnimate");
}
//发布话题
function goToAddTopic(){
    window.location = baseurl + addTopicUrl;
}
function refreshTopic(){
    showTopic =  getFiveTop(receiveData.collection);
    var temp = document.getElementsByClassName("oneItem");
    console.log(showTopic);
    for(var i = 0;i < 5;i++){
        temp[i].getElementsByClassName("message")[0].innerHTML = showTopic[i].title;
        temp[i].getElementsByClassName("message")[0].parentNode.setAttribute("id",showTopic[i].topic_id);
    }
    reFresh();

}

//渲染热搜榜
function hopSearchInit(){
    $(".hotSearch li:not(.hotSearchTitle)").remove();
    console.log("hotinit");
    for(var i = 0; i < hotSearch.length;i++){
        var temp = document.createElement("li");
        $(temp).append("<div><img src = '../../img/fire.png'>" + hotSearch[i].title + "</div>");
        $(temp).append("<img class = 'del' src = '../../img/delete.svg'>");
        temp.setAttribute("id",hotSearch[i].topic_id);
        document.getElementsByClassName("hotSearch")[0].appendChild(temp);
    }
}

//渲染热评榜
function hotCommentInit(){
    $(".hotComment li").hide();
    if(hotComment.length === 0){
        $(".haveNoCom").css({
            "display":'flex'
        })
    }
    for(var i = 0 ;i<hotComment.length;i++){
        var temp;

            if(i === 0){
                temp = $(".king1");
                temp.show();
            } else if(i === 1){
                temp = $(".king2");
                temp.show();
            } else if(i === 2){
                temp = $(".king3");
                temp.show();
            } else {
                var cl = $(".template").clone(true);
                temp = $(cl[0]);
                temp.show();
                $(".hotComment").append(temp);
            }
            temp[0].setAttribute("index",i);
            temp.children(".selfImg").attr("src",hotComment[i].heat.avatar);
            temp.find(".oneCommentTopic div").html(hotComment[i].title);
            temp.find(".commentMessage").html(hotComment[i].heat.content);
            temp.find(".love span").html(hotComment[i].heat.likes);
    }
}
function goToMy(){
    window.location = "./index.html";
}
//添加到我的热搜
function addToMy(){
    addToMY = true;
    reFresh();
    $(".s22Show").show();
    $(".s21Show").hide();
    mySwiper.detachEvents();
}
//添加到我的热搜榜
function  addToHotSearchList(){
    var temp = $(".oneItem:visible");
    var sendData = [];
    var sendData2 = [];
    var flag = false;
    for(var i = 0;i< temp.length;i++){
        var id = (Number(temp[i].getAttribute("id")));
        for(var j = 0;j<hotSearch.length;j++){
            if(id === Number(hotSearch[j].topic_id)){
                sendData2.push(hotSearch[j].title);
            }
        }
    };

    for(var i = 0;i<myData.collection.length;i++){
        flag = false;
        for(var j = 0;j < sendData2.length;j++){
            var a = sendData2[j].replace(/&/g,'&amp;');
            a = a.replace(/'/g,"&apos;");
            a = a.replace(/"/g,"&quot;");
            a = a.replace(/</g,"&lt;");
            a = a.replace(/>/g,"&gt;");
            if(a === myData.collection[i].title){
                sendData2[j] = "";
                continue;
            }
        }
    }
    sendData2 = sendData2.filter(function(item){
        return item !== "";
    })
    count1 = sendData2.length;
    for(var i = 0;i<sendData2.length;i++){
        $.ajax({
            url:baseurl + "/topics",
            method:'POST',
            headers:{
                 "Content-Type":"application/json"
            },
            data:JSON.stringify({
                target_id:myData.id,
                list:[
                    {
                        title:sendData2[i],
                        content: ""
                    }
                ]
            }),
            success(){
                count1--;
                if(count1 === 0){
                    $("#reply_success").fadeIn("fast");
                    setTimeout(function(){
                        $("#reply_success").fadeOut("fast");
                        window.location = "./index.html";
                    },300);
                    
                }
            }
        })
    }

    console.log(sendData2);
    console.log(myData);

}
function backToSecond(){
    addToMY = false;
    reFresh();
    
    $(".s22Show").hide();
    $(".s21Show").show();
    $(".deleteBox").removeClass("deleteBoxShow");
    mySwiper.attachEvents();

}

//跳转页面
function goToTopic(id){
    window.location = "../detail.html?id=" + id;
}
//再随机取一个
function getAnother(id){
    var count = 0;
    if(receiveData.collection.length <= 5){
        return false;
    }
    while(count++ < 50000){
        var rand = Math.floor(Math.random()*receiveData.collection.length);
        var flag = false,temp;

        for(var i = 0 ;i<showTopic.length;i++){
            if(Number(showTopic[i].topic_id) === Number(id)){
                temp = i;
            }
            if(showTopic[i].topic_id === receiveData.collection[rand].topic_id){
                flag = true;
                break;
            }
        }
        if(!flag){
            showTopic[temp] = receiveData.collection[rand];
            return rand;
        }
    }
    return false;
}
//生成我的专属热搜
function createMy(){
    var sendData = [];
    var list = $(".oneItem");
    for(var i = 0;i<list.length-2;i++){
        sendData += ("topic_id=" + list[i].getAttribute("id") + "&");
    }
    sendData += ("topic_id=" + list[i].getAttribute("id"));
    window.location = "../start.html?" + sendData;

}
function addother(){
    console.log(userId);
    window.location = "../newtopic.html?id=" + userId;
}

function initiate(){
    window.history.pushState("","","#");
      if (window.history && window.history.pushState) {
          $(window).on('popstate', function () {
              var i = 100;
              while(i--){
               // window.history.back(1);
              }
            window.history.forward(1);

          });
      }
  
  }
  function hideTwo(e){
      if(e.target.id === "two"){
          console.log("Ddd");
      }

  }
  function changeUrl(target){
    window.history.replaceState("","",window.location.href + ("#from=" + target));
  }



  function comfireDel(){
      var de = $(".readyDel");
      for(var i = 0 ;i<de.length;i++){
          console.log(de[i].getAttribute("id"));
          $.ajax({
              url:baseurl + "/topics/" + Number(de[i].getAttribute("id")),
              method:"delete",
              success(data){
                  console.log(data);
              }

          })
      }

  }


  function reFreshButCom(){
      var icount = 0;
    $.get(baseurl + '/users',function(data,status,res){
        myData = data;
        if(enterStatus === 0 ){
            receiveData = myData;
        }
        if(enterStatus == 0){
            userId = myData.id;
        }
         //获取热搜榜
         $.get(baseurl + "/users/" + userId + "/heattopics" ,function(data,status){
             hotSearch = data;
             icount++;
             if(icount === 2){
                hotCommentInit();
                refreshTopic();
             }
         })
         //获取热评榜
         $.get(baseurl + "/users/" + userId + "/heatcomments" ,function(data,status){
             hotComment = data;
             icount++;
             if(icount === 2){
                hotCommentInit();
                refreshTopic();
             }
         })
        })
  }
  function showStep() {
    $('#step').show();
    $('#step .content').fadeIn();
    $(".toThirdPage, .toFirstPage, #showStep").hide();
    mySwiper1.slideTo(0);
    mySwiper.detachEvents();
    $(".tool").css({
        "display":"none"
    })
}
function hideStep() {
    $('#step .content').hide();
    $('#step').hide();
    $(".toThirdPage, .toFirstPage, #showStep").show();
    mySwiper.attachEvents();

    $(".tool").css({
        "display":"flex"
    })
}


