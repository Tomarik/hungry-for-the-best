import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import LoginForm from "../islands/LoginForm.tsx";

export default define.page(function Login() {
  return (
    <div data-theme="bumblebee">
      <Head>
        <title>Hungry for the Best | Login</title>
      </Head>
      <LoginForm />
    </div>
  );
});