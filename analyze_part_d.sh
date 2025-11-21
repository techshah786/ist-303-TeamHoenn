#!/bin/bash

# IST 303 TeamHoenn - Part D Completion Analyzer
# This script checks if all Part D requirements are met

echo "════════════════════════════════════════════════════════════════"
echo "IST 303 TeamHoenn - Part D Completion Analysis"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Analyzing repository: $(pwd)"
echo "Timestamp: $(date)"
echo ""

# Initialize counters
COMPLETED=0
TOTAL=0
WARNINGS=0
ERRORS=0

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}═════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}PART D REQUIREMENT CHECKLIST (160 points)${NC}"
echo -e "${BLUE}═════════════════════════════════════════════════════════════════${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════════════
# 1. MILESTONE 2.0 DEMO (40 pts)
# ═══════════════════════════════════════════════════════════════════════
echo -e "${BLUE}1. MILESTONE 2.0 DEMO (40 pts)${NC}"
TOTAL=$((TOTAL + 40))

# Check if app runs
echo "   Checking if application can be executed..."
if [ -f "run.py" ]; then
    echo -e "   ${GREEN}✓${NC} run.py found"
    COMPLETED=$((COMPLETED + 10))
else
    echo -e "   ${RED}✗${NC} run.py not found"
    ERRORS=$((ERRORS + 1))
fi

# Check app directory structure
if [ -d "app" ] && [ -f "app/__init__.py" ]; then
    echo -e "   ${GREEN}✓${NC} app package structure exists"
    COMPLETED=$((COMPLETED + 5))
else
    echo -e "   ${RED}✗${NC} app package incomplete"
    ERRORS=$((ERRORS + 1))
fi

