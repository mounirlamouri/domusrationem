list = [];

var Entry = function(amount, label){
	this.id = list.length;
	this.amount = parseInt(amount) || 0;
	this.label = label || '';
	this.date = new Date();
};

Entry.prototype.displayDate = function () {
	return ('0' + this.date.getDate()).slice(-2) + '/' + ('0' + (this.date.getMonth() + 1)).slice(-2);
};

Entry.prototype.displayPrice = function () {
	return this.amount.toFixed(2);
};

function editEntry(ev) {
	ev.preventDefault();
	ev.stopPropagation();
	var form = document.getElementsByTagName('form')[0];
	var id = ev.target.parentElement.parentElement.id.replace('item-','');
	form.elements["item-id"].value = id;
	form.elements["item-label"].value = list[parseInt(id)].label;
	form.elements["amount"].value = list[parseInt(id)].amount;
}

function addEntry(ev) {
	ev.preventDefault();
	ev.stopPropagation();
	var form = document.getElementsByTagName('form')[0];
	var e = new Entry(form.elements["amount"].value, form.elements["item-label"].value);
	list.push(e);

	var listRef = new Firebase('https://domusrationem.firebaseio.com/message_list');
	listRef.push(e);

	displayList(list);
	console.log(list);
}

function cancelEntry(ev) {
	ev.preventDefault();
	ev.stopPropagation();
	var form = document.getElementsByTagName('form')[0];
	form.elements["item-id"].value = '';
	form.elements["item-label"].value = '';
	form.elements["amount"].value = '';
}

function modifyEntry(ev) {
	ev.preventDefault();
	ev.stopPropagation();
	var form = document.getElementsByTagName('form')[0];
	var id = form.elements["item-id"].value;
	if (!id) {
		return;
	}
	list[id].amount = form.elements["amount"].value;
	list[id].label = form.elements["item-label"].value;
	// save the fucking list
	displayList(list);
	console.log(list);
}

function deleteEntry(ev) {
	ev.preventDefault();
	ev.stopPropagation();
	var form = document.getElementsByTagName('form')[0];
	var id = form.elements["item-id"].value;
	if (!id) {
		return;
	}
	delete(list[id]);
	displayList(list);
}

function init() {
  var listRef = new Firebase('https://domusrationem.firebaseio.com/message_list');
  listRef.on('child_added', function(data) {
  	var i = list.length;
  	var entry = new Entry(data.val().amount, data.val().label);
	  list.push(entry);

		var tbody = document.getElementsByTagName('tbody')[0];
  	var tr = document.createElement('tr');
		tr.id = 'item-' + i;
		tr.innerHTML = '<td>' + list[i].displayDate() + '</td><td>' + list[i].displayPrice() + '</td><td>' + list[i].label + '</td><td><button class="edit">Edit</button></td>';
		tbody.appendChild(tr);
  });
}

try {
	document.getElementById('add').addEventListener('click', addEntry);
	document.getElementById('cancel').addEventListener('click', cancelEntry);
	document.getElementById('modify').addEventListener('click', modifyEntry);
	document.getElementById('delete').addEventListener('click', deleteEntry);
} catch (e) {
	console.log(e);
}

init();

var authClient = new FirebaseAuthClient(new Firebase('https://domusrationem.firebaseio.com'), function(error, user) {
  if (error) {
    // an error occurred while attempting login
    console.log(error);
  } else if (user) {
    // user authenticated with Firebase
    console.log('User ID: ' + user.id + ', Provider: ' + user.provider);
  }
});

authClient.createUser('foo@bar.com', 'test', function(error, user) {
  if (!error) {
    console.log('User Id: ' + user.id + ', Email: ' + user.email);
  }
});