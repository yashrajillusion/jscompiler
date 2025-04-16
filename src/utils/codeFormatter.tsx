import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";

type FormatOptions = {
  parser?: "babel" | "html" | "css";
  tabWidth?: number;
  printWidth?: number;
  useTabs?: boolean;
  semi?: boolean;
  singleQuote?: boolean;
  jsxSingleQuote?: boolean;
  trailingComma?: "none" | "es5" | "all";
  bracketSpacing?: boolean;
  jsxBracketSameLine?: boolean;
  arrowParens?: "avoid" | "always";
};

export const formatCode = (code: string, options: FormatOptions = {}) => {
  try {
    const {
      parser = "babel",
      tabWidth = 2,
      printWidth = 80,
      useTabs = false,
      semi = true,
      singleQuote = true,
      jsxSingleQuote = false,
      trailingComma = "es5",
      bracketSpacing = true,
      jsxBracketSameLine = false,
      arrowParens = "avoid",
    } = options;

    const plugins = [parserBabel];

    const formattedCode = prettier.format(code, {
      parser,
      plugins,
      tabWidth,
      printWidth,
      useTabs,
      semi,
      singleQuote,
      jsxSingleQuote,
      trailingComma,
      bracketSpacing,
      jsxBracketSameLine,
      arrowParens,
    });

    return formattedCode;
  } catch (error) {
    console.error("Error formatting code:", error);
    return code; // Return original code if formatting fails
  }
};

export const formatJsx = (code: string) => {
  return formatCode(code, {
    parser: "babel",
    printWidth: 80,
  });
};
