
var mySwiper;//滑动页面
var timeOutEvent; //检测长按的标志
var startLocation = []; // 开始点击的坐标
var clone;//克隆出来的对象
var beCloned;//被克隆的对象
var isDelete;//是否可以删除移动对象的标识
var isMoving;//是否正在移动
var rule = /userid=(.+?)(&|#|$)/;//检测是否是二维码进入的正则
var userId = undefined;
var showTopic;  //我的话题
var infoUrl;
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
        "id": 1,
        "title": 'string',
        "heat":{
            "id": 12,
            "name": 'string',
            "avatar": '../img/king2.svg'
        }
    }
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

//ajax拦截器
$.ajaxSetup({
    contentType:"application/x-www-form-urlencoded;charset=utf-8",
    statusCode: {
     200:function(data,status,res){
         console.log("ok");
     },
      404: function(a,b,c) {
          alert('数据获取/输入失败，没有此服务。404');
      },
      504: function() {
          alert('数据获取/输入失败，服务器没有响应。504');
      },
      500: function() {
          alert('服务器有误。500');
      }
    }
 });
//初始化
$(function(){


    //检测是否是二维码进来的
    var ruleResult = rule.exec(window.location.search);
    if(ruleResult){
        userId = Number(ruleResult[1]);
    }
    if(userId){
        infoUrl = baseurl + "/users/"+userId;
    } else {
        infoUrl = baseurl + "/users";
    }

    //获取用户信息
    // $.get('http://localhost:3000/users',function(data,status,res){
    //     receiveData = data;

    // })
    if(userId == receiveData.id){
        userId = undefined;
    }
    if(userId){ //不是本人
        console.log("不是本人")
    } else {   //是本人
        console.log("本人");
        refreshTopic();
        hopSearchInit();
    }


    document.addEventListener('touchmove', function(e){e.preventDefault()}, false);//禁止微信浏览器下拉
    slideInit();//初始化滑动插件
    pushHistory();//ios后退
    codeInit();


    //动画结束后删除动画避免复制时干扰
    $('.oneItemBox').on("webkitAnimationEnd",function(){
        this.classList.remove("animate");
    })
    
    //长按拖动事件
    $(".bubbleBox .oneItemBox").on({
        touchstart: function(e){
            console.log(e.touches[0]);
            startLocation[0] = e.touches[0].clientX;
            startLocation[1] = e.touches[0].clientY;
            console.log("start");
            clone = 0;
            isMoving = false;
            if($(e.target).parents(".oneItemBox").hasClass("add")){
                return;
            }
            timeOutEvent = setTimeout(function(){
                isMoving = true;
                console.log("ok");
                $(e.target).parents(".oneItemBox").addClass("beCloned");
                $(".deleteBox").addClass("deleteBoxShow");
            },500);
        },
        touchmove: function(e){
            if(!isMoving){
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
        },
        touchend: function(e){
            if(timeOutEvent!=0){ 
                clearTimeout(timeOutEvent);
            } 
            if(clone !== 0){
                clone.remove();
                if(isDelete){
                    beCloned.css({
                        'display':'none'
                    })
                    setTimeout(function(){
                        beCloned.addClass("animate");
                        beCloned.css({
                            'display':'flex',
                        })

                    },500);
                }
            }
            $(".deleteBoxShow").removeClass("deleteBoxShow");
            $(".deleteBox").removeClass("deleteBoxActive");
            $(".beCloned").removeClass("beCloned");
        }
    })
})
//刷新泡泡
function reFresh(){
    if($(".animate").length>0){
        return;
    }
    $(".oneItemBox").addClass("animate").css({
        'display':'none'
    })
    setTimeout(function(){$(".second").css({'display':'flex'})},0);
    setTimeout(function(){$(".first").css({'display':'flex'})},500);
    setTimeout(function(){$(".third").css({'display':'flex'})},1000);
    setTimeout(function(){$(".forth").css({'display':'flex'})},1500);
    setTimeout(function(){$(".five").css({'display':'flex'})},1700);
    setTimeout(function(){$(".add").css({'display':'flex'})},2000);
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
    window.addEventListener("popstate", function(e) {
        self.location.reload();
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
              slideChangeTransitionEnd: function(){
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
    qrcode.makeCode(baseurl+'/bubble.html?userid='+receiveData);

}

//随机数值中返回5个
function getFiveTop(collection){
    var i = 0,result = [],temp = [],flag = false;
    //生成5个不同的随机数
    while(i < 5){
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
    setTimeout(function(){
        window.location = "https://www.baidu.com?id="+e.id;
    },500);
    e.classList.add("myAnimate");
}
//刷新话题
function refreshTopic(){
    if($(".animate").length>0){
        return;
    }
    var showTopic =  getFiveTop(receiveData.collection);
    var temp = document.getElementsByClassName("oneItem");
    
    for(var i = 0;i < 5;i++){
        temp[i].getElementsByClassName("message")[0].innerHTML = showTopic[i].title;
        temp[i].getElementsByClassName("message")[0].parentNode.setAttribute("id",showTopic[i].id);
    }
    reFresh();

}

//渲染热搜榜
function hopSearchInit(){
    $(".hotSearch li:not(.hotSearchTitle)").remove();
    for(var i = 0; i < hotSearch.length;i++){
        var temp = document.createElement("li");
        temp.innerHTML = (i+1)+"、" + hotSearch[i].title;
        temp.setAttribute("index",i);
        document.getElementsByClassName("hotSearch")[0].appendChild(temp);
    }
}

//渲染热评榜
function hotComment(){
    $("hotComment li").hide();
    for(var i = 0 ;i<hotComment.length;i++){
        if(i === 0){
            var temp = $(".king1");
            temp.show();


        }
    }

}