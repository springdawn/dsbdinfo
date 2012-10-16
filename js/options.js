jQuery(document).ready(function() {
    var elPosts = document.getElementById("postsShow");
    var elFollowers = document.getElementById("followersShowRight");
    elPosts.checked = jQuery.isEmptyObject(localStorage["posts"])? true: localStorage["posts"]==="true"? true: false;
    elFollowers.checked = jQuery.isEmptyObject(localStorage["followers"])? false: localStorage["followers"]==="true"? true: false;
    jQuery("#postsShow").click(function() {
        console.log("posts=" + elPosts.checked);
        localStorage["posts"] = elPosts.checked;
    });
    jQuery("#followersShowRight").click(function() {
        console.log("followers=" + elFollowers.checked);
        localStorage["followers"] = elFollowers.checked;
    });
});
