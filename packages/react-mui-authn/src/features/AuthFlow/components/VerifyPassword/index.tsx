import { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Stack, Typography } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import ErrorMessage from "../ErrorMessage";
import Button from "@src/components/core/Button";
import PasswordField from "@src/components/fields/PasswordField";

const VerifyPasswordView: FC<AuthFlowComponentProps> = ({
  options,
  data,
  loading,
  error,
  update,
  reset,
}) => {
  const [status, setStatus] = useState<any>();
  const validationSchema = yup.object({
    password: yup.string().required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const payload = {
        ...values,
      };
      update(AuthFlow.Choice.PASSWORD, payload);
    },
  });

  const resetPassword = () => {
    update(AuthFlow.Choice.RESET_PASSWORD, {});
  };

  useEffect(() => {
    setStatus(error);
  }, [error]);

  return (
    <Stack gap={2}>
      <Typography variant="h6">{options.passwordHeading}</Typography>
      <Stack gap={1}>
        <Typography variant="body2" mb={1} sx={{ wordBreak: "break-word" }}>
          Enter password for {data.email}
        </Typography>
        <form
          onSubmit={formik.handleSubmit}
          onFocus={() => {
            setStatus(undefined);
          }}
        >
          <Stack gap={1}>
            <PasswordField name="password" label="Password" formik={formik} />
            {status && <ErrorMessage response={status} />}
            <Button
              color="primary"
              type="submit"
              disabled={loading}
              fullWidth={true}
            >
              {options.passwordButtonLabel}
            </Button>
          </Stack>
        </form>
      </Stack>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="center"
        gap={{ xs: 0, sm: 1 }}
      >
        <Button variant="text" onClick={resetPassword}>
          Forgot your password?
        </Button>
        <Button variant="text" onClick={reset}>
          {options.cancelLabel}
        </Button>
      </Stack>
    </Stack>
  );
};

export default VerifyPasswordView;
