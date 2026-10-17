
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Notes API")

# Разрешаем фронтенду обращаться к API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Начальные заметки хранятся в памяти
notes = [
    {"id": 1, "text": "Проверить работу API"},
    {"id": 2, "text": "Подготовить окружение для проекта"},
    {"id": 3, "text": "Изучить основы Docker"},
]

next_id = 4


class NoteCreate(BaseModel):
    text: str


@app.get("/")
def root():
    return {"message": "Notes API is running"}


@app.get("/notes")
def get_notes():
    return notes


@app.post("/notes")
def create_note(note: NoteCreate):
    global next_id

    text = note.text.strip()

    if not text:
        raise HTTPException(
            status_code=400,
            detail="Текст заметки не может быть пустым",
        )

    new_note = {
        "id": next_id,
        "text": text,
    }

    next_id += 1
    notes.append(new_note)

    return new_note


@app.delete("/notes/{note_id}")
def delete_note(note_id: int):
    for note in notes:
        if note["id"] == note_id:
            notes.remove(note)
            return {"message": "Заметка удалена"}

    raise HTTPException(
        status_code=404,
        detail="Заметка не найдена",
    )
