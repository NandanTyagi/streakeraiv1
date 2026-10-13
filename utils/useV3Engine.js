const useV3Engine = () => {
  return process.env.NEXT_PUBLIC_USE_V3_ENGINE === "true";
};

export default useV3Engine;
