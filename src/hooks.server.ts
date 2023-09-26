import type { HandleServerError } from '@sveltejs/kit';

export const handleError: HandleServerError = async ({ error }) => {
    const message = (error as Error).message ?? 'Unknown error';
    return {
        message: message
    };
};
