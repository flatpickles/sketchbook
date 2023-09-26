import type { HandleClientError } from '@sveltejs/kit';

export const handleError: HandleClientError = async ({ error }) => {
    const message = (error as Error).message ?? 'Unknown error';
    return {
        message: message
    };
};
