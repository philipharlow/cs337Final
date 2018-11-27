"use strict";
(function () {
  let url = "http://localhost:3000?mode=";
  let modeValueDesc = "description";
  let modeValueInfo = "info";
  let modeValueRev = "reviews";
  let modeValueBook = "books";
  let title = "&title=";
  let bookName;
  let json = {};
  let bookReviews;
  let bookList;
  
  window.onload = function() {
    load();
    document.getElementById("back").onclick = load;
  };
  /**
  hides the singlebook div and requests to get all the books display info
  */
  function load() {
    document.getElementById("singlebook").style.display = "none";
    fetch(url + modeValueBook)
      .then(checkStatus)
      .then(function(responseText) {
        json = JSON.parse(responseText);
        bookList = json.list;
        listBooks();
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  /**
  gets all the titles and covers of the books provided using promises and adds
  them to the allbooks div
  */
  function listBooks() {
      let bookName;
      let folder;
      for(let i = 0; i < bookList.length; i++) {
        bookName = bookList[i].title;
        folder = bookList[i].folder;
        let divs = document.createElement("div");
        divs.id = folder;
        let image = document.createElement("img");
        let book = document.createElement("p");
        image.src = "books/" + folder + "/cover.jpg";
        book.innerHTML = bookName;
        divs.appendChild(image);
        divs.appendChild(book);
        document.getElementById("allbooks").appendChild(divs);
        divs.onclick = showBook; //when the cover or title of a book is clicked
                                 //it will run the showBook function
      }
  }
  /**
  clears the allbook div and fills out the singlebook div with info
  */
  function showBook() {
    bookName = this.id;
    document.getElementById("allbooks").innerHTML = "";
    document.getElementById("singlebook").style.display = "";
    document.getElementById("cover").src = "books/" + this.id + "/cover.jpg";
    fetch(url + modeValueInfo + title + this.id)
      .then(checkStatus)
      .then(function(responseText) {
        json = JSON.parse(responseText);
        document.getElementById("title").innerHTML = json.title;
        bookName = json.title;
        document.getElementById("author").innerHTML = json.author;
        document.getElementById("stars").innerHTML = json.stars;
        
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