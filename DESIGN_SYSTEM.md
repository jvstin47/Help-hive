# Help Hive: Master Design System & Guidelines

## Part I — Foundation
### 1. Product Vision
Help Hive connects senior citizens with nearby youth volunteers. It is not a gig economy app; it is a digital neighborhood support network. Every interaction must foster trust, dignity, and community.
### 2. Design Philosophy
Mobile-first, trust-focused, and incredibly calm. Functionality over flash. If a feature causes anxiety or confusion, it is redesigned or removed.
### 3. Emotional Design
The app should evoke warmth, safety, and reliability. We avoid harsh colors, aggressive alerts, and overly competitive language.
### 4. User Personas
- **The Requester (Senior):** Values clarity, large touch targets, and reassurance. May have visual or motor impairments.
- **The Volunteer (Youth/Adult):** Values efficiency, clear directions, and community impact. Needs to know they are safe and doing the right thing.
### 5. User Psychology
Requesters often feel vulnerable asking for help; the UX must validate their needs. Volunteers want to help but fear awkwardness or danger; the UX must guide them explicitly.
### 6. Accessibility Philosophy
Accessibility is our primary design driver, not an afterthought. WCAG AAA compliance for contrast. Minimum 48px touch targets. No critical hover-only states.

## Part II — Mobile Experience
### 7. Mobile-First Principles
Design for a 320px width first. Assume the user is operating the device with one hand while distracted.
### 8. Thumb-Zone Ergonomics
Primary actions (Accept, Submit, Emergency) must be in the bottom third of the screen. Destructive actions must require explicit confirmation.
### 9. Navigation System
Flat hierarchy. Users should never be more than two taps away from the home screen.
### 10. Information Hierarchy
One primary action per screen. Secondary actions are visually subdued. 
### 11. Screen Composition
Top: Context (Where am I?). Middle: Content (What is this?). Bottom: Action (What do I do?).
### 12. Responsive Behaviour
Fluid typography. Cards expand to fill width on mobile, and grid out on tablets.

## Part III — Visual Language
### 13. Brand Identity
Community, warmth, and trust. 
### 14. Color System
- **Primary:** Deep Blue (Trust, Calm)
- **Success:** Soft Green (Reassurance)
- **Warning:** Soft Orange (Alert without panic)
- **Danger:** Deep Red (Emergency only)
- **Background:** Off-white/Gray-50 (Reduces eye strain compared to pure white).
### 15. Typography
Modern, readable sans-serif (e.g., Inter or Geist). Base size is 18px for Requesters, 16px for Volunteers. High contrast.
### 16. Spacing Scale
Generous padding. Use 4-point grid system (8, 16, 24, 32, 48, 64).
### 17. Elevation
Use background colors (gray to white) to show elevation rather than heavy drop shadows.
### 18. Shadows
Soft, diffuse shadows only for primary call-to-action buttons and floating elements (FABs).
### 19. Border Radius
Rounded and friendly. Use 16px (xl) or 24px (2xl) or 3xl for cards and buttons. Sharp corners are forbidden.
### 20. Iconography
Lucide-react. Stroke width 2. Solid, recognizable metaphors (House, Phone, Heart).
### 21. Illustration Style
Abstract, soft shapes. No complex vectors that distract from the primary task.

## Part IV — Components
### 22. Buttons
Massive (min height 64px for Requesters). Clear, action-oriented verbs ("Start Travel", not "Submit").
### 23. Cards
Outlined with subtle borders. Used to group distinct thoughts (a Request, a Profile).
### 24. Forms
Single column. Labels above inputs. Never rely solely on placeholders.
### 25. Inputs
Large tap areas. High contrast focus rings (`focus:ring-4 focus:ring-primary/30`).
### 26. Lists
Ample spacing between items. Clear chevron icons indicating interactivity.
### 27. Bottom Sheets
Used for workflows and actions rather than navigating to entirely new pages.
### 28. Navigation Bars
Sticky tops for context, sticky bottoms for actions.
### 29. FABs
Used strictly for Emergency (Requester) or high-priority global actions.
### 30. Status Badges
Color-coded capsules (Green = Done/Good, Blue = In Progress, Gray = Draft).
### 31. Timelines
Vertical, connecting lines with clear active/inactive states to show workflow progress.
### 32. Empty States
Encouraging and actionable. Never a blank screen. (e.g., "You're all caught up!").
### 33. Loading States
Skeletons matching the content shape. No indefinite spinners without text context.
### 34. Error States
Apologetic and helpful. Always provide a "Retry" or "Go Home" button.
### 35. Toasts
Used sparingly for non-critical confirmations (e.g., "Draft saved").
### 36. Dialogs
Require explicit interaction. Used for destructive actions or emergencies.
### 37. Search
Auto-expanding, debounced. Large tap targets.
### 38. Filters
Pill-shaped toggle buttons, horizontally scrollable.

