export function handleError(err: unknown, defaultMessage: string): string {
    const message = err instanceof Error ? err.message : defaultMessage;
    console.error(defaultMessage, err);
    return message;
  }