const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const run = async () => {
  const txt = await readFile("./data.txt", { encoding: "utf-8" });
  const lines = txt.split("\n");

  const data = lines
    .filter(l => l.trim().length)
    .map(l => {
      const [
        name,
        street,
        nr,
        postal,
        city,
        type,
        _,
        indicator,
        notIndicator,
        distancePercent
      ] = l.split("\t");
      return {
        name,
        street,
        nr,
        postal,
        city,
        type,
        fullAddress: `${street} ${nr}, ${postal} ${city}`,
        indicator: parseInt(indicator),
        notIndicator: parseInt(notIndicator),
        distancePercent: parseInt(distancePercent)
      };
    });
  await writeFile(
    "./data.json",

    JSON.stringify(data, null, 4),
    { encoding: "utf-8" }
  );
};

run();
