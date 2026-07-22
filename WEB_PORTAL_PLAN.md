# Web Portal Plan

## 1. Goal
Turn the current React-based authentication app into a full web portal for users, content management, and admin operations.

The current project already has a strong foundation for:
- user sign-up and login
- onboarding screens
- dashboard entry point
- content creation flow

This plan expands that base into a professional web portal.

---

## 2. Current Project Status
- Web app is running locally at http://localhost:5174
- Frontend stack: React + Vite + Tailwind CSS
- Existing auth foundation: AWS Cognito-based login and onboarding
- Existing app flow: landing page -> auth -> dashboard -> content creation

---

## 3. Portal Vision
The web portal should provide:
- a polished public landing page
- secure user authentication
- personalized dashboard experience
- role-based access for users/admins
- content creation and management
- profile and settings management
- analytics and reporting later

---

## 4. Suggested Portal Modules

### A. Public Pages
- Home / Landing page
- About page
- Pricing / plans page (optional)
- Contact / support page

### B. Authentication Pages
- Login
- Register
- Forgot password
- Email/phone verification
- Google OAuth flow

### C. User Dashboard
- Overview cards
- Recent activity
- My profile
- Settings
- Create content
- Manage content

### D. Admin Panel
- User management
- Content moderation
- Reports / statistics
- System settings

---

## 5. Recommended Architecture

### Frontend
- React + Vite
- Tailwind CSS
- Reusable components
- Route-based pages

### Authentication
- Keep AWS Cognito for secure login
- Add role-based access control later

### Backend / Data Layer
- Use a backend service for portal data storage
- Suggested options:
  - Firebase
  - Supabase
  - Node.js + Express
  - AWS Amplify + AppSync

### Storage
- Profile images and media uploads
- Content files and documents

---

## 6. Implementation Phases

### Phase 1 — Foundation Upgrade
Objectives:
- clean up the current UI
- define portal layout and navigation
- create reusable page templates
- improve mobile responsiveness

Deliverables:
- modern navbar/sidebar
- landing page
- consistent styling system
- improved dashboard shell

### Phase 2 — Authentication and User Flow
Objectives:
- keep auth working smoothly
- improve onboarding experience
- add protected routes
- support user profile creation

Deliverables:
- login/register pages polished
- protected route guard
- user profile setup
- session persistence

### Phase 3 — Core Portal Features
Objectives:
- build the main portal experience
- add dashboard widgets
- add content management screens
- enable profile and settings pages

Deliverables:
- dashboard overview
- create content form
- content list page
- edit/delete actions
- profile management

### Phase 4 — Admin and Advanced Features
Objectives:
- add admin access
- add user moderation
- add reporting and analytics
- improve notifications and search

Deliverables:
- admin dashboard
- user management
- moderation tools
- analytics charts

### Phase 5 — Deployment and Hardening
Objectives:
- deploy to hosting
- secure environment variables
- optimize performance
- test all user journeys

Deliverables:
- production build
- deployment pipeline
- monitoring and error handling
- final QA checklist

---

## 7. MVP Scope
For the first version, focus on these features only:
- landing page
- login/register
- dashboard
- profile settings
- content creation and listing
- simple admin panel

This keeps the project realistic and launchable.

---

## 8. Suggested Page Structure
- / → Landing page
- /login → Login
- /register → Register
- /dashboard → User dashboard
- /profile → Profile page
- /content → Content management
- /content/new → Create content
- /admin → Admin panel

---

## 9. Development Timeline

### Week 1
- improve UI and navigation
- design portal layout

### Week 2
- implement protected routes and user profile flow

### Week 3
- build dashboard and content management screens

### Week 4
- add admin panel and polish the experience

### Week 5
- deployment, testing, and fixes

---

## 10. Recommended Next Steps
1. Finalize the portal purpose and target users
2. Decide on the backend service to power portal data
3. Create the page structure and navigation
4. Build the dashboard and content management screens first
5. Add admin features after the core experience is stable

---

## 11. Recommendation
Use the current app as the authentication and onboarding foundation, then evolve it into a portal with a clean dashboard, content workflows, and admin tools. This approach reduces rework and keeps development focused.
