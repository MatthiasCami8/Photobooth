import { Box, Typography } from "@mui/material";
import QRCode from "qrcode.react";
import { useTranslation } from "react-i18next";

const PrivacyPolicy = (props) => {
  const policyPage = `https://www.ml6.eu/privacy-notice-photobooth`;
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 60,
        left: 10,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignContent: "center",
          flexDirection: "column",
          width: 150,
          mr: 2,
        }}
      >
        <Typography variant="subtitle2">{t("PrivacyPolicy")}</Typography>
        <Typography variant="caption">
          {t("PrivacyPolicyDescription")}
        </Typography>
      </Box>

      <QRCode
        renderAs="svg"
        size={75}
        value={policyPage}
        includeMargin
      // imageSettings={{
      //   src: "https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco,dpr_1/tpxodgwzh1sg5eisv0wu",
      //   height: 20,
      //   width: 20,
      // }}
      />
    </Box>
  );
};

export default PrivacyPolicy;
