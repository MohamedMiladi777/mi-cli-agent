#!/usr/bin/env node
import React from "react";
import { render } from "ink";
import { App } from "./ui/index.tsx";

// This is an ASCII escape code sequences 

//  \u001B is the escpae code suquence

// [?1049h enables alternative buffer

// 2J erase entire screen

// move cursor to position (0,0)

// 25l: make cursor invisible

// Good TUIs often hide the shell cursor while the app controls the screen.

process.stdout.write("\x1b[?1049h\x1b[2J\x1b[H\x1b[?25l");
render(React.createElement(App), { alternateScreen: true });
