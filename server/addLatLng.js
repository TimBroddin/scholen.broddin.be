//

const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const request = require("request-promise");

const key = "GOOGLE_API_KEY";

const run = async () => {
  const txt = await readFile("./data.json", { encoding: "utf-8" });
  const data = JSON.parse(txt);
  const promiseMap = data.map(async school => {
    let txt, result;
    try {
      txt = await request(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          school.fullAddress
        )}&key=${key}`
      );
      result = JSON.parse(txt);
    } catch (e) {
      console.log(school);
      process.exit();
    }
    let lat, lng;
    if (
      result &&
      result.results &&
      result.results[0] &&
      result.results[0].geometry &&
      result.results[0].geometry.location
    ) {
      lat = result.results[0].geometry.location.lat;
      lng = result.results[0].geometry.location.lng;
    } else {
      if (!school.lat) console.log(school);
    }

    return {
      ...school,
      lat,
      lng
    };
  });

  const newData = await Promise.all(promiseMap);

  console.log(`No lat: ${newData.filter(s => !s.lat).length}`);

  await writeFile(
    "./data.json",

    JSON.stringify(newData, null, 4),
    { encoding: "utf-8" }
  );
};

run();
