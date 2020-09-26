import React, { ReactElement } from "react";
import Constants from "expo-constants";
import { SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";

/* Utils */
import theme, { Box, Text } from "../theme";

interface QuestionContainerProps {
  children: ReactElement;
}

const QuestionContainer = ({ children }: QuestionContainerProps) => {
  return (
    <SafeAreaView style={{ paddingTop: Constants.statusBarHeight, flex: 1 }}>
      {children}
      <StatusBar style="light" backgroundColor={theme.colors.primary} />
    </SafeAreaView>
  );
};

export default QuestionContainer;
