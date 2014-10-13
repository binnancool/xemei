//搜索参数配置
var searchConfig = {
    baidu: {
        action: "http://www.baidu.com/s",
        name: "wd",
        btn: "百度一下",
        parm : {
            'tn':'ylmf_4_pg',
            'ch':7,
            'ie':'utf-8'
        }
    },
    sogou: {
        action: "http://www.sogou.com/sogou",
        name: "query",
        btn: "搜 索",
        parm : {
            'pid':'sogou-site-b432f34c5a997c8e'
        }
    }
}
// 项部搜索
var topSearch = (function(){
    var search = function(){
        var sPar = $('#J_sType').find('span'),
            sChi = $('#J_sType').find('ul');
        var over = false;
        sPar.click(function(){
            var state = sChi.css('display');
            (state == 'none' || state == '') ? sChi.show() : sChi.hide();
        });
        sChi.find('a').click(function(){
            var rel = $(this).attr('rel');
            setForm(searchConfig[rel]);
            $('#J_sClass').val(rel);
            sPar.html($(this).html());
            sChi.hide();
            return false;
        });
        $('#J_sType').hover(
            function(){ over = true;},
            function(){ over = false;}
        );
        $(document).bind('click',function(){
            if(!over) sChi.hide();
        });
    }
    var setForm = function(data){
        $('#J_sForm').attr('action',data.action);
        $('#J_sKey').attr('name',data.name);
        $('#J_sBtn').html(data.btn);
        $('#J_sForm').find('input[type="hidden"]').remove();
        for (var item in data.parm) {
            $('#J_sForm').append('<input type="hidden" name="'+item+'" value="'+data.parm[item]+'" />');
        }
    }
    return {
        Init : function(){
            search();
        }
    }
})();


// 输入框suggest

var searchSuggest = function(obj){
    var obj = obj || {};
    var keyObj = obj.input;
    var parm = obj.parm;
    var sForm = obj.form;
    var x = obj.x;
    var y = obj.y;
    var isHide = false;
    var currentKey = -1;
    var stopRequest;
    var url = '/?ac=search_ajax';
    var TPL = '<div class="suggest" id="J_suggest" style="position:absolute;z-index:999;"></div>';
    var sugShow = function(){
        if(!$('#J_suggest').get(0)){
            $('body').append(TPL);
        }
        else{
            $('#J_suggest').show();
        }
        setSugPos();
        isHide = true;
    }
    var sugHide = function(){
        $('#J_suggest').hide();
        $('#J_suggest').html('');
    }
    keyObj.bind('keyup',function(e){
        var val = $(this).val();
        if($.trim(val) != ''){        
            if(!isHide){
                sugShow();
            }                      
            var key = window.event ? event.keyCode : e.which;
            switch(key){              
                case 13:
                    sugHide();
                    sForm.submit();
                    return true;
                case 40:
                    //Down
                    currentKey++ ;
                    selectItem();
                    stopRequest = true;
                    return;
                case 38:
                    //UP
                    currentKey--;
                    selectItem();
                    stopRequest = true;
                    return;
            }
            var goUrl = url+'&c='+obj.parm.val()+'&v='+val;
            if(!stopRequest){
                getSuggsetData(goUrl);
            }
        }
        else{
            sugHide();
        }
    });
    
    var getSuggsetData = function(url){        
        $.getJSON(url,function(data){
            reBuildSug(data);
        });
    }
    
    var reBuildSug = function(data){
        var html = '';
        if(data.type){
            html = '<ul>';
            var len = data.title.length;
            if(len >=10) len = 10; 
            for(var i = 0;i<len;i++){
                html+= '<li>'+data.title[i]+'</li>';
            }
            html += '</ul>'
            $('#J_suggest').html(html);
            sugShow();
        }
        else{
            sugHide();
        }
        mouseOver();
    }
    
    var setSugPos = function(){
        if(x == undefined || y == undefined){
            x = keyObj.offset().left;
            y = keyObj.offset().top + 28;
        }
        $('#J_suggest').css({left:x,top:y});
    }
    
    var setHover = function(num){
        $('#J_suggest').find('li').removeClass('hover');
        $('#J_suggest').find('li').eq(num).addClass('hover');
        keyObj.val($('#J_suggest').find('li').eq(num).html());
    }
    function selectItem(){
        var KeywordItems = $('#J_suggest').find('li');
        if (!KeywordItems) 
            return;
        var len = KeywordItems.length;        
        stopRequest = true;
        if (currentKey < 0) {
            currentKey = len - 1;
        }
        else 
            if (currentKey >= len) {
                currentKey = 0;
            }
        for (var i = 0, len = KeywordItems.length; i < len; i++) {
            KeywordItems[i].className = "";
        }
        KeywordItems[currentKey].className = "hover";
        keyObj.val(KeywordItems[currentKey].innerHTML);
    }
    
    var mouseOver = function(){
        $('#J_suggest').find('li').hover(
            function(){$(this).addClass('hover');},
            function(){$(this).removeClass('hover');}
        );
        $('#J_suggest').find('li').unbind('click').bind('click',function(){
            keyObj.val($(this).html());
            sugHide();
            sForm.submit();
            return true;
        });
    }
    var _over = false;
    $('#J_suggest').hover(
        function(){_over=true},
        function(){_over=false}
    );
    $(document).bind('click',function(){
        if(!_over){
            sugHide();
        }        
    });
}

