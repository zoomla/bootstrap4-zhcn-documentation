/*---辅助工具方法-----*/
//获取数据
function GetData(action, callback, params) {
    if (!params) { params = {}; };
    $.ajax({
        url: server + "?" + action,
        type: "GET",
        dataType: 'jsonp',
        jsonp: 'callback',
        data: params,
        timeout: 5000,
        success: function (retmod) {
            if (retmod.retcode != 1) { console.log("获取失败,原因:" + retmod.retmsg); return false; }
            var list = JSON.parse(retmod.result);
            callback(list, retmod);
        },
        error: function (retmod) {
            alert("获取失败");
        }
    });
}

//使用json替换模板
var JsonHelper = {
    FillData: function (stlp, list) {
        //用于单传一个json模型
        if (!(list instanceof Array)) { var arr = []; arr.push(list); list = arr; }
        var result = "";
        for (var i = 0; i < list.length; i++) {
            var model = list[i];
            result += function (mod) {
                var tlp = stlp;
                var keyArr = [];
                for (var key in mod) {
                    keyArr.push(key);
                }
                //将key字符长度最大的放前面
                keyArr.sort(function (a, b) { return a.length > b.length ? -1 : 1; });
                for (var i = 0; i < keyArr.length; i++) {
                    var key = keyArr[i];
                    tlp = tlp.Replace("@" + key, mod[key]);
                }
                tlp = tlp.Replace("@_model", JSON.stringify(model));//将整个模型作为参数传入
                var $item = $(tlp);
                var $fun = $item.find("fun");//需要以JS解析的
                $fun.each(function () {
                    var html = $(this).html();
                    $(this).html(eval(html));
                })
                return $item.toHTML();
            }(model);
        }//for end;
        return result;
    }//FillData end;
};
jQuery.fn.extend({
    toHTML: function () {
        var obj = this;
        var html = "";
        for (var i = 0; i < obj.length; i++) {
            html += obj[i].outerHTML;
        }
        return html;
    }
});
String.prototype.Replace = function (str1, str2) {
    var rs = this.replace(new RegExp(str1, "gm"), str2);
    return rs;
}

