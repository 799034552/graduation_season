
var mySwiper;//滑动页面
var timeOutEvent; //检测长按的标志
var startLocation = []; // 开始点击的坐标
var clone;//克隆出来的对象
var beCloned;//被克隆的对象
var isDelete;//是否可以删除移动对象的标识
var isMoving;//是否正在移动
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
var hotSearch = 
    [
        {
            id: 123,
            title: "string",
        },
        {
            id: 123,
            title: "string",
        },
        {
            id: 123,
            title: "string",
        },
        {
            id: 123,
            title: "string",
        },
    ]

var hotComment = 
    [
        {
        id: 1,
        title: '矮冬瓜',
        heat:{
            id: 12,
            name: 'string',
            avatar: '../../img/king2.svg',
            likes:34,
            content:'的撒发二个而噩噩高大的嘎啊打发打发'
        },
        
    },
    {
        id: 1,
        title:'阿尔泰',
        heat:{
            id: 12,
            name: '发',
            avatar: '../../img/king2.svg',
            likes:34,
            content:'是否恢复深V萨特挖'
        },
    },
    {
        id: 1,
        title:'案发前而且',
        heat:{
            id: 12,
            name: 'string',
            avatar: '../../img/king2.svg',
            likes:34,
            content:'爱过对方打电话通话'
        },
    },
    {
        id: 1,
        title:'艾尔群若群',
        heat:{
            id: 12,
            name: 'string',
            avatar: '../../img/king2.svg',
            likes:34,
            content:'迅速放斯嘎尔天'
        },
        
    },
]
var receiveData =     {
    id: 123,
    sex: 'integer(0为女, 1为男)',
    name: 'string',
    avatar: 'string(url)',
    collection:[
        {
            id: 1,
            title: '1111'
        },
        {
            id: 2,
            title: '2222'
        },
        {
            id: 3,
            title: '3333'
        },
        {
            id: 4,
            title: '444'
        },
        {
            id: 5,
            title: '555'
        },
        {
            id: 6,
            title: '666'
        },
        {
            id: 7,
            title: '777'
        },
        {
            id: 8,
            title: '888'
        },
    ]
}
var myData;//用户个人信息

//初始化
$(function(){
    slideInit();//初始化滑动插件
    $(".maxShow").show();
    document.addEventListener('touchmove', function(e){e.preventDefault()}, false);//禁止微信浏览器下拉
    pushHistory();//ios后退

    //检测是否是二维码进来的
    var ruleResult = rule.exec(window.location.search);
    if(ruleResult){
        userId = Number(ruleResult[1]);
    } else {
        enterStatus = 0;
    }
    dragInit();
        // $.ajax({
        //     url:baseurl + "/users/collection",
        //     method:'put',
        //     data:{collection:[1,2,3,4,5,6,7]},
        //     success(){
        //         console.log("ok");
        //     }
        // })
        // $.get("https://test.scut18pie1.top/auth/fake/2",function(data,status,res){
    //获取用户信息
    $.get(baseurl + '/users',function(data,status,res){
        myData = data;
        console.log(data.collection.length)
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

    // })
    //动画结束后删除动画避免复制时干扰
    $('.oneItemBox').on("webkitAnimationEnd",function(){
        this.classList.remove("animate");
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
                // var temp = $(_this).find("span");
                // if(liked === 0){
                //     temp.html(Number(temp.html())+1);
                //     hotComment[index].heat.liked++;
                // } else {
                //     temp.html(Number(temp.html())-1)
                //     hotComment[index].heat.liked--;
                // }
            }
        })
        
        e.stopPropagation();

    });
    //热评的点击
    $(".hotComment").on('click','li',function(){
        goToTopic(hotComment[Number(this.getAttribute("index"))].topic_id);
    });

    //热搜的点击
    $('.hotSearch').on('click','li:not(.hotSearchTitle)',function(){
        goToTopic(this.getAttribute("id"));
    });

        
    

})
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
    for(var i = 0;i<6;i++){
        clearTimeout(timeouts[i]);
    }
    timeouts[0] = setTimeout(function(){$(".second").css({'display':'flex'})},500);
    timeouts[1] = setTimeout(function(){$(".first").css({'display':'flex'})},500);
    timeouts[2] = setTimeout(function(){$(".third").css({'display':'flex'})},1000);
    timeouts[3] = setTimeout(function(){$(".forth").css({'display':'flex'})},1500);
    timeouts[4] = setTimeout(function(){$(".five").css({'display':'flex'})},1700);
    timeouts[5] = setTimeout(function(){$(".add").css({'display':'flex'})},2000);
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
    history.pushState(null, null, document.URL);
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
    mySwiper = new Swiper('.swiper-container-h', {
        initialSlide : 1 ,
        on:{
            sliderMove: function(){
                $(".toFirstPage").hide();
                $(".toThirdPage").hide();
              },
              transitionEnd: function(){
                $(".toFirstPage").fadeIn();
                $(".toThirdPage").fadeIn();
              },
        }
        
    })
}
//初始化二维码
function codeInit(){
    var qrcode = new QRCode(document.getElementById("qrcode"), {
        width : 500,
        height : 500
    });
    qrcode.makeCode("https://graduation2019.100steps.net/public/html/bubble?userid=" + myData.id);

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
        }
    } else {
        if(ajaxCount >= 4){
            initiateAll();
        }
    }
    
}

