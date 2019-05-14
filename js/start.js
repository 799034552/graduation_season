$(document).ready(function () { 
    $('.button button').click(function () {
        $('.background').css('display', 'none');
        $('.bgchoiceTopic').css('display', 'block');
    })
    //获取微信昵称
    var name;
        $.ajax({
            type:'get',
            url:baseurl+'/users',
            success:function(data,status){
                name=data.name;
                $('.topic span').text(name);
            },
            error:function(){ 
              
            }
        })
        //引导页面图片滑动
        var mySwiper = new Swiper('.swiper-container', {
        direction: 'horizontal',
        pagination: {
            el: '.swiper-pagination',
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    })
    $('.leading button').click(function () {
        $('.leading').css('display', 'none');
        $('.background').css('display', 'block');
    })

    //选择话题
    $("body").delegate(".topic", "click", function () {
        var content = $(this).find('p').text();
        var topicId = $(this).find('div').find('div').text();
        console.log(topicId);
        console.log(content);
        var list = $('.userChoiced').children();
        console.log(list);
        $('.userChoiced>p').remove();
        if (list.length <= 4) {
            $('.userChoiced').append(//添加话题
                '<div class="show">' +
                '<img class="bg" src="../img/topic.png" alt="">' +
                '<p>' + content + '</p>' +
                '<img class="cross" src="../img/cross.png" alt=""></img>' +
                '<div>' + topicId + '</div>' +
                '</div>'
            );
            if ($(this).hasClass("show")) {
                $(this).removeClass("show");
            }
            $(this).addClass("hide");
            if (list.length == 4) {//改变button的颜色
                $('.choiceButton button').text('选好啦');
                $('.choiceButton button').css('color', 'black');
            }
        }
    })
    $("body").delegate(".cross", "click", function () {//删除话题并在备选话题恢复
        var content1 = $(this).parent().find('p').text();
        var topicId1 = $(this).parent().find('div').text();
        console.log(topicId1);
        $('.choice').append(
            '<div class="topic show">' +
            '<div>' +
            '<img class="topicimg" src="../img/topic.png" alt="">' +
            '<img class="fireimg" src="../img/fire.png" alt="">' +
            '<p>' + content1 + '</p>' +
            '<div>' + topicId1 + '</div>' +
            '</div>' +
            '</div>'
        )
        $(this).parent().remove();
        var list = $('.userChoiced').children();
        if (list.length == 0) {
            $('.userChoiced').append(
                ' <p>空空如也~快选些话题吧~</p>'
            )
        }
        if (list.length <= 4) {//改变button的文字
            $('.choiceButton button').text('选择五个话题');
            $('.choiceButton button').css('color', 'gray');
        }
    })

    //传输话题id
    $('.choiceButton').click(function () {
        var list = $('.userChoiced').children();
        if (list.length == 5) {
            var topic_id1 = $('.userChoiced div:nth-child(1) div').text();
            var topic_id2 = $('.userChoiced div:nth-child(2) div').text();
            var topic_id3 = $('.userChoiced div:nth-child(3) div').text();
            var topic_id4 = $('.userChoiced div:nth-child(4) div').text();
            var topic_id5 = $('.userChoiced div:nth-child(5) div').text();
            console.log(topic_id1);
            console.log(topic_id2);
            console.log(topic_id3);
            console.log(topic_id4);
            console.log(topic_id5);
            $.ajax({
                type:'put',
                url:baseurl+'/users/collection',
                data:{
                    "collection":[topic_id1,topic_id2,topic_id3,topic_id4,topic_id5]
                },
                success:function(data,status){
                   window.location.href = "bubble/index.html";
                //    window.location.href = "https://graduation2019.100steps.net/auth/jump";

                },
                error:function(result){ 
                   alert('请求用户信息失败');
                }
            })
        }
    })
})

