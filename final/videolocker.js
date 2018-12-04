/**
 * Marcos Ayon - Philip Harlow
 * CS 337
 * Final Project
 * This contains the code for our final project,
 * where the page loads the information it will display
 * (the images).
 */
"use strict";
(function () {
  let url = "http://localhost:3000?mode=";
  let modeValueDesc = "description";
  let modeValueInfo = "info";
  let modeValueRev = "reviews";
  let modeValueBook = "videos";
  let title = "&title=";
  let bookName;
  let json = {};
  let bookReviews;
  let bookList;
  
  window.onload = function() {
    load();
    document.getElementById("youtubebutton").onclick = load;
    // document.getElementById("up").onclick = increase;
    // document.getElementById("down").onclick = decrease;
    document.getElementById("submit").onclick = search;
  };
  /**
  hides the singlevideo div and requests to get all the videos display info
  */
  function load() {
    document.getElementById("singlevideo").style.display = "none";
    fetch(url + modeValueBook)
      .then(checkStatus)
      .then(function(responseText) {
        json = JSON.parse(responseText);
        bookList = json.list;
        listVideos();
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  /**
  gets all the titles and covers of the videos provided using promises and adds
  them to the allvideos div
  */
  function listVideos() {
      let bookName;
      let folder;
      for(let i = 0; i < bookList.length; i++) {
        bookName = bookList[i].title;
        folder = bookList[i].folder;
        let divs = document.createElement("div");
        divs.id = folder;
        let image = document.createElement("img");

        let book = document.createElement("p");
        image.src = "videos/" + folder + "/cover.jpg";
        book.innerHTML = bookName;
        divs.appendChild(image);
        divs.appendChild(book);
        document.getElementById("allvideos").appendChild(divs);
        divs.onclick = showVideo; //when the thumbnail or title of a book is clicked
                                 //it will run the showVideo function
      }
  }
  /**
  clears the allbook div and fills out the singlevideo div with info
  */
  function showVideo() {
    bookName = this.id;
    document.getElementById("allvideos").innerHTML = "";
    document.getElementById("singlevideo").style.display = "";
    document.getElementById("thumbnail").src = "videos/" + this.id + "/cover.jpg";
    fetch(url + modeValueInfo + title + this.id)
      .then(checkStatus)
      .then(function(responseText) {
        json = JSON.parse(responseText);
        document.getElementById("up").innerHTML = json.author;
        document.getElementById("down").innerHTML = json.stars;
        
      })
      .catch(function(error) {
        console.log(error);
      });
      fetch(url + modeValueDesc + title + bookName)
      .then(checkStatus)
      .then(function(responseText) {
        json = JSON.parse(responseText);
        document.getElementById("description").innerHTML = json.desc;
      })
      .catch(function(error) {
        console.log(error);
      });
      fetch(url + modeValueRev + title + bookName)
      .then(checkStatus)
      .then(function(responseText) {
        json = JSON.parse(responseText);
        bookReviews = json.reviews;
        let reviewName;
        let reviewDiv;
        let review;
        for(let i = 0; i < bookReviews.length; i++) {
          reviewName = document.createElement("h3");
          review = document.createElement("p");
          reviewDiv = document.createElement("div");
          reviewName.innerHTML = bookReviews[i].name + " <span>" + bookReviews[i].stars + "<span/>";
          review.innerHTML = bookReviews[i].review;
          reviewDiv.appendChild(reviewName);
          reviewDiv.appendChild(review);
          document.getElementById("reviews").appendChild(reviewDiv);
        }
      })
      .catch(function(error) {
        console.log(error);
      });
      
  }
  /**
   * Runs when the search/submit button is clicked.
   * Will validate input
   */
  function search(){
    let searchBox = document.getElementById("search");
    let searchText = searchBox.value;
    //Validate user input==
    let res = searchText.match(/^[a-zA-Z\s]*$/g);
    if(res == null){
      //error in search box
      window.alert("Invalid search text - Letter characters and whitespace only");
      return;
    }
    //=====================
  }
  /** 
    * returns the response text if the status is in the 200s
  * otherwise rejects the promise with a message including the status
  */
  function checkStatus(response) { 
    console.log(response.status + "");
    console.log(response.statusText + "");
      if (response.status >= 200 && response.status < 300) {  
          return response.text();
      } 
      else if (response.status == 410) {
        return Promise.reject(new Error("Sorry, we couldn't find that page")); 
      } 
      else {
        return Promise.reject(new Error(response.status+": "+response.statusText)); 
      }
  }
})();