# Check for templates
if [ -d "app/templates" ] && [ "$(ls -A app/templates 2>/dev/null)" ]; then
    TEMPLATE_COUNT=$(ls -1 app/templates/*.html 2>/dev/null | wc -l)
    echo -e "   ${GREEN}✓${NC} HTML templates found ($TEMPLATE_COUNT files)"
    COMPLETED=$((COMPLETED + 10))
else
    echo -e "   ${YELLOW}⚠${NC} No templates found or templates directory empty"
    WARNINGS=$((WARNINGS + 1))
fi

# Check for demo evidence
if [ -d "docs/MILESTONE_2_DEMO" ]; then
    DEMO_FILES=$(ls -1 docs/MILESTONE_2_DEMO 2>/dev/null | wc -l)
    echo -e "   ${GREEN}✓${NC} Milestone 2.0 demo folder exists ($DEMO_FILES files)"
    COMPLETED=$((COMPLETED + 10))
else
    echo -e "   ${YELLOW}⚠${NC} No dedicated Milestone 2.0 demo folder"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

# ═══════════════════════════════════════════════════════════════════════
# 2. FINAL BURNDOWN CHART (20 pts)
# ═══════════════════════════════════════════════════════════════════════
echo -e "${BLUE}2. FINAL BURNDOWN CHART (20 pts)${NC}"
TOTAL=$((TOTAL + 20))

if [ -f "docs/BURNDOWN.csv" ] || [ -f "docs/burndown.csv" ]; then
    echo -e "   ${GREEN}✓${NC} Burndown chart file exists"
    BURNDOWN_FILE=$(ls docs/*BURNDOWN* docs/*burndown* 2>/dev/null | head -1)
    BURNDOWN_LINES=$(wc -l < "$BURNDOWN_FILE")
    echo -e "   ${GREEN}✓${NC} Burndown data: $BURNDOWN_LINES lines"
    COMPLETED=$((COMPLETED + 15))
else
    echo -e "   ${RED}✗${NC} No burndown chart found"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "docs/LESSONS_LEARNED.md" ] && grep -q "burndown\|sprint\|progress" docs/LESSONS_LEARNED.md; then
    echo -e "   ${GREEN}✓${NC} Burndown analysis/interpretation present"
    COMPLETED=$((COMPLETED + 5))
else
    echo -e "   ${YELLOW}⚠${NC} Burndown interpretation/analysis may be missing"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

# ═══════════════════════════════════════════════════════════════════════
# 3. TEST COVERAGE REPORTING (20 pts)
# ═══════════════════════════════════════════════════════════════════════
echo -e "${BLUE}3. TEST COVERAGE REPORTING (20 pts)${NC}"
TOTAL=$((TOTAL + 20))

if [ -d "tests" ] && [ "$(ls -A tests 2>/dev/null)" ]; then
    TEST_COUNT=$(ls -1 tests/test_*.py 2>/dev/null | wc -l)
    echo -e "   ${GREEN}✓${NC} Test files found ($TEST_COUNT test files)"
    COMPLETED=$((COMPLETED + 8))
else
    echo -e "   ${RED}✗${NC} No test files found"
    ERRORS=$((ERRORS + 1))
fi

# Check for requirements.txt with test tools
if grep -q "pytest" requirements.txt; then
    echo -e "   ${GREEN}✓${NC} pytest dependency found"
    COMPLETED=$((COMPLETED + 2))
else
    echo -e "   ${YELLOW}⚠${NC} pytest not in requirements.txt"
    WARNINGS=$((WARNINGS + 1))
fi

if grep -q "pytest-cov\|coverage" requirements.txt; then
    echo -e "   ${GREEN}✓${NC} pytest-cov dependency found"
    COMPLETED=$((COMPLETED + 3))
else
    echo -e "   ${YELLOW}⚠${NC} pytest-cov not in requirements.txt"
    WARNINGS=$((WARNINGS + 1))
fi

# Check for coverage reports
if [ -d "htmlcov" ] || [ -f ".coverage" ]; then
    echo -e "   ${GREEN}✓${NC} Coverage report artifacts exist"
    COMPLETED=$((COMPLETED + 3))
else
    echo -e "   ${YELLOW}⚠${NC} No coverage report artifacts found (will be generated at runtime)"
    WARNINGS=$((WARNINGS + 1))
fi

# Check for testing documentation
if [ -f "docs/TESTING.md" ] || grep -q "test\|coverage" README.md; then
    echo -e "   ${GREEN}✓${NC} Testing documentation present"
    COMPLETED=$((COMPLETED + 4))
else
    echo -e "   ${YELLOW}⚠${NC} Testing documentation may be insufficient"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

# ═══════════════════════════════════════════════════════════════════════
# 4. RUN INSTRUCTIONS (20 pts)
# ═══════════════════════════════════════════════════════════════════════
echo -e "${BLUE}4. RUN INSTRUCTIONS (20 pts)${NC}"
TOTAL=$((TOTAL + 20))

if [ -f "RUN_INSTRUCTIONS.md" ]; then
    echo -e "   ${GREEN}✓${NC} RUN_INSTRUCTIONS.md exists"
    LINES=$(wc -l < RUN_INSTRUCTIONS.md)
    echo -e "   ${GREEN}✓${NC} File size: $LINES lines"
    COMPLETED=$((COMPLETED + 5))
else
    echo -e "   ${RED}✗${NC} RUN_INSTRUCTIONS.md not found"
    ERRORS=$((ERRORS + 1))
fi

# Check README for run instructions
if grep -q "How to Run\|Setup\|Installation\|python run.py" README.md; then
    echo -e "   ${GREEN}✓${NC} Run instructions present in README.md"
    COMPLETED=$((COMPLETED + 5))
else
    echo -e "   ${YELLOW}⚠${NC} Run instructions may be incomplete in README"
    WARNINGS=$((WARNINGS + 1))
fi

# Check for virtual environment docs
if grep -q "venv\|virtual environment" RUN_INSTRUCTIONS.md 2>/dev/null || grep -q "venv\|virtual environment" README.md; then
    echo -e "   ${GREEN}✓${NC} Virtual environment setup documented"
    COMPLETED=$((COMPLETED + 3))
else
    echo -e "   ${YELLOW}⚠${NC} Virtual environment setup not clearly documented"
    WARNINGS=$((WARNINGS + 1))
fi

# Check for dependency installation
if grep -q "pip install\|requirements.txt" RUN_INSTRUCTIONS.md 2>/dev/null || grep -q "pip install" README.md; then
    echo -e "   ${GREEN}✓${NC} Dependency installation documented"
    COMPLETED=$((COMPLETED + 3))
else
    echo -e "   ${YELLOW}⚠${NC} Dependency installation may not be documented"
    WARNINGS=$((WARNINGS + 1))
fi

# Check for troubleshooting
if grep -q "troubleshoot\|issue\|error\|problem" RUN_INSTRUCTIONS.md 2>/dev/null; then
    echo -e "   ${GREEN}✓${NC} Troubleshooting section present"
    COMPLETED=$((COMPLETED + 4))
else
    echo -e "   ${YELLOW}⚠${NC} Troubleshooting section may be helpful"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

# ═══════════════════════════════════════════════════════════════════════
# 5. LESSONS LEARNED DOCUMENT (20 pts)
# ═══════════════════════════════════════════════════════════════════════
echo -e "${BLUE}5. LESSONS LEARNED DOCUMENT (20 pts)${NC}"
TOTAL=$((TOTAL + 20))

if [ -f "docs/LESSONS_LEARNED.md" ]; then
    echo -e "   ${GREEN}✓${NC} LESSONS_LEARNED.md exists"
    LINES=$(wc -l < docs/LESSONS_LEARNED.md)
    echo -e "   ${GREEN}✓${NC} File size: $LINES lines"
    COMPLETED=$((COMPLETED + 5))
else
    echo -e "   ${RED}✗${NC} LESSONS_LEARNED.md not found"
    ERRORS=$((ERRORS + 1))
fi

# Check for required content sections
if [ -f "docs/LESSONS_LEARNED.md" ]; then
    # Check for key sections
    SECTIONS=0
    if grep -q "What Went Well\|went well\|success" docs/LESSONS_LEARNED.md; then
        echo -e "   ${GREEN}✓${NC} Includes 'What Went Well' section"
        SECTIONS=$((SECTIONS + 1))
    fi
    
    if grep -q "Could.*Improve\|improve\|challenge" docs/LESSONS_LEARNED.md; then
        echo -e "   ${GREEN}✓${NC} Includes 'Improvements' section"
        SECTIONS=$((SECTIONS + 1))
    fi
    
    if grep -q "lesson\|learned\|technical\|process" docs/LESSONS_LEARNED.md; then
        echo -e "   ${GREEN}✓${NC} Includes learnings/reflections"
        SECTIONS=$((SECTIONS + 1))
    fi
    
    if grep -q "recommend\|future\|team" docs/LESSONS_LEARNED.md; then
        echo -e "   ${GREEN}✓${NC} Includes recommendations"
        SECTIONS=$((SECTIONS + 1))
    fi
    
    COMPLETED=$((COMPLETED + 15))
else
    echo -e "   ${YELLOW}⚠${NC} Cannot verify Lessons Learned structure"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

# ═══════════════════════════════════════════════════════════════════════
# 6. PRESENTATION (40 pts)
# ═══════════════════════════════════════════════════════════════════════
echo -e "${BLUE}6. PRESENTATION (40 pts)${NC}"
TOTAL=$((TOTAL + 40))

# Check for presentation files
if [ -f "*.ppt*" ] || [ -f "*.pdf" ] || [ -d "presentation" ]; then
    echo -e "   ${GREEN}✓${NC} Presentation files exist"
    COMPLETED=$((COMPLETED + 15))
else
    echo -e "   ${YELLOW}⚠${NC} Presentation files not found in repo (may be external)"
    WARNINGS=$((WARNINGS + 1))
fi

# Check for presentation content outline
if grep -q "presentation\|slide\|demo\|milestone" README.md; then
    echo -e "   ${GREEN}✓${NC} Presentation outlined in documentation"
    COMPLETED=$((COMPLETED + 10))
else
    echo -e "   ${YELLOW}⚠${NC} Presentation outline may be external"
    WARNINGS=$((WARNINGS + 1))
fi

# Note about live presentation
echo -e "   ${YELLOW}⚠${NC} Live presentation assessment: Will be graded during presentation (25 pts)"
echo -e "   ${YELLOW}ℹ${NC} Presentation expected: 15-20 minutes"

echo ""

# ═══════════════════════════════════════════════════════════════════════
# 7. GITHUB REPOSITORY STATE (20 pts)
# ═══════════════════════════════════════════════════════════════════════
echo -e "${BLUE}7. GITHUB REPOSITORY STATE (20 pts)${NC}"
TOTAL=$((TOTAL + 20))

# Check README
if [ -f "README.md" ] && [ -s "README.md" ]; then
    README_SIZE=$(wc -l < README.md)
    echo -e "   ${GREEN}✓${NC} README.md exists ($README_SIZE lines)"
    COMPLETED=$((COMPLETED + 5))
else
    echo -e "   ${RED}✗${NC} README.md missing or empty"
    ERRORS=$((ERRORS + 1))
fi

# Check .gitignore
if [ -f ".gitignore" ]; then
    echo -e "   ${GREEN}✓${NC} .gitignore configured"
    COMPLETED=$((COMPLETED + 2))
else
    echo -e "   ${YELLOW}⚠${NC} .gitignore missing"
    WARNINGS=$((WARNINGS + 1))
fi

# Check for __pycache__ not tracked
if git status | grep -q "__pycache__"; then
    echo -e "   ${RED}✗${NC} __pycache__ being tracked (should be in .gitignore)"
    ERRORS=$((ERRORS + 1))
else
    echo -e "   ${GREEN}✓${NC} __pycache__ not tracked"
    COMPLETED=$((COMPLETED + 2))
fi

# Check git history
GIT_COMMITS=$(git rev-list --all --count 2>/dev/null || echo "0")
echo -e "   ${BLUE}ℹ${NC} Git commits: $GIT_COMMITS"

if [ "$GIT_COMMITS" -gt 5 ]; then
    echo -e "   ${GREEN}✓${NC} Adequate commit history"
    COMPLETED=$((COMPLETED + 3))
else
    echo -e "   ${YELLOW}⚠${NC} Limited commit history (should show incremental development)"
    WARNINGS=$((WARNINGS + 1))
fi

# Check for requirements.txt
if [ -f "requirements.txt" ] && [ -s "requirements.txt" ]; then
    REQ_LINES=$(wc -l < requirements.txt)
    echo -e "   ${GREEN}✓${NC} requirements.txt complete ($REQ_LINES dependencies)"
    COMPLETED=$((COMPLETED + 5))
else
    echo -e "   ${RED}✗${NC} requirements.txt missing or empty"
    ERRORS=$((ERRORS + 1))
fi

# Check .github workflows
if [ -f ".github/workflows/ci.yml" ]; then
    echo -e "   ${GREEN}✓${NC} CI/CD workflow configured"
    COMPLETED=$((COMPLETED + 3))
else
    echo -e "   ${YELLOW}⚠${NC} CI/CD workflow not configured"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

# ═══════════════════════════════════════════════════════════════════════
# ADDITIONAL QUALITY CHECKS
# ═══════════════════════════════════════════════════════════════════════
echo -e "${BLUE}ADDITIONAL QUALITY CHECKS${NC}"
echo ""

# Check for proper documentation structure
echo "Documentation Structure:"
DOCS_FILES=$(ls -1 docs/ 2>/dev/null | wc -l)
echo -e "   ${BLUE}ℹ${NC} Files in docs/: $DOCS_FILES"
if [ -d "docs" ]; then
    ls -1 docs/ 2>/dev/null | sed 's/^/      /'
fi
echo ""

# Check app structure
echo "Application Structure:"
if [ -d "app" ]; then
    APP_FILES=$(find app -name "*.py" | wc -l)
    echo -e "   ${BLUE}ℹ${NC} Python files in app/: $APP_FILES"
    find app -name "*.py" | head -10 | sed 's/^/      /'
fi
echo ""

# Check test coverage
echo "Test Suite:"
if [ -d "tests" ]; then
    TEST_FILES=$(ls -1 tests/test_*.py 2>/dev/null | wc -l)
    echo -e "   ${BLUE}ℹ${NC} Test files: $TEST_FILES"
    ls -1 tests/test_*.py 2>/dev/null | sed 's/^/      /'
fi
echo ""

# ═══════════════════════════════════════════════════════════════════════
# SUMMARY
# ═══════════════════════════════════════════════════════════════════════
echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}COMPLETION SUMMARY${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""

PERCENTAGE=$((COMPLETED * 100 / TOTAL))

echo "Points Completed: $COMPLETED / $TOTAL"
echo "Completion Percentage: $PERCENTAGE%"
echo "Warnings: $WARNINGS"
echo "Errors: $ERRORS"
echo ""

if [ $PERCENTAGE -ge 90 ]; then
    echo -e "${GREEN}Status: EXCELLENT ✓${NC}"
    echo "Your repository appears to meet all Part D requirements!"
else
    echo -e "${YELLOW}Status: NEEDS REVIEW ⚠${NC}"
    echo "Please address the items marked with ${RED}✗${NC} or ${YELLOW}⚠${NC} above."
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo "Recommendations:"
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""

if [ $ERRORS -gt 0 ]; then
    echo -e "${RED}CRITICAL ISSUES (must fix):${NC}"
    if ! [ -f "RUN_INSTRUCTIONS.md" ]; then
        echo "  1. Add RUN_INSTRUCTIONS.md file"
    fi
    if ! [ -f "docs/LESSONS_LEARNED.md" ]; then
        echo "  2. Create docs/LESSONS_LEARNED.md with team reflections"
    fi
    if ! [ -d "tests" ]; then
        echo "  3. Create tests/ directory with test files"
    fi
    echo ""
fi

if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}RECOMMENDED IMPROVEMENTS:${NC}"
    echo "  1. Ensure presentation slides are prepared (10 slides, 5 presenters)"
    echo "  2. Generate coverage reports: pytest --cov=app --cov-report=html"
    echo "  3. Create Milestone 2.0 demo folder with screenshots"
    echo "  4. Verify all 5 team members are listed in README/docs"
    echo "  5. Add commit messages for all recent changes"
    echo ""
fi

echo "Next Steps:"
echo "  • Run tests: pytest -v"
echo "  • Generate coverage: pytest --cov=app --cov-report=html"
echo "  • Test app: python run.py"
echo "  • Review presentation slides"
echo "  • Prepare for in-class presentation"
echo ""

echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo "Analysis complete at $(date)"
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
