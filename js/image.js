var imgBox = jQuery(document.createElement("div")).addClass("dsbdinfo_img_popup").appendTo("body");
function zoomImage(target) {
    var postUrl = target.find(".notification_right>a").attr("href");
    var imgObj = target.find(".notification_right img");
    var imgUrl = imgObj.attr("src");
    imgUrl = imgUrl.replace("_75sq.", "_100.");
    var offsets = imgObj.offset();
    imgBox.html("<a href='"+postUrl+"'><img src='"+imgUrl+"'></a>").css({"top":offsets.top, "left":offsets.left}).show(50);
}

function moveToNotification() {
    imgBoxHide();
    var curPos = jQuery(document).scrollTop();
    var notification = jQuery(".notification:has('.notification_right img')").filter(function(i){return this.offsetTop>curPos+10}).first();
    if(notification.offset()) {
        jQuery(document.body).animate({scrollTop:notification.offset().top}, 200);
        zoomImage(notification);
    }
}

function moveToPrevNotification() {
    imgBoxHide();
    var curPos = jQuery(document).scrollTop();
    var notification = jQuery(".notification:has('.notification_right img')").filter(function(i){return this.offsetTop<curPos}).last();
    if(notification.offset()) {
        jQuery(document.body).animate({scrollTop:notification.offset().top}, 200);
        zoomImage(notification);
    }
}

function imgBoxHide() {
    imgBox.hide(50);
}
