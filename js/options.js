jQuery(document).ready(function() {

    var objPosts = jQuery("#postsShow");
    var objFollowers = jQuery("#followersShowRight");
    var objNoticeAll = jQuery("#noticeHideAll");
    var objNoticeReblog = jQuery("#noticeHideReblog");
    var objNoticeLike = jQuery("#noticeHideLike");
    var objNoticeImg= jQuery("#noticeShowImg");
    var objNoticeRight= jQuery("#noticeHideRight");
    var objBox = jQuery("#boxShow");


    objPosts.prop("checked", jQuery.isEmptyObject(localStorage["posts"])? true: localStorage["posts"]==="true"? true: false);
    objFollowers.prop("checked", jQuery.isEmptyObject(localStorage["followers"])? false: localStorage["followers"]==="true"? true: false);
    objNoticeAll.prop("checked", jQuery.isEmptyObject(localStorage["noticeAll"])? false: localStorage["noticeAll"]==="true"? true: false);
    objNoticeReblog.prop("checked", jQuery.isEmptyObject(localStorage["noticeReblog"])? false: localStorage["noticeReblog"]==="true"? true: false);
    objNoticeLike.prop("checked", jQuery.isEmptyObject(localStorage["noticeLike"])? false: localStorage["noticeLike"]==="true"? true: false);
    objNoticeImg.prop("checked", jQuery.isEmptyObject(localStorage["noticeImg"])? false: localStorage["noticeImg"]==="true"? true: false);
    objNoticeRight.prop("checked", jQuery.isEmptyObject(localStorage["noticeRight"])? false: localStorage["noticeRight"]==="true"? true: false);
    objBox.prop("checked", jQuery.isEmptyObject(localStorage["box"])? false: localStorage["box"]==="true"? true: false);

    if(objNoticeAll.prop("checked")) {
        childControl("div.notice", true);
    }

    objPosts.click(function() {
        localStorage["posts"] = objPosts.prop("checked");
    });
    objFollowers.click(function() {
        localStorage["followers"] = objFollowers.prop("checked");
    });
    objNoticeAll.click(function() {
        if(objNoticeAll.prop("checked")) {
            childControl("div.notice", true);
        } else if(!objNoticeAll.prop("checked")) {
            childControl("div.notice", false);
        }
        localStorage["noticeAll"] = objNoticeAll.prop("checked");
        localStorage["noticeReblog"] = objNoticeReblog.prop("checked");
        localStorage["noticeLike"] = objNoticeLike.prop("checked");
        localStorage["noticeImg"] = objNoticeImg.prop("checked");
    });
    objNoticeReblog.click(function() {
        localStorage["noticeReblog"] = objNoticeReblog.prop("checked");
    });
    objNoticeLike.click(function() {
        localStorage["noticeLike"] = objNoticeLike.prop("checked");
    });
    objNoticeImg.click(function() {
        localStorage["noticeImg"] = objNoticeImg.prop("checked");
    });
    objNoticeRight.click(function() {
        localStorage["noticeRight"] = objNoticeRight.prop("checked");
    });
    objBox.click(function() {
        localStorage["box"] = objBox.prop("checked");
    });

});

function childControl(cls, disable) {
    jQuery(cls+">p.child>input.child").each(function() {this.checked = disable? true: false; this.disabled = disable? true: false;});
    jQuery(cls+">p.child_reverse>input.child_reverse").each(function() {this.checked = disable? false: true; this.disabled = disable? true: false;});
    if(disable) {
        jQuery(cls+">p.child").addClass("mask");
        jQuery(cls+">p.child_reverse").addClass("mask");
    } else {
        jQuery(cls+">p.child").removeClass("mask");
        jQuery(cls+">p.child_reverse").removeClass("mask");
    }
}
