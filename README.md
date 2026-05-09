# ticketer-ts

TypeScript port of ticketer

Create a ticket

```bash
create (title) (subject)
```

List

```bash
list
```

Get a ticket

```bash
get (id)
```

Edit a ticket

```bash
edit (id)
```

Exit the app


```bash
exit
```

# Build instruction

You will need the rust toolchain for this. Download [here](https://rustup.rs/)

Before any builds, run tests:

```bash
npm run test
```

Build the project

```bash
npm run build
```

The build result is in `/dist`. Use the binary like this:

```bash
node ./dist/main.js [command] [flag]
```