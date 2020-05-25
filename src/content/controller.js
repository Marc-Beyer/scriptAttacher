// Add js file
function addJS(file){
    let script = document.createElement("script");
    script.id = "scriptAttacher_" + file.name;
    script.className = "scriptAttacher_script";
    script.append(document.createTextNode(file.file));

    // Remove old scripts
    let oldScript = document.getElementById(script.id);
    while(oldScript !== null){
        oldScript.remove();
        oldScript = document.getElementById(script.id);
    }
    document.head.appendChild(script);
}

// Add script with src-link
function addScriptlink(file){
    let script = document.createElement("script");
    script.id = "scriptAttacher_" + file.name;
    script.className = "scriptAttacher_script";
    script.src =file.file;

    // Remove old scripts
    let oldScript = document.getElementById(script.id);
    while(oldScript !== null){
        oldScript.remove();
        oldScript = document.getElementById(script.id);
    }
    document.head.appendChild(script);
}

// Add css file
function addCSS(file){
    let style = document.createElement("style");
    style.type = "text/css";
    style.id = "scriptAttacher_" + file.name;
    style.className = "scriptAttacher_script";
    style.append(document.createTextNode(file.file));

    // Remove old styles
    let oldStyles = document.getElementById(style.id);
    while(oldStyles !== null){
        oldStyles.remove();
        oldStyles = document.getElementById(style.id);
    }
    document.head.appendChild(style);
}

// Handle incoming msgs
browser.runtime.onMessage.addListener((msg) => {
    console.log("msg", msg);
    if(msg.receiver !== "content_controller")
            return;
            
    if(msg.info === "addFiles"){
        for (let file of msg.addFiles) {
            switch (file.type) {
                case "js":
                    addJS(file);
                    break;
                case "css":
                    addCSS(file);
                    break;
                case "script-link":
                    addScriptlink(file);
                    break;
            
                default:
                    break;
            }
        }
        
    }
});

console.log("controller started");