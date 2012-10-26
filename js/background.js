(function() {
    chrome.extension.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (request.greeting == "hello") {
                sendResponse({
                    farewell: "goodbye",
                    isPosts: localStorage["posts"]||"true",
                    isFollowers: localStorage["followers"]||"false",
                    isNoticeAll: localStorage["noticeAll"]||"false",
                    isNoticeReblog: localStorage["noticeReblog"]||"false",
                    isNoticeLike: localStorage["noticeLike"]||"false",
                    isBox: localStorage["box"]||"false"
                });
            }
    });
})();
