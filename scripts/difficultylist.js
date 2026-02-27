// Initialization
const link = "https://raw.githubusercontent.com/Ethan76167/TRIA.OS-Difficulty-List/refs/heads/main/data"
var result, fetched
var listArray = []

// Fetch data
fetch(link)
.then(function(response) {
    response.text().then(function(text) {
    result = text;

    compileData()
});});

// Extract DATA!
function extractVideoId(url) {
    var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);

    if (match && match[2].length == 11) {
        return match[2];
    } else {
        return null;
    }
}

// Compile data
function compileData() {
    var separated = result.split('\n')
    var iteration

    // Get valid lines
    for (let i = 0; i < separated.length; i++) {
        iteration = separated[i]
        if (iteration[0] + iteration[1] == "//") {
            var newArray = {
                Overview: {
                    Rating: "",
                    Name: "",
                    Creators: "",
                    ID: "",
                    Video: ""
                },
                Meta: {
                    SkillCode: "",
                    HasAwards: "",
                    HasMedal: "",
                    MapLength: "",
                    Instances: "",
                    Buttons: "",
                    Music: "",
                    Date: ""
                },
                Description: "",
                Victors: ""
            }

            // GET: Overview
            var rating = iteration.match(/[\d.]+[^\]]/g)
            newArray.Overview.Rating = rating[rating.length - 1]

            newArray.Overview.Creators = separated[i + 2].substring(10)
            newArray.Overview.Creators[0] = newArray.Overview.Creators[0].substring(10)
            
            newArray.Overview.ID = separated[i + 1].substring(4)
            newArray.Overview.Video = extractVideoId(separated[i + 3].substring(6))
            newArray.Overview.Name = iteration.match(/[^// ]+[^]+[^ \[+\d+.+\]]/g)[0]

            // GET: Technical
            newArray.Meta.Date = separated[i + 6].substring(11)
            newArray.Meta.Music = separated[i + 7].substring(7)
            newArray.Meta.MapLength = separated[i + 8].substring(8)
            newArray.Meta.Instances = separated[i + 9].substring(11)
            newArray.Meta.Buttons = separated[i + 10].substring(9)

            // GET: Select
            var skillCode = ""
            var awards = 0

            if (separated[i + 14].substring(3, 4) == "#") {skillCode = skillCode + "0"}
            if (separated[i + 15].substring(3, 4) == "#") {skillCode = skillCode + "1"}
            if (separated[i + 16].substring(3, 4) == "#") {skillCode = skillCode + "2"}
            if (separated[i + 17].substring(3, 4) == "#") {skillCode = skillCode + "3"}
            if (separated[i + 18].substring(3, 4) == "#") {skillCode = skillCode + "4"}
            if (separated[i + 19].substring(3, 4) == "#") {skillCode = skillCode + "5"}
            
            if (separated[i + 21].substring(3, 4) == "#") {awards = 1}
            if (separated[i + 22].substring(3, 4) == "#") {awards = 2}

            if (separated[i + 24].substring(3, 4) == "#") {newArray.Meta.HasMedal = "Yes"}
            else {newArray.Meta.HasMedal = "No"}

            newArray.Meta.SkillCode = skillCode
            newArray.Meta.HasAwards = awards

            // GET: Description
            newArray.Description = separated[i + 27]

            // GET: Victors
            try {
                newArray.Victors = separated[i + 30].split(", ")
            } catch (error) {console.log("hi")}

            // Push list
            listArray.push(newArray)
        }
    }

    // Assign data
    var currentDifficulty = 0
    const diffIds = ["#eternal", "#divine", "#extreme", "#insane", "hard", "#normal", "#easy"]
    const diffColors = [
        "#ffffff",
        "#ff00ea",
        "#ff8800",
        "#ae00ff",
        "#ff0000",
        "#eeff00",
        "#54ff45"
    ]

    for (let i = 0; i < listArray.length; i++) {
        var map = document.querySelector("#template").cloneNode(true)
        var mapData = listArray[i]

        // Check if current difficulty has changed
        var mainDifficulty = Math.floor(mapData.Overview.Rating)

        if (mainDifficulty != (currentDifficulty + 1)) {
            currentDifficulty = mainDifficulty - 1
            var difficultyGroup = document.querySelector(diffIds[7 - mainDifficulty])

            document.querySelector("#listScroller").appendChild(difficultyGroup)
            difficultyGroup.style.display = "flex"
        }

        map.style.display = "flex"
        map.id = i

        // Customize data
        var upperDetails = map.querySelector(".infoLayout").querySelector("#upperDetails")
        var lowerDetails = map.querySelector(".infoLayout").querySelector("#lowerDetails")

        upperDetails.querySelector("#rating").style.color = diffColors[6 - currentDifficulty]
        upperDetails.querySelector("#rating").innerText = "#" + (i + 1) + " [" + mapData.Overview.Rating + "] "
        upperDetails.querySelector("#name").innerText = mapData.Overview.Name
        
        lowerDetails.querySelector("#creators").innerText = "by " + mapData.Overview.Creators
        lowerDetails.querySelector("#id").innerText = mapData.Overview.ID

        map.querySelector(".youtubeVideo").src = "https://www.youtube.com/embed/" + mapData.Overview.Video

        var mapLabels = map.querySelector(".infoLayout").querySelector("#labels")
        mapLabels.querySelector("#awards").src = "../assets/TRIA/Awards/" + mapData.Meta.HasAwards + ".png"

        // Awards
        switch (mapData.Meta.HasAwards) {
            
            case 1:
                map.querySelector(".youtubeVideo").style.border = "2px solid"
                map.querySelector(".youtubeVideo").style.borderImageSlice = "1"
                map.querySelector(".youtubeVideo").style.borderImage = "linear-gradient(45deg, #ff00aa 0%, #ffee00 100%) 1"
                
                break;
            case 2:
                map.querySelector(".youtubeVideo").style.border = "2px solid"
                map.querySelector(".youtubeVideo").style.borderImageSlice = "1"
                map.querySelector(".youtubeVideo").style.borderImage = "linear-gradient(45deg, #ff6600 0%, #eeff00 100%) 1"
                
                break;
            default:
                map.querySelector(".youtubeVideo").style.border = "2px solid"
                map.querySelector(".youtubeVideo").style.borderColor = "#ffffff"

                break;
        }

        for (let i = 0; i < mapData.Meta.SkillCode.length; i++) {
            mapLabels.querySelector("#skill" + mapData.Meta.SkillCode[i]).style.opacity = "100%"
        }

        // Expanded Layout
        map.querySelector("#titleBlock").innerText = mapData.Overview.Name

        // Victors
        if (mapData.Victors) {
            map.querySelector("#tenVictors").querySelector(".victorPlaceholder").style.display = "none"

            for (let i = 0; i < mapData["Victors"].length; i++) {
                map.querySelector("#tenVictors").querySelector("#v" + i).style.display = "flex"
                map.querySelector("#tenVictors").querySelector("#v" + i).innerText = "[#" + (i + 1) + "] " + mapData.Victors[i]
            }
        }

        // Technical
        map.querySelector("#stats").querySelector("#buttonCount").querySelector("p").innerText = mapData.Meta.Buttons
        map.querySelector("#stats").querySelector("#instances").querySelector("p").innerText = mapData.Meta.Instances
        map.querySelector("#stats").querySelector("#mapLength").querySelector("p").innerText = mapData.Meta.MapLength
        
        // Description
        map.querySelector("#description").querySelector("#descriptionText").innerText = mapData.Description
        map.querySelector("#description").querySelector("#music").innerText = mapData.Meta.Music
        map.querySelector("#description").querySelector("#date").innerText = mapData.Meta.Date
        
        // Medal
        map.querySelector("#medalStatus").querySelector("img").src = "../assets/TRIA/Medal/" + mapData.Meta.HasMedal + ".png"

        // Merge into list
        document.querySelector("#listScroller").appendChild(map)
    }

    console.log(listArray)
    console.log("Complete! Loaded " + listArray.length + " maps.")
}

// Expand information
var currentlyExpanded
function expandDetails(source) {
    if (currentlyExpanded == source) {
        source.querySelector(".expandedLayout").style.display = "none"
        source.querySelector("#divider").style.display = "none"
        currentlyExpanded = ""
    } else {
        if (currentlyExpanded) {
            currentlyExpanded.querySelector("#divider").style.display = "none"
            currentlyExpanded.querySelector(".expandedLayout").style.display = "none"
        }

        source.querySelector(".expandedLayout").style.display = "flex"
        source.querySelector("#divider").style.display = "flex"
        currentlyExpanded = source
    }
}

// Switch page on mobile or smaller screens
var currentPage = "list"

function switchPage(viewSection) {
    switch (viewSection) {
        case "list":
            currentPage = "list"
            document.querySelector("#buttons").querySelector("#viewList").className = "active"
            document.querySelector("#buttons").querySelector("#viewBulletin").className = ""

            document.querySelector("#scrollers").querySelector("#listScroller").style.display = "block"
            document.querySelector("#scrollers").querySelector("#bulletin").style.display = "none"
            break;
        case "bulletin":
            currentPage = "bulletin"
            document.querySelector("#buttons").querySelector("#viewList").className = ""
            document.querySelector("#buttons").querySelector("#viewBulletin").className = "active"
    
            document.querySelector("#scrollers").querySelector("#listScroller").style.display = "none"
            document.querySelector("#scrollers").querySelector("#bulletin").style.display = "block"
            break;
    }   
}

// In case of switch failure
addEventListener("resize", function() {
    if (window.innerWidth > 1042) {
        document.querySelector("#scrollers").querySelector("#listScroller").style.display = "block"
        document.querySelector("#scrollers").querySelector("#bulletin").style.display = "block"
    } else if (window.innerWidth <= 1042) {
        if (currentPage == "list") {
            document.querySelector("#buttons").querySelector("#viewList").className = "active"
            document.querySelector("#buttons").querySelector("#viewBulletin").className = ""

            document.querySelector("#scrollers").querySelector("#listScroller").style.display = "block"
            document.querySelector("#scrollers").querySelector("#bulletin").style.display = "none"
        } else {
            document.querySelector("#buttons").querySelector("#viewList").className = ""
            document.querySelector("#buttons").querySelector("#viewBulletin").className = "active"
    
            document.querySelector("#scrollers").querySelector("#listScroller").style.display = "none"
            document.querySelector("#scrollers").querySelector("#bulletin").style.display = "block"
        }
    }
})

// Check scroll even
/*

var lastObject = document.querySelector('#lastBulletin');
var hideBulletinOnScroll = false
var savePosition

window.onscroll = function(){
    //BOTTOM
    if(lastObject.getBoundingClientRect().bottom <= 0){
        document.querySelector("#scrollers").querySelector("#bulletin").style.display = "none"

        if (hideBulletinOnScroll == false) {
            savePosition = window.scrollY;
            hideBulletinOnScroll = true
        }
    }
    
    if (savePosition > window.scrollY) {
        document.querySelector("#scrollers").querySelector("#bulletin").style.display = "block"
        document.querySelector("#scrollers").querySelector("#listScroller").style.width = "100%"
        document.querySelector("#scrollers").querySelector("#listScroller").style.transition = "ease-out 500ms"
        
        hideBulletinOnScroll = false
    }
}
    
*/