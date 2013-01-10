(function(){
    var host, blogTitle, postsNumber;
    var storage = chrome.storage.local;
    var offsetTop, offsetLeft;
    var allowedStorageVolume = 0.5; // percentage of the total(0 to 1)
    var expire = 1000*60*60; // milliseconds
    var popup;
    chrome.extension.sendMessage({greeting: "hello"}, function(response) {
        var isPosts = response.isPosts;
        var isFollowers = response.isFollowers;
        var isNoticeAll = response.isNoticeAll;
        var isNoticeReblog = response.isNoticeReblog;
        var isNoticeLike = response.isNoticeLike;
        var isNoticeImg = response.isNoticeImg;
        var isNoticeRight= response.isNoticeRight;
        var isBox = response.isBox;
        if(isPosts === "true") {
            popup = jQuery(document.createElement("div")).addClass("dsbdinfo_popup").appendTo("body");
            jQuery(document).on("mouseover","div.post_info>a", function(event) {
                ifHover(jQuery(this));
            }).on("mouseout","div.post_info>a", function(event) {
                ifHoverOut();
            });
        }
        if(isFollowers === "true") {
            var followersLink = jQuery("a.followers"),
            followersCount = followersLink.children("span.count");
            followersCount.hide();
            followersLink.hover(function() {followersCount.show();}, function() {followersCount.hide();});
        }
        if(isNoticeAll === "true") {
                jQuery("li.notification").hide();
                jQuery("#posts")[0].addEventListener('DOMNodeInserted',function(evt) {
                    var target = jQuery(evt.target).is("li.notification")? jQuery(evt.target): null;
                    target? target.hide(): null;
                });
        } else if(isNoticeReblog === "true" || isNoticeLike === "true" || isNoticeImg === "true") {
            if(isNoticeReblog === "true") {
                jQuery(".notification_reblog").hide();
                jQuery("#posts")[0].addEventListener('DOMNodeInserted',function(evt) {
                    var target = jQuery(evt.target).is(".notification_reblog")? jQuery(evt.target): null;
                    target? target.hide(): null;
                });
            }
            if(isNoticeLike === "true") {
                jQuery(".notification_like").hide();
                jQuery("#posts")[0].addEventListener('DOMNodeInserted',function(evt) {
                    var target = jQuery(evt.target).is(".notification_like")? jQuery(evt.target): null;
                    target? target.hide(): null;
                });
            }
            if(isNoticeImg === "true") {
                var timer = null;
                var imgPop = jQuery(document.createElement("div")).addClass("dsbdinfo_img_popup").appendTo("body");
                jQuery(document).on("mouseenter", ".notification:has('.notification_right img')", function(e) {
                    var me = this;
                    if(!timer) {
                        timer = setTimeout(function() {
                            timer = null;
                            var imgObj = jQuery(me).find(".notification_right img");
                            var imgUrl = imgObj.attr("src");
                            imgUrl = imgUrl.replace("_75sq.", "_100.");
                            var offsets = imgObj.offset();
                            imgPop.html("<img src='"+imgUrl+"'>").css({"top":offsets.top, "left":offsets.left}).show(100);
                        }, 20);
                    }
                }).on("mouseleave", ".notification:has('.notification_right img')", function(e) {
                    setTimeout(function() {
                        imgPop.hide().html("");
                    }, 20);
                });
            }
        }
        if(isNoticeRight === "true") {
            jQuery("#recommended_tumblelogs").hide();
            jQuery("#tumblr_radar").hide();
            jQuery(".add_and_remove").hide();
        }
        if(isBox === "true" && jQuery("#posts").length > 0) {
            showBox();
        }
    });
    storage.getBytesInUse(function(bytes){console.log(bytes + " of " + chrome.storage.local.QUOTA_BYTES + " bytes is used.")});
    function ifHover(obj) {
        offsetTop = obj.offset().top;
        offsetLeft = obj.offset().left;
        host = jQuery(obj).attr("href").replace(/http:|\//g, "");
        safeHost = host.replace(/\./g, '\.');
        accessStorage();
    }
    function ifHoverOut() {
        popup.html("").hide(100);
    }

    function accessStorage() {
        storage.get(safeHost, function(data) {
            if(jQuery.isEmptyObject(data)===false) {
                if(Date.now() - data[safeHost].create > expire) {
                    storage.remove(safeHost);
                    getInfo();
                    return;
                }
                blogTitle = data[safeHost].title;
                postsNumber = data[safeHost].posts;
                popInfo();
                return;
            } else {
                getInfo();
                return;
            }
        });
    }
    function getInfo() {
        jQuery.get("http://api.tumblr.com/v2/blog/" + host + "/info", {api_key: "uvmddiGyiyHKS0ZGJSVqtEinfIVnyOVp3wUtBGJYPBGrgFKi9S"}, function(data){
            blogTitle = data.response.blog.title;
            postsNumber = data.response.blog.posts;
            storage.getBytesInUse(function(bytes) {
                if(bytes/storage.QUOTA_BYTES <= allowedStorageVolume) {
                    var setData = {};
                    setData[safeHost] = {title: blogTitle, posts: postsNumber, create: Date.now()};
                    storage.set(setData);
                }
            });
            popInfo();
        });
    }
    function popInfo() {
        popup.html(blogTitle + '<br>posts: ' + postsNumber).css({
            "top": offsetTop,
            "left": offsetLeft
        }).show(100);
    }
})();
