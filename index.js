const Crypto = require("crypto");

const maleFirstName = require("./maleFirstName.json");
const maleSurname = require("./maleSurname.json");
const femaleFirstName = require("./femaleFirstName.json");
const femaleSurname = require("./femaleSurname.json");
const genderArr = require("./genderArr.json");
const workloadArr = require("./workloadArr.json");

let gender;
//funkce pro generování náhodného indexu pole
const getRandomIndex = (arr) => {
  return Math.floor(Math.random() * arr.length);
};
//funkce pro generování pohlaví
function randomGender() {
  gender = genderArr[getRandomIndex(genderArr)];
  return gender;
}
//funkce pro generování náhodného jména
function randomName() {
  let firstName =
    gender === "male"
      ? maleFirstName[getRandomIndex(maleFirstName)]
      : femaleFirstName[getRandomIndex(femaleFirstName)];
  return firstName;
}
//funkce pro generování náhodného příjmení
function randomSurname() {
  let surname =
    gender === "male"
      ? maleSurname[getRandomIndex(maleSurname)]
      : femaleSurname[getRandomIndex(femaleSurname)];
  return surname;
}
//funkce pro generování náhodného workload
function randomWorkload() {
  let workload = workloadArr[getRandomIndex(workloadArr)];
  return workload;
}

const dtoIn = {
  count: 50,
  age: {
    min: 19,
    max: 35,
  },
};

//fce pomocí cyklu while náhodně naplňí pole dtoOut objekty s informacemi o daném zaměstnanci
const main = (count) => {
  //funkce pro generování náhodného datumu
  function randomDate(start, end) {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  }
  // nastavení rozmezí let
  const newYearMin = new Date().getFullYear() - dtoIn.age.min;
  const newYearMax = new Date().getFullYear() - dtoIn.age.max;

  //Ošetření vstupních dat
  if (isNaN(count)) {
    return "Špatně zadaná vstupní data";
  } else if (count > 100) {
    return "Maximální počet zaměstnanců je 100";
  }

  let employees = [];

  for (let i = 0; i < count; i++) {
    employees.push({
      id: Crypto.randomBytes(8).toString("hex"),
      gender: randomGender(),
      name: randomName(),
      surname: randomSurname(),
      birthday: randomDate(
        new Date(newYearMax, 0, 1),
        new Date(newYearMin, 0, 1)
      ),
      workload: randomWorkload(),
    });
  }
  // 4 ukol

  const sortedByWorkload = [...employees].sort(
    (a, b) => a.workload - b.workload
  );

  const getYearArr = [];
  const medianWorkloadArr = [];
  const averageWomenWorkloadArr = [];

  const dtoOutWorkload = {
    workload10: 0,
    workload20: 0,
    workload30: 0,
    workload40: 0,
    averageAge: 0,
    averageWomenWorkload: 0,
  };

  sortedByWorkload.forEach((value) => {
    value.workload === 10 ? (dtoOutWorkload.workload10 += 1) : "";
    value.workload === 20 ? (dtoOutWorkload.workload20 += 1) : "";
    value.workload === 30 ? (dtoOutWorkload.workload30 += 1) : "";
    value.workload === 40 ? (dtoOutWorkload.workload40 += 1) : "";

    medianWorkloadArr.push(value.workload);

    getYearArr.push(value.birthday.getFullYear());
    //dostanu průměrný věk
    dtoOutWorkload.averageAge +=
      new Date().getFullYear() - value.birthday.getFullYear();

    value.gender === "female"
      ? averageWomenWorkloadArr.push(value.workload)
      : null;

    value.gender === "female"
      ? (dtoOutWorkload.averageWomenWorkload += value.workload)
      : null;
  });

  // median workload
  const getMeadianWorkload = (arr) => {
    const even = (arr[arr.length / 2] + arr[arr.length / 2 + 1]) / 2;
    const odd = arr[(arr.length + 1) / 2];
    const result = arr.length % 2 === 0 ? even : odd;
    return result;
  };
  //min a max věk
  getYearArr.sort((a, b) => b - a);

  const minAge = new Date().getFullYear() - getYearArr[0];
  const maxAge = new Date().getFullYear() - getYearArr[getYearArr.length - 1];
  //median age
  const getMedianAge = (arr) => {
    const date = new Date().getFullYear();
    const even = Math.ceil(
      date - (arr[arr.length / 2] + arr[arr.length / 2 + 1]) / 2
    );
    const odd = date - arr[(arr.length + 1) / 2];
    const result = arr.length % 2 === 0 ? even : odd;
    return result;
  };

  const dtoOut = {
    total: count,
    workload10: dtoOutWorkload.workload10,
    workload20: dtoOutWorkload.workload20,
    workload30: dtoOutWorkload.workload30,
    workload40: dtoOutWorkload.workload40,
    averageAge: Math.round(dtoOutWorkload.averageAge / sortedByWorkload.length),
    minAge: minAge,
    maxAge: maxAge,
    medianAge: getMedianAge(getYearArr),
    medianWorkload: getMeadianWorkload(medianWorkloadArr),
    averageWomenWorkload: Math.round(
      dtoOutWorkload.averageWomenWorkload / averageWomenWorkloadArr.length
    ),
    sortedByWorkload,
  };

  return dtoOut;
};

console.log(main(dtoIn.count));
