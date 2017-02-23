const faker = require ('faker');
const _ = require ('underscore');

/**
 * Number of Fixtures to generate
 */
exports.offers = generateFixtures (100);

/**
 *
 * @param n
 * @returns {Array}
 */
function generateFixtures (n) {
    let fixtures = [];

    _.times (n, () => {
        const fixture = {
            first_name: faker.name.firstName (),
            last_name: faker.name.lastName
        };
        fixtures.push (fixture);
    });

    return fixtures;
}

