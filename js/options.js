jQuery(document).ready(function() {

    var objPosts = jQuery("#postsShow");
    var objFollowers = jQuery("#followersShowRight");
    var objNoticeAll = jQuery("#noticeHideAll");
    var objNoticeReblog = jQuery("#noticeHideReblog");
    var objNoticeLike = jQuery("#noticeHideLike");
    var objNoticeImg= jQuery("#noticeShowImg");
    var objNoticeRight= jQuery("#noticeHideRight");
    var objBox = jQuery("#boxShow");


    objPosts[0].checked = jQuery.isEmptyObject(localStorage["posts"])? true: localStorage["posts"]==="true"? true: false;
    objFollowers[0].checked = jQuery.isEmptyObject(localStorage["followers"])? false: localStorage["followers"]==="true"? true: false;
    objNoticeAll[0].checked = jQuery.isEmptyObject(localStorage["noticeAll"])? false: localStorage["noticeAll"]==="true"? true: false;
    objNoticeReblog[0].checked = jQuery.isEmptyObject(localStorage["noticeReblog"])? false: localStorage["noticeReblog"]==="true"? true: false;
    objNoticeLike[0].checked = jQuery.isEmptyObject(localStorage["noticeLike"])? false: localStorage["noticeLike"]==="true"? true: false;
    objNoticeImg[0].checked = jQuery.isEmptyObject(localStorage["noticeImg"])? false: localStorage["noticeImg"]==="true"? true: false;
    objNoticeRight[0].checked = jQuery.isEmptyObject(localStorage["noticeRight"])? false: localStorage["noticeRight"]==="true"? true: false;
    objBox[0].checked = jQuery.isEmptyObject(localStorage["box"])? false: localStorage["box"]==="true"? true: false;

    if(objNoticeAll[0].checked) {
        childControl("div.notice", true);
    }

    objPosts.click(function() {
        localStorage["posts"] = objPosts[0].checked;
    });
    objFollowers.click(function() {
        localStorage["followers"] = objFollowers[0].checked;
    });
    objNoticeAll.click(function() {
        if(objNoticeAll[0].checked) {
            childControl("div.notice", true);
        } else if(!objNoticeAll[0].checked) {
            childControl("div.notice", false);
        }
        localStorage["noticeAll"] = objNoticeAll[0].checked;
        localStorage["noticeReblog"] = objNoticeReblog[0].checked;
        localStorage["noticeLike"] = objNoticeLike[0].checked;
        localStorage["noticeImg"] = objNoticeImg[0].checked;
    });
    objNoticeReblog.click(function() {
        localStorage["noticeReblog"] = objNoticeReblog[0].checked;
    });
    objNoticeLike.click(function() {
        localStorage["noticeLike"] = objNoticeLike[0].checked;
    });
    objNoticeImg.click(function() {
        localStorage["noticeImg"] = objNoticeImg[0].checked;
    });
    objNoticeRight.click(function() {
        localStorage["noticeRight"] = objNoticeRight[0].checked;
    });
    objBox.click(function() {
        localStorage["box"] = objBox[0].checked;
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
