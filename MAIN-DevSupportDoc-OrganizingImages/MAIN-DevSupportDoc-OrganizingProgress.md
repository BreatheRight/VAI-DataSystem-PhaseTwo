VAI-DataSystem Revisions Guide
Features:
* Screenshot Dictionary of current pages for both mobile survey app and admin dashboard.
* System Architecture Diagrams
* Product Backlog for Both Apps - includes detailed functions, components, and descriptions. Has each component or item marked as “Implemented” (working in live dev environment) or as “Planned” (needs to be implemented/created by the project delivery deadline).
* Out-of-Scope Components and Enhancements - List of features not part of scope baseline in original project management plan.
DEADLINE: December 2nd, 2025
LIVE DEMO WITH STAKEHOLDERS: December 3rd, 2025
________________


Van Alen Institute Public Art Impact Measurement System
Project Overview The Van Alen Institute, a nonprofit organization dedicated to inclusive urban design, is launching two community-led public art installations in Spring 2025. To measure the impact of these installations, a data collection application is being developed to facilitate real-time data gathering, survey inputs, and observational logging at installation sites. This system will provide automated data analysis, visualization tools, and reporting capabilities, allowing stakeholders to make data-driven decisions and advocate for further community-focused public art initiatives.
________________


Section 1 - Screenshots from VAI-DataSystem-PhaseTwo, branch ExecutionPhaseSprint (the target repository and main project to be completed)


User Survey App


  
User Survey App Landing Page. Pressing the Get Started button navigates user to the User Survey App 


  
User Survey App - Installation Selection Page 
  
User Survey App - Question Screen - Multiple Choice Question 
User Survey App - Question Screen - Checkbox Question
  

User Survey App - Question Screen - Likert Scale Question (slide purple dot to select answer) 
* Note: the screenshots up to this point were displayed in desktop view. The user survey app will not be desktop prioritized — it is a mobile-facing responsive web app with all users using mobile to complete survey question  OPTIONAL: Post Survey Sumbission - Get Involved Page w/ Menu component. Donate button redirects to a clean Stripe-like page to donate w/ credit card, Zelle by scanning QR displayed physcially at installation.  




User Survey App - Mobile First Responsive Design Planned Example Wireframes 
  
User Survey App - Mobile Wireframe Sequence of user actions (Welcome screen —> Art Installation Screen —> Questions Screen —> Thank you Screen) 
VAI-DataSystem Integration With Shadcn 7
  
User Survey App - Welcome Screen —> Survey Screen (questions) —> Completion Screen(Thank you screen) 
  
  

Use Case Diagram - User Survey App && Activity Diagram User Flow to Submit Survey — High Level Diagramming (Diagrams created on 5/15/2025) 














Admin Dashboard Web App Screenshots 
  

Admin Dashboard App - Landing Page —> Create Account/SignUp Screen —> Login Screen


CURRENT BUILD SCREENSHOTS - BRANCH: ExuctionPhaseSprint
  

Landing Page


  

Sign Up Page


  

Login Page


  

Admin Dashboard - Current Main Page (shown after successful login)


  

Admin Dashboard - Current Main Page (shown after successful login) 
  

Admin Dashboard - Current Expanded View Modular Card
  

Admin Dashboard - Current Advanced Charts View in Expanded Mode


  

Admin Dashboard - Sidebar - Table View 


  

Admin Dashboard - Sidebar - Event Manager Module 


  

Admin Dashboard - Sidebar - Documentation/User-Guide Screen


  

Admin Dashboard - Sidebar - Documentation/User-Guide Screen Part 2


Admin Dashboard - Sidebar - Documentation/User Guide Part Two. Needs updating as last update to UI/UX was 11/12/2025    
Use Case Diagram - Admin Dashboard && Activity Diagram of Admin Flow of Actions — High Level Diagramming Diagrams created on 5/15/2025




  



Master Sequence/Swim lane Diagram  


  

Revised Dashboard - SCRAPPED - difficulties integrating. Not enough time or energy to get it done by 12/3.
General Site-Structure Changes:
   * Landing Page’s singular “Sign-up” & “Login” User-Admin Segmentation: 


