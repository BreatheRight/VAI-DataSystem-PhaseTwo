## Next Phase Recomendations 12-5-2025

### Critical Path Items

1. **Implement QR Code Generation** - Required for field deployment (IMPLEMENTED BUT LOCALHOST ONLY URL LINK)
2. **Implement Event CRUD** - Admin must manage event/installation records (IMPLEMENTED BUT NOT TESTED)
3. **Add Role-Based Access Control** - Different permissions for different staff (TO-DO)
4. **Configure Production Firebase Rules** - Secure data access patterns (TO-DO)
5. **Add E2E Testing** - Selenium or Cypress for workflow validation (DO NOT NEED?)
6. **Implement Pagination** - For datasets >1000 responses (TO-DO)
7. **Spanish Version of Mobile Survey App** - Ability for users to toggle to spanish version of questions and have submission correctly register in Firebase (TO-DO)
8. **Ensure Mobile App Survey Question Formats Work With the New Stacked Card Layout** - Currently Likert Scale and Slider question formats do not work. Multiple Choice and Checkbox works.
9. **Add Website Analytics Capture** - Include Dynatrace-like logging of user interactions with website to enable User Session Replays
10. **Add a databank of question sets to survey creation suite page** - Implement at least 3 template survey question sets (10 questions per set). Enable admin to select a template and apply it to a specific installation/event, and have the mobile survey app update to show the new questions. Note: questions should not be hardcoded into the current codebase
11. **Fonts Adjustment** - Implement the Founders Grotesk font for headings and use Inter for body. Ensure professional use of font weights and luminance.
12. **Enable using media resources from online websites in Event Creator"** - Integrate input search bar that links to Pexels, Unslpash, and Pixabay free images for admins to be able to discover free assets in addition to being able to upload their own or use the hardcoded images in "frontend/public"

### Quality Improvements

1. **Add Unit Tests** - Jest for React, pytest for Flask
2. **Set up Monitoring** (VERCEL MONITORING AVAILIBLE BUT NOT CONFIGURED)
3. **Implement Rate Limiting** - API protection (TO-DO)
4. **Add Input Validation** - Server-side validation for all API endpoints (NOT SURE IF IMPLEMENTED)
5. **Documentation Update** - Need new Change Log, new Bug Report, new system architecture breakdown doc
6. **Brand-Consistent Design** - Remove all emojis, restrict icons to minimal use, rework UI to reflect the Van Alen Brand Style Guide

### Features for Future

1. **Settings Page Functionality** - User preferences, notification settings, changing password (TO-DO)
2. **Dark Mode** - Complete design system (DEFERRED FOR NEXT TEAM)
3. **Additional Filters** - Date range, zip code, demographics (TO-DO)
4. **Scheduled Reports** - Automated monthly email summaries (DEFERRED FOR NEXT TEAM)
5. **Data Export Options** - SQL, JSON, Parquet formats (DEFERRED FOR NEXT TEAM)
6. **Advanced Analytics** - Correlation analysis, trend forecasting (TO-DO)
7. **Mobile App** - Native iOS/Android version (DEFERRED FOR NEXT TEAM)
8. **Collaboration Features** - Team comments, shared annotations (DEFERRED FOR NEXT TEAM)
