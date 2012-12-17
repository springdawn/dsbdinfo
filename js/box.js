function showBox(){
    var storage = chrome.storage.local;
    var now = new Date();
    var obj = jQuery("<div>").addClass("dsbdinfo_draggable_box");
    var offset = {};
    storage.get("boxOffset", function(data) {
        if(jQuery.isEmptyObject(data)) {
            obj.css({position: "absolute", top: 0, left: 0});
            render();
            return;
        }
        offset.top = data.boxOffset.top;
        offset.left = data.boxOffset.left;
        obj.css({position: "absolute", top: offset.top, left: offset.left});
        render();
    });
    function render() {obj.prependTo("body")};
    obj.html("last loading: "+now.toFormat("MM/DD HH24:MI:SS"));
    obj.draggable({stop: function(e, ui){
        storage.set({boxOffset: {top: ui.offset.top, left: ui.offset.left}});
    }});
}
