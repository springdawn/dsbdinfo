(function() {
    chrome.extension.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (request.command === "option") {
                sendResponse({
                    isPosts: localStorage["posts"]||"true",
                    isFollowers: localStorage["followers"]||"false",
                    isNoticeAll: localStorage["noticeAll"]||"false",
                    isNoticeReblog: localStorage["noticeReblog"]||"false",
                    isNoticeLike: localStorage["noticeLike"]||"false",
                    isNoticeImg: localStorage["noticeImg"]||"false",
                    isNoticeRight: localStorage["noticeRight"]||"false",
                    isBox: localStorage["box"]||"false"
                });
            } else if(request.command === "addDate") {
                localStorage["lastDate"] = request.date;
                sendResponse({
                });
            } else if(request.command === "getDate") {
                sendResponse({
                    date: localStorage["lastDate"]||null
                });
            }
    });
})();
