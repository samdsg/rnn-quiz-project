export { default as Button } from "./Button";

export function unicodeToChar(text: any) {
  var reserved = "";
  var code = text.match(/&#(d+);/g);

  if (code === null) {
    return text;
  }

  for (var i = 0; i < code.length; i++) {
    reserved += String.fromCharCode(code[i].replace(/[&#;]/g, ""));
  }

  return reserved;
}
