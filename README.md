NetWorthy
NetWorthy is a full-stack web application designed to help individuals track their net worth and manage their financial assets with clarity and control.

NetWorthy enables users to:
Authenticate securely using Google login.
Track net worth by managing various asset and liability categories.
Monitor investments like stocks in real-time.
Manage liabilities, such as loans, mortgages, and lines of credit.
Convert foreign assets into a preferred currency.
Visualize trends in assets and net worth over time.
Maintain control over personal data via profile and security settings.

Tech Stack
Frontend
Framework: Next.js (using App Router)
Language: TypeScript
UI: React
Styling: Tailwind CSS
Backend
GraphQL Server: GraphQL Yoga
Database ORM: Prisma
Database: PostgreSQL
Auth: NextAuth.js

Get Started

1. Create a .env file in the root of the project
   – Ask the project owner for the .env template or values
   – Update the DATABASE_URL and other credentials as needed
2. Install dependencies
   npm install
3. Push the Prisma schema to your database
   This will create the necessary tables based on your schema.
   npm run push
4. Start the development server
   npm run dev

Developer Tips
GraphQL Playground
Open http://localhost:3000/api/gql
→ This is the GraphQL Yoga playground, a web UI for querying and testing your GraphQL API.

Prisma Studio
Run with: npx prisma studio
→ This opens http://localhost:5555 and provides a visual interface to explore and edit your PostgreSQL database via Prisma.

Folder Structure
NetWorthy/  
├── graphql/  
│ ├-- resolvers.ts // Defines resolver functions for GraphQL queries and mutations
│ └-- schema.ts // Defines the GraphQL schema using SDL
├── prisma/  
│ ├-- migrations/ // Stores database migration history for version control
│ └-- schema.ts // Defines the Prisma schema for database models and relations
├── public/ // Public assets like images, icons, and static files
├── src/app/ // Main application source code (App Router structure in Next.js)
│ ├-- api/ // API routes for handling requests in Next.js (server-side logic)
│ ├-- components/ // React components used across the application
│ └-- page.tsx // Main page component for rendering UI in Next.js
├── .gitignore  
├── eslint.config.mjs // ESLint configuration for maintaining code quality
├── next.config.ts // Next.js configuration file for customizing settings
├── next-env.d.ts // TypeScript environment definitions for Next.js
├── package.json // Defines project dependencies and scripts for Node.js
├── package-lock.json // Locks dependency versions to ensure consistency across environments
├── postcss.config.mjs // PostCSS configuration for processing CSS styles
├── README.md  
└── tsconfig.json // TypeScript configuration file specifying compiler options
