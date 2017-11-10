var B_User = function () {
    var opts = {};
    if (arguments.length > 1) {
        opts = JSON.parse(arguments[0]);
    }
    this.loggedurl = opts.url ? opts.url : "/User/";//登录后的链接
};
B_User.prototype = {
    Logout: function (callback) {
        var url = "/User/Logout.aspx?" + Math.random() + "";
        $.post(url, {},
        function (data) {
            callback(data);
        })
    },
    Login: function (model,callback) {
        if (model.name == "" || model.pwd == "") {
            alert("用户名与密码不能为空");
            return false
        }
        $.ajax({
            type: "Post",
            url: this.APIUrl,
            data: {
                value: model.name + ":" + model.pwd + ":" + model.key + ":" + model.code
            },
            success: function (data) {//返回模型JSON
                callback(data);
            },
            error: function (data) { }
        })

    },
    IsLogged: function (callback) {//登录成功和失败的回调
        $.ajax({
            type: "Post",
            url: this.APIUrl,
            data: { action: "HasLogged" },
            success: function (data) {
                if (!callback) return;
                if (data != -1 && data != "") {
                    callback(data, true);
                }
                else//未登录
                    callback(data, false);
            }
        });//IsLogged end;
    },
    GetBarUInfo: function (userid, callback) {
        $.post(this.APIUrl, { action: "GetBarUInfo", uid: userid }, function (data) { callback(data); }, "json");
    },
    AddFriend: function (userid, callback) {//添加好友
        $.post(this.APIUrl, { action: "GetBarUInfo", value: userid }, function (data) { callback(data); });
    },
    UserInfo: function (callback) {

    }
}
B_User.prototype.APIUrl = "/Api/UserCheck.ashx";