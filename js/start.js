$(document).ready(function () {
    var url = location.search; //获取泡泡页传过来的参数 
    // var url = '?id=150&id=2&id=6&id=7&id=8'
        var topic_id = new Array();
    var topic_id_index = 0
    if (url != '') {
        var args = {};
        var  query = url.replace('?', '');
        var pairs = query.split("&");
        for (var i = 0; i < pairs.length; i++) {
            var pos = pairs[i].indexOf("=");
            if (pos == -1) continue;
            var name = pairs[i].substring(0, pos);
            var value = pairs[i].substring(pos + 1);
            value = decodeURIComponent(value);
            if (name != 'id') continue;
            args[name] = value;
            topic_id[i] = value;
        }
    //生成我的专属热搜，添加泡泡页传来的话题
    function getTopics() {
        $.get(baseurl + "/topics/" + topic_id[topic_id_index++], function (data, status) {
            insertTopic(data.title);
            if (topic_id[topic_id_index]) {
                getTopics();
            }
        })
    }
    if (topic_id[topic_id_index]) {
        getTopics()
    }
    // $.get(baseurl + "/topics/" + topic_id[0], function (data, status) {
    //     insertTopic(data.title)
    //     $.get(baseurl + "/topics/" + topic_id[1], function (data, status) {
    //         insertTopic(data.title)
    //         $.get(baseurl + "/topics/" + topic_id[2], function (data, status) {
    //             insertTopic(data.title)
    //             $.get(baseurl + "/topics/" + topic_id[3], function (data, status) {
    //                 insertTopic(data.title)
    //                 $.get(baseurl + "/topics/" + topic_id[4], function (data, status) {
    //                     insertTopic(data.title)
    //                 })
    //             })
    //         })
    //     })
    // })
    //获取微信昵称
}
    $.ajax({
        type: 'get',
        url: baseurl + '/users',
        success: function (data, status) {
            // alert('a');
            if (!topic_id[topic_id_index]) {
                if (data.collection.length == 0) {
                    var name = data.name;
                    var user_id = data.id;
                    $('.topic span').text(name);
                    $('.user_id').text(user_id);
                }
                else {
                    window.location.href = "bubble/index.html";
                }
            } else {
                var name = data.name;
                $('.topic span').text(name);
                $('.user_id').text(user_id);

            }
        },
        error: function () {

        }
    })

    $('.button button').click(function () {
        $('.background').css('display', 'none');
        $('.bgchoiceTopic').css('display', 'block');
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
        var self = this;//防止多次点击
        this.disabled = true;
        function recover() {
            self.disabled = false;
        }
        setTimeout(recover, 1000);
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
                $('.choiceButton button').css('background-color', 'rgb(246, 184, 102)');
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
            '<img class="topicimg" src="../img/topic.png" alt="new">' +
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
            $('.choiceButton button').css('background-color', 'rgb(249, 208, 155)');
        }
    })

    $('.choiceButton').click(function () {
        var self = this;
        this.disabled = true; //防止多次点击

        var list = $('.userChoiced').children();
        var topic_comment = new Array();
        if (list.length == 5) {
            topic_comment[0] = $('.userChoiced div:nth-child(1) p').text();
            topic_comment[1] = $('.userChoiced div:nth-child(2) p').text();
            topic_comment[2] = $('.userChoiced div:nth-child(3) p').text();
            topic_comment[3] = $('.userChoiced div:nth-child(4) p').text();
            topic_comment[4] = $('.userChoiced div:nth-child(5) p').text();
            var user_id = $('.user_id').text();
            $.ajax({
                type: 'post',
                url: baseurl + '/topics',
                headers:{
                    "Content-Type":"application/json"
                },
                data: JSON.stringify({
                    target_id:user_id,
                    list:[
                        {
                            content:"",
                            title:topic_comment[0],
                        },
                        {
                            content:"",
                            title:topic_comment[1],
                        },
                        {
                            content:"",
                            title:topic_comment[2],
                        },
                        {
                            content:"",
                            title:topic_comment[3],
                        },
                        {
                            content:"",
                            title:topic_comment[4],
                        }
                    ]
                }),
                    
                success: function (data, status) {
                    window.location.href = "bubble/index.html";
                    self.disabled = false; // 恢复禁用
                },
                error: function (data) {
                    alert('发送失败');
                    self.disabled = false; // 恢复禁用
                }
            })

        }
    })
})

function insertTopic(title){
    $('.choice').append(
        '<div class="topic show">' +
        '<div>' +
        '<img class="topicimg" src="../img/topic.png" alt="new">' +
        '<img class="fireimg" src="../img/fire.png" alt="">' +
        '<p>' + title + '</p>' +
        '</div>' +
        '</div>'
    )
}