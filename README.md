<p align="center">
  <br/>
  <a href="https://authjs.dev" target="_blank">
    <img height="64px" src="https://authjs.dev/img/logo-sm.png" />
  </a>
  <a href="https://mongoosejs.com/" target="_blank">
    <img height="64px" src="https://raw.githubusercontent.com/Automattic/mongoose/master/docs/images/mongoose.svg"/>
  </a>
  <h3 align="center"><b>Mongoose Adapter</b> - NextAuth.js / Auth.js</a></h3>
  <p align="center">
    <a href="https://npm.im/@brendon1555/authjs-mongoose-adapter" target="_blank">
      <img src="https://img.shields.io/badge/TypeScript-blue?style=flat-square" alt="TypeScript" />
    </a>
    <a href="https://npm.im/@brendon1555/authjs-mongoose-adapter" target="_blank">
      <img alt="npm" src="https://img.shields.io/npm/v/@brendon1555/authjs-mongoose-adapter?color=green&label=@brendon1555/authjs-mongoose-adapter&style=flat-square">
    </a>
    <a href="https://www.npmtrends.com/@brendon1555/authjs-mongoose-adapter" target="_blank">
      <img src="https://img.shields.io/npm/dm/@brendon1555/authjs-mongoose-adapter?label=%20downloads&style=flat-square" alt="Downloads" />
    </a>
    <a href="https://github.com/brendon1555/authjs-mongoose-adapter/stargazers" target="_blank">
      <img src="https://img.shields.io/github/stars/brendon1555/authjs-mongoose-adapter?style=flat-square" alt="GitHub Stars" />
    </a>
  </p>
</p>

---

> [!WARNING]
>
> This adapter cannot support Next.js with `next-auth` until Mongoose supports the Next.js Edge Runtime. Or, Next.js adds Node.js support to middlewares. 
> See: [Mongoose docs](https://mongoosejs.com/docs/nextjs.html#:~:text=Mongoose%20does%20not%20currently%20support%20Next.js%20Edge%20Runtime.)


## Getting Started

1. Install Auth.js (`@auth/express`, `@auth/sveltekit`, etc.), `mongoose` and `@brendon1555/authjs-mongoose-adapter`:

```bash
npm install @brendon1555/authjs-mongoose-adapter mongoose @auth/express
```

2. Add a MongoDB connection string to your environment variables:

```env
MONGODB_URI=mongodb://localhost:27017/my-database
```

3. Add this adapter to your auth config:

   1. Express

   ```js
   import { ExpressAuth } from "@auth/express";
   import { MongooseAdapter } from "@brendon1555/authjs-mongoose-adapter";

   const app = express();

   app.use(
     "/auth/*",
     ExpressAuth({
       adapter: MongooseAdapter(process.env.MONGODB_URI),
       ...
     })
   );
   ```

   2. SvelteKit

   ```js
   import { SvelteKitAuth } from "@auth/sveltekit";
   import { MongooseAdapter } from "@brendon1555/authjs-mongoose-adapter"

   export const { handle, signIn, signOut } = SvelteKitAuth({
     adapter: MongoDBAdapter(process.env.MONGODB_URI),
     ...
   });
   ```

   3. ~~Next.js~~ (Not officially supported. If you get it working, please let me know!)

   ```js
    import NextAuth from "next-auth"
    import { MongooseAdapter } from "@brendon1555/authjs-mongoose-adapter"

    export default NextAuth({
      adapter: MongooseAdapter(process.env.MONGODB_URI),
      ...
    })
   ```

## License

ISC
