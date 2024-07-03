import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import SelectDifficulty from "./SelectDifficulty";
import ScoreDisplay from "./ScoreDisplay";
import RoundDisplay from "./RoundDisplay";
import Rating from "./GameRating";
import GameRating from "./GameRating";
import LoadingBar from "./LoadingBar";

export default function TriviaGame({ title }) {
  const [triviaQuestion, setTriviaQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [allAnswers, setAllAnswers] = useState([]); //an array of incorrect answers, use spread operator...
  const [questionNumber, setQuestionNumber] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isGameStart, setIsGameStart] = useState(false);
  const [answerButtonActive, setAnswerButtonActive] = useState(true);
  const [loadBar, setLoadBar] = useState(false);

  const [difficulty, setDifficulty] = useState("medium");
  useEffect(() => {
    if (questionNumber == 11) {
      setIsGameStart(false)
      setTriviaQuestion("")
      setQuestionNumber(0)
      setScore(0)
    }
  }, [questionNumber]);
  function fetchTrivia(difficulty) {
    const myHeaders = new Headers();
    myHeaders.append("Cookie", "PHPSESSID=05e6b8ebadbe85215b6b2287f8ec1148");
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://opentdb.com/api.php?amount=1&category=9&difficulty=${difficulty}&type=multiple`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log("Question: ", result.results[0].question);
        setTriviaQuestion(result.results[0].question);

        console.log("This may be it : ", result.results[0].correct_answer);
        setCorrectAnswer(result.results[0].correct_answer);

        // console.log("Incorrect: ", result.results[0].incorrect_answers);
        // setIncorrectAnswers(result.results[0].incorrect_answers); ////use spread operator to update state
        // console.log("this is all opt" + options)
        // setAllAnswers([result.results[0].correct_answer,
        //   ...result.results[0].incorrect_answers])
        let answers = [
          result.results[0].correct_answer,
          ...result.results[0].incorrect_answers,
        ];

        setAllAnswers(answers.sort(() => Math.random() - 0.5));

        console.log("This is all options: ", [
          result.results[0].correct_answer,
          ...result.results[0].incorrect_answers,
        ]);
        setQuestionNumber(questionNumber + 1);
      })
      .catch((error) => console.error(error));
  }

  function handleAnswerClick(answer) {
    if (!answerButtonActive) {
      return;
    } 
    setAnswerButtonActive(false);
    if (answer === correctAnswer) {
      setScore(score + 1);
      setFeedback("Correct!");
      console.log("THAT WAS RIGHT");
    } else {
      setFeedback("That's not right...");
      console.log("WOMP WOMP");
    }
    setTimeout(() => {
      setFeedback(""); // Clear feedback
      fetchTrivia(difficulty);
      setAnswerButtonActive(true);
    }, 6000);
  }

  return (
    <Grid item xs={12} md={4}>
      {isGameStart ? (
        <RoundDisplay currentRound={questionNumber}></RoundDisplay>
      ) : (
        ""
      )}
      <SelectDifficulty
        currentDifficulty={difficulty}
        setDifficulty={setDifficulty}
      ></SelectDifficulty>
      <Card>
        <CardHeader
          title={triviaQuestion}
          titleTypographyProps={{ align: "center" }}
          sx={{ mt: 1 }}
        >{triviaQuestion}</CardHeader>

        <CardContent sx={{ pt: 0 }}>
          <Typography variant="h6" align="center">
            {feedback} {/* Display feedback */}
          </Typography>
          {answerButtonActive ? "" : <LoadingBar></LoadingBar>}
          
        </CardContent>
        <CardActions>
          {isGameStart ? (
            <Stack>
              {allAnswers.map((oneOption) => (
                <Button
                  sx={{ px: 6, mx: "auto" }}
                  onClick={() => {
                    console.log("I WAS CLICKED");
                    handleAnswerClick(oneOption);
                  }}
                >
                  {oneOption}
                </Button>
              ))}
            </Stack>
          ) : (
            <Button
              variant="contained"
              sx={{ px: 6, mx: "auto"}}
              className="characterButton"
              onClick={() => {
                fetchTrivia(difficulty);
                setIsGameStart(true);
              }}
            >
              Start
            </Button>
          )}
        </CardActions>
      </Card>
      <ScoreDisplay currentScore={score}></ScoreDisplay>
      <Typography>
          How are you enjoying the game?
        </Typography>
      <GameRating></GameRating>
    </Grid>
  );
}
