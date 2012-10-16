(function() {
    chrome.extension.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (request.greeting == "hello") {
                sendResponse({farewell: "goodbye", isPosts: localStorage["posts"]||"true", isFollowers: localStorage["followers"]||"false"});
            }
    });
})();