Context: 
Currently, the main landing page displays the VAI logo in top left corner, the Sign-up and Login text to navigate to admin-app in the top right corner, and the central content of the landing page is a brief text description of VAI’s mission as well as the crucial “Start Survey” button that takes a casual user (survey responder) to choose the installation they would like to take a survey for (presented as a grid with large photos of the installation, the title of each respectively, and a button for each to navigate to the desired installation survey question set.)


Solution:
The Sign-Up page should be revised to include the text “Are you a part of Van Alen Staff?” at bottom of the page. Clicking this text on the Sign Up page will redirect to a new accounts related page specifically designed for Van Alen staff sign-up. Personalize this page to reflect enterprise secure sign-up, set stronger password requirements for staff accounts, and adjust input field notification text to reflect the staff-specific password requirements. (Note: the current default for ALL accounts is 8 characters, 1 number, 1 special character). 
Login page re-uses this same new accounts related page structure of adding the text “Are you a part of Van Alen Staff?” to the bottom of the page to allow admins to click on this text and be redirected to their respective signup/login page. 
Landing Page’s singular “Sign-up” & “Login” User-Admin Segmentation ALTERNATIVE SOLUTION: Have a 2 panel layout and option for admin page signin/signup on right hand panel
   
Mockup of Alt. Sign up/Sign in Page
   * We want to implement the ability for non-admin user — a.k.a the art installation attendee — to access the survey of the installation they are present for either through (1) Scanning a QR code while physically present at one of the installations; (2) Typing in the URL of either the installation picker page that is currently implanted
   * <QuestionForCodeAgent> What would be the most secure, frictionless approach to the QR alternative way to start a survey? Would having a URL that leads directly to the start of a specific installation cause issues? Does having that installation selector page act as a guard against accidental starting of surveys that may get abandoned or defend against spam, etc? I'm leaning towards having no direct URL access to a specific installation, and mandating user first goes through the installation selection page. However, this may be abused as a person could type in the URL from anywhere in the world and answer surveys for installations they did not attend - thus poisoning the dataset. We want to avoid bullshit like this as much as possible. The cleaner the data going into Google Firestore is, the more this project will align with VAI’s stakeholder requirements. <QuestionForCodeAgent>
   * Offline Cacheing of Responses(?) to make sure answers get stored even if device goes offline. <QuestionForCodingAgent> This essentially amounts to potentially a lot of partially completed surveys — is this generally acceptable or industry practice to allow for? Do large prominent companies principally store cached question responses, and then if the user doesnt return online after a set time to finish then his entire progress gets deleted ? For example, would this amount to a chunk of code that contacts Firestore to check if a specific userID left an incomplete survey && has not answered within 30 minutes (no activity <30min), his progress is lost and our code contacts Firestore to delete that userID’s corresponding respones?
   * Move the hardcoded questions in repo to Firestore/CloudRun. This will allow admins to change questions for an event and do their own testing without needing to know how to code. 
General Site-Wide UI/UX Enhancements
Use industry standard principles of UI/UX for content and text contrast, readability, etc
   * Professional Admin UI Design: clean, modern interface aligned with VAI branding with some modifications to elevate admin dashboard web app to reflect VAI’s ongoing evolution as an organization with new leaders and young creative geniuses; dashboard should feel secure (avoid unnecessary playful or childlike animations), instead aim for a refined and modestly restrained creative spirit and creative purity.
   * Professional Survey UI Design: clean, modern interface aligned with VAI branding with modifications to enhance survey experience and reflect some warmth, friendly and approachable, modern grassroots ethos emboldened by a century long history of prestige as an organization.
   * Responsive Design Suggestion:
   * Survey App: Must be designed with mobile-first in mind due to scanning of QR codes and ease of use to complete surveys at art installations.
   * Admin Dashboard: Should be responsive, with 70% desktop priority and 30% mobile priority due to export functions, advanced views, filtering and searching large tables in the Table View page.
   * Cards: change the outline color to light grey no opacity blur 30%; this adjustment aims to have natural blending with background while providing just enough contrast between card content and background.
   * UI/UX Requirements:
   * Clean, modern design with consistent spacing
   * Mobile-first responsive design for User Survey App
   * Desktop-first responsive design for Admin Dashboard App
   * Loading states and error handling
   * Form validation with clear error messages
   * Accessible components (ARIA labels, keyboard navigation)
   * No dark mode. White purity; transcendental minimalistic symmetries on off-white
