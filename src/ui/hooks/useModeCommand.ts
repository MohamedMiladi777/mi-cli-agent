import { useState, useCallback } from "react";

interface UseModeCommandReturn {
  isModeDialogOpen: boolean;
  openModeDialog: () => void;
  closeModeDialog: () => void;
}

/**
 * This function is the state manager of the Model command
 * it takes void as @param and @returns useModelCommandReturn Object
 */
export const useModeCommand = (): UseModeCommandReturn => {
  const [isModeDialogOpen, setIsModeDialogOpen] = useState(false);

  const openModeDialog = useCallback(() => {
    setIsModeDialogOpen(true);
  }, []);

  const closeModeDialog = useCallback(() => {
    setIsModeDialogOpen(false);
  }, []);

  return {
    isModeDialogOpen,
    openModeDialog,
    closeModeDialog,
  };
};
