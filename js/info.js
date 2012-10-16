(function(){

    var host, blogTitle, postsNumber;
    var storage = chrome.storage.local;
    var offsetTop, offsetLeft;
    var allowedStorageVolume = 0.5; // percentage of the total(0 to 1)
    var expire = 1000*60*60; // milliseconds
    var isPosts, isFollowers;
    var popup;

    chrome.extension.sendMessage({greeting: "hello", isPosts: "", isFollowers: ""}, function(response) {
        isPosts = response.isPosts;
        isFollowers = response.isFollowers;
        console.log(isPosts, isFollowers);

        if(isPosts === "true") {
            popup = jQuery("<div>").addClass("dsbdinfo_popup").appendTo(jQuery("body"));
            jQuery("div.post_info>a").live('mouseover', function(){ifHover(jQuery(this))});
            jQuery("div.post_info>a").live('mouseout', function(){ifHoverOut()});
        }

        if(isFollowers === "true") {
            jQuery("a.followers>span.count").hide();
        }
    });

    storage.clear(function(){console.log("storage is cleared.")});
    storage.getBytesInUse(function(bytes){console.log(bytes + " of " + chrome.storage.local.QUOTA_BYTES + " bytes is used.")});

    function ifHover(obj) {
        offsetTop = obj.offset().top;
        offsetLeft = obj.offset().left;

        host = jQuery(obj).attr("href").replace(/http:|\//g, "");
        safeHost = host.replace(/\./g, '\.');

        accessStorage();
    }

    function ifHoverOut() {
        popup.html("");
        jQuery(".dsbdinfo_popup").hide(100);
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
        popup.html(blogTitle + '<br>ポスト数:' + postsNumber);
        popup.css({
            "top": offsetTop,
            "left": offsetLeft
        }).show(100);
    }
})();