Enhanced Features
Performance Optimization:
   * Image optimization and lazy loading
   * Code splitting and dynamic imports
   * Caching strategies for API calls
   * Optimistic UI updates
Security Best Practices:
   * Input sanitization and validation
   * CORS configuration
   * Environment variable management
   * Secure API endpoints with proper error handling
User Experience:
   * Onboarding flow for new users

   * Empty states with helpful messaging

   * Confirmation dialogs for destructive actions

   * Toast notifications for user feedback

   * Component Consistency: Ensure any components such as search, filter, skip, name email input fields are consistent across the app (re use same component, same size and style, font, and style - only position differently depending on case, or the layout context of the page)

   * Multilingual Support - Spanish : Need a Spanish version of the question and answers and allow usrs to toggle their desired language.

   * Toast Notifications:

      * Toast notifications on successful export or unsuccessful export (user cancels before waiting for export to start.
      * Toast notification on successful event modification, creation, or deletion
________________


Web Based Admin Dashboard App
Landing Page to Sign In or Log Out with Van Alen Institute brand consistent design using graphic elements and pictures, and potentially more text selection options such as a redirect to the main https://vanalen.org website. The graphic elements can use historic images from VAI’s 100+ years of events, showcases, city architectural projects, blueprints, handdrawn architectural sketches from their historic design contests.
This is the main content page for the admin web app. Admin sees this page upon successfully authenticated log-in.
      * Executive Snapshots Module: The page provides a general overview of survey responses, analytics, and survey data through a variety of charts (Pie chart, line chart, donut chart, bar chart/histogram) and KPI metrics presented in cards (Implemented)
      * Real-Time KPI Visualizations such as number of responses, completion rates and sentiment (Implemented)
      * At-a-glance metrics dashboard for leadership decision-making. (Implemented)
      * Quick Filters: Admin can easily filter by art installation to update the charts in realtime. (Implemented)
      * Advanced Charts: Admin accesses advanced chart view by clicking the corners of a card that contains a chart to expand the card size responsively —> large card size reveals multiple charts of the same kind and allows admin to see visualizations of survey question responses; currently, this displays 13 charts of the same type that the original card clicked on was, displaying breakdown of responses to the 13 hardcoded questions. Admin can filter by installation within Advanced Charts view. (Implemented)
      * Quick Export Reporting: Admin can readily export PDF report of the charts he filtered to from the main dashboard page by clicking a button near top right corner of page (Implemented)
      * Analytics: filter data by project, place, time, device or attendee ID and visualize engagement through interactive charts (Implemented)
      * Chart Type Toggle: switch between pie, doughnut, and bar charts dynamically (Implemented)
      * Logout Functionality: secure logout with token invalidation (ensures cookies are safe). (Implemented - However need to double check if it is a secure log out with proper auth handling, etc.*)
      * User Neighborhood Heatmap: Convert Zip Codes provided by survey responders into a slick heatmap embedded in a card in admin dashboard, with color fill intensity of a neighborhood = aggregate of a set of zip codes that constitute each neighborhood in NYC? (Planned)
Sidebar
      1. Event Manager Module:
This page enables admin user to perform Create, Read, Update, Delete on art installations. Currently there are two installations displayed with images and names and non-functional QR code/modify/delete buttons (Sidebar navigation implemented; event manager page implemented; CRUD operations PLANNED)
      * QR code generation and full functionality → Event Manager page displays person at specific art scans QR code provided at the installation and this redirects them to the attendee survey landing page (Landing page implemented; QR functionality partially implemented (a dummy QR code generator button)). (Planned)
      * Event Status Tracking (upcoming, active, closed)
      * Attendance and response tracking per event
      * CRUD Operations (Create, Read, Update, Delete) for event records.
      1. Survey Builder Module:

         * Drag-and-drop or form-based survey question creation

         * Question type support (multiple choice, Likert scale, checkboxes, drop downs, free text)

         * Survey-event association workflow

         * Preview and test functionality before publication

         * Admin can use a folder of templates VAI-consistent brand abstract shapes.

         * Live Demo of Drag-n-Drop minimal

            2. Table View

Shows a table of all unique persons that submitted a survey. (Implemented)

               * Allows for filtering by art installation. (Implemented)
               * Filtering/Searching search survey responses by respondent attributes
               * Reporting: export raw data and charts in CSV/PDF formats (Implemented)
               * Filtering/Searching (Advanced Table Manipulation): search survey responses by respondent attributes or other filters, such as by demographic, by free text response sentiment analysis score, by the delta time start—>submit survey. (Deferred)
               * Attendee Profile: table view individual survey submission respondents details (name, email, responses) (Planned)


               3. Documentation/User Guide:
Displays helpful tips and provides a guide on how to use the admin dashboard - formatted like a Notion Page or Obsidian Documentation Page (*Implemented on 11/10/2025 therefore will need updates with newest changes)


                  4. Settings


                  5. Profile Button(?): Use Shadcn Dashboard’s lowest element in the left sidebar which is a button that displays email or name of the admin logged in. When clicked it shows additional options like Profile, Contact, Red Log Out button. (Planned on integration)

________________


User Survey App
This is the data collection TPS (Transaction Processing Layer) of total system architecture. ‘Users’ here generally mean everyone that is not an admin and/or does not have a valid email domain to sign up to use the admin dashboard. Because the current installations are public installations and are free to attend, many users are random passerby persons who may have never heard of Van Alen Institute before. Foot traffic of passerbys ultimately will play a role in the quantity of submitted surveys and in costs associated with API and Firebase/Firestore + GoogleCloudRun.
<QuestionForCodeAgent> The rules for sign up to access admin dashboard are set in Firebase I think; is this standard industry practice or is there additional code in backend of this codebase that is required to ensure proper auth standards<QuestionForCodeAgent>.
                     * Survey Welcome Page (Planned)
                     * Select Art Installation: Page Show the different art installations that users can choose to complete a survey for. Each installation has a button underneath its hero picture to navigate users to start the survey and start the data capture process. (Implemented).
                     * Survey Start Subtle Transition Animation
                     * Survey Question Page Directory —> Like a question directory for users to know what question they're on and how many questions there are in total (1 2 3 4 5 6, etc.). Faint grey text. Use encouraging mini-animation or color checks to confirm a question has been answered. 
**Update 11/28: Mini-animation component is ready to be implemented. The survey is displayed as stacked cards that the user can swipe to move to the next or previous question.**
                     * Consider letting users skip question and jump to another one before coming back to previous question
                     * Alternative Flow —> Skip question by clicking on directory question number and submit without completing the whole survey. <QuestionForCodeAgent> How practical is this? Will this result in garbage data due to incomplete sets per userID? If we allow submitting without completing all questions, what is the cleaning and validating process like inside Firestore? Is there a clever way, a chunk of code or function that would allow for us to accept partially completed surveys and not ruin integrity of database?<QuestionForCodeAgent>
                     * Survey Submission Animation
                     * Survey Submission Thank You Page
Survey Questions:
                     * Multi-question survey interface with validated input fields
Survey questions are the heart of the entire VAI-DataSystem. When we speak of end-to-end data flow, this is the first point of data capture and initiates the flow of a data point that becomes structured in JSON in Firestore, and eventually finds its way as part of admin analytics, visualizations, KPIs, etc. Therefore, the process of a user answering questions must be engaging, encouraging, familiar and intuitive to navigate through, particularly when using a mobile device. The questions’ content/intention and presentation on screen must be ingeniously crafted to maximize the usefulness of the data. We want to avoid garbage-in-garbage-out situation. Garbage responses can often be a result of low quality or irrelevant questions; we want a quality, research proven questionnaire strategy that uses appropriate variation of presentation of questions
—> Current Question Types: Multiple choice + Likert Scale + Checkboxes + Dropdowns + Free text (new)).
If the question answering process is a smash hit then we win. We want sincere responses and real information to leverage to secure grants - otherwise this is a failed system.
End Main Project Core Deliverables Due 12/02/2025
________________


