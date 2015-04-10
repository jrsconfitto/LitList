//================VARIABLES===============================================

var emptyListFiller =
	'<li class="empty">'+
		'<p id="listEmptyText">Your list is empty!</p>'+
	'</li>';

var readButton = '<button class="readIcon" title="Mark As Reading" type="button"><img src="img/reading.png"></button>';
var doneReadingButton = '<button class="doneReadingIcon" title="Mark As Read" type="button"><img src="img/doneReading.png"></button>';
var removeButton = '<button class="removeIcon" title="Remove From List" type="button"><img src="img/remove-icon.png"></button>';

var $overlay = $('<div id="firstOverlay" class="overlay"></div>');
var $overlay2 = $('<div class="overlay"><ul></ul></div>');
var $overlay3 = $('<div class="overlay"></div>');
var $coverOverlay = $('<div id="covers" class="overlay"><div id="coverWrapper"></div></div>');

var $mobileMenu = $(
	'<nav id="mobileNav" class="animated slideInRight">'+
		'<ul>'+
			'<li id="firstMobileNav" class="mobileSelected"><a href="index.html">My Lists</a></li>'+
			'<li><a href="index.html">Progress</a></li>'+
			'<li><a href="index.html">Profile</a></li>'+
			'<li id="lastMobileNav"><a href="index.html">About</a></li>'+
		'</ul>'+
	'</nav>');

var $addTitleBox = $(
	'<div id="addTitleBox">'+
		'<h1>Add Title</h1>'+
		'<label for="title">Title:</label>'+
		'<input type="text" id="title" name="book_title">'+
		'<label for="author">Author:</label>'+
		'<input type="text" id="author" name="book_author">'+
		'<button class="add">Add</button>'+
	'</div>');

//================FUNCTIONS===============================================

// function to add book to To Read list
var addBook = function(addedInput, title, author) {
	addedInput += '<p>' + title + '</p><p style="text-indent: 1em">-' + author +'</p>';
	addedInput += doneReadingButton;
	addedInput += removeButton;
	addedInput += '</li>';
	$('#toRead .listHeader').after(addedInput);

	$('.overlay').fadeOut(200, function() {
	// Animation complete.
	});
}

//function to move a book from one list to the other
var switchList = function(book, oldList, newList) {
	//if new list is empty
	if (newList.children('li').is('.empty')) {
		//remove 'empty list' line
		newList.children('li').remove('.empty');
	}
	//remove book from its list
	book.remove();
	//if old list is now empty
	if (oldList.children('li').length === 1) {
	  	//add empty list filler and remove dud li
		oldList.children('.listHeader').after(emptyListFiller);
	}
	//if new list is To Read then append done reading button, add book to list, and remove read button
	if (newList.is('#toRead')) {
		book.append(doneReadingButton);
		newList.children('.listHeader').after(book);
		book.children('.readIcon').remove();
	//or if new list is Done Reading then append Reading button, add book to list, and remove done reading button
	} else if (newList.is('#booksRead')) {
		book.append(readButton);
		newList.children('.listHeader').after(book);
		book.children('.doneReadingIcon').remove();
	}
}

// function to remove book from its list
var deleteBook = function(book, currentList) {
	book.remove();
	if (currentList.children('li').length === 1) {
		currentList.children('.listHeader').after(emptyListFiller);
	}
}

var clearVals = function() {
	$('#title').val('');
	$('#author').val('');
	$('#coverWrapper').children().remove();
	$('body').removeClass('noScroll');
}

//=========================================================================================

//insert overlay divs after Done Reading ul
$('#foreground').after($overlay);
$('#booksRead').after($overlay2);
$('#foreground').after($overlay3);
$('#foreground').after($coverOverlay);

//when mobile menu icon is clicked
$(document).on('click', '.mobileMenuIcon', function() {
	$('body').addClass('noScroll');
	$overlay3.append($mobileMenu);
	$overlay3.fadeIn(200, function() {/*animation complete*/});
});

// when list header name is clicked
$(document).on('click', '.fullList', function() {
	// clone the ul of that list and append it to overlay2 div
	$overlay2.children('ul').replaceWith($(this).parent().parent().parent().clone());
	$('body').addClass('noScroll');
	$overlay2.fadeIn(200, function() {/* Animation complete */});
});

