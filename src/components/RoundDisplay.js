import * as React from "react";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

export default function RoundDisplay({currentRound}) {
  return (
    <Box sx={{my : 2}}>
    <Typography py="4" variant="h6" align="center">
      Round: {currentRound} {/* Display current round */}
    </Typography>
    </Box>
  );
}
