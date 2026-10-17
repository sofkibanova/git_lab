
const API = "/api";

const form = document.getElementById("note-form");
const input = document.getElementById("note-input");
const list = document.getElementById("notes-list");
const status = document.getElementById("status");
const submitButton = document.getElementById("submit-button");

// Получение заметок от бэкенда
async function loadNotes() {
    status.textContent = "Загружаем заметки...";

    try {
        const response = await fetch(`${API}/notes`);

        if (!response.ok) {
            throw new Error("Ошибка загрузки");
        }

        const notes = await response.json();

        list.replaceChildren();

        if (notes.length === 0) {
            const empty = document.createElement("div");
            empty.className = "empty";
            empty.textContent = "Заметок пока нет. Добавьте первую!";
            list.append(empty);
        }

        for (const note of notes) {
            const card = document.createElement("article");
            card.className = "note";

            const text = document.createElement("p");
            text.textContent = note.text;

            const button = document.createElement("button");
            button.className = "delete-button";
            button.textContent = "Удалить";

            button.addEventListener("click", () => {
                deleteNote(note.id);
            });

            card.append(text, button);
            list.append(card);
        }

        status.textContent = "";
    } catch (error) {
        status.textContent =
            "Не удалось подключиться к серверу. Проверьте бэкенд.";
    }
}

// Добавление заметки
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const text = input.value.trim();

    if (!text) return;

    submitButton.disabled = true;

    try {
        const response = await fetch(`${API}/notes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text })
        });

        if (!response.ok) {
            throw new Error("Ошибка создания заметки");
        }

        input.value = "";
        await loadNotes();
    } catch (error) {
        status.textContent = "Не удалось добавить заметку.";
    } finally {
        submitButton.disabled = false;
    }
});

// Удаление заметки
async function deleteNote(id) {
    if (!confirm("Вы уверены, что хотите удалить заметку?")) {
        return;
    }

    try {
        const response = await fetch(`${API}/notes/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Ошибка удаления");
        }

        await loadNotes();
    } catch (error) {
        status.textContent = "Не удалось удалить заметку.";
    }
}

// Загрузка при открытии страницы
loadNotes();
