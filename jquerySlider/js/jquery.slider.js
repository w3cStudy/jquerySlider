/**
 * Created by lyh on 2017/3/29.
 */
(function ($) {
    $.fn.slideBox = function (options) {
        var defaults = {
            direction: 'left',//left,top
            duration: 0.6,//unit:seconds
            easing: 'swing',//swing,linear
            delay: 3,//unit:seconds
            startIndex: 0,
            hideClickBar: true,
            clickBarRadius: 5,//unit:px
            hideBottomBar: false,
            width: null,
            height: null
        };

        var settings = $.extend(defaults, options || {});
        var wrapper = $(this), $ul = wrapper.children('ul.items'), $lis = $ul.find("li"), $firstPic = $lis.first().find('img');
        var li_num = $lis.size(), li_height = 0, li_width = 0;
        var order_by = 'ASC';
        var init = function () {
            li_height = settings.height ? settings.height : $lis.first().height();
            li_width = settings.width ? settings.width : $lis.first().height();
            //$lis.css({})
            wrapper.css({width: li_width + 'px', height: li_height + 'px'});
            $lis.css({width: li_width + 'px', height: li_height + 'px'});
            if (settings.direction == 'left') {
                $ul.css({height: li_height + 'px', width: li_width * li_num + 'px'});
            } else {
                $ul.css({height: li_height * li_num + 'px', width: li_width});
            }

            $ul.find('li:eq('+settings.startIndex+')').addClass("active");
            if (settings.hideBottomBar) {
                var tips = $(' <div class="tips"></div>').css('opacity',0.6).appendTo(wrapper);
                var title=$('<div class="title"></div>').html(function () {
                    var active=$ul.find('li.active').find('a'),text=active.attr('title'),href=active.attr('href');
                    return $('<a></a>').attr('href',href).text(text);
                }).appendTo(tips);

                var  nums=$('<div class="nums"></div>').hide().appendTo(wrapper);
                $lis.each(function (index,ele) {
                    var a=$(this).find(a),text=a.attr('title'),href=a.attr('href'),css='';
                    i==settings.startIndex&&(css='active');
                    $('<a></a>').attr('href',href).text(text).addClass(css).css('borderRadius',settings.borderRadius+'px').mouseover(function(){
                           $(this).addcss('active').sibling().removeClass('active');
                            start();
                            stop();
                    }).appendTo(nums);

                })

                if(settings.hideClickBar){
                    tips.hover(function () {
                        nums.animated({top:'0px'},'fast');
                    },function () {
                        nums.animated({top:tips.height+'px'},'fast');
                    })
                }else{
                    nums.show();
                }
            }
            $lis.size()>1&&start();
        }
        
        var start=function () {
            var active=$ul.find('li.active'),active_a=active.find('a');
            var index=active.index();
            if(settings.direction=='left'){
               offset=li_width*index*-1;
                param={'left':offset+'px'};
            }else{
                offset=li_height*index*-1;
                param={'top':offset+'px'};
            }
            debugger;
            wrapper.find('.nums').find('a:eq('+index+')').addClass('active').siblings().removeClass('active');
            wrapper.find('.title').find('a').attr('href',active_a.attr('href')).text(active_a.attr('title'));
           // ul.animated(param)
            $ul.stop().animate(param,settings.duration*1000,settings.easing,function () {
                active.removeClass('active');
                if(order_by=='ASC'){
                    if(active.next().size()){
                        active.next().addClass('active');
                    }else{
                        order_by='DESC';
                        active.prev().addClass('active');
                    }
                }else if(order_by=='DESC'){
                    if(active.prev().size()){
                        active.prev().addClass('active');
                    }else{
                        order_by='ASC';
                        active.next().addcss('active');
                    }
                }
            })

            wrapper.data('timeid',window.setTimeout(start,settings.delay*1000));
        }
        
        var stop=function () {
            window.clearTimeout(wrapper.data('timeid'));
        }

        wrapper.hover(function () {
            stop();
        },function () {
            wrapper.data('timeid',window.setTimeout(start,settings.delay*1000));
        })

        var imgLoader=new Image();
        imgLoader.onload=function () {
            imgLoader.onload=null;
            init();
        }

        imgLoader.src=$firstPic.attr('src');
    }
})(jQuery)
