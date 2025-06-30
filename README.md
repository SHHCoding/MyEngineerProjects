# EngiPro - Civil Engineering Project Manager

This is a web application for tracking and managing civil engineering projects. Users can add, edit, delete, and filter projects.

## Features

- **Project Management:** Create, view, update, and delete projects.
- **Progress Steps:** Define a checklist of steps for each project to track granular progress.
- **Status Tracking:** Monitor project status (Not Started, In Progress, Done). For projects with detailed steps, the status updates automatically as you check off items. For projects without steps, you can manually start and finish the work using dedicated buttons. Start and End dates are recorded automatically for all projects.
- **Local Data Storage:** All project data is stored securely and privately in your browser's local storage. No login or internet connection is required to manage your data.
- **Import/Export:** Easily back up all your project data to a JSON file or transfer it to another browser or device.
- **Filtering and Searching:** Quickly find projects by name, status, owner, or deadline.
- **Dashboard:** Get a quick overview of key metrics like total projects, progress, and overdue items.
- **Responsive Design:** Works seamlessly on desktop and mobile devices.
- **Light/Dark Mode:** Adapts to your system's preference.

## How to Run Locally

To run this project on your own computer for development or testing:

1.  **Install Node.js:** Make sure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).
2.  **Install Dependencies:** Open a terminal in the project's root folder and run the command:
    ```bash
    npm install
    ```
3.  **Start the Development Server:** After the installation is complete, run:
    ```bash
    npm run dev
    ```
    This will start a local server, and you can view the application in your browser at the address provided (usually `http://localhost:5173`).

## Data Management

This application is designed for simplicity and privacy. All project data you create is stored directly within your web browser on your device (using `localStorage`).

### Backing Up and Transferring Data

To prevent data loss and to move your projects between devices, please use the **Import** and **Export** features.

- **Export:** Click the **"នាំចេញ" (Export)** button to download a JSON file with all your projects.
- **Import:** Click the **"នាំចូល" (Import)** button to load a previously exported JSON file. **Warning:** This will overwrite any data currently in the application.

## How to Deploy to the Web

To use this application on any device, you need to deploy it to a hosting service. We recommend Vercel, which offers a generous free plan.

### Prerequisites

- You need a free [GitHub](https://github.com/) account.

### Step 1: Upload Project to GitHub

1.  **Create a new repository** on your GitHub account. Make it **public**.
2.  **Upload all the project files and folders** to this new repository.

### Step 2: Deploy with Vercel

1.  Go to [vercel.com](https://vercel.com) and sign up using your GitHub account.
2.  On your Vercel dashboard, click **"Add New..."** and select **"Project"**.
3.  Find the GitHub repository you just created and click **"Import"**.
4.  Vercel will automatically detect that this is a Vite project and configure the build settings. You do not need to change anything.
5.  Click **"Deploy"**.

### Step 3: Access Your App from Anywhere

Vercel will provide you with a public URL (e.g., `your-project-name.vercel.app`). You can now open this link on any device to use your application!