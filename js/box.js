function showBox(){
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
        render();
    });
    function render() {obj.prependTo("body")};
    var dateString = "load: "+now.toFormat("MM/DD HH24:MI:SS");
    chrome.extension.sendMessage({command: "getDate"}, function(response) {
        var lastDate = response.date;
        var lastDateString = "";
        if(lastDate) {
            var dateParts = lastDate.match(/\d{1,2}|:|[ap]m/g);
            if(dateParts[3]) now.setHours(dateParts[3]==="am"? (dateParts[0]==="12"? 0:parseInt(dateParts[0])): (dateParts[0]==="12"? 12:  parseInt(dateParts[0]+12)));
            else now.setHours(parseInt(dateParts[0]));
            now.setMinutes(parseInt(dateParts[2]));
            lastDateString = now.toFormat("HH24:MI");
        }
        var prevPostDate = "prev last seen: "+lastDateString;
        obj.html(dateString+"<br>\n"+prevPostDate);
        obj.draggable({stop: function(e, ui){
            storage.set({boxOffset: {top: ui.offset.top, left: ui.offset.left}});
        }});
        obj.dblclick(function() {
            jQuery(this).toggleClass("fixed");
        });
    });
}
