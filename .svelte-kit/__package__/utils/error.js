export function handleError(err, defaultMessage) {
    const message = err instanceof Error ? err.message : defaultMessage;
    console.error(defaultMessage, err);
    return message;
}