$(function(){
    //搜索
    topSearch.Init();
    /*
    searchSuggest({
        input: $('#J_sKey'),
        parm : $('#J_sClass'),
        form : $('#J_sForm')
    });
    */
    var goTop = function(){
        $("#gotop a").click(function() {
            var doc = $(document).find("html,body");
            if (doc.filter(":animated").size()) {
                doc.stop()
            }
            doc.animate({
                scrollTop: 0
            },
            600);
            return false;
        });
    }
    if($(document).scrollTop()<=0){
        $("#gotop").hide();
    }
    $(window).scroll(function(){
        $(document).scrollTop()>0?$("#gotop").show():$("#gotop").hide();
        if($.browser.msie && $.browser.version <= 6){
            $("#gotop").css({"top":$(document).scrollTop() + document.documentElement.clientHeight - 150,"position":"absolute"});
        }
    });
    goTop();
    
});


// TAB 切换
var Taber = {
    init : function(opt){
		var num = 0;
        if(!opt) 
		opt = {
			til:undefined,
			conClass:undefined,
			tilCur:'current' || undefined
		};
		opt.conClass.hide();
		$("#"+opt.til.filter("."+opt.tilCur).attr('rel')).show();
        opt.til.each(function(){
            var that = this;
            Taber.evtHover(that,function(){
                opt.conClass.hide();
                $('#'+$(that).attr('rel')).show();
                opt.til.removeClass(opt.tilCur);
                $(that).addClass(opt.tilCur);
            });
        });
    },
    evtHover : function(ele,fn){
        var evt = ["click", "mouseover"], 
            MouseDelayTime = 300, 
            waitInterval;
        for(var i=0;i<evt.length;i++){
            var element = evt[i];
            switch (element) {
                case "click":
                    if(waitInterval){
                        window.clearTimeout(waitInterval);
                    }
                    $(ele).bind('click',fn);
                    break;
                case "mouseover":
                    $(ele).bind('mouseover',function(){
                        if(waitInterval){
                            window.clearTimeout(waitInterval);
                        }
                        waitInterval = window.setTimeout(fn, MouseDelayTime);
                    });
                    $(ele).bind('mouseout',function(){
                        if (waitInterval != undefined) {
                            window.clearTimeout(waitInterval);
                        }
                    });
                    break;
            }
        }
    }

}
  function AddFavorite(sURL, sTitle){
	try {
            window.external.addFavorite(sURL, sTitle);
        }
        catch (e) {
            try {
                window.sidebar.addPanel(sTitle, sURL, "114la");
            }
            catch (e) {
                alert("加入收藏失败,请手动添加.");
            }
        }
}





