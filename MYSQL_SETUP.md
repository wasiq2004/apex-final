# MySQL Setup Guide for Windows

Follow these steps to install MySQL and connect it to your Apex Skills application.

## 1. Install MySQL Server

1.  **Download the Installer:**
    *   Go to the [MySQL Downloads Page](https://dev.mysql.com/downloads/installer/).
    *   Download the **MySQL Installer for Windows** (web-community version is fine).

2.  **Run the Installer:**
    *   Choose **"Server Only"** or **"Developer Default"** setup type.
    *   Click **Next** and follow the prompts to install.

3.  **Configuration (Important!):**
    *   **Type and Networking:** Keep defaults (TCP/IP on Port 3306).
    *   **Authentication Method:** Select "Use Legacy Authentication Method" (recommended for Node.js compatibility) OR "Use Strong Password Encryption".
    *   **Accounts and Roles:**
        *   **Root Password:** Set this to **`1234`** (to match your current `.env` config).
        *   *If you choose a different password, you MUST update `backend/.env`*.

4.  **Finish:**
    *   Complete the installation and ensure the "Start MySQL Server at System Startup" option is checked.

## 2. Verify Database Connection Configuration

Your project is already configured to connect to this local database.

**File:** `backend/.env`
```ini
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=1234  <-- Must match your MySQL root password
DB_NAME=apex_skills_db
DB_PORT=3306
```

## 3. Run the Application

The application handles the database creation for you!

1.  **Open a terminal** in the `backend` folder.
2.  **Start the server:**
    ```powershell
    npm run dev
    ```

**What happens automatically?**
*   The server detects the database connection.
*   It creates the `apex_skills_db` database if it doesn't exist.
*   It creates all necessary tables (`courses`, `admin_users`, etc.).
*   It creates a default admin user (`admin` / `admin`).

## 4. Troubleshooting

*   **Error: `ER_NOT_SUPPORTED_AUTH_MODE`**:
    *   This means MySQL is using a newer authentication method not supported by the driver.
    *   **Fix:** Open MySQL Command Line Client and run:
        ```sql
        ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '1234';
        FLUSH PRIVILEGES;
        ```

*   **Error: `ECONNREFUSED`**:
    *   This means the MySQL server is not running.
    *   **Fix:** Open Windows Services (`services.msc`), find `MySQL80`, and Click **Start**.
