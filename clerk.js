import { Clerk } from '@clerk/clerk-sdk-node';

const clerkClient = new Clerk({
  apiKey: process.env.CLERK_API_KEY
});

// Ahora puedes usar 'clerk' para interactuar con los servicios de Clerk
