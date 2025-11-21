# How to Upload Project to GitHub

## Step-by-Step Guide

### Prerequisites
- GitHub account
- Git installed on your computer
- A GitHub repository created (either empty or existing)

---

## Method 1: New Repository (First Time Upload)

### Step 1: Initialize Git (if not already done)
```bash
git init
```

### Step 2: Add All Files
```bash
git add .
```

### Step 3: Create First Commit
```bash
git commit -m "Initial commit: Finance Tracker app"
```

### Step 4: Add Your GitHub Repository as Remote
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

**Replace:**
- `YOUR_USERNAME` - Your GitHub username
- `YOUR_REPO_NAME` - Your repository name

**Example:**
```bash
git remote add origin https://github.com/username/finance-tracker.git
```

### Step 5: Push to GitHub
```bash
git branch -M main
git push -u origin main
```

---

## Method 2: Existing Repository (If repo already has files)

### Step 1: Add Remote (if not already added)
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### Step 2: Pull Existing Files (if any)
```bash
git pull origin main --allow-unrelated-histories
```

### Step 3: Add All Files
```bash
git add .
```

### Step 4: Commit Changes
```bash
git commit -m "Add Finance Tracker app"
```

### Step 5: Push to GitHub
```bash
git push -u origin main
```

---

## Method 3: If Git is Already Initialized

### Step 1: Check Current Status
```bash
git status
```

### Step 2: Add Files
```bash
git add .
```

### Step 3: Commit
```bash
git commit -m "Update: Finance Tracker app"
```

### Step 4: Check Remote (if already set)
```bash
git remote -v
```

### Step 5: Set Remote (if not set)
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### Step 6: Push
```bash
git push -u origin main
```

---

## Common Commands

### Check Git Status
```bash
git status
```

### View Remote Repositories
```bash
git remote -v
```

### Remove Remote (if wrong one)
```bash
git remote remove origin
```

### View Commit History
```bash
git log --oneline
```

### Update Existing Repository
```bash
git add .
git commit -m "Your commit message"
git push
```

---

## Troubleshooting

### Error: "fatal: remote origin already exists"
**Solution:**
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### Error: "Updates were rejected"
**Solution:**
```bash
git pull origin main --rebase
git push
```

### Error: "Authentication failed"
**Solution:**
- Use Personal Access Token instead of password
- Or use SSH keys
- GitHub doesn't accept passwords anymore for HTTPS

### Generate Personal Access Token
1. Go to GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token
4. Copy token and use as password when pushing

---

## Best Practices

1. **Don't commit sensitive files:**
   - `.env` files (already in .gitignore)
   - API keys
   - Passwords

2. **Commit frequently:**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```

3. **Use meaningful commit messages:**
   - "Add transaction feature"
   - "Fix coupon search bug"
   - "Update dashboard UI"

4. **Create .gitignore** (already exists in your project)
   - Prevents committing node_modules, .env, etc.

---

## Quick Reference

```bash
# Initialize
git init

# Add files
git add .

# Commit
git commit -m "Your message"

# Add remote
git remote add origin https://github.com/USERNAME/REPO.git

# Push
git push -u origin main

# Update later
git add .
git commit -m "Update message"
git push
```

