localStorage["oldestPostNum"] = null;
function getTimeFromKiritori() {
    jQuery.get("http://kiri-tori.tumblr.com", function(data) {
        var res = jQuery(data);
        var items = [];
        var posts = res.find(".post");
        items = trimString(posts);
        showTimeleapBox(items);
    });
}

function showTimeleapBox(items) {
    var box = jQuery("<ul>").attr("id", "dsbdinfo_timeleap");
    var boxTitle = jQuery("<li>").html("<span class='dsbdinfo_timeleap_title'>Jump to ...</span>");
    var boxItems = jQuery("<ul>");
    items.forEach(function(el) {
        var item = jQuery("<li>").html(el);
        boxItems.append(item);
    });
    boxItems.append(jQuery("<p>").addClass("dsbdinfo_timeleap load_next").html("▼"));
    box.append(boxTitle.append(boxItems)).prependTo(document.body);

    jQuery("#dsbdinfo_timeleap>li").hover(function() {jQuery(this).children("ul").slideDown(100)}, function() {jQuery(this).children("ul").hide()});
    jQuery(".dsbdinfo_timeleap.load_next").one("mouseenter", loadNext);
}

function loadNext() {
    jQuery.get("http://kiri-tori.tumblr.com/page/2", function(data) {
        var res = jQuery(data);
        var posts = res.find(".post");
        var lis = trimString(posts);
        var items = [];
        lis.forEach(function(el) {
            items.push(jQuery("<li>").addClass("insert").html(el));
        });
        jQuery("#dsbdinfo_timeleap>li>ul").find("p").remove().end().append(items).children(".insert").slideDown(100);
    });
}

function trimString(posts) {
    var items = [];
    var oldestPostNum = localStorage["oldestPostNum"];
    posts.each(function(i) {
        var timeReg = /(\d{2}\/\d{2})&nbsp;(\d{2}:\d{2})/;
        var timeString = jQuery(posts[i]).find("p").html().match(timeReg);
        var time = timeString[1]+" "+timeString[2];
        var link = jQuery(posts[i]).find("a.dsbdview").attr("href");
        var leapString = "<a href='"+link+"'>"+time+"</a>";
        var curPostNum = link.split("/").pop();
        if(curPostNum>=oldestPostNum) return true;
        localStorage["oldestPostNum"] = curPostNum;
        items.push(leapString);
    });
    return items;
}
