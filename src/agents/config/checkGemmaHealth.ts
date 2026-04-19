export const checkGemmaHealth = async (): Promise<String> => {
  try {
    const response = await fetch("http://localhost:1234/health", {
      method: "GET",
      signal: AbortSignal.timeout(2000),
    });

    return response.statusText;
  } catch (error) {
    console.error("error starting up Gemma daemon", error);
    return "false";
  }
};
