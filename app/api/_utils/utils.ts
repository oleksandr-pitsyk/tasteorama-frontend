export function logErrorResponse(payload: unknown): void {
  if (process.env.NODE_ENV !== 'production') {
    console.error('API route error:', payload);
  }
}
