// src/lib/utils/auth.ts
export const redirectIfError = (error: unknown) => {
    // Implement your redirect logic here
};

export const validateSession = (session: Session | null) => {
    return !!session?.user;
};