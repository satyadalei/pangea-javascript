import { FC } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import keyBy from "lodash/keyBy";
import { Stack, Typography } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import StringField from "@src/components/fields/StringField";
import Button from "@src/components/core/Button";
import { ErrorMessage } from "../../components";
import { checkForHtml } from "../../utils";

const autoCompleteMap: { [key: string]: string } = {
  first_name: "given-name",
  last_name: "family-name",
};

const ProfileView: FC<AuthFlowComponentProps> = (props) => {
  const { options, data, error, loading, update, reset } = props;

  // FIXME: generate initial values and validation from profile data
  const validators: { [key: string]: any } = {};
  const defaultValues: { [key: string]: string } = {};

  data.profile?.fields.forEach((f: AuthFlow.ProfileField) => {
    if (f.show_on_signup && f.required) {
      if (f.type === "string") {
        validators[f.id] = yup
          .string()
          .required("Required")
          .test("no-html-tags", "HTML tags are not allowed", (value) => {
            return checkForHtml(value || "");
          });
      } else if (f.type === "integer") {
        validators[f.id] = yup.number().required("Required");
      }

      defaultValues[f.id] = "";
    }
  });

  const validationSchema = yup.object(validators);

  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const payload: AuthFlow.ProfileParams = {
        profile: {
          ...values,
        },
      };
      update(AuthFlow.Choice.PROFILE, payload);
    },
  });

  return (
    <Stack gap={2}>
      {/* FIXME: Need Profile Heading branding option */}
      <Typography variant="h6">Profile info</Typography>
      <Typography variant="body2" mb={1} sx={{ wordBreak: "break-word" }}>
        {data.email}
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Stack gap={1}>
          {data?.profile?.fields.map((field: AuthFlow.ProfileField) => {
            if (field.show_on_signup) {
              if (field.type === "boolean") {
                // FIXME: support for checkbox
              } else if (field.type === "date") {
                // FIXME: support for date selector
              } else if (field.type === "integer") {
                return (
                  <StringField
                    type="number"
                    name={field.id}
                    label={field.label}
                    formik={formik}
                  />
                );
              } else {
                const autoComplete =
                  field.id in autoCompleteMap ? autoCompleteMap[field.id] : "";
                return (
                  <StringField
                    name={field.id}
                    label={field.label}
                    formik={formik}
                    autoComplete={autoComplete}
                  />
                );
              }
            }
          })}
          {error && <ErrorMessage response={error} />}
          <Button
            color="primary"
            type="submit"
            fullWidth={true}
            disabled={loading}
          >
            {options.submitLabel}
          </Button>
        </Stack>
      </form>

      <Stack direction="row" justifyContent="center" gap={1}>
        <Button variant="text" onClick={reset}>
          {options.cancelLabel}
        </Button>
      </Stack>
    </Stack>
  );
};

export default ProfileView;
