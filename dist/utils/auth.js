// src/lib/utils/auth.ts
export const redirectIfError = (error) => {
    // Implement your redirect logic here
};
export const validateSession = (session) => {
    return !!session?.user;
};
