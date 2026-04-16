import { useState, useCallback } from "react";
import { debugLog } from "../../utils/debugger.ts";

interface UseModelCommandReturn {
  isModelDialogOpen: boolean;
  openModelDialog: () => void;
  closeModelDialog: () => void;
}

/**
 * This function is the state manager of the Model command
 * it takes void as @param and @returns useModelCommandReturn Object
 */
export const useModelCommand = (): UseModelCommandReturn => {
  const [isModelDialogOpen, setIsModelDialogOpen] = useState(false);

  const openModelDialog = useCallback(() => {
    debugLog(`[MODEL COMMAND] openModelDialog called`);
    setIsModelDialogOpen(true);
  }, []);

  const closeModelDialog = useCallback(() => {
    debugLog(`[MODEL COMMAND] closeModelDialog called`);
    setIsModelDialogOpen(false);
  }, []);

  return {
    isModelDialogOpen,
    openModelDialog,
    closeModelDialog,
  };
};