//keep overlay up unless user clicks outside box
$(document).click(function(event) {
    if($(event.target).attr('class') === 'overlay') {
    	//if overlay has ul child
    	if ($(event.target).children().is('ul')) {
    		var list = '#' + $('.overlay').children().attr('id');
    		//clone ul, get id and replace foreground ul with cloned ul
    		$('#foreground ' + list).replaceWith($('.overlay ' + list).clone());
    	}
        $('.overlay').fadeOut(200, function() {/* Animation complete */});
        $('body').removeClass('noScroll');
  	}
});

$(document).on('click', '#addTitle', function() {
	$('body').addClass('noScroll');
	$overlay.append($addTitleBox);
	$overlay.fadeIn(200, function() {/* Animation complete */});
  	$('#title').focus();
});

// retrieve book covers from web for user to select and add book (<li>) to "Read" list
$(document).on('click', '.add', function() {
	//function to grab book cover of added book from Google Books API
  	$overlay.fadeOut(200, function() {/* Animation complete */});
  	$(document).ready(function() {
		if ($('#title').val() === "" || $('#author').val() === "") {
			alert("please enter a Title and Author");
		} else {
			var title = $('#title').val();
		  var author = $('#author').val();
		// API URI with inputted values
		var booksAPI = "https://www.googleapis.com/books/v1/volumes?q=" + title + "+inauthor:" + author;
		var options = {
		  format: "json"
			}
			//add overaly div and append book cover images in proper tags
		function displayCovers(data) {
			if(data.totalItems === 0) {
				alert("No search results found. Make sure you have the correct title and author.");
			} else {
				for (i=0, j=6; i < j; i++) {
					//try block in case item has no volumeInfo has no imageLinks
					try {
						$('#coverWrapper').append('<button title="choose cover" type="button"><img src=' + data.items[i].volumeInfo.imageLinks.thumbnail + '>' +
						'<p class="title" style="display:none">' + data.items[i].volumeInfo.title + '</p>' +
						'<p class="author" style="display:none"><em>' + data.items[i].volumeInfo.authors[0] + '</em></p></button>');
					} catch(e) {j+=1}
					if (data.items[data.items.length - 1] === data.items[i]) {
						break;
					}
				}
				$('#coverWrapper').append('<button id="noCover" type="button">No Cover</button>');
				$('#coverWrapper').append('<div style="height: 100px"></div>')
				$('#covers').fadeIn(200, function(){/*animation complete*/});
			}
		} //end displayCovers

		//jQuery AJAX call to retrieve JSON from API
		$.getJSON(booksAPI, options, displayCovers);

		} //end else
		
	});
});


//event listener on book cover click
$(document).on('click', '#coverWrapper img', function(){
	if($('#toRead').children('li').is('.empty')) {
	  //remove 'empty list' line
		$('#toRead').children('li').remove('.empty');
	}
	//add book with 'book' ID
	var addedInput = '<li class="book"><img class="inListCover" src=' + $(this).attr('src') + '>';
	addBook(addedInput, $(this).siblings('.title').html(), $(this).siblings('.author').html());
	//remove displayed covers, clear input fields in Add Title menu
	clearVals();
});

$(document).on('click', '#noCover', function(){
	if($('#toRead').children('li').is('.empty')) {
	  //remove 'empty list' line
		$('#toRead').children('li').remove('.empty');
	}
	var addedInput = '<li class="book"><div class="inListCover"></div>';
	addBook(addedInput, $('#title').val(), $('#author').val());
	clearVals();
});

$(document).on('click', '.doneReadingIcon', function() {
	var book = $(this).parent();
	if($(this).parent().parent().parent().attr('class') === 'overlay') {
		switchList(book, $('.overlay #toRead'), $('#booksRead'));
	} else {
		switchList(book, $('#toRead'), $('#booksRead'));
	}
});


$(document).on('click', '.readIcon', function(){
	var book = $(this).parent();
	if($(this).parent().parent().parent().attr('class') === 'overlay') {
		switchList(book, $('.overlay #booksRead'), $('#toRead'));
	} else {
		switchList(book, $('#booksRead'), $('#toRead'));
	}
});


$(document).on('click', '.removeIcon', function() {
	var book = $(this).parent();
	//if button is from 'overlay' div
	if($(this).parent().parent().parent().attr('class') === 'overlay') {
	  //add overlay class to list var
	  var list = $('.overlay #' + book.parent().attr('id'));
	} else {
	  //else create list var without overlay class
	  var list = $('#' + book.parent().attr('id'));
	}
	deleteBook(book, list);
});