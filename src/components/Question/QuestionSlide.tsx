import * as React from "react";
import { Dimensions } from "react-native";
import { unicodeToChar } from "../../Utils";
import { Box, Text } from "../theme";

const { width } = Dimensions.get("window");

interface QuestionSlideProps {
  index: number;
  question: string;
  questionNr: number;
}

const QuestionSlide = ({ question, index, questionNr }: QuestionSlideProps) => {
  return (
    <Box
      {...{ width, index }}
      alignItems="center"
      padding="m"
      justifyContent="center"
    >
      <Text variant="title" fontSize={18} textAlign="center" marginTop="s">
        Question Number {questionNr}
      </Text>

      <Text
        variant="body"
        color="white"
        marginTop="xl"
        textAlign="center"
        marginBottom="m"
      >
        {unicodeToChar(question)}
      </Text>
    </Box>
  );
};

export default QuestionSlide;
