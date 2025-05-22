# Rock Paper Scissors Game Application

## Overview

This application is a web-based Rock Paper Scissors game implementation using a modern React frontend with a Node.js Express backend. The application follows a client-server architecture where game logic is distributed between the client and server sides.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with a client-server architecture:

1. **Frontend**: React-based SPA using modern React patterns including hooks and functional components
2. **Backend**: Express.js server with RESTful API endpoints
3. **Database**: PostgreSQL database accessed through Drizzle ORM
4. **UI Framework**: Tailwind CSS with shadcn/ui components
5. **State Management**: React Query for server state management
6. **Routing**: Wouter for lightweight client-side routing

The application is structured in a way that separates concerns between the client and server, with shared schema definitions to ensure type safety across the codebase.

## Key Components

### Client Side

1. **Pages**: 
   - `GamePage`: Main game interface
   - `NotFound`: 404 page

2. **Components**:
   - `PlayerRegistration`: Handles player name inputs
   - `GamePlay`: Main game mechanics
   - `PlayerChoice`: Individual player choice UI
   - `GameResult`: Displays game results
   - `ScoreBoard`: Shows current score
   - `GameInstructions`: Explains game rules
   - UI components from shadcn/ui library (buttons, cards, toasts, etc.)

3. **Hooks**:
   - `useGame`: Custom hook for game state management
   - `useToast`: Toast notification management
   - `useMobile`: Responsive design detection

### Server Side

1. **API Routes**:
   - Game creation
   - Game state retrieval
   - Player moves submission

2. **Storage Layer**:
   - Database abstraction through Drizzle ORM
   - In-memory storage for development/testing

### Shared Code

1. **Schema Definitions**:
   - Database schema using Drizzle ORM
   - Zod validation schemas for type safety

## Data Flow

1. **Game Creation**:
   - Client collects player names via `PlayerRegistration`
   - Names are sent to server via POST `/api/games`
   - Server creates game record in database
   - Game state is returned to client

2. **Game Play**:
   - Players take turns making choices (rock, paper, scissors)
   - Choices are submitted to server
   - Server determines winner and updates scores
   - Updated game state is returned to client
   - Results are displayed

3. **Game Progression**:
   - Players can play multiple rounds
   - Score is tracked across rounds
   - Players can start a new game

## External Dependencies

### Frontend

1. **UI Framework**:
   - Tailwind CSS for styling
   - shadcn/ui for component library (based on Radix UI)
   - clsx/class-variance-authority for class composition

2. **State Management**:
   - React Query for server state and caching
   - React's built-in useState/useEffect for local state

3. **Form Handling**:
   - React Hook Form with Zod validation

### Backend

1. **Server Framework**:
   - Express.js for API routing and middleware

2. **Database**:
   - Drizzle ORM for database access
   - PostgreSQL as the database
   - Neon Serverless Postgres support

3. **Utilities**:
   - Zod for validation

## Deployment Strategy

The application uses a unified build and deployment process:

1. **Development Mode**:
   - `npm run dev` starts both client and server in development mode
   - Vite handles hot module replacement for frontend
   - Server auto-reloads using tsx

2. **Production Build**:
   - `npm run build` creates optimized production build
   - Frontend assets are bundled with Vite
   - Server code is bundled with esbuild

3. **Production Start**:
   - `npm run start` runs the production build
   - Node.js serves the bundled application

4. **Database Schema Management**:
   - `npm run db:push` updates database schema

The application is configured for deployment on Replit with appropriate port forwarding (5000).

## Database Schema

The database schema includes:

1. **Users Table**:
   - ID, username, password fields
   - Authentication/player identification

2. **Games Table**:
   - Game metadata (player IDs, scores, current round)
   - Tracks active status of games

3. **Game Rounds Table**:
   - Each round's choices and results
   - Relationships to parent game

The schema is defined using Drizzle ORM with corresponding Zod validation schemas for API requests.