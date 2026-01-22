# zodsql

Generate SQL table schemas from Zod schemas. Converts Zod object definitions into `CREATE TABLE` statements with proper type mappings and nullability constraints.

## Install

```bash
npm install zodsql
```

## Usage

```typescript
import { z } from 'zod'
import { convert } from 'zodsql'

const userSchema = z.object({
  name: z.string(),
  email: z.string(),
  age: z.number().optional(),
  verified: z.boolean().nullable(),
})

const sql = convert(userSchema, 'users')
// CREATE TABLE users (name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, age INT, verified BOOLEAN);
```

## Development

```bash
# Install deps
npm install

# Build
npm run build

# Watch mode
npm run dev

# Test
npm test
```
