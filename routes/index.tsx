import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import LoginForm from "../islands/LoginForm.tsx";

export default define.page(function Home() {
  return (
    <div data-theme="dracula" className="min-h-screen">
      <Head>
        <title>Hungry for the Best | Login</title>
      </Head>
      <LoginForm />
    </div>
  );
});