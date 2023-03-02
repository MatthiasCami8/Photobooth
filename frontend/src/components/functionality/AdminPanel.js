import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";

export default function AdminPanel(props) {
  const [webcamRotation, setWebcamRotation] = React.useState(
    localStorage.getItem("camera_rotation")
      ? localStorage.getItem("camera_rotation")
      : 0
  );

  return (
    <React.Fragment>
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        fullWidth
        maxWidth="xl"
      >
        <DialogTitle>Admin Panel</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Webcam rotation</InputLabel>
            <Select
              value={webcamRotation}
              label="Webcam rotation"
              onChange={(event) => {
                localStorage.setItem("camera_rotation", event.target.value);
                setWebcamRotation(event.target.value);
              }}
            >
              <MenuItem value={0}>0°</MenuItem>
              <MenuItem value={90}>90°</MenuItem>
              <MenuItem value={180}>180°</MenuItem>
              <MenuItem value={270}>270°</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
