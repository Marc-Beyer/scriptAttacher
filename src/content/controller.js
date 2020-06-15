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
    script.className = "scriptAttacher_scriptlink";
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
    style.className = "scriptAttacher_css";
    style.append(document.createTextNode(file.file));

    // Remove old styles
    let oldStyles = document.getElementById(style.id);
    while(oldStyles !== null){
        oldStyles.remove();
        oldStyles = document.getElementById(style.id);
    }
    document.head.appendChild(style);
}

// Add other file
function addOther(file){
    jsonFile = JSON.parse(file.file);
    let other = document.createElement(jsonFile.tagName);
    if(jsonFile.text !== undefined){
        other.append(document.createTextNode(jsonFile.text));
    }
    for (let key of Object.keys(jsonFile)) {
        if(key !== "tagName" && key !== "text"){
            other.setAttribute(key, jsonFile[key]);
        }
    }
    other.id = "scriptAttacher_" + file.name;
    other.className = "scriptAttacher_other";
    document.head.appendChild(other);
}

// Check the type of the file and add it
function addFile(file){
    if(file.isEnabled !== false){
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
            case "other":
                addOther(file);
                break;
        
            default:
                break;
        }
    }
}

// Handle incoming msgs
browser.runtime.onMessage.addListener((msg) => {
    if(msg.receiver !== "content_controller")
            return;
            
    if(msg.info === "addFiles"){
        for (let file of msg.addFiles) {
            addFile(file);
        }
    }

    if(msg.info === "editedFile"){
        let oldScript = document.getElementById("scriptAttacher_" + msg.editedFile.name);
        if(oldScript !== null){
            oldScript.remove();
        }
        addFile(msg.editedFile);
    }
});