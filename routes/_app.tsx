import { define } from "../utils.ts";
import Navbar from "../components/navbar.tsx";

export default define.page(function App({ Component }) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Hungry for the Best</title>
      </head>
      <body>
        <Navbar />
        <Component />
      </body>
    </html>
  );
});