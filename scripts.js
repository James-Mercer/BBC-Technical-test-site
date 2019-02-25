var articles = [null, null, null, null, null]; //Contains the JSON objects of the article JSONS
// Article src URLs hosted on myjson.com be used to get the JSONs
var articleSRC = ['https://api.myjson.com/bins/kzapm', 'https://api.myjson.com/bins/11cpui', 'https://api.myjson.com/bins/17whi2' , 'https://api.myjson.com/bins/wl90a' , 'https://api.myjson.com/bins/1350nu'];
var articleContainer; //the div element that contains all articles
var articleContainers = []; //main div elements that host the individual articles
var currentArticle = 0; // the current article

// Builds HTML elements from a provided JSON file in a specific format
function buildFromJSON(HTMLContainer, jsonObj) {
    
    console.log("parsing JSON object");
    console.log(jsonObj);
    var elementToModel = null;
    for ( var obj in jsonObj ) {
        console.log("THING: "+ obj);
        console.log(jsonObj[obj]);
        
        switch (obj) {    
            case 'title':
                var element = document.createElement("title");
                element.textContent = jsonObj[obj];
                HTMLContainer.appendChild(element);
            break;                   
            case 'body':
                var body = document.createElement('body');
                HTMLContainer.appendChild(body);
                for( var e in jsonObj[obj]){
                    buildFromJSON(body, jsonObj[obj][e]);
                }
            break;
            case 'type':
                switch(jsonObj[obj]){
                    case 'paragraph':
                        var p = document.createElement('p');
                        HTMLContainer.appendChild(p);
                        elementToModel = p;
                    break;
                    case 'heading':
                        var h = document.createElement('h1');
                        HTMLContainer.appendChild(h);
                        elementToModel = h;
                        break;
                    case 'image':
                        var image = document.createElement('img');
                        HTMLContainer.appendChild(image);
                        elementToModel = image;
                    break; 
                    case 'list':
                        var list = document.createElement('ul');
                        HTMLContainer.appendChild(list);
                        elementToModel = list;
                    break;
                }
            break; 
            case 'model':
                var element;
                if(elementToModel == null){
                    console.log("modelling container");
                    element = HTMLContainer;
                }else{
                    console.log("modelling element");
                    element = elementToModel;
                }
                for( var attribute in jsonObj[obj]){
                    console.log("Attribute " + attribute);
                    if(attribute == 'text'){
                        element.textContent = jsonObj[obj][attribute];
                    }else if(attribute == 'url'){
                        element.setAttribute('src',jsonObj[obj][attribute] )
                    }else if(attribute == 'items'){
                        for(var item in jsonObj[obj][attribute]){
                            var listItem = document.createElement('li');
                            listItem.textContent = jsonObj[obj][attribute][item];
                            element.appendChild(listItem);
                        }  
                    }else{
                        element.setAttribute(attribute,  jsonObj[obj][attribute])
                    }
                }
                elementToModel = null;
            break; 
        }
    }
}





//Initalises the article container & creates containers divs
// Loads the first two articles, sets the listeners for the next and prev
function init ( ) {
    articleContainer = document.querySelector('#article-container');
    
    for (var i = 0; i < articleSRC.length; i++){
        var art = document.createElement("div");
        art.setAttribute("id", "article-"+i);
        art.setAttribute("class", "article");
        articleContainer.appendChild(art);
        art.style.display = 'none';
        articleContainers[i] = art;
        
    }
    var next = document.querySelectorAll('#next-article');
    var prev = document.querySelectorAll('#prev-article');
    for(var b = 0; b < next.length; b++){
        next[b].addEventListener('click', nextArticle);
        prev[b].addEventListener('click', prevArticle);
    }
    
    //Load the first Article by default
    loadJSON( currentArticle );
    articleContainers[currentArticle].style.display = 'block'
    //Shows the current article number
    document.querySelector('#current-article-1').textContent = (currentArticle+1)+"/"+articleSRC.length;
    document.querySelector('#current-article-2').textContent = (currentArticle+1)+"/"+articleSRC.length;
    document.querySelector('#rating').style.display = 'none';
    
    
}

//Requests the JSON from a MyJson.com host link stored in the articles array
function requestJSON(callback, fileURL) {
    var request = new XMLHttpRequest();
    request.overrideMimeType("application/json");
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            callback(request.responseText);
        }
    };
    request.open('GET', fileURL, true);
   
    request.send();
    
}

//Loads a JSON article and creates it
function loadJSON(articleNumber){
    requestJSON(function loadCallback(response){
        articles[articleNumber] = JSON.parse(response);
        console.log("Loaded JSON article " + currentArticle + ": " + response);
        createArticle(articleNumber);
        
        //Add the article to the rating form
        var form = document.querySelector("#rating-form")
        
        //wrap in a div for layout manipulation
        var div = document.createElement('div');
        div.setAttribute('class', 'rating-div');
        form.insertBefore(div,document.querySelector('#submit-button').previousElementSibling);
        //Text for rating
        var t = document.createElement('p');
        t.textContent = articles[articleNumber]['title'];
        div.appendChild(t);
        //Select dropdown
        var select = document.createElement('select');
        select.setAttribute('name', 'article-rating-'+articleNumber);
        div.appendChild(select);
        for(var x = 1; x < 6; x++){
            var option = document.createElement('option');
            option.setAttribute('value', x);
            option.textContent = x;
            select.appendChild(option);
        }

    }, articleSRC[articleNumber]);
    //Loads the next article if necessary
    if(articleNumber < articles.length-1 && articleNumber == currentArticle){
        loadJSON(articleNumber+1);
    }
}


function createArticle(artNo){
    buildFromJSON(articleContainers[artNo], articles[artNo]);
}

//Show the previous article
function prevArticle(){
    document.querySelector('#rating').style.display = 'none';
    if(currentArticle > 0){
        //hide all
        for(var index = 0; index < articleContainers.length; index++){
            if(articleContainers[index] != null){
                articleContainers[index].style.display = "none";
            }
        }
        //decrement currnet
        currentArticle--;
        // show current
        articleContainers[currentArticle].style.display = 'block'
        //show current article number
        document.querySelector('#current-article-1').textContent = (currentArticle+1)+"/"+articleSRC.length;
        document.querySelector('#current-article-2').textContent = (currentArticle+1)+"/"+articleSRC.length;
    }else{
        console.log("ERROR: no previous articles")
    }
}

//show the next article or rating page
function nextArticle(){
    //hide all
    for(var index = 0; index < articleContainers.length; index++){
            if(articleContainers[index] != null){
                articleContainers[index].style.display = "none";
            }
        }
    if(currentArticle < articleSRC.length-1){
        // increment current
        currentArticle++;
        //show current
        articleContainers[currentArticle].style.display = 'block';
        //set current article
        document.querySelector('#current-article-1').textContent = (currentArticle+1)+"/"+articleSRC.length;
        document.querySelector('#current-article-2').textContent = (currentArticle+1)+"/"+articleSRC.length;
        // if not loaded create next
        if(currentArticle < articleSRC.length-1 && articles[currentArticle+1] == null){
            loadJSON(currentArticle+1)
        }
    }else if(currentArticle < articleSRC.length){
        
        // Show the rating page
        document.querySelector('#rating').style.display = 'block';
        currentArticle++;
        document.querySelector('#current-article-1').textContent = 'Rating Page';
        document.querySelector('#current-article-2').textContent = 'Rating Page';
    }
}
//stubbed POST function
function submit(){
    
}
window.addEventListener('load', init); //Execute Javascript when the page has loaded