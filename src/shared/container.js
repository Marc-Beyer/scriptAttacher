// A tamplate for a new file
let defaultFile = {
    name: "new file",
    isEnabled: false,
    type: "js",
    urls: ["^https*://www.example.com/*.*$"],
    file: "// Insert your code here //"
}

//defaultStorage is set when the the add-on is installed
const defaultStorage = {"files": [
    {
      "name": "jquery 3.5.1",
      "isEnabled": false,
      "type": "script-link",
      "urls": [
        ".*"
      ],
      "file": "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"
    },
    {
      "name": "random backgroundColor with jquery",
      "isEnabled": false,
      "type": "js",
      "urls": [
        ".*"
      ],
      "file": "function getRandomColor() {\n\tlet r = Math.floor(Math.random() * 256);\n\tlet g = Math.floor(Math.random() * 256);\n\tlet b = Math.floor(Math.random() * 256);\n\tlet letters = '0123456789ABCDEF';\n\tlet color = `rgb(${r},${g},${b})`;\n\tconsole.log(\"color\", color);\n\treturn color;\n}\n\nlet waitForJQuery = setInterval(function () {\n\tif (typeof $ != 'undefined') {\n\t\t$('body,html').css({'background-color': getRandomColor()});\n\tclearInterval(waitForJQuery);\n\t}\n}, 10);"
    },
    {
      "name": "hello google",
      "isEnabled": false,
      "type": "js",
      "urls": [
        "^https*://www.google.de/*.*$",
        "^https*://www.google.com/*.*$"
      ],
      "file": "console.log(\"Hello google!\");"
    },
    {
      "name": "hello google 2",
      "isEnabled": false,
      "type": "js",
      "urls": [
        "^https*://www.google.de/*.*$",
        "^https*://www.google.com/*.*$",
        "^https*://www.google..*$"
      ],
      "file": "console.log(\"Hello again!\");"
    },
    {
      "name": "nice google layout",
      "isEnabled": false,
      "type": "css",
      "urls": [
        "^https*://www.google.com/*$"
      ],
      "file": "#hplogo{\n\ttransform: rotate(20deg) translate(-200px, -100px);\n}\n\n#tsf{\n\ttransform: rotate(-20deg);\n}\n\n#main{\n\ttransform: rotate(20deg) translate(100px, 100px);\n}\n"
    },
    {
      "name": "Titillium Web Font",
      "isEnabled": false,
      "type": "other",
      "urls": [
        ".*"
      ],
      "file": "{\n\t\"_comment\":\"The 'other'-type has to be in json-format. all keys are attributes added to the node, exept 'tagName' and 'text'. 'tagName ' is the name of the node and 'text' the text appended as textnode\",\n\t\"tagName\":\"link\",\n\t\"href\":\"https://fonts.googleapis.com/css?family=Titillium+Web\",\n\t\"rel\":\"stylesheet\",\n\t\"text\":\"\"\n}"
    },
    {
      "name": "Netfilx Volume",
      "isEnabled": false,
      "type": "js",
      "urls": [
        "^https*://www.netflix.com/*.*$"
      ],
      "file": "// Insert your code here //\n\nlet videos = [];\nlet observer = new MutationObserver(function(mutations) {\n  mutations.forEach(function(mutation) {\n    if (!mutation.addedNodes) return\n\n    for (var i = 0; i < mutation.addedNodes.length; i++) {\n      if(mutation.addedNodes[i].tagName === \"VIDEO\"){\n\t\t\tvideos.push(mutation.addedNodes[i]);\n\t\t\tmutation.addedNodes[i].volume = input.value;\n\t\t}\n    }\n  })\n})\n\nobserver.observe(document.body, {\n    childList: true\n  , subtree: true\n  , attributes: false\n  , characterData: false\n})\n\nlet nav = document.getElementsByClassName(\"secondary-navigation\")[0];\n\nfunction inputChangeHandler(){\n\tconsole.log(\"input.value\", input.value);\n\tfor(let video of videos){\n\t\tvideo.volume = input.value;\n\t}\n}\n\nlet div = document.createElement(\"div\");\nlet input = document.createElement(\"input\");\n\ninput.type = \"range\";\ninput.addEventListener(\"change\", inputChangeHandler);\ninput.min = 0;\ninput.max = 1;\ninput.step = 0.01;\ninput.value = 0.3;\n\ndiv.append(input);\nnav.append(div);"
    }
  ]}
