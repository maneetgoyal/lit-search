import { faker } from "@faker-js/faker";
import { rollups } from "d3-array";
import { matchSorter } from "match-sorter";
import { getWeek } from "date-fns";

// Make random data deterministic
faker.mersenne.seed(0);

export interface Publication {
  publicationDate: string;
  authors: string[];
  topic: string;
}

export interface Datum {
  category: string;
  value: number;
}

export function getDummyData(): Publication[] {
  const count = 1000;
  const publications: Publication[] = [];
  for (let i = 0; i < count; i += 1) {
    publications.push({
      publicationDate: faker.date.between("2020-01-01T00:00:00.000Z", "2030-01-01T00:00:00.000Z").toISOString(),
      authors: faker.helpers.arrayElements(
        ["Max", "Tom", "Lisa", "Daniel", "Kumar", "Sharma", "John", "Alice", "Ray", "Alex", "Dom", "Siva"],
        faker.datatype.number({ min: 1, max: 4 })
      ),
      topic: faker.helpers.arrayElement([
        "Oncology",
        "Cardiovascular Diseases",
        "Infectious Diseases",
        "Biomedical Neuroscience",
        "Stem Cells",
        "Therapeutics",
        "Immunity",
        "Cell Signalling",
        "Cellular Imaging",
      ]),
    });
  }
  return publications;
}

export function getBarChartData(data: Publication[], year?: string, month?: string): [string, number][] {
  let filteredData = data;
  let grouper = (val: Publication) => {
    return new Date(val.publicationDate).getFullYear().toString();
  };
  if (year !== undefined) {
    filteredData = data.filter((ele) => {
      return new Date(ele.publicationDate).getFullYear().toString() === year;
    });
    grouper = (val: Publication) => {
      return new Date(val.publicationDate).getMonth().toString();
    };
    if (month !== undefined) {
      filteredData = filteredData.filter((ele) => {
        return new Date(ele.publicationDate).getMonth().toString() === month;
      });
      grouper = (val: Publication) => {
        return getWeek(new Date(val.publicationDate)).toString();
      };
    }
  }
  const aggregatedByTime = rollups(
    filteredData,
    (vals) => {
      return vals.length;
    },
    grouper
  );
  return aggregatedByTime;
}

export function getPieChartData(data: Publication[], filter?: string): [string, number][] {
  const filteredData = matchSorter(data, filter ?? "", { keys: ["topic"] });
  const authors = filteredData.flatMap((ele) => {
    return ele.authors;
  });
  const aggregatedByAuthor = rollups(
    authors,
    (vals) => {
      return vals.length;
    },
    (val) => val
  );
  // Sort author by publication count
  aggregatedByAuthor.sort(([, a], [, b]) => {
    return a - b > 0 ? -1 : 1;
  });
  // getting top 10 authors only
  return aggregatedByAuthor.slice(0, 10);
}
