export const checkGemmaHealth = async (): Promise<Boolean> => {
  try {
    const response = await fetch("http://localhost:1234/health", {
      method: "GET",
      signal: AbortSignal.timeout(2000),
    });

    return response.ok;
  } catch (error) {
    console.log("error starting up Gemma daemon", error);
    return false;
  }
};
