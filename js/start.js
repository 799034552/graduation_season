$(document).ready(function () {
    var i = 0;
    $("body").delegate(".topic", "click", function () {
            var color = $(this).css('background-color');
            console.log(color);
            // if(color == 'rgb(255, 255, 255)'&&i==5){
            //     alert("只能选五个哦");
            // }
            // 改变选中的主题的样式
            if (color == 'rgb(255, 255, 255)'&&i<5) {
                $(this).css('background-color', 'rgb(126, 125, 125)');
                $(this).find('.chosen').text('1');//判定被选中的元素
                i += 1;
                console.log(i);
            }
            else if(color == 'rgb(126, 125, 125)'){
                $(this).css('background-color', 'white');
                $(this).find('.chosen').text('0');
                i -= 1;
                console.log(i);
            }
            //更改button的样式
            if(i==5){
                $('.choiceButton button').css('background-color', '#1b6aaa');
                $('.choiceButton button').css('color', 'white');
                $('.choiceButton button').text('选好啦');
            }else{
                $('.choiceButton button').css('background-color', 'rgb(179, 178, 178)');
                $('.choiceButton button').css('color', 'gray');
                $('.choiceButton button').text('选择五个话题');
            }
    })
    $('.button button').click(function(){
        $('.background').css('display','none');
        $('.bgchoiceTopic').css('display','block');
    })
    // $('.choiceButton button').click(function(){
    //     if(i!=5){
    //         alert("要选择5个哦");
    //     }
    // })

})