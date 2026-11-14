
const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadButton = document.getElementById("load-btn");
const statusMessage = document.getElementById("status");
const notesList = document.getElementById("notes-list");

const noteForm = document.getElementById("note-form");
const titleInput = document.getElementById("title-input");
const bodyInput = document.getElementById("body-input");
const submitButton = document.getElementById("submit-btn");

// Reusable function for making API requests.
async function request(url, options = {}) {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    if (response.status === 204) {
        return { data: null, status: response.status };
    }

    const data = await response.json();

    return {
        data,
        status: response.status
    };
}

// Display status messages.
function showStatus(message, type = "") {
    statusMessage.textContent = message;
    statusMessage.className = type;
}

// Display notes safely.
function displayNotes(notes) {
    notesList.replaceChildren();

    if (notes.length === 0) {
        const emptyMessage = document.createElement("li");
        emptyMessage.className = "empty-state";
        emptyMessage.textContent = "No notes found.";
        notesList.appendChild(emptyMessage);
        return;
    }

    notes.forEach(note => {
        const listItem = document.createElement("li");
        listItem.className = "note-item";

        const title = document.createElement("h3");
        title.textContent = note.title;

        const body = document.createElement("p");
        body.textContent = note.body;

        listItem.append(title, body);
        notesList.appendChild(listItem);
    });
}

// GET: Load the first 10 notes.
async function loadNotes() {
    loadButton.disabled = true;
    showStatus("Loading notes...");

    try {
        const result = await request(`${API_URL}?_limit=10`);

        displayNotes(result.data);

        showStatus(
            `Loaded ${result.data.length} notes from the server.`,
            "success"
        );

    } catch (error) {
        showStatus(
            "Unable to load notes. Please check your connection and try again.",
            "error"
        );

        console.error("GET request error:", error);

    } finally {
        loadButton.disabled = false;
    }
}

// POST: Create a new note.
async function createNote(event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    // Validate the title before sending the request.
    if (!title) {
        showStatus("Please enter a note title.", "error");
        titleInput.focus();
        return;
    }

    if (title.length > 100) {
        showStatus("The title cannot exceed 100 characters.", "error");
        titleInput.focus();
        return;
    }

    submitButton.disabled = true;
    showStatus("Creating note...");

    try {
        const result = await request(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                body: body,
                userId: 1
            })
        });

        const newNote = result.data;

        // Add the newly created note to the top of the existing list.
        const newItem = document.createElement("li");
        newItem.className = "note-item";

        const noteTitle = document.createElement("h3");
        noteTitle.textContent = newNote.title;

        const noteBody = document.createElement("p");
        noteBody.textContent = newNote.body;

        newItem.append(noteTitle, noteBody);
        notesList.prepend(newItem);

        showStatus(
            `Note created (status ${result.status}, id ${newNote.id}).`,
            "success"
        );

        // Clear the form after successful creation.
        noteForm.reset();

    } catch (error) {
        showStatus(
            "Unable to create note. Please try again.",
            "error"
        );

        console.error("POST request error:", error);

    } finally {
        submitButton.disabled = false;
    }
}

// Event listeners.
loadButton.addEventListener("click", loadNotes);
noteForm.addEventListener("submit", createNote);
