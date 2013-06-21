(function(){
    var host, blogTitle, postsNumber;
    var storage = chrome.storage.local;
    var offsetTop, offsetLeft;
    var allowedStorageVolume = 0.5; // percentage of the total(0 to 1)
    var expire = 1000*60*60; // milliseconds
    var popup;

    jQuery(document).keydown(function(e) {
        if(String.fromCharCode(e.which)==="N"&&e.altKey&&!e.shiftKey&&!e.ctrlKey&&!e.metaKey) {
            var height = jQuery(document).scrollTop();
            var targetPost = null;
            jQuery("div.post[data-post-id]").each(function() {
                if(this.offsetTop > height) {
                    targetPost = this;
                    return false;
                }
            });
            if(targetPost) {
                var targetId = parseInt(jQuery(targetPost).attr("data-post-id"));
                chrome.runtime.sendMessage({command: "newtab", pid: targetId+1}, function(response) {
                    targetPost = null;
                });
            }
        }
    });

    chrome.runtime.sendMessage({command: "option"}, function(response) {
        var isPosts = response.isPosts;
        var isFollowers = response.isFollowers;
        var isNoticeAll = response.isNoticeAll;
        var isNoticeReblog = response.isNoticeReblog;
        var isNoticeLike = response.isNoticeLike;
        var isNoticeImg = response.isNoticeImg;
        var isNoticeRight= response.isNoticeRight;
        var isBox = response.isBox;
        var boxfix = response.boxFixed;
        var isTimeleap = response.isTimeleap;
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
            var posts = document.querySelector('#posts');
            jQuery("li.notification").hide();
            var noteobs = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    var target = jQuery(mutation.addedNodes);
                    if(target.is("li.notification")) target.hide();
                });
            });
            noteobs.observe(posts, {childList: true});
        } else if(isNoticeReblog === "true" || isNoticeLike === "true" || isNoticeImg === "true") {
            var posts = document.querySelector('#posts');
            if(isNoticeReblog === "true") {
                jQuery("li.notification_reblog").hide();
                var rbobs = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        var target = jQuery(mutation.addedNodes);
                        if(target.is("li.notification_reblog")) target.hide();
                    });
                });
                rbobs.observe(posts, {childList: true});
            }
            if(isNoticeLike === "true") {
                jQuery("li.notification_like").hide();
                var lkobs = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        var target = jQuery(mutation.addedNodes)
                        if(target.is("li.notification_like")) target.hide();
                    });
                });
                lkobs.observe(posts, {childList: true});
            }
            if(isNoticeImg === "true") {
                var timer = null;
                var poped = null;
                jQuery(document).on("mouseenter", "li.notification:has('div.notification_right img'),div.dsbdinfo_img_popup", function(e) {
                    if(jQuery(e.toElement).parent().is("div.dsbdinfo_img_popup")) return;
                    var me = jQuery(this);
                    if(timer) clearTimeout(timer);
                    timer = setTimeout(function() {
                        timer = null;
                        zoomImage(me);
                        poped = me;
                    }, 350);
                }).on("mouseleave", "li.notification:has('div.notification_right img'),div.dsbdinfo_img_popup", function(e) {
                    var toElm = jQuery(e.toElement);
                    if((poped&&toElm.parents().is(poped))||toElm.parents().is("div.dsbdinfo_img_popup")) return;
                    if(timer) clearTimeout(timer);
                    else {
                        imgBoxHide();
                        poped = null;
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
            jQuery("a.add_and_remove").hide();
        }
        if(isBox === "true" && jQuery("#posts").length > 0) {
            var dateRegex = /\d{1,2}:\d{2}([ap]m)?/;
            var posts = document.querySelector('#posts');
            var boxdateobs = new MutationObserver(function(mutations) {
                mutations.some(function(mutation) {
                    var target = jQuery(mutation.addedNodes).toArray().reverse();
                    jQuery(target).each(function() {
                        if(jQuery(this).is("li.post_container")) {
                            getDate(jQuery(this).find("div.post"));
                            return false;
                        }
                    });
                });
            });
            boxdateobs.observe(posts, {childList: true});
            showBox(boxfix === "true");
//            var dateFirst = jQuery("div.post a.permalink").last().prop("title").match(dateRegex);
//            getDate(jQuery("div.post[id!=new_post]").last());
        }
        if(isTimeleap === "true") {
          getTimeFromKiritori();
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
