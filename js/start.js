$(document).ready(function () {
    var url = location.search; //获取泡泡页传过来的参数 
    // var url = '?id=20&id=2&id=6&id=7&id=8'
    if (url != '') {
        var topic_id = new Array();
        var args = {};
        var query = url;
        var pairs = query.split("&");
        for (var i = 0; i < pairs.length; i++) {
            var pos = pairs[i].indexOf("=");
            if (pos == -1) continue;
            var name = pairs[i].substring(0, pos);
            var value = pairs[i].substring(pos + 1);
            value = decodeURIComponent(value);
            args[name] = value;
            topic_id[i] = value;
        }


     
        // alert(topic_id[1]);
        // $.ajax({
        //     type: "get",
        //     url: baseurl + '/topics',
        //     data:
        //         [
        //             { "id": topic_id[0] },
        //             { "id": topic_id[1] },
        //             { "id": topic_id[2] },
        //             { "id": topic_id[3] },
        //             { "id": topic_id[4] },
        //         ],
        //     success: function (data) {
        //         for (i = 0; i < 5; i++) {
        //             $('.choice').append(
        //                 '<div class="topic show">' +
        //                 '<div>' +
        //                 '<img class="topicimg" src="../img/topic.png" alt="new">' +
        //                 '<img class="fireimg" src="../img/fire.png" alt="">' +
        //                 '<p>' + data[i].title + '</p>' +
        //                 '</div>' +
        //                 '</div>'
        //             )
        //         }
        //     },
        //     error: function () {

        //     }
        // })

        $.ajax({//获取topic
            type: "get",
            url: baseurl + '/topics',
            data: { id: topic_id[0] },
            success: function (data) {
                alert('a');
                $('.choice').append(
                    '<div class="topic show">' +
                    '<div>' +
                    '<img class="topicimg" src="../img/topic.png" alt="new">' +
                    '<img class="fireimg" src="../img/fire.png" alt="">' +
                    '<p>' + data.title + '</p>' +
                    '</div>' +
                    '</div>'
                )
                $.ajax({
                    type: "get",
                    url: baseurl + '/topics',
                    data: { id: topic_id[1] },
                    success: function (data) {
                        $('.choice').append(
                            '<div class="topic show">' +
                            '<div>' +
                            '<img class="topicimg" src="../img/topic.png" alt="new">' +
                            '<img class="fireimg" src="../img/fire.png" alt="">' +
                            '<p>' + data.title + '</p>' +
                            '</div>' +
                            '</div>'
                        )
                        $.ajax({
                            type: "get",
                            url: baseurl + '/topics',
                            data: { id: topic_id[2] },
                            success: function (data) {
                                $('.choice').append(
                                    '<div class="topic show">' +
                                    '<div>' +
                                    '<img class="topicimg" src="../img/topic.png" alt="new">' +
                                    '<img class="fireimg" src="../img/fire.png" alt="">' +
                                    '<p>' + data.title + '</p>' +
                                    '</div>' +
                                    '</div>'
                                )
                                $.ajax({
                                    type: "get",
                                    url: baseurl + '/topics',
                                    data: { id: topic_id[3] },
                                    success: function (data) {
                                        $('.choice').append(
                                            '<div class="topic show">' +
                                            '<div>' +
                                            '<img class="topicimg" src="../img/topic.png" alt="new">' +
                                            '<img class="fireimg" src="../img/fire.png" alt="">' +
                                            '<p>' + data.title + '</p>' +
                                            '</div>' +
                                            '</div>'
                                        )
                                        $.ajax({
                                            type: "get",
                                            url: baseurl + '/topics',
                                            data: { id: topic_id[4] },
                                            success: function (data) {
                                                $('.choice').append(
                                                    '<div class="topic show">' +
                                                    '<div>' +
                                                    '<img class="topicimg" src="../img/topic.png" alt="new">' +
                                                    '<img class="fireimg" src="../img/fire.png" alt="">' +
                                                    '<p>' + data.title + '</p>' +
                                                    '</div>' +
                                                    '</div>'
                                                )
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            },
            error: function () {
                // alert('失败了呢');
            }

        })
    }

    //获取微信昵称
       $.ajax({
        type: 'get',
        url: baseurl + '/users',
        success: function (data, status) {
            // alert('a');
            if (url == '') {
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
            $('.choiceButton button').css('color', 'gray');
        }
    })

    $('.choiceButton').click(function () {
        var list = $('.userChoiced').children();
        var topic_comment = new Array();
        if (list.length == 5) {
            topic_comment[0] = $('.userChoiced div:nth-child(1) p').text();
            topic_comment[1] = $('.userChoiced div:nth-child(2) p').text();
            topic_comment[2] = $('.userChoiced div:nth-child(3) p').text();
            topic_comment[3] = $('.userChoiced div:nth-child(4) p').text();
            topic_comment[4] = $('.userChoiced div:nth-child(5) p').text();
            var user_id = $('.user_id').text();
            // $.ajax({
            //     type: 'post',
            //     url: baseurl + '/topics',
            //     data:
            //         [
            //             {
            //                 title: topic_comment[0],
            //                 target_id: user_id,
            //             },
            //             {
            //                 title: topic_comment[1],
            //                 target_id: user_id
            //             },
            //             {
            //                 title: topic_comment[2],
            //                 target_id: user_id
            //             },
            //             {
            //                 title: topic_comment[3],
            //                 target_id: user_id
            //             },
            //             {
            //                 title: topic_comment[4],
            //                 target_id: user_id
            //             },
            //         ],
            //     success: function (data, status) {
            //         window.location.href = "bubble/index.html";

            //     },
            //     error: function (data) {
            //         alert('请求失败');
            //     }

            // })
            $.ajax({
                type: "post",
                url: baseurl + '/topics',
                data: {
                    title: topic_comment[0],
                    target_id: user_id,
                },
                success: function () {
                    $.ajax({
                        type: "post",
                        url: baseurl + '/topics',
                        data: {
                            title: topic_comment[1],
                            target_id: user_id,
                        },
                        success: function () {
                            $.ajax({
                                type: "post",
                                url: baseurl + '/topics',
                                data: {
                                    title: topic_comment[2],
                                    target_id: user_id,
                                },
                                success: function () {
                                    $.ajax({
                                        type: "post",
                                        url: baseurl + '/topics',
                                        data: {
                                            title: topic_comment[3],
                                            target_id: user_id,
                                        },
                                        success: function () {
                                            $.ajax({
                                                type: "post",
                                                url: baseurl + '/topics',
                                                data: {
                                                    title: topic_comment[4],
                                                    target_id: user_id,
                                                },
                                                success: function () {
                                                    window.location.href = "bubble/index.html";
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })

        }
    })
})

