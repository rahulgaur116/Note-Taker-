

let noteheader;
let noteinput;
let saveBtn;
let addnoteBtn;
let noteList;
let noteForm;

if (window.location.pathname === '/notes') {
  noteheader = document.querySelector('.note-title');
  noteinput = document.querySelector('.note-textarea');
  saveBtn = document.querySelector('.save-note');
  addnoteBtn = document.querySelector('.new-note');
  clearnoteBtn = document.querySelector('.clear-btn');
  noteList = document.querySelectorAll('.list-container .list-group');
  noteForm = document.querySelector('.note-form');

}


const show = (elem) => {
  elem.style.display = 'inline';
};


const hide = (elem) => {
  elem.style.display = 'none';
};

let startnewNote = {};

// get request for the notes
const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // post request for the notes
const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });

  // delete request for the notes
const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // function to hide the save btn until there is a note added to save
const renderActiveNote = () => {
  hide(saveBtn);
  hide(clearnoteBtn);

  if (startnewNote.id) {
    show(addnoteBtn);
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = startnewNote.title;
    noteText.value = startnewNote.text;
  } else {
    hide(addnoteBtn);
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

// save note
const NoteSavehandle = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  };
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Delete the clicked note
const NoteDeletehandle = (e) => {
  // Prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();

  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Sets the activeNote and displays it
const NoteViewhandle = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
const NewNoteViewhandle = (e) => {
  activeNote = {};
  renderActiveNote();
};

const RenderSaveBtnhandle = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

// Render the list of note titles
const renderNoteList = async (notes) => {
  let jsonNotes = await notes.json();
  if (window.location.pathname === '/notes') {
    noteList.forEach((el) => (el.innerHTML = ''));
  }

  let noteListItems = [];

  // Returns HTML element with or without a delete button
  const createLi = (inputtext, deleteBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = inputtexttext;
    spanEl.addEventListener('click', handleNoteView);

    liEl.append(spanEl);

    if (deleteBtn) {
      const deleteBtnEl = document.createElement('i');
      deleteBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      deleteBtnEl.addEventListener('click', handleNoteDelete);

      liEl.append(deleteBtnEl);
    }

    return liEl;
  };

  if (jsonNotes.length === 0) {
    noteListItems.push(createLi('No Notes', false));
  }

  jsonNotes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);

    noteListItems.push(li);
  });

  if (window.location.pathname === '/notes') {
    noteListItems.forEach((note) => noteList[0].append(note));
  }
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => getNotes().then(renderNoteList);

if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteText.addEventListener('keyup', handleRenderSaveBtn);
  noteForm.addEventListener('input', handleRenderBtns);
}

getAndRenderNotes();
