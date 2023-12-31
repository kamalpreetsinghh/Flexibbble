"use client";

import FormField from "@/components/FormField";
import FormAndImage from "@/components/FormAndImage";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignUp } from "@/common.types";
import { errors, regex } from "@/constants";
import { capitalizeWords } from "@/lib/common";
import { createUserWithCredentials, getUser } from "@/lib/actions";
import Button from "@/components/Button";

const SignUpPage = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleNameChange = (updatedName: string) => {
    setName(updatedName);
    setNameError("");
  };

  const handleEmailChange = (updatedEmail: string) => {
    setEmail(updatedEmail);
    setEmailError("");
  };

  const handlePasswordChange = (updatedPassword: string) => {
    setPassword(updatedPassword);
    setPasswordError("");
    setConfirmPassword("");
  };

  const handleConfirmPasswordChange = (updatedConfirmPassword: string) => {
    setConfirmPassword(updatedConfirmPassword);
    setConfirmPasswordError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      const user: SignUp = { name: capitalizeWords(name), email, password };
      try {
        const data: any = await getUser(email);
        if (!data.user) {
          await createUserWithCredentials(
            capitalizeWords(name),
            email,
            password
          );

          setName("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");

          router.push("signin?registered=true");
        } else {
          setEmailError(errors.emailAlreadyExisis);
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const validateForm = (): boolean => {
    let isValidForm = true;

    if (!regex.name.test(name)) {
      setNameError(errors.name);
      isValidForm = false;
    }

    if (!regex.email.test(email)) {
      setEmailError(errors.email);
      isValidForm = false;
    }

    if (!regex.password.test(password)) {
      setPasswordError(errors.password);
      isValidForm = false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError(errors.confirmPassword);
      isValidForm = false;
    }

    return isValidForm;
  };

  return (
    <FormAndImage image="/assets/images/signup.png" imageDesc="Sign Up Image">
      <div className="w-full max-w-lg mx-auto flex flex-col items-center">
        <h1 className="head_text purple_gradient mt-8 mb-2">Hi there!</h1>
        <p className="desc max-w-md mb-6">Welcome to Prompt Wizard</p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-full gap-7 glassmorphism"
        >
          <FormField
            title="First and Last Name"
            state={name}
            placeholder="Bruce Wayne"
            setState={handleNameChange}
            errorMessage={nameError}
            isRequired
            autocapitalize="words"
          />

          <FormField
            title="Email"
            state={email}
            placeholder="explore@mountains.com"
            setState={handleEmailChange}
            errorMessage={emailError}
            isRequired
          />

          <FormField
            title="Password"
            state={password}
            placeholder="no0neCanGuessIt"
            setState={handlePasswordChange}
            errorMessage={passwordError}
            isRequired
            type="password"
          />

          <FormField
            title="Confirm Password"
            state={confirmPassword}
            placeholder="no0neCanGuessIt"
            setState={handleConfirmPasswordChange}
            errorMessage={confirmPasswordError}
            isRequired
            type="password"
          />

          <Button
            type="submit"
            title="Create Account"
            isSubmitting={isLoading}
            className="mt-2 mb-4"
          />
        </form>
        <p className="flex justify-center">
          Already have an account?&nbsp;
          <Link className="text-blue-600 font-bold" href="/signin">
            Sign in
          </Link>
        </p>
      </div>
    </FormAndImage>
  );
};

export default SignUpPage;
