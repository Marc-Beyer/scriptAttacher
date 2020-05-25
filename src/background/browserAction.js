{
    // The tabId of the active optionspage
    let activeOptionsTabId;
    
    // Open a new optionsPage
    async function createOptionsPage(){
        if(activeOptionsTabId === undefined){
            let tab = await browser.tabs.create({
                active: true,
                url: "./ui/options/options.html"
            });
            activeOptionsTabId = tab.id;
        }else{
            // Update the options tab and set it active
            let tab = await browser.tabs.update(activeOptionsTabId, {active:true});

            // Focus the options tab
			await browser.windows.update(tab.windowId,{focused: true});
        }
    }

    // If the url of the optionPage is changed set activeOptionsTabId to undefined
	browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if(tabId === activeOptionsTabId){
            if(changeInfo.url !== undefined && changeInfo.url !== browser.runtime.getURL("./ui/options/options.html")){
                activeOptionsTabId = undefined;
            }
        }
	});

    // If the optionspag is closed set activeOptionsTabId to undefined 
    browser.tabs.onRemoved.addListener((tabId) => {
		if(tabId === activeOptionsTabId)
            activeOptionsTabId = undefined;
	});

    // Listen for msgs
    browser.runtime.onMessage.addListener((msg, sender) => {
		if(msg.receiver !== "background_browser_action")
			return;

		if(msg.info === "openOptions"){
			createOptionsPage();
		}
    });
}