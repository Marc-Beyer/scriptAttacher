//all files stored
let files;

// Creates a AddFileMsg and return it
function createAddFilesMsg(addFiles){
    return {
        receiver: "content_controller",
        info: "addFiles",
        addFiles: addFiles
    };
}

// Get all files that match the url
function getFilesWithUrl(url){
    let matchingFiles = [];
    for (let file of files) {
        for (let fileUrl of file.urls) {
            if(url.match(fileUrl)){
                console.log("FILE Matches " + url, file);
                matchingFiles.push(file);
            }
        }
    }
    return matchingFiles;
}

// Handle the onUpdated-event
async function handleTabUpdate(tabId, changeInfo, tabInfo) {
    if(changeInfo.status === "complete"){

        console.log(`Updated tab: ${tabId} with url ${tabInfo.url}`);

        // Send a msg to the content_controller with the files to add if there are files to add
        let addFiles = getFilesWithUrl(tabInfo.url);
        if(addFiles.length > 0){
            try {
                browser.tabs.sendMessage(tabId, createAddFilesMsg(addFiles));
            } catch (error) {
                // ERR
            }
        }
    }
}

// Set the defaultStorage
browser.runtime.onInstalled.addListener(details => {
    browser.storage.local.set(defaultStorage);
});

// Get the storage
function getStorage(){
    browser.storage.local.get(data => {
        files = data.files;

        // Remove old Listener
        if(browser.tabs.onUpdated.hasListener(handleTabUpdate)){
            browser.tabs.onUpdated.removeListener(handleTabUpdate);
        }

        // Listen for tab updates, that match filter.urls
        browser.tabs.onUpdated.addListener(handleTabUpdate);
    });
}

// If the storage has changed invoke getStorage() and update files 
browser.storage.onChanged.addListener(getStorage);

// Listen for msgs
browser.runtime.onMessage.addListener((msg, sender) => {
    if(msg.receiver !== "background_storage")
        return;

    if(msg.info === "getFiles"){
        return new Promise((resolve) => {
            resolve(files);
        });
    }

    if(msg.info === "fileEdited"){
        console.log("files before edit", files);
        if(msg.oldFile === undefined){
            if(msg.newFile !== undefined){
                files.push(msg.newFile);
            }
        }else{
            for (let file of files) {
                if(file.name === msg.oldFile.name){
                    if(msg.newFile === undefined){
                        files.splice(files.indexOf(file), 1);
                    }else{
                        files[files.indexOf(file)] = msg.newFile;
                    }
                }
            }
        }
        console.log("files after edit", files);
        
        browser.storage.local.set({files:files});
        return new Promise((resolve) => {
            resolve(files);
        });
    }

    if(msg.info === "filesLoaded"){
        files = msg.newFiles;
        browser.storage.local.set({files:files});
        return new Promise((resolve) => {
            resolve(files);
        });
    }
});

getStorage();