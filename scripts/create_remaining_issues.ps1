# create_remaining_issues.ps1
# Creates the remaining 2 GSSoC'26 issues safely using stdin piping to avoid PowerShell quoting/variable issues.

# 1. Search Filter issue
$searchFilterTitle = "[FEATURE] Add a Search Filter to the Events Page"
$searchFilterBody = @'
### Description
Our events list is growing rapidly. Users currently have to scroll manually through upcoming and completed sessions. We need to implement an instant client-side keyword search bar and filter tabs.

### Files/Endpoints to Update
- **`src/components/home/Events.tsx`** (Incorporate search matching and tab switches in state hooks, around the `Events()` functional component)
- **`src/components/home/Events.module.css`** (Add standard responsive styling rules for input search controls)

### Proposed Solution
1. Add a text search input field in `src/components/home/Events.tsx` equipped with a search icon (e.g. `Search` from `lucide-react`).
2. Implement local React states for `searchQuery` and `activeCategory` (e.g. All, Workshops, Webinars, Meetups).
3. Filter `upcomingEvents` and `completedEvents` dynamically by checking title, speaker names, or descriptions.
4. Render a clean "No events match your criteria" empty-state graphic when search yields zero matches.

### Acceptance Criteria
- Search filters should operate in real-time as the user types without causing page lags.
- Filtering must support both dark and light modes with proper font readability.
'@

# 2. Next/Previous Page Links issue
$nextPrevTitle = "[BUG] Fix Broken Next/Previous Page Links in Pathway Tutorial"
$nextPrevBody = @'
### Description
In the pathway learning and guide modules, the paginated navigation anchors ("Next" and "Previous" button elements) occasionally link to incorrect route slugs or result in an empty page redirection when the boundaries of the course paths are reached.

### Files/Endpoints to Update
- **`src/components/home/LearningPaths.tsx`** (Validate card redirection routes)
- **`src/components/home/ResourcesTabs.tsx`** (Around the Tab switching / active roadmap details triggers)
- **`src/app/courses/page.tsx`** (Courses landing and timeline boundaries)

### Proposed Solution
1. Ensure the bounds of active paths array are strictly evaluated before allowing redirection.
2. Correctly disable or transition the "Next" button into a "Complete Path & Claim Badge" trigger when reaching the final pathway segment.
3. Ensure navigation paths correctly map to valid routes instead of appending malformed relative paths to the URL query string.

### Acceptance Criteria
- Clicking "Previous" on the initial page must be disabled.
- Reaching the final segment must elegantly guide users back to the paths list or show a completion status rather than throwing blank templates or redirecting to invalid paths.
'@

# Create Search Filter Issue
Write-Host "Creating: $searchFilterTitle..." -ForegroundColor Yellow
$searchFilterBody | gh issue create --title $searchFilterTitle --label "gssoc26,level:intermediate,enhancement" --assignee "@me" --body-file -

if ($LASTEXITCODE -eq 0) {
    Write-Host "Successfully created search filter issue!" -ForegroundColor Green
} else {
    Write-Error "Failed to create search filter issue."
}

# Create Next/Previous Issue
Write-Host "Creating: $nextPrevTitle..." -ForegroundColor Yellow
$nextPrevBody | gh issue create --title $nextPrevTitle --label "gssoc26,level: begiinner,good first issue,type:bug" --assignee "@me" --body-file -

if ($LASTEXITCODE -eq 0) {
    Write-Host "Successfully created next/prev issue!" -ForegroundColor Green
} else {
    Write-Error "Failed to create next/prev issue."
}
