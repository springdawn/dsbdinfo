function showBox(boxfix){
    var storage = chrome.storage.local;
    var now = new Date();
    var obj = jQuery("<div>").addClass("dsbdinfo_draggable_box");
    var offset = {};
    storage.get("boxOffset", function(data) {
        if(jQuery.isEmptyObject(data)) {
            obj.css({top: 0, left: 0});
            render();
            return;
        }
        offset.top = data.boxOffset.top;
        offset.left = data.boxOffset.left;
        obj.css({top: offset.top, left: offset.left});
        if(boxfix) obj.addClass("fixed");
        render();
    });
    function render() {obj.prependTo("body")};
    var dateString = "load: "+now.toFormat("MM/DD HH24:MI:SS");
    chrome.runtime.sendMessage({command: "getDate"}, function(response) {
        var lastDate = parseInt(response.date);
        var lastDateString = "";
        if(lastDate) {
            var dateObj = new Date(lastDate);
            lastDateString = dateObj.toFormat("MM/DD HH24:MI:SS");
        }
        jQuery("<span>").html("prev oldest: ").addClass("dsbdinfo_time");
        var prevPostDate = "prev oldest: "+lastDateString;
        obj.html(dateString+"<br>\n"+prevPostDate);
        obj.draggable({stop: function(e, ui){
            storage.set({boxOffset: {top: ui.offset.top, left: ui.offset.left}});
        }});
        obj.dblclick(function() {
            jQuery(this).toggleClass("fixed");
            chrome.runtime.sendMessage({command: "boxfix", fix: jQuery(this).hasClass("fixed")}, function(response){});
        });
    });
}

function getDate(post) {
    var postId = post.attr("data-post-id");
    var baseBlogName = post.attr("data-tumblelog-name");
    var requestUrl = "http://api.tumblr.com/v2/blog/"+baseBlogName+".tumblr.com/posts";
    jQuery.get(requestUrl, {api_key: "uvmddiGyiyHKS0ZGJSVqtEinfIVnyOVp3wUtBGJYPBGrgFKi9S", id: postId}, function(data){
        var timestamp = data.response.posts[0].timestamp;
        var date = timestamp*1000;
        chrome.runtime.sendMessage({command: "addDate", date: date}, function(reseponse){});
    });
}
