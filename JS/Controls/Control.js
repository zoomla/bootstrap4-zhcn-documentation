/*用于放置公用的控件方法,JSON*/
var Control = {
    EnableEnter: function () {//回车插件,过滤不可见控件
        $("input[data-enter]").keydown(function () {
            if (event.keyCode == 13) {
                var flag = false;
                var code = $(this).data("enter");
                var $arr = $("[data-enter]:visible").sort(function (a, b) { return $(a).data("enter") - $(b).data("enter") });
                var $next = null;
                for (var i = 0; i < $arr.length; i++) {
                    if ($($arr[i]).data("enter") > code) {
                        $next = $($arr[i]); break;
                    }
                }
                if ($next == null || $next.length < 0) return false;
                switch ($next.attr("type")) {
                    case "button":
                        $next.trigger("click").focus();
                        break;
                    case "submit"://有Bug,会提交两镒
                        flag = true;
                        break;
                    default:
                        $next.focus();
                        break;
                }
                return flag;
            }
        });//EnableEnter End;
    }
}