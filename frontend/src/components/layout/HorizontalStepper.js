import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useTranslation } from "react-i18next";

export default function HorizontalStepper(props) {
  const { t } = useTranslation();
  const steps = [
    t("TakePicture"),
    t("SelectPaintingStepper"),
    t("ViewResultStepper"),
  ];
  const mobileSteps = [
    t("TakePictureMobile"),
    t("SelectPaintingStepperMobile"),
    t("ViewResultStepperMobile"),
  ];
  const [width, setWidth] = React.useState(window.innerWidth);

  const breakpoint = 620;

  React.useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  }, []);

  const renderSteps = () => {
    if (width < breakpoint) {
      return mobileSteps.map((label, index) => {
        const labelProps = {};

        return (
          <Step key={label}>
            <StepLabel {...labelProps}>
              <Typography variant={"caption"}>{label}</Typography>
            </StepLabel>
          </Step>
        );
      });
    }
    return steps.map((label, index) => {
      const labelProps = {};

      return (
        <Step key={label}>
          <StepLabel {...labelProps}>
            <Typography variant={"overline"}>{label}</Typography>
          </StepLabel>
        </Step>
      );
    });
  };
  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: "16px",
        px: 2,
        py: 1,
        mb: 2,
      }}
      style={{ backgroundColor: "white" }}
    >
      <Stepper activeStep={props.activeStep}>{renderSteps()}</Stepper>
    </Box>
  );
}
