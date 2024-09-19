<div align="center">

# VWH Upload

Simple serverless website built with Cloudflare services to explore their ecosystem—using R2 for storage, D1 for the database, Pages for static hosting, and Workers for serverless functions.

</div>

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/vwh/vwh-upload
cd vwh-upload
```

### 2. Install Dependencies

#### Server

```bash
bun install
```

#### Client

```bash
cd client
bun install
```

### 3. Set Up the Database

1. Create the database:

   ```bash
   db:create
   ```

2. Update the **Database ID** in `wrangler.toml`.
3. Migrate the database:

   ```bash
   db:migrate
   ```

   (Run migration twice to ensure updates are applied.)

### 4. Set Up the R2 Bucket

```bash
bun run bucket:create
```

### 5. Build and Deploy the Static Page

1. Create the page:

   ```bash
   bun run page:create
   ```

2. Build the client code:

   ```bash
   cd client
   bun run build
   ```

3. Deploy the page:

   ```bash
   bun run page:deploy
   ```

### 6. Deploy the Worker

```bash
bun run deploy
```
