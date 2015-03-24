// JAVASCRIPT
//-----------

var emptyListFiller =
	'<li class="bookToRead firstBook">'+
		'<p id="listEmptyText">Your list is empty!</p>'+
	'</li>';

var readButton = '<button class="readIcon" title="Mark As Reading" type="button"><img src="img/reading.png"></button>';
var doneReadingButton = '<button class="doneReadingIcon" title="Mark As Read" type="button"><img src="img/doneReading.png"></button>';
var removeButton = '<button class="removeIcon" title="Remove From List" type="button"><img src="img/remove-icon.png"></button>';
var $overlay = $('<div class="overlay"></div>');
var $overlay2 = $('<div class="overlay"><ul></ul></div>');

var $readingList = $('#toRead');
var $doneList = $('#booksRead');

var $addTitleBox = $(
	'<div id="addTitleBox">'+
		'<h1>Add Title</h1>'+

		'<label for="title">Title:</label>'+
		'<input type="text" id="title" name="book_title">'+

		'<label for="author">Author:</label>'+
		'<input type="text" id="author" name="book_author">'+
		'<button class="add">Add</button>'+
	'</div>');

// function to add book to To Read list
var addBook = function(addedInput) {
	addedInput += '<p>' + $('#title').val() + '  --' + $('#author').val() + '</p>';
	addedInput += doneReadingButton;
	addedInput += removeButton;
	addedInput += '</li>';
	$readingList.append(addedInput);

	$('.overlay').fadeOut(200, function() {
	// Animation complete.
	});
}

//function to move a book from one list to the other
var switchList = function(book, oldList, newList) {
	//if new list is empty
	if (newList.children('li').length === 2) {
		//remove 'empty list' line
		newList.children('li')[1].remove();
		//add dud li to compensate for removed li so length doesn't read 2 (empty) on next add
		newList.append('<li id="dud"></li>');
	}
	//remove book from its list
	book.remove();
	//if old list is now empty
	if (oldList.children('li').length === 2) {
	  	//add empty list filler and remove dud li
		oldList.append(emptyListFiller);
		oldList.children('#dud').remove();
	//or if switched book has firstBook class
	} else if (book.is('.firstBook')) {
	  	//give firstBook class to first item on old list
		oldList.children('li').eq(2).addClass('firstBook');
	}
	//if new list is empty and switched book does not have firstBook class
	if (newList.children('li').length === 2 && book.is('.firstBook') === false) {
		//add first class to book
		book.addClass('firstBook');
	//or if new list is not empty and switched book has firstBook class
	} else if (newList.children('li').length > 2 && book.is('.firstBook') === true) {
		book.removeClass('firstBook');
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
	if (currentList.children('li').length === 2) {
		currentList.append(emptyListFiller);
		currentList.children('#dud').remove();
	}
	if(book.is('.firstBook') && currentList.children('li').length !== 2) {
		currentList.children('li').eq(2).addClass('firstBook');
	}
}

//=========================================================================================

//insert overlay divs after Done Reading ul
$('#booksRead').after($overlay);
$('#booksRead').after($overlay2);

// when list header name is clicked
$(document).on('click', '.fullList', function() {
	// clone the ul of that list and append it to overlay2 div
	$overlay2.children('ul').replaceWith($(this).parent().parent().parent().clone());
	$overlay2.fadeIn(200, function() {
    	// Animation complete.
  	});
});

$(document).on('click', '#addTitle', function() {
	$overlay.append($addTitleBox);
	$overlay.fadeIn(200, function() {
    	// Animation complete.
  	});
  	$('#title').focus();
});

// add <li> to "Read" list when clicking "Add" button
$(document).on('click', '.add', function() {
	if($readingList.children('li').length === 2 && $('#title').val() !== "" && $('#author').val() !== "") {
		//remove 'empty list' line
		$readingList.children('li')[1].remove();
		//add empty li to compensate for removed li so length doesn't read 2 on next add
		$readingList.append('<li id="dud"></li>');
		//add first book with 'firstBook' ID
		var addedInput = '<li class="bookToRead firstBook">';
		addBook(addedInput);

	} else if($('#title').val() !== "" && $('#author').val() !== "") {
		var addedInput = '<li class="bookToRead">';
		addBook(addedInput);
	} else {
		alert("please enter a Title and Author");
	}

  	$('#title').val('');
	$('#author').val('');
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
        $('.overlay').fadeOut(200, function() {
    	// Animation complete.
  		});
  	}
});

$(document).on('click', '.doneReadingIcon', function() {
	var book = $(this).parent();
	switchList(book, $readingList, $doneList);
});

$(document).on('click', '.readIcon', function(){
	var book = $(this).parent();
	switchList(book, $doneList, $readingList);
});

$(document).on('click', '.removeIcon', function() {
	var book = $(this).parent();
	var list = $('#' + book.parent().attr('id'));
	deleteBook(book, list);
});



//

//create an anchor on both list headers that brings up an overlay with just that list fully
//expanded

//create a 5 book limit for default view and add a "more titles" button at bottom of each
//list to expand it

// DESIGN
//--------
