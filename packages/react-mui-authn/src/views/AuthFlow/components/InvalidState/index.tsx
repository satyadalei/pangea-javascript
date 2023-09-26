import { FC } from "react";
import { Stack, Typography } from "@mui/material";

import Button from "@src/components/core/Button";
import { ViewComponentProps } from "@src/views/AuthFlow/types";

const InvalidState: FC<ViewComponentProps> = ({ options, error, reset }) => {
  return (
    <Stack gap={2}>
      <Typography variant="h6">Invalid State</Typography>
      <Stack direction="row" justifyContent="center" gap={2}>
        <Typography variant="body2" textAlign="center" color="error">
          {error.summary}
        </Typography>
      </Stack>
      <Stack direction="row" justifyContent="center" gap={2}>
        <Button variant="text" onClick={reset}>
          {options.cancelLabel}
        </Button>
      </Stack>
    </Stack>
  );
};

export default InvalidState;
