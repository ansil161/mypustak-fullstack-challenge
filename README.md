# Post Management Application (MyPustak Challenge)

This is a simple full-stack application for managing posts, built with FastAPI (Python) for the backend and React (Vite + JavaScript) for the frontend.

## Project Structure
- `backend/`: FastAPI server handling post creation, retrieval, and deletion in-memory.
- `frontend/`: React single page app styled with Tailwind CSS.

---

## Running Locally

### Backend Setup
1. Move to the backend folder:
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
3. Run the FastAPI development server:
   ```bash
   uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```
   The backend will run on `http://127.0.0.1:8000`.

### Frontend Setup
1. Move to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev -- --host 127.0.0.1 --port 5173
   ```
   The app will run on `http://127.0.0.1:5173`.

---

## API Endpoints

- **GET `/posts`**: Returns all posts (latest first).
- **POST `/posts`**: Creates a new post. Expects `title` (min 3 chars) and `body` (min 10 chars). Rejects whitespace-only inputs.
- **DELETE `/posts/{id}`**: Deletes the post matching the specified ID.

---

## Deploying to Railway

This project is set up to be deployed as two services under a single Railway project (one for the backend, one for the frontend).

### 1. Deploy the Backend
1. Create a new project on Railway and connect this repository.
2. Under the service settings, rename the service to `backend`.
3. Set the **Root Directory** to `backend`.
4. Set the **Start Command** to `uvicorn main:app --host 0.0.0.0 --port $PORT`.
5. Under settings, generate a domain (e.g., `https://backend-production.up.railway.app`) and copy it.

### 2. Deploy the Frontend
1. Add a second service in your Railway project, connecting the same repo.
2. Rename this service to `frontend`.
3. Set the **Root Directory** to `frontend`.
4. Set the **Build Command** to `npm run build`.
5. Set the **Start Command** to `npx serve -s dist -l $PORT`.
6. Add an environment variable to the frontend:
   - Key: `VITE_API_URL`
   - Value: `<YOUR_BACKEND_DOMAIN>` (the backend URL generated in step 1, e.g. `https://backend-production.up.railway.app`).
7. Generate a domain for the frontend to access the application.

*Note: The frontend code checks for `VITE_API_URL`. If the environment variable isn't present, it falls back to `http://localhost:8000` for local development.*
