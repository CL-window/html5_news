 var hostUrl = 'https://api.369cloud.com/';
 (function(){
    /**
     * 工具类
     */
    function DtComment(){
        var _cloud =this;
        this.encoding = "utf8";
        /**
         * 向服务器请求的方法
         */
        this.req = function () {
            var args =  Array.prototype.slice.call(arguments, 0)
                    , has_callback = typeof args[args.length - 1] === 'function'
                    , has_errcallback = typeof args[args.length - 2] === 'function'
                    , callback = has_callback ? args.pop() : null
                    , errback = has_errcallback ? args.pop() : (has_callback?callback:null)
                    , len = args.length
                    , type = len >= 1 ? args[0] : {}
                    , path = len >= 2 ? args[1] : {}
                    , data = len >= 3 ? args[2] : {}
                    , config = len >= 4 ? args[3] : {};
            var _headers ={
                'accept': '*/*',
                'X-369Cloud-App-Id':config.appId,
                "Content-Type": 'application/json;charset=UTF-8'
            };
            if(config.appKey){
                _headers["X-369Cloud-App-Key"] = config.appKey;
            }
            if(config.appMasterKey){
                _headers["X-369Cloud-App-Master"] = config.appMasterKey;
            }
            if(config.appSession){
                _headers["X-369Cloud-App-Session"] = config.appSession;
            }
           var _url = hostUrl+config.vs+path;

            if(type.toLowerCase() === "get"){
                var _param=[];
                if(data){
                    if(data.page){_param.push("page="+data.page);};
                    if(data.size){_param.push("size="+data.size);};
                    if(data.where){_param.push("where="+decodeURIComponent(JSON.stringify(data.where)));};
                    if(data.order){_param.push("order="+decodeURIComponent(JSON.stringify(data.order)));};
                    if(data.include){_param.push("include="+decodeURIComponent(JSON.stringify(data.include)));};
                }
                _url += "?"+_param.join("&");
            }
            var shareUrl = hostUrl+config.vs+encodeURI(path);
            app.storage.set("newsUrl",shareUrl);//分享的地址
            var date = new Date();
            if(_url.indexOf("?")>=0){
            	_url += "&"+date.getTime();
            }else{
            	_url += "?"+date.getTime();
            }
            if(type === "get" || type=="delete"){
				//get请求需要将url转义，data传空
				_url = encodeURI(_url);
				data = {};
			}
			app.http.ajax(_url, {
                        type:type,
                        data: JSON.stringify(data),
                        dataType: "json",
                        headers:_headers,
                        timeout:10000,
                        success: function(retData, response) {
							callback(retData.data)
                        },
                        error:function(message,code,response){
                        	$hideProgress();
                        	if($.os.ios || $.os.android){
	                    		app.alert("网络请求超时,请检查网络");
                        	}
                        }
                    })

        }
        /**
         * 日期格式化
         */
        this.DateFormat = function(objDtm, formatStr) {
            var str = formatStr;
            var _objMonth =objDtm.getMonth()+1;
            //var Week = ['日', '一', '二', '三', '四', '五', '六'];
            str = str.replace(/yyyy|YYYY/, objDtm.getFullYear());
            str = str.replace(/yy|YY/, (objDtm.getYear() % 100) > 9 ? (objDtm.getYear() % 100).toString() : '0' + (objDtm.getYear() % 100));

            str = str.replace(/MM/, _objMonth > 9 ? _objMonth : '0' + _objMonth);
            str = str.replace(/M/g, _objMonth);

            //str = str.replace(/w|W/g, Week[objDtm.getDay()]);

            str = str.replace(/dd|DD/, objDtm.getDate() > 9 ? objDtm.getDate().toString() : '0' + objDtm.getDate());
            str = str.replace(/d|D/g, objDtm.getDate());

            str = str.replace(/hh|HH/, objDtm.getHours() > 9 ? objDtm.getHours().toString() : '0' + objDtm.getHours());
            str = str.replace(/h|H/g, objDtm.getHours());
            str = str.replace(/mm/, objDtm.getMinutes() > 9 ? objDtm.getMinutes().toString() : '0' + objDtm.getMinutes());
            str = str.replace(/m/g, objDtm.getMinutes());

            str = str.replace(/ss|SS/, objDtm.getSeconds() > 9 ? objDtm.getSeconds().toString() : '0' + objDtm.getSeconds());
            str = str.replace(/s|S/g, objDtm.getSeconds());

            return str;
        }

        /**
         * 判断是否是一个object对象
         */
        this.isObject = function(obj) {
            var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
            return isjson;
        }

        /**
         * 判断是否是字符串
         */
        this.isString = function(objDtm, formatStr) {
            var boolTag = '[object String]';
            return Object.prototype.toString.call(obj) ==  boolTag;
        }

        /**
         * 判断是否是Number
         */
        this.isNumber = function(objDtm, formatStr) {
            var boolTag = '[object Number]';
            return Object.prototype.toString.call(obj) ==  boolTag;
        }
        /**
         * 判断是否是Boolean
         */
        this.isBoolean = function(obj){
            return obj === true || obj === false;
        }

        /**
         * 判断是否是Date
         */
        this.isDate = function(obj){
            var _tempdtm = new Date(obj);
            if(_tempdtm &&  _tempdtm.toDateString() != "Invalid Date"){
                return true;
            }
            return false;
        }


        /**
         * 判断是否是二维地理信息
         */
        this.isGeo =   function(obj){
            if(!isObject(obj)){
                return false;
            }
            var _attr =["_type","x","y"];
            for(var i in _attr){
                if(!obj.hasOwnProperty(_attr[i])){
                    return false;
                }
            }
            if(!obj["_type"]==="geo"){
                return false;
            }
            return true;
        }

        function  checkIsOFO(obj){
            if(!isObject(obj)){
                return false;
            }
            var _attr =["_type","class","id"];
            for(var i in _attr){
                if(!obj.hasOwnProperty(_attr[i])){
                    return false;
                }
            }
            if(!obj["_type"]==="oto"){
                return false;
            }
            return true;
        }
        /**
         * 判断是否是一对一关系
         */
        this.isOTO = checkIsOFO;
        /**
         * 判断是否是一对多关系
         */
        this.isOTM = function(obj){
            if(util.isArray(obj)){
                if(!checkIsOFO(obj)){
                    return false;
                }
            }
            else{
                return false;
            }
            if(!obj["_type"]==="otm"){
                return false;
            }
            return true;
        }
    }

    var _errcfg = {

    };

    String.prototype.trim   =   function()
    {
        return   this.replace(/(^"s*)|("s*$)/g,   "");
    }

    var _dt={
        Auth:{}
    };
    var _DtComment = new DtComment();

    /**
     * 添加表
     * @module DT
     * */
    function DT(_conf){
        var _cfg ={
            appId:""
            ,appKey:""
            ,appSession:""
            ,vs:"v1"
            ,errback :null
        };
        if(_conf){
            for(var attr in _conf){
                _cfg[attr] = _conf[attr];
            }
        }
        _dt.DB = _DB;
        _dt.DB.Tab = Tab;
        _dt.Img = Img;
        _dt.cfg = _cfg;
        _dt.dblist = []; //数据库数组  [{_id:"",name:""}]

        return _dt;
    }
    /**
     * 添加表
     * @class DB
     * */
    function _DB()
    {
        var _DtDB = this;
        /**
         * 得到所有的表
         * @method getAllTab
         * @return {Array} []
         * @example
         *   var _dt = new DT({
                appId:"1398"
                ,appKey:"60e7ee60dcfd42ffbf8ccd42889f6295"
            });
             var _dbObj = new _dt.DB();
             _dbObj.getAllTab(function(err){
                console.log(err);
            },function(data){
                console.log(data);
            });
         */
        function getAllTab(errback,callback){
            _DtComment.req("get","/tab",null,_dt.cfg,errback,callback);
        }

        /**
         * 添加表
         * @class DB
         * @method creatTab
         * @param tabName {String} 表名称
         * @return {JSON}
            {
                 "status": 1,
                 "err": "",
                 "data": true/false
            }
         * @example
         *   var _dt = new DT({
                appId:"1398"
                ,appKey:"60e7ee60dcfd42ffbf8ccd42889f6295"
            });
             var _dbObj = new _dt.DB();
             _dbObj.creatTab("test1",function(err){
                console.log(err);
            },function(data){
                console.log(data);
                getAllTab()
            });
         */
        function creatTab(tabName,errback,callback){
            _DtComment.req("post","/tab",{name:tabName},_dt.cfg,errback,callback);
        }

        /**
         *删除表
         *
         * */
        function delTab(tabName,errback,callback){
            _DtComment.req("delete","/tab/"+tabName,null,_dt.cfg,errback,callback);
        }

        /**
         *清空表
         *
         * */
        function clearTab(tabName,errback,callback){
            _DtComment.req("post","/tab/"+tabName,{event:"clear"},_dt.cfg,errback,callback);
        }

        /**
         *导入表
         *
         * */
        function importTab(tabName,strUrl,errback,callback){
            _DtComment.req("post","/import/class/"+tabName,{url: strUrl},_dt.cfg,errback,callback);
        }

        /**
         *导出表
         *
         * */
        function exportTab(obj,errback,callback){
            _DtComment.req("post","/export/app",obj,_dt.cfg,errback,callback);
        }

        return  {getAllTab:getAllTab , creatTab:creatTab ,delTab:delTab ,clearTab :clearTab,importTab:importTab,exportTab:exportTab };
    }

    /**
     * 添加表
     * @class Tab
     * */
    function Tab(className){

        var _this_db = {_id:"",name:className};  //当前数据库 {_id:"",name:""}

        /**
         *添加列
         *
         * */
        function creatField(obj,errback,callback){
            _DtComment.req("post","/field/"+_this_db.name,obj,_dt.cfg,errback,callback);
        }

        /**
         *编辑列
         *
         * */
        function editField(obj,errback,callback){
            if(!obj.name){
                errback("属性名称不存在");return false;
            }
            var _fieldName = obj.name;
            delete  obj.name;
            _DtComment.req("put","/field/"+_this_db.name+"/"+_fieldName,obj,_dt.cfg,errback,callback);
        }

        /**
         *删除列
         *
         * */
        function delField(fieldName,errback,callback){
            _DtComment.req("delete","/field/"+_this_db.name+"/"+fieldName,null,_dt.cfg,errback,callback);
        }

        /**
         *得到所有列
         *
         * */
        function getField(fieldName,errback,callback){
            _DtComment.req("get","/field/"+ _this_db.name+"/"+fieldName,null,_dt.cfg,errback,callback);
        }


        /**
         *得到所有列
         *
         * */
        function getFieldes(errback,callback){
            var filedName = "";
            _DtComment.req("get","/field/"+ _this_db.name,null,_dt.cfg,errback,callback);
        }


        /**
         *添加数据
         *
         * */
        function creatData(obj,errback,callback){
            _DtComment.req("post","/data/one/"+ _this_db.name,obj,_dt.cfg,errback,callback);
        }

        /**
         *得到数据
         *
         * */
        function getData(strId,errback,callback){
            _DtComment.req("get","/data/one/"+ _this_db.name+"/"+strId,null,_dt.cfg,errback,callback);
        }

        /**
         *编辑数据
         *
         * */
        function editData(obj,errback,callback){
            if(!obj._id){
                errback("关键字不存在");return false;
            }
            var strId = obj._id;
            delete  obj._id;
            _DtComment.req("put","/data/one/"+ _this_db.name+"/"+strId,obj,_dt.cfg,errback,callback);
        }

        /**
         *删除数据
         *
         * */
        function delData(strId,errback,callback){
            _DtComment.req("delete","/data/one/"+ _this_db.name+"/"+strId,null,_dt.cfg,errback,callback);
        }

        /**
         *删除一组数据
         *
         * */
        function delListData(obj,errback,callback){
            _DtComment.req("delete","/data/list/"+ _this_db.name,obj,_dt.cfg,errback,callback);
        }


        /**
         *得到一组数据
         *
         * */
        function getListData(option,errback,callback){
            var _url = [];
            _DtComment.req("get","/data/list/"+ _this_db.name,option,_dt.cfg,errback,callback);
        }


        return {
            creatField:creatField ,
            editField:editField ,
            delField:delField,
            getField:getField,
            getFieldes:getFieldes,
            creatData:creatData ,
            getData:getData,
            editData:editData ,
            delData:delData,
            delListData:delListData,
            getListData:getListData
        };
    }


    /**
     * 添加表
     * @class User
     * */
    function _User(){
        var _DtAuth = this;
        _DtAuth.db = {_id:"",name:"_user"};  //当前数据库 {_id:"",name:""}
        /**
         *用户注册
         *
         * */
        function regUser(objUser,errback,callback){
            _DtComment.req("post","/auth/reg",objUser,_dt.cfg,errback,callback);
        }
        /**
         *手机或者邮箱注册
         *
         * */
        function regBySecret(objUser,errback,callback){
            var _data= {
                tel:strTel
                ,pwd:strPwd
            };
            _DtComment.req("post","/auth/regbysecret",objUser,_dt.cfg,errback,callback);
        }

        /**
         *手机或者邮箱注册
         *
         * */
        function getTelCode(strTel,errback,callback){
            _DtComment.req("get","/auth/mobilecode/default/"+strTel,null,_dt.cfg,errback,callback);
        }
        /**
         *手机注册
         *
         * */
        function regForOneByMobile(objUser,errback,callback){
            _DtComment.req("post","/auth/regmobilebyone",objUser,_dt.cfg,errback,function(data){
                if(data && data.session){
                    _dt.cfg.appSession = data.session;
                }
                callback(data);
            });
        }

        /**
         *登录
         *
         * */
        function login(userCode,userPwd,errback,callback){
            _DtComment.req("post","/auth/login",{
                code:userCode
                ,pwd:userPwd
            },_dt.cfg,errback,function(data){
                if(data && data.session){
                    _dt.cfg.appSession = data.session;
                }
                callback(data);
            });
        }
        /**
         *根据手机验证码登录
         *
         * */
        function loginByMobileCode(strTel,strCode,errback,callback){
            _DtComment.req("post","/auth/mobilelogin",{
                tel:strTel
                ,code:strCode
            },_dt.cfg,errback,function(data){
                if(data && data.session){
                    _dt.cfg.appSession = data.session;
                }
                callback(data);
            });
        }
        /**
         *修改密码
         *
         * */
        function editPwd(userCode,userOldPwd,userNewPwd,errback,callback){
            _DtComment.req("post","/auth/editpwd",{
                name:userCode
                ,pwd:userNewPwd
                ,oldpwd:userOldPwd
            },_dt.cfg,errback,callback);
        }
        /**
         **根据手机验证码修改密码
         *
         * */
        function editPwdByMobileCode(strTel,strCode,userNewPwd,errback,callback){
            _DtComment.req("post","/auth/editpwdbymobile",{
                tel:strTel
                ,code:strCode
                ,pwd:userNewPwd
            },_dt.cfg,errback,callback);
        }
        /**
         *密码重置
         *
         * */
        function rePwd(userCode,errback,callback){
            _DtComment.req("post","/auth/repwd/"+userCode,null,_dt.cfg,errback,callback);
        }

        /**
         *修改用户信息
         *
         * */
        function editUser(objUser,errback,callback){
            var strId = objUser._id;
            delete objUser._id;
            _DtComment.req("put","/auth/user/"+strId,objUser,_dt.cfg,errback,callback);
        }

        /**
         *删除用户
         *
         * */
        function delUser(userCode,errback,callback){
            _DtComment.req("delete","/auth/user/"+userCode,null,_dt.cfg,errback,callback);
        }


        return {
            regUser:regUser
            ,regBySecret:regBySecret
            ,getTelCode:getTelCode
            ,regForOneByMobile:regForOneByMobile
            ,login:login
            ,loginByMobileCode:loginByMobileCode
            ,editPwd:editPwd
            ,editPwdByMobileCode:editPwdByMobileCode
            ,rePwd:rePwd
            ,editUser:editUser
            ,delUser:delUser};
    }

    _dt.Auth.User = _User;
    this.DT = DT;

    function Img(){
        /**
         *上传图片
         *
         * */
        function putImgByBase64(obj,errback,callback){
            _DtComment.req("post","/img/base64/one",obj,_dt.cfg,errback,callback);
        }
        return {
            putImgByBase64:putImgByBase64
        };
    }

}());