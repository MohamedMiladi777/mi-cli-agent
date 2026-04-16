// import type React from "react";
// import { Box, Text } from "ink";
// import { useCallback, useMemo } from "react";
// import type { CommandName, ModelName } from "../../types";

// interface ModelDialogProps {
//   onClose: () => void;
//   onSelect: (model: ModelName) => void
// }

// const manualOptions = useMemo(() => {
//   const options = [
//     {
//       value: "gpt-mini-5",
//       title: "gpt mini 5",
//     },
//     {
//       value: "gemma-4-26b-a4b",
//       title: "gemma 4 26b a4b",
//     }
//   ];
// }, []);


// const handleSelect = useCallback((model:ModelName) => {
//     onSelect(model);
//     onClose()

// }, [onSelect, onClose])
