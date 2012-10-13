(function(){
    var popup = jQuery("<div>").addClass("dsbdinfo_popup").appendTo(jQuery("body"));
    var host, blogTitle, postsNumber;

    jQuery("div.post_info>a").live('mouseover', function(){ifHover(jQuery(this))});
    jQuery("div.post_info>a").live('mouseout', function(){ifHoverOut()});

    function ifHover(obj) {
        var offsetTop = obj.offset().top,
            offsetLeft = obj.offset().left;

        host = jQuery(obj).attr("href").replace(/http:|\//g, "");

        jQuery.get("http://api.tumblr.com/v2/blog/" + host + "/info", {api_key: "uvmddiGyiyHKS0ZGJSVqtEinfIVnyOVp3wUtBGJYPBGrgFKi9S"}, function(data){
            blogTitle = data.response.blog.title;
            postsNumber = data.response.blog.posts;
            popup.html(blogTitle + '<br>ポスト数:' + postsNumber);
            popup.css({
                "top": offsetTop,
                "left": offsetLeft
            }).show(100);
        });
    }

    function ifHoverOut() {
        popup.html("");
        jQuery(".dsbdinfo_popup").hide(100);
    }
})();
