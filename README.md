# NetWorthy
NetWorthy is a full-stack web application designed to help individuals track their net worth and manage their financial assets with clarity and control.

NetWorthy enables users to: </br>
- Authenticate securely using Google login and Username & Password login.</br>
- Track net worth by managing various asset and liability categories.</br>
- Monitor investments like stocks in real-time.</br>
- Manage liabilities, such as loans, mortgages, and lines of credit.</br>
- Convert foreign assets into a preferred currency.</br>
- Visualize trends in assets and net worth over time.</br>
- Maintain control over personal data via profile and security settings.</br>

## Tech Stack
### Frontend
- Framework: Next.js (using App Router)</br>
- Language: TypeScript</br>
- UI: React</br>
- Styling: Tailwind CSS</br>
### Backend
- GraphQL Server: GraphQL Yoga</br>
- Database ORM: Prisma</br>
- Database: PostgreSQL</br>
- Auth: NextAuth.js</br>

## Get Started

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

## Developer Tips
- GraphQL Playground</br>
  Open http://localhost:3000/api/gql</br>
→ This is the GraphQL Yoga playground, a web UI for querying and testing your GraphQL API.</br>

- Prisma Studio</br>
Run with: npx prisma studio</br>
→ This opens http://localhost:5555 and provides a visual interface to explore and edit your PostgreSQL database via Prisma.</br>

## Folder Structure
NetWorthy/  </br>
├── graphql/  </br>
│ └── generated-schema.graphql // Automatically created by Pothos</br>
├── prisma/  </br>
│ ├── migrations/ // Stores database migration history for version control</br>
│ └── schema.prisma // Defines the Prisma schema for database models and relations</br>
├── public/ // Public assets like images, icons, and static files</br>
├── src/</br>
│ ├──app/ // Main application source code (App Router structure in Next.js)</br>
│ │ ├── api/ // API routes for handling requests in Next.js (server-side logic)</br>
│ │ │ ├── auth/ // Root folder for authentication APIs</br>
│ │ │ └── graphql/ // Contains the server-side API endpoint(s) to handle GraphQL requests</br>
│ │ └── page.tsx // Main page component for rendering UI in Next.js</br>
│ ├── components/ // React components used across the application</br> 
│ └── pothos/</br>
│&nbsp;&nbsp;&nbsp;&nbsp;├── builder.ts // Creates the Pothos schema builder</br>
│&nbsp;&nbsp;&nbsp;&nbsp;└── schema.ts  // Adds object types and fields to the builder</br>
├── .gitignore  </br>
├── eslint.config.mjs // ESLint configuration for maintaining code quality</br>
├── next.config.ts // Next.js configuration file for customizing settings</br>
├── next-env.d.ts // TypeScript environment definitions for Next.js</br>
├── package.json // Defines project dependencies and scripts for Node.js</br>
├── package-lock.json // Locks dependency versions to ensure consistency across environments</br>
├── postcss.config.mjs // PostCSS configuration for processing CSS styles</br>
├── README.md  </br>
└── tsconfig.json // TypeScript configuration file specifying compiler options</br>
