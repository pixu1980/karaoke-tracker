## Storage service — reference

Detailed guidance for interacting with the `storage` IndexedDB wrapper used in the app.

### Common operations

- `await storage.getAllSingers()`
- `await storage.getQueuedSongs()`
- `await storage.addSinger({ name })`
- `await storage.addPerformance({ songId, singerId, rating })`
- `await storage.getLeaderboard()`

### Best practices

- Wrap storage calls with `try/catch` and `console.error` for graceful degradation.
- Normalize and compute presentation fields in the component (e.g., `singerNames`), do not render raw DB records.
- Avoid tight coupling to the DB shape; rely on storage API methods.

### Example

```javascript
try {
  this._singers = await storage.getAllSingers();
} catch (err) {
  console.error('Failed to load singers', err);
}
```
