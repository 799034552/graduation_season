
var mySwiper;//滑动页面
//点击气泡变大
function change(e){
    if($(e).parents(".animate").length !== 0){
        return;
    }
    setTimeout(function(){
        window.location = "https://www.baidu.com";
    },500);
    e.classList.add("myAnimate");
}

//初始化
$(function(){
    var receiveData = {
        id: 'integer',
        sex: 'integer(0为女, 1为男)',
        name: 'string',
        avatar: 'string(url)',
        collection:[
            {
                id: 'integer',
                title: 'string'
            },
        ]
    };
    var timeOutEvent; //检测长按的标志
    var startLocation = []; // 开始点击的坐标
    var clone;//克隆出来的对象
    var beCloned;//被克隆的对象
    var isDelete;//是否可以删除移动对象的标识
    var isMoving;//是否正在移动
    var rule = /userid=(.+?)(&|#|$)/;//检测是否是二维码进入的正则
    var userId = undefined;
    // var swiperV = new Swiper('.swiper-container-v', {
    //   direction: 'vertical'
    // });


    var ruleResult = rule.exec(window.location.search);
    if(ruleResult){
        userId = Number(ruleResult[1]);
    }

    document.addEventListener('touchmove', function(e){e.preventDefault()}, false);//禁止微信浏览器下拉
    reFresh();//初始动画
    slideInit();//初始化滑动插件
    codeInit();//初始化二维码
    pushHistory();//ios后退

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
        initialSlide : 0 ,
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
        width : 158,
        height : 158
    });
    qrcode.makeCode("http://www.baidu.com");

}