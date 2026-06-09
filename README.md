# MyPustak Post Management Application

A minimal, high-fidelity Post Management full-stack application built using FastAPI and React.js.

## Tech Stack
* **Backend:** FastAPI (Python), Pydantic
* **Frontend:** React.js (Vite, JavaScript), Vanilla CSS (Glassmorphism & Dark/Light adaptation)

---

## Setup & Running Instructions

### 1. Backend Server Setup
The backend requires Python and standard dependencies. A preconfigured virtual environment is located in the `backend/env` directory.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Activate the virtual environment:
   * **Windows (PowerShell):**
     ```powershell
     .\env\Scripts\Activate.ps1
     ```
   * **Windows (CMD):**
     ```cmd
     .\env\Scripts\activate.bat
     ```
   * **Linux/macOS:**
     ```bash
     source env/bin/activate
     ```
3. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```
   *The backend will run at `http://127.0.0.1:8000`.*

---

### 2. Frontend React Setup
The frontend uses Vite and NPM.

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev -- --host 127.0.0.1 --port 5173
   ```
   *The frontend application will run at `http://127.0.0.1:5173`.*

---

## API Documentation

### Data Model
```json
{
  "id": 1,
  "title": "Hello World",
  "body": "My first post"
}
```

### Endpoints
* **GET `/posts`**: Retrieves all posts in reverse order (newest first).
  * *Response status code:* 200 OK
* **POST `/posts`**: Publishes a new post. Checks that inputs are not empty or solely whitespace.
  * *Payload:* `{"title": "string", "body": "string"}`
  * *Response status code:* 201 Created
* **DELETE `/posts/{id}`**: Deletes a post matching the specified ID.
  * *Response status code:* 200 OK (or 404 Not Found if ID is invalid)