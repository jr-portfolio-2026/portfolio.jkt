import { createContext, useContext } from "react";

type IntroControl = { replay: () => void };

/** Lets any section (e.g. the footer) offer "Replay introduction" without owning intro state. */
export const IntroContext = createContext<IntroControl>({ replay: () => {} });
export const useIntroControl = () => useContext(IntroContext);
