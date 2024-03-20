export default async function parseAndExtract(habitStrings) {
    
  const habits = await JSON.parse(await habitStrings);
  console.log("habit parsed", habits);
  const habitKeys = ['Day',...Object.keys(habits)];
  const habitValues = ["",...Object.values(habits)];
  const habitsResult = {
      habitKeys,
      habitValues,
    };
    console.log("habits result", habitsResult);

return habitsResult;
}