## Part V — UX
### 39. Senior Experience
Must eliminate tech-anxiety. Always provide an escape hatch (back button) and clearly explain what will happen next before they commit to an action.
### 40. Volunteer Experience
Must eliminate safety/awkwardness anxiety. Provide explicit context about the requester and step-by-step guidance.
### 41. Trust System
All profiles require photos and verification badges. Bios should be humanizing.
### 42. Safety UX
The Safety Banner is persistent for unassigned requests. Emergency FAB is universally accessible for requesters.
### 43. Emergency UX
Red is reserved exclusively for emergencies. Emergency dialogues must require deliberate confirmation to prevent accidental triggering.
### 44. Messaging UX
Large chat bubbles. Time-stamped. Include quick-reply chips for volunteers (e.g., "I'm 5 mins away").
### 45. Notifications
Systemic but quiet. Do not spam. Group by request.
### 46. Request Lifecycle
Draft -> Submitted -> Assigned -> Traveling -> Arrived -> Helping -> Completed -> Reviewed.
### 47. Volunteer Journey
Discover -> Accept -> Assist -> Get Recognized.

## Part VI — Motion
### 48. Motion Principles
Motion must have purpose: guiding attention or confirming an action. No decorative bouncing.
### 49. Animation Timing
Snappy but smooth (200-300ms).
### 50. Springs
Use subtle spring physics for drawer/modal reveals to feel natural.
### 51. Haptics
Trigger light haptics on status changes (Assigned, Completed).
### 52. Microinteractions
Buttons should subtly scale down (`active:scale-95`) when tapped to provide immediate tactile feedback.
### 53. Transitions
Use fade-in and slide-in from right (`animate-in fade-in slide-in-from-right-4`) for forward navigation.
### 54. Skeletons
Shimmering skeletons for loading states instead of spinners.

## Part VII — Polish
### 55. Premium Feel
White space is luxury. Do not cram information. Use subtle border colors (`border-gray-100`) instead of harsh lines.
### 56. Native Android Feel
Bottom navigation, ripple effects on Android if possible, and respecting the system back button.
### 57. Material 3 Adaptation
We draw inspiration from Material 3's rounded corners and pastel tones, but we override strict Material rules in favor of larger accessibility targets.
### 58. Capacitor Best Practices
Ensure top padding accounts for the iOS/Android status bar (safe-area-inset-top) when eventually compiled to native.
### 59. Performance Perception
Optimistic UI updates. If a volunteer taps "Accept", update the UI instantly while the network request fires in the background.
### 60. Design QA Checklist
Every PR must pass: Contrast check, 48px touch target check, offline state check.

## Part VIII — AI Rules
### 61. Rules for Antigravity
When operating in this codebase, the AI must strictly adhere to the UI components already established. Never introduce a new raw HTML button if `<Button>` exists.
### 62. Rules for Future Prompts
When asked to build a new feature, default to Mobile-First and Senior-First paradigms. Do not assume desktop behavior.
### 63. Things AI Must Never Do
1. Never introduce complex, multi-column layouts on mobile.
2. Never reduce text size below 16px.
3. Never use generic Tailwind colors (e.g., `bg-red-500`) when semantic tokens exist.
4. Never build competitive "leaderboards" for volunteers.
### 64. Reusable Design Principles
If a pattern solves a problem once, use it everywhere. Consistency builds trust.
