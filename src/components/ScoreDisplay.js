import * as React from "react";
import Typography from "@mui/material/Typography";

export default function ScoreDisplay({currentScore}) {
  return (
    <Typography variant="h6" align="center">
      Score: {currentScore} {/* Display current score */}
    </Typography>
  );
}
