import { faker } from "@faker-js/faker";

// Make random data deterministic
faker.mersenne.seed(0);

interface Publication {
  publicationDate: string;
  authors: string[];
  topic: string;
}

export function getDummyData(): Publication[] {
  const count = 1000;
  const publications: Publication[] = [];
  for (let i = 0; i < count; i += 1) {
    publications.push({
      publicationDate: faker.date.between("2020-01-01T00:00:00.000Z", "2030-01-01T00:00:00.000Z").toISOString(),
      authors: faker.helpers.uniqueArray(faker.name.firstName, faker.datatype.number({ min: 1, max: 4 })),
      topic: faker.color.human(),
    });
  }
  return publications;
}
