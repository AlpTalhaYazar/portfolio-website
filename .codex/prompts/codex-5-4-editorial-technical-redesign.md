# Codex 5.4 Prompt For Direct Editorial-Technical Redesign

```text
You are Codex powered by GPT-5.4, operating directly inside this repository:
/Users/alptalhayazar/personal/portfolio-website

You will be run in Plan mode first.

Your job is to redesign and implement this portfolio directly in the real production codebase.
There is no Figma handoff in this workflow.
Do not wait for an external design artifact.
You must inspect the existing site, understand the current implementation, choose the right implementation strategy, and execute the redesign yourself.

Core objective:
- Redesign this portfolio into a high-end editorial-technical experience
- Improve both visual distinctiveness and conversion quality
- Implement the redesign in the real application, not in a throwaway prototype
- Preserve production-grade behavior while substantially upgrading the design

Primary design direction:
The redesign direction is editorial-technical.

What editorial-technical means here:
- Strong editorial composition
- Disciplined, premium typography
- Severe but elegant layout choices
- A controlled technical atmosphere
- A feeling of systems thinking, precision, and authorship
- More “engineered publication” than “generic landing page”
- More “senior systems engineer with design taste” than “flashy portfolio template”

Critical design balance:
The final result must achieve both:
- cool, memorable, visually authored design
- high trust and high conversion for serious hiring and consulting outcomes

Do not optimize for style alone.
Do not optimize for conversion alone.
Find the editorial-technical solution that creates both.

Project identity:
- Name: Alp Talha Yazar
- Positioning: Senior Backend Developer / Software Engineer
- Core specialization: .NET, C#, ASP.NET Core, microservices, enterprise applications, APIs, PostgreSQL, Redis, Docker, Kubernetes
- Secondary strength: React, Next.js, TypeScript, Blazor, Tailwind CSS, broader full-stack fluency
- Audience: CTOs, engineering managers, technical recruiters, startup founders, and consulting clients
- Desired perception: senior, technically deep, reliable, architecture-minded, modern, and worth contacting for serious work

What this portfolio must communicate:
- I build robust backend systems, not just interfaces
- I understand reliability, scale, maintainability, and architecture
- I have enterprise-grade B2B and B2G experience
- I can ship real production systems
- I also have enough full-stack fluency to deliver complete solutions when needed
- I am deliberate, modern, and technically sharp

Business and career context:
- This is a real portfolio for hiring and consulting outcomes, not a design exercise
- I am based in Turkey and open to remote opportunities
- Current/Recent experience includes:
  - Dias (Atlastek): enterprise-level B2G tracking and management systems
  - Wiro AI: AI/ML infrastructure, request distribution, APIs, GPU-worker related systems, monitoring
  - Jetlink: chatbot platform spanning CMS, APIs, UI, reporting, integrations, and modernization

Important implementation rule:
- The existing production application is the source of truth
- Redesign the real app directly
- Do not create an isolated demo unless you have a very strong reason and the production implementation still remains the final target
- Do not reduce the site to a static mock just to make the redesign easier

What must be preserved unless there is a strong reason to improve them:
- Existing Next.js architecture
- Existing real contact functionality and API behavior
- Existing security-related behavior where relevant
- Existing metadata, SEO, structured data, robots, sitemap, and production concerns
- Existing multilingual direction and future translation readiness
- Existing deployable, production-appropriate behavior

Expected workflow:
1. Inspect the current codebase and current live design structure
2. Understand the current visual system, content model, and technical constraints
3. Ask me Turkish questions one at a time to refine the most important content decisions
4. Summarize the agreed content direction
5. Produce a phased redesign + implementation plan
6. Create a dedicated new branch before making code changes
7. Implement the redesign in the real app
8. Commit incrementally in logical reviewable slices during implementation
9. Verify the relevant parts with real commands
10. Report what changed, what was preserved, and any remaining risks

Plan mode behavior:
- Start with discovery and planning, not coding
- Inspect the codebase carefully before proposing changes
- Understand existing app structure, sections, styles, data flow, content sources, and critical production features
- Build a concrete mapping from current site structure to the redesigned editorial-technical structure
- Present a phased plan before substantial implementation

Communication rules:
- Speak to me in Turkish during planning, discovery, and content decisions
- Ask content questions one at a time
- Prefer short, high-signal Turkish questions
- When useful, offer 2-3 strong options in Turkish and recommend one
- Keep technical reporting concise and direct

Content collaboration requirement:
- You may improve the content and rewrite copy where needed
- But for high-visibility positioning copy, collaborate with me in Turkish before finalizing
- This includes at minimum:
  - hero headline
  - hero supporting text
  - about/positioning copy
  - experience summaries
  - project or case-study framing
  - skills/capabilities framing
  - contact CTA tone

Important content rule:
- Do not silently invent final portfolio copy for the most visible positioning layers without checking with me
- You may draft proposals, but validate the direction with me in Turkish first
- Optimize the copy for senior backend / enterprise / systems credibility

Structural preference:
- A strong single-page portfolio is preferred
- Multiple pages are allowed only if they clearly improve the result
- In either case, all required sections and key states must be fully implemented before claiming completion

Required surfaces:
- Main portfolio experience
  Includes: header/navigation, hero, about/positioning, experience, projects or case-study highlights, skills/capabilities, contact/conversion, footer
- 404 / not found page
- Responsive/mobile version of the main experience
- Important interactive states such as navigation and contact form states

Design requirements:
- The redesign must be unmistakably editorial-technical
- Typography must do real strategic work
- Layout must feel deliberate, premium, and composed
- The first screen must feel strong and ownable
- The page must remain strong below the fold, not just in the hero
- The site should feel more authored than templated
- Avoid generic developer-portfolio clichés
- Avoid bland startup SaaS aesthetics
- Avoid decorative complexity with no content value
- Avoid overly gamer/cyberpunk styling

Conversion and trust requirements:
- The site must not only look cool; it must also convert
- The first screen should establish both taste and credibility
- Add trust signals early enough that the site does not feel like pure attitude
- Conversion should come from clarity, proof, hierarchy, and credibility
- The page should quickly answer:
  - who this person is
  - what level they operate at
  - what kinds of systems they build
  - why they are credible
  - what the visitor should do next

Hero requirements:
- The hero must be the strongest part of the experience
- The headline should feel bold, ownable, and senior
- The supporting layer should improve trust, not just add decoration
- Include strong CTA hierarchy
- Include an early proof layer in or near the hero
- Proof may include:
  - years of experience
  - B2B / B2G / enterprise signals
  - production systems / architecture / reliability cues
  - technologies used in credible moderation

Technical implementation expectations:
- Reuse and adapt existing architecture where appropriate
- Improve design system tokens, spacing, typography, section structure, and component patterns as needed
- Do not compromise production features just to get the visuals faster
- Keep the codebase maintainable
- Preserve or improve responsiveness and accessibility

Git and workspace rules:
- Before making code changes, create a dedicated new branch for this redesign
- Prefer an isolated worktree if the current workspace is risky or dirty
- Choose a clear branch name such as feat/editorial-technical-redesign
- Do not implement the redesign on the current branch
- Do not leave all work for one giant final commit
- Commit incrementally in logical, reviewable slices
- Each commit should represent a coherent milestone
- Keep commit messages clear and professional
- Prefer multiple small-to-medium high-signal commits over one dump commit

Non-negotiable execution rule:
- Do not stop after only redesigning the hero
- Do not stop after only redesigning the homepage if supporting surfaces are missing
- Do not leave the redesign half-integrated
- Do not claim completion until the redesign is actually implemented in the production project

Verification rule:
- Do not claim success without running real verification commands
- Verify the relevant parts after implementation
- Report actual results, not assumptions

Completion rule:
- Do not claim completion until:
  - the redesign is implemented in the real app on a new branch
  - the important pages/sections/states are updated
  - the core experience is coherent on desktop and mobile
  - the 404 page is updated to match
  - relevant verification has been run
  - the git history reflects logical incremental commits rather than one final dump commit

Final instruction:
- Be proactive, rigorous, and practical
- Ask me content questions in Turkish
- Redesign the real codebase directly
- Use an editorial-technical design approach
- Build both coolness and conversion
- Finish the redesign properly instead of leaving a partial migration
```
