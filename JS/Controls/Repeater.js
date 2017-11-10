var Repeater = function () { }
Repeater.prototype.id = "RPT";
Repeater.prototype.ItemTlp = "";
Repeater.prototype.ChildTlp = "";
Repeater.prototype.DataSource = {};
Repeater.prototype.DataBind = function () {
    if (this.id == "" || this.ItemTlp == "") { alert("未指定ID或模板"); return false; }
    var result = "";
    var body = this.GetBody();body.html("");
    if (!this.DataSource || this.DataSource.length < 1) { result = this.EmptyDeal(); }
    else { result = this.FillData(this.ItemTlp, this.DataSource); }
    body.append(result);
};
//这里的改版可见JsonHelper
Repeater.prototype.FillData = function (stlp, list) {
    var result = "";
    var rpt = this.GetObj()[0];
    for (var i = 0; i < list.length; i++) {
        var model = list[i];
        result += function (mod) {
            var tlp = stlp;
            for (var key in mod) {
                tlp = tlp.Replace("@" + key, mod[key]);
            }
            
            var $item=$(tlp),$tds;
            switch (rpt.localName)
            {
                case "table":
                    $tds = $item.find("td");
                    break;
                case "ul":
                    $tds = $item.find("span,div");
                    break;
            }
            //遍历替换数据
            $tds.each(function () {//检测是否需执行JS
                switch ($(this).data("type")) {
                    case "func":
                        var html = $(this).html();
                        $(this).html(eval(html));
                        break;
                    default:
                        break;
                }
            });
            return $item.toHTML();
        }(model);
    }
    return result;
}
//数据为空时处理,可自实现
Repeater.prototype.EmptyDeal = function () {
    return "无数据填充";
}
Repeater.prototype.Event = {click: null, dblclick: null, mouseover: null, mouseout: null };
//绑定行事件(需扩展支持li)
Repeater.prototype.EventBind = function () {
    var ref = this;
    var $RPT = ref.GetObj();
    //如果只需要执行一次并清除,须自己实现
    if (ref.Event.click != null) {
        $RPT.find("tr[data-type!=head][data-type!=page],li[data-type!=head][data-type!=page]").each(function () {
            var obj = this;
            $(obj).bind("click", function () { ref.Event.click(obj) });
        }); 
    }
    //---双击
}
Repeater.prototype.GetObj = function () { return $("#" + this.id); }
//获取内容区,如未指定,则以整个控件为内容区(即不含头部与分页)
Repeater.prototype.GetBody = function () {
    var body = this.GetObj().find("[data-type=rptbody]");
    if (body.length < 1) { body = this.GetObj(); }
    return body;
}
/*------------------Tools------------------*/
jQuery.fn.extend({
    toHTML: function () {
        var obj = $(this[0]);
        return obj[0].outerHTML;
    }
});
String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
String.prototype.Replace = function (str1, str2) {
    var rs = this.replace(new RegExp(str1, "gm"), str2);
    return rs;
}