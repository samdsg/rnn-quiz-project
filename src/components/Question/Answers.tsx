import React, { Fragment } from "react";
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
const { View } = Animated;
import AnswersBtn from "../../Utils/AnswersBtn";

interface AnswerProps {
  answers: any;
  onPress?: () => void;
  answerSelected: (answer: string, index: number) => void;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 44,
  },
  subtitle: {
    marginBottom: 12,
    textAlign: "center",
    fontSize: 24,
    color: "#0C0D34",
    fontFamily: "SFProDisplay-Medium",
    textTransform: "uppercase",
  },
  description: {
    color: "#0C0D34",
    textAlign: "center",
    marginBottom: 40,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "SFProDisplay-Regular",
  },
});

const Answers = ({ answerSelected, answers }: AnswerProps) => {
  return (
    <View style={{ ...styles.container }}>
      {answers.map((_: any, index: any) => (
        <Fragment key={index}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
            }}
          >
            <AnswersBtn
              answer={answers[index]}
              variant="primary"
              onPress={() => {
                answerSelected(answers[index], index);
              }}
            />
          </View>
        </Fragment>
      ))}
    </View>
  );
};

export default Answers;
