
# Advanced Task Management System - Frontend

This is the frontend client for the Advanced Task Management System, built using **React** and **Vite**. It features a modern, responsive UI designed with **Material UI (MUI)** and offers a rich user experience with drag-and-drop task management, real-time updates, and interactive dashboards.

## Features

- **Modern Dashboard**: Visual analytics using `chart.js` and `react-chartjs-2`.
- **Task Board (Kanban)**: Interactive drag-and-drop interface powered by `@hello-pangea/dnd`.
- **Real-time Notifications**: Instant updates via `socket.io-client`.
- **Responsive UI**: Fully responsive design using Material UI components and grid system.
- **User Authentication**: Secure login and registration pages.
- **Interactive Feedback**: Toast notifications (`react-toastify`) and alerts (`sweetalert2`) for user actions.
- **Data Grid**: Advanced tables for user and task lists using `@mui/x-data-grid`.

## Tech Stack

- **Framework**: React 19 (via Vite)
- **UI Library**: Material UI (MUI) v7
- **State Management**: React Context API
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client
- **Charts**: Chart.js
- **Animations**: Lottie React

## Project Structure

```
task-management-system-frontend/
├── src/
│   ├── components/  # Reusable UI components
│   ├── context/     # Context providers (Auth, Notifications, etc.)
│   ├── hooks/       # Custom React hooks
│   ├── pages/       # Application route pages (Board, Login, Dashboard, etc.)
│   ├── services/    # API service calls
│   ├── assets/      # Static assets and images
│   ├── main.jsx     # Entry point
│   └── App.jsx      # Main application component
├── public/          # Public static files
└── ...
```

## Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Sahil-1827/task-management-system-frontend.git
    cd task-management-system-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Create a `.env` file in the root directory:

    ```env
    VITE_API_BASE_URL=http://localhost:5000/api
    ```

4.  **Run the Application:**

    *   **Development Server**:
        ```bash
        npm run dev
        ```
        The app will typically run at `http://localhost:5173`.

    *   **Build for Production**:
        ```bash
        npm run build
        ```

    *   **Preview Production Build**:
        ```bash
        npm run preview
        ```

## UI & Design

The application uses a custom theme configuration with Material UI to ensure a consistent and professional look. It supports:
-   Drag and drop task cards.
-   Dynamic status badges.
-   Interactive data tables with sorting and filtering.
-   Smooth transition animations.

## Integration

This frontend is designed to work seamlessly with the `task-management-system-backend`. Ensure the backend server is running and the `VITE_API_BASE_URL` is correctly pointed to it.
