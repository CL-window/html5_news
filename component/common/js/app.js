
/**
 * 提示框
 * @param String titName  主提示title
 * @param String detailTit  副提示title
 */
function $toast(titleName,detailTit){
	var params = { 
			title:{ 
				name:titleName, 
				fontSize:'16', 
				color:'#ffffff' 
			},
			detailTitle:{ 
				name:detailTit, 
				fontSize:'16', 
				color:'#ffffff' 
			},
	 		bgColor:'#000', 
	 		bgOpacity:'0.5' 
	};
	app.progress.showToast(1,params);
}
/**
 *进度条
 * @param 
 */
function $showProgress(title){
	var params = {
        title:{
          name:(title==""?'努力加载中...':title),
          fontSize:'16',
          color:'#ffffff'
        },
        detailTitle:{
          name:'',
          fontSize:'16',
          color:'#3300cc'
        },
        bgColor:'#000000',
        bgOpacity:'0.5'
    };
  	app.progress.showProgress(params);
}
function $hideProgress(){
	app.progress.hideProgress();
}
function checkFor(e, cb){
	var ch;
	if(e.currentTarget)
    	ch = e.currentTarget.previousElementSibling;
	else
		ch = e.previousElementSibling;
    if (ch.nodeName == "INPUT") {
        if (ch.type == "checkbox") 
            ch.checked = !ch.checked;
        if (ch.type == "radio" && !ch.checked) 
            ch.checked = "checked";
    }
    if (cb) 
        cb(e, ch.checked);
}
	
/**
 * 根据时间戳获取年、月、日
 * @param String str 时间戳
 * @param Boolean f 是否在原来的基础上*1000，true要*，false或不填就不*
 * @param num type 显示格式，，不传时默认显示年月日
 */
function getTimes(str,f,type){
	var t = (f) ? parseInt(str)*1000 : parseInt(str);
	var d = new Date(t);
	var y = d.getFullYear();
	var m = setNum(d.getMonth()+1);
	var da = setNum(d.getDate());
	var h = setNum(d.getHours());
	var mm = setNum(d.getMinutes());
	var ss = setNum(d.getSeconds());
	if(type==1){
		return y+"-"+m+"-"+da+" "+h+":"+mm+":"+ss;
	}else if(type==2){
		return y+"年"+m+"月"+da+"日 "+h+":"+mm+":"+ss;
	}else if(type==3){
		return h+":"+mm+":"+ss;
	}else if(type==4){
		return y+"年"+m+"月"+da+"日 "+h+":"+mm;
	}else if(type==5){
		return y+"年"+m+"月"+da+"日 ";
	}else{
		return y+"/"+m+"/"+da;
	}
}
/**
 * 把年月日（2015-10-20）转变为时间戳
 * @param String dateStr 日期
 */	
function getTimeStr(dateStr){
    var newstr = dateStr.replace(/-/g,'/'); 
    var date =  new Date(newstr); 
    var time_str = date.getTime().toString();
    return time_str.substr(0, 10);
}

function setNum(s){
	return (parseInt(s)>9) ? s : '0'+s;
}