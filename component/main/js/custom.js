// http://docs.369cloud.com/BaaS/shujucunchu/Js-sdk
//请求数据的表头
var headerRefresher,footerRefresher;
var view = app.currentView();
var _dt = new DT({
	    appId:"729961646046576640",
	    appKey:"837a30540ee842bfadfc9758f275f582"
	});

//设置报文头
function getHeader(){
	var appSession = app.storage.get('appSession');
//	alert(appSession);
	if(appSession){//已登录
		_dt = new DT({
		    appId:"729961646046576640",
		    appKey:"837a30540ee842bfadfc9758f275f582",
		    appSession:appSession
		});
	}
}
	
/*请求新闻列表切填充新闻列表页面
 * @param 	Json 	whereJson	查询新闻列表的条件 
 */
var newsNowpage = 1;
var isLastPage = false;
var isLoading = false;
function getNewsListData(whereJson,count){
//	getHeader();
	var _news  = _dt.DB.Tab("news_content");//对表的属性（列）操作 对表内数据的操作
	// http://docs.369cloud.com/BaaS/shujucunchu/Js-sdk#getlistdata
    var _option = {
        page:newsNowpage,
        size:10,
        where:whereJson,
        order:[["_edtm",1]]
    };
    // Failed to load resource: net::ERR_CONNECTION_REFUSED http://127.0.0.1:30007/
    _news.getListData(_option,function(err){
    	if(whereJson.type == "technology"){
       		$hideProgress();
       }
        app.alert("网络请求超时,请检查网络");
    },function(result){
//  	console.log(result.data.length);
//  	alert(result.data.length);
		if(result.data.length==0){
    		isLastPage = true;
    		isLoading = false;
    	}
    	if(result.data.length>0 && !isLastPage){
    		//是否是最后一页，否：加载页加1；是：isLastPage是true；
    			newsNowpage += 1;
	        for(var i in result.data){
	        	var newsInfo = result.data[i];
//	        	每次查询的结果的前三条做轮播图的
				if(i<3 && result.current == 1){	
					
					var sliderHtmls = '';              
					sliderHtmls +='<div id="'+newsInfo._id+'" class="showInfo-js ui-slider-item w-100">';
	                sliderHtmls +='<div class="ui-slider-img banner bg-img1">';
	                sliderHtmls +='<div class="mar-t-11 t-wh opt-06 hei-2 box box-ps box-ac">';
	                sliderHtmls +='<div class="w-70 omit1">'+newsInfo.title+'</div>';
	                sliderHtmls +='</div>';
	                sliderHtmls +='</div>';
	                sliderHtmls +='</div>';
	                $("#slider-js").append(sliderHtmls);
	                $("#"+newsInfo._id).children().css("background-image", 'url("' + newsInfo.image + '")');
				}else{
					var listHtmls = '';
					listHtmls += '<div id="'+newsInfo._id+'" class="showInfo-js box b-d2d mar-a padd-b">';
					listHtmls += '<div class="wh-pic"><img src="'+newsInfo.image+'" class="wh-100"></div>';
					listHtmls += '<div class="box box-f1 box-ov padd-l">';
					listHtmls += '<div class="omit1 font1">'+newsInfo.title+'</div>';
					listHtmls += '<div class="t-gra padd-t omit line2 box box-ps">'+newsInfo.brief+'</div>';
					listHtmls += '</div>';
					listHtmls += '</div>';
					$("#dataBody-js").append(listHtmls);
				}
	    	}
	        $('#slider').slider( { 
	            loop:true,
	            autoPlay:true,
	            speed:100,
	            dots:true,
	            guide : true,
	            mulViewNum:1
	        });
	       if(whereJson.type == "technology"){
	       		$hideProgress();
	       }
	    	//跳转到详情页面
	    	$(".showInfo-js").button(function(btn,el){
				app.storage.set("newsId",btn.id);
				var win = app.createWindow();
				win.open('newsDetail.html', 'newsDetail');
	    	})
    	}else if(newsNowpage == 1 && result.data.length == 0){
    		var emptyHtml = '<div class="box box-f1 box-pc box-ac mar-t-3 font2">暂无数据</div>'
    		$(".body-js").html(emptyHtml);
    	}
		if(isLastPage&&count==10){
			app.alert("没有更多数据了","");
		}
    });
    headerRefresher.completeRefresh();
    footerRefresher.completeRefresh();
}
	
	
function headerRefreshing(whereJson){
	 headerRefresher = view.addHeaderRefresh({
       contentdown: '下拉可以刷新',
       contentover: '释放立即刷新',
       contentrefresh: '正在刷新...',
       callback: function() {
           getNewsListData(whereJson,1);
       }
   	});
}

/*
 * 上拉加载
 */ 

function footerRefreshing(whereJson){
		footerRefresher = view.addFooterRefresh({
            contentdown: '上拉可以加载',
            contentover: '释放立即加载',
            contentrefresh: '正在加载...',
            callback: function() {
                getNewsListData(whereJson,10);
            }
        });
   }
	