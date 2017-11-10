/*
*需ZL_Common,ZL_Dialog
*未实现:预览功能
*使用Json方式,纯支持方式实现
*/
//附件操作JS,需ZL_Common.js,ZL_Dialog支持
//WUFile {name: "test.html", size: 76272, type: "text/html", lastModifiedDate: Thu Apr 16 2015 17:41:02 GMT+0800 (China Standard Time), id: "WU_FILE_0"…}
var attachDiag = new ZL_Dialog();
var ZL_Webup = {
    config: { id: "uploader", hid: "Attach_Hid", json: { ashx: "action=General", pval: "" },nametype:"all" },//divid,hiddenID,给上传控件的Json
    imgli: "<li data-name='@name'><p><img src='@src' /></p>"
         + "<div class='file-panel' style='height: 0px;'><span class='cancel'>删除</span></div></li>",//图片li模板
    divli: "<li data-name='@name'><div class='imgview'><div class='ext @ex'></div><div class='fname'>@fname</div></div><div class='file-panel' style='height: 0px;'><span class='cancel'>删除</span><a href='/PreView.aspx?vpath=@fsrc' target='_blank'><span class='prev'></span></a></div></li>",//文件li模板
    onlyimgli: "<li data-name='@name'><p><img src='@src' /></p>"
         + "<div class='file-panel' style='height: 0px;'><a href='/Plat/Doc/DownFile.aspx?FName=@fsrc' target='_blank'><span class='down'></span></a><a href='/PreView.aspx?vpath=@fsrc' target='_blank'><span class='prev'></span></a></div></li>",
    onlydivli: "<li data-name='@name'><div class='imgview'><div class='ext @ex'></div><div class='fname'>@fname</div></div><div class='file-panel' style='height: 0px;'><a href='/Plat/Doc/DownFile.aspx?FName=@fsrc' target='_blank'><span class='down'></span></a>"
    + "<a href='/PreView.aspx?vpath=@fsrc' target='_blank'><span class='prev'></span></a></div></li>",

    ShowFileUP: function () {
        attachDiag.title = "文件上传";
        attachDiag.reload = true;
        attachDiag.backdrop = true;
        attachDiag.maxbtn = false;
        attachDiag.width = "width1100";//Blog
        attachDiag.url = "/Plugins/WebUploader/WebUP.aspx?json=" + JSON.stringify(ZL_Webup.config.json);//{\"ashx\":\"action=Blog\",\"pval\":\"\"}
        attachDiag.ShowModal();
    },
    AddAttach: function (file, ret, pval) {
        $uploader = $("#" + ZL_Webup.config.id);
        $hid = $("#" + ZL_Webup.config.hid);
        var src = ret._raw;
        var imgli = ZL_Webup.imgli;
        var divli = ZL_Webup.divli;
        $uploader.show();
        var li = "", name = src;
        if (ZL_Webup.config.nametype == "fname") {
            name = GetFname(src);
        }
        if (IsImage(src)) {
            var li = imgli.replace(/@src/, src).replace(/@name/, name).replace(/@fsrc/g, encodeURI(name));
        }
        else {
            var li = divli.replace("@ex", GetExName(src)).replace("@fname", GetFname(src, 6)).replace(/@name/, name).replace(/@fsrc/g, encodeURI(name));
        }
        $uploader.find(".filelist").append(li);
        if (ZL_Webup.config.nametype == "all") {
            $hid.val($hid.val() + src + "|");
        }
        else if (ZL_Webup.config.nametype == "fname") {
            $hid.val($hid.val() + GetFname(src, 0) + "|");//仅存文件名,用于防止用户随意指定图片
        }
        ZL_Webup.BindAttachEvent();
        attachDiag.CloseModal();
        reloadPage();//刷新页面
    },
    RemoveAttach: function (name) {
        $uploader = $("#" + ZL_Webup.config.id);
        $hid = $("#" + ZL_Webup.config.hid);
        var attctArr =$hid.val().split('|');
        var result = "";
        for (var i = 0; i < attctArr.length; i++) {
            if (attctArr[i] != name) {
                result += attctArr[i] + "|";
            }
        }
       result = result.replace("||", "|").trim("|");
       $hid.val(result);
       if ($uploader.find(".filelist li").length < 1) { $uploader.hide(); }
    },
    BindAttachEvent: function () {
        $uploader = $("#" + ZL_Webup.config.id);
        $uploader.find(".filelist li").mouseenter(function () {
            $btns = $(this).find(".file-panel");
            $btns.stop().animate({ height: 30 });
        }).mouseleave(function () {
            $btns = $(this).find(".file-panel");
            $btns.stop().animate({ height: 0 });
        });
        $uploader.find(".filelist li .cancel").click(function () {
            $li = $(this).closest("li");
            ZL_Webup.RemoveAttach($li.data("name"));
            $li.remove();
        });
    },
    AddReadOnlyLi: function (imgs) {//仅显示li不做其余处理,可预览,用于OA等不允许用户修改处,img1|img2|img3
        $uploader = $("#" + ZL_Webup.config.id);
        $hid = $("#" + ZL_Webup.config.hid);
        for (var i = 0; i < imgs.split('|').length; i++) {
            var src = imgs.split('|')[i];
            var imgli = ZL_Webup.onlyimgli;
            var divli = ZL_Webup.onlydivli;
            $uploader.show();
            var li = "", name = GetFname(src);
            if (IsImage(src)) {
                var li = imgli.replace(/@src/g, src).replace(/@name/, name).replace(/@fsrc/g, encodeURI(src));
            }
            else {
                var li = divli.replace("@ex", GetExName(src)).replace("@fname", GetFname(src, 6)).replace(/@name/, name).replace(/@fsrc/g, encodeURI(src));
            }
            $uploader.find(".filelist").append(li);
        }
        ZL_Webup.BindAttachEvent("preview");
    }
};