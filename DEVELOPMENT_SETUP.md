# Development Environment Setup Checklist

1. Clone the repository:
   git clone git@github.com:kkween/stylehub-ecommerce-v2.git

2. Install root dependencies:
   cd stylehub-ecommerce-v2
   npm install

3. Install backend dependencies:
   cd backend
   npm install

4. Install frontend dependencies:
   cd ../frontend
   npm install

5. Environment configuration:
   - Copy .env.example to .env in backend directory
   - Add your MongoDB URI, JWT secret, and other required variables
   - Example:
     MONGODB_URI=your_mongodb_uri_here
     JWT_SECRET=your_jwt_secret_here
     PORT=5000
     NODE_ENV=development

6. Start the application:
   - Option 1: Start both servers concurrently (if supported)
     npm run dev
   - Option 2: Start servers separately
     cd backend && npm run dev
     cd frontend && npm run dev

7. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

8. Troubleshooting:
   - If you see errors, check that all dependencies are installed and environment variables are set correctly.
   - For database issues, verify your MongoDB Atlas credentials and network connectivity.


## Step 3: Feature Branch Workflow

To ensure clean collaboration and code quality, follow this workflow for all new features and bug fixes:

1. **Create a Feature Branch**
   - Use a descriptive name, e.g., `feature/login-page` or `bugfix/cart-total`.
   - Command: `git checkout -b feature/your-feature-name`

2. **Work on Your Changes**
   - Commit often with clear messages.
   - Command: `git add . && git commit -m "Add login page UI"`

3. **Push Your Branch to Remote**
   - Command: `git push -u origin feature/your-feature-name`

4. **Open a Pull Request (PR) on GitHub**
   - Request code review from teammates.
   - Ensure all checks pass (lint, tests, etc.).

5. **Merge After Review**
   - Only merge after approval and passing checks.
   - Prefer "Squash and merge" for a clean history.

6. **Delete the Feature Branch After Merge**
   - Command: `git branch -d feature/your-feature-name` (local)
   - Delete remote branch via GitHub UI.

### Best Practices
- Keep branches focused and small.
- Pull latest changes from `main` before starting new work: `git checkout main && git pull`.
- Resolve conflicts before merging.
- Use clear PR titles and descriptions.

## Step 4: Code Review & Branch Protection

To maintain code quality and prevent errors, set up automated code review and branch protection on GitHub:

1. **Enable Branch Protection Rules**
   - Go to your repository on GitHub.
   - Click on `Settings` > `Branches` > `Branch protection rules`.
   - Add a rule for the `main` branch.
   - Require pull request reviews before merging.
   - Require status checks to pass before merging (e.g., tests, lint).
   - Optionally, require signed commits and restrict who can push.

2. **Automate Code Review**
   - All changes to `main` must go through a pull request (PR).
   - At least one team member must approve the PR before merging.
   - Use GitHub’s review tools to comment, request changes, and approve.

3. **Status Checks**
   - Integrate CI tools (e.g., GitHub Actions) to run tests and lint on every PR.
   - Only allow merging if all checks pass.

### Best Practices
- Never commit directly to `main`.
- Use clear PR titles and descriptions.
- Address all review comments before merging.

## Step 5: Customizing GitHub Actions CI Workflow

Your GitHub Actions workflow file is located at:

```
.github/workflows/ci.yml
```

### How to Customize

1. **Test Multiple Node Versions**
   - Edit `matrix.node-version` in `ci.yml` to include more versions:
     ```yaml
     strategy:
       matrix:
         node-version: [16.x, 18.x, 20.x]
     ```

2. **Change Trigger Branches**
   - Update `branches` under `push` and `pull_request` to match your workflow needs.

3. **Set Environment Variables**
   - Add an `env:` section under `jobs:` in `ci.yml`:
     ```yaml
     jobs:
       build-and-test:
         env:
           NODE_ENV: test
     ```

4. **Add Build Steps**
   - Insert build commands before tests:
     ```yaml
     - name: Build frontend
       run: |
         cd frontend
         npm run build
     ```

5. **Deploy on Success**
   - Add a new job (e.g., `deploy`) that runs only if tests pass.
   - Use deployment actions like `appleboy/scp-action` or `peaceiris/actions-gh-pages`.

6. **Cache Dependencies**
   - Use `actions/cache` to speed up installs:
     ```yaml
     - name: Cache node modules
       uses: actions/cache@v4
       with:
         path: ~/.npm
         key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
     ```

7. **Notifications**
   - Add steps to send Slack or email notifications on failure/success.

For more details, see the official GitHub Actions documentation: https://docs.github.com/en/actions