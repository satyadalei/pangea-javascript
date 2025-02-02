import { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Stack } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import ErrorMessage from "../ErrorMessage";
import Button from "@src/components/core/Button";
import PasswordField, {
  checkPassword,
} from "@src/components/fields/PasswordField";

const AuthPassword: FC<AuthFlowComponentProps> = ({
  options,
  data,
  loading,
  error,
  update,
  reset,
  restart,
}) => {
  const [status, setStatus] = useState<any>();
  const enrollment = !!data?.password?.enrollment || data?.setPassword;
  const passwordPolicy = enrollment
    ? { ...data?.password?.password_policy }
    : null;
  const validationSchema = yup.object({
    password: enrollment
      ? yup
          .string()
          .required("Required")
          .test(
            "password-requirements",
            "Password must meet requirements",
            (value) => {
              return checkPassword(value, passwordPolicy);
            }
          )
      : yup.string().required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: validationSchema,
    validateOnBlur: true,
    onSubmit: (values) => {
      const payload: AuthFlow.PasswordParams = {
        ...values,
      };

      if (data.setPassword) {
        update(AuthFlow.Choice.SET_PASSWORD, payload);
      } else {
        update(AuthFlow.Choice.PASSWORD, payload);
      }
    },
  });

  useEffect(() => {
    setStatus(error);
  }, [error]);

  const forgot = () => {
    restart(AuthFlow.Choice.RESET_PASSWORD);
  };

  const getSubmitLabel = (): string => {
    if (data.setPassword) {
      return "Reset";
    }

    if (data.password?.enrollment) {
      return options.signupButtonLabel || "Continue";
    }

    if (data.phase === "phase_one_time") {
      return "Continue";
    }

    return options.passwordButtonLabel || "Log in";
  };

  return (
    <Stack gap={2} width="100%">
      <form
        style={{ width: "100%" }}
        onSubmit={formik.handleSubmit}
        onFocus={() => {
          setStatus(undefined);
        }}
      >
        <Stack gap={1}>
          <PasswordField
            name="password"
            label="Password"
            formik={formik}
            policy={passwordPolicy}
          />
          {status && <ErrorMessage response={status} />}
          <Button
            color="primary"
            type="submit"
            disabled={loading}
            fullWidth={true}
          >
            {getSubmitLabel()}
          </Button>
        </Stack>
      </form>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="center"
        gap={{ xs: 0, sm: 1 }}
      >
        {!enrollment && data.phase !== "phase_one_time" && (
          <Button variant="text" onClick={forgot}>
            Forgot your password?
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

export default AuthPassword;
