(function() {
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (request.command === "option") {
//                setTimeout(function(){chrome.tabs.create({},function(){console.log("yeah")});},500);
                sendResponse({
                    isPosts: localStorage["posts"]||"true",
                    isFollowers: localStorage["followers"]||"false",
                    isNoticeAll: localStorage["noticeAll"]||"false",
                    isNoticeReblog: localStorage["noticeReblog"]||"false",
                    isNoticeLike: localStorage["noticeLike"]||"false",
                    isNoticeImg: localStorage["noticeImg"]||"false",
                    isNoticeRight: localStorage["noticeRight"]||"false",
                    isBox: localStorage["box"]||"false",
                    boxFixed: localStorage["boxfix"]||"false"
                });
            } else if(request.command === "addDate") {
                localStorage["lastDate"] = request.date;
                sendResponse({
                });
            } else if(request.command === "getDate") {
                sendResponse({
                    date: localStorage["lastDate"]||null
                });
            } else if(request.command === "boxfix") {
                localStorage["boxfix"] = request.fix;
                sendResponse({
                });
            } else if(request.command === "newtab") {
                var pid = request.pid;
                if(pid) chrome.tabs.create({url: "http://www.tumblr.com/dashboard/2/"+pid});
                else chrome.tabs.create({url: "http://www.tumblr.com/dashboard/2"});
            } else sendResponse({});
    });
})();
