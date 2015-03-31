//================VARIABLES===============================================

var emptyListFiller =
	'<li class="empty">'+
		'<p id="listEmptyText">Your list is empty!</p>'+
	'</li>';

var readButton = '<button class="readIcon" title="Mark As Reading" type="button"><img src="img/reading.png"></button>';
var doneReadingButton = '<button class="doneReadingIcon" title="Mark As Read" type="button"><img src="img/doneReading.png"></button>';
var removeButton = '<button class="removeIcon" title="Remove From List" type="button"><img src="img/remove-icon.png"></button>';
var $overlay = $('<div class="overlay"></div>');
var $overlay2 = $('<div class="overlay"><ul></ul></div>');
var $overlay3 = $('<div class="overlay"></div>');
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
var addBook = function(addedInput) {
	addedInput += '<p>' + $('#title').val() + '  --' + $('#author').val() + '</p>';
	addedInput += doneReadingButton;
	addedInput += removeButton;
	addedInput += '</li>';
	$('#toRead').append(addedInput);

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
		oldList.append(emptyListFiller);
	}
	//if new list is To Read then append done reading button, add book to list, and remove read button
	if (newList.is('#toRead')) {
		book.append(doneReadingButton);
		newList.append(book);
		book.children('.readIcon').remove();
	//or if new list is Done Reading then append Reading button, add book to list, and remove done reading button
	} else if (newList.is('#booksRead')) {
		book.append(readButton);
		newList.append(book);
		book.children('.doneReadingIcon').remove();
	}
}

// function to remove book from its list
var deleteBook = function(book, currentList) {
	book.remove();
	if (currentList.children('li').length === 1) {
		currentList.append(emptyListFiller);
	}
}

//=========================================================================================

//insert overlay divs after Done Reading ul
$(document.body).after($overlay);
$('#booksRead').after($overlay2);
$(document.body).after($overlay3);

//when mobile menu icon is clicked
$(document).on('click', '.mobileMenuIcon', function() {
	$overlay3.fadeIn(200, function() {/*animation complete*/});
	$overlay3.append($mobileMenu);
});

// when list header name is clicked
$(document).on('click', '.fullList', function() {
	// clone the ul of that list and append it to overlay2 div
	$overlay2.children('ul').replaceWith($(this).parent().parent().parent().clone());
	$overlay2.fadeIn(200, function() {/* Animation complete */});
});

//keep overlay up unless user clicks outside box
$(document).click(function(event) {
    if($(event.target).attr('class') === 'overlay') {
    	//if overlay has ul child
    	if ($('.overlay').children().is('ul')) {
    		var list = '#' + $('.overlay').children().attr('id');
    		//clone ul, get id and replace foreground ul with cloned ul
    		$('#foreground ' + list).replaceWith($('.overlay ' + list).clone());
    	}
        $('.overlay').fadeOut(200, function() {/* Animation complete */});
  	}
});

$(document).on('click', '#addTitle', function() {
	$overlay.append($addTitleBox);
	$overlay.fadeIn(200, function() {/* Animation complete */});
  	$('#title').focus();
});

// add <li> to "Read" list when clicking "Add" button
$(document).on('click', '.add', function() {
	if($('#toRead').children('li').is('.empty') && $('#title').val() !== "" && $('#author').val() !== "") {
		//remove 'empty list' line
		$('#toRead').children('li').remove('.empty');
		//add book with 'book' ID
		var addedInput = '<li class="book">';
		addBook(addedInput);
	} else if($('#title').val() !== "" && $('#author').val() !== "") {		
		var addedInput = '<li class="book">';
		addBook(addedInput);
	} else {
		alert("please enter a Title and Author");
	}

  	$('#title').val('');
	$('#author').val('');
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

//create a 5 book limit for default view and add a "more titles" button at bottom of each
//list to expand it
