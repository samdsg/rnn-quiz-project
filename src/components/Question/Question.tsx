import React, { Fragment, useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import theme, { Box, Text } from "../theme";
import QuestionContainer from "./QuestionContainer";
import Animated, {
  multiply,
  SpringUtils,
  Value,
} from "react-native-reanimated";
import {
  useScrollHandler,
  useValue,
  withSpringTransition,
} from "react-native-redash";

const { View, ScrollView } = Animated;
const { height, width } = Dimensions.get("window");

import QuestionSlide from "./QuestionSlide";
import { question } from "./data";
import Answers from "./Answers";
import { Button } from "../../Utils";

/* Last Component */
import FinishedAlert from "./FinishedAlert";
import {
  grabQuizQuestions,
  QuestionsDifficulty,
  QuizPropsState,
  _,
} from "../Helper";
import { CompositeNavigationProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppStackRoutes } from "../../../App";
import { OnBoardingRoutes } from "../Navigation";

export type currAnswerObjectProps = {
  question: string;
  answer: string;
  answerIsCorrect: boolean;
  correctAnswer: string;
};

interface WelcomeProps {
  navigation: CompositeNavigationProp<
    StackNavigationProp<OnBoardingRoutes, "Welcome">,
    StackNavigationProp<AppStackRoutes, "Question">
  >;
}

const Question = ({ navigation }: WelcomeProps) => {
  const { x, scrollHandler } = useScrollHandler();
  const scroll = useRef<Animated.ScrollView>(null);

  /* Main Quiz Props */
  const [qLoading, setqLoading] = useState<boolean>(false);
  const [allQuestions, setAllQuestions] = useState<QuizPropsState[]>([]);
  const [userSelectedAnswers, setUserSelectedAnswers] = useState<
    currAnswerObjectProps[]
  >([]);
  const [score, setScore] = useState<number>(0);
  const [curNum, setCurNum] = useState<number>(0);
  const [TOTAL_QUESTIONS] = useState<number>(10);
  const [quizOver, setQuizOver] = useState<boolean>(false);
  const [scrolling, setScrolling] = useState<boolean>(false);

  const shuffledDifficulty = _([
    QuestionsDifficulty.EASY,
    QuestionsDifficulty.MEDIUM,
    QuestionsDifficulty.HARD,
  ]);

  const startJob = async () => {
    setqLoading(true);
    setQuizOver(false);
    const newQuestions = await grabQuizQuestions(
      TOTAL_QUESTIONS,
      shuffledDifficulty[0]
    );
    setAllQuestions(newQuestions);
    setScore(0);
    setUserSelectedAnswers([]);
    setqLoading(false);
  };

  const answerSelected = (answer: string, answerIndex: number) => {
    if (!quizOver) {
      // Check if the selected answer is the correct answer
      const answerIsCorrect = allQuestions[curNum].correct_answer === answer;

      // Increment score if answer is correct
      if (answerIsCorrect) setScore((curScore: number) => curScore + 1);

      // Save current answer to UserSelected answers
      const currAnswerObject = {
        question: allQuestions[curNum].question,
        answer,
        answerIsCorrect,
        correctAnswer: allQuestions[curNum].correct_answer,
      };

      setUserSelectedAnswers((prev) => [...prev, currAnswerObject]);
    }
  };

  const nextQuestion = () => {
    // Move on to the next question if not the last question
    if (!quizOver && curNum < allQuestions.length - 1) {
      setCurNum((number) => number + 1);
    } else {
      setQuizOver(true);
    }
  };

  useEffect(() => {
    if (!quizOver) {
      if (scroll.current) {
        scroll.current.getNode().scrollTo({
          x: width * curNum,
          animated: true,
        });
      }
    }
  }, [curNum]);

  useEffect(() => {
    startJob();
  }, []);

  useEffect(() => {
    if (userSelectedAnswers.length > 0) {
      nextQuestion();
    }
  }, [userSelectedAnswers]);

  //* Monitor scroll events *//
  const onMomentumScrollBegin = () => {
    setScrolling(true);
  };

  const onMomentumScrollEnd = () => {
    setScrolling(false);
  };

  //* Finshed animation *//
  const fnAnimaValue = useValue<number>(0);

  useEffect(() => {
    if (quizOver) {
      fnAnimaValue.setValue(1);
    }
  }, [quizOver]);

  const finished = withSpringTransition(fnAnimaValue, {
    ...SpringUtils.makeDefaultConfig(),
    overshootClamping: true,
    damping: new Value(20),
  });

  return (
    <>
      {qLoading ? (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.colors["primary"],
          }}
        >
          <Text color="white" variant="body">
            Quiz Loading...
          </Text>
        </View>
      ) : (
        <QuestionContainer>
          <Box flex={1}>
            <Box justifyContent="flex-end" flex={1} flexDirection="column">
              <Box height={height * 0.3} backgroundColor="primary">
                <ScrollView
                  ref={scroll}
                  horizontal
                  snapToInterval={width}
                  decelerationRate="fast"
                  showsHorizontalScrollIndicator={false}
                  bounces={false}
                  {...scrollHandler}
                  {...{ onMomentumScrollEnd, onMomentumScrollBegin }}
                  pointerEvents="none"
                >
                  {allQuestions.map(({ question }, index) => (
                    <Fragment key={index}>
                      <QuestionSlide
                        {...{ question, index }}
                        questionNr={curNum + 1}
                      />
                    </Fragment>
                  ))}
                </ScrollView>
              </Box>

              <Box flex={1} height={height * 0.4} paddingTop="m">
                <View
                  style={{
                    backgroundColor: theme.colors["white"],
                    transform: [{ translateX: multiply(x, -1) }],
                    flexDirection: "row",
                    width: width * allQuestions.length,
                    flex: 1,
                  }}
                >
                  {allQuestions.map(({ answers }, index) => (
                    <Fragment key={index}>
                      <Answers {...{ answerSelected, answers }} />
                    </Fragment>
                  ))}
                </View>
              </Box>
              <View
                style={{
                  width: width * allQuestions.length,
                  backgroundColor: "white",
                  flexDirection: "row",
                  transform: [{ translateX: multiply(x, -1) }],
                }}
              >
                {allQuestions.map((_, index) => {
                  const last = index === allQuestions.length - 1;

                  return (
                    <View
                      style={{
                        flex: 1,
                        width,
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 20,
                      }}
                      key={index}
                    >
                      <Button
                        variant="primary"
                        label={last ? "Submit" : "Next"}
                        textTransform="uppercase"
                        onPress={() => nextQuestion()}
                      />
                    </View>
                  );
                })}
              </View>
            </Box>
            <FinishedAlert
              {...{ finished }}
              userAnswers={userSelectedAnswers}
              onRestart={() => {
                fnAnimaValue.setValue(0);
                startJob();
                navigation.navigate("Welcome");
              }}
            />
            {scrolling ? (
              <View
                style={{
                  ...StyleSheet.absoluteFillObject,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#00000090",
                }}
              >
                <Text color="white" variant="body">
                  ...
                </Text>
              </View>
            ) : null}
          </Box>
        </QuestionContainer>
      )}
    </>
  );
};

export default Question;
