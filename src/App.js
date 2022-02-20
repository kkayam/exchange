import React from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';


import { styleReset } from 'react95';
// pick a theme of your choice
import cherry from "react95/dist/themes/cherry";
// original Windows95 font (optionally)
import ms_sans_serif from "react95/dist/fonts/ms_sans_serif.woff2";
import ms_sans_serif_bold from "react95/dist/fonts/ms_sans_serif_bold.woff2";
import {SwapWindow} from './components/window';

// const themes = [
// "aiee","cherry","honey","matrix","peggysPastels","seawater","tokyoDark","water","ash","coldGray","hotChocolate","millenium","plum","shelbiTeal","toner","white",
// "azureOrange","counterStrike","hotdogStand","modernDark","polarized","slate","tooSexy","windows1","bee","darkTeal","index","molecule","powerShell","cherry","travel","wmii","
// blackAndWhite","denim","lilac","ninjaTurtles","rainyDay","solarizedLight","vaporTeal","
// blue","eggplant","lilacRoseDark","olive","raspberry","spruce","vermillion","
// brick","fxDev","maple","original","redWine","stormClouds","violetDark","
// candy","highContrast","marine","pamelaAnderson","rose","theSixtiesUSA","vistaesqueMidnight"]


const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif}') format('woff2');
    font-weight: 400;
    font-style: normal
  }
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif_bold}') format('woff2');
    font-weight: bold;
    font-style: normal
  }
  body {
    font-family: 'ms_sans_serif';
  }
  ${styleReset}
`;

const App = () => (
  <div>
    <GlobalStyles />
    <ThemeProvider theme={cherry}>
    <div
    style={{
        position: 'absolute', left: '50%', top: '30%',
        transform: 'translate(-50%, -50%)'
    }}
    >
      <SwapWindow/>
      </div>
    </ThemeProvider>
  </div>
);

export default App;