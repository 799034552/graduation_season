
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
var enterStatus = undefined; //0 不是扫码进来的  1扫码新用户 2扫码老用户
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
        title:'sss',
        topic: '矮冬瓜',
        goods:22,//点赞数
        heat:{
            id: 12,
            name: 'string',
            avatar: '../../img/S.png'
        },
        
    },
    {
        id: 1,
        topic: '安达市',
        title:'sss',
        goods:22,
        heat:{
            id: 12,
            name: 'string',
            avatar: '../../img/love.svg'
        },
        
    },
    {
        id: 1,
        topic: '切图',
        title:'sss',
        goods:22,
        heat:{
            id: 12,
            name: 'string',
            avatar: '../../img/king2.svg'
        },
        
    },
    {
        id: 1,
        topic: '窃听器',
        title:'sss',
        goods:22,
        heat:{
            id: 12,
            name: 'string',
            avatar: '../../img/king2.svg'
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
var isNew ;//是否是新用户

//初始化
$(function(){
    
    //检测是否是二维码进来的
    var ruleResult = rule.exec(window.location.search);
    if(ruleResult){
        userId = Number(ruleResult[1]);
    } else {
        enterStatus = 0;
    }
    

    //获取用户信息
    $.get(baseurl + '/users',function(data,status,res){
       myData = data;
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
       console.log(enterStatus);
       if(enterStatus === 0 ){
           receiveData = myData;
           initiateAll();
       } else {
           $.get(baseurl + '/users/' + userId,function(da,sta){
               receiveData = da;
               initiateAll();
           })
       }

    })



    document.addEventListener('touchmove', function(e){e.preventDefault()}, false);//禁止微信浏览器下拉
    slideInit();//初始化滑动插件
    pushHistory();//ios后退
    


    //动画结束后删除动画避免复制时干扰
    $('.oneItemBox').on("webkitAnimationEnd",function(){
        this.classList.remove("animate");
    })
    
    //长按拖动事件

    $(".love").on("click",function(e){
        e.stopPropagation();
    })
    $(".hotComment li").on('click',function(e){
        console.log(e)
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
    qrcode.makeCode(baseurl+'/bubble.html?userid='+myData.id);

}
//全部初始化
function initiateAll(){
    refreshTopic();
    hopSearchInit();
    hotCommentInit();
    dragInit();
    if(enterStatus === 0){
        codeInit();
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

//解除拖拽
function cancelDrag(){
    $(".bubbleBox .oneItemBox").off("touchstart");
    $(".bubbleBox .oneItemBox").off("touchmove");
    $(".bubbleBox .oneItemBox").off("touchend");
}
//初始化拖拽
function dragInit(){
        $(".bubbleBox .oneItemBox").on({
        touchstart: function(e){
            console.log(e.touches[0]);
            startLocation[0] = e.touches[0].clientX;
            startLocation[1] = e.touches[0].clientY;
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
                    console.log(beCloned);
                    console.log(beCloned.find(".oneItem")[0].getAttribute("id"))
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
        temp.find(".oneCommentTopic div").html(hotComment[i].topic);
        temp.find(".commentMessage").html(hotComment[i].title);
        temp.find(".love span").html(hotComment[i].goods);
        
    }

}
//添加到我的热搜
function addToMy(){
    mySwiper.detachEvents();
    dragInit();
}
//生成我的专属热搜
function createMy(){

}