Other Enhancements & Considerations for Future Development
                     * Admin Dashboard → Mindmap or Cluster Map of most prominent Keywords used in FreeText Response.
                     * Admin Dashboard —> AI Chat Helper for Data Sorting and admins to use natural language queries about the data, site functionality, etc. *** This component is ready to be implemented**
                     * Concerns about data security, and requires Van Alen Institute to confirm approval of integration for live deployment. Can be implemented in a test branch that won’t conflict with the final main branch merge.
                     * User Survey - Post Survey Submission → A “See what others responded” ; acts like a lite, anonymized survey analytics.
                     * Will it fuel coordination amongst people or reveal the differences that separate individuals in a community?
                     * User Survey - Question Set - “Select images that would make the vibe better” presented as a scrollable un-symmetrical arrangement of various artworks or photos, MoMa style.
                     * Neural Image Processing? Pinterest Business calls its audience “Affinities”.
                     * ~~Triggering left hemispheres, see where the non-reflective mind wanders to. Can be a way to keep engagement throughout a text dominant questionnaire. Can additionally be a type of mini-moodboard that the user creates.
                     * ~~Similar to social media services onboarding of “Select your interests” or Pinterest’s “Select a few photos that stand out to you”. They use it for personalization. How exactly are they processing those responses to understand a user and serve a solution that satisfies the user’s impulses, desires, aesthetic inclination? The power of serving images of what the user wants, is to then shift their preferences through incrementation on the originally chosen image’s vibe. They are your curators. Knowing what imagery captures an individual is powerful. Pins knows what you like on a non-critical thinking level. Our default state of being while navigating our environment involves similar functions that work to create “a vibe you feel” - it is possible to force yourself to think critically about everything, but while you are doing that a hundred of other things went past you that you just cannot engage with critically. 90% of waking time is spent non-agentically processing stimuli. Meditation is the zero’ing of agency onto a single source of stimuli.
                     * User Survey - Questions → Fun prediction questions like Polymarket. Selection only, no free text or comments.
                     * Post Submission → As part of the lite data responses showcase from community peers responses, can include a polymarket like prediction chart for the question. All comments disabled… unless VAI can get the hands to curate responses and comments like NYTimes articles do (”Editor Picks”, “Top voted”, “Verified Member/Profession of ___”, then default sort by most upvoted with high quality respones with little attention interweaved in between.
                     * User or Staff Signup - Account Creation → Each new account gets a custom randomly assigned gradient pixelated blob in vaguely shape of person 32px by 32px 
                     * Admin Dashboard - Home Page Layout → Allow admins to set a customized home screen with metrics/charts/KPIs cards that are most useful for them individually. Like Apple Widgets. Allows admins to test different views. Will work particularly well if allowing for natural language prompting of the database for specific information. Set default grid with a card with a plus sign 
________________


Libraries To Consider Importing:
                     1. **https://packery.metafizzy.co/**
(movable modular cards). Can be used for admin dashboard for admins to re arrange/personalize their workspace. Follows from original idea of having a drag to expand size of a card KPI or a table card. Currently to see a KPI or chart without straining or enlargening page size, admin must click on the expand arrow icon on the bottom corner of the card which expands the card as a pop up to fill the entire space horitzontally. This also enables the Advanced View for charts, where multiple charts with more in depth details are shown.
Goal: Responsive design for desktop. Van Alen admins are creative individuals, deep roots in design and self expression -- making even small seamless changes to their dashboard view can feel rewarding. Similar to programmers and their love for window management software to make their layout perfect for their workflow and intuition.
2. **https://embla-carousel.com/get-started/**
**https://github.com/davidjerleke/embla-carousel**
Swipe navigation identical to https://vanalen.org but free, however requires sending requests to Embla’s API.
3. https://heroicons.com/
4. https://github.com/tailwindlabs/tailwindcss
5. Typescript
6. Any libraries in current stack that can achieve a brand-consistent style.
7. Session Replay via Sentry or Google Cloud Run
8. Using Google Cloud Run or Firebase Forms Builder or another library instead of re-creating a manual drag-n-drop survey creator module for the Admin Dashboard - Survey Creation Suite