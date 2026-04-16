### Abstraction

Nowadays, people often talk about vibe coding and how great it is. As a junior developer, I felt that the agents marketed by behemoths such as OpenAI, Anthropic etc. hindered my learning curve. That is why I decided to make my own agent which lives in the terminal. There are 3 modes, a default mode, a student mode, and a dev mode. 

The default mode is similar to the so-called state-of-the-art models. It is possible to 'vibeslop' any app the user wants. The student mode does not allow the student to write code on his behalf. In fact, it acts as a teacher. It mermorizes the student's learning pattern/curve, makes milestones and so on. The dev mode runs similar to a rubber duck. It does not perform coding tasks on the behalf of the developer, isntead it guides him and encourages the dev to understand his codebase and enhance his learning experience.

### Architecture

/src
├── assets
│   ├── auth
│   │   ├── connected.mp3
│   │   └── background.png
│   │
│   ├── fonts
│   │   └── ...
│   │
│   ├── ionicon
│   │   └── ...
│   │
│   ├── profile
│   │   └── background.png
│   │
│   ├── logo.svg
│   └── ...
│
├── components
│   ├── componentA
│   │   ├── service
│   │   │   ├── index.test.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── index.test.tsx
│   │   ├── index.tsx
│   │   └── styled.ts
│   │
│   └── ...
│
├── containers
│   ├── containerA
│   │   ├── components
│   │   │   ├── sub-componentA
│   │   │   │   ├── index.test.tsx
│   │   │   │   ├── index.tsx
│   │   │   │   └── styled.ts
│   │   │   │
│   │   │   └── sub-componentB
│   │   │       └── ...
│   │   │
│   │   ├── service
│   │   │   ├── index.test.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── index.test.tsx
│   │   ├── index.tsx
│   │   └── styled.ts
│   │
│   └── ...
│
├── core
│   ├── models
│   │   ├── notification.model.ts
│   │   ├── user.model.ts
│   │   └── ...
│   │
│   ├── services
│   │   ├── notification.ts
│   │   ├── notification.test.ts
│   │   ├── user.ts
│   │   ├── user.test.ts
│   │   └── ...
│   │
│   ├── store
│   │   ├── middlewares
│   │   │   └── ...
│   │   │
│   │   ├── auth
│   │   │   ├── actions.ts
│   │   │   ├── epics
│   │   │   │   ├── some-side-effect.ts
│   │   │   │   ├── fetch-stuff.ts
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── reducer.ts
│   │   │   └── selectors.ts
│   │   │
│   │   ├── index.ts
│   │   └── state.ts
│   │
│   └── theme
│       ├── animations.ts
│       ├── global-state.ts
│       └── index.ts
│
├── app.tsx
├── index.tsx
└── router.tsx (10)  
