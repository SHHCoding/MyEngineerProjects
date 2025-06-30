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

## How It Works & Data Management

This application is designed for simplicity and privacy.

### Data Storage

All the project data you create is stored directly within your web browser on your device (using `localStorage`).

- **Pros:**
    - **Privacy:** Your data never leaves your computer. It is not sent to any server.
    - **Offline Access:** The application works perfectly offline.
    - **No Account Needed:** You can start using the app immediately without any registration or login.

- **Cons:**
    - Data is tied to a single browser. If you use a different browser or device, your data will not be there.
    - Clearing your browser's cache or site data **will permanently delete** your projects.

### Backing Up and Transferring Data

To prevent data loss and to move your projects between devices, please use the **Import** and **Export** features.

- **Export:**
  1. Click the **"នាំចេញ" (Export)** button.
  2. A JSON file (e.g., `engipro_backup_2023-10-27.json`) containing all your projects will be downloaded to your computer.
  3. Save this file in a safe place as a backup.

- **Import:**
  1. Open the application in the browser or on the device where you want to load the data.
  2. Click the **"នាំចូល" (Import)** button.
  3. Select the backup JSON file you previously exported.
  4. Confirm the action. **Warning:** Importing will overwrite any data currently in the application.

## How to Deploy to the Web

To use this application on any device, you need to deploy it to a hosting service. We recommend Vercel, which offers a generous free plan.

### Prerequisites

- You need a free [GitHub](https://github.com/) account.

### Step 1: Upload Project to GitHub

1.  **Create a new repository** on your GitHub account. You can name it whatever you like, for example, `engipro-manager`. Make sure it's a **public** repository if you're on a free GitHub plan.
2.  **Upload all the project files and folders** to this new repository. The final structure in GitHub should look like this:
    ```
    - components/
    - hooks/
    - styles/
    - App.tsx
    - index.html
    - index.tsx
    - ... (all other files)
    ```

### Step 2: Deploy with Vercel

1.  Go to [vercel.com](https://vercel.com) and click **"Sign Up"**. Choose the option to **"Continue with GitHub"** and authorize it to connect to your GitHub account.
2.  Once you are on your Vercel dashboard, click **"Add New..."** and select **"Project"**.
3.  Find the GitHub repository you created in Step 1 and click the **"Import"** button next to it.
4.  Vercel will automatically analyze your project. Since there is a `vercel.json` file, it will know how to configure everything. You do not need to change any settings.
5.  Click the **"Deploy"** button.
6.  Wait a moment while Vercel builds and deploys your application. When it's done, you'll see a congratulations screen with a screenshot of your app.

### Step 3: Access Your App from Anywhere

Vercel will provide you with a public URL (e.g., `your-project-name.vercel.app`). You can now open this link in the browser on any device (phone, tablet, another computer) to use your application!