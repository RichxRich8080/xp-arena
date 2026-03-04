# API Contract: Validation & Error Schema

## Standard Error Response
All validation and route errors in auth, user, shop, guild, tournament, and feature routes follow:

```json
{
  "success": false,
  "code": "STRING_CODE",
  "message": "Human readable message",
  "details": [
    { "field": "fieldName", "issue": "required|invalid|...", "value": "optional" }
  ]
}
```

- `details` is optional and primarily returned by request validation failures.
- Validation failures use `code: "VALIDATION_ERROR"`.

## Centralized Validation
`routes/validators/index.js` provides shared request validation middleware:
- `validateRequest(checks)`
- `isStringMin(min)`
- `isEmail(value)`
- `isPositiveIntLike(value)`

## Route Coverage
The following route modules now use shared validation/error patterns:
- `routes/authRoutes.js`
- `routes/userRoutes.js`
- `routes/shopRoutes.js`
- `routes/featureRoutes.js`
- `routes/guildRoutes.js`
- `routes/tournamentRoutes.js`

## Frontend Integration Notes
- Frontend clients should treat `success === false` as failure source of truth.
- Use `code` for programmatic handling.
- Show `message` for user-friendly feedback.
- For forms, map `details[].field` to input-level errors when present.
