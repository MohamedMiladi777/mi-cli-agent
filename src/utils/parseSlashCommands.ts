/**
 * I will receive the input string from input
 * 1 - Create a enum class to store the command names
 * 2 - if the the command is : /model, route the logic to ModelDialog
 * 3 - create an interface with commandName and group (needed later)
 * 4 - use regex to parse the command
 *
 * if the regex remains constant, it improves performance
 *
 */

import { error, group } from "console";
import type { CommandName } from "../types.ts";
import { debugLog } from "./debugger.ts";

// a regex to match either model or mode
const matches = /^\/(\w+)(?:\s+(.*))?$/;

export interface ParserResult<T> {
  result: T;
  group?: string;
}

interface Parser<T> {
  run(input: string): ParserResult<T>;
}

/** commandParser implements run which takes user input as @param
 *  a match is checked againt the input
 * The comand name is then stoed in a result array
 * the function @returns an object with two properties : result & group
 */

export const commandParser: Parser<CommandName> = {
  run(input: string): ParserResult<CommandName> {
    const result = input.match(matches);

    if (!result) {
      throw new Error("Not a command");
    }

    const command = result[1] as CommandName;
    const args = result[2] || "";

    switch (command) {
      case "model":
        return {
          result: "model",
          group: args,
        };

      case "mode":
        return {
          result: "mode",
          group: args,
        };
      default:
        throw new Error(`Unkown Command: ${command}`);
    }
  },
};
