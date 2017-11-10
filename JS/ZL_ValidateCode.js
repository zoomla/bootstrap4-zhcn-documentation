//1,页面上指定codeok,codeno两个样式
//2,$("#TxtValidateCode").ValidateCode();
(function ($) {
    $.fn.extend({
        ValidateCode: function (options, callback) {//callback暂未用
            var opts = $.extend({}, $.fn.ValidateCode.defaults, options), CodeCheck = $.fn.ValidateCode.CodeCheck;
            var isok = false;
            var obj = this;
            if (!obj || obj == null || !obj.attr("id")) return;
            var objimg = $("#" + obj[0].id + "_img");
            var objhid = $("#" + obj[0].id + "_hid");
            objhid.val(Math.random());//Key
            objimg.attr("src", "/Common/ValidateCode.aspx?key="+ objhid.val()+"&t=" + Math.random());
            //----事件
            objimg.click(function () {
                var url = "/Common/ValidateCode.aspx?key=" + objhid.val() + "&t=" + Math.random();
                $(this).attr("src", url); obj.val(""); obj.keyup(); obj.focus();
            });
            $(obj).keyup(function () {
                var v = $(obj).val(),k=objhid.val();
                if (v.length < opts.num) { $(obj).removeClass(opts.okcss).removeClass(opts.nocss); return; }
                CodeCheck(v, k, function (data) {
                    if (data == 0) {
                        $(obj).removeClass(opts.okcss).addClass(opts.nocss);
                        isok = false;
                    }
                    else if (data == 1) {
                        $(obj).removeClass(opts.nocss).addClass(opts.okcss);
                        isok = true;
                    }
                });
            });//keyup end;
            if (opts.submitchk)//提交验证
            {
                $("form").submit(function (e) {
                    //var v = $(obj).val(), k = objhid.val(), flag = true;
                    //CodeCheck(v, k, function (data) {
                    //    if (data == 0) {
                    //        alert("验证码不正确"); flag = false;
                    //    }
                    //});
                    //return flag;
                    var v = $(obj).val();
                    if (v.length < opts.num) { isok = false; }
                    if (!isok) {
                        alert("验证码不正确");
                    }
                    return isok;
                });
            }
           
        }
    })//fn end;
    $.fn.ValidateCode.defaults = { okcss: "codeok", nocss: "codeno", num: 6,submitchk:true };//参数赋值
    $.fn.ValidateCode.CodeCheck = function (v, k, callback) {
        a = "checkcode";
        $.ajax({
            type: "Post",
            async: true,
            url: "/Common/ValidateCode.aspx",
            data: { action: a, value: v, key: k },
            success: function (data) {
                callback(data);
            }
        });
    };
})(jQuery)

//给一个配置项,如果开启,则先AJAX验证,校验不对则拒绝提交,弹窗验证码有误