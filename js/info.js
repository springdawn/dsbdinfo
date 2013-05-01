(function(){
    var host, blogTitle, postsNumber;
    var storage = chrome.storage.local;
    var offsetTop, offsetLeft;
    var allowedStorageVolume = 0.5; // percentage of the total(0 to 1)
    var expire = 1000*60*60; // milliseconds
    var popup;
    chrome.extension.sendMessage({command: "option"}, function(response) {
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
                jQuery(document).on("mouseenter", ".notification:has('.notification_right img')", function(e) {
                    var me = this;
                    if(timer) clearTimeout(timer);
                    timer = setTimeout(function() {
                        timer = null;
                        zoomImage(jQuery(me));
                    }, 350);
                }).on("mouseleave", ".notification:has('.notification_right img')", function(e) {
                    if(timer) clearTimeout(timer);
                    else {
                        imgBoxHide();
//                        setTimeout(function() {
//                            imgPop.html("");
//                        }, 50);
                    }
                });
                jQuery(document).on("keydown", jQuery.throttle(220,function(e) {
                    if(imgBox) imgBoxHide();
                    if((e.which!==74 && e.which!==75) || !e.shiftKey) return;
                    if(e.which===74) moveToNotification();
                    else if(e.which===75) moveToPrevNotification();
                }));
            }
        }
        if(isNoticeRight === "true") {
            jQuery("#recommended_tumblelogs").hide();
            jQuery("#tumblr_radar").hide();
            jQuery(".add_and_remove").hide();
        }
        if(isBox === "true" && jQuery("#posts").length > 0) {
            var dateRegex = /\d{1,2}:\d{2}([ap]m)?/;
            jQuery("#posts")[0].addEventListener('DOMNodeInserted',function(evt) {
                var target = jQuery(evt.target).is("li.post")? jQuery(evt.target): null;
                if(!target) return;
                var date = target.find("a.permalink").prop("title").match(dateRegex);
                if(date) chrome.extension.sendMessage({command:"addDate", date:date[0]}, function(response){});
            });
            showBox();
            var dateFirst = jQuery("li.post a.permalink").last().prop("title").match(dateRegex);
            if(dateFirst) chrome.extension.sendMessage({command:"addDate", date:dateFirst[0]}, function(response){});
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
