# GPT-5.4 Prompt For Figma Redesign Integration

```text
You are GPT-5.4 operating as Codex inside the repository at:
/Users/alptalhayazar/personal/portfolio-website

You will be run in Plan mode first.

Your job is to update the existing production portfolio project by using the Figma-generated redesign artifact at:
/Users/alptalhayazar/personal/portfolio-website/.claude/redesign/portfalp

Core objective:
- Take the design system, layout direction, visual hierarchy, and interaction ideas from the Figma-generated artifact
- Apply that redesign to the real production portfolio project
- Do not treat the Figma output as a drop-in application replacement
- Treat it as a design and implementation reference that must be translated into the real app architecture

Critical architecture rule:
- The current production project is the source of truth for the real application
- The Figma output is a design artifact and reference implementation
- Do not blindly replace the real app with the Figma Vite/React app
- Port the redesign into the existing project structure and stack in a way that preserves the real app's production capabilities

What must be preserved unless there is a strong reason to improve them:
- Existing Next.js application architecture
- Existing API/contact flow and real form behavior
- Existing security-related behavior where relevant
- Existing SEO, metadata, structured-data, robots, sitemap, and production concerns
- Existing multilingual direction and future translation readiness
- Existing deployment reality: this is a real portfolio, not a static concept

Primary deliverable:
- A real implementation of the redesign inside the production project, on a new branch, with the site updated to reflect the Figma redesign while remaining production-appropriate

Secondary deliverable:
- Better portfolio copy/content where needed, decided collaboratively with me

Working model:
- First understand both codebases
- Then clarify content with me in Turkish
- Then produce a concrete implementation plan
- Then execute the implementation end-to-end
- Do not stop halfway after only planning or only changing a few sections

Git and workspace rules:
- Before making code changes, create a dedicated new branch for this work
- Prefer an isolated worktree if the current workspace is risky or dirty
- Choose a clear branch name such as feat/figma-redesign-integration or something similarly descriptive
- Do not make redesign changes on the current branch
- Do not wait until the entire project is finished to create a single giant commit
- Commit incrementally in logical, reviewable slices
- Each commit should represent a coherent milestone such as foundation setup, layout migration, specific section integration, content pass, or polish/fixes
- Keep commit messages clear and professional
- Prefer multiple small-to-medium high-signal commits over one large dump commit

Plan mode behavior:
- Start with discovery and planning, not coding
- Inspect the current production app and the Figma artifact thoroughly
- Build a mapping between the Figma artifact and the real app
- Identify which parts can be ported directly, which need adaptation, and which must stay from the original app
- Present a clear phased plan before major implementation

Communication rules:
- Speak to me in Turkish during discovery, questions, planning discussion, and content decisions
- Keep technical implementation concise and clear
- Ask questions one at a time when deciding content
- Prefer short, high-signal Turkish questions
- When useful, offer 2-3 strong options in Turkish and recommend one
- Do not overwhelm me with too many questions at once

Content collaboration requirement:
- The visual redesign should come primarily from the Figma output
- The content does not need to match the Figma artifact exactly
- For all important visible copy, collaborate with me in Turkish to decide the best content
- This includes at minimum:
  - hero headline
  - hero supporting text
  - about/positioning copy
  - experience summaries
  - project/case-study summaries
  - skills/capabilities framing
  - contact CTA and contact section tone
  - any short personal-brand statements that materially affect perception

Important content rule:
- Do not silently invent final portfolio copy for high-visibility sections without first validating direction with me
- You may draft proposed copy, but discuss it with me in Turkish first when the wording materially affects positioning
- Optimize the copy for who I actually am: a senior backend-focused engineer with enterprise/B2B/B2G/system-design credibility

Relevant personal/professional context:
- Name: Alp Talha Yazar
- Positioning: Senior Backend Developer / Software Engineer
- Core strengths: .NET, C#, ASP.NET Core, microservices, enterprise applications, APIs, PostgreSQL, Redis, Docker, Kubernetes
- Secondary strengths: React, Next.js, TypeScript, Blazor, Tailwind CSS, broader full-stack fluency
- Audience: CTOs, engineering managers, technical recruiters, startup founders, serious consulting opportunities
- Desired perception: senior, technically deep, reliable, architecture-minded, business-relevant, modern

Career context:
- Dias (Atlastek): backend development for enterprise-level B2G tracking and management systems
- Wiro AI: AI/ML infrastructure, model testing interfaces, GPU worker systems, request distribution, APIs, monitoring
- Jetlink: chatbot platform spanning CMS, APIs, UI, reporting, integrations, and legacy-to-modern migration

Likely redesign surfaces to implement:
- Home page / main portfolio experience
- Header/navigation
- Hero
- About / positioning
- Experience
- Projects or case-study style highlights
- Skills / capabilities
- Contact / conversion section
- Footer
- 404 page
- Responsive/mobile states
- Important interaction states such as nav behavior and contact form states

Implementation expectations:
- Audit the Figma artifact structure and style system
- Audit the real production app structure and constraints
- Translate the redesign into the production stack instead of forcing the production app to imitate the artifact's architecture
- Reuse only the parts of the artifact that make sense
- Preserve production-grade behavior
- Avoid regression in core functionality

Specific technical expectation:
- The Figma artifact appears to be a separate React/Vite-style app with its own components and routes
- The production app is a Next.js-based real site
- Your task is not "merge both apps blindly"
- Your task is "extract the redesign and implement it correctly in the production app"

Quality bar:
- The result should feel like the Figma redesign truly landed in the real product
- It should not feel like a rushed visual overlay
- It should not break production logic just to imitate the artifact
- It should not keep old visuals where the redesign should replace them

Non-negotiable execution rule:
- Do not stop after only porting the hero
- Do not stop after only porting the homepage if supporting states/pages are missing
- Do not leave the redesign half-integrated
- Finish the scope needed for a coherent production-ready redesign

Expected workflow:
1. Inspect current repository state
2. Inspect the Figma-generated artifact in detail
3. Compare architecture, components, pages, styles, and states
4. Ask me Turkish questions one at a time to determine the best content for the redesigned site
5. Summarize agreed content direction
6. Produce an implementation plan
7. Create a new branch
8. Implement the redesign in the production project
9. Create logical incremental commits during implementation instead of one final dump commit
10. Verify the relevant parts
11. Report clearly what changed, what was preserved, and any remaining risks

Questioning priority for content:
- Start with the highest-impact copy decisions first
- Good order:
  1. overall positioning
  2. hero headline/subheadline
  3. about section tone
  4. project framing
  5. contact CTA tone
- Keep questions in Turkish
- Prefer one question per message during content discovery

Decision principle:
- When there is tension between preserving exact old content and matching the new redesign, preserve the redesign's quality but adapt the content deliberately with me
- When there is tension between pretty visuals and production correctness, choose production correctness without sacrificing the core redesign

Completion rule:
- Do not claim completion until the redesign is actually integrated into the production project on a new branch
- Do not claim completion until the most important flows and pages are updated
- Do not claim completion until you have verified the relevant changes with real commands
- Do not leave the git history as a single giant end-of-task commit if the work naturally spans multiple meaningful milestones

Final instruction:
- Be proactive, rigorous, and practical
- Ask me content questions in Turkish
- Implement in the real codebase, not in the Figma artifact folder
- Use the Figma artifact as the visual/design source
- Finish the redesign properly instead of leaving a partial migration
- Use best-practice commit hygiene throughout the work, with incremental logical commits
```