//解除拖拽
function cancelDrag(){
    $(".bubbleBox .oneItemBox").off("touchstart");
    $(".bubbleBox .oneItemBox").off("touchmove");
    $(".bubbleBox .oneItemBox").off("touchend");
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
                console.log("显示");
                $(".deleteBox").addClass("deleteBoxShow");
            },500);

        });
        temp[i].addEventListener("touchmove",function(e){
            if(!isMoving){
                console.log("已清除");
                clearTimeout(timeOutEvent);
            } else {
                if(clone !== 0){
                    var x = e.touches[0].clientX;
                    var y = e.touches[0].clientY;
                    var height = $(".deleteBox").height();
                    clone.css({
                        'transform':'translate(' + (x - startLocation[0]) + 'px,' + (y - startLocation[1]) + 'px)'
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
                    clone.addClass("clone");
                    $(".bubbleBox").append(clone);
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
    console.log($(e).parent(".oneItemBox").css({
        "z-index":'999'
    }));
    setTimeout(function(){
        goToTopic(e.id);
    },1000);
    e.classList.add("myAnimate");
}
//发布话题
function goToAddTopic(){
    window.location = baseurl + addTopicUrl;
}
//刷新话题
function refreshTopic(){
    // if($(".animate").length>0){
    //     return;
    // }
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
    for(var i = 0; i < hotSearch.length;i++){
        var temp = document.createElement("li");
        temp.innerHTML = (i+1)+"、" + hotSearch[i].title;
        temp.setAttribute("id",hotSearch[i].topic_id);
        document.getElementsByClassName("hotSearch")[0].appendChild(temp);
    }
}

//渲染热评榜
function hotCommentInit(){
    $(".hotComment li").hide();
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
    window.location = 'file:///C:/c/bbt/project/graduate/html/bubble/index.html';
}
//添加到我的热搜
function addToMy(){
    reFresh();
    addToMY = true;
    $(".s22Show").show();
    $(".s21Show").hide();
    mySwiper.detachEvents();
}
//添加至我的热搜榜
function  addToHotSearchList(){
    var temp = $(".oneItem:visible");
    var sendData = [];
    var flag = false;
    for(var i = 0;i< temp.length-1;i++){
        sendData.push(Number(temp[i].getAttribute("id")));
    };
    for(var i = 0;i<myData.collection.length;i++){
        flag = false;
        for(var j = 0;j < sendData.length;j++){
            if(sendData[j] === Number(myData.collection[i].topic_id)){
                flag = true;
                break;
            }
        }
        if(!flag){
            sendData.push(Number(myData.collection[i].topic_id));
        }
    }
    $.ajax({
        url:baseurl+'/users/collection',
        method:'PUT',
        data:{collection:sendData},
        success(data,status){
            window.location = myurl;
        }
    })
    console.log(sendData);
    console.log(myData);


}
function backToSecond(){
    reFresh();
    addToMY = false;
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
    for(var i = 0;i<list.length-1;i++){
        sendData += ("topic=" + list[i].getAttribute("id"));
    }
    window.location = baseurl + "??/" + sendData;

}
