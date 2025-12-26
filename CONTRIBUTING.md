# Contributing to DevPath Community Website

Thank you for your interest in contributing to the DevPath Community Website! We welcome contributions from everyone.

## Getting Started

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally:
    ```bash
    git clone https://github.com/YOUR_USERNAME/DevPath-Web.git
    cd DevPath-Web
    ```
3.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```
4.  **Set up environment variables**:
    - Copy `.env.example` to `.env.local`:
      ```bash
      cp .env.example .env.local
      ```
    - Create a new Firebase project in the [Firebase Console](https://console.firebase.google.com/).
    - Enable Authentication, Firestore, and Storage.
    - Get your Firebase configuration keys from Project Settings and fill them in `.env.local`.
    - (Optional) Deploy `firestore.rules` and `storage.rules` to your Firebase project to ensure correct permissions.

5.  **Run the development server**:
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Making Changes

1.  Create a new branch for your feature or fix:
    ```bash
    git checkout -b feature/amazing-feature
    ```
2.  Make your changes.
3.  Commit your changes with descriptive messages.
4.  Push to your fork:
    ```bash
    git push origin feature/amazing-feature
    ```

## Submitting a Pull Request

1.  Go to the original repository on GitHub.
2.  Click "New Pull Request".
3.  Select your branch and submit the PR.
4.  Provide a clear description of your changes.

## Code of Conduct

Please note that this project is released with a [Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.
